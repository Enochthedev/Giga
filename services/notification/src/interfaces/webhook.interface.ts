/**
 * Webhook and event integration interfaces
 */

import {
  BusinessEvent,
  BusinessRule,
  EventHistoryFilters,
  EventProcessingResult,
  RuleEvaluationResult,
  RuleFilters,
  RuleValidationResult,
  WebhookConfig,
  WebhookDelivery,
  WebhookEvent,
  WebhookValidationResult,
} from '../types/webhook.types';

export interface WebhookService {
  // Webhook endpoint management
  registerWebhook(config: WebhookConfig): Promise<string>;
  updateWebhook(
    webhookId: string,
    config: Partial<WebhookConfig>
  ): Promise<boolean>;
  deleteWebhook(webhookId: string): Promise<boolean>;
  getWebhook(webhookId: string): Promise<WebhookConfig | null>;
  listWebhooks(): Promise<WebhookConfig[]>;

  // Webhook event processing
  processWebhookEvent(
    provider: string,
    payload: any,
    signature?: string
  ): Promise<WebhookValidationResult>;
  validateWebhookSignature(
    provider: string,
    payload: string,
    signature: string
  ): Promise<boolean>;

  // Webhook delivery (outgoing)
  deliverWebhook(delivery: WebhookDelivery): Promise<boolean>;
  retryFailedWebhook(deliveryId: string): Promise<boolean>;
  getWebhookDeliveryStatus(deliveryId: string): Promise<WebhookDelivery | null>;
}

export interface EventService {
  // Event processing
  processBusinessEvent(event: BusinessEvent): Promise<EventProcessingResult>;
  publishEvent(event: BusinessEvent): Promise<boolean>;
  subscribeToEvents(
    eventTypes: string[],
    handler: EventHandler
  ): Promise<string>;
  unsubscribeFromEvents(subscriptionId: string): Promise<boolean>;

  // Event history and replay
  getEventHistory(filters: EventHistoryFilters): Promise<BusinessEvent[]>;
  replayEvent(eventId: string): Promise<EventProcessingResult>;
}

export interface BusinessRuleEngine {
  // Rule management
  createRule(
    rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BusinessRule>;
  updateRule(
    ruleId: string,
    updates: Partial<BusinessRule>
  ): Promise<BusinessRule>;
  deleteRule(ruleId: string): Promise<boolean>;
  getRule(ruleId: string): Promise<BusinessRule | null>;
  listRules(filters?: RuleFilters): Promise<BusinessRule[]>;

  // Rule evaluation
  evaluateRules(event: BusinessEvent): Promise<RuleEvaluationResult[]>;
  evaluateRule(
    rule: BusinessRule,
    event: BusinessEvent
  ): Promise<RuleEvaluationResult>;
  testRule(
    rule: BusinessRule,
    testEvent: BusinessEvent
  ): Promise<RuleEvaluationResult>;

  // Rule validation
  validateRule(rule: BusinessRule): Promise<RuleValidationResult>;
  validateConditions(conditions: any[]): Promise<boolean>;
}

export interface WebhookValidator {
  // Provider-specific validation
  validateSendGridWebhook(
    payload: string,
    signature: string,
    timestamp: string
  ): Promise<boolean>;
  validateTwilioWebhook(
    payload: string,
    signature: string,
    url: string
  ): Promise<boolean>;
  validateMailgunWebhook(
    payload: string,
    signature: string,
    timestamp: string
  ): Promise<boolean>;
  validateAWSWebhook(payload: string, signature: string): Promise<boolean>;

  // Generic validation
  validateHMACSignature(
    payload: string,
    signature: string,
    secret: string,
    algorithm: string
  ): Promise<boolean>;
  validateTimestamp(timestamp: string, toleranceSeconds: number): boolean;
}

export interface EventHandler {
  (event: BusinessEvent): Promise<void>;
}

export interface WebhookEventProcessor {
  // Process incoming webhook events
  processSendGridEvent(payload: any): Promise<WebhookEvent>;
  processTwilioEvent(payload: any): Promise<WebhookEvent>;
  processMailgunEvent(payload: any): Promise<WebhookEvent>;
  processAWSEvent(payload: any): Promise<WebhookEvent>;
  processFCMEvent(payload: any): Promise<WebhookEvent>;

  // Update notification status based on webhook events
  updateNotificationStatus(event: WebhookEvent): Promise<boolean>;
  recordEngagementMetrics(event: WebhookEvent): Promise<boolean>;
}

export interface EventStore {
  // Event persistence
  saveEvent(event: BusinessEvent): Promise<string>;
  getEvent(eventId: string): Promise<BusinessEvent | null>;
  getEvents(filters: EventHistoryFilters): Promise<BusinessEvent[]>;
  deleteEvent(eventId: string): Promise<boolean>;

  // Event streaming
  streamEvents(filters: EventHistoryFilters): AsyncIterable<BusinessEvent>;
  getEventCount(filters: EventHistoryFilters): Promise<number>;
}

export interface RuleActionExecutor {
  // Execute different types of rule actions
  executeNotificationAction(config: any, event: BusinessEvent): Promise<any>;
  executeDelayAction(config: any): Promise<any>;
  executeWebhookAction(config: any, event: BusinessEvent): Promise<any>;
  executePreferenceAction(config: any, event: BusinessEvent): Promise<unknown>;

  // Action validation
  validateActionConfig(actionType: string, config: unknown): Promise<boolean>;
}
