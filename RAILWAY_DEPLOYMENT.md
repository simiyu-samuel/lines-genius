# 🚀 Deploy Lines Genius Backend to Railway

## Step 1: Prepare Your Backend for Railway

### 1.1 Update package.json scripts
Your backend already has the correct scripts, but let's verify:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "npx prisma migrate deploy",
    "generate": "npx prisma generate"
  }
}
```

### 1.2 Create Railway configuration
The `railway.json` file is already created with the correct configuration.

### 1.3 Update environment variables template
The `.env.production` file is ready with Railway-specific settings.

## Step 2: Deploy to Railway

### 2.1 Sign up for Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `lines-genius` repository
4. Select the `backend` folder as the root directory

### 2.3 Configure Build Settings
Railway will automatically detect your Node.js project, but verify:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend` (if deploying from monorepo)

## Step 3: Set Up Database

### 3.1 Add PostgreSQL Service
1. In your Railway project dashboard
2. Click "New Service"
3. Select "Database" → "PostgreSQL"
4. Railway will provision a PostgreSQL database

### 3.2 Get Database URL
1. Go to your PostgreSQL service
2. Click on "Variables" tab
3. Copy the `DATABASE_URL` value

## Step 4: Configure Environment Variables

### 4.1 Add Required Variables
In your Railway backend service, go to "Variables" and add:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4.2 Optional Variables (add if you have them)
```env
OPENAI_API_KEY=your-openai-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

## Step 5: Deploy and Test

### 5.1 Trigger Deployment
1. Push your code to GitHub
2. Railway will automatically deploy
3. Monitor the build logs in Railway dashboard

### 5.2 Run Database Migrations
After successful deployment:
1. Go to your Railway backend service
2. Open the "Deployments" tab
3. Click on the latest deployment
4. Open "View Logs"
5. The migrations should run automatically on startup

### 5.3 Get Your API URL
1. In Railway dashboard, go to your backend service
2. Click "Settings" → "Domains"
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

## Step 6: Update Frontend Configuration

### 6.1 Update Frontend Environment Variables
In your Vercel frontend deployment, update:

```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

### 6.2 Update CORS in Backend
Make sure your Railway backend has the correct CORS origin:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

## Step 7: Verify Deployment

### 7.1 Health Check
Visit: `https://your-backend.railway.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-01-28T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 7.2 Test API Endpoints
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Generate**: `POST /api/lines/generate`

## Step 8: Monitor and Maintain

### 8.1 Monitor Logs
- Railway provides real-time logs
- Monitor for errors and performance issues
- Set up alerts if needed

### 8.2 Database Management
- Use Railway's built-in database tools
- Set up automated backups
- Monitor database performance

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if migrations ran successfully
   - Ensure Prisma client is generated

3. **CORS Errors**
   - Verify CORS_ORIGIN matches your frontend URL
   - Check if frontend is using correct API URL

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify sensitive values are correct

### Debug Commands:
```bash
# Check if Prisma client is generated
npx prisma generate

# Run migrations manually
npx prisma migrate deploy

# Check database connection
npx prisma db pull
```

## Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ Database credentials are secure
- ✅ CORS is properly configured
- ✅ Rate limiting is enabled
- ✅ Environment variables are not exposed
- ✅ HTTPS is enforced

## Performance Optimization

1. **Database Optimization**
   - Use connection pooling
   - Add database indexes
   - Monitor query performance

2. **API Optimization**
   - Implement caching where appropriate
   - Use compression middleware
   - Monitor response times

3. **Scaling**
   - Railway auto-scales based on traffic
   - Monitor resource usage
   - Upgrade plan if needed

## Next Steps

1. Set up monitoring and alerting
2. Configure automated backups
3. Set up CI/CD pipeline
4. Add API documentation
5. Implement comprehensive logging

Your backend is now deployed and ready to serve your frontend! 🎉