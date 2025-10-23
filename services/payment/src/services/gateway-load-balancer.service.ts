import {
  IGatewayHealthMonitor,
  IGatewayMetricsCollector,
} from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { PaymentGateway } from '../types/gateway.types';

export interface LoadBalancerStats {
  totalRequests: number;
  gatewayStats: Map<
    string,
    {
      requests: number;
      lastUsed: Date;
      weight: number;
      activeConnections: number;
    }
  >;
}

interface WeightedGateway {
  gateway: PaymentGateway;
  weight: number;
  currentLoad: number;
}

/**
 * Gateway Load Balancer Service
 * Implements various load balancing algorithms for payment gateways
 */
export class GatewayLoadBalancerService {
  private stats: LoadBalancerStats;
  private healthMonitor: IGatewayHealthMonitor;
  private metricsCollector: IGatewayMetricsCollector;
  private roundRobinIndex = 0;

  constructor(
    healthMonitor: IGatewayHealthMonitor,
    metricsCollector: IGatewayMetricsCollector
  ) {
    this.healthMonitor = healthMonitor;
    this.metricsCollector = metricsCollector;
    this.stats = {
      totalRequests: 0,
      gatewayStats: new Map(),
    };
  }

  /**
   * Round-robin load balancing
   */
  async selectRoundRobin(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const healthyGateways = await this.getHealthyGateways(gateways);

      if (healthyGateways.length === 0) {
        logger.warn('No healthy gateways available for round-robin selection');
        return null;
      }

      const selectedGateway =
        healthyGateways[this.roundRobinIndex % healthyGateways.length];
      this.roundRobinIndex =
        (this.roundRobinIndex + 1) % healthyGateways.length;

      this.recordSelection(selectedGateway.getId());

      logger.debug('Selected gateway using round-robin', {
        gatewayId: selectedGateway.getId(),
        index: this.roundRobinIndex - 1,
        totalHealthy: healthyGateways.length,
      });

      return selectedGateway;
    } catch (error) {
      logger.error('Error in round-robin selection', { error });
      return null;
    }
  }

  /**
   * Weighted round-robin load balancing based on gateway capacity and performance
   */
  async selectWeightedRoundRobin(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const weightedGateways = await this.calculateGatewayWeights(gateways);

      if (weightedGateways.length === 0) {
        logger.warn(
          'No healthy gateways available for weighted round-robin selection'
        );
        return null;
      }

      // Select gateway based on weights
      const selectedGateway = this.selectByWeight(weightedGateways);

      if (!selectedGateway) {
        return null;
      }

      this.recordSelection(selectedGateway.getId());

      logger.debug('Selected gateway using weighted round-robin', {
        gatewayId: selectedGateway.getId(),
        weight: weightedGateways.find(
          wg => wg.gateway.getId() === selectedGateway.getId()
        )?.weight,
      });

      return selectedGateway;
    } catch (error) {
      logger.error('Error in weighted round-robin selection', { error });
      return null;
    }
  }

  /**
   * Least connections load balancing
   */
  async selectLeastConnections(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const healthyGateways = await this.getHealthyGateways(gateways);

      if (healthyGateways.length === 0) {
        logger.warn(
          'No healthy gateways available for least connections selection'
        );
        return null;
      }

      // Find gateway with least active connections
      let selectedGateway = healthyGateways[0];
      let minConnections = this.getActiveConnections(selectedGateway.getId());

      for (const gateway of healthyGateways.slice(1)) {
        const connections = this.getActiveConnections(gateway.getId());
        if (connections < minConnections) {
          selectedGateway = gateway;
          minConnections = connections;
        }
      }

      this.recordSelection(selectedGateway.getId());
      this.incrementActiveConnections(selectedGateway.getId());

      logger.debug('Selected gateway using least connections', {
        gatewayId: selectedGateway.getId(),
        activeConnections: minConnections,
      });

      return selectedGateway;
    } catch (error) {
      logger.error('Error in least connections selection', { error });
      return null;
    }
  }

  /**
   * Least response time load balancing
   */
  async selectLeastResponseTime(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const healthyGateways = await this.getHealthyGateways(gateways);

      if (healthyGateways.length === 0) {
        logger.warn(
          'No healthy gateways available for least response time selection'
        );
        return null;
      }

      // Get response times for all gateways
      const gatewayResponseTimes = await Promise.all(
        healthyGateways.map(async gateway => {
          const metrics = await this.metricsCollector.getLatestMetrics(
            gateway.getId()
          );
          return {
            gateway,
            responseTime: metrics?.responseTime || Infinity,
          };
        })
      );

      // Select gateway with lowest response time
      const selectedEntry = gatewayResponseTimes.reduce((min, current) =>
        current.responseTime < min.responseTime ? current : min
      );

      this.recordSelection(selectedEntry.gateway.getId());

      logger.debug('Selected gateway using least response time', {
        gatewayId: selectedEntry.gateway.getId(),
        responseTime: selectedEntry.responseTime,
      });

      return selectedEntry.gateway;
    } catch (error) {
      logger.error('Error in least response time selection', { error });
      return null;
    }
  }

  /**
   * Resource-based load balancing (considers CPU, memory, etc.)
   */
  async selectResourceBased(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const healthyGateways = await this.getHealthyGateways(gateways);

      if (healthyGateways.length === 0) {
        logger.warn(
          'No healthy gateways available for resource-based selection'
        );
        return null;
      }

      // Calculate resource utilization scores
      const gatewayScores = await Promise.all(
        healthyGateways.map(async gateway => {
          const score = await this.calculateResourceScore(gateway);
          return { gateway, score };
        })
      );

      // Select gateway with best (lowest) resource utilization
      const selectedEntry = gatewayScores.reduce((best, current) =>
        current.score < best.score ? current : best
      );

      this.recordSelection(selectedEntry.gateway.getId());

      logger.debug('Selected gateway using resource-based selection', {
        gatewayId: selectedEntry.gateway.getId(),
        resourceScore: selectedEntry.score,
      });

      return selectedEntry.gateway;
    } catch (error) {
      logger.error('Error in resource-based selection', { error });
      return null;
    }
  }

  /**
   * Adaptive load balancing that switches strategies based on conditions
   */
  async selectAdaptive(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway | null> {
    try {
      const healthyGateways = await this.getHealthyGateways(gateways);

      if (healthyGateways.length === 0) {
        logger.warn('No healthy gateways available for adaptive selection');
        return null;
      }

      // Determine best strategy based on current conditions
      const strategy = await this.determineOptimalStrategy(healthyGateways);

      let selectedGateway: PaymentGateway | null = null;

      switch (strategy) {
        case 'round_robin':
          selectedGateway = await this.selectRoundRobin(healthyGateways);
          break;
        case 'weighted':
          selectedGateway =
            await this.selectWeightedRoundRobin(healthyGateways);
          break;
        case 'least_connections':
          selectedGateway = await this.selectLeastConnections(healthyGateways);
          break;
        case 'least_response_time':
          selectedGateway = await this.selectLeastResponseTime(healthyGateways);
          break;
        case 'resource_based':
          selectedGateway = await this.selectResourceBased(healthyGateways);
          break;
        default:
          selectedGateway = await this.selectRoundRobin(healthyGateways);
      }

      if (selectedGateway) {
        logger.debug('Selected gateway using adaptive strategy', {
          gatewayId: selectedGateway.getId(),
          strategy,
        });
      }

      return selectedGateway;
    } catch (error) {
      logger.error('Error in adaptive selection', { error });
      return null;
    }
  }

  /**
   * Records when a connection is completed
   */
  connectionCompleted(gatewayId: string): void {
    this.decrementActiveConnections(gatewayId);
  }

  /**
   * Gets load balancer statistics
   */
  getStats(): LoadBalancerStats {
    return {
      totalRequests: this.stats.totalRequests,
      gatewayStats: new Map(this.stats.gatewayStats),
    };
  }

  /**
   * Resets load balancer statistics
   */
  resetStats(): void {
    this.stats.totalRequests = 0;
    this.stats.gatewayStats.clear();
    this.roundRobinIndex = 0;
    logger.info('Load balancer statistics reset');
  }

  /**
   * Gets distribution of requests across gateways
   */
  getDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    const total = this.stats.totalRequests;

    if (total === 0) {
      return distribution;
    }

    for (const [gatewayId, stats] of this.stats.gatewayStats) {
      distribution[gatewayId] = (stats.requests / total) * 100;
    }

    return distribution;
  }

  private async getHealthyGateways(
    gateways: PaymentGateway[]
  ): Promise<PaymentGateway[]> {
    const healthyGateways: PaymentGateway[] = [];

    for (const gateway of gateways) {
      if (!gateway.isActive()) {
        continue;
      }

      const healthStatus = this.healthMonitor.getHealthStatus(gateway.getId());
      if (healthStatus && healthStatus.status === 'ACTIVE') {
        healthyGateways.push(gateway);
      }
    }

    return healthyGateways;
  }

  private async calculateGatewayWeights(
    gateways: PaymentGateway[]
  ): Promise<WeightedGateway[]> {
    const healthyGateways = await this.getHealthyGateways(gateways);
    const weightedGateways: WeightedGateway[] = [];

    for (const gateway of healthyGateways) {
      const weight = await this.calculateWeight(gateway);
      const currentLoad = this.getCurrentLoad(gateway.getId());

      weightedGateways.push({
        gateway,
        weight,
        currentLoad,
      });
    }

    return weightedGateways;
  }

  private async calculateWeight(gateway: PaymentGateway): Promise<number> {
    try {
      const config = gateway.getConfig();
      const metrics = await this.metricsCollector.getLatestMetrics(
        gateway.getId()
      );

      let weight = config.priority; // Base weight from priority

      // Adjust weight based on performance metrics
      if (metrics) {
        // Higher success rate increases weight
        weight *= metrics.successRate;

        // Lower response time increases weight
        const responseTimeFactor = Math.max(
          0.1,
          1 - metrics.responseTime / 10000
        );
        weight *= responseTimeFactor;
      }

      // Adjust weight based on current load
      const activeConnections = this.getActiveConnections(gateway.getId());
      const loadFactor = Math.max(0.1, 1 - activeConnections / 100); // Assume max 100 connections
      weight *= loadFactor;

      return Math.max(1, Math.round(weight));
    } catch (error) {
      logger.warn('Error calculating gateway weight', {
        gatewayId: gateway.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 1; // Default weight
    }
  }

  private selectByWeight(
    weightedGateways: WeightedGateway[]
  ): PaymentGateway | null {
    if (weightedGateways.length === 0) {
      return null;
    }

    // Calculate total weight
    const totalWeight = weightedGateways.reduce(
      (sum, wg) => sum + wg.weight,
      0
    );

    if (totalWeight === 0) {
      // If all weights are 0, fall back to round-robin
      return weightedGateways[this.roundRobinIndex % weightedGateways.length]
        .gateway;
    }

    // Generate random number and select based on weight
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (const weightedGateway of weightedGateways) {
      currentWeight += weightedGateway.weight;
      if (random <= currentWeight) {
        return weightedGateway.gateway;
      }
    }

    // Fallback to last gateway
    return weightedGateways[weightedGateways.length - 1].gateway;
  }

  private async calculateResourceScore(
    gateway: PaymentGateway
  ): Promise<number> {
    try {
      const metrics = await this.metricsCollector.getLatestMetrics(
        gateway.getId()
      );
      const activeConnections = this.getActiveConnections(gateway.getId());

      let score = 0;

      // Response time component (higher response time = higher score = worse)
      if (metrics?.responseTime) {
        score += metrics.responseTime / 1000; // Convert to seconds
      }

      // Active connections component
      score += activeConnections * 0.1;

      // Error rate component
      if (metrics?.errorRate) {
        score += metrics.errorRate * 10; // Heavily penalize errors
      }

      return score;
    } catch (error) {
      logger.warn('Error calculating resource score', {
        gatewayId: gateway.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 100; // High score (bad) on error
    }
  }

  private async determineOptimalStrategy(
    gateways: PaymentGateway[]
  ): Promise<string> {
    try {
      // Analyze current conditions to determine best strategy
      const totalConnections = Array.from(
        this.stats.gatewayStats.values()
      ).reduce((sum, stats) => sum + stats.activeConnections, 0);

      const avgResponseTime = await this.calculateAverageResponseTime(gateways);

      // High load conditions - use least connections
      if (totalConnections > gateways.length * 10) {
        return 'least_connections';
      }

      // High response time variance - use least response time
      if (avgResponseTime > 2000) {
        return 'least_response_time';
      }

      // Performance differences - use weighted
      const hasPerformanceDifferences =
        await this.hasSignificantPerformanceDifferences(gateways);
      if (hasPerformanceDifferences) {
        return 'weighted';
      }

      // Default to round-robin for balanced conditions
      return 'round_robin';
    } catch (error) {
      logger.warn('Error determining optimal strategy', { error });
      return 'round_robin';
    }
  }

  private async calculateAverageResponseTime(
    gateways: PaymentGateway[]
  ): Promise<number> {
    try {
      const responseTimes = await Promise.all(
        gateways.map(async gateway => {
          const metrics = await this.metricsCollector.getLatestMetrics(
            gateway.getId()
          );
          return metrics?.responseTime || 0;
        })
      );

      const validResponseTimes = responseTimes.filter(rt => rt > 0);
      if (validResponseTimes.length === 0) {
        return 0;
      }

      return (
        validResponseTimes.reduce((sum, rt) => sum + rt, 0) /
        validResponseTimes.length
      );
    } catch (error) {
      return 0;
    }
  }

  private async hasSignificantPerformanceDifferences(
    gateways: PaymentGateway[]
  ): Promise<boolean> {
    try {
      const successRates = await Promise.all(
        gateways.map(async gateway => {
          const metrics = await this.metricsCollector.getLatestMetrics(
            gateway.getId()
          );
          return metrics?.successRate || 0;
        })
      );

      const validRates = successRates.filter(sr => sr > 0);
      if (validRates.length < 2) {
        return false;
      }

      const min = Math.min(...validRates);
      const max = Math.max(...validRates);

      // Consider significant if difference is more than 10%
      return max - min > 0.1;
    } catch (error) {
      return false;
    }
  }

  private recordSelection(gatewayId: string): void {
    this.stats.totalRequests++;

    let gatewayStats = this.stats.gatewayStats.get(gatewayId);
    if (!gatewayStats) {
      gatewayStats = {
        requests: 0,
        lastUsed: new Date(),
        weight: 1,
        activeConnections: 0,
      };
      this.stats.gatewayStats.set(gatewayId, gatewayStats);
    }

    gatewayStats.requests++;
    gatewayStats.lastUsed = new Date();
  }

  private getActiveConnections(gatewayId: string): number {
    const stats = this.stats.gatewayStats.get(gatewayId);
    return stats?.activeConnections || 0;
  }

  private incrementActiveConnections(gatewayId: string): void {
    let stats = this.stats.gatewayStats.get(gatewayId);
    if (!stats) {
      stats = {
        requests: 0,
        lastUsed: new Date(),
        weight: 1,
        activeConnections: 0,
      };
      this.stats.gatewayStats.set(gatewayId, stats);
    }
    stats.activeConnections++;
  }

  private decrementActiveConnections(gatewayId: string): void {
    const stats = this.stats.gatewayStats.get(gatewayId);
    if (stats && stats.activeConnections > 0) {
      stats.activeConnections--;
    }
  }

  private getCurrentLoad(gatewayId: string): number {
    const stats = this.stats.gatewayStats.get(gatewayId);
    return stats?.activeConnections || 0;
  }
}
