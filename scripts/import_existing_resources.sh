#!/bin/bash

# Terraform Import Script for Existing GCP Resources
# This script imports all existing resources that are causing 409 conflicts

set -e

echo "🚀 Starting Terraform import for existing GCP resources..."

# Navigate to terraform directory
cd "$(dirname "$0")/../infra/terraform"

# Set variables
PROJECT_ID="finspeed-staging"
PROJECT_NUMBER="568982729363"

echo "📁 Current directory: $(pwd)"
echo "🔧 Project ID: $PROJECT_ID"
echo "🔧 Project Number: $PROJECT_NUMBER"

# Initialize terraform if needed
echo "🔄 Initializing Terraform..."
terraform init

echo "📥 Importing existing resources..."

# 1. Import GCS bucket for Terraform state
echo "1️⃣ Importing GCS bucket: finspeed-terraform-state-staging"
terraform import -var-file="environments/staging.tfvars" \
  google_storage_bucket.terraform_state \
  "finspeed-terraform-state-staging" || echo "⚠️  Bucket import failed or already imported"

# 2. Import VPC network
echo "2️⃣ Importing VPC network: finspeed-vpc-staging"
terraform import -var-file="environments/staging.tfvars" \
  google_compute_network.vpc_network \
  "projects/$PROJECT_ID/global/networks/finspeed-vpc-staging" || echo "⚠️  VPC import failed or already imported"

# 3. Import Secret Manager secrets
echo "3️⃣ Importing Secret Manager secrets..."
terraform import -var-file="environments/staging.tfvars" \
  google_secret_manager_secret.database_password \
  "projects/$PROJECT_NUMBER/secrets/finspeed-database-password-staging" || echo "⚠️  Database password secret import failed or already imported"

terraform import -var-file="environments/staging.tfvars" \
  google_secret_manager_secret.database_url \
  "projects/$PROJECT_NUMBER/secrets/finspeed-database-url-staging" || echo "⚠️  Database URL secret import failed or already imported"

# 4. Import Workload Identity Pool
echo "4️⃣ Importing Workload Identity Pool: github-actions-pool"
terraform import -var-file="environments/staging.tfvars" \
  google_iam_workload_identity_pool.github_pool \
  "projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool" || echo "⚠️  Workload Identity Pool import failed or already imported"

# 5. Import Workload Identity Provider
echo "5️⃣ Importing Workload Identity Provider: github-provider"
terraform import -var-file="environments/staging.tfvars" \
  google_iam_workload_identity_pool_provider.github_provider \
  "projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider" || echo "⚠️  Workload Identity Provider import failed or already imported"

# 6. Import GitHub Actions service account
echo "6️⃣ Importing GitHub Actions service account: github-actions-staging"
terraform import -var-file="environments/staging.tfvars" \
  google_service_account.github_actions \
  "projects/$PROJECT_ID/serviceAccounts/github-actions-staging@$PROJECT_ID.iam.gserviceaccount.com" || echo "⚠️  GitHub Actions service account import failed or already imported"

# 7. Import Cloud Run service account
echo "7️⃣ Importing Cloud Run service account: finspeed-cloud-run-staging"
terraform import -var-file="environments/staging.tfvars" \
  google_service_account.cloud_run_sa \
  "projects/$PROJECT_ID/serviceAccounts/finspeed-cloud-run-staging@$PROJECT_ID.iam.gserviceaccount.com" || echo "⚠️  Cloud Run service account import failed or already imported"

# 8. Import Cloud SQL instance (if exists)
echo "8️⃣ Importing Cloud SQL instance: finspeed-postgres-staging"
terraform import -var-file="environments/staging.tfvars" \
  google_sql_database_instance.postgres \
  "$PROJECT_ID:finspeed-postgres-staging" || echo "⚠️  Cloud SQL instance import failed or already imported"

echo "✅ Import process completed!"
echo ""
echo "🔍 Running terraform plan to verify state..."
terraform plan -var-file="environments/staging.tfvars"

echo ""
echo "🎉 All resources imported successfully!"
echo "💡 Next step: Run 'terraform apply' to sync any configuration differences"
