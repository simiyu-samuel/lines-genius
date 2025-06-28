import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, UserSubscription, UsageStats } from '../types/subscription';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  subscription: UserSubscription | null;
  usageStats: UsageStats;
  canGenerate: boolean;
  upgradeRequired: boolean;
  incrementUsage: () => void;
  resetDailyUsage: () => void;
  hasFeature: (feature: keyof SubscriptionPlan['limits']) => boolean;
  getRemainingGenerations: () => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    dailyGenerations: 0,
    monthlyGenerations: 0,
    lastResetDate: Date.now()
  });

  // Get current plan based on subscription
  const currentPlan = subscription 
    ? subscriptionPlans.find(plan => plan.id === subscription.planId) || subscriptionPlans[0]
    : subscriptionPlans[0]; // Default to free plan

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load subscription and usage from localStorage (in real app, this would be from API)
      const savedSubscription = localStorage.getItem(`subscription_${user.id}`);
      const savedUsage = localStorage.getItem(`usage_${user.id}`);
      
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      }
      
      if (savedUsage) {
        const usage = JSON.parse(savedUsage);
        // Reset daily usage if it's a new day
        const today = new Date().toDateString();
        const lastReset = new Date(usage.lastResetDate).toDateString();
        
        if (today !== lastReset) {
          setUsageStats({
            ...usage,
            dailyGenerations: 0,
            lastResetDate: Date.now()
          });
        } else {
          setUsageStats(usage);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`usage_${user.id}`, JSON.stringify(usageStats));
    }
  }, [usageStats, user]);

  const canGenerate = () => {
    if (currentPlan.limits.dailyGenerations === -1) return true; // Unlimited
    return usageStats.dailyGenerations < currentPlan.limits.dailyGenerations;
  };

  const upgradeRequired = !canGenerate();

  const incrementUsage = () => {
    if (canGenerate()) {
      setUsageStats(prev => ({
        ...prev,
        dailyGenerations: prev.dailyGenerations + 1,
        monthlyGenerations: prev.monthlyGenerations + 1
      }));
    }
  };

  const resetDailyUsage = () => {
    setUsageStats(prev => ({
      ...prev,
      dailyGenerations: 0,
      lastResetDate: Date.now()
    }));
  };

  const hasFeature = (feature: keyof SubscriptionPlan['limits']): boolean => {
    return currentPlan.limits[feature] as boolean;
  };

  const getRemainingGenerations = (): number => {
    if (currentPlan.limits.dailyGenerations === -1) return -1; // Unlimited
    return Math.max(0, currentPlan.limits.dailyGenerations - usageStats.dailyGenerations);
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      subscription,
      usageStats,
      canGenerate: canGenerate(),
      upgradeRequired,
      incrementUsage,
      resetDailyUsage,
      hasFeature,
      getRemainingGenerations
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};