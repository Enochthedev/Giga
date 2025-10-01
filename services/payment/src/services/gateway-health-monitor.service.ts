import { IGatewayHealthMonitor } from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { GatewayHealthStatus, GatewayStatus } from '../types/gateway.types';

interface HealthCheckConfig {
  url?: string;
  interval: number;
  timeout: number;
  retries: number;
}

export class GatewayHealthMonitor implements IGatewayHealthMonitor {
  private healthStatuses: Map<string, GatewayHealthStatus> = new Map();
  private healthCheckConfigs: Map<string, HealthCheckConfig> = new Map();
  private healthCheckIntervals: Map<string, NodeJS.Timeout> = new Map();
  private healthChangeCallbacks: Array<(status: GatewayHealthStatus) => void> =
    [];
  private isMonitoring = false;

  startMonitoring(): void {
    if (this.isMonitoring) {
      logger.warn('Health monitoring is already running');
      return;
    }

    logger.info('Starting gateway health monitoring');
    this.isMonitoring = true;

    // Start health checks for all registered gateways
    for (const [gatewayId, config] of this.healthCheckConfigs) {
      this.startHealthCheckForGateway(gatewayId, config);
    }
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      logger.warn('Health monitoring is not running');
      return;
    }

    logger.info('Stopping gateway health monitoring');
    this.isMonitoring = false;

    // Clear all health check intervals
    for (const [gatewayId, interval] of this.healthCheckIntervals) {
      clearInterval(interval);
      logger.debug('Stopped health check for gateway', { gatewayId });
    }

    this.healthCheckIntervals.clear();
  }

  addGateway(gatewayId: string, config: HealthCheckConfig): void {
    logger.info('Adding gateway to health monitoring', { gatewayId, config });

    this.healthCheckConfigs.set(gatewayId, config);

    // Initialize health status
    const initialStatus: GatewayHealthStatus = {
      gatewayId,
      status: 'inactive',
      lastCheck: new Date(),
      consecutiveFailures: 0,
    };
    this.healthStatuses.set(gatewayId, initialStatus);

    // Start health check if monitoring is active
    if (this.isMonitoring) {
      this.startHealthCheckForGateway(gatewayId, config);
    }
  }

  removeGateway(gatewayId: string): void {
    logger.info('Removing gateway from health monitoring', { gatewayId });

    // Stop health check
    const interval = this.healthCheckIntervals.get(gatewayId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(gatewayId);
    }

    // Remove from maps
    this.healthCheckConfigs.delete(gatewayId);
    this.healthStatuses.delete(gatewayId);
  }

  async checkHealth(gatewayId: string): Promise<GatewayHealthStatus> {
    try {
      logger.debug('Performing health check', { gatewayId });

      const config = this.healthCheckConfigs.get(gatewayId);
      if (!config) {
        throw new Error(
          `No health check configuration found for gateway ${gatewayId}`
        );
      }

      const startTime = Date.now();
      let status: GatewayStatus = 'active';
      let errorMessage: string | undefined;

      try {
        // Perform health check
        const isHealthy = await this.performHealthCheck(gatewayId, config);
        status = isHealthy ? 'active' : 'error';
      } catch (error) {
        status = 'error';
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.warn('Health check failed', { gatewayId, error: errorMessage });
      }

      const responseTime = Date.now() - startTime;
      const currentStatus = this.healthStatuses.get(gatewayId);
      const consecutiveFailures =
        status === 'error' ? (currentStatus?.consecutiveFailures || 0) + 1 : 0;

      const healthStatus: GatewayHealthStatus = {
        gatewayId,
        status,
        lastCheck: new Date(),
        responseTime,
        errorMessage,
        consecutiveFailures,
      };

      this.healthStatuses.set(gatewayId, healthStatus);

      // Notify callbacks if status changed
      if (currentStatus?.status !== status) {
        this.notifyHealthChange(healthStatus);
      }

      logger.debug('Health check completed', {
        gatewayId,
        status,
        responseTime,
      });
      return healthStatus;
    } catch (error) {
      logger.error('Failed to perform health check', { gatewayId, error });

      const errorStatus: GatewayHealthStatus = {
        gatewayId,
        status: 'error',
        lastCheck: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        consecutiveFailures:
          (this.healthStatuses.get(gatewayId)?.consecutiveFailures || 0) + 1,
      };

      this.healthStatuses.set(gatewayId, errorStatus);
      return errorStatus;
    }
  }

  getHealthStatus(gatewayId: string): GatewayHealthStatus | undefined {
    return this.healthStatuses.get(gatewayId);
  }

  getAllHealthStatuses(): GatewayHealthStatus[] {
    return Array.from(this.healthStatuses.values());
  }

  onHealthChange(callback: (status: GatewayHealthStatus) => void): void {
    this.healthChangeCallbacks.push(callback);
  }

  async recordFailure(gatewayId: string, error: Error): Promise<void> {
    const currentStatus = this.healthStatuses.get(gatewayId);
    if (!currentStatus) {
      logger.warn('Cannot record failure for unknown gateway', { gatewayId });
      return;
    }

    const updatedStatus: GatewayHealthStatus = {
      ...currentStatus,
      status: 'error',
      lastCheck: new Date(),
      errorMessage: error.message,
      consecutiveFailures: currentStatus.consecutiveFailures + 1,
    };

    this.healthStatuses.set(gatewayId, updatedStatus);
    this.notifyHealthChange(updatedStatus);

    logger.warn('Recorded gateway failure', {
      gatewayId,
      consecutiveFailures: updatedStatus.consecutiveFailures,
      error: error.message,
    });
  }

  async recordSuccess(gatewayId: string, responseTime: number): Promise<void> {
    const currentStatus = this.healthStatuses.get(gatewayId);
    if (!currentStatus) {
      logger.warn('Cannot record success for unknown gateway', { gatewayId });
      return;
    }

    const updatedStatus: GatewayHealthStatus = {
      ...currentStatus,
      status: 'active',
      lastCheck: new Date(),
      responseTime,
      errorMessage: undefined,
      consecutiveFailures: 0,
    };

    this.healthStatuses.set(gatewayId, updatedStatus);

    // Only notify if status changed from error to active
    if (currentStatus.status !== 'active') {
      this.notifyHealthChange(updatedStatus);
    }

    logger.debug('Recorded gateway success', { gatewayId, responseTime });
  }

  private startHealthCheckForGateway(
    gatewayId: string,
    config: HealthCheckConfig
  ): void {
    // Clear existing interval if any
    const existingInterval = this.healthCheckIntervals.get(gatewayId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new health check interval
    const interval = setInterval(async () => {
      try {
        await this.checkHealth(gatewayId);
      } catch (error) {
        logger.error('Error in scheduled health check', { gatewayId, error });
      }
    }, config.interval);

    this.healthCheckIntervals.set(gatewayId, interval);

    // Perform initial health check
    setImmediate(() => this.checkHealth(gatewayId));

    logger.debug('Started health check for gateway', {
      gatewayId,
      interval: config.interval,
    });
  }

  private async performHealthCheck(
    gatewayId: string,
    config: HealthCheckConfig
  ): Promise<boolean> {
    // If no URL is provided, assume the gateway is healthy
    // In a real implementation, this would call the gateway's health endpoint
    if (!config.url) {
      return true;
    }

    // Simulate health check with timeout and retries
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        // Simulate HTTP health check
        const isHealthy = await this.simulateHealthCheck(
          config.url,
          config.timeout
        );
        if (isHealthy) {
          return true;
        }
        lastError = new Error('Health check returned unhealthy status');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        logger.debug('Health check attempt failed', {
          gatewayId,
          attempt,
          error: lastError.message,
        });

        // Wait before retry (except for last attempt)
        if (attempt < config.retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError || new Error('All health check attempts failed');
  }

  private async simulateHealthCheck(
    url: string,
    timeout: number
  ): Promise<boolean> {
    // Simulate network call with timeout
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Health check timeout'));
      }, timeout);

      // Simulate random success/failure for demo purposes
      // In a real implementation, this would make an actual HTTP request
      setTimeout(() => {
        clearTimeout(timer);
        const isHealthy = Math.random() > 0.1; // 90% success rate
        resolve(isHealthy);
      }, Math.random() * 500); // Random delay up to 500ms
    });
  }

  private notifyHealthChange(status: GatewayHealthStatus): void {
    logger.info('Gateway health status changed', {
      gatewayId: status.gatewayId,
      status: status.status,
      consecutiveFailures: status.consecutiveFailures,
    });

    for (const callback of this.healthChangeCallbacks) {
      try {
        callback(status);
      } catch (error) {
        logger.error('Error in health change callback', { error });
      }
    }
  }
}
