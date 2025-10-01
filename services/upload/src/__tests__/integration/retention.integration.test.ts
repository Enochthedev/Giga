import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { PrismaClient } from '../../generated/prisma-client';
import { EntityType } from '../../types/upload.types';

describe('Retention Integration Tests', () => {
  let app: any;
  let prisma: PrismaClient;

  beforeEach(async () => {
    app = createApp();
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('Retention Policy Management', () => {
    it('should create a retention policy', async () => {
      const policyData = {
        name: 'User Profile Policy',
        entityType: EntityType.USER_PROFILE,
        retentionPeriodDays: 365,
        jurisdiction: 'EU',
        description: 'GDPR compliant user profile retention',
        legalBasis: 'GDPR Article 6(1)(b)',
      };

      const response = await request(app)
        .post('/api/v1/retention/policies')
        .send(policyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(policyData.name);
      expect(response.body.data.entityType).toBe(policyData.entityType);
      expect(response.body.data.retentionPeriodDays).toBe(
        policyData.retentionPeriodDays
      );
    });

    it('should list retention policies', async () => {
      const response = await request(app)
        .get('/api/v1/retention/policies')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter retention policies by entity type', async () => {
      const response = await request(app)
        .get('/api/v1/retention/policies')
        .query({ entityType: EntityType.USER_PROFILE })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Legal Hold Management', () => {
    it('should create a legal hold', async () => {
      const holdData = {
        name: 'Investigation Hold',
        description: 'Legal investigation in progress',
        entityType: EntityType.USER_PROFILE,
        entityIds: ['user-123'],
        fileIds: ['file-456'],
      };

      const response = await request(app)
        .post('/api/v1/retention/legal-holds')
        .send(holdData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(holdData.name);
      expect(response.body.data.description).toBe(holdData.description);
    });

    it('should list active legal holds', async () => {
      const response = await request(app)
        .get('/api/v1/retention/legal-holds')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Data Deletion Requests', () => {
    it('should create a data deletion request', async () => {
      const requestData = {
        requestType: 'user_request',
        entityType: EntityType.USER_PROFILE,
        entityId: 'user-123',
        scheduledAt: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/api/v1/retention/deletion-requests')
        .send(requestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requestType).toBe(requestData.requestType);
      expect(response.body.data.entityType).toBe(requestData.entityType);
      expect(response.body.data.entityId).toBe(requestData.entityId);
    });

    it('should list data deletion requests', async () => {
      const response = await request(app)
        .get('/api/v1/retention/deletion-requests')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter deletion requests by status', async () => {
      const response = await request(app)
        .get('/api/v1/retention/deletion-requests')
        .query({ status: 'pending' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Cleanup Operations', () => {
    it('should identify expired files', async () => {
      const response = await request(app)
        .get('/api/v1/retention/expired-files')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.expiredFiles).toBeDefined();
      expect(Array.isArray(response.body.data.fileIds)).toBe(true);
    });

    it('should cleanup expired files', async () => {
      const response = await request(app)
        .post('/api/v1/retention/cleanup/expired-files')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted).toBeDefined();
      expect(Array.isArray(response.body.data.errors)).toBe(true);
    });
  });

  describe('Compliance Reporting', () => {
    it('should generate retention report', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      const response = await request(app)
        .get('/api/v1/retention/reports/retention')
        .query({ startDate, endDate })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.period).toBeDefined();
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.byEntityType).toBeDefined();
      expect(response.body.data.legalHolds).toBeDefined();
      expect(response.body.data.deletionRequests).toBeDefined();
    });

    it('should require date parameters for retention report', async () => {
      const response = await request(app)
        .get('/api/v1/retention/reports/retention')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        'Missing required query parameters'
      );
    });
  });

  describe('GDPR Compliance', () => {
    it('should process GDPR access request', async () => {
      const requestData = {
        userId: 'user-123',
        userEmail: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/v1/retention/gdpr/access')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requestType).toBe('access');
      expect(response.body.data.userId).toBe(requestData.userId);
    });

    it('should process GDPR erasure request', async () => {
      const requestData = {
        userId: 'user-123',
        userEmail: 'user@example.com',
        reason: 'User requested account deletion',
      };

      const response = await request(app)
        .post('/api/v1/retention/gdpr/erasure')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requestType).toBe('erasure');
      expect(response.body.data.userId).toBe(requestData.userId);
    });

    it('should process GDPR portability request', async () => {
      const requestData = {
        userId: 'user-123',
        userEmail: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/v1/retention/gdpr/portability')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(requestData.userId);
      expect(response.body.data.files).toBeDefined();
      expect(response.body.data.totalFiles).toBeDefined();
      expect(response.body.data.totalSize).toBeDefined();
    });

    it('should generate privacy report', async () => {
      const userId = 'user-123';

      const response = await request(app)
        .get(`/api/v1/retention/gdpr/privacy-report/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.data.dataProcessing).toBeDefined();
      expect(response.body.data.accessActivity).toBeDefined();
      expect(response.body.data.compliance).toBeDefined();
    });

    it('should require userId and userEmail for GDPR requests', async () => {
      const response = await request(app)
        .post('/api/v1/retention/gdpr/access')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields for policy creation', async () => {
      const response = await request(app)
        .post('/api/v1/retention/policies')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should handle missing required fields for legal hold creation', async () => {
      const response = await request(app)
        .post('/api/v1/retention/legal-holds')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should handle missing required fields for deletion request', async () => {
      const response = await request(app)
        .post('/api/v1/retention/deletion-requests')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });
  });
});
