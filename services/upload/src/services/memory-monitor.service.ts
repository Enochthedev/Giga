import { logger } from '../lib/logger';

export class MemoryMonitorService {
  private memoryThreshold: number;
  private checkInterval: number;
  private isMonitoring = false;

  constructor() {
    this.memoryThreshold = parseInt(process.env.MEMORY_THRESHOLD || '80'); // 80%
    this.checkInterval = parseInt(process.env.MEMORY_CHECK_INTERVAL || '5000'); // 5 seconds
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    setInterval(() => {
      this.checkMemoryUsage();
    }, this.checkInterval);

    logger.info('Memory monitoring started', {
      threshold: `${this.memoryThreshold}%`,
      checkInterval: `${this.checkInterval}ms`,
    });
  }

  private checkMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const usedMemory = memUsage.heapUsed;
    const memoryPercent = (usedMemory / totalMemory) * 100;

    if (memoryPercent > this.memoryThreshold) {
      logger.warn('High memory usage detected', {
        usedMemoryMB: Math.round(usedMemory / 1024 / 1024),
        totalMemoryMB: Math.round(totalMemory / 1024 / 1024),
        usagePercent: Math.round(memoryPercent),
        threshold: this.memoryThreshold,
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      });

      // Trigger garbage collection if available
      if (global.gc) {
        global.gc();
        logger.info('Garbage collection triggered');
      }
    }
  }

  getMemoryStats() {
    const memUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const freeMemory = require('os').freemem();

    return {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memUsage.external / 1024 / 1024), // MB
      rss: Math.round(memUsage.rss / 1024 / 1024), // MB
      totalSystemMemory: Math.round(totalMemory / 1024 / 1024), // MB
      freeSystemMemory: Math.round(freeMemory / 1024 / 1024), // MB
      usagePercent: Math.round((memUsage.heapUsed / totalMemory) * 100),
      isHighUsage: (memUsage.heapUsed / totalMemory) * 100 > this.memoryThreshold,
    };
  }

  isMemoryAvailable(): boolean {
    const memUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const memoryPercent = (memUsage.heapUsed / totalMemory) * 100;

    return memoryPercent < this.memoryThreshold;
  }
}

export const memoryMonitor = new MemoryMonitorService();