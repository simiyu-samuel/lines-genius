import express from 'express';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Get payment history
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.payment.count({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create Stripe payment intent
router.post('/stripe/create-intent', authenticate, async (req, res, next) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user!.id;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod: 'stripe',
        planId,
      },
    });

    // In a real implementation, you would create a Stripe PaymentIntent here
    // For now, we'll simulate it
    const clientSecret = `pi_${payment.id}_secret_${Date.now()}`;

    logger.info(`Stripe payment intent created: ${payment.id}`);

    res.json({
      success: true,
      data: { clientSecret, paymentId: payment.id },
    });
  } catch (error) {
    next(error);
  }
});

// Initiate M-Pesa STK Push
router.post('/mpesa/stk-push', authenticate, async (req, res, next) => {
  try {
    const { phoneNumber, amount, planId } = req.body;
    const userId = req.user!.id;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency: 'KES',
        status: 'PENDING',
        paymentMethod: 'mpesa',
        planId,
      },
    });

    // In a real implementation, you would initiate M-Pesa STK Push here
    // For now, we'll simulate it
    const checkoutRequestID = `ws_CO_${Date.now()}_${payment.id}`;

    logger.info(`M-Pesa payment initiated: ${payment.id}`);

    res.json({
      success: true,
      data: {
        merchantRequestID: `merchant_${payment.id}`,
        checkoutRequestID,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        customerMessage: 'Success. Request accepted for processing',
      },
    });
  } catch (error) {
    next(error);
  }
});

// Check M-Pesa payment status
router.get('/mpesa/status/:checkoutRequestID', authenticate, async (req, res, next) => {
  try {
    const { checkoutRequestID } = req.params;

    // In a real implementation, you would query M-Pesa API for status
    // For now, we'll simulate a successful payment
    res.json({
      success: true,
      data: {
        resultCode: '0',
        resultDesc: 'The service request is processed successfully.',
        checkoutRequestID,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;