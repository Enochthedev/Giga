import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger.service';
import { metricsService } from '../services/metrics.service';
import { redisService } from '../services/redis.service';

/**
 * API response caching middleware
 */
export class APICacheMiddleware {
  /**
   * Cache GET responses for specified duration
   */
  static cache(ttlSeconds = 300, keyGenerator?: (req: Request) => string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      try {
        const cacheKey = keyGenerator
          ? keyGenerator(req)
          : APICacheMiddleware.generateCacheKey(req);

        // Try to get cached response
        const cachedResponse = await redisService.get(cacheKey);

        if (cachedResponse) {
          const parsed = JSON.parse(cachedResponse);

          // Add cache headers
          res.set({
            'X-Cache-Status': 'HIT',
            'X-Cache-Key': cacheKey,
            'X-Cache-TTL': ttlSeconds.toString(),
            'Cache-Control': `public, max-age=${ttlSeconds}`,
            ETag: APICacheMiddleware.generateETag(parsed.data),
          });

          logger.debug('Cache hit for request', {
            method: req.method,
            path: req.path,
            cacheKey,
            userId: req.user?.sub,
          });

          metricsService.recordCacheHit('api_response');

          return res.status(parsed.statusCode || 200).json(parsed.data);
        }

        // Cache miss - intercept response
        const originalSend = res.json;
        const originalStatus = res.status;
        let statusCode = 200;

        res.status = function (code: number) {
          statusCode = code;
          return originalStatus.call(this, code);
        };

        res.json = function (data: any) {
          // Only cache successful responses
          if (statusCode >= 200 && statusCode < 300) {
            const cacheData = {
              statusCode,
              data,
              timestamp: new Date().toISOString(),
            };

            // Cache the response asynchronously
            redisService
              .set(cacheKey, JSON.stringify(cacheData), ttlSeconds)
              .catch(error => {
                logger.error('Failed to cache response', error, {
                  cacheKey,
                  path: req.path,
                });
              });

            // Add cache headers
            res.set({
              'X-Cache-Status': 'MISS',
              'X-Cache-Key': cacheKey,
              'X-Cache-TTL': ttlSeconds.toString(),
              'Cache-Control': `public, max-age=${ttlSeconds}`,
              ETag: APICacheMiddleware.generateETag(data),
            });

            logger.debug('Response cached', {
              method: req.method,
              path: req.path,
              cacheKey,
              statusCode,
              userId: req.user?.sub,
            });

            metricsService.recordCacheMiss('api_response');
          } else {
            res.set('X-Cache-Status', 'BYPASS');
          }

          return originalSend.call(this, data);
        };

        next();
      } catch (error) {
        logger.error('Cache middleware error', error as Error, {
          path: req.path,
          method: req.method,
        });

        res.set('X-Cache-Status', 'ERROR');
        next();
      }
    };
  }

  /**
   * Generate cache key for request
   */
  private static generateCacheKey(req: Request): string {
    const baseKey = `api_cache:${req.method}:${req.path}`;
    const queryString = new URLSearchParams(
      req.query as Record<string, string>
    ).toString();
    const userContext = req.user ? `:user:${req.user.sub}` : '';

    return `${baseKey}${queryString ? `:${queryString}` : ''}${userContext}`;
  }

  /**
   * Generate ETag for response data
   */
  private static generateETag(data: any): string {
    const crypto = require('crypto');
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    return `"${hash}"`;
  }

  /**
   * Cache invalidation middleware
   */
  static invalidateCache(patterns: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.json;

      res.json = function (data: any) {
        // Invalidate cache patterns after successful response
        if (res.statusCode >= 200 && res.statusCode < 300) {
          Promise.all(
            patterns.map(pattern => redisService.deletePattern(pattern))
          ).catch(error => {
            logger.error('Cache invalidation failed', error as Error, {
              patterns,
              path: req.path,
            });
          });
        }

        return originalSend.call(this, data);
      };

      next();
    };
  }
}

/**
 * Response compression and optimization middleware
 */
export class ResponseOptimizationMiddleware {
  /**
   * Add performance and optimization headers
   */
  static addOptimizationHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();

      // Add security and performance headers
      res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-API-Version': '1.0.0',
        'X-Request-ID':
          req.headers['x-request-id'] ||
          `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });

      // Add response time header after response
      const originalSend = res.json;
      res.json = function (data: any) {
        const responseTime = Date.now() - startTime;
        res.set('X-Response-Time', `${responseTime}ms`);

        metricsService.recordResponseTime(responseTime, req.path);

        return originalSend.call(this, data);
      };

      next();
    };
  }

  /**
   * Conditional requests support (ETag, If-None-Match)
   */
  static conditionalRequests() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ifNoneMatch = req.headers['if-none-match'];

      if (ifNoneMatch && req.method === 'GET') {
        const originalSend = res.json;

        res.json = function (data: any) {
          const etag = ResponseOptimizationMiddleware.generateETag(data);
          res.set('ETag', etag);

          if (ifNoneMatch === etag) {
            return res.status(304).end();
          }

          return originalSend.call(this, data);
        };
      }

      next();
    };
  }

  /**
   * Generate ETag for response data
   */
  static generateETag(data: any): string {
    const crypto = require('crypto');
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    return `"${hash}"`;
  }

  /**
   * Response pagination optimization
   */
  static optimizePagination() {
    return (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.json;

      res.json = function (data: any) {
        // Add pagination headers if data contains pagination info
        if (data.success && data.data && data.meta) {
          const { page, limit, total, totalPages, hasNext, hasPrev } =
            data.meta;

          res.set({
            'X-Pagination-Page': page?.toString(),
            'X-Pagination-Limit': limit?.toString(),
            'X-Pagination-Total': total?.toString(),
            'X-Pagination-Total-Pages': totalPages?.toString(),
          });

          // Add Link header for pagination navigation
          const links = [];
          const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
          const query = new URLSearchParams(
            req.query as Record<string, string>
          );

          if (hasPrev && page > 1) {
            query.set('page', (page - 1).toString());
            links.push(`<${baseUrl}?${query.toString()}>; rel="prev"`);
          }

          if (hasNext && page < totalPages) {
            query.set('page', (page + 1).toString());
            links.push(`<${baseUrl}?${query.toString()}>; rel="next"`);
          }

          query.set('page', '1');
          links.push(`<${baseUrl}?${query.toString()}>; rel="first"`);

          query.set('page', totalPages?.toString());
          links.push(`<${baseUrl}?${query.toString()}>; rel="last"`);

          if (links.length > 0) {
            res.set('Link', links.join(', '));
          }
        }

        return originalSend.call(this, data);
      };

      next();
    };
  }
}

/**
 * API usage analytics middleware
 */
export class APIAnalyticsMiddleware {
  /**
   * Track API usage and generate analytics
   */
  static trackUsage() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      const date = timestamp.split('T')[0]; // YYYY-MM-DD format

      // Track request
      const analyticsData = {
        method: req.method,
        path: req.path,
        endpoint: `${req.method} ${req.path}`,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        userId: req.user?.sub,
        timestamp,
        date,
      };

      // Increment counters asynchronously
      Promise.all([
        redisService.incrementCounter(
          `analytics:requests:total:${date}`,
          86400
        ),
        redisService.incrementCounter(
          `analytics:requests:endpoint:${analyticsData.endpoint}:${date}`,
          86400
        ),
        redisService.incrementCounter(
          `analytics:requests:method:${req.method}:${date}`,
          86400
        ),
        req.user
          ? redisService.incrementCounter(
              `analytics:users:${req.user.sub}:${date}`,
              86400
            )
          : Promise.resolve(0),
      ]).catch(error => {
        logger.error(
          'Analytics tracking failed',
          error as Error,
          analyticsData
        );
      });

      // Track response after completion
      const originalSend = res.json;
      res.json = function (data: unknown) {
        const responseTime = Date.now() - startTime;
        const statusCode = res.statusCode;

        // Track response metrics
        Promise.all([
          redisService.incrementCounter(
            `analytics:responses:status:${statusCode}:${date}`,
            86400
          ),
          redisService.incrementCounter(
            `analytics:responses:total:${date}`,
            86400
          ),
          statusCode >= 400
            ? redisService.incrementCounter(`analytics:errors:${date}`, 86400)
            : Promise.resolve(0),
          statusCode === 429
            ? redisService.incrementCounter(
                `analytics:rate_limits:${date}`,
                86400
              )
            : Promise.resolve(0),
        ]).catch(error => {
          logger.error('Response analytics tracking failed', error as Error, {
            ...analyticsData,
            statusCode,
            responseTime,
          });
        });

        // Record response time for averages
        metricsService.recordResponseTime(responseTime, req.path);

        logger.info('API request completed', {
          ...analyticsData,
          statusCode,
          responseTime,
          success: statusCode < 400,
        });

        return originalSend.call(this, data);
      };

      next();
    };
  }

  /**
   * Get API usage analytics
   */
  static async getAnalytics(startDate: string, endDate: string) {
    try {
      const dates = APIAnalyticsMiddleware.getDateRange(startDate, endDate);
      const analytics = {
        totalRequests: 0,
        requestsByEndpoint: {} as Record<string, number>,
        requestsByMethod: {} as Record<string, number>,
        requestsByStatus: {} as Record<string, number>,
        errorRate: 0,
        rateLimitHits: 0,
        uniqueUsers: 0,
        timeRange: { start: startDate, end: endDate },
      };

      // Aggregate data across date range
      for (const date of dates) {
        const [totalRequests, totalErrors, rateLimits] = await Promise.all([
          redisService.getCounter(`analytics:requests:total:${date}`),
          redisService.getCounter(`analytics:errors:${date}`),
          redisService.getCounter(`analytics:rate_limits:${date}`),
        ]);

        analytics.totalRequests += totalRequests;
        analytics.rateLimitHits += rateLimits;

        // Get endpoint and method breakdowns
        const endpointKeys = await redisService.keys(
          `analytics:requests:endpoint:*:${date}`
        );
        const methodKeys = await redisService.keys(
          `analytics:requests:method:*:${date}`
        );
        const statusKeys = await redisService.keys(
          `analytics:responses:status:*:${date}`
        );

        for (const key of endpointKeys) {
          const endpoint = key.split(':')[3];
          const count = await redisService.getCounter(key);
          analytics.requestsByEndpoint[endpoint] =
            (analytics.requestsByEndpoint[endpoint] || 0) + count;
        }

        for (const key of methodKeys) {
          const method = key.split(':')[3];
          const count = await redisService.getCounter(key);
          analytics.requestsByMethod[method] =
            (analytics.requestsByMethod[method] || 0) + count;
        }

        for (const key of statusKeys) {
          const status = key.split(':')[3];
          const count = await redisService.getCounter(key);
          analytics.requestsByStatus[status] =
            (analytics.requestsByStatus[status] || 0) + count;
        }
      }

      // Calculate error rate
      const _totalErrors = Object.entries(analytics.requestsByStatus)
        .filter(([status]) => parseInt(status) >= 400)
        .reduce((sum, [, count]) => sum + count, 0);

      analytics.errorRate =
        analytics.totalRequests > 0
          ? (_totalErrors / analytics.totalRequests) * 100
          : 0;

      return analytics;
    } catch (error) {
      logger.error('Failed to get API analytics', error as Error);
      throw error;
    }
  }

  /**
   * Generate date range array
   */
  static getDateRange(startDate: string, endDate: string): string[] {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}
