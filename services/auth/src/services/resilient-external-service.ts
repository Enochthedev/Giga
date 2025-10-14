import {
  CircuitBreaker,
  CircuitBreakerRegistry,
} from './circuit-breaker.service';
import { logger } from './logger.service';
import { RetryService } from './retry.service';

export interface ExternalServiceConfig {
  name: string;
  baseUrl?: string;
  timeout: number;
  circuitBreaker: {
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringPeriod: number;
  };
  retry: {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
  };
  fallback?: {
    enabled: boolean;
    handler?: () => Promise<any>;
  };
}

export interface ServiceHealth {
  name: string;
  isHealthy: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
  circuitBreakerState: string;
  retryStats: any;
}

export class ResilientExternalService {
  private circuitBreaker: CircuitBreaker;
  private retryService: RetryService;
  private config: ExternalServiceConfig;
  private lastHealthCheck?: Date;
  private lastResponseTime?: number;
  private lastError?: string;

  constructor(config: ExternalServiceConfig) {
    this.config = config;
    this.retryService = RetryService.getInstance();

    // Register circuit breaker
    const registry = CircuitBreakerRegistry.getInstance();
    this.circuitBreaker = registry.getOrCreate(config.name, {
      failureThreshold: config.circuitBreaker.failureThreshold,
      recoveryTimeout: config.circuitBreaker.recoveryTimeout,
      monitoringPeriod: config.circuitBreaker.monitoringPeriod,
      expectedErrors: ['ValidationError', 'AuthenticationError'],
    });
  }

  async execute<T>(
    operation: () => Promise<T>,
    operationName = 'external-call',
    fallbackValue?: T
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Execute with circuit breaker and retry logic
      const result = await this.retryService.retryWithCircuitBreaker(
        operation,
        this.circuitBreaker,
        `${this.config.name}-${operationName}`
      );

      // Update health metrics
      this.lastResponseTime = Date.now() - startTime;
      this.lastHealthCheck = new Date();
      this.lastError = undefined;

      logger.debug(
        `External service call succeeded: ${this.config.name} - ${operationName} - ${this.lastResponseTime}ms`
      );

      return result;
    } catch (error) {
      this.lastError = (error as Error).message;
      this.lastHealthCheck = new Date();

      logger.error(
        `External service call failed: ${this.config.name} - ${operationName} - ${this.lastError}`
      );

      // Try fallback if available
      if (this.config.fallback?.enabled) {
        return this.executeFallback(fallbackValue, operationName);
      }

      throw error;
    }
  }

  private async executeFallback<T>(
    fallbackValue?: T,
    operationName = 'unknown'
  ): Promise<T> {
    logger.warn(`Executing fallback for external service`, {
      service: this.config.name,
      operation: operationName,
    });

    if (this.config.fallback?.handler) {
      try {
        return await this.config.fallback.handler();
      } catch (fallbackError) {
        logger.error(
          `Fallback handler failed: ${this.config.name} - ${operationName} - ${(fallbackError as Error).message}`
        );
      }
    }

    if (fallbackValue !== undefined) {
      return fallbackValue;
    }

    throw new Error(`No fallback available for ${this.config.name} service`);
  }

  async healthCheck(): Promise<ServiceHealth> {
    const health: ServiceHealth = {
      name: this.config.name,
      isHealthy: false,
      lastCheck: new Date(),
      circuitBreakerState: this.circuitBreaker.getStats().state,
      retryStats: this.retryService.getStats(
        `${this.config.name}-health-check`
      ),
    };

    try {
      const startTime = Date.now();

      // Perform a simple health check operation
      await this.circuitBreaker.execute(async () => {
        // This would be a simple ping or health endpoint call
        // For now, we'll simulate it
        await new Promise(resolve => setTimeout(resolve, 100));

        if (Math.random() < 0.1) {
          // 10% chance of simulated failure
          throw new Error('Simulated health check failure');
        }
      });

      health.isHealthy = true;
      health.responseTime = Date.now() - startTime;
      this.lastResponseTime = health.responseTime;
    } catch (error) {
      health.isHealthy = false;
      health.error = (error as Error).message;
      this.lastError = health.error;
    }

    this.lastHealthCheck = health.lastCheck;
    return health;
  }

  getHealth(): ServiceHealth {
    return {
      name: this.config.name,
      isHealthy: this.circuitBreaker.isClosed() && !this.lastError,
      lastCheck: this.lastHealthCheck || new Date(),
      responseTime: this.lastResponseTime,
      error: this.lastError,
      circuitBreakerState: this.circuitBreaker.getStats().state,
      retryStats: this.retryService.getStats(
        `${this.config.name}-health-check`
      ),
    };
  }

  forceCircuitOpen(): void {
    this.circuitBreaker.forceOpen();
    logger.warn(
      `Circuit breaker manually opened for service ${this.config.name}`
    );
  }

  forceCircuitClose(): void {
    this.circuitBreaker.forceClose();
    logger.info(
      `Circuit breaker manually closed for service ${this.config.name}`
    );
  }

  getStats() {
    return {
      circuitBreaker: this.circuitBreaker.getStats(),
      retry: this.retryService.getStats(),
      health: this.getHealth(),
    };
  }
}

export class ExternalServiceManager {
  private static instance: ExternalServiceManager;
  private services = new Map<string, ResilientExternalService>();

  static getInstance(): ExternalServiceManager {
    if (!ExternalServiceManager.instance) {
      ExternalServiceManager.instance = new ExternalServiceManager();
    }
    return ExternalServiceManager.instance;
  }

  register(config: ExternalServiceConfig): ResilientExternalService {
    const service = new ResilientExternalService(config);
    this.services.set(config.name, service);
    logger.info(`External service registered: ${config.name}`);
    return service;
  }

  get(name: string): ResilientExternalService | undefined {
    return this.services.get(name);
  }

  async healthCheckAll(): Promise<Record<string, ServiceHealth>> {
    const healthChecks: Record<string, ServiceHealth> = {};

    const promises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          healthChecks[name] = await service.healthCheck();
        } catch (error) {
          healthChecks[name] = {
            name,
            isHealthy: false,
            lastCheck: new Date(),
            error: (error as Error).message,
            circuitBreakerState: 'UNKNOWN',
            retryStats: null,
          };
        }
      }
    );

    await Promise.allSettled(promises);
    return healthChecks;
  }

  getHealthSummary(): {
    totalServices: number;
    healthyServices: number;
    unhealthyServices: number;
    services: Record<string, ServiceHealth>;
  } {
    const services: Record<string, ServiceHealth> = {};
    let healthyCount = 0;

    for (const [name, service] of this.services) {
      const health = service.getHealth();
      services[name] = health;
      if (health.isHealthy) {
        healthyCount++;
      }
    }

    return {
      totalServices: this.services.size,
      healthyServices: healthyCount,
      unhealthyServices: this.services.size - healthyCount,
      services,
    };
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, unknown> = {};
    for (const [name, service] of this.services) {
      stats[name] = service.getStats();
    }
    return stats;
  }
}
