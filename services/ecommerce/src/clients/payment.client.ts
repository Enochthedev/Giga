import axios, { AxiosInstance } from 'axios';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  amount: number;
  currency: string;
  customerId: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  status: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  error?: string;
}

export interface PaymentServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    service: string;
    version: string;
    timestamp: string;
    correlationId: string;
  };
}

export interface PaymentServiceClient {
  createPaymentIntent(amount: number, currency: string, customerId: string, metadata?: Record<string, string>): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string): Promise<PaymentResult>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>;
  getPaymentMethods(customerId: string): Promise<PaymentMethod[]>;
  getPaymentStatus(paymentIntentId: string): Promise<PaymentResult>;
}

export class HttpPaymentServiceClient implements PaymentServiceClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for correlation ID
    this.client.interceptors.request.use((config) => {
      config.headers['X-Correlation-ID'] = this.generateCorrelationId();
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 400) {
          throw new Error(`Payment validation error: ${error.response.data?.error?.message || 'Invalid payment data'}`);
        }
        if (error.response?.status === 402) {
          throw new Error('Payment required or insufficient funds');
        }
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Payment service unavailable');
        }
        throw error;
      }
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const response = await this.client.post<PaymentServiceResponse<PaymentIntent>>('/api/v1/payments/intents', {
        amount,
        currency,
        customerId,
        metadata,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to create payment intent');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create payment intent: ${message}`);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const response = await this.client.post<PaymentServiceResponse<PaymentResult>>(
        `/api/v1/payments/intents/${paymentIntentId}/confirm`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to confirm payment');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to confirm payment: ${message}`);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult> {
    try {
      const response = await this.client.post<PaymentServiceResponse<RefundResult>>(
        `/api/v1/payments/intents/${paymentIntentId}/refund`,
        { amount }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to process refund');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to process refund: ${message}`);
    }
  }

  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const response = await this.client.get<PaymentServiceResponse<PaymentMethod[]>>(
        `/api/v1/customers/${customerId}/payment-methods`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to get payment methods');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get payment methods: ${message}`);
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const response = await this.client.get<PaymentServiceResponse<PaymentResult>>(
        `/api/v1/payments/intents/${paymentIntentId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to get payment status');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get payment status: ${message}`);
    }
  }

  private generateCorrelationId(): string {
    return `ecom-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}