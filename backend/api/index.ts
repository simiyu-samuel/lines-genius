// api/index.ts - Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// Wrapper to handle any initialization issues
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Add request logging for debugging
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    
    // Let Express handle the request
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Ensure CORS headers are set even on error
    res.setHeader('Access-Control-Allow-Origin', 'https://lines-genius.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-Key, Content-Type, X-Requested-With, Accept, Origin');
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
    });
  }
};