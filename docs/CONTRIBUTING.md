# Contributing to TRC Staff Journey

## Development Environment

### Requirements
- Node.js 18+
- PostgreSQL 12+
- Terraform 1.0+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/trc-staff-journey.git
   cd trc-staff-journey
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local values
   npm install
   npm run dev
   ```

3. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   ```bash
   psql -U postgres
   CREATE DATABASE trc_staff_journey;
   \c trc_staff_journey
   \i ../database/schema.sql
   ```

## Code Style

- **TypeScript strict mode required**
- **ESLint** for linting
- **Prettier** for formatting
- **camelCase** for variables/functions
- **PascalCase** for components/classes

## Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit with clear messages**
   ```bash
   git commit -m "feat: add onboarding checklist form"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Add description of changes
   - Reference related issues

## Phases Overview

- **Week 1-2:** Foundation (current)
- **Week 3-4:** Dashboard & Auth
- **Week 5-6:** Handbook & search
- **Week 7-8:** Forms (C1-C8)
- **Week 9-10:** Forms (C9-C17)
- **Week 11-12:** Reports & launch

## Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deployment

See `DEPLOYMENT.md` for Azure/GitHub Actions setup.
