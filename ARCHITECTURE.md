# Bridges LMS - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Admin UI   │  │  Teacher UI  │  │  Student UI  │          │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTPS/REST API
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY (Netlify)                         │
│                  /api/* → Serverless Function                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                   BACKEND LAYER (Node.js)                        │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Express.js Application                  │        │
│  │  ┌───────────┐  ┌───────────┐  ┌──────────────┐    │        │
│  │  │   Auth    │  │   CORS    │  │   Logging    │    │        │
│  │  │Middleware │  │Middleware │  │  Middleware  │    │        │
│  │  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘    │        │
│  │        └───────────────┴────────────────┘            │        │
│  │                       │                              │        │
│  │  ┌────────────────────▼────────────────────────┐    │        │
│  │  │          Route Layer (Express Routes)       │    │        │
│  │  │  /auth  /users  /courses  /enrollments     │    │        │
│  │  │          /dashboard                          │    │        │
│  │  └────────────────────┬────────────────────────┘    │        │
│  │                       │                              │        │
│  │  ┌────────────────────▼────────────────────────┐    │        │
│  │  │         Controller Layer                     │    │        │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │        │
│  │  │  │   Auth   │  │   User   │  │  Course  │  │    │        │
│  │  │  │Controller│  │Controller│  │Controller│  │    │        │
│  │  │  └──────────┘  └──────────┘  └──────────┘  │    │        │
│  │  │  ┌──────────┐  ┌──────────────────────┐    │    │        │
│  │  │  │Enrollment│  │     Dashboard        │    │    │        │
│  │  │  │Controller│  │     Controller       │    │    │        │
│  │  │  └──────────┘  └──────────────────────┘    │    │        │
│  │  └────────────────────┬────────────────────────┘    │        │
│  │                       │                              │        │
│  │  ┌────────────────────▼────────────────────────┐    │        │
│  │  │          Database Access Layer              │    │        │
│  │  │        (Neon PostgreSQL Client)             │    │        │
│  │  └────────────────────┬────────────────────────┘    │        │
│  └───────────────────────┼──────────────────────────────┘        │
└────────────────────────────┼─────────────────────────────────────┘
                             │ SQL Queries (TLS)
┌────────────────────────────▼─────────────────────────────────────┐
│                  DATABASE LAYER (Neon PostgreSQL)                │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                    Core Tables                          │     │
│  │  users  │  courses  │  enrollments  │  lessons         │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                   Learning Tables                       │     │
│  │  assignments  │  submissions  │  quizzes  │  progress   │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                  Interaction Tables                     │     │
│  │  discussions  │  announcements  │  notifications        │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                   Support Tables                        │     │
│  │  attendance  │  certificates  │  quiz_attempts          │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User → POST /api/auth/login (username, password)
2. Backend → Validate credentials with database
3. Backend → Generate JWT token
4. Backend → Return token + user data
5. User → Store token in localStorage/sessionStorage
6. User → Include token in Authorization header for subsequent requests
```

### Authorization Flow
```
1. Request → API endpoint with Bearer token
2. Auth Middleware → Verify JWT signature
3. Auth Middleware → Check token expiration
4. Auth Middleware → Extract user role from token
5. Role Middleware → Verify user has required role
6. Controller → Process request if authorized
```

### Course Enrollment Flow
```
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌──────────┐
│ Admin/  │────▶│  POST   │────▶│ Enrollment  │────▶│ Database │
│ Teacher │     │ /enroll │     │ Controller  │     │  INSERT  │
└─────────┘     └─────────┘     └─────────────┘     └──────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Create progress │
                              │ tracking records│
                              └─────────────────┘
```

## Database Schema Relationships

```
users (1) ─────────┬──────── (*) enrollments
   │               │
   │ (instructor)  │ (student)
   │               │
   ▼               ▼
courses (1) ─── (*) enrollments
   │
   │ (1)
   ▼
course_modules (*)
   │
   │ (1)
   ▼
lessons (*)
   │
   ├──── (1) assignments (*)
   │        │
   │        │ (1)
   │        ▼
   │     submissions (*)
   │
   └──── (1) quizzes (*)
            │
            ├──── (1) quiz_questions (*)
            │
            └──── (*) quiz_attempts

enrollments (1) ─── (*) lesson_progress
                │
                └── (1) certificates
```

## API Endpoint Structure

```
/api
├── /health                     # Health check
├── /auth
│   ├── POST   /login          # Login
│   ├── POST   /register       # Register
│   ├── GET    /profile        # Get profile
│   └── PUT    /profile        # Update profile
├── /users
│   ├── GET    /               # List users (admin)
│   ├── GET    /:id            # Get user
│   ├── POST   /               # Create user (admin)
│   ├── PUT    /:id            # Update user (admin)
│   ├── DELETE /:id            # Delete user (admin)
│   ├── PATCH  /:id/status     # Update status (admin)
│   └── POST   /:id/reset-password  # Reset password (admin)
├── /courses
│   ├── GET    /               # List courses
│   ├── GET    /:id            # Get course
│   ├── POST   /               # Create course (teacher)
│   ├── PUT    /:id            # Update course (teacher)
│   ├── DELETE /:id            # Delete course (admin)
│   ├── GET    /:id/modules    # Get modules
│   ├── POST   /:id/modules    # Create module (teacher)
│   ├── GET    /modules/:id/lessons  # Get lessons
│   └── POST   /modules/:id/lessons  # Create lesson (teacher)
├── /enrollments
│   ├── POST   /               # Enroll student (admin)
│   ├── GET    /student/:id    # Get student enrollments
│   ├── GET    /course/:id     # Get course enrollments (teacher)
│   ├── GET    /:id/progress   # Get enrollment progress
│   ├── PATCH  /:id/status     # Update status (teacher)
│   ├── PATCH  /:id/progress   # Update progress (teacher)
│   └── POST   /:id/lessons/:lessonId/complete  # Mark complete
└── /dashboard
    ├── GET    /admin          # Admin dashboard (admin)
    ├── GET    /teacher        # Teacher dashboard (teacher)
    └── GET    /student        # Student dashboard (student)
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│  1. HTTPS/TLS                                           │
│     └─ All communication encrypted                      │
├─────────────────────────────────────────────────────────┤
│  2. CORS                                                │
│     └─ Allowed origins only                            │
├─────────────────────────────────────────────────────────┤
│  3. JWT Authentication                                  │
│     ├─ HS256 algorithm                                 │
│     ├─ 7-day expiration                                │
│     └─ Secret key protection                           │
├─────────────────────────────────────────────────────────┤
│  4. Role-Based Authorization                           │
│     ├─ Admin: Full access                             │
│     ├─ Teacher: Course & student management           │
│     └─ Student: Own data & enrolled courses           │
├─────────────────────────────────────────────────────────┤
│  5. Password Security                                   │
│     ├─ bcrypt hashing (10 rounds)                     │
│     └─ No plaintext storage                           │
├─────────────────────────────────────────────────────────┤
│  6. SQL Injection Protection                           │
│     └─ Parameterized queries (Neon client)            │
├─────────────────────────────────────────────────────────┤
│  7. Environment Variables                              │
│     └─ Sensitive data not in code                     │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                    GitHub Repository                    │
│              (Source Code + Version Control)            │
└──────────────────┬─────────────────────────────────────┘
                   │ git push
                   ▼
┌────────────────────────────────────────────────────────┐
│                    Netlify Platform                     │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Build Process                        │ │
│  │  1. npm install (dependencies)                   │ │
│  │  2. npm run build:backend (esbuild)              │ │
│  │  3. npm run build:frontend (vite)                │ │
│  └──────────────────┬───────────────────────────────┘ │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐ │
│  │            Deployment                             │ │
│  │  ┌─────────────────┐  ┌─────────────────────┐   │ │
│  │  │   Functions     │  │   Static Files      │   │ │
│  │  │   /functions    │  │   /dist             │   │ │
│  │  └─────────────────┘  └─────────────────────┘   │ │
│  └──────────────────┬───────────────────────────────┘ │
└─────────────────────┼──────────────────────────────────┘
                      │
          ┌───────────┴────────────┐
          ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│ Netlify CDN      │    │ Neon Database    │
│ (Global Edge)    │    │ (PostgreSQL)     │
│                  │    │                  │
│ - Frontend       │    │ - Connection     │
│ - API Functions  │    │   Pooling        │
│ - SSL/TLS        │    │ - Auto-scaling   │
└──────────────────┘    └──────────────────┘
```

## Tech Stack Layers

```
┌─────────────────────────────────────────────────────┐
│              Frontend (Client-Side)                  │
│  React 19  │  TypeScript  │  Vite 8  │  Tailwind  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────┐
│              Backend (Server-Side)                   │
│  Node.js 22  │  Express 5  │  TypeScript  │  JWT   │
└────────────────────┬────────────────────────────────┘
                     │ SQL/TLS
┌────────────────────▼────────────────────────────────┐
│              Database (Data Layer)                   │
│  Neon PostgreSQL  │  Connection Pooling  │  Backup │
└─────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Netlify Functions**: Auto-scale based on traffic
- **Neon Database**: Serverless auto-scaling
- **CDN**: Global edge distribution

### Vertical Scaling
- **Database**: Upgrade Neon plan for more compute
- **Functions**: Increase timeout/memory in Netlify

### Performance Optimization
- **Database Indexes**: All foreign keys indexed
- **Connection Pooling**: Neon built-in pooling
- **Caching**: Add Redis for session/data caching
- **CDN**: Static assets served from edge

## Monitoring & Logging

```
┌─────────────────────────────────────────┐
│          Monitoring Stack                │
├─────────────────────────────────────────┤
│  1. Netlify Dashboard                   │
│     - Function logs                     │
│     - Build logs                        │
│     - Analytics                         │
├─────────────────────────────────────────┤
│  2. Neon Console                        │
│     - Query performance                 │
│     - Connection metrics                │
│     - Storage usage                     │
├─────────────────────────────────────────┤
│  3. Application Logs                    │
│     - Request logging                   │
│     - Error tracking                    │
│     - Authentication events             │
└─────────────────────────────────────────┘
```

## Future Enhancements

1. **Caching Layer**: Redis for sessions and frequently accessed data
2. **Message Queue**: Background job processing for emails, notifications
3. **File Storage**: S3/Cloudinary for user uploads
4. **Search Engine**: Elasticsearch for full-text search
5. **Real-time**: WebSockets for live updates
6. **Analytics**: Dedicated analytics service
7. **Monitoring**: Sentry for error tracking, Datadog for APM

---

This architecture provides a solid foundation for a scalable, secure, and maintainable LMS platform.
