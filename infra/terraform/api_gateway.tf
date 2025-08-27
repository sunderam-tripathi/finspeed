# API Gateway Cloud Function (Gen2) + Serverless NEG + Backend Service (IAP)

# Upload function source (api-gateway.zip) to GCS
resource "google_storage_bucket" "api_gateway_source" {
  name                        = "finspeed-api-gw-src-${local.project_id}-${local.region}"
  project                     = local.project_id
  location                    = "US"
  uniform_bucket_level_access = true
  force_destroy               = !var.enable_deletion_protection

  labels = local.common_labels
}

resource "google_storage_bucket_object" "api_gateway_zip" {
  name         = "api-gateway-${filesha256("${path.module}/api-gateway.zip")}.zip"
  bucket       = google_storage_bucket.api_gateway_source.name
  source       = "${path.module}/api-gateway.zip"
  content_type = "application/zip"
}

# Cloud Functions 2nd gen (HTTP)
resource "google_cloudfunctions2_function" "api_gateway" {
  name        = "finspeed-api-gateway-${local.environment}"
  project     = local.project_id
  location    = local.region
  labels      = local.common_labels
  description = "Finspeed API Gateway proxy (Cloud Functions Gen2)"

  build_config {
    runtime     = "nodejs20"
    entry_point = "apiGateway"

    source {
      storage_source {
        bucket = google_storage_bucket.api_gateway_source.name
        object = google_storage_bucket_object.api_gateway_zip.name
      }
    }
  }

  service_config {
    available_memory      = "512M"
    timeout_seconds       = 60
    ingress_settings      = "ALLOW_INTERNAL_AND_GCLB"
    service_account_email = google_service_account.cloud_run_sa.email

    environment_variables = {
      API_BASE_URL         = var.api_gateway_upstream_base_url != "" ? var.api_gateway_upstream_base_url : google_cloud_run_v2_service.api.uri
      CORS_ALLOWED_ORIGINS = join(",", var.cors_allowed_origins)
      NODE_ENV             = var.environment
    }
  }

  depends_on = [
    google_project_service.required_apis
  ]
}

# Optional public invoker for function (when allow_public_api == true)
resource "google_cloudfunctions2_function_iam_member" "api_gateway_public_invoker" {
  count          = var.allow_public_api ? 1 : 0
  project        = local.project_id
  location       = local.region
  cloud_function = google_cloudfunctions2_function.api_gateway.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Serverless NEG targeting the Cloud Function
resource "google_compute_region_network_endpoint_group" "api_gateway_neg" {
  name                  = "finspeed-api-gateway-neg-${local.environment}"
  project               = local.project_id
  region                = local.region
  network_endpoint_type = "SERVERLESS"

  cloud_function {
    function = google_cloudfunctions2_function.api_gateway.name
  }

  depends_on = [google_cloudfunctions2_function.api_gateway]
}

# Backend Service for API Gateway (IAP enabled), created when public API is enabled
resource "google_compute_backend_service" "api_gateway_backend" {
  count    = var.allow_public_api ? 1 : 0
  provider = google-beta

  name                  = "finspeed-api-gateway-backend-${local.environment}"
  project               = local.project_id
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.api_gateway_neg.id
  }

  log_config {
    enable = true
  }

  iap {
    enabled              = true
    oauth2_client_id     = google_iap_client.project_client.client_id
    oauth2_client_secret = google_iap_client.project_client.secret
  }

  depends_on = [
    google_compute_region_network_endpoint_group.api_gateway_neg,
    google_iap_client.project_client
  ]
}
