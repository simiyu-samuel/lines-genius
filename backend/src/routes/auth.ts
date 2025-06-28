import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';
import { validate, schemas } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// --- HELPER FUNCTION FOR JWT SIGNING (FINAL VERSION) ---
const generateToken = (user: { id: string; email: string; }): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    logger.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
    throw new Error('Server configuration error: JWT secret is missing.');
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };
  
  // Use type assertion to avoid TypeScript conflicts
  return jwt.sign(payload, jwtSecret as jwt.Secret, { expiresIn: '7d' });
};


// Register
router.post('/register', validate(schemas.register), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error in register:', dbError);
      throw new AppError('Database connection failed. Please try again later.', 503);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    await prisma.usageStats.create({
      data: { userId: user.id, date: new Date() },
    });

    const token = generateToken(user);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

// Login
router.post('/login', validate(schemas.login), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if database is available
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error in login:', dbError);
      throw new AppError('Database connection failed. Please try again later.', 503);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, avatar: true, createdAt: true, updatedAt: true,
      },
    });

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', authenticate, async (req, res, next) => {
  try {
    const token = generateToken(req.user!);
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
});

export default router;