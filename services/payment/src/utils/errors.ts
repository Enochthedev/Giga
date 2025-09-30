export class PaymentError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaymentError);
    }
  }
}

export class ValidationError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class GatewayError extends PaymentError {
  public readonly isRetryable: boolean;
  public readonly gatewayCode: string | undefined;

  constructor(
    message: string,
    code: string,
    statusCode: number = 502,
    isRetryable: boolean = false,
    gatewayCode?: string,
    details?: any
  ) {
    super(message, code, statusCode, details);
    this.name = 'GatewayError';
    this.isRetryable = isRetryable;
    this.gatewayCode = gatewayCode || undefined;
  }
}

export class FraudError extends PaymentError {
  public readonly riskScore: number;
  public readonly riskLevel: string;

  constructor(message: string, riskScore: number, riskLevel: string, details?: any) {
    super(message, 'FRAUD_DETECTED', 403, details);
    this.name = 'FraudError';
    this.riskScore = riskScore;
    this.riskLevel = riskLevel;
  }
}

export class InsufficientFundsError extends PaymentError {
  constructor(message: string = 'Insufficient funds', details?: any) {
    super(message, 'INSUFFICIENT_FUNDS', 402, details);
    this.name = 'InsufficientFundsError';
  }
}

export class CardDeclinedError extends PaymentError {
  public readonly declineCode: string | undefined;

  constructor(message: string, declineCode?: string, details?: any) {
    super(message, 'CARD_DECLINED', 402, details);
    this.name = 'CardDeclinedError';
    this.declineCode = declineCode || undefined;
  }
}

export class TransactionNotFoundError extends PaymentError {
  constructor(transactionId: string) {
    super(`Transaction not found: ${transactionId}`, 'TRANSACTION_NOT_FOUND', 404);
    this.name = 'TransactionNotFoundError';
  }
}

export class PaymentMethodNotFoundError extends PaymentError {
  constructor(paymentMethodId: string) {
    super(`Payment method not found: ${paymentMethodId}`, 'PAYMENT_METHOD_NOT_FOUND', 404);
    this.name = 'PaymentMethodNotFoundError';
  }
}

export class RefundError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'REFUND_ERROR', 400, details);
    this.name = 'RefundError';
  }
}

export class DuplicateTransactionError extends PaymentError {
  constructor(reference: string) {
    super(`Duplicate transaction detected: ${reference}`, 'DUPLICATE_TRANSACTION', 409);
    this.name = 'DuplicateTransactionError';
  }
}

export class RateLimitError extends PaymentError {
  public readonly retryAfter: number | undefined;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter || undefined;
  }
}

export class ConfigurationError extends PaymentError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIGURATION_ERROR', 500, details);
    this.name = 'ConfigurationError';
  }
}

// Error response formatter
export const formatErrorResponse = (error: Error) => {
  if (error instanceof PaymentError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        ...(error instanceof GatewayError && {
          isRetryable: error.isRetryable,
          gatewayCode: error.gatewayCode,
        }),
        ...(error instanceof FraudError && {
          riskScore: error.riskScore,
          riskLevel: error.riskLevel,
        }),
        ...(error instanceof CardDeclinedError && {
          declineCode: error.declineCode,
        }),
        ...(error instanceof RateLimitError && {
          retryAfter: error.retryAfter,
        }),
      },
    };
  }

  // Generic error response for non-PaymentError instances
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
    },
  };
};

// Error code mappings for different gateways
export const mapGatewayError = (gatewayType: string, gatewayError: any): PaymentError => {
  switch (gatewayType.toLowerCase()) {
    case 'stripe':
      return mapStripeError(gatewayError);
    case 'paypal':
      return mapPayPalError(gatewayError);
    case 'square':
      return mapSquareError(gatewayError);
    default:
      return new GatewayError(
        gatewayError.message || 'Gateway error',
        'GATEWAY_ERROR',
        502,
        false,
        gatewayError.code
      );
  }
};

const mapStripeError = (stripeError: any): PaymentError => {
  const { type, code, message, decline_code } = stripeError;

  switch (type) {
    case 'card_error':
      if (code === 'card_declined') {
        return new CardDeclinedError(message, decline_code);
      }
      if (code === 'insufficient_funds') {
        return new InsufficientFundsError(message);
      }
      return new PaymentError(message, code, 402);

    case 'validation_error':
      return new ValidationError(message);

    case 'rate_limit_error':
      return new RateLimitError(message);

    case 'api_error':
    case 'api_connection_error':
      return new GatewayError(message, 'STRIPE_API_ERROR', 502, true, code);

    default:
      return new GatewayError(message, 'STRIPE_ERROR', 502, false, code);
  }
};

const mapPayPalError = (paypalError: any): PaymentError => {
  const { name, message, details } = paypalError;

  switch (name) {
    case 'VALIDATION_ERROR':
      return new ValidationError(message, details);
    case 'INSUFFICIENT_FUNDS':
      return new InsufficientFundsError(message);
    case 'INSTRUMENT_DECLINED':
      return new CardDeclinedError(message);
    default:
      return new GatewayError(message, 'PAYPAL_ERROR', 502, false, name);
  }
};

const mapSquareError = (squareError: any): PaymentError => {
  const { category, code, detail } = squareError;

  switch (category) {
    case 'PAYMENT_METHOD_ERROR':
      if (code === 'CARD_DECLINED') {
        return new CardDeclinedError(detail);
      }
      if (code === 'INSUFFICIENT_FUNDS') {
        return new InsufficientFundsError(detail);
      }
      return new PaymentError(detail, code, 402);

    case 'INVALID_REQUEST_ERROR':
      return new ValidationError(detail);

    case 'RATE_LIMIT_ERROR':
      return new RateLimitError(detail);

    default:
      return new GatewayError(detail, 'SQUARE_ERROR', 502, false, code);
  }
};