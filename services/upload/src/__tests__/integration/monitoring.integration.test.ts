import express from 'express';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { createApp, initializeServices, shutdownServices } from '../../app';
import { healthService } from '../../services/health.service';
import { metricsService } from '../../services/metrics.service';

// Mock external dependencies
vi.mock('../../lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ result: 1 }]),
  },
  connectDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../lib/redis', () => ({
  redis: {
    ping: vi.fn().mockResolvedValue('PONG'),
    llen: vi.fn().mockResolvedValue(0),
  },
  connectRedis: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../services/worker-manager.service', () => ({
  workerManager: {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('fs/promises', () => ({
  access: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
}));

describe('Monitoring Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = createApp();
    await initializeServices();
  });

  afterAll(async () => {
    await shutdownServices();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    metricsService.reset();
  });

  describe('Health Monitoring', () => {
    it('should provide comprehensive health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toMatchObject({
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

      // Verify essential health checks are present
      const checkNames = response.body.checks.map((check: any) => check.name);
      expect(checkNames).toContain('database');
      expect(checkNames).toContain('redis');
      expect(checkNames).toContain('storage');
      expect(checkNames).toContain('memory');
    });

    it('should provide liveness probe', async () => {
      const response = await request(app).get('/health/live').expect(200);

      expect(response.body).toMatchObject({
        status: 'alive',
        timestamp: expect.any(String),
      });
    });

    it('should provide readiness probe', async () => {
      const response = await request(app).get('/health/ready').expect(200);

      expect(response.body).toMatchObject({
        status: 'ready',
        ready: true,
        checks: expect.any(Array),
      });

      // Verify critical services are checked
      const checkNames = response.body.checks.map((check: any) => check.name);
      expect(checkNames).toContain('database');
      expect(checkNames).toContain('redis');
      expect(checkNames).toContain('storage');
    });

    it('should provide service information', async () => {
      const response = await request(app).get('/health/info').expect(200);

      expect(response.body).toMatchObject({
        service: 'upload-service',
        version: expect.any(String),
        environment: expect.any(String),
        nodeVersion: expect.any(String),
        platform: expect.any(String),
        architecture: expect.any(String),
        uptime: expect.any(Number),
        startTime: expect.any(String),
        timestamp: expect.any(String),
        pid: expect.any(Number),
        memory: expect.any(Object),
        cpuUsage: expect.any(Object),
      });
    });
  });

  describe('Metrics Collection', () => {
    it('should expose Prometheus metrics', async () => {
      // Make some requests to generate metrics
      await request(app).get('/health').expect(200);
      await request(app).get('/health/ready').expect(200);

      const response = await request(app).get('/health/metrics').expect(200);

      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.text).toContain('# HELP');
      expect(response.text).toContain('# TYPE');

      // Check for basic metrics
      expect(response.text).toContain('http_request_duration_seconds');
      expect(response.text).toContain('process_cpu_user_seconds_total');
      expect(response.text).toContain('process_resident_memory_bytes');
    });

    it('should collect HTTP request metrics', async () => {
      // Make requests to generate metrics
      await request(app).get('/health').expect(200);
      await request(app).get('/health/ready').expect(200);
      await request(app).get('/nonexistent').expect(404);

      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Verify HTTP metrics are present
      expect(metricsResponse.text).toContain('http_request_duration_seconds');
      expect(metricsResponse.text).toContain('method="GET"');
      expect(metricsResponse.text).toContain('status_code="200"');
      expect(metricsResponse.text).toContain('status_code="404"');
    });

    it('should track security events', async () => {
      // Simulate authentication failure
      await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Check if security metrics are recorded
      expect(metricsResponse.text).toContain('security_events_total');
    });

    it('should collect system metrics', async () => {
      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Verify system metrics are present
      expect(metricsResponse.text).toContain('process_resident_memory_bytes');
      expect(metricsResponse.text).toContain('process_heap_bytes');
      expect(metricsResponse.text).toContain('nodejs_version_info');
    });
  });

  describe('Error Monitoring', () => {
    it('should track application errors', async () => {
      // Trigger an error by accessing non-existent route
      await request(app).get('/api/v1/nonexistent').expect(404);

      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Verify error metrics are collected
      expect(metricsResponse.text).toContain('http_request_duration_seconds');
      expect(metricsResponse.text).toContain('status_code="404"');
    });

    it('should handle service errors gracefully', async () => {
      // Mock a service failure
      const originalGetHealthStatus = healthService.getHealthStatus;
      vi.spyOn(healthService, 'getHealthStatus').mockRejectedValueOnce(
        new Error('Service unavailable')
      );

      const response = await request(app).get('/health').expect(503);

      expect(response.body).toMatchObject({
        status: 'unhealthy',
        service: 'upload-service',
        error: 'Service unavailable',
        timestamp: expect.any(String),
      });

      // Restore original method
      healthService.getHealthStatus = originalGetHealthStatus;
    });
  });

  describe('Performance Monitoring', () => {
    it('should track request duration', async () => {
      const start = Date.now();

      await request(app).get('/health').expect(200);

      const duration = Date.now() - start;

      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Verify duration metrics are present
      expect(metricsResponse.text).toContain('http_request_duration_seconds');
      expect(metricsResponse.text).toContain('route="/health"');
    });

    it('should track memory usage', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.system.memory).toMatchObject({
        rss: expect.any(Number),
        heapUsed: expect.any(Number),
        heapTotal: expect.any(Number),
        external: expect.any(Number),
      });
    });
  });

  describe('Observability Integration', () => {
    it('should provide correlated logs and metrics', async () => {
      const requestId = 'test-request-123';

      await request(app)
        .get('/health')
        .set('X-Request-ID', requestId)
        .expect(200);

      // Verify request was processed (this would be verified through logs in a real scenario)
      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      expect(metricsResponse.text).toContain('http_request_duration_seconds');
    });

    it('should maintain service health over multiple requests', async () => {
      // Make multiple requests to test stability
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app).get('/health').expect(200)
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.body.status).toMatch(/^(healthy|degraded)$/);
      });

      // Service should still be healthy
      const finalHealthCheck = await request(app).get('/health').expect(200);

      expect(finalHealthCheck.body.status).toMatch(/^(healthy|degraded)$/);
    });
  });

  describe('Alerting Scenarios', () => {
    it('should detect degraded performance', async () => {
      // This would typically involve mocking slow operations
      const response = await request(app).get('/health').expect(200);

      // Check if memory usage is being monitored
      const memoryCheck = response.body.checks.find(
        (check: any) => check.name === 'memory'
      );
      expect(memoryCheck).toBeDefined();
      expect(memoryCheck.details).toHaveProperty('systemMemoryUsage');
    });

    it('should handle external service failures', async () => {
      // Mock Redis failure
      const redis = await import('../../lib/redis');
      vi.spyOn(redis.redis, 'ping').mockRejectedValueOnce(
        new Error('Redis connection failed')
      );

      const response = await request(app).get('/health').expect(503);

      expect(response.body.status).toBe('unhealthy');

      const redisCheck = response.body.checks.find(
        (check: any) => check.name === 'redis'
      );
      expect(redisCheck).toBeDefined();
      expect(redisCheck.status).toBe('unhealthy');
    });
  });

  describe('Monitoring Configuration', () => {
    it('should respect monitoring configuration', async () => {
      const metricsResponse = await request(app)
        .get('/health/metrics')
        .expect(200);

      // Verify metrics are enabled and working
      expect(metricsResponse.text.length).toBeGreaterThan(0);
      expect(metricsResponse.headers['content-type']).toContain('text/plain');
    });

    it('should provide cached health status', async () => {
      // First, get health status to populate cache
      await request(app).get('/health').expect(200);

      // Then get cached status
      const cachedResponse = await request(app)
        .get('/health/status')
        .expect(200);

      expect(cachedResponse.body).toMatchObject({
        status: expect.stringMatching(/^(healthy|degraded|unhealthy)$/),
        service: 'upload-service',
        timestamp: expect.any(String),
      });
    });
  });
});
