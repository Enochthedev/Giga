import { z } from 'zod';

// Payment method schemas
export const PaymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['card', 'bank_account', 'digital_wallet']),
  provider: z.enum(['stripe', 'paypal', 'flutterwave', 'paystack']),
  details: z.object({
    last4: z.string().optional(),
    brand: z.string().optional(),
    expiryMonth: z.number().optional(),
    expiryYear: z.number().optional(),
    holderName: z.string().optional(),
  }),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AddPaymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account', 'digital_wallet']),
  provider: z.enum(['stripe', 'paypal', 'flutterwave', 'paystack']),
  token: z.string(), // Payment provider token
  setAsDefault: z.boolean().default(false),
});

// Payment schemas
export const PaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum([
    'pending',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'refunded',
  ]),
  paymentMethodId: z.string(),
  provider: z.enum(['stripe', 'paypal', 'flutterwave', 'paystack']),
  providerTransactionId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  failureReason: z.string().optional(),
  refundAmount: z.number().min(0).optional(),
  refundReason: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  paymentMethodId: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const RefundPaymentSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(), // Partial refund if specified
  reason: z.string(),
});

// Payout schemas (for vendors, drivers, hosts)
export const PayoutSchema = z.object({
  id: z.string(),
  recipientId: z.string(),
  recipientType: z.enum(['vendor', 'driver', 'host', 'advertiser']),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  provider: z.enum(['stripe', 'paypal', 'flutterwave', 'paystack']),
  providerTransactionId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  failureReason: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePayoutSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(['vendor', 'driver', 'host', 'advertiser']),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

// Subscription schemas
export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  status: z.enum(['active', 'cancelled', 'past_due', 'unpaid']),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean().default(false),
  cancelledAt: z.string().datetime().optional(),
  trialStart: z.string().datetime().optional(),
  trialEnd: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().length(3),
  interval: z.enum(['month', 'year']),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
  trialDays: z.number().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Wallet schemas
export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  balance: z.number().min(0).default(0),
  currency: z.string().length(3).default('USD'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const WalletTransactionSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  type: z.enum(['credit', 'debit']),
  amount: z.number().positive(),
  description: z.string(),
  reference: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type AddPaymentMethod = z.infer<typeof AddPaymentMethodSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type RefundPayment = z.infer<typeof RefundPaymentSchema>;
export type Payout = z.infer<typeof PayoutSchema>;
export type CreatePayout = z.infer<typeof CreatePayoutSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;
export type Wallet = z.infer<typeof WalletSchema>;
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;
