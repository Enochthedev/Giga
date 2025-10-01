import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Decimal } from '../../lib/decimal';
import { GatewayMetricsCollector } from '../../services/gateway-metrics-collector.service';

describe('GatewayMetricsCollector', () => {
  let metricsCollector: GatewayMetricsCollector;

  beforeEach(() => {
    metricsCollector = new GatewayMetricsCollector();
    vi.useFakeTimers();
  });

  afterEach(() => {
    metricsCollector.destroy();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Transaction Recording', () => {
    it('should record successful transaction', () => {
      metricsCollector.recordTransaction('test-gateway', true, 200, 100);

      const history = metricsCollector.getMetricsHistory('test-gateway', 1);
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        gatewayId: 'test-gateway',
        success: true,
        responseTime: 200,
        amount: 100,
      });
    });

    it('should record failed transaction', () => {
      metricsCollector.recordTransaction('test-gateway', false, 500, 100);

      const history = metricsCollector.getMetricsHistory('test-gateway', 1);
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        gatewayId: 'test-gateway',
        success: false,
        responseTime: 500,
        amount: 100,
      });
    });

    it('should record multiple transactions', () => {
      metricsCollector.recordTransaction('test-gateway', true, 200, 100);
      metricsCollector.recordTransaction('test-gateway', false, 500, 50);
      metricsCollector.recordTransaction('test-gateway', true, 150, 200);

      const history = metricsCollector.getMetricsHistory('test-gateway');
      expect(history).toHaveLength(3);
    });

    it('should maintain buffer size limit', () => {
      const bufferSize = (metricsCollector as unknown).bufferSize;

      // Record more transactions than buffer size
      for (let i = 0; i < bufferSize + 100; i++) {
        metricsCollector.recordTransaction('test-gateway', true, 200, 100);
      }

      const history = metricsCollector.getMetricsHistory('test-gateway');
      expect(history.length).toBeLessThanOrEqual(bufferSize);
    });
  });

  describe('Error Recording', () => {
    it('should record error with type and message', () => {
      metricsCollector.recordError(
        'test-gateway',
        'TimeoutError',
        'Request timeout'
      );

      const history = metricsCollector.getMetricsHistory('test-gateway', 1);
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        gatewayId: 'test-gateway',
        success: false,
        errorType: 'TimeoutError',
        errorMessage: 'Request timeout',
      });
    });

    it('should record multiple error types', () => {
      metricsCollector.recordError(
        'test-gateway',
        'TimeoutError',
        'Request timeout'
      );
      metricsCollector.recordError(
        'test-gateway',
        'AuthError',
        'Invalid credentials'
      );
      metricsCollector.recordError(
        'test-gateway',
        'TimeoutError',
        'Another timeout'
      );

      const history = metricsCollector.getMetricsHistory('test-gateway');
      expect(history).toHaveLength(3);

      const errorTypes = history.map(h => h.errorType);
      expect(errorTypes).toContain('TimeoutError');
      expect(errorTypes).toContain('AuthError');
    });
  });

  describe('Metrics Calculation', () => {
    beforeEach(() => {
      // Record sample data
      metricsCollector.recordTransaction('test-gateway', true, 100, 50);
      metricsCollector.recordTransaction('test-gateway', true, 200, 100);
      metricsCollector.recordTransaction('test-gateway', false, 500, 75);
      metricsCollector.recordTransaction('test-gateway', true, 150, 200);
      metricsCollector.recordError('test-gateway', 'TimeoutError', 'Timeout');
    });

    it('should calculate metrics correctly', async () => {
      const metrics = await metricsCollector.getMetrics('test-gateway');

      expect(metrics.gatewayId).toBe('test-gateway');
      expect(metrics.transactionCount).toBe(5); // 4 transactions + 1 error
      expect(metrics.successRate).toBe(0.6); // 3 successful out of 5 total
      expect(metrics.errorRate).toBe(0.4); // 2 failed out of 5 total
      expect(metrics.responseTime).toBe(150); // Average of successful transactions: (100+200+150)/3
      expect(metrics.transactionVolume.toNumber()).toBe(425); // 50+100+75+200 (includes error amounts)
    });

    it('should calculate status counts', async () => {
      const metrics = await metricsCollector.getMetrics('test-gateway');

      expect(metrics.statusCounts.success).toBe(3);
      expect(metrics.statusCounts.error).toBe(2);
    });

    it('should calculate error types', async () => {
      const metrics = await metricsCollector.getMetrics('test-gateway');

      expect(metrics.errorTypes.TimeoutError).toBe(1);
    });

    it('should handle empty data gracefully', async () => {
      const metrics = await metricsCollector.getMetrics('empty-gateway');

      expect(metrics.gatewayId).toBe('empty-gateway');
      expect(metrics.transactionCount).toBe(0);
      expect(metrics.successRate).toBe(0);
      expect(metrics.errorRate).toBe(0);
      expect(metrics.responseTime).toBe(0);
      expect(metrics.transactionVolume.toNumber()).toBe(0);
    });

    it('should filter metrics by time period', async () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      const period = { start: oneHourAgo, end: now };
      const metrics = await metricsCollector.getMetrics('test-gateway', period);

      // All our test data should be within the period
      expect(metrics.transactionCount).toBe(5);
    });
  });

  describe('Aggregated Metrics', () => {
    beforeEach(() => {
      // Record data for multiple gateways
      metricsCollector.recordTransaction('gateway-1', true, 100, 50);
      metricsCollector.recordTransaction('gateway-1', false, 200, 100);
      metricsCollector.recordTransaction('gateway-2', true, 150, 75);
      metricsCollector.recordTransaction('gateway-2', true, 300, 200);
    });

    it('should get aggregated metrics for all gateways', async () => {
      const aggregated = await metricsCollector.getAggregatedMetrics();

      expect(Object.keys(aggregated)).toContain('gateway-1');
      expect(Object.keys(aggregated)).toContain('gateway-2');

      expect(aggregated['gateway-1'].transactionCount).toBe(2);
      expect(aggregated['gateway-2'].transactionCount).toBe(2);
    });

    it('should filter aggregated metrics by period', async () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const period = { start: oneHourAgo, end: now };

      const aggregated = await metricsCollector.getAggregatedMetrics(period);

      expect(Object.keys(aggregated)).toHaveLength(2);
    });
  });

  describe('Latest Metrics', () => {
    it('should return cached latest metrics', async () => {
      // Record some data
      metricsCollector.recordTransaction('test-gateway', true, 100, 50);

      // Manually set cached metrics
      const cachedMetrics = {
        gatewayId: 'test-gateway',
        timestamp: new Date(),
        responseTime: 100,
        successRate: 1.0,
        errorRate: 0.0,
        transactionCount: 1,
        transactionVolume: new Decimal(50),
        statusCounts: { success: 1, error: 0 },
        errorTypes: {},
      };

      await metricsCollector.recordMetrics('test-gateway', cachedMetrics);

      const latest = await metricsCollector.getLatestMetrics('test-gateway');
      expect(latest).toEqual(cachedMetrics);
    });

    it('should calculate latest metrics from recent data if no cache', async () => {
      metricsCollector.recordTransaction('test-gateway', true, 100, 50);
      metricsCollector.recordTransaction('test-gateway', false, 200, 100);

      const latest = await metricsCollector.getLatestMetrics('test-gateway');

      expect(latest).toBeDefined();
      expect(latest?.gatewayId).toBe('test-gateway');
      expect(latest?.transactionCount).toBe(2);
    });

    it('should return null for gateway with no data', async () => {
      const latest = await metricsCollector.getLatestMetrics('empty-gateway');
      expect(latest).toBeNull();
    });
  });

  describe('Manual Metrics Recording', () => {
    it('should record partial metrics', async () => {
      const partialMetrics = {
        responseTime: 150,
        successRate: 0.95,
      };

      await metricsCollector.recordMetrics('test-gateway', partialMetrics);

      const latest = await metricsCollector.getLatestMetrics('test-gateway');
      expect(latest?.responseTime).toBe(150);
      expect(latest?.successRate).toBe(0.95);
      expect(latest?.gatewayId).toBe('test-gateway');
    });

    it('should update existing metrics', async () => {
      // Record initial metrics
      await metricsCollector.recordMetrics('test-gateway', {
        responseTime: 100,
        successRate: 0.9,
      });

      // Update with new metrics
      await metricsCollector.recordMetrics('test-gateway', {
        responseTime: 200,
        errorRate: 0.05,
      });

      const latest = await metricsCollector.getLatestMetrics('test-gateway');
      expect(latest?.responseTime).toBe(200);
      expect(latest?.successRate).toBe(0.9); // Should retain previous value
      expect(latest?.errorRate).toBe(0.05);
    });
  });

  describe('Metrics History', () => {
    beforeEach(() => {
      for (let i = 0; i < 10; i++) {
        metricsCollector.recordTransaction(
          'test-gateway',
          i % 2 === 0,
          100 + i * 10,
          50 + i * 5
        );
      }
    });

    it('should get limited history', () => {
      const history = metricsCollector.getMetricsHistory('test-gateway', 5);
      expect(history).toHaveLength(5);
    });

    it('should get full history by default', () => {
      const history = metricsCollector.getMetricsHistory('test-gateway');
      expect(history).toHaveLength(10);
    });

    it('should return empty array for unknown gateway', () => {
      const history = metricsCollector.getMetricsHistory('unknown-gateway');
      expect(history).toHaveLength(0);
    });
  });

  describe('Metrics Clearing', () => {
    beforeEach(() => {
      metricsCollector.recordTransaction('gateway-1', true, 100, 50);
      metricsCollector.recordTransaction('gateway-2', true, 200, 100);
    });

    it('should clear metrics for specific gateway', () => {
      metricsCollector.clearMetrics('gateway-1');

      expect(metricsCollector.getMetricsHistory('gateway-1')).toHaveLength(0);
      expect(metricsCollector.getMetricsHistory('gateway-2')).toHaveLength(1);
    });

    it('should clear all metrics', () => {
      metricsCollector.clearMetrics();

      expect(metricsCollector.getMetricsHistory('gateway-1')).toHaveLength(0);
      expect(metricsCollector.getMetricsHistory('gateway-2')).toHaveLength(0);
    });
  });

  describe('Automatic Aggregation', () => {
    it('should perform periodic aggregation', async () => {
      // Record some data
      metricsCollector.recordTransaction('test-gateway', true, 100, 50);
      metricsCollector.recordTransaction('test-gateway', false, 200, 100);

      // Fast-forward time to trigger aggregation
      await vi.advanceTimersByTimeAsync(61000); // Just over 1 minute

      const latest = await metricsCollector.getLatestMetrics('test-gateway');
      expect(latest).toBeDefined();
      expect(latest?.transactionCount).toBeGreaterThan(0);
    });
  });

  describe('Lifecycle Management', () => {
    it('should destroy collector and clear resources', () => {
      metricsCollector.recordTransaction('test-gateway', true, 100, 50);

      metricsCollector.destroy();

      expect(metricsCollector.getMetricsHistory('test-gateway')).toHaveLength(
        0
      );
    });
  });
});
