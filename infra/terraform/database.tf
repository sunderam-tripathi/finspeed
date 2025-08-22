# Cloud SQL PostgreSQL Database Configuration

# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "postgres" {
  name             = "finspeed-postgres-${local.environment}"
  database_version = var.database_version
  region           = local.region

  deletion_protection = false

  settings {
    tier                  = var.database_tier
    availability_type     = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_type             = "PD_SSD"
    disk_size             = var.environment == "production" ? 100 : 20
    disk_autoresize       = true
    disk_autoresize_limit = var.environment == "production" ? 500 : 100

    # Backup configuration
    backup_configuration {
      enabled                        = var.database_backup_enabled
      start_time                     = var.database_backup_start_time
      point_in_time_recovery_enabled = var.environment == "production"
      backup_retention_settings {
        retained_backups = var.environment == "production" ? 30 : 7
        retention_unit   = "COUNT"
      }
      transaction_log_retention_days = var.environment == "production" ? 7 : 3
    }

    # Maintenance window
    maintenance_window {
      day          = var.database_maintenance_window_day
      hour         = var.database_maintenance_window_hour
      update_track = "stable"
    }

    # IP configuration for private networking
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = google_compute_network.vpc_network.id
      enable_private_path_for_google_cloud_services = true
      ssl_mode                                      = "ENCRYPTED_ONLY"
    }

    # Database flags for optimization (temporarily removed for troubleshooting)
    # database_flags {
    #   name  = "shared_preload_libraries"
    #   value = "pg_stat_statements"
    # }

    # database_flags {
    #   name  = "log_min_duration_statement"
    #   value = "1000"
    # }

    # Insights configuration for monitoring
    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
  }

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.required_apis
  ]
}

# Create the application database
resource "google_sql_database" "finspeed_database" {
  name     = local.database_name
  instance = google_sql_database_instance.postgres.name

  depends_on = [google_sql_database_instance.postgres]
}

# Create the application user
resource "google_sql_user" "finspeed_user" {
  name     = local.database_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.database_password.result

  depends_on = [google_sql_database_instance.postgres]
}

# Create a read replica for production
resource "google_sql_database_instance" "postgres_replica" {
  count = var.environment == "production" ? 1 : 0

  name                 = "finspeed-postgres-replica-${local.environment}"
  master_instance_name = google_sql_database_instance.postgres.name
  region               = local.region
  database_version     = var.database_version

  replica_configuration {
    failover_target = false
  }

  settings {
    tier                  = var.database_tier
    availability_type     = "ZONAL"
    disk_type             = "PD_SSD"
    disk_autoresize       = true
    disk_autoresize_limit = 500

    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = google_compute_network.vpc_network.id
      enable_private_path_for_google_cloud_services = true
      ssl_mode                                      = "ENCRYPTED_ONLY"
    }

    # Insights configuration for monitoring
    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
  }

  depends_on = [google_sql_database_instance.postgres]
}
