import { Router } from 'express';
import { apiKeyController } from '../controllers/api-key.controller';
import {
  auditMiddleware,
  sensitiveOperationAudit,
} from '../middleware/audit.middleware';
import {
  PERMISSIONS,
  ROLES,
  authenticate,
  requirePermission,
  requireRole,
} from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router: Router = Router();

// Apply audit middleware to all routes
router.use(auditMiddleware);

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/v1/api-keys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - serviceId
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 description: Human-readable name for the API key
 *               serviceId:
 *                 type: string
 *                 description: Identifier for the service using this key
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permissions granted to this key
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Optional expiration date for the key
 *     responses:
 *       201:
 *         description: API key created successfully
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
 *                     apiKey:
 *                       type: string
 *                       description: The generated API key (shown only once)
 *                     keyData:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         serviceId:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                         isActive:
 *                           type: boolean
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.MANAGE_COMPLIANCE),
  sensitiveOperationAudit('api_key_creation'),
  asyncHandler(apiKeyController.createAPIKey.bind(apiKeyController))
);

/**
 * @swagger
 * /api/v1/api-keys:
 *   get:
 *     summary: List API keys
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *         description: Filter by service ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of API keys
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
 *                     apiKeys:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           serviceId:
 *                             type: string
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: string
 *                           isActive:
 *                             type: boolean
 *                           expiresAt:
 *                             type: string
 *                             format: date-time
 *                           lastUsedAt:
 *                             type: string
 *                             format: date-time
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.DEVELOPER]),
  requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS),
  asyncHandler(apiKeyController.listAPIKeys.bind(apiKeyController))
);

/**
 * @swagger
 * /api/v1/api-keys/{keyId}:
 *   get:
 *     summary: Get API key details and usage statistics
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           default: 30
 *         description: Number of days for usage statistics
 *     responses:
 *       200:
 *         description: API key details and usage statistics
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
 *                     keyDetails:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         serviceId:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         lastUsedAt:
 *                           type: string
 *                           format: date-time
 *                     usage:
 *                       type: array
 *                       items:
 *                         type: object
 *                     period:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                         days:
 *                           type: integer
 *       404:
 *         description: API key not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/:keyId',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.DEVELOPER]),
  requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS),
  asyncHandler(apiKeyController.getAPIKey.bind(apiKeyController))
);

/**
 * @swagger
 * /api/v1/api-keys/{keyId}/rotate:
 *   post:
 *     summary: Rotate an API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key rotated successfully
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
 *                     apiKey:
 *                       type: string
 *                       description: The new API key
 *                 message:
 *                   type: string
 *       404:
 *         description: API key not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/:keyId/rotate',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.MANAGE_COMPLIANCE),
  sensitiveOperationAudit('api_key_rotation'),
  asyncHandler(apiKeyController.rotateAPIKey.bind(apiKeyController))
);

/**
 * @swagger
 * /api/v1/api-keys/{keyId}/revoke:
 *   post:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for revoking the API key
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: API key not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/:keyId/revoke',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.MANAGE_COMPLIANCE),
  sensitiveOperationAudit('api_key_revocation'),
  asyncHandler(apiKeyController.revokeAPIKey.bind(apiKeyController))
);

/**
 * @swagger
 * /api/v1/api-keys/{keyId}:
 *   patch:
 *     summary: Update API key permissions or expiration
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *         description: API key ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated permissions for the API key
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Updated expiration date (null to remove expiration)
 *     responses:
 *       200:
 *         description: API key updated successfully
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
 *                     keyDetails:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         serviceId:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                         isActive:
 *                           type: boolean
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *       404:
 *         description: API key not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.patch(
  '/:keyId',
  requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  requirePermission(PERMISSIONS.MANAGE_COMPLIANCE),
  sensitiveOperationAudit('api_key_update'),
  asyncHandler(apiKeyController.updateAPIKey.bind(apiKeyController))
);

export default router;
