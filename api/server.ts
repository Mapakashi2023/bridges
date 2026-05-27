import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before any other imports
dotenv.config({ path: resolve(__dirname, '../.env') });

// Now import the app after env vars are loaded
import('./index.js').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
