export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVENTORY_CONFLICT = 'INVENTORY_CONFLICT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ApiError {
  type: ErrorType;
  message: string;
  details?: any;
  field?: string;
  code?: string;
  timestamp: string;
  correlationId?: string;
  service: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ServiceError {
  service: string;
  operation: string;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlationId: string;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly field?: string;
  public readonly code?: string;
  public readonly correlationId?: string;
  public readonly service: string;
  public readonly isOperational: boolean;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    details?: any,
    field?: string,
    code?: string,
    correlationId?: string,
    service: string = 'ecommerce'
  ) {
    super(message);

    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.field = field;
    this.code = code;
    this.correlationId = correlationId;
    this.service = service;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ApiError {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      field: this.field,
      code: this.code,
      timestamp: new Date().toISOString(),
      correlationId: this.correlationId,
      service: this.service,
    };
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: unknown,
    field?: string,
    correlationId?: string
  ) {
    super(ErrorType.VALIDATION_ERROR, message, 400, details, field, 'VALIDATION_FAILED', correlationId);
  }
}

export class NotFoundError extends AppError {
  constructor(
    resource: string,
    identifier?: string,
    correlationId?: string
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(ErrorType.NOT_FOUND, message, 404, { resource, identifier }, undefined, 'RESOURCE_NOT_FOUND', correlationId);
  }
}

export class InsufficientStockError extends AppError {
  constructor(
    productId: string,
    requested: number,
    available: number,
    correlationId?: string
  ) {
    super(
      ErrorType.INSUFFICIENT_STOCK,
      `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`,
      409,
      { productId, requested, available },
      'quantity',
      'INSUFFICIENT_STOCK',
      correlationId
    );
  }
}

export class PaymentFailedError extends AppError {
  constructor(
    reason: string,
    paymentIntentId?: string,
    correlationId?: string
  ) {
    super(
      ErrorType.PAYMENT_FAILED,
      `Payment failed: ${reason}`,
      402,
      { paymentIntentId },
      undefined,
      'PAYMENT_FAILED',
      correlationId
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = 'Authentication required',
    correlationId?: string
  ) {
    super(ErrorType.UNAUTHORIZED, message, 401, undefined, undefined, 'UNAUTHORIZED', correlationId);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = 'Access forbidden',
    correlationId?: string
  ) {
    super(ErrorType.FORBIDDEN, message, 403, undefined, undefined, 'FORBIDDEN', correlationId);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string,
    details?: any,
    correlationId?: string
  ) {
    super(ErrorType.CONFLICT, message, 409, details, undefined, 'CONFLICT', correlationId);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    serviceName: string,
    operation?: string,
    correlationId?: string
  ) {
    const message = operation
      ? `${serviceName} service unavailable for operation: ${operation}`
      : `${serviceName} service unavailable`;

    super(
      ErrorType.SERVICE_UNAVAILABLE,
      message,
      503,
      { serviceName, operation },
      undefined,
      'SERVICE_UNAVAILABLE',
      correlationId
    );
  }
}

export class RateLimitError extends AppError {
  constructor(
    limit: number,
    windowMs: number,
    correlationId?: string
  ) {
    super(
      ErrorType.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded. Maximum ${limit} requests per ${windowMs}ms`,
      429,
      { limit, windowMs },
      undefined,
      'RATE_LIMIT_EXCEEDED',
      correlationId
    );
  }
}