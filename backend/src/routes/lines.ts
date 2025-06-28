import express from 'express';
import { getFreshPrismaClient } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { generateLines, testOpenAIConnection } from '../services/openaiService';
import { generateLinesWithHuggingFace, testHuggingFaceConnection } from '../services/huggingFaceService';
import { checkUsageLimit, incrementUsage } from '../services/usageService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const router = express.Router();

// Get Prisma client (fresh for serverless, global for development)
const getPrismaClient = () => getFreshPrismaClient();

// Test AI services connection (for debugging)
router.get('/test-ai', async (req, res, next) => {
  try {
    const openaiConnected = await testOpenAIConnection();
    const huggingFaceConnected = await testHuggingFaceConnection();
    
    res.json({
      success: true,
      data: {
        openai_connected: openaiConnected,
        huggingface_connected: huggingFaceConnected,
        openai_api_key_configured: !!process.env.OPENAI_API_KEY,
        openai_api_key_format: process.env.OPENAI_API_KEY ? 
          (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'valid' : 'invalid') : 'missing',
        recommended_service: openaiConnected ? 'openai' : 'huggingface'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Generate lines
router.post('/generate', optionalAuth, validate(schemas.generateLines), async (req, res, next) => {
  let prisma: any = null;
  
  try {
    const { category, tone = 'corporate', prompt, count = 4 } = req.body;
    const userId = req.user?.id;

    console.log(`🎯 Line generation request:`, {
      userId: userId || 'anonymous',
      category,
      tone,
      count,
      hasPrompt: !!prompt
    });

    // Get fresh Prisma client for this request
    prisma = getPrismaClient();

    // Check usage limits for authenticated users
    if (userId) {
      try {
        const canGenerate = await checkUsageLimit(userId);
        if (!canGenerate) {
          throw new AppError('Daily generation limit reached. Please upgrade your plan.', 429);
        }
        console.log(`✅ Usage limit check passed for user: ${userId}`);
      } catch (error) {
        console.error('❌ Usage limit check failed:', error);
        // Continue without usage tracking if it fails
      }
    }

    // Create default prompt if none provided
    let finalPrompt = prompt;
    if (!finalPrompt || finalPrompt.trim() === '') {
      const defaultPrompts = {
        taglines: {
          corporate: 'Create professional business taglines that convey trust and reliability',
          funny: 'Create humorous and memorable taglines that make people smile',
          bold: 'Create powerful and confident taglines that command attention'
        },
        bios: {
          corporate: 'Create professional social media bios for business professionals',
          funny: 'Create witty and entertaining social media bios',
          bold: 'Create confident and impactful social media bios'
        },
        captions: {
          corporate: 'Create professional Instagram captions for business content',
          funny: 'Create humorous Instagram captions that engage followers',
          bold: 'Create bold and attention-grabbing Instagram captions'
        },
        quotes: {
          corporate: 'Create professional and motivational quotes for business',
          funny: 'Create humorous and lighthearted quotes',
          bold: 'Create powerful and inspiring quotes'
        },
        slogans: {
          corporate: 'Create professional marketing slogans for businesses',
          funny: 'Create catchy and humorous marketing slogans',
          bold: 'Create bold and memorable marketing slogans'
        },
        adlines: {
          corporate: 'Create professional advertising lines for business products',
          funny: 'Create humorous and engaging advertising lines',
          bold: 'Create bold and impactful advertising lines'
        }
      };

      const categoryDefaults = defaultPrompts[category as keyof typeof defaultPrompts];
      const toneDefaults = categoryDefaults?.[tone as keyof typeof categoryDefaults];
      finalPrompt = toneDefaults || `Create ${count} creative ${category} with a ${tone} tone`;
    }

    let result;
    let serviceUsed = 'unknown';

    // Try OpenAI first if available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        console.log('🤖 Attempting OpenAI generation...');
        result = await generateLines({
          category,
          tone,
          prompt: finalPrompt,
          count,
        });
        serviceUsed = 'openai';
        console.log(`✅ OpenAI generation successful: ${result.lines.length} lines`);
      } catch (openaiError) {
        console.warn('⚠️ OpenAI failed, falling back to Hugging Face:', openaiError);
        try {
          result = await generateLinesWithHuggingFace({
            category,
            tone,
            prompt: finalPrompt,
            count,
          });
          serviceUsed = 'huggingface';
          console.log(`✅ Hugging Face fallback successful: ${result.lines.length} lines`);
        } catch (hfError) {
          console.warn('⚠️ Hugging Face also failed, using fallback lines:', hfError);
          // Use simple fallback
          result = {
            lines: [
              `Professional ${category} for your business`,
              `Quality ${category} that delivers results`,
              `Innovative ${category} solutions`,
              `Excellence in ${category} creation`
            ].slice(0, count),
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
          };
          serviceUsed = 'fallback';
        }
      }
    } else {
      // Use Hugging Face or fallback
      try {
        console.log('🤖 Attempting Hugging Face generation...');
        result = await generateLinesWithHuggingFace({
          category,
          tone,
          prompt: finalPrompt,
          count,
        });
        serviceUsed = 'huggingface';
        console.log(`✅ Hugging Face generation successful: ${result.lines.length} lines`);
      } catch (hfError) {
        console.warn('⚠️ Hugging Face failed, using fallback lines:', hfError);
        result = {
          lines: [
            `Professional ${category} for your business`,
            `Quality ${category} that delivers results`,
            `Innovative ${category} solutions`,
            `Excellence in ${category} creation`
          ].slice(0, count),
          usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
        };
        serviceUsed = 'fallback';
      }
    }

    // Log the generation attempt
    try {
      await prisma.generationLog.create({
        data: {
          userId,
          category,
          tone,
          prompt: finalPrompt,
          response: result.lines,
          tokens: result.usage?.total_tokens || 0,
          success: true,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });
      console.log(`📊 Generation logged successfully for ${userId || 'anonymous'}`);
    } catch (logError) {
      console.error('❌ Failed to log generation:', logError);
      // Continue without logging if it fails
    }

    // Increment usage for authenticated users
    if (userId) {
      try {
        await incrementUsage(userId);
        console.log(`📈 Usage incremented for user: ${userId}`);
      } catch (usageError) {
        console.error('❌ Failed to increment usage:', usageError);
        // Continue without usage tracking if it fails
      }
    }

    console.log(`🎉 Generation completed successfully using ${serviceUsed}`);

    res.json({
      success: true,
      data: {
        lines: result.lines,
        usage: result.usage,
        category,
        tone,
        service_used: serviceUsed,
      },
    });
  } catch (error) {
    console.error('❌ Generation failed:', error);
    
    // Log failed generation attempt
    try {
      if (req.user?.id && prisma) {
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
    } catch (logError) {
      console.error('❌ Failed to log failed generation:', logError);
    }

    next(error);
  } finally {
    // Disconnect Prisma client in serverless environment
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

// Save a line
router.post('/save', authenticate, validate(schemas.saveLine), async (req, res, next) => {
  let prisma: any = null;
  
  try {
    const { text, category, tone, tags = [] } = req.body;
    const userId = req.user!.id;

    console.log(`💾 Saving line for user: ${userId}`);

    prisma = getPrismaClient();

    const savedLine = await prisma.savedLine.create({
      data: {
        text,
        category,
        tone,
        tags,
        userId,
      },
    });

    console.log(`✅ Line saved successfully: ${savedLine.id}`);

    res.status(201).json({
      success: true,
      data: { savedLine },
    });
  } catch (error) {
    console.error('❌ Failed to save line:', error);
    next(error);
  } finally {
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

// Get saved lines
router.get('/saved', authenticate, async (req, res, next) => {
  let prisma: any = null;
  
  try {
    const userId = req.user!.id;
    const { category, search, page = 1, limit = 20 } = req.query;

    console.log(`📚 Fetching saved lines for user: ${userId}`);

    prisma = getPrismaClient();

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

    console.log(`✅ Found ${savedLines.length} saved lines for user: ${userId}`);

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
    console.error('❌ Failed to fetch saved lines:', error);
    next(error);
  } finally {
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

// Delete saved line
router.delete('/saved/:id', authenticate, async (req, res, next) => {
  let prisma: any = null;
  
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    console.log(`🗑️ Deleting line ${id} for user: ${userId}`);

    prisma = getPrismaClient();

    const savedLine = await prisma.savedLine.findFirst({
      where: { id, userId },
    });

    if (!savedLine) {
      throw new AppError('Saved line not found', 404);
    }

    await prisma.savedLine.delete({
      where: { id },
    });

    console.log(`✅ Line deleted successfully: ${id}`);

    res.json({
      success: true,
      message: 'Saved line deleted successfully',
    });
  } catch (error) {
    console.error('❌ Failed to delete line:', error);
    next(error);
  } finally {
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

// Clear all saved lines
router.delete('/saved', authenticate, async (req, res, next) => {
  let prisma: any = null;
  
  try {
    const userId = req.user!.id;

    console.log(`🗑️ Clearing all lines for user: ${userId}`);

    prisma = getPrismaClient();

    const result = await prisma.savedLine.deleteMany({
      where: { userId },
    });

    console.log(`✅ Cleared ${result.count} lines for user: ${userId}`);

    res.json({
      success: true,
      message: `${result.count} saved lines deleted successfully`,
    });
  } catch (error) {
    console.error('❌ Failed to clear lines:', error);
    next(error);
  } finally {
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

// Test database connection
router.get('/test-db', async (req, res, next) => {
  let prisma: any = null;
  
  try {
    console.log('🧪 Testing database connection...');
    
    prisma = getPrismaClient();
    
    // Test basic connection with executeRaw to avoid prepared statements
    await prisma.$executeRaw`SELECT 1 as test`;
    
    // Test table access
    const userCount = await prisma.user.count();
    const lineCount = await prisma.savedLine.count();
    const logCount = await prisma.generationLog.count();
    
    console.log('✅ Database test successful');
    
    res.json({
      success: true,
      data: {
        connection: 'healthy',
        tables: {
          users: userCount,
          savedLines: lineCount,
          generationLogs: logCount
        },
        timestamp: new Date().toISOString(),
        serverless: !!process.env.VERCEL
      }
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (process.env.VERCEL && prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('❌ Failed to disconnect Prisma client:', disconnectError);
      }
    }
  }
});

export default router;