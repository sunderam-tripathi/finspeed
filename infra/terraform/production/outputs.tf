output "workload_identity_provider" {
  description = "The full identifier of the Workload Identity Provider for Production"
  value       = module.finspeed_infra.workload_identity_provider
}

output "github_actions_service_account" {
  description = "Email of the service account for GitHub Actions for Production"
  value       = module.finspeed_infra.github_actions_service_account
}

output "load_balancer_ip" {
  description = "The IP address of the external load balancer."
  value       = module.finspeed_infra.load_balancer_ip
}

output "iap_client_id" {
  description = "The client ID of the IAP OAuth client."
  value       = module.finspeed_infra.iap_client_id
}
