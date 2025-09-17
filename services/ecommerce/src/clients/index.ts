export * from './auth.client';
export * from './notification.client';
export * from './payment.client';

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
}

export function createServiceClients(config: ServiceConfig): ServiceClients {
  const { HttpAuthServiceClient } = require('./auth.client');
  const { HttpPaymentServiceClient } = require('./payment.client');
  const { HttpNotificationServiceClient } = require('./notification.client');

  return {
    authService: new HttpAuthServiceClient(config.authServiceUrl, config.timeout),
    paymentService: new HttpPaymentServiceClient(config.paymentServiceUrl, config.timeout),
    notificationService: new HttpNotificationServiceClient(config.notificationServiceUrl, config.timeout),
  };
}