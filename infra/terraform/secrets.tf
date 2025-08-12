/*
# Secret Management Configuration

# Generate a random password for the database
resource "random_password" "database_password" {
  length  = 32
  special = true
}

# Store the database password in Secret Manager
resource "google_secret_manager_secret" "database_password" {
  secret_id = "finspeed-database-password-${local.environment}"

  labels = local.common_labels

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "database_password" {
  secret      = google_secret_manager_secret.database_password.id
  secret_data = random_password.database_password.result
}

# Store the database connection string in Secret Manager
resource "google_secret_manager_secret" "database_url" {
  secret_id = "finspeed-database-url-${local.environment}"

  labels = local.common_labels

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
    secret_data = "postgres://${google_sql_user.finspeed_user.name}:${urlencode(random_password.database_password.result)}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.finspeed_database.name}?sslmode=require"


}
*/
