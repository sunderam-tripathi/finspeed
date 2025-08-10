#!/bin/bash

# Deploy Finspeed Infrastructure with Service Account
set -e

echo "🚀 Finspeed Infrastructure Deployment with Service Account"
echo "=========================================================="

# Check if service account key file exists
SERVICE_ACCOUNT_KEY="/home/dekisuki/finspeed-service-account.json"

if [ ! -f "$SERVICE_ACCOUNT_KEY" ]; then
    echo "❌ Service account key file not found at: $SERVICE_ACCOUNT_KEY"
    echo ""
    echo "Please create a service account key:"
    echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "2. Select project: finspeed-staging"
    echo "3. Create service account: finspeed-terraform-deployer"
    echo "4. Add roles: Editor, Cloud SQL Admin, Cloud Run Admin, etc."
    echo "5. Download JSON key to: $SERVICE_ACCOUNT_KEY"
    echo ""
    read -p "Enter the path to your service account key file: " custom_key
    if [ -f "$custom_key" ]; then
        SERVICE_ACCOUNT_KEY="$custom_key"
    else
        echo "❌ Key file not found. Exiting."
        exit 1
    fi
fi

echo "✅ Found service account key: $SERVICE_ACCOUNT_KEY"

# Activate service account
echo "🔐 Activating service account..."
gcloud auth activate-service-account --key-file="$SERVICE_ACCOUNT_KEY"
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_KEY"

# Test authentication
echo "🧪 Testing authentication..."
if ! gcloud projects list --limit=1 &>/dev/null; then
    echo "❌ Authentication failed. Please check the service account key and permissions."
    exit 1
fi
echo "✅ Authentication successful!"

# Function to enable APIs
enable_apis() {
    local project_id=$1
    echo "📡 Enabling APIs for project: $project_id"
    
    gcloud config set project "$project_id"
    
    gcloud services enable compute.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable sql-component.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    gcloud services enable monitoring.googleapis.com
    gcloud services enable cloudresourcemanager.googleapis.com
    
    echo "✅ APIs enabled for $project_id"
}

# Function to deploy environment
deploy_environment() {
    local env=$1
    local project_id=$2
    
    echo ""
    echo "🏗️  Deploying $env environment to project: $project_id"
    echo "=================================================="
    
    # Set project
    gcloud config set project "$project_id"
    
    # Enable APIs
    enable_apis "$project_id"
    
    # Navigate to terraform directory
    cd terraform
    
    # Initialize Terraform
    echo "🔧 Initializing Terraform..."
    terraform init
    
    # Plan deployment
    echo "📋 Planning $env deployment..."
    terraform plan -var-file="environments/${env}.tfvars" -out="${env}.tfplan"
    
    echo ""
    echo "📊 Terraform Plan Summary for $env:"
    echo "=================================="
    terraform show -no-color "${env}.tfplan" | grep -E "^(Plan:|# |  \+|  ~|  -)" | head -20
    echo ""
    
    # Confirm deployment
    read -p "🚀 Deploy $env environment? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo "🚀 Applying $env deployment..."
        terraform apply "${env}.tfplan"
        
        echo ""
        echo "✅ $env deployment completed!"
        echo ""
        echo "📋 Important outputs:"
        terraform output
        
    else
        echo "❌ $env deployment cancelled"
        rm -f "${env}.tfplan"
        return 1
    fi
    
    # Return to parent directory
    cd ..
    
    return 0
}

# Main deployment process
main() {
    echo "🎯 Starting deployment process..."
    echo ""
    
    # Deploy staging first
    echo "Starting with staging environment for safety..."
    if deploy_environment "staging" "finspeed-staging"; then
        echo ""
        echo "🎉 Staging deployment successful!"
        echo ""
        
        # Ask about production
        read -p "🚀 Deploy production environment? (yes/no): " deploy_prod
        
        if [ "$deploy_prod" = "yes" ]; then
            deploy_environment "production" "finspeed-prod"
        else
            echo "Production deployment skipped."
        fi
    else
        echo "❌ Staging deployment failed. Production deployment skipped."
        exit 1
    fi
    
    echo ""
    echo "🎉 Deployment process complete!"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Check the Terraform outputs above for connection details"
    echo "2. Verify resources in Google Cloud Console"
    echo "3. Deploy your application containers to Cloud Run"
    echo ""
}

# Run main function
main "$@"
