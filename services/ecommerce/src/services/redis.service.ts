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
      return await this.client!.setEx(key, ttlSeconds, value);
    }
    return await this.client!.set(key, value);
  }

  async get(key: string) {
    if (!this.client) await this.connect();
    return await this.client!.get(key);
  }

  async del(key: string) {
    if (!this.client) await this.connect();
    return await this.client!.del(key);
  }

  // Cart management helpers
  async setCart(userId: string, cartData: any, ttlSeconds = 86400) {
    const key = `cart:${userId}`;
    return await this.set(key, JSON.stringify(cartData), ttlSeconds);
  }

  async getCart(userId: string) {
    const key = `cart:${userId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteCart(userId: string) {
    const key = `cart:${userId}`;
    return await this.del(key);
  }

  // Product caching helpers
  async cacheProduct(productId: string, productData: any, ttlSeconds = 3600) {
    const key = `product:${productId}`;
    return await this.set(key, JSON.stringify(productData), ttlSeconds);
  }

  async getCachedProduct(productId: string) {
    const key = `product:${productId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Search results caching
  async cacheSearchResults(query: string, results: any, ttlSeconds = 300) {
    const key = `search:${Buffer.from(query).toString('base64')}`;
    return await this.set(key, JSON.stringify(results), ttlSeconds);
  }

  async getCachedSearchResults(query: string) {
    const key = `search:${Buffer.from(query).toString('base64')}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }
}

export const redisService = new RedisService();