/**
 * Webhook controller for handling provider callbacks and event triggers
 */

import crypto from 'crypto';
import { Request, Response } from 'express';
import { BusinessRuleEngineImpl } from '../services/business-rule-engine.service';
import { EventServiceImpl } from '../services/event.service';
import { WebhookServiceImpl } from '../services/webhook.service';
import {
  BusinessEvent,
  BusinessEventType,
  BusinessRule,
  WebhookProvider,
} from '../types/webhook.types';

export class WebhookController {
  private webhookService: WebhookServiceImpl;
  private eventService: EventServiceImpl;
  private ruleEngine: BusinessRuleEngineImpl;

  constructor() {
    this.webhookService = new WebhookServiceImpl();
    this.eventService = new EventServiceImpl();
    this.ruleEngine = new BusinessRuleEngineImpl();
  }

  // Provider webhook endpoints
  async handleSendGridWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers[
        'x-twilio-email-event-webhook-signature'
      ] as string;
      const events = Array.isArray(req.body) ? req.body : [req.body];

      const results = [];
      for (const event of events) {
        const result = await this.webhookService.processWebhookEvent(
          WebhookProvider.SENDGRID,
          event,
          signature
        );
        results.push(result);
      }

      res.status(200).json({
        success: true,
        processed: results.length,
        results: results.filter(r => !r.isValid).map(r => ({ error: r.error })),
      });
    } catch (error) {
      console.error('SendGrid webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async handleTwilioWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-twilio-signature'] as string;

      const result = await this.webhookService.processWebhookEvent(
        WebhookProvider.TWILIO,
        req.body,
        signature
      );

      if (result.isValid) {
        res.status(200).send('OK');
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Twilio webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async handleMailgunWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-mailgun-signature-256'] as string;

      const result = await this.webhookService.processWebhookEvent(
        WebhookProvider.MAILGUN,
        req.body,
        signature
      );

      if (result.isValid) {
        res.status(200).send('OK');
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('Mailgun webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async handleAWSWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-amz-sns-message-id'] as string;

      const result = await this.webhookService.processWebhookEvent(
        WebhookProvider.AWS_SES,
        req.body,
        signature
      );

      if (result.isValid) {
        res.status(200).send('OK');
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('AWS webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async handleFCMWebhook(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.webhookService.processWebhookEvent(
        WebhookProvider.FCM,
        req.body
      );

      if (result.isValid) {
        res.status(200).send('OK');
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error('FCM webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Business event endpoints
  async triggerBusinessEvent(req: Request, res: Response): Promise<void> {
    try {
      const { type, userId, source, data, metadata } = req.body;

      if (!type || !source) {
        res.status(400).json({
          success: false,
          error: 'Event type and source are required',
        });
        return;
      }

      const event: BusinessEvent = {
        id: crypto.randomUUID(),
        type: type as BusinessEventType,
        timestamp: new Date(),
        source,
        userId,
        data: data || {},
        metadata,
      };

      const result = await this.eventService.processBusinessEvent(event);

      res.status(200).json({
        success: true,
        eventId: event.id,
        result,
      });
    } catch (error) {
      console.error('Business event trigger error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async getEventHistory(req: Request, res: Response): Promise<void> {
    try {
      const {
        eventTypes,
        userId,
        source,
        startDate,
        endDate,
        limit = 100,
        offset = 0,
      } = req.query;

      const filters = {
        eventTypes: eventTypes ? String(eventTypes).split(',') : undefined,
        userId: userId as string,
        source: source as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      };

      const events = await this.eventService.getEventHistory(filters);
      const totalCount = await this.eventService.getEventCount(filters);

      res.status(200).json({
        success: true,
        data: events,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: totalCount,
          hasMore: filters.offset + filters.limit < totalCount,
        },
      });
    } catch (error) {
      console.error('Get event history error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async replayEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({
          success: false,
          error: 'Event ID is required',
        });
        return;
      }

      const result = await this.eventService.replayEvent(eventId);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error('Replay event error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  // Business rule management endpoints
  async createBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const ruleData = req.body;

      if (
        !ruleData.name ||
        !ruleData.eventType ||
        !ruleData.conditions ||
        !ruleData.actions
      ) {
        res.status(400).json({
          success: false,
          error: 'Name, eventType, conditions, and actions are required',
        });
        return;
      }

      const rule = await this.ruleEngine.createRule({
        name: ruleData.name,
        description: ruleData.description,
        eventType: ruleData.eventType,
        conditions: ruleData.conditions,
        actions: ruleData.actions,
        enabled: ruleData.enabled ?? true,
        priority: ruleData.priority ?? 5,
      });

      res.status(201).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      console.error('Create business rule error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;
      const updates = req.body;

      if (!ruleId) {
        res.status(400).json({
          success: false,
          error: 'Rule ID is required',
        });
        return;
      }

      const rule = await this.ruleEngine.updateRule(ruleId, updates);

      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      console.error('Update business rule error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async deleteBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;

      if (!ruleId) {
        res.status(400).json({
          success: false,
          error: 'Rule ID is required',
        });
        return;
      }

      const deleted = await this.ruleEngine.deleteRule(ruleId);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Rule deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
      }
    } catch (error) {
      console.error('Delete business rule error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async getBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;

      if (!ruleId) {
        res.status(400).json({
          success: false,
          error: 'Rule ID is required',
        });
        return;
      }

      const rule = await this.ruleEngine.getRule(ruleId);

      if (rule) {
        res.status(200).json({
          success: true,
          data: rule,
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
      }
    } catch (error) {
      console.error('Get business rule error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async listBusinessRules(req: Request, res: Response): Promise<void> {
    try {
      const {
        eventType,
        enabled,
        priority,
        createdAfter,
        limit = 100,
        offset = 0,
      } = req.query;

      const filters = {
        eventType: eventType as string,
        enabled: enabled ? enabled === 'true' : undefined,
        priority: priority ? parseInt(priority as string, 10) : undefined,
        createdAfter: createdAfter
          ? new Date(createdAfter as string)
          : undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      };

      const rules = await this.ruleEngine.listRules(filters);

      res.status(200).json({
        success: true,
        data: rules,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: rules.length,
        },
      });
    } catch (error) {
      console.error('List business rules error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async testBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;
      const { testEvent } = req.body;

      if (!ruleId || !testEvent) {
        res.status(400).json({
          success: false,
          error: 'Rule ID and test event are required',
        });
        return;
      }

      const rule = await this.ruleEngine.getRule(ruleId);
      if (!rule) {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
        return;
      }

      const result = await this.ruleEngine.testRule(rule, testEvent);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error('Test business rule error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async validateBusinessRule(req: Request, res: Response): Promise<void> {
    try {
      const rule = req.body as BusinessRule;

      if (!rule) {
        res.status(400).json({
          success: false,
          error: 'Rule data is required',
        });
        return;
      }

      const validation = await this.ruleEngine.validateRule(rule);

      res.status(200).json({
        success: true,
        validation,
      });
    } catch (error) {
      console.error('Validate business rule error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
