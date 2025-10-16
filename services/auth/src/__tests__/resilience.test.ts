import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CircuitBreaker,
  CircuitState,
} from '../services/circuit-breaker.service';
import { RetryService } from '../services/retry.service';

describe('Resilience Services', () => {
  describe('CircuitBreaker', () => {
    it('should start in CLOSED state', () => {
      const breaker = new CircuitBreaker({
        name: 'test-breaker',
        failureThreshold: 3,
        recoveryTimeout: 1000,
        monitoringPeriod: 5000,
      });

      expect(breaker.isClosed()).toBe(true);
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('should trip to OPEN after failure threshold', async () => {
      const breaker = new CircuitBreaker({
        name: 'test-breaker',
        failureThreshold: 2,
        recoveryTimeout: 1000,
        monitoringPeriod: 5000,
      });

      const failingOperation = async () => {
        throw new Error('Test failure');
      };

      // First failure
      await expect(breaker.execute(failingOperation)).rejects.toThrow(
        'Test failure'
      );
      expect(breaker.isClosed()).toBe(true);

      // Second failure - should trip
      await expect(breaker.execute(failingOperation)).rejects.toThrow(
        'Test failure'
      );
      expect(breaker.isOpen()).toBe(true);
    });

    it('should reject requests when OPEN', async () => {
      const breaker = new CircuitBreaker({
        name: 'test-breaker',
        failureThreshold: 1,
        recoveryTimeout: 1000,
        monitoringPeriod: 5000,
      });

      // Trip the breaker
      await expect(
        breaker.execute(async () => {
          throw new Error('Test failure');
        })
      ).rejects.toThrow('Test failure');

      // Should now reject requests
      await expect(breaker.execute(async () => 'success')).rejects.toThrow(
        'Circuit breaker test-breaker is OPEN'
      );
    });
  });

  describe('RetryService', () => {
    let retryService: RetryService;

    beforeEach(() => {
      retryService = RetryService.getInstance();
      retryService.clearStats();
    });

    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await retryService.executeWithRetry(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });
});
