# Frontend service configuration for the Finspeed application

variable "frontend_image" {
  description = "The full Docker image URL for the frontend service."
  type        = string
  default     = "asia-south2-docker.pkg.dev/finspeed-staging-st/finspeed-frontend-staging/finspeed-frontend-staging:latest"
}
