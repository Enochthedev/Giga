import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueueName } from '../../interfaces/queue.interface';
import { AsyncProcessingService } from '../../services/async-processing.service';

// Mock the dependencies
vi.mock('../../services/queue-manager.service', () => ({
  queueManager: {
    addJob: vi.fn(),
    getQueueStats: vi.fn(),
    getQueueMetrics: vi.fn(),
  },
}));

vi.mock('../../services/processing-status.service', () => ({
  processingStatusService: {
    updateFileProcessingStatus: vi.fn(),
    cancelFileProcessing: vi.fn(),
    getOverallProcessingStatus: vi.fn(),
  },
}));

describe('AsyncProcessingService', () => {
  let asyncProcessingService: AsyncProcessingService;

  beforeEach(() => {
    asyncProcessingService = new AsyncProcessingService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processFileUpload', () => {
    it('should queue validation and metadata extraction for all files', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );
      const mockAddJob = vi.mocked(queueManager.addJob);

      mockAddJob.mockResolvedValue({ id: 'job-123' } as any);

      const fileData = {
        fileId: 'file-123',
        filePath: '/uploads/file-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        entityType: 'product',
        entityId: 'product-123',
      };

      const result = await asyncProcessingService.processFileUpload(fileData);

      expect(mockAddJob).toHaveBeenCalledWith(
        QueueName.FILE_VALIDATION,
        expect.objectContaining({
          fileId: 'file-123',
          filePath: '/uploads/file-123.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          size: 1024000,
        }),
        expect.objectContaining({
          priority: 10,
          attempts: 2,
        })
      );

      expect(mockAddJob).toHaveBeenCalledWith(
        QueueName.METADATA_EXTRACTION,
        expect.objectContaining({
          fileId: 'file-123',
          filePath: '/uploads/file-123.jpg',
          mimeType: 'image/jpeg',
        }),
        expect.objectContaining({
          priority: 7,
          attempts: 2,
        })
      );

      expect(result).toEqual({
        validationJobId: 'job-123',
        processingJobId: 'job-123',
        metadataJobId: 'job-123',
      });
    });

    it('should queue image processing for image files', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );
      const mockAddJob = vi.mocked(queueManager.addJob);

      mockAddJob.mockResolvedValue({ id: 'job-123' } as any);

      const fileData = {
        fileId: 'file-123',
        filePath: '/uploads/file-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        entityType: 'product',
        entityId: 'product-123',
      };

      await asyncProcessingService.processFileUpload(fileData);

      expect(mockAddJob).toHaveBeenCalledWith(
        QueueName.IMAGE_PROCESSING,
        expect.objectContaining({
          fileId: 'file-123',
          filePath: '/uploads/file-123.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          entityType: 'product',
          entityId: 'product-123',
          processingOptions: expect.objectContaining({
            format: 'webp',
            quality: 80,
            resize: expect.objectContaining({
              width: 1200,
              height: 1200,
              fit: 'contain',
            }),
            generateThumbnails: expect.arrayContaining([
              expect.objectContaining({
                name: 'thumbnail',
                width: 200,
                height: 200,
              }),
              expect.objectContaining({
                name: 'small',
                width: 400,
                height: 400,
              }),
              expect.objectContaining({
                name: 'medium',
                width: 800,
                height: 800,
              }),
            ]),
          }),
        }),
        expect.objectContaining({
          priority: 5,
          attempts: 3,
          delay: 5000,
        })
      );
    });

    it('should not queue image processing for non-image files', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );
      const mockAddJob = vi.mocked(queueManager.addJob);

      mockAddJob.mockResolvedValue({ id: 'job-123' } as any);

      const fileData = {
        fileId: 'file-123',
        filePath: '/uploads/file-123.pdf',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024000,
        entityType: 'document',
        entityId: 'doc-123',
      };

      const result = await asyncProcessingService.processFileUpload(fileData);

      expect(mockAddJob).not.toHaveBeenCalledWith(
        QueueName.IMAGE_PROCESSING,
        expect.anything(),
        expect.anything()
      );

      expect(result.processingJobId).toBeUndefined();
    });

    it('should handle processing queue errors', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );
      const { processingStatusService } = await import(
        '../../services/processing-status.service'
      );

      const mockAddJob = vi.mocked(queueManager.addJob);
      const mockUpdateStatus = vi.mocked(
        processingStatusService.updateFileProcessingStatus
      );

      mockAddJob.mockRejectedValue(new Error('Queue is full'));

      const fileData = {
        fileId: 'file-123',
        filePath: '/uploads/file-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        entityType: 'product',
        entityId: 'product-123',
      };

      await expect(
        asyncProcessingService.processFileUpload(fileData)
      ).rejects.toThrow('Queue is full');

      expect(mockUpdateStatus).toHaveBeenCalledWith(
        'file-123',
        'failed',
        expect.objectContaining({
          error: 'Queue is full',
          failedAt: expect.any(String),
        })
      );
    });
  });

  describe('getProcessingOptionsForEntity', () => {
    it('should return correct options for user profile', () => {
      const options = (
        asyncProcessingService as any
      ).getProcessingOptionsForEntity('user_profile', 'image/jpeg');

      expect(options).toEqual({
        format: 'webp',
        quality: 80,
        resize: { width: 800, height: 800, fit: 'cover' },
        generateThumbnails: [
          { name: 'small', width: 150, height: 150 },
          { name: 'medium', width: 300, height: 300 },
        ],
      });
    });

    it('should return correct options for product', () => {
      const options = (
        asyncProcessingService as any
      ).getProcessingOptionsForEntity('product', 'image/jpeg');

      expect(options).toEqual({
        format: 'webp',
        quality: 80,
        resize: { width: 1200, height: 1200, fit: 'contain' },
        generateThumbnails: [
          { name: 'thumbnail', width: 200, height: 200 },
          { name: 'small', width: 400, height: 400 },
          { name: 'medium', width: 800, height: 800 },
        ],
      });
    });

    it('should return correct options for property', () => {
      const options = (
        asyncProcessingService as any
      ).getProcessingOptionsForEntity('property', 'image/jpeg');

      expect(options).toEqual({
        format: 'webp',
        quality: 80,
        resize: { width: 1600, height: 1200, fit: 'cover' },
        generateThumbnails: [
          { name: 'thumbnail', width: 300, height: 200 },
          { name: 'small', width: 600, height: 400 },
          { name: 'medium', width: 1200, height: 800 },
        ],
      });
    });

    it('should return default options for unknown entity type', () => {
      const options = (
        asyncProcessingService as any
      ).getProcessingOptionsForEntity('unknown', 'image/jpeg');

      expect(options).toEqual({
        format: 'webp',
        quality: 80,
        resize: { width: 1000, height: 1000, fit: 'contain' },
        generateThumbnails: [
          { name: 'thumbnail', width: 200, height: 200 },
          { name: 'small', width: 400, height: 400 },
        ],
      });
    });
  });

  describe('getQueueHealth', () => {
    it('should return healthy status when all queues are healthy', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );

      const mockGetStats = vi.mocked(queueManager.getQueueStats);
      const mockGetMetrics = vi.mocked(queueManager.getQueueMetrics);

      mockGetStats.mockResolvedValue({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 1,
        delayed: 0,
        paused: false,
      });

      mockGetMetrics.mockResolvedValue({
        queueName: 'test-queue',
        totalJobs: 108,
        activeJobs: 2,
        waitingJobs: 5,
        completedJobs: 100,
        failedJobs: 1,
        avgProcessingTime: 5000,
        throughput: 50,
        errorRate: 1,
      });

      const health = await asyncProcessingService.getQueueHealth();

      expect(health.healthy).toBe(true);
      expect(health.queues).toHaveLength(4); // All queue types
      expect(health.queues.every(q => q.healthy)).toBe(true);
    });

    it('should return unhealthy status when queues have issues', async () => {
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );

      const mockGetStats = vi.mocked(queueManager.getQueueStats);
      const mockGetMetrics = vi.mocked(queueManager.getQueueMetrics);

      mockGetStats.mockResolvedValue({
        waiting: 150, // High backlog
        active: 2,
        completed: 100,
        failed: 20, // High failure rate
        delayed: 0,
        paused: true, // Paused
      });

      mockGetMetrics.mockResolvedValue({
        queueName: 'test-queue',
        totalJobs: 272,
        activeJobs: 2,
        waitingJobs: 150,
        completedJobs: 100,
        failedJobs: 20,
        avgProcessingTime: 5000,
        throughput: 50,
        errorRate: 15, // High error rate
      });

      const health = await asyncProcessingService.getQueueHealth();

      expect(health.healthy).toBe(false);

      const unhealthyQueue = health.queues[0];
      expect(unhealthyQueue.healthy).toBe(false);
      expect(unhealthyQueue.issues).toContain(
        'High failure rate: 20 failed jobs'
      );
      expect(unhealthyQueue.issues).toContain(
        'High queue backlog: 150 waiting jobs'
      );
      expect(unhealthyQueue.issues).toContain('High error rate: 15.0%');
      expect(unhealthyQueue.issues).toContain('Queue is paused');
    });
  });

  describe('retryFailedProcessing', () => {
    it('should cancel existing jobs and restart processing', async () => {
      const { processingStatusService } = await import(
        '../../services/processing-status.service'
      );
      const { queueManager } = await import(
        '../../services/queue-manager.service'
      );

      const mockCancelProcessing = vi.mocked(
        processingStatusService.cancelFileProcessing
      );
      const mockAddJob = vi.mocked(queueManager.addJob);

      mockCancelProcessing.mockResolvedValue(true);
      mockAddJob.mockResolvedValue({ id: 'job-123' } as any);

      // Mock getFileData method
      const mockGetFileData = vi.spyOn(
        asyncProcessingService as any,
        'getFileData'
      );
      mockGetFileData.mockResolvedValue({
        id: 'file-123',
        path: '/uploads/file-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        entityType: 'product',
        entityId: 'product-123',
      });

      const result =
        await asyncProcessingService.retryFailedProcessing('file-123');

      expect(result).toBe(true);
      expect(mockCancelProcessing).toHaveBeenCalledWith('file-123');
      expect(mockAddJob).toHaveBeenCalled();
    });

    it('should return false when file is not found', async () => {
      // Mock getFileData method to return null
      const mockGetFileData = vi.spyOn(
        asyncProcessingService as any,
        'getFileData'
      );
      mockGetFileData.mockResolvedValue(null);

      const result =
        await asyncProcessingService.retryFailedProcessing('file-123');

      expect(result).toBe(false);
    });
  });

  describe('cancelProcessing', () => {
    it('should delegate to processing status service', async () => {
      const { processingStatusService } = await import(
        '../../services/processing-status.service'
      );

      const mockCancelProcessing = vi.mocked(
        processingStatusService.cancelFileProcessing
      );
      mockCancelProcessing.mockResolvedValue(true);

      const result = await asyncProcessingService.cancelProcessing('file-123');

      expect(result).toBe(true);
      expect(mockCancelProcessing).toHaveBeenCalledWith('file-123');
    });
  });

  describe('getProcessingStatus', () => {
    it('should delegate to processing status service', async () => {
      const { processingStatusService } = await import(
        '../../services/processing-status.service'
      );

      const mockGetStatus = vi.mocked(
        processingStatusService.getOverallProcessingStatus
      );
      const expectedStatus = {
        status: 'completed' as const,
        progress: 100,
        message: 'All processing completed',
        jobs: [],
      };
      mockGetStatus.mockResolvedValue(expectedStatus);

      const result =
        await asyncProcessingService.getProcessingStatus('file-123');

      expect(result).toEqual(expectedStatus);
      expect(mockGetStatus).toHaveBeenCalledWith('file-123');
    });
  });
});
