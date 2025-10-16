import { logger } from './logger.service';

export interface FeatureConfig {
  name: string;
  enabled: boolean;
  critical: boolean;
  fallbackBehavior?: 'disable' | 'mock' | 'cache' | 'default';
  fallbackHandler?: () => Promise<any> | any;
  healthCheck?: () => Promise<boolean>;
  dependencies?: string[];
}

export interface FeatureStatus {
  name: string;
  enabled: boolean;
  healthy: boolean;
  critical: boolean;
  lastCheck: Date;
  error?: string;
  degraded: boolean;
  fallbackActive: boolean;
}

export class GracefulDegradationService {
  private static instance: GracefulDegradationService;
  private features = new Map<string, FeatureConfig>();
  private featureStatus = new Map<string, FeatureStatus>();
  private healthCheckInterval?: NodeJS.Timeout;

  static getInstance(): GracefulDegradationService {
    if (!GracefulDegradationService.instance) {
      GracefulDegradationService.instance = new GracefulDegradationService();
    }
    return GracefulDegradationService.instance;
  }

  registerFeature(config: FeatureConfig): void {
    this.features.set(config.name, config);
    this.featureStatus.set(config.name, {
      name: config.name,
      enabled: config.enabled,
      healthy: true,
      critical: config.critical,
      lastCheck: new Date(),
      degraded: false,
      fallbackActive: false,
    });

    logger.info(`Feature registered: ${config.name}`, {
      enabled: config.enabled,
      critical: config.critical,
      hasFallback: !!config.fallbackHandler,
    });
  }

  async executeFeature<T>(
    featureName: string,
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T> {
    const feature = this.features.get(featureName);
    const status = this.featureStatus.get(featureName);

    if (!feature || !status) {
      throw new Error(`Feature ${featureName} not registered`);
    }

    // If feature is disabled, use fallback immediately
    if (!feature.enabled || !status.enabled) {
      return this.executeFallback(featureName, fallbackValue);
    }

    try {
      const result = await operation();

      // Update status on success
      this.updateFeatureStatus(featureName, {
        healthy: true,
        error: undefined,
        degraded: false,
        fallbackActive: false,
      });

      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;

      logger.warn(
        `Feature ${featureName} failed, attempting graceful degradation`,
        {
          errorMessage: errorMessage,
          critical: feature.critical,
          error: error as Error,
        }
      );

      // Update status on failure
      this.updateFeatureStatus(featureName, {
        healthy: false,
        error: errorMessage,
        degraded: true,
      });

      // If it's a critical feature, throw the error
      if (feature.critical) {
        throw error;
      }

      // For non-critical features, use fallback
      return this.executeFallback(featureName, fallbackValue);
    }
  }

  private async executeFallback<T>(
    featureName: string,
    fallbackValue?: T
  ): Promise<T> {
    const feature = this.features.get(featureName);

    if (!feature) {
      throw new Error(`Feature ${featureName} not found`);
    }

    this.updateFeatureStatus(featureName, { fallbackActive: true });

    logger.info(`Executing fallback for feature: ${featureName}`, {
      fallbackBehavior: feature.fallbackBehavior,
    });

    // Execute custom fallback handler if available
    if (feature.fallbackHandler) {
      try {
        return await feature.fallbackHandler();
      } catch (fallbackError) {
        logger.error(
          `Fallback handler failed for feature ${featureName}`,
          fallbackError as Error,
          {
            errorMessage: (fallbackError as Error).message,
          }
        );
      }
    }

    // Handle different fallback behaviors
    switch (feature.fallbackBehavior) {
      case 'mock':
        return this.getMockResponse(featureName, fallbackValue);

      case 'cache':
        return this.getCachedResponse(featureName, fallbackValue);

      case 'default':
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        return this.getDefaultResponse(featureName);

      case 'disable':
      default:
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        throw new Error(
          `Feature ${featureName} is unavailable and no fallback provided`
        );
    }
  }

  private getMockResponse<T>(featureName: string, fallbackValue?: T): T {
    // Return mock data based on feature type
    const mockResponses: Record<string, any> = {
      'email-notifications': {
        success: true,
        mock: true,
        message: 'Email notification mocked',
      },
      'sms-notifications': {
        success: true,
        mock: true,
        message: 'SMS notification mocked',
      },
      analytics: { success: true, mock: true, data: {} },
      logging: { success: true, mock: true },
      metrics: { success: true, mock: true, metrics: {} },
    };

    return (
      mockResponses[featureName] ||
      fallbackValue ||
      ({ success: true, mock: true } as T)
    );
  }

  private getCachedResponse<T>(featureName: string, fallbackValue?: T): T {
    // In a real implementation, this would fetch from cache
    logger.info(`Using cached response for feature: ${featureName}`);
    return fallbackValue || ({ success: true, cached: true } as T);
  }

  private getDefaultResponse<T>(featureName: string): T {
    const defaultResponses: Record<string, any> = {
      'email-notifications': {
        success: true,
        sent: false,
        reason: 'Service unavailable',
      },
      'sms-notifications': {
        success: true,
        sent: false,
        reason: 'Service unavailable',
      },
      analytics: { success: true, tracked: false },
      logging: { success: true, logged: false },
      metrics: { success: true, recorded: false },
    };

    return (
      defaultResponses[featureName] ||
      ({ success: false, reason: 'Feature unavailable' } as T)
    );
  }

  private updateFeatureStatus(
    featureName: string,
    updates: Partial<FeatureStatus>
  ): void {
    const status = this.featureStatus.get(featureName);
    if (status) {
      Object.assign(status, updates, { lastCheck: new Date() });
      this.featureStatus.set(featureName, status);
    }
  }

  enableFeature(featureName: string): void {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = true;
      this.updateFeatureStatus(featureName, { enabled: true });
      logger.info(`Feature enabled: ${featureName}`);
    }
  }

  disableFeature(featureName: string): void {
    const feature = this.features.get(featureName);
    if (feature) {
      feature.enabled = false;
      this.updateFeatureStatus(featureName, { enabled: false });
      logger.warn(`Feature disabled: ${featureName}`);
    }
  }

  async performHealthChecks(): Promise<Record<string, FeatureStatus>> {
    const results: Record<string, FeatureStatus> = {};

    for (const [name, feature] of this.features) {
      const status = this.featureStatus.get(name)!;

      if (feature.healthCheck) {
        try {
          const isHealthy = await feature.healthCheck();
          this.updateFeatureStatus(name, { healthy: isHealthy });
        } catch (error) {
          this.updateFeatureStatus(name, {
            healthy: false,
            error: (error as Error).message,
          });
        }
      }

      results[name] = this.featureStatus.get(name)!;
    }

    return results;
  }

  getFeatureStatus(
    featureName?: string
  ): FeatureStatus | Record<string, FeatureStatus> {
    if (featureName) {
      const status = this.featureStatus.get(featureName);
      if (!status) {
        throw new Error(`Feature ${featureName} not found`);
      }
      return status;
    }

    const allStatus: Record<string, FeatureStatus> = {};
    for (const [name, status] of this.featureStatus) {
      allStatus[name] = status;
    }
    return allStatus;
  }

  getDegradedFeatures(): string[] {
    return Array.from(this.featureStatus.entries())
      .filter(([, status]) => status.degraded)
      .map(([name]) => name);
  }

  getCriticalFeatures(): string[] {
    return Array.from(this.features.entries())
      .filter(([, feature]) => feature.critical)
      .map(([name]) => name);
  }

  getSystemHealth(): {
    overallHealth: 'healthy' | 'degraded' | 'critical';
    totalFeatures: number;
    healthyFeatures: number;
    degradedFeatures: number;
    criticalFeaturesFailed: number;
  } {
    const totalFeatures = this.features.size;
    let healthyFeatures = 0;
    let degradedFeatures = 0;
    let criticalFeaturesFailed = 0;

    for (const [name, status] of this.featureStatus) {
      const feature = this.features.get(name)!;

      if (status.healthy && status.enabled) {
        healthyFeatures++;
      } else if (status.degraded || !status.enabled) {
        degradedFeatures++;
        if (feature.critical) {
          criticalFeaturesFailed++;
        }
      }
    }

    let overallHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (criticalFeaturesFailed > 0) {
      overallHealth = 'critical';
    } else if (degradedFeatures > 0) {
      overallHealth = 'degraded';
    }

    return {
      overallHealth,
      totalFeatures,
      healthyFeatures,
      degradedFeatures,
      criticalFeaturesFailed,
    };
  }

  startHealthMonitoring(intervalMs = 60000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthChecks();
        const health = this.getSystemHealth();

        if (health.overallHealth !== 'healthy') {
          logger.warn('System health check completed', health);
        } else {
          logger.debug('System health check completed', health);
        }
      } catch (error) {
        logger.error('Health check failed', error as Error);
      }
    }, intervalMs);

    logger.info('Health monitoring started', { intervalMs });
  }

  stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
      logger.info('Health monitoring stopped');
    }
  }
}
