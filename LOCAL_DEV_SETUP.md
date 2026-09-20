# Local Development Setup Guide

**Status:** ✅ Dependencies installed and verified  
**Last updated:** 20 Sept 2026

## ✅ What's Been Completed

- ✅ Backend dependencies installed (448 packages)
- ✅ Frontend dependencies installed (850+ packages)
- ✅ Backend TypeScript build successful (`dist/` folder created)
- ✅ Environment files created (`.env`)
- ✅ Frontend build in progress (React compiles on first build)

## 📋 Prerequisites

- **Node.js:** v18+ (Check: `node --version`)
- **npm:** v8+ (Check: `npm --version`)
- **PostgreSQL:** v12+ (local or cloud)
- **Git:** For version control

## 🗄️ Database Setup

### Option A: Local PostgreSQL (Recommended for Development)

#### Windows (PowerShell)
```powershell
# Install PostgreSQL from https://www.postgresql.org/download/windows/
# Create database
psql -U postgres
```

Then in psql:
```sql
CREATE DATABASE trc_staff_journey;
\c trc_staff_journey
\i 'C:/path/to/database/schema.sql'
```

#### Mac (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb trc_staff_journey
psql trc_staff_journey < database/schema.sql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb trc_staff_journey
psql -U postgres -d trc_staff_journey -f database/schema.sql
```

### Option B: Azure PostgreSQL (Cloud - for testing)

```bash
# Connection string format:
postgres://username:password@server.postgres.database.azure.com:5432/trc_staff_journey?sslmode=require
```

### Verify Database Connection

```bash
psql -h localhost -U postgres -d trc_staff_journey -c "SELECT COUNT(*) FROM users;"
```

Expected output: `(1 row) with count = 0`

## 🚀 Running the Application

### Terminal 1: Start Backend API

```bash
cd backend
npm run dev
```

Expected output:
```
✓ Database connected
✓ Server running on port 5000
✓ Environment: development
```

Test health endpoint:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"OK","timestamp":"2026-09-20T..."}
```

### Terminal 2: Start Frontend (after Terminal 1 ready)

```bash
cd frontend
npm start
```

Expected output:
```
webpack compiled
Compiled successfully!
You can now view trc-staff-journey-frontend in the browser.
Local: http://localhost:3000
```

### Terminal 3 (Optional): Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🔑 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trc_staff_journey
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_dev_secret_key_here
JWT_EXPIRES_IN=24h

# Optional (for file uploads)
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=

# Optional (for email)
SMTP_HOST=
SMTP_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 First-Time Setup Checklist

- [ ] Clone repository: `git clone <repo-url>`
- [ ] Install backend deps: `cd backend && npm install`
- [ ] Install frontend deps: `cd frontend && npm install`
- [ ] Create local PostgreSQL database
- [ ] Load schema: `psql ... -f database/schema.sql`
- [ ] Create `.env` files (backend & frontend)
- [ ] Start backend: `npm run dev` (in backend folder)
- [ ] Start frontend: `npm start` (in frontend folder)
- [ ] Visit http://localhost:3000 in browser

## 🐛 Troubleshooting

### Backend won't start

**Error:** `listen EADDRINUSE :::5000`
```bash
# Port 5000 already in use, kill process or change PORT in .env
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

**Error:** `Database connection failed`
```bash
# Check PostgreSQL is running
# Windows: Services > PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Verify connection string in .env
psql -h localhost -U postgres -d trc_staff_journey
```

### Frontend won't compile

**Error:** `react-scripts: command not found`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Error:** Port 3000 in use
```bash
# Change port:
PORT=3001 npm start
```

### TypeScript errors

All errors should be caught during `npm run build`. If you see red squiggles in your editor:
- Restart your IDE
- Run `npm install` again
- Check that tsconfig.json exists

## 📊 Development Workflow

### Making Changes

1. **Backend changes:** Edit in `src/` → auto-restarts with `ts-node-dev`
2. **Frontend changes:** Edit in `frontend/src/` → hot reload (automatic)
3. **Database schema:** Update `database/schema.sql` → restart backend

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# Test locally
npm run build  # Backend
npm run test   # Both

# Commit
git add .
git commit -m "feat: your feature description"

# Push
git push origin feature/your-feature
```

## 📦 Build for Production

### Backend

```bash
cd backend
npm run build
npm start  # Runs dist/server.js
```

### Frontend

```bash
cd frontend
npm run build  # Creates build/ folder (optimized)
```

Deploy `build/` folder to Azure Static Web App.

## 🧪 Testing Locally

### Backend API

```bash
# Login (will be implemented in Phase 2)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trc.com","password":"password"}'

# Get dashboard metrics
curl http://localhost:5000/api/reports/dashboard \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Frontend

- Open http://localhost:3000
- Expected: TRC branding with login page (coming in Phase 2)
- Check browser console (F12) for any errors

## 📚 Useful Commands

```bash
# Backend development
npm run dev        # Start with hot reload
npm run build      # Compile TypeScript
npm test           # Run tests
npm start          # Run compiled version

# Frontend development
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Advanced: expose config

# Database
psql -h localhost -U postgres
\dt               # List all tables
\d users          # Describe 'users' table
SELECT * FROM users;
```

## 🚀 Next Steps (Phase 2)

Once local development is working:

1. **Implement Authentication** (Week 3)
   - Login/register endpoints
   - JWT token generation
   - User session management

2. **Build Dashboard** (Week 3-4)
   - Main dashboard layout (TRC colors)
   - Role-based views (staff/manager/director)
   - Staff metrics display

3. **API Endpoints** (Week 4)
   - GET /api/staff
   - GET /api/staff/me
   - POST /api/forms
   - GET /api/reports/dashboard

## 💡 Tips

- **Keep `.env` secure** — Never commit to git (already in .gitignore)
- **Use `npm run dev`** — Not `node dist/server.js` during development
- **Check logs** — Both backend & frontend output useful error messages
- **Database backups** — `pg_dump -U postgres trc_staff_journey > backup.sql`
- **Browser DevTools** — F12 to debug frontend, Network tab for API calls

## 📞 Support

If you encounter issues:

1. Check the relevant error message above
2. Review `.env` configuration
3. Verify database connection
4. Check that all dependencies installed: `npm list --depth=0`
5. Try clearing cache: `npm cache clean --force`

---

**Happy coding! You're ready to start Phase 2. 🚀**
