import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// CRITICAL: Load environment variables BEFORE any other imports
// Netlify provides env vars automatically, but this ensures compatibility
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Now import dependencies
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { neon } from '@neondatabase/serverless';
import routes from '../../src/backend/routes';

// Initialize app
const app = express();

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins in serverless
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Mount API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Bridges LMS API - Netlify Function',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Database initialization cache
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) {
    return;
  }

  try {
    console.log('🔄 Initializing database...');

    const sql = neon(process.env.DATABASE_URL!);

    // Test connection
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection verified');

    dbInitialized = true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Create serverless handler
let handlerCache: any = null;

async function createHandler() {
  if (!handlerCache) {
    // Initialize database on first invocation
    await initializeDatabase();

    // Create serverless wrapper
    handlerCache = serverless(app, {
      basePath: '/.netlify/functions/api'
    });

    console.log('✅ Netlify Function handler created');
  }

  return handlerCache;
}

// Export Netlify Function handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    console.log('📥 Function invoked:', event.path);

    // Ensure handler is initialized
    const serverlessHandler = await createHandler();

    // Process request
    const result = await serverlessHandler(event, context);

    console.log('📤 Function response:', result?.statusCode);

    return result;
  } catch (error) {
    console.error('❌ Function error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
