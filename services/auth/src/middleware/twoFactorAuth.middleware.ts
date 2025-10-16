import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { redisService } from '../services/redis.service';

/**
 * Two-Factor Authentication preparation middleware
 * Prepares the system for 2FA implementation without requiring immediate activation
 */
export class TwoFactorAuthMiddleware {
  private static readonly TOTP_WINDOW = 2; // Allow 2 time steps (60 seconds)
  private static readonly BACKUP_CODES_COUNT = 10;
  private static readonly CODE_EXPIRY_MINUTES = 5;

  /**
   * Check if 2FA is required for the request
   */
  static check2FARequirement = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        return next();
      }

      // Check if user has 2FA enabled
      const user2FA = await this.getUser2FAStatus(userId);

      if (!user2FA.isEnabled) {
        return next();
      }

      // Check if request is already 2FA verified
      const is2FAVerified = req.headers['x-2fa-verified'] === 'true';
      const sessionId = req.sessionId;

      if (is2FAVerified && sessionId) {
        const verificationStatus = await this.check2FASessionStatus(sessionId);
        if (verificationStatus.isVerified) {
          return next();
        }
      }

      // Check if endpoint requires 2FA
      const requires2FA = this.endpointRequires2FA(req.path, req.method);

      if (requires2FA) {
        return res.status(403).json({
          success: false,
          error: '2FA verification required',
          code: '2FA_REQUIRED',
          details: {
            message: 'This action requires two-factor authentication',
            methods: user2FA.availableMethods,
          },
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      console.error('2FA requirement check error:', error);
      next(); // Continue on error to avoid blocking users
    }
  };

  /**
   * Generate 2FA setup data for user
   */
  static generate2FASetup = async (userId: string, userEmail: string) => {
    try {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `Auth Service (${userEmail})`,
        issuer: 'Auth Service',
        length: 32,
      });

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Store setup data temporarily (not activated yet)
      const setupData = {
        secret: secret.base32,
        backupCodes: backupCodes.map(code => this.hashBackupCode(code)),
        createdAt: Date.now(),
        isActivated: false,
      };

      await redisService.set(
        `2fa_setup:${userId}`,
        JSON.stringify(setupData),
        3600 // 1 hour to complete setup
      );

      // Generate QR code
      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

      console.info('2FA setup generated', {
        userId,
        timestamp: new Date().toISOString(),
      });

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes,
        manualEntryKey: secret.base32,
      };
    } catch (error) {
      console.error('Error generating 2FA setup:', error);
      throw error;
    }
  };

  /**
   * Verify 2FA setup and activate
   */
  static verify2FASetup = async (
    userId: string,
    token: string,
    backupCodeVerification?: string
  ) => {
    try {
      // Get setup data
      const setupData = await redisService.get(`2fa_setup:${userId}`);
      if (!setupData) {
        throw new Error('2FA setup not found or expired');
      }

      const setup = JSON.parse(setupData);

      // Verify TOTP token
      const isValidToken = speakeasy.totp.verify({
        secret: setup.secret,
        encoding: 'base32',
        token,
        window: this.TOTP_WINDOW,
      });

      if (!isValidToken) {
        throw new Error('Invalid 2FA token');
      }

      // Optionally verify a backup code
      if (backupCodeVerification) {
        const hashedCode = this.hashBackupCode(backupCodeVerification);
        if (!setup.backupCodes.includes(hashedCode)) {
          throw new Error('Invalid backup code');
        }
      }

      // Activate 2FA for user (store in database when ready)
      const user2FAData = {
        userId,
        secret: setup.secret,
        backupCodes: setup.backupCodes,
        isEnabled: true,
        activatedAt: new Date(),
      };

      // For now, store in Redis (move to database when implementing full 2FA)
      await redisService.set(`user_2fa:${userId}`, JSON.stringify(user2FAData));

      // Clean up setup data
      await redisService.del(`2fa_setup:${userId}`);

      console.info('2FA activated for user', {
        userId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error verifying 2FA setup:', error);
      throw error;
    }
  };

  /**
   * Verify 2FA token for authentication
   */
  static verify2FAToken = async (
    userId: string,
    token: string,
    isBackupCode = false
  ) => {
    try {
      const user2FA = await this.getUser2FAStatus(userId);

      if (!user2FA.isEnabled) {
        throw new Error('2FA not enabled for user');
      }

      if (isBackupCode) {
        return this.verifyBackupCode(userId, token);
      } else {
        return this.verifyTOTPToken(userId, token);
      }
    } catch (error) {
      console.error('Error verifying 2FA token:', error);
      return false;
    }
  };

  /**
   * Verify TOTP token
   */
  private static async verifyTOTPToken(
    userId: string,
    token: string
  ): Promise<boolean> {
    try {
      const user2FAData = await redisService.get(`user_2fa:${userId}`);
      if (!user2FAData) {
        return false;
      }

      const user2FA = JSON.parse(user2FAData);

      const isValid = speakeasy.totp.verify({
        secret: user2FA.secret,
        encoding: 'base32',
        token,
        window: this.TOTP_WINDOW,
      });

      if (isValid) {
        // Log successful verification
        await this.log2FAEvent(userId, '2FA_TOTP_SUCCESS');
      } else {
        // Log failed verification
        await this.log2FAEvent(userId, '2FA_TOTP_FAILED');
      }

      return isValid;
    } catch (error) {
      console.error('Error verifying TOTP token:', error);
      return false;
    }
  }

  /**
   * Verify backup code
   */
  private static async verifyBackupCode(
    userId: string,
    code: string
  ): Promise<boolean> {
    try {
      const user2FAData = await redisService.get(`user_2fa:${userId}`);
      if (!user2FAData) {
        return false;
      }

      const user2FA = JSON.parse(user2FAData);
      const hashedCode = this.hashBackupCode(code);

      const codeIndex = user2FA.backupCodes.indexOf(hashedCode);
      if (codeIndex === -1) {
        await this.log2FAEvent(userId, '2FA_BACKUP_CODE_FAILED');
        return false;
      }

      // Remove used backup code
      user2FA.backupCodes.splice(codeIndex, 1);
      user2FA.lastBackupCodeUsed = Date.now();

      await redisService.set(`user_2fa:${userId}`, JSON.stringify(user2FA));

      await this.log2FAEvent(userId, '2FA_BACKUP_CODE_SUCCESS');

      // Warn if running low on backup codes
      if (user2FA.backupCodes.length <= 2) {
        console.warn('User running low on backup codes', {
          userId,
          remainingCodes: user2FA.backupCodes.length,
        });
      }

      return true;
    } catch (error) {
      console.error('Error verifying backup code:', error);
      return false;
    }
  }

  /**
   * Mark session as 2FA verified
   */
  static mark2FAVerified = async (sessionId: string, userId: string) => {
    try {
      const verificationData = {
        userId,
        verifiedAt: Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      };

      await redisService.set(
        `2fa_verified:${sessionId}`,
        JSON.stringify(verificationData),
        8 * 3600 // 8 hours
      );

      console.info('Session marked as 2FA verified', {
        sessionId,
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error marking 2FA verified:', error);
    }
  };

  /**
   * Check 2FA session verification status
   */
  private static async check2FASessionStatus(sessionId: string) {
    try {
      const verificationData = await redisService.get(
        `2fa_verified:${sessionId}`
      );

      if (!verificationData) {
        return { isVerified: false };
      }

      const verification = JSON.parse(verificationData);
      const isExpired = Date.now() > verification.expiresAt;

      if (isExpired) {
        await redisService.del(`2fa_verified:${sessionId}`);
        return { isVerified: false };
      }

      return {
        isVerified: true,
        verifiedAt: verification.verifiedAt,
        expiresAt: verification.expiresAt,
      };
    } catch (error) {
      console.error('Error checking 2FA session status:', error);
      return { isVerified: false };
    }
  }

  /**
   * Get user 2FA status
   */
  private static async getUser2FAStatus(userId: string) {
    try {
      const user2FAData = await redisService.get(`user_2fa:${userId}`);

      if (!user2FAData) {
        return {
          isEnabled: false,
          availableMethods: [],
        };
      }

      const user2FA = JSON.parse(user2FAData);

      return {
        isEnabled: user2FA.isEnabled,
        availableMethods: ['totp', 'backup_codes'],
        backupCodesRemaining: user2FA.backupCodes.length,
        activatedAt: user2FA.activatedAt,
      };
    } catch (error) {
      console.error('Error getting user 2FA status:', error);
      return {
        isEnabled: false,
        availableMethods: [],
      };
    }
  }

  /**
   * Check if endpoint requires 2FA
   */
  private static endpointRequires2FA(path: string, method: string): boolean {
    // Define sensitive endpoints that require 2FA
    const sensitive2FAEndpoints = [
      { path: /\/auth\/change-password/, methods: ['POST'] },
      { path: /\/users\/.*\/status/, methods: ['PUT', 'PATCH'] },
      { path: /\/admin\/.*/, methods: ['POST', 'PUT', 'DELETE'] },
      { path: /\/profile\/delete/, methods: ['DELETE'] },
    ];

    return sensitive2FAEndpoints.some(
      endpoint =>
        endpoint.path.test(path) &&
        endpoint.methods.includes(method.toUpperCase())
    );
  }

  /**
   * Generate backup codes
   */
  private static generateBackupCodes(): string[] {
    const codes: string[] = [];

    for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
      // Generate 8-digit backup code
      const code = crypto.randomInt(10000000, 99999999).toString();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Hash backup code for storage
   */
  private static hashBackupCode(code: string): string {
    return crypto
      .createHash('sha256')
      .update(code + process.env.BACKUP_CODE_SALT || 'default-salt')
      .digest('hex');
  }

  /**
   * Log 2FA event
   */
  private static async log2FAEvent(userId: string, eventType: string) {
    try {
      const eventData = {
        userId,
        eventType,
        timestamp: Date.now(),
      };

      await redisService.set(
        `2fa_event:${userId}:${Date.now()}`,
        JSON.stringify(eventData),
        86400 // 24 hours
      );

      console.info('2FA event logged', {
        userId,
        eventType,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging 2FA event:', error);
    }
  }

  /**
   * Disable 2FA for user (admin function)
   */
  static disable2FA = async (userId: string, adminUserId: string) => {
    try {
      await redisService.del(`user_2fa:${userId}`);

      // Clear any active 2FA verifications
      const sessions = await redisService.keys(`2fa_verified:*`);
      for (const sessionKey of sessions) {
        const sessionData = await redisService.get(sessionKey);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.userId === userId) {
            await redisService.del(sessionKey);
          }
        }
      }

      console.info('2FA disabled for user', {
        userId,
        adminUserId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return false;
    }
  };

  /**
   * Generate new backup codes (replace existing ones)
   */
  static generateNewBackupCodes = async (userId: string) => {
    try {
      const user2FAData = await redisService.get(`user_2fa:${userId}`);
      if (!user2FAData) {
        throw new Error('2FA not enabled for user');
      }

      const user2FA = JSON.parse(user2FAData);
      const newBackupCodes = this.generateBackupCodes();

      user2FA.backupCodes = newBackupCodes.map(code =>
        this.hashBackupCode(code)
      );
      user2FA.backupCodesGeneratedAt = Date.now();

      await redisService.set(`user_2fa:${userId}`, JSON.stringify(user2FA));

      console.info('New backup codes generated', {
        userId,
        timestamp: new Date().toISOString(),
      });

      return newBackupCodes;
    } catch (error) {
      console.error('Error generating new backup codes:', error);
      throw error;
    }
  };

  /**
   * Get 2FA analytics for user
   */
  static get2FAAnalytics = async (userId: string) => {
    try {
      const user2FA = await this.getUser2FAStatus(userId);

      if (!user2FA.isEnabled) {
        return {
          isEnabled: false,
          analytics: null,
        };
      }

      // Get recent 2FA events
      const eventKeys = await redisService.keys(`2fa_event:${userId}:*`);
      const events = [];

      for (const key of eventKeys.slice(-50)) {
        // Last 50 events
        const eventData = await redisService.get(key);
        if (eventData) {
          events.push(JSON.parse(eventData));
        }
      }

      return {
        isEnabled: true,
        backupCodesRemaining: user2FA.backupCodesRemaining,
        activatedAt: user2FA.activatedAt,
        recentEvents: events.sort((a, b) => b.timestamp - a.timestamp),
        analytics: {
          totalEvents: events.length,
          successfulVerifications: events.filter(e =>
            e.eventType.includes('SUCCESS')
          ).length,
          failedVerifications: events.filter(e =>
            e.eventType.includes('FAILED')
          ).length,
        },
      };
    } catch (error) {
      console.error('Error getting 2FA analytics:', error);
      return {
        isEnabled: false,
        analytics: null,
      };
    }
  };
}
