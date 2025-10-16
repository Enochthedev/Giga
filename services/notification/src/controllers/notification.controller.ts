/**
 * Notification controller for handling notification requests
 * Follows the controller pattern: thin layer that delegates to services
 */

import { Request, Response } from 'express';
import { validateNotificationRequest } from '../lib/validation';
import { NotificationService } from '../services/notification.service';
import {
  EmailRequest,
  InAppRequest,
  NotificationRequest,
  PushRequest,
  SMSRequest,
  ScheduledNotificationRequest,
  WorkflowContext,
} from '../types';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Send a single notification
   * POST /api/v1/notifications
   */
  async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = validateNotificationRequest(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
        return;
      }

      const notificationRequest: NotificationRequest = value;

      // Delegate to service
      const result =
        await this.notificationService.sendNotification(notificationRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send notification error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        // Handle NotificationError
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Send bulk notifications
   * POST /api/v1/notifications/bulk
   */
  async sendBulkNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { notifications } = req.body;

      if (!Array.isArray(notifications) || notifications.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Notifications array is required and must not be empty',
        });
        return;
      }

      if (notifications.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Maximum 1000 notifications allowed per bulk request',
        });
        return;
      }

      // Validate each notification request
      const validationErrors: Array<{ index: number; errors: any[] }> = [];
      const validNotifications: NotificationRequest[] = [];

      for (let i = 0; i < notifications.length; i++) {
        const { error, value } = validateNotificationRequest(notifications[i]);
        if (error) {
          validationErrors.push({
            index: i,
            errors: error.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message,
            })),
          });
        } else {
          validNotifications.push(value);
        }
      }

      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed for some notifications',
          validationErrors,
        });
        return;
      }

      // Delegate to service
      const result =
        await this.notificationService.sendBulkNotifications(
          validNotifications
        );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send bulk notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Send email notification
   * POST /api/v1/notifications/email
   */
  async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const emailRequest: EmailRequest = req.body;

      // Basic validation
      if (!emailRequest.to || !emailRequest.subject) {
        res.status(400).json({
          success: false,
          error: 'Email recipient (to) and subject are required',
        });
        return;
      }

      // Delegate to service
      const result = await this.notificationService.sendEmail(emailRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send email error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Send SMS notification
   * POST /api/v1/notifications/sms
   */
  async sendSMS(req: Request, res: Response): Promise<void> {
    try {
      const smsRequest: SMSRequest = req.body;

      // Basic validation
      if (!smsRequest.to || !smsRequest.body) {
        res.status(400).json({
          success: false,
          error: 'SMS recipient (to) and body are required',
        });
        return;
      }

      // Delegate to service
      const result = await this.notificationService.sendSMS(smsRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send SMS error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Send push notification
   * POST /api/v1/notifications/push
   */
  async sendPushNotification(req: Request, res: Response): Promise<void> {
    try {
      const pushRequest: PushRequest = req.body;

      // Basic validation
      if (
        !pushRequest.deviceTokens?.length ||
        !pushRequest.title ||
        !pushRequest.body
      ) {
        res.status(400).json({
          success: false,
          error: 'Device tokens, title, and body are required',
        });
        return;
      }

      // Delegate to service
      const result =
        await this.notificationService.sendPushNotification(pushRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send push notification error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Send in-app notification
   * POST /api/v1/notifications/in-app
   */
  async sendInAppNotification(req: Request, res: Response): Promise<void> {
    try {
      const inAppRequest: InAppRequest = req.body;

      // Basic validation
      if (!inAppRequest._userId || !inAppRequest.title || !inAppRequest.body) {
        res.status(400).json({
          success: false,
          error: 'User ID, title, and body are required',
        });
        return;
      }

      // Delegate to service
      const result =
        await this.notificationService.sendInAppNotification(inAppRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Send in-app notification error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Schedule a notification
   * POST /api/v1/notifications/schedule
   */
  async scheduleNotification(req: Request, res: Response): Promise<void> {
    try {
      const scheduledRequest: ScheduledNotificationRequest = req.body;

      // Basic validation
      if (!scheduledRequest.scheduledAt) {
        res.status(400).json({
          success: false,
          error: 'Scheduled time (scheduledAt) is required',
        });
        return;
      }

      const scheduledDate = new Date(scheduledRequest.scheduledAt);
      if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
        res.status(400).json({
          success: false,
          error: 'Scheduled time must be a valid future date',
        });
        return;
      }

      // Validate the notification request part
      const { error } = validateNotificationRequest(scheduledRequest);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
        return;
      }

      // Delegate to service
      const result =
        await this.notificationService.scheduleNotification(scheduledRequest);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Schedule notification error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Cancel a scheduled notification
   * DELETE /api/v1/notifications/schedule/:notificationId
   */
  async cancelScheduledNotification(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: 'Notification ID is required',
        });
        return;
      }

      // Delegate to service
      const cancelled =
        await this.notificationService.cancelScheduledNotification(
          notificationId
        );

      if (cancelled) {
        res.status(200).json({
          success: true,
          message: 'Scheduled notification cancelled successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Scheduled notification not found',
        });
      }
    } catch (error) {
      console.error('Cancel scheduled notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Trigger a workflow
   * POST /api/v1/notifications/workflow/:workflowId
   */
  async triggerWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { workflowId } = req.params;
      const context: WorkflowContext = req.body;

      if (!workflowId) {
        res.status(400).json({
          success: false,
          error: 'Workflow ID is required',
        });
        return;
      }

      if (!context.eventType) {
        res.status(400).json({
          success: false,
          error: 'Event type is required in workflow context',
        });
        return;
      }

      // Delegate to service
      const result = await this.notificationService.triggerWorkflow(
        workflowId,
        context
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Trigger workflow error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const notificationError = error as any;
        const statusCode = this.getStatusCodeFromError(notificationError.code);

        res.status(statusCode).json({
          success: false,
          error: notificationError.message,
          code: notificationError.code,
          retryable: notificationError.retryable,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Get notification status
   * GET /api/v1/notifications/:notificationId/status
   */
  async getNotificationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: 'Notification ID is required',
        });
        return;
      }

      // Delegate to service
      const status =
        await this.notificationService.getNotificationStatus(notificationId);

      res.status(200).json({
        success: true,
        data: { status },
      });
    } catch (error) {
      console.error('Get notification status error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get delivery report
   * GET /api/v1/notifications/:notificationId/report
   */
  async getDeliveryReport(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: 'Notification ID is required',
        });
        return;
      }

      // Delegate to service
      const report =
        await this.notificationService.getDeliveryReport(notificationId);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Get delivery report error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get notification history for a user
   * GET /api/v1/notifications/history/:userId
   */
  async getNotificationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = '50', offset = '0' } = req.query;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const limitNum = parseInt(limit as string, 10);
      const offsetNum = parseInt(offset as string, 10);

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        res.status(400).json({
          success: false,
          error: 'Limit must be a number between 1 and 100',
        });
        return;
      }

      if (isNaN(offsetNum) || offsetNum < 0) {
        res.status(400).json({
          success: false,
          error: 'Offset must be a non-negative number',
        });
        return;
      }

      // Delegate to service
      const history = await this.notificationService.getNotificationHistory(
        userId,
        limitNum,
        offsetNum
      );

      res.status(200).json({
        success: true,
        data: history,
        pagination: {
          limit: limitNum,
          offset: offsetNum,
          total: history.length,
        },
      });
    } catch (error) {
      console.error('Get notification history error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Private helper methods
  private getStatusCodeFromError(errorCode: string): number {
    switch (errorCode) {
      case 'INVALID_REQUEST':
      case 'TEMPLATE_NOT_FOUND':
      case 'INVALID_RECIPIENT':
      case 'CONTENT_VALIDATION_FAILED':
        return 400;
      case 'AUTHENTICATION_FAILED':
        return 401;
      case 'USER_OPTED_OUT':
        return 403;
      case 'RATE_LIMIT_EXCEEDED':
        return 429;
      case 'SERVICE_UNAVAILABLE':
      case 'PROVIDER_ERROR':
      case 'QUEUE_FULL':
        return 503;
      default:
        return 500;
    }
  }
}
