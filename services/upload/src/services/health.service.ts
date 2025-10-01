import { promises as fs } from 'fs';
import { join } from 'path';
import { getConfig } from '../config';
import { createLogger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';

const logger = createLogger('HealthService');
const config = getConfig();

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: any;
  responseTime?: number;
  lastChecked: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  environment: string;
  checks: HealthCheck[];
  system: {
    memory: NodeJS.MemoryUsage;
    cpu: NodeJS.CpuUsage;
    loadAverage: number[];
    platform: string;
    nodeVersion: string;
  };
}

export class HealthService {
  private static instance: HealthService;
  private healthChecks: Map<string, () => Promise<HealthCheck>> = new Map();
  private lastHealthStatus: HealthStatus | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.registerDefaultHealthChecks();
    this.startPeriodicHealthChecks();
    logger.info('Health service initialized');
  }

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  /**
   * Register a custom health check
   */
  public registerHealthCheck(
    name: string,
    checkFunction: () => Promise<HealthCheck>
  ): void {
    this.healthChecks.set(name, checkFunction);
    logger.info(`Registered health check: ${name}`);
  }

  /**
   * Get comprehensive health status
   */
  public async getHealthStatus(): Promise<HealthStatus> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];

    // Run all health checks
    for (const [name, checkFunction] of this.healthChecks) {
      try {
        const checkStartTime = Date.now();
        const check = await Promise.race([
          checkFunction(),
          this.timeoutPromise(config.monitoring.healthCheck.timeout, name),
        ]);
        check.responseTime = Date.now() - checkStartTime;
        checks.push(check);
      } catch (error) {
        checks.push({
          name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
          lastChecked: new Date().toISOString(),
        });
      }
    }

    // Determine overall status
    const overallStatus = this.determineOverallStatus(checks);

    const healthStatus: HealthStatus = {
      status: overallStatus,
      service: 'upload-service',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks,
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        loadAverage: require('os').loadavg(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    };

    this.lastHealthStatus = healthStatus;
    return healthStatus;
  }

  /**
   * Get simple liveness check
   */
  public async getLivenessCheck(): Promise<{
    status: string;
    timestamp: string;
  }> {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get readiness check
   */
  public async getReadinessCheck(): Promise<{
    status: string;
    ready: boolean;
    checks: HealthCheck[];
  }> {
    const criticalChecks = ['database', 'storage', 'redis'];
    const checks: HealthCheck[] = [];

    for (const checkName of criticalChecks) {
      const checkFunction = this.healthChecks.get(checkName);
      if (checkFunction) {
        try {
          const check = await checkFunction();
          checks.push(check);
        } catch (error) {
          checks.push({
            name: checkName,
            status: 'unhealthy',
            message: error instanceof Error ? error.message : 'Unknown error',
            lastChecked: new Date().toISOString(),
          });
        }
      }
    }

    const ready = checks.every(check => check.status === 'healthy');

    return {
      status: ready ? 'ready' : 'not ready',
      ready,
      checks,
    };
  }

  /**
   * Get last cached health status
   */
  public getLastHealthStatus(): HealthStatus | null {
    return this.lastHealthStatus;
  }

  /**
   * Register default health checks
   */
  private registerDefaultHealthChecks(): void {
    // Database health check
    this.registerHealthCheck('database', async (): Promise<HealthCheck> => {
      try {
        const startTime = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const responseTime = Date.now() - startTime;

        return {
          name: 'database',
          status: 'healthy',
          message: 'Database connection successful',
          responseTime,
          lastChecked: new Date().toISOString(),
          details: {
            connectionPool: 'active',
            responseTime: `${responseTime}ms`,
          },
        };
      } catch (error) {
        return {
          name: 'database',
          status: 'unhealthy',
          message:
            error instanceof Error
              ? error.message
              : 'Database connection failed',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // Redis health check
    this.registerHealthCheck('redis', async (): Promise<HealthCheck> => {
      try {
        const startTime = Date.now();
        await redis.ping();
        const responseTime = Date.now() - startTime;

        return {
          name: 'redis',
          status: 'healthy',
          message: 'Redis connection successful',
          responseTime,
          lastChecked: new Date().toISOString(),
          details: {
            connectionStatus: 'connected',
            responseTime: `${responseTime}ms`,
          },
        };
      } catch (error) {
        return {
          name: 'redis',
          status: 'unhealthy',
          message:
            error instanceof Error ? error.message : 'Redis connection failed',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // Storage health check
    this.registerHealthCheck('storage', async (): Promise<HealthCheck> => {
      try {
        const uploadDir = config.storage.basePath;
        const tempDir = config.upload.tempDirectory;

        // Check if directories exist and are writable
        await fs.access(uploadDir, fs.constants.F_OK | fs.constants.W_OK);
        await fs.access(tempDir, fs.constants.F_OK | fs.constants.W_OK);

        // Test write operation
        const testFile = join(tempDir, `health-check-${Date.now()}.tmp`);
        await fs.writeFile(testFile, 'health check');
        await fs.unlink(testFile);

        return {
          name: 'storage',
          status: 'healthy',
          message: 'Storage directories accessible and writable',
          lastChecked: new Date().toISOString(),
          details: {
            uploadDirectory: uploadDir,
            tempDirectory: tempDir,
            permissions: 'read/write',
          },
        };
      } catch (error) {
        return {
          name: 'storage',
          status: 'unhealthy',
          message:
            error instanceof Error ? error.message : 'Storage access failed',
          lastChecked: new Date().toISOString(),
        };
      }
    });

    // Memory health check
    this.registerHealthCheck('memory', async (): Promise<HealthCheck> => {
      const memUsage = process.memoryUsage();
      const totalMemory = require('os').totalmem();
      const freeMemory = require('os').freemem();
      const usedMemoryPercent =
        ((totalMemory - freeMemory) / totalMemory) * 100;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      let message = 'Memory usage is normal';

      if (usedMemoryPercent > 90) {
        status = 'unhealthy';
        message = 'Critical memory usage';
      } else if (usedMemoryPercent > 80) {
        status = 'degraded';
        message = 'High memory usage';
      }

      return {
        name: 'memory',
        status,
        message,
        lastChecked: new Date().toISOString(),
        details: {
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
          systemMemoryUsage: `${usedMemoryPercent.toFixed(1)}%`,
        },
      };
    });

    // Processing queue health check
    this.registerHealthCheck(
      'processing_queue',
      async (): Promise<HealthCheck> => {
        try {
          // This would check the actual queue implementation
          // For now, we'll simulate a basic check
          const queueSize = await this.getQueueSize();

          let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
          let message = 'Processing queue is healthy';

          if (queueSize > 1000) {
            status = 'unhealthy';
            message = 'Processing queue is overloaded';
          } else if (queueSize > 500) {
            status = 'degraded';
            message = 'Processing queue is under high load';
          }

          return {
            name: 'processing_queue',
            status,
            message,
            lastChecked: new Date().toISOString(),
            details: {
              queueSize,
              maxConcurrentJobs:
                config.processing.imageProcessing.maxConcurrentJobs,
            },
          };
        } catch (error) {
          return {
            name: 'processing_queue',
            status: 'unhealthy',
            message:
              error instanceof Error ? error.message : 'Queue check failed',
            lastChecked: new Date().toISOString(),
          };
        }
      }
    );

    // External services health check
    this.registerHealthCheck(
      'external_services',
      async (): Promise<HealthCheck> => {
        const checks = [];

        // Check CDN if enabled
        if (config.cdn.enabled) {
          try {
            const response = await fetch(config.cdn.baseUrl, {
              method: 'HEAD',
            });
            checks.push({
              service: 'CDN',
              status: response.ok ? 'healthy' : 'unhealthy',
              responseTime: response.headers.get('x-response-time'),
            });
          } catch (error) {
            checks.push({
              service: 'CDN',
              status: 'unhealthy',
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        const unhealthyServices = checks.filter(
          check => check.status === 'unhealthy'
        );
        const status =
          unhealthyServices.length === 0
            ? 'healthy'
            : unhealthyServices.length < checks.length
              ? 'degraded'
              : 'unhealthy';

        return {
          name: 'external_services',
          status,
          message: `${checks.length - unhealthyServices.length}/${checks.length} external services healthy`,
          lastChecked: new Date().toISOString(),
          details: { services: checks },
        };
      }
    );
  }

  /**
   * Determine overall health status from individual checks
   */
  private determineOverallStatus(
    checks: HealthCheck[]
  ): 'healthy' | 'unhealthy' | 'degraded' {
    const unhealthyChecks = checks.filter(
      check => check.status === 'unhealthy'
    );
    const degradedChecks = checks.filter(check => check.status === 'degraded');

    if (unhealthyChecks.length > 0) {
      return 'unhealthy';
    }
    if (degradedChecks.length > 0) {
      return 'degraded';
    }
    return 'healthy';
  }

  /**
   * Create a timeout promise for health checks
   */
  private timeoutPromise(
    timeout: number,
    checkName: string
  ): Promise<HealthCheck> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Health check '${checkName}' timed out after ${timeout}ms`)
        );
      }, timeout);
    });
  }

  /**
   * Get current queue size (placeholder implementation)
   */
  private async getQueueSize(): Promise<number> {
    try {
      // This would integrate with your actual queue implementation
      // For now, return a simulated value
      const queueKey = `${config.redis.keyPrefix}queue:${config.processing.asyncProcessing.queueName}`;
      const size = await redis.lLen(queueKey);
      return size;
    } catch (error) {
      logger.warn('Failed to get queue size', error);
      return 0;
    }
  }

  /**
   * Start periodic health checks
   */
  private startPeriodicHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.getHealthStatus();
        logger.debug('Periodic health check completed');
      } catch (error) {
        logger.error('Periodic health check failed', error);
      }
    }, config.monitoring.metrics.interval);
  }

  /**
   * Stop periodic health checks
   */
  public stopPeriodicHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.stopPeriodicHealthChecks();
    this.healthChecks.clear();
    logger.info('Health service cleaned up');
  }
}

// Export singleton instance
export const healthService = HealthService.getInstance();
