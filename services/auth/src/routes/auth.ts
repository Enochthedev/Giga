import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requirePhoneNumber } from '../middleware/phoneVerification.middleware';
import { apiRateLimit, authRateLimit, passwordRateLimit } from '../middleware/rateLimit.middleware';
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendEmailVerificationSchema,
  resendPhoneVerificationSchema,
  sendPhoneVerificationSchema,
  switchRoleSchema,
  updateProfileSchema,
  validate,
  verifyEmailSchema,
  verifyPhoneSchema
} from '../middleware/validation.middleware';

const router: Router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post('/register', authRateLimit, validate(registerSchema), authController.register.bind(authController));

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authRateLimit, validate(loginSchema), authController.login.bind(authController));

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', apiRateLimit, validate(refreshTokenSchema), authController.refreshToken.bind(authController));

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', apiRateLimit, authenticateToken, authController.getProfile.bind(authController));

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
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
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', apiRateLimit, authenticateToken, validate(updateProfileSchema), authController.updateProfile.bind(authController));

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 */
router.put('/change-password', passwordRateLimit, authenticateToken, validate(changePasswordSchema), authController.changePassword.bind(authController));

/**
 * @swagger
 * /api/v1/auth/switch-role:
 *   post:
 *     summary: Switch active user role
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
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
 *                 enum: [CUSTOMER, VENDOR, DRIVER, HOST, ADVERTISER]
 *     responses:
 *       200:
 *         description: Role switched successfully
 *       403:
 *         description: User does not have this role
 */
router.post('/switch-role', apiRateLimit, authenticateToken, validate(switchRoleSchema), authController.switchRole.bind(authController));

/**
 * @swagger
 * /api/v1/auth/send-email-verification:
 *   post:
 *     summary: Send email verification
 *     tags: [Email Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: Email already verified
 *       429:
 *         description: Verification email already sent recently
 */
router.post('/send-email-verification', authRateLimit, authenticateToken, authController.sendEmailVerification.bind(authController));

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-email', apiRateLimit, validate(verifyEmailSchema), authController.verifyEmail.bind(authController));

/**
 * @swagger
 * /api/v1/auth/resend-email-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to resend verification to
 *     responses:
 *       200:
 *         description: Verification email sent if email exists
 *       429:
 *         description: Verification email already sent recently
 */
router.post('/resend-email-verification', authRateLimit, validate(resendEmailVerificationSchema), authController.resendEmailVerification.bind(authController));

/**
 * @swagger
 * /api/v1/auth/send-phone-verification:
 *   post:
 *     summary: Send phone verification code
 *     tags: [Phone Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       400:
 *         description: Phone number not set or already verified
 *       429:
 *         description: Verification code already sent recently
 */
router.post('/send-phone-verification', authRateLimit, authenticateToken, requirePhoneNumber, validate(sendPhoneVerificationSchema), authController.sendPhoneVerification.bind(authController));

/**
 * @swagger
 * /api/v1/auth/verify-phone:
 *   post:
 *     summary: Verify phone number with code
 *     tags: [Phone Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 description: 6-digit verification code
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *       400:
 *         description: Invalid or expired code
 */
router.post('/verify-phone', apiRateLimit, authenticateToken, validate(verifyPhoneSchema), authController.verifyPhone.bind(authController));

/**
 * @swagger
 * /api/v1/auth/resend-phone-verification:
 *   post:
 *     summary: Resend phone verification code
 *     tags: [Phone Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Phone number to resend verification to
 *     responses:
 *       200:
 *         description: Verification code sent if phone exists
 *       429:
 *         description: Verification code already sent recently
 */
router.post('/resend-phone-verification', authRateLimit, validate(resendPhoneVerificationSchema), authController.resendPhoneVerification.bind(authController));

export { router as authRoutes };
