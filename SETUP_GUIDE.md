# Lines Genius - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: Frontend Only (No Backend Required)
The app works perfectly with the built-in fallback AI!

```bash
# 1. Install dependencies
npm install

# 2. Start the frontend
npm run dev

# 3. Open http://localhost:5173
```

That's it! The app will use the enhanced mock AI for line generation.

---

### Option 2: Full Stack Setup (With Backend)

#### Step 1: Setup Environment Variables

**Frontend (.env):**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add (optional):
VITE_API_BASE_URL=http://localhost:3001/api
VITE_OPENAI_API_KEY=your_openai_key_here  # Optional
```

**Backend (.env):**
```bash
cd backend
cp .env.example .env

# Edit backend/.env and add:
DATABASE_URL="postgresql://user:password@localhost:5432/lines_genius"
JWT_SECRET="your-super-secret-jwt-key-change-this"
OPENAI_API_KEY="sk-your-openai-key"  # Optional but recommended
```

#### Step 2: Setup Database

**Option A: PostgreSQL (Recommended for Production)**
```bash
# Install PostgreSQL if you haven't
# Then create database:
createdb lines_genius

# Run migrations
cd backend
npm install
npx prisma migrate dev
```

**Option B: SQLite (Quick Testing)**
```bash
# Edit backend/.env:
DATABASE_URL="file:./dev.db"

# Run migrations
cd backend
npm install
npx prisma migrate dev
```

#### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🎯 Features Overview

### ✅ Working Features (No Backend Required)
- ✨ Line generation with enhanced mock AI
- 🎨 Beautiful UI with dark/light mode
- 📋 Copy individual or all lines
- 💾 Export to TXT, JSON, CSV
- 🎭 8 different tones
- 📦 6 categories
- 🔄 Automatic retry logic
- 📱 Fully responsive

### 🚀 Additional Features (With Backend)
- 🤖 Real OpenAI GPT-3.5-turbo integration
- 👤 User authentication
- 💾 Save lines to database
- 📊 Usage tracking and limits
- 💳 Subscription management
- 📈 Analytics and history

---

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection issues
1. Check if backend is running on port 3001
2. Verify VITE_API_BASE_URL in frontend .env
3. Check CORS settings in backend

### Database connection errors
1. Verify DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Run migrations: `npx prisma migrate dev`
4. Check database exists: `psql -l`

### OpenAI API errors
1. Verify API key starts with `sk-`
2. Check API key has credits
3. App will automatically fallback to mock AI

---

## 📝 Environment Variables Reference

### Frontend (.env)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_BASE_URL | No | http://localhost:3001/api | Backend API URL |
| VITE_OPENAI_API_KEY | No | - | OpenAI API key (frontend fallback) |
| VITE_EMAILJS_SERVICE_ID | No | - | EmailJS service ID |
| VITE_PAYPAL_CLIENT_ID | No | - | PayPal client ID |

### Backend (.env)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| JWT_SECRET | Yes | - | Secret for JWT tokens |
| OPENAI_API_KEY | No | - | OpenAI API key |
| PORT | No | 3001 | Server port |
| NODE_ENV | No | development | Environment |
| CORS_ORIGIN | No | http://localhost:5173 | Allowed CORS origin |

---

## 🎉 Success Indicators

### Frontend is working when you see:
- ✅ App loads at http://localhost:5173
- ✅ Can select category and tone
- ✅ "Generate Lines" button is clickable
- ✅ Lines appear after clicking generate
- ✅ Can copy and export lines

### Backend is working when you see:
- ✅ Backend runs at http://localhost:3001
- ✅ Health check works: http://localhost:3001/health
- ✅ Frontend shows "AI-powered generation" badge
- ✅ Can register/login users
- ✅ Can save lines to database

---

## 🆘 Need Help?

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check if ports 3001 and 5173 are available
5. Review the logs in terminal

---

## 🚀 Next Steps

1. ✅ Get the app running (you're here!)
2. 📝 Generate some lines and test features
3. 🎨 Customize the UI to your liking
4. 🔑 Add your OpenAI API key for better results
5. 🗄️ Setup database for persistence
6. 🚀 Deploy to production (Vercel + Railway)

Happy generating! 🎉
