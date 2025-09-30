import { NextFunction, Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import helmet from 'helmet';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../types/errors';

export interface ValidationOptions {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
  headers?: ZodSchema;
}

export function validate(schemas: ValidationOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const correlationId = req.correlationId;

      // Validate request body
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validate request parameters
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      // Validate query parameters
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      // Validate headers
      if (schemas.headers) {
        req.headers = await schemas.headers.parseAsync(req.headers);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // const validationErrors = error.errors.map(err => ({
        //   field: err.path.join('.'),
        //   message: err.message,
        //   value: 'received' in err ? err.received : undefined,
        // }));

        next(
          new ValidationError(
            'Request validation failed',
            undefined,
            undefined,
            req.correlationId
          )
        );
      } else {
        next(error);
      }
    }
  };
}

// Content Security Policy middleware
export const cspMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
});

// Rate limiting configurations
export const generalRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      service: 'ecommerce',
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const correlationId = req.correlationId;
    res.status(429).json({
      success: false,
      error: {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    });
  },
});

export const strictRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs for sensitive operations
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests for this operation, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      service: 'ecommerce',
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const correlationId = req.correlationId;
    res.status(429).json({
      success: false,
      error: {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests for this operation, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    });
  },
});

export const cartRateLimit: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit cart operations to 30 per minute per IP
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many cart operations, please slow down',
      code: 'CART_RATE_LIMIT_EXCEEDED',
      service: 'ecommerce',
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const correlationId = req.correlationId;
    res.status(429).json({
      success: false,
      error: {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many cart operations, please slow down',
        code: 'CART_RATE_LIMIT_EXCEEDED',
        correlationId,
        service: 'ecommerce',
      },
      timestamp: new Date().toISOString(),
    });
  },
});

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize common injection patterns
  const sanitizeValue = (value: any): unknown => {
    if (typeof value === 'string') {
      return value
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .replace(/\$\{.*\}/g, '') // Remove template literals
        .trim();
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }

    return value;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
}

// File upload validation - placeholder for future implementation
export function validateFileUpload(_options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}) {
  return (__req: Request, _res: Response, next: NextFunction) => {
    // File upload validation would be implemented here when needed
    next();
  };
}

// Request size validation
export function validateRequestSize(maxSize: number = 10 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);

    if (contentLength > maxSize) {
      return next(
        new ValidationError(
          `Request too large. Maximum size is ${maxSize} bytes`,
          undefined,
          'request',
          req.correlationId
        )
      );
    }

    next();
  };
}

// Custom validation helpers
export function validateEnum<T extends string>(
  value: string,
  enumValues: T[],
  fieldName: string
): T {
  if (!enumValues.includes(value as T)) {
    throw new ValidationError(
      `Invalid ${fieldName}. Must be one of: ${enumValues.join(', ')}`,
      { value, allowedValues: enumValues },
      fieldName
    );
  }
  return value as T;
}

export function validateDateRange(
  startDate?: string,
  endDate?: string,
  fieldName: string = 'date'
): void {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new ValidationError(
        `Start ${fieldName} cannot be after end ${fieldName}`,
        { startDate, endDate },
        fieldName
      );
    }
  }
}

export function validatePagination(page?: number, limit?: number): void {
  if (page && page < 1) {
    throw new ValidationError('Page must be greater than 0', { page }, 'page');
  }

  if (limit && (limit < 1 || limit > 100)) {
    throw new ValidationError(
      'Limit must be between 1 and 100',
      { limit },
      'limit'
    );
  }
}
