import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.middleware';
import { ResilienceMiddleware } from '../middleware/resilience.middleware';

const router: Router = Router();
const resilienceMiddleware = ResilienceMiddleware.getInstance();

/**
 * @swagger
 * /resilience/health:
 *   get:
 *     summary: Get comprehensive health status
 *     tags: [Resilience]
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
 *                   enum: [UP, DOWN]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 system:
 *                   type: object
 *                 externalServices:
 *                   type: object
 *                 features:
 *                   type: object
 *                 circuitBreakers:
 *                   type: object
 *       503:
 *         description: Service is unhealthy
 */
router.get('/health', (req, res) => resilienceMiddleware.healthCheck(req, res));

/**
 * @swagger
 * /resilience/ready:
 *   get:
 *     summary: Kubernetes readiness probe
 *     tags: [Resilience]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', (req, res) =>
  resilienceMiddleware.readinessCheck(req, res)
);

/**
 * @swagger
 * /resilience/live:
 *   get:
 *     summary: Kubernetes liveness probe
 *     tags: [Resilience]
 *     responses:
 *       200:
 *         description: Service is alive
 *       503:
 *         description: Service is not alive
 */
router.get('/live', (req, res) => resilienceMiddleware.livenessCheck(req, res));

/**
 * @swagger
 * /resilience/metrics:
 *   get:
 *     summary: Prometheus metrics endpoint
 *     tags: [Resilience]
 *     responses:
 *       200:
 *         description: Metrics in Prometheus format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/metrics', (req, res) =>
  resilienceMiddleware.metricsEndpoint(req, res)
);

/**
 * @swagger
 * /resilience/circuit-breakers:
 *   get:
 *     summary: Get circuit breaker status (Admin only)
 *     tags: [Resilience]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Circuit breaker status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     healthy:
 *                       type: number
 *                     unhealthy:
 *                       type: number
 *                 breakers:
 *                   type: object
 *                 healthyBreakers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 unhealthyBreakers:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/circuit-breakers', requireAdmin, (req, res) =>
  resilienceMiddleware.circuitBreakerStatus(req, res)
);

/**
 * @swagger
 * /resilience/features:
 *   get:
 *     summary: Get feature status (Admin only)
 *     tags: [Resilience]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feature status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 systemHealth:
 *                   type: object
 *                   properties:
 *                     overallHealth:
 *                       type: string
 *                       enum: [healthy, degraded, critical]
 *                     totalFeatures:
 *                       type: number
 *                     healthyFeatures:
 *                       type: number
 *                     degradedFeatures:
 *                       type: number
 *                     criticalFeaturesFailed:
 *                       type: number
 *                 features:
 *                   type: object
 *                 degradedFeatures:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/features', requireAdmin, (req, res) =>
  resilienceMiddleware.featureStatus(req, res)
);

/**
 * @swagger
 * /resilience/config:
 *   get:
 *     summary: Get resilience configuration (Admin only)
 *     tags: [Resilience]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resilience configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enableCircuitBreakers:
 *                   type: boolean
 *                 enableGracefulDegradation:
 *                   type: boolean
 *                 enableServiceMesh:
 *                   type: boolean
 *                 enableHealthChecks:
 *                   type: boolean
 *                 healthCheckInterval:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/config', requireAdmin, (req, res) => {
  const config = resilienceMiddleware.getConfig();
  res.json({
    ...config,
    timestamp: new Date().toISOString(),
  });
});

export { router as resilienceRoutes };
