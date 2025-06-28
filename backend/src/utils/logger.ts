import winston from 'winston';
import fs from 'fs';

// Quick fix: ensure logs directory exists or use /tmp in serverless
const logDir = process.env.VERCEL ? '/tmp' : 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Simplified logger for serverless environment
const logger = winston.createLogger({
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
    // In serverless, only use console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// In development, also log to files
if (process.env.NODE_ENV !== 'production') {
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

export default logger;