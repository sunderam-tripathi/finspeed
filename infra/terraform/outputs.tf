/*
# Terraform Outputs for Finspeed Infrastructure

# Network outputs
output "vpc_network_name" {
  description = "Name of the VPC network"
  value       = google_compute_network.vpc_network.name
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = google_compute_subnetwork.subnet.name
}

output "vpc_connector_name" {
  description = "Name of the VPC connector"
  value       = google_vpc_access_connector.connector.name
}

# Database outputs
output "database_instance_name" {
  description = "Name of the Cloud SQL instance"
  value       = google_sql_database_instance.postgres.name
}

output "database_instance_ip" {
  description = "Private IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.postgres.private_ip_address
  sensitive   = true
}

output "database_connection_name" {
  description = "Connection name for the Cloud SQL instance"
  value       = google_sql_database_instance.postgres.connection_name
}

output "database_name" {
  description = "Name of the application database"
  value       = google_sql_database.finspeed_database.name
}

output "database_user" {
  description = "Database user name"
  value       = google_sql_user.finspeed_user.name
}

# Secret Manager outputs
output "database_password_secret_id" {
  description = "Secret Manager secret ID for database password"
  value       = google_secret_manager_secret.database_password.secret_id
}

output "database_url_secret_id" {
  description = "Secret Manager secret ID for database URL"
  value       = google_secret_manager_secret.database_url.secret_id
}

# Cloud Run outputs
output "api_service_name" {
  description = "Name of the API Cloud Run service"
  value       = google_cloud_run_v2_service.api.name
}

output "api_service_url" {
  description = "URL of the API Cloud Run service"
  value       = google_cloud_run_v2_service.api.uri
}

output "frontend_service_name" {
  description = "Name of the Frontend Cloud Run service"
  value       = google_cloud_run_v2_service.frontend.name
}

output "frontend_service_url" {
  description = "URL of the Frontend Cloud Run service"
  value       = google_cloud_run_v2_service.frontend.uri
}

# Service Account outputs
output "cloud_run_service_account_email" {
  description = "Email of the Cloud Run service account"
  value       = google_service_account.cloud_run_sa.email
}

# Monitoring outputs
output "monitoring_dashboard_url" {
  description = "URL to the monitoring dashboard"
  value       = "https://console.cloud.google.com/monitoring/dashboards/custom/${google_monitoring_dashboard.finspeed_dashboard.id}?project=${local.project_id}"
}

output "notification_channel_id" {
  description = "ID of the email notification channel"
  value       = var.notification_email != "" ? google_monitoring_notification_channel.email[0].id : null
}

# Domain outputs (if configured)
output "api_domain_name" {
  description = "Custom domain name for API (if configured)"
  value       = var.domain_name != "" ? "api.${var.domain_name}" : null
}

output "frontend_domain_name" {
  description = "Custom domain name for frontend (if configured)"
  value       = var.domain_name != "" ? var.domain_name : null
}

# Environment information
output "environment" {
  description = "Environment name"
  value       = local.environment
}

output "project_id" {
  description = "GCP Project ID"
  value       = local.project_id
}

output "region" {
  description = "GCP Region"
  value       = local.region
}

# Deployment information for CI/CD
output "deployment_info" {
  description = "Key deployment information for CI/CD pipelines"
  value = {
    project_id                = local.project_id
    region                   = local.region
    api_service_name         = google_cloud_run_v2_service.api.name
    frontend_service_name    = google_cloud_run_v2_service.frontend.name
    api_url                  = google_cloud_run_v2_service.api.uri
    frontend_url             = google_cloud_run_v2_service.frontend.uri
    database_url_secret_id   = google_secret_manager_secret.database_url.secret_id
    service_account_email    = google_service_account.cloud_run_sa.email
    environment              = local.environment
  }
}

output "load_balancer_ip" {
  description = "The IP address of the external load balancer."
  value       = google_compute_global_address.lb_ip.address
}

output "iap_client_id" {
  description = "The client ID of the IAP OAuth client."
  value       = google_iap_client.project_client.client_id
}
*/
