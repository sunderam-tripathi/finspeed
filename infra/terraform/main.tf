terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.30.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }

  # Backend configuration for remote state storage
  backend "gcs" {
    bucket = "finspeed-terraform-state-staging"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = local.project_id
  region  = local.region
}

# Create GCS bucket for Terraform state
resource "google_storage_bucket" "terraform_state" {
  name     = "finspeed-terraform-state-${local.environment}"
  location = "IN"  # Match existing bucket location (India multi-region)
  project  = local.project_id

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  # Enable uniform bucket-level access for simplified IAM
  uniform_bucket_level_access = true

  # Set appropriate storage class
  storage_class = "STANDARD"

  # Match existing bucket configuration to avoid destroy/recreate
  custom_placement_config {
    data_locations = ["ASIA-SOUTH1", "ASIA-SOUTH2"]
  }

  # Enable hierarchical namespace (matches existing bucket)
  hierarchical_namespace {
    enabled = true
  }

  # Soft delete policy (matches existing bucket)
  soft_delete_policy {
    retention_duration_seconds = 604800  # 7 days
  }

  labels = local.common_labels
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
    "sts.googleapis.com",
    "storage.googleapis.com"
  ])

  project = local.project_id
  service = each.value

  disable_dependent_services = false
  disable_on_destroy        = false
}