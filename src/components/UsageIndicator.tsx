import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown, Loader } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';

export const UsageIndicator: React.FC = () => {
  const { 
    currentPlan, 
    usageStats, 
    getRemainingGenerations, 
    upgradeRequired, 
    isLoading,
    refreshUsage 
  } = useSubscription();

  // Refresh usage stats when component mounts
  useEffect(() => {
    refreshUsage();
  }, []);

  const remaining = getRemainingGenerations();
  const isUnlimited = remaining === -1;
  const percentage = isUnlimited ? 100 : Math.max(0, (remaining / currentPlan.limits.dailyGenerations) * 100);

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-lg p-4 border border-white/20 dark:border-neon-purple/20">
        <div className="flex items-center space-x-3">
          <Loader className="h-5 w-5 text-neon-purple animate-spin" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Loading usage...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isUnlimited) {
    return (
      <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-lg p-4 border border-neon-purple/30">
        <div className="flex items-center space-x-3">
          <Crown className="h-5 w-5 text-neon-cyan" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentPlan.name} Plan
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Unlimited generations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-lg p-4 border border-white/20 dark:border-neon-purple/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-neon-purple" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Daily Generations
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {remaining} left
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-2 rounded-full ${
            percentage > 20 
              ? 'bg-gradient-to-r from-neon-green to-neon-cyan' 
              : 'bg-gradient-to-r from-neon-pink to-neon-purple'
          }`}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Used: {usageStats.dailyGenerations}</span>
        <span>Limit: {currentPlan.limits.dailyGenerations}</span>
      </div>
      
      {upgradeRequired && (
        <Link
          to="/pricing"
          className="block w-full text-center bg-gradient-to-r from-neon-purple to-neon-cyan text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
        >
          Upgrade for Unlimited
        </Link>
      )}
    </div>
  );
};