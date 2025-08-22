# Track resource address change for function source bucket
moved {
  from = google_storage_bucket.function_source[0]
  to   = google_storage_bucket.function_source
}

# Preserve state when removing count from admin backend service
moved {
  from = google_compute_backend_service.frontend_backend_admin[0]
  to   = google_compute_backend_service.frontend_backend_admin
}
