/**
 * Notification Client Tests
 */

import NotificationClient, {
  BookingConfirmationData,
  BookingReminderData,
  BookingUpdateData,
} from '@/clients/notification.client';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
  },
}));
const mockedAxios = axios as any;

describe('NotificationClient', () => {
  let notificationClient: NotificationClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock axios instance
    mockAxiosInstance = {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);

    notificationClient = new NotificationClient();
  });

  describe('sendBookingConfirmation', () => {
    const mockConfirmationData: BookingConfirmationData = {
      booking: {
        id: 'booking-123',
        confirmationNumber: 'CONF-123',
      },
      property: {
        id: 'property-123',
        name: 'Test Hotel',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'hotel@example.com',
      },
      guest: {
        id: 'guest-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      confirmationNumber: 'CONF-123',
      checkInDate: new Date('2024-01-15'),
      checkOutDate: new Date('2024-01-17'),
      totalAmount: 299.99,
      currency: 'USD',
    };

    it('should send booking confirmation notification successfully', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          data: {
            id: 'notification-123',
            status: 'sent',
            channels: ['email'],
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Execute
      const result =
        await notificationClient.sendBookingConfirmation(mockConfirmationData);

      // Verify
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/notifications',
        expect.objectContaining({
          email: 'john@example.com',
          userId: 'guest-123',
          templateId: 'booking_confirmation',
          subject: 'Booking Confirmation - CONF-123',
          content: expect.objectContaining({
            subject: 'Booking Confirmation - CONF-123',
            htmlBody: expect.stringContaining('Booking Confirmation'),
            textBody: expect.stringContaining('Booking Confirmation'),
          }),
          variables: expect.objectContaining({
            guestName: 'John Doe',
            confirmationNumber: 'CONF-123',
            propertyName: 'Test Hotel',
          }),
          channels: ['email'],
          priority: 'high',
          category: 'transactional',
          trackingEnabled: true,
          metadata: expect.objectContaining({
            bookingId: 'booking-123',
            propertyId: 'property-123',
            confirmationNumber: 'CONF-123',
            notificationType: 'booking_confirmation',
          }),
          tags: ['booking', 'confirmation', 'hotel'],
          fromService: 'hotel-service',
        })
      );

      expect(result).toEqual({
        id: 'notification-123',
        status: 'sent',
        channels: ['email'],
      });
    });

    it('should handle API errors gracefully', async () => {
      // Setup mock error
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      // Execute & Verify
      await expect(
        notificationClient.sendBookingConfirmation(mockConfirmationData)
      ).rejects.toThrow('Failed to send booking confirmation notification');
    });
  });

  describe('sendBookingReminder', () => {
    const mockReminderData: BookingReminderData = {
      booking: {
        id: 'booking-123',
        confirmationNumber: 'CONF-123',
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-17'),
      },
      property: {
        id: 'property-123',
        name: 'Test Hotel',
        address: '123 Test St',
        phone: '+1234567890',
      },
      guest: {
        id: 'guest-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      reminderType: 'check_in',
      daysUntilEvent: 3,
    };

    it('should send booking reminder notification successfully', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          data: {
            id: 'notification-456',
            status: 'sent',
            channels: ['email'],
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Execute
      const result =
        await notificationClient.sendBookingReminder(mockReminderData);

      // Verify
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/notifications',
        expect.objectContaining({
          email: 'john@example.com',
          userId: 'guest-123',
          templateId: 'booking_reminder_check_in',
          subject: 'Check-in Reminder - 3 days until your stay at Test Hotel',
          content: expect.objectContaining({
            subject: 'Check-in Reminder - 3 days until your stay at Test Hotel',
            htmlBody: expect.stringContaining('Booking Reminder'),
            textBody: expect.stringContaining('Booking Reminder'),
          }),
          variables: expect.objectContaining({
            guestName: 'John Doe',
            propertyName: 'Test Hotel',
            reminderType: 'check_in',
            daysUntilEvent: 3,
          }),
          channels: ['email'],
          priority: 'normal',
          category: 'transactional',
          metadata: expect.objectContaining({
            bookingId: 'booking-123',
            propertyId: 'property-123',
            reminderType: 'check_in',
            notificationType: 'booking_reminder',
          }),
          tags: ['booking', 'reminder', 'hotel'],
          fromService: 'hotel-service',
        })
      );

      expect(result).toEqual({
        id: 'notification-456',
        status: 'sent',
        channels: ['email'],
      });
    });
  });

  describe('sendBookingUpdate', () => {
    const mockUpdateData: BookingUpdateData = {
      booking: {
        id: 'booking-123',
        confirmationNumber: 'CONF-123',
        currency: 'USD',
      },
      property: {
        id: 'property-123',
        name: 'Test Hotel',
        address: '123 Test St',
        phone: '+1234567890',
        email: 'hotel@example.com',
      },
      guest: {
        id: 'guest-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      updateType: 'cancellation',
      changes: { reason: 'Guest requested' },
      refundAmount: 150.0,
    };

    it('should send booking update notification successfully', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          data: {
            id: 'notification-789',
            status: 'sent',
            channels: ['email'],
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Execute
      const result = await notificationClient.sendBookingUpdate(mockUpdateData);

      // Verify
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/notifications',
        expect.objectContaining({
          email: 'john@example.com',
          userId: 'guest-123',
          templateId: 'booking_cancellation',
          subject: 'Booking Cancelled - CONF-123',
          content: expect.objectContaining({
            subject: 'Booking Cancelled - CONF-123',
            htmlBody: expect.stringContaining('Booking Update'),
            textBody: expect.stringContaining('Booking Update'),
          }),
          variables: expect.objectContaining({
            guestName: 'John Doe',
            propertyName: 'Test Hotel',
            updateType: 'cancellation',
            confirmationNumber: 'CONF-123',
            changes: { reason: 'Guest requested' },
            refundAmount: 150.0,
          }),
          channels: ['email'],
          priority: 'high',
          category: 'transactional',
          metadata: expect.objectContaining({
            bookingId: 'booking-123',
            propertyId: 'property-123',
            updateType: 'cancellation',
            notificationType: 'booking_update',
          }),
          tags: ['booking', 'update', 'hotel'],
          fromService: 'hotel-service',
        })
      );

      expect(result).toEqual({
        id: 'notification-789',
        status: 'sent',
        channels: ['email'],
      });
    });
  });

  describe('sendEmail', () => {
    const mockEmailRequest = {
      to: 'test@example.com',
      subject: 'Test Email',
      htmlBody: '<p>Test content</p>',
      textBody: 'Test content',
    };

    it('should send email notification successfully', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          data: {
            messageId: 'email-123',
            status: 'sent',
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      // Execute
      const result = await notificationClient.sendEmail(mockEmailRequest);

      // Verify
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/notifications/email',
        mockEmailRequest
      );

      expect(result).toEqual({
        messageId: 'email-123',
        status: 'sent',
      });
    });
  });

  describe('getNotificationStatus', () => {
    it('should get notification status successfully', async () => {
      // Setup mock response
      const mockResponse = {
        data: {
          data: 'delivered',
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Execute
      const result =
        await notificationClient.getNotificationStatus('notification-123');

      // Verify
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/notifications/notification-123/status'
      );

      expect(result).toBe('delivered');
    });
  });

  describe('getDeliveryReport', () => {
    it('should get delivery report successfully', async () => {
      // Setup mock response
      const mockReport = {
        notificationId: 'notification-123',
        status: 'delivered',
        deliveredAt: '2024-01-15T10:00:00Z',
      };

      const mockResponse = {
        data: {
          data: mockReport,
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Execute
      const result =
        await notificationClient.getDeliveryReport('notification-123');

      // Verify
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/notifications/notification-123/delivery-report'
      );

      expect(result).toEqual(mockReport);
    });
  });
});
