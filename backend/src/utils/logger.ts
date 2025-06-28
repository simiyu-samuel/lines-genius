import winston from 'winston';

// Fallback logger in case Winston fails
const fallbackLogger = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
  debug: (message: string, meta?: any) => console.log(`[DEBUG] ${message}`, meta || ''),
};

// Try to create Winston logger, fallback to console if it fails
let logger: any;

try {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      process.env.NODE_ENV === 'production' 
        ? winston.format.json()
        : winston.format.simple()
    ),
    defaultMeta: { service: 'lines-genius-api' },
    transports: [
      // Always use console transport (works in serverless)
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ],
  });

  // Only add file transports in local development (not production or serverless)
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    const fs = require('fs');
    const logDir = 'logs';
    
    // Ensure logs directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    logger.add(new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      handleExceptions: true,
      handleRejections: true
    }));
    logger.add(new winston.transports.File({ 
      filename: 'logs/combined.log',
      handleExceptions: true,
      handleRejections: true
    }));
  }
} catch (error) {
  console.error('Failed to initialize Winston logger, using fallback:', error);
  logger = fallbackLogger;
}

export default logger;