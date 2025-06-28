import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { SubscriptionPlan } from '../types/subscription';
import { PaymentMethod, MpesaPaymentRequest } from '../types/payment';
import { paymentService, PAYPAL_CLIENT_ID } from '../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSuccess: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      icon: '💳',
      description: 'Pay securely with PayPal',
      supported: true
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      type: 'mpesa',
      icon: '📱',
      description: 'Pay with M-Pesa (Kenya)',
      supported: true
    }
  ];

  const handlePayPalSuccess = async (data: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      const payment = await paymentService.capturePayPalOrder(data.orderID, plan.id);
      onSuccess(payment.id);
      onClose();
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const request: MpesaPaymentRequest = {
        phoneNumber: mpesaPhone.startsWith('254') ? mpesaPhone : `254${mpesaPhone.slice(-9)}`,
        amount: plan.price,
        accountReference: `LG-${plan.id}`,
        transactionDesc: `Lines Genius ${plan.name} Plan`
      };

      const response = await paymentService.initiateMpesaPayment(request);
      
      if (response.responseCode === '0') {
        // Poll for payment status
        const checkStatus = async () => {
          try {
            const status = await paymentService.checkMpesaPaymentStatus(response.checkoutRequestID);
            if (status.resultCode === '0') {
              onSuccess(response.checkoutRequestID);
              onClose();
            } else if (status.resultCode === '1032') {
              setError('Payment cancelled by user');
            } else {
              setError('Payment failed. Please try again.');
            }
          } catch (err) {
            setError('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        };

        // Check status after 30 seconds
        setTimeout(checkStatus, 30000);
      } else {
        setError(response.customerMessage || 'Payment initiation failed');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-neon-purple/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-lg p-4 mb-6 border border-neon-purple/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plan.name} Plan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monthly subscription
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  per month
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Choose Payment Method
            </h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={!method.supported}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                    selectedMethod === method.id
                      ? 'border-neon-purple bg-neon-purple/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-neon-purple/50'
                  } ${!method.supported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {method.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="mb-6">
            {selectedMethod === 'paypal' && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Secured by PayPal
                  </span>
                </div>
                
                <PayPalScriptProvider options={{ 
                  clientId: PAYPAL_CLIENT_ID,
                  currency: 'USD'
                }}>
                  <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={async () => {
                      return await paymentService.createPayPalOrder(plan.id, plan.price);
                    }}
                    onApprove={handlePayPalSuccess}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      setError('PayPal payment failed. Please try again.');
                    }}
                    disabled={isProcessing}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {selectedMethod === 'mpesa' && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Pay with M-Pesa
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="254712345678"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-700/50 border border-gray-300 dark:border-neon-purple/30 focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || !mpesaPhone}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-5 w-5" />
                        <span>Pay with M-Pesa</span>
                      </>
                    )}
                  </motion.button>

                  {isProcessing && selectedMethod === 'mpesa' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                          Check your phone for M-Pesa prompt and enter your PIN
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </span>
              </div>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Secure Payment
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};