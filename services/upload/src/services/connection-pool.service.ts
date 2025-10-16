import Redis from 'ioredis';
import { Pool } from 'pg';
import { getConfig } from '../config';
import { createLogger } from '../lib/logger';

const logger = createLogger('ConnectionPoolService');
const config = getConfig();

export interface ConnectionPoolConfig {
  database: {
    maxConnections: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    acquireTimeoutMillis: number;
  };
  redis: {
    maxConnections: number;
    lazyConnect: boolean;
    retryDelayOnFailover: number;
    maxRetriesPerRequest: number;
  };
}

export class ConnectionPoolService {
  private static instance: ConnectionPoolService;
  private dbPool: Pool | null = null;
  private redisCluster: any | null = null;
  private redisPool: Redis[] = [];
  private poolConfig: ConnectionPoolConfig;

  private constructor() {
    this.poolConfig = {
      database: {
        maxConnections: config.database.maxConnections,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: config.database.connectionTimeout,
        acquireTimeoutMillis: 60000,
      },
      redis: {
        maxConnections: config.redis.maxConnections,
        lazyConnect: true,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      },
    };
  }

  public static getInstance(): ConnectionPoolService {
    if (!ConnectionPoolService.instance) {
      ConnectionPoolService.instance = new ConnectionPoolService();
    }
    return ConnectionPoolService.instance;
  }

  /**
   * Initialize database connection pool
   */
  public async initializeDatabasePool(): Promise<void> {
    try {
      this.dbPool = new Pool({
        connectionString: config.database.url,
        max: this.poolConfig.database.maxConnections,
        idleTimeoutMillis: this.poolConfig.database.idleTimeoutMillis,
        connectionTimeoutMillis:
          this.poolConfig.database.connectionTimeoutMillis,
        // acquireTimeoutMillis: this.poolConfig.database.acquireTimeoutMillis,
        ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
      });

      // Test connection
      const client = await this.dbPool.connect();
      await client.query('SELECT 1');
      client.release();

      logger.info('Database connection pool initialized', {
        maxConnections: this.poolConfig.database.maxConnections,
        totalCount: this.dbPool.totalCount,
        idleCount: this.dbPool.idleCount,
        waitingCount: this.dbPool.waitingCount,
      });
    } catch (error) {
      logger.error('Failed to initialize database connection pool', error);
      throw error;
    }
  }

  /**
   * Initialize Redis connection pool
   */
  public async initializeRedisPool(): Promise<void> {
    try {
      // Create Redis connection pool
      for (let i = 0; i < this.poolConfig.redis.maxConnections; i++) {
        const redis = new Redis(config.redis.url, {
          lazyConnect: this.poolConfig.redis.lazyConnect,
          maxRetriesPerRequest: this.poolConfig.redis.maxRetriesPerRequest,
          keyPrefix: config.redis.keyPrefix,
        });

        // Test connection
        await redis.ping();
        this.redisPool.push(redis);
      }

      logger.info('Redis connection pool initialized', {
        maxConnections: this.poolConfig.redis.maxConnections,
        activeConnections: this.redisPool.length,
      });
    } catch (error) {
      logger.error('Failed to initialize Redis connection pool', error);
      throw error;
    }
  }

  /**
   * Get database connection from pool
   */
  public async getDatabaseConnection(): Promise<any> {
    if (!this.dbPool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const client = await this.dbPool.connect();
      return client;
    } catch (error) {
      logger.error('Failed to get database connection from pool', error);
      throw error;
    }
  }

  /**
   * Get Redis connection from pool (round-robin)
   */
  public getRedisConnection(): Redis {
    if (this.redisPool.length === 0) {
      throw new Error('Redis pool not initialized');
    }

    // Simple round-robin selection
    const connection =
      this.redisPool[Math.floor(Math.random() * this.redisPool.length)];
    return connection;
  }

  /**
   * Execute database query with automatic connection management
   */
  public async executeQuery<T = any>(
    query: string,
    params?: any[]
  ): Promise<T> {
    const client = await this.getDatabaseConnection();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Execute Redis command with automatic connection management
   */
  public async executeRedisCommand<T = any>(
    command: string,
    ...args: any[]
  ): Promise<T> {
    const redis = this.getRedisConnection();
    try {
      return await (redis as any)[command](...args);
    } catch (error) {
      logger.error('Redis command failed', { command, args, error });
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  public getPoolStats(): {
    database: any;
    redis: any;
  } {
    return {
      database: this.dbPool
        ? {
          totalCount: this.dbPool.totalCount,
          idleCount: this.dbPool.idleCount,
          waitingCount: this.dbPool.waitingCount,
          maxConnections: this.poolConfig.database.maxConnections,
        }
        : null,
      redis: {
        totalConnections: this.redisPool.length,
        maxConnections: this.poolConfig.redis.maxConnections,
        activeConnections: this.redisPool.filter(
          conn => conn.status === 'ready'
        ).length,
      },
    };
  }

  /**
   * Health check for connection pools
   */
  public async healthCheck(): Promise<{
    database: { status: string; latency?: number; error?: string };
    redis: { status: string; latency?: number; error?: string };
  }> {
    const result = {
      database: {
        status: 'unknown' as string,
        latency: undefined as number | undefined,
        error: undefined as string | undefined,
      },
      redis: {
        status: 'unknown' as string,
        latency: undefined as number | undefined,
        error: undefined as string | undefined,
      },
    };

    // Check database pool
    try {
      const start = Date.now();
      await this.executeQuery('SELECT 1');
      result.database = {
        status: 'healthy',
        latency: Date.now() - start,
        error: undefined,
      };
    } catch (error) {
      result.database = {
        status: 'unhealthy',
        latency: undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Check Redis pool
    try {
      const start = Date.now();
      await this.executeRedisCommand('ping');
      result.redis = {
        status: 'healthy',
        latency: Date.now() - start,
        error: undefined,
      };
    } catch (error) {
      result.redis = {
        status: 'unhealthy',
        latency: undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return result;
  }

  /**
   * Gracefully close all connections
   */
  public async close(): Promise<void> {
    try {
      // Close database pool
      if (this.dbPool) {
        await this.dbPool.end();
        this.dbPool = null;
        logger.info('Database connection pool closed');
      }

      // Close Redis connections
      await Promise.all(this.redisPool.map(redis => redis.quit()));
      this.redisPool = [];
      logger.info('Redis connection pool closed');
    } catch (error) {
      logger.error('Error closing connection pools', error);
      throw error;
    }
  }
}

// Export singleton instance
export const connectionPoolService = ConnectionPoolService.getInstance();
