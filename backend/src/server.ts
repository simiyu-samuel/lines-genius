import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import logger from './utils/logger';
import { connectDatabase } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import linesRoutes from './routes/lines';
import subscriptionRoutes from './routes/subscriptions';
import paymentRoutes from './routes/payments';
import apiRoutes from './routes/api';
import webhookRoutes from './routes/webhooks';


// Add this right after your imports in server.ts
console.log('🚀 Server module loading...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL exists:', !!process.env.DATABASE_URL);
// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for Vercel and other platforms
app.set('trust proxy', 1);

// --- 1. CORS CONFIGURATION ---
// This MUST be the first middleware to run to handle preflight requests correctly.
// const corsOptions = {
//   origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
//     const allowedOrigins = [
//       process.env.CORS_ORIGIN,
//       'http://localhost:5173',
//       'http://localhost:3000',
//       'https://lines-genius.vercel.app',
//       'https://linesgenius.com',
//       'https://www.linesgenius.com'
//     ].filter(Boolean);

//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
// };
// Temporarily replace your corsOptions with this:
const corsOptions = {
  origin: [
    'https://lines-genius.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
};

// Apply CORS middleware. It will automatically handle OPTIONS requests.
app.use(cors(corsOptions));

// Add this debug middleware right after CORS
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  next();
});
// --- 2. SECURITY & RATE LIMITING MIDDLEWARE ---

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // IMPORTANT: Skip preflight OPTIONS requests and health checks
  skip: (req) => req.method === 'OPTIONS' || req.path === '/health' || req.path === '/api/health',
});

app.use(limiter);

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));


// --- 3. LOGGING & BODY PARSING ---

// Conditional logging for serverless
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Body parsing middleware - must come after webhooks raw body parser
app.use('/webhooks', express.raw({ type: 'application/json' })); // Raw body for Stripe webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// --- 4. DATABASE & HEALTH CHECKS ---

// Database connection state
let isConnected = false;

// Initialize database connection for serverless
const initializeDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      // In a serverless env, we might not want to crash the whole function
    }
  }
};

// Health check endpoint (can be called before database is connected)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: isConnected ? 'connected' : 'disconnected',
    version: '1.0.0',
  });
});

// Lazily initialize database on the first real request
app.use(async (req, res, next) => {
  // Skip DB connection for health checks and webhooks that don't need it
  if (req.path !== '/health' && !req.path.startsWith('/webhooks')) {
    await initializeDatabase();
  }
  next();
});


// --- 5. API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lines', linesRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/v1', apiRoutes); // Public API
app.use('/webhooks', webhookRoutes);

// Root endpoint for simple checks
app.get('/', (req, res) => {
  res.json({
    message: 'Lines Genius API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      lines: '/api/lines',
      users: '/api/users',
      subscriptions: '/api/subscriptions',
      payments: '/api/payments',
      api: '/api/v1',
    }
  });
});


// --- 6. ERROR HANDLING ---
// These must be the LAST middleware
app.use(notFound);
app.use(errorHandler);


// --- 7. LOCAL DEVELOPMENT SERVER ---
// This block only runs when you execute `node src/server.ts` directly
console.log(require.main === module ? 'Running in local development mode' : 'Running in production or serverless mode');
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 3001;
  
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running for local development on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  }).catch((error) => {
    logger.error('Failed to start local server:', error);
    process.exit(1);
  });
}

// Export the app for the serverless function handler
export default app;