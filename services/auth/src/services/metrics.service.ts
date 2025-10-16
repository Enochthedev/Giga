import { logger } from './logger.service';

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  activeConnections: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
}

export interface DatabaseMetrics {
  connectionCount: number;
  queryCount: number;
  averageQueryTime: number;
  slowQueries: number;
  connectionErrors: number;
}

export interface RedisMetrics {
  connectionCount: number;
  operationCount: number;
  averageOperationTime: number;
  cacheHitRate: number;
  connectionErrors: number;
}

class MetricsService {
  private metrics: Map<string, MetricData[]> = new Map();
  private performanceCounters = {
    requestCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
    activeConnections: 0,
  };

  private databaseCounters = {
    queryCount: 0,
    totalQueryTime: 0,
    slowQueries: 0,
    connectionErrors: 0,
  };

  private redisCounters = {
    operationCount: 0,
    totalOperationTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    connectionErrors: 0,
  };

  private responseTimings: number[] = [];

  // Record a metric
  recordMetric(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>
  ): void {
    const metric: MetricData = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);

    // Keep only last 1000 entries per metric
    if (metricArray.length > 1000) {
      metricArray.shift();
    }

    logger.debug(`Metric recorded: ${name}`, {
      metric: name,
      value,
      unit,
      tags,
    });
  }

  // Performance tracking
  incrementRequestCount(): void {
    this.performanceCounters.requestCount++;
    this.recordMetric(
      'http_requests_total',
      this.performanceCounters.requestCount,
      'count'
    );
  }

  incrementErrorCount(): void {
    this.performanceCounters.errorCount++;
    this.recordMetric(
      'http_errors_total',
      this.performanceCounters.errorCount,
      'count'
    );
  }

  setActiveConnections(count: number): void {
    this.performanceCounters.activeConnections = count;
    this.recordMetric('active_connections', count, 'count');
  }

  // Database metrics
  recordDatabaseQuery(
    duration: number,
    operation: string,
    table?: string
  ): void {
    this.databaseCounters.queryCount++;
    this.databaseCounters.totalQueryTime += duration;

    if (duration > 1000) {
      // Slow query threshold: 1 second
      this.databaseCounters.slowQueries++;
    }

    this.recordMetric('database_query_duration', duration, 'ms', {
      operation,
      table: table || 'unknown',
    });

    this.recordMetric(
      'database_queries_total',
      this.databaseCounters.queryCount,
      'count'
    );
  }

  recordDatabaseError(): void {
    this.databaseCounters.connectionErrors++;
    this.recordMetric(
      'database_errors_total',
      this.databaseCounters.connectionErrors,
      'count'
    );
  }

  // Redis metrics
  recordRedisOperation(
    duration: number,
    operation: string,
    hit?: boolean
  ): void {
    this.redisCounters.operationCount++;
    this.redisCounters.totalOperationTime += duration;

    if (hit !== undefined) {
      if (hit) {
        this.redisCounters.cacheHits++;
      } else {
        this.redisCounters.cacheMisses++;
      }
    }

    this.recordMetric('redis_operation_duration', duration, 'ms', {
      operation,
    });
    this.recordMetric(
      'redis_operations_total',
      this.redisCounters.operationCount,
      'count'
    );

    if (hit !== undefined) {
      this.recordMetric(
        'redis_cache_hits_total',
        this.redisCounters.cacheHits,
        'count'
      );
      this.recordMetric(
        'redis_cache_misses_total',
        this.redisCounters.cacheMisses,
        'count'
      );
    }
  }

  recordRedisError(): void {
    this.redisCounters.connectionErrors++;
    this.recordMetric(
      'redis_errors_total',
      this.redisCounters.connectionErrors,
      'count'
    );
  }

  // Get current performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    const averageResponseTime =
      this.performanceCounters.requestCount > 0
        ? this.performanceCounters.totalResponseTime /
          this.performanceCounters.requestCount
        : 0;

    const errorRate =
      this.performanceCounters.requestCount > 0
        ? (this.performanceCounters.errorCount /
            this.performanceCounters.requestCount) *
          100
        : 0;

    return {
      requestCount: this.performanceCounters.requestCount,
      averageResponseTime,
      errorRate,
      activeConnections: this.performanceCounters.activeConnections,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage().user / 1000000, // Convert to seconds
    };
  }

  // Get database metrics
  getDatabaseMetrics(): DatabaseMetrics {
    const averageQueryTime =
      this.databaseCounters.queryCount > 0
        ? this.databaseCounters.totalQueryTime /
          this.databaseCounters.queryCount
        : 0;

    return {
      connectionCount: 1, // Will be updated by health check
      queryCount: this.databaseCounters.queryCount,
      averageQueryTime,
      slowQueries: this.databaseCounters.slowQueries,
      connectionErrors: this.databaseCounters.connectionErrors,
    };
  }

  // Get Redis metrics
  getRedisMetrics(): RedisMetrics {
    const averageOperationTime =
      this.redisCounters.operationCount > 0
        ? this.redisCounters.totalOperationTime /
          this.redisCounters.operationCount
        : 0;

    const totalCacheOperations =
      this.redisCounters.cacheHits + this.redisCounters.cacheMisses;
    const cacheHitRate =
      totalCacheOperations > 0
        ? (this.redisCounters.cacheHits / totalCacheOperations) * 100
        : 0;

    return {
      connectionCount: 1, // Will be updated by health check
      operationCount: this.redisCounters.operationCount,
      averageOperationTime,
      cacheHitRate,
      connectionErrors: this.redisCounters.connectionErrors,
    };
  }

  recordCacheHit(type: string) {
    this.redisCounters.cacheHits++;
    this.recordMetric('cache_hits', 1, 'count', { type });
  }

  recordCacheMiss(type: string) {
    this.redisCounters.cacheMisses++;
    this.recordMetric('cache_misses', 1, 'count', { type });
  }

  recordResponseTime(responseTime: number, path?: string) {
    this.responseTimings.push(responseTime);
    this.performanceCounters.totalResponseTime += responseTime;

    // Keep only last 1000 response times for memory efficiency
    if (this.responseTimings.length > 1000) {
      this.responseTimings = this.responseTimings.slice(-1000);
    }

    this.recordMetric(
      'response_time',
      responseTime,
      'ms',
      path ? { path } : undefined
    );
  }

  // Get all metrics for a specific name
  getMetrics(name: string): MetricData[] {
    return this.metrics.get(name) || [];
  }

  // Get all metric names
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  // Reset all metrics (useful for testing)
  reset(): void {
    this.metrics.clear();
    this.performanceCounters = {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      activeConnections: 0,
    };
    this.databaseCounters = {
      queryCount: 0,
      totalQueryTime: 0,
      slowQueries: 0,
      connectionErrors: 0,
    };
    this.redisCounters = {
      operationCount: 0,
      totalOperationTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      connectionErrors: 0,
    };
  }

  // Export metrics in Prometheus format (basic implementation)
  exportPrometheusMetrics(): string {
    let output = '';

    for (const [name, metricArray] of this.metrics.entries()) {
      if (metricArray.length > 0) {
        const latest = metricArray[metricArray.length - 1];
        output += `# TYPE ${name} gauge\n`;
        output += `${name} ${latest.value}\n`;
      }
    }

    return output;
  }
}

export const metricsService = new MetricsService();
