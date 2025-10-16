import Bull, { Job, Queue } from 'bull';
import IORedis from 'ioredis';
import {
  JobStatus,
  QueueJobOptions,
  QueueManager,
  QueueName,
  QueueStats,
} from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { BackpressureConfig, QueueMetrics } from '../types/job.types';

export class QueueManagerService implements QueueManager {
  private queues: Map<string, Queue> = new Map();
  private redis: IORedis;
  private backpressureConfig: BackpressureConfig;

  constructor(redisUrl?: string) {
    this.redis = new IORedis(
      redisUrl || process.env.REDIS_URL || 'redis://localhost:6379'
    );

    this.backpressureConfig = {
      maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '10'),
      maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || '1000'),
      pauseThreshold: parseInt(process.env.PAUSE_THRESHOLD || '800'),
      resumeThreshold: parseInt(process.env.RESUME_THRESHOLD || '200'),
    };

    this.initializeQueues();
  }

  private initializeQueues(): void {
    // Initialize all queue types
    Object.values(QueueName).forEach(queueName => {
      this.createQueue(queueName);
    });
  }

  private createQueue(queueName: string): Queue {
    if (this.queues.has(queueName)) {
      return this.queues.get(queueName)!;
    }

    const queue = new Bull(queueName, {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      settings: {
        stalledInterval: 30 * 1000,
        maxStalledCount: 1,
      },
    });

    // Set up event listeners
    this.setupQueueEventListeners(queue, queueName);

    // Set up backpressure monitoring
    this.setupBackpressureMonitoring(queue, queueName);

    this.queues.set(queueName, queue);
    logger.info(`Queue ${queueName} initialized`);

    return queue;
  }

  private setupQueueEventListeners(queue: Queue, queueName: string): void {
    queue.on('completed', (job: Job) => {
      logger.info(`Job ${job.id} completed in queue ${queueName}`);
    });

    queue.on('failed', (job: Job, err: Error) => {
      logger.error(`Job ${job.id} failed in queue ${queueName}:`, err);
    });

    queue.on('stalled', (job: Job) => {
      logger.warn(`Job ${job.id} stalled in queue ${queueName}`);
    });

    queue.on('progress', (job: Job, progress: number) => {
      logger.debug(
        `Job ${job.id} progress: ${progress}% in queue ${queueName}`
      );
    });
  }

  private setupBackpressureMonitoring(queue: Queue, queueName: string): void {
    setInterval(async () => {
      try {
        const stats = await this.getQueueStats(queueName);
        const totalPending = stats.waiting + stats.delayed;

        // Implement backpressure
        if (
          totalPending >= this.backpressureConfig.pauseThreshold &&
          !stats.paused
        ) {
          logger.warn(
            `Queue ${queueName} approaching capacity, pausing new jobs`
          );
          await this.pauseQueue(queueName);
        } else if (
          totalPending <= this.backpressureConfig.resumeThreshold &&
          stats.paused
        ) {
          logger.info(`Queue ${queueName} capacity restored, resuming jobs`);
          await this.resumeQueue(queueName);
        }

        // Log metrics
        if (totalPending > 0) {
          logger.info(`Queue ${queueName} stats:`, {
            waiting: stats.waiting,
            active: stats.active,
            completed: stats.completed,
            failed: stats.failed,
            paused: stats.paused,
          });
        }
      } catch (error) {
        logger.error(`Error monitoring queue ${queueName}:`, error);
      }
    }, 30000); // Check every 30 seconds
  }

  async addJob<T>(
    queueName: string,
    jobData: T,
    options?: QueueJobOptions
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);

    // Check if queue is at capacity
    const stats = await this.getQueueStats(queueName);
    const totalPending = stats.waiting + stats.delayed + stats.active;

    if (totalPending >= this.backpressureConfig.maxQueueSize) {
      throw new Error(
        `Queue ${queueName} is at capacity (${totalPending} jobs)`
      );
    }

    const job = await queue.add(jobData, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
      attempts: options?.attempts || 3,
      backoff: options?.backoff || { type: 'exponential', delay: 2000 },
      removeOnComplete: options?.removeOnComplete || 100,
      removeOnFail: options?.removeOnFail || 50,
    });

    logger.info(`Job ${job.id} added to queue ${queueName}`);
    return job;
  }

  async getJob(queueName: string, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    return queue.getJob(jobId);
  }

  async getJobStatus(queueName: string, jobId: string): Promise<JobStatus> {
    const job = await this.getJob(queueName, jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    const state = await job.getState();
    return state as JobStatus;
  }

  async removeJob(queueName: string, jobId: string): Promise<boolean> {
    const job = await this.getJob(queueName, jobId);
    if (!job) {
      return false;
    }

    await job.remove();
    logger.info(`Job ${jobId} removed from queue ${queueName}`);
    return true;
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
    logger.info(`Queue ${queueName} paused`);
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
    logger.info(`Queue ${queueName} resumed`);
  }

  async getQueueStats(queueName: string): Promise<QueueStats> {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    const isPaused = await queue.isPaused();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      paused: isPaused,
    };
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const stats = await this.getQueueStats(queueName);
    const queue = this.getQueue(queueName);

    // Calculate metrics over the last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentCompleted = await queue.getJobs(['completed'], 0, -1, true);
    const recentFailed = await queue.getJobs(['failed'], 0, -1, true);

    const recentCompletedInHour = recentCompleted.filter(
      job => job.finishedOn && job.finishedOn > oneHourAgo
    );
    const recentFailedInHour = recentFailed.filter(
      job => job.finishedOn && job.finishedOn > oneHourAgo
    );

    const totalRecentJobs =
      recentCompletedInHour.length + recentFailedInHour.length;
    const avgProcessingTime =
      recentCompletedInHour.length > 0
        ? recentCompletedInHour.reduce((sum, job) => {
            return sum + (job.finishedOn! - job.processedOn!);
          }, 0) / recentCompletedInHour.length
        : 0;

    return {
      queueName,
      totalJobs:
        stats.waiting +
        stats.active +
        stats.completed +
        stats.failed +
        stats.delayed,
      activeJobs: stats.active,
      waitingJobs: stats.waiting,
      completedJobs: stats.completed,
      failedJobs: stats.failed,
      avgProcessingTime: Math.round(avgProcessingTime),
      throughput: totalRecentJobs, // jobs in the last hour
      errorRate:
        totalRecentJobs > 0
          ? (recentFailedInHour.length / totalRecentJobs) * 100
          : 0,
    };
  }

  getQueue(queueName: string): Queue {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    return queue;
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down queue manager...');

    const shutdownPromises = Array.from(this.queues.values()).map(
      async queue => {
        await queue.close();
      }
    );

    await Promise.all(shutdownPromises);
    await this.redis.disconnect();

    logger.info('Queue manager shutdown complete');
  }
}

// Singleton instance
export const queueManager = new QueueManagerService();
