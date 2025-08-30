# Staging Environment Configuration for Finspeed

# Basic configuration
project_id  = "finspeed-staging-st" # Updated with your actual GCP project ID
environment = "staging"
region      = "asia-south2"
zone        = "asia-south2-a"

# Database configuration (cost-optimized for staging)
database_tier                    = "db-f1-micro"
database_version                 = "POSTGRES_15"
database_backup_enabled          = true
database_backup_start_time       = "03:00"
database_maintenance_window_day  = 7 # Sunday
database_maintenance_window_hour = 4 # 4 AM

# Cloud Run configuration (minimal resources for staging)
api_cpu           = "1"
api_memory        = "512Mi"
api_min_instances = 0
api_max_instances = 3

frontend_cpu           = "1"
frontend_memory        = "512Mi"
frontend_min_instances = 0
frontend_max_instances = 2
frontend_image         = "asia-south2-docker.pkg.dev/finspeed-staging-st/finspeed-frontend-staging/finspeed-frontend-staging:lb-path-routing-fix-1"
admin_image            = "asia-south2-docker.pkg.dev/finspeed-staging-st/finspeed-admin-staging/finspeed-admin-staging:lb-path-routing-fix-1"
api_image              = "asia-south2-docker.pkg.dev/finspeed-staging-st/finspeed-api-staging/finspeed-api-staging:173554d2"
migrate_image          = "asia-south2-docker.pkg.dev/finspeed-staging-st/finspeed-migrate-staging/finspeed-migrate-staging:173554d2"

# Domain configuration (optional)
domain_name     = "staging.finspeed.online" # Set to your staging domain if you have one
api_domain_name = "api.staging.finspeed.online"
enable_ssl      = true

# Monitoring configuration
notification_email   = "welcome@sunderamtripathi.com" # Updated with your email for alerts
iap_support_email    = "welcome@sunderamtripathi.com"
iap_allowed_user     = "user:welcome@sunderamtripathi.com"
enable_uptime_checks = true

# Cost optimization
enable_deletion_protection = false # Allow easy cleanup in staging

# Additional labels
labels = {
  cost_center = "engineering"
  owner       = "finspeed-team"
  purpose     = "staging"
}

# GitHub Actions / CI/CD configuration
github_repository   = "sunderam-tripathi/finspeed"   # Replace with your actual GitHub repository
project_owner_email = "welcome@sunderamtripathi.com" # Replace with your GCP login email

# Static hosting configuration
use_static_hosting = false # Use Cloud Run for frontend in staging

# Enable public API Gateway in staging (Cloud Function + LB), while keeping Cloud Run API private behind IAP
allow_public_api = true

# Stage A: Enable IAP on API Gateway backend; do not bind LB service agent yet
enable_iap_api_gateway = true
bind_lb_sa_invoker     = false

# API Gateway upstream base URL (point to internal Cloud Run service to avoid IAP audience mismatch)
api_gateway_upstream_base_url = "https://finspeed-api-staging-487758456202.asia-south2.run.app"

# CORS allowed origins for API and API Gateway
cors_allowed_origins = [
  "https://staging.finspeed.online",
  "https://admin.staging.finspeed.online",
  "https://finspeed.online",
  "https://www.finspeed.online",
  "http://localhost:3000"
]
