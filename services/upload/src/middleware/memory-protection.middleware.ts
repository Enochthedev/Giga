import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { memoryMonitor } from '../services/memory-monitor.service';

/**
 * Memory protection middleware - blocks requests when memory is high
 */
export function memoryProtectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip memory check for non-upload endpoints
  if (!req.path.includes('/uploads') || req.method !== 'POST') {
    return next();
  }

  const memoryStats = memoryMonitor.getMemoryStats();

  if (!memoryMonitor.isMemoryAvailable()) {
    logger.warn('Upload blocked due to high memory usage', {
      memoryUsage: memoryStats.usagePercent,
      threshold: process.env.MEMORY_THRESHOLD || '80',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable due to high load',
      code: 'SERVICE_OVERLOADED',
      retryAfter: 30, // seconds
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Add memory stats to response headers for monitoring
  res.set({
    'X-Memory-Usage': `${memoryStats.usagePercent}%`,
    'X-Memory-Available': memoryMonitor.isMemoryAvailable().toString(),
  });

  next();
}