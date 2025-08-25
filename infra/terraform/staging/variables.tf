# Basic configuration
variable "project_id" {}
variable "environment" {}
variable "region" {}
variable "zone" {}

# Database configuration
variable "database_tier" {}
variable "database_version" {}
variable "database_backup_enabled" {}
variable "database_backup_start_time" {}
variable "database_maintenance_window_day" {}
variable "database_maintenance_window_hour" {}

# Cloud Run configuration
variable "api_cpu" {}
variable "api_memory" {}
variable "api_min_instances" {}
variable "api_max_instances" {}
variable "frontend_cpu" {}
variable "frontend_memory" {}
variable "frontend_min_instances" {}
variable "frontend_max_instances" {}

# Domain configuration
variable "domain_name" {}
variable "api_domain_name" {}
variable "enable_ssl" {}

# Monitoring configuration
variable "notification_email" {}
variable "iap_support_email" {}
variable "iap_allowed_user" {}
variable "enable_uptime_checks" {}

# Cost optimization
variable "enable_deletion_protection" {}

# Additional labels
variable "labels" { type = map(string) }

# Static hosting toggle
variable "use_static_hosting" {
  description = "Enable static hosting resources (Cloud Storage + CDN) for this environment"
  type        = bool
  default     = false
}

# Image variables (passed in by CI)
variable "api_image" {
  description = "The full Docker image URL for the API service."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}
variable "frontend_image" {
  description = "The full Docker image URL for the frontend service."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}
variable "migrate_image" {
  description = "The full Docker image URL for the database migration job."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}

# GitHub Actions / CI/CD configuration
variable "github_repository" {}
variable "project_owner_email" {}

# Public access toggles
variable "allow_public_api" {}

# Public read toggle for product images bucket
variable "allow_public_product_images_read" {
  description = "Allow unauthenticated public read (allUsers) on the product images bucket."
  type        = bool
  default     = false
}
