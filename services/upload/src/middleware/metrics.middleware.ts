import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../lib/logger';

const logger = createLogger('MetricsMiddleware');

// Request metrics tracking
interface RequestMetrics {
  totalRequests: number;
  requestsByMethod: Record<string, number>;
  requestsByPath: Record<string, number>;
  responseTimeSum: number;
  errorCount: number;
}

const metrics: RequestMetrics = {
  totalRequests: 0,
  requestsByMethod: {},
  requestsByPath: {},
  responseTimeSum: 0,
  errorCount: 0,
};

/**
 * Middleware to collect request metrics
 */
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Track request
  metrics.totalRequests++;
  metrics.requestsByMethod[req.method] =
    (metrics.requestsByMethod[req.method] || 0) + 1;
  metrics.requestsByPath[req.path] =
    (metrics.requestsByPath[req.path] || 0) + 1;

  // Track response
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    metrics.responseTimeSum += responseTime;

    // Track errors
    if (res.statusCode >= 400) {
      metrics.errorCount++;
    }

    // Log slow requests
    if (responseTime > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        path: req.path,
        responseTime,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Middleware specifically for upload metrics
 */
export const uploadMetricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.path.includes('/uploads')) {
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const fileCount = req.files
        ? Array.isArray(req.files)
          ? req.files.length
          : Object.keys(req.files).length
        : 0;

      logger.info('Upload request completed', {
        method: req.method,
        path: req.path,
        responseTime,
        statusCode: res.statusCode,
        fileCount,
        contentLength: req.get('content-length'),
      });
    });
  }

  next();
};

/**
 * Error metrics middleware
 */
export const errorMetricsMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  metrics.errorCount++;

  logger.error('Request error tracked', {
    error: error.message,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
  });

  next(error);
};

/**
 * Get current metrics
 */
export const getMetrics = (): RequestMetrics & {
  averageResponseTime: number;
} => {
  return {
    ...metrics,
    averageResponseTime:
      metrics.totalRequests > 0
        ? metrics.responseTimeSum / metrics.totalRequests
        : 0,
  };
};

/**
 * Reset metrics (useful for testing)
 */
export const resetMetrics = (): void => {
  metrics.totalRequests = 0;
  metrics.requestsByMethod = {};
  metrics.requestsByPath = {};
  metrics.responseTimeSum = 0;
  metrics.errorCount = 0;
};
