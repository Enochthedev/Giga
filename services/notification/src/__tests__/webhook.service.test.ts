/**
 * Unit tests for webhook service
 */

import crypto from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WebhookServiceImpl } from '../services/webhook.service';
import {
  SendGridWebhookPayload,
  TwilioWebhookPayload,
  WebhookConfig,
  WebhookDelivery,
  WebhookEventType,
  WebhookProvider,
} from '../types/webhook.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('WebhookService', () => {
  let webhookService: WebhookServiceImpl;

  beforeEach(() => {
    webhookService = new WebhookServiceImpl();
    vi.clearAllMocks();

    // Set up environment variables
    process.env.SENDGRID_WEBHOOK_SECRET = 'test-sendgrid-secret';
    process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token';
    process.env.MAILGUN_WEBHOOK_SECRET = 'test-mailgun-secret';
  });

  describe('Webhook Management', () => {
    it('should register a new webhook', async () => {
      const config: WebhookConfig = {
        provider: WebhookProvider.SENDGRID,
        endpoint: 'https://example.com/webhook',
        secret: 'test-secret',
        enabled: true,
        events: [WebhookEventType.DELIVERED, WebhookEventType.OPENED],
      };

      const webhookId = await webhookService.registerWebhook(config);

      expect(webhookId).toBeDefined();
      expect(typeof webhookId).toBe('string');

      const retrieved = await webhookService.getWebhook(webhookId);
      expect(retrieved).toEqual(expect.objectContaining(config));
    });

    it('should update an existing webhook', async () => {
      const config: WebhookConfig = {
        provider: WebhookProvider.SENDGRID,
        endpoint: 'https://example.com/webhook',
        secret: 'test-secret',
        enabled: true,
        events: [WebhookEventType.DELIVERED],
      };

      const webhookId = await webhookService.registerWebhook(config);

      const updates = {
        enabled: false,
        events: [WebhookEventType.DELIVERED, WebhookEventType.OPENED],
      };

      const updated = await webhookService.updateWebhook(webhookId, updates);
      expect(updated).toBe(true);

      const retrieved = await webhookService.getWebhook(webhookId);
      expect(retrieved?.enabled).toBe(false);
      expect(retrieved?.events).toHaveLength(2);
    });

    it('should delete a webhook', async () => {
      const config: WebhookConfig = {
        provider: WebhookProvider.SENDGRID,
        endpoint: 'https://example.com/webhook',
        secret: 'test-secret',
        enabled: true,
        events: [WebhookEventType.DELIVERED],
      };

      const webhookId = await webhookService.registerWebhook(config);

      const deleted = await webhookService.deleteWebhook(webhookId);
      expect(deleted).toBe(true);

      const retrieved = await webhookService.getWebhook(webhookId);
      expect(retrieved).toBeNull();
    });

    it('should list all webhooks', async () => {
      const config1: WebhookConfig = {
        provider: WebhookProvider.SENDGRID,
        endpoint: 'https://example.com/webhook1',
        secret: 'test-secret-1',
        enabled: true,
        events: [WebhookEventType.DELIVERED],
      };

      const config2: WebhookConfig = {
        provider: WebhookProvider.TWILIO,
        endpoint: 'https://example.com/webhook2',
        secret: 'test-secret-2',
        enabled: false,
        events: [WebhookEventType.FAILED],
      };

      await webhookService.registerWebhook(config1);
      await webhookService.registerWebhook(config2);

      const webhooks = await webhookService.listWebhooks();
      expect(webhooks).toHaveLength(2);
    });
  });

  describe('Webhook Event Processing', () => {
    it('should process SendGrid webhook event', async () => {
      const payload: SendGridWebhookPayload = {
        email: 'test@example.com',
        timestamp: Math.floor(Date.now() / 1000),
        'smtp-id': '<test@smtp-id>',
        event: 'delivered',
        category: ['test'],
        sg_event_id: 'test-event-id',
        sg_message_id: 'test-message-id',
      };

      const result = await webhookService.processWebhookEvent(
        WebhookProvider.SENDGRID,
        payload
      );

      expect(result.isValid).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.provider).toBe(WebhookProvider.SENDGRID);
      expect(result.event?.eventType).toBe(WebhookEventType.DELIVERED);
      expect(result.event?.recipient).toBe('test@example.com');
    });

    it('should process Twilio webhook event', async () => {
      const payload: TwilioWebhookPayload = {
        MessageSid: 'test-message-sid',
        MessageStatus: 'delivered',
        To: '+1234567890',
        From: '+0987654321',
        Body: 'Test message',
      };

      const result = await webhookService.processWebhookEvent(
        WebhookProvider.TWILIO,
        payload
      );

      expect(result.isValid).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.provider).toBe(WebhookProvider.TWILIO);
      expect(result.event?.eventType).toBe(WebhookEventType.DELIVERED);
      expect(result.event?.recipient).toBe('+1234567890');
    });

    it('should handle unsupported provider', async () => {
      const result = await webhookService.processWebhookEvent(
        'unsupported-provider',
        {}
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported webhook provider');
    });

    it('should handle processing errors gracefully', async () => {
      // Pass invalid payload that will cause processing to fail
      const result = await webhookService.processWebhookEvent(
        WebhookProvider.SENDGRID,
        null
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Webhook Signature Validation', () => {
    it('should validate HMAC signature correctly', async () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = await webhookService.validateHMACSignature(
        payload,
        signature,
        secret,
        'sha256'
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid HMAC signature', async () => {
      const payload = 'test-payload';
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

    it('should handle signature validation errors', async () => {
      const isValid = await webhookService.validateHMACSignature(
        'payload',
        'invalid-hex-signature',
        'secret',
        'sha256'
      );

      expect(isValid).toBe(false);
    });

    it('should validate timestamp within tolerance', () => {
      const currentTimestamp = Math.floor(Date.now() / 1000).toString();
      const isValid = webhookService.validateTimestamp(currentTimestamp, 600);
      expect(isValid).toBe(true);
    });

    it('should reject timestamp outside tolerance', () => {
      const oldTimestamp = (Math.floor(Date.now() / 1000) - 1000).toString();
      const isValid = webhookService.validateTimestamp(oldTimestamp, 600);
      expect(isValid).toBe(false);
    });
  });

  describe('Webhook Delivery', () => {
    it('should deliver webhook successfully', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue('OK'),
        headers: new Map([['content-type', 'text/plain']]),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const delivery: WebhookDelivery = {
        id: crypto.randomUUID(),
        webhookId: 'webhook-123',
        eventId: 'event-123',
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: { test: 'data' },
        status: 'pending',
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      const success = await webhookService.deliverWebhook(delivery);

      expect(success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        delivery.url,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(delivery.payload),
        })
      );
    });

    it('should handle webhook delivery failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue('Internal Server Error'),
        headers: new Map(),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const delivery: WebhookDelivery = {
        id: crypto.randomUUID(),
        webhookId: 'webhook-123',
        eventId: 'event-123',
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: {},
        payload: { test: 'data' },
        status: 'pending',
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      const success = await webhookService.deliverWebhook(delivery);

      expect(success).toBe(false);
    });

    it('should handle network errors during delivery', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const delivery: WebhookDelivery = {
        id: crypto.randomUUID(),
        webhookId: 'webhook-123',
        eventId: 'event-123',
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: {},
        payload: { test: 'data' },
        status: 'pending',
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      const success = await webhookService.deliverWebhook(delivery);

      expect(success).toBe(false);
    });

    it('should retry failed webhook delivery', async () => {
      const delivery: WebhookDelivery = {
        id: crypto.randomUUID(),
        webhookId: 'webhook-123',
        eventId: 'event-123',
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: {},
        payload: { test: 'data' },
        status: 'failed',
        attemptCount: 1,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      // First store the delivery
      await webhookService.deliverWebhook(delivery);

      const mockResponse = {
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue('OK'),
        headers: new Map(),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const success = await webhookService.retryFailedWebhook(delivery.id);

      expect(success).toBe(true);
    });

    it('should not retry webhook that exceeded max attempts', async () => {
      const delivery: WebhookDelivery = {
        id: crypto.randomUUID(),
        webhookId: 'webhook-123',
        eventId: 'event-123',
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: {},
        payload: { test: 'data' },
        status: 'failed',
        attemptCount: 3,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      const success = await webhookService.retryFailedWebhook(delivery.id);

      expect(success).toBe(false);
    });
  });

  describe('Provider-Specific Event Processing', () => {
    it('should map SendGrid events correctly', async () => {
      const payload: SendGridWebhookPayload = {
        email: 'test@example.com',
        timestamp: 1234567890,
        'smtp-id': '<test@smtp-id>',
        event: 'open',
        category: ['test'],
        sg_event_id: 'test-event-id',
        sg_message_id: 'test-message-id',
      };

      const event = await webhookService.processSendGridEvent(payload);

      expect(event.provider).toBe(WebhookProvider.SENDGRID);
      expect(event.eventType).toBe(WebhookEventType.OPENED);
      expect(event.messageId).toBe('test-message-id');
      expect(event.recipient).toBe('test@example.com');
      expect(event.timestamp).toEqual(new Date(1234567890 * 1000));
    });

    it('should map Twilio events correctly', async () => {
      const payload: TwilioWebhookPayload = {
        MessageSid: 'test-message-sid',
        MessageStatus: 'failed',
        To: '+1234567890',
        From: '+0987654321',
        ErrorCode: '30008',
        ErrorMessage: 'Unknown error',
      };

      const event = await webhookService.processTwilioEvent(payload);

      expect(event.provider).toBe(WebhookProvider.TWILIO);
      expect(event.eventType).toBe(WebhookEventType.FAILED);
      expect(event.messageId).toBe('test-message-sid');
      expect(event.recipient).toBe('+1234567890');
    });

    it('should handle unknown event types with default mapping', async () => {
      const payload: SendGridWebhookPayload = {
        email: 'test@example.com',
        timestamp: 1234567890,
        'smtp-id': '<test@smtp-id>',
        event: 'unknown_event' as any,
        category: ['test'],
        sg_event_id: 'test-event-id',
        sg_message_id: 'test-message-id',
      };

      const event = await webhookService.processSendGridEvent(payload);

      expect(event.eventType).toBe(WebhookEventType.DELIVERED);
    });
  });
});
