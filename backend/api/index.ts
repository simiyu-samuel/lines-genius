// api/index.ts - Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// Wrapper to handle any initialization issues
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Let Express handle the request
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};