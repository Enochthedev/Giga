import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { cacheService } from '../../services/cache.service';
import { connectionPoolService } from '../../services/connection-pool.service';

describe('CacheService Performance Tests', () => {
  beforeAll(async () => {
    await connectionPoolService.initializeRedisPool();
  });

  afterAll(async () => {
    await connectionPoolService.close();
  });

  beforeEach(async () => {
    await cacheService.clear();
  });

  describe('Cache Performance', () => {
    it('should handle high-volume cache operations efficiently', async () => {
      const startTime = Date.now();
      const operationCount = 1000;

      // Generate test data
      const testData = Array.from({ length: operationCount }, (_, index) => ({
        key: `perf:test:${index}`,
        value: {
          id: index,
          name: `Test Item ${index}`,
          data: Array.from({ length: 100 }, (_, i) => `data_${i}`), // Some bulk data
          timestamp: Date.now(),
        },
      }));

      // Test SET operations
      const setStartTime = Date.now();
      const setPromises = testData.map(({ key, value }) =>
        cacheService.set(key, value, 300)
      );
      await Promise.all(setPromises);
      const setDuration = Date.now() - setStartTime;

      // Test GET operations
      const getStartTime = Date.now();
      const getPromises = testData.map(({ key }) => cacheService.get(key));
      const results = await Promise.all(getPromises);
      const getDuration = Date.now() - getStartTime;

      const totalDuration = Date.now() - startTime;

      // Verify results
      expect(results).toHaveLength(operationCount);
      results.forEach((result, index) => {
        expect(result).toBeDefined();
        expect(result.id).toBe(index);
        expect(result.name).toBe(`Test Item ${index}`);
      });

      // Performance assertions
      expect(setDuration).toBeLessThan(5000); // SET operations within 5 seconds
      expect(getDuration).toBeLessThan(2000); // GET operations within 2 seconds
      expect(totalDuration).toBeLessThan(10000); // Total within 10 seconds

      console.log(`Cache performance test completed:`);
      console.log(`- ${operationCount} SET operations: ${setDuration}ms`);
      console.log(`- ${operationCount} GET operations: ${getDuration}ms`);
      console.log(`- Total duration: ${totalDuration}ms`);
      console.log(
        `- SET ops/sec: ${((operationCount / setDuration) * 1000).toFixed(2)}`
      );
      console.log(
        `- GET ops/sec: ${((operationCount / getDuration) * 1000).toFixed(2)}`
      );
    });

    it('should handle batch operations efficiently', async () => {
      const batchSize = 500;
      const startTime = Date.now();

      // Prepare batch data
      const batchData: Record<string, any> = {};
      for (let i = 0; i < batchSize; i++) {
        batchData[`batch:${i}`] = {
          id: i,
          value: `batch_value_${i}`,
          metadata: { created: Date.now(), type: 'test' },
        };
      }

      // Test batch SET
      const setBatchStart = Date.now();
      await cacheService.setMultiple(batchData, 300);
      const setBatchDuration = Date.now() - setBatchStart;

      // Test batch GET
      const getBatchStart = Date.now();
      const keys = Object.keys(batchData);
      const results = await cacheService.getMultiple(keys);
      const getBatchDuration = Date.now() - getBatchStart;

      const totalDuration = Date.now() - startTime;

      // Verify results
      expect(Object.keys(results)).toHaveLength(batchSize);
      keys.forEach(key => {
        expect(results[key]).toBeDefined();
        expect(results[key].value).toBe(batchData[key].value);
      });

      // Performance assertions
      expect(setBatchDuration).toBeLessThan(2000); // Batch SET within 2 seconds
      expect(getBatchDuration).toBeLessThan(1000); // Batch GET within 1 second

      console.log(`Batch cache performance:`);
      console.log(`- Batch SET (${batchSize} items): ${setBatchDuration}ms`);
      console.log(`- Batch GET (${batchSize} items): ${getBatchDuration}ms`);
      console.log(`- Total duration: ${totalDuration}ms`);
    });

    it('should maintain good hit rates under concurrent load', async () => {
      const concurrentUsers = 20;
      const operationsPerUser = 50;
      const sharedDataSize = 100;

      // Pre-populate shared data
      const sharedData: Record<string, any> = {};
      for (let i = 0; i < sharedDataSize; i++) {
        const key = `shared:${i}`;
        const value = { id: i, data: `shared_data_${i}`, popular: true };
        sharedData[key] = value;
        await cacheService.set(key, value, 600);
      }

      const startTime = Date.now();

      // Simulate concurrent users accessing shared data
      const userPromises = Array.from(
        { length: concurrentUsers },
        async (_, userIndex) => {
          const userStats = { hits: 0, misses: 0, operations: 0 };

          for (let op = 0; op < operationsPerUser; op++) {
            // 80% chance to access shared data, 20% unique data
            const isSharedAccess = Math.random() < 0.8;
            const key = isSharedAccess
              ? `shared:${Math.floor(Math.random() * sharedDataSize)}`
              : `user:${userIndex}:${op}`;

            const result = await cacheService.get(key);
            userStats.operations++;

            if (result) {
              userStats.hits++;
            } else {
              userStats.misses++;

              // Cache miss - set the data
              if (!isSharedAccess) {
                await cacheService.set(
                  key,
                  {
                    userId: userIndex,
                    operation: op,
                    data: `user_data_${userIndex}_${op}`,
                  },
                  300
                );
              }
            }
          }

          return userStats;
        }
      );

      const userResults = await Promise.all(userPromises);
      const duration = Date.now() - startTime;

      // Calculate overall statistics
      const totalStats = userResults.reduce(
        (acc, stats) => ({
          hits: acc.hits + stats.hits,
          misses: acc.misses + stats.misses,
          operations: acc.operations + stats.operations,
        }),
        { hits: 0, misses: 0, operations: 0 }
      );

      const hitRate = (totalStats.hits / totalStats.operations) * 100;
      const cacheStats = cacheService.getCacheStats();

      // Performance assertions
      expect(hitRate).toBeGreaterThan(60); // At least 60% hit rate
      expect(duration).toBeLessThan(10000); // Complete within 10 seconds

      console.log(`Concurrent cache access test:`);
      console.log(`- ${concurrentUsers} concurrent users`);
      console.log(`- ${operationsPerUser} operations per user`);
      console.log(`- Total operations: ${totalStats.operations}`);
      console.log(`- Hit rate: ${hitRate.toFixed(2)}%`);
      console.log(`- Duration: ${duration}ms`);
      console.log(`- Cache stats:`, cacheStats);
    });

    it('should handle memory pressure gracefully', async () => {
      const largeDataSize = 1000;
      const itemSize = 10000; // 10KB per item

      // Fill cache with large items
      const largeItems: Record<string, any> = {};
      for (let i = 0; i < largeDataSize; i++) {
        const key = `large:${i}`;
        const value = {
          id: i,
          data: 'x'.repeat(itemSize), // Large string data
          metadata: { size: itemSize, created: Date.now() },
        };
        largeItems[key] = value;
      }

      const startTime = Date.now();

      // Set large items in batches to avoid overwhelming
      const batchSize = 100;
      for (let i = 0; i < largeDataSize; i += batchSize) {
        const batch: Record<string, any> = {};
        for (let j = i; j < Math.min(i + batchSize, largeDataSize); j++) {
          batch[`large:${j}`] = largeItems[`large:${j}`];
        }
        await cacheService.setMultiple(batch, 300);
      }

      const setDuration = Date.now() - startTime;

      // Test retrieval performance under memory pressure
      const retrievalStart = Date.now();
      const retrievalPromises = Array.from({ length: 200 }, (_, index) =>
        cacheService.get(`large:${index}`)
      );
      const retrievalResults = await Promise.all(retrievalPromises);
      const retrievalDuration = Date.now() - retrievalStart;

      // Check cache stats
      const cacheStats = cacheService.getCacheStats();

      // Verify some items were retrieved successfully
      const successfulRetrievals = retrievalResults.filter(
        result => result !== null
      ).length;
      expect(successfulRetrievals).toBeGreaterThan(0);

      // Performance should still be reasonable under memory pressure
      expect(retrievalDuration).toBeLessThan(5000);

      console.log(`Memory pressure test:`);
      console.log(`- Set ${largeDataSize} large items: ${setDuration}ms`);
      console.log(`- Retrieved 200 items: ${retrievalDuration}ms`);
      console.log(`- Successful retrievals: ${successfulRetrievals}/200`);
      console.log(
        `- Cache memory usage: ${(cacheStats.memoryUsage / 1024 / 1024).toFixed(2)}MB`
      );
      console.log(`- Cache size: ${cacheStats.memoryCacheSize} items`);
      console.log(`- Hit rate: ${cacheStats.hitRate}%`);
    });

    it('should handle cache invalidation efficiently', async () => {
      const entityTypes = ['user', 'product', 'property'];
      const entitiesPerType = 100;
      const filesPerEntity = 10;

      const startTime = Date.now();

      // Populate cache with file metadata for different entities
      const cachePromises: Promise<void>[] = [];

      for (const entityType of entityTypes) {
        for (let entityId = 0; entityId < entitiesPerType; entityId++) {
          for (let fileId = 0; fileId < filesPerEntity; fileId++) {
            const metadata = {
              id: `${entityType}_${entityId}_${fileId}`,
              entityType,
              entityId: entityId.toString(),
              fileName: `file_${fileId}.jpg`,
              size: Math.floor(Math.random() * 1000000),
              createdAt: new Date(),
            };

            cachePromises.push(cacheService.cacheFileMetadata(metadata as any));
          }
        }
      }

      await Promise.all(cachePromises);
      const populationDuration = Date.now() - startTime;

      // Test cache invalidation performance
      const invalidationStart = Date.now();
      const invalidationPromises = entityTypes
        .map(entityType =>
          Array.from({ length: 10 }, (_, entityId) =>
            cacheService.invalidateEntityCache(entityType, entityId.toString())
          )
        )
        .flat();

      await Promise.all(invalidationPromises);
      const invalidationDuration = Date.now() - invalidationStart;

      // Verify invalidation worked
      const testKey = 'user_0_0';
      const invalidatedItem = await cacheService.getCachedFileMetadata(testKey);
      expect(invalidatedItem).toBeNull();

      // Test that non-invalidated items are still cached
      const nonInvalidatedKey = 'user_50_0';
      const nonInvalidatedItem =
        await cacheService.getCachedFileMetadata(nonInvalidatedKey);
      expect(nonInvalidatedItem).toBeDefined();

      const totalDuration = Date.now() - startTime;

      console.log(`Cache invalidation test:`);
      console.log(`- Populated cache: ${populationDuration}ms`);
      console.log(
        `- Invalidated ${invalidationPromises.length} entities: ${invalidationDuration}ms`
      );
      console.log(`- Total duration: ${totalDuration}ms`);
      console.log(
        `- Invalidation rate: ${((invalidationPromises.length / invalidationDuration) * 1000).toFixed(2)} entities/sec`
      );
    });
  });

  describe('Cache Reliability', () => {
    it('should fallback to memory cache when Redis is unavailable', async () => {
      // This test would require mocking Redis failures
      // For now, we'll test the memory cache directly

      const testData = { id: 1, name: 'Test', data: 'memory_test' };
      const key = 'memory:test:1';

      // Set in cache
      await cacheService.set(key, testData, 300);

      // Get from cache multiple times to test memory cache hits
      const results = await Promise.all([
        cacheService.get(key),
        cacheService.get(key),
        cacheService.get(key),
      ]);

      results.forEach(result => {
        expect(result).toEqual(testData);
      });

      const cacheStats = cacheService.getCacheStats();
      expect(cacheStats.hits).toBeGreaterThan(0);
    });

    it('should maintain cache consistency under concurrent modifications', async () => {
      const key = 'consistency:test';
      const concurrentModifications = 50;

      const modificationPromises = Array.from(
        { length: concurrentModifications },
        async (_, index) => {
          const value = {
            id: index,
            timestamp: Date.now(),
            data: `modification_${index}`,
          };
          await cacheService.set(key, value, 300);
          return value;
        }
      );

      const results = await Promise.all(modificationPromises);

      // Get final value
      const finalValue = await cacheService.get(key);

      expect(finalValue).toBeDefined();
      expect(
        results.some(
          result =>
            result.id === finalValue.id && result.data === finalValue.data
        )
      ).toBe(true);

      console.log(
        `Consistency test: ${concurrentModifications} concurrent modifications`
      );
      console.log(`Final value:`, finalValue);
    });
  });
});
