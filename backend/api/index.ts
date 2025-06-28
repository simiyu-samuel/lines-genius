// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// Export the serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};