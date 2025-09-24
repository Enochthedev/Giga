/**
 * Provider integration interfaces
 */

import {
  EmailRequest,
  NotificationChannel,
  ProviderConfig,
  ProviderCostMetrics,
  ProviderFailoverEvent,
  ProviderHealthReport,
  ProviderQuota,
  ProviderResponse,
  ProviderStatus,
  PushRequest,
  SMSRequest,
  WebhookEvent
} from '../types';

export interface IProviderManager {
  // Provider configuration
  addProvider(config: ProviderConfig): Promise<boolean>;
  updateProvider(providerName: string, config: Partial<ProviderConfig>): Promise<boolean>;
  removeProvider(providerName: string): Promise<boolean>;
  getProvider(providerName: string): Promise<ProviderConfig>;
  listProviders(channel?: NotificationChannel): Promise<ProviderConfig[]>;

  // Provider status and health
  getProviderStatus(providerName: string): Promise<ProviderStatus>;
  getAllProviderStatuses(channel?: NotificationChannel): Promise<ProviderStatus[]>;
  checkProviderHealth(providerName: string): Promise<ProviderHealthReport>;
  enableProvider(providerName: string): Promise<boolean>;
  disableProvider(providerName: string): Promise<boolean>;

  // Load balancing and failover
  getOptimalProvider(channel: NotificationChannel, criteria?: { cost?: boolean; performance?: boolean }): Promise<string>;
  handleProviderFailover(fromProvider: string, toProvider: string, reason: string): Promise<void>;
  getFailoverHistory(limit?: number): Promise<ProviderFailoverEvent[]>;

  // Provider metrics and monitoring
  getProviderMetrics(providerName: string, timeRange?: { start: Date; end: Date }): Promise<any>;
  getProviderCostMetrics(providerName: string, timeRange?: { start: Date; end: Date }): Promise<ProviderCostMetrics>;
  getProviderQuota(providerName: string): Promise<ProviderQuota>;

  // Webhook handling
  processWebhook(providerName: string, payload: any, signature?: string): Promise<WebhookEvent>;
  verifyWebhookSignature(providerName: string, payload: any, signature: string): Promise<boolean>;
}

export interface IEmailProvider {
  name: string;
  channel: NotificationChannel.EMAIL;

  // Core functionality
  sendEmail(request: EmailRequest): Promise<ProviderResponse>;
  sendBulkEmails(requests: EmailRequest[]): Promise<ProviderResponse[]>;

  // Provider-specific features
  validateEmailAddress(email: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<string>;
  handleBounce(webhookData: any): Promise<void>;
  handleComplaint(webhookData: any): Promise<void>;

  // Configuration and health
  configure(config: any): Promise<void>;
  healthCheck(): Promise<boolean>;
  getQuota(): Promise<{ limit: number; used: number; remaining: number }>;
}

export interface ISMSProvider {
  name: string;
  channel: NotificationChannel.SMS;

  // Core functionality
  sendSMS(request: SMSRequest): Promise<ProviderResponse>;
  sendBulkSMS(requests: SMSRequest[]): Promise<ProviderResponse[]>;

  // Provider-specific features
  validatePhoneNumber(phoneNumber: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<string>;
  handleDeliveryReceipt(webhookData: any): Promise<void>;

  // Configuration and health
  configure(config: any): Promise<void>;
  healthCheck(): Promise<boolean>;
  getQuota(): Promise<{ limit: number; used: number; remaining: number }>;
}

export interface IPushProvider {
  name: string;
  channel: NotificationChannel.PUSH;

  // Core functionality
  sendPushNotification(request: PushRequest): Promise<ProviderResponse>;
  sendBulkPushNotifications(requests: PushRequest[]): Promise<ProviderResponse[]>;

  // Provider-specific features
  validateDeviceToken(token: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<string>;
  handleFeedback(webhookData: any): Promise<void>;

  // Configuration and health
  configure(config: any): Promise<void>;
  healthCheck(): Promise<boolean>;
  getQuota(): Promise<{ limit: number; used: number; remaining: number }>;
}

export interface IProviderLoadBalancer {
  // Load balancing strategies
  selectProvider(channel: NotificationChannel, criteria?: any): Promise<string>;
  updateProviderWeights(channel: NotificationChannel, weights: Record<string, number>): Promise<void>;

  // Failover management
  markProviderFailed(providerName: string, reason: string): Promise<void>;
  markProviderHealthy(providerName: string): Promise<void>;
  getFailedProviders(channel: NotificationChannel): Promise<string[]>;

  // Performance tracking
  recordProviderMetrics(providerName: string, responseTime: number, success: boolean): Promise<void>;
  getProviderPerformance(providerName: string): Promise<{ averageResponseTime: number; successRate: number }>;
}