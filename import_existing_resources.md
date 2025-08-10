# Terraform Import Commands for Existing Resources

## Import existing GCP resources into Terraform state

```bash
# Navigate to terraform directory
cd infra/terraform

# Import GCS bucket
terraform import -var-file="environments/staging.tfvars" google_storage_bucket.terraform_state finspeed-terraform-state-staging

# Import VPC network
terraform import -var-file="environments/staging.tfvars" google_compute_network.vpc_network projects/finspeed-staging/global/networks/finspeed-vpc-staging

# Import Secret Manager secrets
terraform import -var-file="environments/staging.tfvars" google_secret_manager_secret.database_password projects/568982729363/secrets/finspeed-database-password-staging
terraform import -var-file="environments/staging.tfvars" google_secret_manager_secret.database_url projects/568982729363/secrets/finspeed-database-url-staging

# Import Workload Identity Pool (if it exists)
terraform import -var-file="environments/staging.tfvars" google_iam_workload_identity_pool.github_pool projects/568982729363/locations/global/workloadIdentityPools/github-actions-pool

# Import Service Account
terraform import -var-file="environments/staging.tfvars" google_service_account.github_actions projects/finspeed-staging/serviceAccounts/github-actions-staging@finspeed-staging.iam.gserviceaccount.com
```

## Alternative: Use GCP Console to check/manage resources
