/**
 * Webhook routes for handling provider callbacks and event management
 */

import { NextFunction, Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { WebhookController } from '../controllers/webhook.controller';

const router: Router = Router();
const webhookController = new WebhookController();

// Validation middleware
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Provider webhook endpoints (no authentication required for webhooks)
router.post(
  '/webhooks/sendgrid',
  webhookController.handleSendGridWebhook.bind(webhookController)
);

router.post(
  '/webhooks/twilio',
  webhookController.handleTwilioWebhook.bind(webhookController)
);

router.post(
  '/webhooks/mailgun',
  webhookController.handleMailgunWebhook.bind(webhookController)
);

router.post(
  '/webhooks/aws',
  webhookController.handleAWSWebhook.bind(webhookController)
);

router.post(
  '/webhooks/fcm',
  webhookController.handleFCMWebhook.bind(webhookController)
);

// Business event endpoints (require authentication in production)
router.post(
  '/events/trigger',
  [
    body('type').notEmpty().withMessage('Event type is required'),
    body('source').notEmpty().withMessage('Event source is required'),
    body('data')
      .optional()
      .isObject()
      .withMessage('Event data must be an object'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Event metadata must be an object'),
  ],
  handleValidationErrors,
  webhookController.triggerBusinessEvent.bind(webhookController)
);

router.get(
  '/events/history',
  [
    query('eventTypes').optional().isString(),
    query('userId').optional().isString(),
    query('source').optional().isString(),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be valid ISO 8601 date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be valid ISO 8601 date'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit must be between 1 and 1000'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
  ],
  handleValidationErrors,
  webhookController.getEventHistory.bind(webhookController)
);

router.post(
  '/events/:eventId/replay',
  [param('eventId').isUUID().withMessage('Event ID must be a valid UUID')],
  handleValidationErrors,
  webhookController.replayEvent.bind(webhookController)
);

// Business rule management endpoints
router.post(
  '/rules',
  [
    body('name').notEmpty().withMessage('Rule name is required'),
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('conditions')
      .isArray({ min: 1 })
      .withMessage('At least one condition is required'),
    body('actions')
      .isArray({ min: 1 })
      .withMessage('At least one action is required'),
    body('enabled')
      .optional()
      .isBoolean()
      .withMessage('Enabled must be a boolean'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
  ],
  handleValidationErrors,
  webhookController.createBusinessRule.bind(webhookController)
);

router.put(
  '/rules/:ruleId',
  [
    param('ruleId').isUUID().withMessage('Rule ID must be a valid UUID'),
    body('name').optional().notEmpty().withMessage('Rule name cannot be empty'),
    body('eventType')
      .optional()
      .notEmpty()
      .withMessage('Event type cannot be empty'),
    body('conditions')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one condition is required'),
    body('actions')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one action is required'),
    body('enabled')
      .optional()
      .isBoolean()
      .withMessage('Enabled must be a boolean'),
    body('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
  ],
  handleValidationErrors,
  webhookController.updateBusinessRule.bind(webhookController)
);

router.delete(
  '/rules/:ruleId',
  [param('ruleId').isUUID().withMessage('Rule ID must be a valid UUID')],
  handleValidationErrors,
  webhookController.deleteBusinessRule.bind(webhookController)
);

router.get(
  '/rules/:ruleId',
  [param('ruleId').isUUID().withMessage('Rule ID must be a valid UUID')],
  handleValidationErrors,
  webhookController.getBusinessRule.bind(webhookController)
);

router.get(
  '/rules',
  [
    query('eventType').optional().isString(),
    query('enabled')
      .optional()
      .isBoolean()
      .withMessage('Enabled must be a boolean'),
    query('priority')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Priority must be between 1 and 10'),
    query('createdAfter')
      .optional()
      .isISO8601()
      .withMessage('Created after must be valid ISO 8601 date'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit must be between 1 and 1000'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative'),
  ],
  handleValidationErrors,
  webhookController.listBusinessRules.bind(webhookController)
);

router.post(
  '/rules/:ruleId/test',
  [
    param('ruleId').isUUID().withMessage('Rule ID must be a valid UUID'),
    body('testEvent').notEmpty().withMessage('Test event is required'),
    body('testEvent.type')
      .notEmpty()
      .withMessage('Test event type is required'),
    body('testEvent.source')
      .notEmpty()
      .withMessage('Test event source is required'),
    body('testEvent.data')
      .optional()
      .isObject()
      .withMessage('Test event data must be an object'),
  ],
  handleValidationErrors,
  webhookController.testBusinessRule.bind(webhookController)
);

router.post(
  '/rules/validate',
  [
    body('name').notEmpty().withMessage('Rule name is required'),
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('conditions')
      .isArray({ min: 1 })
      .withMessage('At least one condition is required'),
    body('actions')
      .isArray({ min: 1 })
      .withMessage('At least one action is required'),
  ],
  handleValidationErrors,
  webhookController.validateBusinessRule.bind(webhookController)
);

export default router;
