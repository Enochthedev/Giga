import { z } from 'zod';
import { LocationSchema } from './common';

// Ride schemas
export const RideRequestSchema = z.object({
  pickupLocation: LocationSchema,
  dropoffLocation: LocationSchema,
  vehicleType: z.enum(['economy', 'comfort', 'premium', 'xl']),
  scheduledTime: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const RideSchema = z.object({
  id: z.string(),
  passengerId: z.string(),
  driverId: z.string().optional(),
  status: z.enum([
    'requested',
    'accepted',
    'arrived',
    'started',
    'completed',
    'cancelled',
  ]),
  vehicleType: z.enum(['economy', 'comfort', 'premium', 'xl']),
  pickupLocation: LocationSchema,
  dropoffLocation: LocationSchema,
  estimatedFare: z.number().positive(),
  actualFare: z.number().positive().optional(),
  distance: z.number().positive().optional(),
  duration: z.number().positive().optional(), // in minutes
  surgeMultiplier: z.number().positive().default(1),
  scheduledTime: z.string().datetime().optional(),
  acceptedAt: z.string().datetime().optional(),
  arrivedAt: z.string().datetime().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  cancellationReason: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).default('pending'),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RideTrackingSchema = z.object({
  rideId: z.string(),
  driverLocation: LocationSchema.optional(),
  estimatedArrival: z.number().optional(), // in minutes
  status: z.enum([
    'requested',
    'accepted',
    'arrived',
    'started',
    'completed',
    'cancelled',
  ]),
  lastUpdated: z.string().datetime(),
});

// Driver schemas
export const DriverStatusSchema = z.object({
  isOnline: z.boolean(),
  currentLocation: LocationSchema.optional(),
  status: z.enum(['available', 'busy', 'offline']),
});

export const DriverEarningsSchema = z.object({
  today: z.number(),
  thisWeek: z.number(),
  thisMonth: z.number(),
  totalRides: z.number(),
  averageRating: z.number().min(0).max(5),
  completionRate: z.number().min(0).max(1),
});

export const RideRatingSchema = z.object({
  rideId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  tip: z.number().min(0).optional(),
});

export type RideRequest = z.infer<typeof RideRequestSchema>;
export type Ride = z.infer<typeof RideSchema>;
export type RideTracking = z.infer<typeof RideTrackingSchema>;
export type DriverStatus = z.infer<typeof DriverStatusSchema>;
export type DriverEarnings = z.infer<typeof DriverEarningsSchema>;
export type RideRating = z.infer<typeof RideRatingSchema>;
