import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3004'),
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/payment_db',

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Payment Gateways
  gateways: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      mode: process.env.PAYPAL_MODE || 'sandbox',
    },
    square: {
      accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
      applicationId: process.env.SQUARE_APPLICATION_ID || '',
      environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    },
  },

  // Service URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3006',
  },

  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key',
    apiKeySecret: process.env.API_KEY_SECRET || 'your-api-key-secret',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Monitoring
  monitoring: {
    logLevel: process.env.LOG_LEVEL || 'info',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
  },

  // Fraud Detection
  fraud: {
    enabled: process.env.FRAUD_DETECTION_ENABLED === 'true',
    maxTransactionAmount: parseFloat(process.env.MAX_TRANSACTION_AMOUNT || '10000'),
    velocityCheckEnabled: process.env.VELOCITY_CHECK_ENABLED === 'true',
  },

  // Currency
  currency: {
    default: process.env.DEFAULT_CURRENCY || 'USD',
    supported: (process.env.SUPPORTED_CURRENCIES || 'USD,EUR,GBP,CAD,AUD').split(','),
  },

  // Webhooks
  webhooks: {
    timeoutMs: parseInt(process.env.WEBHOOK_TIMEOUT_MS || '30000'),
    retryAttempts: parseInt(process.env.WEBHOOK_RETRY_ATTEMPTS || '3'),
  },
};

export default config;