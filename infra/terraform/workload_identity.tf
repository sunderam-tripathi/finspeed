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

# Create Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
  description               = "Workload Identity Pool for GitHub Actions"
  project                   = local.project_id

  depends_on = [
    google_project_service.iam_api,
    google_project_service.sts_api
  ]
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
  attribute_condition = "assertion.repository == '${var.github_repository}' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop' || assertion.ref_type == 'tag' || assertion.ref == 'refs/heads/feat/p1-local-dev-setup')"
}

# Create service account for GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-${local.environment}"
  display_name = "GitHub Actions Service Account (${local.environment})"
  description  = "Service account for GitHub Actions CI/CD pipeline"
  project      = local.project_id
}

# Allow GitHub Actions to impersonate the service account
resource "google_service_account_iam_binding" "github_actions_workload_identity" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
  ]
}

# Grant necessary permissions to the service account
resource "google_project_iam_member" "github_actions_permissions" {
  for_each = toset([
    "roles/run.admin",                    # Deploy Cloud Run services
    "roles/cloudsql.admin",              # Manage Cloud SQL
    "roles/secretmanager.admin",         # Manage secrets
    "roles/monitoring.admin",            # Manage monitoring
    "roles/compute.networkAdmin",        # Manage VPC and networking
    "roles/iam.serviceAccountUser",      # Use service accounts
    "roles/storage.admin",               # Access Cloud Storage (for Terraform state)
    "roles/artifactregistry.admin",      # Push/pull container images
    "roles/cloudbuild.builds.builder"    # Build containers
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
  value       = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
}
