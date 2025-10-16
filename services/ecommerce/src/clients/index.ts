// Export types first
export * from './types';

// Export client interfaces and implementations
export {
  AuthServiceClient,
  AuthServiceResponse,
  HttpAuthServiceClient,
  UserInfo,
} from './auth.client';

export {
  HttpPaymentServiceClient,
  PaymentIntent,
  PaymentMethod,
  PaymentResult,
  PaymentServiceClient,
  PaymentServiceResponse,
  RefundResult,
} from './payment.client';

export {
  HttpNotificationServiceClient,
  InventoryAlertData,
  NotificationResult,
  NotificationServiceClient,
  NotificationServiceResponse,
  NotificationTemplate,
  OrderNotificationData,
  VendorNotificationData,
} from './notification.client';

import { CircuitBreakerConfig, RetryConfig } from './types';

// Service client factory for dependency injection
export interface ServiceClients {
  authService: import('./auth.client').AuthServiceClient;
  paymentService: import('./payment.client').PaymentServiceClient;
  notificationService: import('./notification.client').NotificationServiceClient;
}

export interface ServiceConfig {
  authServiceUrl: string;
  paymentServiceUrl: string;
  notificationServiceUrl: string;
  timeout?: number;
  retryConfig?: RetryConfig;
  circuitBreakerConfig?: CircuitBreakerConfig;
}

export function createServiceClients(config: ServiceConfig): ServiceClients {
  const { HttpAuthServiceClient } = require('./auth.client');
  const { HttpPaymentServiceClient } = require('./payment.client');
  const { HttpNotificationServiceClient } = require('./notification.client');

  return {
    authService: new HttpAuthServiceClient(
      config.authServiceUrl,
      config.timeout,
      config.retryConfig,
      config.circuitBreakerConfig
    ),
    paymentService: new HttpPaymentServiceClient(
      config.paymentServiceUrl,
      config.timeout,
      config.retryConfig,
      config.circuitBreakerConfig
    ),
    notificationService: new HttpNotificationServiceClient(
      config.notificationServiceUrl,
      config.timeout,
      config.retryConfig,
      config.circuitBreakerConfig
    ),
  };
}
