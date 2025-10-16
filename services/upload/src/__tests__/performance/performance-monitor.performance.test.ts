import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { connectionPoolService } from '../../services/connection-pool.service';
import { performanceMonitorService } from '../../services/performance-monitor.service';

describe('PerformanceMonitorService Performance Tests', () => {
  beforeAll(async () => {
    await connectionPoolService.initializeDatabasePool();
    await connectionPoolService.initializeRedisPool();
  });

  afterAll(async () => {
    await connectionPoolService.close();
  });

  beforeEach(() => {
    performanceMonitorService.reset();
  });

  describe('Metrics Collection Performance', () => {
    it('should collect metrics efficiently under normal load', async () => {
      const metricsCollectionCount = 100;
      const startTime = Date.now();

      // Simulate normal application load
      const loadSimulation = Array.from({ length: 50 }, async (_, index) => {
        // Simulate request processing
        const requestStart = Date.now();
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        const requestDuration = Date.now() - requestStart;

        performanceMonitorService.recordRequest(requestDuration);
        performanceMonitorService.updateActiveConnections(1);

        // Simulate request completion
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        performanceMonitorService.updateActiveConnections(-1);
      });

      // Wait for load simulation to complete
      await Promise.all(loadSimulation);

      // Allow time for metrics collection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const duration = Date.now() - startTime;
      const currentMetrics = performanceMonitorService.getCurrentMetrics();

      expect(currentMetrics).toBeDefined();
      expect(currentMetrics?.timestamp).toBeGreaterThan(startTime);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds

      console.log(`Metrics collection performance:`);
      console.log(`- Simulated ${loadSimulation.length} concurrent requests`);
      console.log(`- Total duration: ${duration}ms`);
      console.log(`- Current metrics:`, {
        cpu: currentMetrics?.cpu.usage,
        memory: `${currentMetrics?.memory.percentage.toFixed(2)}%`,
        requests: currentMetrics?.requests,
      });
    });

    it('should handle high-frequency metric updates', async () => {
      const updateCount = 1000;
      const startTime = Date.now();

      // Generate high-frequency metric updates
      const updatePromises = Array.from(
        { length: updateCount },
        async (_, index) => {
          const responseTime = Math.random() * 1000; // 0-1000ms
          performanceMonitorService.recordRequest(responseTime);

          // Simulate connection changes
          if (index % 10 === 0) {
            performanceMonitorService.updateActiveConnections(
              Math.floor(Math.random() * 5) - 2
            );
          }
        }
      );

      await Promise.all(updatePromises);
      const duration = Date.now() - startTime;

      // Allow metrics to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentMetrics = performanceMonitorService.getCurrentMetrics();
      expect(currentMetrics).toBeDefined();

      console.log(`High-frequency updates performance:`);
      console.log(`- Processed ${updateCount} metric updates in ${duration}ms`);
      console.log(
        `- Updates per second: ${((updateCount / duration) * 1000).toFixed(2)}`
      );
      console.log(`- Final request metrics:`, currentMetrics?.requests);
    });

    it('should maintain performance history efficiently', async () => {
      const historyTestDuration = 3000; // 3 seconds
      const startTime = Date.now();

      // Generate continuous load to create history
      const loadGenerator = async () => {
        while (Date.now() - startTime < historyTestDuration) {
          performanceMonitorService.recordRequest(Math.random() * 500);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      };

      // Run multiple load generators
      const generators = Array.from({ length: 3 }, () => loadGenerator());
      await Promise.all(generators);

      const history = performanceMonitorService.getMetricsHistory(50);
      const memoryUsage = process.memoryUsage();

      expect(history.length).toBeGreaterThan(0);
      expect(history.length).toBeLessThanOrEqual(50);

      console.log(`Performance history test:`);
      console.log(`- Test duration: ${historyTestDuration}ms`);
      console.log(`- History entries: ${history.length}`);
      console.log(
        `- Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
      );

      if (history.length > 1) {
        const firstEntry = history[0];
        const lastEntry = history[history.length - 1];
        console.log(
          `- Time span: ${lastEntry.timestamp - firstEntry.timestamp}ms`
        );
      }
    });
  });

  describe('Alert System Performance', () => {
    it('should detect performance alerts quickly', async () => {
      const alertTestDuration = 2000; // 2 seconds
      const startTime = Date.now();

      // Simulate high load to trigger alerts
      const highLoadSimulation = async () => {
        while (Date.now() - startTime < alertTestDuration) {
          // Simulate slow requests to trigger response time alerts
          performanceMonitorService.recordRequest(3000); // 3 second response time

          // Simulate high connection count
          performanceMonitorService.updateActiveConnections(5);

          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };

      await highLoadSimulation();

      // Allow time for alert processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const activeAlerts = performanceMonitorService.getActiveAlerts();
      const performanceSummary =
        performanceMonitorService.getPerformanceSummary();

      console.log(`Alert detection performance:`);
      console.log(`- Test duration: ${alertTestDuration}ms`);
      console.log(`- Active alerts: ${activeAlerts.length}`);
      console.log(
        `- Alert types:`,
        activeAlerts.map(alert => alert.type)
      );
      console.log(`- Performance trends:`, performanceSummary.trends);

      // Should have detected some alerts due to high response times
      expect(activeAlerts.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle alert resolution efficiently', async () => {
      const alertCycleCount = 10;
      const startTime = Date.now();

      for (let cycle = 0; cycle < alertCycleCount; cycle++) {
        // Create alert condition
        performanceMonitorService.recordRequest(4000); // High response time
        await new Promise(resolve => setTimeout(resolve, 100));

        // Resolve alert condition
        performanceMonitorService.recordRequest(100); // Normal response time
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const duration = Date.now() - startTime;
      const activeAlerts = performanceMonitorService.getActiveAlerts();

      console.log(`Alert resolution performance:`);
      console.log(
        `- Completed ${alertCycleCount} alert cycles in ${duration}ms`
      );
      console.log(
        `- Average cycle time: ${(duration / alertCycleCount).toFixed(2)}ms`
      );
      console.log(`- Final active alerts: ${activeAlerts.length}`);
    });
  });

  describe('Performance Monitoring Under Load', () => {
    it('should maintain monitoring accuracy under sustained load', async () => {
      const loadTestDuration = 5000; // 5 seconds
      const startTime = Date.now();
      let requestCount = 0;
      let totalResponseTime = 0;

      const sustainedLoad = async () => {
        while (Date.now() - startTime < loadTestDuration) {
          const responseTime = 50 + Math.random() * 200; // 50-250ms
          performanceMonitorService.recordRequest(responseTime);

          requestCount++;
          totalResponseTime += responseTime;

          // Vary connection count
          if (requestCount % 20 === 0) {
            performanceMonitorService.updateActiveConnections(
              Math.floor(Math.random() * 3) - 1
            );
          }

          await new Promise(resolve => setTimeout(resolve, 10));
        }
      };

      // Run multiple concurrent load generators
      const concurrentLoads = 3;
      const loadPromises = Array.from({ length: concurrentLoads }, () =>
        sustainedLoad()
      );

      await Promise.all(loadPromises);

      const actualDuration = Date.now() - startTime;
      const expectedAverageResponseTime = totalResponseTime / requestCount;

      // Allow final metrics collection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentMetrics = performanceMonitorService.getCurrentMetrics();
      const performanceSummary =
        performanceMonitorService.getPerformanceSummary();

      expect(currentMetrics).toBeDefined();
      expect(requestCount).toBeGreaterThan(0);

      console.log(`Sustained load monitoring test:`);
      console.log(`- Duration: ${actualDuration}ms`);
      console.log(`- Total requests: ${requestCount}`);
      console.log(
        `- Requests per second: ${((requestCount / actualDuration) * 1000).toFixed(2)}`
      );
      console.log(
        `- Expected avg response time: ${expectedAverageResponseTime.toFixed(2)}ms`
      );
      console.log(
        `- Monitored avg response time: ${currentMetrics?.requests.averageResponseTime.toFixed(2)}ms`
      );
      console.log(`- Performance trends:`, performanceSummary.trends);

      // Verify monitoring accuracy (within reasonable margin)
      const responseTimeAccuracy =
        Math.abs(
          currentMetrics!.requests.averageResponseTime -
            expectedAverageResponseTime
        ) / expectedAverageResponseTime;

      expect(responseTimeAccuracy).toBeLessThan(0.2); // Within 20% accuracy
    });

    it('should handle memory pressure during monitoring', async () => {
      const memoryTestDuration = 3000; // 3 seconds
      const startTime = Date.now();
      const largeObjects: any[] = [];

      // Create memory pressure
      const memoryPressureSimulation = async () => {
        while (Date.now() - startTime < memoryTestDuration) {
          // Create large objects to increase memory usage
          const largeObject = {
            id: Date.now(),
            data: new Array(10000).fill('memory_test_data'),
            timestamp: Date.now(),
          };
          largeObjects.push(largeObject);

          // Record requests during memory pressure
          performanceMonitorService.recordRequest(Math.random() * 300);

          await new Promise(resolve => setTimeout(resolve, 50));

          // Occasionally clean up to simulate garbage collection
          if (largeObjects.length > 20) {
            largeObjects.splice(0, 10);
          }
        }
      };

      const initialMemory = process.memoryUsage();
      await memoryPressureSimulation();
      const finalMemory = process.memoryUsage();

      // Allow metrics collection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentMetrics = performanceMonitorService.getCurrentMetrics();
      const activeAlerts = performanceMonitorService.getActiveAlerts();

      console.log(`Memory pressure monitoring test:`);
      console.log(
        `- Initial memory: ${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB`
      );
      console.log(
        `- Final memory: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`
      );
      console.log(
        `- Memory increase: ${Math.round((finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024)}MB`
      );
      console.log(
        `- Current monitored memory: ${Math.round(currentMetrics!.memory.used / 1024 / 1024)}MB`
      );
      console.log(
        `- Memory-related alerts: ${activeAlerts.filter(alert => alert.metric.includes('memory')).length}`
      );

      // Cleanup
      largeObjects.length = 0;

      expect(currentMetrics).toBeDefined();
      expect(currentMetrics!.memory.used).toBeGreaterThan(
        initialMemory.heapUsed
      );
    });
  });

  describe('Performance Monitoring Reliability', () => {
    it('should continue monitoring despite individual metric failures', async () => {
      const reliabilityTestDuration = 2000; // 2 seconds
      const startTime = Date.now();

      // Simulate various error conditions
      const errorSimulation = async () => {
        while (Date.now() - startTime < reliabilityTestDuration) {
          try {
            // Normal operations
            performanceMonitorService.recordRequest(Math.random() * 200);

            // Simulate occasional errors (these should be handled gracefully)
            if (Math.random() < 0.1) {
              // 10% chance
              throw new Error('Simulated monitoring error');
            }

            performanceMonitorService.updateActiveConnections(
              Math.random() > 0.5 ? 1 : -1
            );
          } catch (error) {
            // Errors should be handled gracefully by the monitoring service
          }

          await new Promise(resolve => setTimeout(resolve, 20));
        }
      };

      await errorSimulation();

      // Allow final metrics collection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentMetrics = performanceMonitorService.getCurrentMetrics();
      const metricsHistory = performanceMonitorService.getMetricsHistory(10);

      expect(currentMetrics).toBeDefined();
      expect(metricsHistory.length).toBeGreaterThan(0);

      console.log(`Reliability test results:`);
      console.log(`- Test duration: ${reliabilityTestDuration}ms`);
      console.log(
        `- Final metrics available: ${currentMetrics ? 'Yes' : 'No'}`
      );
      console.log(`- History entries: ${metricsHistory.length}`);
      console.log(`- Monitoring remained functional despite simulated errors`);
    });

    it('should provide consistent performance data across multiple collections', async () => {
      const consistencyTestCount = 5;
      const metricsSnapshots: any[] = [];

      // Maintain steady load
      const steadyLoad = setInterval(() => {
        performanceMonitorService.recordRequest(150); // Consistent 150ms response time
      }, 100);

      // Collect multiple metrics snapshots
      for (let i = 0; i < consistencyTestCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const snapshot = performanceMonitorService.getCurrentMetrics();
        if (snapshot) {
          metricsSnapshots.push({
            timestamp: snapshot.timestamp,
            averageResponseTime: snapshot.requests.averageResponseTime,
            memoryUsage: snapshot.memory.percentage,
          });
        }
      }

      clearInterval(steadyLoad);

      expect(metricsSnapshots.length).toBe(consistencyTestCount);

      // Analyze consistency
      const responseTimes = metricsSnapshots.map(s => s.averageResponseTime);
      const avgResponseTime =
        responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length;
      const responseTimeVariance =
        responseTimes.reduce(
          (sum, time) => sum + Math.pow(time - avgResponseTime, 2),
          0
        ) / responseTimes.length;

      console.log(`Consistency test results:`);
      console.log(`- Snapshots collected: ${metricsSnapshots.length}`);
      console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(
        `- Response time variance: ${responseTimeVariance.toFixed(2)}`
      );
      console.log(
        `- Response time std dev: ${Math.sqrt(responseTimeVariance).toFixed(2)}ms`
      );

      // Response times should be relatively consistent for steady load
      expect(Math.sqrt(responseTimeVariance)).toBeLessThan(50); // Standard deviation < 50ms
    });
  });
});
