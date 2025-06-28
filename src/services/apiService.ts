import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('linesGenius_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('linesGenius_token');
      localStorage.removeItem('linesGenius_user');
      // Redirect to login if needed
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response: AxiosResponse<ApiResponse<{ user: any; token: string }>> = 
      await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response: AxiosResponse<ApiResponse<{ user: any; token: string }>> = 
      await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = 
      await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response: AxiosResponse<ApiResponse<{ token: string }>> = 
      await apiClient.post('/auth/refresh');
    return response.data;
  },
};

// Lines API
export const linesAPI = {
  generate: async (request: {
    category: string;
    tone?: string;
    prompt?: string;
    count?: number;
  }) => {
    const response: AxiosResponse<ApiResponse<{
      lines: string[];
      usage?: any;
      category: string;
      tone: string;
    }>> = await apiClient.post('/lines/generate', request);
    return response.data;
  },

  save: async (lineData: {
    text: string;
    category: string;
    tone: string;
    tags?: string[];
  }) => {
    const response: AxiosResponse<ApiResponse<{ savedLine: any }>> = 
      await apiClient.post('/lines/save', lineData);
    return response.data;
  },

  getSaved: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response: AxiosResponse<ApiResponse<{
      savedLines: any[];
      pagination: any;
    }>> = await apiClient.get('/lines/saved', { params });
    return response.data;
  },

  deleteSaved: async (id: string) => {
    const response: AxiosResponse<ApiResponse> = 
      await apiClient.delete(`/lines/saved/${id}`);
    return response.data;
  },

  clearAllSaved: async () => {
    const response: AxiosResponse<ApiResponse> = 
      await apiClient.delete('/lines/saved');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = 
      await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData: { name?: string; email?: string }) => {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = 
      await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response: AxiosResponse<ApiResponse> = 
      await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },

  getUsageStats: async () => {
    const response: AxiosResponse<ApiResponse<{
      dailyGenerations: number;
      monthlyGenerations: number;
      totalGenerations: number;
      limits: any;
      planId: string;
    }>> = await apiClient.get('/users/usage');
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsAPI = {
  getSubscriptions: async () => {
    const response: AxiosResponse<ApiResponse<{ subscriptions: any[] }>> = 
      await apiClient.get('/subscriptions');
    return response.data;
  },

  createSubscription: async (subscriptionData: {
    planId: string;
    paymentMethodId: string;
  }) => {
    const response: AxiosResponse<ApiResponse<{ subscription: any }>> = 
      await apiClient.post('/subscriptions', subscriptionData);
    return response.data;
  },

  updateSubscription: async (id: string, updateData: any) => {
    const response: AxiosResponse<ApiResponse<{ subscription: any }>> = 
      await apiClient.put(`/subscriptions/${id}`, updateData);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createStripeIntent: async (paymentData: {
    planId: string;
    amount: number;
  }) => {
    const response: AxiosResponse<ApiResponse<{ clientSecret: string }>> = 
      await apiClient.post('/payments/stripe/create-intent', paymentData);
    return response.data;
  },

  initiateMpesaPayment: async (paymentData: {
    phoneNumber: string;
    amount: number;
    planId: string;
  }) => {
    const response: AxiosResponse<ApiResponse<any>> = 
      await apiClient.post('/payments/mpesa/stk-push', paymentData);
    return response.data;
  },

  getPaymentHistory: async () => {
    const response: AxiosResponse<ApiResponse<{ payments: any[] }>> = 
      await apiClient.get('/payments/history');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response: AxiosResponse<{
      status: string;
      timestamp: string;
      uptime: number;
      environment: string;
    }> = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;