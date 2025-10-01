import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { createApp } from '../../app';

describe('Error Handling and Recovery E2E Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let authToken: string;
  let testImageBuffer: Buffer;
  let maliciousFileBuffer: Buffer;

  beforeAll(async () => {
    app = createApp();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.TEST_DATABASE_URL ||
            'postgresql://test:test@localhost:5432/upload_test',
        },
      },
    });

    authToken = 'error-test-token';
    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );

    // Create a malicious file buffer (simulated)
    maliciousFileBuffer = Buffer.from(
      'MALICIOUS_CONTENT_SIGNATURE_TEST',
      'utf-8'
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.fileMetadata.deleteMany({
      where: {
        uploadedBy: 'error-test',
      },
    });

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('File Validation Error Handling', () => {
    it('should handle invalid file types gracefully', async () => {
      const invalidFileBuffer = Buffer.from(
        '#!/bin/bash\necho "malicious script"',
        'utf-8'
      );

      const response = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'invalid-file-user')
        .field('uploadedBy', 'error-test')
        .attach('file', invalidFileBuffer, 'malicious.sh')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: expect.stringContaining('file type'),
        },
      });

      // Verify no file record was created
      const fileCount = await prisma.fileMetadata.count({
        where: { uploadedBy: 'error-test' },
      });
      expect(fileCount).toBe(0);
    });

    it('should handle oversized files gracefully', async () => {
      // Create a very large buffer (simulate 100MB file)
      const oversizedBuffer = Buffer.alloc(100 * 1024 * 1024, 'x');

      const response = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'oversized_test')
        .field('entityId', 'oversized-file-test')
        .field('uploadedBy', 'error-test')
        .attach('file', oversizedBuffer, 'oversized.txt')
        .expect(413);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: expect.stringContaining('size limit'),
        },
      });
    });

    it('should handle malware detection gracefully', async () => {
      // Mock the security scanner to detect malware
      vi.doMock('../../services/security-scanner.service', () => ({
        SecurityScannerService: {
          scanFile: vi.fn().mockResolvedValue({
            safe: false,
            threats: ['EICAR-Test-File'],
            scanId: 'test-scan-123',
          }),
        },
      }));

      const response = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'malware_test')
        .field('entityId', 'malware-test')
        .field('uploadedBy', 'error-test')
        .attach('file', maliciousFileBuffer, 'malware.txt')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'MALWARE_DETECTED',
          message: expect.stringContaining('security scan'),
        },
      });

      // Verify security event was logged
      const securityEvents = await prisma.securityEvent.findMany({
        where: {
          eventType: 'MALWARE_DETECTED',
          metadata: {
            path: ['uploadedBy'],
            equals: 'error-test',
          },
        },
      });
      expect(securityEvents.length).toBeGreaterThan(0);
    });
  });

  describe('Processing Error Recovery', () => {
    it('should handle image processing failures gracefully', async () => {
      // Mock image processor to fail
      vi.doMock('../../services/image-processor.service', () => ({
        ImageProcessorService: {
          processImage: vi
            .fn()
            .mockRejectedValue(new Error('Image processing failed')),
          generateThumbnails: vi
            .fn()
            .mockRejectedValue(new Error('Thumbnail generation failed')),
        },
      }));

      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'processing-error-test')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'processing-error.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for processing attempt
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check file status - should be marked as failed but original file preserved
      const statusResponse = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statusResponse.body.data).toMatchObject({
        status: 'failed',
        processingResults: {
          error: expect.stringContaining('processing failed'),
        },
      });

      // Original file should still be downloadable
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should support processing retry after failure', async () => {
      // First, simulate processing failure
      vi.doMock('../../services/image-processor.service', () => ({
        ImageProcessorService: {
          processImage: vi
            .fn()
            .mockRejectedValueOnce(new Error('Temporary failure'))
            .mockResolvedValue({
              processedUrl: 'http://example.com/processed.webp',
              thumbnails: [
                { size: 'small', url: 'http://example.com/thumb-small.webp' },
              ],
            }),
        },
      }));

      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'retry-test-user')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'retry-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for initial processing failure
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Retry processing
      const retryResponse = await request(app)
        .post(`/api/v1/files/${fileId}/retry-processing`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(retryResponse.body.success).toBe(true);

      // Wait for retry processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check that processing succeeded on retry
      const finalStatus = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalStatus.body.data.status).toBe('ready');
    });
  });

  describe('Storage Error Recovery', () => {
    it('should handle storage backend failures gracefully', async () => {
      // Mock storage service to fail
      vi.doMock('../../services/storage-manager.service', () => ({
        StorageManagerService: {
          store: vi
            .fn()
            .mockRejectedValue(new Error('Storage backend unavailable')),
          generatePresignedUrl: vi
            .fn()
            .mockRejectedValue(new Error('Storage backend unavailable')),
        },
      }));

      const response = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'storage-error-user')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'storage-error.jpg')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'STORAGE_ERROR',
          message: expect.stringContaining('storage'),
        },
      });
    });

    it('should handle storage corruption and recovery', async () => {
      // Upload file successfully first
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'corruption_test')
        .field('entityId', 'corruption-test')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'corruption-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate storage corruption by mocking retrieval failure
      vi.doMock('../../services/storage-manager.service', () => ({
        StorageManagerService: {
          retrieve: vi
            .fn()
            .mockRejectedValue(new Error('File corrupted or not found')),
          exists: vi.fn().mockResolvedValue(false),
        },
      }));

      // Attempt to download corrupted file
      const downloadResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(downloadResponse.body).toMatchObject({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: expect.stringContaining('not found'),
        },
      });

      // File metadata should be marked as corrupted
      const fileStatus = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(fileStatus.body.data.status).toBe('corrupted');
    });
  });

  describe('Database Error Recovery', () => {
    it('should handle database connection failures gracefully', async () => {
      // Simulate database connection failure
      await prisma.$disconnect();

      const response = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'db-error-user')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'db-error.jpg')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: expect.stringContaining('database'),
        },
      });

      // Reconnect for other tests
      await prisma.$connect();
    });

    it('should handle transaction rollback on partial failures', async () => {
      // Mock a scenario where file upload succeeds but metadata save fails
      const originalCreate = prisma.fileMetadata.create;
      vi.spyOn(prisma.fileMetadata, 'create').mockRejectedValueOnce(
        new Error('Database constraint violation')
      );

      const response = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'transaction_test')
        .field('entityId', 'transaction-rollback-test')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'transaction-test.jpg')
        .expect(500);

      expect(response.body.success).toBe(false);

      // Verify no orphaned files exist
      const fileCount = await prisma.fileMetadata.count({
        where: { uploadedBy: 'error-test' },
      });
      expect(fileCount).toBe(0);

      // Restore original method
      vi.mocked(prisma.fileMetadata.create).mockRestore();
    });
  });

  describe('Network Error Recovery', () => {
    it('should handle network timeouts gracefully', async () => {
      // Simulate network timeout by creating a very slow response
      vi.doMock('../../services/cdn.service', () => ({
        CDNService: {
          uploadToCDN: vi
            .fn()
            .mockImplementation(
              () =>
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Network timeout')), 30000)
                )
            ),
        },
      }));

      const response = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'timeout-test-user')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'timeout-test.jpg')
        .timeout(5000) // 5 second timeout
        .expect(408);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: expect.stringContaining('timeout'),
        },
      });
    });
  });

  describe('Concurrent Error Scenarios', () => {
    it('should handle concurrent upload failures without affecting other uploads', async () => {
      // Create a mix of successful and failing uploads
      const uploadPromises = [
        // Successful uploads
        request(app)
          .post('/api/v1/upload/profile-photo')
          .set('Authorization', `Bearer ${authToken}`)
          .field('userId', 'concurrent-success-1')
          .field('uploadedBy', 'error-test')
          .attach('file', testImageBuffer, 'success-1.jpg'),

        // Failing upload (invalid file type)
        request(app)
          .post('/api/v1/upload/profile-photo')
          .set('Authorization', `Bearer ${authToken}`)
          .field('userId', 'concurrent-fail-1')
          .field('uploadedBy', 'error-test')
          .attach('file', Buffer.from('invalid'), 'fail-1.exe'),

        // Another successful upload
        request(app)
          .post('/api/v1/upload/profile-photo')
          .set('Authorization', `Bearer ${authToken}`)
          .field('userId', 'concurrent-success-2')
          .field('uploadedBy', 'error-test')
          .attach('file', testImageBuffer, 'success-2.jpg'),
      ];

      const results = await Promise.allSettled(uploadPromises);

      // Verify that successful uploads succeeded despite concurrent failures
      expect(results[0].status).toBe('fulfilled');
      expect((results[0] as any).value.status).toBe(201);

      expect(results[1].status).toBe('fulfilled');
      expect((results[1] as any).value.status).toBe(400);

      expect(results[2].status).toBe('fulfilled');
      expect((results[2] as any).value.status).toBe(201);

      // Verify only successful uploads created database records
      const successfulUploads = await prisma.fileMetadata.count({
        where: {
          uploadedBy: 'error-test',
          status: { not: 'failed' },
        },
      });
      expect(successfulUploads).toBe(2);
    });
  });

  describe('System Recovery and Health Checks', () => {
    it('should provide accurate health status during errors', async () => {
      // Check health when system is healthy
      const healthyResponse = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(healthyResponse.body).toMatchObject({
        status: 'healthy',
        services: expect.objectContaining({
          database: 'healthy',
          storage: 'healthy',
        }),
      });

      // Simulate database issue
      await prisma.$disconnect();

      const unhealthyResponse = await request(app)
        .get('/api/v1/health')
        .expect(503);

      expect(unhealthyResponse.body).toMatchObject({
        status: 'unhealthy',
        services: expect.objectContaining({
          database: 'unhealthy',
        }),
      });

      // Restore connection
      await prisma.$connect();

      // Verify recovery
      const recoveredResponse = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(recoveredResponse.body.status).toBe('healthy');
    });

    it('should handle graceful shutdown during active uploads', async () => {
      // Start an upload
      const uploadPromise = request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'shutdown_test')
        .field('entityId', 'shutdown-test')
        .field('uploadedBy', 'error-test')
        .attach('file', testImageBuffer, 'shutdown-test.jpg');

      // Simulate shutdown signal after a short delay
      setTimeout(() => {
        process.emit('SIGTERM');
      }, 1000);

      // Upload should complete or fail gracefully
      const result = await uploadPromise;
      expect([200, 201, 503]).toContain(result.status);

      // If upload was interrupted, no orphaned data should remain
      if (result.status === 503) {
        const orphanedFiles = await prisma.fileMetadata.count({
          where: {
            uploadedBy: 'error-test',
            status: 'uploading',
          },
        });
        expect(orphanedFiles).toBe(0);
      }
    });
  });
});
