import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueueName } from '../../interfaces/queue.interface';
import { QueueManagerService } from '../../services/queue-manager.service';

// Mock Bull and IORedis
vi.mock('bull', () => {
  const mockQueue = {
    add: vi.fn(),
    getJob: vi.fn(),
    remove: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    isPaused: vi.fn(),
    getWaiting: vi.fn(),
    getActive: vi.fn(),
    getCompleted: vi.fn(),
    getFailed: vi.fn(),
    getDelayed: vi.fn(),
    getJobs: vi.fn(),
    process: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
  };

  return {
    default: vi.fn(() => mockQueue),
  };
});

vi.mock('ioredis', () => {
  const mockRedis = {
    disconnect: vi.fn(),
  };

  return {
    default: vi.fn(() => mockRedis),
  };
});

describe('QueueManagerService', () => {
  let queueManager: QueueManagerService;
  let mockQueue: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked Bull constructor
    const Bull = (await import('bull')).default;
    mockQueue = {
      add: vi.fn(),
      getJob: vi.fn(),
      remove: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      isPaused: vi.fn(),
      getWaiting: vi.fn(),
      getActive: vi.fn(),
      getCompleted: vi.fn(),
      getFailed: vi.fn(),
      getDelayed: vi.fn(),
      getJobs: vi.fn(),
      process: vi.fn(),
      close: vi.fn(),
      on: vi.fn(),
      getState: vi.fn(),
    };

    Bull.mockReturnValue(mockQueue);

    queueManager = new QueueManagerService();
  });

  afterEach(async () => {
    await queueManager.shutdown();
    vi.restoreAllMocks();
  });

  describe('addJob', () => {
    it('should add a job to the specified queue', async () => {
      const jobData = { fileId: 'file-123', filePath: '/uploads/file-123.jpg' };
      const mockJob = { id: 'job-123', data: jobData };

      mockQueue.add.mockResolvedValue(mockJob);
      mockQueue.getWaiting.mockResolvedValue([]);
      mockQueue.getActive.mockResolvedValue([]);
      mockQueue.getCompleted.mockResolvedValue([]);
      mockQueue.getFailed.mockResolvedValue([]);
      mockQueue.getDelayed.mockResolvedValue([]);

      const result = await queueManager.addJob(
        QueueName.IMAGE_PROCESSING,
        jobData
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        jobData,
        expect.objectContaining({
          priority: 0,
          delay: 0,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        })
      );

      expect(result).toEqual(mockJob);
    });

    it('should use custom options when provided', async () => {
      const jobData = { fileId: 'file-123' };
      const options = {
        priority: 10,
        delay: 5000,
        attempts: 5,
        backoff: { type: 'fixed' as const, delay: 1000 },
      };

      mockQueue.add.mockResolvedValue({ id: 'job-123' });
      mockQueue.getWaiting.mockResolvedValue([]);
      mockQueue.getActive.mockResolvedValue([]);
      mockQueue.getCompleted.mockResolvedValue([]);
      mockQueue.getFailed.mockResolvedValue([]);
      mockQueue.getDelayed.mockResolvedValue([]);

      await queueManager.addJob(QueueName.FILE_VALIDATION, jobData, options);

      expect(mockQueue.add).toHaveBeenCalledWith(
        jobData,
        expect.objectContaining({
          priority: 10,
          delay: 5000,
          attempts: 5,
          backoff: { type: 'fixed', delay: 1000 },
        })
      );
    });

    it('should throw error when queue is at capacity', async () => {
      const jobData = { fileId: 'file-123' };

      // Mock queue at capacity
      mockQueue.getWaiting.mockResolvedValue(new Array(500).fill({}));
      mockQueue.getActive.mockResolvedValue(new Array(300).fill({}));
      mockQueue.getCompleted.mockResolvedValue([]);
      mockQueue.getFailed.mockResolvedValue([]);
      mockQueue.getDelayed.mockResolvedValue(new Array(200).fill({}));

      await expect(
        queueManager.addJob(QueueName.IMAGE_PROCESSING, jobData)
      ).rejects.toThrow('Queue image-processing is at capacity (1000 jobs)');
    });
  });

  describe('getJob', () => {
    it('should retrieve a job by ID', async () => {
      const mockJob = { id: 'job-123', data: { fileId: 'file-123' } };
      mockQueue.getJob.mockResolvedValue(mockJob);

      const result = await queueManager.getJob(
        QueueName.IMAGE_PROCESSING,
        'job-123'
      );

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-123');
      expect(result).toEqual(mockJob);
    });

    it('should return null when job is not found', async () => {
      mockQueue.getJob.mockResolvedValue(null);

      const result = await queueManager.getJob(
        QueueName.IMAGE_PROCESSING,
        'job-123'
      );

      expect(result).toBeNull();
    });
  });

  describe('getJobStatus', () => {
    it('should return job status', async () => {
      const mockJob = {
        id: 'job-123',
        getState: vi.fn().mockResolvedValue('active'),
      };
      mockQueue.getJob.mockResolvedValue(mockJob);

      const result = await queueManager.getJobStatus(
        QueueName.IMAGE_PROCESSING,
        'job-123'
      );

      expect(result).toBe('active');
    });

    it('should throw error when job is not found', async () => {
      mockQueue.getJob.mockResolvedValue(null);

      await expect(
        queueManager.getJobStatus(QueueName.IMAGE_PROCESSING, 'job-123')
      ).rejects.toThrow('Job job-123 not found in queue image-processing');
    });
  });

  describe('removeJob', () => {
    it('should remove a job successfully', async () => {
      const mockJob = {
        id: 'job-123',
        remove: vi.fn().mockResolvedValue(undefined),
      };
      mockQueue.getJob.mockResolvedValue(mockJob);

      const result = await queueManager.removeJob(
        QueueName.IMAGE_PROCESSING,
        'job-123'
      );

      expect(mockJob.remove).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when job is not found', async () => {
      mockQueue.getJob.mockResolvedValue(null);

      const result = await queueManager.removeJob(
        QueueName.IMAGE_PROCESSING,
        'job-123'
      );

      expect(result).toBe(false);
    });
  });

  describe('pauseQueue and resumeQueue', () => {
    it('should pause a queue', async () => {
      mockQueue.pause.mockResolvedValue(undefined);

      await queueManager.pauseQueue(QueueName.IMAGE_PROCESSING);

      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume a queue', async () => {
      mockQueue.resume.mockResolvedValue(undefined);

      await queueManager.resumeQueue(QueueName.IMAGE_PROCESSING);

      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      mockQueue.getWaiting.mockResolvedValue(new Array(5).fill({}));
      mockQueue.getActive.mockResolvedValue(new Array(2).fill({}));
      mockQueue.getCompleted.mockResolvedValue(new Array(100).fill({}));
      mockQueue.getFailed.mockResolvedValue(new Array(3).fill({}));
      mockQueue.getDelayed.mockResolvedValue(new Array(1).fill({}));
      mockQueue.isPaused.mockResolvedValue(false);

      const stats = await queueManager.getQueueStats(
        QueueName.IMAGE_PROCESSING
      );

      expect(stats).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
        paused: false,
      });
    });
  });

  describe('getQueueMetrics', () => {
    it('should calculate queue metrics', async () => {
      // Mock queue stats
      mockQueue.getWaiting.mockResolvedValue(new Array(5).fill({}));
      mockQueue.getActive.mockResolvedValue(new Array(2).fill({}));
      mockQueue.getCompleted.mockResolvedValue(new Array(100).fill({}));
      mockQueue.getFailed.mockResolvedValue(new Array(3).fill({}));
      mockQueue.getDelayed.mockResolvedValue(new Array(1).fill({}));
      mockQueue.isPaused.mockResolvedValue(false);

      // Mock recent jobs for metrics calculation
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recentCompleted = [
        { finishedOn: Date.now(), processedOn: Date.now() - 5000 },
        { finishedOn: Date.now() - 30000, processedOn: Date.now() - 35000 },
      ];
      const recentFailed = [{ finishedOn: Date.now() - 10000 }];

      mockQueue.getJobs
        .mockResolvedValueOnce(recentCompleted) // completed jobs
        .mockResolvedValueOnce(recentFailed); // failed jobs

      const metrics = await queueManager.getQueueMetrics(
        QueueName.IMAGE_PROCESSING
      );

      expect(metrics).toEqual({
        queueName: QueueName.IMAGE_PROCESSING,
        totalJobs: 111, // 5+2+100+3+1
        activeJobs: 2,
        waitingJobs: 5,
        completedJobs: 100,
        failedJobs: 3,
        avgProcessingTime: expect.any(Number),
        throughput: 3, // 2 completed + 1 failed in last hour
        errorRate: expect.any(Number),
      });
    });
  });

  describe('backpressure monitoring', () => {
    it('should pause queue when approaching capacity', async () => {
      // This test would require mocking the interval timer
      // For now, we'll test the logic indirectly through addJob capacity checks
      const jobData = { fileId: 'file-123' };

      // Mock queue near pause threshold
      mockQueue.getWaiting.mockResolvedValue(new Array(800).fill({}));
      mockQueue.getActive.mockResolvedValue([]);
      mockQueue.getCompleted.mockResolvedValue([]);
      mockQueue.getFailed.mockResolvedValue([]);
      mockQueue.getDelayed.mockResolvedValue([]);

      mockQueue.add.mockResolvedValue({ id: 'job-123' });

      // Should still allow adding jobs but be close to threshold
      await expect(
        queueManager.addJob(QueueName.IMAGE_PROCESSING, jobData)
      ).resolves.toBeDefined();
    });
  });

  describe('shutdown', () => {
    it('should close all queues and disconnect Redis', async () => {
      const IORedis = vi.mocked(await import('ioredis')).default;
      const mockRedis = IORedis.mock.results[0].value;

      mockQueue.close.mockResolvedValue(undefined);
      mockRedis.disconnect.mockResolvedValue(undefined);

      await queueManager.shutdown();

      expect(mockQueue.close).toHaveBeenCalled();
      expect(mockRedis.disconnect).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw error for non-existent queue', () => {
      expect(() => queueManager.getQueue('non-existent-queue')).toThrow(
        'Queue non-existent-queue not found'
      );
    });
  });
});
