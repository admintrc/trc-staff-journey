# GitHub + Azure Deployment Setup

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `trc-staff-journey`
3. **Description:** TRC Staff Journey - HR Management System
4. **Visibility:** Private (recommended)
5. Click **Create repository**

---

## Step 2: Push Code to GitHub

```bash
cd C:/Users/SajeshPaul_onphpot/TRC-Staff-Journey

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/trc-staff-journey.git

# Push to main
git branch -M main
git push -u origin main
```

---

## Step 3: Configure GitHub Secrets

GitHub Actions needs Azure credentials. Add these secrets:

1. Go to **Settings → Secrets and variables → Actions**

2. Add **AZURE_CREDENTIALS**:
   ```bash
   az ad sp create-for-rbac --name trc-staff-journey --role contributor --scopes /subscriptions/09c606c3-0abb-4221-9de2-114f83d68732 --json
   ```
   Copy the entire JSON output and paste as `AZURE_CREDENTIALS`

3. Add **AZURE_API_URL**:
   ```
   https://trc-staff-journey-api.azurewebsites.net
   ```

4. Add **AZURE_STATIC_WEB_APPS_TOKEN**:
   - Go to Azure Portal → Static Web Apps → trc-staff-journey-web
   - Copy the deployment token

5. Add **DATABASE_CONNECTION_STRING**:
   ```
   postgresql://username:password@host:5432/trc_staff_journey
   ```

---

## Step 4: Create Azure Resources (One-time)

Run these commands in Azure CLI:

```bash
# Resource Group
az group create -n rg-trc-staff-journey -l australiaeast

# PostgreSQL
az postgres flexible-server create \
  -n trc-staff-journey-db \
  -g rg-trc-staff-journey \
  --admin-user trcadmin \
  --admin-password "STRONG_PASSWORD" \
  --database-name trc_staff_journey

# App Service Plan
az appservice plan create \
  -n asp-trc-staff-journey \
  -g rg-trc-staff-journey \
  --sku B1 --is-linux

# App Service (Backend)
az webapp create \
  -n trc-staff-journey-api \
  -g rg-trc-staff-journey \
  --plan asp-trc-staff-journey \
  --runtime "node|18-lts"

# Static Web App (Frontend)
az staticwebapp create \
  -n trc-staff-journey-web \
  -g rg-trc-staff-journey \
  --source https://github.com/YOUR_USERNAME/trc-staff-journey \
  --branch main \
  --app-location "frontend/build"
```

---

## Step 5: First Deployment

```bash
# Make a small change (e.g., update version)
echo "Version: 1.0.0" >> VERSION.txt
git add VERSION.txt
git commit -m "chore: Initial deployment to Azure"
git push
```

GitHub Actions will automatically:
1. ✅ Build backend
2. ✅ Build frontend
3. ✅ Deploy to Azure
4. ✅ Show status in GitHub

Watch progress: **GitHub → Actions tab**

---

## Step 6: Verify Deployment

```bash
# Check backend API
curl https://trc-staff-journey-api.azurewebsites.net/api/health

# Check frontend
https://trc-staff-journey-web.azurewebsites.net
```

Demo Login:
- Email: `director@trc.com`
- Password: `Password123!`

---

## Automatic Deployments (Now Enabled!)

Every time you push to `main`:
```bash
git add .
git commit -m "Feature: description"
git push
```

GitHub Actions automatically:
- Builds your code
- Runs tests (if configured)
- Deploys to Azure
- Sends notifications

---

## Monitoring & Logs

**GitHub Actions Log:**
- Go to repository → **Actions tab**
- Click workflow run to see logs

**Azure Logs:**
```bash
# View backend logs
az webapp log tail -n trc-staff-journey-api -g rg-trc-staff-journey

# View database
psql -h trc-staff-journey-db.postgres.database.azure.com \
  -U trcadmin -d trc_staff_journey
```

---

## Rollback (if needed)

```bash
# Revert last commit
git revert HEAD
git push

# GitHub Actions will deploy the previous version
```

---

## Cost Optimization

Change Azure SKUs to lower-cost options:
```bash
# Downgrade App Service to Free tier (limited)
az appservice plan update -n asp-trc-staff-journey -g rg-trc-staff-journey --sku F1

# Or keep at B1 (~$15/month)
```

---

## Support Commands

```bash
# Restart app service
az webapp restart -n trc-staff-journey-api -g rg-trc-staff-journey

# View app settings
az webapp config appsettings list -n trc-staff-journey-api -g rg-trc-staff-journey

# Stop app (save money during testing)
az webapp stop -n trc-staff-journey-api -g rg-trc-staff-journey

# Start app
az webapp start -n trc-staff-journey-api -g rg-trc-staff-journey
```

---

**Everything is set up! Ready to deploy?** 🚀
