import { HotelServiceConfig } from '@/types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: HotelServiceConfig = {
  port: parseInt(process.env.PORT || '3004', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://username:password@localhost:5432/hotel_service_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret:
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',

  cacheConfig: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
    availabilityTtl: parseInt(process.env.AVAILABILITY_CACHE_TTL || '300', 10),
    pricingTtl: parseInt(process.env.PRICING_CACHE_TTL || '600', 10),
    propertyTtl: parseInt(process.env.PROPERTY_CACHE_TTL || '1800', 10),
  },

  rateLimitConfig: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    skipSuccessfulRequests: false,
  },

  businessConfig: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
    defaultTimezone: process.env.DEFAULT_TIMEZONE || 'UTC',
    bookingHoldDuration: parseInt(
      process.env.BOOKING_HOLD_DURATION || '900',
      10
    ), // 15 minutes
    maxAdvanceBookingDays: parseInt(
      process.env.MAX_ADVANCE_BOOKING_DAYS || '365',
      10
    ),
    minAdvanceBookingHours: parseInt(
      process.env.MIN_ADVANCE_BOOKING_HOURS || '2',
      10
    ),
    defaultCancellationPolicy:
      process.env.DEFAULT_CANCELLATION_POLICY || 'moderate',
  },

  services: {
    notification: {
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
      timeout: parseInt(
        process.env.NOTIFICATION_SERVICE_TIMEOUT || '10000',
        10
      ),
    },
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT || '10000', 10),
    },
    payment: {
      url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
      timeout: parseInt(process.env.PAYMENT_SERVICE_TIMEOUT || '10000', 10),
    },
  },
};

// Validation
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export default config;
