# Finspeed Infrastructure - Terraform

This directory contains the Terraform configuration for the Finspeed application's GCP infrastructure.

## Overview

This configuration manages all cloud resources for the staging and production environments, including:

- VPC Networking (VPC, Subnets, Firewall Rules, VPC Connector)
- Cloud SQL for PostgreSQL (including a read replica for production)
- Cloud Run services for the API and Frontend applications
- Google Cloud Storage for Terraform state and application artifacts
- Secret Manager for sensitive data
- Cloud Load Balancing with IAP (Identity-Aware Proxy) for access control
- Workload Identity Federation for secure, keyless CI/CD authentication from GitHub Actions
- Cloud Monitoring (Dashboards, Uptime Checks, Alert Policies)

## Prerequisites

Before running Terraform commands locally, ensure you have the following installed and configured:

1.  **Terraform CLI:** (Version `1.5.0` or compatible)
2.  **Google Cloud SDK (`gcloud`):** Authenticated to the correct GCP project.
3.  **Permissions:** Your GCP user account must have sufficient IAM permissions to manage the resources defined in this configuration (e.g., `Owner`, `Editor`).

## Local Development Workflow

All local development and manual changes should be performed on a feature branch. **Do not use `terraform workspace` commands.** The configuration is designed to use a single, default workspace per environment, managed by the backend configuration.

### 1. Authenticate to GCP

Log in with your user account. This will be used by Terraform to provision resources.

```sh
gcloud auth application-default login
```

### 2. Initialize Terraform

From within the `infra/terraform` directory, initialize the backend. This only needs to be done once, or after making changes to provider or module versions.

```sh
terraform init
```

### 3. Run a Plan

To see what changes will be made, run a `plan`. Use the appropriate `.tfvars` file for the environment you are targeting.

**For Staging:**
```sh
terraform plan -var-file="environments/staging.tfvars"
```

**For Production:**
```sh
terraform plan -var-file="environments/production.tfvars"
```

### 4. Apply Changes

To apply the changes, use the `apply` command.

**For Staging:**
```sh
terraform apply -var-file="environments/staging.tfvars"
```

**For Production:**
```sh
terraform apply -var-file="environments/production.tfvars"
```

## CI/CD Pipeline

The CI/CD pipeline is managed by GitHub Actions, with separate workflows for staging and production.

-   **Staging (`.github/workflows/deploy-staging.yml`):** Triggered on pushes to the `develop` branch.
-   **Production (`.github/workflows/deploy-production.yml`):** Triggered on pushes to the `main` branch.

Both workflows perform the following steps:

1.  **Authenticate:** Uses Workload Identity Federation to securely authenticate to GCP without service account keys.
2.  **Terraform Apply:** Runs `terraform apply` to ensure the infrastructure is up-to-date.
3.  **Build & Deploy:** Builds the API and Frontend Docker images, pushes them to Artifact Registry, and deploys them to Cloud Run.
4.  **Database Migrations:** Runs the database migration job.
5.  **Smoke Tests:** Performs basic health checks against the deployed applications.

### Required GitHub Secrets

The pipelines require the following secrets to be configured in the GitHub repository's settings:

-   `WIF_PROVIDER_STAGING`: The full resource name of the Workload Identity Provider for staging.
-   `WIF_SERVICE_ACCOUNT_STAGING`: The email of the service account for staging.
-   `WIF_PROVIDER_PRODUCTION`: The full resource name of the Workload Identity Provider for production.
-   `WIF_SERVICE_ACCOUNT_PRODUCTION`: The email of the service account for production.

## State Management

The Terraform state is stored in a centralized Google Cloud Storage (GCS) bucket: `gs://finspeed-tf-state-central`.

The backend is configured in `backend.tf`. The path to the state file within the bucket is determined by the `prefix` key, which is set to `staging` or `production` based on the environment.

## Disaster Recovery

### State File Corruption or Loss

The GCS bucket for Terraform state has versioning enabled, providing a primary mechanism for recovery. You can restore a previous version of the `terraform.tfstate` object from the GCS console.

If the state file is unrecoverable, you must manually re-synchronize the state with the deployed infrastructure. This involves running `terraform import` for every single resource managed by the configuration. This is a time-consuming and error-prone process, so the GCS bucket should be protected with appropriate permissions and lifecycle policies.

### Accidental Manual Resource Deletion

If a resource managed by Terraform is accidentally deleted from the GCP console, recovery is straightforward:

1.  Run `terraform plan -var-file="environments/<env>.tfvars"`. It will detect the missing resource and plan to recreate it.
2.  Run `terraform apply -var-file="environments/<env>.tfvars"` to apply the plan and restore the resource.

### Full Environment Recreation

In the event of a catastrophic failure where an entire project or region must be rebuilt, this Terraform configuration serves as the blueprint. You can recreate the entire infrastructure from scratch by running `terraform apply` against a new GCP project, after updating the project ID and other variables in the corresponding `.tfvars` file.
