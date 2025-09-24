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
  UserEngagementProfile
} from '../types';

export interface IPreferenceManager {
  // User preferences
  getUserPreferences(userId: string): Promise<NotificationPreferences>;
  updateUserPreferences(userId: string, preferences: PreferenceUpdate): Promise<NotificationPreferences>;
  createDefaultPreferences(userId: string): Promise<NotificationPreferences>;
  deleteUserPreferences(userId: string): Promise<boolean>;

  // Opt-out management
  optOutUser(request: OptOutRequest): Promise<boolean>;
  optInUser(request: OptInRequest): Promise<boolean>;
  isOptedOut(userId: string, channel: NotificationChannel, category: NotificationCategory): Promise<boolean>;
  getOptOutStatus(userId: string): Promise<{ channels: NotificationChannel[]; categories: NotificationCategory[] }>;

  // Suppression lists
  addToSuppressionList(identifier: string, channel: NotificationChannel, reason: string, expiresAt?: Date): Promise<boolean>;
  removeFromSuppressionList(identifier: string, channel: NotificationChannel): Promise<boolean>;
  checkSuppressionList(identifier: string, channel: NotificationChannel): Promise<boolean>;
  getSuppressionList(channel?: NotificationChannel, limit?: number, offset?: number): Promise<SuppressionListEntry[]>;

  // Preference validation
  validatePreferences(preferences: PreferenceUpdate): Promise<{ isValid: boolean; errors: string[] }>;
  canSendNotification(userId: string, channel: NotificationChannel, category: NotificationCategory): Promise<{ canSend: boolean; reason?: string }>;

  // Engagement tracking
  updateEngagementProfile(userId: string, channel: NotificationChannel, engaged: boolean): Promise<void>;
  getUserEngagementProfile(userId: string): Promise<UserEngagementProfile>;
  getOptimalSendTime(userId: string): Promise<{ dayOfWeek: number; hour: number; timezone: string } | null>;

  // Quota management
  checkNotificationQuota(userId: string, category: NotificationCategory): Promise<NotificationQuota>;
  incrementNotificationQuota(userId: string, category: NotificationCategory): Promise<void>;
  resetNotificationQuota(userId: string, category?: NotificationCategory): Promise<void>;

  // Bulk operations
  bulkOptOut(userIds: string[], channels: NotificationChannel[], reason: string): Promise<{ success: string[]; failed: string[] }>;
  bulkOptIn(userIds: string[], channels: NotificationChannel[]): Promise<{ success: string[]; failed: string[] }>;
  exportUserPreferences(userIds?: string[]): Promise<NotificationPreferences[]>;
  importUserPreferences(preferences: NotificationPreferences[]): Promise<{ imported: number; failed: number }>;
}