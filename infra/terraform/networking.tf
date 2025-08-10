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
