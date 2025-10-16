import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import {
  assignUserRoleSchema,
  bulkUpdateUsersSchema,
  removeUserRoleSchema,
  validate,
} from '../middleware/validation.middleware';

const router: Router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getUserById.bind(userController)
);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List users with pagination (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CUSTOMER, VENDOR, DRIVER, HOST, ADVERTISER]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.listUsers.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Update user status (admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.updateUserStatus.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/bulk-update:
 *   post:
 *     summary: Bulk update users (admin only)
 *     tags: [User Management, Bulk Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userIds, action]
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 100
 *               action:
 *                 type: string
 *                 enum: [activate, deactivate, verify_email, verify_phone, update_fields]
 *               data:
 *                 type: object
 *                 description: Required for update_fields action
 *     responses:
 *       200:
 *         description: Bulk update completed successfully
 */
router.post(
  '/bulk-update',
  authenticateToken,
  requireRole(['ADMIN']),
  validate(bulkUpdateUsersSchema),
  userController.bulkUpdateUsers.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/roles:
 *   post:
 *     summary: Assign role to user (admin only)
 *     tags: [User Management, Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, VENDOR, DRIVER, HOST, ADVERTISER, ADMIN]
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
router.post(
  '/:id/roles',
  authenticateToken,
  requireRole(['ADMIN']),
  validate(assignUserRoleSchema),
  userController.assignUserRole.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/roles:
 *   delete:
 *     summary: Remove role from user (admin only)
 *     tags: [User Management, Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [VENDOR, DRIVER, HOST, ADVERTISER, ADMIN]
 *     responses:
 *       200:
 *         description: Role removed successfully
 */
router.delete(
  '/:id/roles',
  authenticateToken,
  requireRole(['ADMIN']),
  validate(removeUserRoleSchema),
  userController.removeUserRole.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/export:
 *   get:
 *     summary: Export users data (admin only)
 *     tags: [User Management, Data Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *           description: JSON string of filters
 *     responses:
 *       200:
 *         description: Users data exported successfully
 */
router.get(
  '/export',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.exportUsers.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/activity:
 *   get:
 *     summary: Get user activity log (admin only)
 *     tags: [User Management, Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           description: Filter by action type
 *     responses:
 *       200:
 *         description: User activity retrieved successfully
 */
router.get(
  '/:id/activity',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getUserActivity.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/audit-logs:
 *   get:
 *     summary: Get system audit logs (admin only)
 *     tags: [User Management, Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           description: Filter by action type
 *       - in: query
 *         name: adminUserId
 *         schema:
 *           type: string
 *           description: Filter by admin user ID
 *       - in: query
 *         name: targetUserId
 *         schema:
 *           type: string
 *           description: Filter by target user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter to this date
 *       - in: query
 *         name: ipAddress
 *         schema:
 *           type: string
 *           description: Filter by IP address
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
router.get(
  '/audit-logs',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getAuditLogs.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/audit-report:
 *   get:
 *     summary: Generate audit report (admin only)
 *     tags: [User Management, Audit, Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Report start date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Report end date
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *           description: Report format
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [action, admin, date]
 *           default: action
 *           description: Group report data by
 *     responses:
 *       200:
 *         description: Audit report generated successfully
 */
router.get(
  '/audit-report',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getAuditReport.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/stats:
 *   get:
 *     summary: Get user statistics (admin only)
 *     tags: [User Management, Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter to this date
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [role, date, status]
 *           default: role
 *           description: Group statistics by
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get(
  '/stats',
  authenticateToken,
  requireRole(['ADMIN']),
  userController.getUserStats.bind(userController)
);

export { router as userRoutes };
