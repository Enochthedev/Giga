import { PrismaClient } from '../generated/prisma-client';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';

interface QueryPerformanceMetrics {
  query: string;
  duration: number;
  timestamp: number;
  params?: any;
}

interface ConnectionPoolStats {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  maxConnections: number;
  queuedRequests: number;
}

class DatabaseOptimizationService {
  private queryMetrics: QueryPerformanceMetrics[] = [];
  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second

  constructor(private _prisma: PrismaClient) {
    this.setupQueryLogging();
  }

  // Setup query performance monitoring
  private setupQueryLogging(): void {
    // Prisma middleware for query performance monitoring
    this._prisma.$use(async (params, next) => {
      const startTime = Date.now();

      try {
        const result = await next(params);
        const duration = Date.now() - startTime;

        // Record query metrics
        this.recordQueryMetrics({
          query: `${params.model}.${params.action}`,
          duration,
          timestamp: startTime,
          params: this.sanitizeParams(params.args),
        });

        // Log slow queries
        if (duration > this.SLOW_QUERY_THRESHOLD) {
          logger.warn('Slow query detected', {
            model: params.model,
            action: params.action,
            duration,
            args: this.sanitizeParams(params.args),
          });
        }

        // Record general query metrics
        metricsService.recordDatabaseQuery(
          duration,
          params.action,
          params.model || 'unknown'
        );

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        logger.error('Database query failed', error as Error, {
          model: params.model,
          action: params.action,
          duration,
          args: this.sanitizeParams(params.args),
        });

        metricsService.recordDatabaseError();
        throw error;
      }
    });
  }

  // Optimized user queries with proper indexing hints
  async findUserWithProfilesOptimized(userId: string) {
    const startTime = Date.now();

    try {
      // Use select to only fetch needed fields and include related data efficiently
      const user = await this._prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          lastLoginAt: true,
          activeRole: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            select: {
              id: true,
              assignedAt: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  permissions: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
          customerProfile: {
            select: {
              id: true,
              preferences: true,
              addresses: {
                select: {
                  id: true,
                  label: true,
                  buildingNumber: true,
                  street: true,
                  address2: true,
                  city: true,
                  country: true,
                  isDefault: true,
                },
              },
            },
          },
          vendorProfile: {
            select: {
              id: true,
              businessName: true,
              businessType: true,
              description: true,
              logo: true,
              website: true,
              subscriptionTier: true,
              commissionRate: true,
              isVerified: true,
              rating: true,
              totalSales: true,
            },
          },
          driverProfile: {
            select: {
              id: true,
              licenseNumber: true,
              vehicleInfo: true,
              isOnline: true,
              currentLocation: true,
              rating: true,
              totalRides: true,
              isVerified: true,
              subscriptionTier: true,
            },
          },
          hostProfile: {
            select: {
              id: true,
              businessName: true,
              description: true,
              rating: true,
              totalBookings: true,
              isVerified: true,
              subscriptionTier: true,
              responseRate: true,
              responseTime: true,
            },
          },
          advertiserProfile: {
            select: {
              id: true,
              companyName: true,
              industry: true,
              website: true,
              totalSpend: true,
              isVerified: true,
            },
          },
        },
      });

      const duration = Date.now() - startTime;
      logger.debug('Optimized user query completed', { userId, duration });

      return user;
    } catch (error) {
      logger.error('Optimized user query failed', error as Error, { userId });
      throw error;
    }
  }

  // Optimized user listing with pagination and filtering
  async findUsersOptimized(options: {
    page?: number;
    limit?: number;
    role?: string;
    status?: 'active' | 'inactive';
    search?: string;
    sortBy?: 'createdAt' | 'lastLoginAt' | 'email';
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const startTime = Date.now();

    try {
      // Build where clause efficiently
      const where: Record<string, any> = {};

      if (status) {
        where.isActive = status === 'active';
      }

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role) {
        where.roles = {
          some: {
            role: {
              name: role,
            },
          },
        };
      }

      // Execute optimized queries in parallel
      const [users, totalCount] = await Promise.all([
        this._prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
            lastLoginAt: true,
            activeRole: true,
            createdAt: true,
            roles: {
              select: {
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        this._prisma.user.count({ where }),
      ]);

      const duration = Date.now() - startTime;
      logger.debug('Optimized user listing completed', {
        page,
        limit,
        totalCount,
        duration,
        filters: { role, status, search },
      });

      return {
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Optimized user listing failed', error as Error, options);
      throw error;
    }
  }

  // Batch operations for better performance
  async batchUpdateUserStatus(userIds: string[], isActive: boolean) {
    const startTime = Date.now();

    try {
      const result = await this._prisma.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          isActive,
          updatedAt: new Date(),
        },
      });

      const duration = Date.now() - startTime;
      logger.info('Batch user status update completed', {
        userCount: userIds.length,
        isActive,
        duration,
        updatedCount: result.count,
      });

      return result;
    } catch (error) {
      logger.error('Batch user status update failed', error as Error, {
        userIds,
        isActive,
      });
      throw error;
    }
  }

  // Connection pool monitoring
  async getConnectionPoolStats(): Promise<ConnectionPoolStats> {
    try {
      // Simplified connection pool stats - Prisma doesn't expose detailed metrics in current version
      // In production, you would integrate with database monitoring tools
      return {
        activeConnections: 1, // Estimated based on current connection
        idleConnections: 0,
        totalConnections: 1,
        maxConnections: 10, // Default Prisma connection limit
        queuedRequests: 0,
      };
    } catch (error) {
      logger.error('Failed to get connection pool stats', error as Error);
      return {
        activeConnections: 0,
        idleConnections: 0,
        totalConnections: 0,
        maxConnections: 10,
        queuedRequests: 0,
      };
    }
  }

  // Query performance analysis
  getQueryPerformanceReport(): {
    slowQueries: QueryPerformanceMetrics[];
    averageQueryTime: number;
    totalQueries: number;
    queryDistribution: Record<string, number>;
  } {
    const now = Date.now();
    const recentMetrics = this.queryMetrics.filter(
      metric => now - metric.timestamp < 3600000 // Last hour
    );

    const slowQueries = recentMetrics.filter(
      metric => metric.duration > this.SLOW_QUERY_THRESHOLD
    );

    const totalDuration = recentMetrics.reduce(
      (sum, metric) => sum + metric.duration,
      0
    );
    const averageQueryTime =
      recentMetrics.length > 0 ? totalDuration / recentMetrics.length : 0;

    const queryDistribution: Record<string, number> = {};
    recentMetrics.forEach(metric => {
      queryDistribution[metric.query] =
        (queryDistribution[metric.query] || 0) + 1;
    });

    return {
      slowQueries: slowQueries.slice(0, 10), // Top 10 slow queries
      averageQueryTime,
      totalQueries: recentMetrics.length,
      queryDistribution,
    };
  }

  // Database health check
  async performHealthCheck(): Promise<{
    isHealthy: boolean;
    connectionTime: number;
    queryTime: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let connectionTime = 0;
    let queryTime = 0;

    try {
      // Test connection
      const connectionStart = Date.now();
      await this._prisma.$connect();
      connectionTime = Date.now() - connectionStart;

      // Test simple query
      const queryStart = Date.now();
      await this._prisma.user.count();
      queryTime = Date.now() - queryStart;

      // Check for slow performance
      if (connectionTime > 5000) {
        errors.push('Slow database connection');
      }

      if (queryTime > 2000) {
        errors.push('Slow query performance');
      }

      return {
        isHealthy: errors.length === 0,
        connectionTime,
        queryTime,
        errors,
      };
    } catch (error) {
      errors.push(`Database error: ${(error as Error).message}`);
      return {
        isHealthy: false,
        connectionTime,
        queryTime,
        errors,
      };
    }
  }

  // Cleanup old metrics
  private recordQueryMetrics(metrics: QueryPerformanceMetrics): void {
    this.queryMetrics.push(metrics);

    // Keep only recent metrics
    if (this.queryMetrics.length > this.MAX_METRICS_HISTORY) {
      this.queryMetrics = this.queryMetrics.slice(-this.MAX_METRICS_HISTORY);
    }
  }

  // Sanitize query parameters for logging
  private sanitizeParams(params: any): any {
    if (!params) return params;

    // Remove sensitive fields
    const sanitized = { ...params };
    if (sanitized.data?.passwordHash) {
      sanitized.data.passwordHash = '[REDACTED]';
    }
    if (sanitized.data?.password) {
      sanitized.data.password = '[REDACTED]';
    }

    return sanitized;
  }

  // Index recommendations based on query patterns
  getIndexRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.getQueryPerformanceReport();

    // Analyze slow queries for index opportunities
    report.slowQueries.forEach(query => {
      if (query.query.includes('user.findMany') && query.duration > 2000) {
        recommendations.push(
          'Consider adding composite index on (isActive, createdAt) for user queries'
        );
      }

      if (query.query.includes('role') && query.duration > 1000) {
        recommendations.push(
          'Consider adding index on role.name for role-based queries'
        );
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }
}

export { DatabaseOptimizationService };
