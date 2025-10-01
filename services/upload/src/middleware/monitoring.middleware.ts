import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../lib/logger';
import { metricsService } from '../services/metrics.service';

const logger = createLogger('MonitoringMiddleware');

export interface MonitoringRequest extends Request {
  startTime?: number;
  requestSize?: number;
}

/**
 * Middleware to collect HTTP request metrics
 */
export const metricsMiddleware = (
  req: MonitoringRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  req.startTime = startTime;

  // Calculate request size
  const requestSize = parseInt(req.headers['content-length'] || '0', 10);
  req.requestSize = requestSize;

  // Track active connections
  metricsService.updateActiveConnections('http', 1);

  // Override res.end to capture response metrics
  const originalEnd = res.end;
  let responseSize = 0;

  res.end = function (chunk?: any, encoding?: any) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk)
        ? chunk.length
        : Buffer.byteLength(chunk, encoding);
    }
    return originalEnd.call(this, chunk, encoding);

    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const route = getRoutePattern(req);

    // Record HTTP metrics
    metricsService.recordHttpRequest(
      req.method,
      route,
      res.statusCode,
      duration,
      requestSize,
      responseSize
    );

    // Update active connections
    metricsService.updateActiveConnections('http', -1);

    // Log slow requests
    if (duration > 5) {
      // Log requests taking more than 5 seconds
      logger.warn('Slow request detected', {
        method: req.method,
        route,
        duration,
        statusCode: res.statusCode,
        requestSize,
        responseSize,
      });
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Middleware to track upload-specific metrics
 */
export const uploadMetricsMiddleware = (
  req: MonitoringRequest,
  res: Response,
  next: NextFunction
) => {
  // Only apply to upload routes
  if (!req.path.startsWith('/upload')) {
    return next();
  }

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const entityType = req.body?.entityType || 'unknown';
    const fileType = req.file?.mimetype?.split('/')[0] || 'unknown';
    const fileSize = req.file?.size || 0;
    const status = res.statusCode < 400 ? 'success' : 'error';

    // Record upload metrics
    metricsService.recordUpload(
      req.method,
      status,
      entityType,
      fileType,
      duration,
      fileSize
    );

    logger.info('Upload metrics recorded', {
      method: req.method,
      status,
      entityType,
      fileType,
      duration,
      fileSize,
      statusCode: res.statusCode,
    });
  });

  next();
};

/**
 * Middleware to track processing metrics
 */
export const processingMetricsMiddleware = (
  operation: string,
  fileType?: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      const status = res.statusCode < 400 ? 'success' : 'error';
      const actualFileType =
        fileType || req.file?.mimetype?.split('/')[0] || 'unknown';

      metricsService.recordProcessing(
        operation,
        status,
        actualFileType,
        duration
      );

      logger.debug('Processing metrics recorded', {
        operation,
        status,
        fileType: actualFileType,
        duration,
        statusCode: res.statusCode,
      });
    });

    next();
  };
};

/**
 * Middleware to track security events
 */
export const securityMetricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Track authentication failures
  if (res.statusCode === 401) {
    metricsService.recordSecurityEvent('authentication_failure', 'medium');
    logger.warn('Authentication failure recorded', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
    });
  }

  // Track authorization failures
  if (res.statusCode === 403) {
    metricsService.recordSecurityEvent('authorization_failure', 'medium');
    logger.warn('Authorization failure recorded', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
    });
  }

  // Track suspicious activity (multiple 4xx errors from same IP)
  if (res.statusCode >= 400 && res.statusCode < 500) {
    // This would typically integrate with a rate limiting or IP tracking system
    logger.debug('Client error recorded', {
      statusCode: res.statusCode,
      ip: req.ip,
      path: req.path,
    });
  }

  next();
};

/**
 * Error tracking middleware
 */
export const errorMetricsMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorType = error.name || 'UnknownError';
  const severity = getErrorSeverity(error, res.statusCode);

  metricsService.recordError('upload-service', errorType, severity);

  logger.error('Error metrics recorded', error, {
    errorType,
    severity,
    statusCode: res.statusCode,
    path: req.path,
    method: req.method,
  });

  next(error);
};

/**
 * Middleware to track storage operations
 */
export const storageMetricsMiddleware = (provider: string) => {
  return {
    recordOperation: (operation: string, success: boolean) => {
      const status = success ? 'success' : 'error';
      metricsService.recordStorageOperation(operation, provider, status);
    },

    updateMetrics: (
      totalSize: number,
      fileCount: number,
      entityType?: string
    ) => {
      metricsService.updateStorageMetrics(
        provider,
        totalSize,
        fileCount,
        entityType
      );
    },
  };
};

/**
 * Get route pattern for metrics (remove dynamic segments)
 */
function getRoutePattern(req: Request): string {
  let route = req.route?.path || req.path;

  // Replace common dynamic segments with placeholders
  route = route.replace(
    /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    '/:id'
  );
  route = route.replace(/\/\d+/g, '/:id');
  route = route.replace(/\/[a-zA-Z0-9_-]{20,}/g, '/:token');

  return route;
}

/**
 * Determine error severity based on error type and status code
 */
function getErrorSeverity(error: Error, statusCode: number): string {
  if (statusCode >= 500) {
    return 'high';
  }

  if (statusCode >= 400) {
    return 'medium';
  }

  // Check for specific error types
  if (error.name === 'ValidationError' || error.name === 'TypeError') {
    return 'low';
  }

  if (error.name === 'DatabaseError' || error.name === 'ConnectionError') {
    return 'high';
  }

  return 'medium';
}

/**
 * Middleware to collect system metrics periodically
 */
export const systemMetricsCollector = () => {
  const interval = setInterval(() => {
    try {
      const memUsage = process.memoryUsage();
      metricsService.memoryUsage.set({ type: 'rss' }, memUsage.rss);
      metricsService.memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
      metricsService.memoryUsage.set(
        { type: 'heap_total' },
        memUsage.heapTotal
      );
      metricsService.memoryUsage.set({ type: 'external' }, memUsage.external);

      logger.debug('System metrics collected', {
        memory: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        },
      });
    } catch (error) {
      logger.error('Failed to collect system metrics', error);
    }
  }, 30000); // Collect every 30 seconds

  return {
    stop: () => clearInterval(interval),
  };
};

export default {
  metricsMiddleware,
  uploadMetricsMiddleware,
  processingMetricsMiddleware,
  securityMetricsMiddleware,
  errorMetricsMiddleware,
  storageMetricsMiddleware,
  systemMetricsCollector,
};
