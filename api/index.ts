import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from '../src/backend/routes';
import { initializeDatabase, createAdminUser } from '../src/backend/config/database';

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://bridges.netlify.app', 'https://your-custom-domain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Bridges LMS API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      dashboard: '/api/dashboard'
    }
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

let isInitialized = false;

async function initializeApp() {
  if (!isInitialized) {
    try {
      console.log('🔄 Initializing database...');
      await initializeDatabase();
      console.log('✅ Database initialized');

      console.log('🔄 Creating admin user...');
      await createAdminUser();
      console.log('✅ Admin user ready');

      isInitialized = true;
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8888;
  initializeApp().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { app, initializeApp };
