import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import serverless from 'serverless-http';
import dotenv from 'dotenv';

// Load environment variables FIRST (Netlify provides them, but dotenv handles .env files in development)
dotenv.config();

// Now safe to import app which may load database config
import { app, initializeApp } from '../../api';

let cachedHandler: any = null;
let initialized = false;

const createHandler = async () => {
  if (!initialized) {
    console.log('🔄 Initializing Netlify Function...');
    await initializeApp();
    initialized = true;
    console.log('✅ Netlify Function initialized');
  }
  return serverless(app);
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  try {
    if (!cachedHandler) {
      cachedHandler = await createHandler();
    }
    const result = await cachedHandler(event, context);
    return result as HandlerResponse;
  } catch (error) {
    console.error('❌ Netlify Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? undefined : String(error)
      })
    };
  }
};
