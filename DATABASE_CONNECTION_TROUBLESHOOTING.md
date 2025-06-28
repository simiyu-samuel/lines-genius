# 🔧 Database Connection Troubleshooting Guide

## Current Issues Identified

### 1. **Database Connection String Format**
Your Supabase connection string should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2. **Common Connection Issues**

#### Issue: "Password authentication failed"
**Solutions:**
1. Reset your Supabase database password:
   - Go to Supabase Dashboard → Settings → Database
   - Click "Reset database password"
   - Copy the new password
   - Update your environment variables

2. Ensure the password is URL-encoded if it contains special characters

#### Issue: "Connection refused" or "timeout"
**Solutions:**
1. Check if your Supabase project is active (not paused)
2. Verify the project reference ID in the connection string
3. Ensure you're using the correct region

#### Issue: "SSL connection required"
**Solutions:**
Add SSL parameters to your connection string:
```
postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?sslmode=require
```

### 3. **Testing Your Connection**

#### Local Test:
```bash
cd backend
npx prisma db pull
```

#### API Test:
Visit: `http://localhost:3001/api/lines/test-db`

#### Production Test:
Visit: `https://your-backend.vercel.app/api/lines/test-db`

### 4. **Environment Variables Checklist**

#### Backend (.env):
```env
# Required
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
JWT_SECRET="your-long-random-secret-key"
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend.vercel.app"

# Optional
OPENAI_API_KEY="sk-your-openai-key"
```

#### Frontend (.env):
```env
VITE_API_BASE_URL="https://your-backend.vercel.app/api"
```

### 5. **Database Schema Verification**

Your database should have these tables:
- ✅ users
- ✅ saved_lines
- ✅ subscriptions
- ✅ usage_stats
- ✅ payments
- ✅ api_keys
- ✅ generation_logs

### 6. **Debugging Steps**

1. **Check Supabase Dashboard**
   - Ensure project is active
   - Verify tables exist
   - Check recent activity logs

2. **Test Connection Locally**
   ```bash
   cd backend
   npm run dev
   # Visit http://localhost:3001/health
   ```

3. **Check Vercel Logs**
   - Go to Vercel Dashboard → Functions
   - Check recent invocations for errors

4. **Test Database Operations**
   ```bash
   # Test Prisma connection
   npx prisma studio
   ```

### 7. **Line Generation Tracking Issues**

The following improvements have been made:

#### Enhanced Logging:
- ✅ Detailed console logs for each step
- ✅ Usage tracking with error handling
- ✅ Generation logging with fallback
- ✅ Service selection tracking

#### Better Error Handling:
- ✅ Graceful fallbacks when database fails
- ✅ Continue operation even if tracking fails
- ✅ Detailed error messages in logs

#### Usage Tracking:
- ✅ Proper usage limit checking
- ✅ Usage increment with error handling
- ✅ Daily/monthly/total tracking
- ✅ Plan-based limits

### 8. **Quick Fixes Applied**

1. **Enhanced database connection testing**
2. **Improved error handling in usage tracking**
3. **Better logging throughout the generation process**
4. **Graceful fallbacks when services fail**
5. **Added database test endpoint: `/api/lines/test-db`**

### 9. **Next Steps**

1. **Update your environment variables** with correct Supabase connection string
2. **Deploy to Vercel** with new environment variables
3. **Test the endpoints**:
   - `/health` - Overall health
   - `/api/lines/test-db` - Database connectivity
   - `/api/lines/test-ai` - AI services
   - `/api/lines/generate` - Line generation

4. **Monitor logs** in Vercel dashboard for any remaining issues

### 10. **Support Resources**

- **Supabase Docs**: https://supabase.com/docs/guides/database
- **Prisma Docs**: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- **Vercel Docs**: https://vercel.com/docs/functions/serverless-functions

## 🚨 Emergency Fallback

If database connection continues to fail, the app will:
1. ✅ Still generate lines using AI or fallback
2. ✅ Show appropriate error messages
3. ✅ Continue to function for anonymous users
4. ⚠️ Disable user registration/login until fixed
5. ⚠️ Disable line saving until fixed

The app is designed to be resilient and continue working even with database issues!