/**
 * Main entry point for notification service exports
 */

// Export all types
export * from './types';

// Export all interfaces
export * from './interfaces';

// Re-export commonly used types for convenience
export type {
  DeliveryAnalytics, NotificationCategory, NotificationChannel, NotificationPreferences, NotificationPriority, NotificationRequest,
  NotificationResult, NotificationStatus, ProviderConfig, Template
} from './types';
