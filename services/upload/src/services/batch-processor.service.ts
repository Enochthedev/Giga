import { createLogger } from '../lib/logger';
import { FileMetadata, UploadRequest } from '../types/upload.types';
import { cacheService } from './cache.service';
import { metricsService } from './metrics.service';

const logger = createLogger('BatchProcessorService');

export interface BatchConfig {
  maxBatchSize: number;
  batchTimeout: number;
  maxConcurrentBatches: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface BatchOperation<T, R> {
  id: string;
  data: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
  timestamp: number;
  retryCount: number;
}

export class BatchProcessorService {
  private static instance: BatchProcessorService;
  private uploadBatch: BatchOperation<UploadRequest, FileMetadata>[] = [];
  private deleteBatch: BatchOperation<string, boolean>[] = [];
  private metadataBatch: BatchOperation<string, FileMetadata | null>[] = [];
  private processingBatches = new Set<string>();

  private config: BatchConfig = {
    maxBatchSize: 50,
    batchTimeout: 5000, // 5 seconds
    maxConcurrentBatches: 3,
    retryAttempts: 3,
    retryDelay: 1000,
  };

  private batchTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    // Start batch processing intervals
    this.startBatchProcessing();
  }

  public static getInstance(): BatchProcessorService {
    if (!BatchProcessorService.instance) {
      BatchProcessorService.instance = new BatchProcessorService();
    }
    return BatchProcessorService.instance;
  }

  /**
   * Add upload request to batch
   */
  public async batchUpload(request: UploadRequest): Promise<FileMetadata> {
    return new Promise((resolve, reject) => {
      const operation: BatchOperation<UploadRequest, FileMetadata> = {
        id: `upload_${Date.now()}_${Math.random()}`,
        data: request,
        resolve,
        reject,
        timestamp: Date.now(),
        retryCount: 0,
      };

      this.uploadBatch.push(operation);

      // Process batch if it reaches max size
      if (this.uploadBatch.length >= this.config.maxBatchSize) {
        this.processUploadBatch();
      } else {
        // Set timeout for batch processing
        this.setBatchTimer('upload', () => this.processUploadBatch());
      }

      logger.debug('Added upload to batch', {
        batchSize: this.uploadBatch.length,
        operationId: operation.id,
      });
    });
  }

  /**
   * Add delete request to batch
   */
  public async batchDelete(fileId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const operation: BatchOperation<string, boolean> = {
        id: `delete_${Date.now()}_${Math.random()}`,
        data: fileId,
        resolve,
        reject,
        timestamp: Date.now(),
        retryCount: 0,
      };

      this.deleteBatch.push(operation);

      // Process batch if it reaches max size
      if (this.deleteBatch.length >= this.config.maxBatchSize) {
        this.processDeleteBatch();
      } else {
        // Set timeout for batch processing
        this.setBatchTimer('delete', () => this.processDeleteBatch());
      }

      logger.debug('Added delete to batch', {
        batchSize: this.deleteBatch.length,
        operationId: operation.id,
      });
    });
  }

  /**
   * Add metadata request to batch
   */
  public async batchGetMetadata(fileId: string): Promise<FileMetadata | null> {
    // Check cache first
    const cached = await cacheService.getCachedFileMetadata(fileId);
    if (cached) {
      return cached;
    }

    return new Promise((resolve, reject) => {
      const operation: BatchOperation<string, FileMetadata | null> = {
        id: `metadata_${Date.now()}_${Math.random()}`,
        data: fileId,
        resolve,
        reject,
        timestamp: Date.now(),
        retryCount: 0,
      };

      this.metadataBatch.push(operation);

      // Process batch if it reaches max size
      if (this.metadataBatch.length >= this.config.maxBatchSize) {
        this.processMetadataBatch();
      } else {
        // Set timeout for batch processing
        this.setBatchTimer('metadata', () => this.processMetadataBatch());
      }

      logger.debug('Added metadata request to batch', {
        batchSize: this.metadataBatch.length,
        operationId: operation.id,
      });
    });
  }

  /**
   * Process upload batch
   */
  private async processUploadBatch(): Promise<void> {
    if (this.uploadBatch.length === 0 || this.processingBatches.has('upload')) {
      return;
    }

    const batchId = `upload_${Date.now()}`;
    this.processingBatches.add('upload');
    this.clearBatchTimer('upload');

    const batch = [...this.uploadBatch];
    this.uploadBatch = [];

    const startTime = Date.now();

    try {
      logger.info('Processing upload batch', {
        batchId,
        batchSize: batch.length,
      });

      // Process uploads in parallel with concurrency limit
      const results = await this.processConcurrently(
        batch,
        async operation => {
          try {
            // Simulate upload processing (replace with actual upload logic)
            const result = await this.processUpload(operation.data);
            operation.resolve(result);
            return { success: true, operation };
          } catch (error) {
            if (operation.retryCount < this.config.retryAttempts) {
              operation.retryCount++;
              return { success: false, operation, retry: true };
            } else {
              operation.reject(error as Error);
              return { success: false, operation, retry: false };
            }
          }
        },
        this.config.maxConcurrentBatches
      );

      // Handle retries
      const retryOperations = results
        .filter(r => !r.success && r.retry)
        .map(r => r.operation);

      if (retryOperations.length > 0) {
        this.uploadBatch.unshift(...retryOperations);
        setTimeout(() => this.processUploadBatch(), this.config.retryDelay);
      }

      const duration = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;

      metricsService.recordProcessing(
        'batch_upload',
        'success',
        'mixed',
        duration / 1000
      );
      metricsService.updateQueueSize('upload_batch', this.uploadBatch.length);

      logger.info('Upload batch processed', {
        batchId,
        batchSize: batch.length,
        successCount,
        duration,
        remainingInQueue: this.uploadBatch.length,
      });
    } catch (error) {
      logger.error('Upload batch processing failed', { batchId, error });

      // Reject all operations in batch
      batch.forEach(operation => {
        operation.reject(error as Error);
      });

      metricsService.recordProcessing(
        'batch_upload',
        'error',
        'mixed',
        (Date.now() - startTime) / 1000
      );
    } finally {
      this.processingBatches.delete('upload');
    }
  }

  /**
   * Process delete batch
   */
  private async processDeleteBatch(): Promise<void> {
    if (this.deleteBatch.length === 0 || this.processingBatches.has('delete')) {
      return;
    }

    const batchId = `delete_${Date.now()}`;
    this.processingBatches.add('delete');
    this.clearBatchTimer('delete');

    const batch = [...this.deleteBatch];
    this.deleteBatch = [];

    const startTime = Date.now();

    try {
      logger.info('Processing delete batch', {
        batchId,
        batchSize: batch.length,
      });

      // Process deletes in parallel
      const results = await this.processConcurrently(
        batch,
        async operation => {
          try {
            const result = await this.processDelete(operation.data);
            operation.resolve(result);
            return { success: true, operation };
          } catch (error) {
            if (operation.retryCount < this.config.retryAttempts) {
              operation.retryCount++;
              return { success: false, operation, retry: true };
            } else {
              operation.reject(error as Error);
              return { success: false, operation, retry: false };
            }
          }
        },
        this.config.maxConcurrentBatches
      );

      // Handle retries
      const retryOperations = results
        .filter(r => !r.success && r.retry)
        .map(r => r.operation);

      if (retryOperations.length > 0) {
        this.deleteBatch.unshift(...retryOperations);
        setTimeout(() => this.processDeleteBatch(), this.config.retryDelay);
      }

      const duration = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;

      metricsService.recordProcessing(
        'batch_delete',
        'success',
        'mixed',
        duration / 1000
      );
      metricsService.updateQueueSize('delete_batch', this.deleteBatch.length);

      logger.info('Delete batch processed', {
        batchId,
        batchSize: batch.length,
        successCount,
        duration,
        remainingInQueue: this.deleteBatch.length,
      });
    } catch (error) {
      logger.error('Delete batch processing failed', { batchId, error });

      batch.forEach(operation => {
        operation.reject(error as Error);
      });

      metricsService.recordProcessing(
        'batch_delete',
        'error',
        'mixed',
        (Date.now() - startTime) / 1000
      );
    } finally {
      this.processingBatches.delete('delete');
    }
  }

  /**
   * Process metadata batch
   */
  private async processMetadataBatch(): Promise<void> {
    if (
      this.metadataBatch.length === 0 ||
      this.processingBatches.has('metadata')
    ) {
      return;
    }

    const batchId = `metadata_${Date.now()}`;
    this.processingBatches.add('metadata');
    this.clearBatchTimer('metadata');

    const batch = [...this.metadataBatch];
    this.metadataBatch = [];

    const startTime = Date.now();

    try {
      logger.info('Processing metadata batch', {
        batchId,
        batchSize: batch.length,
      });

      // Get file IDs
      const fileIds = batch.map(op => op.data);

      // Batch fetch from database
      const metadataResults = await this.batchGetMetadataFromDatabase(fileIds);

      // Cache results and resolve operations
      const cachePromises: Promise<void>[] = [];

      batch.forEach((operation, index) => {
        const metadata = metadataResults[index];
        operation.resolve(metadata);

        if (metadata) {
          cachePromises.push(cacheService.cacheFileMetadata(metadata));
        }
      });

      // Cache all results in parallel
      await Promise.all(cachePromises);

      const duration = Date.now() - startTime;

      metricsService.recordProcessing(
        'batch_metadata',
        'success',
        'mixed',
        duration / 1000
      );
      metricsService.updateQueueSize(
        'metadata_batch',
        this.metadataBatch.length
      );

      logger.info('Metadata batch processed', {
        batchId,
        batchSize: batch.length,
        duration,
        remainingInQueue: this.metadataBatch.length,
      });
    } catch (error) {
      logger.error('Metadata batch processing failed', { batchId, error });

      batch.forEach(operation => {
        operation.reject(error as Error);
      });

      metricsService.recordProcessing(
        'batch_metadata',
        'error',
        'mixed',
        (Date.now() - startTime) / 1000
      );
    } finally {
      this.processingBatches.delete('metadata');
    }
  }

  /**
   * Process operations concurrently with limit
   */
  private async processConcurrently<T, R>(
    operations: T[],
    processor: (operation: T) => Promise<R>,
    concurrencyLimit: number
  ): Promise<R[]> {
    const results: R[] = [];
    const executing: Promise<void>[] = [];

    for (const operation of operations) {
      const promise = processor(operation).then(result => {
        results.push(result);
      });

      executing.push(promise);

      if (executing.length >= concurrencyLimit) {
        await Promise.race(executing);
        executing.splice(
          executing.findIndex(p => p === promise),
          1
        );
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * Set batch timer
   */
  private setBatchTimer(batchType: string, callback: () => void): void {
    this.clearBatchTimer(batchType);

    const timer = setTimeout(callback, this.config.batchTimeout);
    this.batchTimers.set(batchType, timer);
  }

  /**
   * Clear batch timer
   */
  private clearBatchTimer(batchType: string): void {
    const timer = this.batchTimers.get(batchType);
    if (timer) {
      clearTimeout(timer);
      this.batchTimers.delete(batchType);
    }
  }

  /**
   * Start batch processing intervals
   */
  private startBatchProcessing(): void {
    // Process batches periodically even if they don't reach max size
    setInterval(() => {
      if (this.uploadBatch.length > 0) {
        this.processUploadBatch();
      }
      if (this.deleteBatch.length > 0) {
        this.processDeleteBatch();
      }
      if (this.metadataBatch.length > 0) {
        this.processMetadataBatch();
      }
    }, this.config.batchTimeout);
  }

  /**
   * Get batch statistics
   */
  public getBatchStats(): {
    uploadBatch: number;
    deleteBatch: number;
    metadataBatch: number;
    processingBatches: string[];
    config: BatchConfig;
  } {
    return {
      uploadBatch: this.uploadBatch.length,
      deleteBatch: this.deleteBatch.length,
      metadataBatch: this.metadataBatch.length,
      processingBatches: Array.from(this.processingBatches),
      config: this.config,
    };
  }

  // Placeholder methods - replace with actual implementations
  private async processUpload(request: UploadRequest): Promise<FileMetadata> {
    // This would integrate with the actual upload service
    throw new Error(
      'processUpload not implemented - integrate with UploadService'
    );
  }

  private async processDelete(fileId: string): Promise<boolean> {
    // This would integrate with the actual delete service
    throw new Error(
      'processDelete not implemented - integrate with StorageManager'
    );
  }

  private async batchGetMetadataFromDatabase(
    fileIds: string[]
  ): Promise<(FileMetadata | null)[]> {
    // This would integrate with the actual metadata service
    throw new Error(
      'batchGetMetadataFromDatabase not implemented - integrate with MetadataService'
    );
  }
}

// Export singleton instance
export const batchProcessorService = BatchProcessorService.getInstance();
