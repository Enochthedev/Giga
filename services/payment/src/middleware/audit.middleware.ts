import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { pciComplianceService } from '../services/pci-compliance.service';

// Extend Request interface to include audit context
declare global {
  namespace Express {
    interface Request {
      auditContext?: {
        userId?: string;
        sessionId?: string;
        startTime: number;
      };
    }
  }
}

/**
 * Middleware to log all payment-related activities for PCI DSS compliance
 */
export const auditMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Extract user context from headers or JWT
  const userId = req.headers['x-user-id'] as string;
  const sessionId =
    (req.headers['x-session-id'] as string) || (req as any).sessionID;

  // Add audit context to request
  req.auditContext = {
    userId,
    sessionId,
    startTime,
  };

  // Capture original response methods
  const originalSend = res.send;
  const originalJson = res.json;

  // Override response methods to capture response data
  res.send = function (body: any) {
    logAuditEvent(req, res, body, startTime);
    return originalSend.call(this, body);
  };

  res.json = function (body: any) {
    logAuditEvent(req, res, body, startTime);
    return originalJson.call(this, body);
  };

  next();
};

/**
 * Log audit event for the request/response
 */
async function logAuditEvent(
  req: Request,
  res: Response,
  responseBody: any,
  startTime: number
): Promise<void> {
  try {
    const duration = Date.now() - startTime;
    const success = res.statusCode < 400;

    // Determine event severity based on endpoint and status
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (
      req.path.includes('/payment-methods') ||
      req.path.includes('/payments')
    ) {
      severity = 'medium';
    }

    if (req.path.includes('/webhooks') || req.path.includes('/refunds')) {
      severity = 'high';
    }

    if (!success && res.statusCode >= 500) {
      severity = 'critical';
    }

    // Sanitize request body for logging (remove sensitive data)
    const sanitizedBody = sanitizeRequestBody(req.body);

    // Sanitize response body for logging
    const sanitizedResponse = sanitizeResponseBody(responseBody);

    await pciComplianceService.logAuditEvent({
      eventType: 'API_REQUEST',
      userId: req.auditContext?.userId,
      sessionId: req.auditContext?.sessionId,
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: req.method,
      details: {
        requestBody: sanitizedBody,
        responseBody: sanitizedResponse,
        statusCode: res.statusCode,
        duration,
        query: req.query,
        params: req.params,
      },
      severity,
      success,
      errorMessage: !success ? getErrorMessage(responseBody) : undefined,
    });
  } catch (error) {
    logger.error('Failed to log audit event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method,
    });
  }
}

/**
 * Middleware specifically for sensitive payment operations
 */
export const sensitiveOperationAudit = (operationType: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await pciComplianceService.logAuditEvent({
        eventType: 'SENSITIVE_OPERATION',
        userId: req.auditContext?.userId,
        sessionId: req.auditContext?.sessionId,
        ipAddress: getClientIpAddress(req),
        userAgent: req.get('User-Agent'),
        resource: req.path,
        action: operationType,
        details: {
          operationType,
          timestamp: new Date().toISOString(),
        },
        severity: 'high',
        success: true,
      });

      next();
    } catch (error) {
      logger.error('Failed to log sensitive operation audit', {
        error: error instanceof Error ? error.message : 'Unknown error',
        operationType,
      });
      next(); // Continue even if audit logging fails
    }
  };
};

/**
 * Middleware for authentication events
 */
export const authenticationAudit = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (body: any) {
    logAuthenticationEvent(req, res, body);
    return originalSend.call(this, body);
  };

  res.json = function (body: any) {
    logAuthenticationEvent(req, res, body);
    return originalJson.call(this, body);
  };

  next();
};

/**
 * Log authentication-specific events
 */
async function logAuthenticationEvent(
  req: Request,
  res: Response,
  responseBody: any
): Promise<void> {
  try {
    const success = res.statusCode < 400;

    await pciComplianceService.logAuditEvent({
      eventType: 'AUTHENTICATION',
      userId: req.body?.userId || req.body?.email,
      sessionId: req.auditContext?.sessionId,
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: 'authenticate',
      details: {
        authMethod: req.body?.authMethod || 'password',
        statusCode: res.statusCode,
      },
      severity: success ? 'low' : 'medium',
      success,
      errorMessage: !success ? getErrorMessage(responseBody) : undefined,
    });
  } catch (error) {
    logger.error('Failed to log authentication event', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Middleware for data access events (encryption/decryption)
 */
export const dataAccessAudit = (dataType: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await pciComplianceService.logAuditEvent({
        eventType: 'DATA_ACCESS',
        userId: req.auditContext?.userId,
        sessionId: req.auditContext?.sessionId,
        ipAddress: getClientIpAddress(req),
        userAgent: req.get('User-Agent'),
        resource: dataType,
        action: 'access',
        details: {
          dataType,
          resourceId: req.params?.id,
        },
        severity: 'high',
        success: true,
      });

      next();
    } catch (error) {
      logger.error('Failed to log data access event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        dataType,
      });
      next();
    }
  };
};

// Helper functions

/**
 * Get client IP address from request
 */
function getClientIpAddress(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Sanitize request body to remove sensitive information
 */
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };

  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'cardNumber',
    'cvc',
    'cvv',
    'accountNumber',
    'routingNumber',
    'ssn',
    'taxId',
    'accessToken',
    'refreshToken',
    'apiKey',
    'secret',
  ];

  function sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj && typeof obj === 'object') {
      const sanitizedObj: any = {};

      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        if (
          sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))
        ) {
          sanitizedObj[key] = '[REDACTED]';
        } else {
          sanitizedObj[key] = sanitizeObject(value);
        }
      }

      return sanitizedObj;
    }

    return obj;
  }

  return sanitizeObject(sanitized);
}

/**
 * Sanitize response body to remove sensitive information
 */
function sanitizeResponseBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  // For successful responses, only log metadata
  if (body.success) {
    return {
      success: body.success,
      dataType: body.data ? typeof body.data : undefined,
      recordCount: Array.isArray(body.data) ? body.data.length : undefined,
    };
  }

  // For error responses, log the error but sanitize details
  return {
    success: body.success,
    error: body.error
      ? {
          code: body.error.code,
          message: body.error.message,
        }
      : undefined,
  };
}

/**
 * Extract error message from response body
 */
function getErrorMessage(responseBody: any): string | undefined {
  if (responseBody?.error?.message) {
    return responseBody.error.message;
  }

  if (typeof responseBody === 'string') {
    return responseBody;
  }

  return undefined;
}
