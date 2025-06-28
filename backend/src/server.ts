import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import logger from './utils/logger';
import { connectDatabase, testDatabaseConnection } from './config/database';

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

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  // Don't exit in serverless environment, just log the error
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    process.exit(1);
  }
}

const app = express();

// Trust proxy for Vercel and other platforms
app.set('trust proxy', 1);

// --- 1. CORS CONFIGURATION ---
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://lines-genius.vercel.app',
      'https://linesgenius.com',
      'https://www.linesgenius.com'
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// --- 2. SECURITY & RATE LIMITING MIDDLEWARE ---
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || req.path === '/health' || req.path === '/api/health',
});

app.use(limiter);

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// --- 3. LOGGING & BODY PARSING ---
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Body parsing middleware
app.use('/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- 4. DATABASE & HEALTH CHECKS ---
let isConnected = false;

// Initialize database connection
const initializeDatabase = async () => {
  if (!isConnected) {
    try {
      console.log('🔌 Initializing database connection...');
      const success = await connectDatabase();
      if (success) {
        isConnected = true;
        console.log('✅ Database initialized successfully');
        
        // Test database functionality
        const testResult = await testDatabaseConnection();
        if (testResult) {
          console.log('✅ Database functionality test passed');
        } else {
          console.log('⚠️ Database functionality test failed');
        }
      } else {
        console.log('⚠️ Database connection failed, but continuing...');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
    }
  }
};

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: isConnected ? 'connected' : 'disconnected',
    version: '1.0.0',
    serverless: !!process.env.VERCEL,
    memory: process.memoryUsage(),
  };

  // Test database if connected
  if (isConnected) {
    try {
      const dbTest = await testDatabaseConnection();
      healthData.database = dbTest ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthData.database = 'error';
    }
  }

  res.status(200).json(healthData);
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
app.use('/api/v1', apiRoutes);
app.use('/webhooks', webhookRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Lines Genius API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'connected' : 'disconnected',
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
app.use(notFound);
app.use(errorHandler);

// --- 7. LOCAL DEVELOPMENT SERVER ---
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