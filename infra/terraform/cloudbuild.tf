# Cloud Build service account IAM bindings for Cloud Functions Gen2 builds
# Provides the roles referenced by the GitHub Actions workflow targeted applies

# Fetch the current project to compute the Cloud Build SA email (PROJECT_NUMBER@cloudbuild.gserviceaccount.com)
data "google_project" "current_project" {
  project_id = local.project_id
}

# Grant required roles to the Cloud Build service account
resource "google_project_iam_member" "cloudbuild_sa_permissions" {
  for_each = toset([
    "roles/cloudfunctions.developer",
    "roles/storage.admin",
    "roles/artifactregistry.writer",
    "roles/cloudbuild.builds.builder",
    "roles/source.reader",
    "roles/logging.logWriter",
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/storage.objectViewer",
  ])

  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.current_project.number}@cloudbuild.gserviceaccount.com"
}
