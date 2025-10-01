import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma-client';
import { Logger } from '../lib/logger';
import { GDPRComplianceService } from '../services/gdpr-compliance.service';
import { MetadataService } from '../services/metadata.service';
import { RetentionServiceImpl } from '../services/retention.service';
import { StorageManagerService } from '../services/storage-manager.service';
import { EntityType } from '../types/upload.types';

export class RetentionController {
  private retentionService: RetentionServiceImpl;
  private gdprService: GDPRComplianceService;
  private logger: Logger;

  constructor(
    prisma: PrismaClient,
    logger: Logger,
    storageManager: StorageManagerService,
    metadataService: MetadataService
  ) {
    this.logger = logger;
    this.retentionService = new RetentionServiceImpl(
      prisma,
      logger,
      storageManager,
      metadataService
    );
    this.gdprService = new GDPRComplianceService(
      prisma,
      logger,
      this.retentionService
    );
  }

  // Retention Policy Management
  async createRetentionPolicy(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        entityType,
        retentionPeriodDays,
        jurisdiction,
        description,
        legalBasis,
      } = req.body;

      if (!name || !entityType || !retentionPeriodDays || !jurisdiction) {
        res.status(400).json({
          success: false,
          error:
            'Missing required fields: name, entityType, retentionPeriodDays, jurisdiction',
        });
        return;
      }

      const policy = await this.retentionService.createRetentionPolicy({
        name,
        entityType: entityType as EntityType,
        retentionPeriodDays: parseInt(retentionPeriodDays),
        jurisdiction,
        isActive: true,
        description,
        legalBasis,
      });

      res.status(201).json({
        success: true,
        data: policy,
      });
    } catch (error) {
      this.logger.error('Failed to create retention policy', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to create retention policy',
      });
    }
  }

  async listRetentionPolicies(req: Request, res: Response): Promise<void> {
    try {
      const { entityType } = req.query;
      const policies = await this.retentionService.listRetentionPolicies(
        entityType as EntityType
      );

      res.json({
        success: true,
        data: policies,
      });
    } catch (error) {
      this.logger.error('Failed to list retention policies', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to list retention policies',
      });
    }
  }

  async updateRetentionPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const policy = await this.retentionService.updateRetentionPolicy(
        id,
        updates
      );

      res.json({
        success: true,
        data: policy,
      });
    } catch (error) {
      this.logger.error('Failed to update retention policy', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to update retention policy',
      });
    }
  }

  async deleteRetentionPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.retentionService.deleteRetentionPolicy(id);

      if (success) {
        res.json({
          success: true,
          message: 'Retention policy deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Retention policy not found',
        });
      }
    } catch (error) {
      this.logger.error('Failed to delete retention policy', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to delete retention policy',
      });
    }
  }

  // Legal Hold Management
  async createLegalHold(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, entityType, entityIds, fileIds, expiresAt } =
        req.body;
      const createdBy = req.user?.id || 'system';

      if (!name || !description) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, description',
        });
        return;
      }

      const hold = await this.retentionService.createLegalHold({
        name,
        description,
        entityType: entityType as EntityType,
        entityIds: entityIds || [],
        fileIds: fileIds || [],
        isActive: true,
        createdBy,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });

      res.status(201).json({
        success: true,
        data: hold,
      });
    } catch (error) {
      this.logger.error('Failed to create legal hold', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to create legal hold',
      });
    }
  }

  async listLegalHolds(req: Request, res: Response): Promise<void> {
    try {
      const holds = await this.retentionService.listActiveLegalHolds();

      res.json({
        success: true,
        data: holds,
      });
    } catch (error) {
      this.logger.error('Failed to list legal holds', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to list legal holds',
      });
    }
  }

  async releaseLegalHold(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.retentionService.releaseLegalHold(id);

      if (success) {
        res.json({
          success: true,
          message: 'Legal hold released successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Legal hold not found',
        });
      }
    } catch (error) {
      this.logger.error('Failed to release legal hold', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to release legal hold',
      });
    }
  }

  // Data Deletion Requests
  async requestDataDeletion(req: Request, res: Response): Promise<void> {
    try {
      const { requestType, entityType, entityId, scheduledAt } = req.body;
      const requestedBy = req.user?.email || 'system';

      if (!requestType || !entityType || !entityId) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: requestType, entityType, entityId',
        });
        return;
      }

      const request = await this.retentionService.requestDataDeletion({
        requestType,
        entityType: entityType as EntityType,
        entityId,
        requestedBy,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        metadata: req.body.metadata,
      });

      res.status(201).json({
        success: true,
        data: request,
      });
    } catch (error) {
      this.logger.error('Failed to create data deletion request', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to create data deletion request',
      });
    }
  }

  async listDataDeletionRequests(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const requests = await this.retentionService.listDataDeletionRequests(
        status as string
      );

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      this.logger.error('Failed to list data deletion requests', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to list data deletion requests',
      });
    }
  }

  async processDataDeletionRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request =
        await this.retentionService.processDataDeletionRequest(id);

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      this.logger.error('Failed to process data deletion request', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to process data deletion request',
      });
    }
  }

  // Cleanup Operations
  async identifyExpiredFiles(req: Request, res: Response): Promise<void> {
    try {
      const expiredFileIds = await this.retentionService.identifyExpiredFiles();

      res.json({
        success: true,
        data: {
          expiredFiles: expiredFileIds.length,
          fileIds: expiredFileIds,
        },
      });
    } catch (error) {
      this.logger.error('Failed to identify expired files', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to identify expired files',
      });
    }
  }

  async cleanupExpiredFiles(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.retentionService.cleanupExpiredFiles();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.logger.error('Failed to cleanup expired files', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to cleanup expired files',
      });
    }
  }

  async anonymizeUserData(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await this.retentionService.anonymizeUserData(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.logger.error('Failed to anonymize user data', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to anonymize user data',
      });
    }
  }

  // Compliance Reporting
  async generateRetentionReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Missing required query parameters: startDate, endDate',
        });
        return;
      }

      const report = await this.retentionService.generateRetentionReport(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      this.logger.error('Failed to generate retention report', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to generate retention report',
      });
    }
  }

  async auditFileRetention(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const audit = await this.retentionService.auditFileRetention(fileId);

      res.json({
        success: true,
        data: audit,
      });
    } catch (error) {
      this.logger.error('Failed to audit file retention', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to audit file retention',
      });
    }
  }

  // GDPR Compliance
  async processGDPRAccessRequest(req: Request, res: Response): Promise<void> {
    try {
      const { userId, userEmail } = req.body;

      if (!userId || !userEmail) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, userEmail',
        });
        return;
      }

      const request = await this.gdprService.processAccessRequest(
        userId,
        userEmail
      );

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      this.logger.error('Failed to process GDPR access request', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to process GDPR access request',
      });
    }
  }

  async processGDPRErasureRequest(req: Request, res: Response): Promise<void> {
    try {
      const { userId, userEmail, reason } = req.body;

      if (!userId || !userEmail) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, userEmail',
        });
        return;
      }

      const request = await this.gdprService.processErasureRequest(
        userId,
        userEmail,
        reason
      );

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      this.logger.error('Failed to process GDPR erasure request', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to process GDPR erasure request',
      });
    }
  }

  async processGDPRPortabilityRequest(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId, userEmail } = req.body;

      if (!userId || !userEmail) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, userEmail',
        });
        return;
      }

      const exportData = await this.gdprService.processPortabilityRequest(
        userId,
        userEmail
      );

      res.json({
        success: true,
        data: exportData,
      });
    } catch (error) {
      this.logger.error('Failed to process GDPR portability request', {
        error,
      });
      res.status(500).json({
        success: false,
        error: 'Failed to process GDPR portability request',
      });
    }
  }

  async generatePrivacyReport(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const report = await this.gdprService.generatePrivacyReport(userId);

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      this.logger.error('Failed to generate privacy report', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to generate privacy report',
      });
    }
  }
}
