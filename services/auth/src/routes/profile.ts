import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { apiRateLimit } from '../middleware/rateLimit.middleware';
import {
  addAddressSchema,
  updateAddressSchema,
  updateAdvertiserProfileSchema,
  updateCustomerProfileSchema,
  updateDriverProfileSchema,
  updateHostProfileSchema,
  updateProfileRatingSchema,
  updateProfileVerificationSchema,
  updateVendorProfileSchema,
  validate,
} from '../middleware/validation.middleware';
import { UploadService } from '../services/upload.service';

const router: Router = Router();
const profileController = new ProfileController();
const uploadService = UploadService.getInstance();

/**
 * @swagger
 * /api/v1/profiles/basic:
 *   put:
 *     summary: Update basic user profile information
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *               phone:
 *                 type: string
 *                 description: Phone number in international format
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
 *               avatar:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 */
router.put(
  '/basic',
  apiRateLimit,
  authenticateToken,
  // validate(updateBasicProfileSchema), // TODO: Fix validation schema imports
  profileController.updateBasicProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/avatar:
 *   post:
 *     summary: Upload profile avatar
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (JPEG, PNG, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *                     url:
 *                       type: string
 *                       description: Avatar URL
 *       400:
 *         description: Invalid file or file too large
 */
router.post(
  '/avatar',
  apiRateLimit,
  authenticateToken,
  uploadService.getMulterConfig().single('avatar'),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate file
      const validation = uploadService.validateImageFile(req.file);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
          code: 'INVALID_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      // Get current user to delete old avatar
      const currentUser = await req._prisma.user.findUnique({
        where: { id: req.user.sub },
        select: { avatar: true },
      });

      // Process and save new avatar
      const uploadResult = await uploadService.processAvatar(
        req.file,
        req.user.sub
      );

      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          error: uploadResult.error || 'Failed to process avatar',
          code: 'UPLOAD_ERROR',
          timestamp: new Date().toISOString(),
        });
      }

      // Update user avatar in database
      const updatedUser = await req._prisma.user.update({
        where: { id: req.user.sub },
        data: { avatar: uploadResult.url },
        select: { avatar: true },
      });

      // Delete old avatar file if it exists
      if (currentUser?.avatar) {
        await uploadService.deleteAvatar(currentUser.avatar);
      }

      res.json({
        success: true,
        data: {
          url: updatedUser.avatar,
        },
        message: 'Avatar uploaded successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload avatar',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/profiles/avatar:
 *   delete:
 *     summary: Delete profile avatar
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 */
router.delete('/avatar', apiRateLimit, authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      });
    }

    // Get current user avatar
    const currentUser = await req._prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { avatar: true },
    });

    // Remove avatar from database
    await req._prisma.user.update({
      where: { id: req.user.sub },
      data: { avatar: null },
    });

    // Delete avatar file if it exists
    if (currentUser?.avatar) {
      await uploadService.deleteAvatar(currentUser.avatar);
    }

    res.json({
      success: true,
      message: 'Avatar deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Avatar delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete avatar',
      code: 'DELETE_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/v1/profiles/complete:
 *   get:
 *     summary: Get complete user profile with all role-specific profiles
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete profile retrieved successfully
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
 *                       $ref: '#/components/schemas/User'
 *                     profiles:
 *                       type: object
 *                       properties:
 *                         customer:
 *                           $ref: '#/components/schemas/CustomerProfile'
 *                         vendor:
 *                           $ref: '#/components/schemas/VendorProfile'
 *                         driver:
 *                           $ref: '#/components/schemas/DriverProfile'
 *                         host:
 *                           $ref: '#/components/schemas/HostProfile'
 *                         advertiser:
 *                           $ref: '#/components/schemas/AdvertiserProfile'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/complete',
  apiRateLimit,
  authenticateToken,
  profileController.getCompleteProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/customer:
 *   put:
 *     summary: Update customer profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 description: Customer preferences as key-value pairs
 *     responses:
 *       200:
 *         description: Customer profile updated successfully
 *       403:
 *         description: Access denied. Customer role required.
 */
router.put(
  '/customer',
  apiRateLimit,
  authenticateToken,
  validate(updateCustomerProfileSchema),
  profileController.updateCustomerProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/vendor:
 *   put:
 *     summary: Update vendor profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 maxLength: 100
 *               businessType:
 *                 type: string
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               logo:
 *                 type: string
 *                 format: uri
 *               website:
 *                 type: string
 *                 format: uri
 *               subscriptionTier:
 *                 type: string
 *                 enum: [BASIC, PRO, ENTERPRISE]
 *     responses:
 *       200:
 *         description: Vendor profile updated successfully
 *       403:
 *         description: Access denied. Vendor role required.
 */
router.put(
  '/vendor',
  apiRateLimit,
  authenticateToken,
  validate(updateVendorProfileSchema),
  profileController.updateVendorProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/driver:
 *   put:
 *     summary: Update driver profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licenseNumber:
 *                 type: string
 *                 maxLength: 50
 *                 pattern: '^[A-Z0-9\-]+$'
 *               vehicleInfo:
 *                 type: object
 *                 properties:
 *                   make:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   color:
 *                     type: string
 *                   licensePlate:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [CAR, MOTORCYCLE, BICYCLE, SCOOTER]
 *               isOnline:
 *                 type: boolean
 *               currentLocation:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     minimum: -90
 *                     maximum: 90
 *                   longitude:
 *                     type: number
 *                     minimum: -180
 *                     maximum: 180
 *                   address:
 *                     type: string
 *               subscriptionTier:
 *                 type: string
 *                 enum: [BASIC, PRO]
 *     responses:
 *       200:
 *         description: Driver profile updated successfully
 *       403:
 *         description: Access denied. Driver role required.
 */
router.put(
  '/driver',
  apiRateLimit,
  authenticateToken,
  validate(updateDriverProfileSchema),
  profileController.updateDriverProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/host:
 *   put:
 *     summary: Update host profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               subscriptionTier:
 *                 type: string
 *                 enum: [BASIC, PRO]
 *               responseRate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               responseTime:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1440
 *                 description: Response time in minutes
 *     responses:
 *       200:
 *         description: Host profile updated successfully
 *       403:
 *         description: Access denied. Host role required.
 */
router.put(
  '/host',
  apiRateLimit,
  authenticateToken,
  validate(updateHostProfileSchema),
  profileController.updateHostProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/advertiser:
 *   put:
 *     summary: Update advertiser profile
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 maxLength: 100
 *               industry:
 *                 type: string
 *                 maxLength: 50
 *               website:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Advertiser profile updated successfully
 *       403:
 *         description: Access denied. Advertiser role required.
 */
router.put(
  '/advertiser',
  apiRateLimit,
  authenticateToken,
  validate(updateAdvertiserProfileSchema),
  profileController.updateAdvertiserProfile.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/customer/addresses:
 *   post:
 *     summary: Add customer address
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label, address, city, country]
 *             properties:
 *               label:
 *                 type: string
 *                 maxLength: 50
 *                 description: Address label (e.g., "Home", "Work")
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 description: Street address
 *               city:
 *                 type: string
 *                 maxLength: 50
 *               country:
 *                 type: string
 *                 maxLength: 50
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *       403:
 *         description: Access denied. Customer role required.
 */
router.post(
  '/customer/addresses',
  apiRateLimit,
  authenticateToken,
  validate(addAddressSchema),
  profileController.addCustomerAddress.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/customer/addresses/{addressId}:
 *   put:
 *     summary: Update customer address
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 maxLength: 50
 *               address:
 *                 type: string
 *                 maxLength: 200
 *               city:
 *                 type: string
 *                 maxLength: 50
 *               country:
 *                 type: string
 *                 maxLength: 50
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found or access denied
 */
router.put(
  '/customer/addresses/:addressId',
  apiRateLimit,
  authenticateToken,
  validate(updateAddressSchema),
  profileController.updateCustomerAddress.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/customer/addresses/{addressId}:
 *   delete:
 *     summary: Delete customer address
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Address not found or access denied
 */
router.delete(
  '/customer/addresses/:addressId',
  apiRateLimit,
  authenticateToken,
  profileController.deleteCustomerAddress.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/{role}/stats:
 *   get:
 *     summary: Get profile statistics for specific role
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [vendor, driver, host, advertiser]
 *         description: Role type for statistics
 *     responses:
 *       200:
 *         description: Profile statistics retrieved successfully
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
 *                     role:
 *                       type: string
 *                     stats:
 *                       type: object
 *       403:
 *         description: Access denied. Required role not found.
 */
router.get(
  '/:role/stats',
  apiRateLimit,
  authenticateToken,
  profileController.getProfileStats.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/admin/verify:
 *   put:
 *     summary: Update profile verification status (admin only)
 *     tags: [Profile Management, Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role, isVerified]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to update verification for
 *               role:
 *                 type: string
 *                 enum: [VENDOR, DRIVER, HOST, ADVERTISER]
 *                 description: Role to update verification for
 *               isVerified:
 *                 type: boolean
 *                 description: Verification status
 *     responses:
 *       200:
 *         description: Profile verification updated successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.put(
  '/admin/verify',
  apiRateLimit,
  authenticateToken,
  validate(updateProfileVerificationSchema),
  profileController.updateProfileVerification.bind(profileController)
);

/**
 * @swagger
 * /api/v1/profiles/rating:
 *   put:
 *     summary: Update profile rating
 *     tags: [Profile Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role, rating]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (optional, defaults to current user)
 *               role:
 *                 type: string
 *                 enum: [VENDOR, DRIVER, HOST]
 *                 description: Role to update rating for
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating value (0-5)
 *     responses:
 *       200:
 *         description: Profile rating updated successfully
 *       400:
 *         description: Invalid rating value or role
 */
router.put(
  '/rating',
  apiRateLimit,
  authenticateToken,
  validate(updateProfileRatingSchema),
  profileController.updateProfileRating.bind(profileController)
);

export { router as profileRoutes };
