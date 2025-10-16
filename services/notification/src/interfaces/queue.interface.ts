/**
 * Queue management interfaces
 */

import {
  BulkQueueOperation,
  DeadLetterJob,
  FailedJob,
  JobProgress,
  JobStatus,
  ProcessingResult,
  QueueConfiguration,
  QueueHealthCheck,
  QueueMetrics,
  QueueStats,
  QueuedNotification,
  ScheduledNotification,
} from '../types';

export interface IQueueManager {
  // Queue operations
  enqueueNotification(notification: QueuedNotification): Promise<string>;
  enqueueScheduledNotification(
    notification: ScheduledNotification
  ): Promise<string>;
  enqueueBulkNotifications(
    notifications: QueuedNotification[]
  ): Promise<string[]>;

  // Processing control
  processQueue(queueName: string): Promise<ProcessingResult>;
  pauseQueue(queueName: string): Promise<boolean>;
  resumeQueue(queueName: string): Promise<boolean>;
  clearQueue(queueName: string): Promise<number>;

  // Queue monitoring
  getQueueStats(queueName?: string): Promise<QueueStats | QueueStats[]>;
  getQueueHealth(
    queueName?: string
  ): Promise<QueueHealthCheck | QueueHealthCheck[]>;
  getJobProgress(jobId: string): Promise<JobProgress>;
  getJobsByStatus(
    queueName: string,
    status: JobStatus,
    limit?: number
  ): Promise<QueuedNotification[]>;

  // Failed job management
  getFailedJobs(
    queueName: string,
    limit?: number,
    offset?: number
  ): Promise<FailedJob[]>;
  retryFailedJob(jobId: string): Promise<boolean>;
  retryAllFailedJobs(
    queueName: string
  ): Promise<{ retried: number; failed: number }>;
  removeFailedJob(jobId: string): Promise<boolean>;

  // Dead letter queue management
  getDeadLetterQueue(limit?: number, offset?: number): Promise<DeadLetterJob[]>;
  reprocessDeadLetterJob(jobId: string): Promise<boolean>;
  removeDeadLetterJob(jobId: string): Promise<boolean>;
  clearDeadLetterQueue(): Promise<number>;

  // Queue configuration
  createQueue(config: QueueConfiguration): Promise<boolean>;
  updateQueueConfig(
    queueName: string,
    config: Partial<QueueConfiguration>
  ): Promise<boolean>;
  deleteQueue(queueName: string): Promise<boolean>;
  getQueueConfig(queueName: string): Promise<QueueConfiguration>;
  listQueues(): Promise<QueueConfiguration[]>;

  // Bulk operations
  executeBulkOperation(
    operation: BulkQueueOperation
  ): Promise<{ affected: number; errors: string[] }>;

  // Metrics and monitoring
  getQueueMetrics(
    queueName: string,
    timeRange?: { start: Date; end: Date }
  ): Promise<QueueMetrics[]>;
  getSystemMetrics(): Promise<{
    totalQueues: number;
    totalJobs: number;
    activeJobs: number;
    failedJobs: number;
    throughput: number;
    averageLatency: number;
  }>;

  // Scheduled job management
  getScheduledJobs(
    limit?: number,
    offset?: number
  ): Promise<ScheduledNotification[]>;
  updateScheduledJob(
    jobId: string,
    updates: Partial<ScheduledNotification>
  ): Promise<boolean>;
  cancelScheduledJob(jobId: string): Promise<boolean>;

  // Event handling
  onJobCompleted(callback: (jobId: string, result: any) => void): void;
  onJobFailed(callback: (jobId: string, error: Error) => void): void;
  onQueueStalled(callback: (queueName: string) => void): void;
}
