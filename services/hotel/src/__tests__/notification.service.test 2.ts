/**
 * Hotel Notification Service Tests
 */

import NotificationClient from '@/clients/notification.client';
import { PrismaClient } from '@/generated/prisma-client';
import { HotelNotificationService } from '@/services/notification.service';
import { vi } from 'vitest';

// Mock the notification client
vi.mock('@/clients/notification.client');
const MockedNotificationClient = NotificationClient as any;

// Mock Prisma
const mockPrisma = {
  booking: {
    findUnique: vi.fn(),
  },
  notificationLog: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  notificationSchedule: {
    create: vi.fn(),
    findMany: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
  guestProfile: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  $transaction: vi.fn(),
} as unknown as PrismaClient;

describe('HotelNotificationService', () => {
  let notificationService: HotelNotificationService;
  let mockNotificationClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock notification client
    mockNotificationClient = {
      sendBookingConfirmation: vi.fn(),
      sendBookingUpdate: vi.fn(),
      sendBookingReminder: vi.fn(),
      getDeliveryReport: vi.fn(),
    } as any;

    MockedNotificationClient.mockImplementation(() => mockNotificationClient);

    notificationService = new HotelNotificationService(mockPrisma);
  });

  describe('sendBookingConfirmation', () => {
    const mockBooking = {
      id: 'booking-123',
      confirmationNumber: 'CONF-123',
      guestId: 'guest-123',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+1234567890',
      checkInDate: new Date('2024-01-15'),
      checkOutDate: new Date('2024-01-17'),
      totalAmount: 299.99,
      currency: 'USD',
      primaryGuest: {
        firstName: 'John',
        lastName: 'Doe',
      },
      property: {
        id: 'property-123',
        name: 'Test Hotel',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'hotel@example.com',
      },
    };

    it('should send booking confirmation notification successfully', async () => {
      // Setup mocks
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);
      mockNotificationClient.sendBookingConfirmation.mockResolvedValue({
        id: 'notification-123',
        status: 'sent',
        channels: ['email'],
      });
      mockPrisma.notificationLog.create = vi.fn().mockResolvedValue({});

      // Execute
      const result =
        await notificationService.sendBookingConfirmation('booking-123');

      // Verify
      expect(mockPrisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking-123' },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      expect(
        mockNotificationClient.sendBookingConfirmation
      ).toHaveBeenCalledWith({
        booking: mockBooking,
        property: mockBooking.property,
        guest: {
          id: 'guest-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        confirmationNumber: 'CONF-123',
        checkInDate: mockBooking.checkInDate,
        checkOutDate: mockBooking.checkOutDate,
        totalAmount: 299.99,
        currency: 'USD',
      });

      expect(result).toEqual({
        id: 'notification-123',
        status: 'sent',
        channels: ['email'],
      });
    });

    it('should throw error when booking not found', async () => {
      // Setup mocks
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(null);

      // Execute & Verify
      await expect(
        notificationService.sendBookingConfirmation('invalid-booking')
      ).rejects.toThrow('Booking not found: invalid-booking');
    });

    it('should handle notification client errors', async () => {
      // Setup mocks
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);
      mockNotificationClient.sendBookingConfirmation.mockRejectedValue(
        new Error('Notification service unavailable')
      );

      // Execute & Verify
      await expect(
        notificationService.sendBookingConfirmation('booking-123')
      ).rejects.toThrow('Notification service unavailable');
    });
  });

  describe('sendBookingUpdate', () => {
    const mockBooking = {
      id: 'booking-123',
      confirmationNumber: 'CONF-123',
      guestId: 'guest-123',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+1234567890',
      primaryGuest: {
        firstName: 'John',
        lastName: 'Doe',
      },
      property: {
        id: 'property-123',
        name: 'Test Hotel',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'hotel@example.com',
      },
    };

    it('should send booking update notification successfully', async () => {
      // Setup mocks
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);
      mockNotificationClient.sendBookingUpdate.mockResolvedValue({
        id: 'notification-456',
        status: 'sent',
        channels: ['email'],
      });
      mockPrisma.notificationLog.create = vi.fn().mockResolvedValue({});

      // Execute
      const result = await notificationService.sendBookingUpdate(
        'booking-123',
        'modification',
        { checkInDate: '2024-01-16' },
        0
      );

      // Verify
      expect(mockNotificationClient.sendBookingUpdate).toHaveBeenCalledWith({
        booking: mockBooking,
        property: mockBooking.property,
        guest: {
          id: 'guest-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        updateType: 'modification',
        changes: { checkInDate: '2024-01-16' },
        refundAmount: 0,
      });

      expect(result).toEqual({
        id: 'notification-456',
        status: 'sent',
        channels: ['email'],
      });
    });

    it('should cancel scheduled reminders for cancellation updates', async () => {
      // Setup mocks
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);
      mockNotificationClient.sendBookingUpdate.mockResolvedValue({
        id: 'notification-456',
        status: 'sent',
        channels: ['email'],
      });
      mockPrisma.notificationLog.create = vi.fn().mockResolvedValue({});
      mockPrisma.notificationSchedule.updateMany = vi
        .fn()
        .mockResolvedValue({ count: 2 });

      // Execute
      await notificationService.sendBookingUpdate(
        'booking-123',
        'cancellation',
        { reason: 'Guest requested' },
        150.0
      );

      // Verify
      expect(mockPrisma.notificationSchedule.updateMany).toHaveBeenCalledWith({
        where: {
          bookingId: 'booking-123',
          status: 'pending',
        },
        data: {
          status: 'cancelled',
        },
      });
    });
  });

  describe('scheduleBookingReminders', () => {
    const mockBooking = {
      id: 'booking-123',
      guestId: 'guest-123',
      checkInDate: new Date('2024-01-15'),
      checkOutDate: new Date('2024-01-17'),
      property: {
        id: 'property-123',
        name: 'Test Hotel',
      },
    };

    const mockPreferences = {
      email: true,
      sms: false,
      push: false,
      reminderDays: [7, 3, 1],
      language: 'en',
      timezone: 'UTC',
    };

    it('should schedule booking reminders successfully', async () => {
      // Setup mocks
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10); // 10 days from now

      const mockBookingWithFutureDate = {
        ...mockBooking,
        checkInDate: futureDate,
        checkOutDate: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      };

      mockPrisma.booking.findUnique = vi
        .fn()
        .mockResolvedValue(mockBookingWithFutureDate);
      mockPrisma.guestProfile.findUnique = vi.fn().mockResolvedValue({
        notificationPreferences: mockPreferences,
      });
      mockPrisma.notificationSchedule.create = vi.fn().mockResolvedValue({});

      // Execute
      await notificationService.scheduleBookingReminders('booking-123');

      // Verify that reminders were scheduled
      expect(mockPrisma.notificationSchedule.create).toHaveBeenCalledTimes(4); // 3 check-in + 1 check-out + 1 feedback
    });

    it('should use default preferences when guest profile not found', async () => {
      // Setup mocks
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const mockBookingWithFutureDate = {
        ...mockBooking,
        checkInDate: futureDate,
        checkOutDate: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      };

      mockPrisma.booking.findUnique = vi
        .fn()
        .mockResolvedValue(mockBookingWithFutureDate);
      mockPrisma.guestProfile.findUnique = vi.fn().mockResolvedValue(null);
      mockPrisma.notificationSchedule.create = vi.fn().mockResolvedValue({});

      // Execute
      await notificationService.scheduleBookingReminders('booking-123');

      // Verify that default preferences were used
      expect(mockPrisma.notificationSchedule.create).toHaveBeenCalled();
    });
  });

  describe('processScheduledReminders', () => {
    const mockReminder = {
      id: 'reminder-123',
      bookingId: 'booking-123',
      type: 'check_in_reminder',
      daysUntilEvent: 3,
      booking: {
        id: 'booking-123',
        guestId: 'guest-123',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-17'),
        confirmationNumber: 'CONF-123',
        primaryGuest: {
          firstName: 'John',
          lastName: 'Doe',
        },
        property: {
          id: 'property-123',
          name: 'Test Hotel',
          address: '123 Test St',
          phone: '+1234567890',
        },
      },
    };

    it('should process scheduled reminders successfully', async () => {
      // Setup mocks
      mockPrisma.notificationSchedule.findMany = vi
        .fn()
        .mockResolvedValue([mockReminder]);
      mockNotificationClient.sendBookingReminder.mockResolvedValue({
        id: 'notification-789',
        status: 'sent',
        channels: ['email'],
      });
      mockPrisma.notificationSchedule.update = vi.fn().mockResolvedValue({});
      mockPrisma.notificationLog.create = vi.fn().mockResolvedValue({});

      // Execute
      await notificationService.processScheduledReminders();

      // Verify
      expect(mockPrisma.notificationSchedule.findMany).toHaveBeenCalledWith({
        where: {
          status: 'pending',
          scheduledAt: {
            lte: expect.any(Date),
          },
        },
        include: {
          booking: {
            include: {
              property: true,
            },
          },
        },
      });

      expect(mockNotificationClient.sendBookingReminder).toHaveBeenCalledWith({
        booking: mockReminder.booking,
        property: mockReminder.booking.property,
        guest: {
          id: 'guest-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        reminderType: 'check_in',
        daysUntilEvent: 3,
      });

      expect(mockPrisma.notificationSchedule.update).toHaveBeenCalledWith({
        where: { id: 'reminder-123' },
        data: {
          status: 'sent',
          notificationId: 'notification-789',
          sentAt: expect.any(Date),
        },
      });
    });

    it('should handle failed reminders gracefully', async () => {
      // Setup mocks
      mockPrisma.notificationSchedule.findMany = vi
        .fn()
        .mockResolvedValue([mockReminder]);
      mockNotificationClient.sendBookingReminder.mockRejectedValue(
        new Error('Notification service error')
      );
      mockPrisma.notificationSchedule.update = vi.fn().mockResolvedValue({});

      // Execute
      await notificationService.processScheduledReminders();

      // Verify that failed reminder was marked as failed
      expect(mockPrisma.notificationSchedule.update).toHaveBeenCalledWith({
        where: { id: 'reminder-123' },
        data: { status: 'failed' },
      });
    });
  });

  describe('getGuestCommunicationWorkflow', () => {
    it('should return guest communication workflow', async () => {
      // Setup mocks
      const mockNotificationLogs = [
        {
          id: 'log-1',
          type: 'booking_confirmation',
          notificationId: 'notif-1',
          status: 'sent',
          createdAt: new Date(),
        },
      ];

      const mockScheduledNotifications = [
        {
          id: 'schedule-1',
          type: 'check_in_reminder',
          scheduledAt: new Date(),
          status: 'pending',
          notificationId: null,
        },
      ];

      mockPrisma.notificationLog.findMany = vi
        .fn()
        .mockResolvedValue(mockNotificationLogs);
      mockPrisma.notificationSchedule.findMany = vi
        .fn()
        .mockResolvedValue(mockScheduledNotifications);

      // Execute
      const result =
        await notificationService.getGuestCommunicationWorkflow('booking-123');

      // Verify
      expect(result).toEqual({
        bookingId: 'booking-123',
        workflowType: 'booking_confirmation',
        scheduledNotifications: [
          {
            id: 'schedule-1',
            type: 'check_in_reminder',
            scheduledAt: expect.any(Date),
            status: 'pending',
            notificationId: null,
          },
        ],
      });
    });
  });

  describe('updateGuestNotificationPreferences', () => {
    it('should update guest notification preferences', async () => {
      // Setup mocks
      const preferences = {
        email: true,
        sms: true,
        reminderDays: [7, 1],
      };

      mockPrisma.guestProfile.upsert = vi.fn().mockResolvedValue({});

      // Execute
      await notificationService.updateGuestNotificationPreferences(
        'guest-123',
        preferences
      );

      // Verify
      expect(mockPrisma.guestProfile.upsert).toHaveBeenCalledWith({
        where: { guestId: 'guest-123' },
        create: {
          guestId: 'guest-123',
          notificationPreferences: preferences,
        },
        update: {
          notificationPreferences: preferences,
        },
      });
    });
  });
});
