# Phase 2: Authentication & Dashboard - Testing Guide

## 🚀 Quick Start (After Setup)

### Terminal 1: Start Backend

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

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

This opens http://localhost:3000 in your browser.

---

## 🧪 Testing Credentials

Three demo users have been seeded:

### Director (Full Access)
- **Email:** director@trc.com
- **Password:** Password123!
- **Role:** director
- **Access:** All features, org-wide analytics

### Manager (Team Management)
- **Email:** manager@trc.com
- **Password:** Password123!
- **Role:** manager
- **Access:** Team management, reviews, training

### Staff (Personal Only)
- **Email:** staff@trc.com
- **Password:** Password123!
- **Role:** staff
- **Access:** Personal journey, handbook, training records

---

## ✅ What to Test

### 1. Login Page
- [x] Visit http://localhost:3000
- [x] Demo credentials pre-filled
- [x] Beautiful TRC branding (maroon #82181b, red #ed2d29)
- [x] Error handling for wrong credentials
- [x] Loading state on submit button

### 2. Authentication
- [x] Try logging in with each role
- [x] Check browser DevTools → Application → localStorage
  - Should see: `accessToken`, `refreshToken`, `user`
- [x] JWT tokens valid for 24 hours
- [x] Refresh token valid for 7 days

### 3. Dashboard (Different Per Role)

#### Director View
```
Dashboard Overview
- 47 Active Staff (metric)
- 6 Pending Reviews (metric)
- 89% Training Compliance (metric)
- 3 Pending Tasks (metric)

Director Tools
- Monthly HR reports
- Organization-wide compliance tracking
- Staff performance analytics
- Budget & staffing forecasts
```

#### Manager View
Same metrics + Manager-specific tools

#### Staff View
Same metrics + Staff-specific content

### 4. Navigation
- [x] Click between tabs: Overview, Staff, Forms, Handbook, Reports
- [x] All tabs load (content coming in later phases)
- [x] Logout button works → redirects to login

### 5. Protected Routes
- [x] Try accessing http://localhost:3000/dashboard without login
  - Should redirect to /login
- [x] Clear localStorage, refresh page
  - Should redirect to /login

### 6. API Testing (Postman/curl)

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "director@trc.com",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "director@trc.com",
      "firstName": "Sajesh",
      "lastName": "Paul",
      "role": "director"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

#### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

#### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refreshToken>"}'
```

---

## 🐛 Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running and database exists
psql -U postgres -d trc_staff_journey -c "SELECT COUNT(*) FROM users;"

# Should show: count = 3 (demo users)
```

### "Invalid email or password"
- Check demo users are created
- Run in backend folder: `npm run dev` (auto-creates demo users)
- Check database: `SELECT * FROM users;`

### "Cannot POST /api/auth/login"
- Backend not running on port 5000
- Check terminal output for errors
- Kill process: `lsof -i :5000 | kill -9 ...`

### "Frontend won't build"
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### "Login works but dashboard blank"
- Check browser console (F12) for errors
- Check Network tab for failed API calls
- Verify `.env` files are correct

---

## 📊 Database Check

### View all users
```bash
psql -U postgres -d trc_staff_journey
SELECT id, email, role, status, created_at FROM users;
```

### View recent logins
```sql
SELECT id, email, last_login FROM users ORDER BY last_login DESC;
```

### Clear demo data (if needed)
```sql
DELETE FROM users;
```

Then restart backend to re-seed.

---

## 🔒 Security Notes

**Development Only:**
- Demo passwords are plain text in code
- JWT_SECRET is in .env (change for production)
- No rate limiting (add for production)
- No HTTPS (Azure handles for production)

**For Production:**
- Use strong JWT_SECRET
- Hash passwords (done ✓)
- Enable HTTPS
- Add rate limiting
- Implement refresh token rotation
- Add 2FA for directors

---

## 🎯 What's Working

✅ User registration
✅ User login with JWT
✅ Token refresh
✅ Password hashing (bcrypt)
✅ Role-based dashboard views
✅ Protected routes
✅ Logout
✅ User profile display
✅ Demo data seeding

---

## 📋 What's Next (Phase 3+)

| Feature | Phase | Status |
|---------|-------|--------|
| Staff Directory | 3 | Coming |
| Handbook Search | 3 | Coming |
| Digital Forms C1-C8 | 4 | Coming |
| Digital Forms C9-C17 | 5 | Coming |
| Reports & Analytics | 6 | Coming |
| Org Chart | 6 | Coming |

---

## 📞 Common Questions

**Q: How do I add a new user?**
A: API endpoint: `POST /api/auth/register` (coming with frontend form in Phase 3)

**Q: How do I reset a password?**
A: Password reset feature coming in Phase 3

**Q: Can I change the demo password?**
A: Yes, hash a new one: `AuthService.hashPassword('newpass')` or use the API

**Q: How long are tokens valid?**
A: Access token: 24 hours, Refresh token: 7 days (set in .env)

---

**Ready to test? Start the servers and try logging in! 🚀**
