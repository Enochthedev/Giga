import { IGatewayFailoverManager } from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { PaymentGateway } from '../types/gateway.types';

interface FailoverChain {
  primary: string;
  fallbacks: string[];
}

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime?: Date | undefined;
  nextRetryTime?: Date | undefined;
}

export class GatewayFailoverManager implements IGatewayFailoverManager {
  private failoverChains: Map<string, string[]> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private gatewayRegistry: Map<string, PaymentGateway> = new Map();
  private failoverEnabled: Set<string> = new Set();

  // Circuit breaker configuration
  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 60000; // 1 minute
  private readonly halfOpenRetryDelay = 30000; // 30 seconds

  setGatewayRegistry(gateways: Map<string, PaymentGateway>): void {
    this.gatewayRegistry = gateways;
  }

  setFailoverChain(primary: string, fallbacks: string[]): void {
    logger.info('Setting failover chain', { primary, fallbacks });
    this.failoverChains.set(primary, fallbacks);

    // Initialize circuit breaker for primary gateway
    if (!this.circuitBreakers.has(primary)) {
      this.circuitBreakers.set(primary, {
        isOpen: false,
        failureCount: 0,
      });
    }

    // Initialize circuit breakers for fallback gateways
    fallbacks.forEach(gatewayId => {
      if (!this.circuitBreakers.has(gatewayId)) {
        this.circuitBreakers.set(gatewayId, {
          isOpen: false,
          failureCount: 0,
        });
      }
    });
  }

  getFailoverChain(gatewayId: string): string[] {
    return this.failoverChains.get(gatewayId) || [];
  }

  async executeFailover(
    failedGatewayId: string,
    context: any
  ): Promise<PaymentGateway | null> {
    try {
      logger.info('Executing failover', { failedGatewayId, context });

      // Check if failover is enabled for this gateway
      if (!this.failoverEnabled.has(failedGatewayId)) {
        logger.warn('Failover not enabled for gateway', {
          gatewayId: failedGatewayId,
        });
        return null;
      }

      // Record failure and potentially open circuit breaker
      await this.recordFailure(failedGatewayId, context.error);

      // Get failover chain
      const fallbacks = this.getFailoverChain(failedGatewayId);
      if (fallbacks.length === 0) {
        logger.warn('No fallback gateways configured', { failedGatewayId });
        return null;
      }

      // Try each fallback gateway
      for (const fallbackId of fallbacks) {
        const fallbackGateway = this.gatewayRegistry.get(fallbackId);
        if (!fallbackGateway) {
          logger.warn('Fallback gateway not found in registry', { fallbackId });
          continue;
        }

        // Check if fallback gateway is available
        if (this.isCircuitOpen(fallbackId)) {
          logger.warn('Fallback gateway circuit is open', { fallbackId });
          continue;
        }

        // Check if gateway is active
        if (!fallbackGateway.isActive()) {
          logger.warn('Fallback gateway is not active', { fallbackId });
          continue;
        }

        // Test gateway health before using it
        try {
          const isHealthy = await fallbackGateway.healthCheck();
          if (!isHealthy) {
            logger.warn('Fallback gateway health check failed', { fallbackId });
            continue;
          }

          logger.info('Failover successful', {
            failedGateway: failedGatewayId,
            fallbackGateway: fallbackId,
          });

          return fallbackGateway;
        } catch (error) {
          logger.warn('Fallback gateway health check error', {
            fallbackId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          continue;
        }
      }

      logger.error('All fallback gateways unavailable', {
        failedGatewayId,
        fallbacks,
      });
      return null;
    } catch (error) {
      logger.error('Error during failover execution', {
        failedGatewayId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  isCircuitOpen(gatewayId: string): boolean {
    const state = this.circuitBreakers.get(gatewayId);
    if (!state) {
      return false;
    }

    // Check if circuit should be closed due to recovery timeout
    if (
      state.isOpen &&
      state.nextRetryTime &&
      new Date() >= state.nextRetryTime
    ) {
      logger.info('Circuit breaker entering half-open state', { gatewayId });
      state.isOpen = false;
      state.nextRetryTime = undefined;
      return false;
    }

    return state.isOpen;
  }

  openCircuit(gatewayId: string): void {
    const state = this.circuitBreakers.get(gatewayId);
    if (!state) {
      logger.warn('Cannot open circuit for unknown gateway', { gatewayId });
      return;
    }

    state.isOpen = true;
    state.lastFailureTime = new Date();
    state.nextRetryTime = new Date(Date.now() + this.recoveryTimeout);

    logger.warn('Circuit breaker opened', {
      gatewayId,
      failureCount: state.failureCount,
      nextRetryTime: state.nextRetryTime,
    });
  }

  closeCircuit(gatewayId: string): void {
    const state = this.circuitBreakers.get(gatewayId);
    if (!state) {
      logger.warn('Cannot close circuit for unknown gateway', { gatewayId });
      return;
    }

    state.isOpen = false;
    state.failureCount = 0;
    state.lastFailureTime = undefined;
    state.nextRetryTime = undefined;

    logger.info('Circuit breaker closed', { gatewayId });
  }

  async attemptRecovery(gatewayId: string): Promise<boolean> {
    try {
      logger.info('Attempting gateway recovery', { gatewayId });

      const gateway = this.gatewayRegistry.get(gatewayId);
      if (!gateway) {
        logger.warn('Gateway not found for recovery attempt', { gatewayId });
        return false;
      }

      // Perform health check
      const isHealthy = await gateway.healthCheck();
      if (isHealthy) {
        this.closeCircuit(gatewayId);
        logger.info('Gateway recovery successful', { gatewayId });
        return true;
      } else {
        logger.warn('Gateway recovery failed - health check failed', {
          gatewayId,
        });
        return false;
      }
    } catch (error) {
      logger.error('Error during gateway recovery attempt', {
        gatewayId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  scheduleRecoveryCheck(gatewayId: string, delay: number): void {
    logger.info('Scheduling recovery check', { gatewayId, delay });

    setTimeout(async () => {
      try {
        await this.attemptRecovery(gatewayId);
      } catch (error) {
        logger.error('Error in scheduled recovery check', {
          gatewayId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }, delay);
  }

  enableFailover(gatewayId: string): void {
    this.failoverEnabled.add(gatewayId);
    logger.info('Failover enabled for gateway', { gatewayId });
  }

  disableFailover(gatewayId: string): void {
    this.failoverEnabled.delete(gatewayId);
    logger.info('Failover disabled for gateway', { gatewayId });
  }

  isFailoverEnabled(gatewayId: string): boolean {
    return this.failoverEnabled.has(gatewayId);
  }

  getCircuitBreakerState(gatewayId: string): CircuitBreakerState | undefined {
    return this.circuitBreakers.get(gatewayId);
  }

  getAllCircuitBreakerStates(): Record<string, CircuitBreakerState> {
    const states: Record<string, CircuitBreakerState> = {};
    for (const [gatewayId, state] of this.circuitBreakers) {
      states[gatewayId] = { ...state };
    }
    return states;
  }

  resetCircuitBreaker(gatewayId: string): void {
    const state = this.circuitBreakers.get(gatewayId);
    if (state) {
      state.isOpen = false;
      state.failureCount = 0;
      state.lastFailureTime = undefined;
      state.nextRetryTime = undefined;
      logger.info('Circuit breaker reset', { gatewayId });
    }
  }

  private async recordFailure(gatewayId: string, error: Error): Promise<void> {
    const state = this.circuitBreakers.get(gatewayId);
    if (!state) {
      logger.warn('Cannot record failure for unknown gateway', { gatewayId });
      return;
    }

    state.failureCount++;
    state.lastFailureTime = new Date();

    logger.warn('Gateway failure recorded', {
      gatewayId,
      failureCount: state.failureCount,
      error: error.message,
    });

    // Open circuit breaker if failure threshold is reached
    if (state.failureCount >= this.failureThreshold && !state.isOpen) {
      this.openCircuit(gatewayId);
    }
  }

  private async recordSuccess(gatewayId: string): Promise<void> {
    const state = this.circuitBreakers.get(gatewayId);
    if (!state) {
      return;
    }

    // Reset failure count on successful operation
    if (state.failureCount > 0) {
      state.failureCount = 0;
      logger.info('Gateway failure count reset after success', { gatewayId });
    }

    // Close circuit breaker if it was open
    if (state.isOpen) {
      this.closeCircuit(gatewayId);
    }
  }

  // Method to be called when a gateway operation succeeds
  async notifySuccess(gatewayId: string): Promise<void> {
    await this.recordSuccess(gatewayId);
  }

  // Method to be called when a gateway operation fails
  async notifyFailure(gatewayId: string, error: Error): Promise<void> {
    await this.recordFailure(gatewayId, error);
  }
}
