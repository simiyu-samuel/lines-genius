export interface PaymentMethod {
  id: string;
  name: string;
  type: 'paypal' | 'mpesa' | 'card';
  icon: string;
  description: string;
  supported: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  planId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  createdAt: number;
  completedAt?: number;
}

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaPaymentResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface PayPalOrderData {
  orderID: string;
  payerID?: string;
  paymentID?: string;
  billingToken?: string;
  facilitatorAccessToken?: string;
}