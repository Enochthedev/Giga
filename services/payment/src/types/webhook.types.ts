export type WebhookEventType =
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.refunded'
  | 'payment.disputed'
  | 'payment_method.created'
  | 'payment_method.updated'
  | 'payment_method.deleted'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.trial_will_end'
  | 'invoice.created'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'invoice.upcoming'
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted';

export type WebhookStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'retrying';

export interface WebhookEndpoint {
  id: string;
  url: string;
  description?: string;

  // Events
  enabledEvents: WebhookEventType[];

  // Security
  secret: string;

  // Status
  isActive: boolean;

  // Retry configuration
  retryConfig: {
    maxRetries: number;
    retryDelays: number[]; // seconds
    backoffMultiplier: number;
  };

  // Filtering
  filters?: WebhookFilter[];

  // Metadata
  metadata?: Record<string, any>;

  // Statistics
  stats?: {
    totalSent: number;
    totalSucceeded: number;
    totalFailed: number;
    lastSuccessAt?: Date;
    lastFailureAt?: Date;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;

  // Source
  gatewayId?: string;
  gatewayEventId?: string;

  // Data
  data: {
    object: Record<string, any>;
    previousAttributes?: Record<string, any>;
  };

  // Context
  livemode: boolean;
  apiVersion?: string;

  // Processing
  processed: boolean;
  processedAt?: Date;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookEndpointId: string;
  webhookEventId: string;

  // Request details
  url: string;
  httpMethod: string;
  headers: Record<string, string>;
  payload: string;

  // Response details
  status: WebhookStatus;
  httpStatusCode?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;

  // Timing
  sentAt: Date;
  respondedAt?: Date;
  duration?: number;

  // Retry information
  attemptNumber: number;
  nextRetryAt?: Date;

  // Error details
  errorMessage?: string;
  errorCode?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface WebhookSignature {
  timestamp: number;
  signature: string;
  algorithm: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  errorMessage?: string;
  timestamp?: number;
}

export interface WebhookRetryPolicy {
  maxRetries: number;
  initialDelay: number; // seconds
  maxDelay: number; // seconds
  backoffMultiplier: number;
  jitter: boolean;
}

export interface WebhookStats {
  endpointId: string;
  period: {
    start: Date;
    end: Date;
  };

  // Delivery stats
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  successRate: number;

  // Response time stats
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;

  // Error breakdown
  errorBreakdown: Record<string, number>;

  // Event type breakdown
  eventTypeBreakdown: Record<WebhookEventType, number>;
}
