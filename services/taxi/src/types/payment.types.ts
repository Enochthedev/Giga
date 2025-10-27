// Payment types for taxi service integration

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
  amount: number;
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
  amount: number;
  currency: string;
  description?: string;
  userId?: string;
  merchantId?: string;
  vendorId?: string;
  paymentMethodId?: string;
  gatewayId: string;
  gatewayTransactionId?: string;
  metadata: Record<string, any>;
  internalReference?: string;
  externalReference?: string;
  platformFee?: number;
  gatewayFee?: number;
  splits?: PaymentSplit[];
  riskScore?: number;
  fraudFlags?: string[];
  processedAt?: Date;
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  refunds?: Refund[];
  disputes?: Dispute[];
}

export interface PaymentSplit {
  id: string;
  transactionId: string;
  recipientId: string;
  amount: number;
  currency: string;
  type: 'fixed' | 'percentage';
  description?: string;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: Date;
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: PaymentStatus;
  gatewayRefundId?: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'open' | 'under_review' | 'won' | 'lost' | 'warning_closed';
  evidenceDeadline?: Date;
  gatewayDisputeId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Ride-specific payment interfaces
export interface RidePaymentRequest {
  rideId: string;
  passengerId: string;
  driverId: string;
  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeFare: number;
    tolls: number;
    fees: number;
    discounts: number;
    tips: number;
    taxes: number;
    total: number;
  };
  paymentMethodId?: string;
  currency: string;
  metadata?: Record<string, any>;
}

export interface RidePaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  driverEarnings?: DriverEarnings;
  error?: string;
  processedAt: Date;
}

export interface DriverEarnings {
  grossFare: number;
  platformCommission: number;
  netEarnings: number;
  tips: number;
  bonuses: number;
  totalEarnings: number;
  breakdown: {
    baseFareEarnings: number;
    distanceEarnings: number;
    timeEarnings: number;
    surgeEarnings: number;
    peakHourBonus: number;
    qualityBonus: number;
    referralBonus: number;
    completionBonus: number;
  };
}

export interface DriverPayout {
  id: string;
  driverId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payoutMethod: 'bank_transfer' | 'digital_wallet' | 'check';
  payoutMethodId?: string;
  scheduledAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutRequest {
  driverId: string;
  amount: number;
  currency: string;
  payoutMethod: 'bank_transfer' | 'digital_wallet' | 'check';
  payoutMethodId?: string;
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export interface PaymentMethodInfo {
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

// Commission and fee structures
export interface CommissionStructure {
  vehicleType: string;
  baseCommissionRate: number;
  tieredRates?: CommissionTier[];
  minimumCommission?: number;
  maximumCommission?: number;
}

export interface CommissionTier {
  minRides: number;
  maxRides?: number;
  commissionRate: number;
}

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Transaction | Refund | Dispute;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

export interface PaymentError {
  code: string;
  message: string;
  type:
    | 'card_error'
    | 'invalid_request_error'
    | 'api_error'
    | 'authentication_error'
    | 'rate_limit_error';
  param?: string;
  decline_code?: string;
}
