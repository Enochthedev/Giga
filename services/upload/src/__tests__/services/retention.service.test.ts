import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '../../generated/prisma-client';
import { Logger } from '../../lib/logger';
import { MetadataService } from '../../services/metadata.service';
import { RetentionServiceImpl } from '../../services/retention.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { EntityType } from '../../types/upload.types';

// Mock dependencies
const mockPrisma = {
  retentionPolicy: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
  legalHold: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  dataDeletionRequest: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  fileMetadata: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  retentionAuditLog: {
    create: vi.fn(),
    count: vi.fn(),
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

describe('RetentionService', () => {
  let retentionService: RetentionServiceImpl;

  beforeEach(() => {
    retentionService = new RetentionServiceImpl(
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

  describe('createRetentionPolicy', () => {
    it('should create a retention policy successfully', async () => {
      const policyData = {
        name: 'User Profile Policy',
        entityType: EntityType.USER_PROFILE,
        retentionPeriodDays: 365,
        jurisdiction: 'EU',
        isActive: true,
        description: 'GDPR compliant user profile retention',
        legalBasis: 'GDPR Article 6(1)(b)',
      };

      const mockCreatedPolicy = {
        id: 'policy-123',
        ...policyData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.retentionPolicy.create.mockResolvedValue(mockCreatedPolicy);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await retentionService.createRetentionPolicy(policyData);

      expect(mockPrisma.retentionPolicy.create).toHaveBeenCalledWith({
        data: expect.objectContaining(policyData),
      });
      expect(mockPrisma.retentionAuditLog.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedPolicy);
    });

    it('should handle creation errors', async () => {
      const policyData = {
        name: 'Test Policy',
        entityType: EntityType.USER_PROFILE,
        retentionPeriodDays: 365,
        jurisdiction: 'EU',
        isActive: true,
      };

      mockPrisma.retentionPolicy.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        retentionService.createRetentionPolicy(policyData)
      ).rejects.toThrow('Failed to create retention policy');
    });
  });

  describe('createLegalHold', () => {
    it('should create a legal hold successfully', async () => {
      const holdData = {
        name: 'Investigation Hold',
        description: 'Legal investigation in progress',
        entityType: EntityType.USER_PROFILE,
        entityIds: ['user-123'],
        fileIds: ['file-456'],
        isActive: true,
        createdBy: 'admin@example.com',
      };

      const mockCreatedHold = {
        id: 'hold-123',
        ...holdData,
        createdAt: new Date(),
      };

      mockPrisma.legalHold.create.mockResolvedValue(mockCreatedHold);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await retentionService.createLegalHold(holdData);

      expect(mockPrisma.legalHold.create).toHaveBeenCalledWith({
        data: expect.objectContaining(holdData),
      });
      expect(result).toEqual(mockCreatedHold);
    });
  });

  describe('identifyExpiredFiles', () => {
    it('should identify expired files based on retention policies', async () => {
      const mockPolicies = [
        {
          id: 'policy-1',
          entityType: 'USER_PROFILE',
          retentionPeriodDays: 365,
          isActive: true,
        },
      ];

      const mockExpiredFiles = [{ id: 'file-1' }, { id: 'file-2' }];

      const mockLegalHolds = [
        {
          id: 'hold-1',
          isActive: true,
          fileIds: ['file-1'], // This file should be excluded
        },
      ];

      mockPrisma.retentionPolicy.findMany.mockResolvedValue(mockPolicies);
      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockExpiredFiles);
      mockPrisma.legalHold.findMany.mockResolvedValue(mockLegalHolds);

      const result = await retentionService.identifyExpiredFiles();

      expect(result).toEqual(['file-2']); // file-1 should be excluded due to legal hold
      expect(mockPrisma.retentionPolicy.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
    });

    it('should handle errors gracefully', async () => {
      mockPrisma.retentionPolicy.findMany.mockRejectedValue(
        new Error('Database error')
      );

      const result = await retentionService.identifyExpiredFiles();

      expect(result).toEqual([]);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('cleanupExpiredFiles', () => {
    it('should cleanup expired files successfully', async () => {
      const expiredFileIds = ['file-1', 'file-2'];
      const mockFiles = [
        {
          id: 'file-1',
          path: '/uploads/file1.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-123',
        },
        {
          id: 'file-2',
          path: '/uploads/file2.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-456',
        },
      ];

      // Mock the identifyExpiredFiles method
      vi.spyOn(retentionService, 'identifyExpiredFiles').mockResolvedValue(
        expiredFileIds
      );

      mockPrisma.fileMetadata.findUnique
        .mockResolvedValueOnce(mockFiles[0])
        .mockResolvedValueOnce(mockFiles[1]);

      mockStorageManager.delete.mockResolvedValue(undefined);
      mockPrisma.fileMetadata.update.mockResolvedValue({});
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await retentionService.cleanupExpiredFiles();

      expect(result.deleted).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(mockStorageManager.delete).toHaveBeenCalledTimes(2);
      expect(mockPrisma.fileMetadata.update).toHaveBeenCalledTimes(2);
    });

    it('should handle individual file deletion errors', async () => {
      const expiredFileIds = ['file-1', 'file-2'];
      const mockFiles = [
        {
          id: 'file-1',
          path: '/uploads/file1.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-123',
        },
        {
          id: 'file-2',
          path: '/uploads/file2.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-456',
        },
      ];

      vi.spyOn(retentionService, 'identifyExpiredFiles').mockResolvedValue(
        expiredFileIds
      );

      mockPrisma.fileMetadata.findUnique
        .mockResolvedValueOnce(mockFiles[0])
        .mockResolvedValueOnce(mockFiles[1]);

      // First file deletion succeeds, second fails
      mockStorageManager.delete
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Storage error'));

      mockPrisma.fileMetadata.update
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await retentionService.cleanupExpiredFiles();

      expect(result.deleted).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('file-2');
    });
  });

  describe('processDataDeletionRequest', () => {
    it('should process data deletion request successfully', async () => {
      const requestId = 'request-123';
      const mockRequest = {
        id: requestId,
        entityType: 'USER_PROFILE',
        entityId: 'user-123',
        status: 'PENDING',
      };

      const mockFiles = [
        {
          id: 'file-1',
          path: '/uploads/file1.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-123',
          status: 'READY',
        },
      ];

      mockPrisma.dataDeletionRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.dataDeletionRequest.update
        .mockResolvedValueOnce({ ...mockRequest, status: 'PROCESSING' })
        .mockResolvedValueOnce({
          ...mockRequest,
          status: 'COMPLETED',
          filesDeleted: 1,
        });

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.legalHold.findMany.mockResolvedValue([]); // No legal holds

      mockStorageManager.delete.mockResolvedValue(undefined);
      mockPrisma.fileMetadata.update.mockResolvedValue({});
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result =
        await retentionService.processDataDeletionRequest(requestId);

      expect(result.status).toBe('COMPLETED');
      expect(result.filesDeleted).toBe(1);
      expect(mockStorageManager.delete).toHaveBeenCalledWith(
        '/uploads/file1.jpg'
      );
    });

    it('should handle legal holds preventing deletion', async () => {
      const requestId = 'request-123';
      const mockRequest = {
        id: requestId,
        entityType: 'USER_PROFILE',
        entityId: 'user-123',
        status: 'PENDING',
      };

      const mockFiles = [
        {
          id: 'file-1',
          path: '/uploads/file1.jpg',
          entityType: 'USER_PROFILE',
          entityId: 'user-123',
          status: 'READY',
        },
      ];

      const mockLegalHolds = [
        {
          id: 'hold-1',
          name: 'Investigation Hold',
          isActive: true,
          entityType: 'USER_PROFILE',
          entityIds: ['user-123'],
        },
      ];

      mockPrisma.dataDeletionRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.dataDeletionRequest.update
        .mockResolvedValueOnce({ ...mockRequest, status: 'PROCESSING' })
        .mockResolvedValueOnce({
          ...mockRequest,
          status: 'FAILED',
          errorMessage:
            'Cannot delete files under legal hold: Investigation Hold',
          filesDeleted: 0,
        });

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.legalHold.findMany.mockResolvedValue(mockLegalHolds);

      const result =
        await retentionService.processDataDeletionRequest(requestId);

      expect(result.status).toBe('FAILED');
      expect(result.errorMessage).toContain('legal hold');
      expect(mockStorageManager.delete).not.toHaveBeenCalled();
    });
  });

  describe('anonymizeUserData', () => {
    it('should anonymize user data successfully', async () => {
      const userId = 'user-123';
      const mockFiles = [
        {
          id: 'file-1',
          entityType: 'USER_PROFILE',
          entityId: userId,
          status: 'READY',
          originalName: 'profile.jpg',
          uploadedBy: 'user@example.com',
          metadata: { sensitive: 'data' },
          tags: ['profile', 'avatar'],
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.fileMetadata.update.mockResolvedValue({});
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await retentionService.anonymizeUserData(userId);

      expect(result.anonymized).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(mockPrisma.fileMetadata.update).toHaveBeenCalledWith({
        where: { id: 'file-1' },
        data: {
          originalName: 'anonymized_file',
          uploadedBy: 'anonymized_user',
          metadata: {},
          tags: [],
        },
      });
    });
  });

  describe('generateRetentionReport', () => {
    it('should generate comprehensive retention report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      // Mock all the count queries
      mockPrisma.fileMetadata.count
        .mockResolvedValueOnce(100) // totalFiles
        .mockResolvedValueOnce(10) // deletedFiles
        .mockResolvedValueOnce(50) // USER_PROFILE total
        .mockResolvedValueOnce(5) // USER_PROFILE deleted
        .mockResolvedValueOnce(30) // PRODUCT total
        .mockResolvedValueOnce(3) // PRODUCT deleted
        .mockResolvedValueOnce(20) // PROPERTY total
        .mockResolvedValueOnce(2); // PROPERTY deleted

      mockPrisma.legalHold.count
        .mockResolvedValueOnce(2) // active legal holds
        .mockResolvedValueOnce(1); // released legal holds

      mockPrisma.dataDeletionRequest.count
        .mockResolvedValueOnce(5) // pending requests
        .mockResolvedValueOnce(15) // processed requests
        .mockResolvedValueOnce(2); // failed requests

      mockPrisma.retentionAuditLog.count.mockResolvedValue(8); // anonymized files

      vi.spyOn(retentionService, 'identifyExpiredFiles').mockResolvedValue([
        'file-1',
        'file-2',
      ]);

      const report = await retentionService.generateRetentionReport(
        startDate,
        endDate
      );

      expect(report.period.startDate).toEqual(startDate);
      expect(report.period.endDate).toEqual(endDate);
      expect(report.summary.totalFiles).toBe(100);
      expect(report.summary.expiredFiles).toBe(2);
      expect(report.summary.deletedFiles).toBe(10);
      expect(report.summary.anonymizedFiles).toBe(8);
      expect(report.byEntityType.USER_PROFILE.totalFiles).toBe(50);
      expect(report.legalHolds.active).toBe(2);
      expect(report.deletionRequests.pending).toBe(5);
    });
  });

  describe('auditFileRetention', () => {
    it('should audit file retention status', async () => {
      const fileId = 'file-123';
      const mockFile = {
        id: fileId,
        entityType: 'USER_PROFILE',
        entityId: 'user-123',
        status: 'READY',
        createdAt: new Date('2023-01-01'),
      };

      const mockPolicy = {
        id: 'policy-1',
        entityType: 'USER_PROFILE',
        retentionPeriodDays: 365,
        isActive: true,
      };

      mockPrisma.fileMetadata.findUnique.mockResolvedValue(mockFile);
      mockPrisma.retentionPolicy.findFirst.mockResolvedValue(mockPolicy);
      mockPrisma.legalHold.findMany.mockResolvedValue([]);
      mockPrisma.dataDeletionRequest.findMany.mockResolvedValue([]);

      const audit = await retentionService.auditFileRetention(fileId);

      expect(audit.fileId).toBe(fileId);
      expect(audit.currentStatus).toBe('READY');
      expect(audit.retentionPolicy).toEqual(mockPolicy);
      expect(audit.complianceStatus).toBe('expired'); // File from 2023 with 365-day retention
      expect(audit.recommendations).toContain(
        'File has exceeded retention period and should be deleted'
      );
    });

    it('should identify files under legal hold', async () => {
      const fileId = 'file-123';
      const mockFile = {
        id: fileId,
        entityType: 'USER_PROFILE',
        entityId: 'user-123',
        status: 'READY',
        createdAt: new Date(),
      };

      const mockLegalHolds = [
        {
          id: 'hold-1',
          name: 'Investigation Hold',
          isActive: true,
          fileIds: [fileId],
        },
      ];

      mockPrisma.fileMetadata.findUnique.mockResolvedValue(mockFile);
      mockPrisma.retentionPolicy.findFirst.mockResolvedValue(null);
      mockPrisma.legalHold.findMany.mockResolvedValue(mockLegalHolds);
      mockPrisma.dataDeletionRequest.findMany.mockResolvedValue([]);

      const audit = await retentionService.auditFileRetention(fileId);

      expect(audit.complianceStatus).toBe('held');
      expect(audit.legalHolds).toHaveLength(1);
      expect(audit.recommendations).toContain(
        'File is under legal hold: Investigation Hold'
      );
    });
  });
});
