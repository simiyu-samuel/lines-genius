import express from 'express';
import prisma from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { generateLines } from '../services/openaiService';
import { checkUsageLimit, incrementUsage } from '../services/usageService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Generate lines
router.post('/generate', optionalAuth, validate(schemas.generateLines), async (req, res, next) => {
  try {
    const { category, tone = 'corporate', prompt, count = 4 } = req.body;
    const userId = req.user?.id;

    // Check usage limits for authenticated users
    if (userId) {
      const canGenerate = await checkUsageLimit(userId);
      if (!canGenerate) {
        throw new AppError('Daily generation limit reached. Please upgrade your plan.', 429);
      }
    }

    // Generate lines using OpenAI
    const result = await generateLines({
      category,
      tone,
      prompt,
      count,
    });

    // Log the generation
    await prisma.generationLog.create({
      data: {
        userId,
        category,
        tone,
        prompt,
        response: result.lines,
        tokens: result.usage?.total_tokens,
        success: true,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });

    // Increment usage for authenticated users
    if (userId) {
      await incrementUsage(userId);
    }

    logger.info(`Lines generated for ${userId ? 'user ' + userId : 'anonymous'}: ${category}/${tone}`);

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
    // Log failed generation
    if (req.user?.id) {
      await prisma.generationLog.create({
        data: {
          userId: req.user.id,
          category: req.body.category,
          tone: req.body.tone || 'corporate',
          prompt: req.body.prompt,
          response: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });
    }

    next(error);
  }
});

// Save a line
router.post('/save', authenticate, validate(schemas.saveLine), async (req, res, next) => {
  try {
    const { text, category, tone, tags = [] } = req.body;
    const userId = req.user!.id;

    const savedLine = await prisma.savedLine.create({
      data: {
        text,
        category,
        tone,
        tags,
        userId,
      },
    });

    logger.info(`Line saved by user ${userId}: ${savedLine.id}`);

    res.status(201).json({
      success: true,
      data: { savedLine },
    });
  } catch (error) {
    next(error);
  }
});

// Get saved lines
router.get('/saved', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { category, search, page = 1, limit = 20 } = req.query;

    const where: any = { userId };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.text = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [savedLines, total] = await Promise.all([
      prisma.savedLine.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.savedLine.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        savedLines,
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

// Delete saved line
router.delete('/saved/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const savedLine = await prisma.savedLine.findFirst({
      where: { id, userId },
    });

    if (!savedLine) {
      throw new AppError('Saved line not found', 404);
    }

    await prisma.savedLine.delete({
      where: { id },
    });

    logger.info(`Line deleted by user ${userId}: ${id}`);

    res.json({
      success: true,
      message: 'Saved line deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Clear all saved lines
router.delete('/saved', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const result = await prisma.savedLine.deleteMany({
      where: { userId },
    });

    logger.info(`All lines cleared by user ${userId}: ${result.count} lines deleted`);

    res.json({
      success: true,
      message: `${result.count} saved lines deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;