import { PrismaClient } from '../generated/prisma-client';
import { cacheService } from './cache.service';
import { createDatabaseOptimizationService } from './database-optimization.service';
import { PaginatedResult, PaginationService } from './pagination.service';

export interface OptimizedOrderFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  vendorId?: string;
  cursor?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class OptimizedOrderService {
  private dbOptimization;

  constructor(private _prisma: PrismaClient) {
    this.dbOptimization = createDatabaseOptimizationService(this._prisma, {
      enableQueryLogging: true,
      slowQueryThreshold: 500, // 500ms threshold for slow queries
    });
  }

  /**
   * Get order history with optimized pagination and caching
   */
  async getOrderHistoryOptimized(
    customerId: string,
    filters: OptimizedOrderFilters = {}
  ): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, cursor } = filters;

    // Try to get cached results first
    if (!cursor && page <= 3) {
      // Cache first 3 pages
      const cachedOrders = await cacheService.getCachedUserOrders(
        customerId,
        page,
        limit
      );
      if (cachedOrders) {
        return cachedOrders;
      }
    }

    let result: PaginatedResult<any>;

    if (cursor) {
      // Use cursor-based pagination for better performance on large datasets
      result = await this.getCursorPaginatedOrders(customerId, filters);
    } else {
      // Use offset pagination for smaller datasets
      result = await this.getOffsetPaginatedOrders(customerId, filters);
    }

    // Cache the results
    if (!cursor && page <= 3) {
      await cacheService.cacheUserOrders(customerId, result.data, page, limit);
    }

    return result;
  }

  private async getCursorPaginatedOrders(
    customerId: string,
    filters: OptimizedOrderFilters
  ): Promise<PaginatedResult<any>> {
    const { cursor, limit = 20 } = filters;

    const result = await this.dbOptimization.getOrderHistoryOptimized(
      customerId,
      {
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        cursor,
        limit,
      }
    );

    return PaginationService.createCursorPaginatedResponse(
      result.orders,
      result.hasMore,
      result.nextCursor,
      limit
    );
  }

  private async getOffsetPaginatedOrders(
    customerId: string,
    filters: OptimizedOrderFilters
  ): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    const { skip, take } = PaginationService.createOffsetPagination({
      page,
      limit,
    });

    const where: any = { customerId };

    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const [orders, total] = await Promise.all([
      this._prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
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
      }),
      this._prisma.order.count({ where }),
    ]);

    return PaginationService.createPaginatedResponse(
      orders,
      total,
      page,
      limit
    );
  }

  /**
   * Get vendor orders with optimized queries and caching
   */
  async getVendorOrdersOptimized(
    vendorId: string,
    filters: OptimizedOrderFilters = {}
  ): Promise<PaginatedResult<any>> {
    const { cursor } = filters;

    let result: PaginatedResult<any>;

    if (cursor) {
      result = await this.getCursorPaginatedVendorOrders(vendorId, filters);
    } else {
      result = await this.getOffsetPaginatedVendorOrders(vendorId, filters);
    }

    return result;
  }

  private async getCursorPaginatedVendorOrders(
    vendorId: string,
    filters: OptimizedOrderFilters
  ): Promise<PaginatedResult<any>> {
    const { cursor, limit = 20 } = filters;

    const result = await this.dbOptimization.getVendorOrdersOptimized(
      vendorId,
      {
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        cursor,
        limit,
      }
    );

    return PaginationService.createCursorPaginatedResponse(
      result.orders,
      result.hasMore,
      result.nextCursor,
      limit
    );
  }

  private async getOffsetPaginatedVendorOrders(
    vendorId: string,
    filters: OptimizedOrderFilters
  ): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;
    const { skip, take } = PaginationService.createOffsetPagination({
      page,
      limit,
    });

    const where: any = { vendorId };

    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const [orders, total] = await Promise.all([
      this._prisma.vendorOrder.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
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
      }),
      this._prisma.vendorOrder.count({ where }),
    ]);

    return PaginationService.createPaginatedResponse(
      orders,
      total,
      page,
      limit
    );
  }

  /**
   * Get vendor analytics with optimized queries and caching
   */
  async getVendorAnalyticsOptimized(
    vendorId: string,
    period: 'daily' | 'weekly' | 'monthly',
    dateRange: { from: Date; to: Date }
  ): Promise<any[]> {
    // Try to get cached analytics
    const cachedAnalytics =
      await cacheService.getCachedVendorAnalytics(vendorId);
    if (
      cachedAnalytics &&
      this.isAnalyticsCacheFresh(cachedAnalytics, dateRange)
    ) {
      return cachedAnalytics;
    }

    // Use optimized database query
    const analytics = await this.dbOptimization.getVendorAnalyticsOptimized(
      vendorId,
      period,
      dateRange
    );

    // Cache the results
    await cacheService.cacheVendorAnalytics(vendorId, analytics);

    return analytics;
  }

  private isAnalyticsCacheFresh(
    cachedData: any,
    _dateRange: { from: Date; to: Date }
  ): boolean {
    // Simple freshness check - in production, this would be more sophisticated
    const cacheAge = Date.now() - new Date(cachedData.cachedAt || 0).getTime();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    return cacheAge < maxAge;
  }

  /**
   * Batch update order statuses for better performance
   */
  async batchUpdateOrderStatuses(
    updates: Array<{
      orderId: string;
      status: string;
      trackingNumber?: string;
    }>
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    try {
      await this._prisma.$transaction(
        updates.map(update => {
          return this._prisma.order.update({
            where: { id: update.orderId },
            data: {
              status: update.status as any,
              updatedAt: new Date(),
            },
          });
        })
      );

      updated = updates.length;

      // Invalidate related caches
      const customerIds = new Set<string>();
      const vendorIds = new Set<string>();

      for (const update of updates) {
        // Get order details to invalidate specific caches
        const order = await this._prisma.order.findUnique({
          where: { id: update.orderId },
          select: {
            customerId: true,
            vendorOrders: {
              select: { vendorId: true },
            },
          },
        });

        if (order) {
          customerIds.add(order.customerId);
          order.vendorOrders.forEach((vo: any) => vendorIds.add(vo.vendorId));
        }
      }

      // Invalidate caches
      await Promise.all([
        ...Array.from(customerIds).map(id =>
          cacheService.invalidateUserOrders(id)
        ),
        ...Array.from(vendorIds).map(id =>
          cacheService.invalidateVendorOrders(id)
        ),
      ]);
    } catch (error) {
      errors.push(
        `Batch update failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return { updated, errors };
  }

  /**
   * Get order statistics with caching
   */
  async getOrderStatistics(
    filters: {
      vendorId?: string;
      customerId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<string, number>;
    topProducts: Array<{
      productId: string;
      productName: string;
      totalSold: number;
      revenue: number;
    }>;
  }> {
    const where: any = {};

    if (filters.vendorId) {
      where.vendorOrders = {
        some: { vendorId: filters.vendorId },
      };
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    // Execute optimized aggregation queries
    const [totalOrders, orderStats, statusCounts, topProducts] =
      await Promise.all([
        this._prisma.order.count({ where }),
        this._prisma.order.aggregate({
          where,
          _sum: { total: true },
          _avg: { total: true },
        }),
        this._prisma.order.groupBy({
          by: ['status'],
          where,
          _count: { id: true },
        }),
        this.getTopProductsOptimized(where, 10),
      ]);

    const totalRevenue = orderStats._sum.total || 0;
    const averageOrderValue = orderStats._avg.total || 0;

    const ordersByStatus = statusCounts.reduce(
      (acc: any, item: any) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      topProducts,
    };
  }

  private async getTopProductsOptimized(
    orderWhere: any,
    limit: number
  ): Promise<
    Array<{
      productId: string;
      productName: string;
      totalSold: number;
      revenue: number;
    }>
  > {
    // Use raw query for better performance on complex aggregations
    const topProducts = (await this._prisma.$queryRaw`
      SELECT 
        oi.product_id as "productId",
        p.name as "productName",
        SUM(oi.quantity) as "totalSold",
        SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'CANCELLED'
      ${orderWhere.createdAt?.gte ? `AND o.created_at >= ${orderWhere.createdAt.gte}` : ''}
      ${orderWhere.createdAt?.lte ? `AND o.created_at <= ${orderWhere.createdAt.lte}` : ''}
      GROUP BY oi.product_id, p.name
      ORDER BY revenue DESC
      LIMIT ${limit}
    `) as any[];

    return topProducts.map(item => ({
      productId: item.productId,
      productName: item.productName,
      totalSold: Number(item.totalSold),
      revenue: Number(item.revenue),
    }));
  }

  /**
   * Get database performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    database: any;
    cache: any;
    recommendations: string[];
  }> {
    const [dbHealth, cacheStats] = await Promise.all([
      this.dbOptimization.healthCheck(),
      cacheService.getCacheStatistics(),
    ]);

    return {
      database: dbHealth,
      cache: cacheStats,
      recommendations: dbHealth.recommendations,
    };
  }

  /**
   * Optimize database performance
   */
  async optimizePerformance(): Promise<{
    optimizationsApplied: string[];
    errors: string[];
  }> {
    const optimizationsApplied: string[] = [];
    const errors: string[] = [];

    try {
      // Analyze and optimize queries
      const recommendations = await this.dbOptimization.optimizeQueries();
      optimizationsApplied.push(...recommendations);

      // Perform cache maintenance
      const cacheResult = await cacheService.performMaintenance();
      if (cacheResult.cleanedEntries > 0) {
        optimizationsApplied.push(
          `Cleaned ${cacheResult.cleanedEntries} expired cache entries`
        );
      }
      errors.push(...cacheResult.errors);

      // Reset metrics for fresh monitoring
      this.dbOptimization.resetMetrics();
    } catch (error) {
      errors.push(
        `Performance optimization error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return { optimizationsApplied, errors };
  }
}

// Export singleton instance
export const createOptimizedOrderService = (_prisma: PrismaClient) => {
  return new OptimizedOrderService(_prisma);
};
