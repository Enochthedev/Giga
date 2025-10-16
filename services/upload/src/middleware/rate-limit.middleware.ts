import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { redis } from '../lib/redis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiter {
  constructor(private config: RateLimitConfig) { }

  async middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = this.config.keyGenerator(req);
      const now = Date.now();
      const windowStart = now - this.config.windowMs;

      // Use Redis sorted set for sliding window
      const pipeline = redis.multi();

      // Remove old entries
      pipeline.zRemRangeByScore(key, 0, windowStart);

      // Add current request
      pipeline.zAdd(key, { score: now, value: `${now}-${Math.random()}` });

      // Count requests in window
      pipeline.zCard(key);

      // Set expiry
      pipeline.expire(key, Math.ceil(this.config.windowMs / 1000));

      const results = await pipeline.exec();
      const requestCount = (results?.[2] as number) || 0;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': this.config.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, this.config.maxRequests - requestCount).toString(),
        'X-RateLimit-Reset': new Date(now + this.config.windowMs).toISOString(),
      });

      if (requestCount > this.config.maxRequests) {
        logger.warn('Rate limit exceeded', {
          key,
          requestCount,
          limit: this.config.maxRequests,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });

        res.status(429).json({
          success: false,
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(this.config.windowMs / 1000),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Rate limiting error:', error);
      // Fail open - allow request if rate limiting fails
      next();
    }
  }
}

// Upload rate limiter - stricter limits
export const uploadRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // 50 uploads per 15 minutes per IP
  keyGenerator: (req) => `upload:${req.ip}`,
});

// General API rate limiter
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes per IP
  keyGenerator: (req) => `api:${req.ip}`,
});

// User-specific rate limiter (requires auth)
export const userRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 uploads per minute per user
  keyGenerator: (req) => `user:${req.user?.id || req.ip}`,
});

// Export middleware functions
export const rateLimitMiddleware = apiRateLimiter.middleware.bind(apiRateLimiter);
export const uploadRateLimit = uploadRateLimiter.middleware.bind(uploadRateLimiter);
export const userRateLimit = userRateLimiter.middleware.bind(userRateLimiter);