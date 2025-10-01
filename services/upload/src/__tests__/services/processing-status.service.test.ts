import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueueName } from '../../interfaces/queue.interface';
import { ProcessingStatusService } from '../../services/processing-status.service';

// Mock dependencies
vi.mock('../../services/queue-manager.service', () => ({
  queueManager: {
    getQueue: vi.fn(),
  },
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    file: {
      update: vi.fn(),
    },
  },
}));

describe('ProcessingStatusService', () => {
  let processingStatusService: ProcessingStatusService;
  let mockQueue: any;

  beforeEach(() => {
    vi.clearAllMocks();

    processingStatusService = new ProcessingStatusService();

    mockQueue = {
      getJobs: vi.fn(),
    };

    const { queueManager } = await import(
      '../../services/queue-manager.service'
    );
    vi.mocked(queueManager.getQueue).mockReturnValue(mockQueue);
    vi.mocked(queueManager.getQueue).mockReturnValue(mockQueue);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getFileProcessingStatus', () => {
    it('should return processing status for all queues', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('active'),
          progress: vi.fn().mockReturnValue(50),
          processedOn: Date.now() - 5000,
          finishedOn: null,
          failedReason: null,
        },
        {
          id: 'job-124',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('completed'),
          progress: vi.fn().mockReturnValue(100),
          processedOn: Date.now() - 10000,
          finishedOn: Date.now() - 1000,
          failedReason: null,
        },
      ];

      mockQueue.getJobs
        .mockResolvedValueOnce([mockJobs[0]]) // waiting
        .mockResolvedValueOnce([]) // active
        .mockResolvedValueOnce([mockJobs[1]]) // completed
        .mockResolvedValueOnce([]) // failed
        .mockResolvedValueOnce([]); // delayed

      const statuses =
        await processingStatusService.getFileProcessingStatus('file-123');

      expect(statuses).toHaveLength(2);
      expect(statuses[0]).toEqual({
        jobId: 'job-123',
        status: 'processing',
        progress: 50,
        message: expect.any(String),
        startedAt: expect.any(Date),
        completedAt: undefined,
        error: undefined,
      });
      expect(statuses[1]).toEqual({
        jobId: 'job-124',
        status: 'completed',
        progress: 100,
        message: expect.any(String),
        startedAt: expect.any(Date),
        completedAt: expect.any(Date),
        error: undefined,
      });
    });

    it('should return empty array when no jobs found', async () => {
      mockQueue.getJobs.mockResolvedValue([]);

      const statuses =
        await processingStatusService.getFileProcessingStatus('file-123');

      expect(statuses).toEqual([]);
    });

    it('should handle job state errors gracefully', async () => {
      const mockJob = {
        id: 'job-123',
        data: { fileId: 'file-123' },
        getState: vi.fn().mockRejectedValue(new Error('Job state error')),
        progress: vi.fn().mockReturnValue(0),
      };

      mockQueue.getJobs.mockResolvedValueOnce([mockJob]).mockResolvedValue([]);

      const statuses =
        await processingStatusService.getFileProcessingStatus('file-123');

      expect(statuses).toEqual([]);
    });
  });

  describe('getJobProgress', () => {
    it('should return correct job progress for active job', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('active'),
        progress: vi.fn().mockReturnValue(75),
        processedOn: Date.now() - 5000,
        finishedOn: null,
        failedReason: null,
      };

      const progress = await processingStatusService.getJobProgress(
        mockJob,
        QueueName.IMAGE_PROCESSING
      );

      expect(progress).toEqual({
        jobId: 'job-123',
        status: 'processing',
        progress: 75,
        message: 'Generating thumbnails... 75%',
        startedAt: expect.any(Date),
        completedAt: undefined,
        error: undefined,
      });
    });

    it('should return correct job progress for failed job', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('failed'),
        progress: vi.fn().mockReturnValue(30),
        processedOn: Date.now() - 5000,
        finishedOn: Date.now() - 1000,
        failedReason: 'Processing failed',
      };

      const progress = await processingStatusService.getJobProgress(
        mockJob,
        QueueName.IMAGE_PROCESSING
      );

      expect(progress).toEqual({
        jobId: 'job-123',
        status: 'failed',
        progress: 30,
        message: 'Image processing failed',
        startedAt: expect.any(Date),
        completedAt: expect.any(Date),
        error: 'Processing failed',
      });
    });

    it('should handle different queue types correctly', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('active'),
        progress: vi.fn().mockReturnValue(50),
        processedOn: Date.now() - 5000,
        finishedOn: null,
        failedReason: null,
      };

      const progress = await processingStatusService.getJobProgress(
        mockJob,
        QueueName.FILE_VALIDATION
      );

      expect(progress?.message).toBe('Validating file... 50%');
    });

    it('should return null on error', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockRejectedValue(new Error('State error')),
      };

      const progress = await processingStatusService.getJobProgress(
        mockJob,
        QueueName.IMAGE_PROCESSING
      );

      expect(progress).toBeNull();
    });
  });

  describe('updateFileProcessingStatus', () => {
    it('should update file status in database', async () => {
      const { prisma } = await import('../../lib/prisma');
      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      await processingStatusService.updateFileProcessingStatus(
        'file-123',
        'processing',
        {
          startedAt: '2023-01-01T00:00:00Z',
        }
      );

      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: {
          status: 'processing',
          metadata: {
            processing: {
              status: 'processing',
              updatedAt: expect.any(String),
              startedAt: '2023-01-01T00:00:00Z',
            },
          },
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      const { prisma } = await import('../../lib/prisma');
      vi.mocked(prisma.file.update).mockRejectedValue(
        new Error('Database error')
      );

      // Should not throw
      await expect(
        processingStatusService.updateFileProcessingStatus(
          'file-123',
          'processing'
        )
      ).resolves.toBeUndefined();
    });
  });

  describe('getOverallProcessingStatus', () => {
    it('should return completed status when all jobs are completed', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('completed'),
          progress: vi.fn().mockReturnValue(100),
          processedOn: Date.now() - 10000,
          finishedOn: Date.now() - 1000,
          failedReason: null,
        },
        {
          id: 'job-124',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('completed'),
          progress: vi.fn().mockReturnValue(100),
          processedOn: Date.now() - 8000,
          finishedOn: Date.now() - 500,
          failedReason: null,
        },
      ];

      mockQueue.getJobs
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockJobs)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const status =
        await processingStatusService.getOverallProcessingStatus('file-123');

      expect(status.status).toBe('completed');
      expect(status.progress).toBe(100);
      expect(status.message).toBe('All processing completed successfully');
      expect(status.jobs).toHaveLength(2);
    });

    it('should return failed status when any job has failed', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('failed'),
          progress: vi.fn().mockReturnValue(30),
          processedOn: Date.now() - 10000,
          finishedOn: Date.now() - 1000,
          failedReason: 'Processing error',
        },
        {
          id: 'job-124',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('completed'),
          progress: vi.fn().mockReturnValue(100),
          processedOn: Date.now() - 8000,
          finishedOn: Date.now() - 500,
          failedReason: null,
        },
      ];

      mockQueue.getJobs
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockJobs[1]])
        .mockResolvedValueOnce([mockJobs[0]])
        .mockResolvedValueOnce([]);

      const status =
        await processingStatusService.getOverallProcessingStatus('file-123');

      expect(status.status).toBe('failed');
      expect(status.message).toBe('Processing error');
    });

    it('should return processing status when jobs are active', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('active'),
          progress: vi.fn().mockReturnValue(50),
          processedOn: Date.now() - 5000,
          finishedOn: null,
          failedReason: null,
        },
      ];

      mockQueue.getJobs
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockJobs[0]])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const status =
        await processingStatusService.getOverallProcessingStatus('file-123');

      expect(status.status).toBe('processing');
      expect(status.progress).toBe(50);
    });

    it('should return pending status when no jobs found', async () => {
      mockQueue.getJobs.mockResolvedValue([]);

      const status =
        await processingStatusService.getOverallProcessingStatus('file-123');

      expect(status.status).toBe('pending');
      expect(status.progress).toBe(0);
      expect(status.message).toBe('No processing jobs found');
      expect(status.jobs).toEqual([]);
    });
  });

  describe('cancelFileProcessing', () => {
    it('should cancel active and waiting jobs', async () => {
      const mockJobs = [
        {
          id: 'job-123',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('waiting'),
          remove: vi.fn().mockResolvedValue(undefined),
        },
        {
          id: 'job-124',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('active'),
          remove: vi.fn().mockResolvedValue(undefined),
        },
        {
          id: 'job-125',
          data: { fileId: 'file-123' },
          getState: vi.fn().mockResolvedValue('completed'),
          remove: vi.fn().mockResolvedValue(undefined),
        },
      ];

      mockQueue.getJobs
        .mockResolvedValueOnce([mockJobs[0]]) // waiting
        .mockResolvedValueOnce([mockJobs[1]]) // active
        .mockResolvedValueOnce([mockJobs[2]]) // completed
        .mockResolvedValueOnce([]) // failed
        .mockResolvedValueOnce([]); // delayed

      const { prisma } = await import('../../lib/prisma');
      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result =
        await processingStatusService.cancelFileProcessing('file-123');

      expect(result).toBe(true);
      expect(mockJobs[0].remove).toHaveBeenCalled();
      expect(mockJobs[1].remove).toHaveBeenCalled();
      expect(mockJobs[2].remove).not.toHaveBeenCalled(); // Completed job should not be removed

      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: { status: 'cancelled' },
      });
    });

    it('should return false when no jobs to cancel', async () => {
      mockQueue.getJobs.mockResolvedValue([]);

      const result =
        await processingStatusService.cancelFileProcessing('file-123');

      expect(result).toBe(false);
    });

    it('should handle cancellation errors gracefully', async () => {
      const mockJob = {
        id: 'job-123',
        data: { fileId: 'file-123' },
        getState: vi.fn().mockResolvedValue('waiting'),
        remove: vi.fn().mockRejectedValue(new Error('Remove failed')),
      };

      mockQueue.getJobs.mockResolvedValueOnce([mockJob]).mockResolvedValue([]);

      const result =
        await processingStatusService.cancelFileProcessing('file-123');

      expect(result).toBe(false);
    });
  });
});
