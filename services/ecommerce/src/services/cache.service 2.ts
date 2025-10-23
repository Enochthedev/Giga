import { redisService } from './redis.service';

export interface CacheConfig {
  defaultTTL: number;
  productTTL: number;
  searchTTL: number;
  cartTTL: number;
  orderTTL: number;
  inventoryTTL: number;
  categoryTTL: number;
  analyticsTTL: number;
}

export interface CacheInvalidationStrategy {
  immediate: boolean;
  delayed: boolean;
  delaySeconds?: number;
  tags: string[];
}

export class CacheService {
  private config: CacheConfig = {
    defaultTTL: 3600, // 1 hour
    productTTL: 3600, // 1 hour
    searchTTL: 300, // 5 minutes
    cartTTL: 86400, // 24 hours
    orderTTL: 3600, // 1 hour
    inventoryTTL: 300, // 5 minutes
    categoryTTL: 7200, // 2 hours
    analyticsTTL: 1800, // 30 minutes
  };

  private invalidationQueue: Map<string, NodeJS.Timeout> = new Map();

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Product caching strategies
  async cacheProduct(productId: string, productData: any): Promise<void> {
    await redisService.cacheProduct(
      productId,
      productData,
      this.config.productTTL
    );
  }

  // eslint-disable-next-line require-await
  // eslint-disable-next-line require-await
  async getCachedProduct(productId: string): Promise<any | null> {
    return redisService.getCachedProduct(productId);
  }

  async cacheProductsBatch(products: any[]): Promise<void> {
    await redisService.cacheProducts(products, this.config.productTTL);
  }

  async invalidateProduct(
    productId: string,
    strategy?: CacheInvalidationStrategy
  ): Promise<void> {
    const tags = [`product:${productId}`];

    if (strategy?.immediate !== false) {
      await redisService.invalidateByTags(tags);
    }

    if (strategy?.delayed) {
      this.scheduleInvalidation(tags, strategy.delaySeconds || 60);
    }
  }

  async invalidateProductsByVendor(vendorId: string): Promise<void> {
    await redisService.invalidateByTags([`vendor:${vendorId}`]);
  }

  async invalidateProductsByCategory(
    category: string,
    subcategory?: string
  ): Promise<void> {
    const tags = [`category:${category}`];
    if (subcategory) {
      tags.push(`subcategory:${subcategory}`);
    }
    await redisService.invalidateByTags(tags);
  }

  // Search result caching with intelligent invalidation
  async cacheSearchResults(query: any, results: any): Promise<void> {
    await redisService.cacheSearchResults(
      query,
      results,
      this.config.searchTTL
    );
  }

  // eslint-disable-next-line require-await
  async getCachedSearchResults(query: any): Promise<any | null> {
    return redisService.getCachedSearchResults(query);
  }

  async invalidateSearchResults(filters?: {
    category?: string;
    brand?: string;
    subcategory?: string;
  }): Promise<void> {
    const tags = ['search'];

    if (filters?.category) tags.push(`category:${filters.category}`);
    if (filters?.subcategory) tags.push(`subcategory:${filters.subcategory}`);
    if (filters?.brand) tags.push(`brand:${filters.brand}`);

    await redisService.invalidateByTags(tags);
  }

  // Cart caching with real-time updates
  async cacheCart(userId: string, cartData: any): Promise<void> {
    await redisService.setCart(userId, cartData, this.config.cartTTL);
  }

  // eslint-disable-next-line require-await
  async getCachedCart(userId: string): Promise<any | null> {
    return redisService.getCart(userId);
  }

  async invalidateCart(userId: string): Promise<void> {
    await redisService.deleteCart(userId);
  }

  async invalidateUserCarts(userId: string): Promise<void> {
    await redisService.invalidateByTags([`user:${userId}`]);
  }

  // Order caching
  async cacheOrder(orderId: string, orderData: any): Promise<void> {
    await redisService.cacheOrder(orderId, orderData, this.config.orderTTL);
  }

  // eslint-disable-next-line require-await
  async getCachedOrder(orderId: string): Promise<any | null> {
    return redisService.getCachedOrder(orderId);
  }

  async cacheUserOrders(
    customerId: string,
    orders: any[],
    page: number,
    limit: number
  ): Promise<void> {
    await redisService.cacheUserOrders(
      customerId,
      orders,
      page,
      limit,
      this.config.orderTTL
    );
  }

  // eslint-disable-next-line require-await
  async getCachedUserOrders(
    customerId: string,
    page: number,
    limit: number
  ): Promise<any | null> {
    return redisService.getCachedUserOrders(customerId, page, limit);
  }

  async invalidateUserOrders(customerId: string): Promise<void> {
    await redisService.invalidateByTags([`customer:${customerId}`]);
  }

  async invalidateVendorOrders(vendorId: string): Promise<void> {
    await redisService.invalidateByTags([`vendor:${vendorId}`]);
  }

  // Inventory caching
  async cacheInventoryStatus(productId: string, status: any): Promise<void> {
    await redisService.cacheInventoryStatus(
      productId,
      status,
      this.config.inventoryTTL
    );
  }

  // eslint-disable-next-line require-await
  async getCachedInventoryStatus(productId: string): Promise<any | null> {
    return redisService.getCachedInventoryStatus(productId);
  }

  async invalidateInventory(productId: string): Promise<void> {
    await redisService.invalidateByTags([`inventory`, `product:${productId}`]);
  }

  // Category caching
  async cacheCategories(categories: any[]): Promise<void> {
    await redisService.cacheCategories(categories, this.config.categoryTTL);
  }

  // eslint-disable-next-line require-await
  async getCachedCategories(): Promise<any | null> {
    return redisService.getCachedCategories();
  }

  async invalidateCategories(): Promise<void> {
    await redisService.invalidateByTags(['categories']);
  }

  // Featured products caching
  async cacheFeaturedProducts(products: any[]): Promise<void> {
    await redisService.cacheFeaturedProducts(products, this.config.productTTL);
  }

  // eslint-disable-next-line require-await
  async getCachedFeaturedProducts(): Promise<any | null> {
    return redisService.getCachedFeaturedProducts();
  }

  async invalidateFeaturedProducts(): Promise<void> {
    await redisService.invalidateByTags(['featured']);
  }

  // Analytics caching
  async cacheVendorAnalytics(vendorId: string, analytics: any): Promise<void> {
    await redisService.cacheVendorAnalytics(
      vendorId,
      analytics,
      this.config.analyticsTTL
    );
  }

  // eslint-disable-next-line require-await
  async getCachedVendorAnalytics(vendorId: string): Promise<any | null> {
    return redisService.getCachedVendorAnalytics(vendorId);
  }

  async invalidateVendorAnalytics(vendorId: string): Promise<void> {
    await redisService.invalidateByTags([`analytics`, `vendor:${vendorId}`]);
  }

  // Cache warming strategies
  async warmCache(
    strategy: 'products' | 'search' | 'categories' | 'all'
  ): Promise<void> {
    switch (strategy) {
      case 'products':
        await this.warmProductCache();
        break;
      case 'search':
        await this.warmSearchCache();
        break;
      case 'categories':
        await this.warmCategoryCache();
        break;
      case 'all':
        await Promise.all([
          this.warmProductCache(),
          this.warmSearchCache(),
          this.warmCategoryCache(),
        ]);
        break;
    }
  }

  private async warmProductCache(): Promise<void> {
    // This would typically fetch popular/featured products and cache them
    console.log('Warming product cache...');
    // Implementation would depend on business logic for determining "popular" products
    await Promise.resolve(); // Placeholder for actual implementation
  }

  private async warmSearchCache(): Promise<void> {
    // Pre-cache popular search queries
    console.log('Warming search cache...');
    const popularQueries = [
      { category: 'electronics' },
      { category: 'clothing' },
      { category: 'books' },
      // Add more popular queries based on analytics
    ];

    for (const query of popularQueries) {
      // This would execute the search and cache results
      console.log(`Pre-caching search for:`, query);
      await Promise.resolve(); // Placeholder for actual implementation
    }
  }

  private async warmCategoryCache(): Promise<void> {
    console.log('Warming category cache...');
    // This would fetch and cache category data
    await Promise.resolve(); // Placeholder for actual implementation
  }

  // Scheduled invalidation
  private scheduleInvalidation(tags: string[], delaySeconds: number): void {
    const key = tags.join(',');

    // Clear existing timeout if any
    if (this.invalidationQueue.has(key)) {
      clearTimeout(this.invalidationQueue.get(key)!);
    }

    // Schedule new invalidation
    const timeout = setTimeout(async () => {
      try {
        await redisService.invalidateByTags(tags);
        this.invalidationQueue.delete(key);
        console.log(
          `Delayed invalidation completed for tags: ${tags.join(', ')}`
        );
      } catch (error) {
        console.error(
          `Error in delayed invalidation for tags ${tags.join(', ')}:`,
          error
        );
      }
    }, delaySeconds * 1000);

    this.invalidationQueue.set(key, timeout);
  }

  // Cache statistics and monitoring
  async getCacheStatistics(): Promise<{
    metrics: any;
    health: any;
    keysByType: Record<string, number>;
  }> {
    const metrics = redisService.getMetrics();
    const health = await redisService.healthCheck();

    // Count keys by type
    const keysByType: Record<string, number> = {
      products: 0,
      carts: 0,
      orders: 0,
      search: 0,
      inventory: 0,
      categories: 0,
      analytics: 0,
      other: 0,
    };

    try {
      const client = await redisService.connect();
      const allKeys = await client.keys('*');

      for (const key of allKeys) {
        if (key.startsWith('product:')) keysByType.products++;
        else if (key.startsWith('cart:')) keysByType.carts++;
        else if (key.startsWith('order:')) keysByType.orders++;
        else if (key.startsWith('search:')) keysByType.search++;
        else if (key.startsWith('inventory:')) keysByType.inventory++;
        else if (key.startsWith('categories:')) keysByType.categories++;
        else if (key.startsWith('analytics:')) keysByType.analytics++;
        else keysByType.other++;
      }
    } catch (error) {
      console.error('Error getting key statistics:', error);
    }

    return {
      metrics,
      health,
      keysByType,
    };
  }

  // Bulk operations for better performance
  async bulkInvalidate(
    operations: Array<{
      type: 'product' | 'search' | 'cart' | 'order' | 'inventory';
      id?: string;
      tags?: string[];
    }>
  ): Promise<void> {
    const allTags = new Set<string>();

    for (const op of operations) {
      if (op.tags) {
        op.tags.forEach(tag => allTags.add(tag));
      } else if (op.id) {
        allTags.add(`${op.type}:${op.id}`);
      }
    }

    if (allTags.size > 0) {
      await redisService.invalidateByTags(Array.from(allTags));
    }
  }

  // Cache preloading for specific scenarios
  async preloadForUser(userId: string): Promise<void> {
    // Preload user-specific data like cart, recent orders, etc.
    console.log(`Preloading cache for user: ${userId}`);
    // Implementation would depend on user behavior patterns
    await Promise.resolve(); // Placeholder for actual implementation
  }

  async preloadForVendor(vendorId: string): Promise<void> {
    // Preload vendor-specific data like products, orders, analytics
    console.log(`Preloading cache for vendor: ${vendorId}`);
    // Implementation would depend on vendor dashboard requirements
    await Promise.resolve(); // Placeholder for actual implementation
  }

  // Cleanup and maintenance
  async performMaintenance(): Promise<{
    cleanedEntries: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let cleanedEntries = 0;

    try {
      // Clean up expired entries
      cleanedEntries = await redisService.cleanupExpiredEntries();

      // Clear any pending invalidation timeouts that are no longer needed
      this.invalidationQueue.clear();

      console.log(
        `Cache maintenance completed: ${cleanedEntries} entries cleaned`
      );
    } catch (error) {
      const errorMsg = `Cache maintenance error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    return { cleanedEntries, errors };
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    // Clear all pending timeouts
    for (const timeout of this.invalidationQueue.values()) {
      clearTimeout(timeout);
    }
    this.invalidationQueue.clear();

    // Disconnect from Redis
    await redisService.disconnect();
    console.log('Cache service shutdown completed');
  }
}

// Export singleton instance
export const cacheService = new CacheService();
