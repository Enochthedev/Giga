import { NextFunction, Request, Response } from 'express';
import { redisService } from '../services/redis.service';

/**
 * IP-based access control and geolocation middleware
 */
export class IPAccessControlMiddleware {
  private static readonly SUSPICIOUS_IP_THRESHOLD = 100; // requests per hour
  private static readonly GEOLOCATION_CACHE_TTL = 3600; // 1 hour

  /**
   * IP whitelist/blacklist checking
   */
  static checkIPAccess = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientIp = req.clientIp || req.ip;

      if (!clientIp || clientIp === 'unknown') {
        console.warn('Unable to determine client IP address');
        return next();
      }

      // Check IP blacklist
      const isBlacklisted = await this.isIPBlacklisted(clientIp);
      if (isBlacklisted) {
        console.warn(`Blocked request from blacklisted IP: ${clientIp}`, {
          path: req.path,
          method: req.method,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
        });

        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'IP_BLACKLISTED',
          details: {
            reason:
              'Your IP address has been blocked due to suspicious activity',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check for suspicious activity patterns
      const suspiciousActivity = await this.checkSuspiciousActivity(
        clientIp,
        req
      );
      if (suspiciousActivity.isSuspicious) {
        console.warn(`Suspicious activity detected from IP: ${clientIp}`, {
          ...suspiciousActivity,
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString(),
        });

        // Add to monitoring but don't block immediately
        await this.recordSuspiciousActivity(clientIp, suspiciousActivity);
      }

      // Get and cache geolocation data
      const geoData = await this.getGeolocationData(clientIp);
      if (geoData) {
        req.geoLocation = geoData;

        // Check for high-risk countries (configurable)
        if (this.isHighRiskLocation(geoData)) {
          console.warn(`Request from high-risk location: ${clientIp}`, {
            country: geoData.country,
            region: geoData.region,
            city: geoData.city,
            path: req.path,
            timestamp: new Date().toISOString(),
          });

          // Add additional security headers for high-risk locations
          res.setHeader('X-Security-Level', 'high');
          res.setHeader('X-Geo-Risk', 'elevated');
        }
      }

      // Track IP usage for analytics
      await this.trackIPUsage(clientIp, req);

      next();
    } catch (error) {
      console.error('IP access control error:', error);
      next(); // Continue on error to avoid blocking legitimate users
    }
  };

  /**
   * Check if IP is blacklisted
   */
  private static async isIPBlacklisted(ip: string): Promise<boolean> {
    try {
      const blacklistKey = `ip_blacklist:${ip}`;
      const result = await redisService.get(blacklistKey);
      return !!result;
    } catch (error) {
      console.error('Error checking IP blacklist:', error);
      return false;
    }
  }

  /**
   * Check for suspicious activity patterns
   */
  private static async checkSuspiciousActivity(
    ip: string,
    req: Request
  ): Promise<{ isSuspicious: boolean; reasons: string[]; score: number }> {
    const reasons: string[] = [];
    let score = 0;

    try {
      // Check request frequency
      const requestKey = `ip_requests:${ip}`;
      const requestCount = await redisService.incrementRateLimit(
        requestKey,
        3600
      );

      if (requestCount > this.SUSPICIOUS_IP_THRESHOLD) {
        reasons.push('High request frequency');
        score += 30;
      }

      // Check for bot-like behavior
      const userAgent = req.headers['user-agent'] || '';
      if (this.isBotUserAgent(userAgent)) {
        reasons.push('Bot-like user agent');
        score += 20;
      }

      // Check for missing or suspicious headers
      if (!req.headers['accept-language']) {
        reasons.push('Missing Accept-Language header');
        score += 10;
      }

      if (!req.headers['accept']) {
        reasons.push('Missing Accept header');
        score += 10;
      }

      // Check for rapid endpoint switching
      const endpointKey = `ip_endpoints:${ip}`;
      const endpoints = await redisService.get(endpointKey);
      const endpointList = endpoints ? JSON.parse(endpoints) : [];

      endpointList.push({
        path: req.path,
        timestamp: Date.now(),
      });

      // Keep only last 10 minutes of data
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      const recentEndpoints = endpointList.filter(
        (e: any) => e.timestamp > tenMinutesAgo
      );

      if (recentEndpoints.length > 50) {
        reasons.push('Rapid endpoint switching');
        score += 25;
      }

      await redisService.set(
        endpointKey,
        JSON.stringify(recentEndpoints.slice(-100)), // Keep last 100 entries
        600 // 10 minutes
      );

      // Check for authentication endpoint abuse
      if (req.path.includes('/auth/') && requestCount > 20) {
        reasons.push('Authentication endpoint abuse');
        score += 40;
      }

      return {
        isSuspicious: score >= 50,
        reasons,
        score,
      };
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
      return { isSuspicious: false, reasons: [], score: 0 };
    }
  }

  /**
   * Check if user agent appears to be a bot
   */
  private static isBotUserAgent(userAgent: string): boolean {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http/i,
      /postman/i,
      /insomnia/i,
      /httpie/i,
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Get geolocation data for IP (mock implementation)
   */
  private static async getGeolocationData(
    ip: string
  ): Promise<GeolocationData | null> {
    try {
      // Skip geolocation for local/private IPs
      if (this.isPrivateIP(ip)) {
        return {
          ip,
          country: 'Local',
          region: 'Local',
          city: 'Local',
          timezone: 'UTC',
          isp: 'Local',
          isVPN: false,
          isProxy: false,
          riskScore: 0,
        };
      }

      const cacheKey = `geo:${ip}`;
      const cached = await redisService.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // Mock geolocation data (in production, use a real service like MaxMind or IPinfo)
      const mockGeoData: GeolocationData = {
        ip,
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC',
        isp: 'Unknown ISP',
        isVPN: Math.random() > 0.9, // 10% chance of VPN detection
        isProxy: Math.random() > 0.95, // 5% chance of proxy detection
        riskScore: Math.floor(Math.random() * 100),
      };

      // Cache for 1 hour
      await redisService.set(
        cacheKey,
        JSON.stringify(mockGeoData),
        this.GEOLOCATION_CACHE_TTL
      );

      return mockGeoData;
    } catch (error) {
      console.error('Error getting geolocation data:', error);
      return null;
    }
  }

  /**
   * Check if IP is private/local
   */
  private static isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^::1$/,
      /^localhost$/,
    ];

    return privateRanges.some(range => range.test(ip));
  }

  /**
   * Check if location is considered high-risk
   */
  private static isHighRiskLocation(geoData: GeolocationData): boolean {
    // Configurable high-risk indicators
    const highRiskCountries = ['Unknown']; // Add actual high-risk countries as needed
    const highRiskScore = 70;

    return (
      highRiskCountries.includes(geoData.country) ||
      geoData.riskScore > highRiskScore ||
      geoData.isVPN ||
      geoData.isProxy
    );
  }

  /**
   * Record suspicious activity for monitoring
   */
  private static async recordSuspiciousActivity(
    ip: string,
    activity: { reasons: string[]; score: number }
  ) {
    try {
      const activityKey = `suspicious_activity:${ip}`;
      const activityData = {
        ip,
        reasons: activity.reasons,
        score: activity.score,
        timestamp: Date.now(),
      };

      await redisService.set(
        activityKey,
        JSON.stringify(activityData),
        3600 // 1 hour
      );

      // If score is very high, consider temporary blocking
      if (activity.score >= 80) {
        await this.temporaryBlock(ip, activity.score);
      }
    } catch (error) {
      console.error('Error recording suspicious activity:', error);
    }
  }

  /**
   * Temporarily block IP for suspicious activity
   */
  private static async temporaryBlock(ip: string, score: number) {
    try {
      const blockDuration = Math.min(score * 60, 3600); // Max 1 hour block
      const blockKey = `temp_block:${ip}`;

      await redisService.set(
        blockKey,
        JSON.stringify({
          blockedAt: Date.now(),
          score,
          reason: 'Suspicious activity',
        }),
        blockDuration
      );

      console.warn(
        `Temporarily blocked IP ${ip} for ${blockDuration} seconds`,
        {
          score,
          duration: blockDuration,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error temporarily blocking IP:', error);
    }
  }

  /**
   * Track IP usage for analytics
   */
  private static async trackIPUsage(ip: string, req: Request) {
    try {
      const usageKey = `ip_usage:${ip}`;
      const usage = {
        lastSeen: Date.now(),
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
      };

      await redisService.set(
        usageKey,
        JSON.stringify(usage),
        86400 // 24 hours
      );
    } catch (error) {
      console.error('Error tracking IP usage:', error);
    }
  }

  /**
   * Add IP to blacklist (admin function)
   */
  static blacklistIP = async (
    ip: string,
    reason: string,
    adminUserId: string,
    duration?: number
  ) => {
    try {
      const blacklistKey = `ip_blacklist:${ip}`;
      const blacklistData = {
        ip,
        reason,
        adminUserId,
        blacklistedAt: Date.now(),
      };

      if (duration) {
        await redisService.set(
          blacklistKey,
          JSON.stringify(blacklistData),
          duration
        );
      } else {
        await redisService.set(blacklistKey, JSON.stringify(blacklistData));
      }

      console.warn(`IP blacklisted: ${ip}`, {
        reason,
        adminUserId,
        duration,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error blacklisting IP:', error);
      return false;
    }
  };

  /**
   * Remove IP from blacklist (admin function)
   */
  static removeFromBlacklist = (ip: string, adminUserId: string) => {
    try {
      const blacklistKey = `ip_blacklist:${ip}`;
      await redisService.del(blacklistKey);

      console.info(`IP removed from blacklist: ${ip}`, {
        adminUserId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error removing IP from blacklist:', error);
      return false;
    }
  };

  /**
   * Get IP analytics data
   */
  static getIPAnalytics = (ip: string) => {
    try {
      const [usage, suspicious, blacklist, geoData] = await Promise.all([
        redisService.get(`ip_usage:${ip}`),
        redisService.get(`suspicious_activity:${ip}`),
        redisService.get(`ip_blacklist:${ip}`),
        this.getGeolocationData(ip),
      ]);

      return {
        ip,
        usage: usage ? JSON.parse(usage) : null,
        suspicious: suspicious ? JSON.parse(suspicious) : null,
        blacklisted: blacklist ? JSON.parse(blacklist) : null,
        geolocation: geoData,
      };
    } catch (error) {
      console.error('Error getting IP analytics:', error);
      return null;
    }
  };
}

/**
 * Geolocation data interface
 */
interface GeolocationData {
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  isp: string;
  isVPN: boolean;
  isProxy: boolean;
  riskScore: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      geoLocation?: GeolocationData;
    }
  }
}
