import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { prisma } from '../lib/prisma';
import { AccountLockoutMiddleware } from '../middleware/accountLockout.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { requirePhoneNumber } from '../middleware/phoneVerification.middleware';
import {
  apiRateLimit,
  authRateLimit,
  passwordRateLimit,
} from '../middleware/rateLimit.middleware';
import { SessionManagementMiddleware } from '../middleware/sessionManagement.middleware';
import { TwoFactorAuthMiddleware } from '../middleware/twoFactorAuth.middleware';
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  requestPasswordResetSchema,
  resendEmailVerificationSchema,
  resendPhoneVerificationSchema,
  resetPasswordSchema,
  sendPhoneVerificationSchema,
  switchRoleSchema,
  updateProfileSchema,
  validate,
  verifyEmailSchema,
  verifyPasswordResetTokenSchema,
  verifyPhoneSchema,
} from '../middleware/validation.middleware';

const router: Router = Router();
const authController = new AuthController(prisma);

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
router.post(
  '/register',
  authRateLimit,
  validate(registerSchema),
  AuthController.register
);

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
router.post(
  '/login',
  authRateLimit,
  AccountLockoutMiddleware.checkAccountLockout,
  validate(loginSchema),
  AuthController.login
);

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
router.post(
  '/refresh',
  apiRateLimit,
  validate(refreshTokenSchema),
  AuthController.refreshToken
);

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
router.post('/logout', AuthController.logout);

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
router.get(
  '/profile',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  authController.getProfile.bind(authController)
);

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
router.put(
  '/profile',
  apiRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  validate(updateProfileSchema),
  authController.updateProfile.bind(authController)
);

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
router.put(
  '/change-password',
  passwordRateLimit,
  authenticateToken,
  SessionManagementMiddleware.validateSession,
  TwoFactorAuthMiddleware.check2FARequirement,
  validate(changePasswordSchema),
  AuthController.changePassword
);

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
router.post(
  '/switch-role',
  apiRateLimit,
  authenticateToken,
  validate(switchRoleSchema),
  authController.switchRole.bind(authController)
);

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
router.post(
  '/send-email-verification',
  authRateLimit,
  authenticateToken,
  AuthController.sendEmailVerification
);

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
router.post(
  '/verify-email',
  apiRateLimit,
  validate(verifyEmailSchema),
  AuthController.verifyEmail
);

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
router.post(
  '/resend-email-verification',
  authRateLimit,
  validate(resendEmailVerificationSchema),
  authController.resendEmailVerification.bind(authController)
);

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
router.post(
  '/send-phone-verification',
  authRateLimit,
  authenticateToken,
  requirePhoneNumber,
  validate(sendPhoneVerificationSchema),
  AuthController.sendPhoneVerification
);

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
router.post(
  '/verify-phone',
  apiRateLimit,
  authenticateToken,
  validate(verifyPhoneSchema),
  AuthController.verifyPhone
);

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
router.post(
  '/resend-phone-verification',
  authRateLimit,
  validate(resendPhoneVerificationSchema),
  authController.resendPhoneVerification.bind(authController)
);

/**
 * @swagger
 * /api/v1/auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Password Reset]
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
 *                 description: Email address to send reset link to
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 *       429:
 *         description: Too many reset requests
 */
router.post(
  '/request-password-reset',
  passwordRateLimit,
  validate(requestPasswordResetSchema),
  AuthController.requestPasswordReset
);

/**
 * @swagger
 * /api/v1/auth/verify-reset-token:
 *   post:
 *     summary: Verify password reset token
 *     tags: [Password Reset]
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
 *                 description: Password reset token to verify
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid or expired token
 */
router.post(
  '/verify-reset-token',
  apiRateLimit,
  validate(verifyPasswordResetTokenSchema),
  authController.verifyPasswordResetToken.bind(authController)
);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password meeting security requirements
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or weak password
 */
router.post(
  '/reset-password',
  passwordRateLimit,
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

export { router as authRoutes };
