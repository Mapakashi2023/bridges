# Bridges LMS - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- Terminal/Command line access

---

## Step 1: Verify Installation ✅

The project has been set up with everything you need:

```bash
# Check if dependencies are installed
ls node_modules/

# You should see @neondatabase, express, bcryptjs, etc.
```

---

## Step 2: Start the API Server 🔧

```bash
npm run dev:api
```

You should see:
```
🚀 Server running on http://localhost:8888
✅ Database initialized
✅ Admin user ready
```

---

## Step 3: Test the API 🧪

Open a new terminal and run:

```bash
./test-api.sh
```

Or test manually:

```bash
# Health check
curl http://localhost:8888/api/health

# Admin login
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"WorldAdmin","password":"World@2026"}'
```

---

## Step 4: Explore the API 📚

### Login as Admin

**Request:**
```bash
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "WorldAdmin",
    "password": "World@2026"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "WorldAdmin",
      "email": "admin@bridges.edu",
      "role": "admin",
      ...
    }
  }
}
```

**Save the token** - you'll need it for authenticated requests!

---

### Get Admin Dashboard

```bash
# Replace YOUR_TOKEN with the token from login
curl http://localhost:8888/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create a Teacher

```bash
curl -X POST http://localhost:8888/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "email": "teacher1@bridges.edu",
    "password": "teacher123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "teacher"
  }'
```

---

### Create a Course

```bash
curl -X POST http://localhost:8888/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "course_code": "CS101",
    "category": "Computer Science",
    "level": "beginner",
    "duration_weeks": 12,
    "credits": 3,
    "status": "published"
  }'
```

---

### Create a Student

```bash
curl -X POST http://localhost:8888/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@bridges.edu",
    "password": "student123",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "student"
  }'
```

---

### Enroll Student in Course

```bash
curl -X POST http://localhost:8888/api/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 2,
    "course_id": 1
  }'
```

---

## Step 5: Use API Client (Optional) 💻

### Option 1: Postman/Insomnia

1. Import `API_COLLECTION.json` into your API client
2. Set `base_url` variable to `http://localhost:8888/api`
3. Login to get token
4. Use the token for authenticated requests

### Option 2: VS Code Thunder Client

1. Install Thunder Client extension
2. Import `API_COLLECTION.json`
3. Start testing!

---

## Step 6: Run Frontend (Optional) 🎨

If you want to run the React frontend:

```bash
# In a new terminal
npm run dev
```

Frontend will run on `http://localhost:5173`

**Or run both together:**
```bash
npm run dev:all
```

---

## Common Tasks 📋

### View All Users
```bash
curl http://localhost:8888/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View All Courses
```bash
curl http://localhost:8888/api/courses
```

### Get Student Enrollments
```bash
curl http://localhost:8888/api/enrollments/student/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Course Enrollments
```bash
curl http://localhost:8888/api/enrollments/course/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Deploy to Production 🚀

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: GitHub + Netlify

```bash
# Push to GitHub
git add .
git commit -m "Complete LMS implementation"
git push origin main

# Then in Netlify:
# 1. Connect your GitHub repo
# 2. Add environment variables
# 3. Deploy automatically
```

**Required Environment Variables:**
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NODE_ENV=production`

---

## Troubleshooting 🔧

### Database Connection Error

**Problem:** `DATABASE_URL environment variable is not set`

**Solution:** Environment variables are loaded from `.env` file. Make sure it exists:
```bash
cat .env
```

### Port Already in Use

**Problem:** `Port 8888 is already in use`

**Solution:** Kill the process or change the port:
```bash
# Kill process on port 8888 (Mac/Linux)
lsof -ti:8888 | xargs kill -9

# Or change port in .env
PORT=8889
```

### CORS Error in Browser

**Problem:** `Access-Control-Allow-Origin error`

**Solution:** Make sure frontend URL is in CORS config (`api/index.ts`):
```typescript
origin: ['http://localhost:5173', 'http://localhost:3000']
```

---

## Next Steps 🎯

Now that everything is running:

1. ✅ **Explore the API** - Try all the endpoints
2. ✅ **Read the docs** - Check `BACKEND_README.md` for complete API documentation
3. ✅ **Build the UI** - Connect your React frontend to these APIs
4. ✅ **Deploy** - Push to production on Netlify
5. ✅ **Customize** - Add your own features and branding

---

## Quick Reference Card 📇

| Action | Command |
|--------|---------|
| Start API | `npm run dev:api` |
| Start Frontend | `npm run dev` |
| Start Both | `npm run dev:all` |
| Run Tests | `./test-api.sh` |
| Build | `npm run build` |
| Initialize DB | `npm run db:init` |
| Deploy | `netlify deploy --prod` |

---

## Default Credentials 🔑

**Admin Account:**
- Username: `WorldAdmin`
- Password: `World@2026`

⚠️ **IMPORTANT:** Change these in production!

---

## Documentation 📖

- **[BACKEND_README.md](./BACKEND_README.md)** - Complete API docs
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview

---

## Support 💬

Need help? Check:
1. API documentation in `BACKEND_README.md`
2. Test script `test-api.sh` for examples
3. Database schema in `src/backend/config/database.ts`

---

## Happy Coding! 🎉

Your LMS is ready to use. Start building amazing features!

```
                    🎓 Bridges LMS
              Learning Management System
                      Ready to Go!
```
