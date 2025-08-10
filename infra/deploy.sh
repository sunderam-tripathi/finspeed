#!/bin/bash
# Finspeed Infrastructure Deployment Script
# This script deploys the GCP infrastructure using Terraform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="staging"
ACTION="plan"
AUTO_APPROVE=false
DESTROY=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Environment to deploy (staging|production) [default: staging]"
    echo "  -a, --action ACTION      Terraform action (plan|apply|destroy) [default: plan]"
    echo "  -y, --auto-approve       Auto-approve terraform apply (use with caution)"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -e staging -a plan                    # Plan staging deployment"
    echo "  $0 -e staging -a apply                   # Apply staging deployment"
    echo "  $0 -e production -a apply -y             # Apply production deployment with auto-approve"
    echo "  $0 -e staging -a destroy                 # Destroy staging infrastructure"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -a|--action)
            ACTION="$2"
            shift 2
            ;;
        -y|--auto-approve)
            AUTO_APPROVE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    print_error "Environment must be 'staging' or 'production'"
    exit 1
fi

# Validate action
if [[ "$ACTION" != "plan" && "$ACTION" != "apply" && "$ACTION" != "destroy" ]]; then
    print_error "Action must be 'plan', 'apply', or 'destroy'"
    exit 1
fi

# Set destroy flag
if [[ "$ACTION" == "destroy" ]]; then
    DESTROY=true
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI is not installed. Please install gcloud first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Authenticate with Google Cloud
authenticate_gcp() {
    print_status "Checking Google Cloud authentication..."
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &> /dev/null; then
        print_warning "Not authenticated with Google Cloud. Please run 'gcloud auth login'"
        exit 1
    fi
    
    print_success "Google Cloud authentication verified"
}

# Initialize Terraform
init_terraform() {
    print_status "Initializing Terraform..."
    
    cd terraform
    
    # Initialize Terraform
    terraform init
    
    print_success "Terraform initialized successfully"
}

# Validate Terraform configuration
validate_terraform() {
    print_status "Validating Terraform configuration..."
    
    terraform validate
    
    if [ $? -eq 0 ]; then
        print_success "Terraform configuration is valid"
    else
        print_error "Terraform configuration validation failed"
        exit 1
    fi
}

# Plan Terraform deployment
plan_terraform() {
    print_status "Planning Terraform deployment for $ENVIRONMENT environment..."
    
    local var_file="environments/${ENVIRONMENT}.tfvars"
    
    if [[ ! -f "$var_file" ]]; then
        print_error "Environment file $var_file not found"
        exit 1
    fi
    
    if [[ "$DESTROY" == "true" ]]; then
        terraform plan -destroy -var-file="$var_file" -out="${ENVIRONMENT}-destroy.tfplan"
        print_warning "Destroy plan created. Review carefully before applying!"
    else
        terraform plan -var-file="$var_file" -out="${ENVIRONMENT}.tfplan"
        print_success "Plan created successfully"
    fi
}

# Apply Terraform deployment
apply_terraform() {
    print_status "Applying Terraform deployment for $ENVIRONMENT environment..."
    
    local plan_file
    if [[ "$DESTROY" == "true" ]]; then
        plan_file="${ENVIRONMENT}-destroy.tfplan"
        print_warning "This will DESTROY infrastructure in $ENVIRONMENT environment!"
    else
        plan_file="${ENVIRONMENT}.tfplan"
        print_status "This will CREATE/UPDATE infrastructure in $ENVIRONMENT environment"
    fi
    
    if [[ ! -f "$plan_file" ]]; then
        print_error "Plan file $plan_file not found. Run plan first."
        exit 1
    fi
    
    # Confirmation for production
    if [[ "$ENVIRONMENT" == "production" && "$AUTO_APPROVE" == "false" ]]; then
        echo ""
        print_warning "You are about to modify PRODUCTION infrastructure!"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [[ "$confirm" != "yes" ]]; then
            print_status "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Apply the plan
    if [[ "$AUTO_APPROVE" == "true" ]]; then
        terraform apply -auto-approve "$plan_file"
    else
        terraform apply "$plan_file"
    fi
    
    if [ $? -eq 0 ]; then
        if [[ "$DESTROY" == "true" ]]; then
            print_success "Infrastructure destroyed successfully"
        else
            print_success "Infrastructure deployed successfully"
            
            # Show important outputs
            print_status "Deployment information:"
            terraform output deployment_info
        fi
    else
        print_error "Terraform apply failed"
        exit 1
    fi
}

# Main execution
main() {
    print_status "Starting Finspeed infrastructure deployment"
    print_status "Environment: $ENVIRONMENT"
    print_status "Action: $ACTION"
    
    check_dependencies
    authenticate_gcp
    init_terraform
    validate_terraform
    
    case $ACTION in
        plan)
            plan_terraform
            ;;
        apply)
            plan_terraform
            apply_terraform
            ;;
        destroy)
            plan_terraform
            apply_terraform
            ;;
    esac
    
    print_success "Deployment script completed successfully!"
}

# Run main function
main
