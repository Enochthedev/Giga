import { NextFunction, Request, Response } from 'express';
import { redisService } from '../services/redis.service';

/**
 * Account lockout middleware for failed login attempts
 */
export class AccountLockoutMiddleware {
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION_MINUTES = 30;
  private static readonly PROGRESSIVE_DELAY_BASE = 1000; // 1 second base delay

  /**
   * Check if account is locked before login attempt
   */
  static checkAccountLockout = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const clientIp = req.clientIp || req.ip;

      if (!email) {
        return next();
      }

      // Check both email-based and IP-based lockouts
      const emailLockKey = `lockout:email:${email.toLowerCase()}`;
      const ipLockKey = `lockout:ip:${clientIp}`;

      const [emailLockData, ipLockData] = await Promise.all([
        redisService.get(emailLockKey),
        redisService.get(ipLockKey),
      ]);

      // Check email-based lockout
      if (emailLockData) {
        const lockData = JSON.parse(emailLockData);
        const remainingTime = Math.ceil(
          (lockData.lockedUntil - Date.now()) / 1000 / 60
        );

        if (remainingTime > 0) {
          console.warn(`Account locked for email ${email}`, {
            email,
            clientIp,
            remainingMinutes: remainingTime,
            attempts: lockData.attempts,
            timestamp: new Date().toISOString(),
          });

          return res.status(423).json({
            success: false,
            error: 'Account temporarily locked',
            code: 'ACCOUNT_LOCKED',
            details: {
              reason: 'Too many failed login attempts',
              remainingMinutes: remainingTime,
              maxAttempts: this.MAX_FAILED_ATTEMPTS,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Check IP-based lockout
      if (ipLockData) {
        const lockData = JSON.parse(ipLockData);
        const remainingTime = Math.ceil(
          (lockData.lockedUntil - Date.now()) / 1000 / 60
        );

        if (remainingTime > 0) {
          console.warn(`IP locked for ${clientIp}`, {
            clientIp,
            remainingMinutes: remainingTime,
            attempts: lockData.attempts,
            timestamp: new Date().toISOString(),
          });

          return res.status(423).json({
            success: false,
            error: 'IP address temporarily locked',
            code: 'IP_LOCKED',
            details: {
              reason: 'Too many failed login attempts from this IP',
              remainingMinutes: remainingTime,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      next();
    } catch (error) {
      console.error('Account lockout check error:', error);
      next(); // Continue on error to avoid blocking legitimate users
    }
  };

  /**
   * Record failed login attempt
   */
  static recordFailedAttempt = async (
    email: string,
    clientIp: string,
    userAgent?: string
  ) => {
    try {
      const emailKey = `failed_attempts:email:${email.toLowerCase()}`;
      const ipKey = `failed_attempts:ip:${clientIp}`;
      const windowSeconds = 3600; // 1 hour window

      // Increment failed attempts for both email and IP
      const [emailAttempts, ipAttempts] = await Promise.all([
        redisService.incrementRateLimit(emailKey, windowSeconds),
        redisService.incrementRateLimit(ipKey, windowSeconds),
      ]);

      // Apply progressive delay
      const delay = Math.min(
        this.PROGRESSIVE_DELAY_BASE * Math.pow(2, emailAttempts - 1),
        10000 // Max 10 seconds
      );

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Check if lockout threshold is reached
      if (emailAttempts >= this.MAX_FAILED_ATTEMPTS) {
        await this.lockAccount(email, emailAttempts, 'email');
      }

      if (ipAttempts >= this.MAX_FAILED_ATTEMPTS * 2) {
        // Higher threshold for IP
        await this.lockIP(clientIp, ipAttempts);
      }

      // Log security event
      console.warn('Failed login attempt recorded', {
        email,
        clientIp,
        userAgent,
        emailAttempts,
        ipAttempts,
        delay,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error recording failed attempt:', error);
    }
  };

  /**
   * Clear failed attempts on successful login
   */
  static clearFailedAttempts = (email: string, clientIp: string) => {
    try {
      const emailKey = `failed_attempts:email:${email.toLowerCase()}`;
      const ipKey = `failed_attempts:ip:${clientIp}`;

      await Promise.all([redisService.del(emailKey), redisService.del(ipKey)]);

      console.info('Failed attempts cleared for successful login', {
        email,
        clientIp,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clearing failed attempts:', error);
    }
  };

  /**
   * Lock account for specified duration
   */
  private static async lockAccount(
    email: string,
    attempts: number,
    type: 'email' | 'ip'
  ) {
    try {
      const lockKey = `lockout:${type}:${email.toLowerCase()}`;
      const lockDurationMs = this.LOCKOUT_DURATION_MINUTES * 60 * 1000;
      const lockedUntil = Date.now() + lockDurationMs;

      const lockData = {
        attempts,
        lockedAt: Date.now(),
        lockedUntil,
        type,
      };

      await redisService.set(
        lockKey,
        JSON.stringify(lockData),
        Math.ceil(lockDurationMs / 1000)
      );

      console.warn(`Account locked: ${email}`, {
        email,
        attempts,
        lockDurationMinutes: this.LOCKOUT_DURATION_MINUTES,
        lockedUntil: new Date(lockedUntil).toISOString(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error locking account:', error);
    }
  }

  /**
   * Lock IP address for specified duration
   */
  private static async lockIP(clientIp: string, attempts: number) {
    try {
      const lockKey = `lockout:ip:${clientIp}`;
      const lockDurationMs = this.LOCKOUT_DURATION_MINUTES * 60 * 1000;
      const lockedUntil = Date.now() + lockDurationMs;

      const lockData = {
        attempts,
        lockedAt: Date.now(),
        lockedUntil,
        type: 'ip',
      };

      await redisService.set(
        lockKey,
        JSON.stringify(lockData),
        Math.ceil(lockDurationMs / 1000)
      );

      console.warn(`IP locked: ${clientIp}`, {
        clientIp,
        attempts,
        lockDurationMinutes: this.LOCKOUT_DURATION_MINUTES,
        lockedUntil: new Date(lockedUntil).toISOString(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error locking IP:', error);
    }
  }

  /**
   * Get lockout status for monitoring
   */
  static getLockoutStatus = (email: string, clientIp: string) => {
    try {
      const emailLockKey = `lockout:email:${email.toLowerCase()}`;
      const ipLockKey = `lockout:ip:${clientIp}`;
      const emailAttemptsKey = `failed_attempts:email:${email.toLowerCase()}`;
      const ipAttemptsKey = `failed_attempts:ip:${clientIp}`;

      const [emailLock, ipLock, emailAttempts, ipAttempts] = await Promise.all([
        redisService.get(emailLockKey),
        redisService.get(ipLockKey),
        redisService.get(emailAttemptsKey),
        redisService.get(ipAttemptsKey),
      ]);

      return {
        email: {
          isLocked: !!emailLock,
          lockData: emailLock ? JSON.parse(emailLock) : null,
          attempts: emailAttempts ? parseInt(emailAttempts) : 0,
        },
        ip: {
          isLocked: !!ipLock,
          lockData: ipLock ? JSON.parse(ipLock) : null,
          attempts: ipAttempts ? parseInt(ipAttempts) : 0,
        },
      };
    } catch (error) {
      console.error('Error getting lockout status:', error);
      return null;
    }
  };

  /**
   * Manually unlock account (admin function)
   */
  static unlockAccount = (email: string, adminUserId: string) => {
    try {
      const emailLockKey = `lockout:email:${email.toLowerCase()}`;
      const emailAttemptsKey = `failed_attempts:email:${email.toLowerCase()}`;

      await Promise.all([
        redisService.del(emailLockKey),
        redisService.del(emailAttemptsKey),
      ]);

      console.info('Account manually unlocked', {
        email,
        adminUserId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error unlocking account:', error);
      return false;
    }
  };

  /**
   * Manually unlock IP (admin function)
   */
  static unlockIP = (clientIp: string, adminUserId: string) => {
    try {
      const ipLockKey = `lockout:ip:${clientIp}`;
      const ipAttemptsKey = `failed_attempts:ip:${clientIp}`;

      await Promise.all([
        redisService.del(ipLockKey),
        redisService.del(ipAttemptsKey),
      ]);

      console.info('IP manually unlocked', {
        clientIp,
        adminUserId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error unlocking IP:', error);
      return false;
    }
  };
}
