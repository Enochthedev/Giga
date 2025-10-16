import { Router } from 'express';
import { TokenAnalyticsController } from '../controllers/token-analytics.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { extractDeviceInfo } from '../middleware/device.middleware';

const router: Router = Router();
const tokenAnalyticsController = new TokenAnalyticsController();

// Apply device info extraction to all routes
router.use(extractDeviceInfo);

/**
 * @swagger
 * /api/auth/token-analytics/user:
 *   get:
 *     summary: Get token usage analytics for authenticated user
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to include in analytics
 *     responses:
 *       200:
 *         description: Token analytics retrieved successfully
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
 *                     analytics:
 *                       $ref: '#/components/schemas/TokenAnalytics'
 *                     userId:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/user',
  authenticateToken,
  tokenAnalyticsController.getUserTokenAnalytics.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/security:
 *   get:
 *     summary: Get security metrics for authenticated user
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to include in metrics
 *     responses:
 *       200:
 *         description: Security metrics retrieved successfully
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
 *                     metrics:
 *                       $ref: '#/components/schemas/SecurityMetrics'
 *                     userId:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/security',
  authenticateToken,
  tokenAnalyticsController.getUserSecurityMetrics.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/devices:
 *   get:
 *     summary: Get active device sessions for authenticated user
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active devices retrieved successfully
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
 *                     devices:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DeviceSession'
 *                     totalActiveDevices:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/devices',
  authenticateToken,
  tokenAnalyticsController.getActiveDevices.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/devices/{deviceId}/revoke:
 *   post:
 *     summary: Revoke tokens for a specific device
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to revoke
 *     responses:
 *       200:
 *         description: Device tokens revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deviceId:
 *                       type: string
 *                     revokedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/devices/:deviceId/revoke',
  authenticateToken,
  tokenAnalyticsController.revokeDevice.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/devices/revoke-others:
 *   post:
 *     summary: Revoke all tokens except current device
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Other device tokens revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     revokedDevices:
 *                       type: integer
 *                     revokedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/devices/revoke-others',
  authenticateToken,
  tokenAnalyticsController.revokeAllOtherDevices.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/rate-limits:
 *   get:
 *     summary: Get token refresh rate limits status
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rate limit information retrieved successfully
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
 *                     rateLimitInfo:
 *                       $ref: '#/components/schemas/RateLimitInfo'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/rate-limits',
  authenticateToken,
  tokenAnalyticsController.getRefreshRateLimits.bind(tokenAnalyticsController)
);

/**
 * @swagger
 * /api/auth/token-analytics/system:
 *   get:
 *     summary: Get system-wide token analytics (Admin only)
 *     tags: [Token Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to include in analytics
 *     responses:
 *       200:
 *         description: System analytics retrieved successfully
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
 *                     tokenAnalytics:
 *                       $ref: '#/components/schemas/TokenAnalytics'
 *                     securityMetrics:
 *                       $ref: '#/components/schemas/SecurityMetrics'
 *                     timeRange:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/system',
  authenticateToken,
  requireAdmin,
  tokenAnalyticsController.getSystemTokenAnalytics.bind(
    tokenAnalyticsController
  )
);

export default router;
