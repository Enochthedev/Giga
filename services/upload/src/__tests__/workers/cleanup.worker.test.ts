import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '../../generated/prisma-client';
import { Logger } from '../../lib/logger';
import { MetadataService } from '../../services/metadata.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { CleanupJobData, CleanupWorker } from '../../workers/cleanup.worker';

// Mock dependencies
const mockPrisma = {
  uploadSession: {
    findMany: vi.fn(),
    delete: vi.fn(),
  },
  fileMetadata: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
} as unknown as PrismaClient;

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
} as unknown as Logger;

const mockStorageManager = {
  delete: vi.fn(),
  exists: vi.fn(),
} as unknown as StorageManagerService;

const mockMetadataService = {} as unknown as MetadataService;

describe('CleanupWorker', () => {
  let cleanupWorker: CleanupWorker;

  beforeEach(() => {
    cleanupWorker = new CleanupWorker(
      mockPrisma,
      mockLogger,
      mockStorageManager,
      mockMetadataService
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('processCleanupJob - expired_files', () => {
    it('should cleanup expired files successfully', async () => {
      const jobData: CleanupJobData = {
        type: 'expired_files',
        options: { dryRun: false, batchSize: 10 },
      };

      // Mock the retentionService methods
      const mockRetentionService = cleanupWorker['retentionService'];
      vi.spyOn(mockRetentionService, 'cleanupExpiredFiles').mockResolvedValue({
        deleted: 5,
        errors: [],
      });

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(5);
      expect(result.deleted).toBe(5);
      expect(result.errors).toHaveLength(0);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle dry run for expired files', async () => {
      const jobData: CleanupJobData = {
        type: 'expired_files',
        options: { dryRun: true },
      };

      const mockRetentionService = cleanupWorker['retentionService'];
      vi.spyOn(mockRetentionService, 'identifyExpiredFiles').mockResolvedValue([
        'file-1',
        'file-2',
        'file-3',
      ]);

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(3);
      expect(result.deleted).toBe(0); // Dry run shouldn't delete
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('processCleanupJob - orphaned_files', () => {
    it('should cleanup orphaned files successfully', async () => {
      const jobData: CleanupJobData = {
        type: 'orphaned_files',
        options: { dryRun: false, batchSize: 5 },
      };

      const mockDbFiles = [
        { id: 'file-1', path: '/uploads/file1.jpg' },
        { id: 'file-2', path: '/uploads/file2.jpg' },
        { id: 'file-3', path: '/uploads/file3.jpg' },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockDbFiles);

      // Mock storage exists - file-2 doesn't exist in storage
      mockStorageManager.exists
        .mockResolvedValueOnce(true) // file-1 exists
        .mockResolvedValueOnce(false) // file-2 doesn't exist (orphaned)
        .mockResolvedValueOnce(true); // file-3 exists

      mockPrisma.fileMetadata.update.mockResolvedValue({});

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(3);
      expect(result.deleted).toBe(1); // Only file-2 was orphaned
      expect(result.errors).toHaveLength(0);
      expect(mockPrisma.fileMetadata.update).toHaveBeenCalledWith({
        where: { id: 'file-2' },
        data: { status: 'DELETED' },
      });
    });

    it('should handle storage check errors', async () => {
      const jobData: CleanupJobData = {
        type: 'orphaned_files',
        options: { dryRun: false, batchSize: 2 },
      };

      const mockDbFiles = [
        { id: 'file-1', path: '/uploads/file1.jpg' },
        { id: 'file-2', path: '/uploads/file2.jpg' },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockDbFiles);

      mockStorageManager.exists
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('Storage error'));

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(false);
      expect(result.processed).toBe(2);
      expect(result.deleted).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('file-2');
    });
  });

  describe('processCleanupJob - temp_files', () => {
    it('should cleanup old temporary files successfully', async () => {
      const jobData: CleanupJobData = {
        type: 'temp_files',
        options: { dryRun: false, maxAge: 1, batchSize: 5 },
      };

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2); // 2 days old

      const mockOldSessions = [
        {
          id: 'session-1',
          status: 'PENDING',
          createdAt: oldDate,
          files: [
            {
              fileId: 'file-1',
            },
          ],
        },
        {
          id: 'session-2',
          status: 'IN_PROGRESS',
          createdAt: oldDate,
          files: [],
        },
      ];

      const mockFile = {
        id: 'file-1',
        path: '/uploads/temp/file1.jpg',
      };

      mockPrisma.uploadSession.findMany.mockResolvedValue(mockOldSessions);
      mockPrisma.fileMetadata.findUnique.mockResolvedValue(mockFile);
      mockStorageManager.delete.mockResolvedValue(undefined);
      mockPrisma.fileMetadata.update.mockResolvedValue({});
      mockPrisma.uploadSession.delete.mockResolvedValue({});

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(2);
      expect(result.deleted).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(mockStorageManager.delete).toHaveBeenCalledWith(
        '/uploads/temp/file1.jpg'
      );
      expect(mockPrisma.uploadSession.delete).toHaveBeenCalledTimes(2);
    });

    it('should handle file deletion errors in temp cleanup', async () => {
      const jobData: CleanupJobData = {
        type: 'temp_files',
        options: { dryRun: false, maxAge: 1 },
      };

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 2);

      const mockOldSessions = [
        {
          id: 'session-1',
          status: 'PENDING',
          createdAt: oldDate,
          files: [
            {
              fileId: 'file-1',
            },
          ],
        },
      ];

      const mockFile = {
        id: 'file-1',
        path: '/uploads/temp/file1.jpg',
      };

      mockPrisma.uploadSession.findMany.mockResolvedValue(mockOldSessions);
      mockPrisma.fileMetadata.findUnique.mockResolvedValue(mockFile);
      mockStorageManager.delete.mockRejectedValue(
        new Error('Storage deletion failed')
      );

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(false);
      expect(result.processed).toBe(1);
      expect(result.deleted).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('session-1');
    });
  });

  describe('processCleanupJob - failed_uploads', () => {
    it('should cleanup old failed uploads successfully', async () => {
      const jobData: CleanupJobData = {
        type: 'failed_uploads',
        options: { dryRun: false, maxAge: 7, batchSize: 10 },
      };

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days old

      const mockFailedFiles = [
        {
          id: 'file-1',
          path: '/uploads/failed/file1.jpg',
          status: 'FAILED',
          updatedAt: oldDate,
        },
        {
          id: 'file-2',
          path: '/uploads/failed/file2.jpg',
          status: 'FAILED',
          updatedAt: oldDate,
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFailedFiles);
      mockStorageManager.delete.mockResolvedValue(undefined);
      mockPrisma.fileMetadata.delete.mockResolvedValue({});

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(2);
      expect(result.deleted).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(mockStorageManager.delete).toHaveBeenCalledTimes(2);
      expect(mockPrisma.fileMetadata.delete).toHaveBeenCalledTimes(2);
    });

    it('should ignore storage errors for failed uploads', async () => {
      const jobData: CleanupJobData = {
        type: 'failed_uploads',
        options: { dryRun: false, maxAge: 7 },
      };

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);

      const mockFailedFiles = [
        {
          id: 'file-1',
          path: '/uploads/failed/file1.jpg',
          status: 'FAILED',
          updatedAt: oldDate,
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFailedFiles);
      mockStorageManager.delete.mockRejectedValue(
        new Error('File not found in storage')
      );
      mockPrisma.fileMetadata.delete.mockResolvedValue({});

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(true);
      expect(result.processed).toBe(1);
      expect(result.deleted).toBe(1); // Should still delete from database
      expect(result.errors).toHaveLength(0);
      expect(mockPrisma.fileMetadata.delete).toHaveBeenCalledWith({
        where: { id: 'file-1' },
      });
    });
  });

  describe('processCleanupJob - error handling', () => {
    it('should handle unknown job types', async () => {
      const jobData: CleanupJobData = {
        type: 'unknown_type' as any,
      };

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(false);
      expect(result.processed).toBe(0);
      expect(result.deleted).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Unknown cleanup job type');
    });

    it('should handle general processing errors', async () => {
      const jobData: CleanupJobData = {
        type: 'orphaned_files',
      };

      mockPrisma.fileMetadata.findMany.mockRejectedValue(
        new Error('Database connection failed')
      );

      const result = await cleanupWorker.processCleanupJob(jobData);

      expect(result.success).toBe(false);
      expect(result.processed).toBe(0);
      expect(result.deleted).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.duration).toBeGreaterThan(0);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('scheduleCleanupJobs', () => {
    it('should schedule cleanup jobs successfully', async () => {
      await cleanupWorker.scheduleCleanupJobs();

      expect(mockLogger.info).toHaveBeenCalledTimes(4); // 4 different job types
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Cleanup job scheduled',
        expect.objectContaining({
          type: 'expired_files',
          cron: '0 2 * * *',
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Cleanup job scheduled',
        expect.objectContaining({
          type: 'orphaned_files',
          cron: '0 3 * * 0',
        })
      );
    });

    it('should handle scheduling errors', async () => {
      // Mock logger to throw error
      mockLogger.info.mockImplementationOnce(() => {
        throw new Error('Logging error');
      });

      await cleanupWorker.scheduleCleanupJobs();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to schedule cleanup jobs',
        expect.objectContaining({
          error: expect.any(Error),
        })
      );
    });
  });
});
