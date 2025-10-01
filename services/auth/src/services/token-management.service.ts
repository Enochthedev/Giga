import * as crypto from 'crypto';
import { PrismaClient } from '../generated/prisma-client';
import { JWTService } from './jwt.service';
import { RedisService } from './redis.service';

/**
 * Enhanced Token Management Service
 * Handles device-based tokens, blacklisting, analytics, and security monitoring
 */
export class TokenManagementService {
  private static instance: TokenManagementService;
  private redisService: RedisService;
  private jwtService: JWTService;

  private constructor() {
    this.redisService = new RedisService();
    this.jwtService = JWTService.getInstance();
  }

  public static getInstance(): TokenManagementService {
    if (!TokenManagementService.instance) {
      TokenManagementService.instance = new TokenManagementService();
    }
    return TokenManagementService.instance;
  }

  /**
   * Generate device-specific tokens with enhanced tracking
   */
  async generateDeviceTokens(
    _prisma: PrismaClient,
    user: any,
    deviceInfo: DeviceInfo,
    ipAddress: string
  ): Promise<TokenPair> {
    const deviceId = this.generateDeviceId(deviceInfo);
    const sessionId = crypto.randomUUID();

    // Create device fingerprint for security
    const deviceFingerprint = this.createDeviceFingerprint(
      deviceInfo,
      ipAddress
    );

    // Generate tokens with device context
    const accessToken = this.jwtService.generateAccessToken(user, {
      deviceId,
      sessionId,
      deviceFingerprint,
      ipAddress: this.hashIP(ipAddress),
    });

    const refreshToken = this.jwtService.generateRefreshToken();

    // Store device session in Redis
    await this.storeDeviceSession(user.id, deviceId, {
      sessionId,
      deviceInfo,
      deviceFingerprint,
      ipAddress: this.hashIP(ipAddress),
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    });

    // Store refresh token with device association
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        deviceId,
        sessionId,
        ipAddress: this.hashIP(ipAddress),
        userAgent: deviceInfo.userAgent,
      },
    });

    // Log token generation for analytics
    await this.logTokenEvent(prisma, {
      userId: user.id,
      eventType: 'TOKEN_GENERATED',
      deviceId,
      sessionId,
      ipAddress: this.hashIP(ipAddress),
      userAgent: deviceInfo.userAgent,
      metadata: {
        tokenType: 'access_refresh_pair',
        deviceFingerprint,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
      deviceId,
      sessionId,
    };
  }

  /**
   * Validate and refresh tokens with device verification
   */
  async refreshDeviceToken(
    _prisma: PrismaClient,
    refreshToken: string,
    deviceInfo: DeviceInfo,
    ipAddress: string
  ): Promise<TokenPair | null> {
    // Find refresh token with device info
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { roles: { include: { role: true } } } } },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      await this.logTokenEvent(prisma, {
        eventType: 'TOKEN_REFRESH_FAILED',
        ipAddress: this.hashIP(ipAddress),
        userAgent: deviceInfo.userAgent,
        metadata: {
          reason: !tokenRecord ? 'token_not_found' : 'token_expired',
          refreshToken: this.hashToken(refreshToken),
        },
      });
      return null;
    }

    // Verify device consistency
    const deviceId = this.generateDeviceId(deviceInfo);
    const currentFingerprint = this.createDeviceFingerprint(
      deviceInfo,
      ipAddress
    );

    // Get stored device session
    const storedSession = await this.getDeviceSession(
      tokenRecord.userId,
      deviceId
    );

    // Check for suspicious activity
    const suspiciousActivity = await this.detectSuspiciousActivity(
      tokenRecord.userId,
      deviceId,
      currentFingerprint,
      ipAddress,
      storedSession
    );

    if (suspiciousActivity.isSuspicious) {
      await this.handleSuspiciousActivity(prisma, {
        userId: tokenRecord.userId,
        deviceId,
        ipAddress,
        suspiciousActivity,
        action: 'token_refresh_blocked',
      });
      return null;
    }

    // Check refresh rate limiting
    const rateLimitKey = `refresh_rate:${tokenRecord.userId}:${deviceId}`;
    const refreshCount = await this.redisService.incrementRateLimit(
      rateLimitKey,
      300
    ); // 5 minutes

    if (refreshCount > 10) {
      // Max 10 refreshes per 5 minutes per device
      await this.logTokenEvent(prisma, {
        userId: tokenRecord.userId,
        eventType: 'REFRESH_RATE_LIMITED',
        deviceId,
        ipAddress: this.hashIP(ipAddress),
        userAgent: deviceInfo.userAgent,
        metadata: {
          refreshCount,
          rateLimitWindow: 300,
        },
      });
      return null;
    }

    // Generate new tokens
    const newTokens = await this.generateDeviceTokens(
      prisma,
      tokenRecord.user,
      deviceInfo,
      ipAddress
    );

    // Revoke old refresh token
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    // Update device session
    await this.updateDeviceSession(tokenRecord.userId, deviceId, {
      lastUsed: new Date().toISOString(),
      refreshCount: (storedSession?.refreshCount || 0) + 1,
    });

    return newTokens;
  }

  /**
   * Blacklist tokens and revoke device sessions
   */
  async revokeTokens(
    _prisma: PrismaClient,
    _userId: string,
    options: {
      deviceId?: string;
      sessionId?: string;
      allDevices?: boolean;
      reason: string;
    }
  ): Promise<void> {
    const { deviceId, sessionId, allDevices, reason } = options;

    if (allDevices) {
      // Revoke all user tokens
      const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId },
      });

      // Blacklist all access tokens (would need to be implemented in JWT service)
      for (const token of refreshTokens) {
        await this.blacklistRefreshToken(token.token);
      }

      // Delete all refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      // Clear all device sessions
      await this.clearAllDeviceSessions(userId);

      await this.logTokenEvent(prisma, {
        userId,
        eventType: 'ALL_TOKENS_REVOKED',
        metadata: { reason, tokenCount: refreshTokens.length },
      });
    } else if (deviceId) {
      // Revoke tokens for specific device
      const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId, deviceId },
      });

      for (const token of refreshTokens) {
        await this.blacklistRefreshToken(token.token);
      }

      await prisma.refreshToken.deleteMany({
        where: { userId, deviceId },
      });

      await this.clearDeviceSession(userId, deviceId);

      await this.logTokenEvent(prisma, {
        userId,
        eventType: 'DEVICE_TOKENS_REVOKED',
        deviceId,
        metadata: { reason, tokenCount: refreshTokens.length },
      });
    } else if (sessionId) {
      // Revoke specific session
      const refreshToken = await prisma.refreshToken.findFirst({
        where: { userId, sessionId },
      });

      if (refreshToken) {
        await this.blacklistRefreshToken(refreshToken.token);
        await prisma.refreshToken.delete({
          where: { id: refreshToken.id },
        });

        await this.logTokenEvent(prisma, {
          userId,
          eventType: 'SESSION_TOKEN_REVOKED',
          sessionId,
          metadata: { reason },
        });
      }
    }
  }

  /**
   * Get token usage analytics
   */
  async getTokenAnalytics(
    _prisma: PrismaClient,
    userId?: string,
    timeRange: { from: Date; to: Date } = {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    }
  ): Promise<TokenAnalytics> {
    const whereClause = {
      createdAt: {
        gte: timeRange.from,
        lte: timeRange.to,
      },
      ...(userId && { userId }),
    };

    const [
      totalEvents,
      tokenGenerations,
      tokenRefreshes,
      suspiciousEvents,
      rateLimitEvents,
      deviceBreakdown,
    ] = await Promise.all([
      prisma.tokenEvent.count({ where: whereClause }),
      prisma.tokenEvent.count({
        where: { ...whereClause, eventType: 'TOKEN_GENERATED' },
      }),
      prisma.tokenEvent.count({
        where: { ...whereClause, eventType: 'TOKEN_REFRESHED' },
      }),
      prisma.tokenEvent.count({
        where: { ...whereClause, eventType: 'SUSPICIOUS_ACTIVITY' },
      }),
      prisma.tokenEvent.count({
        where: { ...whereClause, eventType: 'REFRESH_RATE_LIMITED' },
      }),
      prisma.tokenEvent.groupBy({
        by: ['deviceId'],
        where: whereClause,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalEvents,
      tokenGenerations,
      tokenRefreshes,
      suspiciousEvents,
      rateLimitEvents,
      deviceBreakdown: deviceBreakdown.map(d => ({
        deviceId: d.deviceId || 'unknown',
        eventCount: d._count.id,
      })),
      timeRange,
    };
  }

  /**
   * Detect suspicious token activity
   */
  private async detectSuspiciousActivity(
    _userId: string,
    deviceId: string,
    currentFingerprint: string,
    ipAddress: string,
    storedSession: any
  ): Promise<SuspiciousActivityResult> {
    const suspiciousIndicators: string[] = [];
    let riskScore = 0;

    // Check device fingerprint consistency
    if (
      storedSession &&
      storedSession.deviceFingerprint !== currentFingerprint
    ) {
      suspiciousIndicators.push('device_fingerprint_mismatch');
      riskScore += 30;
    }

    // Check IP address changes
    const hashedIP = this.hashIP(ipAddress);
    if (storedSession && storedSession.ipAddress !== hashedIP) {
      suspiciousIndicators.push('ip_address_change');
      riskScore += 20;
    }

    // Check for rapid token refreshes
    const recentRefreshes = await this.redisService.get(
      `refresh_rate:${userId}:${deviceId}`
    );
    if (recentRefreshes && parseInt(recentRefreshes) > 5) {
      suspiciousIndicators.push('rapid_token_refresh');
      riskScore += 25;
    }

    // Check for multiple concurrent sessions
    const activeSessions = await this.getActiveDeviceSessions(userId);
    if (activeSessions.length > 5) {
      suspiciousIndicators.push('excessive_concurrent_sessions');
      riskScore += 15;
    }

    // Check for unusual time patterns
    if (storedSession) {
      const lastUsed = new Date(storedSession.lastUsed);
      const timeDiff = Date.now() - lastUsed.getTime();
      if (timeDiff < 60000) {
        // Less than 1 minute
        suspiciousIndicators.push('rapid_successive_requests');
        riskScore += 10;
      }
    }

    return {
      isSuspicious: riskScore >= 50,
      riskScore,
      indicators: suspiciousIndicators,
    };
  }

  /**
   * Handle suspicious activity
   */
  private async handleSuspiciousActivity(
    _prisma: PrismaClient,
    activity: {
      _userId: string;
      deviceId: string;
      ipAddress: string;
      suspiciousActivity: SuspiciousActivityResult;
      action: string;
    }
  ): Promise<void> {
    await this.logTokenEvent(prisma, {
      userId: activity.userId,
      eventType: 'SUSPICIOUS_ACTIVITY',
      deviceId: activity.deviceId,
      ipAddress: this.hashIP(activity.ipAddress),
      metadata: {
        riskScore: activity.suspiciousActivity.riskScore,
        indicators: activity.suspiciousActivity.indicators,
        action: activity.action,
      },
    });

    // If risk score is very high, revoke all tokens
    if (activity.suspiciousActivity.riskScore >= 80) {
      await this.revokeTokens(prisma, activity.userId, {
        allDevices: true,
        reason: 'high_risk_suspicious_activity',
      });
    }
  }

  /**
   * Generate device ID from device info
   */
  private generateDeviceId(deviceInfo: DeviceInfo): string {
    const deviceString = `${deviceInfo.userAgent}|${deviceInfo.platform}|${deviceInfo.language}`;
    return crypto
      .createHash('sha256')
      .update(deviceString)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Create device fingerprint
   */
  private createDeviceFingerprint(
    deviceInfo: DeviceInfo,
    ipAddress: string
  ): string {
    const fingerprintData = {
      userAgent: deviceInfo.userAgent,
      platform: deviceInfo.platform,
      language: deviceInfo.language,
      timezone: deviceInfo.timezone,
      screen: deviceInfo.screen,
      ipSubnet: this.getIPSubnet(ipAddress),
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprintData))
      .digest('hex')
      .substring(0, 32);
  }

  /**
   * Hash IP address for privacy
   */
  private hashIP(ipAddress: string): string {
    return crypto
      .createHash('sha256')
      .update(ipAddress)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Get IP subnet for fingerprinting
   */
  private getIPSubnet(ipAddress: string): string {
    // For IPv4, use first 3 octets
    const parts = ipAddress.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    // For IPv6, use first 64 bits
    if (ipAddress.includes(':')) {
      const parts = ipAddress.split(':');
      return parts.slice(0, 4).join(':') + '::';
    }
    return 'unknown';
  }

  /**
   * Hash token for logging
   */
  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .substring(0, 16);
  }

  // Redis operations for device sessions
  private async storeDeviceSession(
    _userId: string,
    deviceId: string,
    sessionData: any
  ): Promise<void> {
    const _key = `device_session:${userId}:${deviceId}`;
    await this.redisService.set(
      key,
      JSON.stringify(sessionData),
      7 * 24 * 60 * 60
    ); // 7 days
  }

  private async getDeviceSession(
    _userId: string,
    deviceId: string
  ): Promise<any> {
    const _key = `device_session:${userId}:${deviceId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  private async updateDeviceSession(
    _userId: string,
    deviceId: string,
    updates: any
  ): Promise<void> {
    const existing = await this.getDeviceSession(userId, deviceId);
    if (existing) {
      const updated = { ...existing, ...updates };
      await this.storeDeviceSession(userId, deviceId, updated);
    }
  }

  private async clearDeviceSession(
    _userId: string,
    deviceId: string
  ): Promise<void> {
    const _key = `device_session:${userId}:${deviceId}`;
    await this.redisService.del(key);
  }

  private async clearAllDeviceSessions(_userId: string): Promise<void> {
    // This would require scanning Redis keys, which is expensive
    // In production, consider using a different data structure
    const _pattern = `device_session:${userId}:*`;
    // Implementation would depend on Redis client capabilities
  }

  private async getActiveDeviceSessions(_userId: string): Promise<any[]> {
    // This would require scanning Redis keys
    // In production, consider maintaining a set of active device IDs
    return [];
  }

  private async blacklistRefreshToken(token: string): Promise<void> {
    const _key = `blacklisted_refresh:${this.hashToken(token)}`;
    await this.redisService.set(key, '1', 7 * 24 * 60 * 60); // 7 days
  }

  private async logTokenEvent(
    _prisma: PrismaClient,
    event: TokenEventData
  ): Promise<void> {
    try {
      await prisma.tokenEvent.create({
        data: {
          userId: event.userId,
          eventType: event.eventType,
          deviceId: event.deviceId,
          sessionId: event.sessionId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          metadata: event.metadata || {},
        },
      });
    } catch (error) {
      console.error('Failed to log token event:', error);
    }
  }
}

// Type definitions
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  timezone?: string;
  screen?: {
    width: number;
    height: number;
  };
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  deviceId: string;
  sessionId: string;
}

export interface SuspiciousActivityResult {
  isSuspicious: boolean;
  riskScore: number;
  indicators: string[];
}

export interface TokenAnalytics {
  totalEvents: number;
  tokenGenerations: number;
  tokenRefreshes: number;
  suspiciousEvents: number;
  rateLimitEvents: number;
  deviceBreakdown: Array<{
    deviceId: string;
    eventCount: number;
  }>;
  timeRange: {
    from: Date;
    to: Date;
  };
}

export interface TokenEventData {
  userId?: string;
  eventType: string;
  deviceId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}
