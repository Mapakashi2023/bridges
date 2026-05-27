# 🔐 How to Access Admin Login - Simple Guide

## Quick Steps (30 seconds!)

### 1️⃣ Start Everything
```bash
npm run dev:all
```

### 2️⃣ Open Browser
```
http://localhost:5173/login
```

### 3️⃣ Login
```
Username: WorldAdmin
Password: World@2026
```

### 4️⃣ Done! 🎉
You'll see the admin dashboard with all statistics!

---

## Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Terminal                                        │
│  ─────────────────                                       │
│  $ npm run dev:all                                       │
│                                                          │
│  ✓ Backend API:  http://localhost:8888                  │
│  ✓ Frontend:     http://localhost:5173                  │
└─────────────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────────────┐
│  Step 2: Browser                                         │
│  ────────────────                                        │
│  http://localhost:5173/login                            │
│                                                          │
│         ┌───────────────────────────┐                   │
│         │    🎓 Bridges LMS         │                   │
│         │  Sign in to your account  │                   │
│         │                           │                   │
│         │  Username: [WorldAdmin  ] │                   │
│         │  Password: [•••••••••   ] │                   │
│         │                           │                   │
│         │     [  Sign In  ]         │                   │
│         └───────────────────────────┘                   │
└─────────────────────────────────────────────────────────┘

                        ↓

┌─────────────────────────────────────────────────────────┐
│  Step 3: Admin Dashboard                                 │
│  ────────────────────                                    │
│  http://localhost:5173/admin/dashboard                  │
│                                                          │
│  📊 Statistics                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Users: 1 │ │Students:0│ │Teachers:0│ │Courses:0 │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  📝 Recent Enrollments                                   │
│  📚 Popular Courses                                      │
│                                                          │
│  [Logout]                                                │
└─────────────────────────────────────────────────────────┘
```

---

## All URLs at a Glance

| What | URL | Credentials |
|------|-----|-------------|
| **Login Page** | `http://localhost:5173/login` | See below ↓ |
| **Admin Dashboard** | `http://localhost:5173/admin/dashboard` | Requires login |
| **API Backend** | `http://localhost:8888/api` | N/A |
| **API Health Check** | `http://localhost:8888/api/health` | N/A |

**Admin Credentials:**
- Username: `WorldAdmin`
- Password: `World@2026`

---

## Troubleshooting

### ❌ Can't access login page?
**Make sure frontend is running:**
```bash
npm run dev
# Should show: http://localhost:5173
```

### ❌ Login button doesn't work?
**Make sure backend is running:**
```bash
npm run dev:api
# Should show: http://localhost:8888
```

### ❌ See "Connection error"?
**Start both together:**
```bash
npm run dev:all
```

---

## Quick Command Reference

| Command | What It Does |
|---------|--------------|
| `npm run dev:all` | Start frontend + backend together |
| `npm run dev` | Start frontend only (port 5173) |
| `npm run dev:api` | Start backend only (port 8888) |
| `./test-api.sh` | Test API endpoints |
| `npm run build` | Build for production |

---

## That's It! 🎉

You now have:
- ✅ Working login page
- ✅ Admin dashboard
- ✅ Live statistics
- ✅ Full authentication

**Start coding!** 🚀

---

**Need more details?** See [FRONTEND_LOGIN_GUIDE.md](./FRONTEND_LOGIN_GUIDE.md)
