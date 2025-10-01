import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { connectionPoolService } from '../../services/connection-pool.service';

describe('ConnectionPoolService Performance Tests', () => {
  beforeAll(async () => {
    await connectionPoolService.initializeDatabasePool();
    await connectionPoolService.initializeRedisPool();
  });

  afterAll(async () => {
    await connectionPoolService.close();
  });

  beforeEach(() => {
    // Reset any test state
  });

  describe('Database Connection Pool Performance', () => {
    it('should handle concurrent database connections efficiently', async () => {
      const startTime = Date.now();
      const concurrentQueries = 50;

      const promises = Array.from(
        { length: concurrentQueries },
        async (_, index) => {
          const result = await connectionPoolService.executeQuery(
            'SELECT $1 as test_value, NOW() as timestamp',
            [index]
          );
          return result[0];
        }
      );

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(concurrentQueries);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds

      // Verify all queries returned correct values
      results.forEach((result, index) => {
        expect(result.test_value).toBe(index);
        expect(result.timestamp).toBeDefined();
      });

      console.log(
        `Database pool handled ${concurrentQueries} concurrent queries in ${duration}ms`
      );
    });

    it('should maintain connection pool limits under load', async () => {
      const maxConnections = 10;
      const overloadQueries = 20; // More than max connections

      const startTime = Date.now();
      const promises = Array.from(
        { length: overloadQueries },
        async (_, index) => {
          // Add small delay to simulate real query processing
          await new Promise(resolve =>
            setTimeout(resolve, Math.random() * 100)
          );

          const result = await connectionPoolService.executeQuery(
            'SELECT $1 as query_id, pg_sleep(0.1)',
            [index]
          );
          return result[0];
        }
      );

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(overloadQueries);

      // Check pool stats
      const poolStats = connectionPoolService.getPoolStats();
      expect(poolStats.database.totalCount).toBeLessThanOrEqual(maxConnections);

      console.log(
        `Pool handled ${overloadQueries} queries with ${maxConnections} max connections in ${duration}ms`
      );
      console.log('Pool stats:', poolStats.database);
    });

    it('should recover from connection failures gracefully', async () => {
      const testQueries = 10;
      let successCount = 0;
      let errorCount = 0;

      const promises = Array.from({ length: testQueries }, async (_, index) => {
        try {
          // Mix of valid and invalid queries to test error handling
          const query =
            index % 3 === 0
              ? 'SELECT invalid_column FROM non_existent_table' // This will fail
              : 'SELECT $1 as test_value';

          const params = index % 3 === 0 ? [] : [index];

          await connectionPoolService.executeQuery(query, params);
          successCount++;
        } catch (error) {
          errorCount++;
          // Expected for invalid queries
        }
      });

      await Promise.all(promises);

      expect(successCount + errorCount).toBe(testQueries);
      expect(successCount).toBeGreaterThan(0);
      expect(errorCount).toBeGreaterThan(0);

      // Pool should still be healthy after errors
      const healthCheck = await connectionPoolService.healthCheck();
      expect(healthCheck.database.status).toBe('healthy');

      console.log(
        `Handled ${testQueries} queries: ${successCount} success, ${errorCount} errors`
      );
    });
  });

  describe('Redis Connection Pool Performance', () => {
    it('should handle concurrent Redis operations efficiently', async () => {
      const startTime = Date.now();
      const concurrentOps = 100;

      const promises = Array.from(
        { length: concurrentOps },
        async (_, index) => {
          const key = `test:performance:${index}`;
          const value = `value_${index}`;

          // Set value
          await connectionPoolService.executeRedisCommand('set', key, value);

          // Get value
          const result = await connectionPoolService.executeRedisCommand(
            'get',
            key
          );

          // Clean up
          await connectionPoolService.executeRedisCommand('del', key);

          return result;
        }
      );

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(concurrentOps);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds

      // Verify all operations returned correct values
      results.forEach((result, index) => {
        expect(result).toBe(`value_${index}`);
      });

      console.log(
        `Redis pool handled ${concurrentOps} concurrent operations in ${duration}ms`
      );
    });

    it('should distribute load across Redis connections', async () => {
      const operations = 50;
      const connectionUsage = new Map<string, number>();

      // Mock connection tracking (in real implementation, this would be internal)
      const originalGetConnection = connectionPoolService.getRedisConnection;
      connectionPoolService.getRedisConnection = function () {
        const connection = originalGetConnection.call(this);
        const connectionId = (connection as any).options?.host || 'default';
        connectionUsage.set(
          connectionId,
          (connectionUsage.get(connectionId) || 0) + 1
        );
        return connection;
      };

      const promises = Array.from({ length: operations }, async (_, index) => {
        return connectionPoolService.executeRedisCommand('ping');
      });

      await Promise.all(promises);

      // Restore original method
      connectionPoolService.getRedisConnection = originalGetConnection;

      // Check that connections were used (distribution may vary)
      expect(connectionUsage.size).toBeGreaterThan(0);

      console.log(
        'Redis connection usage distribution:',
        Object.fromEntries(connectionUsage)
      );
    });

    it('should handle Redis pipeline operations efficiently', async () => {
      const startTime = Date.now();
      const batchSize = 100;

      // Prepare batch operations
      const operations = Array.from({ length: batchSize }, (_, index) => ({
        key: `batch:test:${index}`,
        value: `batch_value_${index}`,
      }));

      // Execute batch SET operations
      const redis = connectionPoolService.getRedisConnection();
      const pipeline = redis.pipeline();

      operations.forEach(({ key, value }) => {
        pipeline.set(key, value);
      });

      await pipeline.exec();

      // Execute batch GET operations
      const getPipeline = redis.pipeline();
      operations.forEach(({ key }) => {
        getPipeline.get(key);
      });

      const results = await getPipeline.exec();

      // Clean up
      const delPipeline = redis.pipeline();
      operations.forEach(({ key }) => {
        delPipeline.del(key);
      });

      await delPipeline.exec();

      const duration = Date.now() - startTime;

      expect(results).toHaveLength(batchSize);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second

      // Verify results
      results?.forEach((result, index) => {
        expect(result[1]).toBe(`batch_value_${index}`);
      });

      console.log(
        `Redis pipeline handled ${batchSize} operations in ${duration}ms`
      );
    });
  });

  describe('Connection Pool Health and Recovery', () => {
    it('should provide accurate health check information', async () => {
      const healthCheck = await connectionPoolService.healthCheck();

      expect(healthCheck.database.status).toBe('healthy');
      expect(healthCheck.database.latency).toBeGreaterThan(0);
      expect(healthCheck.database.latency).toBeLessThan(1000); // Should be fast

      expect(healthCheck.redis.status).toBe('healthy');
      expect(healthCheck.redis.latency).toBeGreaterThan(0);
      expect(healthCheck.redis.latency).toBeLessThan(100); // Redis should be very fast

      console.log('Health check results:', healthCheck);
    });

    it('should provide accurate pool statistics', async () => {
      const stats = connectionPoolService.getPoolStats();

      expect(stats.database).toBeDefined();
      expect(stats.database.totalCount).toBeGreaterThanOrEqual(0);
      expect(stats.database.idleCount).toBeGreaterThanOrEqual(0);
      expect(stats.database.waitingCount).toBeGreaterThanOrEqual(0);

      expect(stats.redis).toBeDefined();
      expect(stats.redis.totalConnections).toBeGreaterThan(0);
      expect(stats.redis.activeConnections).toBeGreaterThanOrEqual(0);

      console.log('Pool statistics:', stats);
    });

    it('should handle connection pool stress test', async () => {
      const stressTestDuration = 5000; // 5 seconds
      const startTime = Date.now();
      let operationCount = 0;
      let errorCount = 0;

      const stressTest = async () => {
        while (Date.now() - startTime < stressTestDuration) {
          try {
            // Alternate between database and Redis operations
            if (operationCount % 2 === 0) {
              await connectionPoolService.executeQuery('SELECT 1');
            } else {
              await connectionPoolService.executeRedisCommand('ping');
            }
            operationCount++;
          } catch (error) {
            errorCount++;
          }

          // Small delay to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      };

      // Run multiple concurrent stress tests
      const concurrentTests = 5;
      const promises = Array.from({ length: concurrentTests }, () =>
        stressTest()
      );

      await Promise.all(promises);

      const totalDuration = Date.now() - startTime;
      const operationsPerSecond = (operationCount / totalDuration) * 1000;

      expect(operationCount).toBeGreaterThan(0);
      expect(errorCount / operationCount).toBeLessThan(0.05); // Less than 5% error rate

      // Pool should still be healthy after stress test
      const healthCheck = await connectionPoolService.healthCheck();
      expect(healthCheck.database.status).toBe('healthy');
      expect(healthCheck.redis.status).toBe('healthy');

      console.log(
        `Stress test completed: ${operationCount} operations in ${totalDuration}ms`
      );
      console.log(`Operations per second: ${operationsPerSecond.toFixed(2)}`);
      console.log(
        `Error rate: ${((errorCount / operationCount) * 100).toFixed(2)}%`
      );
    });
  });
});
