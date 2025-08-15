# Artifact Registry Repositories
# Enable the Artifact Registry API
resource "google_project_service" "artifact_registry_api" {
  project = local.project_id
  service = "artifactregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Create Artifact Registry repositories for each service
resource "google_artifact_registry_repository" "api" {
  project       = local.project_id
  location      = local.region
  repository_id = "${local.project_name}-api-${local.environment}"
  format        = "DOCKER"
  description   = "Docker repository for the API service"

  depends_on = [
    google_project_service.artifact_registry_api
  ]
}

resource "google_artifact_registry_repository" "frontend" {
  project       = local.project_id
  location      = local.region
  repository_id = "${local.project_name}-frontend-${local.environment}"
  format        = "DOCKER"
  description   = "Docker repository for the Frontend service"

  depends_on = [
    google_project_service.artifact_registry_api
  ]
}

resource "google_artifact_registry_repository" "migrate" {
  project       = local.project_id
  location      = local.region
  repository_id = "${local.project_name}-migrate-${local.environment}"
  format        = "DOCKER"
  description   = "Docker repository for the Migrate job"

  depends_on = [
    google_project_service.artifact_registry_api
  ]
}

# Grant write access to the GitHub Actions service account for each repository
resource "google_artifact_registry_repository_iam_member" "api_repo_writer" {
  project    = google_artifact_registry_repository.api.project
  location   = google_artifact_registry_repository.api.location
  repository = google_artifact_registry_repository.api.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_artifact_registry_repository_iam_member" "frontend_repo_writer" {
  project    = google_artifact_registry_repository.frontend.project
  location   = google_artifact_registry_repository.frontend.location
  repository = google_artifact_registry_repository.frontend.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_artifact_registry_repository_iam_member" "migrate_repo_writer" {
  project    = google_artifact_registry_repository.migrate.project
  location   = google_artifact_registry_repository.migrate.location
  repository = google_artifact_registry_repository.migrate.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_actions.email}"
}

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
  deletion_protection = var.enable_deletion_protection
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  
  labels = local.common_labels

  template {
    labels = local.common_labels
    
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = var.api_min_instances
      max_instance_count = var.api_max_instances
    }

    containers {
      image = var.api_image

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
  deletion_protection = var.enable_deletion_protection
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  
  labels = local.common_labels

  template {
    labels = local.common_labels
    
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = var.frontend_min_instances
      max_instance_count = var.frontend_max_instances
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }

    containers {
      image = var.frontend_image

      ports {
        container_port = 8080
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
        name  = "API_URL"
        value = google_cloud_run_v2_service.api.uri
      }

      # Health check configuration
      startup_probe {
        http_get {
          path = "/"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/"
          port = 8080
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

# Cloud Run Job for Database Migrations
# Allow public access to the API service via the load balancer
# Allow public access to the API service via the load balancer


resource "google_cloud_run_v2_job" "migrate" {
  name     = "finspeed-migrate-${local.environment}"
  location = local.region
  labels   = local.common_labels
  deletion_protection = false

  template {
    template {
      service_account = google_service_account.cloud_run_sa.email

      timeout    = "600s" # 10 minutes

      containers {
        image = var.migrate_image
        command = ["./main"]
        args    = ["migrate", "up"]

        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.database_url.secret_id
              version = "latest"
            }
          }
        }

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }

      vpc_access {
        connector = google_vpc_access_connector.connector.id
        egress    = "PRIVATE_RANGES_ONLY"
      }
    }
  }

  depends_on = [
    google_project_service.required_apis,
    google_vpc_access_connector.connector,
    google_secret_manager_secret_version.database_url # Ensure secret is created before job
  ]
}
#       }
#     }
#   }
#
#   depends_on = [
#     google_project_service.required_apis,
#     google_secret_manager_secret_version.database_url
#   ]
# }



# Custom domain mapping (optional)
resource "google_cloud_run_domain_mapping" "api_domain" {
  count = var.domain_name != "" && local.region != "asia-south2" ? 1 : 0
  
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
  count = var.domain_name != "" && local.region != "asia-south2" ? 1 : 0
  
  location = google_cloud_run_v2_service.frontend.location
  name     = var.domain_name

  metadata {
    namespace = local.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}
