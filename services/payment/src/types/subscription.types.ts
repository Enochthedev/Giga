import { Decimal } from '../lib/decimal';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'unpaid'
  | 'cancelled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'paused';

export type BillingInterval = 'day' | 'week' | 'month' | 'year';

export type ProrationBehavior = 'none' | 'create_prorations' | 'always_invoice';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;

  // Pricing
  amount: Decimal;
  currency: string;
  interval: BillingInterval;
  intervalCount: number;

  // Trial
  trialPeriodDays?: number;

  // Usage-based billing
  usageType?: 'licensed' | 'metered';
  meteringUnit?: string;

  // Metadata
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;

  // Billing details
  paymentMethodId: string;
  currency: string;

  // Pricing
  unitAmount: Decimal;
  quantity: number;

  // Billing cycle
  billingCycleAnchor: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;

  // Trial
  trialStart?: Date;
  trialEnd?: Date;

  // Cancellation
  cancelAt?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;

  // Pause
  pauseCollection?: {
    behavior: 'keep_as_draft' | 'mark_uncollectible' | 'void';
    resumesAt?: Date;
  };

  // Proration
  prorationBehavior: ProrationBehavior;

  // Gateway integration
  gatewaySubscriptionId?: string;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations
  plan?: SubscriptionPlan;
  invoices?: Invoice[];
  usageRecords?: UsageRecord[];
}

export interface Invoice {
  id: string;
  subscriptionId?: string;
  userId: string;

  // Status
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

  // Amounts
  subtotal: Decimal;
  tax?: Decimal;
  total: Decimal;
  amountPaid: Decimal;
  amountRemaining: Decimal;
  currency: string;

  // Billing period
  periodStart: Date;
  periodEnd: Date;

  // Due date
  dueDate?: Date;

  // Payment
  paymentMethodId?: string;
  gatewayInvoiceId?: string;

  // Attempts
  attemptCount: number;
  nextPaymentAttempt?: Date;

  // Metadata
  description?: string;
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations
  items?: InvoiceItem[];
  payments?: InvoicePayment[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;

  // Description
  description: string;

  // Pricing
  amount: Decimal;
  currency: string;
  quantity: number;
  unitAmount: Decimal;

  // Period
  periodStart?: Date;
  periodEnd?: Date;

  // Proration
  proration: boolean;

  // Metadata
  metadata?: Record<string, any>;
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  transactionId: string;
  amount: Decimal;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  createdAt: Date;
}

export interface UsageRecord {
  id: string;
  subscriptionId: string;
  quantity: number;
  timestamp: Date;
  action: 'increment' | 'set';
  metadata?: Record<string, any>;
}

export interface SubscriptionRequest {
  userId: string;
  planId: string;
  paymentMethodId: string;

  // Trial
  trialPeriodDays?: number;
  trialEnd?: Date;

  // Billing
  billingCycleAnchor?: Date;
  prorationBehavior?: ProrationBehavior;

  // Quantity
  quantity?: number;

  // Metadata
  metadata?: Record<string, any>;

  // Options
  options?: {
    paymentBehavior?: 'default_incomplete' | 'error_if_incomplete' | 'allow_incomplete';
    expandImmediatelyCollect?: boolean;
  };
}

export interface SubscriptionUpdateRequest {
  planId?: string;
  paymentMethodId?: string;
  quantity?: number;
  prorationBehavior?: ProrationBehavior;
  cancelAtPeriodEnd?: boolean;
  pauseCollection?: {
    behavior: 'keep_as_draft' | 'mark_uncollectible' | 'void';
    resumesAt?: Date;
  };
  metadata?: Record<string, any>;
}

export interface DunningSettings {
  maxRetries: number;
  retrySchedule: number[]; // Days between retries
  emailTemplates: {
    firstFailure: string;
    secondFailure: string;
    finalNotice: string;
    cancellation: string;
  };
  gracePeriodDays: number;
  autoCancel: boolean;
}