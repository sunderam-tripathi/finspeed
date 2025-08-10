# Finspeed Infrastructure

This directory contains the Terraform configuration and deployment scripts for the Finspeed e-commerce platform's Google Cloud Platform (GCP) infrastructure.

## Overview

The infrastructure is designed to be:
- **Scalable**: Auto-scaling Cloud Run services and read replicas for high traffic
- **Secure**: Private networking, SSL enforcement, and least-privilege IAM
- **Reliable**: Multi-zone deployment, automated backups, and comprehensive monitoring
- **Cost-optimized**: Environment-specific resource allocation and auto-scaling

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Cloud Run     │    │   Cloud Run     │
│   (Frontend)    │    │   (API)         │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │   VPC Network   │
         │   (Private)     │
         └─────────────────┘
                     │
         ┌─────────────────┐
         │   Cloud SQL     │
         │   (PostgreSQL)  │
         └─────────────────┘
```

## Components

### Core Infrastructure
- **VPC Network**: Private network with custom subnets
- **Cloud SQL**: PostgreSQL database with automated backups
- **Cloud Run**: Containerized services for API and frontend
- **Secret Manager**: Secure credential storage
- **Cloud Monitoring**: Uptime checks, alerts, and dashboards

### Security Features
- Private IP networking for database
- SSL enforcement on all connections
- Service accounts with minimal required permissions
- Firewall rules for controlled access

### Monitoring & Alerting
- Uptime checks for API and frontend endpoints
- Alert policies for downtime, high error rates, and latency
- Custom monitoring dashboard
- Email notifications for critical alerts

## Directory Structure

```
infra/
├── terraform/
│   ├── main.tf              # Provider and core infrastructure
│   ├── variables.tf         # Input variables
│   ├── database.tf          # Cloud SQL configuration
│   ├── cloud_run.tf         # Cloud Run services
│   ├── monitoring.tf        # Monitoring and alerting
│   ├── outputs.tf           # Output values
│   └── environments/
│       ├── staging.tfvars   # Staging environment config
│       └── production.tfvars # Production environment config
├── deploy.sh                # Deployment script
└── README.md               # This file
```

## Prerequisites

1. **Google Cloud CLI**: Install and authenticate
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   
   # Authenticate
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Terraform**: Install Terraform >= 1.0
   ```bash
   # On Ubuntu/Debian
   wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
   sudo apt update && sudo apt install terraform
   ```

3. **GCP Project**: Create and configure GCP projects
   ```bash
   # Create projects
   gcloud projects create finspeed-staging
   gcloud projects create finspeed-production
   
   # Set billing account (replace with your billing account ID)
   gcloud billing projects link finspeed-staging --billing-account=XXXXXX-XXXXXX-XXXXXX
   gcloud billing projects link finspeed-production --billing-account=XXXXXX-XXXXXX-XXXXXX
   ```

## Configuration

### Environment Variables

Before deploying, update the environment-specific configuration files:

1. **Staging** (`terraform/environments/staging.tfvars`):
   - Update `project_id` with your staging GCP project ID
   - Set `notification_email` for alerts
   - Optionally set `domain_name` if you have a staging domain

2. **Production** (`terraform/environments/production.tfvars`):
   - Update `project_id` with your production GCP project ID
   - Update `domain_name` with your production domain
   - Set `notification_email` for production alerts

### Terraform Backend

The configuration uses a GCS bucket for Terraform state. The bucket will be created automatically, but you may want to configure it manually for production:

```bash
# Create state bucket (optional - will be created automatically)
gsutil mb gs://finspeed-terraform-state-production
gsutil versioning set on gs://finspeed-terraform-state-production
```

## Deployment

### Using the Deployment Script

The `deploy.sh` script provides a safe and convenient way to deploy infrastructure:

```bash
# Make the script executable
chmod +x deploy.sh

# Plan staging deployment
./deploy.sh -e staging -a plan

# Apply staging deployment
./deploy.sh -e staging -a apply

# Plan production deployment
./deploy.sh -e production -a plan

# Apply production deployment (with confirmation)
./deploy.sh -e production -a apply

# Destroy staging infrastructure (for cleanup)
./deploy.sh -e staging -a destroy
```

### Manual Terraform Commands

If you prefer to use Terraform directly:

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var-file="environments/staging.tfvars"

# Apply deployment
terraform apply -var-file="environments/staging.tfvars"

# View outputs
terraform output
```

## Post-Deployment

After successful deployment, you'll receive important information including:

- **Database connection details**: For configuring your applications
- **Cloud Run service URLs**: For accessing your deployed services
- **Monitoring dashboard URL**: For observing system health
- **Secret Manager paths**: For retrieving database credentials

### Connecting Applications

Update your application configuration with the deployed infrastructure details:

1. **Database URL**: Retrieved from Secret Manager
2. **Service URLs**: Use the Cloud Run service URLs
3. **Environment variables**: Configure based on Terraform outputs

### Monitoring

Access your monitoring dashboard at:
```
https://console.cloud.google.com/monitoring/dashboards/custom/[DASHBOARD_ID]
```

Set up additional alerts as needed through the GCP Console.

## Cost Optimization

### Staging Environment
- Uses minimal instance sizes (`db-f1-micro`, `1 CPU/512Mi`)
- Scales to zero when not in use
- No deletion protection for easy cleanup

### Production Environment
- Uses production-ready instance sizes
- Maintains minimum instances for performance
- Includes read replicas and enhanced monitoring
- Deletion protection enabled

### Cost Monitoring

Monitor costs using:
```bash
# View current costs
gcloud billing budgets list --billing-account=YOUR_BILLING_ACCOUNT

# Set up budget alerts (optional)
gcloud billing budgets create --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="Finspeed Monthly Budget" \
  --budget-amount=100USD
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. **API Not Enabled**:
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sql-component.googleapis.com
   ```

3. **Insufficient Permissions**:
   Ensure your account has the following roles:
   - Compute Admin
   - Cloud Run Admin
   - Cloud SQL Admin
   - Security Admin
   - Monitoring Admin

4. **Terraform State Issues**:
   ```bash
   # Refresh state
   terraform refresh -var-file="environments/staging.tfvars"
   
   # Import existing resources if needed
   terraform import google_project_service.compute projects/PROJECT_ID/services/compute.googleapis.com
   ```

### Getting Help

- Check Terraform logs for detailed error messages
- Review GCP Console for resource status
- Verify IAM permissions and API enablement
- Consult the [Terraform Google Provider documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

## Security Considerations

- Database uses private IP and SSL enforcement
- Service accounts follow least-privilege principle
- Secrets are managed through Secret Manager
- Network access is controlled via VPC and firewall rules
- Regular security updates should be applied to container images

## Backup and Disaster Recovery

- Automated daily database backups with 7-day retention
- Point-in-time recovery available for the last 7 days
- Cross-region backup storage for production
- Infrastructure as Code allows quick environment recreation

## Contributing

When making changes to the infrastructure:

1. Test changes in staging first
2. Use feature branches for infrastructure changes
3. Review Terraform plans carefully before applying
4. Update documentation for any architectural changes
5. Consider cost implications of resource changes

## Support

For infrastructure issues or questions:
- Create an issue in the project repository
- Contact the DevOps team
- Review GCP documentation and best practices
