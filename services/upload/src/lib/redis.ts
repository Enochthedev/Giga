import { createClient, RedisClientType } from 'redis';
import { getConfig } from '../config';

const config = getConfig();

// Create Redis client
export const redis: RedisClientType = createClient({
  url: config.redis.url,
  socket: {
    reconnectStrategy: retries => {
      if (retries > config.redis.retryAttempts) {
        return new Error('Redis connection failed after maximum retries');
      }
      return Math.min(retries * config.redis.retryDelay, 3000);
    },
  },
});

// Connection management
let isConnected = false;

export async function connectRedis(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    await redis.connect();
    isConnected = true;
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await redis.disconnect();
    isConnected = false;
    console.log('Redis disconnected successfully');
  } catch (error) {
    console.error('Failed to disconnect from Redis:', error);
    throw error;
  }
}

// Health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

// Cache utilities
export class CacheManager {
  private keyPrefix: string;

  constructor(prefix: string = config.redis.keyPrefix) {
    this.keyPrefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.setEx(this.getKey(key), ttlSeconds, serialized);
      } else {
        await redis.set(this.getKey(key), serialized);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(this.getKey(key));
      return result > 0;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redis.incrBy(this.getKey(key), amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      throw error;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(this.getKey(key), ttlSeconds);
      return result;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }
}

export const cacheManager = new CacheManager();

// Error handling
redis.on('error', error => {
  console.error('Redis error:', error);
});

redis.on('connect', () => {
  console.log('Redis client connected');
});

redis.on('ready', () => {
  console.log('Redis client ready');
});

redis.on('end', () => {
  console.log('Redis client disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectRedis();
});

process.on('SIGTERM', async () => {
  await disconnectRedis();
});
