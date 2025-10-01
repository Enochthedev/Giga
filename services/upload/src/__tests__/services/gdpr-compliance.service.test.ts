import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '../../generated/prisma-client';
import { Logger } from '../../lib/logger';
import { GDPRComplianceService } from '../../services/gdpr-compliance.service';
import { RetentionServiceImpl } from '../../services/retention.service';
import { EntityType } from '../../types/upload.types';

// Mock dependencies
const mockPrisma = {
  fileMetadata: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  accessLog: {
    findMany: vi.fn(),
  },
  uploadSession: {
    findMany: vi.fn(),
  },
  retentionAuditLog: {
    create: vi.fn(),
  },
} as unknown as PrismaClient;

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
} as unknown as Logger;

const mockRetentionService = {
  requestDataDeletion: vi.fn(),
  processDataDeletionRequest: vi.fn(),
  createLegalHold: vi.fn(),
  auditFileRetention: vi.fn(),
} as unknown as RetentionServiceImpl;

describe('GDPRComplianceService', () => {
  let gdprService: GDPRComplianceService;

  beforeEach(() => {
    gdprService = new GDPRComplianceService(
      mockPrisma,
      mockLogger,
      mockRetentionService
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('processAccessRequest', () => {
    it('should process GDPR access request successfully', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';

      const mockFiles = [
        {
          id: 'file-1',
          originalName: 'profile.jpg',
          createdAt: new Date('2024-01-01'),
          size: 1024,
          mimeType: 'image/jpeg',
          status: 'READY',
          metadata: { description: 'Profile photo' },
        },
      ];

      const mockAccessLogs = [
        {
          operation: 'READ',
          createdAt: new Date('2024-01-15'),
          success: true,
          ipAddress: '192.168.1.1',
        },
      ];

      const mockSessions = [
        {
          id: 'session-1',
          createdAt: new Date('2024-01-01'),
          status: 'COMPLETED',
          totalFiles: 1,
          uploadedFiles: 1,
          files: [],
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.accessLog.findMany.mockResolvedValue(mockAccessLogs);
      mockPrisma.uploadSession.findMany.mockResolvedValue(mockSessions);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processAccessRequest(userId, userEmail);

      expect(result.requestType).toBe('access');
      expect(result.userId).toBe(userId);
      expect(result.userEmail).toBe(userEmail);
      expect(result.status).toBe('completed');
      expect(result.responseData).toBeDefined();
      expect(result.responseData.files).toHaveLength(1);
      expect(result.responseData.accessHistory).toHaveLength(1);
      expect(result.responseData.uploadSessions).toHaveLength(1);
    });

    it('should handle access request errors', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';

      mockPrisma.fileMetadata.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        gdprService.processAccessRequest(userId, userEmail)
      ).rejects.toThrow('Failed to process access request');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('processRectificationRequest', () => {
    it('should process GDPR rectification request successfully', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';
      const corrections = {
        metadata: {
          description: 'Updated profile photo',
          category: 'personal',
        },
      };

      const mockFiles = [
        {
          id: 'file-1',
          metadata: { description: 'Old description' },
        },
        {
          id: 'file-2',
          metadata: { category: 'old-category' },
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.fileMetadata.update.mockResolvedValue({});
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processRectificationRequest(
        userId,
        userEmail,
        corrections
      );

      expect(result.requestType).toBe('rectification');
      expect(result.status).toBe('completed');
      expect(result.responseData.correctedFiles).toBe(2);
      expect(mockPrisma.fileMetadata.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('processErasureRequest', () => {
    it('should process GDPR erasure request successfully', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';
      const reason = 'User requested account deletion';

      const mockDeletionRequest = {
        id: 'deletion-123',
        requestType: 'gdpr_request',
        entityType: EntityType.USER_PROFILE,
        entityId: userId,
        status: 'completed',
      };

      mockRetentionService.requestDataDeletion.mockResolvedValue(
        mockDeletionRequest
      );
      mockRetentionService.processDataDeletionRequest.mockResolvedValue(
        mockDeletionRequest
      );
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processErasureRequest(
        userId,
        userEmail,
        reason
      );

      expect(result.requestType).toBe('erasure');
      expect(result.status).toBe('completed');
      expect(result.responseData.deletionRequestId).toBe('deletion-123');
      expect(mockRetentionService.requestDataDeletion).toHaveBeenCalledWith({
        requestType: 'gdpr_request',
        entityType: EntityType.USER_PROFILE,
        entityId: userId,
        requestedBy: userEmail,
        scheduledAt: expect.any(Date),
        metadata: { gdprRequestId: expect.any(String), reason },
      });
    });
  });

  describe('processPortabilityRequest', () => {
    it('should process GDPR portability request successfully', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';

      const mockFiles = [
        {
          id: 'file-1',
          originalName: 'profile.jpg',
          createdAt: new Date('2024-01-01'),
          size: 1024,
          mimeType: 'image/jpeg',
          url: 'https://example.com/file1.jpg',
          metadata: { description: 'Profile photo' },
        },
        {
          id: 'file-2',
          originalName: 'document.pdf',
          createdAt: new Date('2024-01-02'),
          size: 2048,
          mimeType: 'application/pdf',
          url: 'https://example.com/file2.pdf',
          metadata: { type: 'document' },
        },
      ];

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processPortabilityRequest(
        userId,
        userEmail
      );

      expect(result.userId).toBe(userId);
      expect(result.totalFiles).toBe(2);
      expect(result.totalSize).toBe(3072); // 1024 + 2048
      expect(result.files).toHaveLength(2);
      expect(result.files[0]).toEqual({
        id: 'file-1',
        originalName: 'profile.jpg',
        uploadedAt: new Date('2024-01-01'),
        size: 1024,
        mimeType: 'image/jpeg',
        downloadUrl: 'https://example.com/file1.jpg',
        metadata: { description: 'Profile photo' },
      });
    });

    it('should handle empty file list', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';

      mockPrisma.fileMetadata.findMany.mockResolvedValue([]);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processPortabilityRequest(
        userId,
        userEmail
      );

      expect(result.totalFiles).toBe(0);
      expect(result.totalSize).toBe(0);
      expect(result.files).toHaveLength(0);
    });
  });

  describe('processRestrictionRequest', () => {
    it('should process GDPR restriction request successfully', async () => {
      const userId = 'user-123';
      const userEmail = 'user@example.com';
      const reason = 'Disputing data accuracy';

      const mockLegalHold = {
        id: 'hold-123',
        name: `GDPR Restriction - User ${userId}`,
        description: `Processing restriction requested by user: ${reason}`,
        isActive: true,
      };

      mockRetentionService.createLegalHold.mockResolvedValue(mockLegalHold);
      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.processRestrictionRequest(
        userId,
        userEmail,
        reason
      );

      expect(result.requestType).toBe('restriction');
      expect(result.status).toBe('completed');
      expect(result.responseData.legalHoldId).toBe('hold-123');
      expect(mockRetentionService.createLegalHold).toHaveBeenCalledWith({
        name: `GDPR Restriction - User ${userId}`,
        description: `Processing restriction requested by user: ${reason}`,
        entityType: EntityType.USER_PROFILE,
        entityIds: [userId],
        fileIds: [],
        isActive: true,
        createdBy: userEmail,
      });
    });
  });

  describe('recordConsent', () => {
    it('should record consent successfully', async () => {
      const consent = {
        userId: 'user-123',
        purpose: 'Profile photo processing',
        legalBasis: 'consent' as const,
        consentGiven: true,
        consentDate: new Date(),
        processingActivities: ['image_processing', 'storage'],
        dataCategories: ['profile_images'],
        isActive: true,
      };

      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.recordConsent(consent);

      expect(result.id).toBeDefined();
      expect(result.userId).toBe(consent.userId);
      expect(result.purpose).toBe(consent.purpose);
      expect(result.consentGiven).toBe(true);
      expect(mockPrisma.retentionAuditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'POLICY_CREATED',
          details: {
            type: 'consent_record',
            userId: consent.userId,
            purpose: consent.purpose,
            legalBasis: consent.legalBasis,
            consentGiven: consent.consentGiven,
            processingActivities: consent.processingActivities,
            dataCategories: consent.dataCategories,
          },
          performedBy: consent.userId,
        },
      });
    });
  });

  describe('withdrawConsent', () => {
    it('should withdraw consent successfully', async () => {
      const userId = 'user-123';
      const purpose = 'Profile photo processing';

      mockPrisma.retentionAuditLog.create.mockResolvedValue({});

      const result = await gdprService.withdrawConsent(userId, purpose);

      expect(result).toBe(true);
      expect(mockPrisma.retentionAuditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'POLICY_UPDATED',
          details: {
            type: 'consent_withdrawal',
            userId,
            purpose,
            withdrawnAt: expect.any(Date),
          },
          performedBy: userId,
        },
      });
    });

    it('should handle consent withdrawal errors', async () => {
      const userId = 'user-123';
      const purpose = 'Profile photo processing';

      mockPrisma.retentionAuditLog.create.mockRejectedValue(
        new Error('Database error')
      );

      const result = await gdprService.withdrawConsent(userId, purpose);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('generatePrivacyReport', () => {
    it('should generate comprehensive privacy report', async () => {
      const userId = 'user-123';

      const mockFiles = [
        {
          id: 'file-1',
          status: 'READY',
          size: 1024,
        },
        {
          id: 'file-2',
          status: 'DELETED',
          size: 512,
        },
      ];

      const mockAccessLogs = [
        {
          operation: 'READ',
          createdAt: new Date('2024-01-15'),
          success: true,
          ipAddress: '192.168.1.1',
        },
        {
          operation: 'WRITE',
          createdAt: new Date('2024-01-10'),
          success: true,
          ipAddress: '192.168.1.2',
        },
      ];

      const mockRetentionAudit = {
        complianceStatus: 'compliant',
        legalHolds: [],
        recommendations: ['All files are compliant'],
      };

      mockPrisma.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrisma.accessLog.findMany.mockResolvedValue(mockAccessLogs);
      mockRetentionService.auditFileRetention.mockResolvedValue(
        mockRetentionAudit
      );

      const report = await gdprService.generatePrivacyReport(userId);

      expect(report.userId).toBe(userId);
      expect(report.generatedAt).toBeDefined();
      expect(report.dataProcessing.totalFiles).toBe(2);
      expect(report.dataProcessing.activeFiles).toBe(1);
      expect(report.dataProcessing.deletedFiles).toBe(1);
      expect(report.dataProcessing.totalStorageUsed).toBe(1536); // 1024 + 512
      expect(report.accessActivity.totalAccesses).toBe(2);
      expect(report.accessActivity.lastAccess).toEqual(new Date('2024-01-15'));
      expect(report.compliance.retentionStatus).toBe('compliant');
      expect(report.compliance.legalHolds).toBe(0);
    });

    it('should handle privacy report generation errors', async () => {
      const userId = 'user-123';

      mockPrisma.fileMetadata.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(gdprService.generatePrivacyReport(userId)).rejects.toThrow(
        'Failed to generate privacy report'
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
