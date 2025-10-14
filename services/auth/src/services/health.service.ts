import { PrismaClient } from '../generated/prisma-client';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';
import { redisClient } from './redis.service';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    redis: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
  };
  metrics: {
    performance: any;
    database: any;
    redis: any;
  };
}

export interface HealthCheck {
  status: 'pass' | 'fail' | 'warn';
  responseTime: number;
  message?: string;
  details?: any;
}

class HealthService {
  private _prisma: PrismaClient;
  private startTime: Date;

  constructor() {
    this._prisma = new PrismaClient();
    this.startTime = new Date();
  }

  async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Simple query to check database connectivity
      await this._prisma.$queryRaw`SELECT 1`;

      const responseTime = Date.now() - startTime;

      // Check if response time is acceptable
      const status = responseTime > 5000 ? 'warn' : 'pass';
      const message =
        responseTime > 5000
          ? 'Database response time is slow'
          : 'Database is healthy';

      logger.debug('Database health check completed', {
        responseTime,
        status,
      });

      return {
        status,
        responseTime,
        message,
        details: {
          connectionPool: 'active',
          queryTime: responseTime,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      logger.error('Database health check failed', error as Error, {
        responseTime,
      });

      metricsService.recordDatabaseError();

      return {
        status: 'fail',
        responseTime,
        message: 'Database connection failed',
        details: {
          error: (error as Error).message,
        },
      };
    }
  }

  async checkRedis(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Test Redis connectivity with a simple ping
      const result = await redisClient.ping();

      const responseTime = Date.now() - startTime;

      if (result !== 'PONG') {
        throw new Error('Redis ping returned unexpected result');
      }

      // Test set/get operation
      const testKey = `health_check_${Date.now()}`;
      await redisClient.set(testKey, 'test', 'EX', 10);
      const testValue = await redisClient.get(testKey);
      await redisClient.del(testKey);

      if (testValue !== 'test') {
        throw new Error('Redis set/get operation failed');
      }

      const status = responseTime > 1000 ? 'warn' : 'pass';
      const message =
        responseTime > 1000
          ? 'Redis response time is slow'
          : 'Redis is healthy';

      logger.debug('Redis health check completed', {
        responseTime,
        status,
      });

      return {
        status,
        responseTime,
        message,
        details: {
          connection: 'active',
          operationTime: responseTime,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      logger.error('Redis health check failed', error as Error, {
        responseTime,
      });

      metricsService.recordRedisError();

      return {
        status: 'fail',
        responseTime,
        message: 'Redis connection failed',
        details: {
          error: (error as Error).message,
        },
      };
    }
  }

  checkMemory(): HealthCheck {
    const startTime = Date.now();

    try {
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      let status: 'pass' | 'warn' | 'fail' = 'pass';
      let message = 'Memory usage is normal';

      if (memoryUsagePercent > 90) {
        status = 'fail';
        message = 'Memory usage is critically high';
      } else if (memoryUsagePercent > 80) {
        status = 'warn';
        message = 'Memory usage is high';
      }

      const responseTime = Date.now() - startTime;

      logger.debug('Memory health check completed', {
        memoryUsagePercent,
        status,
      });

      return {
        status,
        responseTime,
        message,
        details: {
          heapUsed: Math.round(usedMemory / 1024 / 1024), // MB
          heapTotal: Math.round(totalMemory / 1024 / 1024), // MB
          usagePercent: Math.round(memoryUsagePercent),
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      logger.error('Memory health check failed', error as Error);

      return {
        status: 'fail',
        responseTime,
        message: 'Memory check failed',
        details: {
          error: (error as Error).message,
        },
      };
    }
  }

  checkDisk(): HealthCheck {
    const startTime = Date.now();

    try {
      // Basic disk space check (simplified for this implementation)
      // In production, you might want to use a library like 'node-disk-info'
      const _stats = require('fs').statSync('.');

      const responseTime = Date.now() - startTime;

      logger.debug('Disk health check completed', {
        responseTime,
      });

      return {
        status: 'pass',
        responseTime,
        message: 'Disk access is healthy',
        details: {
          accessible: true,
          checkTime: responseTime,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      logger.error('Disk health check failed', error as Error);

      return {
        status: 'fail',
        responseTime,
        message: 'Disk access failed',
        details: {
          error: (error as Error).message,
        },
      };
    }
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = Date.now();

    logger.info('Starting comprehensive health check');

    try {
      // Run all health checks in parallel
      const [databaseCheck, redisCheck, memoryCheck, diskCheck] =
        await Promise.all([
          this.checkDatabase(),
          this.checkRedis(),
          this.checkMemory(),
          this.checkDisk(),
        ]);

      // Determine overall status
      const checks = {
        database: databaseCheck,
        redis: redisCheck,
        memory: memoryCheck,
        disk: diskCheck,
      };
      const overallStatus = this.determineOverallStatus(checks);

      // Get current metrics
      const performanceMetrics = metricsService.getPerformanceMetrics();
      const databaseMetrics = metricsService.getDatabaseMetrics();
      const redisMetrics = metricsService.getRedisMetrics();

      const healthStatus: HealthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime.getTime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks,
        metrics: {
          performance: performanceMetrics,
          database: databaseMetrics,
          redis: redisMetrics,
        },
      };

      const totalTime = Date.now() - startTime;

      logger.info('Health check completed', {
        overallStatus,
        totalTime,
        checksCompleted: Object.keys(checks).length,
      });

      return healthStatus;
    } catch (error) {
      logger.error('Health check failed', error as Error);

      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime.getTime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks: {
          database: {
            status: 'fail',
            responseTime: 0,
            message: 'Health check failed',
          },
          redis: {
            status: 'fail',
            responseTime: 0,
            message: 'Health check failed',
          },
          memory: {
            status: 'fail',
            responseTime: 0,
            message: 'Health check failed',
          },
          disk: {
            status: 'fail',
            responseTime: 0,
            message: 'Health check failed',
          },
        },
        metrics: {
          performance: {},
          database: {},
          redis: {},
        },
      };
    }
  }

  private determineOverallStatus(
    checks: Record<string, HealthCheck>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks).map(check => check.status);

    if (statuses.includes('fail')) {
      return 'unhealthy';
    }

    if (statuses.includes('warn')) {
      return 'degraded';
    }

    return 'healthy';
  }

  // Quick health check for liveness probe
  async isAlive(): Promise<boolean> {
    try {
      // Just check if the service can respond
      return true;
    } catch {
      return false;
    }
  }

  // Readiness check for readiness probe
  async isReady(): Promise<boolean> {
    try {
      const [dbCheck, redisCheck] = await Promise.all([
        this.checkDatabase(),
        this.checkRedis(),
      ]);

      return dbCheck.status !== 'fail' && redisCheck.status !== 'fail';
    } catch {
      return false;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this._prisma.$disconnect();
      logger.info('Health service cleanup completed');
    } catch (error) {
      logger.error('Health service cleanup failed', error as Error);
    }
  }
}

export const healthService = new HealthService();
