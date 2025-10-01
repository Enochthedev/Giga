import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';

interface ConcurrencyLimitConfig {
  maxConcurrent: number;
  queueTimeout: number;
  keyGenerator: (req: Request) => string;
}

class ConcurrencyLimiter {
  private activeRequests = new Map<string, number>();
  private requestQueues = new Map<string, Array<() => void>>();

  constructor(private config: ConcurrencyLimitConfig) { }

  async middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const key = this.config.keyGenerator(req);
    const currentActive = this.activeRequests.get(key) || 0;

    if (currentActive >= this.config.maxConcurrent) {
      // Queue the request
      await this.queueRequest(key, req, res);
    }

    // Increment active count
    this.activeRequests.set(key, currentActive + 1);

    // Set up cleanup on response finish
    const cleanup = () => {
      const active = this.activeRequests.get(key) || 0;
      this.activeRequests.set(key, Math.max(0, active - 1));

      // Process next queued request
      this.processNextInQueue(key);
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);

    next();
  }

  private async queueRequest(key: string, req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Concurrency limit queue timeout'));
      }, this.config.queueTimeout);

      const resolver = () => {
        clearTimeout(timeout);
        resolve();
      };

      if (!this.requestQueues.has(key)) {
        this.requestQueues.set(key, []);
      }

      this.requestQueues.get(key)!.push(resolver);

      logger.debug('Request queued due to concurrency limit', {
        key,
        queueLength: this.requestQueues.get(key)!.length,
        activeRequests: this.activeRequests.get(key) || 0,
      });
    });
  }

  private processNextInQueue(key: string): void {
    const queue = this.requestQueues.get(key);
    if (queue && queue.length > 0) {
      const nextResolver = queue.shift();
      if (nextResolver) {
        nextResolver();
      }
    }
  }
}

// Global concurrency limiter
export const globalConcurrencyLimiter = new ConcurrencyLimiter({
  maxConcurrent: 100, // Max 100 concurrent requests globally
  queueTimeout: 30000, // 30 second timeout
  keyGenerator: () => 'global',
});

// Per-IP concurrency limiter
export const ipConcurrencyLimiter = new ConcurrencyLimiter({
  maxConcurrent: 5, // Max 5 concurrent requests per IP
  queueTimeout: 15000, // 15 second timeout
  keyGenerator: (req) => req.ip || 'unknown',
});

// Per-user concurrency limiter
export const userConcurrencyLimiter = new ConcurrencyLimiter({
  maxConcurrent: 3, // Max 3 concurrent uploads per user
  queueTimeout: 20000, // 20 second timeout
  keyGenerator: (req) => req.user?.id || req.ip || 'unknown',
});

// Export middleware functions
export const globalConcurrencyLimit = globalConcurrencyLimiter.middleware.bind(globalConcurrencyLimiter);
export const ipConcurrencyLimit = ipConcurrencyLimiter.middleware.bind(ipConcurrencyLimiter);
export const userConcurrencyLimit = userConcurrencyLimiter.middleware.bind(userConcurrencyLimiter);