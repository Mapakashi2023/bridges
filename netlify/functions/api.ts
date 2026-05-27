import { Handler } from '@netlify/functions';
import serverless from 'serverless-http';
import { app, initializeApp } from '../../api';

let cachedHandler: Handler | null = null;
let initialized = false;

const createHandler = async (): Promise<Handler> => {
  if (!initialized) {
    await initializeApp();
    initialized = true;
  }
  return serverless(app);
};

export const handler: Handler = async (event, context) => {
  if (!cachedHandler) {
    cachedHandler = await createHandler();
  }
  return cachedHandler(event, context);
};
