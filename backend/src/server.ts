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

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(limiter);

// Body parsing middleware
app.use('/webhooks', express.raw({ type: 'application/json' })); // Raw body for webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lines', linesRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/v1', apiRoutes); // Public API
app.use('/webhooks', webhookRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database connection for serverless
let isConnected = false;

const initializeDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      // Don't throw error in serverless environment
    }
  }
};

// Initialize database on first request
app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN}`);
  });
}

export default app;