import {
  GatewaySelectionCriteria,
  IGatewayManager,
} from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import {
  GatewayHealthStatus,
  GatewayMetrics,
  GatewaySelection,
  PaymentGateway,
} from '../types/gateway.types';
import { GatewayFailoverManager } from './gateway-failover-manager.service';
import { GatewayHealthMonitor } from './gateway-health-monitor.service';
import { GatewayMetricsCollector } from './gateway-metrics-collector.service';

export class GatewayManager implements IGatewayManager {
  private gateways: Map<string, PaymentGateway> = new Map();
  private healthMonitor: GatewayHealthMonitor;
  private metricsCollector: GatewayMetricsCollector;
  private failoverManager: GatewayFailoverManager;

  constructor() {
    this.healthMonitor = new GatewayHealthMonitor();
    this.metricsCollector = new GatewayMetricsCollector();
    this.failoverManager = new GatewayFailoverManager();
  }

  registerGateway(gateway: PaymentGateway): void {
    try {
      logger.info('Registering payment gateway', {
        gatewayId: gateway.getId(),
        type: gateway.getType(),
      });

      this.gateways.set(gateway.getId(), gateway);

      // Start health monitoring for the gateway
      this.healthMonitor.addGateway(
        gateway.getId(),
        gateway.getConfig().healthCheck
      );

      logger.info('Payment gateway registered successfully', {
        gatewayId: gateway.getId(),
      });
    } catch (error) {
      logger.error('Failed to register payment gateway', {
        error,
        gatewayId: gateway.getId(),
      });
      throw error;
    }
  }

  getGateway(gatewayId: string): PaymentGateway | undefined {
    return this.gateways.get(gatewayId);
  }

  getAllGateways(): PaymentGateway[] {
    return Array.from(this.gateways.values());
  }

  getActiveGateways(): PaymentGateway[] {
    return this.getAllGateways().filter(gateway => gateway.isActive());
  }

  async selectGateway(
    criteria: GatewaySelectionCriteria
  ): Promise<GatewaySelection> {
    try {
      logger.info('Selecting optimal gateway', { criteria });

      const eligibleGateways = await this.getEligibleGateways(criteria);

      if (eligibleGateways.length === 0) {
        throw new Error(
          'No eligible payment gateways available for the given criteria'
        );
      }

      // Score gateways based on multiple factors
      const scoredGateways = await Promise.all(
        eligibleGateways.map(async gateway => ({
          gateway,
          score: await this.calculateGatewayScore(gateway, criteria),
        }))
      );

      // Sort by score (highest first)
      scoredGateways.sort((a, b) => b.score - a.score);

      const primary = scoredGateways[0].gateway.getId();
      const fallbacks = scoredGateways
        .slice(1, 4)
        .map(sg => sg.gateway.getId());

      const selection: GatewaySelection = {
        primary,
        fallbacks,
        reason: `Selected based on score: ${scoredGateways[0].score.toFixed(2)}`,
        metadata: {
          scores: scoredGateways.map(sg => ({
            gatewayId: sg.gateway.getId(),
            score: sg.score,
          })),
        },
      };

      logger.info('Gateway selection completed', { selection });
      return selection;
    } catch (error) {
      logger.error('Failed to select gateway', { error, criteria });
      throw error;
    }
  }

  async selectBestGateway(
    amount: number,
    currency: string
  ): Promise<PaymentGateway> {
    const criteria: GatewaySelectionCriteria = {
      amount,
      currency,
    };

    const selection = await this.selectGateway(criteria);
    const gateway = this.getGateway(selection.primary);

    if (!gateway) {
      throw new Error(`Selected gateway ${selection.primary} not found`);
    }

    return gateway;
  }

  async checkGatewayHealth(gatewayId: string): Promise<GatewayHealthStatus> {
    return this.healthMonitor.checkHealth(gatewayId);
  }

  async checkAllGatewaysHealth(): Promise<GatewayHealthStatus[]> {
    const gateways = this.getAllGateways();
    const healthChecks = await Promise.all(
      gateways.map(gateway => this.checkGatewayHealth(gateway.getId()))
    );
    return healthChecks;
  }

  async recordMetrics(
    gatewayId: string,
    metrics: Partial<GatewayMetrics>
  ): Promise<void> {
    await this.metricsCollector.recordMetrics(gatewayId, metrics);
  }

  async getGatewayMetrics(
    gatewayId: string,
    period?: { start: Date; end: Date }
  ): Promise<GatewayMetrics[]> {
    return this.metricsCollector.getMetrics(gatewayId, period);
  }

  async handleGatewayFailure(
    gatewayId: string,
    error: Error
  ): Promise<PaymentGateway | null> {
    try {
      logger.warn('Handling gateway failure', {
        gatewayId,
        error: error.message,
      });

      // Record the failure
      await this.metricsCollector.recordError(
        gatewayId,
        error.constructor.name,
        error.message
      );

      // Update health status
      await this.healthMonitor.recordFailure(gatewayId, error);

      // Attempt failover
      const fallbackGateway = await this.failoverManager.executeFailover(
        gatewayId,
        { error }
      );

      if (fallbackGateway) {
        logger.info('Failover successful', {
          failedGateway: gatewayId,
          fallbackGateway: fallbackGateway.getId(),
        });
      } else {
        logger.error('No fallback gateway available', {
          failedGateway: gatewayId,
        });
      }

      return fallbackGateway;
    } catch (failoverError) {
      logger.error('Failed to handle gateway failure', {
        gatewayId,
        originalError: error.message,
        failoverError,
      });
      throw failoverError;
    }
  }

  async enableFailover(gatewayId: string): Promise<void> {
    const gateway = this.getGateway(gatewayId);
    if (!gateway) {
      throw new Error(`Gateway ${gatewayId} not found`);
    }

    // Enable failover for this gateway
    this.failoverManager.enableFailover(gatewayId);

    logger.info('Failover enabled for gateway', { gatewayId });
  }

  async disableFailover(gatewayId: string): Promise<void> {
    const gateway = this.getGateway(gatewayId);
    if (!gateway) {
      throw new Error(`Gateway ${gatewayId} not found`);
    }

    // Disable failover for this gateway
    this.failoverManager.disableFailover(gatewayId);

    logger.info('Failover disabled for gateway', { gatewayId });
  }

  private async getEligibleGateways(
    criteria: GatewaySelectionCriteria
  ): Promise<PaymentGateway[]> {
    const activeGateways = this.getActiveGateways();

    return activeGateways.filter(gateway => {
      const config = gateway.getConfig();

      // Check currency support
      if (!gateway.supportsCurrency(criteria.currency)) {
        return false;
      }

      // Check amount limits
      if (!gateway.supportsAmount(criteria.amount)) {
        return false;
      }

      // Check payment method type
      if (
        criteria.paymentMethodType &&
        !config.settings.supportedPaymentMethods.includes(
          criteria.paymentMethodType
        )
      ) {
        return false;
      }

      // Check country support
      if (
        criteria.country &&
        !config.settings.supportedCountries.includes(criteria.country)
      ) {
        return false;
      }

      // Check preferred gateways
      if (
        criteria.preferredGateways &&
        !criteria.preferredGateways.includes(gateway.getId())
      ) {
        return false;
      }

      // Check excluded gateways
      if (
        criteria.excludeGateways &&
        criteria.excludeGateways.includes(gateway.getId())
      ) {
        return false;
      }

      // Check required features
      if (criteria.requireFeatures) {
        // This would check if gateway supports required features
        // For now, we'll assume all active gateways support basic features
      }

      return true;
    });
  }

  private async calculateGatewayScore(
    gateway: PaymentGateway,
    criteria: GatewaySelectionCriteria
  ): Promise<number> {
    let score = 100; // Base score

    try {
      // Health factor (40% weight)
      const health = await this.healthMonitor.getHealthStatus(gateway.getId());
      if (health) {
        const healthScore = this.calculateHealthScore(health);
        score *= 0.6 + 0.4 * healthScore; // 40% weight for health
      }

      // Performance metrics factor (30% weight)
      const metrics = await this.metricsCollector.getLatestMetrics(
        gateway.getId()
      );
      if (metrics) {
        const performanceScore = this.calculatePerformanceScore(metrics);
        score *= 0.7 + 0.3 * performanceScore; // 30% weight for performance
      }

      // Cost factor (20% weight)
      const costScore = this.calculateCostScore(gateway, criteria.amount);
      score *= 0.8 + 0.2 * costScore; // 20% weight for cost

      // Priority factor (10% weight)
      const priorityScore = gateway.getConfig().priority / 100; // Normalize to 0-1
      score *= 0.9 + 0.1 * priorityScore; // 10% weight for priority

      return Math.max(0, score);
    } catch (error) {
      logger.warn('Error calculating gateway score, using base score', {
        gatewayId: gateway.getId(),
        error: error.message,
      });
      return 50; // Return a low but non-zero score on error
    }
  }

  private calculateHealthScore(health: GatewayHealthStatus): number {
    if (health.status === 'active') return 1.0;
    if (health.status === 'maintenance') return 0.5;
    if (health.status === 'inactive') return 0.2;
    return 0.0; // error status
  }

  private calculatePerformanceScore(metrics: GatewayMetrics): number {
    // Combine success rate and response time
    const successRateScore = metrics.successRate;
    const responseTimeScore = Math.max(0, 1 - metrics.responseTime / 5000); // 5s max

    return successRateScore * 0.7 + responseTimeScore * 0.3;
  }

  private calculateCostScore(gateway: PaymentGateway, amount: number): number {
    const config = gateway.getConfig();
    const processingFee = config.settings.processingFee;

    if (!processingFee) return 1.0; // No fee information, assume best

    let cost = 0;
    if (processingFee.type === 'fixed') {
      cost = processingFee.value;
    } else if (processingFee.type === 'percentage') {
      cost = amount * (processingFee.value / 100);
    }

    // Normalize cost score (lower cost = higher score)
    const maxReasonableCost = amount * 0.05; // 5% of transaction amount
    return Math.max(0, 1 - cost / maxReasonableCost);
  }
}
