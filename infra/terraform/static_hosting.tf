# Cloud Storage bucket for static website hosting
resource "google_storage_bucket" "static_website" {
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

# Make the bucket publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.static_website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloud CDN backend bucket
resource "google_compute_backend_bucket" "static_backend" {
  name        = "finspeed-static-backend-${local.environment}"
  bucket_name = google_storage_bucket.static_website.name
  enable_cdn  = true
  project     = local.project_id

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    max_ttl                      = 86400
    client_ttl                   = 3600
    negative_caching             = true
    serve_while_stale            = 86400
    
    cache_key_policy {
      include_host           = true
      include_protocol       = true
      include_query_string   = false
    }
  }
}

# Update URL map to route main domain to static hosting
resource "google_compute_url_map" "url_map_with_static" {
  count           = var.domain_name != "" ? 1 : 0
  name            = "finspeed-lb-url-map-${local.environment}"
  default_service = google_compute_backend_bucket.static_backend.id

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
    default_service = google_compute_backend_service.frontend_backend.id
  }

  # Main domain matcher with path-based routing
  path_matcher {
    name            = "main-matcher"
    default_service = google_compute_backend_bucket.static_backend.id

    # Route API calls to public API gateway
    path_rule {
      paths   = ["/api/*", "/api/v1/*"]
      service = google_compute_backend_service.api_gateway_backend.id
    }
  }
}

# Update SSL certificate to include admin subdomain
resource "google_compute_managed_ssl_certificate" "ssl_certificate_with_admin" {
  count = var.domain_name != "" && var.enable_ssl ? 1 : 0
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

# Update HTTPS proxy to use new URL map and certificate
resource "google_compute_target_https_proxy" "https_proxy_with_static" {
  count            = var.domain_name != "" ? 1 : 0
  name             = "finspeed-https-proxy-${local.environment}"
  url_map          = google_compute_url_map.url_map_with_static[0].id
  ssl_certificates = var.enable_ssl ? [google_compute_managed_ssl_certificate.ssl_certificate_with_admin[0].id] : []

  lifecycle {
    create_before_destroy = true
  }
}

# Update forwarding rule to use new proxy
resource "google_compute_global_forwarding_rule" "forwarding_rule_with_static" {
  count                 = var.domain_name != "" ? 1 : 0
  name                  = "finspeed-forwarding-rule-${local.environment}"
  target                = google_compute_target_https_proxy.https_proxy_with_static[0].id
  ip_address            = google_compute_global_address.lb_ip.address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
}
