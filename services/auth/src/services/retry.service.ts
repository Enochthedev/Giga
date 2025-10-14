import { logger } from './logger.service';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors?: string[];
  nonRetryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

export interface RetryStats {
  totalAttempts: number;
  successfulRetries: number;
  failedRetries: number;
  averageAttempts: number;
  lastRetryTime?: Date;
}

export class RetryService {
  private static instance: RetryService;
  private stats = new Map<string, RetryStats>();

  static getInstance(): RetryService {
    if (!RetryService.instance) {
      RetryService.instance = new RetryService();
    }
    return RetryService.instance;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    operationName = 'unknown'
  ): Promise<T> {
    const finalConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
      jitter: true,
      retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'],
      nonRetryableErrors: [
        'ValidationError',
        'AuthenticationError',
        'AuthorizationError',
      ],
      ...config,
    };

    let lastError: Error;
    let attempt = 0;

    while (attempt < finalConfig.maxAttempts) {
      attempt++;

      try {
        const result = await operation();

        // Update success stats
        this.updateStats(operationName, attempt, true);

        if (attempt > 1) {
          logger.info(
            `Operation ${operationName} succeeded after ${attempt} attempts`
          );
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!this.isRetryableError(lastError, finalConfig)) {
          logger.warn(`Non-retryable error for operation ${operationName}`, {
            errorMessage: lastError.message,
            attempt,
          });
          throw lastError;
        }

        // If this is the last attempt, don't retry
        if (attempt >= finalConfig.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateDelay(attempt, finalConfig);

        logger.warn(`Retrying operation ${operationName} after error`, {
          errorMessage: lastError.message,
          attempt,
          nextAttemptIn: delay,
          maxAttempts: finalConfig.maxAttempts,
        });

        // Call retry callback if provided
        if (finalConfig.onRetry) {
          try {
            finalConfig.onRetry(attempt, lastError);
          } catch (callbackError) {
            logger.error('Error in retry callback', callbackError as Error);
          }
        }

        // Wait before retrying
        await this.delay(delay);
      }
    }

    // Update failure stats
    this.updateStats(operationName, attempt, false);

    logger.error(
      `Operation ${operationName} failed after ${attempt} attempts: ${lastError!.message}`
    );

    throw lastError!;
  }

  private isRetryableError(error: Error, config: RetryConfig): boolean {
    // Check non-retryable errors first
    if (
      config.nonRetryableErrors?.some(
        errorType =>
          error.name === errorType || error.message.includes(errorType)
      )
    ) {
      return false;
    }

    // Check retryable errors
    if (
      config.retryableErrors?.some(
        errorType =>
          error.name === errorType ||
          error.message.includes(errorType) ||
          (error as any).code === errorType
      )
    ) {
      return true;
    }

    // Default: retry on network and temporary errors
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /connection/i,
      /temporary/i,
      /unavailable/i,
      /overload/i,
      /rate.?limit/i,
    ];

    return retryablePatterns.some(
      pattern => pattern.test(error.message) || pattern.test(error.name)
    );
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    // Calculate exponential backoff
    let delay =
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);

    // Apply maximum delay limit
    delay = Math.min(delay, config.maxDelay);

    // Add jitter to prevent thundering herd
    if (config.jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      delay += (Math.random() - 0.5) * 2 * jitterAmount;
    }

    return Math.max(delay, 0);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private updateStats(
    operationName: string,
    attempts: number,
    success: boolean
  ): void {
    let stats = this.stats.get(operationName);

    if (!stats) {
      stats = {
        totalAttempts: 0,
        successfulRetries: 0,
        failedRetries: 0,
        averageAttempts: 0,
      };
      this.stats.set(operationName, stats);
    }

    stats.totalAttempts++;
    stats.lastRetryTime = new Date();

    if (success) {
      if (attempts > 1) {
        stats.successfulRetries++;
      }
    } else {
      stats.failedRetries++;
    }

    // Calculate rolling average attempts
    const totalOperations =
      stats.successfulRetries +
      stats.failedRetries +
      (stats.totalAttempts - stats.successfulRetries - stats.failedRetries);

    if (totalOperations > 0) {
      stats.averageAttempts = stats.totalAttempts / totalOperations;
    }
  }

  getStats(
    operationName?: string
  ): Record<string, RetryStats> | RetryStats | undefined {
    if (operationName) {
      return this.stats.get(operationName);
    }

    const allStats: Record<string, RetryStats> = {};
    for (const [name, stats] of this.stats) {
      allStats[name] = { ...stats };
    }
    return allStats;
  }

  clearStats(operationName?: string): void {
    if (operationName) {
      this.stats.delete(operationName);
    } else {
      this.stats.clear();
    }
  }

  // Convenience method for common retry patterns
  async retryDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    return this.executeWithRetry(
      operation,
      {
        maxAttempts: 3,
        baseDelay: 500,
        maxDelay: 5000,
        retryableErrors: [
          'ECONNRESET',
          'ENOTFOUND',
          'ETIMEDOUT',
          'ConnectionError',
        ],
        nonRetryableErrors: ['ValidationError', 'UniqueConstraintError'],
      },
      'database-operation'
    );
  }

  async retryExternalService<T>(
    operation: () => Promise<T>,
    serviceName: string
  ): Promise<T> {
    return this.executeWithRetry(
      operation,
      {
        maxAttempts: 5,
        baseDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        jitter: true,
        retryableErrors: [
          'ECONNRESET',
          'ENOTFOUND',
          'ECONNREFUSED',
          'ETIMEDOUT',
          '429',
          '502',
          '503',
          '504',
        ],
        nonRetryableErrors: ['400', '401', '403', '404', '422'],
      },
      `external-service-${serviceName}`
    );
  }

  async retryWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    circuitBreaker: any,
    operationName: string
  ): Promise<T> {
    return this.executeWithRetry(
      () => circuitBreaker.execute(operation),
      {
        maxAttempts: 2, // Fewer attempts when using circuit breaker
        baseDelay: 2000,
        maxDelay: 10000,
        onRetry: (attempt, error) => {
          logger.info(
            `Retrying operation ${operationName} with circuit breaker`,
            {
              attempt,
              errorMessage: error.message,
              circuitState: circuitBreaker.getStats().state,
            }
          );
        },
      },
      operationName
    );
  }
}
