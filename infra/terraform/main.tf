# Finspeed GCP Infrastructure
# This Terraform configuration sets up the complete GCP infrastructure for the Finspeed e-commerce platform

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  backend "gcs" {
    bucket = "finspeed-terraform-state"
    prefix = "terraform/state"
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Local values for common configurations
locals {
  environment = var.environment
  project_id  = var.project_id
  region      = var.region
  zone        = var.zone

  # Common labels for all resources
  common_labels = {
    project     = "finspeed"
    environment = local.environment
    managed_by  = "terraform"
    team        = "engineering"
  }

  # Database configuration
  database_name = "finspeed_${local.environment}"
  database_user = "finspeed"

  # Application configuration
  api_service_name      = "finspeed-api-${local.environment}"
  frontend_service_name = "finspeed-frontend-${local.environment}"
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "run.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "cloudbuild.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com"
  ])

  service = each.value
  project = local.project_id

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Create a VPC network for private resources
resource "google_compute_network" "vpc_network" {
  name                    = "finspeed-vpc-${local.environment}"
  auto_create_subnetworks = false
  mtu                     = 1460

  depends_on = [google_project_service.required_apis]
}

# Create a subnet for the VPC
resource "google_compute_subnetwork" "subnet" {
  name          = "finspeed-subnet-${local.environment}"
  ip_cidr_range = "10.0.0.0/24"
  region        = local.region
  network       = google_compute_network.vpc_network.id

  # Enable private Google access for resources without external IPs
  private_ip_google_access = true

  # Secondary IP ranges for services
  secondary_ip_range {
    range_name    = "services-range"
    ip_cidr_range = "10.1.0.0/24"
  }

  secondary_ip_range {
    range_name    = "pods-range"
    ip_cidr_range = "10.2.0.0/24"
  }
}

# Reserve a global IP address for the load balancer
resource "google_compute_global_address" "private_ip_address" {
  name          = "finspeed-private-ip-${local.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
}

# Create a private connection for Cloud SQL
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]

  depends_on = [google_project_service.required_apis]
}

# Firewall rule to allow health checks
resource "google_compute_firewall" "allow_health_checks" {
  name    = "finspeed-allow-health-checks-${local.environment}"
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "tcp"
    ports    = ["8080", "3000"]
  }

  # Google Cloud health check IP ranges
  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]
  target_tags   = ["finspeed-${local.environment}"]
}