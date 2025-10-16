import { beforeEach, describe, expect, it, vi } from 'vitest';
import { batchProcessorService } from '../../services/batch-processor.service';
import {
  AccessLevel,
  EntityType,
  FileMetadata,
  UploadRequest,
} from '../../types/upload.types';

// Mock the actual processing methods
vi.mock('../../services/batch-processor.service', async () => {
  const actual = await vi.importActual(
    '../../services/batch-processor.service'
  );
  const { BatchProcessorService } = actual as any;

  // Create a test version with mocked processing methods
  class TestBatchProcessorService extends BatchProcessorService {
    async processUpload(request: UploadRequest): Promise<FileMetadata> {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

      return {
        id: `file_${Date.now()}_${Math.random()}`,
        originalName: request.file.originalName,
        fileName: `processed_${request.file.originalName}`,
        mimeType: request.file.mimeType,
        size: request.file.size,
        path: `/uploads/${request.entityType}/${request.entityId}/`,
        url: `https://example.com/files/file_${Date.now()}`,
        uploadedBy: request.uploadedBy,
        entityType: request.entityType,
        entityId: request.entityId,
        status: 'ready' as any,
        accessLevel: request.accessLevel,
        metadata: request.metadata || {},
        tags: request.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async processDelete(fileId: string): Promise<boolean> {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      return true;
    }

    async batchGetMetadataFromDatabase(
      fileIds: string[]
    ): Promise<(FileMetadata | null)[]> {
      // Simulate database batch query
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200));

      return fileIds.map(fileId => ({
        id: fileId,
        originalName: `file_${fileId}.jpg`,
        fileName: `processed_file_${fileId}.jpg`,
        mimeType: 'image/jpeg',
        size: Math.floor(Math.random() * 1000000),
        path: `/uploads/test/${fileId}/`,
        url: `https://example.com/files/${fileId}`,
        uploadedBy: 'test-service',
        entityType: EntityType.PRODUCT,
        entityId: 'test-entity',
        status: 'ready' as any,
        accessLevel: AccessLevel.PUBLIC,
        metadata: {},
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
  }

  return {
    ...actual,
    batchProcessorService: new TestBatchProcessorService(),
  };
});

describe('BatchProcessorService Performance Tests', () => {
  beforeEach(() => {
    // Reset batch processor state
    vi.clearAllMocks();
  });

  describe('Upload Batching Performance', () => {
    it('should process upload batches efficiently', async () => {
      const batchSize = 50;
      const startTime = Date.now();

      // Create test upload requests
      const uploadPromises = Array.from({ length: batchSize }, (_, index) => {
        const request: UploadRequest = {
          file: {
            buffer: Buffer.from(`test file content ${index}`),
            originalName: `test_file_${index}.jpg`,
            mimeType: 'image/jpeg',
            size: 1024 * (index + 1),
          },
          entityType: EntityType.PRODUCT,
          entityId: `product_${index % 10}`, // 10 different products
          uploadedBy: 'test-service',
          accessLevel: AccessLevel.PUBLIC,
          metadata: { testIndex: index },
          tags: [`tag_${index % 5}`], // 5 different tags
        };

        return batchProcessorService.batchUpload(request);
      });

      const results = await Promise.all(uploadPromises);
      const duration = Date.now() - startTime;

      // Verify results
      expect(results).toHaveLength(batchSize);
      results.forEach((result, index) => {
        expect(result.id).toBeDefined();
        expect(result.originalName).toBe(`test_file_${index}.jpg`);
        expect(result.entityType).toBe(EntityType.PRODUCT);
      });

      // Performance assertions
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds

      const batchStats = batchProcessorService.getBatchStats();
      console.log(`Upload batch performance:`);
      console.log(`- Processed ${batchSize} uploads in ${duration}ms`);
      console.log(
        `- Average time per upload: ${(duration / batchSize).toFixed(2)}ms`
      );
      console.log(
        `- Throughput: ${((batchSize / duration) * 1000).toFixed(2)} uploads/sec`
      );
      console.log(`- Batch stats:`, batchStats);
    });

    it('should handle concurrent upload batches', async () => {
      const concurrentBatches = 5;
      const uploadsPerBatch = 20;
      const startTime = Date.now();

      // Create concurrent batch operations
      const batchPromises = Array.from(
        { length: concurrentBatches },
        async (_, batchIndex) => {
          const batchStartTime = Date.now();

          const uploadPromises = Array.from(
            { length: uploadsPerBatch },
            (_, uploadIndex) => {
              const globalIndex = batchIndex * uploadsPerBatch + uploadIndex;
              const request: UploadRequest = {
                file: {
                  buffer: Buffer.from(
                    `batch ${batchIndex} file ${uploadIndex}`
                  ),
                  originalName: `batch_${batchIndex}_file_${uploadIndex}.jpg`,
                  mimeType: 'image/jpeg',
                  size: 2048,
                },
                entityType: EntityType.USER_PROFILE,
                entityId: `user_${globalIndex}`,
                uploadedBy: 'test-service',
                accessLevel: AccessLevel.PRIVATE,
              };

              return batchProcessorService.batchUpload(request);
            }
          );

          const batchResults = await Promise.all(uploadPromises);
          const batchDuration = Date.now() - batchStartTime;

          return {
            batchIndex,
            results: batchResults,
            duration: batchDuration,
          };
        }
      );

      const batchResults = await Promise.all(batchPromises);
      const totalDuration = Date.now() - startTime;

      // Verify all batches completed successfully
      expect(batchResults).toHaveLength(concurrentBatches);

      const totalUploads = concurrentBatches * uploadsPerBatch;
      const allResults = batchResults.flatMap(batch => batch.results);
      expect(allResults).toHaveLength(totalUploads);

      // Performance analysis
      const avgBatchDuration =
        batchResults.reduce((sum, batch) => sum + batch.duration, 0) /
        concurrentBatches;
      const maxBatchDuration = Math.max(
        ...batchResults.map(batch => batch.duration)
      );
      const minBatchDuration = Math.min(
        ...batchResults.map(batch => batch.duration)
      );

      console.log(`Concurrent batch performance:`);
      console.log(`- ${concurrentBatches} concurrent batches`);
      console.log(`- ${uploadsPerBatch} uploads per batch`);
      console.log(`- Total uploads: ${totalUploads}`);
      console.log(`- Total duration: ${totalDuration}ms`);
      console.log(`- Average batch duration: ${avgBatchDuration.toFixed(2)}ms`);
      console.log(
        `- Min/Max batch duration: ${minBatchDuration}ms / ${maxBatchDuration}ms`
      );
      console.log(
        `- Overall throughput: ${((totalUploads / totalDuration) * 1000).toFixed(2)} uploads/sec`
      );
    });

    it('should optimize batch sizes dynamically', async () => {
      const testSizes = [10, 25, 50, 100];
      const results: Array<{
        size: number;
        duration: number;
        throughput: number;
      }> = [];

      for (const batchSize of testSizes) {
        const startTime = Date.now();

        const uploadPromises = Array.from({ length: batchSize }, (_, index) => {
          const request: UploadRequest = {
            file: {
              buffer: Buffer.from(`optimization test ${index}`),
              originalName: `opt_test_${index}.jpg`,
              mimeType: 'image/jpeg',
              size: 1024,
            },
            entityType: EntityType.PRODUCT,
            entityId: `product_${index}`,
            uploadedBy: 'test-service',
            accessLevel: AccessLevel.PUBLIC,
          };

          return batchProcessorService.batchUpload(request);
        });

        await Promise.all(uploadPromises);
        const duration = Date.now() - startTime;
        const throughput = (batchSize / duration) * 1000;

        results.push({ size: batchSize, duration, throughput });

        // Wait between tests to avoid interference
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Find optimal batch size (highest throughput)
      const optimalResult = results.reduce((best, current) =>
        current.throughput > best.throughput ? current : best
      );

      console.log(`Batch size optimization results:`);
      results.forEach(result => {
        console.log(
          `- Size ${result.size}: ${result.duration}ms, ${result.throughput.toFixed(2)} uploads/sec`
        );
      });
      console.log(
        `- Optimal batch size: ${optimalResult.size} (${optimalResult.throughput.toFixed(2)} uploads/sec)`
      );

      expect(optimalResult.throughput).toBeGreaterThan(0);
    });
  });

  describe('Delete Batching Performance', () => {
    it('should process delete batches efficiently', async () => {
      const batchSize = 100;
      const startTime = Date.now();

      // Create test file IDs
      const fileIds = Array.from(
        { length: batchSize },
        (_, index) => `file_${index}`
      );

      // Execute batch deletes
      const deletePromises = fileIds.map(fileId =>
        batchProcessorService.batchDelete(fileId)
      );
      const results = await Promise.all(deletePromises);

      const duration = Date.now() - startTime;

      // Verify results
      expect(results).toHaveLength(batchSize);
      results.forEach(result => {
        expect(result).toBe(true);
      });

      console.log(`Delete batch performance:`);
      console.log(`- Processed ${batchSize} deletes in ${duration}ms`);
      console.log(
        `- Average time per delete: ${(duration / batchSize).toFixed(2)}ms`
      );
      console.log(
        `- Throughput: ${((batchSize / duration) * 1000).toFixed(2)} deletes/sec`
      );
    });
  });

  describe('Metadata Batching Performance', () => {
    it('should process metadata requests efficiently', async () => {
      const batchSize = 200;
      const startTime = Date.now();

      // Create test file IDs
      const fileIds = Array.from(
        { length: batchSize },
        (_, index) => `metadata_file_${index}`
      );

      // Execute batch metadata requests
      const metadataPromises = fileIds.map(fileId =>
        batchProcessorService.batchGetMetadata(fileId)
      );
      const results = await Promise.all(metadataPromises);

      const duration = Date.now() - startTime;

      // Verify results
      expect(results).toHaveLength(batchSize);
      results.forEach((result, index) => {
        expect(result).toBeDefined();
        expect(result?.id).toBe(fileIds[index]);
      });

      console.log(`Metadata batch performance:`);
      console.log(
        `- Processed ${batchSize} metadata requests in ${duration}ms`
      );
      console.log(
        `- Average time per request: ${(duration / batchSize).toFixed(2)}ms`
      );
      console.log(
        `- Throughput: ${((batchSize / duration) * 1000).toFixed(2)} requests/sec`
      );
    });

    it('should handle mixed batch operations efficiently', async () => {
      const operationsPerType = 30;
      const startTime = Date.now();

      // Create mixed operations
      const uploadPromises = Array.from(
        { length: operationsPerType },
        (_, index) => {
          const request: UploadRequest = {
            file: {
              buffer: Buffer.from(`mixed test upload ${index}`),
              originalName: `mixed_upload_${index}.jpg`,
              mimeType: 'image/jpeg',
              size: 1024,
            },
            entityType: EntityType.PROPERTY,
            entityId: `property_${index}`,
            uploadedBy: 'test-service',
            accessLevel: AccessLevel.PUBLIC,
          };
          return batchProcessorService.batchUpload(request);
        }
      );

      const deletePromises = Array.from(
        { length: operationsPerType },
        (_, index) => batchProcessorService.batchDelete(`delete_file_${index}`)
      );

      const metadataPromises = Array.from(
        { length: operationsPerType },
        (_, index) =>
          batchProcessorService.batchGetMetadata(`metadata_file_${index}`)
      );

      // Execute all operations concurrently
      const [uploadResults, deleteResults, metadataResults] = await Promise.all(
        [
          Promise.all(uploadPromises),
          Promise.all(deletePromises),
          Promise.all(metadataPromises),
        ]
      );

      const duration = Date.now() - startTime;
      const totalOperations = operationsPerType * 3;

      // Verify results
      expect(uploadResults).toHaveLength(operationsPerType);
      expect(deleteResults).toHaveLength(operationsPerType);
      expect(metadataResults).toHaveLength(operationsPerType);

      console.log(`Mixed batch operations performance:`);
      console.log(
        `- ${operationsPerType} uploads, ${operationsPerType} deletes, ${operationsPerType} metadata requests`
      );
      console.log(`- Total operations: ${totalOperations}`);
      console.log(`- Total duration: ${duration}ms`);
      console.log(
        `- Overall throughput: ${((totalOperations / duration) * 1000).toFixed(2)} ops/sec`
      );

      const batchStats = batchProcessorService.getBatchStats();
      console.log(`- Final batch stats:`, batchStats);
    });
  });

  describe('Batch Processor Reliability', () => {
    it('should handle batch processing failures gracefully', async () => {
      const batchSize = 20;
      const failureRate = 0.3; // 30% failure rate

      // Mock some operations to fail
      const originalBatchUpload = batchProcessorService.batchUpload;
      let operationCount = 0;

      batchProcessorService.batchUpload = async function (
        request: UploadRequest
      ) {
        operationCount++;
        if (Math.random() < failureRate) {
          throw new Error(`Simulated failure for operation ${operationCount}`);
        }
        return originalBatchUpload.call(this, request);
      };

      const startTime = Date.now();
      let successCount = 0;
      let failureCount = 0;

      const promises = Array.from({ length: batchSize }, async (_, index) => {
        try {
          const request: UploadRequest = {
            file: {
              buffer: Buffer.from(`failure test ${index}`),
              originalName: `failure_test_${index}.jpg`,
              mimeType: 'image/jpeg',
              size: 1024,
            },
            entityType: EntityType.VEHICLE,
            entityId: `vehicle_${index}`,
            uploadedBy: 'test-service',
            accessLevel: AccessLevel.PUBLIC,
          };

          await batchProcessorService.batchUpload(request);
          successCount++;
        } catch (error) {
          failureCount++;
        }
      });

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Restore original method
      batchProcessorService.batchUpload = originalBatchUpload;

      expect(successCount + failureCount).toBe(batchSize);
      expect(successCount).toBeGreaterThan(0);
      expect(failureCount).toBeGreaterThan(0);

      const actualFailureRate = failureCount / batchSize;
      expect(actualFailureRate).toBeCloseTo(failureRate, 1);

      console.log(`Batch failure handling test:`);
      console.log(`- Total operations: ${batchSize}`);
      console.log(`- Successful: ${successCount}`);
      console.log(`- Failed: ${failureCount}`);
      console.log(
        `- Actual failure rate: ${(actualFailureRate * 100).toFixed(1)}%`
      );
      console.log(`- Duration: ${duration}ms`);
    });

    it('should maintain performance under high load', async () => {
      const highLoadDuration = 5000; // 5 seconds
      const startTime = Date.now();
      let operationCount = 0;
      let successCount = 0;
      let errorCount = 0;

      const loadTest = async () => {
        while (Date.now() - startTime < highLoadDuration) {
          try {
            const operationType = operationCount % 3;
            operationCount++;

            if (operationType === 0) {
              // Upload operation
              const request: UploadRequest = {
                file: {
                  buffer: Buffer.from(`load test ${operationCount}`),
                  originalName: `load_test_${operationCount}.jpg`,
                  mimeType: 'image/jpeg',
                  size: 1024,
                },
                entityType: EntityType.ADVERTISEMENT,
                entityId: `ad_${operationCount}`,
                uploadedBy: 'test-service',
                accessLevel: AccessLevel.PUBLIC,
              };
              await batchProcessorService.batchUpload(request);
            } else if (operationType === 1) {
              // Delete operation
              await batchProcessorService.batchDelete(
                `load_test_file_${operationCount}`
              );
            } else {
              // Metadata operation
              await batchProcessorService.batchGetMetadata(
                `load_test_metadata_${operationCount}`
              );
            }

            successCount++;
          } catch (error) {
            errorCount++;
          }

          // Small delay to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      };

      // Run multiple concurrent load tests
      const concurrentLoadTests = 3;
      const loadTestPromises = Array.from({ length: concurrentLoadTests }, () =>
        loadTest()
      );

      await Promise.all(loadTestPromises);

      const totalDuration = Date.now() - startTime;
      const operationsPerSecond = (operationCount / totalDuration) * 1000;
      const errorRate = errorCount / operationCount;

      expect(operationCount).toBeGreaterThan(0);
      expect(errorRate).toBeLessThan(0.1); // Less than 10% error rate

      console.log(`High load test results:`);
      console.log(`- Duration: ${totalDuration}ms`);
      console.log(`- Total operations: ${operationCount}`);
      console.log(`- Successful: ${successCount}`);
      console.log(`- Errors: ${errorCount}`);
      console.log(`- Operations per second: ${operationsPerSecond.toFixed(2)}`);
      console.log(`- Error rate: ${(errorRate * 100).toFixed(2)}%`);

      const finalStats = batchProcessorService.getBatchStats();
      console.log(`- Final batch stats:`, finalStats);
    });
  });
});
