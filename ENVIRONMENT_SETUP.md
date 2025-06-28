# Environment Setup Guide

## Backend Environment Variables (Vercel)

Set these in your Vercel backend project's Environment Variables:

### Required Variables
```
DATABASE_URL=your_supabase_database_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### AI Service Variables
```
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=gpt2
```

### Optional Variables
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_BUSINESS_SHORT_CODE=your_mpesa_shortcode
```

## Frontend Environment Variables (Vercel)

Set these in your Vercel frontend project's Environment Variables:

### Required Variables
```
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
```

### Optional Variables
```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_MPESA_ENVIRONMENT=production
```

## Hugging Face Setup

1. **Get API Key**: 
   - Go to https://huggingface.co/settings/tokens
   - Create a new token with "read" permissions

2. **Recommended Models**:
   - `gpt2` (default, free, reliable)
   - `distilgpt2` (faster, smaller)
   - `microsoft/DialoGPT-small` (good for conversations)

3. **Set in Backend**:
   ```
   HUGGINGFACE_API_KEY=your_token_here
   HUGGINGFACE_MODEL=gpt2
   ```

## Testing Your Setup

### Backend Health Check
```bash
curl https://your-backend-domain.vercel.app/health
```

### AI Services Test
```bash
curl https://your-backend-domain.vercel.app/api/lines/test-ai
```

### Line Generation Test
```bash
curl -X POST https://your-backend-domain.vercel.app/api/lines/generate \
  -H "Content-Type: application/json" \
  -d '{"category":"taglines","tone":"corporate","count":2}'
```

## Troubleshooting

### OpenAI Quota Exceeded
- The system will automatically fall back to Hugging Face
- No action needed unless you want to add more OpenAI credits

### Hugging Face 404 Error
- Check that your `HUGGINGFACE_MODEL` exists on Hugging Face
- Try using `gpt2` as the default model
- The system will try multiple fallback models automatically

### Prisma Prepared Statement Error
- This is fixed with the latest Prisma version
- The system now creates new Prisma instances for each request in serverless

### Frontend Connection Issues
- Ensure `VITE_API_BASE_URL` is set correctly
- Check that the backend URL is accessible
- Verify CORS settings in backend

## Deployment Checklist

### Backend
- [ ] All environment variables set in Vercel
- [ ] Database migrations deployed
- [ ] Prisma client generated
- [ ] Health endpoint responding
- [ ] AI test endpoint working

### Frontend
- [ ] `VITE_API_BASE_URL` set correctly
- [ ] Build completes successfully
- [ ] Can connect to backend API
- [ ] Line generation working

## Support

If you encounter issues:
1. Check the Vercel function logs
2. Verify all environment variables are set
3. Test the backend endpoints directly
4. Check the browser console for frontend errors 