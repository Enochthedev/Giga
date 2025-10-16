import { PrismaClient } from '../generated/prisma-client';
import {
  DataDeletionRequest,
  FileRetentionAudit,
  LegalHold,
  RetentionPolicy,
  RetentionReport,
  RetentionService,
} from '../interfaces/retention.interface';
import { Logger } from '../lib/logger';
import { EntityType } from '../types/upload.types';
import { MetadataService } from './metadata.service';
import { StorageManagerService } from './storage-manager.service';

export class RetentionServiceImpl implements RetentionService {
  private prisma: PrismaClient;
  private logger: Logger;
  private storageManager: StorageManagerService;
  private metadataService: MetadataService;

  constructor(
    prisma: PrismaClient,
    logger: Logger,
    storageManager: StorageManagerService,
    metadataService: MetadataService
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.storageManager = storageManager;
    this.metadataService = metadataService;
  }

  // Policy management
  async createRetentionPolicy(
    policy: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RetentionPolicy> {
    try {
      const created = await this.prisma.retentionPolicy.create({
        data: {
          name: policy.name,
          entityType: policy.entityType as any,
          retentionPeriodDays: policy.retentionPeriodDays,
          jurisdiction: policy.jurisdiction,
          isActive: policy.isActive,
          description: policy.description,
          legalBasis: policy.legalBasis,
        },
      });

      await this.auditLog('POLICY_CREATED', {
        policyId: created.id,
        entityType: policy.entityType,
        retentionPeriodDays: policy.retentionPeriodDays,
      });

      this.logger.info('Retention policy created', { policyId: created.id });
      return {
        ...created,
        entityType: created.entityType as any,
      } as RetentionPolicy;
    } catch (error) {
      this.logger.error('Failed to create retention policy', { error, policy });
      throw new Error('Failed to create retention policy');
    }
  }

  async updateRetentionPolicy(
    id: string,
    updates: Partial<RetentionPolicy>
  ): Promise<RetentionPolicy> {
    try {
      const updated = await this.prisma.retentionPolicy.update({
        where: { id },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.retentionPeriodDays && {
            retentionPeriodDays: updates.retentionPeriodDays,
          }),
          ...(updates.jurisdiction && { jurisdiction: updates.jurisdiction }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive }),
          ...(updates.description && { description: updates.description }),
          ...(updates.legalBasis && { legalBasis: updates.legalBasis }),
        },
      });

      await this.auditLog('POLICY_UPDATED', {
        policyId: id,
        updates,
      });

      this.logger.info('Retention policy updated', { policyId: id });
      return {
        ...updated,
        entityType: updated.entityType as any,
      } as RetentionPolicy;
    } catch (error) {
      this.logger.error('Failed to update retention policy', {
        error,
        id,
        updates,
      });
      throw new Error('Failed to update retention policy');
    }
  }

  async deleteRetentionPolicy(id: string): Promise<boolean> {
    try {
      await this.prisma.retentionPolicy.delete({
        where: { id },
      });

      await this.auditLog('POLICY_DELETED', {
        policyId: id,
      });

      this.logger.info('Retention policy deleted', { policyId: id });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete retention policy', { error, id });
      return false;
    }
  }

  async getRetentionPolicy(id: string): Promise<RetentionPolicy | null> {
    try {
      const policy = await this.prisma.retentionPolicy.findUnique({
        where: { id },
        include: { rules: true },
      });
      return policy
        ? ({
            ...policy,
            entityType: policy.entityType as any,
          } as RetentionPolicy)
        : null;
    } catch (error) {
      this.logger.error('Failed to get retention policy', { error, id });
      return null;
    }
  }

  async listRetentionPolicies(
    entityType?: EntityType
  ): Promise<RetentionPolicy[]> {
    try {
      const policies = await this.prisma.retentionPolicy.findMany({
        where: entityType ? { entityType } : undefined,
        include: { rules: true },
        orderBy: { createdAt: 'desc' },
      });
      return policies.map(policy => ({
        ...policy,
        entityType: policy.entityType as any,
      })) as RetentionPolicy[];
    } catch (error) {
      this.logger.error('Failed to list retention policies', {
        error,
        entityType,
      });
      return [];
    }
  }

  // Legal holds
  async createLegalHold(
    hold: Omit<LegalHold, 'id' | 'createdAt'>
  ): Promise<LegalHold> {
    try {
      const created = await this.prisma.legalHold.create({
        data: {
          name: hold.name,
          description: hold.description,
          entityType: hold.entityType as any,
          entityIds: hold.entityIds || [],
          fileIds: hold.fileIds || [],
          isActive: hold.isActive,
          createdBy: hold.createdBy,
          expiresAt: hold.expiresAt,
        },
      });

      await this.auditLog('LEGAL_HOLD_CREATED', {
        holdId: created.id,
        entityType: hold.entityType,
        entityIds: hold.entityIds,
        fileIds: hold.fileIds,
      });

      this.logger.info('Legal hold created', { holdId: created.id });
      return {
        ...created,
        entityType: created.entityType as any,
      } as LegalHold;
    } catch (error) {
      this.logger.error('Failed to create legal hold', { error, hold });
      throw new Error('Failed to create legal hold');
    }
  }

  async releaseLegalHold(id: string): Promise<boolean> {
    try {
      await this.prisma.legalHold.update({
        where: { id },
        data: { isActive: false },
      });

      await this.auditLog('LEGAL_HOLD_RELEASED', {
        holdId: id,
      });

      this.logger.info('Legal hold released', { holdId: id });
      return true;
    } catch (error) {
      this.logger.error('Failed to release legal hold', { error, id });
      return false;
    }
  }

  async getLegalHold(id: string): Promise<LegalHold | null> {
    try {
      const hold = await this.prisma.legalHold.findUnique({
        where: { id },
      });
      return hold
        ? ({
            ...hold,
            entityType: hold.entityType as any,
          } as LegalHold)
        : null;
    } catch (error) {
      this.logger.error('Failed to get legal hold', { error, id });
      return null;
    }
  }

  async listActiveLegalHolds(): Promise<LegalHold[]> {
    try {
      const holds = await this.prisma.legalHold.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      return holds.map(hold => ({
        ...hold,
        entityType: hold.entityType as any,
      })) as LegalHold[];
    } catch (error) {
      this.logger.error('Failed to list active legal holds', { error });
      return [];
    }
  }

  // Data deletion requests
  async requestDataDeletion(
    request: Omit<DataDeletionRequest, 'id' | 'status' | 'filesDeleted'>
  ): Promise<DataDeletionRequest> {
    try {
      const created = await this.prisma.dataDeletionRequest.create({
        data: {
          requestType: request.requestType as any,
          entityType: request.entityType as any,
          entityId: request.entityId,
          requestedBy: request.requestedBy,
          scheduledAt: request.scheduledAt,
          metadata: request.metadata || {},
        },
      });

      await this.auditLog('DELETION_REQUEST_CREATED', {
        requestId: created.id,
        requestType: request.requestType,
        entityType: request.entityType,
        entityId: request.entityId,
      });

      this.logger.info('Data deletion request created', {
        requestId: created.id,
      });
      return {
        ...created,
        entityType: created.entityType as any,
        requestType: created.requestType as any,
        status: created.status as any,
      } as DataDeletionRequest;
    } catch (error) {
      this.logger.error('Failed to create data deletion request', {
        error,
        request,
      });
      throw new Error('Failed to create data deletion request');
    }
  }

  async processDataDeletionRequest(id: string): Promise<DataDeletionRequest> {
    try {
      const request = await this.prisma.dataDeletionRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new Error('Data deletion request not found');
      }

      // Update status to processing
      await this.prisma.dataDeletionRequest.update({
        where: { id },
        data: { status: 'PROCESSING' },
      });

      let filesDeleted = 0;
      let errorMessage: string | undefined;

      try {
        // Find files to delete
        const files = await this.prisma.fileMetadata.findMany({
          where: {
            entityType: request.entityType,
            entityId: request.entityId,
            status: { not: 'DELETED' },
          },
        });

        // Check for legal holds
        const activeLegalHolds = await this.prisma.legalHold.findMany({
          where: {
            isActive: true,
            OR: [
              {
                entityType: request.entityType,
                entityIds: { has: request.entityId },
              },
              { fileIds: { hasSome: files.map(f => f.id) } },
            ],
          },
        });

        if (activeLegalHolds.length > 0) {
          throw new Error(
            `Cannot delete files under legal hold: ${activeLegalHolds.map(h => h.name).join(', ')}`
          );
        }

        // Delete files
        for (const file of files) {
          try {
            // Delete from storage
            await this.storageManager.delete(file.path);

            // Mark as deleted in database
            await this.prisma.fileMetadata.update({
              where: { id: file.id },
              data: { status: 'DELETED' },
            });

            filesDeleted++;

            await this.auditLog('FILE_DELETED', {
              fileId: file.id,
              entityType: file.entityType,
              entityId: file.entityId,
              reason: 'data_deletion_request',
              requestId: id,
            });
          } catch (fileError) {
            this.logger.error('Failed to delete file', {
              error: fileError,
              fileId: file.id,
            });
          }
        }

        // Update request as completed
        const updated = await this.prisma.dataDeletionRequest.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            processedAt: new Date(),
            filesDeleted,
          },
        });

        await this.auditLog('DELETION_REQUEST_PROCESSED', {
          requestId: id,
          filesDeleted,
          status: 'completed',
        });

        this.logger.info('Data deletion request processed', {
          requestId: id,
          filesDeleted,
        });
        return {
          ...updated,
          entityType: updated.entityType as any,
          requestType: updated.requestType as any,
          status: updated.status as any,
        } as DataDeletionRequest;
      } catch (processingError) {
        errorMessage =
          processingError instanceof Error
            ? processingError.message
            : 'Unknown error';

        // Update request as failed
        const updated = await this.prisma.dataDeletionRequest.update({
          where: { id },
          data: {
            status: 'FAILED',
            processedAt: new Date(),
            filesDeleted,
            errorMessage,
          },
        });

        this.logger.error('Data deletion request failed', {
          requestId: id,
          error: processingError,
        });
        return {
          ...updated,
          entityType: updated.entityType as any,
          requestType: updated.requestType as any,
          status: updated.status as any,
        } as DataDeletionRequest;
      }
    } catch (error) {
      this.logger.error('Failed to process data deletion request', {
        error,
        id,
      });
      throw new Error('Failed to process data deletion request');
    }
  }

  async getDataDeletionRequest(
    id: string
  ): Promise<DataDeletionRequest | null> {
    try {
      const request = await this.prisma.dataDeletionRequest.findUnique({
        where: { id },
      });
      return request
        ? ({
            ...request,
            entityType: request.entityType as any,
            requestType: request.requestType as any,
            status: request.status as any,
          } as DataDeletionRequest)
        : null;
    } catch (error) {
      this.logger.error('Failed to get data deletion request', { error, id });
      return null;
    }
  }

  async listDataDeletionRequests(
    status?: string
  ): Promise<DataDeletionRequest[]> {
    try {
      const requests = await this.prisma.dataDeletionRequest.findMany({
        where: status ? { status: status as any } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      return requests.map(request => ({
        ...request,
        entityType: request.entityType as any,
        requestType: request.requestType as any,
        status: request.status as any,
      })) as DataDeletionRequest[];
    } catch (error) {
      this.logger.error('Failed to list data deletion requests', {
        error,
        status,
      });
      return [];
    }
  }

  // Cleanup operations
  async identifyExpiredFiles(): Promise<string[]> {
    try {
      const policies = await this.prisma.retentionPolicy.findMany({
        where: { isActive: true },
      });

      const expiredFileIds: string[] = [];

      for (const policy of policies) {
        const expirationDate = new Date();
        expirationDate.setDate(
          expirationDate.getDate() - policy.retentionPeriodDays
        );

        const expiredFiles = await this.prisma.fileMetadata.findMany({
          where: {
            entityType: policy.entityType,
            createdAt: { lt: expirationDate },
            status: { not: 'DELETED' },
          },
          select: { id: true },
        });

        expiredFileIds.push(...expiredFiles.map(f => f.id));
      }

      // Remove files under legal hold
      const legalHolds = await this.prisma.legalHold.findMany({
        where: { isActive: true },
      });

      const heldFileIds = new Set<string>();
      for (const hold of legalHolds) {
        hold.fileIds.forEach(id => heldFileIds.add(id));
      }

      const filteredExpiredFiles = expiredFileIds.filter(
        id => !heldFileIds.has(id)
      );

      this.logger.info('Identified expired files', {
        total: expiredFileIds.length,
        afterLegalHoldFilter: filteredExpiredFiles.length,
      });

      return filteredExpiredFiles;
    } catch (error) {
      this.logger.error('Failed to identify expired files', { error });
      return [];
    }
  }

  async cleanupExpiredFiles(): Promise<{ deleted: number; errors: string[] }> {
    try {
      const expiredFileIds = await this.identifyExpiredFiles();
      let deleted = 0;
      const errors: string[] = [];

      for (const fileId of expiredFileIds) {
        try {
          const file = await this.prisma.fileMetadata.findUnique({
            where: { id: fileId },
          });

          if (!file) {
            continue;
          }

          // Delete from storage
          await this.storageManager.delete(file.path);

          // Mark as deleted in database
          await this.prisma.fileMetadata.update({
            where: { id: fileId },
            data: { status: 'DELETED' },
          });

          deleted++;

          await this.auditLog('FILE_EXPIRED', {
            fileId,
            entityType: file.entityType,
            entityId: file.entityId,
            reason: 'retention_policy_expiration',
          });
        } catch (fileError) {
          const errorMsg =
            fileError instanceof Error ? fileError.message : 'Unknown error';
          errors.push(`File ${fileId}: ${errorMsg}`);
          this.logger.error('Failed to cleanup expired file', {
            error: fileError,
            fileId,
          });
        }
      }

      this.logger.info('Cleanup expired files completed', {
        deleted,
        errors: errors.length,
      });
      return { deleted, errors };
    } catch (error) {
      this.logger.error('Failed to cleanup expired files', { error });
      return { deleted: 0, errors: ['Failed to cleanup expired files'] };
    }
  }

  async anonymizeUserData(
    userId: string
  ): Promise<{ anonymized: number; errors: string[] }> {
    try {
      const files = await this.prisma.fileMetadata.findMany({
        where: {
          entityType: 'USER_PROFILE',
          entityId: userId,
          status: { not: 'DELETED' },
        },
      });

      let anonymized = 0;
      const errors: string[] = [];

      for (const file of files) {
        try {
          // Anonymize metadata
          await this.prisma.fileMetadata.update({
            where: { id: file.id },
            data: {
              originalName: 'anonymized_file',
              uploadedBy: 'anonymized_user',
              metadata: {},
              tags: [],
            },
          });

          anonymized++;

          await this.auditLog('FILE_ANONYMIZED', {
            fileId: file.id,
            entityType: file.entityType,
            entityId: file.entityId,
            reason: 'user_data_anonymization',
          });
        } catch (fileError) {
          const errorMsg =
            fileError instanceof Error ? fileError.message : 'Unknown error';
          errors.push(`File ${file.id}: ${errorMsg}`);
          this.logger.error('Failed to anonymize file', {
            error: fileError,
            fileId: file.id,
          });
        }
      }

      this.logger.info('User data anonymization completed', {
        userId,
        anonymized,
        errors: errors.length,
      });
      return { anonymized, errors };
    } catch (error) {
      this.logger.error('Failed to anonymize user data', { error, userId });
      return { anonymized: 0, errors: ['Failed to anonymize user data'] };
    }
  }

  // Compliance reporting
  async generateRetentionReport(
    startDate: Date,
    endDate: Date
  ): Promise<RetentionReport> {
    try {
      const [
        totalFiles,
        expiredFiles,
        deletedFiles,
        heldFiles,
        anonymizedFiles,
        activeLegalHolds,
        releasedLegalHolds,
        pendingRequests,
        processedRequests,
        failedRequests,
      ] = await Promise.all([
        this.prisma.fileMetadata.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        this.identifyExpiredFiles().then(files => files.length),
        this.prisma.fileMetadata.count({
          where: {
            status: 'DELETED',
            updatedAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.legalHold.count({
          where: { isActive: true },
        }),
        this.prisma.retentionAuditLog.count({
          where: {
            action: 'FILE_ANONYMIZED',
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.legalHold.count({
          where: {
            isActive: true,
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.legalHold.count({
          where: {
            isActive: false,
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.dataDeletionRequest.count({
          where: {
            status: 'PENDING',
            createdAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.dataDeletionRequest.count({
          where: {
            status: 'COMPLETED',
            processedAt: { gte: startDate, lte: endDate },
          },
        }),
        this.prisma.dataDeletionRequest.count({
          where: {
            status: 'FAILED',
            processedAt: { gte: startDate, lte: endDate },
          },
        }),
      ]);

      // Get by entity type
      const byEntityType: Record<EntityType, any> = {} as any;
      for (const entityType of Object.values(EntityType)) {
        const [total, deleted] = await Promise.all([
          this.prisma.fileMetadata.count({
            where: {
              entityType: entityType as any,
              createdAt: { gte: startDate, lte: endDate },
            },
          }),
          this.prisma.fileMetadata.count({
            where: {
              entityType: entityType as any,
              status: 'DELETED',
              createdAt: { gte: startDate, lte: endDate },
            },
          }),
        ]);

        byEntityType[entityType] = {
          totalFiles: total,
          expiredFiles: 0, // Would need more complex query
          deletedFiles: deleted,
        };
      }

      return {
        period: { startDate, endDate },
        summary: {
          totalFiles,
          expiredFiles,
          deletedFiles,
          heldFiles,
          anonymizedFiles,
        },
        byEntityType,
        legalHolds: {
          active: activeLegalHolds,
          released: releasedLegalHolds,
        },
        deletionRequests: {
          pending: pendingRequests,
          processed: processedRequests,
          failed: failedRequests,
        },
      };
    } catch (error) {
      this.logger.error('Failed to generate retention report', {
        error,
        startDate,
        endDate,
      });
      throw new Error('Failed to generate retention report');
    }
  }

  async auditFileRetention(fileId: string): Promise<FileRetentionAudit> {
    try {
      const file = await this.prisma.fileMetadata.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error('File not found');
      }

      const [retentionPolicy, legalHolds, deletionRequests] = await Promise.all(
        [
          this.prisma.retentionPolicy.findFirst({
            where: {
              entityType: file.entityType,
              isActive: true,
            },
          }),
          this.prisma.legalHold.findMany({
            where: {
              isActive: true,
              OR: [
                { fileIds: { has: fileId } },
                {
                  entityType: file.entityType,
                  entityIds: { has: file.entityId },
                },
              ],
            },
          }),
          this.prisma.dataDeletionRequest.findMany({
            where: {
              entityType: file.entityType,
              entityId: file.entityId,
            },
          }),
        ]
      );

      let expirationDate: Date | undefined;
      let complianceStatus:
        | 'compliant'
        | 'expired'
        | 'held'
        | 'pending_deletion' = 'compliant';
      const recommendations: string[] = [];

      if (retentionPolicy) {
        expirationDate = new Date(file.createdAt);
        expirationDate.setDate(
          expirationDate.getDate() + retentionPolicy.retentionPeriodDays
        );

        if (new Date() > expirationDate) {
          complianceStatus = 'expired';
          recommendations.push(
            'File has exceeded retention period and should be deleted'
          );
        }
      }

      if (legalHolds.length > 0) {
        complianceStatus = 'held';
        recommendations.push(
          `File is under legal hold: ${legalHolds.map(h => h.name).join(', ')}`
        );
      }

      if (deletionRequests.some(r => r.status === 'PENDING')) {
        complianceStatus = 'pending_deletion';
        recommendations.push('File has pending deletion request');
      }

      return {
        fileId,
        currentStatus: file.status,
        retentionPolicy: retentionPolicy
          ? ({
              ...retentionPolicy,
              entityType: retentionPolicy.entityType as any,
            } as RetentionPolicy)
          : undefined,
        expirationDate,
        legalHolds: legalHolds.map(hold => ({
          ...hold,
          entityType: hold.entityType as any,
        })) as LegalHold[],
        deletionRequests: deletionRequests.map(request => ({
          ...request,
          entityType: request.entityType as any,
          requestType: request.requestType as any,
          status: request.status as any,
        })) as DataDeletionRequest[],
        complianceStatus,
        recommendations,
      };
    } catch (error) {
      this.logger.error('Failed to audit file retention', { error, fileId });
      throw new Error('Failed to audit file retention');
    }
  }

  private async auditLog(
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.retentionAuditLog.create({
        data: {
          action: action as any,
          details,
          performedBy: 'system',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', {
        error,
        action,
        details,
      });
    }
  }
}
