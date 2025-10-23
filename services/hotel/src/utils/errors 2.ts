/**
 * Custom error classes for the Hotel Service
 */

export class HotelServiceError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends HotelServiceError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'CONFLICT', 409, details);
  }
}

export class UnauthorizedError extends HotelServiceError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends HotelServiceError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class RateLimitError extends HotelServiceError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

export class ExternalServiceError extends HotelServiceError {
  constructor(service: string, message: string, details?: any) {
    super(
      `External service error from ${service}: ${message}`,
      'EXTERNAL_SERVICE_ERROR',
      502,
      details
    );
  }
}

// Business logic specific errors
export class AvailabilityError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'AVAILABILITY_ERROR', 409, details);
  }
}

export class BookingError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'BOOKING_ERROR', 400, details);
  }
}

export class PaymentError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'PAYMENT_ERROR', 402, details);
  }
}

export class InventoryError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'INVENTORY_ERROR', 409, details);
  }
}

export class PricingError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'PRICING_ERROR', 400, details);
  }
}

export class CancellationError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'CANCELLATION_ERROR', 400, details);
  }
}

export class PropertyError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'PROPERTY_ERROR', 400, details);
  }
}

export class RoomTypeError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'ROOM_TYPE_ERROR', 400, details);
  }
}

export class GuestError extends HotelServiceError {
  constructor(message: string, details?: any) {
    super(message, 'GUEST_ERROR', 400, details);
  }
}

// Error handling utilities
export const isHotelServiceError = (error: any): error is HotelServiceError => {
  return error instanceof HotelServiceError;
};

export const getErrorResponse = (error: any) => {
  if (isHotelServiceError(error)) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: new Date(),
    };
  }

  // Handle Prisma errors
  if (error.code && error.code.startsWith('P')) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      timestamp: new Date(),
    };
  }

  // Handle validation errors from express-validator
  if (error.array && typeof error.array === 'function') {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.array(),
      },
      timestamp: new Date(),
    };
  }

  // Generic error
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    },
    timestamp: new Date(),
  };
};

export const createErrorHandler = () => {
  return (error: any, req: any, res: any, _next: any) => {
    const errorResponse = getErrorResponse(error);
    const statusCode = isHotelServiceError(error) ? error.statusCode : 500;

    // Log error
    console.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });

    res.status(statusCode).json(errorResponse);
  };
};
