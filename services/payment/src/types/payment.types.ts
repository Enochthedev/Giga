import { Decimal } from '../lib/decimal';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'
  | 'disputed'
  | 'expired';

export type PaymentMethodType =
  | 'card'
  | 'bank_account'
  | 'digital_wallet'
  | 'crypto'
  | 'buy_now_pay_later';

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'chargeback'
  | 'fee'
  | 'payout'
  | 'adjustment';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  provider: string;
  token: string;
  isDefault: boolean;
  metadata: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    bankName?: string;
    accountType?: string;
    walletType?: string;
  };
  billingAddress?: Address;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: PaymentStatus;
  amount: Decimal;
  currency: string;
  description?: string;

  // Parties
  userId?: string;
  merchantId?: string;
  vendorId?: string;

  // Payment details
  paymentMethodId?: string;
  gatewayId: string;
  gatewayTransactionId?: string;

  // Metadata
  metadata: Record<string, any>;
  internalReference?: string;
  externalReference?: string;

  // Fees and splits
  platformFee?: Decimal;
  gatewayFee?: Decimal;
  splits?: PaymentSplit[];

  // Fraud and risk
  riskScore?: number;
  fraudFlags?: string[];

  // Timestamps
<<<<<<< HEAD
  processedAt?: Date | undefined;
=======
  processedAt?: Date;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  refunds?: Refund[];
  disputes?: Dispute[];
  parent?: Transaction;
  children?: Transaction[];
}

export interface PaymentSplit {
  id: string;
  transactionId: string;
  recipientId: string;
  amount: Decimal;
  currency: string;
  type: 'fixed' | 'percentage';
  description?: string;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: Date;
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: Decimal;
  currency: string;
  reason: string;
  status: PaymentStatus;
  gatewayRefundId?: string;
  metadata?: Record<string, any>;
<<<<<<< HEAD
  processedAt?: Date | undefined;
=======
  processedAt?: Date;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  createdAt: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  transactionId: string;
  amount: Decimal;
  currency: string;
  reason: string;
  status: 'open' | 'under_review' | 'won' | 'lost' | 'warning_closed';
  evidenceDeadline?: Date;
  gatewayDisputeId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
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
<<<<<<< HEAD
  gatewayId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
=======
  metadata?: Record<string, any>;
  createdAt: Date;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
}
