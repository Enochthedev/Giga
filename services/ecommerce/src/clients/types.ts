export interface RetryConfig {
  maxRetries: number;
  backoffStrategy: 'exponential' | 'linear';
  initialDelay: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    service: string;
    version: string;
    timestamp: string;
    correlationId: string;
  };
}

// Health check interface for service monitoring
export interface ServiceHealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  timestamp: string;
}

export interface ServiceHealthChecker {
  checkHealth(): Promise<ServiceHealthCheck>;
}

// Service discovery interface
export interface ServiceRegistry {
  getServiceUrl(serviceName: string): Promise<string>;
  registerService(
    serviceName: string,
    url: string,
    healthCheck: string
  ): Promise<void>;
  deregisterService(serviceName: string): Promise<void>;
}
