# Azure AD SSO + Custom Domain Setup

## Complete Guide: trchr.trcclininc.com.au with Microsoft Login

---

## PART 1: CUSTOM DOMAIN SETUP

### Step 1: Configure DNS

In your domain registrar (GoDaddy, NameCheap, etc.), add:

**CNAME Record:**
```
Host: trchr.trcclininc.com.au
Points to: trc-staff-journey-api.azurewebsites.net
TTL: 3600
```

**Wait 5-10 minutes for DNS to propagate**

### Step 2: Add Domain to Azure App Service

```bash
# Add custom domain to backend
az webapp config hostname add \
  -n trc-staff-journey-api \
  -g rg-trc-staff-journey \
  --hostname trchr.trcclininc.com.au

# Add SSL certificate (automatic with Azure)
az webapp config ssl bind \
  -n trc-staff-journey-api \
  -g rg-trc-staff-journey \
  --certificate-thumbprint <thumbprint>
```

### Step 3: Update Frontend CORS

```bash
az webapp config appsettings set \
  -n trc-staff-journey-api \
  -g rg-trc-staff-journey \
  --settings CORS_ORIGINS="https://trchr.trcclininc.com.au"
```

---

## PART 2: AZURE AD SSO SETUP

### Step 1: Create Azure AD App Registration

**Via Azure Portal:**

1. Go to **Azure Active Directory → App registrations → New registration**
2. Name: `TRC Staff Journey`
3. Supported account types: **Accounts in this organizational directory only** (Your TRC organization)
4. Redirect URI:
   ```
   https://trchr.trcclininc.com.au/api/auth/callback
   ```
5. Click **Register**

### Step 2: Get Client Credentials

In the app registration, go to:

**Client ID:** Copy from Overview page
```
Example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Client Secret:** 
1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `TRC Staff Journey Production`
4. Expiry: `12 months`
5. Copy the value (shows only once!)

### Step 3: Add API Permissions

In your app registration:

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`

6. Click **Grant admin consent**

### Step 4: Configure Azure App Service Environment Variables

```bash
az webapp config appsettings set \
  -n trc-staff-journey-api \
  -g rg-trc-staff-journey \
  --settings \
    AZURE_AD_TENANT="your-tenant-id-or-common" \
    AZURE_AD_CLIENT_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
    AZURE_AD_CLIENT_SECRET="your-secret-value" \
    REDIRECT_URI="https://trchr.trcclininc.com.au/api/auth/callback" \
    REACT_APP_API_URL="https://trchr.trcclininc.com.au"
```

---

## PART 3: FRONTEND LOGIN FLOW

Update Frontend Login Component:

```typescript
// src/pages/LoginPage.tsx

const handleMicrosoftLogin = () => {
  window.location.href = 'https://trchr.trcclininc.com.au/api/auth/login/azuread';
};

return (
  <div>
    <button onClick={handleMicrosoftLogin}>
      🔐 Login with Microsoft Account
    </button>
  </div>
);
```

---

## PART 4: UPDATE BACKEND CONFIGURATION

### File: `.env` (Production)

```env
# Azure AD Configuration
AZURE_AD_TENANT=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-secret
REDIRECT_URI=https://trchr.trcclininc.com.au/api/auth/callback

# Application
NODE_ENV=production
JWT_SECRET=your-jwt-secret-key
REACT_APP_API_URL=https://trchr.trcclininc.com.au

# Database
DB_HOST=trc-staff-journey-db.postgres.database.azure.com
DB_PORT=5432
DB_NAME=trc_staff_journey
DB_USER=trcadmin
DB_PASSWORD=your-db-password

# CORS
CORS_ORIGINS=https://trchr.trcclininc.com.au
```

---

## PART 5: SSO WORKFLOW

### What Happens When Staff Login:

1. **Staff clicks "Login with Microsoft"**
   ```
   ↓
   ```

2. **Redirected to Microsoft login**
   ```
   User enters: firstname.lastname@trcclininc.com.au
   Password: Their Windows/Microsoft password
   ↓
   ```

3. **Azure AD validates credentials**
   ```
   ✓ Valid? Continue
   ✗ Invalid? Show error
   ↓
   ```

4. **Callback to our app with authorization code**
   ```
   /api/auth/callback?code=xxx&state=yyy
   ↓
   ```

5. **Backend exchanges code for token**
   ```
   Calls Azure AD token endpoint
   Gets user info: name, email, ID
   ↓
   ```

6. **Backend creates JWT and redirects to app**
   ```
   Redirect to: https://trchr.trcclininc.com.au?token=jwt
   ↓
   ```

7. **Frontend stores token and shows dashboard**
   ```
   ✅ Staff now logged in
   ↓
   ```

---

## PART 6: ROLE-BASED ACCESS

### Automatic Role Assignment:

```typescript
// In backend: getRole() function

function getRole(email: string): 'staff' | 'manager' | 'director' {
  // Option 1: Email-based
  if (email.includes('director')) return 'director';
  if (email.includes('manager')) return 'manager';
  return 'staff';
  
  // Option 2: Azure AD Groups (better)
  // Check user's Azure AD group membership
}
```

### Recommended: Use Azure AD Groups

1. In **Azure AD → Groups**, create:
   - `TRC-Directors`
   - `TRC-Managers`
   - `TRC-Staff`

2. Add staff to appropriate groups

3. Backend reads groups from token and assigns role

---

## PART 7: TESTING

### Test Flow:

```bash
# 1. Verify domain resolves
nslookup trchr.trcclininc.com.au
# Should return: trc-staff-journey-api.azurewebsites.net

# 2. Test backend API
curl https://trchr.trcclininc.com.au/api/health
# Should return: {"status":"ok"}

# 3. Test Azure AD login endpoint
curl https://trchr.trcclininc.com.au/api/auth/login/azuread
# Should redirect to Microsoft login

# 4. Login as test user
# Use: firstname.lastname@trcclininc.com.au
# Password: Your corporate password
```

### Test Users:

```
Director: director@trcclininc.com.au / password
Manager: manager@trcclininc.com.au / password
Staff: staff@trcclininc.com.au / password
```

---

## PART 8: TROUBLESHOOTING

### Issue: "Redirect URI mismatch"
**Solution:** Check that redirect URI in Azure AD matches exactly:
```
https://trchr.trcclininc.com.au/api/auth/callback
```

### Issue: "Invalid tenant"
**Solution:** Use tenant ID instead of "common":
```bash
AZURE_AD_TENANT=12345678-1234-1234-1234-123456789012
```

### Issue: "SSL certificate error"
**Solution:** Azure App Service auto-provisions SSL via Let's Encrypt. Wait 5 mins and retry.

### Issue: "CORS error"
**Solution:** Verify CORS_ORIGINS environment variable is set:
```bash
CORS_ORIGINS=https://trchr.trcclininc.com.au
```

---

## PART 9: PRODUCTION CHECKLIST

- [ ] DNS record (CNAME) added and propagated
- [ ] Custom domain added to App Service
- [ ] SSL certificate active (https://)
- [ ] Azure AD app registration created
- [ ] Client ID and Secret obtained
- [ ] API permissions granted
- [ ] Environment variables set in App Service
- [ ] Frontend login component updated
- [ ] Backend Azure AD routes deployed
- [ ] Test login successful
- [ ] Staff can access dashboard after login
- [ ] Roles assigned correctly

---

## FINAL RESULT

✅ Staff navigate to: **https://trchr.trcclininc.com.au**

✅ Click "Login with Microsoft"

✅ Enter corporate credentials (firstname.lastname@trcclininc.com.au)

✅ Automatically logged in with correct role

✅ Full TRC Staff Journey system accessible

---

**All staff now use their Microsoft credentials to access the system!** 🎉
