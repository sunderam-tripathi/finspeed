# Cloud Storage bucket for static website hosting
resource "google_storage_bucket" "static_website" {
  count                       = var.use_static_hosting ? 1 : 0
  name                        = "finspeed-static-${local.environment}"
  location                    = "US"
  project                     = local.project_id
  force_destroy               = !var.enable_deletion_protection
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["https://${var.domain_name}", "https://www.${var.domain_name}"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  labels = local.common_labels
}

# Project data (for Cloud CDN fill service account in prod and API Gateway Cloud Build)
data "google_project" "current" {
  count      = (var.use_static_hosting && var.environment == "production") || var.allow_public_api ? 1 : 0
  project_id = local.project_id
}

# Make the bucket publicly readable (backend bucket fetches anonymously)
resource "google_storage_bucket_iam_member" "public_read" {
  count  = var.use_static_hosting ? 1 : 0
  bucket = google_storage_bucket.static_website[0].name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# In production, grant Cloud CDN fill service account objectViewer instead of public access
resource "google_storage_bucket_iam_member" "cdn_fill_viewer" {
  count  = var.use_static_hosting && var.environment == "production" ? 1 : 0
  bucket = google_storage_bucket.static_website[0].name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:service-${data.google_project.current[0].number}@cloud-cdn-fill.iam.gserviceaccount.com"
}

# In production, also grant the Load Balancer's legacy GCS service identity viewer on the bucket


# Cloud CDN backend bucket
resource "google_compute_backend_bucket" "static_backend" {
  count       = var.use_static_hosting ? 1 : 0
  name        = "finspeed-static-backend-${local.environment}"
  bucket_name = google_storage_bucket.static_website[0].name
  enable_cdn  = true
  project     = local.project_id

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 3600
    max_ttl           = 86400
    client_ttl        = 3600
    negative_caching  = true
    serve_while_stale = 86400
  }
}

# Update URL map to route main domain to static hosting
resource "google_compute_url_map" "url_map_with_static" {
  count           = var.use_static_hosting && var.domain_name != "" ? 1 : 0
  provider        = google-beta
  name            = "finspeed-lb-url-map-with-static-${local.environment}"
  default_service = google_compute_backend_bucket.static_backend[0].id

  # API subdomain routes to Cloud Run API
  host_rule {
    hosts        = [var.api_domain_name]
    path_matcher = "api-matcher"
  }

  # Admin subdomain routes to Cloud Run admin interface
  host_rule {
    hosts        = ["admin.${var.domain_name}"]
    path_matcher = "admin-matcher"
  }

  # Main domain routes to static hosting by default, /api/* to Cloud Run API
  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "main-matcher"
  }

  # API subdomain matcher
  path_matcher {
    name            = "api-matcher"
    default_service = google_compute_backend_service.api_backend.id
  }

  # Admin subdomain matcher
  path_matcher {
    name            = "admin-matcher"
    default_service = var.environment == "production" ? google_compute_backend_service.frontend_backend_admin.id : google_compute_backend_service.frontend_backend.id
  }

  # Main domain matcher with path-based routing
  path_matcher {
    name            = "main-matcher"
    default_service = google_compute_backend_bucket.static_backend[0].id

    # Redirect root to index.html for CDN-backed bucket
    route_rules {
      priority = 1
      match_rules {
        full_path_match = "/"
      }
      url_redirect {
        path_redirect          = "/index.html"
        redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
        https_redirect         = true
        strip_query            = false
      }
    }

    # Route API calls to API backend (or public gateway when enabled)
    route_rules {
      priority = 2
      match_rules {
        prefix_match = "/api/"
      }
      service = element(concat(google_compute_backend_service.api_gateway_backend[*].id, [google_compute_backend_service.api_backend.id]), 0)
    }
  }

  lifecycle {
    prevent_destroy       = true
    create_before_destroy = true
  }
}

## Deprecated: unified certificate is managed in networking.tf; disable this resource to avoid conflicts
resource "google_compute_managed_ssl_certificate" "ssl_certificate_with_admin" {
  count = 0
  name  = "finspeed-ssl-cert-${local.environment}-${random_id.cert_suffix.hex}"
  managed {
    domains = [
      var.domain_name,
      "api.${var.domain_name}",
      "admin.${var.domain_name}"
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

## Static site content objects (managed via Terraform)
resource "google_storage_bucket_object" "index_html" {
  count         = var.use_static_hosting ? 1 : 0
  name          = "index.html"
  bucket        = google_storage_bucket.static_website[0].name
  source        = "${path.module}/../../static-site/production/index.html"
  content_type  = "text/html"
  cache_control = "public, max-age=300"
}

resource "google_storage_bucket_object" "error_404_html" {
  count         = var.use_static_hosting ? 1 : 0
  name          = "404.html"
  bucket        = google_storage_bucket.static_website[0].name
  source        = "${path.module}/../../static-site/production/404.html"
  content_type  = "text/html"
  cache_control = "public, max-age=60"
}

## HTTPS proxy and forwarding rule are unified in networking.tf
