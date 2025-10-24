import { ServiceConfig } from '../clients';

export interface EcommerceServiceConfig {
  port: number;
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  services: ServiceConfig;
  jwt: {
    secret: string;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
}

export function loadServiceConfig(): EcommerceServiceConfig {
  const requiredEnvVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'PAYMENT_SERVICE_URL',
    'NOTIFICATION_SERVICE_URL',
    'JWT_SECRET',
  ];

  // Check for required environment variables
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  return {
    port: parseInt(process.env.PORT || '3002', 10),
    database: {
      url: process.env.DATABASE_URL!,
    },
    redis: {
      url: process.env.REDIS_URL!,
    },
    services: {
      paymentServiceUrl: process.env.PAYMENT_SERVICE_URL!,
      notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL!,
      timeout: parseInt(process.env.SERVICE_TIMEOUT || '5000', 10),
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
  };
}

// Service health check configuration
export interface HealthCheckConfig {
  database: boolean;
  redis: boolean;
  paymentService: boolean;
  notificationService: boolean;
}

export const defaultHealthCheckConfig: HealthCheckConfig = {
  database: true,
  redis: true,
  paymentService: true,
  notificationService: true,
};
