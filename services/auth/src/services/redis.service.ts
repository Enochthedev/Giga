import { createClient, RedisClientType } from 'redis';

class RedisService {
  private client: RedisClientType | null = null;

  async connect(): Promise<RedisClientType> {
    if (this.client) return this.client;

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6380',
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await this.client.connect();
    console.log('✅ Connected to Redis');
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (!this.client) await this.connect();
    if (ttlSeconds) {
      return this.client!.setEx(key, ttlSeconds, value);
    }
    return this.client!.set(key, value);
  }

  async get(key: string) {
    if (!this.client) await this.connect();
    return this.client!.get(key);
  }

  async del(key: string) {
    if (!this.client) await this.connect();
    return this.client!.del(key);
  }

  async exists(key: string) {
    if (!this.client) await this.connect();
    return this.client!.exists(key);
  }

  // Session management helpers
  async setSession(userId: string, sessionData: Record<string, unknown>, ttlSeconds = 86400) {
    const key = `session:${userId}`;
    return await this.set(key, JSON.stringify(sessionData), ttlSeconds);
  }

  async getSession(userId: string) {
    const key = `session:${userId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(userId: string) {
    const key = `session:${userId}`;
    return await this.del(key);
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
}

export const redisService = new RedisService();