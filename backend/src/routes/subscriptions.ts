import express from 'express';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Get user subscriptions
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    next(error);
  }
});

// Create subscription
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { planId, stripeCustomerId, stripeSubscriptionId } = req.body;
    const userId = req.user!.id;

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    if (existingSubscription) {
      throw new AppError('User already has an active subscription', 400);
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        stripeCustomerId,
        stripeSubscriptionId,
      },
    });

    logger.info(`Subscription created for user ${userId}: ${subscription.id}`);

    res.status(201).json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    next(error);
  }
});

// Update subscription
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Subscription updated: ${id}`);

    res.json({
      success: true,
      data: { subscription: updatedSubscription },
    });
  } catch (error) {
    next(error);
  }
});

// Cancel subscription
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    // Cancel subscription
    const cancelledSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    });

    logger.info(`Subscription cancelled: ${id}`);

    res.json({
      success: true,
      data: { subscription: cancelledSubscription },
    });
  } catch (error) {
    next(error);
  }
});

export default router;