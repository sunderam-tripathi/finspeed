# This service identity is created by Google when the IAP API is enabled.
# We are just gaining a reference to it.
resource "google_project_service_identity" "iap_service_account" {
  provider = google-beta
  project  = local.project_id
  service  = "iap.googleapis.com"
}

resource "google_iap_brand" "project_brand" {
  support_email     = var.iap_support_email
  application_title = "Finspeed ${var.environment}"

}

resource "google_iap_client" "project_client" {
  display_name = "Finspeed ${var.environment} Client"
  brand        = google_iap_brand.project_brand.name
}

# Grant the IAP service account permission to invoke the API service
resource "google_cloud_run_v2_service_iam_member" "api_iap_invoker" {
  count    = var.enable_iap_api ? 1 : 0
  project  = google_cloud_run_v2_service.api.project
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_project_service_identity.iap_service_account.email}"
}

# Grant the IAP service account permission to invoke the frontend service
resource "google_cloud_run_v2_service_iam_member" "frontend_iap_invoker" {
  count    = var.enable_iap_frontend ? 1 : 0
  project  = google_cloud_run_v2_service.frontend.project
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_project_service_identity.iap_service_account.email}"
}

# Grant the allowed user access to the API backend via IAP
resource "google_iap_web_backend_service_iam_member" "api_iap_user" {
  count                = var.enable_iap_api ? 1 : 0
  project              = google_compute_backend_service.api_backend.project
  web_backend_service  = google_compute_backend_service.api_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = var.iap_allowed_user
}

# Grant the allowed user access to the frontend backend via IAP
resource "google_iap_web_backend_service_iam_member" "frontend_iap_user" {
  count                = var.enable_iap_frontend ? 1 : 0
  project              = google_compute_backend_service.frontend_backend.project
  web_backend_service  = google_compute_backend_service.frontend_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = var.iap_allowed_user
}

# Grant the CI/CD service account access to the API backend via IAP
resource "google_iap_web_backend_service_iam_member" "api_iap_cicd" {
  count                = var.enable_iap_api ? 1 : 0
  project              = google_compute_backend_service.api_backend.project
  web_backend_service  = google_compute_backend_service.api_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = "serviceAccount:${google_service_account.github_actions.email}"
}

# Grant the CI/CD service account access to the frontend backend via IAP
resource "google_iap_web_backend_service_iam_member" "frontend_iap_cicd" {
  count                = var.enable_iap_frontend ? 1 : 0
  project              = google_compute_backend_service.frontend_backend.project
  web_backend_service  = google_compute_backend_service.frontend_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = "serviceAccount:${google_service_account.github_actions.email}"
}

# Allow unauthenticated (public) access to Cloud Run services when enabled
resource "google_cloud_run_v2_service_iam_member" "api_public_invoker" {
  count    = var.allow_public_api ? 1 : 0
  project  = google_cloud_run_v2_service.api.project
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public_invoker" {
  count    = var.allow_public_frontend ? 1 : 0
  project  = google_cloud_run_v2_service.frontend.project
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
