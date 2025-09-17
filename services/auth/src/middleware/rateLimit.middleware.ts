import { NextFunction, Request, Response } from 'express';
import { redisService } from '../services/redis.service';

export const rateLimit = (maxRequests = 5, windowMinutes = 15) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `rate_limit:${req.route?.path || req.path}:${ip}`;
      const windowSeconds = windowMinutes * 60;

      const current = await redisService.incrementRateLimit(key, windowSeconds);

      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${windowMinutes} minutes.`,
          timestamp: new Date().toISOString(),
        });
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - current).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + windowSeconds * 1000).toISOString(),
      });

      next();
    } catch (error) {
      // If Redis fails, allow the request but log the error
      console.error('Rate limiting error:', error);
      next();
    }
  };
};