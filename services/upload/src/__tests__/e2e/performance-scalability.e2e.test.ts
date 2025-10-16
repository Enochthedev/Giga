import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';

describe('Performance and Scalability E2E Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let authToken: string;
  let testImageBuffer: Buffer;
  let largeImageBuffer: Buffer;

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

    authToken = 'performance-test-token';
    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );

    // Create a larger test image (simulate 5MB file)
    largeImageBuffer = Buffer.concat(Array(50).fill(testImageBuffer));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.fileMetadata.deleteMany({
      where: {
        uploadedBy: 'performance-test',
      },
    });
  });

  describe('Concurrent Upload Performance', () => {
    it('should handle concurrent uploads efficiently', async () => {
      const concurrentUploads = 10;
      const startTime = Date.now();

      // Create concurrent upload promises
      const uploadPromises = Array.from(
        { length: concurrentUploads },
        (_, index) =>
          request(app)
            .post('/api/v1/upload/profile-photo')
            .set('Authorization', `Bearer ${authToken}`)
            .field('userId', `concurrent-user-${index}`)
            .field('uploadedBy', 'performance-test')
            .attach('file', testImageBuffer, `concurrent-${index}.jpg`)
      );

      // Execute all uploads concurrently
      const responses = await Promise.all(uploadPromises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Verify all uploads succeeded
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.data.entityId).toBe(`concurrent-user-${index}`);
      });

      // Performance assertion - should complete within reasonable time
      expect(totalTime).toBeLessThan(30000); // 30 seconds for 10 concurrent uploads

      // Verify average time per upload
      const avgTimePerUpload = totalTime / concurrentUploads;
      expect(avgTimePerUpload).toBeLessThan(5000); // Less than 5 seconds per upload on average

      console.log(
        `Concurrent uploads performance: ${totalTime}ms total, ${avgTimePerUpload}ms average`
      );
    });

    it('should maintain performance under sustained load', async () => {
      const batchSize = 5;
      const batchCount = 4;
      const results: number[] = [];

      for (let batch = 0; batch < batchCount; batch++) {
        const startTime = Date.now();

        const uploadPromises = Array.from({ length: batchSize }, (_, index) =>
          request(app)
            .post('/api/v1/upload/product-image')
            .set('Authorization', `Bearer ${authToken}`)
            .field('productId', `batch-${batch}-product-${index}`)
            .field('uploadedBy', 'performance-test')
            .attach('file', testImageBuffer, `batch-${batch}-${index}.jpg`)
        );

        const responses = await Promise.all(uploadPromises);
        const endTime = Date.now();
        const batchTime = endTime - startTime;

        results.push(batchTime);

        // Verify all uploads in batch succeeded
        responses.forEach(response => {
          expect(response.status).toBe(201);
        });

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Performance should remain consistent across batches
      const avgBatchTime =
        results.reduce((sum, time) => sum + time, 0) / results.length;
      const maxBatchTime = Math.max(...results);
      const minBatchTime = Math.min(...results);

      // Variance should be reasonable (max shouldn't be more than 2x min)
      expect(maxBatchTime / minBatchTime).toBeLessThan(2);

      console.log(
        `Sustained load performance: avg=${avgBatchTime}ms, min=${minBatchTime}ms, max=${maxBatchTime}ms`
      );
    });
  });

  describe('Large File Handling Performance', () => {
    it('should handle large file uploads efficiently', async () => {
      const startTime = Date.now();

      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'large_document')
        .field('entityId', 'large-file-test')
        .field('uploadedBy', 'performance-test')
        .attach('file', largeImageBuffer, 'large-file.jpg')
        .expect(201);

      const uploadTime = Date.now() - startTime;

      expect(uploadResponse.body.data.size).toBeGreaterThan(1000000); // > 1MB
      expect(uploadTime).toBeLessThan(60000); // Should complete within 60 seconds

      console.log(
        `Large file upload performance: ${uploadTime}ms for ${uploadResponse.body.data.size} bytes`
      );

      // Verify file can be downloaded efficiently
      const fileId = uploadResponse.body.data.id;
      const downloadStartTime = Date.now();

      const downloadResponse = await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const downloadTime = Date.now() - downloadStartTime;
      expect(downloadTime).toBeLessThan(30000); // Should download within 30 seconds

      console.log(`Large file download performance: ${downloadTime}ms`);
    });

    it('should handle multiple large files concurrently', async () => {
      const concurrentLargeUploads = 3;
      const startTime = Date.now();

      const uploadPromises = Array.from(
        { length: concurrentLargeUploads },
        (_, index) =>
          request(app)
            .post('/api/v1/upload/document')
            .set('Authorization', `Bearer ${authToken}`)
            .field('entityType', 'concurrent_large_document')
            .field('entityId', `large-concurrent-${index}`)
            .field('uploadedBy', 'performance-test')
            .attach('file', largeImageBuffer, `large-concurrent-${index}.jpg`)
      );

      const responses = await Promise.all(uploadPromises);
      const totalTime = Date.now() - startTime;

      // All uploads should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.data.entityId).toBe(`large-concurrent-${index}`);
      });

      // Should complete within reasonable time even with large files
      expect(totalTime).toBeLessThan(120000); // 2 minutes for 3 large concurrent uploads

      console.log(
        `Concurrent large file uploads: ${totalTime}ms for ${concurrentLargeUploads} files`
      );
    });
  });

  describe('Processing Performance', () => {
    it('should process images efficiently', async () => {
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'processing-performance-test')
        .field('uploadedBy', 'performance-test')
        .attach('file', testImageBuffer, 'processing-test.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;
      const processingStartTime = Date.now();

      // Poll for processing completion
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max

      while (!processingComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await request(app)
          .get(`/api/v1/files/${fileId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        if (statusResponse.body.data.status === 'ready') {
          processingComplete = true;

          const processingTime = Date.now() - processingStartTime;
          expect(processingTime).toBeLessThan(15000); // Should process within 15 seconds

          // Verify all expected thumbnails were generated
          const thumbnails =
            statusResponse.body.data.processingResults?.thumbnails || [];
          expect(thumbnails.length).toBeGreaterThan(0);

          console.log(
            `Image processing performance: ${processingTime}ms, ${thumbnails.length} thumbnails generated`
          );
        }
        attempts++;
      }

      expect(processingComplete).toBe(true);
    });

    it('should handle batch processing efficiently', async () => {
      const batchSize = 5;

      const uploadResponse = await request(app)
        .post('/api/v1/upload/batch')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'property')
        .field('entityId', 'batch-processing-test')
        .field('uploadedBy', 'performance-test')
        .attach('files', testImageBuffer, 'batch1.jpg')
        .attach('files', testImageBuffer, 'batch2.jpg')
        .attach('files', testImageBuffer, 'batch3.jpg')
        .attach('files', testImageBuffer, 'batch4.jpg')
        .attach('files', testImageBuffer, 'batch5.jpg')
        .expect(201);

      const fileIds = uploadResponse.body.data.map((file: any) => file.id);
      const processingStartTime = Date.now();

      // Wait for all files to process
      let allProcessed = false;
      let attempts = 0;
      const maxAttempts = 45; // 45 seconds max for batch

      while (!allProcessed && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusPromises = fileIds.map((fileId: string) =>
          request(app)
            .get(`/api/v1/files/${fileId}`)
            .set('Authorization', `Bearer ${authToken}`)
        );

        const statusResponses = await Promise.all(statusPromises);
        const processedCount = statusResponses.filter(
          response => response.body.data.status === 'ready'
        ).length;

        if (processedCount === batchSize) {
          allProcessed = true;
          const totalProcessingTime = Date.now() - processingStartTime;
          const avgProcessingTime = totalProcessingTime / batchSize;

          expect(totalProcessingTime).toBeLessThan(30000); // 30 seconds for batch
          expect(avgProcessingTime).toBeLessThan(10000); // 10 seconds average per file

          console.log(
            `Batch processing performance: ${totalProcessingTime}ms total, ${avgProcessingTime}ms average`
          );
        }
        attempts++;
      }

      expect(allProcessed).toBe(true);
    });
  });

  describe('Database Performance', () => {
    it('should handle large metadata queries efficiently', async () => {
      // Upload multiple files to create test data
      const fileCount = 20;
      const uploadPromises = Array.from({ length: fileCount }, (_, index) =>
        request(app)
          .post('/api/v1/upload/product-image')
          .set('Authorization', `Bearer ${authToken}`)
          .field('productId', `query-test-product-${index % 5}`) // 5 different products
          .field('uploadedBy', 'performance-test')
          .field(
            'tags',
            JSON.stringify([`tag-${index % 3}`, 'performance-test'])
          )
          .attach('file', testImageBuffer, `query-test-${index}.jpg`)
      );

      await Promise.all(uploadPromises);

      // Test various query patterns
      const queryStartTime = Date.now();

      // Query by entity type
      const entityQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ entityType: 'product' })
        .expect(200);

      // Query by specific product
      const productQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'product',
          entityId: 'query-test-product-0',
        })
        .expect(200);

      // Query by tags
      const tagQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'product',
          tags: 'tag-0',
        })
        .expect(200);

      // Paginated query
      const paginatedQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          entityType: 'product',
          limit: 10,
          offset: 0,
        })
        .expect(200);

      const queryTime = Date.now() - queryStartTime;

      // Verify query results
      expect(entityQuery.body.data.length).toBe(fileCount);
      expect(productQuery.body.data.length).toBe(4); // fileCount / 5
      expect(tagQuery.body.data.length).toBeGreaterThan(0);
      expect(paginatedQuery.body.data.length).toBe(10);

      // Performance assertions
      expect(queryTime).toBeLessThan(5000); // All queries should complete within 5 seconds

      console.log(
        `Database query performance: ${queryTime}ms for multiple complex queries`
      );
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should handle memory efficiently during concurrent operations', async () => {
      const initialMemory = process.memoryUsage();

      // Perform memory-intensive operations
      const concurrentOperations = Array.from({ length: 10 }, (_, index) =>
        request(app)
          .post('/api/v1/upload/document')
          .set('Authorization', `Bearer ${authToken}`)
          .field('entityType', 'memory_test')
          .field('entityId', `memory-test-${index}`)
          .field('uploadedBy', 'performance-test')
          .attach('file', largeImageBuffer, `memory-test-${index}.dat`)
      );

      await Promise.all(concurrentOperations);

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

      console.log(
        `Memory usage: initial=${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB, final=${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB, increase=${Math.round(memoryIncrease / 1024 / 1024)}MB`
      );
    });
  });
});
