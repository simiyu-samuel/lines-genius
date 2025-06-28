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

    // If unlimited, allow generation
    if (limits.dailyGenerations === -1) {
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
    return dailyUsage < limits.dailyGenerations;
  } catch (error) {
    throw new AppError('Failed to check usage limit', 500);
  }
};

export const incrementUsage = async (userId: string): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert usage stats for today
    await prisma.usageStats.upsert({
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
  } catch (error) {
    throw new AppError('Failed to increment usage', 500);
  }
};

export const getUserUsageStats = async (userId: string) => {
  try {
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

    return {
      dailyGenerations: usageStats?.dailyGenerations || 0,
      monthlyGenerations: usageStats?.monthlyGenerations || 0,
      totalGenerations: usageStats?.totalGenerations || 0,
      limits,
      planId,
    };
  } catch (error) {
    throw new AppError('Failed to get usage stats', 500);
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
  } catch (error) {
    throw new AppError('Failed to reset daily usage', 500);
  }
};