# Variables for Finspeed GCP Infrastructure

variable "project_id" {
  description = "The GCP project ID"
  type        = string
  validation {
    condition     = length(var.project_id) > 0
    error_message = "Project ID must not be empty."
  }
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
  default     = "staging"
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone for zonal resources"
  type        = string
  default     = "us-central1-a"
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "github_repository" {
  description = "sunderam-tripathi/finspeed"
  type        = string
  validation {
    condition     = can(regex("^[a-zA-Z0-9-]+\\/[a-zA-Z0-9-.]+$", var.github_repository))
    error_message = "GitHub repository must be in the format 'owner/repo'."
  }
}

# Database variables
variable "database_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"
  validation {
    condition     = can(regex("^db-", var.database_tier))
    error_message = "Database tier must be a valid Cloud SQL tier, starting with 'db-'."
  }
}

variable "database_version" {
  description = "PostgreSQL version for Cloud SQL"
  type        = string
  default     = "POSTGRES_15"
}

variable "database_backup_enabled" {
  description = "Enable automated backups for Cloud SQL"
  type        = bool
  default     = true
}

variable "database_backup_start_time" {
  description = "Start time for automated backups (HH:MM format)"
  type        = string
  default     = "03:00"
}

variable "database_maintenance_window_day" {
  description = "Day of week for maintenance window (1-7, Monday is 1)"
  type        = number
  default     = 7
  validation {
    condition     = var.database_maintenance_window_day >= 1 && var.database_maintenance_window_day <= 7
    error_message = "Maintenance window day must be between 1 and 7."
  }
}

variable "database_maintenance_window_hour" {
  description = "Hour for maintenance window (0-23)"
  type        = number
  default     = 4
  validation {
    condition     = var.database_maintenance_window_hour >= 0 && var.database_maintenance_window_hour <= 23
    error_message = "Maintenance window hour must be between 0 and 23."
  }
}

# Cloud Run variables
variable "api_cpu" {
  description = "CPU allocation for API service"
  type        = string
  default     = "1"
}

variable "api_memory" {
  description = "Memory allocation for API service"
  type        = string
  default     = "512Mi"
}

variable "api_min_instances" {
  description = "Minimum number of API instances"
  type        = number
  default     = 0
}

variable "api_max_instances" {
  description = "Maximum number of API instances"
  type        = number
  default     = 10
}

variable "frontend_cpu" {
  description = "CPU allocation for frontend service"
  type        = string
  default     = "1"
}

variable "frontend_memory" {
  description = "Memory allocation for frontend service"
  type        = string
  default     = "512Mi"
}

variable "frontend_min_instances" {
  description = "Minimum number of frontend instances"
  type        = number
  default     = 0
}

variable "frontend_max_instances" {
  description = "Maximum number of frontend service instances"
  type        = number
  default     = 5
}

variable "api_domain_name" {
  description = "The custom domain name for the API service (e.g., api.finspeed.online)"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Custom domain name for the application"
  type        = string
  default     = ""
}

variable "enable_ssl" {
  description = "Enable SSL certificate for custom domain"
  type        = bool
  default     = true
}

variable "artifact_registry_repository" {
  description = "The name of the Artifact Registry repository for container images."
  type        = string
  default     = "finspeed"
}

variable "api_image_name" {
  description = "The name of the API container image."
  type        = string
  default     = "api"
}

variable "frontend_image_name" {
  description = "The name of the frontend container image."
  type        = string
  default     = "frontend"
}

variable "migrate_image_name" {
  description = "The name of the database migration container image."
  type        = string
  default     = "migrate"
}

# Monitoring variables
variable "notification_email" {
  description = "Email address for monitoring notifications"
  type        = string
  default     = ""
}

variable "enable_uptime_checks" {
  description = "Enable uptime monitoring checks"
  type        = bool
  default     = true
}

variable "api_image" {
  description = "The full Docker image URL for the API service."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}

variable "frontend_image" {
  description = "The full Docker image URL for the frontend service."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}

variable "migrate_image" {
  description = "The full Docker image URL for the database migration job."
  type        = string
  default     = "us-docker.pkg.dev/google-samples/containers/gke/hello-app:1.0"
}

# Cost optimization variables
variable "enable_deletion_protection" {
  description = "Enable deletion protection for critical resources"
  type        = bool
  default     = true
}

variable "labels" {
  description = "Additional labels to apply to resources"
  type        = map(string)
  default     = {}
}

# Static hosting toggle
variable "use_static_hosting" {
  description = "Enable static hosting resources (Cloud Storage bucket, backends, routing) when true"
  type        = bool
  default     = false
}

# IAP variables
variable "iap_support_email" {
  description = "The support email address for the OAuth consent screen."
  type        = string
  validation {
    condition     = can(regex("@", var.iap_support_email))
    error_message = "Must be a valid email address."
  }
}

variable "iap_allowed_user" {
  description = "The user to grant access to the IAP-secured application (e.g., user:email@example.com)."
  type        = string
}

variable "project_owner_email" {
  description = "The email address of the project owner, used for granting impersonation rights for local testing."
  type        = string
  default     = ""
}

# Feature flags to enable/disable IAP per backend
variable "enable_iap_api" {
  description = "Enable IAP protection for the API backend and corresponding IAM bindings."
  type        = bool
  default     = true
}

variable "enable_iap_frontend" {
  description = "Enable IAP protection for the Frontend backend and corresponding IAM bindings."
  type        = bool
  default     = true
}

# Public access flags for Cloud Run ingress and IAM
variable "allow_public_api" {
  description = "Allow unauthenticated public access to the API via Cloud Run (and load balancer)."
  type        = bool
  default     = false
}

variable "allow_public_frontend" {
  description = "Allow unauthenticated public access to the Frontend via Cloud Run (and load balancer)."
  type        = bool
  default     = false
}
