import { createClient, RedisClientType } from 'redis';

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  totalRequests: number;
  hitRate: number;
  avgResponseTime: number;
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
  tags?: string[];
}

class RedisService {
  private client: RedisClientType | null = null;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
    totalRequests: 0,
    hitRate: 0,
    avgResponseTime: 0,
  };
  private responseTimes: number[] = [];

  async connect(): Promise<RedisClientType> {
    if (this.client) return this.client;

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6380',
    });

    this.client.on('error', err => {
      console.error('Redis Client Error:', err);
      this.metrics.errors++;
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

  private updateMetrics(operation: 'hit' | 'miss' | 'set' | 'delete' | 'error', responseTime?: number) {
    this.metrics.totalRequests++;
    this.metrics[operation === 'hit' ? 'hits' : operation === 'miss' ? 'misses' : operation === 'set' ? 'sets' : operation === 'delete' ? 'deletes' : 'errors']++;

    if (responseTime !== undefined) {
      this.responseTimes.push(responseTime);
      // Keep only last 1000 response times for rolling average
      if (this.responseTimes.length > 1000) {
        this.responseTimes.shift();
      }
      this.metrics.avgResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    this.metrics.hitRate = this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    const startTime = Date.now();
    try {
      if (!this.client) await this.connect();
      let result;
      if (ttlSeconds) {
        result = await this.client!.setEx(key, ttlSeconds, value);
      } else {
        result = await this.client!.set(key, value);
      }
      this.updateMetrics('set', Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateMetrics('error', Date.now() - startTime);
      throw error;
    }
  }

  async get(key: string) {
    const startTime = Date.now();
    try {
      if (!this.client) await this.connect();
      const result = await this.client!.get(key);
      this.updateMetrics(result ? 'hit' : 'miss', Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateMetrics('error', Date.now() - startTime);
      throw error;
    }
  }

  async del(key: string) {
    const startTime = Date.now();
    try {
      if (!this.client) await this.connect();
      const result = await this.client!.del(key);
      this.updateMetrics('delete', Date.now() - startTime);
      return result;
    } catch (error) {
      this.updateMetrics('error', Date.now() - startTime);
      throw error;
    }
  }

  async ping() {
    if (!this.client) await this.connect();
    return this.client!.ping();
  }

  // Advanced caching methods with TTL-based invalidation
  async setWithMetadata<T>(key: string, data: T, ttlSeconds: number, tags?: string[], version?: string): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds,
      version,
      tags,
    };
    await this.set(key, JSON.stringify(entry), ttlSeconds);

    // Store tags for cache invalidation
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await this.addToSet(`tag:${tag}`, key);
      }
    }
  }

  async getWithMetadata<T>(key: string): Promise<CacheEntry<T> | null> {
    const data = await this.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as CacheEntry<T>;
    } catch (error) {
      console.error(`Error parsing cached data for key ${key}:`, error);
      await this.del(key); // Remove corrupted data
      return null;
    }
  }

  async addToSet(key: string, value: string): Promise<void> {
    if (!this.client) await this.connect();
    await this.client!.sAdd(key, value);
  }

  async getSet(key: string): Promise<string[]> {
    if (!this.client) await this.connect();
    return this.client!.sMembers(key);
  }

  async removeFromSet(key: string, value: string): Promise<void> {
    if (!this.client) await this.connect();
    await this.client!.sRem(key, value);
  }

  // Invalidate cache by tags
  async invalidateByTags(tags: string[]): Promise<number> {
    let invalidatedCount = 0;

    for (const tag of tags) {
      const keys = await this.getSet(`tag:${tag}`);
      if (keys.length > 0) {
        // Delete all keys with this tag
        if (!this.client) await this.connect();
        await this.client!.del(keys);
        invalidatedCount += keys.length;

        // Clean up the tag set
        await this.del(`tag:${tag}`);
      }
    }

    return invalidatedCount;
  }

  // Get cache metrics
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  // Reset metrics
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      totalRequests: 0,
      hitRate: 0,
      avgResponseTime: 0,
    };
    this.responseTimes = [];
  }

  // Cart management helpers with real-time updates
  async setCart(userId: string, cartData: any, ttlSeconds = 86400) {
    const key = `cart:${userId}`;
    const tags = ['cart', `user:${userId}`];
    await this.setWithMetadata(key, cartData, ttlSeconds, tags);

    // Publish cart update event for real-time updates
    await this.publishCartUpdate(userId, cartData);
  }

  async getCart(userId: string) {
    const key = `cart:${userId}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  async deleteCart(userId: string) {
    const key = `cart:${userId}`;
    await this.del(key);

    // Remove from tag sets
    await this.removeFromSet('tag:cart', key);
    await this.removeFromSet(`tag:user:${userId}`, key);

    // Publish cart deletion event
    await this.publishCartUpdate(userId, null);
  }

  // Enhanced product caching with TTL-based invalidation
  async cacheProduct(productId: string, productData: any, ttlSeconds = 3600) {
    const key = `product:${productId}`;
    const tags = ['product', `vendor:${productData.vendorId}`, `category:${productData.category}`];
    if (productData.subcategory) {
      tags.push(`subcategory:${productData.subcategory}`);
    }
    if (productData.brand) {
      tags.push(`brand:${productData.brand}`);
    }

    await this.setWithMetadata(key, productData, ttlSeconds, tags, productData.updatedAt);
  }

  async getCachedProduct(productId: string) {
    const key = `product:${productId}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Batch product caching for improved performance
  async cacheProducts(products: any[], ttlSeconds = 3600): Promise<void> {
    const pipeline = [];

    for (const product of products) {
      const key = `product:${product.id}`;
      const tags = ['product', `vendor:${product.vendorId}`, `category:${product.category}`];
      if (product.subcategory) {
        tags.push(`subcategory:${product.subcategory}`);
      }
      if (product.brand) {
        tags.push(`brand:${product.brand}`);
      }

      pipeline.push(this.setWithMetadata(key, product, ttlSeconds, tags, product.updatedAt));
    }

    await Promise.all(pipeline);
  }

  // Enhanced search results caching with improved performance
  async cacheSearchResults(query: string, results: any, ttlSeconds = 300) {
    const queryHash = Buffer.from(JSON.stringify(query)).toString('base64');
    const key = `search:${queryHash}`;
    const tags = ['search'];

    // Add category/brand tags if present in query
    if (typeof query === 'object' && query) {
      if ((query as any).category) tags.push(`category:${(query as any).category}`);
      if ((query as any).subcategory) tags.push(`subcategory:${(query as any).subcategory}`);
      if ((query as any).brand) tags.push(`brand:${(query as any).brand}`);
    }

    await this.setWithMetadata(key, results, ttlSeconds, tags);
  }

  async getCachedSearchResults(query: string) {
    const queryHash = Buffer.from(JSON.stringify(query)).toString('base64');
    const key = `search:${queryHash}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Category caching for improved navigation performance
  async cacheCategories(categories: any[], ttlSeconds = 7200) {
    const key = 'categories:all';
    const tags = ['categories'];
    await this.setWithMetadata(key, categories, ttlSeconds, tags);
  }

  async getCachedCategories() {
    const key = 'categories:all';
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Featured products caching
  async cacheFeaturedProducts(products: any[], ttlSeconds = 1800) {
    const key = 'products:featured';
    const tags = ['product', 'featured'];
    await this.setWithMetadata(key, products, ttlSeconds, tags);
  }

  async getCachedFeaturedProducts() {
    const key = 'products:featured';
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Inventory status caching
  async cacheInventoryStatus(productId: string, status: any, ttlSeconds = 300) {
    const key = `inventory:${productId}`;
    const tags = ['inventory', `product:${productId}`];
    await this.setWithMetadata(key, status, ttlSeconds, tags);
  }

  async getCachedInventoryStatus(productId: string) {
    const key = `inventory:${productId}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Order caching for improved performance
  async cacheOrder(orderId: string, orderData: any, ttlSeconds = 3600) {
    const key = `order:${orderId}`;
    const tags = ['order', `customer:${orderData.customerId}`];
    if (orderData.vendorOrders) {
      orderData.vendorOrders.forEach((vo: any) => {
        tags.push(`vendor:${vo.vendorId}`);
      });
    }
    await this.setWithMetadata(key, orderData, ttlSeconds, tags);
  }

  async getCachedOrder(orderId: string) {
    const key = `order:${orderId}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // User order history caching
  async cacheUserOrders(customerId: string, orders: any[], page: number, limit: number, ttlSeconds = 1800) {
    const key = `orders:user:${customerId}:${page}:${limit}`;
    const tags = ['order', `customer:${customerId}`];
    await this.setWithMetadata(key, orders, ttlSeconds, tags);
  }

  async getCachedUserOrders(customerId: string, page: number, limit: number) {
    const key = `orders:user:${customerId}:${page}:${limit}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Vendor analytics caching
  async cacheVendorAnalytics(vendorId: string, analytics: any, ttlSeconds = 1800) {
    const key = `analytics:vendor:${vendorId}`;
    const tags = ['analytics', `vendor:${vendorId}`];
    await this.setWithMetadata(key, analytics, ttlSeconds, tags);
  }

  async getCachedVendorAnalytics(vendorId: string) {
    const key = `analytics:vendor:${vendorId}`;
    const entry = await this.getWithMetadata(key);
    return entry ? entry.data : null;
  }

  // Real-time cart updates using pub/sub
  async publishCartUpdate(userId: string, cartData: any): Promise<void> {
    try {
      if (!this.client) await this.connect();
      const message = JSON.stringify({
        userId,
        cartData,
        timestamp: Date.now(),
      });
      await this.client!.publish(`cart:updates:${userId}`, message);
    } catch (error) {
      console.error('Error publishing cart update:', error);
    }
  }

  async subscribeToCartUpdates(userId: string, callback: (cartData: unknown) => void): Promise<void> {
    try {
      if (!this.client) await this.connect();
      const subscriber = this.client!.duplicate();
      await subscriber.connect();

      await subscriber.subscribe(`cart:updates:${userId}`, (message) => {
        try {
          const update = JSON.parse(message);
          callback(update.cartData);
        } catch (error) {
          console.error('Error parsing cart update message:', error);
        }
      });
    } catch (error) {
      console.error('Error subscribing to cart updates:', error);
    }
  }

  // Cache warming strategies
  async warmProductCache(productIds: string[]): Promise<void> {
    // This would typically be called during off-peak hours
    // Implementation would fetch products from database and cache them
    console.log(`Warming cache for ${productIds.length} products`);
    await Promise.resolve(); // Placeholder for actual implementation
  }

  async warmSearchCache(popularQueries: string[]): Promise<void> {
    // Pre-cache popular search queries
    console.log(`Warming search cache for ${popularQueries.length} queries`);
    await Promise.resolve(); // Placeholder for actual implementation
  }

  // Cache cleanup and maintenance
  async cleanupExpiredEntries(): Promise<number> {
    let cleanedCount = 0;
    try {
      if (!this.client) await this.connect();

      // Get all keys with TTL
      const keys = await this.client!.keys('*');

      for (const key of keys) {
        const ttl = await this.client!.ttl(key);
        if (ttl === -1) { // No expiration set
          // Check if it's an old entry that should expire
          const entry = await this.getWithMetadata(key);
          if (entry && entry.timestamp) {
            const age = Date.now() - entry.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (age > maxAge) {
              await this.del(key);
              cleanedCount++;
            }
          }
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error during cache cleanup:', error);
      return cleanedCount;
    }
  }

  // Health check for cache system
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: CacheMetrics;
    memoryUsage?: string;
    keyCount?: number;
  }> {
    try {
      const startTime = Date.now();
      await this.ping();
      const responseTime = Date.now() - startTime;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (responseTime > 100) status = 'degraded';
      if (responseTime > 500) status = 'unhealthy';

      const metrics = this.getMetrics();

      let memoryUsage: string | undefined;
      let keyCount: number | undefined;

      try {
        if (!this.client) await this.connect();
        const info = await this.client!.info('memory');
        const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
        if (memoryMatch) {
          memoryUsage = memoryMatch[1];
        }

        const dbSize = await this.client!.dbSize();
        keyCount = dbSize;
      } catch (error) {
        console.error('Error getting Redis info:', error);
      }

      return {
        status,
        metrics,
        memoryUsage,
        keyCount,
      };
    } catch (error) {
      console.error('Redis health check failed:', error);
      return {
        status: 'unhealthy',
        metrics: this.getMetrics(),
      };
    }
  }
}

export const redisService = new RedisService();
