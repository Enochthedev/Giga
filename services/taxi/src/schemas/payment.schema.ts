import { z } from 'zod';

// Fare breakdown schema
const fareBreakdownSchema = z.object({
  baseFare: z.number().min(0),
  distanceFare: z.number().min(0),
  timeFare: z.number().min(0),
  surgeFare: z.number().min(0),
  tolls: z.number().min(0),
  fees: z.number().min(0),
  discounts: z.number().min(0),
  tips: z.number().min(0),
  taxes: z.number().min(0),
  total: z.number().min(0),
});

// Process ride payment schema
const processRidePaymentSchema = z.object({
  body: z.object({
    passengerId: z.string().uuid(),
    driverId: z.string().uuid(),
    fareBreakdown: fareBreakdownSchema,
    paymentMethodId: z.string().optional(),
    currency: z.string().length(3).default('USD'),
    metadata: z.record(z.any()).optional(),
  }),
  params: z.object({
    rideId: z.string().uuid(),
  }),
});

// Refund ride payment schema
const refundRidePaymentSchema = z.object({
  body: z.object({
    amount: z.number().min(0).optional(),
    reason: z.string().min(1).max(500).optional(),
  }),
  params: z.object({
    rideId: z.string().uuid(),
  }),
});

// Create driver payout schema
const createDriverPayoutSchema = z.object({
  body: z.object({
    amount: z.number().min(0),
    currency: z.string().length(3).default('USD'),
    payoutMethod: z.enum(['bank_transfer', 'digital_wallet', 'check']),
    payoutMethodId: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  params: z.object({
    driverId: z.string().uuid(),
  }),
});

// Driver earnings query schema
const driverEarningsQuerySchema = z.object({
  query: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
  params: z.object({
    driverId: z.string().uuid(),
  }),
});

// Payment webhook schema
const paymentWebhookSchema = z.object({
  body: z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
      object: z.any(),
    }),
    created: z.number(),
    livemode: z.boolean(),
    pending_webhooks: z.number(),
    request: z
      .object({
        id: z.string(),
        idempotency_key: z.string().optional(),
      })
      .optional(),
  }),
});

export const paymentSchemas = {
  processRidePayment: processRidePaymentSchema,
  refundRidePayment: refundRidePaymentSchema,
  createDriverPayout: createDriverPayoutSchema,
  driverEarningsQuery: driverEarningsQuerySchema,
  paymentWebhook: paymentWebhookSchema,
};
