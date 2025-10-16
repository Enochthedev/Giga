import { z } from 'zod';
import { LocationSchema, FileUploadSchema } from './common';

// Property schemas
export const PropertySchema = z.object({
  id: z.string(),
  hostId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  propertyType: z.enum([
    'apartment',
    'house',
    'villa',
    'hotel',
    'resort',
    'hostel',
  ]),
  roomType: z.enum(['entire_place', 'private_room', 'shared_room']),
  location: LocationSchema,
  amenities: z.array(z.string()),
  images: z.array(FileUploadSchema),
  capacity: z.object({
    guests: z.number().positive(),
    bedrooms: z.number().min(0),
    beds: z.number().positive(),
    bathrooms: z.number().positive(),
  }),
  pricing: z.object({
    basePrice: z.number().positive(),
    cleaningFee: z.number().min(0).default(0),
    serviceFee: z.number().min(0).default(0),
    weeklyDiscount: z.number().min(0).max(1).optional(),
    monthlyDiscount: z.number().min(0).max(1).optional(),
  }),
  availability: z.object({
    minStay: z.number().positive().default(1),
    maxStay: z.number().positive().optional(),
    advanceNotice: z.number().min(0).default(0), // hours
    preparationTime: z.number().min(0).default(0), // hours
  }),
  policies: z.object({
    checkIn: z.string(), // "15:00"
    checkOut: z.string(), // "11:00"
    cancellationPolicy: z.enum(['flexible', 'moderate', 'strict']),
    houseRules: z.array(z.string()).optional(),
  }),
  isActive: z.boolean().default(true),
  isInstantBook: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PropertySearchSchema = z.object({
  location: z.string().optional(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().positive(),
  propertyType: z
    .enum(['apartment', 'house', 'villa', 'hotel', 'resort', 'hostel'])
    .optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  instantBook: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(50).default(20),
});

// Booking schemas
export const BookingSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  guestId: z.string(),
  hostId: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().positive(),
  nights: z.number().positive(),
  pricing: z.object({
    basePrice: z.number().positive(),
    cleaningFee: z.number().min(0),
    serviceFee: z.number().min(0),
    taxes: z.number().min(0),
    total: z.number().positive(),
  }),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  specialRequests: z.string().optional(),
  guestInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  confirmationCode: z.string().optional(),
  cancelledAt: z.string().datetime().optional(),
  cancellationReason: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBookingSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().positive(),
  specialRequests: z.string().optional(),
  guestInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  paymentMethodId: z.string(),
});

// Host schemas
export const HostDashboardSchema = z.object({
  totalProperties: z.number(),
  totalBookings: z.number(),
  totalRevenue: z.number(),
  occupancyRate: z.number().min(0).max(1),
  averageRating: z.number().min(0).max(5),
  upcomingBookings: z.array(BookingSchema),
  recentReviews: z.array(
    z.object({
      id: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string(),
      guestName: z.string(),
      propertyTitle: z.string(),
      createdAt: z.string().datetime(),
    })
  ),
});

export const CalendarAvailabilitySchema = z.object({
  propertyId: z.string(),
  date: z.string().datetime(),
  isAvailable: z.boolean(),
  price: z.number().positive().optional(),
  minStay: z.number().positive().optional(),
});

export type Property = z.infer<typeof PropertySchema>;
export type PropertySearch = z.infer<typeof PropertySearchSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBooking = z.infer<typeof CreateBookingSchema>;
export type HostDashboard = z.infer<typeof HostDashboardSchema>;
export type CalendarAvailability = z.infer<typeof CalendarAvailabilitySchema>;
