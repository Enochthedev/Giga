import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { healthRoutes } from '../../routes/health.routes';
import { healthService } from '../../services/health.service';
import { metricsService } from '../../services/metrics.service';

// Mock services
vi.mock('../../services/health.service', () => ({
  healthService: {
    getHealthStatus: vi.fn(),
    getLivenessCheck: vi.fn(),
    getReadinessCheck: vi.fn(),
    getLastHealthStatus: vi.fn(),
  },
}));

vi.mock('../../services/metrics.service', () => ({
  metricsService: {
    getMetrics: vi.fn(),
  },
}));

describe('Health Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/health', healthRoutes);
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const mockHealthStatus = {
        status: 'healthy',
        service: 'upload-service',
        version: '1.0.0',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        environment: 'test',
        checks: [
          {
            name: 'database',
            status: 'healthy',
            message: 'Database connection successful',
            responseTime: 50,
            lastChecked: '2023-01-01T00:00:00.000Z',
          },
        ],
        system: {
          memory: { rss: 1024, heapUsed: 512, heapTotal: 1024, external: 256 },
          cpu: { user: 1000, system: 500 },
          loadAverage: [0.1, 0.2, 0.3],
          platform: 'linux',
          nodeVersion: 'v18.0.0',
        },
      };

      vi.mocked(healthService.getHealthStatus).mockResolvedValue(
        mockHealthStatus
      );

      const response = await request(app).get('/health').expect(200);

      expect(response.body).toEqual(mockHealthStatus);
      expect(healthService.getHealthStatus).toHaveBeenCalled();
    });

    it('should return degraded status with 200', async () => {
      const mockHealthStatus = {
        status: 'degraded',
        service: 'upload-service',
        version: '1.0.0',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        environment: 'test',
        checks: [
          {
            name: 'memory',
            status: 'degraded',
            message: 'High memory usage',
            lastChecked: '2023-01-01T00:00:00.000Z',
          },
        ],
        system: {
          memory: { rss: 1024, heapUsed: 512, heapTotal: 1024, external: 256 },
          cpu: { user: 1000, system: 500 },
          loadAverage: [0.1, 0.2, 0.3],
          platform: 'linux',
          nodeVersion: 'v18.0.0',
        },
      };

      vi.mocked(healthService.getHealthStatus).mockResolvedValue(
        mockHealthStatus
      );

      const response = await request(app).get('/health').expect(200);

      expect(response.body.status).toBe('degraded');
    });

    it('should return unhealthy status with 503', async () => {
      const mockHealthStatus = {
        status: 'unhealthy',
        service: 'upload-service',
        version: '1.0.0',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        environment: 'test',
        checks: [
          {
            name: 'database',
            status: 'unhealthy',
            message: 'Database connection failed',
            lastChecked: '2023-01-01T00:00:00.000Z',
          },
        ],
        system: {
          memory: { rss: 1024, heapUsed: 512, heapTotal: 1024, external: 256 },
          cpu: { user: 1000, system: 500 },
          loadAverage: [0.1, 0.2, 0.3],
          platform: 'linux',
          nodeVersion: 'v18.0.0',
        },
      };

      vi.mocked(healthService.getHealthStatus).mockResolvedValue(
        mockHealthStatus
      );

      const response = await request(app).get('/health').expect(503);

      expect(response.body.status).toBe('unhealthy');
    });

    it('should handle health service errors', async () => {
      vi.mocked(healthService.getHealthStatus).mockRejectedValue(
        new Error('Health check failed')
      );

      const response = await request(app).get('/health').expect(503);

      expect(response.body).toMatchObject({
        status: 'unhealthy',
        service: 'upload-service',
        error: 'Health check failed',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const mockLivenessCheck = {
        status: 'alive',
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      vi.mocked(healthService.getLivenessCheck).mockResolvedValue(
        mockLivenessCheck
      );

      const response = await request(app).get('/health/live').expect(200);

      expect(response.body).toEqual(mockLivenessCheck);
      expect(healthService.getLivenessCheck).toHaveBeenCalled();
    });

    it('should handle liveness check errors', async () => {
      vi.mocked(healthService.getLivenessCheck).mockRejectedValue(
        new Error('Liveness check failed')
      );

      const response = await request(app).get('/health/live').expect(503);

      expect(response.body).toMatchObject({
        status: 'dead',
        error: 'Liveness check failed',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /health/ready', () => {
    it('should return ready status', async () => {
      const mockReadinessCheck = {
        status: 'ready',
        ready: true,
        checks: [
          {
            name: 'database',
            status: 'healthy',
            message: 'Database connection successful',
            lastChecked: '2023-01-01T00:00:00.000Z',
          },
        ],
      };

      vi.mocked(healthService.getReadinessCheck).mockResolvedValue(
        mockReadinessCheck
      );

      const response = await request(app).get('/health/ready').expect(200);

      expect(response.body).toEqual(mockReadinessCheck);
      expect(healthService.getReadinessCheck).toHaveBeenCalled();
    });

    it('should return not ready status with 503', async () => {
      const mockReadinessCheck = {
        status: 'not ready',
        ready: false,
        checks: [
          {
            name: 'database',
            status: 'unhealthy',
            message: 'Database connection failed',
            lastChecked: '2023-01-01T00:00:00.000Z',
          },
        ],
      };

      vi.mocked(healthService.getReadinessCheck).mockResolvedValue(
        mockReadinessCheck
      );

      const response = await request(app).get('/health/ready').expect(503);

      expect(response.body.ready).toBe(false);
    });

    it('should handle readiness check errors', async () => {
      vi.mocked(healthService.getReadinessCheck).mockRejectedValue(
        new Error('Readiness check failed')
      );

      const response = await request(app).get('/health/ready').expect(503);

      expect(response.body).toMatchObject({
        status: 'not ready',
        ready: false,
        error: 'Readiness check failed',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /health/metrics', () => {
    it('should return Prometheus metrics', async () => {
      const mockMetrics = `# HELP upload_requests_total Total number of upload requests
# TYPE upload_requests_total counter
upload_requests_total{method="POST",status="success",entity_type="user_profile",file_type="image"} 1`;

      vi.mocked(metricsService.getMetrics).mockResolvedValue(mockMetrics);

      const response = await request(app).get('/health/metrics').expect(200);

      expect(response.text).toBe(mockMetrics);
      expect(response.headers['content-type']).toContain('text/plain');
      expect(metricsService.getMetrics).toHaveBeenCalled();
    });

    it('should handle metrics service errors', async () => {
      vi.mocked(metricsService.getMetrics).mockRejectedValue(
        new Error('Metrics unavailable')
      );

      const response = await request(app).get('/health/metrics').expect(500);

      expect(response.body).toMatchObject({
        error: 'Failed to retrieve metrics',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /health/status', () => {
    it('should return cached health status', async () => {
      const mockCachedStatus = {
        status: 'healthy',
        service: 'upload-service',
        version: '1.0.0',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        environment: 'test',
        checks: [],
        system: {
          memory: { rss: 1024, heapUsed: 512, heapTotal: 1024, external: 256 },
          cpu: { user: 1000, system: 500 },
          loadAverage: [0.1, 0.2, 0.3],
          platform: 'linux',
          nodeVersion: 'v18.0.0',
        },
      };

      vi.mocked(healthService.getLastHealthStatus).mockReturnValue(
        mockCachedStatus
      );

      const response = await request(app).get('/health/status').expect(200);

      expect(response.body).toEqual(mockCachedStatus);
      expect(healthService.getLastHealthStatus).toHaveBeenCalled();
    });

    it('should return 404 when no cached status available', async () => {
      vi.mocked(healthService.getLastHealthStatus).mockReturnValue(null);

      const response = await request(app).get('/health/status').expect(404);

      expect(response.body).toMatchObject({
        error: 'No cached health status available',
        timestamp: expect.any(String),
      });
    });

    it('should return 503 for unhealthy cached status', async () => {
      const mockCachedStatus = {
        status: 'unhealthy',
        service: 'upload-service',
        version: '1.0.0',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        environment: 'test',
        checks: [],
        system: {
          memory: { rss: 1024, heapUsed: 512, heapTotal: 1024, external: 256 },
          cpu: { user: 1000, system: 500 },
          loadAverage: [0.1, 0.2, 0.3],
          platform: 'linux',
          nodeVersion: 'v18.0.0',
        },
      };

      vi.mocked(healthService.getLastHealthStatus).mockReturnValue(
        mockCachedStatus
      );

      const response = await request(app).get('/health/status').expect(503);

      expect(response.body.status).toBe('unhealthy');
    });
  });

  describe('GET /health/info', () => {
    it('should return service information', async () => {
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
});
