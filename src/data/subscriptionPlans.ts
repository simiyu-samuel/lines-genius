import { SubscriptionPlan } from '../types/subscription';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '10 lines per day',
      'Basic categories',
      'Standard tones',
      'Community support'
    ],
    limits: {
      dailyGenerations: 10,
      categories: ['taglines', 'bios', 'captions'],
      tones: ['corporate', 'funny', 'bold'],
      customPrompts: false,
      bulkExport: false,
      apiAccess: false,
      analytics: false,
      teamCollaboration: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited generations',
      'All categories',
      'Advanced tones',
      'Custom prompts',
      'Bulk export',
      'Priority support',
      'Usage analytics'
    ],
    limits: {
      dailyGenerations: -1, // unlimited
      categories: ['taglines', 'bios', 'captions', 'quotes', 'slogans', 'adlines'],
      tones: ['corporate', 'funny', 'bold', 'romantic', 'minimalist', 'inspirational', 'motivational'],
      customPrompts: true,
      bulkExport: true,
      apiAccess: false,
      analytics: true,
      teamCollaboration: false
    },
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 29.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Brand voice training',
      'API access',
      'Advanced analytics',
      'White-label options',
      'Dedicated support'
    ],
    limits: {
      dailyGenerations: -1,
      categories: ['taglines', 'bios', 'captions', 'quotes', 'slogans', 'adlines'],
      tones: ['corporate', 'funny', 'bold', 'romantic', 'minimalist', 'inspirational', 'motivational'],
      customPrompts: true,
      bulkExport: true,
      apiAccess: true,
      analytics: true,
      teamCollaboration: true
    }
  }
];