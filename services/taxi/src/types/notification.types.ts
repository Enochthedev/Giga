import { NotificationChannel, Priority } from './common.types';

// Notification types for taxi service
export interface TaxiNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  channels: NotificationChannel[];
  priority: Priority;
  scheduled?: boolean;
  scheduledFor?: Date;
  sent: boolean;
  sentAt?: Date;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  // Ride notifications
  RIDE_REQUESTED = 'ride_requested',
  RIDE_CONFIRMED = 'ride_confirmed',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVING = 'driver_arriving',
  DRIVER_ARRIVED = 'driver_arrived',
  RIDE_STARTED = 'ride_started',
  RIDE_COMPLETED = 'ride_completed',
  RIDE_CANCELLED = 'ride_cancelled',

  // Driver notifications
  RIDE_REQUEST = 'ride_request',
  RIDE_ACCEPTED = 'ride_accepted',
  PASSENGER_CANCELLED = 'passenger_cancelled',
  EARNINGS_UPDATE = 'earnings_update',
  PAYOUT_PROCESSED = 'payout_processed',

  // Safety notifications
  EMERGENCY_ALERT = 'emergency_alert',
  SAFETY_CHECK = 'safety_check',
  INCIDENT_REPORTED = 'incident_reported',

  // System notifications
  MAINTENANCE_ALERT = 'maintenance_alert',
  SYSTEM_UPDATE = 'system_update',
  POLICY_UPDATE = 'policy_update',

  // Promotional notifications
  PROMOTION_AVAILABLE = 'promotion_available',
  SURGE_PRICING = 'surge_pricing',
  BONUS_OPPORTUNITY = 'bonus_opportunity',

  // Administrative notifications
  DOCUMENT_EXPIRY = 'document_expiry',
  VERIFICATION_REQUIRED = 'verification_required',
  ACCOUNT_SUSPENDED = 'account_suspended',
  TRAINING_DUE = 'training_due',
}

export interface NotificationData {
  rideId?: string;
  driverId?: string;
  passengerId?: string;
  amount?: number;
  location?: string;
  estimatedTime?: number;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface NotificationPreferences {
  userId: string;
  preferences: ChannelPreference[];
  quietHours?: QuietHours;
  updatedAt: Date;
}

export interface ChannelPreference {
  type: NotificationType;
  channels: NotificationChannel[];
  enabled: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  exceptions: NotificationType[]; // Types that can bypass quiet hours
}

export interface BulkNotification {
  id: string;
  name: string;
  type: NotificationType;
  targetAudience: TargetAudience;
  template: NotificationTemplate;
  scheduledFor?: Date;
  status: BulkNotificationStatus;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdAt: Date;
  sentAt?: Date;
  completedAt?: Date;
}

export interface TargetAudience {
  userType: 'driver' | 'passenger' | 'all';
  filters?: AudienceFilter[];
  userIds?: string[];
}

export interface AudienceFilter {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'in'
    | 'not_in'
    | 'greater_than'
    | 'less_than';
  value: any;
}

export enum BulkNotificationStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface NotificationDeliveryStatus {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  attempts: number;
  lastAttemptAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  UNSUBSCRIBED = 'unsubscribed',
}

export interface NotificationAnalytics {
  timeWindow: {
    start: Date;
    end: Date;
  };
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  deliveryRate: number;
  readRate: number;
  channelPerformance: ChannelPerformance[];
  typePerformance: TypePerformance[];
}

export interface ChannelPerformance {
  channel: NotificationChannel;
  sent: number;
  delivered: number;
  read: number;
  deliveryRate: number;
  readRate: number;
  averageDeliveryTime: number;
}

export interface TypePerformance {
  type: NotificationType;
  sent: number;
  delivered: number;
  read: number;
  deliveryRate: number;
  readRate: number;
  clickThroughRate: number;
}
