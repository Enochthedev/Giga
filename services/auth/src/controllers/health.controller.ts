import { Request, Response } from 'express';
import { cacheService } from '../services/cache.service';
import { connectionPoolService } from '../services/connection-pool.service';
import { healthService } from '../services/health.service';
import { logger } from '../services/logger.service';
import { metricsService } from '../services/metrics.service';
import { performanceProfiler } from '../services/performance-profiler.service';
import { responseCompressionService } from '../services/response-compression.service';

export class HealthController {
  // Comprehensive health check
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthStatus = await healthService.getHealthStatus();

      const statusCode =
        healthStatus.status === 'healthy'
          ? 200
          : healthStatus.status === 'degraded'
            ? 200
            : 503;

      logger.info('Health check requested', {
        ...req.logContext,
        healthStatus: healthStatus.status,
        responseTime: Date.now() - (req.startTime || Date.now()),
      });

      res.status(statusCode).json({
        success: true,
        data: healthStatus,
      });
    } catch (error) {
      logger.error('Health check failed', error as Error, req.logContext);

      res.status(503).json({
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Liveness probe (Kubernetes)
  async getLiveness(req: Request, res: Response): Promise<void> {
    try {
      const isAlive = await healthService.isAlive();

      if (isAlive) {
        res.status(200).json({
          status: 'alive',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          status: 'dead',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error('Liveness check failed', error as Error, req.logContext);

      res.status(503).json({
        status: 'dead',
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      });
    }
  }

  // Readiness probe (Kubernetes)
  async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      const isReady = await healthService.isReady();

      if (isReady) {
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          status: 'not_ready',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error('Readiness check failed', error as Error, req.logContext);

      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      });
    }
  }

  // Metrics endpoint
  getMetrics(req: Request, res: Response): void {
    try {
      const format = req.query.format as string;

      if (format === 'prometheus') {
        const prometheusMetrics = metricsService.exportPrometheusMetrics();
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(prometheusMetrics);
      } else {
        const performanceMetrics = metricsService.getPerformanceMetrics();
        const databaseMetrics = metricsService.getDatabaseMetrics();
        const redisMetrics = metricsService.getRedisMetrics();

        res.status(200).json({
          success: true,
          data: {
            performance: performanceMetrics,
            database: databaseMetrics,
            redis: redisMetrics,
            timestamp: new Date().toISOString(),
          },
        });
      }

      logger.debug('Metrics requested', {
        ...req.logContext,
        format: format || 'json',
      });
    } catch (error) {
      logger.error('Metrics request failed', error as Error, req.logContext);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve metrics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // System information
  getSystemInfo(req: Request, res: Response): void {
    try {
      const systemInfo = {
        service: 'auth-service',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        uptime: process.uptime(),
        pid: process.pid,
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        timestamp: new Date().toISOString(),
      };

      logger.debug('System info requested', req.logContext);

      res.status(200).json({
        success: true,
        data: systemInfo,
      });
    } catch (error) {
      logger.error(
        'System info request failed',
        error as Error,
        req.logContext
      );

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve system information',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Performance metrics endpoint
  getPerformanceMetrics(req: Request, res: Response): void {
    try {
      const metrics = metricsService.getPerformanceMetrics();

      logger.debug('Performance metrics requested', req.logContext);

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(
        'Performance metrics request failed',
        error as Error,
        req.logContext
      );

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve performance metrics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Database metrics endpoint
  getDatabaseMetrics(req: Request, res: Response): void {
    try {
      const metrics = metricsService.getDatabaseMetrics();

      logger.debug('Database metrics requested', req.logContext);

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(
        'Database metrics request failed',
        error as Error,
        req.logContext
      );

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve database metrics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Redis metrics endpoint
  getRedisMetrics(req: Request, res: Response): void {
    try {
      const metrics = metricsService.getRedisMetrics();

      logger.debug('Redis metrics requested', req.logContext);

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(
        'Redis metrics request failed',
        error as Error,
        req.logContext
      );

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve Redis metrics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Performance monitoring endpoint
  async getPerformanceReport(req: Request, res: Response): Promise<void> {
    try {
      const timeWindow = parseInt(req.query.timeWindow as string) || 3600000; // Default 1 hour

      const [
        performanceReport,
        cacheStats,
        connectionStats,
        compressionReport,
      ] = await Promise.all([
        performanceProfiler.getPerformanceReport(timeWindow),
        cacheService.getCacheStats(),
        connectionPoolService.getConnectionStats(),
        responseCompressionService.getPerformanceReport(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          performance: performanceReport,
          cache: cacheStats,
          database: connectionStats,
          compression: compressionReport,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error(
        'Failed to get performance report',
        error as Error,
        req.logContext
      );
      res.status(500).json({
        success: false,
        error: 'Failed to generate performance report',
      });
    }
  }

  // Cache management endpoint
  async getCacheManagement(req: Request, res: Response): Promise<void> {
    try {
      const action = req.query.action as string;

      switch (action) {
        case 'stats': {
          const stats = await cacheService.getCacheStats();
          const performance = await cacheService.monitorCachePerformance();
          res.status(200).json({
            success: true,
            data: { stats, performance },
          });
          break;
        }

        case 'preload':
          await cacheService.preloadFrequentData();
          res.status(200).json({
            success: true,
            message: 'Cache preload initiated',
          });
          break;

        case 'cleanup':
          await cacheService.cleanupExpiredCache();
          res.status(200).json({
            success: true,
            message: 'Cache cleanup completed',
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action. Use: stats, preload, or cleanup',
          });
      }
    } catch (error) {
      logger.error(
        'Cache management operation failed',
        error as Error,
        req.logContext
      );
      res.status(500).json({
        success: false,
        error: 'Cache management operation failed',
      });
    }
  }

  // Connection pool management endpoint
  async getConnectionPoolStatus(req: Request, res: Response): Promise<void> {
    try {
      const [stats, healthCheck] = await Promise.all([
        connectionPoolService.getConnectionStats(),
        connectionPoolService.healthCheck(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats,
          health: healthCheck,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error(
        'Connection pool status request failed',
        error as Error,
        req.logContext
      );
      res.status(500).json({
        success: false,
        error: 'Failed to get connection pool status',
      });
    }
  }
}
