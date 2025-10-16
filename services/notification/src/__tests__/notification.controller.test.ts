/**
 * Unit tests for NotificationController
 */

import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import {
  NotificationCategory,
  NotificationChannel,
  NotificationErrorCode,
  NotificationPriority,
  NotificationStatus,
} from '../types';

// Mock the NotificationService
vi.mock('../services/notification.service');

describe('NotificationController', () => {
  let controller: NotificationController;
  let mockNotificationService: vi.Mocked<NotificationService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock service
    mockNotificationService = {
      sendNotification: vi.fn(),
      sendBulkNotifications: vi.fn(),
      sendEmail: vi.fn(),
      sendSMS: vi.fn(),
      sendPushNotification: vi.fn(),
      sendInAppNotification: vi.fn(),
      scheduleNotification: vi.fn(),
      cancelScheduledNotification: vi.fn(),
      triggerWorkflow: vi.fn(),
      getNotificationStatus: vi.fn(),
      getDeliveryReport: vi.fn(),
      getNotificationHistory: vi.fn(),
    } as any;

    // Mock the constructor to return our mock service
    (NotificationService as any).mockImplementation(
      () => mockNotificationService
    );

    controller = new NotificationController();

    // Create mock request and response objects
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const notificationRequest = {
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

      const expectedResult = {
        id: 'notification-123',
        status: NotificationStatus.QUEUED,
        channels: [NotificationChannel.EMAIL],
        estimatedDelivery: new Date(),
      };

      mockRequest.body = notificationRequest;
      mockNotificationService.sendNotification.mockResolvedValue(
        expectedResult
      );

      await controller.sendNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        notificationRequest
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle validation errors', async () => {
      mockRequest.body = {
        // Missing required fields
        channels: [],
      };

      await controller.sendNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Validation failed',
          details: expect.any(Array),
        })
      );
    });

    it('should handle service errors', async () => {
      const notificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Test Subject',
          htmlBody: '<p>Test message</p>',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      const serviceError = {
        code: NotificationErrorCode.INVALID_REQUEST,
        message: 'Invalid notification request',
        retryable: false,
        timestamp: new Date(),
      };

      mockRequest.body = notificationRequest;
      mockNotificationService.sendNotification.mockRejectedValue(serviceError);

      await controller.sendNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: serviceError.message,
        code: serviceError.code,
        retryable: serviceError.retryable,
      });
    });

    it('should handle unexpected errors', async () => {
      const notificationRequest = {
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: {
          subject: 'Test Subject',
          htmlBody: '<p>Test message</p>',
        },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      };

      mockRequest.body = notificationRequest;
      mockNotificationService.sendNotification.mockRejectedValue(
        new Error('Unexpected error')
      );

      await controller.sendNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('sendBulkNotifications', () => {
    it('should send bulk notifications successfully', async () => {
      const notifications = [
        {
          userId: 'user-123',
          channels: [NotificationChannel.EMAIL],
          content: { subject: 'Test 1', htmlBody: '<p>Test 1</p>' },
          priority: NotificationPriority.NORMAL,
          category: NotificationCategory.TRANSACTIONAL,
          fromService: 'test-service',
        },
        {
          userId: 'user-456',
          channels: [NotificationChannel.SMS],
          content: { smsBody: 'Test SMS' },
          priority: NotificationPriority.HIGH,
          category: NotificationCategory.SECURITY,
          fromService: 'test-service',
        },
      ];

      const expectedResult = {
        totalRequests: 2,
        successCount: 2,
        failureCount: 0,
        results: [
          {
            id: 'notification-1',
            status: NotificationStatus.QUEUED,
            channels: [NotificationChannel.EMAIL],
          },
          {
            id: 'notification-2',
            status: NotificationStatus.QUEUED,
            channels: [NotificationChannel.SMS],
          },
        ],
      };

      mockRequest.body = { notifications };
      mockNotificationService.sendBulkNotifications.mockResolvedValue(
        expectedResult
      );

      await controller.sendBulkNotifications(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockNotificationService.sendBulkNotifications
      ).toHaveBeenCalledWith(notifications);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle empty notifications array', async () => {
      mockRequest.body = { notifications: [] };

      await controller.sendBulkNotifications(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Notifications array is required and must not be empty',
      });
    });

    it('should handle too many notifications', async () => {
      const notifications = Array(1001).fill({
        userId: 'user-123',
        channels: [NotificationChannel.EMAIL],
        content: { subject: 'Test', htmlBody: '<p>Test</p>' },
        priority: NotificationPriority.NORMAL,
        category: NotificationCategory.TRANSACTIONAL,
        fromService: 'test-service',
      });

      mockRequest.body = { notifications };

      await controller.sendBulkNotifications(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Maximum 1000 notifications allowed per bulk request',
      });
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const emailRequest = {
        to: 'test@example.com',
        subject: 'Test Email',
        htmlBody: '<p>Test message</p>',
        textBody: 'Test message',
      };

      const expectedResult = {
        messageId: 'email-123',
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        estimatedDelivery: new Date(),
      };

      mockRequest.body = emailRequest;
      mockNotificationService.sendEmail.mockResolvedValue(expectedResult);

      await controller.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockNotificationService.sendEmail).toHaveBeenCalledWith(
        emailRequest
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = {
        to: 'test@example.com',
        // Missing subject
      };

      await controller.sendEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email recipient (to) and subject are required',
      });
    });
  });

  describe('sendSMS', () => {
    it('should send SMS successfully', async () => {
      const smsRequest = {
        to: '+1234567890',
        body: 'Test SMS message',
      };

      const expectedResult = {
        messageId: 'sms-123',
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        estimatedDelivery: new Date(),
      };

      mockRequest.body = smsRequest;
      mockNotificationService.sendSMS.mockResolvedValue(expectedResult);

      await controller.sendSMS(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockNotificationService.sendSMS).toHaveBeenCalledWith(smsRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = {
        to: '+1234567890',
        // Missing body
      };

      await controller.sendSMS(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'SMS recipient (to) and body are required',
      });
    });
  });

  describe('sendPushNotification', () => {
    it('should send push notification successfully', async () => {
      const pushRequest = {
        deviceTokens: ['token1', 'token2'],
        title: 'Test Push',
        body: 'Test push message',
      };

      const expectedResult = {
        messageId: 'push-123',
        status: NotificationStatus.QUEUED,
        provider: 'mock-provider',
        successCount: 2,
        failureCount: 0,
      };

      mockRequest.body = pushRequest;
      mockNotificationService.sendPushNotification.mockResolvedValue(
        expectedResult
      );

      await controller.sendPushNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockNotificationService.sendPushNotification).toHaveBeenCalledWith(
        pushRequest
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = {
        deviceTokens: ['token1'],
        title: 'Test Push',
        // Missing body
      };

      await controller.sendPushNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Device tokens, title, and body are required',
      });
    });
  });

  describe('sendInAppNotification', () => {
    it('should send in-app notification successfully', async () => {
      const inAppRequest = {
        _userId: 'user-123',
        title: 'Test In-App',
        body: 'Test in-app message',
      };

      const expectedResult = {
        messageId: 'inapp-123',
        status: NotificationStatus.DELIVERED,
        deliveredAt: new Date(),
      };

      mockRequest.body = inAppRequest;
      mockNotificationService.sendInAppNotification.mockResolvedValue(
        expectedResult
      );

      await controller.sendInAppNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockNotificationService.sendInAppNotification
      ).toHaveBeenCalledWith(inAppRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedResult,
      });
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = {
        _userId: 'user-123',
        title: 'Test In-App',
        // Missing body
      };

      await controller.sendInAppNotification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'User ID, title, and body are required',
      });
    });
  });

  describe('getNotificationStatus', () => {
    it('should get notification status successfully', async () => {
      const notificationId = 'notification-123';
      const expectedStatus = NotificationStatus.DELIVERED;

      mockRequest.params = { notificationId };
      mockNotificationService.getNotificationStatus.mockResolvedValue(
        expectedStatus
      );

      await controller.getNotificationStatus(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockNotificationService.getNotificationStatus
      ).toHaveBeenCalledWith(notificationId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { status: expectedStatus },
      });
    });

    it('should handle missing notification ID', async () => {
      mockRequest.params = {};

      await controller.getNotificationStatus(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Notification ID is required',
      });
    });
  });

  describe('getNotificationHistory', () => {
    it('should get notification history successfully', async () => {
      const userId = 'user-123';
      const expectedHistory = [
        {
          id: 'notification-1',
          status: NotificationStatus.DELIVERED,
          channels: [NotificationChannel.EMAIL],
        },
        {
          id: 'notification-2',
          status: NotificationStatus.SENT,
          channels: [NotificationChannel.SMS],
        },
      ];

      mockRequest.params = { userId };
      mockRequest.query = { limit: '10', offset: '0' };
      mockNotificationService.getNotificationHistory.mockResolvedValue(
        expectedHistory
      );

      await controller.getNotificationHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(
        mockNotificationService.getNotificationHistory
      ).toHaveBeenCalledWith(userId, 10, 0);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expectedHistory,
        pagination: {
          limit: 10,
          offset: 0,
          total: expectedHistory.length,
        },
      });
    });

    it('should handle invalid limit parameter', async () => {
      mockRequest.params = { userId: 'user-123' };
      mockRequest.query = { limit: 'invalid' };

      await controller.getNotificationHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Limit must be a number between 1 and 100',
      });
    });

    it('should handle limit exceeding maximum', async () => {
      mockRequest.params = { userId: 'user-123' };
      mockRequest.query = { limit: '150' };

      await controller.getNotificationHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Limit must be a number between 1 and 100',
      });
    });
  });
});
