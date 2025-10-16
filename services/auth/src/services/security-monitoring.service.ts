import * as crypto from 'crypto';
import { PrismaClient } from '../generated/prisma-client';
import { RedisService } from './redis.service';

const prisma = new PrismaClient();

/**
 * Security Monitoring Service
 * Handles suspicious activity detection, security alerts, and monitoring
 */
export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;
  private redisService: RedisService;

  private constructor() {
    this.redisService = new RedisService();
  }

  public static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  /**
   * Analyze login attempt for suspicious patterns
   */
  async analyzeLoginAttempt(
    prismaClient: PrismaClient,
    attempt: LoginAttempt
  ): Promise<SecurityAnalysis> {
    const riskFactors: RiskFactor[] = [];
    let riskScore = 0;

    // Check for rapid login attempts
    const recentAttempts = await this.getRecentLoginAttempts(
      attempt.ipAddress,
      300
    ); // 5 minutes
    if (recentAttempts > 5) {
      riskFactors.push({
        type: 'rapid_login_attempts',
        severity: 'high',
        value: recentAttempts,
        description: `${recentAttempts} login attempts in 5 minutes`,
      });
      riskScore += 40;
    }

    // Check for failed attempts from same IP
    const failedAttempts = await this.getFailedLoginAttempts(
      attempt.ipAddress,
      3600
    ); // 1 hour
    if (failedAttempts > 10) {
      riskFactors.push({
        type: 'excessive_failed_attempts',
        severity: 'high',
        value: failedAttempts,
        description: `${failedAttempts} failed attempts in 1 hour`,
      });
      riskScore += 35;
    }

    // Check for unusual location (simplified - would use GeoIP in production)
    const isUnusualLocation = await this.checkUnusualLocation(
      attempt.userId,
      attempt.ipAddress
    );
    if (isUnusualLocation) {
      riskFactors.push({
        type: 'unusual_location',
        severity: 'medium',
        value: 1,
        description: 'Login from unusual geographic location',
      });
      riskScore += 25;
    }

    // Check for unusual device
    const isUnusualDevice = await this.checkUnusualDevice(
      attempt.userId,
      attempt.deviceFingerprint
    );
    if (isUnusualDevice) {
      riskFactors.push({
        type: 'unusual_device',
        severity: 'medium',
        value: 1,
        description: 'Login from unrecognized device',
      });
      riskScore += 20;
    }

    // Check for unusual time patterns
    const isUnusualTime = this.checkUnusualTime(attempt.timestamp);
    if (isUnusualTime) {
      riskFactors.push({
        type: 'unusual_time',
        severity: 'low',
        value: 1,
        description: 'Login at unusual time',
      });
      riskScore += 10;
    }

    // Check for concurrent sessions
    const concurrentSessions = await this.getConcurrentSessions(attempt.userId);
    if (concurrentSessions > 5) {
      riskFactors.push({
        type: 'excessive_concurrent_sessions',
        severity: 'medium',
        value: concurrentSessions,
        description: `${concurrentSessions} concurrent active sessions`,
      });
      riskScore += 15;
    }

    const analysis: SecurityAnalysis = {
      riskScore,
      riskLevel: this.calculateRiskLevel(riskScore),
      riskFactors,
      recommendedAction: this.getRecommendedAction(riskScore),
      timestamp: new Date(),
    };

    // Log the security analysis
    await this.logSecurityEvent(prisma, {
      userId: attempt.userId,
      eventType: 'LOGIN_ANALYSIS',
      ipAddress: this.hashIP(attempt.ipAddress),
      deviceFingerprint: attempt.deviceFingerprint,
      riskScore,
      riskLevel: analysis.riskLevel,
      riskFactors: riskFactors.map(rf => rf.type),
      metadata: {
        analysis,
        attempt: {
          ...attempt,
          ipAddress: this.hashIP(attempt.ipAddress), // Hash for privacy
        },
      },
    });

    return analysis;
  }

  /**
   * Monitor token refresh patterns for anomalies
   */
  async monitorTokenRefresh(
    prismaClient: PrismaClient,
    refresh: TokenRefreshAttempt
  ): Promise<SecurityAnalysis> {
    const riskFactors: RiskFactor[] = [];
    let riskScore = 0;

    // Check refresh frequency
    const recentRefreshes = await this.redisService.getCounter(
      `refresh_count:${refresh.userId}:${refresh.deviceId}`
    );

    if (recentRefreshes > 20) {
      // More than 20 refreshes in tracking window
      riskFactors.push({
        type: 'excessive_token_refresh',
        severity: 'high',
        value: recentRefreshes,
        description: `${recentRefreshes} token refreshes in tracking window`,
      });
      riskScore += 45;
    }

    // Check for device fingerprint changes
    const storedFingerprint = await this.redisService.getDeviceSession(
      refresh.userId,
      refresh.deviceId
    );

    if (
      storedFingerprint &&
      storedFingerprint.deviceFingerprint !== refresh.deviceFingerprint
    ) {
      riskFactors.push({
        type: 'device_fingerprint_change',
        severity: 'high',
        value: 1,
        description: 'Device fingerprint changed during session',
      });
      riskScore += 50;
    }

    // Check for IP address changes
    if (
      storedFingerprint &&
      storedFingerprint.ipAddress !== this.hashIP(refresh.ipAddress)
    ) {
      riskFactors.push({
        type: 'ip_address_change',
        severity: 'medium',
        value: 1,
        description: 'IP address changed during session',
      });
      riskScore += 30;
    }

    // Check for rapid successive refreshes
    const lastRefreshTime = await this.redisService.get(
      `last_refresh:${refresh.userId}:${refresh.deviceId}`
    );

    if (lastRefreshTime) {
      const timeDiff = Date.now() - parseInt(lastRefreshTime);
      if (timeDiff < 60000) {
        // Less than 1 minute
        riskFactors.push({
          type: 'rapid_token_refresh',
          severity: 'medium',
          value: timeDiff,
          description: `Token refresh within ${Math.round(timeDiff / 1000)} seconds`,
        });
        riskScore += 25;
      }
    }

    // Update last refresh time
    await this.redisService.set(
      `last_refresh:${refresh.userId}:${refresh.deviceId}`,
      Date.now().toString(),
      3600 // 1 hour
    );

    const analysis: SecurityAnalysis = {
      riskScore,
      riskLevel: this.calculateRiskLevel(riskScore),
      riskFactors,
      recommendedAction: this.getRecommendedAction(riskScore),
      timestamp: new Date(),
    };

    // Log security event
    await this.logSecurityEvent(prisma, {
      userId: refresh.userId,
      eventType: 'TOKEN_REFRESH_ANALYSIS',
      deviceId: refresh.deviceId,
      ipAddress: this.hashIP(refresh.ipAddress),
      deviceFingerprint: refresh.deviceFingerprint,
      riskScore,
      riskLevel: analysis.riskLevel,
      riskFactors: riskFactors.map(rf => rf.type),
      metadata: { analysis, refresh },
    });

    return analysis;
  }

  /**
   * Get security metrics and statistics
   */
  async getSecurityMetrics(
    prismaClient: PrismaClient,
    timeRange: { from: Date; to: Date }
  ): Promise<SecurityMetrics> {
    const [
      totalEvents,
      highRiskEvents,
      blockedAttempts,
      suspiciousActivities,
      topRiskFactors,
      riskDistribution,
    ] = await Promise.all([
      prisma.securityEvent.count({
        where: {
          createdAt: { gte: timeRange.from, lte: timeRange.to },
        },
      }),
      prisma.securityEvent.count({
        where: {
          createdAt: { gte: timeRange.from, lte: timeRange.to },
          riskLevel: 'high',
        },
      }),
      prisma.securityEvent.count({
        where: {
          createdAt: { gte: timeRange.from, lte: timeRange.to },
          eventType: 'ACCESS_BLOCKED',
        },
      }),
      prisma.securityEvent.count({
        where: {
          createdAt: { gte: timeRange.from, lte: timeRange.to },
          eventType: { in: ['SUSPICIOUS_ACTIVITY', 'LOGIN_ANALYSIS'] },
          riskScore: { gte: 50 },
        },
      }),
      this.getTopRiskFactors(prisma, timeRange),
      this.getRiskDistribution(prisma, timeRange),
    ]);

    return {
      totalEvents,
      highRiskEvents,
      blockedAttempts,
      suspiciousActivities,
      topRiskFactors,
      riskDistribution,
      timeRange,
    };
  }

  /**
   * Check if IP address is from unusual location for user
   */
  private async checkUnusualLocation(
    userId?: string,
    ipAddress?: string
  ): Promise<boolean> {
    if (!userId || !ipAddress) return false;

    // In production, this would use GeoIP lookup and compare with user's historical locations
    // For now, return false (no unusual location detected)
    return false;
  }

  /**
   * Check if device is unusual for user
   */
  private async checkUnusualDevice(
    userId?: string,
    deviceFingerprint?: string
  ): Promise<boolean> {
    if (!userId || !deviceFingerprint) return false;

    // Check if this device fingerprint has been seen before for this user
    const knownDevice = await this.redisService.get(
      `known_device:${userId}:${deviceFingerprint}`
    );

    if (!knownDevice) {
      // Mark as known device for future reference
      await this.redisService.set(
        `known_device:${userId}:${deviceFingerprint}`,
        '1',
        30 * 24 * 60 * 60 // 30 days
      );
      return true; // New device
    }

    return false;
  }

  /**
   * Check if login time is unusual
   */
  private checkUnusualTime(timestamp: Date): boolean {
    const hour = timestamp.getHours();
    // Consider 2 AM to 6 AM as unusual hours
    return hour >= 2 && hour <= 6;
  }

  /**
   * Get recent login attempts count
   */
  private async getRecentLoginAttempts(
    ipAddress: string,
    windowSeconds: number
  ): Promise<number> {
    const key = `login_attempts:${this.hashIP(ipAddress)}`;
    return this.redisService.getCounter(key);
  }

  /**
   * Get failed login attempts count
   */
  private async getFailedLoginAttempts(
    ipAddress: string,
    windowSeconds: number
  ): Promise<number> {
    const key = `failed_attempts:${this.hashIP(ipAddress)}`;
    return this.redisService.getCounter(key);
  }

  /**
   * Get concurrent sessions count
   */
  private async getConcurrentSessions(userId?: string): Promise<number> {
    if (!userId) return 0;

    // This would query active sessions from database or Redis
    // For now, return 0
    return 0;
  }

  /**
   * Calculate risk level from score
   */
  private calculateRiskLevel(
    riskScore: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  /**
   * Get recommended action based on risk score
   */
  private getRecommendedAction(riskScore: number): string {
    if (riskScore >= 80) return 'block_access';
    if (riskScore >= 60) return 'require_additional_verification';
    if (riskScore >= 30) return 'monitor_closely';
    return 'allow';
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
   * Log security event
   */
  private async logSecurityEvent(
    prismaClient: PrismaClient,
    event: SecurityEventData
  ): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          userId: event.userId,
          eventType: event.eventType,
          deviceId: event.deviceId,
          ipAddress: event.ipAddress,
          deviceFingerprint: event.deviceFingerprint,
          riskScore: event.riskScore,
          riskLevel: event.riskLevel,
          riskFactors: event.riskFactors,
          metadata: event.metadata || {},
        },
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Get top risk factors from security events
   */
  private async getTopRiskFactors(
    prismaClient: PrismaClient,
    timeRange: { from: Date; to: Date }
  ): Promise<Array<{ factor: string; count: number }>> {
    // This would require a more complex query to extract risk factors from the array
    // For now, return empty array
    return Promise.resolve([]);
  }

  /**
   * Get risk score distribution
   */
  private async getRiskDistribution(
    prismaClient: PrismaClient,
    timeRange: { from: Date; to: Date }
  ): Promise<Array<{ riskLevel: string; count: number }>> {
    const distribution = await prisma.securityEvent.groupBy({
      by: ['riskLevel'],
      where: {
        createdAt: { gte: timeRange.from, lte: timeRange.to },
      },
      _count: { id: true },
    });

    return distribution.map((d: any) => ({
      riskLevel: d.riskLevel || 'unknown',
      count: d._count.id,
    }));
  }
}

// Type definitions
export interface LoginAttempt {
  userId?: string;
  email?: string;
  ipAddress: string;
  deviceFingerprint?: string;
  userAgent?: string;
  success: boolean;
  timestamp: Date;
}

export interface TokenRefreshAttempt {
  userId: string;
  deviceId: string;
  ipAddress: string;
  deviceFingerprint?: string;
  timestamp: Date;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  value: number;
  description: string;
}

export interface SecurityAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  recommendedAction: string;
  timestamp: Date;
}

export interface SecurityMetrics {
  totalEvents: number;
  highRiskEvents: number;
  blockedAttempts: number;
  suspiciousActivities: number;
  topRiskFactors: Array<{ factor: string; count: number }>;
  riskDistribution: Array<{ riskLevel: string; count: number }>;
  timeRange: { from: Date; to: Date };
}

export interface SecurityEventData {
  userId?: string;
  eventType: string;
  deviceId?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  riskScore?: number;
  riskLevel?: string;
  riskFactors?: string[];
  metadata?: Record<string, any>;
}
