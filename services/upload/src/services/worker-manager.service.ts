import { QueueName } from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { fileValidationWorker } from '../workers/file-validation.worker';
import { imageProcessingWorker } from '../workers/image-processing.worker';
import { queueManager } from './queue-manager.service';

export class WorkerManagerService {
  private isRunning = false;

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Worker manager is already running');
      return;
    }

    logger.info('Starting worker manager...');

    try {
      // Set up processors for each queue
      await this.setupQueueProcessors();

      this.isRunning = true;
      logger.info('Worker manager started successfully');
    } catch (error) {
      logger.error('Failed to start worker manager:', error);
      throw error;
    }
  }

  private async setupQueueProcessors(): Promise<void> {
    // Image processing queue
    const imageQueue = queueManager.getQueue(QueueName.IMAGE_PROCESSING);
    imageQueue.process('*', async job => {
      return await imageProcessingWorker.process(job);
    });

    // File validation queue
    const validationQueue = queueManager.getQueue(QueueName.FILE_VALIDATION);
    validationQueue.process('*', async job => {
      return await fileValidationWorker.process(job);
    });

    // Metadata extraction queue (placeholder for now)
    const metadataQueue = queueManager.getQueue(QueueName.METADATA_EXTRACTION);
    metadataQueue.process('*', async job => {
      logger.info(`Processing metadata extraction job ${job.id}`);
      // Placeholder implementation
      return { success: true, fileId: job.data.fileId };
    });

    // Cleanup queue (placeholder for now)
    const cleanupQueue = queueManager.getQueue(QueueName.CLEANUP);
    cleanupQueue.process('*', async job => {
      logger.info(`Processing cleanup job ${job.id}`);
      // Placeholder implementation
      return { success: true, fileId: job.data.fileId };
    });

    logger.info('Queue processors set up successfully');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.warn('Worker manager is not running');
      return;
    }

    logger.info('Stopping worker manager...');

    try {
      // Close all queues
      await queueManager.shutdown();

      this.isRunning = false;
      logger.info('Worker manager stopped successfully');
    } catch (error) {
      logger.error('Error stopping worker manager:', error);
      throw error;
    }
  }

  isWorkerRunning(): boolean {
    return this.isRunning;
  }

  async getWorkerStats(): Promise<{
    isRunning: boolean;
    queues: Array<{
      name: string;
      stats: any;
      metrics: any;
    }>;
  }> {
    const queueStats = [];

    for (const queueName of Object.values(QueueName)) {
      try {
        const stats = await queueManager.getQueueStats(queueName);
        const metrics = await queueManager.getQueueMetrics(queueName);

        queueStats.push({
          name: queueName,
          stats,
          metrics,
        });
      } catch (error) {
        logger.error(`Error getting stats for queue ${queueName}:`, error);
      }
    }

    return {
      isRunning: this.isRunning,
      queues: queueStats,
    };
  }
}

export const workerManager = new WorkerManagerService();
