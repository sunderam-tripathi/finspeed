locals {
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment

  # Database configuration
  database_name = "finspeed_${local.environment}"
  database_user = "finspeed_user"

  # Cloud Run service names
  api_service_name      = "finspeed-api-${local.environment}"
  frontend_service_name = "finspeed-frontend-${local.environment}"

  # Common tags for all resources
  common_labels = {
    managed-by  = "terraform"
    environment = local.environment
    project     = "finspeed"
  }

  # Image URIs
  api_image_uri      = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.api_image_name}:latest"
  frontend_image_uri = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.frontend_image_name}:latest"
  migrate_image_uri  = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.migrate_image_name}:latest"
}
