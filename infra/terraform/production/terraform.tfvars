# Production Environment Configuration for Finspeed

# Basic configuration
project_id  = "finspeed-prod-st" # Updated with your actual GCP project ID
environment = "production"
region      = "asia-south2"
zone        = "asia-south2-a"

# Database configuration (production-ready with high availability)
database_tier                    = "db-custom-2-8192" # Using custom machine type compatible with asia-south2
database_version                 = "POSTGRES_15"
database_backup_enabled          = true
database_backup_start_time       = "03:00"
database_maintenance_window_day  = 7 # Sunday
database_maintenance_window_hour = 4 # 4 AM

# Cloud Run configuration (production-ready with scaling)
api_cpu           = "2"
api_memory        = "1Gi"
api_min_instances = 1 # Always keep at least 1 instance warm
api_max_instances = 10

frontend_cpu           = "1"
frontend_memory        = "512Mi"
frontend_min_instances = 1 # Always keep at least 1 instance warm
frontend_max_instances = 5

# Domain configuration
domain_name     = "finspeed.online"
api_domain_name = "api.finspeed.online"
enable_ssl      = true

# CORS allowed origins for API
cors_allowed_origins = [
  "https://finspeed.online",
  "https://admin.finspeed.online",
]

# Monitoring configuration
notification_email   = "welcome@sunderamtripathi.com" # Updated with your alerts email
enable_uptime_checks = true

# Security and reliability
enable_deletion_protection = true # Protect critical resources

# Additional labels
labels = {
  cost_center = "production"
  owner       = "finspeed-team"
  purpose     = "production"
  criticality = "high"
}

# GitHub Actions / CI/CD configuration
github_repository = "sunderam-tripathi/finspeed" # Replace with your actual GitHub repository

# IAP (Identity-Aware Proxy) configuration
iap_support_email   = "welcome@sunderamtripathi.com"
iap_allowed_user    = "user:welcome@sunderamtripathi.com"
project_owner_email = "welcome@sunderamtripathi.com"

# Public access and IAP settings for production
enable_iap_api        = true
enable_iap_frontend   = true
use_static_hosting    = true
allow_public_api      = false
allow_public_frontend = false

