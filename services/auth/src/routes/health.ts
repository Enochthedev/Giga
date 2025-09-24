import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router: Router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get comprehensive health status
 *     description: Returns detailed health information including database, Redis, memory, and disk status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy or degraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded, unhealthy]
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                     version:
 *                       type: string
 *                     environment:
 *                       type: string
 *                     checks:
 *                       type: object
 *                       properties:
 *                         database:
 *                           $ref: '#/components/schemas/HealthCheck'
 *                         redis:
 *                           $ref: '#/components/schemas/HealthCheck'
 *                         memory:
 *                           $ref: '#/components/schemas/HealthCheck'
 *                         disk:
 *                           $ref: '#/components/schemas/HealthCheck'
 *                     metrics:
 *                       type: object
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', healthController.getHealth.bind(healthController));

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Simple liveness check for Kubernetes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: alive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is dead
 */
router.get('/live', healthController.getLiveness.bind(healthController));

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Readiness check for Kubernetes (checks dependencies)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ready
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', healthController.getReadiness.bind(healthController));

/**
 * @swagger
 * /health/metrics:
 *   get:
 *     summary: Get service metrics
 *     description: Returns performance, database, and Redis metrics
 *     tags: [Health]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, prometheus]
 *         description: Response format (default is json)
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     performance:
 *                       $ref: '#/components/schemas/PerformanceMetrics'
 *                     database:
 *                       $ref: '#/components/schemas/DatabaseMetrics'
 *                     redis:
 *                       $ref: '#/components/schemas/RedisMetrics'
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Prometheus format metrics
 */
router.get('/metrics', healthController.getMetrics.bind(healthController));

/**
 * @swagger
 * /health/system:
 *   get:
 *     summary: Get system information
 *     description: Returns system and runtime information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     version:
 *                       type: string
 *                     environment:
 *                       type: string
 *                     nodeVersion:
 *                       type: string
 *                     platform:
 *                       type: string
 *                     architecture:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     pid:
 *                       type: number
 *                     memory:
 *                       type: object
 *                     cpuUsage:
 *                       type: object
 */
router.get('/system', healthController.getSystemInfo.bind(healthController));

/**
 * @swagger
 * /health/metrics/performance:
 *   get:
 *     summary: Get performance metrics
 *     description: Returns detailed performance metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 */
router.get('/metrics/performance', healthController.getPerformanceMetrics.bind(healthController));

/**
 * @swagger
 * /health/metrics/database:
 *   get:
 *     summary: Get database metrics
 *     description: Returns detailed database metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database metrics retrieved successfully
 */
router.get('/metrics/database', healthController.getDatabaseMetrics.bind(healthController));

/**
 * @swagger
 * /health/metrics/redis:
 *   get:
 *     summary: Get Redis metrics
 *     description: Returns detailed Redis metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Redis metrics retrieved successfully
 */
router.get('/metrics/redis', healthController.getRedisMetrics.bind(healthController));

/**
 * @swagger
 * /health/performance:
 *   get:
 *     summary: Get comprehensive performance report
 *     description: Returns detailed performance analysis including bottlenecks and recommendations
 *     tags: [Health]
 *     parameters:
 *       - in: query
 *         name: timeWindow
 *         schema:
 *           type: integer
 *         description: Time window in milliseconds (default 3600000 = 1 hour)
 *     responses:
 *       200:
 *         description: Performance report retrieved successfully
 */
router.get('/performance', healthController.getPerformanceReport.bind(healthController));

/**
 * @swagger
 * /health/cache:
 *   get:
 *     summary: Cache management operations
 *     description: Perform cache operations like stats, preload, or cleanup
 *     tags: [Health]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [stats, preload, cleanup]
 *         description: Cache operation to perform
 *     responses:
 *       200:
 *         description: Cache operation completed successfully
 */
router.get('/cache', healthController.getCacheManagement.bind(healthController));

/**
 * @swagger
 * /health/connections:
 *   get:
 *     summary: Get connection pool status
 *     description: Returns database connection pool statistics and health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Connection pool status retrieved successfully
 */
router.get('/connections', healthController.getConnectionPoolStatus.bind(healthController));

export default router;