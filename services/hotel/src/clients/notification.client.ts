/**
 * Notification Service Client - Handles communication with notification service
 */

import config from '@/config';
import logger from '@/utils/logger';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Import notification types
export interface NotificationChannel {
  EMAIL: 'email';
  SMS: 'sms';
  PUSH: 'push';
  IN_APP: 'in_app';
}

export interface NotificationPriority {
  LOW: 'low';
  NORMAL: 'normal';
  HIGH: 'high';
  URGENT: 'urgent';
}

export interface NotificationCategory {
  TRANSACTIONAL: 'transactional';
  MARKETING: 'marketing';
  SYSTEM: 'system';
}

export interface NotificationContent {
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  smsBody?: string;
  pushTitle?: string;
  pushBody?: string;
  inAppTitle?: string;
  inAppBody?: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationRequest {
  userId?: string;
  email?: string;
  phone?: string;
  deviceTokens?: string[];
  templateId?: string;
  subject?: string;
  content: NotificationContent;
  variables?: Record<string, any>;
  channels: string[];
  priority: string;
  category: string;
  sendAt?: Date;
  timezone?: string;
  trackingEnabled?: boolean;
  metadata?: Record<string, any>;
  tags?: string[];
  fromService: string;
  fromUserId?: string;
}

export interface NotificationResult {
  id: string;
  status: string;
  channels: string[];
  scheduledAt?: Date;
  estimatedDelivery?: Date;
  errors?: any[];
}

export interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  attachments?: any[];
  templateId?: string;
  variables?: Record<string, any>;
  trackingEnabled?: boolean;
  priority?: string;
  metadata?: Record<string, any>;
}

export interface BookingConfirmationData {
  booking: any;
  property: any;
  guest: any;
  confirmationNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  currency: string;
}

export interface BookingReminderData {
  booking: any;
  property: any;
  guest: any;
  reminderType: 'check_in' | 'check_out' | 'payment_due';
  daysUntilEvent: number;
}

export interface BookingUpdateData {
  booking: any;
  property: any;
  guest: any;
  updateType: 'modification' | 'cancellation' | 'status_change';
  changes?: any;
  refundAmount?: number;
}

export class NotificationClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      config.services?.notification?.url || 'http://localhost:3004';

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'hotel-service/1.0.0',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        logger.info('Notification service request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      error => {
        logger.error('Notification service request error', { error });
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.info('Notification service response', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      error => {
        logger.error('Notification service response error', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(
    data: BookingConfirmationData
  ): Promise<NotificationResult> {
    try {
      logger.info('Sending booking confirmation notification', {
        bookingId: data.booking.id,
        guestEmail: data.guest.email,
        confirmationNumber: data.confirmationNumber,
      });

      const notificationRequest: NotificationRequest = {
        email: data.guest.email,
        userId: data.guest.id,
        templateId: 'booking_confirmation',
        subject: `Booking Confirmation - ${data.confirmationNumber}`,
        content: {
          subject: `Booking Confirmation - ${data.confirmationNumber}`,
          htmlBody: this.generateBookingConfirmationHtml(data),
          textBody: this.generateBookingConfirmationText(data),
        },
        variables: {
          guestName: `${data.guest.firstName} ${data.guest.lastName}`,
          confirmationNumber: data.confirmationNumber,
          propertyName: data.property.name,
          checkInDate: data.checkInDate.toLocaleDateString(),
          checkOutDate: data.checkOutDate.toLocaleDateString(),
          totalAmount: data.totalAmount,
          currency: data.currency,
          propertyAddress: data.property.address,
          propertyPhone: data.property.phone,
          propertyEmail: data.property.email,
          bookingDetails: data.booking,
        },
        channels: ['email'],
        priority: 'high',
        category: 'transactional',
        trackingEnabled: true,
        metadata: {
          bookingId: data.booking.id,
          propertyId: data.property.id,
          confirmationNumber: data.confirmationNumber,
          notificationType: 'booking_confirmation',
        },
        tags: ['booking', 'confirmation', 'hotel'],
        fromService: 'hotel-service',
      };

      const response = await this.client.post(
        '/api/v1/notifications',
        notificationRequest
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to send booking confirmation notification', {
        error,
        bookingId: data.booking.id,
      });
      throw new Error('Failed to send booking confirmation notification');
    }
  }

  /**
   * Send booking reminder notification
   */
  async sendBookingReminder(
    data: BookingReminderData
  ): Promise<NotificationResult> {
    try {
      logger.info('Sending booking reminder notification', {
        bookingId: data.booking.id,
        reminderType: data.reminderType,
        daysUntilEvent: data.daysUntilEvent,
      });

      const subject = this.getReminderSubject(
        data.reminderType,
        data.daysUntilEvent,
        data.property.name
      );

      const notificationRequest: NotificationRequest = {
        email: data.guest.email,
        userId: data.guest.id,
        templateId: `booking_reminder_${data.reminderType}`,
        subject,
        content: {
          subject,
          htmlBody: this.generateBookingReminderHtml(data),
          textBody: this.generateBookingReminderText(data),
        },
        variables: {
          guestName: `${data.guest.firstName} ${data.guest.lastName}`,
          propertyName: data.property.name,
          reminderType: data.reminderType,
          daysUntilEvent: data.daysUntilEvent,
          eventDate:
            data.reminderType === 'check_in'
              ? data.booking.checkInDate
              : data.booking.checkOutDate,
          confirmationNumber: data.booking.confirmationNumber,
          propertyAddress: data.property.address,
          propertyPhone: data.property.phone,
        },
        channels: ['email'],
        priority: 'normal',
        category: 'transactional',
        trackingEnabled: true,
        metadata: {
          bookingId: data.booking.id,
          propertyId: data.property.id,
          reminderType: data.reminderType,
          notificationType: 'booking_reminder',
        },
        tags: ['booking', 'reminder', 'hotel'],
        fromService: 'hotel-service',
      };

      const response = await this.client.post(
        '/api/v1/notifications',
        notificationRequest
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to send booking reminder notification', {
        error,
        bookingId: data.booking.id,
        reminderType: data.reminderType,
      });
      throw new Error('Failed to send booking reminder notification');
    }
  }

  /**
   * Send booking update notification
   */
  async sendBookingUpdate(
    data: BookingUpdateData
  ): Promise<NotificationResult> {
    try {
      logger.info('Sending booking update notification', {
        bookingId: data.booking.id,
        updateType: data.updateType,
      });

      const subject = this.getUpdateSubject(
        data.updateType,
        data.booking.confirmationNumber
      );

      const notificationRequest: NotificationRequest = {
        email: data.guest.email,
        userId: data.guest.id,
        templateId: `booking_${data.updateType}`,
        subject,
        content: {
          subject,
          htmlBody: this.generateBookingUpdateHtml(data),
          textBody: this.generateBookingUpdateText(data),
        },
        variables: {
          guestName: `${data.guest.firstName} ${data.guest.lastName}`,
          propertyName: data.property.name,
          updateType: data.updateType,
          confirmationNumber: data.booking.confirmationNumber,
          changes: data.changes,
          refundAmount: data.refundAmount,
          propertyAddress: data.property.address,
          propertyPhone: data.property.phone,
          propertyEmail: data.property.email,
        },
        channels: ['email'],
        priority: 'high',
        category: 'transactional',
        trackingEnabled: true,
        metadata: {
          bookingId: data.booking.id,
          propertyId: data.property.id,
          updateType: data.updateType,
          notificationType: 'booking_update',
        },
        tags: ['booking', 'update', 'hotel'],
        fromService: 'hotel-service',
      };

      const response = await this.client.post(
        '/api/v1/notifications',
        notificationRequest
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to send booking update notification', {
        error,
        bookingId: data.booking.id,
        updateType: data.updateType,
      });
      throw new Error('Failed to send booking update notification');
    }
  }

  /**
   * Send generic email notification
   */
  async sendEmail(emailRequest: EmailRequest): Promise<any> {
    try {
      logger.info('Sending email notification', {
        to: emailRequest.to,
        subject: emailRequest.subject,
      });

      const response = await this.client.post(
        '/api/v1/notifications/email',
        emailRequest
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to send email notification', {
        error,
        to: emailRequest.to,
      });
      throw new Error('Failed to send email notification');
    }
  }

  /**
   * Get notification status
   */
  async getNotificationStatus(notificationId: string): Promise<string> {
    try {
      const response = await this.client.get(
        `/api/v1/notifications/${notificationId}/status`
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get notification status', {
        error,
        notificationId,
      });
      throw new Error('Failed to get notification status');
    }
  }

  /**
   * Get delivery report
   */
  async getDeliveryReport(notificationId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/v1/notifications/${notificationId}/delivery-report`
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get delivery report', {
        error,
        notificationId,
      });
      throw new Error('Failed to get delivery report');
    }
  }

  // Private helper methods for generating content

  private generateBookingConfirmationHtml(
    data: BookingConfirmationData
  ): string {
    return `
      <html>
        <body>
          <h2>Booking Confirmation</h2>
          <p>Dear ${data.guest.firstName} ${data.guest.lastName},</p>
          <p>Thank you for your booking! Your reservation has been confirmed.</p>
          
          <h3>Booking Details</h3>
          <ul>
            <li><strong>Confirmation Number:</strong> ${data.confirmationNumber}</li>
            <li><strong>Property:</strong> ${data.property.name}</li>
            <li><strong>Check-in:</strong> ${data.checkInDate.toLocaleDateString()}</li>
            <li><strong>Check-out:</strong> ${data.checkOutDate.toLocaleDateString()}</li>
            <li><strong>Total Amount:</strong> ${data.currency} ${data.totalAmount}</li>
          </ul>
          
          <h3>Property Information</h3>
          <p><strong>Address:</strong> ${data.property.address}</p>
          <p><strong>Phone:</strong> ${data.property.phone}</p>
          <p><strong>Email:</strong> ${data.property.email}</p>
          
          <p>We look forward to welcoming you!</p>
        </body>
      </html>
    `;
  }

  private generateBookingConfirmationText(
    data: BookingConfirmationData
  ): string {
    return `
Booking Confirmation

Dear ${data.guest.firstName} ${data.guest.lastName},

Thank you for your booking! Your reservation has been confirmed.

Booking Details:
- Confirmation Number: ${data.confirmationNumber}
- Property: ${data.property.name}
- Check-in: ${data.checkInDate.toLocaleDateString()}
- Check-out: ${data.checkOutDate.toLocaleDateString()}
- Total Amount: ${data.currency} ${data.totalAmount}

Property Information:
Address: ${data.property.address}
Phone: ${data.property.phone}
Email: ${data.property.email}

We look forward to welcoming you!
    `;
  }

  private generateBookingReminderHtml(data: BookingReminderData): string {
    const eventType =
      data.reminderType === 'check_in' ? 'check-in' : 'check-out';
    const eventDate =
      data.reminderType === 'check_in'
        ? data.booking.checkInDate
        : data.booking.checkOutDate;

    return `
      <html>
        <body>
          <h2>Booking Reminder</h2>
          <p>Dear ${data.guest.firstName} ${data.guest.lastName},</p>
          <p>This is a friendly reminder about your upcoming ${eventType} at ${data.property.name}.</p>
          
          <h3>Booking Details</h3>
          <ul>
            <li><strong>Confirmation Number:</strong> ${data.booking.confirmationNumber}</li>
            <li><strong>Property:</strong> ${data.property.name}</li>
            <li><strong>${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Date:</strong> ${new Date(eventDate).toLocaleDateString()}</li>
            <li><strong>Days Until ${eventType}:</strong> ${data.daysUntilEvent}</li>
          </ul>
          
          <p><strong>Property Address:</strong> ${data.property.address}</p>
          <p><strong>Property Phone:</strong> ${data.property.phone}</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </body>
      </html>
    `;
  }

  private generateBookingReminderText(data: BookingReminderData): string {
    const eventType =
      data.reminderType === 'check_in' ? 'check-in' : 'check-out';
    const eventDate =
      data.reminderType === 'check_in'
        ? data.booking.checkInDate
        : data.booking.checkOutDate;

    return `
Booking Reminder

Dear ${data.guest.firstName} ${data.guest.lastName},

This is a friendly reminder about your upcoming ${eventType} at ${data.property.name}.

Booking Details:
- Confirmation Number: ${data.booking.confirmationNumber}
- Property: ${data.property.name}
- ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Date: ${new Date(eventDate).toLocaleDateString()}
- Days Until ${eventType}: ${data.daysUntilEvent}

Property Address: ${data.property.address}
Property Phone: ${data.property.phone}

If you have any questions, please don't hesitate to contact us.
    `;
  }

  private generateBookingUpdateHtml(data: BookingUpdateData): string {
    let updateMessage = '';

    switch (data.updateType) {
      case 'modification':
        updateMessage = 'Your booking has been successfully modified.';
        break;
      case 'cancellation':
        updateMessage = 'Your booking has been cancelled.';
        break;
      case 'status_change':
        updateMessage = 'Your booking status has been updated.';
        break;
    }

    return `
      <html>
        <body>
          <h2>Booking Update</h2>
          <p>Dear ${data.guest.firstName} ${data.guest.lastName},</p>
          <p>${updateMessage}</p>
          
          <h3>Booking Details</h3>
          <ul>
            <li><strong>Confirmation Number:</strong> ${data.booking.confirmationNumber}</li>
            <li><strong>Property:</strong> ${data.property.name}</li>
            <li><strong>Update Type:</strong> ${data.updateType}</li>
          </ul>
          
          ${data.refundAmount ? `<p><strong>Refund Amount:</strong> ${data.booking.currency} ${data.refundAmount}</p>` : ''}
          
          <p><strong>Property Contact:</strong></p>
          <p>Address: ${data.property.address}</p>
          <p>Phone: ${data.property.phone}</p>
          <p>Email: ${data.property.email}</p>
          
          <p>If you have any questions, please contact us.</p>
        </body>
      </html>
    `;
  }

  private generateBookingUpdateText(data: BookingUpdateData): string {
    let updateMessage = '';

    switch (data.updateType) {
      case 'modification':
        updateMessage = 'Your booking has been successfully modified.';
        break;
      case 'cancellation':
        updateMessage = 'Your booking has been cancelled.';
        break;
      case 'status_change':
        updateMessage = 'Your booking status has been updated.';
        break;
    }

    return `
Booking Update

Dear ${data.guest.firstName} ${data.guest.lastName},

${updateMessage}

Booking Details:
- Confirmation Number: ${data.booking.confirmationNumber}
- Property: ${data.property.name}
- Update Type: ${data.updateType}

${data.refundAmount ? `Refund Amount: ${data.booking.currency} ${data.refundAmount}` : ''}

Property Contact:
Address: ${data.property.address}
Phone: ${data.property.phone}
Email: ${data.property.email}

If you have any questions, please contact us.
    `;
  }

  private getReminderSubject(
    reminderType: string,
    daysUntilEvent: number,
    propertyName: string
  ): string {
    const eventType = reminderType === 'check_in' ? 'Check-in' : 'Check-out';
    return `${eventType} Reminder - ${daysUntilEvent} days until your stay at ${propertyName}`;
  }

  private getUpdateSubject(
    updateType: string,
    confirmationNumber: string
  ): string {
    switch (updateType) {
      case 'modification':
        return `Booking Modified - ${confirmationNumber}`;
      case 'cancellation':
        return `Booking Cancelled - ${confirmationNumber}`;
      case 'status_change':
        return `Booking Status Update - ${confirmationNumber}`;
      default:
        return `Booking Update - ${confirmationNumber}`;
    }
  }
}

export default NotificationClient;
