import { createClient, RedisClientType } from 'redis';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';

class RedisService {
  private client: RedisClientType | null = null;

  async connect(): Promise<RedisClientType> {
    if (this.client) return this.client;

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6380',
    });

    this.client.on('error', err => {
      logger.error('Redis Client Error', err);
      metricsService.recordRedisError();
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('end', () => {
      logger.warn('Redis client connection ended');
    });

    await this.client.connect();
    logger.info('✅ Connected to Redis', {
      url: process.env.REDIS_URL || 'redis://localhost:6380',
    });
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      logger.info('Redis client disconnected');
    }
  }

  async executeWithLogging<T>(
    operation: string,
    fn: () => Promise<T>,
    cacheOperation = false
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      const hit = cacheOperation
        ? result !== null && result !== undefined
        : undefined;

      logger.debug(`Redis operation: ${operation}`, {
        operation,
        duration,
        hit,
      });

      metricsService.recordRedisOperation(duration, operation, hit);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(`Redis operation failed: ${operation}`, error as Error, {
        operation,
        duration,
      });

      metricsService.recordRedisError();

      throw error;
    }
  }

  set(key: string, value: string, ttlSeconds?: number) {
    if (!this.client) await this.connect();
    return this.executeWithLogging('SET', () => {
      if (ttlSeconds) {
        return this.client!.setEx(key, ttlSeconds, value);
      }
      return this.client!.set(key, value);
    });
  }

  get(key: string) {
    if (!this.client) await this.connect();
    return this.executeWithLogging(
      'GET',
      () => {
        return this.client!.get(key);
      },
      true
    );
  }

  del(key: string) {
    if (!this.client) await this.connect();
    return this.executeWithLogging('DEL', () => {
      return this.client!.del(key);
    });
  }

  async exists(key: string) {
    if (!this.client) await this.connect();
    return this.executeWithLogging('EXISTS', () => {
      return this.client!.exists(key);
    });
  }

  // Session management helpers
  setSession(
    _userId: string,
    sessionData: Record<string, unknown>,
    ttlSeconds = 86400
  ) {
    const _key = `session:${userId}`;
    return this.set(key, JSON.stringify(sessionData), ttlSeconds);
  }

  async getSession(_userId: string) {
    const _key = `session:${userId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  deleteSession(_userId: string) {
    const _key = `session:${userId}`;
    return this.del(key);
  }

  // Rate limiting helpers
  async incrementRateLimit(key: string, windowSeconds = 60) {
    if (!this.client) await this.connect();
    const current = await this.client!.incr(key);
    if (current === 1) {
      await this.client!.expire(key, windowSeconds);
    }
    return current;
  }

  // Token blacklist management
  blacklistToken(tokenHash: string, ttlSeconds: number) {
    const _key = `blacklist:${tokenHash}`;
    return this.set(key, '1', ttlSeconds);
  }

  async isTokenBlacklisted(tokenHash: string) {
    const _key = `blacklist:${tokenHash}`;
    return this.exists(key);
  }

  // Device session management
  storeDeviceSession(
    _userId: string,
    deviceId: string,
    sessionData: any,
    ttlSeconds = 604800
  ) {
    const _key = `device:${userId}:${deviceId}`;
    return this.set(key, JSON.stringify(sessionData), ttlSeconds);
  }

  async getDeviceSession(_userId: string, deviceId: string) {
    const _key = `device:${userId}:${deviceId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  removeDeviceSession(_userId: string, deviceId: string) {
    const _key = `device:${userId}:${deviceId}`;
    return this.del(key);
  }

  // Suspicious activity tracking
  trackSuspiciousActivity(
    _userId: string,
    activityType: string,
    ttlSeconds = 3600
  ) {
    const _key = `suspicious:${userId}:${activityType}`;
    return this.incrementRateLimit(key, ttlSeconds);
  }

  async getSuspiciousActivityCount(_userId: string, activityType: string) {
    const _key = `suspicious:${userId}:${activityType}`;
    const count = await this.get(key);
    return count ? parseInt(count) : 0;
  }

  // Token refresh rate limiting
  trackTokenRefresh(_userId: string, deviceId: string, windowSeconds = 300) {
    const _key = `refresh:${userId}:${deviceId}`;
    return this.incrementRateLimit(key, windowSeconds);
  }

  // Analytics helpers
  async incrementCounter(key: string, ttlSeconds?: number) {
    if (!this.client) await this.connect();
    const current = await this.client!.incr(key);
    if (current === 1 && ttlSeconds) {
      await this.client!.expire(key, ttlSeconds);
    }
    return current;
  }

  async getCounter(key: string) {
    const value = await this.get(key);
    return value ? parseInt(value) : 0;
  }

  // Get keys matching pattern
  async keys(pattern: string): Promise<string[]> {
    if (!this.client) await this.connect();
    return this.executeWithLogging('KEYS', () => {
      return this.client!.keys(pattern);
    });
  }

  // Batch operations for cleanup
  async deletePattern(pattern: string) {
    if (!this.client) await this.connect();
    const keys = await this.client!.keys(pattern);
    if (keys.length > 0) {
      return this.client!.del(keys);
    }
    return 0;
  }
}

export const redisService = new RedisService();
export { RedisService };

// Create a simple client for backward compatibility
class SimpleRedisClient {
  ping(): Promise<string> {
    return redisService.executeWithLogging('PING', () => {
      const client = await redisService.connect();
      return client.ping();
    });
  }

  set(
    key: string,
    value: string,
    mode?: string,
    duration?: number
  ): Promise<string | null> {
    if (mode === 'EX' && duration) {
      return redisService.set(key, value, duration);
    }
    return redisService.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return redisService.get(key);
  }

  del(key: string): Promise<number> {
    return redisService.del(key);
  }
}

export const redisClient = new SimpleRedisClient();
