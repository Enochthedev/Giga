import { Decimal } from '../lib/decimal';
import { PaymentMethod, PaymentRequest, PaymentResponse, Refund } from './payment.types';

export type GatewayType = 'stripe' | 'paypal' | 'square' | 'adyen' | 'braintree' | 'paystack' | 'flutterwave';

export type GatewayStatus = 'active' | 'inactive' | 'maintenance' | 'error';

export interface GatewayConfig {
  id: string;
  type: GatewayType;
  name: string;
  status: GatewayStatus;
  priority: number;

  // Configuration
  credentials: Record<string, string>;
  settings: {
    supportedCurrencies: string[];
    supportedCountries: string[];
    supportedPaymentMethods: string[];
    minAmount?: number;
    maxAmount?: number;
    processingFee?: {
      type: 'fixed' | 'percentage';
      value: number;
    };
  };

  // Health and performance
  healthCheck: {
    url?: string;
    interval: number;
    timeout: number;
    retries: number;
  };

  // Rate limiting
  rateLimit: {
    requestsPerSecond: number;
    burstLimit: number;
  };

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GatewayMetrics {
  gatewayId: string;
  timestamp: Date;

  // Performance metrics
  responseTime: number;
  successRate: number;
  errorRate: number;

  // Volume metrics
  transactionCount: number;
  transactionVolume: Decimal;

  // Status counts
  statusCounts: Record<string, number>;

  // Error details
  errorTypes: Record<string, number>;
}

export interface GatewayHealthStatus {
  gatewayId: string;
  status: GatewayStatus;
  lastCheck: Date;
  responseTime?: number;
  errorMessage?: string;
  consecutiveFailures: number;
}

export interface GatewaySelection {
  primary: string;
  fallbacks: string[];
  reason: string;
  metadata?: Record<string, any>;
}

export abstract class PaymentGateway {
  protected config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  // Core payment operations
  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract capturePayment(transactionId: string, amount?: number): Promise<PaymentResponse>;
  abstract cancelPayment(transactionId: string): Promise<PaymentResponse>;
  abstract refundPayment(transactionId: string, amount?: number, reason?: string): Promise<Refund>;

  // Payment method operations
  abstract createPaymentMethod(data: any): Promise<PaymentMethod>;
  abstract updatePaymentMethod(id: string, data: any): Promise<PaymentMethod>;
  abstract deletePaymentMethod(id: string): Promise<void>;
  abstract getPaymentMethod(id: string): Promise<PaymentMethod>;

  // Webhook operations
  abstract verifyWebhook(payload: string, signature: string): boolean;
  abstract parseWebhook(payload: string): WebhookEvent;

  // Health and status
  abstract healthCheck(): Promise<boolean>;
  abstract getStatus(): Promise<GatewayStatus>;

  // Utility methods
  getConfig(): GatewayConfig {
    return this.config;
  }

  getId(): string {
    return this.config.id;
  }

  getType(): GatewayType {
    return this.config.type;
  }

  isActive(): boolean {
    return this.config.status === 'active';
  }

  supportsCurrency(currency: string): boolean {
    return this.config.settings.supportedCurrencies.includes(currency);
  }

  supportsAmount(amount: number): boolean {
    const { minAmount, maxAmount } = this.config.settings;
    if (minAmount && amount < minAmount) return false;
    if (maxAmount && amount > maxAmount) return false;
    return true;
  }
}

export interface WebhookEvent {
  id: string;
  type: string;
  gatewayId: string;
  gatewayEventId: string;
  data: Record<string, any>;
  timestamp: Date;
  processed: boolean;
  retryCount: number;
  metadata?: Record<string, any>;
}

export interface GatewayError extends Error {
  gatewayId: string;
  gatewayCode?: string;
  gatewayMessage?: string;
  isRetryable: boolean;
  statusCode?: number;
}

export interface GatewayResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  gatewayResponse?: Record<string, any>;
  metadata?: Record<string, any>;
}