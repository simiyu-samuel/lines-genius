# 🚀 Deploy Full-Stack Lines Genius to Vercel

## Overview
We'll deploy both frontend and backend to Vercel using:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (existing)

## Step 1: Prepare Backend for Vercel

### 1.1 Update Backend Structure
The backend is already configured for Vercel with the existing `vercel.json` and `api/index.ts` files.

### 1.2 Verify Vercel Configuration
Your backend already has the correct setup:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.ts` - Serverless function entry point
- ✅ `src/server.ts` - Express app

## Step 2: Get Supabase Connection String

### 2.1 Set Database Password (if needed)
1. Go to [supabase.com](https://supabase.com) → Your Project
2. **Settings** → **Database**
3. If connection string is blank:
   - Click **"Generate new password"**
   - Save the password securely
   - Wait 1-2 minutes

### 2.2 Copy Connection String
Format should be:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Step 3: Deploy Backend to Vercel

### 3.1 Create New Vercel Project for Backend
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Set **Root Directory** to `backend`
5. **Framework Preset**: Other
6. Click **Deploy**

### 3.2 Configure Backend Environment Variables
In Vercel dashboard → **Settings** → **Environment Variables**, add:

```env
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional - Add if you have them
OPENAI_API_KEY=your-openai-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### 3.3 Get Backend URL
After deployment, copy your backend URL:
```
https://your-backend-app.vercel.app
```

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Frontend Vercel Project
1. In Vercel dashboard, click **"New Project"**
2. Import the same GitHub repository
3. **Root Directory**: Leave as root (default)
4. **Framework Preset**: Vite
5. Click **Deploy**

### 4.2 Configure Frontend Environment Variables
In Vercel dashboard → **Settings** → **Environment Variables**, add:

```env
# Backend API
VITE_API_BASE_URL=https://your-backend-app.vercel.app/api

# EmailJS (if you have them)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID=your_subscription_template_id
VITE_EMAILJS_USER_ID=your_user_id

# PayPal (if you have it)
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# M-Pesa (if you have them)
VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
VITE_MPESA_PASSKEY=your_mpesa_passkey
```

## Step 5: Update CORS Configuration

### 5.1 Update Backend CORS
After getting your frontend URL, update the backend environment variable:
```env
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

### 5.2 Redeploy Backend
1. Go to backend Vercel project
2. **Deployments** tab
3. Click **Redeploy** on latest deployment

## Step 6: Test Your Deployment

### 6.1 Test Backend Health
Visit: `https://your-backend-app.vercel.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-01-28T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 6.2 Test Frontend
1. Visit your frontend URL
2. Try registering a new account
3. Test line generation
4. Check saved lines functionality

### 6.3 Test API Integration
1. Open browser dev tools
2. Go to Network tab
3. Try generating lines
4. Verify API calls go to your Vercel backend

## Step 7: Database Migrations (if needed)

### 7.1 Run Migrations Locally First
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 7.2 Verify Database Schema
Check your Supabase dashboard to ensure all tables exist.

## Step 8: Custom Domains (Optional)

### 8.1 Add Custom Domain to Frontend
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `linesgenius.com`)
3. Follow DNS configuration instructions

### 8.2 Add Custom Domain to Backend
1. Add subdomain for API (e.g., `api.linesgenius.com`)
2. Update frontend environment variable:
   ```env
   VITE_API_BASE_URL=https://api.linesgenius.com/api
   ```

## 🎯 Final Configuration Summary

### ✅ **What You'll Have**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.vercel.app`
- **Database**: Supabase (existing)

### ✅ **Environment Variables Checklist**

**Backend (.env)**:
- ✅ `DATABASE_URL` (Supabase connection)
- ✅ `JWT_SECRET` (long random string)
- ✅ `CORS_ORIGIN` (frontend URL)
- ✅ `NODE_ENV=production`

**Frontend (.env)**:
- ✅ `VITE_API_BASE_URL` (backend URL + /api)

## 🚨 Important Notes

### Security
1. **Never commit** `.env` files to Git
2. **Use strong JWT secrets** (at least 32 characters)
3. **Set CORS properly** to only allow your frontend domain

### Performance
1. **Vercel Functions** have cold start delays (~1-2 seconds)
2. **Database connections** are pooled automatically
3. **Static assets** are served from CDN

### Monitoring
1. Check **Vercel Analytics** for performance
2. Monitor **Supabase logs** for database issues
3. Use **Vercel Functions** logs for debugging

## Troubleshooting

### Common Issues:

**1. "Network Error" on Registration**
- Check if `VITE_API_BASE_URL` is correct
- Verify backend is deployed and accessible
- Check CORS configuration

**2. "Database Connection Failed"**
- Verify Supabase connection string
- Check if database password is correct
- Ensure Supabase project is active

**3. "Function Timeout"**
- Vercel functions timeout after 10 seconds
- Optimize database queries
- Consider upgrading Vercel plan

**4. "CORS Error"**
- Ensure `CORS_ORIGIN` matches frontend URL exactly
- Include protocol (https://)
- No trailing slash

### Debug Steps:
1. **Check Vercel Function logs** in dashboard
2. **Test API endpoints** directly in browser
3. **Verify environment variables** are set correctly
4. **Check Supabase logs** for database issues

## 🎉 Success!

Once everything is deployed:
1. ✅ Users can register and login
2. ✅ AI line generation works
3. ✅ Data is saved to Supabase
4. ✅ Both apps are live on Vercel

Your full-stack application is now production-ready! 🚀