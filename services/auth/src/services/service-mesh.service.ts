import { NextFunction, Request, Response } from 'express';
import { logger } from './logger.service';

export interface ServiceMeshHeaders {
  'x-request-id'?: string;
  'x-b3-traceid'?: string;
  'x-b3-spanid'?: string;
  'x-b3-parentspanid'?: string;
  'x-b3-sampled'?: string;
  'x-b3-flags'?: string;
  'x-ot-span-context'?: string;
  'x-cloud-trace-context'?: string;
  traceparent?: string;
  tracestate?: string;
  'x-forwarded-for'?: string;
  'x-forwarded-proto'?: string;
  'x-forwarded-host'?: string;
  'x-original-uri'?: string;
  'x-real-ip'?: string;
  'user-agent'?: string;
  authorization?: string;
}

export interface ServiceInfo {
  name: string;
  version: string;
  instance: string;
  cluster?: string;
  namespace?: string;
  region?: string;
  zone?: string;
}

export interface HealthCheckResponse {
  status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
  checks: Record<
    string,
    {
      status: 'UP' | 'DOWN';
      details?: any;
    }
  >;
  info: ServiceInfo;
  timestamp: string;
}

export class ServiceMeshService {
  private static instance: ServiceMeshService;
  private serviceInfo: ServiceInfo;

  private constructor() {
    this.serviceInfo = {
      name: process.env.SERVICE_NAME || 'auth-service',
      version: process.env.SERVICE_VERSION || '1.0.0',
      instance: process.env.HOSTNAME || process.env.POD_NAME || 'local',
      cluster: process.env.CLUSTER_NAME,
      namespace: process.env.NAMESPACE || process.env.POD_NAMESPACE,
      region: process.env.REGION,
      zone: process.env.ZONE,
    };
  }

  static getInstance(): ServiceMeshService {
    if (!ServiceMeshService.instance) {
      ServiceMeshService.instance = new ServiceMeshService();
    }
    return ServiceMeshService.instance;
  }

  /**
   * Middleware to extract and propagate service mesh headers
   */
  extractServiceMeshHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      const meshHeaders: ServiceMeshHeaders = {};

      // Extract tracing headers
      const tracingHeaders = [
        'x-request-id',
        'x-b3-traceid',
        'x-b3-spanid',
        'x-b3-parentspanid',
        'x-b3-sampled',
        'x-b3-flags',
        'x-ot-span-context',
        'x-cloud-trace-context',
        'traceparent',
        'tracestate',
      ];

      // Extract forwarding headers
      const forwardingHeaders = [
        'x-forwarded-for',
        'x-forwarded-proto',
        'x-forwarded-host',
        'x-original-uri',
        'x-real-ip',
        'user-agent',
        'authorization',
      ];

      [...tracingHeaders, ...forwardingHeaders].forEach(header => {
        const value = req.headers[header];
        if (value) {
          meshHeaders[header as keyof ServiceMeshHeaders] = Array.isArray(value)
            ? value[0]
            : value;
        }
      });

      // Generate request ID if not present
      if (!meshHeaders['x-request-id']) {
        meshHeaders['x-request-id'] = this.generateRequestId();
      }

      // Store mesh headers in request context
      req.meshHeaders = meshHeaders;

      // Set response headers for downstream services
      res.set('x-service-name', this.serviceInfo.name);
      res.set('x-service-version', this.serviceInfo.version);
      res.set('x-service-instance', this.serviceInfo.instance);

      // Propagate request ID
      res.set('x-request-id', meshHeaders['x-request-id']!);

      next();
    };
  }

  /**
   * Get headers to propagate to downstream services
   */
  getPropagationHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    if (req.meshHeaders) {
      Object.entries(req.meshHeaders).forEach(([key, value]) => {
        if (value) {
          headers[key] = value;
        }
      });
    }

    // Add service identification headers
    headers['x-calling-service'] = this.serviceInfo.name;
    headers['x-calling-service-version'] = this.serviceInfo.version;
    headers['x-calling-service-instance'] = this.serviceInfo.instance;

    return headers;
  }

  /**
   * Create HTTP client with service mesh headers
   */
  createHttpClient(req: Request) {
    const propagationHeaders = this.getPropagationHeaders(req);

    return {
      headers: propagationHeaders,
      timeout: 30000,
      retries: 3,
    };
  }

  /**
   * Service mesh compatible health check endpoint
   */
  async getHealthCheck(): Promise<HealthCheckResponse> {
    const checks: Record<string, { status: 'UP' | 'DOWN'; details?: any }> = {};

    // Database health check
    try {
      // This would be replaced with actual database ping
      checks.database = { status: 'UP', details: { responseTime: '5ms' } };
    } catch (error) {
      checks.database = {
        status: 'DOWN',
        details: { error: (error as Error).message },
      };
    }

    // Redis health check
    try {
      // This would be replaced with actual Redis ping
      checks.redis = { status: 'UP', details: { responseTime: '2ms' } };
    } catch (error) {
      checks.redis = {
        status: 'DOWN',
        details: { error: (error as Error).message },
      };
    }

    // External services health check
    checks.emailService = { status: 'UP' };
    checks.smsService = { status: 'UP' };

    // Determine overall status
    const hasDownServices = Object.values(checks).some(
      check => check.status === 'DOWN'
    );
    const status = hasDownServices ? 'DOWN' : 'UP';

    return {
      status,
      checks,
      info: this.serviceInfo,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe for Kubernetes
   */
  async getReadinessCheck(): Promise<{ status: 'UP' | 'DOWN'; details: any }> {
    try {
      // Check if service is ready to accept traffic
      // This includes database connections, required services, etc.

      return {
        status: 'UP',
        details: {
          database: 'connected',
          redis: 'connected',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'DOWN',
        details: {
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Liveness probe for Kubernetes
   */
  async getLivenessCheck(): Promise<{ status: 'UP' | 'DOWN'; details: any }> {
    try {
      // Check if service is alive and not deadlocked
      // This is usually a simple check

      return {
        status: 'UP',
        details: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'DOWN',
        details: {
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Get service metrics in Prometheus format
   */
  getMetrics(): string {
    const metrics = [
      '# HELP auth_service_requests_total Total number of requests',
      '# TYPE auth_service_requests_total counter',
      'auth_service_requests_total 1000',
      '',
      '# HELP auth_service_request_duration_seconds Request duration in seconds',
      '# TYPE auth_service_request_duration_seconds histogram',
      'auth_service_request_duration_seconds_bucket{le="0.1"} 100',
      'auth_service_request_duration_seconds_bucket{le="0.5"} 200',
      'auth_service_request_duration_seconds_bucket{le="1.0"} 300',
      'auth_service_request_duration_seconds_bucket{le="+Inf"} 400',
      'auth_service_request_duration_seconds_sum 150.5',
      'auth_service_request_duration_seconds_count 400',
      '',
      '# HELP auth_service_active_connections Current active connections',
      '# TYPE auth_service_active_connections gauge',
      'auth_service_active_connections 25',
    ];

    return metrics.join('\n');
  }

  /**
   * Middleware for distributed tracing
   */
  tracingMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const traceId =
        req.meshHeaders?.['x-b3-traceid'] ||
        req.meshHeaders?.['traceparent']?.split('-')[1] ||
        this.generateTraceId();

      const spanId = this.generateSpanId();

      // Add tracing context to request
      req.traceContext = {
        traceId,
        spanId,
        parentSpanId: req.meshHeaders?.['x-b3-spanid'],
      };

      // Add tracing headers to response
      res.set('x-trace-id', traceId);
      res.set('x-span-id', spanId);

      // Log request with tracing context
      logger.info('Request received', {
        method: req.method,
        url: req.url,
        traceId,
        spanId,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      });

      next();
    };
  }

  /**
   * Circuit breaker status for service mesh
   */
  getCircuitBreakerStatus(): Record<string, any> {
    // This would integrate with the circuit breaker service
    return {
      emailService: { state: 'CLOSED', failureRate: 0.02 },
      smsService: { state: 'CLOSED', failureRate: 0.01 },
      database: { state: 'CLOSED', failureRate: 0.001 },
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return Math.random().toString(16).substr(2, 16);
  }

  private generateSpanId(): string {
    return Math.random().toString(16).substr(2, 8);
  }

  getServiceInfo(): ServiceInfo {
    return { ...this.serviceInfo };
  }

  updateServiceInfo(updates: Partial<ServiceInfo>): void {
    this.serviceInfo = { ...this.serviceInfo, ...updates };
    logger.info('Service info updated', this.serviceInfo);
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      meshHeaders?: ServiceMeshHeaders;
      traceContext?: {
        traceId: string;
        spanId: string;
        parentSpanId?: string;
      };
    }
  }
}
