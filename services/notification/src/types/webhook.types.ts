/**
 * Webhook and event integration types
 */

export enum WebhookEventType {
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
  UNSUBSCRIBED = 'unsubscribed',
  FAILED = 'failed',
  DEFERRED = 'deferred',
}

export enum WebhookProvider {
  SENDGRID = 'sendgrid',
  MAILGUN = 'mailgun',
  AWS_SES = 'aws_ses',
  TWILIO = 'twilio',
  AWS_SNS = 'aws_sns',
  FCM = 'fcm',
  APNS = 'apns',
}

export interface WebhookEvent {
  id: string;
  provider: WebhookProvider;
  eventType: WebhookEventType;
  timestamp: Date;
  messageId: string;
  notificationId?: string;
  recipient: string;
  data: Record<string, any>;
  signature?: string;
  verified: boolean;
}

export interface WebhookConfig {
  provider: WebhookProvider;
  endpoint: string;
  secret: string;
  enabled: boolean;
  events: WebhookEventType[];
  retryConfig?: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffMs: number;
  };
}

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  event?: WebhookEvent;
}

// Event-driven notification types
export enum BusinessEventType {
  USER_REGISTERED = 'user.registered',
  USER_LOGIN = 'user.login',
  USER_PASSWORD_RESET = 'user.password_reset',
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_CANCELLED = 'order.cancelled',
  PAYMENT_SUCCESSFUL = 'payment.successful',
  PAYMENT_FAILED = 'payment.failed',
  BOOKING_CREATED = 'booking.created',
  BOOKING_CONFIRMED = 'booking.confirmed',
  BOOKING_CANCELLED = 'booking.cancelled',
  RIDE_REQUESTED = 'ride.requested',
  RIDE_ACCEPTED = 'ride.accepted',
  RIDE_COMPLETED = 'ride.completed',
  SYSTEM_MAINTENANCE = 'system.maintenance',
  SECURITY_ALERT = 'security.alert',
}

export interface BusinessEvent {
  id: string;
  type: BusinessEventType;
  timestamp: Date;
  source: string;
  userId?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface BusinessRule {
  id: string;
  name: string;
  description?: string;
  eventType: BusinessEventType;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in'
    | 'exists'
    | 'not_exists';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface RuleAction {
  type: 'send_notification' | 'delay' | 'webhook' | 'update_preference';
  config:
    | NotificationActionConfig
    | DelayActionConfig
    | WebhookActionConfig
    | PreferenceActionConfig;
}

export interface NotificationActionConfig {
  templateId: string;
  channels: string[];
  priority: string;
  delay?: number; // milliseconds
  variables?: Record<string, any>;
}

export interface DelayActionConfig {
  duration: number; // milliseconds
}

export interface WebhookActionConfig {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  payload?: Record<string, any>;
}

export interface PreferenceActionConfig {
  userId: string;
  updates: Record<string, any>;
}

export interface RuleEvaluationResult {
  ruleId: string;
  matched: boolean;
  actions: RuleActionResult[];
  executionTime: number;
  error?: string;
}

export interface RuleActionResult {
  actionType: string;
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

export interface EventProcessingResult {
  eventId: string;
  processedAt: Date;
  rulesEvaluated: number;
  rulesMatched: number;
  actionsExecuted: number;
  results: RuleEvaluationResult[];
  totalExecutionTime: number;
  error?: string;
}

// Webhook delivery tracking
export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload: Record<string, any>;
  status: WebhookDeliveryStatus;
  responseCode?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt?: Date;
  createdAt: Date;
  deliveredAt?: Date;
  error?: string;
}

export enum WebhookDeliveryStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETRYING = 'retrying',
  CANCELLED = 'cancelled',
}

// Provider-specific webhook payload types
export interface SendGridWebhookPayload {
  email: string;
  timestamp: number;
  'smtp-id': string;
  event: string;
  category?: string[];
  sg_event_id: string;
  sg_message_id: string;
  reason?: string;
  status?: string;
  url?: string;
  useragent?: string;
  ip?: string;
}

export interface TwilioWebhookPayload {
  MessageSid: string;
  MessageStatus: string;
  To: string;
  From: string;
  Body?: string;
  NumSegments?: string;
  NumMedia?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
  Price?: string;
  PriceUnit?: string;
}

export interface AWSWebhookPayload {
  eventType: string;
  mail: {
    timestamp: string;
    messageId: string;
    destination: string[];
  };
  bounce?: {
    bounceType: string;
    bounceSubType: string;
    bouncedRecipients: Array<{
      emailAddress: string;
      action?: string;
      status?: string;
      diagnosticCode?: string;
    }>;
  };
  complaint?: {
    complainedRecipients: Array<{
      emailAddress: string;
    }>;
    complaintFeedbackType?: string;
  };
}

export interface FCMWebhookPayload {
  message_id: string;
  from: string;
  category: string;
  collapse_key?: string;
  data?: Record<string, unknown>;
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
}

export interface WebhookSignatureValidation {
  algorithm: 'sha256' | 'sha1' | 'md5';
  header: string;
  secret: string;
}

export interface RuleFilters {
  eventType?: string;
  enabled?: boolean;
  priority?: number;
  createdAfter?: Date;
  limit?: number;
  offset?: number;
}

export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface EventHistoryFilters {
  eventTypes?: string[];
  userId?: string;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface EventSubscription {
  id: string;
  eventTypes: string[];
  handler: (event: BusinessEvent) => Promise<void>;
  filters?: Record<string, unknown>;
  createdAt: Date;
  isActive: boolean;
}
