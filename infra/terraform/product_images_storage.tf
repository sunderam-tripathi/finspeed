# GCS bucket for product images

locals {
  # Base pattern, all lowercase
  product_images_bucket_raw = lower("finspeed-product-images-${local.environment}-${local.project_id}")
  # Truncate to 63 characters max
  product_images_bucket_trunc = substr(local.product_images_bucket_raw, 0, 63)
  # Ensure the name ends with a letter or digit by trimming trailing '-', '.', or '_' if present.
  product_images_bucket_trim1 = substr(
    local.product_images_bucket_trunc,
    0,
    length(local.product_images_bucket_trunc) - (
      substr(local.product_images_bucket_trunc, length(local.product_images_bucket_trunc) - 1, 1) == "-" ? 1 : 0
    )
  )
  product_images_bucket_trim2 = substr(
    local.product_images_bucket_trim1,
    0,
    length(local.product_images_bucket_trim1) - (
      substr(local.product_images_bucket_trim1, length(local.product_images_bucket_trim1) - 1, 1) == "." ? 1 : 0
    )
  )
  product_images_bucket_name = substr(
    local.product_images_bucket_trim2,
    0,
    length(local.product_images_bucket_trim2) - (
      substr(local.product_images_bucket_trim2, length(local.product_images_bucket_trim2) - 1, 1) == "_" ? 1 : 0
    )
  )
}
resource "google_storage_bucket" "product_images" {
  # Unique, compliant bucket name computed in locals above
  name                        = local.product_images_bucket_name
  project                     = local.project_id
  location                    = "US"
  uniform_bucket_level_access = true
  force_destroy               = !var.enable_deletion_protection

  # Allow cross-origin GETs from our domains (useful for direct image loads and CDNs)
  cors {
    origin = var.domain_name != "" ? compact([
      "https://${var.domain_name}",
      "https://www.${var.domain_name}",
      "https://admin.${var.domain_name}",
      var.api_domain_name != "" ? "https://${var.api_domain_name}" : null,
    ]) : ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  versioning {
    enabled = true
  }

  labels = local.common_labels
}

# Public read access to objects (images)
resource "google_storage_bucket_iam_member" "product_images_public_read" {
  count  = var.allow_public_product_images_read ? 1 : 0
  bucket = google_storage_bucket.product_images.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Grant Cloud Run service account RW access to manage images
resource "google_storage_bucket_iam_member" "product_images_rw_cloud_run" {
  bucket = google_storage_bucket.product_images.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}
