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

# Cloud Function source upload - no longer needed for Cloud Run
# resource "google_storage_bucket_object" "api_gateway_source" {
#   count  = var.allow_public_api ? 1 : 0
#   name   = "api-gateway-${data.archive_file.api_gateway_zip.output_md5}.zip"
#   bucket = google_storage_bucket.function_source[0].name
#   source = data.archive_file.api_gateway_zip.output_path
# }

# Cloud Run service for API Gateway (replacing Cloud Function due to persistent IAM issues)
resource "google_cloud_run_v2_service" "api_gateway" {
  count    = var.allow_public_api ? 1 : 0
  name     = "finspeed-api-gateway-${local.environment}"
  location = local.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/${var.project_id}/api-gateway:latest"
      
      env {
        name  = "API_BASE_URL"
        value = "https://${google_cloud_run_v2_service.api.name}-${data.google_project.current[0].number}.a.run.app"
      }
      
      env {
        name  = "ENVIRONMENT"
        value = local.environment
      }
      
      env {
        name  = "NODE_ENV"
        value = "production"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      ports {
        container_port = 8080
      }
    }

    service_account = google_service_account.cloud_run_sa.email
    
    scaling {
      max_instance_count = 10
      min_instance_count = 0
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [
    google_project_service.required_apis,
    google_service_account.cloud_run_sa
  ]
}

# Grant the Compute Engine default service account permission to impersonate the Cloud Run service account
resource "google_service_account_iam_member" "build_sa_can_use_run_sa" {
  count              = var.allow_public_api ? 1 : 0
  service_account_id = google_service_account.cloud_run_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${data.google_project.current[0].number}-compute@developer.gserviceaccount.com"
}

   
# IAM binding to allow public access to the Cloud Run API Gateway
# Temporarily disabled due to organization policy restrictions
# Public access will be handled via load balancer instead
# resource "google_cloud_run_v2_service_iam_member" "api_gateway_public_access" {
#   count    = var.allow_public_api ? 1 : 0
#   project  = google_cloud_run_v2_service.api_gateway[0].project
#   location = google_cloud_run_v2_service.api_gateway[0].location
#   name     = google_cloud_run_v2_service.api_gateway[0].name
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }



# Backend service for the API gateway Cloud Run service
resource "google_compute_region_network_endpoint_group" "api_gateway_neg" {
  count                 = var.allow_public_api ? 1 : 0
  name                  = "finspeed-api-gateway-neg-${local.environment}"
  network_endpoint_type = "SERVERLESS"
  project               = var.project_id
  region                = local.region
  cloud_run {
    service = google_cloud_run_v2_service.api_gateway[0].name
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

# Grant Compute Engine default service account permissions for function builds
resource "google_project_iam_member" "cloudbuild_sa_permissions" {
  for_each = var.allow_public_api ? toset([
    "roles/cloudfunctions.developer",
    "roles/storage.admin",
    "roles/artifactregistry.writer",
    "roles/cloudbuild.builds.builder",
    "roles/source.reader",
    "roles/logging.logWriter",
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/storage.objectViewer"
  ]) : toset([])
  
  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.current[0].number}-compute@developer.gserviceaccount.com"
}
