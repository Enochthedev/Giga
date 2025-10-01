import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GatewayFailoverManager } from '../../services/gateway-failover-manager.service';
import { PaymentGateway } from '../../types/gateway.types';

describe('GatewayFailoverManager', () => {
  let failoverManager: GatewayFailoverManager;
  let mockGateway1: vi.Mocked<PaymentGateway>;
  let mockGateway2: vi.Mocked<PaymentGateway>;
  let mockGateway3: vi.Mocked<PaymentGateway>;
  let gatewayRegistry: Map<string, PaymentGateway>;

  beforeEach(() => {
    failoverManager = new GatewayFailoverManager();
    vi.useFakeTimers();

    // Create mock gateways
    mockGateway1 = {
      getId: vi.fn().mockReturnValue('gateway-1'),
      isActive: vi.fn().mockReturnValue(true),
      healthCheck: vi.fn().mockResolvedValue(true),
    } as any;

    mockGateway2 = {
      getId: vi.fn().mockReturnValue('gateway-2'),
      isActive: vi.fn().mockReturnValue(true),
      healthCheck: vi.fn().mockResolvedValue(true),
    } as any;

    mockGateway3 = {
      getId: vi.fn().mockReturnValue('gateway-3'),
      isActive: vi.fn().mockReturnValue(true),
      healthCheck: vi.fn().mockResolvedValue(true),
    } as any;

    // Set up gateway registry
    gatewayRegistry = new Map([
      ['gateway-1', mockGateway1],
      ['gateway-2', mockGateway2],
      ['gateway-3', mockGateway3],
    ]);

    failoverManager.setGatewayRegistry(gatewayRegistry);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Failover Chain Management', () => {
    it('should set failover chain', () => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2', 'gateway-3']);

      const chain = failoverManager.getFailoverChain('gateway-1');
      expect(chain).toEqual(['gateway-2', 'gateway-3']);
    });

    it('should get empty chain for gateway without failover', () => {
      const chain = failoverManager.getFailoverChain('gateway-1');
      expect(chain).toEqual([]);
    });

    it('should initialize circuit breakers when setting failover chain', () => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2', 'gateway-3']);

      // All gateways should have circuit breaker states
      expect(failoverManager.getCircuitBreakerState('gateway-1')).toBeDefined();
      expect(failoverManager.getCircuitBreakerState('gateway-2')).toBeDefined();
      expect(failoverManager.getCircuitBreakerState('gateway-3')).toBeDefined();
    });
  });

  describe('Failover Execution', () => {
    beforeEach(() => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2', 'gateway-3']);
      failoverManager.enableFailover('gateway-1');
    });

    it('should execute successful failover to first available gateway', async () => {
      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBe(mockGateway2);
      expect(mockGateway2.healthCheck).toHaveBeenCalled();
    });

    it('should try next gateway if first fallback fails health check', async () => {
      mockGateway2.healthCheck.mockResolvedValue(false);

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBe(mockGateway3);
      expect(mockGateway2.healthCheck).toHaveBeenCalled();
      expect(mockGateway3.healthCheck).toHaveBeenCalled();
    });

    it('should skip inactive gateways', async () => {
      mockGateway2.isActive.mockReturnValue(false);

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBe(mockGateway3);
      expect(mockGateway2.healthCheck).not.toHaveBeenCalled();
      expect(mockGateway3.healthCheck).toHaveBeenCalled();
    });

    it('should skip gateways with open circuit breakers', async () => {
      failoverManager.openCircuit('gateway-2');

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBe(mockGateway3);
      expect(mockGateway2.healthCheck).not.toHaveBeenCalled();
      expect(mockGateway3.healthCheck).toHaveBeenCalled();
    });

    it('should return null if no fallback gateways available', async () => {
      mockGateway2.isActive.mockReturnValue(false);
      mockGateway3.healthCheck.mockResolvedValue(false);

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBeNull();
    });

    it('should return null if failover is not enabled', async () => {
      failoverManager.disableFailover('gateway-1');

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBeNull();
    });

    it('should return null if no failover chain configured', async () => {
      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-4',
        context
      );

      expect(fallbackGateway).toBeNull();
    });

    it('should handle gateway not found in registry', async () => {
      failoverManager.setFailoverChain('gateway-1', [
        'gateway-2',
        'non-existent',
      ]);

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBe(mockGateway2);
    });
  });

  describe('Circuit Breaker Management', () => {
    beforeEach(() => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2']);
    });

    it('should check if circuit is open', () => {
      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(false);

      failoverManager.openCircuit('gateway-1');
      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(true);
    });

    it('should open circuit breaker', () => {
      failoverManager.openCircuit('gateway-1');

      const state = failoverManager.getCircuitBreakerState('gateway-1');
      expect(state?.isOpen).toBe(true);
      expect(state?.lastFailureTime).toBeDefined();
      expect(state?.nextRetryTime).toBeDefined();
    });

    it('should close circuit breaker', () => {
      failoverManager.openCircuit('gateway-1');
      failoverManager.closeCircuit('gateway-1');

      const state = failoverManager.getCircuitBreakerState('gateway-1');
      expect(state?.isOpen).toBe(false);
      expect(state?.failureCount).toBe(0);
      expect(state?.lastFailureTime).toBeUndefined();
      expect(state?.nextRetryTime).toBeUndefined();
    });

    it('should automatically close circuit after recovery timeout', () => {
      failoverManager.openCircuit('gateway-1');
      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(true);

      // Fast-forward time past recovery timeout (1 minute)
      vi.advanceTimersByTime(61000);

      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(false);
    });

    it('should reset circuit breaker', () => {
      failoverManager.openCircuit('gateway-1');
      const state = failoverManager.getCircuitBreakerState('gateway-1');
      if (state) {
        state.failureCount = 5;
      }

      failoverManager.resetCircuitBreaker('gateway-1');

      const resetState = failoverManager.getCircuitBreakerState('gateway-1');
      expect(resetState?.isOpen).toBe(false);
      expect(resetState?.failureCount).toBe(0);
    });

    it('should get all circuit breaker states', () => {
      failoverManager.openCircuit('gateway-1');
      failoverManager.closeCircuit('gateway-2');

      const allStates = failoverManager.getAllCircuitBreakerStates();

      expect(Object.keys(allStates)).toContain('gateway-1');
      expect(Object.keys(allStates)).toContain('gateway-2');
      expect(allStates['gateway-1'].isOpen).toBe(true);
      expect(allStates['gateway-2'].isOpen).toBe(false);
    });
  });

  describe('Failover Enable/Disable', () => {
    it('should enable failover for gateway', () => {
      failoverManager.enableFailover('gateway-1');
      expect(failoverManager.isFailoverEnabled('gateway-1')).toBe(true);
    });

    it('should disable failover for gateway', () => {
      failoverManager.enableFailover('gateway-1');
      failoverManager.disableFailover('gateway-1');
      expect(failoverManager.isFailoverEnabled('gateway-1')).toBe(false);
    });

    it('should check failover status', () => {
      expect(failoverManager.isFailoverEnabled('gateway-1')).toBe(false);

      failoverManager.enableFailover('gateway-1');
      expect(failoverManager.isFailoverEnabled('gateway-1')).toBe(true);
    });
  });

  describe('Gateway Recovery', () => {
    beforeEach(() => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2']);
    });

    it('should attempt successful recovery', async () => {
      mockGateway1.healthCheck.mockResolvedValue(true);

      const recovered = await failoverManager.attemptRecovery('gateway-1');

      expect(recovered).toBe(true);
      expect(mockGateway1.healthCheck).toHaveBeenCalled();

      // Circuit should be closed after successful recovery
      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(false);
    });

    it('should handle failed recovery', async () => {
      mockGateway1.healthCheck.mockResolvedValue(false);

      const recovered = await failoverManager.attemptRecovery('gateway-1');

      expect(recovered).toBe(false);
      expect(mockGateway1.healthCheck).toHaveBeenCalled();
    });

    it('should handle recovery for non-existent gateway', async () => {
      const recovered = await failoverManager.attemptRecovery('non-existent');

      expect(recovered).toBe(false);
    });

    it('should schedule recovery check', async () => {
      const attemptRecoverySpy = vi
        .spyOn(failoverManager, 'attemptRecovery')
        .mockResolvedValue(true);

      failoverManager.scheduleRecoveryCheck('gateway-1', 1000);

      // Fast-forward time to trigger recovery check
      await vi.advanceTimersByTimeAsync(1100);

      expect(attemptRecoverySpy).toHaveBeenCalledWith('gateway-1');
    });
  });

  describe('Failure and Success Notifications', () => {
    beforeEach(() => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2']);
    });

    it('should record failure and increment failure count', async () => {
      const error = new Error('Test failure');

      await failoverManager.notifyFailure('gateway-1', error);

      const state = failoverManager.getCircuitBreakerState('gateway-1');
      expect(state?.failureCount).toBe(1);
      expect(state?.lastFailureTime).toBeDefined();
    });

    it('should open circuit after failure threshold', async () => {
      const error = new Error('Test failure');

      // Record failures up to threshold (5)
      for (let i = 0; i < 5; i++) {
        await failoverManager.notifyFailure('gateway-1', error);
      }

      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(true);
    });

    it('should record success and reset failure count', async () => {
      const error = new Error('Test failure');

      // Record some failures first
      await failoverManager.notifyFailure('gateway-1', error);
      await failoverManager.notifyFailure('gateway-1', error);

      let state = failoverManager.getCircuitBreakerState('gateway-1');
      expect(state?.failureCount).toBe(2);

      // Record success
      await failoverManager.notifySuccess('gateway-1');

      state = failoverManager.getCircuitBreakerState('gateway-1');
      expect(state?.failureCount).toBe(0);
    });

    it('should close circuit on success if it was open', async () => {
      failoverManager.openCircuit('gateway-1');
      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(true);

      await failoverManager.notifySuccess('gateway-1');

      expect(failoverManager.isCircuitOpen('gateway-1')).toBe(false);
    });

    it('should handle notifications for unknown gateway', async () => {
      const error = new Error('Test failure');

      // Should not throw errors
      await expect(
        failoverManager.notifyFailure('unknown', error)
      ).resolves.toBeUndefined();
      await expect(
        failoverManager.notifySuccess('unknown')
      ).resolves.toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      failoverManager.setFailoverChain('gateway-1', ['gateway-2']);
      failoverManager.enableFailover('gateway-1');
    });

    it('should handle health check errors during failover', async () => {
      mockGateway2.healthCheck.mockRejectedValue(
        new Error('Health check failed')
      );

      const error = new Error('Gateway failure');
      const context = { error };

      const fallbackGateway = await failoverManager.executeFailover(
        'gateway-1',
        context
      );

      expect(fallbackGateway).toBeNull();
    });

    it('should handle recovery errors gracefully', async () => {
      mockGateway1.healthCheck.mockRejectedValue(new Error('Recovery failed'));

      const recovered = await failoverManager.attemptRecovery('gateway-1');

      expect(recovered).toBe(false);
    });

    it('should handle errors in scheduled recovery check', async () => {
      vi.spyOn(failoverManager, 'attemptRecovery').mockRejectedValue(
        new Error('Recovery error')
      );

      // Should not throw
      failoverManager.scheduleRecoveryCheck('gateway-1', 100);
      await vi.advanceTimersByTimeAsync(200);
    });
  });
});
