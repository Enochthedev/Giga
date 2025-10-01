/**
 * Core notification types and interfaces
 */

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationCategory {
  AUTHENTICATION = 'authentication',
  SECURITY = 'security',
  TRANSACTIONAL = 'transactional',
  MARKETING = 'marketing',
  SYSTEM = 'system',
  SOCIAL = 'social',
}

export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface NotificationContent {
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  smsBody?: string;
  pushTitle?: string;
  pushBody?: string;
  inAppTitle?: string;
  inAppBody?: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface TemplateVariables {
  [key: string]: any;
}

export interface NotificationRequest {
  // Recipient information
  userId?: string;
  email?: string;
  phone?: string;
  deviceTokens?: string[];

  // Notification content
  templateId?: string;
  subject?: string;
  content: NotificationContent;
  variables?: TemplateVariables;

  // Delivery options
  channels: NotificationChannel[];
  priority: NotificationPriority;
  category: NotificationCategory;

  // Scheduling
  sendAt?: Date;
  timezone?: string;

  // Tracking and metadata
  trackingEnabled?: boolean;
  metadata?: Record<string, any>;
  tags?: string[];

  // Sender information
  fromService: string;
  fromUserId?: string;
}

export interface NotificationResult {
  id: string;
  status: NotificationStatus;
  channels: NotificationChannel[];
  scheduledAt?: Date;
  estimatedDelivery?: Date;
  errors?: NotificationError[];
}

export interface BulkNotificationResult {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  results: NotificationResult[];
  errors?: NotificationError[];
}

export interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  attachments?: EmailAttachment[];
  templateId?: string;
  variables?: TemplateVariables;
  trackingEnabled?: boolean;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  cid?: string; // Content-ID for inline images
}

export interface EmailResult {
  messageId: string;
  status: NotificationStatus;
  provider: string;
  estimatedDelivery?: Date;
  error?: NotificationError;
}

export interface SMSRequest {
  to: string;
  body: string;
  templateId?: string;
  variables?: TemplateVariables;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface SMSResult {
  messageId: string;
  status: NotificationStatus;
  provider: string;
  estimatedDelivery?: Date;
  error?: NotificationError;
}

export interface PushRequest {
  deviceTokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  templateId?: string;
  variables?: TemplateVariables;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface PushResult {
  messageId: string;
  status: NotificationStatus;
  provider: string;
  successCount: number;
  failureCount: number;
  invalidTokens?: string[];
  error?: NotificationError;
}

export interface InAppRequest {
  _userId: string;
  title: string;
  body: string;
  actionUrl?: string;
  imageUrl?: string;
  data?: Record<string, any>;
  templateId?: string;
  variables?: TemplateVariables;
  priority?: NotificationPriority;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface InAppResult {
  messageId: string;
  status: NotificationStatus;
  deliveredAt?: Date;
  error?: NotificationError;
}

export interface ScheduledNotificationRequest extends NotificationRequest {
  scheduledAt: Date;
  timezone?: string;
  recurring?: RecurringConfig;
}

export interface RecurringConfig {
  pattern: 'daily' | 'weekly' | 'monthly' | 'cron';
  cronExpression?: string;
  endDate?: Date;
  maxOccurrences?: number;
}

export interface ScheduleResult {
  scheduleId: string;
  scheduledAt: Date;
  nextExecution?: Date;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface WorkflowContext {
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface WorkflowResult {
  workflowId: string;
  executionId: string;
  status: 'started' | 'completed' | 'failed';
  steps: WorkflowStep[];
  error?: NotificationError;
}

export interface WorkflowStep {
  stepId: string;
  stepType: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  executedAt?: Date;
  result?: any;
  error?: NotificationError;
}

export interface DeliveryReport {
  notificationId: string;
  channels: ChannelDeliveryReport[];
  overallStatus: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  engagementMetrics?: NotificationEngagementMetrics;
}

export interface ChannelDeliveryReport {
  channel: NotificationChannel;
  status: NotificationStatus;
  provider: string;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: NotificationError;
  metrics?: NotificationChannelMetrics;
}

export interface NotificationEngagementMetrics {
  opened?: boolean;
  openedAt?: Date;
  clicked?: boolean;
  clickedAt?: Date;
  bounced?: boolean;
  bouncedAt?: Date;
  complained?: boolean;
  complainedAt?: Date;
}

export interface NotificationChannelMetrics {
  deliveryTime?: number; // milliseconds
  retryCount?: number;
  cost?: number;
}

export enum NotificationErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  TEMPLATE_RENDER_ERROR = 'TEMPLATE_RENDER_ERROR',
  USER_OPTED_OUT = 'USER_OPTED_OUT',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUEUE_FULL = 'QUEUE_FULL',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INVALID_RECIPIENT = 'INVALID_RECIPIENT',
  CONTENT_VALIDATION_FAILED = 'CONTENT_VALIDATION_FAILED',
}

export interface NotificationError {
  code: NotificationErrorCode;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
  retryAfter?: number;
  timestamp: Date;
}
