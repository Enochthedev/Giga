import { PrismaClient } from '../generated/prisma-client';

export interface QueryOptimizationConfig {
  enableQueryLogging: boolean;
  slowQueryThreshold: number; // milliseconds
  enableQueryPlan: boolean;
  maxConnectionPool: number;
}

export interface DatabaseMetrics {
  totalQueries: number;
  slowQueries: number;
  averageQueryTime: number;
  connectionPoolUsage: number;
  cacheHitRate: number;
}

export class DatabaseOptimizationService {
  private prisma: PrismaClient;
  private config: QueryOptimizationConfig;
  private queryMetrics: {
    queries: Array<{ query: string; duration: number; timestamp: Date }>;
    slowQueries: Array<{ query: string; duration: number; timestamp: Date }>;
  } = {
    queries: [],
    slowQueries: [],
  };

  constructor(prisma: PrismaClient, config?: Partial<QueryOptimizationConfig>) {
    this.prisma = prisma;
    this.config = {
      enableQueryLogging: true,
      slowQueryThreshold: 1000, // 1 second
      enableQueryPlan: false,
      maxConnectionPool: 10,
      ...config,
    };

    this.setupQueryLogging();
  }

  private setupQueryLogging(): void {
    if (this.config.enableQueryLogging) {
      this.prisma.$use(async (params, next) => {
        const start = Date.now();
        const result = await next(params);
        const duration = Date.now() - start;

        const queryInfo = {
          query: `${params.model}.${params.action}`,
          duration,
          timestamp: new Date(),
        };

        this.queryMetrics.queries.push(queryInfo);

        // Keep only last 1000 queries
        if (this.queryMetrics.queries.length > 1000) {
          this.queryMetrics.queries.shift();
        }

        // Track slow queries
        if (duration > this.config.slowQueryThreshold) {
          this.queryMetrics.slowQueries.push(queryInfo);
          console.warn(
            `Slow query detected: ${queryInfo.query} took ${duration}ms`
          );

          // Keep only last 100 slow queries
          if (this.queryMetrics.slowQueries.length > 100) {
            this.queryMetrics.slowQueries.shift();
          }
        }

        return result;
      });
    }
  }

  // Optimized product queries
  async getProductsOptimized(filters: {
    search?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    vendorId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: any[]; total: number; hasMore: boolean }> {
    const {
      search,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      vendorId,
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;
    const take = limit + 1; // Get one extra to check if there are more

    // Build optimized where clause
    const where: any = { isActive };

    // Use full-text search for better performance when available
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (brand) where.brand = brand;
    if (vendorId) where.vendorId = vendorId;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Optimized sort options
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Execute optimized query with selective field loading
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        comparePrice: true,
        sku: true,
        category: true,
        subcategory: true,
        brand: true,
        images: true,
        vendorId: true,
        isActive: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
        updatedAt: true,
        inventory: {
          select: {
            quantity: true,
            lowStockThreshold: true,
            trackQuantity: true,
          },
        },
      },
    });

    const hasMore = products.length > limit;
    const resultProducts = hasMore ? products.slice(0, limit) : products;

    // Get total count only when needed (first page or when explicitly requested)
    let total = 0;
    if (page === 1) {
      total = await this.prisma.product.count({ where });
    }

    return {
      products: resultProducts,
      total,
      hasMore,
    };
  }

  // Optimized order history queries with cursor-based pagination
  async getOrderHistoryOptimized(
    customerId: string,
    filters: {
      status?: string;
      dateFrom?: Date;
      dateTo?: Date;
      cursor?: string;
      limit?: number;
    }
  ): Promise<{ orders: any[]; nextCursor?: string; hasMore: boolean }> {
    const { status, dateFrom, dateTo, cursor, limit = 20 } = filters;

    const where: any = { customerId };

    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    // Use cursor-based pagination for better performance
    const queryOptions: any = {
      where,
      take: limit + 1, // Get one extra to check if there are more
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        subtotal: true,
        tax: true,
        shipping: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        vendorOrders: {
          select: {
            id: true,
            vendorId: true,
            status: true,
            trackingNumber: true,
          },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; // Skip the cursor
    }

    const orders = await this.prisma.order.findMany(queryOptions);

    const hasMore = orders.length > limit;
    const resultOrders = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore
      ? resultOrders[resultOrders.length - 1].id
      : undefined;

    return {
      orders: resultOrders,
      nextCursor,
      hasMore,
    };
  }

  // Optimized vendor analytics queries
  async getVendorAnalyticsOptimized(
    vendorId: string,
    period: 'daily' | 'weekly' | 'monthly',
    dateRange: { from: Date; to: Date }
  ): Promise<any[]> {
    // Use aggregation for better performance
    const analytics = await this.prisma.vendorAnalytics.findMany({
      where: {
        vendorId,
        period,
        date: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      orderBy: { date: 'asc' },
    });

    return analytics;
  }

  // Optimized vendor order queries
  async getVendorOrdersOptimized(
    vendorId: string,
    filters: {
      status?: string;
      dateFrom?: Date;
      dateTo?: Date;
      cursor?: string;
      limit?: number;
    }
  ): Promise<{ orders: any[]; nextCursor?: string; hasMore: boolean }> {
    const { status, dateFrom, dateTo, cursor, limit = 20 } = filters;

    const where: any = { vendorId };

    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    const queryOptions: any = {
      where,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        status: true,
        subtotal: true,
        shipping: true,
        total: true,
        trackingNumber: true,
        estimatedDelivery: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            id: true,
            customerId: true,
            shippingAddress: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                sku: true,
              },
            },
          },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const orders = await this.prisma.vendorOrder.findMany(queryOptions);

    const hasMore = orders.length > limit;
    const resultOrders = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore
      ? resultOrders[resultOrders.length - 1].id
      : undefined;

    return {
      orders: resultOrders,
      nextCursor,
      hasMore,
    };
  }

  // Batch operations for better performance
  async batchUpdateInventory(
    updates: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    // Use transaction for consistency
    await this.prisma.$transaction(
      updates.map(update =>
        this.prisma.productInventory.update({
          where: { productId: update.productId },
          data: { quantity: update.quantity, updatedAt: new Date() },
        })
      )
    );
  }

  async batchCreateOrderItems(
    orderItems: Array<{
      orderId?: string;
      vendorOrderId?: string;
      productId: string;
      quantity: number;
      price: number;
    }>
  ): Promise<void> {
    await this.prisma.orderItem.createMany({
      data: orderItems,
    });
  }

  // Database maintenance and optimization
  async analyzeTableStats(): Promise<Record<string, any>> {
    // This would typically use raw SQL for database-specific optimizations
    const stats: Record<string, unknown> = {};

    try {
      // Get table sizes and row counts
      const tables = [
        'products',
        'orders',
        'order_items',
        'vendor_orders',
        'product_inventory',
      ];

      for (const table of tables) {
        const count = await this.prisma.$queryRaw`
          SELECT COUNT(*) as count FROM ${table}
        `;
        stats[table] = { rowCount: count };
      }

      return stats;
    } catch (error) {
      console.error('Error analyzing table stats:', error);
      return stats;
    }
  }

  async optimizeQueries(): Promise<string[]> {
    const recommendations: string[] = [];

    // Analyze slow queries
    if (this.queryMetrics.slowQueries.length > 0) {
      const slowQueryTypes = this.queryMetrics.slowQueries.reduce(
        (acc, query) => {
          acc[query.query] = (acc[query.query] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      Object.entries(slowQueryTypes).forEach(([query, count]) => {
        if (count > 5) {
          recommendations.push(
            `Consider optimizing ${query} - appears ${count} times in slow queries`
          );
        }
      });
    }

    // Check for missing indexes based on query patterns
    const frequentQueries = this.queryMetrics.queries.reduce(
      (acc, query) => {
        acc[query.query] = (acc[query.query] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(frequentQueries).forEach(([query, count]) => {
      if (count > 100) {
        if (query.includes('product.findMany')) {
          recommendations.push(
            'Consider adding composite indexes for product search queries'
          );
        }
        if (query.includes('order.findMany')) {
          recommendations.push(
            'Consider adding composite indexes for order queries'
          );
        }
      }
    });

    await Promise.resolve(); // Make this properly async
    return recommendations;
  }

  // Get database metrics
  getMetrics(): DatabaseMetrics {
    const totalQueries = this.queryMetrics.queries.length;
    const slowQueries = this.queryMetrics.slowQueries.length;
    const averageQueryTime =
      totalQueries > 0
        ? this.queryMetrics.queries.reduce((sum, q) => sum + q.duration, 0) /
          totalQueries
        : 0;

    return {
      totalQueries,
      slowQueries,
      averageQueryTime,
      connectionPoolUsage: 0, // Would need to implement connection pool monitoring
      cacheHitRate: 0, // Would need to implement query cache monitoring
    };
  }

  // Health check for database performance
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: DatabaseMetrics;
    recommendations: string[];
  }> {
    const metrics = this.getMetrics();
    const recommendations = await this.optimizeQueries();

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (metrics.averageQueryTime > 500) status = 'degraded';
    if (metrics.averageQueryTime > 2000) status = 'unhealthy';
    if (metrics.slowQueries > metrics.totalQueries * 0.1) status = 'degraded';
    if (metrics.slowQueries > metrics.totalQueries * 0.2) status = 'unhealthy';

    return {
      status,
      metrics,
      recommendations,
    };
  }

  // Reset metrics
  resetMetrics(): void {
    this.queryMetrics = {
      queries: [],
      slowQueries: [],
    };
  }
}

// Export singleton instance
export const createDatabaseOptimizationService = (
  prisma: PrismaClient,
  config?: Partial<QueryOptimizationConfig>
) => {
  return new DatabaseOptimizationService(prisma, config);
};
