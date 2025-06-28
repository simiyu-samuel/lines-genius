# 🚀 Deploy Lines Genius Backend to Railway (with Supabase Database)

## Step 1: Get Your Supabase Database URL

### 1.1 From Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your Lines Genius project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### 1.2 Alternative: From Project Settings
1. In Supabase Dashboard → **Settings** → **API**
2. Find **Database URL** in the configuration section
3. Copy the full connection string

## Step 2: Deploy to Railway

### 2.1 Sign up for Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `lines-genius` repository
4. **Important**: Set the root directory to `backend`

### 2.3 Configure Environment Variables
In your Railway project dashboard, go to **Variables** and add:

```env
# Required Variables
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional (add if you have them)
OPENAI_API_KEY=your-openai-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

## Step 3: Deploy and Test

### 3.1 Trigger Deployment
1. Push your code to GitHub (if not already done)
2. Railway will automatically detect changes and deploy
3. Monitor the build logs in Railway dashboard

### 3.2 Get Your API URL
1. In Railway dashboard, go to your backend service
2. Click **Settings** → **Domains**
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

### 3.3 Test the Deployment
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

## Step 4: Update Frontend Configuration

### 4.1 Update Vercel Environment Variables
In your Vercel dashboard:
1. Go to your frontend project
2. Navigate to **Settings** → **Environment Variables**
3. Update or add:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

### 4.2 Redeploy Frontend
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 5: Verify Everything Works

### 5.1 Test API Endpoints
- Health: `https://your-backend.railway.app/health`
- Register: `POST https://your-backend.railway.app/api/auth/register`
- Generate: `POST https://your-backend.railway.app/api/lines/generate`

### 5.2 Test Frontend Integration
1. Visit your Vercel app
2. Try registering a new account
3. Test line generation
4. Check if data is saved to Supabase

## 🎯 Key Points

### ✅ **What You're Using**
- **Database**: Supabase PostgreSQL (existing)
- **Backend**: Railway (new deployment)
- **Frontend**: Vercel (existing)

### ✅ **No Database Migration Needed**
- Your Supabase database stays exactly the same
- All existing data is preserved
- Just connecting Railway backend to existing Supabase DB

### ✅ **Cost Breakdown**
- **Supabase**: Free tier (existing)
- **Railway**: $5/month for backend hosting
- **Vercel**: Free tier for frontend (existing)

## 🚨 Important Notes

1. **Database URL**: Use your existing Supabase connection string
2. **No Data Loss**: Your existing data in Supabase remains untouched
3. **CORS**: Make sure Railway backend allows requests from your Vercel frontend
4. **Environment Variables**: Double-check all variables are set correctly

## Troubleshooting

### Common Issues:

1. **Database Connection Fails**
   - Verify Supabase connection string is correct
   - Check if password is properly URL-encoded
   - Ensure Supabase project is active

2. **CORS Errors**
   - Verify `CORS_ORIGIN` matches your Vercel URL exactly
   - Check if frontend is using correct Railway API URL

3. **Build Fails**
   - Check Railway build logs for specific errors
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Debug Commands:
```bash
# Test database connection locally
npx prisma db pull

# Check if migrations are needed
npx prisma migrate status

# Generate Prisma client
npx prisma generate
```

Your backend will now be hosted on Railway while continuing to use your existing Supabase database! 🎉