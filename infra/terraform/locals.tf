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
    managed-by   = "terraform"
    environment  = local.environment
    project      = "finspeed"
    validated-by = "cascade-test"
  }

  # Image URIs - using current working commit SHA
  api_image_uri      = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.api_image_name}:23282b3d5ecab94bf867664c5167c78879ef832f"
  frontend_image_uri = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.frontend_image_name}:23282b3d5ecab94bf867664c5167c78879ef832f"
  migrate_image_uri  = "${local.region}-docker.pkg.dev/${local.project_id}/${var.artifact_registry_repository}/${var.migrate_image_name}:23282b3d5ecab94bf867664c5167c78879ef832f"
}
