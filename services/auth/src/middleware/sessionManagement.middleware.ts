import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { redisService } from '../services/redis.service';

/**
 * Session management middleware with concurrent session limits
 */
export class SessionManagementMiddleware {
  private static readonly MAX_CONCURRENT_SESSIONS = 5;
  private static readonly SESSION_TIMEOUT_HOURS = 24;
  private static readonly DEVICE_FINGERPRINT_COMPONENTS = [
    'user-agent',
    'accept-language',
    'accept-encoding',
  ];

  /**
   * Initialize session on login
   */
  static initializeSession = async (
    _userId: string,
    _req: Request,
    tokenData: { accessToken: string; refreshToken: string }
  ) => {
    try {
      const deviceFingerprint = this.generateDeviceFingerprint(req);
      const deviceId = this.generateDeviceId(deviceFingerprint, req.clientIp || req.ip || 'unknown');
      const sessionId = crypto.randomUUID();
      const clientIp = req.clientIp || req.ip;

      // Check concurrent session limit
      await this.enforceSessionLimit(userId);

      // Create device session record
      const expiresAt = new Date(
        Date.now() + this.SESSION_TIMEOUT_HOURS * 60 * 60 * 1000
      );

      const deviceSession = await prisma.deviceSession.create({
        data: {
          userId,
          deviceId,
          sessionId,
          deviceFingerprint,
          ipAddress: this.hashIP(clientIp || 'unknown'),
          userAgent: req.headers['user-agent'] || 'unknown',
          isActive: true,
          lastUsed: new Date(),
          expiresAt,
        },
      });

      // Store session data in Redis for fast access
      const sessionData = {
        userId,
        deviceId,
        sessionId,
        deviceFingerprint,
        ipAddress: clientIp,
        userAgent: req.headers['user-agent'],
        createdAt: Date.now(),
        lastUsed: Date.now(),
        tokenHash: this.hashToken(tokenData.refreshToken),
      };

      await redisService.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        this.SESSION_TIMEOUT_HOURS * 3600
      );

      await redisService.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        this.SESSION_TIMEOUT_HOURS * 3600
      );

      // Track active sessions for user
      await this.addToActiveSessions(userId, sessionId);

      console.info('Session initialized', {
        userId,
        sessionId,
        deviceId,
        clientIp,
        timestamp: new Date().toISOString(),
      });

      return {
        sessionId,
        deviceId,
        deviceSession,
      };
    } catch (error) {
      console.error('Error initializing session:', error);
      throw error;
    }
  };

  /**
   * Validate and update session
   */
  static validateSession = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      const userId = req.user?.sub;

      if (!sessionId || !userId) {
        return next();
      }

      // Get session data from Redis
      const sessionData = await redisService.get(`session:${sessionId}`);
      if (!sessionData) {
        console.warn('Session not found in Redis', { sessionId, userId });
        return this.invalidateSession(req, res, 'SESSION_NOT_FOUND');
      }

      const session = JSON.parse(sessionData);

      // Validate session ownership
      if (session.userId !== userId) {
        console.warn('Session ownership mismatch', { sessionId, userId, sessionUserId: session.userId });
        return this.invalidateSession(req, res, 'SESSION_OWNERSHIP_MISMATCH');
      }

      // Check if session is still active in database
      const deviceSession = await prisma.deviceSession.findUnique({
        where: { sessionId },
      });

      if (!deviceSession || !deviceSession.isActive) {
        console.warn('Session inactive in database', { sessionId, userId });
        return this.invalidateSession(req, res, 'SESSION_INACTIVE');
      }

      // Check session expiry
      if (deviceSession.expiresAt < new Date()) {
        console.warn('Session expired', { sessionId, userId, expiresAt: deviceSession.expiresAt });
        await this.cleanupExpiredSession(sessionId);
        return this.invalidateSession(req, res, 'SESSION_EXPIRED');
      }

      // Validate device fingerprint for security
      const currentFingerprint = this.generateDeviceFingerprint(req);
      if (currentFingerprint !== session.deviceFingerprint) {
        console.warn('Device fingerprint mismatch', {
          sessionId,
          userId,
          expected: session.deviceFingerprint,
          actual: currentFingerprint,
        });

        // Don't immediately invalidate, but log for monitoring
        // Could be due to browser updates, etc.
      }

      // Check for suspicious IP changes
      const currentIP = req.clientIp || req.ip;
      if (this.hashIP(currentIP || 'unknown') !== this.hashIP(session.ipAddress)) {
        console.warn('IP address change detected', {
          sessionId,
          userId,
          originalIP: session.ipAddress,
          currentIP,
        });

        // Log security event but don't block (could be legitimate)
        await this.logSecurityEvent(userId, 'IP_CHANGE', {
          sessionId,
          originalIP: session.ipAddress,
          currentIP,
        });
      }

      // Update last used timestamp
      await this.updateSessionActivity(sessionId, session);

      // Add session info to request
      req.sessionId = sessionId;
      req.deviceId = session.deviceId;

      next();
    } catch (error) {
      console.error('Session validation error:', error);
      next(); // Continue on error to avoid blocking users
    }
  };

  /**
   * Enforce concurrent session limit
   */
  private static async enforceSessionLimit(_userId: string) {
    try {
      // Get active sessions for user
      const activeSessions = await prisma.deviceSession.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        orderBy: { lastUsed: 'asc' },
      });

      if (activeSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
        // Remove oldest sessions
        const sessionsToRemove = activeSessions.slice(
          0,
          activeSessions.length - this.MAX_CONCURRENT_SESSIONS + 1
        );

        for (const session of sessionsToRemove) {
          await this.terminateSession(session.sessionId, 'CONCURRENT_LIMIT_EXCEEDED');
        }

        console.info('Enforced concurrent session limit', {
          userId,
          removedSessions: sessionsToRemove.length,
          maxSessions: this.MAX_CONCURRENT_SESSIONS,
        });
      }
    } catch (error) {
      console.error('Error enforcing session limit:', error);
    }
  }

  /**
   * Generate device fingerprint
   */
  private static generateDeviceFingerprint(req: Request): string {
    const components = this.DEVICE_FINGERPRINT_COMPONENTS.map(
      header => req.headers[header] || ''
    );

    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Generate device ID
   */
  private static generateDeviceId(fingerprint: string, ip: string): string {
    return crypto
      .createHash('sha256')
      .update(`${fingerprint}|${ip}`)
      .digest('hex')
      .substring(0, 12);
  }

  /**
   * Hash IP address for privacy
   */
  private static hashIP(ip: string): string {
    return crypto
      .createHash('sha256')
      .update(ip + process.env.IP_HASH_SALT || 'default-salt')
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Hash token for storage
   */
  private static hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Add session to active sessions list
   */
  private static async addToActiveSessions(_userId: string, sessionId: string) {
    try {
      const activeSessionsKey = `active_sessions:${userId}`;
      const activeSessions = await redisService.get(activeSessionsKey);
      const sessionList = activeSessions ? JSON.parse(activeSessions) : [];

      sessionList.push({
        sessionId,
        createdAt: Date.now(),
      });

      // Keep only recent sessions
      const recentSessions = sessionList.filter(
        (s: any) => Date.now() - s.createdAt < this.SESSION_TIMEOUT_HOURS * 3600 * 1000
      );

      await redisService.set(
        activeSessionsKey,
        JSON.stringify(recentSessions),
        this.SESSION_TIMEOUT_HOURS * 3600
      );
    } catch (error) {
      console.error('Error adding to active sessions:', error);
    }
  }

  /**
   * Update session activity
   */
  private static async updateSessionActivity(sessionId: string, sessionData: any) {
    try {
      const now = Date.now();

      // Update Redis session data
      sessionData.lastUsed = now;
      await redisService.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        this.SESSION_TIMEOUT_HOURS * 3600
      );

      // Update database (less frequently to reduce load)
      const lastUpdate = sessionData.lastDbUpdate || 0;
      if (now - lastUpdate > 300000) { // Update DB every 5 minutes
        await prisma.deviceSession.update({
          where: { sessionId },
          data: { lastUsed: new Date() },
        });

        sessionData.lastDbUpdate = now;
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  /**
   * Invalidate session
   */
  private static invalidateSession(_req: Request, res: Response, reason: string) {
    console.warn('Session invalidated', {
      sessionId: req.headers['x-session-id'],
      userId: req.user?.sub,
      reason,
      timestamp: new Date().toISOString(),
    });

    return res.status(401).json({
      success: false,
      error: 'Session invalid',
      code: 'SESSION_INVALID',
      details: { reason },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Terminate session
   */
  static terminateSession = (sessionId: string, reason: string) => {
    try {
      // Remove from Redis
      await redisService.del(`session:${sessionId}`);

      // Update database
      await prisma.deviceSession.update({
        where: { sessionId },
        data: { isActive: false },
      });

      console.info('Session terminated', {
        sessionId,
        reason,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  /**
   * Cleanup expired session
   */
  private static async cleanupExpiredSession(sessionId: string) {
    try {
      await Promise.all([
        redisService.del(`session:${sessionId}`),
        prisma.deviceSession.update({
          where: { sessionId },
          data: { isActive: false },
        }),
      ]);
    } catch (error) {
      console.error('Error cleaning up expired session:', error);
    }
  }

  /**
   * Log security event
   */
  private static async logSecurityEvent(
    _userId: string,
    eventType: string,
    metadata: any
  ) {
    try {
      await prisma.securityEvent.create({
        data: {
          userId,
          eventType,
          metadata,
          riskLevel: 'medium',
          riskScore: 50,
          riskFactors: [eventType],
        },
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  /**
   * Get user sessions (admin function)
   */
  static getUserSessions = (_userId: string) => {
    try {
      const sessions = await prisma.deviceSession.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        orderBy: { lastUsed: 'desc' },
      });

      return sessions.map(session => ({
        sessionId: session.sessionId,
        deviceId: session.deviceId,
        userAgent: session.userAgent,
        lastUsed: session.lastUsed,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      }));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  };

  /**
   * Terminate all user sessions (admin function)
   */
  static terminateAllUserSessions = (_userId: string, reason: string) => {
    try {
      const sessions = await prisma.deviceSession.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      for (const session of sessions) {
        await this.terminateSession(session.sessionId, reason);
      }

      // Clear active sessions from Redis
      await redisService.del(`active_sessions:${userId}`);

      console.info('All user sessions terminated', {
        userId,
        sessionCount: sessions.length,
        reason,
        timestamp: new Date().toISOString(),
      });

      return sessions.length;
    } catch (error) {
      console.error('Error terminating all user sessions:', error);
      return 0;
    }
  };

  /**
   * Cleanup expired sessions (background job)
   */
  static cleanupExpiredSessions = () => {
    try {
      const expiredSessions = await prisma.deviceSession.findMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { lastUsed: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // 7 days old
          ],
          isActive: true,
        },
      });

      for (const session of expiredSessions) {
        await this.terminateSession(session.sessionId, 'EXPIRED_CLEANUP');
      }

      console.info('Expired sessions cleaned up', {
        count: expiredSessions.length,
        timestamp: new Date().toISOString(),
      });

      return expiredSessions.length;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
      deviceId?: string;
    }
  }
}