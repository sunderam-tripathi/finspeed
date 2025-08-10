terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }

  backend "gcs" {
    bucket = "finspeed-terraform-state-staging"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = local.project_id
  region  = local.region
}

# Local values
locals {
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  
  # Database configuration
  database_name = "finspeed_${local.environment}"
  database_user = "finspeed_user"
  
  # Service names
  api_service_name      = "finspeed-api-${local.environment}"
  frontend_service_name = "finspeed-frontend-${local.environment}"
  
  common_labels = {
    environment = local.environment
    project     = "finspeed"
    managed_by  = "terraform"
  }
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "sqladmin.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "sts.googleapis.com"
  ])

  project = local.project_id
  service = each.value

  disable_dependent_services = false
  disable_on_destroy        = false
}