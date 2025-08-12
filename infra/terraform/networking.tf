# VPC Network
resource "google_compute_network" "vpc_network" {
  name                    = "finspeed-vpc-${local.environment}"
  auto_create_subnetworks = false
  project                 = local.project_id

  depends_on = [google_project_service.required_apis]
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "finspeed-subnet-${local.environment}"
  ip_cidr_range = var.subnet_cidr
  region        = local.region
  network       = google_compute_network.vpc_network.id
  project       = local.project_id

  # Enable private Google access
  private_ip_google_access = true

  depends_on = [google_compute_network.vpc_network]
}

# Firewall rules
resource "google_compute_firewall" "allow_internal" {
  name    = "finspeed-allow-internal-${local.environment}"
  network = google_compute_network.vpc_network.name
  project = local.project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = [var.subnet_cidr]
  target_tags   = ["finspeed-internal"]

  depends_on = [google_compute_network.vpc_network]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "finspeed-allow-ssh-${local.environment}"
  network = google_compute_network.vpc_network.name
  project = local.project_id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["finspeed-ssh"]

  depends_on = [google_compute_network.vpc_network]
}

# Allow health checks from the Load Balancer
resource "google_compute_firewall" "allow_health_checks" {
  name    = "finspeed-allow-health-checks-${local.environment}"
  network = google_compute_network.vpc_network.name
  project = local.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "8080"]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]
  target_tags   = ["finspeed-web"]

  depends_on = [google_compute_network.vpc_network]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "finspeed-allow-http-https-${local.environment}"
  network = google_compute_network.vpc_network.name
  project = local.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "8080"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["finspeed-web"]

  depends_on = [google_compute_network.vpc_network]
}



# Private service connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "finspeed-private-ip-${local.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
  project       = local.project_id

  depends_on = [google_compute_network.vpc_network]
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]

  depends_on = [
    google_compute_global_address.private_ip_address,
    google_project_service.required_apis
  ]
}

# Global External HTTPS Load Balancer

# Static IP address for the load balancer
resource "google_compute_global_address" "lb_ip" {
  name    = "finspeed-lb-ip-${local.environment}"
  project = local.project_id
}

# Serverless NEG for the frontend Cloud Run service
resource "google_compute_region_network_endpoint_group" "frontend_neg" {
  name                  = "finspeed-frontend-neg-${local.environment}"
  network_endpoint_type = "SERVERLESS"
  project               = var.project_id
  region                = local.region
  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}

# Serverless NEG for the API Cloud Run service
resource "google_compute_region_network_endpoint_group" "api_neg" {
  name                  = "finspeed-api-neg-${local.environment}"
  network_endpoint_type = "SERVERLESS"
  project               = var.project_id
  region                = local.region
  cloud_run {
    service = google_cloud_run_v2_service.api.name
  }
}

# Backend service for the API
resource "google_compute_backend_service" "api_backend" {
  iap {
    enabled              = true
    oauth2_client_id     = google_iap_client.project_client.client_id
    oauth2_client_secret = google_iap_client.project_client.secret
  }
  name                  = "finspeed-api-backend-${local.environment}"
  project               = var.project_id
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = false # API content is not typically cached

  backend {
    group = google_compute_region_network_endpoint_group.api_neg.id
  }
}

# Backend service for the Frontend
resource "google_compute_backend_service" "frontend_backend" {
  iap {
    enabled              = true
    oauth2_client_id     = google_iap_client.project_client.client_id
    oauth2_client_secret = google_iap_client.project_client.secret
  }
  name                            = "finspeed-frontend-backend-${local.environment}"
  protocol                        = "HTTP"
  port_name                       = "http"
  timeout_sec                     = 30
  load_balancing_scheme           = "EXTERNAL_MANAGED"
  enable_cdn                      = false

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg.id
  }
}

# URL map to route requests to the backend service
resource "google_compute_url_map" "url_map" {
  name            = "finspeed-lb-url-map-${local.environment}"
  default_service = google_compute_backend_service.frontend_backend.id

  host_rule {
    hosts        = [var.api_domain_name]
    path_matcher = "api-matcher"
  }

  path_matcher {
    name            = "api-matcher"
    default_service = google_compute_backend_service.api_backend.id
  }
}

# Managed SSL certificate for the custom domain
resource "google_compute_managed_ssl_certificate" "ssl_certificate" {
  count = var.domain_name != "" && var.enable_ssl ? 1 : 0
  name  = "finspeed-ssl-cert-${local.environment}"
  managed {
    domains = [var.domain_name, "api.${var.domain_name}"]
  }
}

# HTTPS proxy for the load balancer
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "finspeed-https-proxy-${local.environment}"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = var.domain_name != "" && var.enable_ssl ? [google_compute_managed_ssl_certificate.ssl_certificate[0].id] : []
}

# Global forwarding rule to route traffic to the proxy
resource "google_compute_global_forwarding_rule" "forwarding_rule" {
  name                  = "finspeed-forwarding-rule-${local.environment}"
  target                = google_compute_target_https_proxy.https_proxy.id
  ip_address            = google_compute_global_address.lb_ip.address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

# Serverless VPC Access Connector
resource "google_vpc_access_connector" "connector" {
  name          = "finspeed-vpc-connector-${local.environment}"
  project       = local.project_id
  region        = local.region
  network       = google_compute_network.vpc_network.name
  ip_cidr_range = "10.8.0.0/28"

  depends_on = [google_project_service.vpcaccess_api]
}

resource "google_project_service" "vpcaccess_api" {
  service                    = "vpcaccess.googleapis.com"
  project                    = local.project_id
  disable_dependent_services = false
  disable_on_destroy         = false
}
