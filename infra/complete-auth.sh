#!/bin/bash

# Complete Authentication with Verification Code
echo "🔐 Completing Google Cloud Authentication"
echo "========================================="

# Kill any existing gcloud auth processes
pkill -f "gcloud auth" 2>/dev/null || true

echo "Starting fresh authentication..."

# Use expect to handle the interactive authentication
expect << 'EOF'
spawn gcloud auth login --no-launch-browser
expect "Once finished, enter the verification code provided in your browser:"
send "4/0AVMBsJjtGamkgBQi5_2IolsqsvOaVPZ18kciB1t-YdrU8LtJsJlqJVum-361OZIVkRzCrQ\r"
expect eof
EOF

# Check if authentication was successful
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 | grep -q "@"; then
    echo "✅ Authentication successful!"
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    echo "Authenticated as: $ACTIVE_ACCOUNT"
    
    # Test project access
    if gcloud projects list --limit=1 &>/dev/null; then
        echo "✅ Project access confirmed!"
        echo ""
        echo "🚀 Running Workload Identity setup..."
        ./setup-workload-identity.sh
    else
        echo "⚠️  Authentication successful but cannot access projects."
        echo "You may need to set up billing or project permissions."
    fi
else
    echo "❌ Authentication failed. Let's try a different approach."
    echo ""
    echo "Please run this manually:"
    echo "1. gcloud auth login --no-launch-browser"
    echo "2. Use verification code: 4/0AVMBsJjtGamkgBQi5_2IolsqsvOaVPZ18kciB1t-YdrU8LtJsJlqJVum-361OZIVkRzCrQ"
    echo "3. Then run: ./setup-workload-identity.sh"
fi
