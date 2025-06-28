# Vercel Deployment Guide

## 🎯 Framework Selection
When creating a new Vercel project for this backend:
- **Choose**: `Node.js`
- **Root Directory**: `backend`
- **Framework Preset**: `Node.js`

## 🔧 Vercel Project Settings

### Build Settings:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables (Required):
```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://lines-genius.vercel.app
NODE_ENV=production
```

### Environment Variables (Optional):
```
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment Steps

1. **Create New Vercel Project**
2. **Connect to GitHub Repository**
3. **Set Root Directory to `backend`**
4. **Choose Framework: Node.js**
5. **Add Environment Variables**
6. **Deploy**

## 📁 Project Structure
```
backend/
├── api/
│   └── index.ts          # Vercel serverless entry point
├── src/
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/          # Configuration files
│   └── server.ts        # Express server
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json         # Dependencies and scripts
├── vercel.json         # Vercel configuration
└── tsconfig.json       # TypeScript configuration
```

## ✅ Verification
After deployment, test:
- Health endpoint: `https://your-domain.vercel.app/health`
- Root endpoint: `https://your-domain.vercel.app/`
- API endpoints: `https://your-domain.vercel.app/api/auth/login` 