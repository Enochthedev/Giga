import { NextFunction, Request, Response } from 'express';
import { DeviceInfo } from '../services/token-management.service';

/**
 * Middleware to extract and parse device information from request headers
 */
export function extractDeviceInfo(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const acceptLanguage = req.headers['accept-language'] || 'en-US';
    const clientIP = getClientIP(req);

    // Parse user agent for platform information
    const platform = parsePlatform(userAgent);

    // Extract language preference
    const language = parseLanguage(acceptLanguage);

    // Get timezone from headers if available
    const timezone = (req.headers['x-timezone'] as string) || 'UTC';

    // Get screen resolution if provided
    const screenHeader = req.headers['x-screen-resolution'] as string;
    const screen = parseScreenResolution(screenHeader);

    const deviceInfo: DeviceInfo = {
      userAgent,
      platform,
      language,
      timezone,
      screen,
    };

    // Attach device info and IP to request
    req.deviceInfo = deviceInfo;
    req.clientIp = clientIP;

    next();
  } catch (error) {
    console.error('Error extracting device info:', error);

    // Provide fallback device info
    req.deviceInfo = {
      userAgent: 'unknown',
      platform: 'unknown',
      language: 'en-US',
      timezone: 'UTC',
    };
    req.clientIp = 'unknown';

    next();
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(req: Request): string {
  // Check various headers for the real IP
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIP = req.headers['x-real-ip'] as string;
  const cfConnectingIP = req.headers['cf-connecting-ip'] as string;

  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}

/**
 * Parse platform from user agent
 */
function parsePlatform(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('macintosh') || ua.includes('mac os')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod'))
    return 'iOS';
  if (ua.includes('chrome os')) return 'Chrome OS';

  return 'Unknown';
}

/**
 * Parse primary language from Accept-Language header
 */
function parseLanguage(acceptLanguage: string): string {
  // Accept-Language: en-US,en;q=0.9,es;q=0.8
  const languages = acceptLanguage.split(',');
  if (languages.length > 0) {
    const primaryLang = languages[0].split(';')[0].trim();
    return primaryLang;
  }
  return 'en-US';
}

/**
 * Parse screen resolution from custom header
 */
function parseScreenResolution(
  screenHeader?: string
): { width: number; height: number } | undefined {
  if (!screenHeader) return undefined;

  try {
    // Expected format: "1920x1080"
    const [width, height] = screenHeader.split('x').map(Number);
    if (width && height && width > 0 && height > 0) {
      return { width, height };
    }
  } catch (error) {
    // Invalid format, ignore
  }

  return undefined;
}

/**
 * Middleware to validate device fingerprint consistency
 */
export function validateDeviceFingerprint(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const storedFingerprint = req.headers['x-device-fingerprint'] as string;

    if (storedFingerprint && req.deviceInfo) {
      // In a real implementation, you would validate the fingerprint
      // against the stored device information
      req.deviceFingerprint = storedFingerprint;
    }

    next();
  } catch (error) {
    console.error('Error validating device fingerprint:', error);
    next();
  }
}

/**
 * Rate limiting middleware for token operations per device
 */
export function deviceTokenRateLimit(
  maxRequests: number = 10,
  windowMinutes: number = 5
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.deviceInfo || !req.clientIp) {
        return next();
      }

      const deviceId = generateDeviceId(req.deviceInfo);
      const _key = `device_rate:${deviceId}:${req.clientIp}`;

      // This would use Redis in a real implementation
      // For now, we'll just continue
      next();
    } catch (error) {
      console.error('Device rate limiting error:', error);
      next();
    }
  };
}

/**
 * Generate a simple device ID for rate limiting
 */
function generateDeviceId(deviceInfo: DeviceInfo): string {
  const crypto = require('crypto');
  const deviceString = `${deviceInfo.userAgent}|${deviceInfo.platform}|${deviceInfo.language}`;
  return crypto
    .createHash('sha256')
    .update(deviceString)
    .digest('hex')
    .substring(0, 16);
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      deviceInfo?: DeviceInfo;
      clientIp?: string;
      deviceFingerprint?: string;
    }
  }
}
