# Cloud Function for public API gateway
resource "google_storage_bucket" "function_source" {
  count                       = var.allow_public_api ? 1 : 0
  name                        = "finspeed-functions-${local.environment}"
  location                    = "US"
  project                     = local.project_id
  force_destroy               = !var.enable_deletion_protection
  uniform_bucket_level_access = true

  labels = local.common_labels
}

# ZIP file for the Cloud Function source
data "archive_file" "api_gateway_zip" {
  type        = "zip"
  output_path = "${path.module}/api-gateway.zip"
  source_dir  = "${path.module}/../../api-gateway"
}

# Upload the function source to Cloud Storage
resource "google_storage_bucket_object" "api_gateway_source" {
  count  = var.allow_public_api ? 1 : 0
  name   = "api-gateway-${data.archive_file.api_gateway_zip.output_md5}.zip"
  bucket = google_storage_bucket.function_source[0].name
  source = data.archive_file.api_gateway_zip.output_path
}

# Cloud Function for public API access
resource "google_cloudfunctions2_function" "api_gateway" {
  count       = var.allow_public_api ? 1 : 0
  name        = "finspeed-api-gateway-${local.environment}"
  location    = local.region
  project     = local.project_id
  description = "Public API gateway that proxies to private Cloud Run API"

  build_config {
    runtime     = "nodejs20"
    entry_point = "apiGateway"
    source {
      storage_source {
        bucket = var.allow_public_api ? google_storage_bucket.function_source[0].name : null
        object = var.allow_public_api ? google_storage_bucket_object.api_gateway_source[0].name : null
      }
    }
  }

  service_config {
    max_instance_count               = 10
    min_instance_count               = 0
    available_memory                 = "256M"
    timeout_seconds                  = 60
    max_instance_request_concurrency = 1
    available_cpu                    = "0.167"

    environment_variables = {
      API_BASE_URL = google_cloud_run_v2_service.api.uri
      ENVIRONMENT  = local.environment
    }

    ingress_settings               = "ALLOW_ALL"
    all_traffic_on_latest_revision = true

    service_account_email = google_service_account.cloud_run_sa.email
  }

  labels = local.common_labels
}

# IAM binding to allow public access to the Cloud Function
resource "google_cloudfunctions2_function_iam_member" "public_access" {
  count          = var.allow_public_api ? 1 : 0
  project        = google_cloudfunctions2_function.api_gateway[0].project
  location       = google_cloudfunctions2_function.api_gateway[0].location
  cloud_function = google_cloudfunctions2_function.api_gateway[0].name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Backend service for the API gateway function
resource "google_compute_region_network_endpoint_group" "api_gateway_neg" {
  count                 = var.allow_public_api ? 1 : 0
  name                  = "finspeed-api-gateway-neg-${local.environment}"
  network_endpoint_type = "SERVERLESS"
  project               = var.project_id
  region                = local.region
  cloud_function {
    function = google_cloudfunctions2_function.api_gateway[0].name
  }
}

resource "google_compute_backend_service" "api_gateway_backend" {
  count                 = var.allow_public_api ? 1 : 0
  name                  = "finspeed-api-gateway-backend-${local.environment}"
  project               = var.project_id
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = false

  backend {
    group = google_compute_region_network_endpoint_group.api_gateway_neg[0].id
  }
}

# Grant Cloud Build service account permissions for function builds
resource "google_project_iam_member" "cloudbuild_sa_permissions" {
  for_each = var.allow_public_api ? toset([
    "roles/cloudfunctions.developer",
    "roles/storage.admin",
    "roles/artifactregistry.writer"
  ]) : toset([])
  
  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

# Get current project info for Cloud Build service account
data "google_project" "current" {
  project_id = local.project_id
}
