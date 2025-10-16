/**
 * Webhook service implementation for handling provider callbacks and event processing
 */

import crypto from 'crypto';
import {
  WebhookEventProcessor,
  WebhookService,
  WebhookValidator,
} from '../interfaces/webhook.interface';
import {
  FCMWebhookPayload,
  SendGridWebhookPayload,
  TwilioWebhookPayload,
  WebhookConfig,
  WebhookDelivery,
  WebhookDeliveryStatus,
  WebhookEvent,
  WebhookEventType,
  WebhookProvider,
  WebhookValidationResult,
} from '../types/webhook.types';

export class WebhookServiceImpl
  implements WebhookService, WebhookValidator, WebhookEventProcessor
{
  private webhooks: Map<string, WebhookConfig> = new Map();
  private deliveries: Map<string, WebhookDelivery> = new Map();

  // Webhook endpoint management
  async registerWebhook(config: WebhookConfig): Promise<string> {
    const webhookId = crypto.randomUUID();
    this.webhooks.set(webhookId, {
      ...config,
      enabled: config.enabled ?? true,
    });
    return webhookId;
  }

  async updateWebhook(
    webhookId: string,
    config: Partial<WebhookConfig>
  ): Promise<boolean> {
    const existing = this.webhooks.get(webhookId);
    if (!existing) {
      return false;
    }

    this.webhooks.set(webhookId, {
      ...existing,
      ...config,
    });
    return true;
  }

  async deleteWebhook(webhookId: string): Promise<boolean> {
    return this.webhooks.delete(webhookId);
  }

  async getWebhook(webhookId: string): Promise<WebhookConfig | null> {
    return this.webhooks.get(webhookId) || null;
  }

  async listWebhooks(): Promise<WebhookConfig[]> {
    return Array.from(this.webhooks.values());
  }

  // Webhook event processing
  async processWebhookEvent(
    provider: string,
    payload: any,
    signature?: string
  ): Promise<WebhookValidationResult> {
    try {
      const webhookProvider = provider.toLowerCase() as WebhookProvider;

      // Validate signature if provided
      if (signature) {
        const isValid = await this.validateWebhookSignature(
          provider,
          JSON.stringify(payload),
          signature
        );
        if (!isValid) {
          return {
            isValid: false,
            error: 'Invalid webhook signature',
          };
        }
      }

      // Process provider-specific event
      let event: WebhookEvent;
      switch (webhookProvider) {
        case WebhookProvider.SENDGRID:
          event = await this.processSendGridEvent(payload);
          break;
        case WebhookProvider.TWILIO:
          event = await this.processTwilioEvent(payload);
          break;
        case WebhookProvider.MAILGUN:
          event = await this.processMailgunEvent(payload);
          break;
        case WebhookProvider.FCM:
          event = await this.processFCMEvent(payload);
          break;
        default:
          return {
            isValid: false,
            error: `Unsupported webhook provider: ${provider}`,
          };
      }

      // Update notification status
      await this.updateNotificationStatus(event);
      await this.recordEngagementMetrics(event);

      return {
        isValid: true,
        event,
      };
    } catch (error) {
      return {
        isValid: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error processing webhook',
      };
    }
  }

  async validateWebhookSignature(
    provider: string,
    payload: string,
    signature: string
  ): Promise<boolean> {
    const webhookProvider = provider.toLowerCase() as WebhookProvider;

    switch (webhookProvider) {
      case WebhookProvider.SENDGRID:
        return this.validateSendGridWebhook(
          payload,
          signature,
          Date.now().toString()
        );
      case WebhookProvider.TWILIO:
        return this.validateTwilioWebhook(payload, signature, '');
      case WebhookProvider.MAILGUN:
        return this.validateMailgunWebhook(
          payload,
          signature,
          Date.now().toString()
        );
      default:
        return false;
    }
  }

  // Webhook delivery (outgoing)
  async deliverWebhook(delivery: WebhookDelivery): Promise<boolean> {
    try {
      const response = await fetch(delivery.url, {
        method: delivery.method,
        headers: {
          'Content-Type': 'application/json',
          ...delivery.headers,
        },
        body: JSON.stringify(delivery.payload),
      });

      const updatedDelivery: WebhookDelivery = {
        ...delivery,
        responseCode: response.status,
        responseBody: await response.text(),
        responseHeaders: Object.fromEntries(response.headers.entries()),
        deliveredAt: new Date(),
        status: response.ok
          ? WebhookDeliveryStatus.DELIVERED
          : WebhookDeliveryStatus.FAILED,
      };

      this.deliveries.set(delivery.id, updatedDelivery);
      return response.ok;
    } catch (error) {
      const updatedDelivery: WebhookDelivery = {
        ...delivery,
        status: WebhookDeliveryStatus.FAILED,
        error:
          error instanceof Error ? error.message : 'Unknown delivery error',
        attemptCount: delivery.attemptCount + 1,
      };

      this.deliveries.set(delivery.id, updatedDelivery);
      return false;
    }
  }

  async retryFailedWebhook(deliveryId: string): Promise<boolean> {
    const delivery = this.deliveries.get(deliveryId);
    if (!delivery || delivery.attemptCount >= delivery.maxAttempts) {
      return false;
    }

    return this.deliverWebhook({
      ...delivery,
      attemptCount: delivery.attemptCount + 1,
      status: WebhookDeliveryStatus.RETRYING,
    });
  }

  async getWebhookDeliveryStatus(
    deliveryId: string
  ): Promise<WebhookDelivery | null> {
    return this.deliveries.get(deliveryId) || null;
  }

  // Provider-specific webhook validators
  async validateSendGridWebhook(
    payload: string,
    signature: string,
    _timestamp: string
  ): Promise<boolean> {
    const secret = process.env.SENDGRID_WEBHOOK_SECRET || '';
    return this.validateHMACSignature(payload, signature, secret, 'sha256');
  }

  async validateTwilioWebhook(
    payload: string,
    signature: string,
    _url: string
  ): Promise<boolean> {
    const secret = process.env.TWILIO_AUTH_TOKEN || '';
    return this.validateHMACSignature(payload, signature, secret, 'sha1');
  }

  async validateMailgunWebhook(
    payload: string,
    signature: string,
    _timestamp: string
  ): Promise<boolean> {
    const secret = process.env.MAILGUN_WEBHOOK_SECRET || '';
    return this.validateHMACSignature(payload, signature, secret, 'sha256');
  }

  async validateAWSWebhook(
    payload: string,
    signature: string
  ): Promise<boolean> {
    const secret = process.env.AWS_WEBHOOK_SECRET || '';
    return this.validateHMACSignature(payload, signature, secret, 'sha256');
  }

  async validateHMACSignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: string
  ): Promise<boolean> {
    try {
      const expectedSignature = crypto
        .createHmac(algorithm, secret)
        .update(payload)
        .digest('hex');

      // Remove algorithm prefix if present (e.g., "sha256=")
      const cleanSignature = signature.replace(/^(sha256|sha1|md5)=/, '');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(cleanSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  validateTimestamp(
    timestamp: string,
    toleranceSeconds: number = 600
  ): boolean {
    const now = Math.floor(Date.now() / 1000);
    const eventTime = parseInt(timestamp, 10);
    return Math.abs(now - eventTime) <= toleranceSeconds;
  }

  // Provider-specific event processors
  async processSendGridEvent(
    payload: SendGridWebhookPayload
  ): Promise<WebhookEvent> {
    const eventTypeMap: Record<string, WebhookEventType> = {
      delivered: WebhookEventType.DELIVERED,
      open: WebhookEventType.OPENED,
      click: WebhookEventType.CLICKED,
      bounce: WebhookEventType.BOUNCED,
      dropped: WebhookEventType.FAILED,
      spamreport: WebhookEventType.COMPLAINED,
      unsubscribe: WebhookEventType.UNSUBSCRIBED,
      deferred: WebhookEventType.DEFERRED,
    };

    return {
      id: crypto.randomUUID(),
      provider: WebhookProvider.SENDGRID,
      eventType: eventTypeMap[payload.event] || WebhookEventType.DELIVERED,
      timestamp: new Date(payload.timestamp * 1000),
      messageId: payload.sg_message_id,
      recipient: payload.email,
      data: payload,
      verified: true,
    };
  }

  async processTwilioEvent(
    payload: TwilioWebhookPayload
  ): Promise<WebhookEvent> {
    const eventTypeMap: Record<string, WebhookEventType> = {
      delivered: WebhookEventType.DELIVERED,
      failed: WebhookEventType.FAILED,
      undelivered: WebhookEventType.FAILED,
    };

    return {
      id: crypto.randomUUID(),
      provider: WebhookProvider.TWILIO,
      eventType:
        eventTypeMap[payload.MessageStatus] || WebhookEventType.DELIVERED,
      timestamp: new Date(),
      messageId: payload.MessageSid,
      recipient: payload.To,
      data: payload,
      verified: true,
    };
  }

  async processMailgunEvent(payload: any): Promise<WebhookEvent> {
    const eventTypeMap: Record<string, WebhookEventType> = {
      delivered: WebhookEventType.DELIVERED,
      opened: WebhookEventType.OPENED,
      clicked: WebhookEventType.CLICKED,
      bounced: WebhookEventType.BOUNCED,
      dropped: WebhookEventType.FAILED,
      complained: WebhookEventType.COMPLAINED,
      unsubscribed: WebhookEventType.UNSUBSCRIBED,
    };

    return {
      id: crypto.randomUUID(),
      provider: WebhookProvider.MAILGUN,
      eventType: eventTypeMap[payload.event] || WebhookEventType.DELIVERED,
      timestamp: new Date(payload.timestamp * 1000),
      messageId: payload.id,
      recipient: payload.recipient,
      data: payload,
      verified: true,
    };
  }

  async processAWSEvent(payload: any): Promise<WebhookEvent> {
    const eventTypeMap: Record<string, WebhookEventType> = {
      delivery: WebhookEventType.DELIVERED,
      bounce: WebhookEventType.BOUNCED,
      complaint: WebhookEventType.COMPLAINED,
    };

    return {
      id: crypto.randomUUID(),
      provider: WebhookProvider.AWS_SES,
      eventType: eventTypeMap[payload.eventType] || WebhookEventType.DELIVERED,
      timestamp: new Date(payload.mail.timestamp),
      messageId: payload.mail.messageId,
      recipient: payload.mail.destination[0],
      data: payload as Record<string, unknown>,
      verified: true,
    };
  }

  async processFCMEvent(payload: FCMWebhookPayload): Promise<WebhookEvent> {
    return {
      id: crypto.randomUUID(),
      provider: WebhookProvider.FCM,
      eventType: WebhookEventType.DELIVERED,
      timestamp: new Date(),
      messageId: payload.message_id,
      recipient: payload.from,
      data: payload,
      verified: true,
    };
  }

  // Update notification status based on webhook events
  async updateNotificationStatus(event: WebhookEvent): Promise<boolean> {
    try {
      // In a real implementation, this would update the database
      console.log(
        `Updating notification status for message ${event.messageId}:`,
        {
          eventType: event.eventType,
          provider: event.provider,
          timestamp: event.timestamp,
        }
      );

      // TODO: Implement database update logic
      // await this.notificationRepository.updateStatus(event.messageId, event.eventType);

      return true;
    } catch (error) {
      console.error('Failed to update notification status:', error);
      return false;
    }
  }

  async recordEngagementMetrics(event: WebhookEvent): Promise<boolean> {
    try {
      // In a real implementation, this would record metrics in the database
      console.log(
        `Recording engagement metrics for message ${event.messageId}:`,
        {
          eventType: event.eventType,
          provider: event.provider,
          timestamp: event.timestamp,
        }
      );

      // TODO: Implement metrics recording logic
      // await this.analyticsService.recordEngagement(event);

      return true;
    } catch (error) {
      console.error('Failed to record engagement metrics:', error);
      return false;
    }
  }
}
