# 🎓 Bridges LMS - Learning Management System

> A comprehensive, full-stack Learning Management System with Admin Dashboard, Student Management, and complete LMS features.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## ✨ Features

### 🎨 Premium UI/UX (NEW!)
- ✨ **Glassmorphism Design** - Frosted glass effects with backdrop blur
- 🌈 **Animated Gradients** - Beautiful flowing background colors
- 💫 **Smooth Animations** - Buttery 60fps transitions everywhere
- 🎭 **Micro-interactions** - Hover effects, scale, lift, and glow
- 📊 **Count-Up Statistics** - Numbers animate from 0
- 🌊 **Floating Particles** - Ambient background elements
- ⚡ **Loading Shimmer** - Premium loading states
- 🎪 **Spring Physics** - Natural, bouncy animations

### 🔧 Core Features
- 🔐 **Complete Authentication & Authorization** - JWT-based with role management
- 👥 **User Management** - Admin, Teacher, and Student roles
- 📚 **Course Management** - Create courses with modules and lessons
- 🎯 **Student Enrollment** - Enrollment tracking and progress monitoring
- 📝 **Assignments & Quizzes** - Complete assessment system
- 💬 **Discussion Forums** - Course discussions and announcements
- 📊 **Analytics Dashboards** - Admin, Teacher, and Student dashboards
- 🏆 **Certificates** - Course completion certificates
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Serverless Deployment** - Deploy on Netlify for free

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd bridges
npm install
```

### 2. Start the API

```bash
npm run dev:api
```

The API will be available at `http://localhost:8888/api`

### 3. Test the API

```bash
./test-api.sh
```

**That's it!** Your LMS backend is running. 🎉

### 4. Experience the Premium UI ✨

```bash
npm run dev:all
# Open: http://localhost:5173/login
# Login: WorldAdmin / World@2026
```

**Prepare to be amazed by the animations!** 🎨

👉 **[Full Quick Start Guide](./QUICKSTART.md)** for detailed instructions

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | ⚡ Get started in 5 minutes |
| **[HOW_TO_LOGIN.md](./HOW_TO_LOGIN.md)** | 🔐 Access the admin dashboard |
| **[PREMIUM_FEATURES.md](./PREMIUM_FEATURES.md)** | ✨ Premium UI animations guide |
| **[VISUAL_SHOWCASE.md](./VISUAL_SHOWCASE.md)** | 🎨 Visual preview of animations |
| **[BACKEND_README.md](./BACKEND_README.md)** | 📖 Complete API documentation |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | 🚀 Deploy to production |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 🏗️ System architecture & design |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | 📋 Complete feature overview |

## 🔑 Default Credentials

**Admin Account:**
- Username: `WorldAdmin`
- Password: `World@2026`

⚠️ **Change these credentials before deploying to production!**

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login            # Login
POST   /api/auth/register         # Register
GET    /api/auth/profile          # Get profile
PUT    /api/auth/profile          # Update profile
```

### Users (Admin)
```
GET    /api/users                 # List all users
POST   /api/users                 # Create user
PUT    /api/users/:id             # Update user
DELETE /api/users/:id             # Delete user
```

### Courses
```
GET    /api/courses               # List courses
POST   /api/courses               # Create course
PUT    /api/courses/:id           # Update course
GET    /api/courses/:id/modules   # Get course modules
POST   /api/courses/:id/modules   # Create module
```

### Enrollments
```
POST   /api/enrollments           # Enroll student
GET    /api/enrollments/student/:id
GET    /api/enrollments/course/:id
POST   /api/enrollments/:id/lessons/:lessonId/complete
```

### Dashboards
```
GET    /api/dashboard/admin       # Admin analytics
GET    /api/dashboard/teacher     # Teacher dashboard
GET    /api/dashboard/student     # Student dashboard
```

👉 **[Complete API Documentation](./BACKEND_README.md)**

## 🗄️ Database Schema

17 tables with complete relationships:

- **users** - User accounts with roles
- **courses** - Course information
- **course_modules** - Course sections
- **lessons** - Lesson content (video, text, PDF, quiz, assignment)
- **enrollments** - Student course enrollments
- **lesson_progress** - Progress tracking
- **assignments** - Course assignments
- **submissions** - Student submissions
- **quizzes** - Quiz system
- **discussions** - Discussion forums
- **announcements** - Course announcements
- **attendance** - Attendance tracking
- **certificates** - Completion certificates
- **notifications** - User notifications
- And more...

## 🛠️ Tech Stack

**Backend:**
- Node.js 22 + Express 5
- TypeScript 6
- Neon PostgreSQL (Serverless)
- JWT Authentication
- bcrypt Password Hashing

**Frontend:**
- React 19
- TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4

**Deployment:**
- Netlify Functions (Serverless)
- Netlify Hosting
- Neon Database

## 🚀 Deployment

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Or push to GitHub and connect via Netlify dashboard.**

Set these environment variables in Netlify:
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NODE_ENV=production`

👉 **[Complete Deployment Guide](./DEPLOYMENT.md)**

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run dev:api` | Start backend API server |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |
| `npm run db:init` | Initialize database |
| `./test-api.sh` | Run API tests |

## 🧪 Testing

### Automated Tests
```bash
./test-api.sh
```

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:8888/api/health

# Test login
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"WorldAdmin","password":"World@2026"}'
```

### API Collection
Import `API_COLLECTION.json` into:
- Postman
- Insomnia
- Thunder Client (VS Code)

## 🏗️ Project Structure

```
bridges/
├── api/                      # Express API server
├── netlify/functions/        # Netlify serverless functions
├── src/
│   ├── backend/             # Backend source code
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & other middleware
│   │   ├── routes/          # API routes
│   │   └── types/           # TypeScript types
│   ├── components/          # React components
│   └── pages/               # React pages
├── scripts/                 # Utility scripts
├── .env                     # Environment variables
├── netlify.toml             # Netlify configuration
└── [documentation files]
```

## 🎯 Features in Detail

### Admin Dashboard
- System-wide statistics
- User management (CRUD)
- Course management
- Enrollment tracking
- Analytics and trends

### Teacher Dashboard
- Course creation & management
- Student progress monitoring
- Assignment grading
- Quiz management
- Attendance tracking

### Student Dashboard
- Course enrollment
- Progress tracking
- Assignment submission
- Quiz taking
- Grade viewing

## 💰 Cost (Free Tier)

- **Netlify**: Free (125K requests/month)
- **Neon**: Free (0.5 GB storage, 100 hours compute)
- **Total**: $0/month for development and small production

## 🔒 Security

- ✅ JWT authentication with 7-day expiration
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Role-based access control
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ✅ Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Support

- 📖 [Read the Documentation](./BACKEND_README.md)
- 🚀 [Quick Start Guide](./QUICKSTART.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🐛 Report issues on GitHub

## 🎉 What's Included

✅ Complete backend API (40+ endpoints)
✅ Database schema (17 tables)
✅ Authentication & authorization
✅ User management system
✅ Course management system
✅ Student enrollment system
✅ Assignment & quiz system
✅ Discussion forums
✅ Analytics dashboards
✅ Progress tracking
✅ Certificate system
✅ Notification system
✅ Serverless deployment ready
✅ Complete documentation
✅ API test scripts
✅ Postman collection

---

**Built with ❤️ for education**

Ready to revolutionize online learning? Get started now! 🚀

```bash
npm run dev:api
./test-api.sh
```

Happy coding! 🎓
