# Pass all variables from the .tfvars file to the module
# This is the standard way to work with environment-specific
# configurations in a directory-based isolation model.

# Triggering workflow for PR plan test

module "finspeed_infra" {
  source = "../"

  # Pass variables from terraform.tfvars to the module
  # Final validation of the PR workflow.
  project_id                       = var.project_id
  environment                      = var.environment
  region                           = var.region
  zone                             = var.zone
  github_repository                = var.github_repository
  database_tier                    = var.database_tier
  database_version                 = var.database_version
  database_backup_enabled          = var.database_backup_enabled
  database_backup_start_time       = var.database_backup_start_time
  database_maintenance_window_day  = var.database_maintenance_window_day
  database_maintenance_window_hour = var.database_maintenance_window_hour
  api_cpu                          = var.api_cpu
  api_memory                       = var.api_memory
  api_min_instances                = var.api_min_instances
  api_max_instances                = var.api_max_instances
  frontend_cpu                     = var.frontend_cpu
  frontend_memory                  = var.frontend_memory
  frontend_min_instances           = var.frontend_min_instances
  frontend_max_instances           = var.frontend_max_instances
  domain_name                      = var.domain_name
  api_domain_name                  = var.api_domain_name
  enable_ssl                       = var.enable_ssl
  notification_email               = var.notification_email
  enable_uptime_checks             = var.enable_uptime_checks
  enable_deletion_protection       = var.enable_deletion_protection
  labels                           = var.labels
  iap_support_email                = var.iap_support_email
  iap_allowed_user                 = var.iap_allowed_user
  project_owner_email              = var.project_owner_email
}
