#!/bin/bash

# Quick Authentication Script for Finspeed
# This script provides multiple authentication methods to get you started quickly

set -e

echo "🔐 Quick Authentication for Finspeed"
echo "===================================="

# Check if already authenticated
if gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n1 | grep -q "@"; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    echo "✅ Already authenticated as: $ACTIVE_ACCOUNT"
    
    # Test if we can access projects
    if gcloud projects list --limit=1 &>/dev/null; then
        echo "✅ Authentication is working! Ready to proceed."
        echo ""
        echo "🚀 Running Workload Identity setup..."
        ./setup-workload-identity.sh
        exit 0
    fi
fi

echo "❌ No active authentication found or authentication not working."
echo ""
echo "🔑 Choose your authentication method:"
echo "1. Fresh browser authentication (get new verification code)"
echo "2. Service account key file"
echo "3. Manual instructions"
echo ""

read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting fresh browser authentication..."
        echo "=========================================="
        echo ""
        echo "This will give you a new URL and verification code."
        echo "The previous verification code has expired."
        echo ""
        
        # Start fresh authentication
        gcloud auth login --no-launch-browser
        
        # If successful, run workload identity setup
        if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 | grep -q "@"; then
            echo ""
            echo "✅ Authentication successful!"
            echo "🚀 Running Workload Identity setup..."
            ./setup-workload-identity.sh
        else
            echo "❌ Authentication failed. Please try again."
        fi
        ;;
    2)
        echo ""
        echo "🔐 Service Account Key Authentication"
        echo "===================================="
        echo ""
        echo "Please provide the path to your service account JSON key file:"
        read -p "Key file path: " key_file
        
        if [ -f "$key_file" ]; then
            echo "Activating service account..."
            gcloud auth activate-service-account --key-file="$key_file"
            export GOOGLE_APPLICATION_CREDENTIALS="$key_file"
            
            if gcloud projects list --limit=1 &>/dev/null; then
                echo "✅ Service account authentication successful!"
                echo "🚀 Running Workload Identity setup..."
                ./setup-workload-identity.sh
            else
                echo "❌ Service account authentication failed."
            fi
        else
            echo "❌ Key file not found: $key_file"
        fi
        ;;
    3)
        echo ""
        echo "📋 Manual Authentication Instructions"
        echo "===================================="
        echo ""
        echo "Option A: Browser Authentication"
        echo "1. Run: gcloud auth login --no-launch-browser"
        echo "2. Copy the URL to your browser"
        echo "3. Complete Google authentication"
        echo "4. Copy the verification code back to terminal"
        echo "5. Run: ./setup-workload-identity.sh"
        echo ""
        echo "Option B: Service Account Key"
        echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=finspeed-staging"
        echo "2. Create service account with required roles"
        echo "3. Download JSON key file"
        echo "4. Run: gcloud auth activate-service-account --key-file=path/to/key.json"
        echo "5. Run: ./setup-workload-identity.sh"
        echo ""
        echo "Option C: Google Cloud Shell"
        echo "1. Open: https://shell.cloud.google.com"
        echo "2. Clone your repository"
        echo "3. Run the setup scripts (pre-authenticated)"
        echo ""
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac
