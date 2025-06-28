# Lines Genius Backend API

A comprehensive Node.js backend API for the Lines Genius platform - AI-powered creative line generation with user management, subscriptions, and payment processing.

## 🚀 Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication
- API key authentication for external integrations
- Role-based access control
- Secure password hashing with bcrypt

### 🤖 **AI Integration**
- OpenAI GPT-3.5-turbo integration
- Intelligent prompt engineering for different categories
- Usage tracking and rate limiting
- Comprehensive error handling and fallbacks

### 👤 **User Management**
- User registration and login
- Profile management
- Password reset functionality
- Account deactivation

### 💾 **Data Management**
- Save and organize generated lines
- Advanced search and filtering
- Pagination support
- Data export capabilities

### 📊 **Usage Analytics**
- Real-time usage tracking
- Daily/monthly limits enforcement
- Subscription-based feature gating
- Comprehensive logging

### 💳 **Payment & Subscriptions**
- Stripe integration for payments
- M-Pesa support for Kenya
- Subscription management
- Webhook handling for payment events

### 🔧 **Developer Features**
- RESTful API design
- Comprehensive API documentation
- Rate limiting and security
- Health monitoring endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **AI**: OpenAI GPT-3.5-turbo
- **Payments**: Stripe, M-Pesa
- **Logging**: Winston
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stripe account (optional)

### 1. Clone and Install
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# (Optional) Open Prisma Studio
npm run studio
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🔧 Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lines_genius"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Server
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### Optional Services

```env
# Email (for notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# M-Pesa (for Kenya payments)
MPESA_CONSUMER_KEY="your_mpesa_key"
MPESA_CONSUMER_SECRET="your_mpesa_secret"
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
POST /api/auth/refresh     # Refresh token
```

### Line Generation Endpoints

```
POST /api/lines/generate    # Generate new lines
POST /api/lines/save       # Save a line
GET  /api/lines/saved      # Get saved lines
DELETE /api/lines/saved/:id # Delete saved line
```

### User Management

```
GET    /api/users/profile   # Get user profile
PUT    /api/users/profile   # Update profile
POST   /api/users/change-password # Change password
GET    /api/users/usage     # Get usage statistics
```

### Subscription Management

```
GET  /api/subscriptions     # Get user subscriptions
POST /api/subscriptions     # Create subscription
PUT  /api/subscriptions/:id # Update subscription
```

### Payment Processing

```
POST /api/payments/stripe/create-intent    # Create Stripe payment
POST /api/payments/mpesa/stk-push         # Initiate M-Pesa payment
GET  /api/payments/history                # Payment history
```

## 🔒 Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits per endpoint
- User-based rate limiting for authenticated routes

### Input Validation
- Joi schema validation for all inputs
- SQL injection prevention
- XSS protection with helmet

### Authentication Security
- JWT tokens with expiration
- Secure password hashing
- API key authentication for external access

## 📊 Database Schema

### Core Tables
- **users**: User accounts and profiles
- **saved_lines**: User's saved generated lines
- **subscriptions**: User subscription data
- **usage_stats**: Daily/monthly usage tracking
- **payments**: Payment transaction records
- **generation_logs**: AI generation audit trail

### Relationships
- Users have many saved lines, subscriptions, and payments
- Usage stats track daily/monthly limits per user
- Generation logs provide audit trail and analytics

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
```bash
NODE_ENV=production
DATABASE_URL="your-production-db-url"
# Add all required environment variables
```

2. **Build and Start**
```bash
npm run build
npm start
```

3. **Database Migration**
```bash
npx prisma migrate deploy
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📈 Monitoring

### Health Check
```
GET /health
```

Returns server status, uptime, and environment info.

### Logging
- Structured JSON logging with Winston
- Error tracking and alerting
- Request/response logging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Prisma for database operations
- Add proper error handling
- Include comprehensive logging
- Write tests for new features

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Lines Genius platform**