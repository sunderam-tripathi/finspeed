locals {
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  project_name = "finspeed"

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
  # (removed) image URI locals; images are passed via variables (var.api_image, var.frontend_image, var.migrate_image)
}
