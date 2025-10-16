/**
 * Unit tests for business rule engine
 */

import crypto from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessRuleEngineImpl } from '../services/business-rule-engine.service';
import {
  BusinessEvent,
  BusinessEventType,
  BusinessRule,
  DelayActionConfig,
  NotificationActionConfig,
  RuleCondition,
  WebhookActionConfig,
} from '../types/webhook.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('BusinessRuleEngine', () => {
  let ruleEngine: BusinessRuleEngineImpl;

  beforeEach(() => {
    ruleEngine = new BusinessRuleEngineImpl();
    vi.clearAllMocks();
  });

  describe('Rule Management', () => {
    it('should create a new business rule', async () => {
      const ruleData = {
        name: 'Welcome Email Rule',
        description: 'Send welcome email when user registers',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          {
            field: 'data.email',
            operator: 'exists' as const,
            value: true,
          },
        ],
        actions: [
          {
            type: 'send_notification' as const,
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

      const rule = await ruleEngine.createRule(ruleData);

      expect(rule.id).toBeDefined();
      expect(rule.name).toBe(ruleData.name);
      expect(rule.eventType).toBe(ruleData.eventType);
      expect(rule.createdAt).toBeDefined();
      expect(rule.updatedAt).toBeDefined();
    });

    it('should update an existing rule', async () => {
      const ruleData = {
        name: 'Test Rule',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          { field: 'userId', operator: 'exists' as const, value: true },
        ],
        actions: [
          {
            type: 'send_notification' as const,
            config: { templateId: 'test' },
          },
        ],
        enabled: true,
        priority: 5,
      };

      const rule = await ruleEngine.createRule(ruleData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const updates = {
        name: 'Updated Test Rule',
        enabled: false,
        priority: 8,
      };

      const updatedRule = await ruleEngine.updateRule(rule.id, updates);

      expect(updatedRule.name).toBe(updates.name);
      expect(updatedRule.enabled).toBe(false);
      expect(updatedRule.priority).toBe(8);
      expect(updatedRule.id).toBe(rule.id);
      expect(updatedRule.createdAt).toEqual(rule.createdAt);
      expect(updatedRule.updatedAt).not.toEqual(rule.updatedAt);
    });

    it('should delete a rule', async () => {
      const ruleData = {
        name: 'Test Rule',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          { field: 'userId', operator: 'exists' as const, value: true },
        ],
        actions: [
          {
            type: 'send_notification' as const,
            config: { templateId: 'test' },
          },
        ],
        enabled: true,
        priority: 5,
      };

      const rule = await ruleEngine.createRule(ruleData);

      const deleted = await ruleEngine.deleteRule(rule.id);
      expect(deleted).toBe(true);

      const retrieved = await ruleEngine.getRule(rule.id);
      expect(retrieved).toBeNull();
    });

    it('should list rules with filters', async () => {
      const rule1Data = {
        name: 'User Rule',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          { field: 'userId', operator: 'exists' as const, value: true },
        ],
        actions: [
          {
            type: 'send_notification' as const,
            config: { templateId: 'user' },
          },
        ],
        enabled: true,
        priority: 5,
      };

      const rule2Data = {
        name: 'Order Rule',
        eventType: BusinessEventType.ORDER_CREATED,
        conditions: [
          { field: 'orderId', operator: 'exists' as const, value: true },
        ],
        actions: [
          {
            type: 'send_notification' as const,
            config: { templateId: 'order' },
          },
        ],
        enabled: false,
        priority: 8,
      };

      await ruleEngine.createRule(rule1Data);
      await ruleEngine.createRule(rule2Data);

      // Filter by event type
      const userRules = await ruleEngine.listRules({
        eventType: BusinessEventType.USER_REGISTERED,
      });
      expect(userRules).toHaveLength(1);
      expect(userRules[0].name).toBe('User Rule');

      // Filter by enabled status
      const enabledRules = await ruleEngine.listRules({
        enabled: true,
      });
      expect(enabledRules).toHaveLength(1);
      expect(enabledRules[0].name).toBe('User Rule');

      // Filter by priority
      const highPriorityRules = await ruleEngine.listRules({
        priority: 8,
      });
      expect(highPriorityRules).toHaveLength(1);
      expect(highPriorityRules[0].name).toBe('Order Rule');
    });
  });

  describe('Rule Validation', () => {
    it('should validate a correct rule', async () => {
      const rule: BusinessRule = {
        id: crypto.randomUUID(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validation = await ruleEngine.validateRule(rule);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid rule fields', async () => {
      const rule: BusinessRule = {
        id: crypto.randomUUID(),
        name: '', // Empty name
        eventType: '' as any, // Empty event type
        conditions: [], // Empty conditions
        actions: [], // Empty actions
        enabled: true,
        priority: 15, // Invalid priority
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validation = await ruleEngine.validateRule(rule);

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should validate conditions format', async () => {
      const validConditions: RuleCondition[] = [
        {
          field: 'data.email',
          operator: 'exists',
          value: true,
        },
        {
          field: 'data.age',
          operator: 'greater_than',
          value: 18,
          logicalOperator: 'AND',
        },
      ];

      const isValid = await ruleEngine.validateConditions(validConditions);
      expect(isValid).toBe(true);
    });

    it('should reject invalid conditions', async () => {
      const invalidConditions: RuleCondition[] = [
        {
          field: '', // Empty field
          operator: 'invalid_operator' as any,
          value: true,
        },
      ];

      const isValid = await ruleEngine.validateConditions(invalidConditions);
      expect(isValid).toBe(false);
    });
  });

  describe('Rule Evaluation', () => {
    it('should evaluate simple condition correctly', async () => {
      const rule: BusinessRule = {
        id: crypto.randomUUID(),
        name: 'Email Exists Rule',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.USER_REGISTERED,
        timestamp: new Date(),
        source: 'auth-service',
        userId: 'user-123',
        data: {
          email: 'test@example.com',
          firstName: 'Test',
        },
      };

      const result = await ruleEngine.evaluateRule(rule, event);

      expect(result.matched).toBe(true);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].success).toBe(true);
    });

    it('should evaluate complex conditions with logical operators', async () => {
      const rule: BusinessRule = {
        id: crypto.randomUUID(),
        name: 'Complex Rule',
        eventType: BusinessEventType.ORDER_CREATED,
        conditions: [
          {
            field: 'data.total',
            operator: 'greater_than',
            value: 100,
          },
          {
            field: 'data.currency',
            operator: 'equals',
            value: 'USD',
            logicalOperator: 'AND',
          },
          {
            field: 'data.customerType',
            operator: 'equals',
            value: 'premium',
            logicalOperator: 'OR',
          },
        ],
        actions: [
          {
            type: 'send_notification',
            config: {
              templateId: 'order-confirmation',
              channels: ['email'],
            },
          },
        ],
        enabled: true,
        priority: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Test case 1: Should match (total > 100 AND currency = USD)
      const event1: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.ORDER_CREATED,
        timestamp: new Date(),
        source: 'ecommerce-service',
        userId: 'user-123',
        data: {
          total: 150,
          currency: 'USD',
          customerType: 'regular',
        },
      };

      const result1 = await ruleEngine.evaluateRule(rule, event1);
      expect(result1.matched).toBe(true);

      // Test case 2: Should match (customerType = premium, even if other conditions fail)
      const event2: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.ORDER_CREATED,
        timestamp: new Date(),
        source: 'ecommerce-service',
        userId: 'user-123',
        data: {
          total: 50,
          currency: 'EUR',
          customerType: 'premium',
        },
      };

      const result2 = await ruleEngine.evaluateRule(rule, event2);
      expect(result2.matched).toBe(true);

      // Test case 3: Should not match
      const event3: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.ORDER_CREATED,
        timestamp: new Date(),
        source: 'ecommerce-service',
        userId: 'user-123',
        data: {
          total: 50,
          currency: 'EUR',
          customerType: 'regular',
        },
      };

      const result3 = await ruleEngine.evaluateRule(rule, event3);
      expect(result3.matched).toBe(false);
    });

    it('should test rule without executing actions', async () => {
      const rule: BusinessRule = {
        id: crypto.randomUUID(),
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
        enabled: true,
        priority: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const testEvent: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.USER_REGISTERED,
        timestamp: new Date(),
        source: 'auth-service',
        userId: 'user-123',
        data: {
          email: 'test@example.com',
        },
      };

      const result = await ruleEngine.testRule(rule, testEvent);

      expect(result.matched).toBe(true);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].result).toEqual({ simulated: true });
    });
  });

  describe('Action Execution', () => {
    it('should execute notification action', async () => {
      const config: NotificationActionConfig = {
        templateId: 'welcome-email',
        channels: ['email'],
        priority: 'normal',
        variables: { firstName: 'Test' },
      };

      const event: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.USER_REGISTERED,
        timestamp: new Date(),
        source: 'auth-service',
        userId: 'user-123',
        data: {
          email: 'test@example.com',
          firstName: 'Test',
        },
      };

      const result = await ruleEngine.executeNotificationAction(config, event);

      expect(result.messageId).toBeDefined();
      expect(result.status).toBe('sent');
    });

    it('should execute delay action', async () => {
      const config: DelayActionConfig = {
        duration: 100, // 100ms
      };

      const startTime = Date.now();
      const result = await ruleEngine.executeDelayAction(config);
      const endTime = Date.now();

      expect(result.delayed).toBe(100);
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it('should execute webhook action', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        text: vi.fn().mockResolvedValue('Success'),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: WebhookActionConfig = {
        url: 'https://example.com/webhook',
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
        payload: { message: 'test' },
      };

      const event: BusinessEvent = {
        id: crypto.randomUUID(),
        type: BusinessEventType.USER_REGISTERED,
        timestamp: new Date(),
        source: 'auth-service',
        userId: 'user-123',
        data: {},
      };

      const result = await ruleEngine.executeWebhookAction(config, event);

      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(global.fetch).toHaveBeenCalledWith(
        config.url,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          }),
        })
      );
    });

    it('should validate action configurations', async () => {
      // Valid notification action
      const validNotificationConfig = {
        templateId: 'welcome-email',
        channels: ['email'],
      };
      expect(
        await ruleEngine.validateActionConfig(
          'send_notification',
          validNotificationConfig
        )
      ).toBe(true);

      // Invalid notification action (missing both templateId and channels)
      const invalidNotificationConfig = {
        priority: 'high',
      };
      expect(
        await ruleEngine.validateActionConfig(
          'send_notification',
          invalidNotificationConfig
        )
      ).toBe(false);

      // Valid delay action
      const validDelayConfig = {
        duration: 1000,
      };
      expect(
        await ruleEngine.validateActionConfig('delay', validDelayConfig)
      ).toBe(true);

      // Invalid delay action (negative duration)
      const invalidDelayConfig = {
        duration: -1000,
      };
      expect(
        await ruleEngine.validateActionConfig('delay', invalidDelayConfig)
      ).toBe(false);

      // Valid webhook action
      const validWebhookConfig = {
        url: 'https://example.com/webhook',
        method: 'POST',
      };
      expect(
        await ruleEngine.validateActionConfig('webhook', validWebhookConfig)
      ).toBe(true);

      // Invalid webhook action (missing URL)
      const invalidWebhookConfig = {
        method: 'POST',
      };
      expect(
        await ruleEngine.validateActionConfig('webhook', invalidWebhookConfig)
      ).toBe(false);

      // Unknown action type
      expect(await ruleEngine.validateActionConfig('unknown_action', {})).toBe(
        false
      );
    });
  });

  describe('Condition Operators', () => {
    const testEvent: BusinessEvent = {
      id: crypto.randomUUID(),
      type: BusinessEventType.USER_REGISTERED,
      timestamp: new Date(),
      source: 'auth-service',
      userId: 'user-123',
      data: {
        email: 'test@example.com',
        age: 25,
        tags: ['premium', 'verified'],
        profile: {
          firstName: 'Test',
          lastName: 'User',
        },
      },
    };

    it('should evaluate equals operator', async () => {
      const rule = await ruleEngine.createRule({
        name: 'Equals Test',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [{ field: 'data.age', operator: 'equals', value: 25 }],
        actions: [
          { type: 'send_notification', config: { templateId: 'test' } },
        ],
        enabled: true,
        priority: 5,
      });

      const result = await ruleEngine.evaluateRule(rule, testEvent);
      expect(result.matched).toBe(true);
    });

    it('should evaluate contains operator', async () => {
      const rule = await ruleEngine.createRule({
        name: 'Contains Test',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          { field: 'data.email', operator: 'contains', value: '@example.com' },
        ],
        actions: [
          { type: 'send_notification', config: { templateId: 'test' } },
        ],
        enabled: true,
        priority: 5,
      });

      const result = await ruleEngine.evaluateRule(rule, testEvent);
      expect(result.matched).toBe(true);
    });

    it('should evaluate greater_than operator', async () => {
      const rule = await ruleEngine.createRule({
        name: 'Greater Than Test',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          { field: 'data.age', operator: 'greater_than', value: 18 },
        ],
        actions: [
          { type: 'send_notification', config: { templateId: 'test' } },
        ],
        enabled: true,
        priority: 5,
      });

      const result = await ruleEngine.evaluateRule(rule, testEvent);
      expect(result.matched).toBe(true);
    });

    it('should evaluate in operator', async () => {
      const rule = await ruleEngine.createRule({
        name: 'In Test',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          {
            field: 'data.email',
            operator: 'in',
            value: ['test@example.com', 'admin@example.com'],
          },
        ],
        actions: [
          { type: 'send_notification', config: { templateId: 'test' } },
        ],
        enabled: true,
        priority: 5,
      });

      const result = await ruleEngine.evaluateRule(rule, testEvent);
      expect(result.matched).toBe(true);
    });

    it('should evaluate nested field paths', async () => {
      const rule = await ruleEngine.createRule({
        name: 'Nested Field Test',
        eventType: BusinessEventType.USER_REGISTERED,
        conditions: [
          {
            field: 'data.profile.firstName',
            operator: 'equals',
            value: 'Test',
          },
        ],
        actions: [
          { type: 'send_notification', config: { templateId: 'test' } },
        ],
        enabled: true,
        priority: 5,
      });

      const result = await ruleEngine.evaluateRule(rule, testEvent);
      expect(result.matched).toBe(true);
    });
  });
});
