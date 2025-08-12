terraform {
  backend "gcs" {
    bucket  = "finspeed-tfstate-finspeed-staging"
    prefix  = "staging"
  }
}
