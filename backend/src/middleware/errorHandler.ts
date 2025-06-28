import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction // next is still good practice to have here
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle CORS errors
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: 'Origin not allowed',
    });
  }

  if (error instanceof AppError) {
    // REMOVED 'return'
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
    return; // You can add a plain return to exit the function early.
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    // REMOVED 'return'
    res.status(400).json({
      success: false,
      error: 'Database operation failed',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    // REMOVED 'return'
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.message,
    });
    return;
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      message: error.message,
      stack: error.stack 
    }),
  });
};