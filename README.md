# TRC Staff Journey Web App

A comprehensive HR management system for The Rehab Centre, replacing the Staff Journey Book document with a live, interactive web application.

**Status:** Phase 1 - Foundation & Infrastructure (Starting: 20 Sept 2026)

## Project Overview

- **Timeline:** 8-12 weeks
- **Cloud:** Microsoft Azure
- **Team:** Claude (Full-stack development)
- **Tech Stack:** React 18 + TypeScript + Node.js/Express + PostgreSQL

## Features

✅ **Dashboard** — Real-time staff metrics, compliance tracking, analytics
✅ **Personal Journey** — Each staff member tracks their onboarding/reviews/development
✅ **Digital Forms** — All 17 checklists/forms (C1-C17) automated
✅ **Searchable Handbook** — Parts A & B of Staff Journey Book
✅ **Manager Portal** — Hire, onboard, review, train staff
✅ **Reminders** — Email alerts for reviews, training expiry, tasks
✅ **Org Chart** — Visual hierarchy with staff information
✅ **Reports** — Monthly HR reports, compliance matrix, analytics
✅ **Audit Trail** — Track all HR changes for compliance

## Directory Structure

```
TRC-Staff-Journey/
├── frontend/              # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── infrastructure/        # Azure Infrastructure-as-Code
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── azure.tfvars.example
│   └── README.md
├── database/             # SQL schemas
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
└── README.md
```

## Quick Start

### Phase 1: Foundation (Week 1-2)

1. **Backend Setup**
   - Express API scaffolding
   - PostgreSQL database connection
   - Authentication (JWT + role-based access)
   - Core API routes

2. **Frontend Setup**
   - React project with TypeScript
   - Authentication flow
   - Layout & navigation

3. **Infrastructure**
   - Azure Resource Group
   - Azure Database for PostgreSQL
   - App Service for backend
   - Static Web App for frontend

4. **Database Schema**
   - Users, roles, permissions
   - Staff, employment, reviews
   - Forms, checklists, audit logs

### Phases 2-6 (Weeks 3-12)

See `/docs/ARCHITECTURE.md` for full roadmap.

## Team

- **Claude Haiku 4.5** — Full-stack development
- **Sajesh Paul, Director** — Product owner

## Contributing

See `CONTRIBUTING.md` for development guidelines.

## Licensing

Internal TRC use only.
