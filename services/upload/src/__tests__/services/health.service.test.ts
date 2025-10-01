import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { HealthService, healthService } from '../../services/health.service';

// Mock dependencies
vi.mock('../../lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock('../../lib/redis', () => ({
  redis: {
    ping: vi.fn(),
    llen: vi.fn(),
  },
}));

vi.mock('fs/promises', () => ({
  access: vi.fn(),
  writeFile: vi.fn(),
  unlink: vi.fn(),
}));

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    // Reset the singleton instance for testing
    (HealthService as any).instance = undefined;
    service = HealthService.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.cleanup();
    // Reset the singleton instance after each test
    (HealthService as any).instance = undefined;
  });

  describe('Health Status', () => {
    it('should return comprehensive health status', async () => {
      // Mock successful health checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      expect(healthStatus).toMatchObject({
        status: expect.stringMatching(/^(healthy|degraded|unhealthy)$/),
        service: 'upload-service',
        version: expect.any(String),
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        checks: expect.any(Array),
        system: expect.objectContaining({
          memory: expect.any(Object),
          cpu: expect.any(Object),
          loadAverage: expect.any(Array),
          platform: expect.any(String),
          nodeVersion: expect.any(String),
        }),
      });

      expect(healthStatus.checks.length).toBeGreaterThan(0);
    });

    it('should determine overall status correctly', async () => {
      // Mock all checks as healthy
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();
      expect(healthStatus.status).toBe('healthy');
    });

    it('should handle unhealthy database', async () => {
      // Mock database failure
      vi.mocked(prisma.$queryRaw).mockRejectedValue(
        new Error('Database connection failed')
      );
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      expect(healthStatus.status).toBe('unhealthy');

      const dbCheck = healthStatus.checks.find(
        check => check.name === 'database'
      );
      expect(dbCheck).toBeDefined();
      expect(dbCheck?.status).toBe('unhealthy');
      expect(dbCheck?.message).toContain('Database connection failed');
    });

    it('should handle unhealthy redis', async () => {
      // Mock redis failure
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockRejectedValue(
        new Error('Redis connection failed')
      );

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      expect(healthStatus.status).toBe('unhealthy');

      const redisCheck = healthStatus.checks.find(
        check => check.name === 'redis'
      );
      expect(redisCheck).toBeDefined();
      expect(redisCheck?.status).toBe('unhealthy');
      expect(redisCheck?.message).toContain('Redis connection failed');
    });

    it('should handle storage access issues', async () => {
      // Mock storage failure
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockRejectedValue(new Error('Permission denied'));

      const healthStatus = await service.getHealthStatus();

      expect(healthStatus.status).toBe('unhealthy');

      const storageCheck = healthStatus.checks.find(
        check => check.name === 'storage'
      );
      expect(storageCheck).toBeDefined();
      expect(storageCheck?.status).toBe('unhealthy');
      expect(storageCheck?.message).toContain('Permission denied');
    });
  });

  describe('Liveness Check', () => {
    it('should return liveness status', async () => {
      const livenessCheck = await service.getLivenessCheck();

      expect(livenessCheck).toMatchObject({
        status: 'alive',
        timestamp: expect.any(String),
      });
    });
  });

  describe('Readiness Check', () => {
    it('should return ready when critical services are healthy', async () => {
      // Mock successful critical checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const readinessCheck = await service.getReadinessCheck();

      expect(readinessCheck).toMatchObject({
        status: 'ready',
        ready: true,
        checks: expect.any(Array),
      });

      expect(
        readinessCheck.checks.every(check => check.status === 'healthy')
      ).toBe(true);
    });

    it('should return not ready when critical services are unhealthy', async () => {
      // Mock database failure
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error('Database down'));
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const readinessCheck = await service.getReadinessCheck();

      expect(readinessCheck).toMatchObject({
        status: 'not ready',
        ready: false,
        checks: expect.any(Array),
      });

      const dbCheck = readinessCheck.checks.find(
        check => check.name === 'database'
      );
      expect(dbCheck?.status).toBe('unhealthy');
    });
  });

  describe('Custom Health Checks', () => {
    it('should register and execute custom health checks', async () => {
      const customCheck = vi.fn().mockResolvedValue({
        name: 'custom',
        status: 'healthy',
        message: 'Custom check passed',
        lastChecked: new Date().toISOString(),
      });

      service.registerHealthCheck('custom', customCheck);

      // Mock other checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      expect(customCheck).toHaveBeenCalled();

      const customCheckResult = healthStatus.checks.find(
        check => check.name === 'custom'
      );
      expect(customCheckResult).toBeDefined();
      expect(customCheckResult?.status).toBe('healthy');
      expect(customCheckResult?.message).toBe('Custom check passed');
    });

    it('should handle custom health check failures', async () => {
      const customCheck = vi
        .fn()
        .mockRejectedValue(new Error('Custom check failed'));

      service.registerHealthCheck('failing_custom', customCheck);

      // Mock other checks as healthy
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      const customCheckResult = healthStatus.checks.find(
        check => check.name === 'failing_custom'
      );
      expect(customCheckResult).toBeDefined();
      expect(customCheckResult?.status).toBe('unhealthy');
      expect(customCheckResult?.message).toBe('Custom check failed');
    });
  });

  describe('Memory Health Check', () => {
    it('should report healthy memory usage', async () => {
      // Mock other checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      const memoryCheck = healthStatus.checks.find(
        check => check.name === 'memory'
      );
      expect(memoryCheck).toBeDefined();
      expect(memoryCheck?.details).toHaveProperty('heapUsed');
      expect(memoryCheck?.details).toHaveProperty('heapTotal');
      expect(memoryCheck?.details).toHaveProperty('rss');
      expect(memoryCheck?.details).toHaveProperty('systemMemoryUsage');
    });
  });

  describe('Processing Queue Health Check', () => {
    it('should check processing queue health', async () => {
      // Mock queue size
      vi.mocked(redis.llen).mockResolvedValue(50);

      // Mock other checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      const queueCheck = healthStatus.checks.find(
        check => check.name === 'processing_queue'
      );
      expect(queueCheck).toBeDefined();
      expect(queueCheck?.status).toBe('healthy');
      expect(queueCheck?.details).toHaveProperty('queueSize', 50);
    });

    it('should report degraded status for high queue size', async () => {
      // Mock high queue size
      vi.mocked(redis.llen).mockResolvedValue(750);

      // Mock other checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const healthStatus = await service.getHealthStatus();

      const queueCheck = healthStatus.checks.find(
        check => check.name === 'processing_queue'
      );
      expect(queueCheck).toBeDefined();
      expect(queueCheck?.status).toBe('degraded');
      expect(queueCheck?.message).toContain('high load');
    });
  });

  describe('Cached Health Status', () => {
    it('should return cached health status', async () => {
      // Mock successful checks
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ result: 1 }]);
      vi.mocked(redis.ping).mockResolvedValue('PONG');

      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      // Get health status to populate cache
      await service.getHealthStatus();

      const cachedStatus = service.getLastHealthStatus();
      expect(cachedStatus).toBeDefined();
      expect(cachedStatus?.service).toBe('upload-service');
    });

    it('should return null for no cached status', () => {
      const cachedStatus = service.getLastHealthStatus();
      expect(cachedStatus).toBeNull();
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = HealthService.getInstance();
      const instance2 = HealthService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBe(healthService);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources', () => {
      const stopSpy = vi.spyOn(service, 'stopPeriodicHealthChecks');

      service.cleanup();

      expect(stopSpy).toHaveBeenCalled();
    });
  });
});
