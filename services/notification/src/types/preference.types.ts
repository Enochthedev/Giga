/**
 * User preference management types and interfaces
 */

import {
  NotificationCategory,
  NotificationChannel,
} from './notification.types';

export interface NotificationPreferences {
  _userId: string;

  // Channel preferences
  channels: {
    email: ChannelPreference;
    sms: ChannelPreference;
    push: ChannelPreference;
    inApp: ChannelPreference;
  };

  // Category preferences
  categories: {
    [key in NotificationCategory]: CategoryPreference;
  };

  // Global settings
  globalOptOut: boolean;
  quietHours?: QuietHours;

  // Frequency limits
  maxDailyNotifications?: number;
  maxWeeklyNotifications?: number;

  // Metadata
  updatedAt: Date;
  consentDate?: Date;
}

export interface ChannelPreference {
  enabled: boolean;
  optedOutAt?: Date;
  optedOutReason?: string;
}

export interface CategoryPreference {
  enabled: boolean;
  channels: NotificationChannel[];
  frequency: NotificationFrequency;
}

export interface QuietHours {
  start: string; // HH:MM format
  end: string; // HH:MM format
  timezone: string;
  enabled: boolean;
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NEVER = 'never',
}

export interface PreferenceUpdate {
  channels?: Partial<{
    email: Partial<ChannelPreference>;
    sms: Partial<ChannelPreference>;
    push: Partial<ChannelPreference>;
    inApp: Partial<ChannelPreference>;
  }>;
  categories?: Partial<{
    [key in NotificationCategory]: Partial<CategoryPreference>;
  }>;
  globalOptOut?: boolean;
  quietHours?: QuietHours;
  maxDailyNotifications?: number;
  maxWeeklyNotifications?: number;
}

export interface OptOutRequest {
  _userId: string;
  channels: NotificationChannel[];
  categories?: NotificationCategory[];
  reason?: string;
  permanent?: boolean;
}

export interface OptInRequest {
  _userId: string;
  channels: NotificationChannel[];
  categories?: NotificationCategory[];
  consentSource?: string;
}

export interface SuppressionListEntry {
  identifier: string; // email, phone, or device token
  channel: NotificationChannel;
  reason: string;
  addedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface PreferenceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UserEngagementProfile {
  _userId: string;
  totalNotificationsSent: number;
  totalNotificationsOpened: number;
  totalNotificationsClicked: number;
  lastEngagementDate?: Date;
  engagementScore: number; // 0-100
  preferredChannels: NotificationChannel[];
  optimalSendTimes: UserOptimalSendTime[];
  updatedAt: Date;
}

export interface UserOptimalSendTime {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  timezone: string;
  engagementRate: number;
}

export interface NotificationQuota {
  _userId: string;
  category: NotificationCategory;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  lastResetDate: Date;
  isExceeded: boolean;
}
