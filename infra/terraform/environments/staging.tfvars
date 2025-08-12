# Staging Environment Configuration for Finspeed

# Basic configuration
project_id  = "finspeed-staging"  # Updated with your actual GCP project ID
environment = "staging"
region      = "us-central1"
zone        = "us-central1-a"

# Database configuration (cost-optimized for staging)
database_tier                      = "db-f1-micro"
database_version                   = "POSTGRES_15"
database_backup_enabled            = true
database_backup_start_time         = "03:00"
database_maintenance_window_day    = 7  # Sunday
database_maintenance_window_hour   = 4  # 4 AM

# Cloud Run configuration (minimal resources for staging)
api_cpu          = "1"
api_memory       = "512Mi"
api_min_instances = 0
api_max_instances = 3

frontend_cpu          = "1"
frontend_memory       = "512Mi"
frontend_min_instances = 0
frontend_max_instances = 2

# Domain configuration (optional)
domain_name = "finspeed.online"  # Set to your staging domain if you have one
api_domain_name = "api.finspeed.online"
enable_ssl  = true

# Monitoring configuration
notification_email     = "sunderamtripathi96@gmail.com"  # Updated with your email for alerts
iap_support_email = "care@finspeed.online"
iap_allowed_user  = "user:care@finspeed.online"
enable_uptime_checks   = true

# Cost optimization
enable_deletion_protection = false  # Allow easy cleanup in staging

# Additional labels
labels = {
  cost_center = "engineering"
  owner       = "finspeed-team"
  purpose     = "staging"
}

# GitHub Actions / CI/CD configuration
github_repository = "sunderam-tripathi/finspeed"  # Replace with your actual GitHub repository
project_owner_email = "care@finspeed.online" # Replace with your GCP login email
