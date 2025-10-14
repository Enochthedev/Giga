import { Request, Response } from 'express';
import { SecurityMonitoringService } from '../services/security-monitoring.service';
import { TokenManagementService } from '../services/token-management.service';

/**
 * Token Analytics Controller
 * Provides endpoints for token analytics, security monitoring, and device management
 */
export class TokenAnalyticsController {
  private tokenManagementService = TokenManagementService.getInstance();
  private securityMonitoringService = SecurityMonitoringService.getInstance();

  /**
   * Get token usage analytics for the authenticated user
   */
  async getUserTokenAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { days = 30 } = req.query;
      const timeRange = {
        from: new Date(
          Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000
        ),
        to: new Date(),
      };

      const analytics = await this.tokenManagementService.getTokenAnalytics(
        req._prisma,
        req.user.sub,
        timeRange
      );

      res.json({
        success: true,
        data: {
          analytics,
          userId: req.user.sub,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get user token analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get token analytics',
        code: 'ANALYTICS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get security metrics for the authenticated user
   */
  async getUserSecurityMetrics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { days = 30 } = req.query;
      const timeRange = {
        from: new Date(
          Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000
        ),
        to: new Date(),
      };

      const metrics = await this.securityMonitoringService.getSecurityMetrics(
        req._prisma,
        timeRange
      );

      res.json({
        success: true,
        data: {
          metrics,
          userId: req.user.sub,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get user security metrics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get security metrics',
        code: 'SECURITY_METRICS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get active device sessions for the authenticated user
   */
  async getActiveDevices(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get active refresh tokens with device information
      const activeTokens = await req._prisma.refreshToken.findMany({
        where: {
          userId: req.user.sub,
          expiresAt: { gt: new Date() },
        },
        select: {
          id: true,
          deviceId: true,
          sessionId: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get device sessions from database
      const deviceSessions = await req._prisma.deviceSession.findMany({
        where: {
          userId: req.user.sub,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        select: {
          deviceId: true,
          sessionId: true,
          userAgent: true,
          lastUsed: true,
          createdAt: true,
        },
        orderBy: { lastUsed: 'desc' },
      });

      // Combine and format the data
      const devices = activeTokens.map(token => {
        const session = deviceSessions.find(s => s.deviceId === token.deviceId);
        return {
          deviceId: token.deviceId,
          sessionId: token.sessionId,
          userAgent: token.userAgent,
          lastUsed: session?.lastUsed || token.createdAt,
          createdAt: token.createdAt,
          expiresAt: token.expiresAt,
          isCurrentDevice: token.deviceId === this.getCurrentDeviceId(req),
        };
      });

      res.json({
        success: true,
        data: {
          devices,
          totalActiveDevices: devices.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get active devices error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get active devices',
        code: 'ACTIVE_DEVICES_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Revoke tokens for a specific device
   */
  async revokeDevice(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { deviceId } = req.params;

      if (!deviceId) {
        res.status(400).json({
          success: false,
          error: 'Device ID is required',
          code: 'DEVICE_ID_REQUIRED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Revoke tokens for the specific device
      await this.tokenManagementService.revokeTokens(req._prisma, req.user.sub, {
        deviceId,
        reason: 'user_revoked_device',
      });

      res.json({
        success: true,
        message: 'Device tokens revoked successfully',
        data: {
          deviceId,
          revokedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Revoke device error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke device',
        code: 'REVOKE_DEVICE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Revoke all tokens except current device
   */
  async revokeAllOtherDevices(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const currentDeviceId = this.getCurrentDeviceId(req);

      // Get all refresh tokens except current device
      const tokensToRevoke = await req._prisma.refreshToken.findMany({
        where: {
          userId: req.user.sub,
          deviceId: { not: currentDeviceId },
        },
      });

      // Revoke all other devices
      for (const token of tokensToRevoke) {
        if (token.deviceId) {
          await this.tokenManagementService.revokeTokens(
            req._prisma,
            req.user.sub,
            {
              deviceId: token.deviceId,
              reason: 'user_revoked_other_devices',
            }
          );
        }
      }

      res.json({
        success: true,
        message: 'All other device tokens revoked successfully',
        data: {
          revokedDevices: tokensToRevoke.length,
          revokedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Revoke all other devices error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke other devices',
        code: 'REVOKE_OTHER_DEVICES_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get token refresh rate limits status
   */
  getRefreshRateLimits(req: Request, res: Response): void {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const currentDeviceId = this.getCurrentDeviceId(req);

      // This would get rate limit information from Redis
      // For now, return basic information
      const rateLimitInfo = {
        deviceId: currentDeviceId,
        maxRefreshesPerWindow: 10,
        windowDurationMinutes: 5,
        currentRefreshCount: 0, // Would be fetched from Redis
        windowResetTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      };

      res.json({
        success: true,
        data: {
          rateLimitInfo,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get refresh rate limits error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get rate limit information',
        code: 'RATE_LIMIT_INFO_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Admin endpoint: Get system-wide token analytics
   */
  async getSystemTokenAnalytics(req: Request, res: Response): Promise<void> {
    try {
      // Check admin permissions
      if (!req.user || !req.user.roles?.includes('ADMIN')) {
        res.status(403).json({
          success: false,
          error: 'Admin access required',
          code: 'ADMIN_ACCESS_REQUIRED',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { days = 30 } = req.query;
      const timeRange = {
        from: new Date(
          Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000
        ),
        to: new Date(),
      };

      const [tokenAnalytics, securityMetrics] = await Promise.all([
        this.tokenManagementService.getTokenAnalytics(
          req._prisma,
          undefined,
          timeRange
        ),
        this.securityMonitoringService.getSecurityMetrics(
          req._prisma,
          timeRange
        ),
      ]);

      res.json({
        success: true,
        data: {
          tokenAnalytics,
          securityMetrics,
          timeRange,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get system token analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get system analytics',
        code: 'SYSTEM_ANALYTICS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get current device ID from request
   */
  private getCurrentDeviceId(req: Request): string | undefined {
    if (req.deviceInfo) {
      const crypto = require('crypto');
      const deviceString = `${req.deviceInfo.userAgent}|${req.deviceInfo.platform}|${req.deviceInfo.language}`;
      return crypto
        .createHash('sha256')
        .update(deviceString)
        .digest('hex')
        .substring(0, 16);
    }
    return undefined;
  }
}
