import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, ErrorType } from '../types/errors';

interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    details?: any;
    field?: string;
    code?: string;
    correlationId?: string;
    service: string;
  };
  timestamp: string;
}

interface LogContext {
  correlationId?: string;
  userId?: string;
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  service: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public logError(error: Error, context: LogContext): void {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context,
      ...(error instanceof AppError && {
        errorType: error.type,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        details: error.details,
      }),
    };

    // In production, you would send this to your logging service
    // (e.g., Winston, Bunyan, or cloud logging service)
    console.error('Application Error:', JSON.stringify(logData, null, 2));

    // TODO: Integrate with monitoring service (e.g., Sentry, DataDog)
    // this.sendToMonitoringService(logData);
  }

  public logWarning(message: string, context: LogContext): void {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
    };

    console.warn('Application Warning:', JSON.stringify(logData, null, 2));
  }

  private sendToMonitoringService(_logData: unknown): void {
    // Implementation for external monitoring service
    // Example: Sentry, DataDog, CloudWatch, etc.
  }
}

export function correlationIdMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    generateCorrelationId();

  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  next();
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const logger = ErrorLogger.getInstance();
  const correlationId = req.correlationId;

  const context: LogContext = {
    correlationId,
    userId: req.user?.id,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    service: 'ecommerce',
  };

  // Log the error
  logger.logError(error, context);

  // Handle different error types
  let errorResponse: ErrorResponse;

  if (error instanceof AppError) {
    // Application-specific errors
    errorResponse = {
      success: false,
      error: {
        type: error.type,
        message: error.message,
        details: error.details,
        field: error.field,
        code: error.code,
        correlationId,
        service: error.service,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(error.statusCode).json(errorResponse);
  } else if (error instanceof ZodError) {
    // Zod validation errors
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: 'received' in err ? err.received : undefined,
    }));

    errorResponse = {
      success: false,
      error: {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Validation failed',
        details: validationErrors,
        code: 'VALIDATION_FAILED',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    };

    res.status(400).json(errorResponse);
  } else if (error instanceof PrismaClientKnownRequestError) {
    // Prisma database errors
    errorResponse = handlePrismaError(error, correlationId);
    res
      .status(errorResponse.error.code === 'NOT_FOUND' ? 404 : 400)
      .json(errorResponse);
  } else if (error instanceof PrismaClientValidationError) {
    // Prisma validation errors
    errorResponse = {
      success: false,
      error: {
        type: ErrorType.VALIDATION_ERROR,
        message: 'Database validation failed',
        code: 'DATABASE_VALIDATION_ERROR',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    };

    res.status(400).json(errorResponse);
  } else {
    // Unknown/unexpected errors
    errorResponse = {
      success: false,
      error: {
        type: ErrorType.INTERNAL_ERROR,
        message:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message,
        code: 'INTERNAL_SERVER_ERROR',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(errorResponse);
  }
}

function handlePrismaError(
  error: PrismaClientKnownRequestError,
  correlationId?: string
): ErrorResponse {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return {
        success: false,
        error: {
          type: ErrorType.CONFLICT,
          message: 'A record with this information already exists',
          details: { constraint: error.meta?.target },
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          correlationId,
          service: 'ecommerce',
        },
        timestamp: new Date().toISOString(),
      };

    case 'P2025':
      // Record not found
      return {
        success: false,
        error: {
          type: ErrorType.NOT_FOUND,
          message: 'Record not found',
          code: 'NOT_FOUND',
          correlationId,
          service: 'ecommerce',
        },
        timestamp: new Date().toISOString(),
      };

    case 'P2003':
      // Foreign key constraint violation
      return {
        success: false,
        error: {
          type: ErrorType.VALIDATION_ERROR,
          message: 'Invalid reference to related record',
          details: { field: error.meta?.field_name },
          code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
          correlationId,
          service: 'ecommerce',
        },
        timestamp: new Date().toISOString(),
      };

    case 'P2014':
      // Required relation violation
      return {
        success: false,
        error: {
          type: ErrorType.VALIDATION_ERROR,
          message: 'Required relation is missing',
          details: { relation: error.meta?.relation_name },
          code: 'REQUIRED_RELATION_VIOLATION',
          correlationId,
          service: 'ecommerce',
        },
        timestamp: new Date().toISOString(),
      };

    default:
      return {
        success: false,
        error: {
          type: ErrorType.INTERNAL_ERROR,
          message: 'Database operation failed',
          details:
            process.env.NODE_ENV !== 'production'
              ? { code: error.code, meta: error.meta }
              : undefined,
          code: 'DATABASE_ERROR',
          correlationId,
          service: 'ecommerce',
        },
        timestamp: new Date().toISOString(),
      };
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  const correlationId = req.correlationId;

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      type: ErrorType.NOT_FOUND,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 'ROUTE_NOT_FOUND',
      correlationId,
      service: 'ecommerce',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(errorResponse);
}

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Async error wrapper for route handlers
export function asyncHandler(fn: Function) {
  return (_req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Health check error handler
export function healthCheckErrorHandler(error: Error): {
  status: string;
  error: string;
} {
  const logger = ErrorLogger.getInstance();

  logger.logError(error, {
    method: 'GET',
    url: '/health',
    ip: 'internal',
    service: 'ecommerce',
  });

  return {
    status: 'unhealthy',
    error:
      process.env.NODE_ENV === 'production'
        ? 'Service unavailable'
        : error.message,
  };
}

export { ErrorLogger };
