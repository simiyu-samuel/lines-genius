import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Zap, 
  Crown, 
  Building, 
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from '../components/PaymentModal';
import { SubscriptionPlan } from '../types/subscription';

export const Pricing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for yearly
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Sparkles;
      case 'pro': return Zap;
      case 'business': return Building;
      default: return Star;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'pro': return 'from-neon-purple to-neon-pink';
      case 'business': return 'from-neon-cyan to-neon-green';
      default: return 'from-neon-purple to-neon-cyan';
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      // Handle free plan signup
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Handle successful payment - update user subscription
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Unlock the full potential of AI-powered creative line generation. 
            Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-full p-1 border border-white/20 dark:border-neon-purple/20">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingInterval === 'month'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                billingInterval === 'year'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-neon-green text-white text-xs px-2 py-1 rounded-full">
                20% OFF
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => {
            const Icon = getPlanIcon(plan.id);
            const price = billingInterval === 'year' && plan.price > 0 
              ? getYearlyPrice(plan.price) 
              : plan.price;
            const displayPrice = billingInterval === 'year' ? price / 12 : price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-neon-purple/50 shadow-xl shadow-neon-purple/10 scale-105' 
                    : 'border-white/20 dark:border-neon-purple/20 hover:border-neon-cyan/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Crown className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanColor(plan.id)} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${displayPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      /{billingInterval === 'year' ? 'month' : 'month'}
                    </span>
                    {billingInterval === 'year' && plan.price > 0 && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Billed ${price.toFixed(2)} yearly
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg hover:shadow-xl hover:shadow-neon-purple/25'
                      : plan.id === 'free'
                      ? 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600'
                      : 'bg-white/20 dark:bg-dark-700/50 text-gray-900 dark:text-white border border-gray-300 dark:border-neon-purple/30 hover:bg-white/30 dark:hover:bg-dark-600/50'
                  }`}
                >
                  <span>
                    {plan.id === 'free' 
                      ? (isAuthenticated ? 'Current Plan' : 'Get Started Free')
                      : 'Upgrade Now'
                    }
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-2xl p-8 text-center border border-neon-purple/20"
        >
          <Building className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise Solutions
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Need custom solutions, higher limits, or dedicated support? 
            We offer enterprise packages tailored to your organization's needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              'Custom API limits',
              'Dedicated account manager',
              'White-label solutions',
              'Custom integrations',
              'SLA guarantees',
              'Training & onboarding'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 justify-center">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-neon-purple/25"
          >
            <span>Contact Sales</span>
            <ArrowRight className="h-5 w-5" />
          </motion.a>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What payment methods do you accept?",
                answer: "We accept PayPal and M-Pesa payments. All transactions are secure and encrypted."
              },
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What happens to my saved lines?",
                answer: "All your saved lines are preserved when you upgrade or downgrade plans."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg rounded-lg p-6 border border-white/20 dark:border-neon-purple/20">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};