# Bridges LMS - Backend API Documentation

## Overview

This is a comprehensive Learning Management System (LMS) with an admin dashboard and student management system built with:

- **Backend**: Node.js + Express + TypeScript
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: JWT with bcrypt
- **Deployment**: Netlify Functions (Serverless)

## Features

### 1. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with bcrypt
- Profile management

### 2. **User Management**
- CRUD operations for users
- User roles: Admin, Teacher, Student
- User status management (active, inactive, suspended)
- Password reset functionality
- User search and filtering

### 3. **Course Management**
- Create and manage courses
- Course modules and lessons
- Multiple content types (video, text, PDF, quiz, assignment)
- Course categorization and levels
- Draft/Published/Archived status

### 4. **Student Enrollment**
- Enroll students in courses
- Track enrollment status
- Monitor progress percentage
- Grade management
- Course completion tracking

### 5. **Learning Features**
- Lesson progress tracking
- Assignments and submissions
- Quizzes with multiple question types
- Discussion forums
- Announcements
- Attendance tracking

### 6. **Dashboard Analytics**
- **Admin Dashboard**: System-wide statistics, enrollment trends, popular courses
- **Teacher Dashboard**: Course statistics, student progress, pending submissions
- **Student Dashboard**: Enrolled courses, progress tracking, upcoming assignments, grades

### 7. **Notifications**
- In-app notification system
- Notification types: info, success, warning, error

## Setup Instructions

### 1. Environment Variables

The `.env` file has been created with your credentials:

```env
DATABASE_URL=postgresql://neondb_owner:npg_XnTurS4R8QCt@ep-young-butterfly-ap27q4er-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=8WfRx1Nte3z1JBlq5KtwTLNdJIr39NKS9T6jh8Go4VF
ADMIN_USERNAME=WorldAdmin
ADMIN_PASSWORD=World@2026
NODE_ENV=production
PORT=8888
```

### 2. Initialize Database

Run the database initialization script to create all tables and the admin user:

```bash
npm run db:init
```

This will:
- Create all database tables and indexes
- Create the admin user with credentials:
  - Username: `WorldAdmin`
  - Password: `World@2026`

### 3. Development

Run the backend API locally:

```bash
npm run dev:api
```

Or run both frontend and backend:

```bash
npm run dev:all
```

The API will be available at `http://localhost:8888/api`

### 4. Build & Deploy

Build for production:

```bash
npm run build
```

This will:
1. Build the backend serverless function
2. Build the frontend React app

Deploy to Netlify:

```bash
netlify deploy --prod
```

Or push to GitHub and let Netlify auto-deploy.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get current user profile (authenticated)
- `PUT /api/auth/profile` - Update profile (authenticated)

### Users (`/api/users`)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PATCH /api/users/:id/status` - Update user status (admin only)
- `POST /api/users/:id/reset-password` - Reset user password (admin only)

### Courses (`/api/courses`)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (teacher/admin)
- `PUT /api/courses/:id` - Update course (teacher/admin)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `GET /api/courses/:courseId/modules` - Get course modules
- `POST /api/courses/:courseId/modules` - Create module (teacher/admin)
- `GET /api/courses/modules/:moduleId/lessons` - Get module lessons
- `POST /api/courses/modules/:moduleId/lessons` - Create lesson (teacher/admin)

### Enrollments (`/api/enrollments`)
- `POST /api/enrollments` - Enroll student (admin)
- `GET /api/enrollments/student/:studentId` - Get student enrollments
- `GET /api/enrollments/course/:courseId` - Get course enrollments (teacher/admin)
- `GET /api/enrollments/:enrollmentId/progress` - Get enrollment progress
- `PATCH /api/enrollments/:id/status` - Update enrollment status (teacher/admin)
- `PATCH /api/enrollments/:id/progress` - Update enrollment progress (teacher/admin)
- `POST /api/enrollments/:enrollmentId/lessons/:lessonId/complete` - Mark lesson complete

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/admin` - Admin dashboard statistics (admin only)
- `GET /api/dashboard/teacher` - Teacher dashboard statistics (teacher/admin)
- `GET /api/dashboard/student` - Student dashboard statistics (authenticated)

### Health Check
- `GET /api/health` - API health check

## Database Schema

### Tables

1. **users** - User accounts (admin, teacher, student)
2. **courses** - Course information
3. **course_modules** - Course modules/sections
4. **lessons** - Individual lessons
5. **enrollments** - Student course enrollments
6. **lesson_progress** - Student lesson completion tracking
7. **assignments** - Course assignments
8. **submissions** - Student assignment submissions
9. **quizzes** - Course quizzes
10. **quiz_questions** - Quiz questions
11. **quiz_attempts** - Student quiz attempts
12. **announcements** - Course announcements
13. **discussions** - Course discussion threads
14. **discussion_replies** - Discussion replies
15. **attendance** - Student attendance records
16. **certificates** - Course completion certificates
17. **notifications** - User notifications

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token, login via `/api/auth/login`:

```bash
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "WorldAdmin",
    "password": "World@2026"
  }'
```

Response:
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

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Teacher**: Can manage their courses, view student progress, grade assignments
- **Student**: Can view their enrollments, submit assignments, track progress

## Netlify Deployment

The backend is deployed as Netlify Functions. The configuration is in:

- `netlify.toml` - Netlify configuration
- `netlify/functions/api.ts` - Serverless function entry point
- API routes are proxied from `/api/*` to `/.netlify/functions/api/*`

### Environment Variables in Netlify

Set these in Netlify Dashboard → Site Settings → Environment Variables:

1. `DATABASE_URL` - Your Neon PostgreSQL connection string
2. `JWT_SECRET` - Your JWT secret key
3. `ADMIN_USERNAME` - Admin username
4. `ADMIN_PASSWORD` - Admin password
5. `NODE_ENV` - Set to `production`

## Project Structure

```
bridges/
├── api/
│   └── index.ts                 # Express app setup
├── netlify/
│   └── functions/
│       └── api.ts               # Netlify serverless function
├── scripts/
│   └── initDb.ts                # Database initialization script
├── src/
│   ├── backend/
│   │   ├── config/
│   │   │   └── database.ts      # Database config & schema
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── enrollmentController.ts
│   │   │   └── dashboardController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts          # Authentication middleware
│   │   ├── routes/              # API routes
│   │   │   ├── index.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── courseRoutes.ts
│   │   │   ├── enrollmentRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   └── types/
│   │       └── index.ts         # TypeScript types
│   └── [frontend files...]
├── .env                         # Environment variables
├── netlify.toml                 # Netlify configuration
├── package.json
└── tsconfig.backend.json        # Backend TypeScript config
```

## Testing

### Test Admin Login

```bash
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "WorldAdmin",
    "password": "World@2026"
  }'
```

### Test Health Check

```bash
curl http://localhost:8888/api/health
```

### Test Admin Dashboard (with token)

```bash
curl http://localhost:8888/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token expiration (7 days)
- Role-based access control
- SQL injection protection (parameterized queries)
- CORS configuration
- Environment variable protection

## Next Steps

1. **Initialize the database**: `npm run db:init`
2. **Test locally**: `npm run dev:api`
3. **Deploy to Netlify**: Push to GitHub or use `netlify deploy --prod`
4. **Connect frontend**: Update API endpoints in frontend to point to your Netlify URL

## Support

For issues or questions, refer to:
- Neon Database: https://neon.tech/docs
- Netlify Functions: https://docs.netlify.com/functions/overview/
- Express.js: https://expressjs.com/

## License

MIT
