import { IGatewayMetricsCollector } from '../interfaces/gateway.interface';
import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import { GatewayMetrics } from '../types/gateway.types';

interface MetricsData {
  gatewayId: string;
  timestamp: Date;
  responseTime: number;
  success: boolean;
  amount: number;
  errorType?: string;
  errorMessage?: string;
}

export class GatewayMetricsCollector implements IGatewayMetricsCollector {
  private metricsBuffer: Map<string, MetricsData[]> = new Map();
  private aggregatedMetrics: Map<string, GatewayMetrics> = new Map();
  private readonly bufferSize = 1000; // Keep last 1000 metrics per gateway
  private readonly aggregationInterval = 60000; // Aggregate every minute
  private aggregationTimer?: NodeJS.Timeout | undefined;

  constructor() {
    this.startAggregation();
  }

  recordTransaction(
    gatewayId: string,
    success: boolean,
    responseTime: number,
    amount: number
  ): void {
    try {
      const metricsData: MetricsData = {
        gatewayId,
        timestamp: new Date(),
        responseTime,
        success,
        amount,
      };

      this.addToBuffer(gatewayId, metricsData);

      logger.debug('Recorded transaction metrics', {
        gatewayId,
        success,
        responseTime,
        amount,
      });
    } catch (error) {
      logger.error('Failed to record transaction metrics', {
        error,
        gatewayId,
        success,
        responseTime,
        amount,
      });
    }
  }

  recordError(
    gatewayId: string,
    errorType: string,
    errorMessage: string
  ): void {
    try {
      const metricsData: MetricsData = {
        gatewayId,
        timestamp: new Date(),
        responseTime: 0,
        success: false,
        amount: 0,
        errorType,
        errorMessage,
      };

      this.addToBuffer(gatewayId, metricsData);

      logger.debug('Recorded error metrics', {
        gatewayId,
        errorType,
        errorMessage,
      });
    } catch (error) {
      logger.error('Failed to record error metrics', {
        error,
        gatewayId,
        errorType,
        errorMessage,
      });
    }
  }

  async getMetrics(
    gatewayId: string,
    period?: { start: Date; end: Date }
  ): Promise<GatewayMetrics> {
    try {
      const buffer = this.metricsBuffer.get(gatewayId) || [];

      // Filter by period if provided
      let filteredData = buffer;
      if (period) {
        filteredData = buffer.filter(
          data => data.timestamp >= period.start && data.timestamp <= period.end
        );
      }

      const metrics = this.calculateMetrics(gatewayId, filteredData);

      logger.debug('Retrieved gateway metrics', {
        gatewayId,
        period,
        dataPoints: filteredData.length,
      });

      return metrics;
    } catch (error) {
      logger.error('Failed to get gateway metrics', {
        error,
        gatewayId,
        period,
      });
      throw error;
    }
  }

  async getAggregatedMetrics(period?: {
    start: Date;
    end: Date;
  }): Promise<Record<string, GatewayMetrics>> {
    try {
      const result: Record<string, GatewayMetrics> = {};

      for (const gatewayId of this.metricsBuffer.keys()) {
        result[gatewayId] = await this.getMetrics(gatewayId, period);
      }

      logger.debug('Retrieved aggregated metrics', {
        period,
        gatewayCount: Object.keys(result).length,
      });

      return result;
    } catch (error) {
      logger.error('Failed to get aggregated metrics', { error, period });
      throw error;
    }
  }

  async getLatestMetrics(gatewayId: string): Promise<GatewayMetrics | null> {
    try {
      const cached = this.aggregatedMetrics.get(gatewayId);
      if (cached) {
        return cached;
      }

      // If no cached metrics, calculate from recent data
      const buffer = this.metricsBuffer.get(gatewayId) || [];
      if (buffer.length === 0) {
        return null;
      }

      // Use last 100 data points for latest metrics
      const recentData = buffer.slice(-100);
      return this.calculateMetrics(gatewayId, recentData);
    } catch (error) {
      logger.error('Failed to get latest metrics', { error, gatewayId });
      return null;
    }
  }

  async recordMetrics(
    gatewayId: string,
    metrics: Partial<GatewayMetrics>
  ): Promise<void> {
    try {
      const existing = this.aggregatedMetrics.get(gatewayId);
      const updated: GatewayMetrics = {
        gatewayId,
        timestamp: new Date(),
        responseTime: metrics.responseTime || existing?.responseTime || 0,
        successRate: metrics.successRate || existing?.successRate || 0,
        errorRate: metrics.errorRate || existing?.errorRate || 0,
        transactionCount:
          metrics.transactionCount || existing?.transactionCount || 0,
        transactionVolume:
          metrics.transactionVolume ||
          existing?.transactionVolume ||
          new Decimal(0),
        statusCounts: metrics.statusCounts || existing?.statusCounts || {},
        errorTypes: metrics.errorTypes || existing?.errorTypes || {},
      };

      this.aggregatedMetrics.set(gatewayId, updated);

      logger.debug('Recorded gateway metrics', { gatewayId, metrics: updated });
    } catch (error) {
      logger.error('Failed to record metrics', { error, gatewayId, metrics });
      throw error;
    }
  }

  getMetricsHistory(gatewayId: string, limit = 100): MetricsData[] {
    const buffer = this.metricsBuffer.get(gatewayId) || [];
    return buffer.slice(-limit);
  }

  clearMetrics(gatewayId?: string): void {
    if (gatewayId) {
      this.metricsBuffer.delete(gatewayId);
      this.aggregatedMetrics.delete(gatewayId);
      logger.info('Cleared metrics for gateway', { gatewayId });
    } else {
      this.metricsBuffer.clear();
      this.aggregatedMetrics.clear();
      logger.info('Cleared all metrics');
    }
  }

  destroy(): void {
    if (this.aggregationTimer) {
      clearInterval(this.aggregationTimer);
      this.aggregationTimer = undefined;
    }
    this.clearMetrics();
    logger.info('Gateway metrics collector destroyed');
  }

  private addToBuffer(gatewayId: string, data: MetricsData): void {
    let buffer = this.metricsBuffer.get(gatewayId);
    if (!buffer) {
      buffer = [];
      this.metricsBuffer.set(gatewayId, buffer);
    }

    buffer.push(data);

    // Maintain buffer size limit
    if (buffer.length > this.bufferSize) {
      buffer.splice(0, buffer.length - this.bufferSize);
    }
  }

  private calculateMetrics(
    gatewayId: string,
    data: MetricsData[]
  ): GatewayMetrics {
    if (data.length === 0) {
      return {
        gatewayId,
        timestamp: new Date(),
        responseTime: 0,
        successRate: 0,
        errorRate: 0,
        transactionCount: 0,
        transactionVolume: new Decimal(0),
        statusCounts: {},
        errorTypes: {},
      };
    }

    const successfulTransactions = data.filter(d => d.success);
    const failedTransactions = data.filter(d => !d.success);

    // Calculate response time (average of successful transactions)
    const avgResponseTime =
      successfulTransactions.length > 0
        ? successfulTransactions.reduce((sum, d) => sum + d.responseTime, 0) /
          successfulTransactions.length
        : 0;

    // Calculate success and error rates
    const successRate =
      data.length > 0 ? successfulTransactions.length / data.length : 0;
    const errorRate =
      data.length > 0 ? failedTransactions.length / data.length : 0;

    // Calculate transaction volume
    const transactionVolume = data.reduce(
      (sum, d) => sum.plus(new Decimal(d.amount)),
      new Decimal(0)
    );

    // Count status types
    const statusCounts: Record<string, number> = {
      success: successfulTransactions.length,
      error: failedTransactions.length,
    };

    // Count error types
    const errorTypes: Record<string, number> = {};
    failedTransactions.forEach(d => {
      if (d.errorType) {
        errorTypes[d.errorType] = (errorTypes[d.errorType] || 0) + 1;
      }
    });

    return {
      gatewayId,
      timestamp: new Date(),
      responseTime: Math.round(avgResponseTime),
      successRate: Math.round(successRate * 10000) / 10000, // 4 decimal places
      errorRate: Math.round(errorRate * 10000) / 10000,
      transactionCount: data.length,
      transactionVolume,
      statusCounts,
      errorTypes,
    };
  }

  private startAggregation(): void {
    this.aggregationTimer = setInterval(() => {
      this.aggregateMetrics();
    }, this.aggregationInterval);

    logger.debug('Started metrics aggregation', {
      interval: this.aggregationInterval,
    });
  }

  private aggregateMetrics(): void {
    try {
      for (const [gatewayId, buffer] of this.metricsBuffer) {
        // Aggregate metrics from the last minute
        const oneMinuteAgo = new Date(Date.now() - this.aggregationInterval);
        const recentData = buffer.filter(d => d.timestamp >= oneMinuteAgo);

        if (recentData.length > 0) {
          const metrics = this.calculateMetrics(gatewayId, recentData);
          this.aggregatedMetrics.set(gatewayId, metrics);
        }
      }

      logger.debug('Metrics aggregation completed', {
        gatewayCount: this.aggregatedMetrics.size,
      });
    } catch (error) {
      logger.error('Error during metrics aggregation', { error });
    }
  }
}
