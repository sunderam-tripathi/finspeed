# Production Environment Configuration for Finspeed

# Basic configuration
project_id  = "finspeed-prod"  # Updated with your actual GCP project ID
environment = "production"
region      = "us-central1"
zone        = "us-central1-a"

# Database configuration (production-ready with high availability)
database_tier                      = "db-n1-standard-2"
database_version                   = "POSTGRES_15"
database_backup_enabled            = true
database_backup_start_time         = "03:00"
database_maintenance_window_day    = 7  # Sunday
database_maintenance_window_hour   = 4  # 4 AM

# Cloud Run configuration (production-ready with scaling)
api_cpu          = "2"
api_memory       = "1Gi"
api_min_instances = 1  # Always keep at least 1 instance warm
api_max_instances = 10

frontend_cpu          = "1"
frontend_memory       = "512Mi"
frontend_min_instances = 1  # Always keep at least 1 instance warm
frontend_max_instances = 5

# Domain configuration
domain_name = "finspeed.online"  # Updated with your actual domain
enable_ssl  = true

# Monitoring configuration
notification_email     = "care@finspeed.online"  # Updated with your alerts email
enable_uptime_checks   = true

# Security and reliability
enable_deletion_protection = true  # Protect critical resources

# Additional labels
labels = {
  cost_center = "production"
  owner       = "finspeed-team"
  purpose     = "production"
  criticality = "high"
}

# GitHub Actions / CI/CD configuration
github_repository = "sunderam-tripathi/finspeed"  # Replace with your actual GitHub repository
