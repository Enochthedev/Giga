import {
  FileValidationJobData,
  ImageProcessingJobData,
  MetadataExtractionJobData,
  QueueJobOptions,
  QueueName,
} from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { processingStatusService } from './processing-status.service';
import { queueManager } from './queue-manager.service';

export class AsyncProcessingService {
  async processFileUpload(fileData: {
    fileId: string;
    filePath: string;
    originalName: string;
    mimeType: string;
    size: number;
    entityType: string;
    entityId: string;
  }): Promise<{
    validationJobId?: string;
    processingJobId?: string;
    metadataJobId?: string;
  }> {
    const {
      fileId,
      filePath,
      originalName,
      mimeType,
      size,
      entityType,
      entityId,
    } = fileData;

    logger.info(`Starting async processing for file ${fileId}`);

    const jobIds: {
      validationJobId?: string;
      processingJobId?: string;
      metadataJobId?: string;
    } = {};

    try {
      // 1. Always start with file validation (highest priority)
      const validationJob = await this.queueFileValidation({
        fileId,
        filePath,
        originalName,
        mimeType,
        size,
      });
      jobIds.validationJobId = validationJob.id!.toString();

      // 2. Queue metadata extraction (medium priority)
      const metadataJob = await this.queueMetadataExtraction({
        fileId,
        filePath,
        mimeType,
      });
      jobIds.metadataJobId = metadataJob.id!.toString();

      // 3. Queue image processing if it's an image (lower priority, after validation)
      if (this.isImageFile(mimeType)) {
        const processingOptions = this.getProcessingOptionsForEntity(
          entityType,
          mimeType
        );

        const processingJob = await this.queueImageProcessing(
          {
            fileId,
            filePath,
            originalName,
            mimeType,
            entityType,
            entityId,
            processingOptions,
          },
          {
            delay: 5000, // Wait 5 seconds to allow validation to complete first
          }
        );
        jobIds.processingJobId = processingJob.id!.toString();
      }

      // Update file status to indicate processing has started
      await processingStatusService.updateFileProcessingStatus(
        fileId,
        'processing',
        {
          jobs: jobIds,
          startedAt: new Date().toISOString(),
        }
      );

      logger.info(`Async processing queued for file ${fileId}:`, jobIds);
      return jobIds;
    } catch (error) {
      logger.error(`Error queuing async processing for file ${fileId}:`, error);

      // Update file status to failed
      await processingStatusService.updateFileProcessingStatus(
        fileId,
        'failed',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAt: new Date().toISOString(),
        }
      );

      throw error;
    }
  }

  private async queueFileValidation(
    data: FileValidationJobData,
    options?: QueueJobOptions
  ) {
    return await queueManager.addJob(QueueName.FILE_VALIDATION, data, {
      priority: 10, // High priority
      attempts: 2,
      ...options,
    });
  }

  private async queueImageProcessing(
    data: ImageProcessingJobData,
    options?: QueueJobOptions
  ) {
    return await queueManager.addJob(QueueName.IMAGE_PROCESSING, data, {
      priority: 5, // Medium priority
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      ...options,
    });
  }

  private async queueMetadataExtraction(
    data: MetadataExtractionJobData,
    options?: QueueJobOptions
  ) {
    return await queueManager.addJob(QueueName.METADATA_EXTRACTION, data, {
      priority: 7, // Medium-high priority
      attempts: 2,
      ...options,
    });
  }

  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private getProcessingOptionsForEntity(
    entityType: string,
    mimeType: string
  ): ImageProcessingJobData['processingOptions'] {
    // Define processing options based on entity type
    const baseOptions = {
      format: 'webp' as const,
      quality: 80,
    };

    switch (entityType) {
      case 'user_profile':
        return {
          ...baseOptions,
          resize: { width: 800, height: 800, fit: 'cover' as const },
          generateThumbnails: [
            { name: 'small', width: 150, height: 150 },
            { name: 'medium', width: 300, height: 300 },
          ],
        };

      case 'product':
        return {
          ...baseOptions,
          resize: { width: 1200, height: 1200, fit: 'contain' as const },
          generateThumbnails: [
            { name: 'thumbnail', width: 200, height: 200 },
            { name: 'small', width: 400, height: 400 },
            { name: 'medium', width: 800, height: 800 },
          ],
        };

      case 'property':
        return {
          ...baseOptions,
          resize: { width: 1600, height: 1200, fit: 'cover' as const },
          generateThumbnails: [
            { name: 'thumbnail', width: 300, height: 200 },
            { name: 'small', width: 600, height: 400 },
            { name: 'medium', width: 1200, height: 800 },
          ],
        };

      case 'vehicle':
        return {
          ...baseOptions,
          resize: { width: 1400, height: 1000, fit: 'cover' as const },
          generateThumbnails: [
            { name: 'thumbnail', width: 250, height: 180 },
            { name: 'small', width: 500, height: 360 },
            { name: 'medium', width: 1000, height: 720 },
          ],
        };

      case 'advertisement':
        return {
          ...baseOptions,
          resize: { width: 1200, height: 630, fit: 'cover' as const },
          generateThumbnails: [
            { name: 'thumbnail', width: 300, height: 157 },
            { name: 'small', width: 600, height: 315 },
          ],
        };

      default:
        return {
          ...baseOptions,
          resize: { width: 1000, height: 1000, fit: 'contain' as const },
          generateThumbnails: [
            { name: 'thumbnail', width: 200, height: 200 },
            { name: 'small', width: 400, height: 400 },
          ],
        };
    }
  }

  async retryFailedProcessing(fileId: string): Promise<boolean> {
    try {
      logger.info(`Retrying failed processing for file ${fileId}`);

      // Get current file data from database
      const file = await this.getFileData(fileId);
      if (!file) {
        throw new Error(`File ${fileId} not found`);
      }

      // Cancel any existing jobs
      await processingStatusService.cancelFileProcessing(fileId);

      // Restart processing
      await this.processFileUpload({
        fileId: file.id,
        filePath: file.path,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        entityType: file.entityType,
        entityId: file.entityId,
      });

      return true;
    } catch (error) {
      logger.error(`Error retrying processing for file ${fileId}:`, error);
      return false;
    }
  }

  private async getFileData(fileId: string) {
    // This would typically fetch from the database
    // For now, return a mock implementation
    return {
      id: fileId,
      path: `/uploads/${fileId}`,
      originalName: 'file.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      entityType: 'product',
      entityId: 'product-123',
    };
  }

  async getProcessingStatus(fileId: string) {
    return await processingStatusService.getOverallProcessingStatus(fileId);
  }

  async cancelProcessing(fileId: string): Promise<boolean> {
    return await processingStatusService.cancelFileProcessing(fileId);
  }

  async getQueueHealth(): Promise<{
    healthy: boolean;
    queues: Array<{
      name: string;
      healthy: boolean;
      stats: any;
      issues?: string[];
    }>;
  }> {
    const queueHealth = [];
    let overallHealthy = true;

    for (const queueName of Object.values(QueueName)) {
      try {
        const stats = await queueManager.getQueueStats(queueName);
        const metrics = await queueManager.getQueueMetrics(queueName);

        const issues: string[] = [];
        let queueHealthy = true;

        // Check for issues
        if (stats.failed > 10) {
          issues.push(`High failure rate: ${stats.failed} failed jobs`);
          queueHealthy = false;
        }

        if (stats.waiting > 100) {
          issues.push(`High queue backlog: ${stats.waiting} waiting jobs`);
          queueHealthy = false;
        }

        if (metrics.errorRate > 10) {
          issues.push(`High error rate: ${metrics.errorRate.toFixed(1)}%`);
          queueHealthy = false;
        }

        if (stats.paused) {
          issues.push('Queue is paused');
          queueHealthy = false;
        }

        queueHealth.push({
          name: queueName,
          healthy: queueHealthy,
          stats: { ...stats, metrics },
          issues: issues.length > 0 ? issues : undefined,
        });

        if (!queueHealthy) {
          overallHealthy = false;
        }
      } catch (error) {
        logger.error(`Error checking health for queue ${queueName}:`, error);
        queueHealth.push({
          name: queueName,
          healthy: false,
          stats: {},
          issues: ['Failed to get queue stats'],
        });
        overallHealthy = false;
      }
    }

    return {
      healthy: overallHealthy,
      queues: queueHealth,
    };
  }
}

export const asyncProcessingService = new AsyncProcessingService();
