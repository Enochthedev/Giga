/**
 * Notification routes
 * Defines all notification-related API endpoints
 */

import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router: Router = Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationRequest:
 *       type: object
 *       required:
 *         - channels
 *         - content
 *         - priority
 *         - category
 *         - fromService
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID for the notification recipient
 *         email:
 *           type: string
 *           format: email
 *           description: Email address for email notifications
 *         phone:
 *           type: string
 *           description: Phone number for SMS notifications
 *         deviceTokens:
 *           type: array
 *           items:
 *             type: string
 *           description: Device tokens for push notifications
 *         templateId:
 *           type: string
 *           description: Template ID to use for rendering
 *         subject:
 *           type: string
 *           description: Notification subject
 *         content:
 *           $ref: '#/components/schemas/NotificationContent'
 *         variables:
 *           type: object
 *           description: Template variables for rendering
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, sms, push, in_app]
 *           description: Notification channels to use
 *         priority:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *           description: Notification priority
 *         category:
 *           type: string
 *           enum: [authentication, security, transactional, marketing, system, social]
 *           description: Notification category
 *         sendAt:
 *           type: string
 *           format: date-time
 *           description: Scheduled send time
 *         timezone:
 *           type: string
 *           description: Timezone for scheduled notifications
 *         trackingEnabled:
 *           type: boolean
 *           description: Enable delivery tracking
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for categorization
 *         fromService:
 *           type: string
 *           description: Service sending the notification
 *         fromUserId:
 *           type: string
 *           description: User ID of the sender
 *
 *     NotificationContent:
 *       type: object
 *       properties:
 *         subject:
 *           type: string
 *           description: Email subject
 *         htmlBody:
 *           type: string
 *           description: HTML email body
 *         textBody:
 *           type: string
 *           description: Plain text email body
 *         smsBody:
 *           type: string
 *           description: SMS message body
 *         pushTitle:
 *           type: string
 *           description: Push notification title
 *         pushBody:
 *           type: string
 *           description: Push notification body
 *         inAppTitle:
 *           type: string
 *           description: In-app notification title
 *         inAppBody:
 *           type: string
 *           description: In-app notification body
 *         actionUrl:
 *           type: string
 *           format: uri
 *           description: Action URL for notifications
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: Image URL for notifications
 *
 *     NotificationResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Notification ID
 *         status:
 *           type: string
 *           enum: [pending, queued, processing, sent, delivered, failed, cancelled]
 *           description: Notification status
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *           description: Channels used for delivery
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           description: Scheduled delivery time
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery time
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NotificationError'
 *           description: Any errors that occurred
 *
 *     NotificationError:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Error code
 *         message:
 *           type: string
 *           description: Error message
 *         details:
 *           type: object
 *           description: Additional error details
 *         retryable:
 *           type: boolean
 *           description: Whether the error is retryable
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Error timestamp
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Send a notification
 *     description: Send a notification through one or more channels
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NotificationResult'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  notificationController.sendNotification.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/bulk:
 *   post:
 *     summary: Send bulk notifications
 *     description: Send multiple notifications in a single request
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NotificationRequest'
 *                 maxItems: 1000
 *     responses:
 *       201:
 *         description: Bulk notifications processed
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/bulk',
  notificationController.sendBulkNotifications.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/email:
 *   post:
 *     summary: Send email notification
 *     description: Send an email notification directly
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *             properties:
 *               to:
 *                 oneOf:
 *                   - type: string
 *                     format: email
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: email
 *               cc:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *               bcc:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *               subject:
 *                 type: string
 *               htmlBody:
 *                 type: string
 *               textBody:
 *                 type: string
 *               templateId:
 *                 type: string
 *               variables:
 *                 type: object
 *               trackingEnabled:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/email',
  notificationController.sendEmail.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/sms:
 *   post:
 *     summary: Send SMS notification
 *     description: Send an SMS notification directly
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - body
 *             properties:
 *               to:
 *                 type: string
 *                 description: Phone number in E.164 format
 *               body:
 *                 type: string
 *                 maxLength: 1600
 *               templateId:
 *                 type: string
 *               variables:
 *                 type: object
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: SMS sent successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/sms',
  notificationController.sendSMS.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/push:
 *   post:
 *     summary: Send push notification
 *     description: Send a push notification to mobile devices
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceTokens
 *               - title
 *               - body
 *             properties:
 *               deviceTokens:
 *                 type: array
 *                 items:
 *                   type: string
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 maxLength: 500
 *               data:
 *                 type: object
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               actionUrl:
 *                 type: string
 *                 format: uri
 *               templateId:
 *                 type: string
 *               variables:
 *                 type: object
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Push notification sent successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/push',
  notificationController.sendPushNotification.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/in-app:
 *   post:
 *     summary: Send in-app notification
 *     description: Send an in-app notification to a user
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _userId
 *               - title
 *               - body
 *             properties:
 *               _userId:
 *                 type: string
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 maxLength: 500
 *               actionUrl:
 *                 type: string
 *                 format: uri
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               data:
 *                 type: object
 *               templateId:
 *                 type: string
 *               variables:
 *                 type: object
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: In-app notification sent successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/in-app',
  notificationController.sendInAppNotification.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/schedule:
 *   post:
 *     summary: Schedule a notification
 *     description: Schedule a notification to be sent at a future time
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/NotificationRequest'
 *               - type: object
 *                 required:
 *                   - scheduledAt
 *                 properties:
 *                   scheduledAt:
 *                     type: string
 *                     format: date-time
 *                     description: When to send the notification
 *                   recurring:
 *                     type: object
 *                     properties:
 *                       pattern:
 *                         type: string
 *                         enum: [daily, weekly, monthly, cron]
 *                       cronExpression:
 *                         type: string
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       maxOccurrences:
 *                         type: integer
 *     responses:
 *       201:
 *         description: Notification scheduled successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/schedule',
  notificationController.scheduleNotification.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/schedule/{notificationId}:
 *   delete:
 *     summary: Cancel scheduled notification
 *     description: Cancel a previously scheduled notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the scheduled notification to cancel
 *     responses:
 *       200:
 *         description: Scheduled notification cancelled successfully
 *       404:
 *         description: Scheduled notification not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/schedule/:notificationId',
  notificationController.cancelScheduledNotification.bind(
    notificationController
  )
);

/**
 * @swagger
 * /api/v1/notifications/workflow/{workflowId}:
 *   post:
 *     summary: Trigger notification workflow
 *     description: Trigger a predefined notification workflow
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workflow to trigger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *               - eventData
 *             properties:
 *               userId:
 *                 type: string
 *               eventType:
 *                 type: string
 *               eventData:
 *                 type: object
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Workflow triggered successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/workflow/:workflowId',
  notificationController.triggerWorkflow.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/{notificationId}/status:
 *   get:
 *     summary: Get notification status
 *     description: Get the current status of a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification
 *     responses:
 *       200:
 *         description: Notification status retrieved successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:notificationId/status',
  notificationController.getNotificationStatus.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/{notificationId}/report:
 *   get:
 *     summary: Get delivery report
 *     description: Get detailed delivery report for a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification
 *     responses:
 *       200:
 *         description: Delivery report retrieved successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:notificationId/report',
  notificationController.getDeliveryReport.bind(notificationController)
);

/**
 * @swagger
 * /api/v1/notifications/history/{userId}:
 *   get:
 *     summary: Get notification history
 *     description: Get notification history for a specific user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of notifications to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of notifications to skip
 *     responses:
 *       200:
 *         description: Notification history retrieved successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/history/:userId',
  notificationController.getNotificationHistory.bind(notificationController)
);

export default router;
