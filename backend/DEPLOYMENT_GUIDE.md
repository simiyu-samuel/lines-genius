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
HUGGINGFACE_API_KEY=your-huggingface-key
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🤖 AI Service Setup

### Option 1: OpenAI (Recommended)
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to Vercel: `OPENAI_API_KEY=sk-your-key`

### Option 2: Hugging Face (Free)
1. Get API key from [Hugging Face](https://huggingface.co/settings/tokens)
2. Add to Vercel: `HUGGINGFACE_API_KEY=hf-your-key`
3. Free tier available

### Option 3: Fallback Templates
- Works without any API keys
- Uses pre-built templates
- Always available as backup

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
│   ├── services/        # AI services (OpenAI, Hugging Face)
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
- AI test: `https://your-domain.vercel.app/api/lines/test-ai`
- Line generation: `https://your-domain.vercel.app/api/lines/generate`

## 🔄 AI Service Priority
1. **OpenAI** (if API key provided)
2. **Hugging Face** (if API key provided)
3. **Fallback Templates** (always available) 