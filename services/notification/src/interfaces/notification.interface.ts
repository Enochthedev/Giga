/**
 * Core notification service interfaces
 */

import {
  BulkNotificationResult,
  DeliveryReport,
  EmailRequest,
  EmailResult,
  InAppRequest,
  InAppResult,
  NotificationRequest,
  NotificationResult,
  NotificationStatus,
  PushRequest,
  PushResult,
  SMSRequest,
  SMSResult,
  ScheduleResult,
  ScheduledNotificationRequest,
  WorkflowContext,
  WorkflowResult,
} from '../types';

export interface INotificationService {
  // Primary notification methods
  sendNotification(request: NotificationRequest): Promise<NotificationResult>;
  sendBulkNotifications(
    requests: NotificationRequest[]
  ): Promise<BulkNotificationResult>;

  // Channel-specific methods
  sendEmail(emailRequest: EmailRequest): Promise<EmailResult>;
  sendSMS(smsRequest: SMSRequest): Promise<SMSResult>;
  sendPushNotification(pushRequest: PushRequest): Promise<PushResult>;
  sendInAppNotification(inAppRequest: InAppRequest): Promise<InAppResult>;

  // Scheduled notifications
  scheduleNotification(
    request: ScheduledNotificationRequest
  ): Promise<ScheduleResult>;
  cancelScheduledNotification(notificationId: string): Promise<boolean>;
  updateScheduledNotification(
    notificationId: string,
    updates: Partial<ScheduledNotificationRequest>
  ): Promise<ScheduleResult>;

  // Workflow management
  triggerWorkflow(
    workflowId: string,
    context: WorkflowContext
  ): Promise<WorkflowResult>;

  // Status and tracking
  getNotificationStatus(notificationId: string): Promise<NotificationStatus>;
  getDeliveryReport(notificationId: string): Promise<DeliveryReport>;
  getNotificationHistory(
    _userId: string,
    limit?: number,
    offset?: number
  ): Promise<NotificationResult[]>;

  // Bulk operations
  cancelBulkNotifications(
    notificationIds: string[]
  ): Promise<{ cancelled: string[]; failed: string[] }>;
  retryFailedNotifications(
    notificationIds: string[]
  ): Promise<{ retried: string[]; failed: string[] }>;
}
