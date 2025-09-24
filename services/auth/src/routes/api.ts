import { Router } from 'express';
import { APIController } from '../controllers/api.controller';
import { APICacheMiddleware } from '../middleware/apiOptimization.middleware';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { apiRateLimit } from '../middleware/rateLimit.middleware';

const router: Router = Router();
const apiController = new APIController();

/**
 * @swagger
 * /api/v1/api/version:
 *   get:
 *     summary: Get API version information
 *     description: Returns current API version, supported versions, and deprecation notices
 *     tags: [API Management]
 *     responses:
 *       200:
 *         description: Version information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/APIVersionInfo'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *         headers:
 *           X-API-Version:
 *             $ref: '#/components/headers/X-API-Version'
 *           X-Cache-Status:
 *             $ref: '#/components/headers/X-Cache-Status'
 */
router.get(
  '/version',
  apiRateLimit,
  APICacheMiddleware.cache(3600), // Cache for 1 hour
  apiController.getVersionInfo.bind(apiController)
);

/**
 * @swagger
 * /api/v1/api/analytics:
 *   get:
 *     summary: Get API usage analytics (admin only)
 *     description: Returns comprehensive API usage statistics and analytics
 *     tags: [API Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *         example: "2024-01-31"
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *         description: Data granularity
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/APIUsageAnalytics'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/analytics',
  apiRateLimit,
  authenticateToken,
  requireRole(['ADMIN']),
  APICacheMiddleware.cache(300), // Cache for 5 minutes
  apiController.getUsageAnalytics.bind(apiController)
);

/**
 * @swagger
 * /api/v1/api/status:
 *   get:
 *     summary: Get API health and status
 *     description: Returns comprehensive API health information including performance metrics
 *     tags: [API Management]
 *     responses:
 *       200:
 *         description: API status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded, unhealthy]
 *                       example: healthy
 *                     healthScore:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 1
 *                       example: 0.95
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     uptime:
 *                       type: number
 *                       description: Uptime in seconds
 *                     performance:
 *                       $ref: '#/components/schemas/PerformanceMetrics'
 *                     database:
 *                       $ref: '#/components/schemas/DatabaseMetrics'
 *                     redis:
 *                       $ref: '#/components/schemas/RedisMetrics'
 *                     features:
 *                       type: object
 *                       additionalProperties:
 *                         type: boolean
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: API is unhealthy
 */
router.get(
  '/status',
  apiRateLimit,
  APICacheMiddleware.cache(60), // Cache for 1 minute
  apiController.getAPIStatus.bind(apiController)
);

/**
 * @swagger
 * /api/v1/api/rate-limit:
 *   get:
 *     summary: Get current rate limit status
 *     description: Returns current rate limit usage and remaining quota
 *     tags: [API Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rate limit status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: number
 *                           example: 25
 *                         limit:
 *                           type: number
 *                           example: 100
 *                         remaining:
 *                           type: number
 *                           example: 75
 *                         resetTime:
 *                           type: string
 *                           format: date-time
 *                     user:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         current:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         remaining:
 *                           type: number
 *                         resetTime:
 *                           type: string
 *                           format: date-time
 *                     global:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: number
 *                         dailyLimit:
 *                           type: number
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *         headers:
 *           X-RateLimit-Limit:
 *             description: Request limit per time window
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: Requests remaining in current window
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets
 *             schema:
 *               type: string
 *               format: date-time
 */
router.get(
  '/rate-limit',
  apiRateLimit,
  authenticateToken,
  apiController.getRateLimitStatus.bind(apiController)
);

/**
 * @swagger
 * /api/v1/api/docs/{endpoint}:
 *   get:
 *     summary: Get endpoint-specific documentation
 *     description: Returns detailed documentation for a specific API endpoint
 *     tags: [API Management]
 *     parameters:
 *       - in: path
 *         name: endpoint
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path (URL encoded)
 *         example: "auth%2Flogin"
 *     responses:
 *       200:
 *         description: Endpoint documentation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     endpoint:
 *                       type: string
 *                       example: "/auth/login"
 *                     method:
 *                       type: string
 *                       example: "POST"
 *                     description:
 *                       type: string
 *                     parameters:
 *                       type: array
 *                       items:
 *                         type: object
 *                     responses:
 *                       type: object
 *                     examples:
 *                       type: object
 *                     rateLimit:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: number
 *                         window:
 *                           type: string
 *                     authentication:
 *                       type: string
 *                     version:
 *                       type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/docs/:endpoint',
  apiRateLimit,
  APICacheMiddleware.cache(3600), // Cache for 1 hour
  apiController.getEndpointDocs.bind(apiController)
);

/**
 * @swagger
 * /api/v1/api/usage-report:
 *   get:
 *     summary: Generate API usage report (admin only)
 *     description: Generates a comprehensive usage report in JSON or CSV format
 *     tags: [API Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Report start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Report end date (YYYY-MM-DD)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Report format
 *       - in: query
 *         name: includeDetails
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Include detailed breakdown
 *     responses:
 *       200:
 *         description: Usage report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalRequests:
 *                           type: number
 *                         errorRate:
 *                           type: number
 *                         rateLimitHits:
 *                           type: number
 *                         averageResponseTime:
 *                           type: number
 *                     period:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date
 *                         end:
 *                           type: string
 *                           format: date
 *                         duration:
 *                           type: string
 *                     generatedAt:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *           text/csv:
 *             schema:
 *               type: string
 *               description: CSV format report
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/usage-report',
  apiRateLimit,
  authenticateToken,
  requireRole(['ADMIN']),
  apiController.getUsageReport.bind(apiController)
);

export { router as apiRoutes };
