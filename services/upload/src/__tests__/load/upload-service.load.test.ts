import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp, initializeServices, shutdownServices } from '../../app';
import { cacheService } from '../../services/cache.service';
import { connectionPoolService } from '../../services/connection-pool.service';
import { performanceMonitorService } from '../../services/performance-monitor.service';

describe('Upload Service Load Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
    await initializeServices();
  });

  afterAll(async () => {
    await shutdownServices();
  });

  beforeEach(() => {
    performanceMonitorService.reset();
  });

  describe('HTTP Load Tests', () => {
    it('should handle concurrent health check requests', async () => {
      const concurrentRequests = 100;
      const startTime = Date.now();

      const requestPromises = Array.from({ length: concurrentRequests }, () =>
        request(app).get('/health').expect(200)
      );

      const responses = await Promise.all(requestPromises);
      const duration = Date.now() - startTime;

      expect(responses).toHaveLength(concurrentRequests);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds

      const requestsPerSecond = (concurrentRequests / duration) * 1000;

      console.log(`Health check load test:`);
      console.log(`- ${concurrentRequests} concurrent requests`);
      console.log(`- Duration: ${duration}ms`);
      console.log(`- Requests per second: ${requestsPerSecond.toFixed(2)}`);

      // Verify all responses are successful
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
      });
    });

    it('should handle sustained HTTP load', async () => {
      const loadTestDuration = 10000; // 10 seconds
      const requestInterval = 50; // Request every 50ms
      const startTime = Date.now();
      let requestCount = 0;
      let successCount = 0;
      let errorCount = 0;
      const responseTimes: number[] = [];

      const loadTest = async () => {
        while (Date.now() - startTime < loadTestDuration) {
          const requestStart = Date.now();

          try {
            const response = await request(app).get('/health').timeout(5000);

            const responseTime = Date.now() - requestStart;
            responseTimes.push(responseTime);

            if (response.status === 200) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
          }

          requestCount++;
          await new Promise(resolve => setTimeout(resolve, requestInterval));
        }
      };

      // Run multiple concurrent load generators
      const concurrentLoadGenerators = 5;
      const loadPromises = Array.from(
        { length: concurrentLoadGenerators },
        () => loadTest()
      );

      await Promise.all(loadPromises);

      const actualDuration = Date.now() - startTime;
      const avgResponseTime =
        responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const minResponseTime = Math.min(...responseTimes);
      const requestsPerSecond = (requestCount / actualDuration) * 1000;
      const errorRate = (errorCount / requestCount) * 100;

      console.log(`Sustained HTTP load test:`);
      console.log(`- Duration: ${actualDuration}ms`);
      console.log(`- Total requests: ${requestCount}`);
      console.log(`- Successful requests: ${successCount}`);
      console.log(`- Failed requests: ${errorCount}`);
      console.log(`- Error rate: ${errorRate.toFixed(2)}%`);
      console.log(`- Requests per second: ${requestsPerSecond.toFixed(2)}`);
      console.log(`- Avg response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(
        `- Min/Max response time: ${minResponseTime}ms / ${maxResponseTime}ms`
      );

      // Performance assertions
      expect(errorRate).toBeLessThan(5); // Less than 5% error rate
      expect(avgResponseTime).toBeLessThan(1000); // Average response time under 1 second
      expect(requestsPerSecond).toBeGreaterThan(10); // At least 10 requests per second

      // Check performance monitoring
      const performanceSummary =
        performanceMonitorService.getPerformanceSummary();
      console.log(`- Performance alerts: ${performanceSummary.alerts.length}`);
      console.log(`- Performance trends:`, performanceSummary.trends);
    });

    it('should handle mixed endpoint load', async () => {
      const loadTestDuration = 8000; // 8 seconds
      const startTime = Date.now();
      let requestCount = 0;
      let successCount = 0;
      let errorCount = 0;
      const endpointStats: Record<
        string,
        { count: number; success: number; avgTime: number }
      > = {};

      const endpoints = [
        { path: '/health', weight: 0.4 }, // 40% health checks
        { path: '/api/v1/files/test-file-id', weight: 0.3 }, // 30% file requests
        { path: '/metrics', weight: 0.2 }, // 20% metrics requests
        { path: '/api/v1/upload/status', weight: 0.1 }, // 10% status requests
      ];

      const mixedLoad = async () => {
        while (Date.now() - startTime < loadTestDuration) {
          // Select endpoint based on weight
          const random = Math.random();
          let cumulativeWeight = 0;
          let selectedEndpoint = endpoints[0];

          for (const endpoint of endpoints) {
            cumulativeWeight += endpoint.weight;
            if (random <= cumulativeWeight) {
              selectedEndpoint = endpoint;
              break;
            }
          }

          const requestStart = Date.now();

          try {
            const response = await request(app)
              .get(selectedEndpoint.path)
              .timeout(3000);

            const responseTime = Date.now() - requestStart;

            // Update endpoint stats
            if (!endpointStats[selectedEndpoint.path]) {
              endpointStats[selectedEndpoint.path] = {
                count: 0,
                success: 0,
                avgTime: 0,
              };
            }

            const stats = endpointStats[selectedEndpoint.path];
            stats.count++;
            stats.avgTime =
              (stats.avgTime * (stats.count - 1) + responseTime) / stats.count;

            if (response.status < 400) {
              successCount++;
              stats.success++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
            if (!endpointStats[selectedEndpoint.path]) {
              endpointStats[selectedEndpoint.path] = {
                count: 0,
                success: 0,
                avgTime: 0,
              };
            }
            endpointStats[selectedEndpoint.path].count++;
          }

          requestCount++;
          await new Promise(resolve => setTimeout(resolve, 25)); // 40 requests per second per generator
        }
      };

      // Run concurrent mixed load
      const concurrentGenerators = 3;
      const loadPromises = Array.from({ length: concurrentGenerators }, () =>
        mixedLoad()
      );

      await Promise.all(loadPromises);

      const actualDuration = Date.now() - startTime;
      const requestsPerSecond = (requestCount / actualDuration) * 1000;
      const errorRate = (errorCount / requestCount) * 100;

      console.log(`Mixed endpoint load test:`);
      console.log(`- Duration: ${actualDuration}ms`);
      console.log(`- Total requests: ${requestCount}`);
      console.log(
        `- Success rate: ${((successCount / requestCount) * 100).toFixed(2)}%`
      );
      console.log(`- Requests per second: ${requestsPerSecond.toFixed(2)}`);

      console.log(`- Endpoint breakdown:`);
      Object.entries(endpointStats).forEach(([endpoint, stats]) => {
        const successRate = (stats.success / stats.count) * 100;
        console.log(
          `  ${endpoint}: ${stats.count} requests, ${successRate.toFixed(1)}% success, ${stats.avgTime.toFixed(2)}ms avg`
        );
      });

      expect(errorRate).toBeLessThan(10); // Less than 10% error rate for mixed load
      expect(requestsPerSecond).toBeGreaterThan(50); // At least 50 requests per second total
    });
  });

  describe('Database Load Tests', () => {
    it('should handle concurrent database operations', async () => {
      const concurrentOperations = 50;
      const startTime = Date.now();

      const dbOperations = Array.from(
        { length: concurrentOperations },
        async (_, index) => {
          const operationStart = Date.now();

          try {
            // Test database connection pool under load
            const result = await connectionPoolService.executeQuery(
              'SELECT $1 as operation_id, $2 as test_data, NOW() as timestamp',
              [index, `test_data_${index}`]
            );

            const operationTime = Date.now() - operationStart;
            return { success: true, operationTime, result: result[0] };
          } catch (error) {
            const operationTime = Date.now() - operationStart;
            return { success: false, operationTime, error };
          }
        }
      );

      const results = await Promise.all(dbOperations);
      const duration = Date.now() - startTime;

      const successfulOps = results.filter(r => r.success);
      const failedOps = results.filter(r => !r.success);
      const avgOperationTime =
        results.reduce((sum, r) => sum + r.operationTime, 0) / results.length;
      const maxOperationTime = Math.max(...results.map(r => r.operationTime));

      console.log(`Database load test:`);
      console.log(`- ${concurrentOperations} concurrent operations`);
      console.log(`- Duration: ${duration}ms`);
      console.log(`- Successful operations: ${successfulOps.length}`);
      console.log(`- Failed operations: ${failedOps.length}`);
      console.log(
        `- Success rate: ${((successfulOps.length / concurrentOperations) * 100).toFixed(2)}%`
      );
      console.log(`- Avg operation time: ${avgOperationTime.toFixed(2)}ms`);
      console.log(`- Max operation time: ${maxOperationTime}ms`);

      // Check connection pool stats
      const poolStats = connectionPoolService.getPoolStats();
      console.log(`- Connection pool stats:`, poolStats.database);

      expect(successfulOps.length).toBeGreaterThan(concurrentOperations * 0.9); // At least 90% success
      expect(avgOperationTime).toBeLessThan(1000); // Average operation under 1 second
    });

    it('should maintain database performance under sustained load', async () => {
      const sustainedLoadDuration = 5000; // 5 seconds
      const startTime = Date.now();
      let operationCount = 0;
      let successCount = 0;
      let errorCount = 0;
      const operationTimes: number[] = [];

      const sustainedDbLoad = async () => {
        while (Date.now() - startTime < sustainedLoadDuration) {
          const operationStart = Date.now();

          try {
            await connectionPoolService.executeQuery(
              'SELECT $1 as counter, pg_sleep($2)',
              [operationCount, Math.random() * 0.1] // Random sleep 0-100ms
            );

            const operationTime = Date.now() - operationStart;
            operationTimes.push(operationTime);
            successCount++;
          } catch (error) {
            errorCount++;
          }

          operationCount++;
          await new Promise(resolve => setTimeout(resolve, 50)); // 20 operations per second per generator
        }
      };

      // Run multiple concurrent database load generators
      const concurrentDbGenerators = 3;
      const dbLoadPromises = Array.from(
        { length: concurrentDbGenerators },
        () => sustainedDbLoad()
      );

      await Promise.all(dbLoadPromises);

      const actualDuration = Date.now() - startTime;
      const operationsPerSecond = (operationCount / actualDuration) * 1000;
      const avgOperationTime =
        operationTimes.reduce((sum, time) => sum + time, 0) /
        operationTimes.length;
      const errorRate = (errorCount / operationCount) * 100;

      console.log(`Sustained database load test:`);
      console.log(`- Duration: ${actualDuration}ms`);
      console.log(`- Total operations: ${operationCount}`);
      console.log(`- Operations per second: ${operationsPerSecond.toFixed(2)}`);
      console.log(
        `- Success rate: ${((successCount / operationCount) * 100).toFixed(2)}%`
      );
      console.log(`- Avg operation time: ${avgOperationTime.toFixed(2)}ms`);
      console.log(`- Error rate: ${errorRate.toFixed(2)}%`);

      // Check final pool health
      const healthCheck = await connectionPoolService.healthCheck();
      console.log(`- Database health:`, healthCheck.database);

      expect(errorRate).toBeLessThan(5); // Less than 5% error rate
      expect(healthCheck.database.status).toBe('healthy');
    });
  });

  describe('Cache Load Tests', () => {
    it('should handle high-volume cache operations', async () => {
      const cacheOperations = 1000;
      const startTime = Date.now();

      // Generate test data
      const testData = Array.from({ length: cacheOperations }, (_, index) => ({
        key: `load_test_${index}`,
        value: {
          id: index,
          data: `cache_data_${index}`,
          timestamp: Date.now(),
          metadata: { type: 'load_test', size: Math.random() * 1000 },
        },
      }));

      // Test cache SET operations
      const setStartTime = Date.now();
      const setPromises = testData.map(({ key, value }) =>
        cacheService.set(key, value, 300)
      );
      await Promise.all(setPromises);
      const setDuration = Date.now() - setStartTime;

      // Test cache GET operations
      const getStartTime = Date.now();
      const getPromises = testData.map(({ key }) => cacheService.get(key));
      const getResults = await Promise.all(getPromises);
      const getDuration = Date.now() - getStartTime;

      const totalDuration = Date.now() - startTime;
      const cacheStats = cacheService.getCacheStats();

      console.log(`Cache load test:`);
      console.log(`- ${cacheOperations} cache operations`);
      console.log(
        `- SET operations: ${setDuration}ms (${((cacheOperations / setDuration) * 1000).toFixed(2)} ops/sec)`
      );
      console.log(
        `- GET operations: ${getDuration}ms (${((cacheOperations / getDuration) * 1000).toFixed(2)} ops/sec)`
      );
      console.log(`- Total duration: ${totalDuration}ms`);
      console.log(`- Cache stats:`, {
        hitRate: cacheStats.hitRate,
        memoryUsage: `${(cacheStats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        size: cacheStats.memoryCacheSize,
      });

      // Verify results
      const successfulGets = getResults.filter(
        result => result !== null
      ).length;
      expect(successfulGets).toBe(cacheOperations);
      expect(cacheStats.hitRate).toBeGreaterThan(90); // At least 90% hit rate
    });

    it('should maintain cache performance under concurrent access', async () => {
      const concurrentUsers = 20;
      const operationsPerUser = 50;
      const sharedDataSize = 100;

      // Pre-populate shared cache data
      const sharedData: Record<string, any> = {};
      for (let i = 0; i < sharedDataSize; i++) {
        const key = `shared_${i}`;
        const value = { id: i, shared: true, data: `shared_data_${i}` };
        sharedData[key] = value;
        await cacheService.set(key, value, 600);
      }

      const startTime = Date.now();
      const userPromises = Array.from(
        { length: concurrentUsers },
        async (_, userIndex) => {
          const userStats = { operations: 0, hits: 0, misses: 0, errors: 0 };

          for (let op = 0; op < operationsPerUser; op++) {
            try {
              userStats.operations++;

              // 70% shared data access, 30% user-specific data
              const isSharedAccess = Math.random() < 0.7;
              const key = isSharedAccess
                ? `shared_${Math.floor(Math.random() * sharedDataSize)}`
                : `user_${userIndex}_${op}`;

              const result = await cacheService.get(key);

              if (result) {
                userStats.hits++;
              } else {
                userStats.misses++;

                // Cache miss - set user-specific data
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
            } catch (error) {
              userStats.errors++;
            }
          }

          return userStats;
        }
      );

      const userResults = await Promise.all(userPromises);
      const duration = Date.now() - startTime;

      // Aggregate results
      const totalStats = userResults.reduce(
        (acc, stats) => ({
          operations: acc.operations + stats.operations,
          hits: acc.hits + stats.hits,
          misses: acc.misses + stats.misses,
          errors: acc.errors + stats.errors,
        }),
        { operations: 0, hits: 0, misses: 0, errors: 0 }
      );

      const hitRate = (totalStats.hits / totalStats.operations) * 100;
      const errorRate = (totalStats.errors / totalStats.operations) * 100;
      const operationsPerSecond = (totalStats.operations / duration) * 1000;

      console.log(`Concurrent cache access test:`);
      console.log(`- ${concurrentUsers} concurrent users`);
      console.log(`- ${operationsPerUser} operations per user`);
      console.log(`- Total operations: ${totalStats.operations}`);
      console.log(`- Duration: ${duration}ms`);
      console.log(`- Operations per second: ${operationsPerSecond.toFixed(2)}`);
      console.log(`- Hit rate: ${hitRate.toFixed(2)}%`);
      console.log(`- Error rate: ${errorRate.toFixed(2)}%`);

      const finalCacheStats = cacheService.getCacheStats();
      console.log(`- Final cache stats:`, {
        hitRate: finalCacheStats.hitRate,
        memoryUsage: `${(finalCacheStats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
      });

      expect(hitRate).toBeGreaterThan(60); // At least 60% hit rate
      expect(errorRate).toBeLessThan(1); // Less than 1% error rate
      expect(operationsPerSecond).toBeGreaterThan(100); // At least 100 operations per second
    });
  });

  describe('System Integration Load Tests', () => {
    it('should handle full system load with all components', async () => {
      const integrationTestDuration = 10000; // 10 seconds
      const startTime = Date.now();

      let httpRequests = 0;
      let dbOperations = 0;
      let cacheOperations = 0;
      let totalErrors = 0;

      const fullSystemLoad = async (generatorId: number) => {
        while (Date.now() - startTime < integrationTestDuration) {
          try {
            // HTTP request (33% of operations)
            if (Math.random() < 0.33) {
              await request(app).get('/health').timeout(2000);
              httpRequests++;
            }

            // Database operation (33% of operations)
            else if (Math.random() < 0.66) {
              await connectionPoolService.executeQuery(
                'SELECT $1 as generator_id, NOW() as timestamp',
                [generatorId]
              );
              dbOperations++;
            }

            // Cache operation (34% of operations)
            else {
              const key = `integration_test_${generatorId}_${Date.now()}`;
              const value = {
                generatorId,
                timestamp: Date.now(),
                data: 'integration_test',
              };

              await cacheService.set(key, value, 300);
              const retrieved = await cacheService.get(key);

              if (retrieved) {
                cacheOperations++;
              }
            }
          } catch (error) {
            totalErrors++;
          }

          // Small delay to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      };

      // Run multiple concurrent system load generators
      const systemLoadGenerators = 5;
      const loadPromises = Array.from(
        { length: systemLoadGenerators },
        (_, index) => fullSystemLoad(index)
      );

      await Promise.all(loadPromises);

      const actualDuration = Date.now() - startTime;
      const totalOperations = httpRequests + dbOperations + cacheOperations;
      const operationsPerSecond = (totalOperations / actualDuration) * 1000;
      const errorRate = (totalErrors / totalOperations) * 100;

      // Get final system stats
      const performanceSummary =
        performanceMonitorService.getPerformanceSummary();
      const poolStats = connectionPoolService.getPoolStats();
      const cacheStats = cacheService.getCacheStats();
      const dbHealth = await connectionPoolService.healthCheck();

      console.log(`Full system integration load test:`);
      console.log(`- Duration: ${actualDuration}ms`);
      console.log(`- HTTP requests: ${httpRequests}`);
      console.log(`- Database operations: ${dbOperations}`);
      console.log(`- Cache operations: ${cacheOperations}`);
      console.log(`- Total operations: ${totalOperations}`);
      console.log(`- Operations per second: ${operationsPerSecond.toFixed(2)}`);
      console.log(`- Error rate: ${errorRate.toFixed(2)}%`);
      console.log(`- Performance alerts: ${performanceSummary.alerts.length}`);
      console.log(
        `- System health: DB=${dbHealth.database.status}, Redis=${dbHealth.redis.status}`
      );
      console.log(`- Cache hit rate: ${cacheStats.hitRate.toFixed(2)}%`);

      // System should remain stable under full load
      expect(errorRate).toBeLessThan(5); // Less than 5% error rate
      expect(dbHealth.database.status).toBe('healthy');
      expect(dbHealth.redis.status).toBe('healthy');
      expect(operationsPerSecond).toBeGreaterThan(50); // At least 50 operations per second

      // Performance should not degrade significantly
      if (performanceSummary.current) {
        expect(performanceSummary.current.memory.percentage).toBeLessThan(90); // Memory usage under 90%
      }
    });
  });
});
