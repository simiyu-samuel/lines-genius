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

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Rate limiting - more lenient for serverless
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks in serverless
    return req.path === '/health' || req.path === '/api/health';
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for serverless
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Conditional logging for serverless
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

app.use(limiter);

// Body parsing middleware
app.use('/webhooks', express.raw({ type: 'application/json' })); // Raw body for webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
      // Don't throw error in serverless environment, continue with degraded functionality
    }
  }
};

// Health check endpoint (before database middleware)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: isConnected ? 'connected' : 'disconnected',
  });
});

// Initialize database on first request (except health check)
app.use(async (req, res, next) => {
  if (req.path !== '/health') {
    await initializeDatabase();
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lines', linesRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/v1', apiRoutes); // Public API
app.use('/webhooks', webhookRoutes);

// Root endpoint for serverless
app.get('/', (req, res) => {
  res.json({
    message: 'Lines Genius API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      lines: '/api/lines',
      users: '/api/users',
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// For local development only
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 3001;
  
  // Initialize database for local development
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN}`);
    });
  }).catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;