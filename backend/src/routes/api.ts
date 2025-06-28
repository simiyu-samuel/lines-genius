import express from 'express';
import { authenticateApiKey } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { generateLines } from '../services/openaiService';
import { checkUsageLimit, incrementUsage } from '../services/usageService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Public API for external integrations
// Generate lines with API key authentication
router.post('/generate', authenticateApiKey, validate(schemas.generateLines), async (req, res, next) => {
  try {
    const { category, tone = 'corporate', prompt, count = 4 } = req.body;
    const userId = req.user!.id;

    // Check usage limits
    const canGenerate = await checkUsageLimit(userId);
    if (!canGenerate) {
      throw new AppError('API usage limit reached. Please upgrade your plan.', 429);
    }

    // Generate lines using OpenAI
    const result = await generateLines({
      category,
      tone,
      prompt,
      count,
    });

    // Increment usage
    await incrementUsage(userId);

    logger.info(`API lines generated for user ${userId}: ${category}/${tone}`);

    res.json({
      success: true,
      data: {
        lines: result.lines,
        usage: result.usage,
        category,
        tone,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get usage statistics
router.get('/usage', authenticateApiKey, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    
    // Get usage stats (implement this function)
    const usageStats = {
      remaining: 95,
      total: 100,
      resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    res.json({
      success: true,
      data: usageStats,
    });
  } catch (error) {
    next(error);
  }
});

// Get available plans
router.get('/plans', async (req, res, next) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        limits: {
          dailyGenerations: 10,
          monthlyGenerations: 300,
        },
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        limits: {
          dailyGenerations: -1,
          monthlyGenerations: -1,
        },
      },
      {
        id: 'business',
        name: 'Business',
        price: 29.99,
        limits: {
          dailyGenerations: -1,
          monthlyGenerations: -1,
        },
      },
    ];

    res.json({
      success: true,
      data: { plans },
    });
  } catch (error) {
    next(error);
  }
});

export default router;