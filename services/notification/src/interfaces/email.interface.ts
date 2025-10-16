/**
 * Email processor interfaces
 */

import {
  EmailRequest,
  EmailResult,
  NotificationErrorCode,
  ProviderResponse,
} from '../types';

export interface IEmailProcessor {
  // Core email processing
  processEmail(request: EmailRequest): Promise<EmailResult>;
  processBulkEmails(requests: EmailRequest[]): Promise<EmailResult[]>;

  // Template rendering integration
  renderAndSendEmail(
    templateId: string,
    variables: Record<string, any>,
    recipient: string | string[],
    options?: {
      cc?: string[];
      bcc?: string[];
      attachments?: any[];
      priority?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<EmailResult>;

  // Email validation
  validateEmailAddress(email: string): Promise<boolean>;
  validateEmailContent(request: EmailRequest): Promise<{
    isValid: boolean;
    errors: string[];
  }>;

  // Provider management
  selectProvider(request: EmailRequest): Promise<string>;
  getProviderHealth(providerName: string): Promise<boolean>;
}

export interface IEmailProvider {
  name: string;

  // Core functionality
  sendEmail(request: EmailRequest): Promise<ProviderResponse>;
  sendBulkEmails(requests: EmailRequest[]): Promise<ProviderResponse[]>;

  // Provider-specific features
  validateEmailAddress(email: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<string>;
  handleBounce(webhookData: any): Promise<void>;
  handleComplaint(webhookData: any): Promise<void>;

  // Configuration and health
  configure(config: EmailProviderConfig): Promise<void>;
  healthCheck(): Promise<boolean>;
  getQuota(): Promise<{ limit: number; used: number; remaining: number }>;
}

export interface EmailProviderConfig {
  name: string;
  type: 'smtp' | 'sendgrid' | 'ses' | 'mailgun';
  enabled: boolean;
  priority: number;

  // SMTP configuration
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
  };

  // API-based provider configuration
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  domain?: string;

  // Rate limiting
  rateLimit?: {
    maxPerSecond: number;
    maxPerMinute: number;
    maxPerHour: number;
    maxPerDay: number;
  };

  // Failover settings
  failover?: {
    enabled: boolean;
    retryAttempts: number;
    retryDelay: number;
    backupProviders: string[];
  };
}

export interface EmailDeliveryOptions {
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  trackOpens?: boolean;
  trackClicks?: boolean;
  unsubscribeUrl?: string;
  listUnsubscribe?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface EmailValidationResult {
  isValid: boolean;
  errors: EmailValidationError[];
  warnings: EmailValidationError[];
}

export interface EmailValidationError {
  field: string;
  message: string;
  code: NotificationErrorCode;
}
