import { HttpClient, HttpClientFactory } from '../lib/http-client';
import { RetryConfigurations } from '../lib/retry';
import type { ServiceResponse } from './types';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status:
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'succeeded'
  | 'canceled';
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

export type PaymentServiceResponse<T> = ServiceResponse<T>;

export interface PaymentServiceClient {
  createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string): Promise<PaymentResult>;
  refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<RefundResult>;
  getPaymentMethods(customerId: string): Promise<PaymentMethod[]>;
  getPaymentStatus(paymentIntentId: string): Promise<PaymentResult>;
  cancelPaymentIntent(paymentIntentId: string): Promise<PaymentResult>;
  addPaymentMethod(
    customerId: string,
    paymentMethodData: any
  ): Promise<PaymentMethod>;
  removePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<boolean>;
}

export class HttpPaymentServiceClient implements PaymentServiceClient {
  private client: HttpClient;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = HttpClientFactory.createClient({
      serviceName: 'payment-service',
      baseURL,
      timeout,
      retryOptions: RetryConfigurations.payment,
      circuitBreakerOptions: {
        failureThreshold: 3,
        resetTimeout: 30000,
        monitoringPeriod: 10000,
        successThreshold: 2,
      },
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    const response = await this.client.post<PaymentIntent>(
      '/api/v1/payments/intents',
      { amount, currency, customerId, metadata }
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to create payment intent'
      );
    }

    return response.data;
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    const response = await this.client.post<PaymentResult>(
      `/api/v1/payments/intents/${paymentIntentId}/confirm`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to confirm payment'
      );
    }

    return response.data;
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<RefundResult> {
    const response = await this.client.post<RefundResult>(
      `/api/v1/payments/intents/${paymentIntentId}/refund`,
      { amount }
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to process refund'
      );
    }

    return response.data;
  }

  async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    const response = await this.client.get<PaymentMethod[]>(
      `/api/v1/customers/${customerId}/payment-methods`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to get payment methods'
      );
    }

    return response.data;
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentResult> {
    const response = await this.client.get<PaymentResult>(
      `/api/v1/payments/intents/${paymentIntentId}`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to get payment status'
      );
    }

    return response.data;
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentResult> {
    const response = await this.client.post<PaymentResult>(
      `/api/v1/payments/intents/${paymentIntentId}/cancel`
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to cancel payment intent'
      );
    }

    return response.data;
  }

  async addPaymentMethod(
    customerId: string,
    paymentMethodData: unknown
  ): Promise<PaymentMethod> {
    const response = await this.client.post<PaymentMethod>(
      `/api/v1/customers/${customerId}/payment-methods`,
      paymentMethodData
    );

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to add payment method'
      );
    }

    return response.data;
  }

  async removePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<boolean> {
    const response = await this.client.delete<{ success: boolean }>(
      `/api/v1/customers/${customerId}/payment-methods/${paymentMethodId}`
    );

    if (!response.success || response.data === undefined) {
      throw new Error(
        response.error?.error.message || 'Failed to remove payment method'
      );
    }

    return response.data.success;
  }

  // Health check method
  // eslint-disable-next-line require-await
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }

  // Get service metrics
  getMetrics() {
    return this.client.getMetrics();
  }
}
