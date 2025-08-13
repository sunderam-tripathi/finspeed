terraform {
  backend "gcs" {
    bucket  = "finspeed-st-tf-state-prod"
    prefix  = "production"
  }
}
