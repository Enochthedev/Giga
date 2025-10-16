import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GatewayHealthMonitor } from '../../services/gateway-health-monitor.service';

describe('GatewayHealthMonitor', () => {
  let healthMonitor: GatewayHealthMonitor;

  beforeEach(() => {
    healthMonitor = new GatewayHealthMonitor();
    vi.useFakeTimers();
  });

  afterEach(() => {
    healthMonitor.stopMonitoring();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Gateway Management', () => {
    it('should add gateway for monitoring', () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);

      const status = healthMonitor.getHealthStatus('test-gateway');
      expect(status).toBeDefined();
      expect(status?.gatewayId).toBe('test-gateway');
      expect(status?.status).toBe('inactive');
      expect(status?.consecutiveFailures).toBe(0);
    });

    it('should remove gateway from monitoring', () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);
      expect(healthMonitor.getHealthStatus('test-gateway')).toBeDefined();

      healthMonitor.removeGateway('test-gateway');
      expect(healthMonitor.getHealthStatus('test-gateway')).toBeUndefined();
    });

    it('should get all health statuses', () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('gateway-1', config);
      healthMonitor.addGateway('gateway-2', config);

      const allStatuses = healthMonitor.getAllHealthStatuses();
      expect(allStatuses).toHaveLength(2);
      expect(allStatuses.map(s => s.gatewayId)).toContain('gateway-1');
      expect(allStatuses.map(s => s.gatewayId)).toContain('gateway-2');
    });
  });

  describe('Health Checking', () => {
    beforeEach(() => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };
      healthMonitor.addGateway('test-gateway', config);
    });

    it('should perform successful health check', async () => {
      // Mock successful health check
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockResolvedValue(
        true
      );

      const status = await healthMonitor.checkHealth('test-gateway');

      expect(status.gatewayId).toBe('test-gateway');
      expect(status.status).toBe('active');
      expect(status.consecutiveFailures).toBe(0);
      expect(status.responseTime).toBeGreaterThanOrEqual(0);
      expect(status.errorMessage).toBeUndefined();
    });

    it('should handle failed health check', async () => {
      // Mock failed health check
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockRejectedValue(
        new Error('Health check failed')
      );

      const status = await healthMonitor.checkHealth('test-gateway');

      expect(status.gatewayId).toBe('test-gateway');
      expect(status.status).toBe('error');
      expect(status.consecutiveFailures).toBe(1);
      expect(status.errorMessage).toBe('Health check failed');
    });

    it('should increment consecutive failures on repeated failures', async () => {
      // Mock failed health check
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockRejectedValue(
        new Error('Health check failed')
      );

      // First failure
      await healthMonitor.checkHealth('test-gateway');
      let status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.consecutiveFailures).toBe(1);

      // Second failure
      await healthMonitor.checkHealth('test-gateway');
      status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.consecutiveFailures).toBe(2);
    });

    it('should reset consecutive failures on success after failure', async () => {
      const performHealthCheckSpy = vi.spyOn(
        healthMonitor as any,
        'performHealthCheck'
      );

      // First failure
      performHealthCheckSpy.mockRejectedValueOnce(
        new Error('Health check failed')
      );
      await healthMonitor.checkHealth('test-gateway');
      let status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.consecutiveFailures).toBe(1);

      // Then success
      performHealthCheckSpy.mockResolvedValueOnce(true);
      await healthMonitor.checkHealth('test-gateway');
      status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.consecutiveFailures).toBe(0);
      expect(status?.status).toBe('active');
    });

    it('should handle health check for unknown gateway', async () => {
      const status = await healthMonitor.checkHealth('unknown-gateway');

      expect(status.gatewayId).toBe('unknown-gateway');
      expect(status.status).toBe('error');
      expect(status.errorMessage).toContain(
        'No health check configuration found'
      );
    });
  });

  describe('Monitoring Lifecycle', () => {
    it('should start monitoring and perform periodic health checks', async () => {
      const config = {
        interval: 1000, // 1 second for testing
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);

      // Mock health check
      const performHealthCheckSpy = vi
        .spyOn(healthMonitor as any, 'performHealthCheck')
        .mockResolvedValue(true);

      healthMonitor.startMonitoring();

      // Fast-forward time to trigger health check
      await vi.advanceTimersByTimeAsync(1100);

      expect(performHealthCheckSpy).toHaveBeenCalled();
    });

    it('should stop monitoring and clear intervals', () => {
      const config = {
        interval: 1000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);
      healthMonitor.startMonitoring();

      // Verify monitoring is active
      expect((healthMonitor as any).isMonitoring).toBe(true);

      healthMonitor.stopMonitoring();

      // Verify monitoring is stopped
      expect((healthMonitor as any).isMonitoring).toBe(false);
    });

    it('should not start monitoring if already running', () => {
      healthMonitor.startMonitoring();
      expect((healthMonitor as any).isMonitoring).toBe(true);

      // Try to start again
      healthMonitor.startMonitoring();
      expect((healthMonitor as any).isMonitoring).toBe(true);
    });

    it('should not stop monitoring if not running', () => {
      expect((healthMonitor as any).isMonitoring).toBe(false);

      healthMonitor.stopMonitoring();
      expect((healthMonitor as any).isMonitoring).toBe(false);
    });
  });

  describe('Health Change Callbacks', () => {
    it('should notify callbacks on health status change', async () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);

      const callback = vi.fn();
      healthMonitor.onHealthChange(callback);

      // Mock health check failure
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockRejectedValue(
        new Error('Health check failed')
      );

      await healthMonitor.checkHealth('test-gateway');

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          gatewayId: 'test-gateway',
          status: 'error',
        })
      );
    });

    it('should not notify callbacks if status unchanged', async () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);

      const callback = vi.fn();
      healthMonitor.onHealthChange(callback);

      // Mock successful health check
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockResolvedValue(
        true
      );

      // First check (status changes from inactive to active)
      await healthMonitor.checkHealth('test-gateway');
      expect(callback).toHaveBeenCalledTimes(1);

      // Second check (status remains active)
      await healthMonitor.checkHealth('test-gateway');
      expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should handle callback errors gracefully', async () => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };

      healthMonitor.addGateway('test-gateway', config);

      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      healthMonitor.onHealthChange(faultyCallback);

      // Mock health check
      vi.spyOn(healthMonitor as any, 'performHealthCheck').mockResolvedValue(
        true
      );

      // Should not throw despite callback error
      await expect(
        healthMonitor.checkHealth('test-gateway')
      ).resolves.toBeDefined();
    });
  });

  describe('Manual Status Recording', () => {
    beforeEach(() => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };
      healthMonitor.addGateway('test-gateway', config);
    });

    it('should record failure manually', async () => {
      const error = new Error('Manual failure');
      await healthMonitor.recordFailure('test-gateway', error);

      const status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.status).toBe('error');
      expect(status?.errorMessage).toBe('Manual failure');
      expect(status?.consecutiveFailures).toBe(1);
    });

    it('should record success manually', async () => {
      // First record a failure
      await healthMonitor.recordFailure(
        'test-gateway',
        new Error('Test error')
      );
      let status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.status).toBe('error');

      // Then record success
      await healthMonitor.recordSuccess('test-gateway', 200);
      status = healthMonitor.getHealthStatus('test-gateway');
      expect(status?.status).toBe('active');
      expect(status?.responseTime).toBe(200);
      expect(status?.consecutiveFailures).toBe(0);
      expect(status?.errorMessage).toBeUndefined();
    });

    it('should handle recording for unknown gateway', async () => {
      await healthMonitor.recordFailure('unknown-gateway', new Error('Test'));
      await healthMonitor.recordSuccess('unknown-gateway', 200);

      // Should not throw errors, just log warnings
      expect(healthMonitor.getHealthStatus('unknown-gateway')).toBeUndefined();
    });
  });

  describe('Health Check Retry Logic', () => {
    beforeEach(() => {
      const config = {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      };
      healthMonitor.addGateway('test-gateway', config);
    });

    it('should retry failed health checks', async () => {
      // Add a gateway with URL to trigger the retry logic
      healthMonitor.addGateway('test-gateway-with-url', {
        url: 'https://api.test.com/health',
        interval: 60000,
        timeout: 5000,
        retries: 3,
      });

      const simulateHealthCheckSpy = vi
        .spyOn(healthMonitor as any, 'simulateHealthCheck')
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce(true); // Success on third attempt

      const status = await healthMonitor.checkHealth('test-gateway-with-url');

      expect(simulateHealthCheckSpy).toHaveBeenCalledTimes(3);
      expect(status.status).toBe('active');
    });

    it('should fail after all retries exhausted', async () => {
      // Add a gateway with URL to trigger the retry logic
      healthMonitor.addGateway('test-gateway-with-url', {
        url: 'https://api.test.com/health',
        interval: 60000,
        timeout: 5000,
        retries: 3,
      });

      const simulateHealthCheckSpy = vi
        .spyOn(healthMonitor as any, 'simulateHealthCheck')
        .mockRejectedValue(new Error('Persistent failure'));

      const status = await healthMonitor.checkHealth('test-gateway-with-url');

      expect(simulateHealthCheckSpy).toHaveBeenCalledTimes(3); // Original + 2 retries
      expect(status.status).toBe('error');
      expect(status.errorMessage).toBe('Persistent failure');
    });
  });
});
