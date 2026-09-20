# TRC Staff Journey - Architecture

## System Overview

The TRC Staff Journey is a full-stack web application built with:
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Node.js/Express + TypeScript
- **Database:** PostgreSQL 12+
- **Cloud:** Microsoft Azure
- **IaC:** Terraform

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Azure Cloud Platform                       │
│                                                                   │
│  ┌──────────────────┐     ┌──────────────────┐                 │
│  │   Frontend       │     │   Backend API    │                 │
│  │  (Static Web App)│────▶│  (App Service)   │                 │
│  │   React 18       │     │  Node.js Express │                 │
│  └──────────────────┘     └──────────────────┘                 │
│           │                        │                             │
│           └────────────────────────┼─────────────────┐          │
│                                    │                  │          │
│                            ┌───────▼──────────┐      │          │
│                            │  PostgreSQL DB   │      │          │
│                            │  (Azure Database)│      │          │
│                            └──────────────────┘      │          │
│                                                       │          │
│                            ┌──────────────────────┐   │          │
│                            │  Storage Account     │◀──┘          │
│                            │  (File Storage)      │              │
│                            └──────────────────────┘              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  GitHub Actions  │ ─── CI/CD Pipeline
    │  (Deploy)        │
    └──────────────────┘
```

## Database Schema

### Core Tables

1. **users** - Authentication & user management
   - Role-based access control (staff, manager, director)
   - Email, password hash, status tracking

2. **staff** - Employee records
   - Position, department, hire date
   - Manager relationship, employment status
   - Probation tracking

3. **performance_reviews** - Review records
   - Probation, 6-month, annual reviews
   - Ratings, feedback, approval workflow

4. **training_records** - Compliance tracking
   - Training name, date, expiry
   - Certificate storage
   - Automated expiry alerts

5. **forms** - All 17 checklists/forms (C1-C17)
   - Dynamic JSON data storage
   - Status tracking (draft, submitted, approved)
   - Audit trail of changes

6. **supervision_records** - One-to-one notes
   - Supervision dates, topics
   - Action items, next session dates

7. **goals** - SMART goals & development
   - Goal tracking, target dates
   - Progress percentage, status

8. **reminders** - Notification system
   - Upcoming reviews, training expiry
   - Email delivery tracking

9. **audit_logs** - Compliance audit trail
   - Track all changes to staff/forms
   - User, timestamp, change details

## API Structure

### Authentication Routes
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — Login (returns JWT)
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh-token` — Token refresh

### Staff Routes
- `GET /api/staff` — List all staff (paginated)
- `GET /api/staff/me` — Current user profile
- `POST /api/staff` — Create staff record (manager/director only)
- `PUT /api/staff/:id` — Update staff record
- `GET /api/staff/:id/journey` — Personal journey timeline

### Forms Routes
- `GET /api/forms` — List all forms
- `POST /api/forms/:formType` — Submit form
- `GET /api/forms/:id` — Get form details
- `PUT /api/forms/:id` — Update form (draft only)

### Reports Routes
- `GET /api/reports/dashboard` — Dashboard metrics
- `GET /api/reports/monthly-hr-report` — Monthly report (director only)
- `GET /api/reports/compliance` — Compliance status

## Frontend Components

### Pages
- **LoginPage** — Authentication
- **Dashboard** — Main interface (role-based)
- **StaffDirectory** — Search & view staff
- **PersonalJourney** — Individual timeline
- **FormBuilder** — Dynamic form interface
- **Reports** — Analytics & reporting
- **OrgChart** — Organizational hierarchy

### Shared Components
- **ProtectedRoute** — Authorization wrapper
- **RoleGate** — Role-based UI rendering
- **Header** — Navigation & branding (TRC colors)
- **Sidebar** — Main menu
- **FormField** — Reusable form inputs
- **DataTable** — Sortable, filterable tables

## Security

### Authentication
- JWT tokens (24hr expiry)
- Role-based access control (RBAC)
- Refresh token mechanism

### Data Protection
- HTTPS/TLS 1.2+ required
- Database encryption at rest
- Environment variables for secrets
- No sensitive data in logs

### Audit Trail
- All changes logged to `audit_logs`
- User ID, timestamp, change details
- Cannot be modified or deleted

## Deployment Pipeline

### GitHub Actions CI/CD

```yaml
trigger: push to main
  ├─ Run tests
  ├─ Build Docker images
  ├─ Push to Azure Container Registry
  ├─ Deploy backend to App Service
  ├─ Deploy frontend to Static Web App
  └─ Run smoke tests
```

## Cost Estimation

### Monthly Azure Costs (estimated)
- **App Service (backend):** $50-100
- **PostgreSQL Database:** $100-150
- **Storage Account:** $20-50
- **Static Web App (frontend):** Free tier available
- **Total:** ~$200-300/month (dev) to $500+/month (production)

## Development Workflow

1. Clone repository
2. Set up `.env` from `.env.example`
3. Install dependencies: `npm install` (both frontend & backend)
4. Start backend: `npm run dev` (backend folder)
5. Start frontend: `npm run dev` (frontend folder)
6. Database: Connect to local PostgreSQL or Azure instance

## Deployment

### Prerequisites
- Azure subscription
- Terraform CLI
- Azure CLI
- GitHub account

### Deployment Steps

1. **Infrastructure Setup**
   ```bash
   cd infrastructure/terraform
   cp azure.tfvars.example azure.tfvars
   # Edit azure.tfvars with your values
   terraform plan
   terraform apply
   ```

2. **Database Migration**
   ```bash
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME < database/schema.sql
   ```

3. **Deploy Backend & Frontend**
   - Push to GitHub main branch
   - GitHub Actions automatically deploys

## Monitoring

- **Application Insights:** Backend API monitoring
- **Azure Monitor:** Infrastructure metrics
- **Alerts:** Review failures, system errors

## Next Steps

See phases in main README.md for detailed implementation roadmap.
