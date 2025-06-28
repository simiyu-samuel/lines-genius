export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    dailyGenerations: number;
    categories: string[];
    tones: string[];
    customPrompts: boolean;
    bulkExport: boolean;
    apiAccess: boolean;
    analytics: boolean;
    teamCollaboration: boolean;
  };
  popular?: boolean;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface UsageStats {
  dailyGenerations: number;
  monthlyGenerations: number;
  lastResetDate: number;
}