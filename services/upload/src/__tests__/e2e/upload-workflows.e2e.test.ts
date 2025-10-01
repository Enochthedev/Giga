import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';

describe('Upload Workflows E2E Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let authToken: string;
  let testImageBuffer: Buffer;
  let testDocumentBuffer: Buffer;

  beforeAll(async () => {
    // Initialize app and database
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

    // Load test files
    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );
    testDocumentBuffer = Buffer.from('Test document content', 'utf-8');

    // Get auth token for testing
    authToken = 'test-service-token';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.fileMetadata.deleteMany({
      where: {
        uploadedBy: 'test-service',
      },
    });
  });

  describe('Profile Photo Upload Workflow', () => {
    it('should complete full profile photo upload workflow', async () => {
      const userId = 'test-user-123';

      // Step 1: Upload profile photo
      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'test-service')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      expect(uploadResponse.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          originalName: 'profile.jpg',
          entityType: 'user_profile',
          entityId: userId,
          status: 'processing',
        },
      });

      const fileId = uploadResponse.body.data.id;

      // Step 2: Wait for processing to complete
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!processingComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await request(app)
          .get(`/api/v1/files/${fileId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        if (statusResponse.body.data.status === 'ready') {
          processingComplete = true;

          // Verify processing results
          expect(statusResponse.body.data).toMatchObject({
            status: 'ready',
            processingResults: {
              thumbnails: expect.arrayContaining([
                expect.objectContaining({
                  size: 'small',
                  url: expect.any(String),
                }),
                expect.objectContaining({
                  size: 'medium',
                  url: expect.any(String),
                }),
              ]),
              optimized: {
                format: 'webp',
                url: expect.any(String),
              },
            },
          });
        }
        attempts++;
      }

      expect(processingComplete).toBe(true);

      // Step 3: Verify file accessibility
      const fileResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(fileResponse.headers['content-type']).toMatch(/image/);

      // Step 4: Verify thumbnails are accessible
      const thumbnailResponse = await request(app)
        .get(`/api/v1/files/${fileId}/thumbnail/small`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(thumbnailResponse.headers['content-type']).toMatch(/image/);
    });

    it('should handle profile photo replacement workflow', async () => {
      const userId = 'test-user-456';

      // Upload first profile photo
      const firstUpload = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'test-service')
        .attach('file', testImageBuffer, 'profile1.jpg')
        .expect(201);

      const firstFileId = firstUpload.body.data.id;

      // Upload replacement profile photo
      const secondUpload = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'test-service')
        .field('replaceExisting', 'true')
        .attach('file', testImageBuffer, 'profile2.jpg')
        .expect(201);

      // Verify first photo is marked for deletion
      const firstFileStatus = await request(app)
        .get(`/api/v1/files/${firstFileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(firstFileStatus.body.data.status).toBe('deleted');

      // Verify second photo is active
      const secondFileId = secondUpload.body.data.id;
      const secondFileStatus = await request(app)
        .get(`/api/v1/files/${secondFileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(secondFileStatus.body.data.status).toMatch(/processing|ready/);
    });
  });

  describe('Product Image Upload Workflow', () => {
    it('should complete full product image upload workflow', async () => {
      const productId = 'product-789';

      // Upload product image
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', productId)
        .field('uploadedBy', 'test-service')
        .field('tags', JSON.stringify(['main', 'featured']))
        .attach('file', testImageBuffer, 'product.jpg')
        .expect(201);

      expect(uploadResponse.body.data).toMatchObject({
        entityType: 'product',
        entityId: productId,
        tags: ['main', 'featured'],
      });

      const fileId = uploadResponse.body.data.id;

      // Wait for processing and verify multiple sizes generated
      let processingComplete = false;
      let attempts = 0;

      while (!processingComplete && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await request(app)
          .get(`/api/v1/files/${fileId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        if (statusResponse.body.data.status === 'ready') {
          processingComplete = true;

          // Verify product-specific processing
          expect(statusResponse.body.data.processingResults.thumbnails).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ size: 'thumbnail' }),
              expect.objectContaining({ size: 'small' }),
              expect.objectContaining({ size: 'medium' }),
              expect.objectContaining({ size: 'large' }),
            ])
          );
        }
        attempts++;
      }

      expect(processingComplete).toBe(true);
    });
  });

  describe('Document Upload Workflow', () => {
    it('should complete document upload workflow', async () => {
      const entityId = 'entity-123';

      // Upload document
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'user_document')
        .field('entityId', entityId)
        .field('uploadedBy', 'test-service')
        .field('accessLevel', 'private')
        .attach('file', testDocumentBuffer, 'document.txt')
        .expect(201);

      expect(uploadResponse.body.data).toMatchObject({
        entityType: 'document',
        entityId: entityId,
        accessLevel: 'private',
        mimeType: 'text/plain',
      });

      const fileId = uploadResponse.body.data.id;

      // Verify document is accessible with proper auth
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify document is not accessible without auth
      await request(app).get(`/api/v1/files/${fileId}/download`).expect(401);
    });
  });

  describe('Batch Upload Workflow', () => {
    it('should handle batch upload workflow', async () => {
      const propertyId = 'property-456';

      // Upload multiple property photos
      const uploadResponse = await request(app)
        .post('/api/v1/upload/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'property')
        .field('entityId', propertyId)
        .field('uploadedBy', 'test-service')
        .attach('files', testImageBuffer, 'photo1.jpg')
        .attach('files', testImageBuffer, 'photo2.jpg')
        .attach('files', testImageBuffer, 'photo3.jpg')
        .expect(201);

      expect(uploadResponse.body.data).toHaveLength(3);
      expect(
        uploadResponse.body.data.every(
          (file: any) =>
            file.entityType === 'property' && file.entityId === propertyId
        )
      ).toBe(true);

      // Wait for all files to process
      const fileIds = uploadResponse.body.data.map((file: any) => file.id);

      for (const fileId of fileIds) {
        let processingComplete = false;
        let attempts = 0;

        while (!processingComplete && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const statusResponse = await request(app)
            .get(`/api/v1/files/${fileId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

          if (statusResponse.body.data.status === 'ready') {
            processingComplete = true;
          }
          attempts++;
        }

        expect(processingComplete).toBe(true);
      }

      // Verify all files are queryable
      const queryResponse = await request(app)
        .get(`/api/v1/files/query`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'property',
          entityId: propertyId,
        })
        .expect(200);

      expect(queryResponse.body.data).toHaveLength(3);
    });
  });

  describe('File Deletion Workflow', () => {
    it('should complete file deletion workflow', async () => {
      const userId = 'test-user-delete';

      // Upload file
      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'test-service')
        .attach('file', testImageBuffer, 'to-delete.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Delete file
      await request(app)
        .delete(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify file is marked as deleted
      const statusResponse = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statusResponse.body.data.status).toBe('deleted');

      // Verify file is no longer downloadable
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
