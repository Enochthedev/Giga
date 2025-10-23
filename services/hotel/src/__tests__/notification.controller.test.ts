/**
 * Notification Controller Tests
 */

import { NotificationController } from '@/controllers/notification.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { HotelNotificationService } from '@/services/notification.service';
import { NextFunction, Request, Response } from 'express';
import { vi } from 'vitest';

// Mock the notification service
vi.mock('@/services/notification.service');
const MockedHotelNotificationService = HotelNotificationService as any;

// Mock Prisma
const mockPrisma = {} as PrismaClient;

// Mock express-validator
vi.mock('express-validator', async () => {
  const actual = await vi.importActual('express-validator');
  return {
    ...actual,
    validationResult: vi.fn(),
    param: vi.fn(() => ({
      isString: vi.fn().mockReturnThis(),
      notEmpty: vi.fn().mockReturnThis(),
      withMessage: vi.fn().mockReturnThis(),
    })),
    body: vi.fn(() => ({
      isIn: vi.fn().mockReturnThis(),
      isObject: vi.fn().mockReturnThis(),
      isNumeric: vi.fn().mockReturnThis(),
      optional: vi.fn().mockReturnThis(),
      isBoolean: vi.fn().mockReturnThis(),
      isArray: vi.fn().mockReturnThis(),
      isString: vi.fn().mockReturnThis(),
      notEmpty: vi.fn().mockReturnThis(),
      withMessage: vi.fn().mockReturnThis(),
    })),
  };
});

import { validationResult } from 'express-validator';
const mockedValidationResult = validationResult as any;

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let mockNotificationService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock notification service
    mockNotificationService = {
      sendBookingConfirmation: vi.fn(),
      sendBookingUpdate: vi.fn(),
      scheduleBookingReminders: vi.fn(),
      processScheduledReminders: vi.fn(),
      cancelScheduledReminders: vi.fn(),
      getGuestCommunicationWorkflow: vi.fn(),
      updateGuestNotificationPreferences: vi.fn(),
      getNotificationDeliveryReport: vi.fn(),
    } as any;

    MockedHotelNotificationService.mockImplementation(
      () => mockNotificationService
    );

    notificationController = new NotificationController(mockPrisma);

    // Setup mock request and response
    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    // Mock validation result to return no errors by default
    mockedValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    } as any);
  });

  describe('sendBookingConfirmation', () => {
    it('should send booking confirmation successfully', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      const mockResult = {
        id: 'notification-123',
        status: 'sent',
        channels: ['email'],
      };

      mockNotificationService.sendBookingConfirmation.mockResolvedValue(
        mockResult
      );

      // Execute
      await notificationController.sendBookingConfirmation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.sendBookingConfirmation
      ).toHaveBeenCalledWith('booking-123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Booking confirmation notification sent successfully',
        timestamp: expect.any(Date),
      });
    });

    it('should handle validation errors', async () => {
      // Setup validation error
      mockedValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Booking ID is required' }],
      } as any);

      // Execute
      await notificationController.sendBookingConfirmation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(
        mockNotificationService.sendBookingConfirmation
      ).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      const error = new Error('Booking not found');
      mockNotificationService.sendBookingConfirmation.mockRejectedValue(error);

      // Execute
      await notificationController.sendBookingConfirmation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('sendBookingUpdate', () => {
    it('should send booking update successfully', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      mockRequest.body = {
        updateType: 'modification',
        changes: { checkInDate: '2024-01-16' },
        refundAmount: 0,
      };

      const mockResult = {
        id: 'notification-456',
        status: 'sent',
        channels: ['email'],
      };

      mockNotificationService.sendBookingUpdate.mockResolvedValue(mockResult);

      // Execute
      await notificationController.sendBookingUpdate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNotificationService.sendBookingUpdate).toHaveBeenCalledWith(
        'booking-123',
        'modification',
        { checkInDate: '2024-01-16' },
        0
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        message: 'Booking update notification sent successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('scheduleBookingReminders', () => {
    it('should schedule booking reminders successfully', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      mockNotificationService.scheduleBookingReminders.mockResolvedValue();

      // Execute
      await notificationController.scheduleBookingReminders(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.scheduleBookingReminders
      ).toHaveBeenCalledWith('booking-123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Booking reminders scheduled successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('processScheduledReminders', () => {
    it('should process scheduled reminders successfully', async () => {
      // Setup
      mockNotificationService.processScheduledReminders.mockResolvedValue();

      // Execute
      await notificationController.processScheduledReminders(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.processScheduledReminders
      ).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Scheduled reminders processed successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('cancelScheduledReminders', () => {
    it('should cancel scheduled reminders successfully', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      mockNotificationService.cancelScheduledReminders.mockResolvedValue();

      // Execute
      await notificationController.cancelScheduledReminders(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.cancelScheduledReminders
      ).toHaveBeenCalledWith('booking-123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Scheduled reminders cancelled successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getGuestCommunicationWorkflow', () => {
    it('should get guest communication workflow successfully', async () => {
      // Setup
      mockRequest.params = { bookingId: 'booking-123' };
      const mockWorkflow = {
        bookingId: 'booking-123',
        workflowType: 'booking_confirmation',
        scheduledNotifications: [
          {
            id: 'schedule-1',
            type: 'check_in_reminder',
            scheduledAt: new Date(),
            status: 'pending',
            notificationId: null,
          },
        ],
      };

      mockNotificationService.getGuestCommunicationWorkflow.mockResolvedValue(
        mockWorkflow
      );

      // Execute
      await notificationController.getGuestCommunicationWorkflow(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.getGuestCommunicationWorkflow
      ).toHaveBeenCalledWith('booking-123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkflow,
        timestamp: expect.any(Date),
      });
    });
  });

  describe('updateGuestNotificationPreferences', () => {
    it('should update guest notification preferences successfully', async () => {
      // Setup
      mockRequest.params = { guestId: 'guest-123' };
      mockRequest.body = {
        email: true,
        sms: false,
        reminderDays: [7, 3, 1],
      };

      mockNotificationService.updateGuestNotificationPreferences.mockResolvedValue();

      // Execute
      await notificationController.updateGuestNotificationPreferences(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.updateGuestNotificationPreferences
      ).toHaveBeenCalledWith('guest-123', {
        email: true,
        sms: false,
        reminderDays: [7, 3, 1],
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Guest notification preferences updated successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getNotificationDeliveryReport', () => {
    it('should get notification delivery report successfully', async () => {
      // Setup
      mockRequest.params = { notificationId: 'notification-123' };
      const mockReport = {
        notificationId: 'notification-123',
        status: 'delivered',
        deliveredAt: '2024-01-15T10:00:00Z',
      };

      mockNotificationService.getNotificationDeliveryReport.mockResolvedValue(
        mockReport
      );

      // Execute
      await notificationController.getNotificationDeliveryReport(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(
        mockNotificationService.getNotificationDeliveryReport
      ).toHaveBeenCalledWith('notification-123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
        timestamp: expect.any(Date),
      });
    });
  });
});
