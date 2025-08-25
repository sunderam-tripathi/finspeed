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
    enabled              = var.enable_iap_api
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

# Legacy public API backend (kept temporarily to avoid in-use deletion during switchover)
resource "google_compute_backend_service" "api_backend_public" {
  name                  = "finspeed-api-backend-public-${local.environment}"
  project               = var.project_id
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = false

  backend {
    group = google_compute_region_network_endpoint_group.api_neg.id
  }
}

# Backend service for the Frontend
resource "google_compute_backend_service" "frontend_backend" {
  iap {
    enabled              = var.enable_iap_frontend
    oauth2_client_id     = google_iap_client.project_client.client_id
    oauth2_client_secret = google_iap_client.project_client.secret
  }
  name                  = "finspeed-frontend-backend-${local.environment}"
  protocol              = "HTTP"
  port_name             = "http"
  timeout_sec           = 30
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = false

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg.id
  }
}

# Backend service for the Admin (legacy)
resource "google_compute_backend_service" "frontend_backend_admin" {
  iap {
    enabled              = var.enable_iap_frontend
    oauth2_client_id     = google_iap_client.project_client.client_id
    oauth2_client_secret = google_iap_client.project_client.secret
  }
  name                  = "finspeed-frontend-admin-backend-${local.environment}"
  protocol              = "HTTP"
  port_name             = "http"
  timeout_sec           = 30
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = false

  backend {
    group = google_compute_region_network_endpoint_group.frontend_neg.id
  }
}

# URL map used when static hosting is disabled
resource "google_compute_url_map" "url_map" {
  # Keep legacy URL map even when static hosting is enabled to ensure smooth switchover
  count           = var.domain_name != "" ? 1 : 0
  name            = "finspeed-lb-url-map-${local.environment}"
  default_service = google_compute_backend_service.frontend_backend.id

  host_rule {
    hosts        = [var.api_domain_name]
    path_matcher = "api-matcher"
  }

  # Admin subdomain routes to Frontend (legacy compatibility)
  host_rule {
    hosts        = ["admin.${var.domain_name}"]
    path_matcher = "admin-matcher"
  }

  # Route main domain traffic to frontend by default, but /api/* to API backend
  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "frontend-matcher"
  }

  # Host-based routing for API subdomain
  path_matcher {
    name            = "api-matcher"
    default_service = google_compute_backend_service.api_backend.id
  }

  # Admin subdomain matcher
  path_matcher {
    name            = "admin-matcher"
    default_service = var.environment == "production" ? google_compute_backend_service.frontend_backend_admin.id : google_compute_backend_service.frontend_backend.id
  }

  # Path-based routing on primary domain: send /api/* to API backend
  path_matcher {
    name            = "frontend-matcher"
    default_service = google_compute_backend_service.frontend_backend.id

    path_rule {
      paths   = ["/api/*", "/api/v1/*"]
      service = google_compute_backend_service.api_backend.id
    }
  }

  lifecycle {
    prevent_destroy       = true
    create_before_destroy = true
  }
}

resource "random_id" "cert_suffix" {
  byte_length = 4
}

# Managed SSL certificate for the custom domain
resource "google_compute_managed_ssl_certificate" "ssl_certificate" {
  # Use the same managed SSL certificate regardless of static hosting setting
  count = var.domain_name != "" && var.enable_ssl ? 1 : 0
  name  = "finspeed-ssl-cert-${local.environment}-${random_id.cert_suffix.hex}"
  managed {
    domains = [
      var.domain_name,
      "api.${var.domain_name}",
      "admin.${var.domain_name}"
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Main HTTPS proxy points to whichever URL map exists (static or legacy)
resource "google_compute_target_https_proxy" "https_proxy" {
  count = var.domain_name != "" ? 1 : 0
  lifecycle {
    create_before_destroy = true
  }
  name    = "finspeed-https-proxy-${var.use_static_hosting ? "static" : "dynamic"}-${local.environment}"
  url_map = var.use_static_hosting && var.domain_name != "" ? google_compute_url_map.url_map_with_static[0].id : google_compute_url_map.url_map[0].id

  # Reuse unified managed SSL certificate
  ssl_certificates = var.enable_ssl ? [google_compute_managed_ssl_certificate.ssl_certificate[0].id] : []

  # Explicit dependencies to ensure proper creation order
  depends_on = [
    google_compute_url_map.url_map,
    google_compute_url_map.url_map_with_static,
    google_compute_managed_ssl_certificate.ssl_certificate
  ]
}

# Global forwarding rule targeting the active HTTPS proxy
resource "google_compute_global_forwarding_rule" "forwarding_rule" {
  count                 = var.domain_name != "" ? 1 : 0
  name                  = "finspeed-forwarding-rule-${local.environment}"
  target                = google_compute_target_https_proxy.https_proxy[0].id
  ip_address            = google_compute_global_address.lb_ip.address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

# Serverless VPC Access Connector
resource "google_vpc_access_connector" "connector" {
  name           = "finspeed-vpc-${local.environment}"
  project        = local.project_id
  region         = local.region
  network        = google_compute_network.vpc_network.name
  ip_cidr_range  = "10.8.0.0/28"
  min_throughput = 200
  max_throughput = 300

  depends_on = [google_project_service.required_apis]
}
