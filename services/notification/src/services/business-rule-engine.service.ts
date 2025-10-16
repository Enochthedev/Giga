/**
 * Business rule engine for evaluating notification triggers and conditions
 */

import crypto from 'crypto';
import {
  BusinessRuleEngine,
  RuleActionExecutor,
} from '../interfaces/webhook.interface';
import {
  BusinessEvent,
  BusinessRule,
  DelayActionConfig,
  NotificationActionConfig,
  PreferenceActionConfig,
  RuleAction,
  RuleActionResult,
  RuleCondition,
  RuleEvaluationResult,
  RuleFilters,
  RuleValidationResult,
  WebhookActionConfig,
} from '../types/webhook.types';

export class BusinessRuleEngineImpl
  implements BusinessRuleEngine, RuleActionExecutor
{
  private rules: Map<string, BusinessRule> = new Map();

  // Rule management
  async createRule(
    rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BusinessRule> {
    const newRule: BusinessRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate the rule before creating
    const validation = await this.validateRule(newRule);
    if (!validation.isValid) {
      throw new Error(`Invalid rule: ${validation.errors.join(', ')}`);
    }

    this.rules.set(newRule.id, newRule);
    return newRule;
  }

  async updateRule(
    ruleId: string,
    updates: Partial<BusinessRule>
  ): Promise<BusinessRule> {
    const existingRule = this.rules.get(ruleId);
    if (!existingRule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }

    const updatedRule: BusinessRule = {
      ...existingRule,
      ...updates,
      id: ruleId, // Ensure ID doesn't change
      createdAt: existingRule.createdAt, // Preserve creation date
      updatedAt: new Date(),
    };

    // Validate the updated rule
    const validation = await this.validateRule(updatedRule);
    if (!validation.isValid) {
      throw new Error(`Invalid rule update: ${validation.errors.join(', ')}`);
    }

    this.rules.set(ruleId, updatedRule);
    return updatedRule;
  }

  async deleteRule(ruleId: string): Promise<boolean> {
    return this.rules.delete(ruleId);
  }

  async getRule(ruleId: string): Promise<BusinessRule | null> {
    return this.rules.get(ruleId) || null;
  }

  async listRules(filters?: RuleFilters): Promise<BusinessRule[]> {
    let rules = Array.from(this.rules.values());

    if (filters) {
      if (filters.eventType) {
        rules = rules.filter(rule => rule.eventType === filters.eventType);
      }

      if (filters.enabled !== undefined) {
        rules = rules.filter(rule => rule.enabled === filters.enabled);
      }

      if (filters.priority !== undefined) {
        rules = rules.filter(rule => rule.priority === filters.priority);
      }

      if (filters.createdAfter) {
        rules = rules.filter(rule => rule.createdAt >= filters.createdAfter!);
      }
    }

    // Sort by priority (higher priority first)
    rules.sort((a, b) => b.priority - a.priority);

    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 100;

    return rules.slice(offset, offset + limit);
  }

  // Rule evaluation
  async evaluateRules(event: BusinessEvent): Promise<RuleEvaluationResult[]> {
    const results: RuleEvaluationResult[] = [];

    // Get all enabled rules for this event type
    const relevantRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled && rule.eventType === event.type)
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    for (const rule of relevantRules) {
      const result = await this.evaluateRule(rule, event);
      results.push(result);
    }

    return results;
  }

  async evaluateRule(
    rule: BusinessRule,
    event: BusinessEvent
  ): Promise<RuleEvaluationResult> {
    const startTime = Date.now();
    const actions: RuleActionResult[] = [];

    try {
      // Evaluate conditions
      const conditionsMatch = await this.evaluateConditions(
        rule.conditions,
        event
      );

      if (conditionsMatch) {
        // Execute actions
        for (const action of rule.actions) {
          const actionResult = await this.executeAction(action, event);
          actions.push(actionResult);
        }
      }

      return {
        ruleId: rule.id,
        matched: conditionsMatch,
        actions,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        matched: false,
        actions,
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async testRule(
    rule: BusinessRule,
    testEvent: BusinessEvent
  ): Promise<RuleEvaluationResult> {
    // Test rule without executing actions
    const startTime = Date.now();

    try {
      const conditionsMatch = await this.evaluateConditions(
        rule.conditions,
        testEvent
      );

      // Simulate action execution without actually executing
      const actions: RuleActionResult[] = rule.actions.map(action => ({
        actionType: action.type,
        success: true,
        result: { simulated: true },
        executionTime: 0,
      }));

      return {
        ruleId: rule.id,
        matched: conditionsMatch,
        actions,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        matched: false,
        actions: [],
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Rule validation
  async validateRule(rule: BusinessRule): Promise<RuleValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate basic fields
    if (!rule.name || rule.name.trim().length === 0) {
      errors.push('Rule name is required');
    }

    if (!rule.eventType) {
      errors.push('Event type is required');
    }

    if (!rule.conditions || rule.conditions.length === 0) {
      errors.push('At least one condition is required');
    }

    if (!rule.actions || rule.actions.length === 0) {
      errors.push('At least one action is required');
    }

    // Validate conditions
    if (rule.conditions) {
      const conditionsValid = await this.validateConditions(rule.conditions);
      if (!conditionsValid) {
        errors.push('Invalid conditions format');
      }
    }

    // Validate actions
    if (rule.actions) {
      for (const action of rule.actions) {
        const actionValid = await this.validateActionConfig(
          action.type,
          action.config
        );
        if (!actionValid) {
          errors.push(`Invalid action configuration for type: ${action.type}`);
        }
      }
    }

    // Warnings
    if (rule.priority < 1 || rule.priority > 10) {
      warnings.push('Priority should be between 1 and 10');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async validateConditions(conditions: RuleCondition[]): Promise<boolean> {
    try {
      for (const condition of conditions) {
        if (!condition.field || !condition.operator) {
          return false;
        }

        // Validate operator
        const validOperators = [
          'equals',
          'not_equals',
          'contains',
          'not_contains',
          'greater_than',
          'less_than',
          'in',
          'not_in',
          'exists',
          'not_exists',
        ];
        if (!validOperators.includes(condition.operator)) {
          return false;
        }

        // Validate logical operator if present
        if (
          condition.logicalOperator &&
          !['AND', 'OR'].includes(condition.logicalOperator)
        ) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Private helper methods
  private async evaluateConditions(
    conditions: RuleCondition[],
    event: BusinessEvent
  ): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    let result = this.evaluateCondition(conditions[0], event);

    for (let i = 1; i < conditions.length; i++) {
      const condition = conditions[i];
      const conditionResult = this.evaluateCondition(condition, event);
      const logicalOperator = condition.logicalOperator || 'AND';

      if (logicalOperator === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }
    }

    return result;
  }

  private evaluateCondition(
    condition: RuleCondition,
    event: BusinessEvent
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, event);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'not_contains':
        return !String(fieldValue).includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'in':
        return (
          Array.isArray(condition.value) && condition.value.includes(fieldValue)
        );
      case 'not_in':
        return (
          Array.isArray(condition.value) &&
          !condition.value.includes(fieldValue)
        );
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return false;
    }
  }

  private getFieldValue(field: string, event: BusinessEvent): any {
    const parts = field.split('.');
    let value: any = event;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private async executeAction(
    action: RuleAction,
    event: BusinessEvent
  ): Promise<RuleActionResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (action.type) {
        case 'send_notification':
          result = await this.executeNotificationAction(
            action.config as NotificationActionConfig,
            event
          );
          break;
        case 'delay':
          result = await this.executeDelayAction(
            action.config as DelayActionConfig
          );
          break;
        case 'webhook':
          result = await this.executeWebhookAction(
            action.config as WebhookActionConfig,
            event
          );
          break;
        case 'update_preference':
          result = await this.executePreferenceAction(
            action.config as PreferenceActionConfig,
            event
          );
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      return {
        actionType: action.type,
        success: true,
        result,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        actionType: action.type,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  // Action executors
  async executeNotificationAction(
    config: NotificationActionConfig,
    event: BusinessEvent
  ): Promise<any> {
    // In a real implementation, this would call the notification service
    console.log('Executing notification action:', {
      templateId: config.templateId,
      channels: config.channels,
      priority: config.priority,
      userId: event.userId,
      eventData: event.data,
    });

    // Simulate delay if configured
    if (config.delay && config.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.delay));
    }

    // TODO: Integrate with actual notification service
    // return await this.notificationService.sendNotification({
    //   userId: event.userId,
    //   templateId: config.templateId,
    //   channels: config.channels,
    //   priority: config.priority,
    //   variables: { ...event.data, ...config.variables },
    // });

    return { messageId: crypto.randomUUID(), status: 'sent' };
  }

  async executeDelayAction(config: DelayActionConfig): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, config.duration));
    return { delayed: config.duration };
  }

  async executeWebhookAction(
    config: WebhookActionConfig,
    event: BusinessEvent
  ): Promise<any> {
    const payload = {
      ...config.payload,
      event,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(config.url, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(payload),
    });

    return {
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    };
  }

  async executePreferenceAction(
    config: PreferenceActionConfig,
    event: BusinessEvent
  ): Promise<any> {
    // In a real implementation, this would update user preferences
    console.log('Executing preference action:', {
      userId: config.userId || event.userId,
      updates: config.updates,
    });

    // TODO: Integrate with preference service
    // return await this.preferenceService.updatePreferences(
    //   config.userId || event.userId,
    //   config.updates
    // );

    return { updated: true };
  }

  // Action validation
  async validateActionConfig(
    actionType: string,
    config: any
  ): Promise<boolean> {
    try {
      switch (actionType) {
        case 'send_notification': {
          const notificationConfig = config as NotificationActionConfig;
          return !!(
            notificationConfig.templateId || notificationConfig.channels
          );
        }
        case 'delay': {
          const delayConfig = config as DelayActionConfig;
          return (
            typeof delayConfig.duration === 'number' && delayConfig.duration > 0
          );
        }
        case 'webhook': {
          const webhookConfig = config as WebhookActionConfig;
          return !!(webhookConfig.url && webhookConfig.method);
        }
        case 'update_preference': {
          const preferenceConfig = config as PreferenceActionConfig;
          return !!(
            preferenceConfig.updates &&
            typeof preferenceConfig.updates === 'object'
          );
        }
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}
