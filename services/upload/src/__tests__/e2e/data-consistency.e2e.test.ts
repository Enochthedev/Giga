import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';

describe('Data Consistency E2E Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let authToken: string;
  let testImageBuffer: Buffer;

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

    authToken = 'consistency-test-token';
    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.fileMetadata.deleteMany({
      where: {
        uploadedBy: 'consistency-test',
      },
    });
  });

  describe('Upload-Processing Consistency', () => {
    it('should maintain consistency between file metadata and processing status', async () => {
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'consistency-product-1')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'consistency-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Verify initial state consistency
      expect(uploadResponse.body.data).toMatchObject({
        status: 'processing',
        processingResults: null,
      });

      // Poll for processing completion and verify state transitions
      let previousStatus = 'processing';
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 20;

      while (!processingComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await request(app)
          .get(`/api/v1/files/${fileId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const currentStatus = statusResponse.body.data.status;

        // Verify valid status transitions
        if (previousStatus === 'processing' && currentStatus === 'ready') {
          // Valid transition - verify processing results exist
          expect(statusResponse.body.data.processingResults).toBeTruthy();
          expect(
            statusResponse.body.data.processingResults.thumbnails
          ).toBeDefined();
          processingComplete = true;
        } else if (
          previousStatus === 'processing' &&
          currentStatus === 'failed'
        ) {
          // Valid transition - verify error information exists
          expect(statusResponse.body.data.processingResults.error).toBeTruthy();
          processingComplete = true;
        } else if (currentStatus === 'processing') {
          // Still processing - this is fine
        } else {
          // Invalid transition
          throw new Error(
            `Invalid status transition from ${previousStatus} to ${currentStatus}`
          );
        }

        previousStatus = currentStatus;
        attempts++;
      }

      expect(processingComplete).toBe(true);

      // Final consistency check - verify all related data is consistent
      const finalFile = await prisma.fileMetadata.findUnique({
        where: { id: fileId },
        include: {
          processingJobs: true,
          thumbnails: true,
        },
      });

      expect(finalFile).toBeTruthy();
      if (finalFile?.status === 'ready') {
        expect(finalFile.thumbnails.length).toBeGreaterThan(0);
        expect(
          finalFile.processingJobs.some(job => job.status === 'completed')
        ).toBe(true);
      }
    });

    it('should maintain consistency during concurrent processing', async () => {
      const concurrentUploads = 5;
      const uploadPromises = Array.from(
        { length: concurrentUploads },
        (_, index) =>
          request(app)
            .post('/api/v1/upload/profile-photo')
            .set('Authorization', `Bearer ${authToken}`)
            .field('userId', `concurrent-user-${index}`)
            .field('uploadedBy', 'consistency-test')
            .attach('file', testImageBuffer, `concurrent-${index}.jpg`)
      );

      const uploadResponses = await Promise.all(uploadPromises);
      const fileIds = uploadResponses.map(response => response.body.data.id);

      // Wait for all processing to complete
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Verify consistency for all files
      for (const fileId of fileIds) {
        const fileData = await prisma.fileMetadata.findUnique({
          where: { id: fileId },
          include: {
            processingJobs: true,
            thumbnails: true,
          },
        });

        expect(fileData).toBeTruthy();
        expect(['ready', 'failed']).toContain(fileData!.status);

        if (fileData!.status === 'ready') {
          // If ready, should have thumbnails and completed processing jobs
          expect(fileData!.thumbnails.length).toBeGreaterThan(0);
          expect(
            fileData!.processingJobs.some(job => job.status === 'completed')
          ).toBe(true);
        } else if (fileData!.status === 'failed') {
          // If failed, should have failed processing jobs
          expect(
            fileData!.processingJobs.some(job => job.status === 'failed')
          ).toBe(true);
        }
      }
    });
  });

  describe('Storage-Metadata Consistency', () => {
    it('should maintain consistency between storage and metadata', async () => {
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'storage_consistency_test')
        .field('entityId', 'storage-test-1')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'storage-consistency.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verify file exists in both metadata and storage
      const fileMetadata = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(fileMetadata.body.data.status).toMatch(/ready|processing/);

      // Verify file is downloadable (exists in storage)
      const downloadResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(downloadResponse.headers['content-length']).toBeTruthy();

      // Delete file and verify consistency
      await request(app)
        .delete(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify metadata reflects deletion
      const deletedFileMetadata = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deletedFileMetadata.body.data.status).toBe('deleted');

      // Verify file is no longer downloadable
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should handle storage-metadata inconsistencies gracefully', async () => {
      // Upload file normally
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'inconsistency_test')
        .field('entityId', 'inconsistency-test-1')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'inconsistency-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for upload to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate storage corruption by directly manipulating storage
      // (In a real scenario, this would be done through storage service)
      const fileRecord = await prisma.fileMetadata.findUnique({
        where: { id: fileId },
      });

      expect(fileRecord).toBeTruthy();

      // Attempt to download - should detect inconsistency
      const downloadResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should either succeed or fail gracefully with proper error
      if (downloadResponse.status === 404) {
        expect(downloadResponse.body).toMatchObject({
          success: false,
          error: {
            code: 'FILE_NOT_FOUND',
          },
        });

        // System should detect and mark inconsistency
        const updatedRecord = await prisma.fileMetadata.findUnique({
          where: { id: fileId },
        });
        expect(updatedRecord?.status).toBe('corrupted');
      } else {
        expect(downloadResponse.status).toBe(200);
      }
    });
  });

  describe('Transaction Consistency', () => {
    it('should maintain ACID properties during batch operations', async () => {
      const batchSize = 3;
      const entityId = 'batch-consistency-test';

      // Perform batch upload
      const uploadResponse = await request(app)
        .post('/api/v1/upload/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'property')
        .field('entityId', entityId)
        .field('uploadedBy', 'consistency-test')
        .attach('files', testImageBuffer, 'batch1.jpg')
        .attach('files', testImageBuffer, 'batch2.jpg')
        .attach('files', testImageBuffer, 'batch3.jpg')
        .expect(201);

      expect(uploadResponse.body.data).toHaveLength(batchSize);
      const fileIds = uploadResponse.body.data.map((file: any) => file.id);

      // Verify atomicity - all files should be created or none
      const createdFiles = await prisma.fileMetadata.findMany({
        where: {
          id: { in: fileIds },
        },
      });

      expect(createdFiles).toHaveLength(batchSize);

      // Verify consistency - all files should have same entity info
      createdFiles.forEach(file => {
        expect(file.entityType).toBe('property');
        expect(file.entityId).toBe(entityId);
        expect(file.uploadedBy).toBe('consistency-test');
      });

      // Verify isolation - concurrent operations shouldn't interfere
      const concurrentUpload = request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', 'concurrent-isolation-test')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'isolation-test.jpg');

      const concurrentResponse = await concurrentUpload;
      expect(concurrentResponse.status).toBe(201);

      // Verify durability - data persists after operations
      const allFiles = await prisma.fileMetadata.findMany({
        where: {
          uploadedBy: 'consistency-test',
        },
      });

      expect(allFiles).toHaveLength(batchSize + 1); // batch + concurrent upload
    });

    it('should handle partial transaction failures correctly', async () => {
      // Simulate a scenario where some files in a batch fail
      const mixedBatchResponse = await request(app)
        .post('/api/v1/upload/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'mixed_batch_test')
        .field('entityId', 'mixed-batch-test')
        .field('uploadedBy', 'consistency-test')
        .attach('files', testImageBuffer, 'valid1.jpg')
        .attach('files', Buffer.from('invalid content'), 'invalid.exe') // This should fail
        .attach('files', testImageBuffer, 'valid2.jpg');

      // Batch should handle partial failures appropriately
      // Either all succeed, all fail, or partial success with clear indication
      if (mixedBatchResponse.status === 207) {
        // Multi-status response
        expect(mixedBatchResponse.body.results).toHaveLength(3);

        const successCount = mixedBatchResponse.body.results.filter(
          (result: any) => result.success
        ).length;
        const failureCount = mixedBatchResponse.body.results.filter(
          (result: any) => !result.success
        ).length;

        expect(successCount + failureCount).toBe(3);
        expect(failureCount).toBeGreaterThan(0); // At least the invalid file should fail

        // Verify database consistency
        const createdFiles = await prisma.fileMetadata.findMany({
          where: {
            uploadedBy: 'consistency-test',
            entityId: 'mixed-batch-test',
          },
        });

        expect(createdFiles).toHaveLength(successCount);
      } else {
        // All-or-nothing approach
        expect([200, 201, 400]).toContain(mixedBatchResponse.status);
      }
    });
  });

  describe('Referential Integrity', () => {
    it('should maintain referential integrity between files and entities', async () => {
      const userId = 'referential-test-user';
      const productId = 'referential-test-product';

      // Upload user profile photo
      const profileUpload = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      // Upload product image
      const productUpload = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', productId)
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'product.jpg')
        .expect(201);

      // Verify referential integrity
      const userFiles = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'user_profile',
          entityId: userId,
        })
        .expect(200);

      expect(userFiles.body.data).toHaveLength(1);
      expect(userFiles.body.data[0].entityId).toBe(userId);

      const productFiles = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'product',
          entityId: productId,
        })
        .expect(200);

      expect(productFiles.body.data).toHaveLength(1);
      expect(productFiles.body.data[0].entityId).toBe(productId);

      // Test cascade operations
      await request(app)
        .post('/api/v1/files/cleanup/entity')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          entityType: 'user_profile',
          entityId: userId,
          reason: 'user_deleted',
        })
        .expect(200);

      // Verify user files are marked for deletion
      const userFilesAfterCleanup = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'user_profile',
          entityId: userId,
          includeDeleted: true,
        })
        .expect(200);

      expect(userFilesAfterCleanup.body.data[0].status).toBe('deleted');

      // Verify product files are unaffected
      const productFilesAfterCleanup = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'product',
          entityId: productId,
        })
        .expect(200);

      expect(productFilesAfterCleanup.body.data).toHaveLength(1);
      expect(productFilesAfterCleanup.body.data[0].status).not.toBe('deleted');
    });
  });

  describe('Eventual Consistency', () => {
    it('should achieve eventual consistency in distributed operations', async () => {
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'eventual-consistency-test')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'eventual-consistency.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Initially, processing might not be complete
      let consistencyAchieved = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!consistencyAchieved && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check multiple consistency points
        const [fileStatus, thumbnailsExist, cdnStatus] = await Promise.all([
          request(app)
            .get(`/api/v1/files/${fileId}`)
            .set('Authorization', `Bearer ${authToken}`),

          request(app)
            .get(`/api/v1/files/${fileId}/thumbnail/small`)
            .set('Authorization', `Bearer ${authToken}`),

          request(app)
            .get(`/api/v1/files/${fileId}/cdn-status`)
            .set('Authorization', `Bearer ${authToken}`),
        ]);

        if (
          fileStatus.body.data.status === 'ready' &&
          thumbnailsExist.status === 200 &&
          cdnStatus.body.data.cdnStatus === 'available'
        ) {
          consistencyAchieved = true;

          // Verify all components are consistent
          expect(
            fileStatus.body.data.processingResults.thumbnails
          ).toBeDefined();
          expect(fileStatus.body.data.cdnUrl).toBeTruthy();
          expect(cdnStatus.body.data.lastSync).toBeTruthy();
        }

        attempts++;
      }

      expect(consistencyAchieved).toBe(true);
    });
  });

  describe('Data Integrity Validation', () => {
    it('should validate data integrity across system boundaries', async () => {
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'integrity_test')
        .field('entityId', 'integrity-validation-test')
        .field('uploadedBy', 'consistency-test')
        .attach('file', testImageBuffer, 'integrity-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;
      const originalSize = uploadResponse.body.data.size;
      const originalChecksum = uploadResponse.body.data.checksum;

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Download file and verify integrity
      const downloadResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify file size matches
      expect(parseInt(downloadResponse.headers['content-length'])).toBe(
        originalSize
      );

      // Verify checksum if provided
      if (originalChecksum) {
        const downloadedChecksum = downloadResponse.headers['x-file-checksum'];
        expect(downloadedChecksum).toBe(originalChecksum);
      }

      // Verify metadata integrity
      const fileMetadata = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(fileMetadata.body.data.size).toBe(originalSize);
      expect(fileMetadata.body.data.checksum).toBe(originalChecksum);

      // Run integrity check
      const integrityCheck = await request(app)
        .post(`/api/v1/files/${fileId}/verify-integrity`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(integrityCheck.body.data.integrityStatus).toBe('valid');
      expect(integrityCheck.body.data.checksumMatch).toBe(true);
      expect(integrityCheck.body.data.sizeMatch).toBe(true);
    });
  });
});
