import { PrismaClient } from '../generated/prisma-client';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';
import { performanceProfiler } from './performance-profiler.service';

interface PoolConfiguration {
  maxConnections: number;
  minConnections: number;
  acquireTimeoutMs: number;
  idleTimeoutMs: number;
  maxLifetimeMs: number;
}

interface ConnectionStats {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  queuedRequests: number;
  totalAcquired: number;
  totalReleased: number;
  averageAcquireTime: number;
}

class ConnectionPoolService {
  private prismaInstances: Map<string, PrismaClient> = new Map();
  private connectionStats: ConnectionStats = {
    activeConnections: 0,
    idleConnections: 0,
    totalConnections: 0,
    queuedRequests: 0,
    totalAcquired: 0,
    totalReleased: 0,
    averageAcquireTime: 0
  };

  private acquireTimes: number[] = [];
  private readonly maxAcquireTimeHistory = 1000;

  private readonly defaultConfig: PoolConfiguration = {
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    minConnections: parseInt(process.env.DB_MIN_CONNECTIONS || '2'),
    acquireTimeoutMs: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000'),
    idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT || '300000'),
    maxLifetimeMs: parseInt(process.env.DB_MAX_LIFETIME || '3600000')
  };

  constructor() {
    this.startMonitoring();
  }

  // Get optimized Prisma client with connection pooling
  getClient(context = 'default'): Promise<PrismaClient> {
    return performanceProfiler.profileOperation(
      'connection_pool_acquire',
      () => {
        const startTime = Date.now();

        try {
          let client = this.prismaInstances.get(context);

          if (!client) {
            client = new PrismaClient({
              datasources: {
                db: {
                  url: this.buildConnectionUrl()
                }
              },
              log: [
                { level: 'query', emit: 'event' },
                { level: 'error', emit: 'event' },
                { level: 'warn', emit: 'event' }
              ]
            });

            // Setup event listeners for monitoring
            this.setupClientMonitoring(client, context);

            await client.$connect();
            this.prismaInstances.set(context, client);

            logger.info('New Prisma client created', { context });
          }

          const acquireTime = Date.now() - startTime;
          this.recordAcquireTime(acquireTime);

          this.connectionStats.totalAcquired++;
          this.connectionStats.activeConnections++;

          return client;
        } catch (error) {
          logger.error('Failed to acquire database connection', error as Error, { context });
          throw error;
        }
      },
      { context }
    );
  }

  // Release connection back to pool
  releaseClient(context = 'default'): Promise<void> {
    try {
      this.connectionStats.totalReleased++;
      this.connectionStats.activeConnections = Math.max(0, this.connectionStats.activeConnections - 1);

      logger.debug('Database connection released', { context });
    } catch (error) {
      logger.error('Failed to release database connection', error as Error, { context });
    }
  }

  // Get connection statistics
  getConnectionStats(): ConnectionStats {
    return {
      ...this.connectionStats,
      totalConnections: this.prismaInstances.size,
      averageAcquireTime: this.calculateAverageAcquireTime()
    };
  }

  // Health check for connection pool
  async healthCheck(): Promise<{
    isHealthy: boolean;
    stats: ConnectionStats;
    issues: string[];
  }> {
    const issues: string[] = [];
    const _stats = this.getConnectionStats();

    try {
      // Test connection with a simple query
      const client = await this.getClient('health-check');
      await client.user.count();
      await this.releaseClient('health-check');

      // Check for potential issues
      if (stats.averageAcquireTime > 5000) {
        issues.push('High connection acquire time');
      }

      if (stats.activeConnections > this.defaultConfig.maxConnections * 0.8) {
        issues.push('High connection usage');
      }

      if (stats.queuedRequests > 10) {
        issues.push('High number of queued requests');
      }

      return {
        isHealthy: issues.length === 0,
        stats,
        issues
      };
    } catch (error) {
      issues.push(`Connection test failed: ${(error as Error).message}`);
      return {
        isHealthy: false,
        stats,
        issues
      };
    }
  }

  // Optimize connection pool based on usage patterns
  async optimizePool(): Promise<void> {
    const _stats = this.getConnectionStats();

    try {
      // Close idle connections if we have too many
      if (stats.totalConnections > this.defaultConfig.maxConnections) {
        await this.closeIdleConnections();
      }

      // Log optimization results
      logger.info('Connection pool optimized', {
        beforeOptimization: stats,
        afterOptimization: this.getConnectionStats()
      });
    } catch (error) {
      logger.error('Failed to optimize connection pool', error as Error);
    }
  }

  // Close all connections
  async closeAllConnections(): Promise<void> {
    try {
      const disconnectPromises = Array.from(this.prismaInstances.values()).map(
        client => client.$disconnect()
      );

      await Promise.all(disconnectPromises);
      this.prismaInstances.clear();

      this.connectionStats = {
        activeConnections: 0,
        idleConnections: 0,
        totalConnections: 0,
        queuedRequests: 0,
        totalAcquired: this.connectionStats.totalAcquired,
        totalReleased: this.connectionStats.totalReleased,
        averageAcquireTime: this.connectionStats.averageAcquireTime
      };

      logger.info('All database connections closed');
    } catch (error) {
      logger.error('Failed to close all connections', error as Error);
    }
  }

  // Private methods
  private buildConnectionUrl(): string {
    const baseUrl = process.env.DATABASE_URL || '';
    const params = new URLSearchParams();

    // Add connection pool parameters
    params.set('connection_limit', this.defaultConfig.maxConnections.toString());
    params.set('pool_timeout', Math.floor(this.defaultConfig.acquireTimeoutMs / 1000).toString());

    // Add performance optimizations
    params.set('statement_cache_size', '100');
    params.set('prepared_statement_cache_queries', '100');

    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  }

  private setupClientMonitoring(client: PrismaClient, context: string): void {
    // Monitor query events
    client.$on('query', (event) => {
      metricsService.recordDatabaseQuery(
        event.duration,
        'query',
        event.target || 'unknown'
      );

      if (event.duration > 1000) {
        logger.warn('Slow database query detected', {
          context,
          duration: event.duration,
          query: event.query.substring(0, 100) + '...'
        });
      }
    });

    // Monitor error events
    client.$on('error', (event) => {
      logger.error('Database error', new Error(event.message), {
        context,
        target: event.target
      });
      metricsService.recordDatabaseError();
    });

    // Monitor warning events
    client.$on('warn', (event) => {
      logger.warn('Database warning', {
        context,
        message: event.message,
        target: event.target
      });
    });
  }

  private recordAcquireTime(time: number): void {
    this.acquireTimes.push(time);

    // Keep only recent acquire times
    if (this.acquireTimes.length > this.maxAcquireTimeHistory) {
      this.acquireTimes = this.acquireTimes.slice(-this.maxAcquireTimeHistory);
    }

    metricsService.recordMetric('db_connection_acquire_time', time, 'ms');
  }

  private calculateAverageAcquireTime(): number {
    if (this.acquireTimes.length === 0) return 0;

    const sum = this.acquireTimes.reduce((acc, time) => acc + time, 0);
    return sum / this.acquireTimes.length;
  }

  private async closeIdleConnections(): Promise<void> {
    // In a real implementation, you would track connection usage
    // and close connections that haven't been used recently
    // For now, we'll implement a simple strategy

    const connectionsToClose = Math.max(0, this.prismaInstances.size - this.defaultConfig.maxConnections);

    if (connectionsToClose > 0) {
      const contexts = Array.from(this.prismaInstances.keys());
      const contextsToClose = contexts.slice(0, connectionsToClose);

      for (const context of contextsToClose) {
        const client = this.prismaInstances.get(context);
        if (client) {
          await client.$disconnect();
          this.prismaInstances.delete(context);
          logger.debug('Closed idle connection', { context });
        }
      }
    }
  }

  private startMonitoring(): void {
    // Monitor connection pool every 30 seconds
    setInterval(async () => {
      try {
        const _stats = this.getConnectionStats();

        // Record metrics
        metricsService.recordMetric('db_active_connections', stats.activeConnections, 'count');
        metricsService.recordMetric('db_total_connections', stats.totalConnections, 'count');
        metricsService.recordMetric('db_average_acquire_time', stats.averageAcquireTime, 'ms');

        // Log stats periodically
        logger.debug('Connection pool stats', stats);

        // Auto-optimize if needed
        if (stats.averageAcquireTime > 10000 || stats.totalConnections > this.defaultConfig.maxConnections) {
          await this.optimizePool();
        }
      } catch (error) {
        logger.error('Connection pool monitoring error', error as Error);
      }
    }, 30000);

    logger.info('Connection pool monitoring started');
  }
}

export const connectionPoolService = new ConnectionPoolService();
export { ConnectionPoolService };
