export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
  successThreshold?: number;
  timeout?: number;
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  consecutiveFailures: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  state: CircuitBreakerState;
  nextAttempt?: number;
}

export class CircuitBreakerError extends Error {
  constructor(
    public readonly serviceName: string,
    public readonly state: CircuitBreakerState,
    public readonly metrics: CircuitBreakerMetrics
  ) {
    super(`Circuit breaker is ${state} for service ${serviceName}`);
    this.name = 'CircuitBreakerError';
  }
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private metrics: CircuitBreakerMetrics;
  private nextAttempt: number = 0;

  constructor(
    private readonly serviceName: string,
    private readonly options: CircuitBreakerOptions
  ) {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      consecutiveFailures: 0,
      state: this.state,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new CircuitBreakerError(
          this.serviceName,
          this.state,
          this.getMetrics()
        );
      }
      // Transition to half-open
      this.state = CircuitBreakerState.HALF_OPEN;
    }

    this.metrics.totalRequests++;

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  // eslint-disable-next-line require-await
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.options.timeout) {
      return operation();
    }

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new Error(`Operation timed out after ${this.options.timeout}ms`)
        );
      }, this.options.timeout);

      operation()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  private onSuccess(): void {
    this.metrics.successfulRequests++;
    this.metrics.consecutiveFailures = 0;
    this.metrics.lastSuccessTime = Date.now();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      const successThreshold = this.options.successThreshold || 1;
      if (this.metrics.successfulRequests >= successThreshold) {
        this.state = CircuitBreakerState.CLOSED;
      }
    }

    this.updateMetrics();
  }

  private onFailure(): void {
    this.metrics.failedRequests++;
    this.metrics.consecutiveFailures++;
    this.metrics.lastFailureTime = Date.now();

    if (
      this.state === CircuitBreakerState.CLOSED &&
      this.metrics.consecutiveFailures >= this.options.failureThreshold
    ) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    } else if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    }

    this.updateMetrics();
  }

  private updateMetrics(): void {
    this.metrics.state = this.state;
    this.metrics.nextAttempt = this.nextAttempt;
  }

  public getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  public reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      consecutiveFailures: 0,
      state: this.state,
    };
    this.nextAttempt = 0;
  }

  public forceOpen(): void {
    this.state = CircuitBreakerState.OPEN;
    this.nextAttempt = Date.now() + this.options.resetTimeout;
    this.updateMetrics();
  }

  public forceClose(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.nextAttempt = 0;
    this.updateMetrics();
  }
}

// Circuit breaker registry for managing multiple service circuit breakers
export class CircuitBreakerRegistry {
  private static instance: CircuitBreakerRegistry;
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  private constructor() {}

  public static getInstance(): CircuitBreakerRegistry {
    if (!CircuitBreakerRegistry.instance) {
      CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
    }
    return CircuitBreakerRegistry.instance;
  }

  public getCircuitBreaker(
    serviceName: string,
    options?: CircuitBreakerOptions
  ): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceName)) {
      const defaultOptions: CircuitBreakerOptions = {
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute
        monitoringPeriod: 10000, // 10 seconds
        successThreshold: 2,
        timeout: 30000, // 30 seconds
        ...options,
      };

      this.circuitBreakers.set(
        serviceName,
        new CircuitBreaker(serviceName, defaultOptions)
      );
    }

    return this.circuitBreakers.get(serviceName)!;
  }

  public getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};

    for (const [serviceName, circuitBreaker] of this.circuitBreakers) {
      metrics[serviceName] = circuitBreaker.getMetrics();
    }

    return metrics;
  }

  public resetAll(): void {
    for (const circuitBreaker of this.circuitBreakers.values()) {
      circuitBreaker.reset();
    }
  }

  public resetService(serviceName: string): void {
    const circuitBreaker = this.circuitBreakers.get(serviceName);
    if (circuitBreaker) {
      circuitBreaker.reset();
    }
  }
}
