/**
 * Queue management types and interfaces
 */

import {
  NotificationPriority,
  NotificationRequest,
} from './notification.types';

export interface QueuedNotification {
  id: string;
  notificationRequest: NotificationRequest;
  queueName: string;
  priority: NotificationPriority;
  attempts: number;
  maxAttempts: number;
  delay?: number;
  backoffMultiplier: number;
  createdAt: Date;
  scheduledAt?: Date;
  processAfter?: Date;
  metadata?: Record<string, any>;
}

export interface ScheduledNotification extends QueuedNotification {
  scheduledAt: Date;
  timezone?: string;
  recurring?: RecurringSchedule;
  nextExecution?: Date;
}

export interface RecurringSchedule {
  pattern: 'daily' | 'weekly' | 'monthly' | 'cron';
  cronExpression?: string;
  endDate?: Date;
  maxOccurrences?: number;
  currentOccurrence: number;
}

export interface ProcessingResult {
  queueName: string;
  processedCount: number;
  successCount: number;
  failureCount: number;
  processingTime: number;
  errors: QueueError[];
}

export interface QueueStats {
  queueName: string;
  totalJobs: number;
  activeJobs: number;
  waitingJobs: number;
  completedJobs: number;
  failedJobs: number;
  delayedJobs: number;
  pausedJobs: number;
  processingRate: number; // jobs per minute
  averageProcessingTime: number; // milliseconds
  lastProcessedAt?: Date;
}

export interface FailedJob {
  id: string;
  queueName: string;
  notificationRequest: NotificationRequest;
  attempts: number;
  maxAttempts: number;
  lastError: QueueError;
  failedAt: Date;
  canRetry: boolean;
}

export interface DeadLetterJob {
  id: string;
  originalQueueName: string;
  notificationRequest: NotificationRequest;
  totalAttempts: number;
  errors: QueueError[];
  movedToDeadLetterAt: Date;
  canReprocess: boolean;
}

export interface QueueError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  retryable: boolean;
}

export interface QueueConfiguration {
  name: string;
  concurrency: number;
  maxAttempts: number;
  backoffSettings: BackoffSettings;
  rateLimiting?: RateLimitSettings;
  priority: boolean;
  delayedProcessing: boolean;
}

export interface BackoffSettings {
  type: 'fixed' | 'exponential' | 'linear';
  delay: number; // milliseconds
  multiplier?: number;
  maxDelay?: number;
  jitter?: boolean;
}

export interface RateLimitSettings {
  maxConcurrent: number;
  duration: number; // milliseconds
  maxPerDuration: number;
}

export interface QueueMetrics {
  queueName: string;
  timestamp: Date;
  metrics: {
    throughput: number; // jobs per second
    latency: number; // average processing time in ms
    errorRate: number; // percentage
    queueDepth: number;
    processingTime: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
}

export interface JobProgress {
  jobId: string;
  queueName: string;
  status: JobStatus;
  progress: number; // 0-100
  currentStep?: string;
  totalSteps?: number;
  startedAt?: Date;
  estimatedCompletion?: Date;
  result?: any;
  error?: QueueError;
}

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export interface QueueHealthCheck {
  queueName: string;
  isHealthy: boolean;
  issues: string[];
  metrics: {
    queueDepth: number;
    processingRate: number;
    errorRate: number;
    oldestJob?: Date;
  };
  checkedAt: Date;
}

export interface BulkQueueOperation {
  operation: 'pause' | 'resume' | 'clear' | 'retry';
  queueNames: string[];
  filters?: {
    status?: JobStatus[];
    priority?: NotificationPriority[];
    olderThan?: Date;
  };
}

export interface QueueEvent {
  eventType:
    | 'job.added'
    | 'job.started'
    | 'job.completed'
    | 'job.failed'
    | 'queue.paused'
    | 'queue.resumed';
  queueName: string;
  jobId?: string;
  timestamp: Date;
  data?: Record<string, any>;
}
