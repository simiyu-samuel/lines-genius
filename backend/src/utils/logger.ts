// Simple, serverless-friendly logger
const createLogger = () => {
  // In production or serverless, use simple console logger
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return {
      info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
      error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
      warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
      debug: (message: string, meta?: any) => console.log(`[DEBUG] ${message}`, meta || ''),
    };
  }

  // In development, try to use Winston
  try {
    const winston = require('winston');
    
    const logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.simple()
      ),
      defaultMeta: { service: 'lines-genius-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ],
    });

    // Add file transports only in local development
    const fs = require('fs');
    const logDir = 'logs';
    
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

    return logger;
  } catch (error) {
    console.error('Failed to initialize Winston logger, using fallback:', error);
    return {
      info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
      error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
      warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
      debug: (message: string, meta?: any) => console.log(`[DEBUG] ${message}`, meta || ''),
    };
  }
};

const logger = createLogger();

export default logger;