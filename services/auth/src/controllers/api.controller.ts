import { Request, Response } from 'express';
import { APIAnalyticsMiddleware } from '../middleware/apiOptimization.middleware';
import { APIVersioningMiddleware } from '../middleware/apiVersioning.middleware';
import { logger } from '../services/logger.service';
import { metricsService } from '../services/metrics.service';
import { redisService } from '../services/redis.service';

/**
 * API Management Controller
 * Handles API versioning, analytics, and documentation
 */
export class APIController {
  /**
   * Get API version information
   */
  getVersionInfo(_req: Request, res: Response): void {
    try {
      const versionInfo = APIVersioningMiddleware.getVersionInfo();

      res.json({
        success: true,
        data: versionInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get version info', error as Error, {
        path: req.path,
        method: req.method
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve version information',
        code: 'VERSION_INFO_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get API usage analytics
   */
  async getUsageAnalytics(_req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, granularity = 'day' } = req.query;

      // Validate date parameters
      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
          code: 'MISSING_DATE_PARAMETERS',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const analytics = await APIAnalyticsMiddleware.getAnalytics(
        startDate as string,
        endDate as string
      );

      // Add additional metrics
      // const performanceMetrics = await metricsService.getPerformanceMetrics();

      const response = {
        ...analytics,
        averageResponseTime: 0, // Will be calculated from metrics
        granularity,
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get usage analytics', error as Error, {
        path: req.path,
        method: req.method,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve usage analytics',
        code: 'ANALYTICS_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get API endpoint documentation
   */
  getEndpointDocs(_req: Request, res: Response): void {
    try {
      const { endpoint } = req.params;

      // This would typically fetch from a documentation database
      // For now, return basic endpoint information
      const endpointDocs = {
        endpoint,
        method: 'GET',
        description: 'API endpoint documentation',
        parameters: [],
        responses: {},
        examples: {},
        rateLimit: {
          limit: 100,
          window: '15 minutes'
        },
        authentication: 'Bearer token required',
        version: req.apiVersion || '1.0.0'
      };

      res.json({
        success: true,
        data: endpointDocs,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get endpoint documentation', error as Error, {
        path: req.path,
        method: req.method,
        params: req.params
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve endpoint documentation',
        code: 'DOCS_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get API rate limit status
   */
  async getRateLimitStatus(_req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.sub;
      const ip = req.ip;
      const path = req.path;

      // Get current rate limit status
      const [
        ipCount,
        userCount,
        globalCount
      ] = await Promise.all([
        redisService.getCounter(`rate_limit:${path}:ip:${ip}`),
        userId ? redisService.getCounter(`rate_limit:${path}:user:${userId}`) : 0,
        redisService.getCounter(`rate_limit:global:${new Date().toISOString().split('T')[0]}`)
      ]);

      const rateLimitStatus = {
        ip: {
          current: ipCount,
          limit: 100,
          remaining: Math.max(0, 100 - ipCount),
          resetTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        user: userId ? {
          current: userCount,
          limit: 200,
          remaining: Math.max(0, 200 - userCount),
          resetTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        } : null,
        global: {
          current: globalCount,
          dailyLimit: 1000000
        }
      };

      res.json({
        success: true,
        data: rateLimitStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get rate limit status', error as Error, {
        path: req.path,
        method: req.method,
        userId: req.user?.sub
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve rate limit status',
        code: 'RATE_LIMIT_STATUS_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get API health and status
   */
  async getAPIStatus(_req: Request, res: Response): Promise<void> {
    try {
      const performanceMetrics = await metricsService.getPerformanceMetrics();
      const databaseMetrics = await metricsService.getDatabaseMetrics();
      const redisMetrics = await metricsService.getRedisMetrics();

      // Calculate API health score
      const healthScore = this.calculateHealthScore(performanceMetrics, databaseMetrics, redisMetrics);

      const apiStatus = {
        status: healthScore >= 0.8 ? 'healthy' : healthScore >= 0.6 ? 'degraded' : 'unhealthy',
        healthScore,
        version: req.apiVersion || '1.0.0',
        uptime: process.uptime(),
        performance: performanceMetrics,
        database: databaseMetrics,
        redis: redisMetrics,
        features: req.versionContext?.features || {},
        lastUpdated: new Date().toISOString()
      };

      const statusCode = apiStatus.status === 'healthy' ? 200 :
        apiStatus.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json({
        success: true,
        data: apiStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get API status', error as Error, {
        path: req.path,
        method: req.method
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve API status',
        code: 'API_STATUS_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get API usage report
   */
  async getUsageReport(_req: Request, res: Response): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        format = 'json',
        includeDetails = 'false'
      } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
          code: 'MISSING_DATE_PARAMETERS',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const analytics = await APIAnalyticsMiddleware.getAnalytics(
        startDate as string,
        endDate as string
      );

      const report = {
        summary: {
          totalRequests: analytics.totalRequests,
          errorRate: analytics.errorRate,
          rateLimitHits: analytics.rateLimitHits,
          averageResponseTime: 0 // Will be calculated from metrics
        },
        period: {
          start: startDate,
          end: endDate,
          duration: this.calculateDuration(startDate as string, endDate as string)
        },
        ...(includeDetails === 'true' && {
          details: {
            requestsByEndpoint: analytics.requestsByEndpoint,
            requestsByMethod: analytics.requestsByMethod,
            requestsByStatus: analytics.requestsByStatus
          }
        }),
        generatedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        const csv = this.convertToCSV(report);
        res.set({
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="api-usage-report-${startDate}-${endDate}.csv"`
        });
        res.send(csv);
        return;
      }

      res.json({
        success: true,
        data: report,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to generate usage report', error as Error, {
        path: req.path,
        method: req.method,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: 'Failed to generate usage report',
        code: 'REPORT_GENERATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Calculate API health score based on metrics
   */
  private calculateHealthScore(
    performance: any,
    database: any,
    redis: any
  ): number {
    let score = 1.0;

    // Penalize high error rates
    if (performance.errorRate > 5) score -= 0.3;
    else if (performance.errorRate > 1) score -= 0.1;

    // Penalize slow response times
    if (performance.averageResponseTime > 1000) score -= 0.3;
    else if (performance.averageResponseTime > 500) score -= 0.1;

    // Penalize database issues
    if (database.connectionErrors > 0) score -= 0.2;
    if (database.averageQueryTime > 100) score -= 0.1;

    // Penalize Redis issues
    if (redis.connectionErrors > 0) score -= 0.1;
    if (redis.cacheHitRate < 0.8) score -= 0.1;

    return Math.max(0, score);
  }

  /**
   * Calculate duration between dates
   */
  private calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  }

  /**
   * Convert report data to CSV format
   */
  private convertToCSV(report: any): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Requests', report.summary.totalRequests],
      ['Error Rate (%)', report.summary.errorRate.toFixed(2)],
      ['Rate Limit Hits', report.summary.rateLimitHits],
      ['Average Response Time (ms)', report.summary.averageResponseTime],
      ['Report Period', `${report.period.start} to ${report.period.end}`],
      ['Duration', report.period.duration]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }
}