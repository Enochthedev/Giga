import { logger } from './logger.service';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
  expectedErrors?: string[];
  name: string;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  nextAttemptTime?: Date;
  totalRequests: number;
  failureRate: number;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: Date;
  private nextAttemptTime?: Date;
  private totalRequests = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      ...config,
      failureThreshold: config.failureThreshold ?? 5,
      recoveryTimeout: config.recoveryTimeout ?? 60000, // 1 minute
      monitoringPeriod: config.monitoringPeriod ?? 300000, // 5 minutes
      expectedErrors: config.expectedErrors ?? [],
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        logger.info(
          `Circuit breaker ${this.config.name} transitioning to HALF_OPEN`
        );
      } else {
        throw new Error(`Circuit breaker ${this.config.name} is OPEN`);
      }
    }

    try {
      this.totalRequests++;
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private onSuccess(): void {
    this.successCount++;

    if (this.state === CircuitState.HALF_OPEN) {
      this.reset();
      logger.info(
        `Circuit breaker ${this.config.name} reset to CLOSED after successful request`
      );
    }
  }

  private onFailure(error: Error): void {
    // Check if this is an expected error that shouldn't trigger circuit breaker
    if (this.config.expectedErrors?.includes(error.name)) {
      return;
    }

    this.failureCount++;
    this.lastFailureTime = new Date();

    logger.warn(`Circuit breaker ${this.config.name} recorded failure`, {
      errorMessage: error.message,
      failureCount: this.failureCount,
      threshold: this.config.failureThreshold,
    });

    if (this.failureCount >= this.config.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = new Date(Date.now() + this.config.recoveryTimeout);

    logger.error(
      `Circuit breaker ${this.config.name} tripped to OPEN state`,
      new Error('Circuit breaker tripped'),
      {
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold,
        nextAttemptTime: this.nextAttemptTime,
      }
    );
  }

  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = undefined;
    this.nextAttemptTime = undefined;
  }

  private shouldAttemptReset(): boolean {
    return (
      this.nextAttemptTime !== undefined && new Date() >= this.nextAttemptTime
    );
  }

  getStats(): CircuitBreakerStats {
    const failureRate =
      this.totalRequests > 0
        ? (this.failureCount / this.totalRequests) * 100
        : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
      totalRequests: this.totalRequests,
      failureRate: Math.round(failureRate * 100) / 100,
    };
  }

  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  isClosed(): boolean {
    return this.state === CircuitState.CLOSED;
  }

  isHalfOpen(): boolean {
    return this.state === CircuitState.HALF_OPEN;
  }

  forceOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = new Date(Date.now() + this.config.recoveryTimeout);
    logger.warn(
      `Circuit breaker ${this.config.name} manually forced to OPEN state`
    );
  }

  forceClose(): void {
    this.reset();
    logger.info(
      `Circuit breaker ${this.config.name} manually reset to CLOSED state`
    );
  }
}

export class CircuitBreakerRegistry {
  private static instance: CircuitBreakerRegistry;
  private breakers = new Map<string, CircuitBreaker>();

  static getInstance(): CircuitBreakerRegistry {
    if (!CircuitBreakerRegistry.instance) {
      CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
    }
    return CircuitBreakerRegistry.instance;
  }

  register(
    name: string,
    config: Omit<CircuitBreakerConfig, 'name'>
  ): CircuitBreaker {
    const breaker = new CircuitBreaker({ ...config, name });
    this.breakers.set(name, breaker);
    logger.info(`Circuit breaker registered: ${name}`);
    return breaker;
  }

  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  getOrCreate(
    name: string,
    config: Omit<CircuitBreakerConfig, 'name'>
  ): CircuitBreaker {
    let breaker = this.breakers.get(name);
    if (!breaker) {
      breaker = this.register(name, config);
    }
    return breaker;
  }

  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }

  getHealthyBreakers(): string[] {
    return Array.from(this.breakers.entries())
      .filter(([, breaker]) => breaker.isClosed())
      .map(([name]) => name);
  }

  getUnhealthyBreakers(): string[] {
    return Array.from(this.breakers.entries())
      .filter(([, breaker]) => !breaker.isClosed())
      .map(([name]) => name);
  }
}
