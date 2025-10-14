import { NextFunction, Request, Response } from 'express';
import { CircuitBreakerRegistry } from '../services/circuit-breaker.service';
import { GracefulDegradationService } from '../services/graceful-degradation.service';
import { logger } from '../services/logger.service';
import { ExternalServiceManager } from '../services/resilient-external-service';
import { ServiceMeshService } from '../services/service-mesh.service';

export interface ResilienceConfig {
  enableCircuitBreakers: boolean;
  enableGracefulDegradation: boolean;
  enableServiceMesh: boolean;
  enableHealthChecks: boolean;
  healthCheckInterval: number;
}

export class ResilienceMiddleware {
  private static instance: ResilienceMiddleware;
  private config: ResilienceConfig;
  private circuitBreakerRegistry: CircuitBreakerRegistry;
  private degradationService: GracefulDegradationService;
  private serviceMesh: ServiceMeshService;
  private externalServiceManager: ExternalServiceManager;

  private constructor() {
    this.config = {
      enableCircuitBreakers: process.env.ENABLE_CIRCUIT_BREAKERS !== 'false',
      enableGracefulDegradation:
        process.env.ENABLE_GRACEFUL_DEGRADATION !== 'false',
      enableServiceMesh: process.env.ENABLE_SERVICE_MESH !== 'false',
      enableHealthChecks: process.env.ENABLE_HEALTH_CHECKS !== 'false',
      healthCheckInterval: parseInt(
        process.env.HEALTH_CHECK_INTERVAL || '60000'
      ),
    };

    this.circuitBreakerRegistry = CircuitBreakerRegistry.getInstance();
    this.degradationService = GracefulDegradationService.getInstance();
    this.serviceMesh = ServiceMeshService.getInstance();
    this.externalServiceManager = ExternalServiceManager.getInstance();

    this.initializeFeatures();
  }

  static getInstance(): ResilienceMiddleware {
    if (!ResilienceMiddleware.instance) {
      ResilienceMiddleware.instance = new ResilienceMiddleware();
    }
    return ResilienceMiddleware.instance;
  }

  private initializeFeatures(): void {
    // Register features for graceful degradation
    this.degradationService.registerFeature({
      name: 'email-notifications',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
      healthCheck: async () => {
        const emailService = this.externalServiceManager.get('email-service');
        return emailService ? emailService.getHealth().isHealthy : true;
      },
    });

    this.degradationService.registerFeature({
      name: 'sms-notifications',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
      healthCheck: async () => {
        const smsService = this.externalServiceManager.get('sms-service');
        return smsService ? smsService.getHealth().isHealthy : true;
      },
    });

    this.degradationService.registerFeature({
      name: 'analytics-tracking',
      enabled: true,
      critical: false,
      fallbackBehavior: 'disable',
    });

    this.degradationService.registerFeature({
      name: 'audit-logging',
      enabled: true,
      critical: true, // Critical feature
      fallbackBehavior: 'cache',
    });

    this.degradationService.registerFeature({
      name: 'user-authentication',
      enabled: true,
      critical: true, // Critical feature
      fallbackBehavior: 'disable',
    });

    // Start health monitoring if enabled
    if (this.config.enableHealthChecks) {
      this.degradationService.startHealthMonitoring(
        this.config.healthCheckInterval
      );
    }

    logger.info('Resilience features initialized', this.config);
  }

  /**
   * Main resilience middleware
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Add resilience context to request
      req.resilience = {
        circuitBreakers: this.circuitBreakerRegistry,
        degradation: this.degradationService,
        serviceMesh: this.serviceMesh,
        externalServices: this.externalServiceManager,
      };

      // Apply service mesh headers if enabled
      if (this.config.enableServiceMesh) {
        this.serviceMesh.extractServiceMeshHeaders()(req, res, () => {});
        this.serviceMesh.tracingMiddleware()(req, res, () => {});
      }

      next();
    };
  }

  /**
   * Error handling middleware with resilience features
   */
  errorHandler() {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
      const errorId = req.traceContext?.traceId || 'unknown';

      logger.error('Request failed with error', error, {
        method: req.method,
        errorId,
        traceId: req.traceContext?.traceId,
        url: req.url,
      });

      // Check if this is a circuit breaker error
      if (
        error.message?.includes('Circuit breaker') &&
        error.message?.includes('is OPEN')
      ) {
        return res.status(503).json({
          success: false,
          error: 'Service temporarily unavailable',
          code: 'SERVICE_UNAVAILABLE',
          errorId,
          retryAfter: 60,
          timestamp: new Date().toISOString(),
        });
      }

      // Check if this is a degraded service error
      if (
        error.message?.includes('Feature') &&
        error.message?.includes('unavailable')
      ) {
        return res.status(503).json({
          success: false,
          error: 'Feature temporarily unavailable',
          code: 'FEATURE_DEGRADED',
          errorId,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle other errors normally
      const statusCode = error.statusCode || error.status || 500;
      const errorCode = error.code || 'INTERNAL_ERROR';

      res.status(statusCode).json({
        success: false,
        error: error.message || 'Internal Server Error',
        code: errorCode,
        errorId,
        timestamp: new Date().toISOString(),
      });
    };
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const [
        serviceMeshHealth,
        externalServicesHealth,
        featuresHealth,
        circuitBreakerStats,
      ] = await Promise.all([
        this.serviceMesh.getHealthCheck(),
        this.externalServiceManager.healthCheckAll(),
        this.degradationService.performHealthChecks(),
        Promise.resolve(this.circuitBreakerRegistry.getAllStats()),
      ]);

      const systemHealth = this.degradationService.getSystemHealth();
      const isHealthy = systemHealth.overallHealth === 'healthy';

      const healthResponse = {
        status: isHealthy ? 'UP' : 'DOWN',
        timestamp: new Date().toISOString(),
        service: serviceMeshHealth.info,
        system: systemHealth,
        externalServices: externalServicesHealth,
        features: featuresHealth,
        circuitBreakers: circuitBreakerStats,
        checks: {
          database: serviceMeshHealth.checks.database,
          redis: serviceMeshHealth.checks.redis,
          externalServices: {
            status: Object.values(externalServicesHealth).every(
              s => s.isHealthy
            )
              ? 'UP'
              : 'DOWN',
          },
        },
      };

      res.status(isHealthy ? 200 : 503).json(healthResponse);
    } catch (error) {
      logger.error('Health check failed', error as Error);
      res.status(503).json({
        status: 'DOWN',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Readiness check endpoint
   */
  async readinessCheck(req: Request, res: Response): Promise<void> {
    try {
      const readiness = await this.serviceMesh.getReadinessCheck();
      res.status(readiness.status === 'UP' ? 200 : 503).json(readiness);
    } catch (error) {
      res.status(503).json({
        status: 'DOWN',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Liveness check endpoint
   */
  async livenessCheck(req: Request, res: Response): Promise<void> {
    try {
      const liveness = await this.serviceMesh.getLivenessCheck();
      res.status(liveness.status === 'UP' ? 200 : 503).json(liveness);
    } catch (error) {
      res.status(503).json({
        status: 'DOWN',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Metrics endpoint
   */
  async metricsEndpoint(req: Request, res: Response): Promise<void> {
    try {
      const metrics = this.serviceMesh.getMetrics();
      res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.send(metrics);
    } catch (error) {
      res.status(500).json({
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Circuit breaker management endpoint
   */
  async circuitBreakerStatus(req: Request, res: Response): Promise<void> {
    const stats = this.circuitBreakerRegistry.getAllStats();
    const healthy = this.circuitBreakerRegistry.getHealthyBreakers();
    const unhealthy = this.circuitBreakerRegistry.getUnhealthyBreakers();

    res.json({
      summary: {
        total: Object.keys(stats).length,
        healthy: healthy.length,
        unhealthy: unhealthy.length,
      },
      breakers: stats,
      healthyBreakers: healthy,
      unhealthyBreakers: unhealthy,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Feature status endpoint
   */
  async featureStatus(req: Request, res: Response): Promise<void> {
    const features = this.degradationService.getFeatureStatus() as Record<
      string,
      any
    >;
    const systemHealth = this.degradationService.getSystemHealth();
    const degradedFeatures = this.degradationService.getDegradedFeatures();

    res.json({
      systemHealth,
      features,
      degradedFeatures,
      timestamp: new Date().toISOString(),
    });
  }

  getConfig(): ResilienceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ResilienceConfig>): void {
    this.config = { ...this.config, ...updates };
    logger.info('Resilience configuration updated', this.config);
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      resilience?: {
        circuitBreakers: CircuitBreakerRegistry;
        degradation: GracefulDegradationService;
        serviceMesh: ServiceMeshService;
        externalServices: ExternalServiceManager;
      };
    }
  }
}
