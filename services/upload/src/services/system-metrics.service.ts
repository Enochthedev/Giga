import os from 'os';
import { createLogger } from '../lib/logger';

const logger = createLogger('SystemMetricsCollector');

interface SystemMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
  };
  disk: {
    // Will be implemented when needed
  };
  uptime: number;
  timestamp: number;
}

class SystemMetricsCollector {
  private intervalId: NodeJS.Timeout | null = null;
  private metrics: SystemMetrics[] = [];
  private maxMetricsHistory = 100; // Keep last 100 metrics

  /**
   * Start collecting system metrics
   */
  start(intervalMs: number = 30000): void {
    if (this.intervalId) {
      logger.warn('System metrics collection already started');
      return;
    }

    logger.info('Starting system metrics collection', { intervalMs });

    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    // Collect initial metrics
    this.collectMetrics();
  }

  /**
   * Stop collecting system metrics
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('System metrics collection stopped');
    }
  }

  /**
   * Collect current system metrics
   */
  private collectMetrics(): void {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;

      const metrics: SystemMetrics = {
        cpu: {
          usage: this.getCpuUsage(),
          loadAverage: os.loadavg(),
        },
        memory: {
          total: totalMem,
          free: freeMem,
          used: usedMem,
          usagePercent: (usedMem / totalMem) * 100,
        },
        disk: {
          // TODO: Implement disk metrics when needed
        },
        uptime: os.uptime(),
        timestamp: Date.now(),
      };

      // Add to history
      this.metrics.push(metrics);

      // Keep only recent metrics
      if (this.metrics.length > this.maxMetricsHistory) {
        this.metrics.shift();
      }

      // Log warnings for high resource usage
      this.checkResourceThresholds(metrics);
    } catch (error) {
      logger.error('Failed to collect system metrics', error);
    }
  }

  /**
   * Get CPU usage percentage (simplified)
   */
  private getCpuUsage(): number {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~((100 * idle) / total);

    return usage;
  }

  /**
   * Check resource usage thresholds and log warnings
   */
  private checkResourceThresholds(metrics: SystemMetrics): void {
    // Memory usage warning
    if (metrics.memory.usagePercent > 85) {
      logger.warn('High memory usage detected', {
        usagePercent: metrics.memory.usagePercent.toFixed(2),
        used: `${(metrics.memory.used / 1024 / 1024 / 1024).toFixed(2)}GB`,
        total: `${(metrics.memory.total / 1024 / 1024 / 1024).toFixed(2)}GB`,
      });
    }

    // CPU usage warning
    if (metrics.cpu.usage > 80) {
      logger.warn('High CPU usage detected', {
        usage: `${metrics.cpu.usage}%`,
        loadAverage: metrics.cpu.loadAverage,
      });
    }

    // Load average warning (for Unix systems)
    const cpuCount = os.cpus().length;
    if (metrics.cpu.loadAverage[0] > cpuCount * 1.5) {
      logger.warn('High system load detected', {
        loadAverage: metrics.cpu.loadAverage,
        cpuCount,
      });
    }
  }

  /**
   * Get current system metrics
   */
  getCurrentMetrics(): SystemMetrics | null {
    return this.metrics.length > 0
      ? this.metrics[this.metrics.length - 1]
      : null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit?: number): SystemMetrics[] {
    if (limit) {
      return this.metrics.slice(-limit);
    }
    return [...this.metrics];
  }

  /**
   * Get system info
   */
  getSystemInfo(): {
    platform: string;
    arch: string;
    cpus: number;
    totalMemory: string;
    hostname: string;
    nodeVersion: string;
  } {
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`,
      hostname: os.hostname(),
      nodeVersion: process.version,
    };
  }
}

// Export singleton instance
export const systemMetricsCollector = new SystemMetricsCollector();
export { SystemMetrics };
