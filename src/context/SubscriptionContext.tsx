import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, UserSubscription, UsageStats } from '../types/subscription';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { usersAPI, subscriptionsAPI } from '../services/apiService';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  subscription: UserSubscription | null;
  usageStats: UsageStats;
  canGenerate: boolean;
  upgradeRequired: boolean;
  isLoading: boolean;
  refreshUsage: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  // Get current plan based on subscription
  const currentPlan = subscription 
    ? subscriptionPlans.find(plan => plan.id === subscription.planId) || subscriptionPlans[0]
    : subscriptionPlans[0]; // Default to free plan

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Reset to default state when not authenticated
      setSubscription(null);
      setUsageStats({
        dailyGenerations: 0,
        monthlyGenerations: 0,
        lastResetDate: Date.now()
      });
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load subscription data
      const subscriptionResponse = await subscriptionsAPI.getSubscriptions();
      if (subscriptionResponse.success && subscriptionResponse.data?.subscriptions?.length > 0) {
        const activeSubscription = subscriptionResponse.data.subscriptions.find(
          (sub: any) => sub.status === 'ACTIVE'
        );
        if (activeSubscription) {
          setSubscription({
            planId: activeSubscription.planId,
            status: activeSubscription.status.toLowerCase() as any,
            currentPeriodEnd: new Date(activeSubscription.currentPeriodEnd).getTime(),
            cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd
          });
        }
      }

      // Load usage stats
      await refreshUsage();
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsage = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await usersAPI.getUsageStats();
      if (response.success && response.data) {
        setUsageStats({
          dailyGenerations: response.data.dailyGenerations,
          monthlyGenerations: response.data.monthlyGenerations,
          lastResetDate: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to refresh usage stats:', error);
    }
  };

  const canGenerate = () => {
    if (currentPlan.limits.dailyGenerations === -1) return true; // Unlimited
    return usageStats.dailyGenerations < currentPlan.limits.dailyGenerations;
  };

  const upgradeRequired = !canGenerate();

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
      isLoading,
      refreshUsage,
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