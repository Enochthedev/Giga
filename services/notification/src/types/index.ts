/**
 * Central export file for all notification service types
 */

// Core notification types
export * from './notification.types';

// Template management types
export * from './template.types';

// User preference types
export * from './preference.types';

// Queue management types
export * from './queue.types';

// Provider integration types
export * from './provider.types';

// Analytics and tracking types
export * from './analytics.types';

// Webhook and event integration types
export * from './webhook.types';

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: Date;
  dependencies: DependencyHealth[];
  metrics?: {
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
    queueDepth: number;
  };
}

export interface DependencyHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastChecked: Date;
  error?: string;
}

export interface ServiceConfiguration {
  service: string;
  version: string;
  environment: string;
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxNotificationsPerMinute: number;
    maxTemplateSize: number;
    maxQueueSize: number;
    maxRetryAttempts: number;
  };
  providers: {
    email: string[];
    sms: string[];
    push: string[];
  };
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId?: string;
  serviceId: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: any[];
    properties?: ValidationSchema;
    items?: ValidationSchema;
  };
}
