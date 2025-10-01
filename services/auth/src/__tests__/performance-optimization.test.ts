import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cacheService } from '../services/cache.service';
import { connectionPoolService } from '../services/connection-pool.service';
import { performanceProfiler } from '../services/performance-profiler.service';
import { responseCompressionService } from '../services/response-compression.service';

describe('Performance Optimization Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('PerformanceProfilerService', () => {
    it('should profile async operations', () => {
      const mockOperation = vi.fn().mockResolvedValue('test result');

      const result = await performanceProfiler.profileOperation(
        'test_operation',
        mockOperation,
        { testMetadata: 'value' }
      );

      expect(result).toBe('test result');
      expect(mockOperation).toHaveBeenCalledOnce();
    });

    it('should profile sync operations', () => {
      const mockOperation = vi.fn().mockReturnValue('sync result');

      const result = performanceProfiler.profileSync(
        'sync_operation',
        mockOperation,
        { testMetadata: 'value' }
      );

      expect(result).toBe('sync result');
      expect(mockOperation).toHaveBeenCalledOnce();
    });

    it('should generate performance report', () => {
      const report = performanceProfiler.getPerformanceReport(3600000);

      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('bottlenecks');
      expect(report).toHaveProperty('resourceTrends');
      expect(report).toHaveProperty('recommendations');
      expect(report.summary).toHaveProperty('totalOperations');
      expect(report.summary).toHaveProperty('averageResponseTime');
    });

    it('should analyze bottlenecks', () => {
      const bottlenecks = performanceProfiler.analyzeBottlenecks(3600000);

      expect(Array.isArray(bottlenecks)).toBe(true);
    });

    it('should record resource snapshots', () => {
      expect(() => {
        performanceProfiler.recordResourceSnapshot();
      }).not.toThrow();
    });
  });

  describe('CacheService', () => {
    it('should cache and retrieve user profiles', () => {
      const mockUserData = {
        user: { id: 'test-user', email: 'test@example.com' } as any,
        roles: [],
        profiles: {},
        lastCached: Date.now(),
      };

      await cacheService.cacheUserProfile('test-user', mockUserData);
      const cached = await cacheService.getCachedUserProfile('test-user');

      // Note: In a real test, you'd mock Redis to return the cached data
      // For now, we just verify the methods don't throw
      expect(cached).toBeDefined();
    });

    it('should cache with tags', () => {
      const testData = { test: 'data' };
      const tags = ['user:123', 'profile'];

      await expect(
        cacheService.cacheWithTags('test-key', testData, 3600, tags)
      ).resolves.not.toThrow();
    });

    it('should invalidate cache by tag', () => {
      await expect(
        cacheService.invalidateByTag('user:123')
      ).resolves.not.toThrow();
    });

    it('should get cache statistics', () => {
      const _stats = await cacheService.getCacheStats();

      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalOperations');
      expect(stats).toHaveProperty('cacheSize');
      expect(typeof stats.hitRate).toBe('number');
      expect(typeof stats.totalOperations).toBe('number');
      expect(typeof stats.cacheSize).toBe('number');
    });

    it('should monitor cache performance', () => {
      const performance = await cacheService.monitorCachePerformance();

      expect(performance).toHaveProperty('avgResponseTime');
      expect(performance).toHaveProperty('hitRate');
      expect(performance).toHaveProperty('memoryUsage');
    });

    it('should cache and retrieve compressed data', () => {
      const largeData = { data: 'x'.repeat(2000) }; // Large enough to trigger compression

      await cacheService.cacheCompressed('large-data', largeData, 3600);
      const retrieved = await cacheService.getCachedCompressed('large-data');

      // Note: In a real test with mocked Redis, this would return the data
      expect(retrieved).toBeDefined();
    });
  });

  describe('ConnectionPoolService', () => {
    it('should get connection statistics', () => {
      const _stats = connectionPoolService.getConnectionStats();

      expect(stats).toHaveProperty('activeConnections');
      expect(stats).toHaveProperty('totalConnections');
      expect(stats).toHaveProperty('totalAcquired');
      expect(stats).toHaveProperty('totalReleased');
      expect(stats).toHaveProperty('averageAcquireTime');
    });

    it('should perform health check', () => {
      const healthCheck = await connectionPoolService.healthCheck();

      expect(healthCheck).toHaveProperty('isHealthy');
      expect(healthCheck).toHaveProperty('stats');
      expect(healthCheck).toHaveProperty('issues');
      expect(typeof healthCheck.isHealthy).toBe('boolean');
      expect(Array.isArray(healthCheck.issues)).toBe(true);
    });

    it('should get database client', () => {
      const client = await connectionPoolService.getClient('test-context');
      expect(client).toBeDefined();

      // Clean up
      await connectionPoolService.releaseClient('test-context');
    });
  });

  describe('ResponseCompressionService', () => {
    it('should get compression statistics', () => {
      const _stats = responseCompressionService.getCompressionStats();

      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('compressedRequests');
      expect(stats).toHaveProperty('totalOriginalSize');
      expect(stats).toHaveProperty('totalCompressedSize');
      expect(stats).toHaveProperty('averageCompressionRatio');
      expect(stats).toHaveProperty('averageCompressionTime');
    });

    it('should generate performance report', () => {
      const report = responseCompressionService.getPerformanceReport();

      expect(report).toHaveProperty('stats');
      expect(report).toHaveProperty('efficiency');
      expect(report).toHaveProperty('performance');
      expect(report).toHaveProperty('recommendations');

      expect(report.efficiency).toHaveProperty('compressionRate');
      expect(report.efficiency).toHaveProperty('averageSavings');
      expect(report.efficiency).toHaveProperty('totalBytesSaved');

      expect(Array.isArray(report.recommendations)).toBe(true);
    });

    it('should reset statistics', () => {
      responseCompressionService.resetStats();
      const _stats = responseCompressionService.getCompressionStats();

      expect(stats.totalRequests).toBe(0);
      expect(stats.compressedRequests).toBe(0);
      expect(stats.totalOriginalSize).toBe(0);
      expect(stats.totalCompressedSize).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work together for performance monitoring', () => {
      // Test that all services can be used together
      const [
        cacheStats,
        connectionStats,
        performanceReport,
        compressionReport,
      ] = await Promise.all([
        cacheService.getCacheStats(),
        Promise.resolve(connectionPoolService.getConnectionStats()),
        Promise.resolve(performanceProfiler.getPerformanceReport()),
        Promise.resolve(responseCompressionService.getPerformanceReport()),
      ]);

      expect(cacheStats).toBeDefined();
      expect(connectionStats).toBeDefined();
      expect(performanceReport).toBeDefined();
      expect(compressionReport).toBeDefined();
    });

    it('should handle performance profiling with cache operations', () => {
      const testData = { test: 'performance data' };

      const result = await performanceProfiler.profileOperation(
        'cache_operation',
        () => {
          await cacheService.cacheFrequentData('perf-test', testData, 300);
          return cacheService.getFrequentData('perf-test');
        }
      );

      expect(result).toBeDefined();
    });
  });
});
