import { logger } from '../../lib/logger';
import {
  GatewayConfig,
  GatewayError,
  GatewayResponse,
  GatewayStatus,
  PaymentGateway,
  WebhookEvent
} from '../../types/gateway.types';
import { PaymentRequest } from '../../types/payment.types';

/**
 * Base gateway class that provides common functionality for all payment gateways
 */
export abstract class BaseGateway extends PaymentGateway {
  protected readonly maxRetries = 3;
  protected readonly retryDelay = 1000; // 1 second

  constructor(config: GatewayConfig) {
    super(config);
    this.validateConfig();
  }

  /**
   * Validates the gateway configuration
   */
  protected validateConfig(): void {
    if (!this.config.credentials || Object.keys(this.config.credentials).length === 0) {
      throw new Error(`Gateway ${this.getId()} is missing required credentials`);
    }

    if (!this.config.settings.supportedCurrencies || this.config.settings.supportedCurrencies.length === 0) {
      throw new Error(`Gateway ${this.getId()} must support at least one currency`);
    }
  }

  /**
   * Executes an operation with retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.debug(`Executing ${operationName} (attempt ${attempt})`, {
          gatewayId: this.getId(),
          attempt,
          maxRetries: this.maxRetries
        });

        const result = await operation();

        if (attempt > 1) {
          logger.info(`${operationName} succeeded after retry`, {
            gatewayId: this.getId(),
            attempt
          });
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        logger.warn(`${operationName} failed (attempt ${attempt})`, {
          gatewayId: this.getId(),
          attempt,
          error: lastError.message
        });

        // Don't retry on certain types of errors
        if (this.isNonRetryableError(lastError)) {
          logger.debug('Error is non-retryable, not attempting retry', {
            gatewayId: this.getId(),
            error: lastError.message
          });
          break;
        }

        // Wait before retry (except for last attempt)
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw this.createGatewayError(lastError || new Error('Operation failed'), operationName);
  }

  /**
   * Determines if an error should not be retried
   */
  protected isNonRetryableError(error: Error): boolean {
    const nonRetryablePatterns = [
      'invalid',
      'unauthorized',
      'forbidden',
      'not found',
      'bad request',
      'authentication',
      'permission'
    ];

    const errorMessage = error.message.toLowerCase();
    return nonRetryablePatterns.some(pattern => errorMessage.includes(pattern));
  }

  /**
   * Creates a standardized gateway error
   */
  protected createGatewayError(error: Error, operation: string): GatewayError {
    const gatewayError = new Error(`Gateway ${this.getId()} ${operation} failed: ${error.message}`) as GatewayError;
    gatewayError.gatewayId = this.getId();
    gatewayError.isRetryable = !this.isNonRetryableError(error);
    gatewayError.name = 'GatewayError';

    return gatewayError;
  }

  /**
   * Creates a standardized success response
   */
  protected createSuccessResponse<T>(data: T, metadata?: Record<string, any>): GatewayResponse<T> {
    return {
      success: true,
      data,
      metadata
    };
  }

  /**
   * Creates a standardized error response
   */
  protected createErrorResponse(
    code: string,
    message: string,
    details?: Record<string, any>
  ): GatewayResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details
      }
    };
  }

  /**
   * Validates a payment request
   */
  protected validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    if (!request.currency) {
      throw new Error('Payment currency is required');
    }

    if (!this.supportsCurrency(request.currency)) {
      throw new Error(`Currency ${request.currency} is not supported by gateway ${this.getId()}`);
    }

    if (!this.supportsAmount(request.amount)) {
      const { minAmount, maxAmount } = this.config.settings;
      throw new Error(
        `Amount ${request.amount} is outside supported range (min: ${minAmount}, max: ${maxAmount})`
      );
    }
  }

  /**
   * Validates a refund request
   */
  protected validateRefundRequest(transactionId: string, amount?: number): void {
    if (!transactionId) {
      throw new Error('Transaction ID is required for refund');
    }

    if (amount !== undefined && amount <= 0) {
      throw new Error('Refund amount must be greater than zero');
    }
  }

  /**
   * Utility method to add delay
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Logs gateway operation
   */
  protected logOperation(operation: string, data: Record<string, any>): void {
    logger.info(`Gateway operation: ${operation}`, {
      gatewayId: this.getId(),
      gatewayType: this.getType(),
      ...data
    });
  }

  /**
   * Logs gateway error
   */
  protected logError(operation: string, error: Error, data?: Record<string, any>): void {
    logger.error(`Gateway operation failed: ${operation}`, {
      gatewayId: this.getId(),
      gatewayType: this.getType(),
      error: error.message,
      ...data
    });
  }

  /**
   * Gets gateway configuration for logging (without sensitive data)
   */
  protected getSafeConfig(): Partial<GatewayConfig> {
    return {
      id: this.config.id,
      type: this.config.type,
      name: this.config.name,
      status: this.config.status,
      priority: this.config.priority,
      settings: this.config.settings,
      healthCheck: this.config.healthCheck,
      rateLimit: this.config.rateLimit
    };
  }

  /**
   * Default implementation for webhook verification
   * Should be overridden by specific gateway implementations
   */
  verifyWebhook(payload: string, signature: string): boolean {
    logger.warn('Default webhook verification used - should be overridden', {
      gatewayId: this.getId()
    });
    return false;
  }

  /**
   * Default implementation for webhook parsing
   * Should be overridden by specific gateway implementations
   */
  parseWebhook(payload: string): WebhookEvent {
    logger.warn('Default webhook parsing used - should be overridden', {
      gatewayId: this.getId()
    });

    return {
      id: `default_${Date.now()}`,
      type: 'unknown',
      gatewayId: this.getId(),
      gatewayEventId: `unknown_${Date.now()}`,
      data: { payload },
      timestamp: new Date(),
      processed: false,
      retryCount: 0
    };
  }

  /**
   * Default health check implementation
   * Can be overridden by specific gateway implementations
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Basic health check - verify configuration is valid
      this.validateConfig();
      return true;
    } catch (error) {
      this.logError('healthCheck', error instanceof Error ? error : new Error('Unknown error'));
      return false;
    }
  }

  /**
   * Default status check implementation
   */
  async getStatus(): Promise<GatewayStatus> {
    try {
      const isHealthy = await this.healthCheck();
      return isHealthy ? 'active' : 'error';
    } catch (error) {
      this.logError('getStatus', error instanceof Error ? error : new Error('Unknown error'));
      return 'error';
    }
  }
}