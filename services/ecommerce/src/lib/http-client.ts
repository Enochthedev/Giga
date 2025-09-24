import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ServiceError } from '../types/errors';
import {
  CircuitBreaker,
  CircuitBreakerError,
  CircuitBreakerRegistry,
} from './circuit-breaker';
import { RetryManager, RetryOptions } from './retry';

// Extend axios types to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }

  interface AxiosResponse {
    metadata?: {
      responseTime: number;
    };
  }

  interface AxiosError {
    metadata?: {
      responseTime: number;
    };
  }
}

export interface HttpClientOptions {
  baseURL: string;
  timeout?: number;
  retryOptions?: Partial<RetryOptions>;
  circuitBreakerOptions?: {
    failureThreshold?: number;
    resetTimeout?: number;
    monitoringPeriod?: number;
    successThreshold?: number;
  };
  defaultHeaders?: Record<string, string>;
  serviceName: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  metadata: {
    service: string;
    version?: string;
    timestamp: string;
    correlationId?: string;
    responseTime?: number;
  };
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private circuitBreaker: CircuitBreaker;
  private serviceName: string;
  private retryOptions: Partial<RetryOptions>;

  constructor(options: HttpClientOptions) {
    this.serviceName = options.serviceName;
    this.retryOptions = options.retryOptions || {};

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `ecommerce-service/1.0.0`,
        ...options.defaultHeaders,
      },
    });

    // Get circuit breaker for this service
    const registry = CircuitBreakerRegistry.getInstance();
    this.circuitBreaker = registry.getCircuitBreaker(
      this.serviceName,
      options.circuitBreakerOptions
        ? {
            failureThreshold:
              options.circuitBreakerOptions.failureThreshold || 5,
            resetTimeout: options.circuitBreakerOptions.resetTimeout || 60000,
            monitoringPeriod:
              options.circuitBreakerOptions.monitoringPeriod || 10000,
            successThreshold:
              options.circuitBreakerOptions.successThreshold || 2,
          }
        : undefined
    );

    // Setup request interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        // Add correlation ID if available
        const correlationId = this.getCorrelationId();
        if (correlationId) {
          config.headers['X-Correlation-ID'] = correlationId;
        }

        // Add request timestamp
        config.metadata = {
          startTime: Date.now(),
        };

        return config;
      },
      error => Promise.reject(error)
    );

    // Setup response interceptor
    this.axiosInstance.interceptors.response.use(
      response => {
        // Calculate response time
        const startTime = response.config.metadata?.startTime;
        if (startTime) {
          response.metadata = {
            responseTime: Date.now() - startTime,
          };
        }

        return response;
      },
      error => {
        // Calculate response time for errors too
        const startTime = error.config?.metadata?.startTime;
        if (startTime) {
          error.metadata = {
            responseTime: Date.now() - startTime,
          };
        }

        return Promise.reject(error);
      }
    );
  }

  // eslint-disable-next-line require-await
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    return this.executeRequest(
      () => this.axiosInstance.get(url, config),
      retryOptions
    );
  }

  // eslint-disable-next-line require-await
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    return this.executeRequest(
      () => this.axiosInstance.post(url, data, config),
      retryOptions
    );
  }

  // eslint-disable-next-line require-await
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    return this.executeRequest(
      () => this.axiosInstance.put(url, data, config),
      retryOptions
    );
  }

  // eslint-disable-next-line require-await
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    return this.executeRequest(
      () => this.axiosInstance.patch(url, data, config),
      retryOptions
    );
  }

  // eslint-disable-next-line require-await
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    return this.executeRequest(
      () => this.axiosInstance.delete(url, config),
      retryOptions
    );
  }

  private async executeRequest<T>(
    operation: () => Promise<AxiosResponse<T>>,
    retryOptions?: Partial<RetryOptions>
  ): Promise<ServiceResponse<T>> {
    const finalRetryOptions = { ...this.retryOptions, ...retryOptions };
    const correlationId = this.getCorrelationId();

    try {
      // Execute with circuit breaker and retry
      const response = await this.circuitBreaker.execute(async () => {
        const result = await RetryManager.executeWithRetry(
          operation,
          finalRetryOptions,
          this.serviceName
        );
        return result;
      });

      // Return successful response
      return {
        success: true,
        data: response.data,
        metadata: {
          service: this.serviceName,
          timestamp: new Date().toISOString(),
          correlationId,
          responseTime: response.metadata?.responseTime,
        },
      };
    } catch (error) {
      return this.handleError(error, correlationId);
    }
  }

  private handleError(error: any, correlationId?: string): ServiceResponse {
    // Handle circuit breaker errors
    if (error instanceof CircuitBreakerError) {
      const serviceError: ServiceError = {
        service: this.serviceName,
        operation: 'http_request',
        error: {
          code: 'CIRCUIT_BREAKER_OPEN',
          message: `Service ${this.serviceName} is currently unavailable (circuit breaker open)`,
          details: {
            state: error.state,
            metrics: error.metrics,
          },
        },
        timestamp: new Date().toISOString(),
        correlationId: correlationId || 'unknown',
      };

      return {
        success: false,
        error: serviceError,
        metadata: {
          service: this.serviceName,
          timestamp: new Date().toISOString(),
          correlationId,
        },
      };
    }

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const serviceError: ServiceError = {
        service: this.serviceName,
        operation: 'http_request',
        error: {
          code: this.getErrorCode(axiosError),
          message: this.getErrorMessage(axiosError),
          details: {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            url: axiosError.config?.url,
            method: axiosError.config?.method?.toUpperCase(),
            responseTime: axiosError.metadata?.responseTime,
          },
        },
        timestamp: new Date().toISOString(),
        correlationId: correlationId || 'unknown',
      };

      return {
        success: false,
        error: serviceError,
        metadata: {
          service: this.serviceName,
          timestamp: new Date().toISOString(),
          correlationId,
          responseTime: axiosError.metadata?.responseTime,
        },
      };
    }

    // Handle other errors
    const serviceError: ServiceError = {
      service: this.serviceName,
      operation: 'http_request',
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        details: {
          name: error.name,
          stack:
            process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        },
      },
      timestamp: new Date().toISOString(),
      correlationId: correlationId || 'unknown',
    };

    return {
      success: false,
      error: serviceError,
      metadata: {
        service: this.serviceName,
        timestamp: new Date().toISOString(),
        correlationId,
      },
    };
  }

  private getErrorCode(error: AxiosError): string {
    if (error.code) {
      return error.code;
    }

    if (error.response?.status) {
      return `HTTP_${error.response.status}`;
    }

    return 'UNKNOWN_ERROR';
  }

  private getErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any;

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (error.response?.statusText) {
      return error.response.statusText;
    }

    return error.message || 'Request failed';
  }

  private getCorrelationId(): string | undefined {
    // In a real implementation, you might get this from async local storage
    // or request context. For now, we'll return undefined.
    return undefined;
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', {}, { maxRetries: 1 });
      return response.success;
    } catch {
      return false;
    }
  }

  // Get circuit breaker metrics
  getMetrics() {
    return this.circuitBreaker.getMetrics();
  }

  // Reset circuit breaker
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
  }
}

// Factory for creating HTTP clients with predefined configurations
export class HttpClientFactory {
  private static clients: Map<string, HttpClient> = new Map();

  static createClient(options: HttpClientOptions): HttpClient {
    const key = `${options.serviceName}-${options.baseURL}`;

    if (!this.clients.has(key)) {
      this.clients.set(key, new HttpClient(options));
    }

    return this.clients.get(key)!;
  }

  static getClient(
    serviceName: string,
    baseURL?: string
  ): HttpClient | undefined {
    const key = baseURL ? `${serviceName}-${baseURL}` : serviceName;

    // If no baseURL provided, find the first client for the service
    if (!baseURL) {
      for (const [clientKey, client] of this.clients) {
        if (clientKey.startsWith(`${serviceName}-`)) {
          return client;
        }
      }
    }

    return this.clients.get(key);
  }

  static getAllClients(): Map<string, HttpClient> {
    return new Map(this.clients);
  }

  static getHealthStatus(): Record<string, unknown> {
    const status: Record<string, unknown> = {};

    for (const [key, client] of this.clients) {
      status[key] = client.getMetrics();
    }

    return status;
  }
}

// Graceful degradation helper
export class GracefulDegradation {
  // eslint-disable-next-line require-await
  static async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    serviceName: string
  ): Promise<T> {
    try {
      return primaryOperation();
    } catch (error) {
      console.warn(
        `Primary operation failed for ${serviceName}, using fallback`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          serviceName,
        }
      );

      return fallbackOperation();
    }
  }

  // eslint-disable-next-line require-await
  static async executeWithDefault<T>(
    operation: () => Promise<T>,
    defaultValue: T,
    serviceName: string
  ): Promise<T> {
    try {
      return operation();
    } catch (error) {
      console.warn(`Operation failed for ${serviceName}, using default value`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceName,
        defaultValue,
      });

      return defaultValue;
    }
  }
}
