import { NextFunction, Request, Response } from 'express';
import { redisService } from '../services/redis.service';

/**
 * Enhanced rate limiting middleware with security features
 */
export const rateLimit = (
  maxRequests = 5,
  windowMinutes = 15,
  options: RateLimitOptions = {}
) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Get client IP with enhanced detection
      const ip = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Create composite key for more accurate rate limiting
      const baseKey = `rate_limit:${req.route?.path || req.path}`;
      const ipKey = `${baseKey}:ip:${ip}`;
      const userKey = req.user ? `${baseKey}:user:${req.user.sub}` : null;

      const windowSeconds = windowMinutes * 60;

      // Check IP-based rate limit
      const ipCount = await redisService.incrementRateLimit(
        ipKey,
        windowSeconds
      );

      // Check user-based rate limit if authenticated
      let userCount = 0;
      if (userKey) {
        userCount = await redisService.incrementRateLimit(
          userKey,
          windowSeconds
        );
      }

      // Determine if rate limit is exceeded
      const ipExceeded = ipCount > maxRequests;
      const userExceeded =
        userKey && userCount > (options.userMaxRequests || maxRequests * 2);

      if (ipExceeded || userExceeded) {
        // Enhanced logging for security monitoring
        console.warn(`Rate limit exceeded for ${ip} on ${req.path}`, {
          ip,
          userAgent,
          path: req.path,
          method: req.method,
          ipCount,
          userCount,
          userId: req.user?.sub,
          timestamp: new Date().toISOString(),
        });

        // Progressive delay for repeated violations
        const violationKey = `rate_violations:${ip}`;
        const violations = await redisService.incrementRateLimit(
          violationKey,
          3600
        ); // 1 hour window

        const delay = Math.min(violations * 1000, 10000); // Max 10 second delay
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${windowMinutes} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            limit: maxRequests,
            window: `${windowMinutes} minutes`,
            retryAfter: windowSeconds,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Add comprehensive rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(
          0,
          maxRequests - Math.max(ipCount, userCount)
        ).toString(),
        'X-RateLimit-Reset': new Date(
          Date.now() + windowSeconds * 1000
        ).toISOString(),
        'X-RateLimit-Policy': `${maxRequests};w=${windowSeconds}`,
      });

      next();
    } catch (error) {
      // Enhanced error handling
      console.error('Rate limiting error:', error, {
        path: req.path,
        method: req.method,
        ip: getClientIP(req),
        timestamp: new Date().toISOString(),
      });

      // In case of Redis failure, apply basic in-memory rate limiting
      if (options.fallbackToMemory) {
        return memoryRateLimit(maxRequests, windowMinutes)(req, res, next);
      }

      next();
    }
  };
};

/**
 * Enhanced authentication rate limiting for sensitive endpoints
 */
export const authRateLimit = rateLimit(5, 15, {
  userMaxRequests: 10,
  fallbackToMemory: true,
});

/**
 * Strict rate limiting for password-related operations
 */
export const passwordRateLimit = rateLimit(3, 60, {
  userMaxRequests: 5,
  fallbackToMemory: true,
});

/**
 * General API rate limiting
 */
export const apiRateLimit = rateLimit(100, 15, {
  userMaxRequests: 200,
  fallbackToMemory: false,
});

/**
 * Get client IP with enhanced detection
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const remoteAddress =
    req.connection.remoteAddress || req.socket.remoteAddress;

  let clientIp = remoteAddress || 'unknown';

  if (forwarded) {
    clientIp = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(',')[0];
  } else if (realIp) {
    clientIp = Array.isArray(realIp) ? realIp[0] : realIp;
  }

  return clientIp.trim();
}

/**
 * In-memory fallback rate limiting
 */
const memoryStore = new Map<string, { count: number; resetTime: number }>();

function memoryRateLimit(maxRequests: number, windowMinutes: number) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIP(req);
    const _key = `${req.path}:${ip}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const record = memoryStore.get(key);

    if (!record || now > record.resetTime) {
      memoryStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${windowMinutes} minutes.`,
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString(),
      });
    }

    record.count++;
    next();
  };
}

/**
 * Rate limiting options interface
 */
interface RateLimitOptions {
  userMaxRequests?: number;
  fallbackToMemory?: boolean;
}
