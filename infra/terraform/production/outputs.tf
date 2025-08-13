output "workload_identity_provider" {
  description = "The full identifier of the Workload Identity Provider for Production"
  value       = module.finspeed_infra.workload_identity_provider
}

output "github_actions_service_account" {
  description = "Email of the service account for GitHub Actions for Production"
  value       = module.finspeed_infra.github_actions_service_account
}
