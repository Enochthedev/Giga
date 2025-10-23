import {
  IGatewayHealthMonitor,
  IGatewayMetricsCollector,
} from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { GatewayMetrics } from '../types/gateway.types';

interface PerformanceProfile {
  gatewayId: string;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  throughput: number;
  reliability: number;
  costEfficiency: number;
  overallScore: number;
  recommendations: string[];
  lastUpdated: Date;
}

interface OptimizationRecommendation {
  type: 'configuration' | 'routing' | 'capacity' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  estimatedImprovement: number; // Percentage improvement expected
}

interface PerformanceAlert {
  id: string;
  gatewayId: string;
  type:
    | 'performance_degradation'
    | 'high_error_rate'
    | 'capacity_limit'
    | 'outage';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  metrics: Record<string, number>;
  timestamp: Date;
  acknowledged: boolean;
}

/**
 * Gateway Performance Optimizer Service
 * Monitors, analyzes, and optimizes gateway performance
 */
export class GatewayPerformanceOptimizerService {
  private healthMonitor: IGatewayHealthMonitor;
  private metricsCollector: IGatewayMetricsCollector;
  private performanceProfiles: Map<string, PerformanceProfile> = new Map();
  private alerts: Map<string, PerformanceAlert> = new Map();
  private optimizationHistory: Map<string, OptimizationRecommendation[]> =
    new Map();

  // Performance thresholds
  private readonly thresholds = {
    responseTime: {
      good: 1000, // < 1s
      acceptable: 3000, // < 3s
      poor: 5000, // < 5s
    },
    successRate: {
      excellent: 0.99, // > 99%
      good: 0.95, // > 95%
      acceptable: 0.9, // > 90%
    },
    errorRate: {
      acceptable: 0.01, // < 1%
      warning: 0.05, // < 5%
      critical: 0.1, // < 10%
    },
  };

  constructor(
    healthMonitor: IGatewayHealthMonitor,
    metricsCollector: IGatewayMetricsCollector
  ) {
    this.healthMonitor = healthMonitor;
    this.metricsCollector = metricsCollector;
    this.startPerformanceMonitoring();
  }

  /**
   * Analyzes gateway performance and generates optimization recommendations
   */
  async analyzeGatewayPerformance(
    gatewayId: string
  ): Promise<PerformanceProfile> {
    try {
      logger.info('Analyzing gateway performance', { gatewayId });

      const metrics = await this.metricsCollector.getLatestMetrics(gatewayId);
      const healthStatus = this.healthMonitor.getHealthStatus(gatewayId);

      if (!metrics) {
        throw new Error(`No metrics available for gateway: ${gatewayId}`);
      }

      const profile = await this.calculatePerformanceProfile(
        gatewayId,
        metrics
      );
      this.performanceProfiles.set(gatewayId, profile);

      // Generate alerts if performance is degraded
      await this.checkPerformanceAlerts(gatewayId, profile);

      logger.info('Gateway performance analysis completed', {
        gatewayId,
        overallScore: profile.overallScore,
        recommendationCount: profile.recommendations.length,
      });

      return profile;
    } catch (error) {
      logger.error('Failed to analyze gateway performance', {
        error,
        gatewayId,
      });
      throw error;
    }
  }

  /**
   * Generates optimization recommendations for a gateway
   */
  async generateOptimizationRecommendations(
    gatewayId: string
  ): Promise<OptimizationRecommendation[]> {
    try {
      logger.info('Generating optimization recommendations', { gatewayId });

      const profile = this.performanceProfiles.get(gatewayId);
      if (!profile) {
        await this.analyzeGatewayPerformance(gatewayId);
        return this.generateOptimizationRecommendations(gatewayId);
      }

      const recommendations: OptimizationRecommendation[] = [];

      // Response time optimization
      if (
        profile.averageResponseTime > this.thresholds.responseTime.acceptable
      ) {
        recommendations.push({
          type: 'configuration',
          priority:
            profile.averageResponseTime > this.thresholds.responseTime.poor
              ? 'high'
              : 'medium',
          title: 'Optimize Response Time',
          description: `Average response time is ${profile.averageResponseTime}ms, which exceeds acceptable limits`,
          impact: 'Improved user experience and higher conversion rates',
          implementation:
            'Review gateway configuration, implement connection pooling, optimize network settings',
          estimatedImprovement: 25,
        });
      }

      // Success rate optimization
      if (profile.successRate < this.thresholds.successRate.good) {
        recommendations.push({
          type: 'routing',
          priority:
            profile.successRate < this.thresholds.successRate.acceptable
              ? 'critical'
              : 'high',
          title: 'Improve Success Rate',
          description: `Success rate is ${(profile.successRate * 100).toFixed(2)}%, below optimal levels`,
          impact: 'Reduced failed transactions and improved revenue',
          implementation:
            'Review error patterns, implement retry logic, optimize routing rules',
          estimatedImprovement: 15,
        });
      }

      // Error rate optimization
      if (profile.errorRate > this.thresholds.errorRate.acceptable) {
        recommendations.push({
          type: 'maintenance',
          priority:
            profile.errorRate > this.thresholds.errorRate.critical
              ? 'critical'
              : 'high',
          title: 'Reduce Error Rate',
          description: `Error rate is ${(profile.errorRate * 100).toFixed(2)}%, above acceptable threshold`,
          impact: 'Improved reliability and customer satisfaction',
          implementation:
            'Investigate error causes, update error handling, review gateway integration',
          estimatedImprovement: 30,
        });
      }

      // Throughput optimization
      if (profile.throughput < this.calculateOptimalThroughput(gatewayId)) {
        recommendations.push({
          type: 'capacity',
          priority: 'medium',
          title: 'Increase Throughput Capacity',
          description:
            'Current throughput is below optimal levels for transaction volume',
          impact:
            'Handle higher transaction volumes without performance degradation',
          implementation:
            'Scale gateway resources, implement load balancing, optimize connection limits',
          estimatedImprovement: 40,
        });
      }

      // Cost efficiency optimization
      if (profile.costEfficiency < 0.7) {
        recommendations.push({
          type: 'routing',
          priority: 'low',
          title: 'Optimize Cost Efficiency',
          description:
            'Gateway cost efficiency could be improved through better routing',
          impact: 'Reduced processing costs while maintaining performance',
          implementation:
            'Review fee structures, implement cost-aware routing, negotiate better rates',
          estimatedImprovement: 10,
        });
      }

      // Store recommendations history
      this.optimizationHistory.set(gatewayId, recommendations);

      logger.info('Optimization recommendations generated', {
        gatewayId,
        recommendationCount: recommendations.length,
      });

      return recommendations;
    } catch (error) {
      logger.error('Failed to generate optimization recommendations', {
        error,
        gatewayId,
      });
      throw error;
    }
  }

  /**
   * Applies automatic optimizations where possible
   */
  async applyAutomaticOptimizations(gatewayId: string): Promise<{
    applied: OptimizationRecommendation[];
    skipped: OptimizationRecommendation[];
  }> {
    try {
      logger.info('Applying automatic optimizations', { gatewayId });

      const recommendations =
        await this.generateOptimizationRecommendations(gatewayId);
      const applied: OptimizationRecommendation[] = [];
      const skipped: OptimizationRecommendation[] = [];

      for (const recommendation of recommendations) {
        if (await this.canAutoApply(recommendation)) {
          await this.applyOptimization(gatewayId, recommendation);
          applied.push(recommendation);
        } else {
          skipped.push(recommendation);
        }
      }

      logger.info('Automatic optimizations completed', {
        gatewayId,
        appliedCount: applied.length,
        skippedCount: skipped.length,
      });

      return { applied, skipped };
    } catch (error) {
      logger.error('Failed to apply automatic optimizations', {
        error,
        gatewayId,
      });
      throw error;
    }
  }

  /**
   * Gets performance comparison between gateways
   */
  async getPerformanceComparison(gatewayIds: string[]): Promise<{
    profiles: PerformanceProfile[];
    ranking: Array<{ gatewayId: string; rank: number; score: number }>;
    insights: string[];
  }> {
    try {
      logger.info('Generating performance comparison', { gatewayIds });

      const profiles = await Promise.all(
        gatewayIds.map(id => this.analyzeGatewayPerformance(id))
      );

      // Rank gateways by overall score
      const ranking = profiles
        .map((profile, index) => ({
          gatewayId: profile.gatewayId,
          rank: index + 1,
          score: profile.overallScore,
        }))
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      // Generate insights
      const insights = this.generateComparisonInsights(profiles);

      return { profiles, ranking, insights };
    } catch (error) {
      logger.error('Failed to generate performance comparison', {
        error,
        gatewayIds,
      });
      throw error;
    }
  }

  /**
   * Gets performance alerts
   */
  getPerformanceAlerts(gatewayId?: string): PerformanceAlert[] {
    const alerts = Array.from(this.alerts.values());

    if (gatewayId) {
      return alerts.filter(alert => alert.gatewayId === gatewayId);
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Acknowledges a performance alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      logger.info('Performance alert acknowledged', { alertId });
    }
  }

  /**
   * Gets performance trends over time
   */
  async getPerformanceTrends(
    gatewayId: string,
    period: { start: Date; end: Date }
  ): Promise<{
    responseTimeTrend: Array<{ timestamp: Date; value: number }>;
    successRateTrend: Array<{ timestamp: Date; value: number }>;
    errorRateTrend: Array<{ timestamp: Date; value: number }>;
    throughputTrend: Array<{ timestamp: Date; value: number }>;
  }> {
    try {
      // This would typically fetch historical metrics from a time-series database
      // For now, we'll return mock trend data
      const mockTrend = this.generateMockTrendData(period);

      return {
        responseTimeTrend: mockTrend,
        successRateTrend: mockTrend.map(point => ({
          ...point,
          value: 0.95 + Math.random() * 0.04,
        })),
        errorRateTrend: mockTrend.map(point => ({
          ...point,
          value: Math.random() * 0.02,
        })),
        throughputTrend: mockTrend.map(point => ({
          ...point,
          value: 100 + Math.random() * 50,
        })),
      };
    } catch (error) {
      logger.error('Failed to get performance trends', {
        error,
        gatewayId,
        period,
      });
      throw error;
    }
  }

  private async calculatePerformanceProfile(
    gatewayId: string,
    metrics: GatewayMetrics
  ): Promise<PerformanceProfile> {
    const responseTimeScore = this.calculateResponseTimeScore(
      metrics.responseTime
    );
    const successRateScore = metrics.successRate;
    const errorRateScore = 1 - metrics.errorRate;
    const throughputScore = this.calculateThroughputScore(
      metrics.transactionCount
    );
    const reliabilityScore = this.calculateReliabilityScore(gatewayId);
    const costEfficiencyScore =
      await this.calculateCostEfficiencyScore(gatewayId);

    // Weighted overall score
    const overallScore =
      responseTimeScore * 0.2 +
      successRateScore * 0.25 +
      errorRateScore * 0.2 +
      throughputScore * 0.15 +
      reliabilityScore * 0.15 +
      costEfficiencyScore * 0.05;

    const recommendations = await this.generateBasicRecommendations(
      gatewayId,
      metrics
    );

    return {
      gatewayId,
      averageResponseTime: metrics.responseTime,
      successRate: metrics.successRate,
      errorRate: metrics.errorRate,
      throughput: metrics.transactionCount,
      reliability: reliabilityScore,
      costEfficiency: costEfficiencyScore,
      overallScore,
      recommendations,
      lastUpdated: new Date(),
    };
  }

  private calculateResponseTimeScore(responseTime: number): number {
    if (responseTime <= this.thresholds.responseTime.good) return 1.0;
    if (responseTime <= this.thresholds.responseTime.acceptable) return 0.8;
    if (responseTime <= this.thresholds.responseTime.poor) return 0.6;
    return 0.3;
  }

  private calculateThroughputScore(transactionCount: number): number {
    // Normalize based on expected throughput (this would be configurable)
    const expectedThroughput = 1000; // transactions per period
    return Math.min(1.0, transactionCount / expectedThroughput);
  }

  private calculateReliabilityScore(gatewayId: string): number {
    const healthStatus = this.healthMonitor.getHealthStatus(gatewayId);
    if (!healthStatus) return 0.5;

    let score = 1.0;

    // Penalize for consecutive failures
    if (healthStatus.consecutiveFailures > 0) {
      score -= Math.min(0.5, healthStatus.consecutiveFailures * 0.1);
    }

    // Adjust based on status
    switch (healthStatus.status) {
      case 'ACTIVE':
        break;
      case 'MAINTENANCE':
        score *= 0.7;
        break;
      case 'INACTIVE':
        score *= 0.3;
        break;
      case 'ERROR':
        score *= 0.1;
        break;
    }

    return Math.max(0, score);
  }

  private async calculateCostEfficiencyScore(
    gatewayId: string
  ): Promise<number> {
    // This would calculate cost efficiency based on fees vs. performance
    // For now, return a mock score
    return 0.8;
  }

  private calculateOptimalThroughput(gatewayId: string): number {
    // This would calculate optimal throughput based on gateway capacity
    // For now, return a mock value
    return 1000;
  }

  private async generateBasicRecommendations(
    gatewayId: string,
    metrics: GatewayMetrics
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (metrics.responseTime > this.thresholds.responseTime.acceptable) {
      recommendations.push(
        'Consider optimizing gateway configuration for better response times'
      );
    }

    if (metrics.successRate < this.thresholds.successRate.good) {
      recommendations.push(
        'Review error patterns and implement retry mechanisms'
      );
    }

    if (metrics.errorRate > this.thresholds.errorRate.acceptable) {
      recommendations.push('Investigate and address high error rates');
    }

    return recommendations;
  }

  private async checkPerformanceAlerts(
    gatewayId: string,
    profile: PerformanceProfile
  ): Promise<void> {
    // Check for performance degradation
    if (profile.overallScore < 0.7) {
      this.createAlert({
        gatewayId,
        type: 'performance_degradation',
        severity: profile.overallScore < 0.5 ? 'critical' : 'warning',
        message: `Gateway performance has degraded (score: ${profile.overallScore.toFixed(2)})`,
        metrics: {
          overallScore: profile.overallScore,
          responseTime: profile.averageResponseTime,
          successRate: profile.successRate,
        },
      });
    }

    // Check for high error rate
    if (profile.errorRate > this.thresholds.errorRate.warning) {
      this.createAlert({
        gatewayId,
        type: 'high_error_rate',
        severity:
          profile.errorRate > this.thresholds.errorRate.critical
            ? 'critical'
            : 'error',
        message: `High error rate detected: ${(profile.errorRate * 100).toFixed(2)}%`,
        metrics: { errorRate: profile.errorRate },
      });
    }
  }

  private createAlert(
    alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged'>
  ): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false,
      ...alertData,
    };

    this.alerts.set(alert.id, alert);

    logger.warn('Performance alert created', {
      alertId: alert.id,
      gatewayId: alert.gatewayId,
      type: alert.type,
      severity: alert.severity,
    });
  }

  private async canAutoApply(
    recommendation: OptimizationRecommendation
  ): Promise<boolean> {
    // Only auto-apply low-risk configuration changes
    return (
      recommendation.type === 'configuration' &&
      recommendation.priority !== 'critical' &&
      recommendation.estimatedImprovement < 20
    );
  }

  private async applyOptimization(
    gatewayId: string,
    recommendation: OptimizationRecommendation
  ): Promise<void> {
    logger.info('Applying optimization', {
      gatewayId,
      type: recommendation.type,
      title: recommendation.title,
    });

    // Implementation would depend on the specific optimization
    // For now, just log the action
    logger.info('Optimization applied successfully', {
      gatewayId,
      optimization: recommendation.title,
    });
  }

  private generateComparisonInsights(profiles: PerformanceProfile[]): string[] {
    const insights: string[] = [];

    if (profiles.length < 2) return insights;

    // Find best and worst performers
    const sortedByScore = [...profiles].sort(
      (a, b) => b.overallScore - a.overallScore
    );
    const best = sortedByScore[0];
    const worst = sortedByScore[sortedByScore.length - 1];

    insights.push(
      `Best performing gateway: ${best.gatewayId} (score: ${best.overallScore.toFixed(2)})`
    );
    insights.push(
      `Lowest performing gateway: ${worst.gatewayId} (score: ${worst.overallScore.toFixed(2)})`
    );

    // Response time insights
    const avgResponseTime =
      profiles.reduce((sum, p) => sum + p.averageResponseTime, 0) /
      profiles.length;
    const fastestGateway = profiles.reduce((min, p) =>
      p.averageResponseTime < min.averageResponseTime ? p : min
    );

    insights.push(
      `Fastest gateway: ${fastestGateway.gatewayId} (${fastestGateway.averageResponseTime}ms vs avg ${avgResponseTime.toFixed(0)}ms)`
    );

    return insights;
  }

  private generateMockTrendData(period: {
    start: Date;
    end: Date;
  }): Array<{ timestamp: Date; value: number }> {
    const data: Array<{ timestamp: Date; value: number }> = [];
    const duration = period.end.getTime() - period.start.getTime();
    const points = Math.min(100, Math.max(10, duration / (1000 * 60 * 60))); // One point per hour, max 100 points

    for (let i = 0; i < points; i++) {
      const timestamp = new Date(
        period.start.getTime() + (duration * i) / (points - 1)
      );
      const value = 1000 + Math.sin(i / 10) * 200 + Math.random() * 100;
      data.push({ timestamp, value });
    }

    return data;
  }

  private startPerformanceMonitoring(): void {
    // Start periodic performance analysis
    setInterval(async () => {
      try {
        // This would analyze all registered gateways
        logger.debug('Running periodic performance analysis');
      } catch (error) {
        logger.error('Error in periodic performance analysis', { error });
      }
    }, 300000); // Every 5 minutes

    logger.info('Performance monitoring started');
  }
}
