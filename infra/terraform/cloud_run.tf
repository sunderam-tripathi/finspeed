# Cloud Run Services Configuration

# Service account for Cloud Run services
resource "google_service_account" "cloud_run_sa" {
  account_id   = "finspeed-cloud-run-${local.environment}"
  display_name = "Finspeed Cloud Run Service Account (${local.environment})"
  description  = "Service account for Finspeed Cloud Run services in ${local.environment}"
}

# Grant necessary permissions to the service account
resource "google_project_iam_member" "cloud_run_sa_permissions" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/cloudtrace.agent"
  ])

  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# Cloud Run service for the API
resource "google_cloud_run_v2_service" "api" {
  name     = local.api_service_name
  location = local.region
  
  labels = local.common_labels

  template {
    labels = local.common_labels
    
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = var.api_min_instances
      max_instance_count = var.api_max_instances
    }

    containers {
      # This will be updated by CI/CD pipeline
      image = "gcr.io/${local.project_id}/finspeed-api-${local.environment}:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.api_cpu
          memory = var.api_memory
        }
        cpu_idle = true
      }

      # Environment variables
      env {
        name  = "ENVIRONMENT"
        value = local.environment
      }

      env {
        name  = "PORT"
        value = "8080"
      }

      env {
        name  = "LOG_LEVEL"
        value = var.environment == "production" ? "info" : "debug"
      }

      # Database URL from Secret Manager
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      # Health check configuration
      startup_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 30
        timeout_seconds       = 5
        period_seconds        = 30
        failure_threshold     = 3
      }
    }

    # VPC connector for private database access
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [
    google_project_service.required_apis,
    google_secret_manager_secret_version.database_url
  ]
}

# Cloud Run service for the Frontend
resource "google_cloud_run_v2_service" "frontend" {
  name     = local.frontend_service_name
  location = local.region
  
  labels = local.common_labels

  template {
    labels = local.common_labels
    
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = var.frontend_min_instances
      max_instance_count = var.frontend_max_instances
    }

    containers {
      # This will be updated by CI/CD pipeline
      image = "gcr.io/${local.project_id}/finspeed-frontend-${local.environment}:latest"

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = var.frontend_cpu
          memory = var.frontend_memory
        }
        cpu_idle = true
      }

      # Environment variables
      env {
        name  = "ENVIRONMENT"
        value = local.environment
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name  = "API_URL"
        value = google_cloud_run_v2_service.api.uri
      }

      # Health check configuration
      startup_probe {
        http_get {
          path = "/"
          port = 3000
        }
        initial_delay_seconds = 10
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/"
          port = 3000
        }
        initial_delay_seconds = 30
        timeout_seconds       = 5
        period_seconds        = 30
        failure_threshold     = 3
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [
    google_project_service.required_apis,
    google_cloud_run_v2_service.api
  ]
}

# VPC Connector for Cloud Run to access private resources
resource "google_vpc_access_connector" "connector" {
  name          = "finspeed-vpc-${local.environment}"
  region        = local.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.vpc_network.name
  
  min_instances = 2
  max_instances = var.environment == "production" ? 10 : 3

  depends_on = [google_project_service.required_apis]
}

# IAM policy to allow public access to Cloud Run services
resource "google_cloud_run_service_iam_member" "api_public_access" {
  location = google_cloud_run_v2_service.api.location
  service  = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "frontend_public_access" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Custom domain mapping (optional)
resource "google_cloud_run_domain_mapping" "api_domain" {
  count = var.domain_name != "" ? 1 : 0
  
  location = google_cloud_run_v2_service.api.location
  name     = "api.${var.domain_name}"

  metadata {
    namespace = local.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.api.name
  }
}

resource "google_cloud_run_domain_mapping" "frontend_domain" {
  count = var.domain_name != "" ? 1 : 0
  
  location = google_cloud_run_v2_service.frontend.location
  name     = var.domain_name

  metadata {
    namespace = local.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}
