export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed';
  jitter: boolean;
  retryCondition?: (error: any) => boolean;
}

export interface RetryMetrics {
  attempt: number;
  totalAttempts: number;
  totalDelay: number;
  lastError?: Error;
  startTime: number;
  endTime?: number;
}

export class RetryError extends Error {
  constructor(
    public readonly originalError: Error,
    public readonly metrics: RetryMetrics,
    public readonly serviceName?: string
  ) {
    super(`Retry failed after ${metrics.totalAttempts} attempts: ${originalError.message}`);
    this.name = 'RetryError';
  }
}

export class RetryManager {
  private static readonly DEFAULT_OPTIONS: RetryOptions = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffStrategy: 'exponential',
    jitter: true,
    retryCondition: (error: any) => {
      // Retry on network errors, timeouts, and 5xx status codes
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return true;
      }

      if (error.response?.status >= 500) {
        return true;
      }

      // Don't retry on client errors (4xx) except for specific cases
      if (error.response?.status >= 400 && error.response?.status < 500) {
        // Retry on rate limiting
        if (error.response?.status === 429) {
          return true;
        }
        return false;
      }

      return true;
    },
  };

  public static async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    serviceName?: string
  ): Promise<T> {
    const finalOptions = { ...RetryManager.DEFAULT_OPTIONS, ...options };
    const metrics: RetryMetrics = {
      attempt: 0,
      totalAttempts: 0,
      totalDelay: 0,
      startTime: Date.now(),
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= finalOptions.maxRetries; attempt++) {
      metrics.attempt = attempt;
      metrics.totalAttempts = attempt + 1;

      try {
        const result = await operation();
        metrics.endTime = Date.now();
        return result;
      } catch (error) {
        lastError = error as Error;
        metrics.lastError = lastError;

        // Don't retry if this is the last attempt
        if (attempt === finalOptions.maxRetries) {
          break;
        }

        // Check if we should retry this error
        if (finalOptions.retryCondition && !finalOptions.retryCondition(error)) {
          break;
        }

        // Calculate delay for next attempt
        const delay = RetryManager.calculateDelay(
          attempt,
          finalOptions.initialDelay,
          finalOptions.maxDelay,
          finalOptions.backoffStrategy,
          finalOptions.jitter
        );

        metrics.totalDelay += delay;

        // Log retry attempt
        console.warn(`Retry attempt ${attempt + 1}/${finalOptions.maxRetries + 1} for ${serviceName || 'operation'} after ${delay}ms delay`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempt: attempt + 1,
          delay,
          serviceName,
        });

        await RetryManager.sleep(delay);
      }
    }

    metrics.endTime = Date.now();
    throw new RetryError(lastError!, metrics, serviceName);
  }

  private static calculateDelay(
    attempt: number,
    initialDelay: number,
    maxDelay: number,
    strategy: 'exponential' | 'linear' | 'fixed',
    jitter: boolean
  ): number {
    let delay: number;

    switch (strategy) {
      case 'exponential':
        delay = initialDelay * Math.pow(2, attempt);
        break;
      case 'linear':
        delay = initialDelay * (attempt + 1);
        break;
      case 'fixed':
      default:
        delay = initialDelay;
        break;
    }

    // Apply maximum delay limit
    delay = Math.min(delay, maxDelay);

    // Apply jitter to avoid thundering herd
    if (jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static createRetryableOperation<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    serviceName?: string
  ): () => Promise<T> {
    return () => RetryManager.executeWithRetry(operation, options, serviceName);
  }
}

// Specific retry configurations for different types of operations
export const RetryConfigurations = {
  // For critical operations that must succeed
  critical: {
    maxRetries: 5,
    initialDelay: 1000,
    maxDelay: 60000,
    backoffStrategy: 'exponential' as const,
    jitter: true,
  },

  // For payment operations
  payment: {
    maxRetries: 3,
    initialDelay: 2000,
    maxDelay: 30000,
    backoffStrategy: 'exponential' as const,
    jitter: true,
    retryCondition: (error: any) => {
      // Don't retry payment failures due to insufficient funds, invalid cards, etc.
      if (error.response?.status === 402 || error.response?.status === 400) {
        return false;
      }
      return error.response?.status >= 500 || error.code === 'ETIMEDOUT';
    },
  },

  // For inventory operations
  inventory: {
    maxRetries: 4,
    initialDelay: 500,
    maxDelay: 10000,
    backoffStrategy: 'exponential' as const,
    jitter: true,
    retryCondition: (error: any) => {
      // Don't retry on insufficient stock
      if (error.type === 'INSUFFICIENT_STOCK') {
        return false;
      }
      return true;
    },
  },

  // For notification operations (less critical)
  notification: {
    maxRetries: 2,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffStrategy: 'linear' as const,
    jitter: true,
  },

  // For authentication operations
  auth: {
    maxRetries: 2,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffStrategy: 'exponential' as const,
    jitter: false,
    retryCondition: (error: any) => {
      // Don't retry on authentication failures
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return error.response?.status >= 500;
    },
  },
};