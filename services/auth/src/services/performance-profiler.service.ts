import { logger } from './logger.service';
import { metricsService } from './metrics.service';

interface PerformanceProfile {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface BottleneckAnalysis {
  operation: string;
  averageDuration: number;
  maxDuration: number;
  occurrences: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ResourceUsage {
  memory: NodeJS.MemoryUsage;
  cpu: NodeJS.CpuUsage;
  timestamp: number;
}

class PerformanceProfilerService {
  private profiles: PerformanceProfile[] = [];
  private resourceSnapshots: ResourceUsage[] = [];
  private readonly MAX_PROFILES = 10000;
  private readonly MAX_SNAPSHOTS = 1000;
  private readonly SLOW_OPERATION_THRESHOLD = 1000; // 1 second
  private readonly CRITICAL_THRESHOLD = 5000; // 5 seconds

  // Profile an operation
  async profileOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    const startCpu = process.cpuUsage();
    const startMemory = process.memoryUsage();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      // Record performance profile
      this.recordProfile({
        operation: operationName,
        duration,
        timestamp: startTime,
        metadata: {
          ...metadata,
          success: true,
          memoryDelta: this.calculateMemoryDelta(
            startMemory,
            process.memoryUsage()
          ),
          cpuDelta: process.cpuUsage(startCpu),
        },
      });

      // Log slow operations
      if (duration > this.SLOW_OPERATION_THRESHOLD) {
        logger.warn('Slow operation detected', {
          operation: operationName,
          duration,
          metadata,
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Record failed operation
      this.recordProfile({
        operation: operationName,
        duration,
        timestamp: startTime,
        metadata: {
          ...metadata,
          success: false,
          error: (error as Error).message,
          memoryDelta: this.calculateMemoryDelta(
            startMemory,
            process.memoryUsage()
          ),
          cpuDelta: process.cpuUsage(startCpu),
        },
      });

      throw error;
    }
  }

  // Profile synchronous operations
  profileSync<T>(
    operationName: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = Date.now();
    const startCpu = process.cpuUsage();
    const startMemory = process.memoryUsage();

    try {
      const result = operation();
      const duration = Date.now() - startTime;

      this.recordProfile({
        operation: operationName,
        duration,
        timestamp: startTime,
        metadata: {
          ...metadata,
          success: true,
          memoryDelta: this.calculateMemoryDelta(
            startMemory,
            process.memoryUsage()
          ),
          cpuDelta: process.cpuUsage(startCpu),
        },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordProfile({
        operation: operationName,
        duration,
        timestamp: startTime,
        metadata: {
          ...metadata,
          success: false,
          error: (error as Error).message,
          memoryDelta: this.calculateMemoryDelta(
            startMemory,
            process.memoryUsage()
          ),
          cpuDelta: process.cpuUsage(startCpu),
        },
      });

      throw error;
    }
  }

  // Record resource usage snapshot
  recordResourceSnapshot(): void {
    const snapshot: ResourceUsage = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: Date.now(),
    };

    this.resourceSnapshots.push(snapshot);

    // Keep only recent snapshots
    if (this.resourceSnapshots.length > this.MAX_SNAPSHOTS) {
      this.resourceSnapshots = this.resourceSnapshots.slice(
        -this.MAX_SNAPSHOTS
      );
    }

    // Record metrics
    metricsService.recordMetric(
      'memory_usage_rss',
      snapshot.memory.rss,
      'bytes'
    );
    metricsService.recordMetric(
      'memory_usage_heap_used',
      snapshot.memory.heapUsed,
      'bytes'
    );
    metricsService.recordMetric(
      'memory_usage_heap_total',
      snapshot.memory.heapTotal,
      'bytes'
    );
    metricsService.recordMetric(
      'cpu_usage_user',
      snapshot.cpu.user,
      'microseconds'
    );
    metricsService.recordMetric(
      'cpu_usage_system',
      snapshot.cpu.system,
      'microseconds'
    );
  }

  // Analyze bottlenecks
  analyzeBottlenecks(timeWindowMs = 3600000): BottleneckAnalysis[] {
    const now = Date.now();
    const recentProfiles = this.profiles.filter(
      profile => now - profile.timestamp < timeWindowMs
    );

    const operationStats = new Map<
      string,
      {
        durations: number[];
        totalDuration: number;
        count: number;
      }
    >();

    // Aggregate operation statistics
    recentProfiles.forEach(profile => {
      if (!operationStats.has(profile.operation)) {
        operationStats.set(profile.operation, {
          durations: [],
          totalDuration: 0,
          count: 0,
        });
      }

      const _stats = operationStats.get(profile.operation)!;
      stats.durations.push(profile.duration);
      stats.totalDuration += profile.duration;
      stats.count++;
    });

    // Analyze bottlenecks
    const bottlenecks: BottleneckAnalysis[] = [];

    operationStats.forEach((stats, operation) => {
      const averageDuration = stats.totalDuration / stats.count;
      const maxDuration = Math.max(...stats.durations);

      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

      if (maxDuration > this.CRITICAL_THRESHOLD) {
        severity = 'critical';
      } else if (averageDuration > this.SLOW_OPERATION_THRESHOLD) {
        severity = 'high';
      } else if (maxDuration > this.SLOW_OPERATION_THRESHOLD) {
        severity = 'medium';
      }

      bottlenecks.push({
        operation,
        averageDuration,
        maxDuration,
        occurrences: stats.count,
        severity,
      });
    });

    // Sort by severity and average duration
    return bottlenecks.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff =
        severityOrder[b.severity] - severityOrder[a.severity];

      if (severityDiff !== 0) return severityDiff;
      return b.averageDuration - a.averageDuration;
    });
  }

  // Get performance report
  getPerformanceReport(timeWindowMs = 3600000): {
    summary: {
      totalOperations: number;
      averageResponseTime: number;
      slowOperations: number;
      criticalOperations: number;
    };
    bottlenecks: BottleneckAnalysis[];
    resourceTrends: {
      memoryTrend: 'increasing' | 'decreasing' | 'stable';
      cpuTrend: 'increasing' | 'decreasing' | 'stable';
      averageMemoryUsage: number;
      peakMemoryUsage: number;
    };
    recommendations: string[];
  } {
    const now = Date.now();
    const recentProfiles = this.profiles.filter(
      profile => now - profile.timestamp < timeWindowMs
    );

    const recentSnapshots = this.resourceSnapshots.filter(
      snapshot => now - snapshot.timestamp < timeWindowMs
    );

    // Calculate summary statistics
    const totalOperations = recentProfiles.length;
    const totalDuration = recentProfiles.reduce(
      (sum, profile) => sum + profile.duration,
      0
    );
    const averageResponseTime =
      totalOperations > 0 ? totalDuration / totalOperations : 0;
    const slowOperations = recentProfiles.filter(
      p => p.duration > this.SLOW_OPERATION_THRESHOLD
    ).length;
    const criticalOperations = recentProfiles.filter(
      p => p.duration > this.CRITICAL_THRESHOLD
    ).length;

    // Analyze bottlenecks
    const bottlenecks = this.analyzeBottlenecks(timeWindowMs);

    // Analyze resource trends
    const resourceTrends = this.analyzeResourceTrends(recentSnapshots);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      bottlenecks,
      resourceTrends
    );

    return {
      summary: {
        totalOperations,
        averageResponseTime,
        slowOperations,
        criticalOperations,
      },
      bottlenecks,
      resourceTrends,
      recommendations,
    };
  }

  // Start continuous monitoring
  startContinuousMonitoring(intervalMs = 30000): void {
    setInterval(() => {
      this.recordResourceSnapshot();

      // Analyze and log critical bottlenecks
      const bottlenecks = this.analyzeBottlenecks(300000); // Last 5 minutes
      const criticalBottlenecks = bottlenecks.filter(
        b => b.severity === 'critical'
      );

      if (criticalBottlenecks.length > 0) {
        logger.error('Critical performance bottlenecks detected', {
          bottlenecks: criticalBottlenecks,
        });
      }
    }, intervalMs);

    logger.info('Performance monitoring started', { intervalMs });
  }

  // Clear old profiles
  cleanup(maxAgeMs = 86400000): void {
    const now = Date.now();

    this.profiles = this.profiles.filter(
      profile => now - profile.timestamp < maxAgeMs
    );

    this.resourceSnapshots = this.resourceSnapshots.filter(
      snapshot => now - snapshot.timestamp < maxAgeMs
    );

    logger.debug('Performance profiler cleanup completed', {
      remainingProfiles: this.profiles.length,
      remainingSnapshots: this.resourceSnapshots.length,
    });
  }

  // Private helper methods
  private recordProfile(profile: PerformanceProfile): void {
    this.profiles.push(profile);

    // Keep only recent profiles
    if (this.profiles.length > this.MAX_PROFILES) {
      this.profiles = this.profiles.slice(-this.MAX_PROFILES);
    }

    // Record metrics
    metricsService.recordMetric(
      `operation_duration_${profile.operation}`,
      profile.duration,
      'ms'
    );
  }

  private calculateMemoryDelta(
    start: NodeJS.MemoryUsage,
    end: NodeJS.MemoryUsage
  ): NodeJS.MemoryUsage {
    return {
      rss: end.rss - start.rss,
      heapTotal: end.heapTotal - start.heapTotal,
      heapUsed: end.heapUsed - start.heapUsed,
      external: end.external - start.external,
      arrayBuffers: end.arrayBuffers - start.arrayBuffers,
    };
  }

  private analyzeResourceTrends(snapshots: ResourceUsage[]): {
    memoryTrend: 'increasing' | 'decreasing' | 'stable';
    cpuTrend: 'increasing' | 'decreasing' | 'stable';
    averageMemoryUsage: number;
    peakMemoryUsage: number;
  } {
    if (snapshots.length < 2) {
      return {
        memoryTrend: 'stable',
        cpuTrend: 'stable',
        averageMemoryUsage: 0,
        peakMemoryUsage: 0,
      };
    }

    const memoryUsages = snapshots.map(s => s.memory.heapUsed);
    const cpuUsages = snapshots.map(s => s.cpu.user + s.cpu.system);

    const averageMemoryUsage =
      memoryUsages.reduce((sum, usage) => sum + usage, 0) / memoryUsages.length;
    const peakMemoryUsage = Math.max(...memoryUsages);

    // Simple trend analysis using first and last values
    const memoryTrend = this.calculateTrend(memoryUsages);
    const cpuTrend = this.calculateTrend(cpuUsages);

    return {
      memoryTrend,
      cpuTrend,
      averageMemoryUsage,
      peakMemoryUsage,
    };
  }

  private calculateTrend(
    values: number[]
  ): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private generateRecommendations(
    bottlenecks: BottleneckAnalysis[],
    resourceTrends: any
  ): string[] {
    const recommendations: string[] = [];

    // Bottleneck recommendations
    const criticalBottlenecks = bottlenecks.filter(
      b => b.severity === 'critical'
    );
    if (criticalBottlenecks.length > 0) {
      recommendations.push(
        `Critical performance issues detected in: ${criticalBottlenecks.map(b => b.operation).join(', ')}`
      );
    }

    const highBottlenecks = bottlenecks.filter(b => b.severity === 'high');
    if (highBottlenecks.length > 0) {
      recommendations.push(
        `Consider optimizing: ${highBottlenecks.map(b => b.operation).join(', ')}`
      );
    }

    // Resource trend recommendations
    if (resourceTrends.memoryTrend === 'increasing') {
      recommendations.push(
        'Memory usage is increasing - check for memory leaks'
      );
    }

    if (resourceTrends.cpuTrend === 'increasing') {
      recommendations.push(
        'CPU usage is increasing - consider optimizing compute-intensive operations'
      );
    }

    // Database-specific recommendations
    const dbBottlenecks = bottlenecks.filter(
      b => b.operation.includes('database') || b.operation.includes('query')
    );
    if (dbBottlenecks.length > 0) {
      recommendations.push(
        'Database operations are slow - consider adding indexes or optimizing queries'
      );
    }

    // Cache-specific recommendations
    const cacheBottlenecks = bottlenecks.filter(
      b => b.operation.includes('cache') || b.operation.includes('redis')
    );
    if (cacheBottlenecks.length > 0) {
      recommendations.push(
        'Cache operations are slow - check Redis connection and network latency'
      );
    }

    return recommendations;
  }
}

export const performanceProfiler = new PerformanceProfilerService();
export { PerformanceProfilerService };
