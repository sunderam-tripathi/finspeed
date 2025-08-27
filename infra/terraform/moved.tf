# Removed conflicting moved block for function_source - keeping resource with count index

# Preserve state when removing count from admin backend service
moved {
  from = google_compute_backend_service.frontend_backend_admin[0]
  to   = google_compute_backend_service.frontend_backend_admin
}
