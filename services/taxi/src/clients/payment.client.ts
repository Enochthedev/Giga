import axios, { AxiosInstance } from 'axios';
import { logger } from '../lib/logger';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
  Transaction,
} from '../types/payment.types';

export class PaymentClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL =
      baseURL || process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        logger.info('Payment service request', {
          method: config.method,
          url: config.url,
          data: config.data
            ? { ...config.data, paymentMethodData: '[REDACTED]' }
            : undefined,
        });
        return config;
      },
      (error: any) => {
        logger.error('Payment service request error', { error });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      response => {
        logger.info('Payment service response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: any) => {
        logger.error('Payment service response error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Process a payment for a ride
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.client.post('/payments', request);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to process payment', {
        error,
        request: { ...request, paymentMethodData: '[REDACTED]' },
      });
      throw new Error(
        `Payment processing failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Capture a previously authorized payment
   */
  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      const response = await this.client.post(
        `/payments/${transactionId}/capture`,
        {
          amount,
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to capture payment', {
        error,
        transactionId,
        amount,
      });
      throw new Error(
        `Payment capture failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.post(
        `/payments/${transactionId}/cancel`
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to cancel payment', { error, transactionId });
      throw new Error(
        `Payment cancellation failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Refund a completed payment
   */
  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    try {
      const response = await this.client.post(
        `/payments/${transactionId}/refund`,
        {
          amount,
          reason,
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to refund payment', {
        error,
        transactionId,
        amount,
        reason,
      });
      throw new Error(
        `Payment refund failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Get payment transaction details
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await this.client.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to get transaction', { error, transactionId });
      throw new Error(
        `Failed to get transaction: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Update transaction status (for webhook handling)
   */
  async updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus
  ): Promise<Transaction> {
    try {
      const response = await this.client.patch(
        `/transactions/${transactionId}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to update transaction status', {
        error,
        transactionId,
        status,
      });
      throw new Error(
        `Failed to update transaction status: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Get transactions with filters
   */
  async getTransactions(filters: {
    userId?: string;
    status?: PaymentStatus;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Transaction[]; pagination: any }> {
    try {
      const response = await this.client.get('/transactions', {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to get transactions', { error, filters });
      throw new Error(
        `Failed to get transactions: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Create a payment method for a user
   */
  async createPaymentMethod(data: {
    userId: string;
    type: string;
    token?: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      const response = await this.client.post('/payment-methods', data);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to create payment method', {
        error,
        userId: data.userId,
      });
      throw new Error(
        `Failed to create payment method: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Get user's payment methods
   */
  async getUserPaymentMethods(userId: string): Promise<any[]> {
    try {
      const response = await this.client.get(
        `/users/${userId}/payment-methods`
      );
      return response.data;
    } catch (error: any) {
      logger.error('Failed to get user payment methods', { error, userId });
      throw new Error(
        `Failed to get payment methods: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Health check for payment service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error: any) {
      logger.warn('Payment service health check failed', { error });
      return false;
    }
  }
}

// Export singleton instance
export const paymentClient = new PaymentClient();
