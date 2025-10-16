import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { getConfig } from './config';
import { DeliveryController } from './controllers/delivery.controller';
import { createLogger, requestLogger } from './lib/logger';
import { connectDatabase } from './lib/prisma';
import { connectRedis } from './lib/redis';
import performanceMiddleware from './middleware/performance.middleware';
import { createDeliveryRoutes } from './routes/delivery.routes';
import { createRetentionRoutes } from './routes/retention.routes';
import uploadRoutes from './routes/upload.routes';
import { cacheService } from './services/cache.service';
import { CDNService } from './services/cdn.service';
import { connectionPoolService } from './services/connection-pool.service';
import { DeliveryService } from './services/delivery.service';
import { healthService } from './services/health.service';
import { MetadataService } from './services/metadata.service';
import { metricsService } from './services/metrics.service';
import { performanceMonitorService } from './services/performance-monitor.service';
import { PermissionService } from './services/permission.service';
import { StorageManagerService } from './services/storage-manager.service';
import { workerManager } from './services/worker-manager.service';
import swaggerSpecs from './swagger';

const config = getConfig();

export async function createApp(): Promise<express.Application> {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logging and metrics
  app.use(requestLogger);

  // Performance optimization middleware
  app.use(performanceMiddleware.requestPerformanceMiddleware);
  app.use(performanceMiddleware.connectionPoolingMiddleware);
  app.use(performanceMiddleware.compressionOptimizationMiddleware);
  app.use(performanceMiddleware.cachingOptimizationMiddleware);
  app.use(performanceMiddleware.memoryOptimizationMiddleware);
  app.use(performanceMiddleware.requestPrioritizationMiddleware);
  app.use(performanceMiddleware.performanceMonitoringMiddleware);

  // Monitoring middleware
  const { metricsMiddleware, uploadMetricsMiddleware } = await import(
    './middleware/metrics.middleware'
  );
  app.use(metricsMiddleware);
  app.use(uploadMetricsMiddleware);

  // Health and monitoring routes
  app.get('/health', async (req, res) => {
    try {
      const health = await healthService.getHealthStatus();
      const performanceSummary =
        performanceMonitorService.getPerformanceSummary();

      res.status(health.status === 'healthy' ? 200 : 503).json({
        status: health.status,
        timestamp: health.timestamp,
        services: health.service,
        performance: {
          alerts: performanceSummary.alerts.length,
          trends: performanceSummary.trends,
        },
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: 'Health check failed',
      });
    }
  });

  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      const { getMetrics } = await import('./middleware/metrics.middleware');
      const { systemMetricsCollector } = await import(
        './services/system-metrics.service'
      );

      const requestMetrics = getMetrics();
      const systemMetrics = systemMetricsCollector.getCurrentMetrics();
      const systemInfo = systemMetricsCollector.getSystemInfo();

      const allMetrics = {
        service: 'upload-service',
        timestamp: new Date().toISOString(),
        system: {
          info: systemInfo,
          current: systemMetrics,
        },
        requests: requestMetrics,
      };

      res.json(allMetrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  });

  // Initialize services for delivery
  const metadataService = new MetadataService({} as any);
  const storageManager = await StorageManagerService.create(config.storage);
  const permissionService = PermissionService.getInstance();
  const cdnService = new CDNService(config.cdn);
  const deliveryService = new DeliveryService(
    metadataService,
    storageManager,
    permissionService,
    cdnService,
    config.delivery
  );
  const deliveryController = new DeliveryController(deliveryService);

  // Swagger documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Upload Service API Documentation',
    })
  );

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  });

  // API routes
  app.use('/api/v1/uploads', uploadRoutes);
  app.use('/api/v1', createDeliveryRoutes(deliveryController));
  // Note: In a real implementation, these would be properly initialized
  // For now, we'll create placeholder instances that would be replaced with actual instances
  const prismaClient = {} as any; // This would be the actual Prisma client instance
  const loggerInstance = createLogger('RetentionRoutes'); // Actual logger instance

  app.use(
    '/api/v1/retention',
    createRetentionRoutes(
      prismaClient,
      loggerInstance,
      storageManager,
      metadataService
    )
  );

  // Error handling middleware with metrics
  const { errorMetricsMiddleware } = await import(
    './middleware/metrics.middleware'
  );
  app.use(errorMetricsMiddleware);
  app.use(
    (
      error: unknown,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  );

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found`,
      },
    });
  });

  return app;
}

export async function initializeServices(): Promise<void> {
  try {
    // Initialize connection pools
    await connectionPoolService.initializeDatabasePool();
    console.log('✅ Database connection pool initialized');

    await connectionPoolService.initializeRedisPool();
    console.log('✅ Redis connection pool initialized');

    // Initialize database connection (legacy support)
    await connectDatabase();
    console.log('✅ Database connected');

    // Initialize Redis connection (legacy support)
    await connectRedis();
    console.log('✅ Redis connected');

    // Initialize cache service
    cacheService; // Initialize cache service
    console.log('✅ Cache service initialized');

    // Initialize performance monitoring
    performanceMonitorService; // Initialize performance monitoring
    console.log('✅ Performance monitoring initialized');

    // Initialize monitoring services
    metricsService; // Initialize metrics service
    healthService; // Initialize health service
    console.log('✅ Monitoring services initialized');

    // Start system metrics collection
    const { systemMetricsCollector } = await import(
      './services/system-metrics.service'
    );
    systemMetricsCollector.start(30000); // Collect metrics every 30 seconds
    console.log('✅ System metrics collection started');

    // Initialize worker manager
    await workerManager.start();
    console.log('✅ Worker manager started');

    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    throw error;
  }
}

export async function shutdownServices(): Promise<void> {
  try {
    // Stop worker manager
    await workerManager.stop();
    console.log('✅ Worker manager stopped');

    // Close connection pools
    await connectionPoolService.close();
    console.log('✅ Connection pools closed');

    // Clear cache
    await cacheService.clear();
    console.log('✅ Cache cleared');

    // Stop system metrics collection
    const { systemMetricsCollector } = await import(
      './services/system-metrics.service'
    );
    systemMetricsCollector.stop();
    console.log('✅ System metrics collection stopped');

    // Cleanup monitoring services
    healthService.cleanup();
    console.log('✅ Monitoring services cleaned up');

    console.log('✅ All services shut down successfully');
  } catch (error) {
    console.error('❌ Failed to shutdown services:', error);
    throw error;
  }
}
