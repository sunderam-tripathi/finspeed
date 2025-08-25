#!/usr/bin/env bash
set -Eeuo pipefail

# Configuration
BASE_URL="https://api.staging.finspeed.online"
PRODUCT_ID="2"
IMAGE_PATH="frontend/public/images/products/giant-talon-3-main.jpg"

log() { printf "[%s] %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Required command '$1' not found" >&2; exit 1; }
}

require_cmd terraform
require_cmd gcloud
require_cmd curl

trap 'rc=$?; echo "Script failed with exit code $rc" >&2' ERR

log "Fetching IAP client ID from Terraform state..."
IAP_CLIENT_ID=$(terraform -chdir=infra/terraform/staging state show module.finspeed_infra.google_iap_client.project_client | awk '/client_id/ {print $3}' | tr -d '"')
if [[ -z "${IAP_CLIENT_ID:-}" ]]; then
  echo "Failed to retrieve IAP client ID from state" >&2
  exit 1
fi
log "IAP client ID: ${IAP_CLIENT_ID}"

log "Generating IAP identity token..."

# Optionally set IMPERSONATE_SA to a service account that has IAP access. By default, try the GitHub Actions SA from TF state.
if [[ -z "${IMPERSONATE_SA:-}" ]]; then
  IMPERSONATE_SA=$(terraform -chdir=infra/terraform/staging state show module.finspeed_infra.google_service_account.github_actions | awk -F' = ' '/^\s*email\s*=/{print $2}' | tr -d '"' | head -n1 || true)
fi

set +e
IAP_TOKEN=""
ERR_NOTES=()

if [[ -n "${IMPERSONATE_SA:-}" ]]; then
  log "Attempting SA impersonation: ${IMPERSONATE_SA}"
  IAP_TOKEN=$(gcloud auth print-identity-token --impersonate-service-account="${IMPERSONATE_SA}" --audiences="${IAP_CLIENT_ID}" --include-email 2> /tmp/iap_token_impersonate_err.txt)
  rc_imp=$?
  if [[ $rc_imp -ne 0 || -z "${IAP_TOKEN:-}" ]]; then
    ERR1=$(cat /tmp/iap_token_impersonate_err.txt || true)
    ERR_NOTES+=("Impersonation failed: ${ERR1}")
    IAP_TOKEN=""
  fi
fi

if [[ -z "${IAP_TOKEN:-}" ]]; then
  log "Attempting identity token with active credentials..."
  IAP_TOKEN=$(gcloud auth print-identity-token --audiences="${IAP_CLIENT_ID}" --include-email 2> /tmp/iap_token_err1.txt)
  rc=$?
  if [[ $rc -ne 0 || -z "${IAP_TOKEN:-}" ]]; then
    ERR2=$(cat /tmp/iap_token_err1.txt || true)
    ERR_NOTES+=("Active cred method failed: ${ERR2}")
  fi
fi
set -e

if [[ -z "${IAP_TOKEN:-}" ]]; then
  echo "Failed to generate IAP token." >&2
  printf "Notes:\n" >&2
  for n in "${ERR_NOTES[@]:-}"; do printf "- %s\n" "$n" >&2; done
  echo "If using impersonation, ensure your user has 'roles/iam.serviceAccountTokenCreator' on ${IMPERSONATE_SA} and that SA is granted 'roles/iap.httpsResourceAccessor'." >&2
  echo "To grant TokenCreator (requires project admin):" >&2
  echo "  gcloud iam service-accounts add-iam-policy-binding '${IMPERSONATE_SA}' \
    --role=roles/iam.serviceAccountTokenCreator \
    --member=user:$(gcloud config get-value account 2>/dev/null) \
    --project=finspeed-staging-st" >&2
  exit 1
fi
log "IAP token acquired."

log "Logging in to obtain admin JWT (sending IAP token only via Proxy-Authorization)..."
LOGIN_JSON=$(curl -sS --max-time 60 -X POST "${BASE_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -H "Proxy-Authorization: Bearer ${IAP_TOKEN}" \
  -d '{"email":"admin@finspeed.online","password":"admin123"}')

if command -v jq >/dev/null 2>&1; then
  JWT=$(printf '%s' "$LOGIN_JSON" | jq -r '.token // empty')
else
  JWT=$(printf '%s' "$LOGIN_JSON" | sed -n 's/.*"token" *: *"\([^\"]*\)".*/\1/p')
fi

if [[ -z "${JWT:-}" ]]; then
  echo "Failed to parse JWT from login response:" >&2
  echo "$LOGIN_JSON" >&2
  exit 1
fi
log "Admin JWT acquired."

if [[ ! -f "$IMAGE_PATH" ]]; then
  echo "Image not found: $IMAGE_PATH" >&2
  exit 1
fi

log "Uploading image to /api/v1/admin/products/${PRODUCT_ID}/images ..."
UPLOAD_RESP=$(curl -sS --max-time 120 -w "\nHTTP_STATUS:%{http_code}\n" -X POST "${BASE_URL}/api/v1/admin/products/${PRODUCT_ID}/images" \
  -H "Proxy-Authorization: Bearer ${IAP_TOKEN}" \
  -H "X-App-Authorization: Bearer ${JWT}" \
  -F "file=@${IMAGE_PATH};type=image/jpeg" \
  -F "alt=Front view" \
  -F "is_primary=true")

HTTP_STATUS=$(printf "%s" "$UPLOAD_RESP" | awk -FHTTP_STATUS: 'NF>1{print $2}' | tr -d '\r\n')
BODY=$(printf "%s" "$UPLOAD_RESP" | sed -n '1,/HTTP_STATUS:/p' | sed '$d')

log "Upload HTTP status: $HTTP_STATUS"
printf "Upload response body:\n%s\n" "$BODY"

IMG_URL=""
if command -v jq >/dev/null 2>&1; then
  IMG_URL=$(printf '%s' "$BODY" | jq -r '.image.url // empty')
fi
if [[ -z "${IMG_URL:-}" ]]; then
  # fallback grep/sed parse
  IMG_URL=$(printf '%s' "$BODY" | sed -n 's/.*"image" *: *{[^}]*"url" *: *"\([^\"]*\)".*/\1/p') || true
fi

if [[ -n "${IMG_URL:-}" ]]; then
  log "Image URL (from response): ${IMG_URL}"
  PUB_STATUS=$(curl -sSI --max-time 30 "$IMG_URL" | awk '/^HTTP/{print $2}' | head -n1 || true)
  log "Direct URL HTTP status (expect 403 in staging): ${PUB_STATUS:-unknown}"
else
  log "No image URL found in response; skipping direct access check."
fi

log "Fetching product images bucket name from Terraform state..."
BUCKET=$(terraform -chdir=infra/terraform/staging state show module.finspeed_infra.google_storage_bucket.product_images | awk -F' = ' '/^\s*name\s*=/{print $2}' | tr -d '"' | head -n1)
if [[ -n "${BUCKET:-}" ]]; then
  OBJECT_PATH="products/${PRODUCT_ID}/$(basename "$IMAGE_PATH")"
  log "Attempting to verify object exists: gs://${BUCKET}/${OBJECT_PATH}"
  if command -v gsutil >/dev/null 2>&1; then
    if gsutil -q stat "gs://${BUCKET}/${OBJECT_PATH}"; then
      log "Object confirmed in bucket."
    else
      log "Object not found via gsutil stat (may have different filename if server renames)."
    fi
  else
    log "gsutil not available; skipping bucket verification."
  fi
else
  log "Could not determine bucket name; skipping bucket verification."
fi

log "Done."
