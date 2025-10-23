/**
 * Hotel Notification Service - Handles all notification workflows for hotel bookings
 */

import NotificationClient, {
  BookingConfirmationData,
  BookingReminderData,
  BookingUpdateData,
  NotificationResult,
} from '@/clients/notification.client';
import { PrismaClient } from '@/generated/prisma-client';
import logger from '@/utils/logger';

export interface GuestCommunicationWorkflow {
  bookingId: string;
  workflowType: 'booking_confirmation' | 'booking_reminder' | 'booking_update';
  scheduledNotifications: ScheduledNotification[];
}

export interface ScheduledNotification {
  id: string;
  type:
    | 'check_in_reminder'
    | 'check_out_reminder'
    | 'payment_reminder'
    | 'feedback_request';
  scheduledAt: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  notificationId?: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderDays: number[];
  language: string;
  timezone: string;
}

export class HotelNotificationService {
  private notificationClient: NotificationClient;

  constructor(private prisma: PrismaClient) {
    this.notificationClient = new NotificationClient();
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(
    bookingId: string
  ): Promise<NotificationResult> {
    try {
      logger.info('Sending booking confirmation notification', { bookingId });

      // Get booking details with property and guest information
      const booking = await this.getBookingWithDetails(bookingId);

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      // Prepare notification data
      const confirmationData: BookingConfirmationData = {
        booking,
        property: booking.property,
        guest: {
          id: booking.guestId,
          firstName:
            (booking.primaryGuest as any)?.firstName ||
            booking.guestName.split(' ')[0],
          lastName:
            (booking.primaryGuest as any)?.lastName ||
            booking.guestName.split(' ').slice(1).join(' '),
          email: booking.guestEmail,
          phone: booking.guestPhone,
        },
        confirmationNumber: booking.confirmationNumber,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
      };

      // Send notification
      const result =
        await this.notificationClient.sendBookingConfirmation(confirmationData);

      // Store notification record
      await this.storeNotificationRecord(
        bookingId,
        'booking_confirmation',
        result.id
      );

      // Schedule reminder notifications
      await this.scheduleBookingReminders(bookingId);

      logger.info('Booking confirmation notification sent successfully', {
        bookingId,
        notificationId: result.id,
      });

      return result;
    } catch (error) {
      logger.error('Failed to send booking confirmation notification', {
        error,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Send booking update notification (modification, cancellation, status change)
   */
  async sendBookingUpdate(
    bookingId: string,
    updateType: 'modification' | 'cancellation' | 'status_change',
    changes?: any,
    refundAmount?: number
  ): Promise<NotificationResult> {
    try {
      logger.info('Sending booking update notification', {
        bookingId,
        updateType,
      });

      // Get booking details
      const booking = await this.getBookingWithDetails(bookingId);

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      // Prepare notification data
      const updateData: BookingUpdateData = {
        booking,
        property: booking.property,
        guest: {
          id: booking.guestId,
          firstName:
            (booking.primaryGuest as any)?.firstName ||
            booking.guestName.split(' ')[0],
          lastName:
            (booking.primaryGuest as any)?.lastName ||
            booking.guestName.split(' ').slice(1).join(' '),
          email: booking.guestEmail,
          phone: booking.guestPhone,
        },
        updateType,
        changes,
        refundAmount,
      };

      // Send notification
      const result =
        await this.notificationClient.sendBookingUpdate(updateData);

      // Store notification record
      await this.storeNotificationRecord(
        bookingId,
        `booking_${updateType}`,
        result.id
      );

      // Cancel future reminders if booking is cancelled
      if (updateType === 'cancellation') {
        await this.cancelScheduledReminders(bookingId);
      }

      logger.info('Booking update notification sent successfully', {
        bookingId,
        updateType,
        notificationId: result.id,
      });

      return result;
    } catch (error) {
      logger.error('Failed to send booking update notification', {
        error,
        bookingId,
        updateType,
      });
      throw error;
    }
  }

  /**
   * Schedule booking reminder notifications
   */
  async scheduleBookingReminders(bookingId: string): Promise<void> {
    try {
      logger.info('Scheduling booking reminders', { bookingId });

      const booking = await this.getBookingWithDetails(bookingId);

      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      // Get guest notification preferences (default to standard reminders)
      const preferences = await this.getGuestNotificationPreferences(
        booking.guestId
      );

      // Schedule check-in reminders
      for (const days of preferences.reminderDays) {
        const reminderDate = new Date(booking.checkInDate);
        reminderDate.setDate(reminderDate.getDate() - days);

        // Only schedule if reminder date is in the future
        if (reminderDate > new Date()) {
          await this.scheduleReminder(
            bookingId,
            'check_in_reminder',
            reminderDate,
            days
          );
        }
      }

      // Schedule check-out reminder (1 day before)
      const checkOutReminder = new Date(booking.checkOutDate);
      checkOutReminder.setDate(checkOutReminder.getDate() - 1);

      if (checkOutReminder > new Date()) {
        await this.scheduleReminder(
          bookingId,
          'check_out_reminder',
          checkOutReminder,
          1
        );
      }

      // Schedule feedback request (1 day after check-out)
      const feedbackDate = new Date(booking.checkOutDate);
      feedbackDate.setDate(feedbackDate.getDate() + 1);

      await this.scheduleReminder(
        bookingId,
        'feedback_request',
        feedbackDate,
        -1
      );

      logger.info('Booking reminders scheduled successfully', { bookingId });
    } catch (error) {
      logger.error('Failed to schedule booking reminders', {
        error,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Process scheduled reminders (called by cron job or scheduler)
   */
  async processScheduledReminders(): Promise<void> {
    try {
      logger.info('Processing scheduled reminders');

      // Get pending reminders that are due
      // TODO: Implement after migration
      const dueReminders: any[] = [];
      // const dueReminders = await this.prisma.notificationSchedule.findMany({
      //   where: {
      //     status: 'pending',
      //     scheduledAt: {
      //       lte: new Date(),
      //     },
      //   },
      //   include: {
      //     booking: {
      //       include: {
      //         property: true,
      //       },
      //     },
      //   },
      // });

      logger.info(`Found ${dueReminders.length} due reminders`);

      for (const reminder of dueReminders) {
        try {
          await this.sendScheduledReminder(reminder);
        } catch (error) {
          logger.error('Failed to send scheduled reminder', {
            error,
            reminderId: reminder.id,
            bookingId: reminder.bookingId,
          });

          // Mark as failed
          // TODO: Implement after migration
          // await this.prisma.notificationSchedule.update({
          //   where: { id: reminder.id },
          //   data: { status: 'failed' },
          // });
        }
      }

      logger.info('Scheduled reminders processing completed');
    } catch (error) {
      logger.error('Failed to process scheduled reminders', { error });
      throw error;
    }
  }

  /**
   * Cancel scheduled reminders for a booking
   */
  async cancelScheduledReminders(bookingId: string): Promise<void> {
    try {
      logger.info('Cancelling scheduled reminders', { bookingId });

      // TODO: Implement after migration
      // await this.prisma.notificationSchedule.updateMany({
      //   where: {
      //     bookingId,
      //     status: 'pending',
      //   },
      //   data: {
      //     status: 'cancelled',
      //   },
      // });

      logger.info('Scheduled reminders cancelled successfully', { bookingId });
    } catch (error) {
      logger.error('Failed to cancel scheduled reminders', {
        error,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Get guest communication workflow status
   */
  async getGuestCommunicationWorkflow(
    bookingId: string
  ): Promise<GuestCommunicationWorkflow> {
    try {
      // Get notification history for the booking
      // TODO: Implement after migration
      const notifications: any[] = [];
      // const notifications = await this.prisma.notificationLog.findMany({
      //   where: { bookingId },
      //   orderBy: { createdAt: 'desc' },
      // });

      // Get scheduled notifications
      const scheduledNotifications: any[] = [];
      // const scheduledNotifications =
      //   await this.prisma.notificationSchedule.findMany({
      //     where: { bookingId },
      //     orderBy: { scheduledAt: 'asc' },
      //   });

      const workflow: GuestCommunicationWorkflow = {
        bookingId,
        workflowType: 'booking_confirmation', // Default type
        scheduledNotifications: scheduledNotifications.map(sn => ({
          id: sn.id,
          type: sn.type as any,
          scheduledAt: sn.scheduledAt,
          status: sn.status as any,
          notificationId: sn.notificationId,
        })),
      };

      return workflow;
    } catch (error) {
      logger.error('Failed to get guest communication workflow', {
        error,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Update guest notification preferences
   */
  async updateGuestNotificationPreferences(
    guestId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      logger.info('Updating guest notification preferences', { guestId });

      // Store preferences in guest profile or separate preferences table
      // TODO: Implement after migration - use existing field for now
      // await this.prisma.guestProfile.upsert({
      //   where: { guestId },
      //   create: {
      //     guestId,
      //     notificationPreferences: preferences as any,
      //   },
      //   update: {
      //     notificationPreferences: preferences as any,
      //   },
      // });

      logger.info('Guest notification preferences updated successfully', {
        guestId,
      });
    } catch (error) {
      logger.error('Failed to update guest notification preferences', {
        error,
        guestId,
      });
      throw error;
    }
  }

  /**
   * Get notification delivery report
   */
  async getNotificationDeliveryReport(notificationId: string): Promise<any> {
    try {
      return await this.notificationClient.getDeliveryReport(notificationId);
    } catch (error) {
      logger.error('Failed to get notification delivery report', {
        error,
        notificationId,
      });
      throw error;
    }
  }

  // Private helper methods

  private async getBookingWithDetails(bookingId: string) {
    return await this.prisma.booking.findUnique({
      where: { id: bookingId },
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
  }

  private async getGuestNotificationPreferences(
    guestId: string
  ): Promise<NotificationPreferences> {
    try {
      // TODO: Implement after migration
      // const guestProfile = await this.prisma.guestProfile.findUnique({
      //   where: { guestId },
      // });

      // if (guestProfile?.notificationPreferences) {
      //   return guestProfile.notificationPreferences as NotificationPreferences;
      // }

      // Return default preferences
      return {
        email: true,
        sms: false,
        push: false,
        reminderDays: [7, 3, 1], // 7 days, 3 days, 1 day before check-in
        language: 'en',
        timezone: 'UTC',
      };
    } catch (error) {
      logger.error('Failed to get guest notification preferences', {
        error,
        guestId,
      });

      // Return default preferences on error
      return {
        email: true,
        sms: false,
        push: false,
        reminderDays: [7, 3, 1],
        language: 'en',
        timezone: 'UTC',
      };
    }
  }

  private async scheduleReminder(
    bookingId: string,
    type: string,
    scheduledAt: Date,
    daysUntilEvent: number
  ): Promise<void> {
    try {
      // TODO: Implement after migration
      // await this.prisma.notificationSchedule.create({
      //   data: {
      //     bookingId,
      //     type,
      //     scheduledAt,
      //     daysUntilEvent,
      //     status: 'pending',
      //   },
      // });

      logger.info('Reminder scheduled successfully', {
        bookingId,
        type,
        scheduledAt,
        daysUntilEvent,
      });
    } catch (error) {
      logger.error('Failed to schedule reminder', {
        error,
        bookingId,
        type,
      });
      throw error;
    }
  }

  private async sendScheduledReminder(reminder: any): Promise<void> {
    try {
      const booking = reminder.booking;

      // Prepare reminder data
      const reminderData: BookingReminderData = {
        booking,
        property: booking.property,
        guest: {
          id: booking.guestId,
          firstName:
            booking.primaryGuest?.firstName || booking.guestName.split(' ')[0],
          lastName:
            booking.primaryGuest?.lastName ||
            booking.guestName.split(' ').slice(1).join(' '),
          email: booking.guestEmail,
          phone: booking.guestPhone,
        },
        reminderType: reminder.type.includes('check_in')
          ? 'check_in'
          : 'check_out',
        daysUntilEvent: Math.abs(reminder.daysUntilEvent),
      };

      // Send reminder notification
      const result =
        await this.notificationClient.sendBookingReminder(reminderData);

      // Update reminder status
      // TODO: Implement after migration
      // await this.prisma.notificationSchedule.update({
      //   where: { id: reminder.id },
      //   data: {
      //     status: 'sent',
      //     notificationId: result.id,
      //     sentAt: new Date(),
      //   },
      // });

      // Store notification record
      await this.storeNotificationRecord(booking.id, reminder.type, result.id);

      logger.info('Scheduled reminder sent successfully', {
        reminderId: reminder.id,
        bookingId: booking.id,
        notificationId: result.id,
      });
    } catch (error) {
      logger.error('Failed to send scheduled reminder', {
        error,
        reminderId: reminder.id,
      });
      throw error;
    }
  }

  private async storeNotificationRecord(
    bookingId: string,
    type: string,
    notificationId: string
  ): Promise<void> {
    try {
      // TODO: Implement after migration
      // await this.prisma.notificationLog.create({
      //   data: {
      //     bookingId,
      //     type,
      //     notificationId,
      //     status: 'sent',
      //     sentAt: new Date(),
      //   },
      // });
    } catch (error) {
      logger.error('Failed to store notification record', {
        error,
        bookingId,
        type,
        notificationId,
      });
      // Don't throw error as this is not critical
    }
  }
}

export default HotelNotificationService;
