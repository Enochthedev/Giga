import { Router } from 'express';
import { RetentionController } from '../controllers/retention.controller';
import { PrismaClient } from '../generated/prisma-client';
import { Logger } from '../lib/logger';
import { authMiddleware } from '../middleware/auth.middleware';
import { MetadataService } from '../services/metadata.service';
import { StorageManagerService } from '../services/storage-manager.service';

export function createRetentionRoutes(
  prisma: PrismaClient,
  logger: Logger,
  storageManager: StorageManagerService,
  metadataService: MetadataService
): Router {
  const router = Router();
  const retentionController = new RetentionController(
    prisma,
    logger,
    storageManager,
    metadataService
  );

  // Apply authentication middleware to all retention routes
  router.use(authMiddleware);

  // Retention Policy Management
  router.post('/policies', (req, res) =>
    retentionController.createRetentionPolicy(req, res)
  );
  router.get('/policies', (req, res) =>
    retentionController.listRetentionPolicies(req, res)
  );
  router.put('/policies/:id', (req, res) =>
    retentionController.updateRetentionPolicy(req, res)
  );
  router.delete('/policies/:id', (req, res) =>
    retentionController.deleteRetentionPolicy(req, res)
  );

  // Legal Hold Management
  router.post('/legal-holds', (req, res) =>
    retentionController.createLegalHold(req, res)
  );
  router.get('/legal-holds', (req, res) =>
    retentionController.listLegalHolds(req, res)
  );
  router.post('/legal-holds/:id/release', (req, res) =>
    retentionController.releaseLegalHold(req, res)
  );

  // Data Deletion Requests
  router.post('/deletion-requests', (req, res) =>
    retentionController.requestDataDeletion(req, res)
  );
  router.get('/deletion-requests', (req, res) =>
    retentionController.listDataDeletionRequests(req, res)
  );
  router.post('/deletion-requests/:id/process', (req, res) =>
    retentionController.processDataDeletionRequest(req, res)
  );

  // Cleanup Operations
  router.get('/expired-files', (req, res) =>
    retentionController.identifyExpiredFiles(req, res)
  );
  router.post('/cleanup/expired-files', (req, res) =>
    retentionController.cleanupExpiredFiles(req, res)
  );
  router.post('/cleanup/anonymize/:userId', (req, res) =>
    retentionController.anonymizeUserData(req, res)
  );

  // Compliance Reporting
  router.get('/reports/retention', (req, res) =>
    retentionController.generateRetentionReport(req, res)
  );
  router.get('/audit/files/:fileId', (req, res) =>
    retentionController.auditFileRetention(req, res)
  );

  // GDPR Compliance
  router.post('/gdpr/access', (req, res) =>
    retentionController.processGDPRAccessRequest(req, res)
  );
  router.post('/gdpr/erasure', (req, res) =>
    retentionController.processGDPRErasureRequest(req, res)
  );
  router.post('/gdpr/portability', (req, res) =>
    retentionController.processGDPRPortabilityRequest(req, res)
  );
  router.get('/gdpr/privacy-report/:userId', (req, res) =>
    retentionController.generatePrivacyReport(req, res)
  );

  return router;
}
