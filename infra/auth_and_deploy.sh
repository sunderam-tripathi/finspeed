#!/bin/bash

# Authentication and Deployment Script for Finspeed Infrastructure
# This script handles authentication and deployment in a simplified way

set -e

echo "🚀 Finspeed Infrastructure Deployment"
echo "======================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to authenticate with service account key
authenticate_with_service_account() {
    echo ""
    echo "🔐 Service Account Authentication"
    echo "================================="
    echo "If you have a service account key file, please provide the path:"
    read -p "Service account key file path (or press Enter to skip): " key_file
    
    if [ ! -z "$key_file" ] && [ -f "$key_file" ]; then
        echo "Authenticating with service account..."
        gcloud auth activate-service-account --key-file="$key_file"
        export GOOGLE_APPLICATION_CREDENTIALS="$key_file"
        echo "✅ Service account authentication successful"
        return 0
    else
        echo "⚠️  No service account key provided or file not found"
        return 1
    fi
}

# Function to try application default credentials
try_application_default_credentials() {
    echo ""
    echo "🔐 Trying Application Default Credentials"
    echo "========================================"
    
    # Try to use existing application default credentials
    if gcloud auth application-default print-access-token &> /dev/null; then
        echo "✅ Application default credentials are available"
        return 0
    else
        echo "⚠️  No application default credentials found"
        return 1
    fi
}

# Function to set up projects
setup_projects() {
    echo ""
    echo "📋 Setting up GCP projects"
    echo "=========================="
    
    # Set project for staging
    echo "Setting up staging project: finspeed-staging"
    gcloud config set project finspeed-staging
    
    # Enable required APIs for staging
    echo "Enabling required APIs for staging..."
    gcloud services enable compute.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable sql-component.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    gcloud services enable monitoring.googleapis.com
    
    echo "✅ Staging project setup complete"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    local environment=$1
    echo ""
    echo "🏗️  Deploying $environment infrastructure"
    echo "========================================"
    
    cd terraform
    
    # Initialize Terraform
    echo "Initializing Terraform..."
    terraform init
    
    # Plan deployment
    echo "Planning $environment deployment..."
    terraform plan -var-file="environments/${environment}.tfvars" -out="${environment}.tfplan"
    
    # Ask for confirmation
    echo ""
    echo "📋 Terraform plan generated for $environment environment"
    echo "Review the plan above and confirm deployment:"
    read -p "Do you want to apply this plan? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo "Applying $environment deployment..."
        terraform apply "${environment}.tfplan"
        echo "✅ $environment deployment complete!"
    else
        echo "❌ Deployment cancelled"
        rm -f "${environment}.tfplan"
        return 1
    fi
    
    cd ..
}

# Main execution
main() {
    # Try authentication methods
    if ! authenticate_with_service_account && ! try_application_default_credentials; then
        echo ""
        echo "❌ Authentication failed"
        echo ""
        echo "Please choose one of these options:"
        echo "1. Create a service account key in Google Cloud Console:"
        echo "   - Go to IAM & Admin > Service Accounts"
        echo "   - Create a service account with Editor/Owner role"
        echo "   - Download the JSON key file"
        echo "   - Run this script again with the key file path"
        echo ""
        echo "2. Use gcloud auth login (if browser is available):"
        echo "   - Run: gcloud auth login"
        echo "   - Run: gcloud auth application-default login"
        echo "   - Then run this script again"
        echo ""
        exit 1
    fi
    
    # Setup projects and APIs
    setup_projects
    
    # Deploy staging first
    echo ""
    echo "🎯 Ready to deploy infrastructure"
    echo "================================"
    echo "We'll start with staging environment for safety"
    
    if deploy_infrastructure "staging"; then
        echo ""
        echo "🎉 Staging deployment successful!"
        echo ""
        read -p "Do you want to deploy production environment? (yes/no): " deploy_prod
        
        if [ "$deploy_prod" = "yes" ]; then
            # Set project for production
            gcloud config set project finspeed-prod
            
            # Enable APIs for production
            echo "Enabling required APIs for production..."
            gcloud services enable compute.googleapis.com
            gcloud services enable run.googleapis.com
            gcloud services enable sql-component.googleapis.com
            gcloud services enable sqladmin.googleapis.com
            gcloud services enable secretmanager.googleapis.com
            gcloud services enable monitoring.googleapis.com
            
            deploy_infrastructure "production"
        fi
    fi
    
    echo ""
    echo "🎉 Deployment process complete!"
    echo "Check the Terraform outputs for important connection details."
}

# Run main function
main "$@"
