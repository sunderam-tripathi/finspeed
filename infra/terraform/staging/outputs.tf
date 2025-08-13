output "workload_identity_provider" {
  description = "The Workload Identity Provider for GitHub Actions."
  value       = module.finspeed_infra.workload_identity_provider
}

output "github_actions_service_account" {
  description = "The service account email for GitHub Actions."
  value       = module.finspeed_infra.github_actions_service_account
}
