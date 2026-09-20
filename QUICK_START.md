# 🚀 Quick Start (5 Minutes)

## Prerequisites
- Node.js 18+, npm 8+
- PostgreSQL 12+ installed & running
- Git

## 1. Set Up Database (2 min)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE trc_staff_journey;"

# Load schema
psql -U postgres -d trc_staff_journey -f database/schema.sql

# Verify
psql -U postgres -d trc_staff_journey -c "SELECT COUNT(*) FROM users;"
```

## 2. Create .env Files (1 min)

**Backend** (`backend/.env`):
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trc_staff_journey
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_secret_key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 3. Start Development Servers (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Should show: `✓ Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Should open http://localhost:3000 automatically

## Done! 🎉

- Backend API: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- Database: Connected via localhost:5432

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Port 5000 in use` | `npm run dev PORT=5001` or kill process |
| `DB connection failed` | Check PostgreSQL is running, verify .env |
| `npm command not found` | Reinstall Node.js, restart terminal |
| `react-scripts not found` | `cd frontend && npm install && npm start` |

## Common Commands

```bash
# Stop servers
Ctrl+C (in each terminal)

# View logs
tail -f backend.log  # Create if needed

# Test API
curl http://localhost:5000/api/health

# Reset database
psql -U postgres -d trc_staff_journey -f database/schema.sql

# View all staff
psql -U postgres -d trc_staff_journey -c "SELECT * FROM staff;"
```

## Next: Phase 2

Once this works, you're ready to build:
- ✅ Authentication (login/register)
- ✅ Dashboard
- ✅ Digital forms

See `docs/ARCHITECTURE.md` for full details.

---

**Questions?** See `LOCAL_DEV_SETUP.md` for detailed troubleshooting.
