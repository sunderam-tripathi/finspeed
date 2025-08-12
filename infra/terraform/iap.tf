/*
data "google_project" "project" {}

resource "google_project_service" "iap" {
  service = "iap.googleapis.com"
  project = var.project_id

  disable_dependent_services = false
  disable_on_destroy        = false
}

resource "google_iap_brand" "project_brand" {
  support_email     = var.iap_support_email
  application_title = "Finspeed ${var.environment}"
  project           = google_project_service.iap.project
}

resource "google_iap_client" "project_client" {
  display_name = "Finspeed ${var.environment} Client"
  brand        = google_iap_brand.project_brand.name
}

# Grant the IAP service account permission to invoke the API service
resource "google_cloud_run_v2_service_iam_member" "api_iap_invoker" {
  project  = google_cloud_run_v2_service.api.project
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-iap.iam.gserviceaccount.com"
}

# Grant the IAP service account permission to invoke the frontend service
resource "google_cloud_run_v2_service_iam_member" "frontend_iap_invoker" {
  project  = google_cloud_run_v2_service.frontend.project
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-iap.iam.gserviceaccount.com"
}

# Grant the allowed user access to the API backend via IAP
resource "google_iap_web_backend_service_iam_member" "api_iap_user" {
  project              = google_compute_backend_service.api_backend.project
  web_backend_service  = google_compute_backend_service.api_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = var.iap_allowed_user
}

# Grant the allowed user access to the frontend backend via IAP
resource "google_iap_web_backend_service_iam_member" "frontend_iap_user" {
  project              = google_compute_backend_service.frontend_backend.project
  web_backend_service  = google_compute_backend_service.frontend_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = var.iap_allowed_user
}

# Grant the CI/CD service account access to the API backend via IAP
resource "google_iap_web_backend_service_iam_member" "api_iap_cicd" {
  project              = google_compute_backend_service.api_backend.project
  web_backend_service  = google_compute_backend_service.api_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = "serviceAccount:${google_service_account.github_actions.email}"
}

# Grant the CI/CD service account access to the frontend backend via IAP
resource "google_iap_web_backend_service_iam_member" "frontend_iap_cicd" {
  project              = google_compute_backend_service.frontend_backend.project
  web_backend_service  = google_compute_backend_service.frontend_backend.name
  role                 = "roles/iap.httpsResourceAccessor"
  member               = "serviceAccount:${google_service_account.github_actions.email}"
}
*/
