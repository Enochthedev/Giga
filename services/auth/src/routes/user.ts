import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { apiRateLimit } from '../middleware/rateLimit.middleware';
import { requireRole } from '../middleware/role.middleware';
import { SessionManagementMiddleware } from '../middleware/sessionManagement.middleware';

const router: Router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     EnhancedUserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
 *         maritalStatus:
 *           type: string
 *           enum: [SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED, DOMESTIC_PARTNERSHIP, PREFER_NOT_TO_SAY]
 *         bodyWeight:
 *           type: number
 *           description: Weight in kg
 *         height:
 *           type: number
 *           description: Height in cm
 *         ageGroup:
 *           type: string
 *           enum: [UNDER_18, AGE_18_24, AGE_25_34, AGE_35_44, AGE_45_54, AGE_55_64, AGE_65_PLUS, PREFER_NOT_TO_SAY]
 *         areasOfInterest:
 *           type: array
 *           items:
 *             type: string
 *         profilePicture:
 *           type: string
 *           description: URL to profile picture
 *         customerProfile:
 *           type: object
 *           properties:
 *             occupation:
 *               type: string
 *             company:
 *               type: string
 *             emergencyContact:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 relationship:
 *                   type: string
 *             addresses:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         label:
 *           type: string
 *           description: Home, Work, Other
 *         name:
 *           type: string
 *           description: Recipient name
 *         buildingNumber:
 *           type: string
 *         street:
 *           type: string
 *         address2:
 *           type: string
 *           description: Apartment, suite, etc.
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zipCode:
 *           type: string
 *         country:
 *           type: string
 *         phone:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 */

/**
 * @swagger
 * /api/v1/users/{id}/profile:
 *   get:
 *     summary: Get enhanced user profile (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Enhanced user profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/EnhancedUserProfile'
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/:id/profile',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.getEnhancedUserProfile.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/profile:
 *   put:
 *     summary: Update user profile (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
 *               maritalStatus:
 *                 type: string
 *                 enum: [SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED, DOMESTIC_PARTNERSHIP, PREFER_NOT_TO_SAY]
 *               bodyWeight:
 *                 type: number
 *                 description: Weight in kg
 *               height:
 *                 type: number
 *                 description: Height in cm
 *               ageGroup:
 *                 type: string
 *                 enum: [UNDER_18, AGE_18_24, AGE_25_34, AGE_35_44, AGE_45_54, AGE_55_64, AGE_65_PLUS, PREFER_NOT_TO_SAY]
 *               areasOfInterest:
 *                 type: array
 *                 items:
 *                   type: string
 *               profilePicture:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.put(
  '/:id/profile',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.updateUserProfile.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/customer-profile:
 *   put:
 *     summary: Update customer profile (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               occupation:
 *                 type: string
 *               company:
 *                 type: string
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   relationship:
 *                     type: string
 *               medicalInfo:
 *                 type: object
 *                 properties:
 *                   allergies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   medications:
 *                     type: array
 *                     items:
 *                       type: string
 *                   conditions:
 *                     type: array
 *                     items:
 *                       type: string
 *                   bloodType:
 *                     type: string
 *                   doctorContact:
 *                     type: string
 *               socialMedia:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   twitter:
 *                     type: string
 *                   instagram:
 *                     type: string
 *                   linkedin:
 *                     type: string
 *     responses:
 *       200:
 *         description: Customer profile updated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.put(
  '/:id/customer-profile',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.updateCustomerProfile.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/addresses:
 *   get:
 *     summary: Get user addresses (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User addresses retrieved successfully
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
 *                     addresses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.get(
  '/:id/addresses',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.getUserAddresses.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/addresses:
 *   post:
 *     summary: Add user address (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - street
 *               - city
 *               - country
 *             properties:
 *               label:
 *                 type: string
 *                 description: Home, Work, Other
 *               name:
 *                 type: string
 *               buildingNumber:
 *                 type: string
 *               street:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Address added successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  '/:id/addresses',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.addUserAddress.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/addresses/{addressId}:
 *   put:
 *     summary: Update user address (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               name:
 *                 type: string
 *               buildingNumber:
 *                 type: string
 *               street:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       403:
 *         description: Insufficient permissions
 */
router.put(
  '/:id/addresses/:addressId',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.updateUserAddress.bind(userController)
);

/**
 * @swagger
 * /api/v1/users/{id}/addresses/{addressId}:
 *   delete:
 *     summary: Delete user address (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       403:
 *         description: Insufficient permissions
 */
router.delete(
  '/:id/addresses/:addressId',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  requireRole(['ADMIN']),
  userController.deleteUserAddress.bind(userController)
);

export { router as userRoutes };
