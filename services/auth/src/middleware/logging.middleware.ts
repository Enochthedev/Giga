import { NextFunction, Request, Response } from 'express';
import { LogContext, logger } from '../services/logger.service';
import { metricsService } from '../services/metrics.service';

// Extend Express Request to include correlation ID and timing
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      logContext: LogContext;
    }
  }
}

export function correlationIdMiddleware(_req: Request, res: Response, next: NextFunction): void {
  // Generate or extract correlation ID
  const correlationId = (req.headers['x-correlation-id'] as string) || logger.generateCorrelationId();

  // Set correlation ID in request
  req.correlationId = correlationId;

  // Set correlation ID in response headers
  res.setHeader('X-Correlation-ID', correlationId);

  // Create log context for this request
  req.logContext = logger.extractRequestContext(req);
  req.logContext.correlationId = correlationId;

  next();
}

export function requestLoggingMiddleware(_req: Request, res: Response, next: NextFunction): void {
  // Record start time (use existing startTime if available)
  if (!req.startTime) {
    req.startTime = Date.now();
  }

  // Log incoming request
  logger.info('Incoming request', {
    ...req.logContext,
    body: req.method === 'POST' || req.method === 'PUT' ? sanitizeRequestBody(req.body) : undefined
  });

  // Increment request counter
  metricsService.incrementRequestCount();

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const responseTime = Date.now() - (req.startTime || Date.now());

    // Record response time metric
    metricsService.recordResponseTime(responseTime);

    // Log response
    logger.info('Request completed', {
      ...req.logContext,
      statusCode: res.statusCode,
      responseTime,
      responseSize: JSON.stringify(body).length
    });

    // Log performance if slow
    if (responseTime > 1000) {
      logger.logPerformance(`${req.method} ${req.url}`, responseTime, req.logContext);
    }

    return originalJson.call(this, body);
  };

  // Override res.status to capture status code
  const originalStatus = res.status;
  res.status = function (code: number) {
    req.logContext.statusCode = code;

    // Increment error counter for 4xx and 5xx responses
    if (code >= 400) {
      metricsService.incrementErrorCount();
    }

    return originalStatus.call(this, code);
  };

  next();
}

export function errorLoggingMiddleware(err: Error, _req: Request, res: Response, next: NextFunction): void {
  const responseTime = Date.now() - (req.startTime || Date.now());

  // Log error with full context
  logger.error('Request failed with error', err, {
    ...req.logContext,
    statusCode: res.statusCode || 500,
    responseTime,
    errorName: err.name,
    errorMessage: err.message,
    stack: err.stack
  });

  // Record error metrics
  metricsService.incrementErrorCount();

  next(err);
}

export function securityLoggingMiddleware(_req: Request, res: Response, next: NextFunction): void {
  // Log security-relevant events
  const securityHeaders = {
    authorization: req.headers.authorization ? '[REDACTED]' : undefined,
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip']
  };

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /<.*>/,
    /union.*select/i,
    /drop.*table/i
  ];

  const requestString = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(requestString));

  if (hasSuspiciousContent) {
    logger.logSecurityEvent('Suspicious request content detected', {
      ...req.logContext,
      securityHeaders,
      suspiciousContent: true
    });
  }

  // Log authentication attempts
  if (req.url.includes('/auth/') || req.headers.authorization) {
    logger.logAuthEvent('Authentication attempt', {
      ...req.logContext,
      hasAuthHeader: !!req.headers.authorization,
      endpoint: req.url
    });
  }

  next();
}

// Sanitize request body for logging (remove sensitive fields)
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

// Database operation logging middleware
export function createDatabaseLoggingMiddleware() {
  return {
    query: (e: any) => {
      const startTime = Date.now();

      return (result: any) => {
        const duration = Date.now() - startTime;
        const operation = e.query.split(' ')[0]?.toUpperCase() || 'UNKNOWN';

        // Extract table name from query (basic implementation)
        const tableMatch = e.query.match(/(?:FROM|INTO|UPDATE|TABLE)\s+`?(\w+)`?/i);
        const table = tableMatch ? tableMatch[1] : undefined;

        logger.logDatabaseOperation(operation, table || 'unknown', duration);
        metricsService.recordDatabaseQuery(duration, operation, table);

        return result;
      };
    }
  };
}

// Redis operation logging wrapper
export function logRedisOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  cacheOperation = false
): Promise<T> {
  const startTime = Date.now();

  return fn()
    .then(result => {
      const duration = Date.now() - startTime;
      const hit = cacheOperation ? result !== null && result !== undefined : undefined;

      logger.debug(`Redis operation: ${operation}`, {
        operation,
        duration,
        hit
      });

      metricsService.recordRedisOperation(duration, operation, hit);

      return result;
    })
    .catch(error => {
      const duration = Date.now() - startTime;

      logger.error(`Redis operation failed: ${operation}`, error, {
        operation,
        duration
      });

      metricsService.recordRedisError();

      throw error;
    });
}