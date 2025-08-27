#!/bin/bash

# Script to apply Cloud Function IAM policy after deployment
# This works around the persistent precondition errors in Terraform

set -e

PROJECT_ID="finspeed-staging-st"
REGION="asia-south2"
FUNCTION_NAME="finspeed-api-gateway-staging"

echo "Applying IAM policy to Cloud Function: $FUNCTION_NAME"

# Wait for function to be fully ready
echo "Waiting for function to stabilize..."
sleep 30

# Check if function exists and is active
if ! gcloud functions describe "$FUNCTION_NAME" --region="$REGION" --gen2 --format="value(state)" | grep -q "ACTIVE"; then
    echo "Error: Function $FUNCTION_NAME is not in ACTIVE state"
    exit 1
fi

# Apply IAM policy with retries
MAX_ATTEMPTS=5
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Attempt $ATTEMPT of $MAX_ATTEMPTS..."
    
    if gcloud functions add-iam-policy-binding "$FUNCTION_NAME" \
        --region="$REGION" \
        --member="allUsers" \
        --role="roles/cloudfunctions.invoker" \
        --gen2; then
        echo "✅ Successfully applied IAM policy to $FUNCTION_NAME"
        exit 0
    else
        echo "❌ Attempt $ATTEMPT failed, waiting 60 seconds before retry..."
        sleep 60
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

echo "❌ Failed to apply IAM policy after $MAX_ATTEMPTS attempts"
exit 1
