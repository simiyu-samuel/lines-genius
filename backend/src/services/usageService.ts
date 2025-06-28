import prisma from '../config/database';
import { AppError } from '../utils/AppError';

// Subscription plans with limits
const PLAN_LIMITS = {
  free: {
    dailyGenerations: 10,
    monthlyGenerations: 300,
  },
  pro: {
    dailyGenerations: -1, // unlimited
    monthlyGenerations: -1,
  },
  business: {
    dailyGenerations: -1, // unlimited
    monthlyGenerations: -1,
  },
};

export const checkUsageLimit = async (userId: string): Promise<boolean> => {
  try {
    console.log(`📊 Checking usage limit for user: ${userId}`);
    
    // Get user's current subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    const planId = subscription?.planId || 'free';
    const limits = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    console.log(`📋 User ${userId} plan: ${planId}, limits:`, limits);

    // If unlimited, allow generation
    if (limits.dailyGenerations === -1) {
      console.log(`✅ User ${userId} has unlimited generations`);
      return true;
    }

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageStats = await prisma.usageStats.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    const dailyUsage = usageStats?.dailyGenerations || 0;
    const canGenerate = dailyUsage < limits.dailyGenerations;
    
    console.log(`📈 User ${userId} daily usage: ${dailyUsage}/${limits.dailyGenerations}, can generate: ${canGenerate}`);
    
    return canGenerate;
  } catch (error) {
    console.error('❌ Failed to check usage limit:', error);
    // If usage check fails, allow generation (fail open)
    return true;
  }
};

export const incrementUsage = async (userId: string): Promise<void> => {
  try {
    console.log(`📈 Incrementing usage for user: ${userId}`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert usage stats for today
    const result = await prisma.usageStats.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        dailyGenerations: {
          increment: 1,
        },
        monthlyGenerations: {
          increment: 1,
        },
        totalGenerations: {
          increment: 1,
        },
      },
      create: {
        userId,
        date: today,
        dailyGenerations: 1,
        monthlyGenerations: 1,
        totalGenerations: 1,
      },
    });
    
    console.log(`✅ Usage incremented for user ${userId}:`, {
      daily: result.dailyGenerations,
      monthly: result.monthlyGenerations,
      total: result.totalGenerations
    });
  } catch (error) {
    console.error('❌ Failed to increment usage:', error);
    // Don't throw error, just log it
  }
};

export const getUserUsageStats = async (userId: string) => {
  try {
    console.log(`📊 Getting usage stats for user: ${userId}`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageStats = await prisma.usageStats.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    // Get user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    const planId = subscription?.planId || 'free';
    const limits = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    const stats = {
      dailyGenerations: usageStats?.dailyGenerations || 0,
      monthlyGenerations: usageStats?.monthlyGenerations || 0,
      totalGenerations: usageStats?.totalGenerations || 0,
      limits,
      planId,
    };
    
    console.log(`✅ Usage stats for user ${userId}:`, stats);
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get usage stats:', error);
    // Return default stats if query fails
    return {
      dailyGenerations: 0,
      monthlyGenerations: 0,
      totalGenerations: 0,
      limits: PLAN_LIMITS.free,
      planId: 'free',
    };
  }
};

export const resetDailyUsage = async (): Promise<void> => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    // This would typically be run as a daily cron job
    // Reset daily generations for all users
    await prisma.usageStats.updateMany({
      where: {
        date: {
          lte: yesterday,
        },
      },
      data: {
        dailyGenerations: 0,
      },
    });
    
    console.log('✅ Daily usage reset completed');
  } catch (error) {
    console.error('❌ Failed to reset daily usage:', error);
    throw new AppError('Failed to reset daily usage', 500);
  }
};