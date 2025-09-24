/**
 * Provider integration types and interfaces
 */

import { NotificationChannel, NotificationError } from './notification.types';

export interface ProviderConfig {
  name: string;
  type: NotificationChannel;
  enabled: boolean;
  priority: number; // Lower number = higher priority
  rateLimits: RateLimit[];
  healthCheck: HealthCheckConfig;
  failover: FailoverConfig;
  credentials: Record<string, any>;
  settings: Record<string, any>;
}

export interface RateLimit {
  window: number; // milliseconds
  maxRequests: number;
  burstLimit?: number;
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number; // milliseconds
  timeout: number; // milliseconds
  retries: number;
  endpoint?: string;
}

export interface FailoverConfig {
  enabled: boolean;
  maxFailures: number;
  failureWindow: number; // milliseconds
  backoffMultiplier: number;
  maxBackoffTime: number; // milliseconds
}

export interface ProviderStatus {
  name: string;
  type: NotificationChannel;
  isHealthy: boolean;
  isEnabled: boolean;
  lastHealthCheck: Date;
  consecutiveFailures: number;
  nextRetryAt?: Date;
  metrics: ProviderStatusMetrics;
}

export interface ProviderStatusMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number; // milliseconds
  lastRequestAt?: Date;
  errorRate: number; // percentage
  throughput: number; // requests per minute
}

export interface ProviderResponse {
  success: boolean;
  messageId?: string;
  status: string;
  responseTime: number;
  cost?: number;
  metadata?: Record<string, any>;
  error?: NotificationError;
}

export interface EmailProviderConfig extends ProviderConfig {
  type: NotificationChannel.EMAIL;
  credentials: {
    apiKey?: string;
    username?: string;
    password?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
  };
  settings: {
    fromEmail: string;
    fromName: string;
    replyTo?: string;
    trackOpens?: boolean;
    trackClicks?: boolean;
    suppressionList?: boolean;
  };
}

export interface SMSProviderConfig extends ProviderConfig {
  type: NotificationChannel.SMS;
  credentials: {
    accountSid?: string;
    authToken?: string;
    apiKey?: string;
    apiSecret?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
  };
  settings: {
    fromNumber: string;
    messagingServiceSid?: string;
    statusCallback?: string;
    maxMessageLength?: number;
  };
}

export interface PushProviderConfig extends ProviderConfig {
  type: NotificationChannel.PUSH;
  credentials: {
    serverKey?: string;
    projectId?: string;
    privateKey?: string;
    clientEmail?: string;
    keyId?: string;
    teamId?: string;
    bundleId?: string;
  };
  settings: {
    platform: 'android' | 'ios' | 'web';
    environment?: 'development' | 'production';
    collapseKey?: string;
    timeToLive?: number;
  };
}

export interface ProviderLoadBalancer {
  channel: NotificationChannel;
  strategy: LoadBalancingStrategy;
  providers: ProviderConfig[];
  currentProvider?: string;
  failedProviders: Set<string>;
}

export enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  WEIGHTED = 'weighted',
  LEAST_CONNECTIONS = 'least_connections',
  COST_OPTIMIZED = 'cost_optimized',
  PERFORMANCE_BASED = 'performance_based'
}

export interface ProviderFailoverEvent {
  fromProvider: string;
  toProvider: string;
  channel: NotificationChannel;
  reason: string;
  timestamp: Date;
  notificationId?: string;
}

export interface ProviderCostMetrics {
  provider: string;
  channel: NotificationChannel;
  totalCost: number;
  averageCostPerMessage: number;
  currency: string;
  period: {
    start: Date;
    end: Date;
  };
  messageCount: number;
}

export interface ProviderHealthReport {
  provider: string;
  channel: NotificationChannel;
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number; // percentage
  responseTime: {
    average: number;
    p95: number;
    p99: number;
  };
  errorRate: number; // percentage
  lastIncident?: {
    timestamp: Date;
    description: string;
    resolved: boolean;
  };
  checkedAt: Date;
}

export interface ProviderQuota {
  provider: string;
  channel: NotificationChannel;
  quotaType: 'daily' | 'monthly' | 'per_minute' | 'per_hour';
  limit: number;
  used: number;
  remaining: number;
  resetAt: Date;
  isExceeded: boolean;
}

export interface WebhookEvent {
  provider: string;
  eventType: string;
  messageId: string;
  timestamp: Date;
  data: Record<string, unknown>;
  signature?: string;
  verified: boolean;
}