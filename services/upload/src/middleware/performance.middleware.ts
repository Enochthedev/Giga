import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../lib/logger';
import { cacheService } from '../services/cache.service';
import { metricsService } from '../services/metrics.service';
import { performanceMonitorService } from '../services/performance-monitor.service';

const logger = createLogger('PerformanceMiddleware');

export interface PerformanceRequest extends Request {
  startTime?: number;
  performanceMarks?: Map<string, number>;
}

/**
 * Middleware to track request performance
 */
export const requestPerformanceMiddleware = (
  req: PerformanceRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  req.startTime = startTime;
  req.performanceMarks = new Map();

  // Track active connections
  performanceMonitorService.updateActiveConnections(1);

  // Add performance marking utility
  req.performanceMarks.set('request_start', startTime);

  // Override res.end to capture final metrics
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Record performance metrics
    performanceMonitorService.recordRequest(duration);
    performanceMonitorService.updateActiveConnections(-1);

    return originalEnd.call(this, chunk, encoding);

    // Log slow requests
    if (duration > 2000) {
      logger.warn('Slow request detected', {
        method: req.method,
        path: req.path,
        duration,
        statusCode: res.statusCode,
        userAgent: req.headers['user-agent'],
      });
    }

    // Record metrics
    metricsService.recordHttpRequest(
      req.method,
      req.path,
      res.statusCode,
      duration / 1000
    );

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Middleware for response compression optimization
 */
export const compressionOptimizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set compression headers based on content type and size
  const originalSend = res.send;

  res.send = function (body: any) {
    if (body && typeof body === 'object') {
      const jsonString = JSON.stringify(body);
      const size = Buffer.byteLength(jsonString, 'utf8');

      // Enable compression for responses larger than 1KB
      if (size > 1024) {
        res.setHeader('Content-Encoding', 'gzip');
      }

      // Set appropriate cache headers for static content
      if (req.path.includes('/files/') || req.path.includes('/images/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.setHeader(
          'ETag',
          `"${Buffer.from(jsonString).toString('base64').slice(0, 16)}"`
        );
      }
    }

    return originalSend.call(this, body);
  };

  next();
};

/**
 * Middleware for request batching optimization
 */
export const batchingOptimizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add batch processing hints to request
  if (req.headers['x-batch-request'] === 'true') {
    req.headers['x-prefer-batch'] = 'true';

    // Set longer timeout for batch requests
    req.setTimeout(30000); // 30 seconds

    logger.debug('Batch request detected', {
      path: req.path,
      method: req.method,
    });
  }

  next();
};

/**
 * Middleware for connection pooling optimization
 */
export const connectionPoolingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add connection reuse headers
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');

  // Track connection metrics
  const connectionId = req.headers['x-connection-id'] as string;
  if (connectionId) {
    logger.debug('Reusing connection', { connectionId });
  }

  next();
};

/**
 * Middleware for caching optimization
 */
export const cachingOptimizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if request is cacheable
  if (req.method === 'GET' && isCacheableRoute(req.path)) {
    const cacheKey = generateCacheKey(req);

    // Try to serve from cache
    cacheService
      .get(cacheKey)
      .then(cachedResponse => {
        if (cachedResponse) {
          logger.debug('Serving from cache', { cacheKey, path: req.path });

          // Set cache headers
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes

          return res.json(cachedResponse);
        }

        // Cache miss - continue with request
        res.setHeader('X-Cache', 'MISS');

        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function (body: any) {
          // Cache successful responses
          if (res.statusCode === 200) {
            cacheService.set(cacheKey, body, 300).catch(error => {
              logger.error('Failed to cache response', { cacheKey, error });
            });
          }

          return originalJson.call(this, body);
        };

        next();
      })
      .catch(error => {
        logger.error('Cache check failed', { cacheKey, error });
        next();
      });
  } else {
    next();
  }
};

/**
 * Middleware for memory optimization
 */
export const memoryOptimizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Monitor memory usage
  const memUsage = process.memoryUsage();
  const memoryThreshold = 500 * 1024 * 1024; // 500MB

  if (memUsage.heapUsed > memoryThreshold) {
    logger.warn('High memory usage detected', {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
      path: req.path,
    });

    // Trigger garbage collection if available
    if (global.gc) {
      global.gc();
      logger.debug('Garbage collection triggered');
    }
  }

  // Set memory-conscious response limits
  if (req.path.includes('/batch/') || req.path.includes('/multiple/')) {
    // Limit batch response size
    const originalJson = res.json;
    res.json = function (body: any) {
      if (Array.isArray(body) && body.length > 1000) {
        logger.warn('Large batch response detected', {
          size: body.length,
          path: req.path,
        });

        // Paginate large responses
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const start = (page - 1) * limit;
        const end = start + limit;

        const paginatedBody = {
          data: body.slice(start, end),
          pagination: {
            page,
            limit,
            total: body.length,
            pages: Math.ceil(body.length / limit),
          },
        };

        return originalJson.call(this, paginatedBody);
      }

      return originalJson.call(this, body);
    };
  }

  next();
};

/**
 * Middleware for request prioritization
 */
export const requestPrioritizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Assign priority based on request type
  let priority = 'normal';

  if (req.path.includes('/health') || req.path.includes('/metrics')) {
    priority = 'high';
  } else if (req.path.includes('/batch/') || req.path.includes('/bulk/')) {
    priority = 'low';
  } else if (req.method === 'POST' && req.path.includes('/upload')) {
    priority = 'high';
  }

  // Add priority header for downstream processing
  res.setHeader('X-Request-Priority', priority);

  // Log high priority requests
  if (priority === 'high') {
    logger.debug('High priority request', {
      path: req.path,
      method: req.method,
    });
  }

  next();
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitoringMiddleware = (
  req: PerformanceRequest,
  res: Response,
  next: NextFunction
) => {
  // Add performance marking utility
  if (!req.performanceMarks) {
    req.performanceMarks = new Map();
  }

  // Add mark function to request
  (req as any).mark = (name: string) => {
    req.performanceMarks!.set(name, Date.now());
  };

  // Add measure function to request
  (req as any).measure = (
    name: string,
    startMark: string,
    endMark?: string
  ) => {
    const start = req.performanceMarks!.get(startMark);
    const end = endMark ? req.performanceMarks!.get(endMark) : Date.now();

    if (start && end) {
      const duration = end - start;
      logger.debug('Performance measure', { name, duration, path: req.path });
      return duration;
    }

    return 0;
  };

  next();
};

/**
 * Check if route is cacheable
 */
function isCacheableRoute(path: string): boolean {
  const cacheableRoutes = [
    '/api/v1/files/',
    '/api/v1/metadata/',
    '/api/v1/health',
  ];

  return cacheableRoutes.some(route => path.startsWith(route));
}

/**
 * Generate cache key for request
 */
function generateCacheKey(req: Request): string {
  const baseKey = `${req.method}:${req.path}`;
  const queryString = new URLSearchParams(req.query as any).toString();

  return queryString ? `${baseKey}?${queryString}` : baseKey;
}

export default {
  requestPerformanceMiddleware,
  compressionOptimizationMiddleware,
  batchingOptimizationMiddleware,
  connectionPoolingMiddleware,
  cachingOptimizationMiddleware,
  memoryOptimizationMiddleware,
  requestPrioritizationMiddleware,
  performanceMonitoringMiddleware,
};
