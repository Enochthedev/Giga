import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authService } from '../services/auth.service.js';
import { passwordService } from '../services/password.service.js';
import { TokenManagementService } from '../services/token-management.service.js';
import { verificationService } from '../services/verification.service.js';
import { sanitizeInput } from '../utils/input-sanitizer.js';
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from '../utils/validators.js';

export class AuthController {
  /**
   * User login
   */
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password, deviceFingerprint } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS',
          timestamp: new Date().toISOString(),
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL',
          timestamp: new Date().toISOString(),
        });
      }

      // Sanitize input
      const sanitizedEmail = sanitizeInput(email);

      const result = await authService.login(
        {
          email: sanitizedEmail,
          password,
          deviceFingerprint,
        },
        req
      );

      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Login controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * User registration
   */
  static register = async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, role } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, first name, and last name are required',
          code: 'MISSING_REQUIRED_FIELDS',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate password strength
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          error:
            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
          code: 'WEAK_PASSWORD',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate phone if provided
      if (phone && !validatePhone(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid phone number format',
          code: 'INVALID_PHONE',
          timestamp: new Date().toISOString(),
        });
      }

      // Sanitize input
      const sanitizedData = {
        email: sanitizeInput(email),
        password,
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        phone: phone ? sanitizeInput(phone) : undefined,
        role: role ? sanitizeInput(role) : 'CUSTOMER',
      };

      const result = await authService.register(sanitizedData, req);

      if (!result.success) {
        const statusCode = result.code === 'USER_EXISTS' ? 409 : 400;
        return res.status(statusCode).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
        message: 'User registered successfully. Please verify your email.',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Registration controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * User logout
   */
  static logout = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await authService.logout(req.user.sub, req);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
          code: 'LOGOUT_ERROR',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Refresh access token
   */
  static refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN',
          timestamp: new Date().toISOString(),
        });
      }

      const tokenService = TokenManagementService.getInstance();
      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        platform: Array.isArray(req.headers['sec-ch-ua-platform'])
          ? req.headers['sec-ch-ua-platform'][0] || 'unknown'
          : req.headers['sec-ch-ua-platform'] || 'unknown',
        language: Array.isArray(req.headers['accept-language'])
          ? req.headers['accept-language'][0] || 'en'
          : req.headers['accept-language'] || 'en',
      };

      const result = await tokenService.refreshDeviceToken(
        prisma,
        refreshToken,
        deviceInfo,
        req.clientIp || 'unknown'
      );

      if (!result) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Refresh token controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Send email verification
   */
  static sendEmailVerification = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await verificationService.sendEmailVerification(
        req.user.sub
      );

      if (!result.success) {
        const statusCode =
          result.code === 'EMAIL_ALREADY_VERIFIED'
            ? 400
            : result.code === 'VERIFICATION_EMAIL_ALREADY_SENT'
              ? 429
              : 500;

        return res.status(statusCode).json({
          success: false,
          error: result.error,
          message: result.message,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Send email verification controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Verify email
   */
  static verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required',
          code: 'MISSING_TOKEN',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await verificationService.verifyEmail(token);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Verify email controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Send phone verification
   */
  static sendPhoneVerification = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await verificationService.sendPhoneVerification(
        req.user.sub
      );

      if (!result.success) {
        const statusCode =
          result.code === 'PHONE_ALREADY_VERIFIED'
            ? 400
            : result.code === 'VERIFICATION_CODE_ALREADY_SENT'
              ? 429
              : 500;

        return res.status(statusCode).json({
          success: false,
          error: result.error,
          message: result.message,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Send phone verification controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Verify phone
   */
  static verifyPhone = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Verification code is required',
          code: 'MISSING_CODE',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await verificationService.verifyPhone(req.user.sub, code);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Verify phone controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Request password reset
   */
  static requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
          code: 'MISSING_EMAIL',
          timestamp: new Date().toISOString(),
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL',
          timestamp: new Date().toISOString(),
        });
      }

      const sanitizedEmail = sanitizeInput(email);
      const result = await passwordService.requestPasswordReset(
        sanitizedEmail,
        req
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Request password reset controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Reset password
   */
  static resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required',
          code: 'MISSING_REQUIRED_FIELDS',
          timestamp: new Date().toISOString(),
        });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error:
            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
          code: 'WEAK_PASSWORD',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await passwordService.resetPassword(token, newPassword);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Reset password controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Change password
   */
  static changePassword = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required',
          code: 'MISSING_REQUIRED_FIELDS',
          timestamp: new Date().toISOString(),
        });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error:
            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
          code: 'WEAK_PASSWORD',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await passwordService.changePassword(
        req.user.sub,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        const statusCode =
          result.code === 'INVALID_CURRENT_PASSWORD'
            ? 400
            : result.code === 'PASSWORD_REUSED'
              ? 400
              : 500;

        return res.status(statusCode).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Change password controller error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Instance methods for routes that need binding
  private prisma: any;

  constructor(prisma: unknown) {
    this.prisma = prisma;
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      // Get user profile with all related data
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          customerProfile: true,
          vendorProfile: true,
          driverProfile: true,
          hostProfile: true,
          advertiserProfile: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Remove sensitive data
      const { passwordHash, ...userProfile } = user;

      return res.json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const updates = sanitizeInput(req.body);

      // Update user profile
      const updatedUser = await this.prisma.user.update({
        where: { id: req.user.sub },
        data: updates,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      // Remove sensitive data
      const { passwordHash, ...userProfile } = updatedUser;

      return res.json({
        success: true,
        data: userProfile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async switchRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const { roleName } = req.body;

      // Verify user has this role
      const userRole = await this.prisma.userRole.findFirst({
        where: {
          userId: req.user.sub,
          role: {
            name: roleName,
          },
        },
        include: {
          role: true,
        },
      });

      if (!userRole) {
        return res.status(403).json({
          success: false,
          error: 'You do not have access to this role',
        });
      }

      // Update user's active role
      await this.prisma.user.update({
        where: { id: req.user.sub },
        data: { activeRole: roleName },
      });

      return res.json({
        success: true,
        message: `Switched to ${roleName} role`,
        data: { activeRole: roleName },
      });
    } catch (error) {
      console.error('Switch role error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async resendEmailVerification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const result = await verificationService.sendEmailVerification(
        req.user.sub
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      return res.json({
        success: true,
        message: 'Verification email sent',
      });
    } catch (error) {
      console.error('Resend email verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async resendPhoneVerification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const result = await verificationService.sendPhoneVerification(
        req.user.sub
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      return res.json({
        success: true,
        message: 'Verification code sent',
      });
    } catch (error) {
      console.error('Resend phone verification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async verifyPasswordResetToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required',
        });
      }

      const result = await passwordService.verifyResetToken(token);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      return res.json({
        success: true,
        message: 'Token is valid',
        data: { valid: true },
      });
    } catch (error) {
      console.error('Verify password reset token error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
