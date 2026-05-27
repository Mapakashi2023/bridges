#!/bin/bash
set -e

echo "🔨 Building Bridges LMS for Netlify..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci
fi

# Build frontend first
echo "🎨 Building frontend..."
npm run build:frontend

# Build backend function
echo "⚙️ Building backend function..."
npm run build:backend

# Verify outputs
echo "✅ Verifying build outputs..."
if [ ! -d "dist" ]; then
  echo "❌ Frontend build failed - dist folder not found"
  exit 1
fi

if [ ! -f "netlify/functions/api.js" ]; then
  echo "❌ Backend build failed - api.js not found"
  exit 1
fi

echo "✅ Build complete!"
echo "📁 Frontend: dist/"
echo "⚡ Function: netlify/functions/api.js"
