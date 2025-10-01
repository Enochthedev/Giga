import { createLogger } from '../lib/logger';
import { batchProcessorService } from './batch-processor.service';
import { cacheService } from './cache.service';
import { connectionPoolService } from './connection-pool.service';
import { metricsService } from './metrics.service';

const logger = createLogger('PerformanceMonitorService');

export interface PerformanceMetrics {
  timestamp: number;
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    heap: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  connections: {
    database: {
      total: number;
      idle: number;
      waiting: number;
    };
    redis: {
      total: number;
      active: number;
    };
  };
  cache: {
    hitRate: number;
    memoryUsage: number;
    size: number;
  };
  batching: {
    uploadQueue: number;
    deleteQueue: number;
    metadataQueue: number;
    processingBatches: number;
  };
  requests: {
    activeConnections: number;
    requestsPerSecond: number;
    averageResponseTime: number;
  };
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
}

export interface PerformanceThresholds {
  cpu: {
    warning: number;
    critical: number;
  };
  memory: {
    warning: number;
    critical: number;
  };
  responseTime: {
    warning: number;
    critical: number;
  };
  cacheHitRate: {
    warning: number;
  };
  connectionPool: {
    warning: number;
    critical: number;
  };
}

export class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private metricsHistory: PerformanceMetrics[] = [];
  private activeAlerts: Map<string, PerformanceAlert> = new Map();
  private requestMetrics = {
    activeConnections: 0,
    totalRequests: 0,
    totalResponseTime: 0,
    requestsInLastSecond: 0,
    lastSecondTimestamp: Date.now(),
  };

  private thresholds: PerformanceThresholds = {
    cpu: {
      warning: 70,
      critical: 90,
    },
    memory: {
      warning: 80,
      critical: 95,
    },
    responseTime: {
      warning: 2000, // 2 seconds
      critical: 5000, // 5 seconds
    },
    cacheHitRate: {
      warning: 70, // Below 70% hit rate
    },
    connectionPool: {
      warning: 80, // 80% of max connections
      critical: 95, // 95% of max connections
    },
  };

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    // Collect metrics every 30 seconds
    setInterval(() => {
      this.collectMetrics();
    }, 30000);

    // Check for alerts every 10 seconds
    setInterval(() => {
      this.checkAlerts();
    }, 10000);

    // Clean up old metrics every 5 minutes
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000);

    logger.info('Performance monitoring started');
  }

  /**
   * Collect current performance metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      const timestamp = Date.now();

      // CPU metrics
      const cpuUsage = process.cpuUsage();
      const loadAverage = (process as any).loadavg ? (process as any).loadavg() : [0, 0, 0];

      // Memory metrics
      const memUsage = process.memoryUsage();
      const totalMemory =
        process.memoryUsage().rss + process.memoryUsage().external;

      // Connection pool stats
      const poolStats = connectionPoolService.getPoolStats();

      // Cache stats
      const cacheStats = cacheService.getCacheStats();

      // Batch processing stats
      const batchStats = batchProcessorService.getBatchStats();

      // Request metrics
      const requestsPerSecond = this.calculateRequestsPerSecond();

      const metrics: PerformanceMetrics = {
        timestamp,
        cpu: {
          usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
          loadAverage,
        },
        memory: {
          used: memUsage.rss,
          total: totalMemory,
          percentage: (memUsage.rss / totalMemory) * 100,
          heap: {
            used: memUsage.heapUsed,
            total: memUsage.heapTotal,
            percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
          },
        },
        connections: {
          database: {
            total: poolStats.database?.totalCount || 0,
            idle: poolStats.database?.idleCount || 0,
            waiting: poolStats.database?.waitingCount || 0,
          },
          redis: {
            total: poolStats.redis?.totalConnections || 0,
            active: poolStats.redis?.activeConnections || 0,
          },
        },
        cache: {
          hitRate: cacheStats.hitRate,
          memoryUsage: cacheStats.memoryUsage,
          size: cacheStats.memoryCacheSize,
        },
        batching: {
          uploadQueue: batchStats.uploadBatch,
          deleteQueue: batchStats.deleteBatch,
          metadataQueue: batchStats.metadataBatch,
          processingBatches: batchStats.processingBatches.length,
        },
        requests: {
          activeConnections: this.requestMetrics.activeConnections,
          requestsPerSecond,
          averageResponseTime: this.calculateAverageResponseTime(),
        },
      };

      this.metricsHistory.push(metrics);

      // Update Prometheus metrics
      this.updatePrometheusMetrics(metrics);

      logger.debug('Performance metrics collected', {
        cpuUsage: metrics.cpu.usage,
        memoryPercentage: metrics.memory.percentage,
        cacheHitRate: metrics.cache.hitRate,
        requestsPerSecond,
      });
    } catch (error) {
      logger.error('Failed to collect performance metrics', error);
    }
  }

  /**
   * Update Prometheus metrics
   */
  private updatePrometheusMetrics(metrics: PerformanceMetrics): void {
    // Update CPU metrics
    metricsService.cpuUsage.set(metrics.cpu.usage);

    // Update memory metrics
    metricsService.memoryUsage.set({ type: 'rss' }, metrics.memory.used);
    metricsService.memoryUsage.set(
      { type: 'heap_used' },
      metrics.memory.heap.used
    );
    metricsService.memoryUsage.set(
      { type: 'heap_total' },
      metrics.memory.heap.total
    );

    // Update connection metrics
    metricsService.updateActiveConnections(
      'database',
      metrics.connections.database.total
    );
    metricsService.updateActiveConnections(
      'redis',
      metrics.connections.redis.active
    );

    // Update queue metrics
    metricsService.updateQueueSize(
      'upload_batch',
      metrics.batching.uploadQueue
    );
    metricsService.updateQueueSize(
      'delete_batch',
      metrics.batching.deleteQueue
    );
    metricsService.updateQueueSize(
      'metadata_batch',
      metrics.batching.metadataQueue
    );
  }

  /**
   * Check for performance alerts
   */
  private checkAlerts(): void {
    if (this.metricsHistory.length === 0) return;

    const latest = this.metricsHistory[this.metricsHistory.length - 1];

    // Check CPU usage
    this.checkThreshold(
      'cpu_usage',
      latest.cpu.usage,
      this.thresholds.cpu,
      '%'
    );

    // Check memory usage
    this.checkThreshold(
      'memory_usage',
      latest.memory.percentage,
      this.thresholds.memory,
      '%'
    );

    // Check response time
    this.checkThreshold(
      'response_time',
      latest.requests.averageResponseTime,
      this.thresholds.responseTime,
      'ms'
    );

    // Check cache hit rate (inverse - alert when too low)
    if (latest.cache.hitRate < this.thresholds.cacheHitRate.warning) {
      this.createAlert(
        'cache_hit_rate',
        'warning',
        latest.cache.hitRate,
        this.thresholds.cacheHitRate.warning,
        `Cache hit rate is low: ${latest.cache.hitRate.toFixed(2)}%`
      );
    } else {
      this.resolveAlert('cache_hit_rate');
    }

    // Check connection pool usage
    const dbPoolUsage = (latest.connections.database.total / 10) * 100; // Assuming max 10 connections
    this.checkThreshold(
      'db_pool_usage',
      dbPoolUsage,
      this.thresholds.connectionPool,
      '%'
    );
  }

  /**
   * Check threshold and create/resolve alerts
   */
  private checkThreshold(
    metric: string,
    value: number,
    thresholds: { warning: number; critical: number },
    unit: string
  ): void {
    if (value >= thresholds.critical) {
      this.createAlert(
        metric,
        'critical',
        value,
        thresholds.critical,
        `${metric} is critically high: ${value.toFixed(2)}${unit}`
      );
    } else if (value >= thresholds.warning) {
      this.createAlert(
        metric,
        'warning',
        value,
        thresholds.warning,
        `${metric} is high: ${value.toFixed(2)}${unit}`
      );
    } else {
      this.resolveAlert(metric);
    }
  }

  /**
   * Create or update alert
   */
  private createAlert(
    metric: string,
    type: 'warning' | 'critical',
    value: number,
    threshold: number,
    message: string
  ): void {
    const alertId = `${metric}_${type}`;
    const existingAlert = this.activeAlerts.get(alertId);

    if (!existingAlert) {
      const alert: PerformanceAlert = {
        id: alertId,
        type,
        metric,
        value,
        threshold,
        message,
        timestamp: Date.now(),
      };

      this.activeAlerts.set(alertId, alert);

      logger.warn('Performance alert created', alert);

      // Record security event for critical alerts
      if (type === 'critical') {
        metricsService.recordSecurityEvent('performance_critical', 'high');
      }
    }
  }

  /**
   * Resolve alert
   */
  private resolveAlert(metric: string): void {
    const warningId = `${metric}_warning`;
    const criticalId = `${metric}_critical`;

    [warningId, criticalId].forEach(alertId => {
      const alert = this.activeAlerts.get(alertId);
      if (alert && !alert.resolved) {
        alert.resolved = true;
        alert.resolvedAt = Date.now();

        logger.info('Performance alert resolved', {
          alertId,
          duration: alert.resolvedAt - alert.timestamp,
        });

        // Remove resolved alert after 5 minutes
        setTimeout(() => {
          this.activeAlerts.delete(alertId);
        }, 300000);
      }
    });
  }

  /**
   * Record request metrics
   */
  public recordRequest(responseTime: number): void {
    this.requestMetrics.totalRequests++;
    this.requestMetrics.totalResponseTime += responseTime;

    // Update requests per second counter
    const now = Date.now();
    if (now - this.requestMetrics.lastSecondTimestamp >= 1000) {
      this.requestMetrics.requestsInLastSecond = 0;
      this.requestMetrics.lastSecondTimestamp = now;
    }
    this.requestMetrics.requestsInLastSecond++;
  }

  /**
   * Update active connections count
   */
  public updateActiveConnections(delta: number): void {
    this.requestMetrics.activeConnections += delta;
  }

  /**
   * Calculate requests per second
   */
  private calculateRequestsPerSecond(): number {
    return this.requestMetrics.requestsInLastSecond;
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    if (this.requestMetrics.totalRequests === 0) return 0;
    return (
      this.requestMetrics.totalResponseTime / this.requestMetrics.totalRequests
    );
  }

  /**
   * Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics | null {
    return this.metricsHistory.length > 0
      ? this.metricsHistory[this.metricsHistory.length - 1]
      : null;
  }

  /**
   * Get metrics history
   */
  public getMetricsHistory(limit: number = 100): PerformanceMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.activeAlerts.values()).filter(
      alert => !alert.resolved
    );
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    current: PerformanceMetrics | null;
    alerts: PerformanceAlert[];
    trends: {
      cpuTrend: 'increasing' | 'decreasing' | 'stable';
      memoryTrend: 'increasing' | 'decreasing' | 'stable';
      responseTrend: 'increasing' | 'decreasing' | 'stable';
    };
  } {
    const current = this.getCurrentMetrics();
    const alerts = this.getActiveAlerts();
    const trends = this.calculateTrends();

    return {
      current,
      alerts,
      trends,
    };
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(): {
    cpuTrend: 'increasing' | 'decreasing' | 'stable';
    memoryTrend: 'increasing' | 'decreasing' | 'stable';
    responseTrend: 'increasing' | 'decreasing' | 'stable';
  } {
    if (this.metricsHistory.length < 5) {
      return {
        cpuTrend: 'stable',
        memoryTrend: 'stable',
        responseTrend: 'stable',
      };
    }

    const recent = this.metricsHistory.slice(-5);

    return {
      cpuTrend: this.calculateTrend(recent.map(m => m.cpu.usage)),
      memoryTrend: this.calculateTrend(recent.map(m => m.memory.percentage)),
      responseTrend: this.calculateTrend(
        recent.map(m => m.requests.averageResponseTime)
      ),
    };
  }

  /**
   * Calculate trend for a series of values
   */
  private calculateTrend(
    values: number[]
  ): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  /**
   * Clean up old metrics (keep last 1000 entries)
   */
  private cleanupOldMetrics(): void {
    const maxEntries = 1000;
    if (this.metricsHistory.length > maxEntries) {
      const toRemove = this.metricsHistory.length - maxEntries;
      this.metricsHistory.splice(0, toRemove);

      logger.debug('Cleaned up old performance metrics', { removed: toRemove });
    }
  }

  /**
   * Reset metrics (useful for testing)
   */
  public reset(): void {
    this.metricsHistory = [];
    this.activeAlerts.clear();
    this.requestMetrics = {
      activeConnections: 0,
      totalRequests: 0,
      totalResponseTime: 0,
      requestsInLastSecond: 0,
      lastSecondTimestamp: Date.now(),
    };
  }
}

// Export singleton instance
export const performanceMonitorService =
  PerformanceMonitorService.getInstance();
