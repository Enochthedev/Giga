import {
  GatewaySelectionCriteria,
  IGatewayHealthMonitor,
  IGatewayMetricsCollector,
} from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import {
  GatewayConfig,
  GatewaySelection,
  PaymentGateway,
} from '../types/gateway.types';

interface SelectionScore {
  gatewayId: string;
  gateway: PaymentGateway;
  totalScore: number;
  scores: {
    health: number;
    performance: number;
    cost: number;
    priority: number;
    geographic: number;
    compatibility: number;
  };
  reasons: string[];
}

/**
 * Advanced Gateway Selection Service
 * Implements intelligent gateway selection algorithms with multiple factors
 */
export class GatewaySelectionService {
  private healthMonitor: IGatewayHealthMonitor;
  private metricsCollector: IGatewayMetricsCollector;

  // Scoring weights (must sum to 1.0)
  private readonly weights = {
    health: 0.25, // 25% - Gateway health and availability
    performance: 0.2, // 20% - Success rate and response time
    cost: 0.2, // 20% - Processing fees and costs
    priority: 0.15, // 15% - Configured priority
    geographic: 0.1, // 10% - Geographic optimization
    compatibility: 0.1, // 10% - Payment method compatibility
  };

  constructor(
    healthMonitor: IGatewayHealthMonitor,
    metricsCollector: IGatewayMetricsCollector
  ) {
    this.healthMonitor = healthMonitor;
    this.metricsCollector = metricsCollector;
  }

  /**
   * Selects the optimal gateway based on multiple criteria
   */
  async selectOptimalGateway(
    eligibleGateways: PaymentGateway[],
    criteria: GatewaySelectionCriteria
  ): Promise<GatewaySelection> {
    try {
      logger.info('Selecting optimal gateway', {
        eligibleCount: eligibleGateways.length,
        criteria,
      });

      if (eligibleGateways.length === 0) {
        throw new Error('No eligible gateways available');
      }

      // Score all eligible gateways
      const scoredGateways = await Promise.all(
        eligibleGateways.map(gateway => this.scoreGateway(gateway, criteria))
      );

      // Sort by total score (highest first)
      scoredGateways.sort((a, b) => b.totalScore - a.totalScore);

      // Apply selection strategy
      const selection = this.applySelectionStrategy(scoredGateways, criteria);

      logger.info('Gateway selection completed', {
        primary: selection.primary,
        fallbackCount: selection.fallbacks.length,
        topScore: scoredGateways[0]?.totalScore,
      });

      return selection;
    } catch (error) {
      logger.error('Failed to select optimal gateway', { error, criteria });
      throw error;
    }
  }

  /**
   * Selects gateways using round-robin strategy for load balancing
   */
  async selectRoundRobin(
    eligibleGateways: PaymentGateway[],
    criteria: GatewaySelectionCriteria
  ): Promise<GatewaySelection> {
    try {
      logger.info('Selecting gateway using round-robin', {
        eligibleCount: eligibleGateways.length,
      });

      if (eligibleGateways.length === 0) {
        throw new Error('No eligible gateways available');
      }

      // Filter out unhealthy gateways
      const healthyGateways =
        await this.filterHealthyGateways(eligibleGateways);

      if (healthyGateways.length === 0) {
        throw new Error('No healthy gateways available');
      }

      // Simple round-robin based on current time
      const index = Math.floor(Date.now() / 1000) % healthyGateways.length;
      const primary = healthyGateways[index];
      const fallbacks = healthyGateways
        .filter(g => g.getId() !== primary.getId())
        .slice(0, 3)
        .map(g => g.getId());

      return {
        primary: primary.getId(),
        fallbacks,
        reason: 'Round-robin load balancing',
        metadata: {
          strategy: 'round_robin',
          index,
          healthyCount: healthyGateways.length,
        },
      };
    } catch (error) {
      logger.error('Failed to select gateway using round-robin', { error });
      throw error;
    }
  }

  /**
   * Selects gateways based on lowest cost
   */
  async selectLowestCost(
    eligibleGateways: PaymentGateway[],
    criteria: GatewaySelectionCriteria
  ): Promise<GatewaySelection> {
    try {
      logger.info('Selecting gateway with lowest cost', {
        eligibleCount: eligibleGateways.length,
        amount: criteria.amount,
      });

      const healthyGateways =
        await this.filterHealthyGateways(eligibleGateways);

      if (healthyGateways.length === 0) {
        throw new Error('No healthy gateways available');
      }

      // Calculate costs for each gateway
      const gatewaysCosts = healthyGateways.map(gateway => ({
        gateway,
        cost: this.calculateTransactionCost(gateway, criteria.amount),
      }));

      // Sort by cost (lowest first)
      gatewaysCosts.sort((a, b) => a.cost - b.cost);

      const primary = gatewaysCosts[0].gateway;
      const fallbacks = gatewaysCosts.slice(1, 4).map(gc => gc.gateway.getId());

      return {
        primary: primary.getId(),
        fallbacks,
        reason: `Lowest cost: $${gatewaysCosts[0].cost.toFixed(4)}`,
        metadata: {
          strategy: 'lowest_cost',
          costs: gatewaysCosts.map(gc => ({
            gatewayId: gc.gateway.getId(),
            cost: gc.cost,
          })),
        },
      };
    } catch (error) {
      logger.error('Failed to select gateway with lowest cost', { error });
      throw error;
    }
  }

  /**
   * Selects gateways based on highest success rate
   */
  async selectHighestSuccessRate(
    eligibleGateways: PaymentGateway[],
    criteria: GatewaySelectionCriteria
  ): Promise<GatewaySelection> {
    try {
      logger.info('Selecting gateway with highest success rate', {
        eligibleCount: eligibleGateways.length,
      });

      const healthyGateways =
        await this.filterHealthyGateways(eligibleGateways);

      if (healthyGateways.length === 0) {
        throw new Error('No healthy gateways available');
      }

      // Get success rates for each gateway
      const gatewaysWithRates = await Promise.all(
        healthyGateways.map(async gateway => {
          const metrics = await this.metricsCollector.getLatestMetrics(
            gateway.getId()
          );
          return {
            gateway,
            successRate: metrics?.successRate || 0,
          };
        })
      );

      // Sort by success rate (highest first)
      gatewaysWithRates.sort((a, b) => b.successRate - a.successRate);

      const primary = gatewaysWithRates[0].gateway;
      const fallbacks = gatewaysWithRates
        .slice(1, 4)
        .map(gwr => gwr.gateway.getId());

      return {
        primary: primary.getId(),
        fallbacks,
        reason: `Highest success rate: ${(gatewaysWithRates[0].successRate * 100).toFixed(2)}%`,
        metadata: {
          strategy: 'highest_success_rate',
          successRates: gatewaysWithRates.map(gwr => ({
            gatewayId: gwr.gateway.getId(),
            successRate: gwr.successRate,
          })),
        },
      };
    } catch (error) {
      logger.error('Failed to select gateway with highest success rate', {
        error,
      });
      throw error;
    }
  }

  /**
   * Scores a gateway based on multiple factors
   */
  private async scoreGateway(
    gateway: PaymentGateway,
    criteria: GatewaySelectionCriteria
  ): Promise<SelectionScore> {
    const gatewayId = gateway.getId();
    const config = gateway.getConfig();
    const reasons: string[] = [];

    // Health Score (0-1)
    const healthScore = await this.calculateHealthScore(gateway, reasons);

    // Performance Score (0-1)
    const performanceScore = await this.calculatePerformanceScore(
      gateway,
      reasons
    );

    // Cost Score (0-1, higher is better/cheaper)
    const costScore = this.calculateCostScore(
      gateway,
      criteria.amount,
      reasons
    );

    // Priority Score (0-1)
    const priorityScore = this.calculatePriorityScore(config, reasons);

    // Geographic Score (0-1)
    const geographicScore = this.calculateGeographicScore(
      gateway,
      criteria.country,
      reasons
    );

    // Compatibility Score (0-1)
    const compatibilityScore = this.calculateCompatibilityScore(
      gateway,
      criteria,
      reasons
    );

    // Calculate weighted total score
    const totalScore =
      healthScore * this.weights.health +
      performanceScore * this.weights.performance +
      costScore * this.weights.cost +
      priorityScore * this.weights.priority +
      geographicScore * this.weights.geographic +
      compatibilityScore * this.weights.compatibility;

    return {
      gatewayId,
      gateway,
      totalScore,
      scores: {
        health: healthScore,
        performance: performanceScore,
        cost: costScore,
        priority: priorityScore,
        geographic: geographicScore,
        compatibility: compatibilityScore,
      },
      reasons,
    };
  }

  private async calculateHealthScore(
    gateway: PaymentGateway,
    reasons: string[]
  ): Promise<number> {
    try {
      const healthStatus = this.healthMonitor.getHealthStatus(gateway.getId());

      if (!healthStatus) {
        reasons.push('No health data available');
        return 0.5; // Neutral score when no data
      }

      let score = 0;

      switch (healthStatus.status) {
        case 'ACTIVE':
          score = 1.0;
          reasons.push('Gateway is healthy');
          break;
        case 'MAINTENANCE':
          score = 0.3;
          reasons.push('Gateway in maintenance mode');
          break;
        case 'INACTIVE':
          score = 0.1;
          reasons.push('Gateway is inactive');
          break;
        case 'ERROR':
          score = 0.0;
          reasons.push('Gateway has errors');
          break;
        default:
          score = 0.5;
      }

      // Penalize for consecutive failures
      if (healthStatus.consecutiveFailures > 0) {
        const penalty = Math.min(healthStatus.consecutiveFailures * 0.1, 0.5);
        score = Math.max(0, score - penalty);
        reasons.push(
          `${healthStatus.consecutiveFailures} consecutive failures`
        );
      }

      return score;
    } catch (error) {
      logger.warn('Error calculating health score', {
        gatewayId: gateway.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      reasons.push('Health check error');
      return 0.2; // Low score on error
    }
  }

  private async calculatePerformanceScore(
    gateway: PaymentGateway,
    reasons: string[]
  ): Promise<number> {
    try {
      const metrics = await this.metricsCollector.getLatestMetrics(
        gateway.getId()
      );

      if (!metrics) {
        reasons.push('No performance metrics available');
        return 0.5; // Neutral score when no data
      }

      // Success rate component (0-1)
      const successRateScore = metrics.successRate;

      // Response time component (0-1, lower is better)
      const maxAcceptableResponseTime = 5000; // 5 seconds
      const responseTimeScore = Math.max(
        0,
        1 - metrics.responseTime / maxAcceptableResponseTime
      );

      // Combine scores (70% success rate, 30% response time)
      const score = successRateScore * 0.7 + responseTimeScore * 0.3;

      reasons.push(
        `Success rate: ${(successRateScore * 100).toFixed(1)}%, ` +
          `Response time: ${metrics.responseTime}ms`
      );

      return score;
    } catch (error) {
      logger.warn('Error calculating performance score', {
        gatewayId: gateway.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      reasons.push('Performance metrics error');
      return 0.3; // Low score on error
    }
  }

  private calculateCostScore(
    gateway: PaymentGateway,
    amount: number,
    reasons: string[]
  ): number {
    try {
      const cost = this.calculateTransactionCost(gateway, amount);

      // Normalize cost score (lower cost = higher score)
      const maxReasonableCost = amount * 0.05; // 5% of transaction amount
      const score = Math.max(0, 1 - cost / maxReasonableCost);

      reasons.push(`Transaction cost: $${cost.toFixed(4)}`);
      return score;
    } catch (error) {
      logger.warn('Error calculating cost score', {
        gatewayId: gateway.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      reasons.push('Cost calculation error');
      return 0.5; // Neutral score on error
    }
  }

  private calculatePriorityScore(
    config: GatewayConfig,
    reasons: string[]
  ): number {
    const score = config.priority / 100; // Normalize to 0-1
    reasons.push(`Priority: ${config.priority}`);
    return Math.max(0, Math.min(1, score));
  }

  private calculateGeographicScore(
    gateway: PaymentGateway,
    country?: string,
    reasons: string[] = []
  ): number {
    if (!country) {
      reasons.push('No country specified');
      return 0.5; // Neutral score when no country
    }

    const config = gateway.getConfig();
    const isSupported = config.settings.supportedCountries.includes(country);

    if (isSupported) {
      reasons.push(`Supports country: ${country}`);
      return 1.0;
    } else {
      reasons.push(`Does not support country: ${country}`);
      return 0.0;
    }
  }

  private calculateCompatibilityScore(
    gateway: PaymentGateway,
    criteria: GatewaySelectionCriteria,
    reasons: string[]
  ): number {
    const config = gateway.getConfig();
    let score = 1.0;
    let compatibilityFactors = 0;

    // Check currency support
    if (criteria.currency) {
      compatibilityFactors++;
      if (config.settings.supportedCurrencies.includes(criteria.currency)) {
        reasons.push(`Supports currency: ${criteria.currency}`);
      } else {
        score -= 0.5;
        reasons.push(`Does not support currency: ${criteria.currency}`);
      }
    }

    // Check payment method support
    if (criteria.paymentMethodType) {
      compatibilityFactors++;
      if (
        config.settings.supportedPaymentMethods.includes(
          criteria.paymentMethodType
        )
      ) {
        reasons.push(`Supports payment method: ${criteria.paymentMethodType}`);
      } else {
        score -= 0.5;
        reasons.push(
          `Does not support payment method: ${criteria.paymentMethodType}`
        );
      }
    }

    // Check amount limits
    compatibilityFactors++;
    if (gateway.supportsAmount(criteria.amount)) {
      reasons.push(`Supports amount: ${criteria.amount}`);
    } else {
      score -= 0.3;
      reasons.push(`Amount outside limits: ${criteria.amount}`);
    }

    return Math.max(0, score);
  }

  private calculateTransactionCost(
    gateway: PaymentGateway,
    amount: number
  ): number {
    const config = gateway.getConfig();
    const processingFee = config.settings.processingFee;

    if (!processingFee) {
      return 0; // No fee information available
    }

    if (processingFee.type === 'fixed') {
      return processingFee.value;
    } else if (processingFee.type === 'percentage') {
      return amount * (processingFee.value / 100);
    }

    return 0;
  }

  private async filterHealthyGateways(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway[]> {
    const healthyGateways: PaymentGateway[] = [];

    for (const gateway of gateways) {
      const healthStatus = this.healthMonitor.getHealthStatus(gateway.getId());
      if (healthStatus && healthStatus.status === 'ACTIVE') {
        healthyGateways.push(gateway);
      }
    }

    return healthyGateways;
  }

  private applySelectionStrategy(
    scoredGateways: SelectionScore[],
    criteria: GatewaySelectionCriteria
  ): GatewaySelection {
    if (scoredGateways.length === 0) {
      throw new Error('No scored gateways available');
    }

    // Apply preferred gateways if specified
    if (criteria.preferredGateways && criteria.preferredGateways.length > 0) {
      const preferredScored = scoredGateways.filter(sg =>
        criteria.preferredGateways!.includes(sg.gatewayId)
      );

      if (preferredScored.length > 0) {
        const primary = preferredScored[0];
        const fallbacks = scoredGateways
          .filter(sg => sg.gatewayId !== primary.gatewayId)
          .slice(0, 3)
          .map(sg => sg.gatewayId);

        return {
          primary: primary.gatewayId,
          fallbacks,
          reason: `Preferred gateway selected (score: ${primary.totalScore.toFixed(3)})`,
          metadata: {
            strategy: 'preferred',
            scores: scoredGateways.map(sg => ({
              gatewayId: sg.gatewayId,
              totalScore: sg.totalScore,
              breakdown: sg.scores,
              reasons: sg.reasons,
            })),
          },
        };
      }
    }

    // Default: select highest scoring gateway
    const primary = scoredGateways[0];
    const fallbacks = scoredGateways.slice(1, 4).map(sg => sg.gatewayId);

    return {
      primary: primary.gatewayId,
      fallbacks,
      reason: `Highest score: ${primary.totalScore.toFixed(3)}`,
      metadata: {
        strategy: 'optimal_score',
        scores: scoredGateways.map(sg => ({
          gatewayId: sg.gatewayId,
          totalScore: sg.totalScore,
          breakdown: sg.scores,
          reasons: sg.reasons,
        })),
      },
    };
  }
}
