import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { getUserUsageStats } from '../services/usageService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, validate(schemas.updateProfile), async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user!.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${userId}`);

    res.json({
      success: true,
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.post('/change-password', authenticate, validate(schemas.changePassword), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    logger.info(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get usage statistics
router.get('/usage', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const usageStats = await getUserUsageStats(userId);

    res.json({
      success: true,
      data: usageStats,
    });
  } catch (error) {
    next(error);
  }
});

// Delete account
router.delete('/account', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    // Soft delete by deactivating account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    logger.info(`Account deactivated: ${userId}`);

    res.json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;