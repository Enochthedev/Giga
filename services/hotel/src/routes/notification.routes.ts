/**
 * Notification Routes - Handles notification-related endpoints
 */

import {
  NotificationController,
  notificationValidation,
} from '@/controllers/notification.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createNotificationRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const notificationController = new NotificationController(prisma);

  /**
   * @swagger
   * /api/v1/notifications/booking-confirmation/{bookingId}:
   *   post:
   *     summary: Send booking confirmation notification
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Notification sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/booking-confirmation/:bookingId',
    notificationValidation.sendBookingConfirmation,
    notificationController.sendBookingConfirmation.bind(notificationController)
  );

  /**
   * @swagger
   * /api/v1/notifications/booking-update/{bookingId}:
   *   post:
   *     summary: Send booking update notification
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - updateType
   *             properties:
   *               updateType:
   *                 type: string
   *                 enum: [modification, cancellation, status_change]
   *                 description: Type of booking update
   *               changes:
   *                 type: object
   *                 description: Details of the changes made
   *               refundAmount:
   *                 type: number
   *                 description: Refund amount if applicable
   *     responses:
   *       200:
   *         description: Notification sent successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/booking-update/:bookingId',
    notificationValidation.sendBookingUpdate,
    notificationController.sendBookingUpdate.bind(notificationController)
  );

  /**
   * @swagger
   * /api/v1/notifications/schedule-reminders/{bookingId}:
   *   post:
   *     summary: Schedule booking reminder notifications
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Reminders scheduled successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/schedule-reminders/:bookingId',
    notificationValidation.scheduleBookingReminders,
    notificationController.scheduleBookingReminders.bind(notificationController)
  );

  /**
   * @swagger
   * /api/v1/notifications/process-scheduled-reminders:
   *   post:
   *     summary: Process scheduled reminder notifications (for cron job)
   *     tags: [Notifications]
   *     responses:
   *       200:
   *         description: Scheduled reminders processed successfully
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/process-scheduled-reminders',
    notificationController.processScheduledReminders.bind(
      notificationController
    )
  );

  /**
   * @swagger
   * /api/v1/notifications/scheduled-reminders/{bookingId}:
   *   delete:
   *     summary: Cancel scheduled reminder notifications
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Scheduled reminders cancelled successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Internal server error
   */
  router.delete(
    '/scheduled-reminders/:bookingId',
    notificationValidation.cancelScheduledReminders,
    notificationController.cancelScheduledReminders.bind(notificationController)
  );

  /**
   * @swagger
   * /api/v1/notifications/workflow/{bookingId}:
   *   get:
   *     summary: Get guest communication workflow status
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Communication workflow retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     bookingId:
   *                       type: string
   *                     workflowType:
   *                       type: string
   *                     scheduledNotifications:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           type:
   *                             type: string
   *                           scheduledAt:
   *                             type: string
   *                             format: date-time
   *                           status:
   *                             type: string
   *                           notificationId:
   *                             type: string
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/workflow/:bookingId',
    notificationValidation.getGuestCommunicationWorkflow,
    notificationController.getGuestCommunicationWorkflow.bind(
      notificationController
    )
  );

  /**
   * @swagger
   * /api/v1/notifications/preferences/{guestId}:
   *   put:
   *     summary: Update guest notification preferences
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: guestId
   *         required: true
   *         schema:
   *           type: string
   *         description: Guest ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: boolean
   *                 description: Enable email notifications
   *               sms:
   *                 type: boolean
   *                 description: Enable SMS notifications
   *               push:
   *                 type: boolean
   *                 description: Enable push notifications
   *               reminderDays:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: Days before check-in to send reminders
   *               language:
   *                 type: string
   *                 description: Preferred language for notifications
   *               timezone:
   *                 type: string
   *                 description: Guest's timezone
   *     responses:
   *       200:
   *         description: Preferences updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Guest not found
   *       500:
   *         description: Internal server error
   */
  router.put(
    '/preferences/:guestId',
    notificationValidation.updateGuestNotificationPreferences,
    notificationController.updateGuestNotificationPreferences.bind(
      notificationController
    )
  );

  /**
   * @swagger
   * /api/v1/notifications/delivery-report/{notificationId}:
   *   get:
   *     summary: Get notification delivery report
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: notificationId
   *         required: true
   *         schema:
   *           type: string
   *         description: Notification ID from notification service
   *     responses:
   *       200:
   *         description: Delivery report retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   description: Delivery report from notification service
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Notification not found
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/delivery-report/:notificationId',
    notificationValidation.getNotificationDeliveryReport,
    notificationController.getNotificationDeliveryReport.bind(
      notificationController
    )
  );

  return router;
}

export default createNotificationRoutes;
