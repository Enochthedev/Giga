/**
 * Unit tests for NotificationService
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { NotificationService } from '../services/notification.service';
import {
  EmailRequest,
  InAppRequest,
  NotificationCategory,
  NotificationChannel,
  NotificationErrorCode,
  NotificationPriority,
  NotificationRequest,
  NotificationStatus,
  PushRequest,
  SMSRequest,
  ScheduledNotificationRequest,
} from '../types';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const request: NotificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Test Subject',
          htmlBody: '<p>Test message</p>',
          textBody: 'Test message',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      const result = await service.sendNotification(request);

      expect(result).toMatchObject({
        id: expect.any(String),
        status: NotificationStatus.QUEUED,
        channels: [NotificationChannel.EMAIL],
        estimatedDelivery: expect.any(Date),
      });
    });

    it('should handle scheduled notifications', async () => {
      const sendAt = new Date(Date.now() + 3600000); // 1 hour from now
      const request: NotificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Scheduled Test',
          htmlBody: '<p>Scheduled message</p>',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
        sendAt,
      };

      const result = await service.sendNotification(request);

      expect(result).toMatchObject({
        id: expect.any(String),
        status: NotificationStatus.QUEUED,
        channels: [NotificationChannel.EMAIL],
        scheduledAt: sendAt,
        estimatedDelivery: sendAt,
      });
    });

    it('should validate required fields', async () => {
      const request = {
        // Missing required fields
        channels: [],
        content: {},
      } as NotificationRequest;

      await expect(service.sendNotification(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining(
          'At least one notification channel is required'
        ),
        retryable: false,
      });
    });

    it('should validate email channel requirements', async () => {
      const request: NotificationRequest = {
        channels: [NotificationChannel.EMAIL],
        content: {
          // Missing email content
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      await expect(service.sendNotification(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining(
          'Email address or user ID is required'
        ),
        retryable: false,
      });
    });

    it('should validate SMS channel requirements', async () => {
      const request: NotificationRequest = {
        channels: [NotificationChannel.SMS],
        content: {
          // Missing SMS body
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      await expect(service.sendNotification(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('Phone number or user ID is required'),
        retryable: false,
      });
    });

    it('should validate push notification requirements', async () => {
      const request: NotificationRequest = {
        channels: [NotificationChannel.PUSH],
        content: {
          pushTitle: 'Test Title',
          // Missing push body
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      await expect(service.sendNotification(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining(
          'Device tokens or user ID is required'
        ),
        retryable: false,
      });
    });

    it('should validate in-app notification requirements', async () => {
      const request: NotificationRequest = {
        channels: [NotificationChannel.IN_APP],
        content: {
          inAppTitle: 'Test Title',
          // Missing in-app body
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      await expect(service.sendNotification(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('User ID is required'),
        retryable: false,
      });
    });
  });

  describe('sendBulkNotifications', () => {
    it('should send bulk notifications successfully', async () => {
      const requests: NotificationRequest[] = [
        {
          userId: 'user-123',
          channels: [NotificationChannel.EMAIL],
          content: {
            subject: 'Test 1',
            htmlBody: '<p>Test 1</p>',
          },
          priority: NotificationPriority.NORMAL,
          category: NotificationCategory.TRANSACTIONAL,
          fromService: 'test-service',
        },
        {
          userId: 'user-456',
          channels: [NotificationChannel.SMS],
          content: {
            smsBody: 'Test SMS',
          },
          priority: NotificationPriority.HIGH,
          category: NotificationCategory.SECURITY,
          fromService: 'test-service',
        },
      ];

      const result = await service.sendBulkNotifications(requests);

      expect(result).toMatchObject({
        totalRequests: 2,
        successCount: 2,
        failureCount: 0,
        results: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            status: NotificationStatus.QUEUED,
          }),
        ]),
      });
    });

    it('should handle mixed success and failure', async () => {
      const requests: NotificationRequest[] = [
        {
          userId: 'user-123',
          channels: [NotificationChannel.EMAIL],
          content: {
            subject: 'Valid notification',
            htmlBody: '<p>Valid</p>',
          },
          priority: NotificationPriority.NORMAL,
          category: NotificationCategory.TRANSACTIONAL,
          fromService: 'test-service',
        },
        {
          // Invalid notification - missing required fields
          channels: [],
          content: {},
        } as NotificationRequest,
      ];

      const result = await service.sendBulkNotifications(requests);

      expect(result).toMatchObject({
        totalRequests: 2,
        successCount: 1,
        failureCount: 1,
        results: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            status: NotificationStatus.QUEUED,
          }),
        ]),
        errors: expect.arrayContaining([
          expect.objectContaining({
            code: NotificationErrorCode.INVALID_REQUEST,
            retryable: false,
          }),
        ]),
      });
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const request: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Email',
        htmlBody: '<p>Test message</p>',
        textBody: 'Test message',
      };

      const result = await service.sendEmail(request);

      expect(result).toMatchObject({
        messageId: expect.any(String),
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        estimatedDelivery: expect.any(Date),
      });
    });

    it('should validate required fields', async () => {
      const request = {
        to: 'test@example.com',
        // Missing subject
      } as EmailRequest;

      await expect(service.sendEmail(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining(
          'Email recipient and subject are required'
        ),
        retryable: false,
      });
    });
  });

  describe('sendSMS', () => {
    it('should send SMS successfully', async () => {
      const request: SMSRequest = {
        to: '+1234567890',
        body: 'Test SMS message',
      };

      const result = await service.sendSMS(request);

      expect(result).toMatchObject({
        messageId: expect.any(String),
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        estimatedDelivery: expect.any(Date),
      });
    });

    it('should validate required fields', async () => {
      const request = {
        to: '+1234567890',
        // Missing body
      } as SMSRequest;

      await expect(service.sendSMS(request)).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('SMS recipient and body are required'),
        retryable: false,
      });
    });
  });

  describe('sendPushNotification', () => {
    it('should send push notification successfully', async () => {
      const request: PushRequest = {
        deviceTokens: ['token1', 'token2'],
        title: 'Test Push',
        body: 'Test push message',
      };

      const result = await service.sendPushNotification(request);

      expect(result).toMatchObject({
        messageId: expect.any(String),
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        successCount: 2,
        failureCount: 0,
      });
    });

    it('should validate required fields', async () => {
      const request = {
        deviceTokens: ['token1'],
        title: 'Test Push',
        // Missing body
      } as PushRequest;

      await expect(service.sendPushNotification(request)).rejects.toMatchObject(
        {
          code: NotificationErrorCode.INVALID_REQUEST,
          message: expect.stringContaining(
            'Device tokens, title, and body are required'
          ),
          retryable: false,
        }
      );
    });
  });

  describe('sendInAppNotification', () => {
    it('should send in-app notification successfully', async () => {
      const request: InAppRequest = {
        _userId: 'user-123',
        title: 'Test In-App',
        body: 'Test in-app message',
      };

      const result = await service.sendInAppNotification(request);

      expect(result).toMatchObject({
        messageId: expect.any(String),
        status: NotificationStatus.DELIVERED,
        deliveredAt: expect.any(Date),
      });
    });

    it('should validate required fields', async () => {
      const request = {
        _userId: 'user-123',
        title: 'Test In-App',
        // Missing body
      } as InAppRequest;

      await expect(
        service.sendInAppNotification(request)
      ).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining(
          'User ID, title, and body are required'
        ),
        retryable: false,
      });
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification successfully', async () => {
      const scheduledAt = new Date(Date.now() + 3600000); // 1 hour from now
      const request: ScheduledNotificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Scheduled Test',
          htmlBody: '<p>Scheduled message</p>',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
        scheduledAt,
      };

      const result = await service.scheduleNotification(request);

      expect(result).toMatchObject({
        scheduleId: expect.any(String),
        scheduledAt,
        nextExecution: scheduledAt,
        status: 'scheduled',
      });
    });

    it('should validate scheduled time is in the future', async () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      const request: ScheduledNotificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Test',
          htmlBody: '<p>Test</p>',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
        scheduledAt: pastDate,
      };

      await expect(service.scheduleNotification(request)).rejects.toMatchObject(
        {
          code: NotificationErrorCode.INVALID_REQUEST,
          message: expect.stringContaining(
            'Scheduled time must be in the future'
          ),
          retryable: false,
        }
      );
    });
  });

  describe('cancelScheduledNotification', () => {
    it('should cancel scheduled notification successfully', async () => {
      const notificationId = 'notification-123';

      const result = await service.cancelScheduledNotification(notificationId);

      expect(result).toBe(true);
    });

    it('should validate notification ID', async () => {
      await expect(
        service.cancelScheduledNotification('')
      ).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('Notification ID is required'),
        retryable: false,
      });
    });
  });

  describe('getNotificationStatus', () => {
    it('should get notification status successfully', async () => {
      const notificationId = 'notification-123';

      const result = await service.getNotificationStatus(notificationId);

      expect(result).toBe(NotificationStatus.DELIVERED);
    });

    it('should validate notification ID', async () => {
      await expect(service.getNotificationStatus('')).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('Notification ID is required'),
        retryable: false,
      });
    });
  });

  describe('getDeliveryReport', () => {
    it('should get delivery report successfully', async () => {
      const notificationId = 'notification-123';

      const result = await service.getDeliveryReport(notificationId);

      expect(result).toMatchObject({
        notificationId,
        channels: expect.any(Array),
        overallStatus: NotificationStatus.DELIVERED,
        sentAt: expect.any(Date),
        deliveredAt: expect.any(Date),
      });
    });

    it('should validate notification ID', async () => {
      await expect(service.getDeliveryReport('')).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('Notification ID is required'),
        retryable: false,
      });
    });
  });

  describe('getNotificationHistory', () => {
    it('should get notification history successfully', async () => {
      const userId = 'user-123';

      const result = await service.getNotificationHistory(userId, 10, 0);

      expect(result).toEqual([]);
    });

    it('should validate user ID', async () => {
      await expect(
        service.getNotificationHistory('', 10, 0)
      ).rejects.toMatchObject({
        code: NotificationErrorCode.INVALID_REQUEST,
        message: expect.stringContaining('User ID is required'),
        retryable: false,
      });
    });
  });
});
