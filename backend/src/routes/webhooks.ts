import express from 'express';
import prisma from '../config/database';
import logger from '../utils/logger';

const router = express.Router();

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    // In a real implementation, you would verify the webhook signature
    // and process the event accordingly
    
    logger.info('Stripe webhook received');
    
    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).send('Webhook Error');
  }
});

// M-Pesa webhook handler
router.post('/mpesa', async (req, res) => {
  try {
    const { Body } = req.body;
    
    if (Body && Body.stkCallback) {
      const { ResultCode, CheckoutRequestID } = Body.stkCallback;
      
      // Update payment status based on result
      if (ResultCode === 0) {
        // Payment successful
        logger.info(`M-Pesa payment successful: ${CheckoutRequestID}`);
      } else {
        // Payment failed
        logger.info(`M-Pesa payment failed: ${CheckoutRequestID}`);
      }
    }
    
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    logger.error('M-Pesa webhook error:', error);
    res.status(400).json({ ResultCode: 1, ResultDesc: 'Error' });
  }
});

export default router;