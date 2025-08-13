terraform {
  backend "gcs" {
    bucket  = "finspeed-st-tf-state"
    prefix  = "staging"
  }
}
