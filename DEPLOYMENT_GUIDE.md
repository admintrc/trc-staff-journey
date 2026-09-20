# TRC Staff Journey - Azure Deployment Guide

## Quick Start (15 minutes to production)

### Prerequisites
- Azure CLI installed
- Terraform installed (v1.0+)
- Node.js 18+ installed
- Azure subscription (already configured)

### Step 1: Get Subscription ID

```bash
az account show --query id -o tsv
# Copy the output
```

### Step 2: Deploy Infrastructure with Terraform

```bash
cd infrastructure

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var "azure_subscription_id=YOUR_SUBSCRIPTION_ID" -out=tfplan

# Apply the infrastructure
terraform apply tfplan
```

This creates:
- ✅ PostgreSQL Database Server
- ✅ App Service (Backend API)
- ✅ Static Web App (Frontend)
- ✅ Storage Account
- ✅ All networking & security rules

### Step 3: Capture Deployment Outputs

```bash
terraform output -json > deployment-outputs.json
cat deployment-outputs.json
```

**Save these values:**
- `api_base_url`: Backend API endpoint
- `frontend_url`: Frontend website
- `database_connection_string`: Database connection

### Step 4: Deploy Backend

```bash
cd backend

# Install dependencies
npm install --production

# Create .env file for Azure
cat > .env << EOF
NODE_ENV=production
DB_HOST=<from terraform output>
DB_PORT=5432
DB_NAME=trc_staff_journey
DB_USER=<from terraform output>
DB_PASSWORD=<from terraform output>
JWT_SECRET=<from terraform output>
REACT_APP_API_URL=<api_base_url from terraform output>
EOF

# Deploy to Azure App Service
az webapp up --name trc-staff-journey-api-production --resource-group rg-trc-staff-journey-production --runtime "node|18-lts"
```

### Step 5: Deploy Frontend

```bash
cd frontend

# Build the React app
REACT_APP_API_URL=<api_base_url> npm run build

# Deploy to Static Web App
az staticwebapp upload \
  --name trc-staff-journey-web-production \
  --app-location "./build" \
  --output-location "build"
```

### Step 6: Configure CORS & API Integration

1. Go to App Service in Azure Portal
2. Settings → CORS
3. Add your Static Web App URL

### Step 7: Run Database Migrations

```bash
cd backend

# Run migrations on Azure database
npm run migrate

# Seed test data (optional)
npm run seed
```

### Step 8: Test

```bash
# Frontend: https://trc-staff-journey-web-production.azurewebsites.net
# Backend API: https://trc-staff-journey-api-production.azurewebsites.net

# Demo Login:
# Email: director@trc.com
# Password: Password123!
```

---

## Terraform Destruction (if needed)

```bash
terraform destroy -var "azure_subscription_id=YOUR_SUBSCRIPTION_ID"
```

---

## Key Features Deployed

✅ Full-stack MERN application  
✅ PostgreSQL database with auto-backups  
✅ Automatic SSL/TLS certificates  
✅ Auto-scaling App Service  
✅ CDN for frontend (Static Web Apps)  
✅ Environment-based configuration  
✅ Security best practices  

---

## Estimated Monthly Cost

- App Service (Basic B1): ~$15
- PostgreSQL Server: ~$30
- Static Web App: ~$0-15
- Storage: ~$1

**Total: ~$50-60/month**

---

## Support

For issues:
1. Check Azure Portal > Resource Group > Alerts
2. View logs: `az webapp log tail --name <app-name> --resource-group <rg-name>`
3. SSH into backend: `az webapp ssh --name <app-name> --resource-group <rg-name>`
