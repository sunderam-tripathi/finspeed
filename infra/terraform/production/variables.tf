variable "project_id" {}
variable "environment" {}
variable "region" {}
variable "zone" {}
variable "github_repository" {}
variable "database_tier" {}
variable "database_version" {}
variable "database_backup_enabled" {}
variable "database_backup_start_time" {}
variable "database_maintenance_window_day" {}
variable "database_maintenance_window_hour" {}
variable "api_cpu" {}
variable "api_memory" {}
variable "api_min_instances" {}
variable "api_max_instances" {}
variable "frontend_cpu" {}
variable "frontend_memory" {}
variable "frontend_min_instances" {}
variable "frontend_max_instances" {}
variable "domain_name" {}
variable "api_domain_name" {}
variable "enable_ssl" {}
variable "notification_email" {}
variable "enable_uptime_checks" {}
variable "enable_deletion_protection" {}
variable "labels" {}
variable "iap_support_email" {}
variable "iap_allowed_user" {}
variable "project_owner_email" {}

# Flags to control IAP and public access in production
variable "enable_iap_api" {}
variable "enable_iap_frontend" {}
variable "allow_public_api" {}
variable "allow_public_frontend" {}
variable "use_static_hosting" {}

// Image variables (injected by CI during deploy). Defaults keep infra apply working.
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
