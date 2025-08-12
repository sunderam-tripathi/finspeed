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
}

# Create Workload Identity Provider for GitHub
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = "finspeed-pool-v2"
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
  attribute_condition = "assertion.repository == '${var.github_repository}' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop' || assertion.ref_type == 'tag' || assertion.ref == 'refs/heads/feat/p1-local-dev-setup')"
}

# Output important values for GitHub Actions configuration
output "workload_identity_provider" {
  description = "The full identifier of the Workload Identity Provider"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "github_actions_service_account" {
  description = "Email of the service account for GitHub Actions"
  value       = "github-actions-staging@${local.project_id}.iam.gserviceaccount.com"
}

output "workload_identity_pool_id" {
  description = "The Workload Identity Pool ID"
  value       = "finspeed-pool-v2"
}
