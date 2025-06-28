# 🚀 Vercel Deployment Checklist

## Pre-Deployment Setup

### ✅ **1. Get Supabase Connection String**
- [ ] Go to Supabase Dashboard → Settings → Database
- [ ] Set database password (if blank)
- [ ] Copy connection string: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
- [ ] Test connection locally: `cd backend && npx prisma db pull`

### ✅ **2. Prepare Environment Variables**
- [ ] Create strong JWT secret (32+ characters)
- [ ] Gather all API keys (OpenAI, EmailJS, PayPal, etc.)
- [ ] Note down your GitHub repository URL

## Backend Deployment (Step 1)

### ✅ **3. Deploy Backend to Vercel**
- [ ] Go to [vercel.com](https://vercel.com) → New Project
- [ ] Import your GitHub repository
- [ ] **Set Root Directory to `backend`**
- [ ] Framework: Other
- [ ] Click Deploy

### ✅ **4. Configure Backend Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
- [ ] `DATABASE_URL` = Your Supabase connection string
- [ ] `JWT_SECRET` = Strong random string (32+ chars)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `CORS_ORIGIN` = `https://your-frontend.vercel.app` (update later)
- [ ] `RATE_LIMIT_WINDOW_MS` = `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` = `100`
- [ ] Optional: `OPENAI_API_KEY`, `EMAIL_*`, `STRIPE_*`, etc.

### ✅ **5. Test Backend**
- [ ] Copy backend URL: `https://your-backend.vercel.app`
- [ ] Test health endpoint: `https://your-backend.vercel.app/health`
- [ ] Should return JSON with status "OK"

## Frontend Deployment (Step 2)

### ✅ **6. Deploy Frontend to Vercel**
- [ ] Vercel Dashboard → New Project
- [ ] Import same GitHub repository
- [ ] **Root Directory: Leave as default (root)**
- [ ] Framework: Vite
- [ ] Click Deploy

### ✅ **7. Configure Frontend Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
- [ ] `VITE_API_BASE_URL` = `https://your-backend.vercel.app/api`
- [ ] Optional: `VITE_EMAILJS_*`, `VITE_PAYPAL_*`, `VITE_MPESA_*`

### ✅ **8. Update Backend CORS**
- [ ] Copy frontend URL: `https://your-frontend.vercel.app`
- [ ] Go to backend Vercel project
- [ ] Update `CORS_ORIGIN` environment variable
- [ ] Redeploy backend (Deployments → Redeploy)

## Testing & Verification

### ✅ **9. Test Complete Flow**
- [ ] Visit frontend URL
- [ ] Open browser dev tools (F12)
- [ ] Try user registration
- [ ] Check Network tab for API calls
- [ ] Test line generation
- [ ] Verify data saves to Supabase
- [ ] Test saved lines page

### ✅ **10. Verify Database**
- [ ] Check Supabase dashboard
- [ ] Verify new users appear in `users` table
- [ ] Check `saved_lines` table for generated content
- [ ] Ensure all tables exist and have data

## Production Optimization

### ✅ **11. Security Check**
- [ ] JWT secret is strong and unique
- [ ] CORS is set to exact frontend URL
- [ ] No sensitive data in frontend environment variables
- [ ] Database connection uses SSL

### ✅ **12. Performance Check**
- [ ] Frontend loads quickly
- [ ] API responses are under 5 seconds
- [ ] Images and assets load properly
- [ ] Mobile responsiveness works

### ✅ **13. Monitoring Setup**
- [ ] Check Vercel Analytics
- [ ] Monitor Vercel Function logs
- [ ] Set up Supabase monitoring
- [ ] Test error handling

## Custom Domains (Optional)

### ✅ **14. Add Custom Domains**
- [ ] Frontend: Add domain in Vercel → Settings → Domains
- [ ] Backend: Add API subdomain (api.yourdomain.com)
- [ ] Update DNS records as instructed
- [ ] Update environment variables with new URLs
- [ ] Test SSL certificates

## Final Verification

### ✅ **15. End-to-End Test**
- [ ] Complete user journey: Register → Generate → Save → View
- [ ] Test on different devices/browsers
- [ ] Verify all features work in production
- [ ] Check for any console errors
- [ ] Test payment flows (if implemented)

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Users can register and login
- ✅ Line generation works
- ✅ Data persists in Supabase
- ✅ No CORS errors in console
- ✅ API calls complete successfully

## 🚨 Common Issues & Solutions

### Issue: "Network Error" on API calls
**Solution**: Check `VITE_API_BASE_URL` and `CORS_ORIGIN` are correct

### Issue: "Database connection failed"
**Solution**: Verify Supabase connection string and password

### Issue: "Function timeout"
**Solution**: Optimize database queries, check Vercel function logs

### Issue: "CORS error"
**Solution**: Ensure CORS_ORIGIN exactly matches frontend URL (with https://)

## 📞 Need Help?

If you encounter issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables
4. Test API endpoints directly
5. Check Supabase logs

## 🎉 Congratulations!

Once all items are checked, your Lines Genius app is live in production! 🚀

**Frontend**: https://your-frontend.vercel.app
**Backend**: https://your-backend.vercel.app
**Database**: Supabase (existing)