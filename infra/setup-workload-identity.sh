#!/bin/bash

# Setup GitHub OIDC/Workload Identity for Finspeed
# This script configures Workload Identity Federation for keyless GitHub Actions → GCP authentication

set -e

echo "🔐 Setting up GitHub OIDC/Workload Identity Federation"
echo "====================================================="

# Configuration
GITHUB_REPO="sunderam-tripathi/finspeed"  # Update with your actual GitHub repo
PROJECT_STAGING="finspeed-staging"
PROJECT_PROD="finspeed-prod"
POOL_ID="github-actions-pool"
PROVIDER_ID="github-actions-provider"
SERVICE_ACCOUNT_STAGING="github-actions-sa-staging"
SERVICE_ACCOUNT_PROD="github-actions-sa-prod"

echo "📋 Configuration:"
echo "GitHub Repository: $GITHUB_REPO"
echo "Staging Project: $PROJECT_STAGING"
echo "Production Project: $PROJECT_PROD"
echo ""

# Function to setup workload identity for a project
setup_workload_identity() {
    local project_id=$1
    local service_account_name=$2
    local environment=$3
    
    echo "🏗️  Setting up Workload Identity for $environment ($project_id)"
    echo "=============================================================="
    
    # Set current project
    gcloud config set project "$project_id"
    
    # Enable required APIs
    echo "📡 Enabling required APIs..."
    gcloud services enable iamcredentials.googleapis.com
    gcloud services enable sts.googleapis.com
    gcloud services enable cloudresourcemanager.googleapis.com
    
    # Create service account for GitHub Actions
    echo "👤 Creating service account: $service_account_name"
    if ! gcloud iam service-accounts describe "${service_account_name}@${project_id}.iam.gserviceaccount.com" &>/dev/null; then
        gcloud iam service-accounts create "$service_account_name" \
            --display-name="GitHub Actions Service Account for $environment" \
            --description="Service account for GitHub Actions Workload Identity in $environment"
    else
        echo "Service account already exists"
    fi
    
    # Grant necessary roles to service account
    echo "🔑 Granting roles to service account..."
    local service_account_email="${service_account_name}@${project_id}.iam.gserviceaccount.com"
    
    # Core roles for infrastructure deployment
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/editor"
    
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/cloudsql.admin"
    
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/compute.networkAdmin"
    
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/secretmanager.admin"
    
    gcloud projects add-iam-policy-binding "$project_id" \
        --member="serviceAccount:$service_account_email" \
        --role="roles/monitoring.admin"
    
    # Create Workload Identity Pool (only once per project)
    echo "🏊 Creating Workload Identity Pool..."
    if ! gcloud iam workload-identity-pools describe "$POOL_ID" --location="global" --project="$project_id" &>/dev/null; then
        gcloud iam workload-identity-pools create "$POOL_ID" \
            --project="$project_id" \
            --location="global" \
            --display-name="GitHub Actions Pool"
    else
        echo "Workload Identity Pool already exists"
    fi
    
    # Create OIDC Provider
    echo "🔗 Creating OIDC Provider..."
    if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" --workload-identity-pool="$POOL_ID" --location="global" --project="$project_id" &>/dev/null; then
        gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
            --project="$project_id" \
            --location="global" \
            --workload-identity-pool="$POOL_ID" \
            --display-name="GitHub Actions Provider" \
            --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
            --issuer-uri="https://token.actions.githubusercontent.com"
    else
        echo "OIDC Provider already exists"
    fi
    
    # Allow GitHub Actions to impersonate the service account
    echo "🤝 Setting up impersonation permissions..."
    gcloud iam service-accounts add-iam-policy-binding "$service_account_email" \
        --project="$project_id" \
        --role="roles/iam.workloadIdentityUser" \
        --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $project_id --format='value(projectNumber)')/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$GITHUB_REPO"
    
    echo "✅ Workload Identity setup complete for $environment!"
    echo ""
}

# Function to generate GitHub Actions workflow
generate_github_workflow() {
    echo "📝 Generating GitHub Actions workflow..."
    
    # Get project numbers
    local staging_project_number=$(gcloud projects describe "$PROJECT_STAGING" --format='value(projectNumber)')
    local prod_project_number=$(gcloud projects describe "$PROJECT_PROD" --format='value(projectNumber)')
    
    mkdir -p ../.github/workflows
    
    cat > ../.github/workflows/deploy-infrastructure.yml << EOF
name: Deploy Infrastructure

on:
  push:
    branches: [ main, master ]
    paths: [ 'infra/**' ]
  pull_request:
    branches: [ main, master ]
    paths: [ 'infra/**' ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

permissions:
  id-token: write
  contents: read

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: projects/$staging_project_number/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID
        service_account: $SERVICE_ACCOUNT_STAGING@$PROJECT_STAGING.iam.gserviceaccount.com
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2
    
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: 1.12.2
    
    - name: Deploy Staging Infrastructure
      working-directory: infra/terraform
      run: |
        terraform init
        terraform plan -var-file=environments/staging.tfvars -out=staging.tfplan
        terraform apply -auto-approve staging.tfplan
    
    - name: Output staging results
      working-directory: infra/terraform
      run: terraform output

  deploy-production:
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master' || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production')
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: projects/$prod_project_number/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID
        service_account: $SERVICE_ACCOUNT_PROD@$PROJECT_PROD.iam.gserviceaccount.com
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2
    
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3
      with:
        terraform_version: 1.12.2
    
    - name: Deploy Production Infrastructure
      working-directory: infra/terraform
      run: |
        terraform init
        terraform plan -var-file=environments/production.tfvars -out=production.tfplan
        terraform apply -auto-approve production.tfplan
    
    - name: Output production results
      working-directory: infra/terraform
      run: terraform output
EOF

    echo "✅ GitHub Actions workflow created at ../.github/workflows/deploy-infrastructure.yml"
}

# Main execution
main() {
    echo "🎯 Starting Workload Identity setup..."
    echo ""
    
    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 | grep -q "@"; then
        echo "❌ You need to be authenticated with gcloud first."
        echo "Run: gcloud auth login"
        exit 1
    fi
    
    echo "✅ User authenticated: $(gcloud auth list --filter=status:ACTIVE --format='value(account)' | head -n1)"
    echo ""
    
    # Setup for staging
    setup_workload_identity "$PROJECT_STAGING" "$SERVICE_ACCOUNT_STAGING" "staging"
    
    # Setup for production
    setup_workload_identity "$PROJECT_PROD" "$SERVICE_ACCOUNT_PROD" "production"
    
    # Generate GitHub Actions workflow
    generate_github_workflow
    
    echo ""
    echo "🎉 Workload Identity Federation setup complete!"
    echo ""
    echo "📋 Summary:"
    echo "==========="
    echo "✅ Workload Identity Pools created in both projects"
    echo "✅ OIDC Providers configured for GitHub Actions"
    echo "✅ Service accounts created with necessary permissions"
    echo "✅ GitHub Actions workflow generated"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Commit and push the .github/workflows/deploy-infrastructure.yml file"
    echo "2. Set up GitHub repository environments (staging, production) with protection rules"
    echo "3. Push changes to trigger the deployment workflow"
    echo ""
    echo "📊 Workload Identity Provider details:"
    echo "Staging: projects/$staging_project_number/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID"
    echo "Production: projects/$prod_project_number/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID"
    echo ""
}

# Run main function
main "$@"
