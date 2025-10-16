/**
 * Integration tests for webhook and event functionality
 */

import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import webhookRoutes from '../routes/webhook.routes';
import { BusinessRuleEngineImpl } from '../services/business-rule-engine.service';
import { EventServiceImpl } from '../services/event.service';
import { WebhookServiceImpl } from '../services/webhook.service';
import {
  BusinessEventType,
  SendGridWebhookPayload,
  TwilioWebhookPayload,
} from '../types/webhook.types';

describe('Webhook Integration Tests', () => {
  let app: express.Application;
  let webhookService: WebhookServiceImpl;
  let eventService: EventServiceImpl;
  let ruleEngine: BusinessRuleEngineImpl;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/v1', webhookRoutes);

    webhookService = new WebhookServiceImpl();
    eventService = new EventServiceImpl();
    ruleEngine = new BusinessRuleEngineImpl();

    // Mock environment variables
    process.env.SENDGRID_WEBHOOK_SECRET = 'test-sendgrid-secret';
    process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token';
    process.env.MAILGUN_WEBHOOK_SECRET = 'test-mailgun-secret';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Webhook Endpoints', () => {
    describe('POST /api/v1/webhooks/sendgrid', () => {
      it('should process valid SendGrid webhook events', async () => {
        const payload: SendGridWebhookPayload[] = [
          {
            email: 'test@example.com',
            timestamp: Math.floor(Date.now() / 1000),
            'smtp-id': '<test@smtp-id>',
            event: 'delivered',
            category: ['test'],
            sg_event_id: 'test-event-id',
            sg_message_id: 'test-message-id',
          },
        ];

        const response = await request(app)
          .post('/api/v1/webhooks/sendgrid')
          .send(payload)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.processed).toBe(1);
      });

      it('should handle invalid SendGrid webhook signature', async () => {
        const payload = [
          {
            email: 'test@example.com',
            timestamp: Math.floor(Date.now() / 1000),
            event: 'delivered',
            sg_message_id: 'test-message-id',
          },
        ];

        const response = await request(app)
          .post('/api/v1/webhooks/sendgrid')
          .set('x-twilio-email-event-webhook-signature', 'invalid-signature')
          .send(payload)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.results).toBeDefined();
      });
    });

    describe('POST /api/v1/webhooks/twilio', () => {
      it('should process valid Twilio webhook events', async () => {
        const payload: TwilioWebhookPayload = {
          MessageSid: 'test-message-sid',
          MessageStatus: 'delivered',
          To: '+1234567890',
          From: '+0987654321',
          Body: 'Test message',
        };

        const response = await request(app)
          .post('/api/v1/webhooks/twilio')
          .send(payload)
          .expect(200);

        expect(response.text).toBe('OK');
      });

      it('should handle invalid Twilio webhook signature', async () => {
        const payload = {
          MessageSid: 'test-message-sid',
          MessageStatus: 'delivered',
          To: '+1234567890',
          From: '+0987654321',
        };

        const response = await request(app)
          .post('/api/v1/webhooks/twilio')
          .set('x-twilio-signature', 'invalid-signature')
          .send(payload)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('POST /api/v1/webhooks/mailgun', () => {
      it('should process valid Mailgun webhook events', async () => {
        const payload = {
          id: 'test-message-id',
          event: 'delivered',
          recipient: 'test@example.com',
          timestamp: Math.floor(Date.now() / 1000),
        };

        const response = await request(app)
          .post('/api/v1/webhooks/mailgun')
          .send(payload)
          .expect(200);

        expect(response.text).toBe('OK');
      });
    });

    describe('POST /api/v1/webhooks/fcm', () => {
      it('should process valid FCM webhook events', async () => {
        const payload = {
          message_id: 'test-message-id',
          from: 'test-sender-id',
          category: 'test-category',
          data: { key: 'value' },
        };

        const response = await request(app)
          .post('/api/v1/webhooks/fcm')
          .send(payload)
          .expect(200);

        expect(response.text).toBe('OK');
      });
    });
  });

  describe('Business Event Endpoints', () => {
    describe('POST /api/v1/events/trigger', () => {
      it('should trigger a business event successfully', async () => {
        const eventData = {
          type: BusinessEventType.USER_REGISTERED,
          source: 'auth-service',
          userId: 'test-user-id',
          data: {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          },
        };

        const response = await request(app)
          .post('/api/v1/events/trigger')
          .send(eventData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.eventId).toBeDefined();
        expect(response.body.result).toBeDefined();
      });

      it('should validate required fields for business events', async () => {
        const eventData = {
          // Missing type and source
          userId: 'test-user-id',
          data: { key: 'value' },
        };

        const response = await request(app)
          .post('/api/v1/events/trigger')
          .send(eventData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation failed');
      });
    });

    describe('GET /api/v1/events/history', () => {
      it('should retrieve event history with filters', async () => {
        // First, create some test events
        const event1 = {
          type: BusinessEventType.USER_REGISTERED,
          source: 'auth-service',
          userId: 'user-1',
          data: { email: 'user1@example.com' },
        };

        const event2 = {
          type: BusinessEventType.ORDER_CREATED,
          source: 'ecommerce-service',
          userId: 'user-2',
          data: { orderId: 'order-123' },
        };

        await request(app).post('/api/v1/events/trigger').send(event1);
        await request(app).post('/api/v1/events/trigger').send(event2);

        // Retrieve event history
        const response = await request(app)
          .get('/api/v1/events/history')
          .query({
            eventTypes: BusinessEventType.USER_REGISTERED,
            limit: 10,
            offset: 0,
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.pagination).toBeDefined();
      });

      it('should validate query parameters', async () => {
        const response = await request(app)
          .get('/api/v1/events/history')
          .query({
            limit: 'invalid',
            offset: -1,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation failed');
      });
    });

    describe('POST /api/v1/events/:eventId/replay', () => {
      it('should replay an existing event', async () => {
        // First, create a test event
        const eventData = {
          type: BusinessEventType.USER_REGISTERED,
          source: 'auth-service',
          userId: 'test-user-id',
          data: { email: 'test@example.com' },
        };

        const createResponse = await request(app)
          .post('/api/v1/events/trigger')
          .send(eventData);

        const eventId = createResponse.body.eventId;

        // Replay the event
        const response = await request(app)
          .post(`/api/v1/events/${eventId}/replay`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
      });

      it('should handle non-existent event replay', async () => {
        const nonExistentId = crypto.randomUUID();

        const response = await request(app)
          .post(`/api/v1/events/${nonExistentId}/replay`)
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Business Rule Management', () => {
    describe('POST /api/v1/rules', () => {
      it('should create a new business rule', async () => {
        const ruleData = {
          name: 'Welcome Email Rule',
          description: 'Send welcome email when user registers',
          eventType: BusinessEventType.USER_REGISTERED,
          conditions: [
            {
              field: 'data.email',
              operator: 'exists',
              value: true,
            },
          ],
          actions: [
            {
              type: 'send_notification',
              config: {
                templateId: 'welcome-email',
                channels: ['email'],
                priority: 'normal',
              },
            },
          ],
          enabled: true,
          priority: 5,
        };

        const response = await request(app)
          .post('/api/v1/rules')
          .send(ruleData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe(ruleData.name);
      });

      it('should validate required fields for business rules', async () => {
        const invalidRuleData = {
          // Missing required fields
          description: 'Invalid rule',
        };

        const response = await request(app)
          .post('/api/v1/rules')
          .send(invalidRuleData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation failed');
      });
    });

    describe('GET /api/v1/rules', () => {
      it('should list business rules with filters', async () => {
        // First, create a test rule
        const ruleData = {
          name: 'Test Rule',
          eventType: BusinessEventType.USER_REGISTERED,
          conditions: [{ field: 'userId', operator: 'exists', value: true }],
          actions: [
            { type: 'send_notification', config: { templateId: 'test' } },
          ],
        };

        await request(app).post('/api/v1/rules').send(ruleData);

        // List rules
        const response = await request(app)
          .get('/api/v1/rules')
          .query({
            eventType: BusinessEventType.USER_REGISTERED,
            enabled: true,
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
      });
    });

    describe('POST /api/v1/rules/:ruleId/test', () => {
      it('should test a business rule against a test event', async () => {
        // First, create a test rule
        const ruleData = {
          name: 'Test Rule',
          eventType: BusinessEventType.USER_REGISTERED,
          conditions: [
            {
              field: 'data.email',
              operator: 'contains',
              value: '@example.com',
            },
          ],
          actions: [
            {
              type: 'send_notification',
              config: {
                templateId: 'welcome-email',
                channels: ['email'],
              },
            },
          ],
        };

        const createResponse = await request(app)
          .post('/api/v1/rules')
          .send(ruleData);

        const ruleId = createResponse.body.data.id;

        // Test the rule
        const testEvent = {
          id: crypto.randomUUID(),
          type: BusinessEventType.USER_REGISTERED,
          timestamp: new Date(),
          source: 'auth-service',
          userId: 'test-user',
          data: {
            email: 'test@example.com',
            firstName: 'Test',
          },
        };

        const response = await request(app)
          .post(`/api/v1/rules/${ruleId}/test`)
          .send({ testEvent })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.result.matched).toBe(true);
        expect(response.body.result.actions).toHaveLength(1);
      });
    });

    describe('POST /api/v1/rules/validate', () => {
      it('should validate a business rule', async () => {
        const ruleData = {
          name: 'Valid Rule',
          eventType: BusinessEventType.USER_REGISTERED,
          conditions: [
            {
              field: 'data.email',
              operator: 'exists',
              value: true,
            },
          ],
          actions: [
            {
              type: 'send_notification',
              config: {
                templateId: 'welcome-email',
                channels: ['email'],
              },
            },
          ],
          enabled: true,
          priority: 5,
        };

        const response = await request(app)
          .post('/api/v1/rules/validate')
          .send(ruleData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.validation.isValid).toBe(true);
        expect(response.body.validation.errors).toHaveLength(0);
      });

      it('should detect invalid business rule', async () => {
        const invalidRuleData = {
          name: '', // Empty name
          eventType: BusinessEventType.USER_REGISTERED,
          conditions: [], // Empty conditions
          actions: [], // Empty actions
        };

        const response = await request(app)
          .post('/api/v1/rules/validate')
          .send(invalidRuleData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation failed');
      });
    });
  });

  describe('Webhook Signature Validation', () => {
    it('should validate SendGrid webhook signature correctly', async () => {
      const payload = JSON.stringify([
        {
          email: 'test@example.com',
          timestamp: Math.floor(Date.now() / 1000),
          event: 'delivered',
          sg_message_id: 'test-message-id',
        },
      ]);

      const secret = 'test-sendgrid-secret';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = await webhookService.validateHMACSignature(
        payload,
        `sha256=${signature}`,
        secret,
        'sha256'
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid webhook signature', async () => {
      const payload = JSON.stringify({ test: 'data' });
      const secret = 'test-secret';
      const invalidSignature = 'invalid-signature';

      const isValid = await webhookService.validateHMACSignature(
        payload,
        invalidSignature,
        secret,
        'sha256'
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Event Processing Integration', () => {
    it('should process business event and trigger rules', async () => {
      // Create a rule that should trigger
      const ruleData = {
        name: 'Order Confirmation Rule',
        eventType: BusinessEventType.ORDER_CREATED,
        conditions: [
          {
            field: 'data.total',
            operator: 'greater_than',
            value: 100,
          },
        ],
        actions: [
          {
            type: 'send_notification',
            config: {
              templateId: 'order-confirmation',
              channels: ['email', 'sms'],
              priority: 'high',
            },
          },
        ],
        enabled: true,
        priority: 8,
      };

      await request(app).post('/api/v1/rules').send(ruleData);

      // Trigger an event that should match the rule
      const eventData = {
        type: BusinessEventType.ORDER_CREATED,
        source: 'ecommerce-service',
        userId: 'test-user',
        data: {
          orderId: 'order-123',
          total: 150.0,
          items: ['item1', 'item2'],
        },
      };

      const response = await request(app)
        .post('/api/v1/events/trigger')
        .send(eventData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result.rulesEvaluated).toBeGreaterThan(0);
    });
  });
});
