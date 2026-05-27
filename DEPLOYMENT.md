# Bridges LMS - Deployment Guide

## Prerequisites

- GitHub account
- Netlify account (free tier is sufficient)
- Neon PostgreSQL database (already configured)

## Quick Deploy to Netlify

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Initialize and Deploy**:
```bash
# Initialize Netlify site
netlify init

# Deploy to production
netlify deploy --prod
```

### Option 2: GitHub + Netlify Auto-Deploy

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add backend API and LMS system"
git push origin main
```

2. **Connect to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Netlify will auto-detect the build settings from `netlify.toml`

3. **Configure Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add the following:

```
DATABASE_URL=postgresql://neondb_owner:npg_XnTurS4R8QCt@ep-young-butterfly-ap27q4er-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=8WfRx1Nte3z1JBlq5KtwTLNdJIr39NKS9T6jh8Go4VF

ADMIN_USERNAME=WorldAdmin

ADMIN_PASSWORD=World@2026

NODE_ENV=production
```

4. **Trigger Deploy**:
   - Click "Trigger deploy" in Netlify dashboard
   - Or push any change to GitHub

## Build Configuration

The build is configured in `netlify.toml`:

```toml
[build]
  command   = "npm run build"
  publish   = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@neondatabase/serverless"]
```

## API Endpoints

After deployment, your API will be available at:
```
https://your-site-name.netlify.app/api
```

Test the health endpoint:
```bash
curl https://your-site-name.netlify.app/api/health
```

## Database Initialization

The database is already initialized with:
- All tables and indexes created
- Admin user created (Username: `WorldAdmin`, Password: `World@2026`)

If you need to re-initialize:
```bash
npm run db:init
```

## Post-Deployment Checklist

- [ ] Environment variables are set in Netlify
- [ ] Database is accessible from Netlify (Neon allows all connections by default)
- [ ] Test API health check: `https://your-site.netlify.app/api/health`
- [ ] Test admin login via API
- [ ] Frontend connects to API correctly
- [ ] CORS is configured for your domain

## Monitoring & Debugging

### View Function Logs
```bash
netlify functions:logs api
```

### Local Development with Netlify Dev
```bash
netlify dev
```
This starts both frontend and backend locally with environment variables from Netlify.

### Test Production Build Locally
```bash
npm run build
netlify deploy --build
```

## Custom Domain (Optional)

1. Go to Domain Settings in Netlify
2. Add your custom domain
3. Update CORS settings in `api/index.ts` to include your domain:
```typescript
origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
```

## Security Recommendations

### For Production:

1. **Change Default Credentials**:
```bash
# Update .env and redeploy
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
```

2. **Rotate JWT Secret**:
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Update in Netlify environment variables
```

3. **Enable Rate Limiting** (add to `api/index.ts`):
```bash
npm install express-rate-limit
```

4. **Monitor Database Usage** in Neon Dashboard:
   - Check query performance
   - Monitor connection pool
   - Set up alerts

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript types are correct

### Database Connection Error
- Verify `DATABASE_URL` in environment variables
- Check Neon database is active
- Test connection from local machine

### API Returns 500 Error
- Check function logs: `netlify functions:logs api`
- Verify environment variables are set
- Check database schema is initialized

### CORS Errors
- Update `origin` in `api/index.ts`
- Redeploy after changes

## Scaling Considerations

### Neon Database
- Free tier: 0.5 GB storage, 100 hours compute/month
- Scale up as needed in Neon dashboard

### Netlify Functions
- Free tier: 125K requests/month, 100 hours compute/month
- Functions have 10-second timeout
- Cold starts: ~1-2 seconds

### Optimization Tips
1. Use Neon's connection pooling (already configured)
2. Enable function warming for critical endpoints
3. Cache static data with appropriate headers
4. Use database indexes (already created)

## Maintenance

### Backup Database
Neon provides automatic backups. Manual backup:
```bash
# Export from Neon dashboard or use pg_dump
```

### Update Dependencies
```bash
npm update
npm audit fix
git commit -am "Update dependencies"
git push
```

## Support & Resources

- Netlify Docs: https://docs.netlify.com
- Neon Docs: https://neon.tech/docs
- API Documentation: See `BACKEND_README.md`

## Cost Estimate

With free tiers:
- Netlify: Free (100 GB bandwidth, 125K functions)
- Neon: Free (0.5 GB storage, 100 hours compute)
- Total: **$0/month** for small-medium usage

Paid plans start at:
- Netlify Pro: $19/month
- Neon Scale: $19/month
