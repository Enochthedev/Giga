import { Request, Response, Router } from 'express';
import { createLogger } from '../lib/logger';
import { healthService } from '../services/health.service';
import { metricsService } from '../services/metrics.service';

const router: Router = Router();
const logger = createLogger('HealthRoutes');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Comprehensive health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, degraded, unhealthy]
 *                 service:
 *                   type: string
 *                 version:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 environment:
 *                   type: string
 *                 checks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 system:
 *                   type: object
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const healthStatus = await healthService.getHealthStatus();

    const statusCode =
      healthStatus.status === 'healthy'
        ? 200
        : healthStatus.status === 'degraded'
          ? 200
          : 503;

    res.status(statusCode).json(healthStatus);

    logger.info('Health check completed', {
      status: healthStatus.status,
      checksCount: healthStatus.checks.length,
      unhealthyChecks: healthStatus.checks.filter(c => c.status === 'unhealthy')
        .length,
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'upload-service',
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', async (_req: Request, res: Response) => {
  try {
    const livenessCheck = await healthService.getLivenessCheck();
    res.json(livenessCheck);
  } catch (error) {
    logger.error('Liveness check failed', error);
    res.status(503).json({
      status: 'dead',
      error: error instanceof Error ? error.message : 'Liveness check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    const readinessCheck = await healthService.getReadinessCheck();
    const statusCode = readinessCheck.ready ? 200 : 503;

    res.status(statusCode).json(readinessCheck);

    logger.info('Readiness check completed', {
      ready: readinessCheck.ready,
      checksCount: readinessCheck.checks.length,
    });
  } catch (error) {
    logger.error('Readiness check failed', error);
    res.status(503).json({
      status: 'not ready',
      ready: false,
      error: error instanceof Error ? error.message : 'Readiness check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health/metrics:
 *   get:
 *     summary: Prometheus metrics endpoint
 *     tags: [Health]
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Metrics in Prometheus format
 */
router.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);

    logger.debug('Metrics endpoint accessed');
  } catch (error) {
    logger.error('Failed to get metrics', error);
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health/status:
 *   get:
 *     summary: Get cached health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Last cached health status
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    const lastStatus = healthService.getLastHealthStatus();

    if (!lastStatus) {
      res.status(404).json({
        error: 'No cached health status available',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const statusCode =
      lastStatus.status === 'healthy'
        ? 200
        : lastStatus.status === 'degraded'
          ? 200
          : 503;

    res.status(statusCode).json(lastStatus);
  } catch (error) {
    logger.error('Failed to get cached health status', error);
    res.status(500).json({
      error: 'Failed to retrieve cached health status',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /health/info:
 *   get:
 *     summary: Get service information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service information
 */
router.get('/info', (_req: Request, res: Response) => {
  try {
    const info = {
      service: 'upload-service',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: process.uptime(),
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };

    res.json(info);
  } catch (error) {
    logger.error('Failed to get service info', error);
    res.status(500).json({
      error: 'Failed to retrieve service information',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRoutes };
