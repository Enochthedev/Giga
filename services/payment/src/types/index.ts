export * from './common.types';
export * from './currency.types';
export * from './fraud.types';
export * from './gateway.types';
export * from './payment.types';
export * from './subscription.types';
// Note: webhook.types has conflicting exports with gateway.types, so we'll import selectively
export type { WebhookDelivery, WebhookStatus } from './webhook.types';

// Additional types for the basic implementation
import { Decimal } from '../lib/decimal';
import { Address, PaymentMethodType, PaymentStatus } from './payment.types';

export interface FilterParams {
  userId?: string;
  merchantId?: string;
  status?: PaymentStatus;
  currency?: string;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
  gatewayId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  userId?: string;
  merchantId?: string;
  paymentMethodId?: string;
  paymentMethodData?: {
    type: PaymentMethodType;
    token?: string;
    card?: {
      number: string;
      expiryMonth: number;
      expiryYear: number;
      cvc: string;
      holderName: string;
    };
    billingAddress?: Address;
  };
  metadata?: Record<string, any>;
  internalReference?: string;
  externalReference?: string;
  splits?: {
    recipientId: string;
    amount?: number;
    percentage?: number;
    description?: string;
  }[];
  options?: {
    captureMethod?: 'automatic' | 'manual';
    confirmationMethod?: 'automatic' | 'manual';
    savePaymentMethod?: boolean;
    setupFutureUsage?: 'on_session' | 'off_session';
    statementDescriptor?: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: Decimal;
  currency: string;
  clientSecret?: string;
  confirmationUrl?: string;
  requiresAction?: boolean;
  nextAction?: {
    type: string;
    redirectUrl?: string;
    useStripeSdk?: boolean;
  };
  paymentMethod?: {
    id: string;
    type: PaymentMethodType;
    metadata: Record<string, any>;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Re-export from payment.types for convenience
export type {
  PaymentMethodType,
  PaymentStatus,
  TransactionType,
} from './payment.types';
