/**
 * Notification Controller - Handles notification-related operations for hotel bookings
 */

import { PrismaClient } from '@/generated/prisma-client';
import { HotelNotificationService } from '@/services/notification.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';

export class NotificationController {
  private notificationService: HotelNotificationService;

  constructor(prisma: PrismaClient) {
    this.notificationService = new HotelNotificationService(prisma);
  }

  /**
   * Send booking confirmation notification
   * POST /api/notifications/booking-confirmation/{bookingId}
   */
  async sendBookingConfirmation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const result =
        await this.notificationService.sendBookingConfirmation(bookingId);

      res.json({
        success: true,
        data: result,
        message: 'Booking confirmation notification sent successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send booking update notification
   * POST /api/notifications/booking-update/{bookingId}
   */
  async sendBookingUpdate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const { updateType, changes, refundAmount } = req.body;

      const result = await this.notificationService.sendBookingUpdate(
        bookingId,
        updateType,
        changes,
        refundAmount
      );

      res.json({
        success: true,
        data: result,
        message: 'Booking update notification sent successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Schedule booking reminders
   * POST /api/notifications/schedule-reminders/{bookingId}
   */
  async scheduleBookingReminders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      await this.notificationService.scheduleBookingReminders(bookingId);

      res.json({
        success: true,
        message: 'Booking reminders scheduled successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process scheduled reminders (for cron job)
   * POST /api/notifications/process-scheduled-reminders
   */
  async processScheduledReminders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.notificationService.processScheduledReminders();

      res.json({
        success: true,
        message: 'Scheduled reminders processed successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel scheduled reminders
   * DELETE /api/notifications/scheduled-reminders/{bookingId}
   */
  async cancelScheduledReminders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      await this.notificationService.cancelScheduledReminders(bookingId);

      res.json({
        success: true,
        message: 'Scheduled reminders cancelled successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get guest communication workflow
   * GET /api/notifications/workflow/{bookingId}
   */
  async getGuestCommunicationWorkflow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const workflow =
        await this.notificationService.getGuestCommunicationWorkflow(bookingId);

      res.json({
        success: true,
        data: workflow,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update guest notification preferences
   * PUT /api/notifications/preferences/{guestId}
   */
  async updateGuestNotificationPreferences(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { guestId } = req.params;
      const preferences = req.body;

      await this.notificationService.updateGuestNotificationPreferences(
        guestId,
        preferences
      );

      res.json({
        success: true,
        message: 'Guest notification preferences updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get notification delivery report
   * GET /api/notifications/delivery-report/{notificationId}
   */
  async getNotificationDeliveryReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { notificationId } = req.params;
      const report =
        await this.notificationService.getNotificationDeliveryReport(
          notificationId
        );

      res.json({
        success: true,
        data: report,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const notificationValidation = {
  sendBookingConfirmation: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  sendBookingUpdate: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
    body('updateType')
      .isIn(['modification', 'cancellation', 'status_change'])
      .withMessage('Valid update type is required'),
    body('changes')
      .optional()
      .isObject()
      .withMessage('Changes must be an object'),
    body('refundAmount')
      .optional()
      .isNumeric()
      .withMessage('Refund amount must be a number'),
  ],

  scheduleBookingReminders: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  cancelScheduledReminders: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  getGuestCommunicationWorkflow: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  updateGuestNotificationPreferences: [
    param('guestId').isString().notEmpty().withMessage('Guest ID is required'),
    body('email')
      .optional()
      .isBoolean()
      .withMessage('Email preference must be boolean'),
    body('sms')
      .optional()
      .isBoolean()
      .withMessage('SMS preference must be boolean'),
    body('push')
      .optional()
      .isBoolean()
      .withMessage('Push preference must be boolean'),
    body('reminderDays')
      .optional()
      .isArray()
      .withMessage('Reminder days must be an array'),
    body('language')
      .optional()
      .isString()
      .withMessage('Language must be a string'),
    body('timezone')
      .optional()
      .isString()
      .withMessage('Timezone must be a string'),
  ],

  getNotificationDeliveryReport: [
    param('notificationId')
      .isString()
      .notEmpty()
      .withMessage('Notification ID is required'),
  ],
};
