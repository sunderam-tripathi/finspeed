# Manages the Artifact Registry repository for container images

resource "google_project_service" "artifact_registry_api" {
  project = local.project_id
  service = "artifactregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy        = false
}

resource "google_artifact_registry_repository" "main" {
  provider      = google
  project       = local.project_id
  location      = local.region
  repository_id = var.artifact_registry_repository
  description   = "Docker repository for Finspeed container images"
  format        = "DOCKER"

  labels = local.common_labels

  depends_on = [
    google_project_service.artifact_registry_api
  ]
}
