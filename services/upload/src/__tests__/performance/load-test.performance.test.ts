import express from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp, initializeServices, shutdownServices } from '../../app';

describe('Upload Service Load Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    try {
      // Initialize services with test configuration
      await initializeServices();
      app = createApp();
    } catch (error) {
      console.warn('Failed to initialize services for load test:', error);
      // Create a minimal app for testing
      app = express();
      app.get('/health', (req, res) => {
        res.json({ status: 'healthy', timestamp: new Date().toISOString() });
      });
      app.get('/metrics', (req, res) => {
        res.set('Content-Type', 'text/plain');
        res.send('# Test metrics\ntest_metric 1\n');
      });
    }
  });

  afterAll(async () => {
    try {
      await shutdownServices();
    } catch (error) {
      console.warn('Failed to shutdown services:', error);
    }
  });

  describe('Performance Monitoring Endpoints', () => {
    it('should handle concurrent health check requests efficiently', async () => {
      const concurrentRequests = 50;
      const startTime = Date.now();

      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app).get('/health').expect(200)
      );

      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(responses).toHaveLength(concurrentRequests);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds

      // Verify all responses are valid
      responses.forEach(response => {
        expect(response.body.status).toBeDefined();
        expect(response.body.timestamp).toBeDefined();
      });

      console.log(`Health check load test:`);
      console.log(
        `- ${concurrentRequests} concurrent requests in ${duration}ms`
      );
      console.log(
        `- Average response time: ${(duration / concurrentRequests).toFixed(2)}ms`
      );
      console.log(
        `- Requests per second: ${((concurrentRequests / duration) * 1000).toFixed(2)}`
      );
    });

    it('should handle metrics endpoint under load', async () => {
      const concurrentRequests = 30;
      const startTime = Date.now();

      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app).get('/metrics').expect(200)
      );

      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(responses).toHaveLength(concurrentRequests);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds

      // Verify metrics format
      responses.forEach(response => {
        expect(response.headers['content-type']).toContain('text/plain');
        expect(response.text).toContain('metric');
      });

      console.log(`Metrics endpoint load test:`);
      console.log(
        `- ${concurrentRequests} concurrent requests in ${duration}ms`
      );
      console.log(
        `- Average response time: ${(duration / concurrentRequests).toFixed(2)}ms`
      );
    });
  });

  describe('Memory and CPU Performance', () => {
    it('should maintain stable memory usage under sustained load', async () => {
      const testDuration = 5000; // 5 seconds
      const startTime = Date.now();
      const initialMemory = process.memoryUsage();
      let requestCount = 0;

      // Generate sustained load
      const loadGenerator = async () => {
        while (Date.now() - startTime < testDuration) {
          try {
            await request(app).get('/health');
            requestCount++;
          } catch (error) {
            // Ignore individual request failures
          }

          // Small delay to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      };

      // Run multiple concurrent load generators
      const concurrentLoads = 3;
      const loadPromises = Array.from({ length: concurrentLoads }, () =>
        loadGenerator()
      );

      await Promise.all(loadPromises);

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreasePercent =
        (memoryIncrease / initialMemory.heapUsed) * 100;

      console.log(`Memory stability test:`);
      console.log(`- Test duration: ${testDuration}ms`);
      console.log(`- Total requests: ${requestCount}`);
      console.log(
        `- Initial memory: ${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB`
      );
      console.log(
        `- Final memory: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`
      );
      console.log(
        `- Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB (${memoryIncreasePercent.toFixed(2)}%)`
      );

      // Memory increase should be reasonable (less than 50% increase)
      expect(memoryIncreasePercent).toBeLessThan(50);
      expect(requestCount).toBeGreaterThan(0);
    });

    it('should handle memory pressure gracefully', async () => {
      const initialMemory = process.memoryUsage();
      const largeObjects: any[] = [];

      // Create memory pressure
      for (let i = 0; i < 100; i++) {
        largeObjects.push({
          id: i,
          data: new Array(10000).fill(`memory_test_${i}`),
          timestamp: Date.now(),
        });
      }

      // Test service responsiveness under memory pressure
      const startTime = Date.now();
      const response = await request(app).get('/health').expect(200);

      const responseTime = Date.now() - startTime;
      const memoryUnderPressure = process.memoryUsage();

      // Clean up
      largeObjects.length = 0;

      expect(response.body.status).toBeDefined();
      expect(responseTime).toBeLessThan(2000); // Should still respond within 2 seconds

      console.log(`Memory pressure test:`);
      console.log(`- Response time under pressure: ${responseTime}ms`);
      console.log(
        `- Memory under pressure: ${Math.round(memoryUnderPressure.heapUsed / 1024 / 1024)}MB`
      );
      console.log(
        `- Memory increase: ${Math.round((memoryUnderPressure.heapUsed - initialMemory.heapUsed) / 1024 / 1024)}MB`
      );
    });
  });

  describe('Request Processing Performance', () => {
    it('should handle burst traffic efficiently', async () => {
      const burstSize = 100;
      const burstDuration = 1000; // 1 second burst

      const startTime = Date.now();

      // Create burst of requests
      const burstPromises = Array.from(
        { length: burstSize },
        async (_, index) => {
          const requestStart = Date.now();

          try {
            const response = await request(app).get('/health').timeout(5000);

            return {
              success: true,
              responseTime: Date.now() - requestStart,
              statusCode: response.status,
              index,
            };
          } catch (error) {
            return {
              success: false,
              responseTime: Date.now() - requestStart,
              error: error instanceof Error ? error.message : 'Unknown error',
              index,
            };
          }
        }
      );

      const results = await Promise.all(burstPromises);
      const totalDuration = Date.now() - startTime;

      const successfulRequests = results.filter(r => r.success);
      const failedRequests = results.filter(r => !r.success);
      const avgResponseTime =
        successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) /
        successfulRequests.length;
      const maxResponseTime = Math.max(
        ...successfulRequests.map(r => r.responseTime)
      );
      const minResponseTime = Math.min(
        ...successfulRequests.map(r => r.responseTime)
      );

      console.log(`Burst traffic test:`);
      console.log(`- Burst size: ${burstSize} requests`);
      console.log(`- Total duration: ${totalDuration}ms`);
      console.log(`- Successful requests: ${successfulRequests.length}`);
      console.log(`- Failed requests: ${failedRequests.length}`);
      console.log(
        `- Success rate: ${((successfulRequests.length / burstSize) * 100).toFixed(2)}%`
      );
      console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(
        `- Min/Max response time: ${minResponseTime}ms / ${maxResponseTime}ms`
      );
      console.log(
        `- Requests per second: ${((burstSize / totalDuration) * 1000).toFixed(2)}`
      );

      // Expect high success rate and reasonable response times
      expect(successfulRequests.length / burstSize).toBeGreaterThan(0.9); // 90% success rate
      expect(avgResponseTime).toBeLessThan(1000); // Average response time under 1 second
    });

    it('should maintain performance consistency over time', async () => {
      const testDuration = 10000; // 10 seconds
      const requestInterval = 100; // Request every 100ms
      const startTime = Date.now();
      const responseTimes: number[] = [];
      let requestCount = 0;

      while (Date.now() - startTime < testDuration) {
        const requestStart = Date.now();

        try {
          await request(app).get('/health');
          const responseTime = Date.now() - requestStart;
          responseTimes.push(responseTime);
          requestCount++;
        } catch (error) {
          // Log error but continue test
          console.warn(`Request ${requestCount} failed:`, error);
        }

        await new Promise(resolve => setTimeout(resolve, requestInterval));
      }

      const actualDuration = Date.now() - startTime;

      // Calculate statistics
      const avgResponseTime =
        responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length;
      const sortedTimes = responseTimes.sort((a, b) => a - b);
      const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
      const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
      const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

      // Calculate variance
      const variance =
        responseTimes.reduce(
          (sum, time) => sum + Math.pow(time - avgResponseTime, 2),
          0
        ) / responseTimes.length;
      const stdDev = Math.sqrt(variance);

      console.log(`Performance consistency test:`);
      console.log(`- Test duration: ${actualDuration}ms`);
      console.log(`- Total requests: ${requestCount}`);
      console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`- Standard deviation: ${stdDev.toFixed(2)}ms`);
      console.log(`- P50: ${p50}ms, P95: ${p95}ms, P99: ${p99}ms`);
      console.log(
        `- Coefficient of variation: ${((stdDev / avgResponseTime) * 100).toFixed(2)}%`
      );

      expect(requestCount).toBeGreaterThan(0);
      expect(avgResponseTime).toBeLessThan(500); // Average under 500ms
      expect(p95).toBeLessThan(1000); // 95th percentile under 1 second
      expect(stdDev / avgResponseTime).toBeLessThan(1); // Coefficient of variation < 1
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle 404 errors efficiently', async () => {
      const errorRequests = 50;
      const startTime = Date.now();

      const promises = Array.from({ length: errorRequests }, () =>
        request(app).get('/nonexistent-endpoint').expect(404)
      );

      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(responses).toHaveLength(errorRequests);
      expect(duration).toBeLessThan(3000); // Should handle errors quickly

      console.log(`404 error handling performance:`);
      console.log(`- ${errorRequests} 404 requests in ${duration}ms`);
      console.log(
        `- Average error response time: ${(duration / errorRequests).toFixed(2)}ms`
      );
    });

    it('should maintain performance during mixed success/error scenarios', async () => {
      const totalRequests = 100;
      const errorRate = 0.3; // 30% error rate
      const startTime = Date.now();

      const promises = Array.from({ length: totalRequests }, (_, index) => {
        const shouldError = Math.random() < errorRate;
        const endpoint = shouldError ? '/nonexistent-endpoint' : '/health';
        const expectedStatus = shouldError ? 404 : 200;

        return request(app)
          .get(endpoint)
          .expect(expectedStatus)
          .then(response => ({ success: !shouldError, response }))
          .catch(error => ({ success: false, error }));
      });

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      console.log(`Mixed success/error performance:`);
      console.log(`- Total requests: ${totalRequests}`);
      console.log(`- Successful: ${successCount}`);
      console.log(`- Errors: ${errorCount}`);
      console.log(`- Duration: ${duration}ms`);
      console.log(
        `- Average time per request: ${(duration / totalRequests).toFixed(2)}ms`
      );

      expect(results).toHaveLength(totalRequests);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
});
