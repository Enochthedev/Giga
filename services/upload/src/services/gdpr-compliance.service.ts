import { PrismaClient } from '../generated/prisma-client';
import { Logger } from '../lib/logger';
import { EntityType } from '../types/upload.types';
import { RetentionServiceImpl } from './retention.service';

export interface GDPRRequest {
  id: string;
  requestType:
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'portability'
  | 'restriction';
  userId: string;
  userEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestData?: Record<string, any>;
  responseData?: Record<string, any>;
  legalBasis?: string;
  processingNotes?: string;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

export interface DataPortabilityExport {
  userId: string;
  exportedAt: Date;
  files: Array<{
    id: string;
    originalName: string;
    uploadedAt: Date;
    size: number;
    mimeType: string;
    downloadUrl: string;
    metadata: Record<string, any>;
  }>;
  totalFiles: number;
  totalSize: number;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  purpose: string;
  legalBasis:
  | 'consent'
  | 'contract'
  | 'legal_obligation'
  | 'vital_interests'
  | 'public_task'
  | 'legitimate_interests';
  consentGiven: boolean;
  consentDate: Date;
  withdrawnDate?: Date;
  processingActivities: string[];
  dataCategories: string[];
  retentionPeriod?: number;
  isActive: boolean;
}

export class GDPRComplianceService {
  private prisma: PrismaClient;
  private logger: Logger;
  private retentionService: RetentionServiceImpl;

  constructor(
    prisma: PrismaClient,
    logger: Logger,
    retentionService: RetentionServiceImpl
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.retentionService = retentionService;
  }

  // Right to Access (Article 15)
  async processAccessRequest(
    userId: string,
    userEmail: string
  ): Promise<GDPRRequest> {
    try {
      const request = await this.createGDPRRequest('access', userId, userEmail);

      // Collect all user data
      const userData = await this.collectUserData(userId);

      const updatedRequest = {
        ...request,
        status: 'completed' as const,
        responseData: userData,
        completedAt: new Date(),
      };

      await this.updateGDPRRequest(request.id, {
        status: 'completed',
        responseData: userData,
        completedAt: new Date(),
      });

      this.logger.info('GDPR access request processed', {
        userId,
        requestId: request.id,
      });
      return updatedRequest;
    } catch (error) {
      this.logger.error('Failed to process GDPR access request', {
        error,
        userId,
      });
      throw new Error('Failed to process access request');
    }
  }

  // Right to Rectification (Article 16)
  async processRectificationRequest(
    userId: string,
    userEmail: string,
    corrections: Record<string, any>
  ): Promise<GDPRRequest> {
    try {
      const request = await this.createGDPRRequest(
        'rectification',
        userId,
        userEmail,
        corrections
      );

      // Apply corrections to file metadata
      const userFiles = await this.prisma.fileMetadata.findMany({
        where: {
          entityType: 'USER_PROFILE',
          entityId: userId,
          status: { not: 'DELETED' },
        },
      });

      let correctedFiles = 0;
      for (const file of userFiles) {
        if (corrections.metadata) {
          await this.prisma.fileMetadata.update({
            where: { id: file.id },
            data: {
              metadata: {
                ...(file.metadata as Record<string, any> || {}),
                ...(corrections.metadata || {})
              },
            },
          });
          correctedFiles++;
        }
      }

      const updatedRequest = {
        ...request,
        status: 'completed' as const,
        responseData: { correctedFiles },
        completedAt: new Date(),
      };

      await this.updateGDPRRequest(request.id, {
        status: 'completed',
        responseData: { correctedFiles },
        completedAt: new Date(),
      });

      this.logger.info('GDPR rectification request processed', {
        userId,
        requestId: request.id,
        correctedFiles,
      });
      return updatedRequest;
    } catch (error) {
      this.logger.error('Failed to process GDPR rectification request', {
        error,
        userId,
      });
      throw new Error('Failed to process rectification request');
    }
  }

  // Right to Erasure (Article 17)
  async processErasureRequest(
    userId: string,
    userEmail: string,
    reason?: string
  ): Promise<GDPRRequest> {
    try {
      const request = await this.createGDPRRequest(
        'erasure',
        userId,
        userEmail,
        { reason }
      );

      // Create data deletion request
      const deletionRequest = await this.retentionService.requestDataDeletion({
        requestType: 'gdpr_request',
        entityType: EntityType.USER_PROFILE,
        entityId: userId,
        requestedBy: userEmail,
        scheduledAt: new Date(),
        metadata: { gdprRequestId: request.id, reason },
      });

      // Process the deletion
      await this.retentionService.processDataDeletionRequest(
        deletionRequest.id
      );

      const updatedRequest = {
        ...request,
        status: 'completed' as const,
        responseData: { deletionRequestId: deletionRequest.id },
        completedAt: new Date(),
      };

      await this.updateGDPRRequest(request.id, {
        status: 'completed',
        responseData: { deletionRequestId: deletionRequest.id },
        completedAt: new Date(),
      });

      this.logger.info('GDPR erasure request processed', {
        userId,
        requestId: request.id,
        deletionRequestId: deletionRequest.id,
      });
      return updatedRequest;
    } catch (error) {
      this.logger.error('Failed to process GDPR erasure request', {
        error,
        userId,
      });
      throw new Error('Failed to process erasure request');
    }
  }

  // Right to Data Portability (Article 20)
  async processPortabilityRequest(
    userId: string,
    userEmail: string
  ): Promise<DataPortabilityExport> {
    try {
      const request = await this.createGDPRRequest(
        'portability',
        userId,
        userEmail
      );

      const userFiles = await this.prisma.fileMetadata.findMany({
        where: {
          entityType: 'USER_PROFILE',
          entityId: userId,
          status: { not: 'DELETED' },
        },
        orderBy: { createdAt: 'desc' },
      });

      const exportData: DataPortabilityExport = {
        userId,
        exportedAt: new Date(),
        files: userFiles.map(file => ({
          id: file.id,
          originalName: file.originalName,
          uploadedAt: file.createdAt,
          size: file.size,
          mimeType: file.mimeType,
          downloadUrl: file.url,
          metadata: file.metadata as Record<string, any>,
        })),
        totalFiles: userFiles.length,
        totalSize: userFiles.reduce((sum, file) => sum + file.size, 0),
      };

      await this.updateGDPRRequest(request.id, {
        status: 'completed',
        responseData: exportData,
        completedAt: new Date(),
      });

      this.logger.info('GDPR portability request processed', {
        userId,
        requestId: request.id,
        totalFiles: exportData.totalFiles,
        totalSize: exportData.totalSize,
      });

      return exportData;
    } catch (error) {
      this.logger.error('Failed to process GDPR portability request', {
        error,
        userId,
      });
      throw new Error('Failed to process portability request');
    }
  }

  // Right to Restriction (Article 18)
  async processRestrictionRequest(
    userId: string,
    userEmail: string,
    reason: string
  ): Promise<GDPRRequest> {
    try {
      const request = await this.createGDPRRequest(
        'restriction',
        userId,
        userEmail,
        { reason }
      );

      // Create legal hold to restrict processing
      const legalHold = await this.retentionService.createLegalHold({
        name: `GDPR Restriction - User ${userId}`,
        description: `Processing restriction requested by user: ${reason}`,
        entityType: EntityType.USER_PROFILE,
        entityIds: [userId],
        fileIds: [],
        isActive: true,
        createdBy: userEmail,
      });

      const updatedRequest = {
        ...request,
        status: 'completed' as const,
        responseData: { legalHoldId: legalHold.id },
        completedAt: new Date(),
      };

      await this.updateGDPRRequest(request.id, {
        status: 'completed',
        responseData: { legalHoldId: legalHold.id },
        completedAt: new Date(),
      });

      this.logger.info('GDPR restriction request processed', {
        userId,
        requestId: request.id,
        legalHoldId: legalHold.id,
      });
      return updatedRequest;
    } catch (error) {
      this.logger.error('Failed to process GDPR restriction request', {
        error,
        userId,
      });
      throw new Error('Failed to process restriction request');
    }
  }

  // Consent Management
  async recordConsent(
    consent: Omit<ConsentRecord, 'id'>
  ): Promise<ConsentRecord> {
    try {
      // This would typically be stored in a separate consent management table
      // For now, we'll log it and store in audit logs
      await this.prisma.retentionAuditLog.create({
        data: {
          action: 'POLICY_CREATED', // Using existing enum, would add CONSENT_RECORDED
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

      this.logger.info('Consent recorded', {
        userId: consent.userId,
        purpose: consent.purpose,
        consentGiven: consent.consentGiven,
      });

      return {
        id: `consent_${Date.now()}`,
        ...consent,
      };
    } catch (error) {
      this.logger.error('Failed to record consent', { error, consent });
      throw new Error('Failed to record consent');
    }
  }

  async withdrawConsent(userId: string, purpose: string): Promise<boolean> {
    try {
      await this.prisma.retentionAuditLog.create({
        data: {
          action: 'POLICY_UPDATED', // Using existing enum, would add CONSENT_WITHDRAWN
          details: {
            type: 'consent_withdrawal',
            userId,
            purpose,
            withdrawnAt: new Date(),
          },
          performedBy: userId,
        },
      });

      // If consent is withdrawn, we may need to delete or restrict processing
      // This depends on the legal basis and business requirements

      this.logger.info('Consent withdrawn', { userId, purpose });
      return true;
    } catch (error) {
      this.logger.error('Failed to withdraw consent', {
        error,
        userId,
        purpose,
      });
      return false;
    }
  }

  // Privacy Impact Assessment helpers
  async generatePrivacyReport(userId: string): Promise<Record<string, any>> {
    try {
      const [userFiles, accessLogs, retentionAudit] = await Promise.all([
        this.prisma.fileMetadata.findMany({
          where: {
            entityType: 'USER_PROFILE',
            entityId: userId,
          },
        }),
        this.prisma.accessLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        this.retentionService.auditFileRetention(userId).catch(() => null),
      ]);

      const report = {
        userId,
        generatedAt: new Date(),
        dataProcessing: {
          totalFiles: userFiles.length,
          activeFiles: userFiles.filter(f => f.status !== 'DELETED').length,
          deletedFiles: userFiles.filter(f => f.status === 'DELETED').length,
          totalStorageUsed: userFiles.reduce((sum, f) => sum + f.size, 0),
        },
        accessActivity: {
          totalAccesses: accessLogs.length,
          recentAccesses: accessLogs.slice(0, 10),
          lastAccess: accessLogs[0]?.createdAt,
        },
        compliance: {
          retentionStatus: retentionAudit?.complianceStatus,
          legalHolds: retentionAudit?.legalHolds?.length || 0,
          recommendations: retentionAudit?.recommendations || [],
        },
      };

      this.logger.info('Privacy report generated', { userId });
      return report;
    } catch (error) {
      this.logger.error('Failed to generate privacy report', { error, userId });
      throw new Error('Failed to generate privacy report');
    }
  }

  private async createGDPRRequest(
    requestType: GDPRRequest['requestType'],
    userId: string,
    userEmail: string,
    requestData?: Record<string, any>
  ): Promise<GDPRRequest> {
    const request: GDPRRequest = {
      id: `gdpr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestType,
      userId,
      userEmail,
      status: 'processing',
      requestData,
      createdAt: new Date(),
    };

    // Log the request creation
    await this.prisma.retentionAuditLog.create({
      data: {
        action: 'DELETION_REQUEST_CREATED', // Using existing enum, would add GDPR_REQUEST_CREATED
        details: {
          type: 'gdpr_request',
          requestId: request.id,
          requestType,
          userId,
          userEmail,
        },
        performedBy: userEmail,
      },
    });

    return request;
  }

  private async updateGDPRRequest(
    requestId: string,
    updates: Partial<GDPRRequest>
  ): Promise<void> {
    await this.prisma.retentionAuditLog.create({
      data: {
        action: 'DELETION_REQUEST_PROCESSED', // Using existing enum, would add GDPR_REQUEST_UPDATED
        details: {
          type: 'gdpr_request_update',
          requestId,
          updates,
        },
        performedBy: 'system',
      },
    });
  }

  private async collectUserData(
    userId: string
  ): Promise<Record<string, unknown>> {
    const [files, accessLogs, sessions] = await Promise.all([
      this.prisma.fileMetadata.findMany({
        where: {
          entityType: 'USER_PROFILE',
          entityId: userId,
        },
      }),
      this.prisma.accessLog.findMany({
        where: { userId },
      }),
      this.prisma.uploadSession.findMany({
        where: { uploadedBy: userId },
        include: { files: true },
      }),
    ]);

    return {
      personalData: {
        userId,
        collectedAt: new Date(),
      },
      files: files.map(file => ({
        id: file.id,
        originalName: file.originalName,
        uploadedAt: file.createdAt,
        size: file.size,
        mimeType: file.mimeType,
        status: file.status,
        metadata: file.metadata,
      })),
      accessHistory: accessLogs.map(log => ({
        operation: log.operation,
        timestamp: log.createdAt,
        success: log.success,
        ipAddress: log.ipAddress,
      })),
      uploadSessions: sessions.map(session => ({
        id: session.id,
        createdAt: session.createdAt,
        status: session.status,
        totalFiles: session.totalFiles,
        uploadedFiles: session.uploadedFiles,
      })),
    };
  }
}
