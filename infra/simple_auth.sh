#!/bin/bash

# Simple Authentication Script for Finspeed
# This script provides step-by-step authentication guidance

echo "🔐 Finspeed Authentication Setup"
echo "================================"

# Check current auth status
echo "Checking current authentication status..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 | grep -q "@"; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    echo "✅ Found active account: $ACTIVE_ACCOUNT"
    
    # Test if we can access projects
    echo "Testing project access..."
    if gcloud projects list --limit=1 &>/dev/null; then
        echo "✅ Authentication is working!"
        echo "Ready to proceed with deployment."
        exit 0
    else
        echo "⚠️  Account found but cannot access projects. Need to re-authenticate."
    fi
else
    echo "❌ No active authentication found."
fi

echo ""
echo "🔑 Authentication Required"
echo "========================="
echo ""
echo "Please choose your preferred authentication method:"
echo ""
echo "1. Service Account Key (Recommended for automation)"
echo "   - Most reliable for CI/CD and automated deployments"
echo "   - Create in Google Cloud Console → IAM & Admin → Service Accounts"
echo ""
echo "2. User Account Authentication"
echo "   - Use your personal Google account"
echo "   - Requires browser access"
echo ""
echo "3. Manual Setup Instructions"
echo "   - Step-by-step guide for either method"
echo ""

read -p "Enter your choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🔐 Service Account Authentication"
        echo "================================"
        echo ""
        echo "Steps to create a service account key:"
        echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts"
        echo "2. Click 'CREATE SERVICE ACCOUNT'"
        echo "3. Name: finspeed-terraform-deployer"
        echo "4. Grant these roles:"
        echo "   - Editor"
        echo "   - Cloud SQL Admin"
        echo "   - Cloud Run Admin"
        echo "   - Compute Network Admin"
        echo "   - Secret Manager Admin"
        echo "   - Monitoring Admin"
        echo "5. Create and download JSON key"
        echo "6. Save the key file securely"
        echo ""
        read -p "Enter the path to your service account key file: " key_file
        
        if [ -f "$key_file" ]; then
            echo "Activating service account..."
            gcloud auth activate-service-account --key-file="$key_file"
            export GOOGLE_APPLICATION_CREDENTIALS="$key_file"
            echo "✅ Service account activated!"
            
            # Test access
            if gcloud projects list --limit=1 &>/dev/null; then
                echo "✅ Authentication successful!"
                echo "Ready to proceed with deployment."
            else
                echo "❌ Authentication failed. Please check the key file and permissions."
                exit 1
            fi
        else
            echo "❌ Key file not found: $key_file"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "🔐 User Account Authentication"
        echo "============================="
        echo ""
        echo "This will open a browser for authentication."
        echo "If you're in a headless environment, you'll get a URL to copy."
        echo ""
        read -p "Continue with user authentication? (y/n): " confirm
        
        if [ "$confirm" = "y" ]; then
            echo "Starting user authentication..."
            gcloud auth login
            
            echo "Setting up application default credentials..."
            gcloud auth application-default login
            
            echo "✅ User authentication complete!"
        else
            echo "Authentication cancelled."
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "📋 Manual Setup Instructions"
        echo "============================"
        echo ""
        echo "Service Account Method (Recommended):"
        echo "1. Open: https://console.cloud.google.com/iam-admin/serviceaccounts"
        echo "2. Select project: finspeed-staging"
        echo "3. Click 'CREATE SERVICE ACCOUNT'"
        echo "4. Service account name: finspeed-terraform-deployer"
        echo "5. Click 'CREATE AND CONTINUE'"
        echo "6. Add these roles (click 'ADD ANOTHER ROLE' for each):"
        echo "   - Editor"
        echo "   - Cloud SQL Admin"
        echo "   - Cloud Run Admin"
        echo "   - Compute Network Admin"
        echo "   - Secret Manager Admin"
        echo "   - Monitoring Admin"
        echo "7. Click 'CONTINUE' then 'DONE'"
        echo "8. Click on the service account email"
        echo "9. Go to 'KEYS' tab"
        echo "10. Click 'ADD KEY' → 'Create new key'"
        echo "11. Select 'JSON' and click 'CREATE'"
        echo "12. Save the downloaded file securely"
        echo "13. Run this script again and choose option 1"
        echo ""
        echo "User Account Method:"
        echo "1. Run: gcloud auth login"
        echo "2. Complete browser authentication"
        echo "3. Run: gcloud auth application-default login"
        echo "4. Complete browser authentication again"
        echo "5. Run the deployment script"
        echo ""
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps"
echo "============"
echo "Now that authentication is set up, you can:"
echo "1. Run the deployment script: ./auth_and_deploy.sh"
echo "2. Or deploy manually:"
echo "   cd terraform"
echo "   terraform init"
echo "   terraform plan -var-file=environments/staging.tfvars"
echo "   terraform apply -var-file=environments/staging.tfvars"
echo ""
