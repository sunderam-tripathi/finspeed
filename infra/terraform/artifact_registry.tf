# Manages the Artifact Registry repository for container images

resource "google_project_service" "artifact_registry_api" {
  project = local.project_id
  service = "artifactregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy        = false
}

resource "google_artifact_registry_repository" "main" {
  project       = local.project_id
  location      = local.region
  repository_id = var.artifact_registry_repository
  format        = "DOCKER"
  description   = "Docker repository for Finspeed container images"

  depends_on = [
    google_project_service.artifact_registry_api
  ]
}
