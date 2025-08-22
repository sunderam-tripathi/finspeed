# Workload Identity Federation for GitHub Actions
# This enables keyless authentication from GitHub Actions to GCP

# Enable IAM API (required for Workload Identity)
resource "google_project_service" "iam_api" {
  service = "iamcredentials.googleapis.com"
  project = local.project_id

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "sts_api" {
  service = "sts.googleapis.com"
  project = local.project_id

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Create the Workload Identity Pool for GitHub Actions
resource "google_iam_workload_identity_pool" "github_pool" {
  project                   = local.project_id
  workload_identity_pool_id = "finspeed-pool-v2"
  display_name              = "Finspeed Pool v2"
  description               = "Workload Identity Pool for GitHub Actions"
}

# Reference existing Workload Identity Pool (hardcoded to avoid permission issues)
locals {
  workload_identity_pool_name = google_iam_workload_identity_pool.github_pool.name
  # Attribute condition varies by environment:
  # - production: only allow main branch and tags
  # - staging: allow develop, PR merge refs, and tags
  wif_attribute_condition = var.environment == "production" ? "assertion.repository == '${var.github_repository}' && (assertion.ref == 'refs/heads/main' || assertion.ref_type == 'tag')" : "assertion.repository == '${var.github_repository}' && (assertion.ref == 'refs/heads/develop' || startswith(assertion.ref, 'refs/pull/') || assertion.ref_type == 'tag')"
}

# Create Workload Identity Provider for GitHub
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Provider"
  description                        = "OIDC identity pool provider for GitHub Actions"
  project                            = local.project_id

  # Configure the provider for GitHub OIDC
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  # Attribute mapping from GitHub OIDC token to Google Cloud attributes
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  # Condition to restrict access to specific repository and branches (temporarily allowing feature branches for testing)
  attribute_condition = local.wif_attribute_condition
}

# Create service account for GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-${local.environment}"
  display_name = "GitHub Actions Service Account (${local.environment})"
  description  = "Service account for GitHub Actions CI/CD pipeline"
  project      = local.project_id
}

# Allow GitHub Actions to impersonate the service account
resource "google_service_account_iam_member" "github_actions_workload_identity" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${local.workload_identity_pool_name}/attribute.repository/${var.github_repository}"
}

# Allow GitHub Actions (and optionally the project owner) to generate access tokens for the service account
resource "google_service_account_iam_binding" "github_actions_token_creator" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.serviceAccountTokenCreator"

  members = concat(
    [
      "principalSet://iam.googleapis.com/${local.workload_identity_pool_name}/attribute.repository/${var.github_repository}"
    ],
    var.project_owner_email != "" ? ["user:${var.project_owner_email}"] : [],
  )
}

# Grant necessary permissions to the service account
resource "google_project_iam_member" "github_actions_permissions" {
  for_each = toset([
    "roles/run.admin",            # Deploy Cloud Run services
    "roles/cloudsql.admin",       # Manage Cloud SQL
    "roles/secretmanager.admin",  # Manage secrets
    "roles/monitoring.admin",     # Manage monitoring
    "roles/compute.networkAdmin", # Manage VPC and networking
    "roles/iam.serviceAccountUser",
    "roles/cloudsql.client",
    "roles/iam.serviceAccountTokenCreator", # Create access tokens for impersonation
    "roles/storage.admin",                  # Access Cloud Storage (for Terraform state)
    "roles/artifactregistry.admin",         # Push/pull container images
    "roles/cloudbuild.builds.builder",      # Build containers
    "roles/iam.serviceAccountAdmin",
    "roles/resourcemanager.projectIamAdmin", # Modify project IAM policy (required to add/remove project IAM members)
    "roles/iap.admin",                       # Manage IAP settings
    "roles/compute.securityAdmin",           # Manage SSL certificates and security policies
    "roles/editor"                           # Broad permissions to ensure IAP brand creation and state access
  ])

  project = local.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Output important values for GitHub Actions configuration
output "workload_identity_provider" {
  description = "The full identifier of the Workload Identity Provider"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "github_actions_service_account" {
  description = "Email of the service account for GitHub Actions"
  value       = google_service_account.github_actions.email
}

output "workload_identity_pool_id" {
  description = "The Workload Identity Pool ID"
  value       = "finspeed-pool-v2"
}
