// Export types first
export * from './types';

// Export client interfaces and implementations
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
  paymentService: import('./payment.client').PaymentServiceClient;
  notificationService: import('./notification.client').NotificationServiceClient;
}

export interface ServiceConfig {
  paymentServiceUrl: string;
  notificationServiceUrl: string;
  timeout?: number;
  retryConfig?: RetryConfig;
  circuitBreakerConfig?: CircuitBreakerConfig;
}

export function createServiceClients(config: ServiceConfig): ServiceClients {
  const { HttpPaymentServiceClient } = require('./payment.client');
  const { HttpNotificationServiceClient } = require('./notification.client');

  return {
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
