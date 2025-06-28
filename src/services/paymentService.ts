import axios from 'axios';
import { MpesaPaymentRequest, MpesaPaymentResponse, PaymentIntent } from '../types/payment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.linesgenius.com';

// PayPal Configuration
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AYourPayPalClientID';

// M-Pesa Configuration
const MPESA_CONSUMER_KEY = import.meta.env.VITE_MPESA_CONSUMER_KEY || 'your_mpesa_consumer_key';
const MPESA_CONSUMER_SECRET = import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'your_mpesa_consumer_secret';
const MPESA_SHORTCODE = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
const MPESA_PASSKEY = import.meta.env.VITE_MPESA_PASSKEY || 'your_mpesa_passkey';

class PaymentService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // PayPal Methods
  async createPayPalOrder(planId: string, amount: number): Promise<string> {
    try {
      const response = await this.apiClient.post('/payments/paypal/create-order', {
        planId,
        amount,
        currency: 'USD',
      });
      return response.data.orderID;
    } catch (error) {
      console.error('PayPal order creation failed:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async capturePayPalOrder(orderID: string, planId: string): Promise<PaymentIntent> {
    try {
      const response = await this.apiClient.post('/payments/paypal/capture-order', {
        orderID,
        planId,
      });
      return response.data;
    } catch (error) {
      console.error('PayPal order capture failed:', error);
      throw new Error('Failed to capture PayPal payment');
    }
  }

  // M-Pesa Methods
  async initiateMpesaPayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      // Get access token first
      const accessToken = await this.getMpesaAccessToken();
      
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

      const response = await this.apiClient.post('/payments/mpesa/stk-push', {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: request.amount,
        PartyA: request.phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: request.phoneNumber,
        CallBackURL: `${API_BASE_URL}/payments/mpesa/callback`,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('M-Pesa payment initiation failed:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  async checkMpesaPaymentStatus(checkoutRequestID: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/payments/mpesa/status/${checkoutRequestID}`);
      return response.data;
    } catch (error) {
      console.error('M-Pesa status check failed:', error);
      throw new Error('Failed to check M-Pesa payment status');
    }
  }

  private async getMpesaAccessToken(): Promise<string> {
    try {
      const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
      
      const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa token generation failed:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // General Payment Methods
  async getPaymentHistory(userId: string): Promise<PaymentIntent[]> {
    try {
      const response = await this.apiClient.get(`/payments/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  }

  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await this.apiClient.post(`/payments/${paymentId}/cancel`);
      return true;
    } catch (error) {
      console.error('Payment cancellation failed:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();