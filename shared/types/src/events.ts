import { z } from 'zod';
import { RoleName } from './user';

// Event system for cross-service communication
export const BaseEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  timestamp: z.string().datetime(),
  source: z.string(),
  version: z.string().default('1.0'),
});

// User events
export const UserRegisteredEventSchema = BaseEventSchema.extend({
  type: z.literal('user.registered'),
  data: z.object({
    userId: z.string(),
    email: z.string().email(),
    roles: z.array(z.nativeEnum(RoleName)),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export const UserRoleSwitchedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.role.switched'),
  data: z.object({
    userId: z.string(),
    fromRole: z.nativeEnum(RoleName),
    toRole: z.nativeEnum(RoleName),
    timestamp: z.string().datetime(),
  }),
});

// Business events
export const OrderCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('order.created'),
  data: z.object({
    orderId: z.string(),
    customerId: z.string(),
    vendorId: z.string(),
    amount: z.number(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        price: z.number(),
      })
    ),
  }),
});

export const RideCompletedEventSchema = BaseEventSchema.extend({
  type: z.literal('ride.completed'),
  data: z.object({
    rideId: z.string(),
    driverId: z.string(),
    passengerId: z.string(),
    fare: z.number(),
    distance: z.number(),
    duration: z.number(),
    rating: z.number().optional(),
  }),
});

export const BookingConfirmedEventSchema = BaseEventSchema.extend({
  type: z.literal('booking.confirmed'),
  data: z.object({
    bookingId: z.string(),
    guestId: z.string(),
    hostId: z.string(),
    propertyId: z.string(),
    amount: z.number(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
  }),
});

export const CampaignStartedEventSchema = BaseEventSchema.extend({
  type: z.literal('campaign.started'),
  data: z.object({
    campaignId: z.string(),
    advertiserId: z.string(),
    budget: z.number(),
    targetAudience: z.record(z.any()),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

export const PaymentProcessedEventSchema = BaseEventSchema.extend({
  type: z.literal('payment.processed'),
  data: z.object({
    paymentId: z.string(),
    userId: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.enum(['success', 'failed', 'pending']),
    gateway: z.string(),
    transactionId: z.string().optional(),
  }),
});

// Union type for all events
export const PlatformEventSchema = z.discriminatedUnion('type', [
  UserRegisteredEventSchema,
  UserRoleSwitchedEventSchema,
  OrderCreatedEventSchema,
  RideCompletedEventSchema,
  BookingConfirmedEventSchema,
  CampaignStartedEventSchema,
  PaymentProcessedEventSchema,
]);

export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type UserRegisteredEvent = z.infer<typeof UserRegisteredEventSchema>;
export type UserRoleSwitchedEvent = z.infer<typeof UserRoleSwitchedEventSchema>;
export type OrderCreatedEvent = z.infer<typeof OrderCreatedEventSchema>;
export type RideCompletedEvent = z.infer<typeof RideCompletedEventSchema>;
export type BookingConfirmedEvent = z.infer<typeof BookingConfirmedEventSchema>;
export type CampaignStartedEvent = z.infer<typeof CampaignStartedEventSchema>;
export type PaymentProcessedEvent = z.infer<typeof PaymentProcessedEventSchema>;
export type PlatformEvent = z.infer<typeof PlatformEventSchema>;
