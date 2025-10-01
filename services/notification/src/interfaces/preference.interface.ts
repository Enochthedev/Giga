/**
 * User preference management interfaces
 */

import {
  NotificationCategory,
  NotificationChannel,
  NotificationPreferences,
  NotificationQuota,
  OptInRequest,
  OptOutRequest,
  PreferenceUpdate,
  SuppressionListEntry,
  UserEngagementProfile,
} from '../types';

export interface IPreferenceManager {
  // User preferences
  getUserPreferences(_userId: string): Promise<NotificationPreferences>;
  updateUserPreferences(
    _userId: string,
    preferences: PreferenceUpdate
  ): Promise<NotificationPreferences>;
  createDefaultPreferences(_userId: string): Promise<NotificationPreferences>;
  deleteUserPreferences(_userId: string): Promise<boolean>;

  // Opt-out management
  optOutUser(request: OptOutRequest): Promise<boolean>;
  optInUser(request: OptInRequest): Promise<boolean>;
  isOptedOut(
    _userId: string,
    channel: NotificationChannel,
    category: NotificationCategory
  ): Promise<boolean>;
  getOptOutStatus(
    _userId: string
  ): Promise<{
    channels: NotificationChannel[];
    categories: NotificationCategory[];
  }>;

  // Suppression lists
  addToSuppressionList(
    identifier: string,
    channel: NotificationChannel,
    reason: string,
    expiresAt?: Date
  ): Promise<boolean>;
  removeFromSuppressionList(
    identifier: string,
    channel: NotificationChannel
  ): Promise<boolean>;
  checkSuppressionList(
    identifier: string,
    channel: NotificationChannel
  ): Promise<boolean>;
  getSuppressionList(
    channel?: NotificationChannel,
    limit?: number,
    offset?: number
  ): Promise<SuppressionListEntry[]>;

  // Preference validation
  validatePreferences(
    preferences: PreferenceUpdate
  ): Promise<{ isValid: boolean; errors: string[] }>;
  canSendNotification(
    _userId: string,
    channel: NotificationChannel,
    category: NotificationCategory
  ): Promise<{ canSend: boolean; reason?: string }>;

  // Engagement tracking
  updateEngagementProfile(
    _userId: string,
    channel: NotificationChannel,
    engaged: boolean
  ): Promise<void>;
  getUserEngagementProfile(_userId: string): Promise<UserEngagementProfile>;
  getOptimalSendTime(
    _userId: string
  ): Promise<{ dayOfWeek: number; hour: number; timezone: string } | null>;

  // Quota management
  checkNotificationQuota(
    _userId: string,
    category: NotificationCategory
  ): Promise<NotificationQuota>;
  incrementNotificationQuota(
    _userId: string,
    category: NotificationCategory
  ): Promise<void>;
  resetNotificationQuota(
    _userId: string,
    category?: NotificationCategory
  ): Promise<void>;

  // Bulk operations
  bulkOptOut(
    userIds: string[],
    channels: NotificationChannel[],
    reason: string
  ): Promise<{ success: string[]; failed: string[] }>;
  bulkOptIn(
    userIds: string[],
    channels: NotificationChannel[]
  ): Promise<{ success: string[]; failed: string[] }>;
  exportUserPreferences(userIds?: string[]): Promise<NotificationPreferences[]>;
  importUserPreferences(
    preferences: NotificationPreferences[]
  ): Promise<{ imported: number; failed: number }>;
}
