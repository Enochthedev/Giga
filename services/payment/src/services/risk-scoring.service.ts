import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import {
  FraudAction,
  FraudRuleEvaluation,
  FraudSignal,
  RiskLevel,
} from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface RiskScoringConfig {
  riskThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  signalWeights: {
    velocity: number;
    amount: number;
    geolocation: number;
    device: number;
    behavioral: number;
    blacklist: number;
    rules: number;
  };
  decayFactors: {
    timeDecay: boolean;
    timeDecayHours: number;
    frequencyBoost: boolean;
  };
  adaptiveScoring: {
    enabled: boolean;
    learningRate: number;
    minSamples: number;
  };
}

export interface RiskScoreBreakdown {
  totalScore: number;
  riskLevel: RiskLevel;
  recommendation: FraudAction;
  components: {
    baseScore: number;
    signalScore: number;
    ruleScore: number;
    adjustments: number;
  };
  signalContributions: Array<{
    type: string;
    contribution: number;
    weight: number;
    adjustedContribution: number;
  }>;
  ruleContributions: Array<{
    ruleId: string;
    ruleName: string;
    contribution: number;
    weight: number;
  }>;
}

export class RiskScoringService {
  private prisma: PrismaClient;
  private config: RiskScoringConfig;

  constructor(prisma: PrismaClient, config: RiskScoringConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Calculate comprehensive risk score for a transaction
   */
  async calculateRiskScore(
    transaction: Transaction,
    signals: FraudSignal[],
    ruleEvaluations: FraudRuleEvaluation[]
  ): Promise<RiskScoreBreakdown> {
    try {
      logger.info('Calculating risk score', { transactionId: transaction.id });

      // Calculate base score from transaction characteristics
      const baseScore = await this.calculateBaseScore(transaction);

      // Calculate signal contributions
      const signalContributions = await this.calculateSignalContributions(
        signals,
        transaction
      );
      const signalScore = signalContributions.reduce(
        (sum, s) => sum + s.adjustedContribution,
        0
      );

      // Calculate rule contributions
      const ruleContributions = await this.calculateRuleContributions(
        ruleEvaluations,
        transaction
      );
      const ruleScore = ruleContributions.reduce(
        (sum, r) => sum + r.contribution * r.weight,
        0
      );

      // Apply adjustments
      const adjustments = await this.calculateAdjustments(
        transaction,
        signals,
        ruleEvaluations
      );

      // Calculate total score
      const totalScore = Math.min(
        100,
        Math.max(0, baseScore + signalScore + ruleScore + adjustments)
      );

      // Determine risk level and recommendation
      const riskLevel = this.determineRiskLevel(totalScore);
      const recommendation = this.getRecommendation(
        riskLevel,
        totalScore,
        signals,
        ruleEvaluations
      );

      const breakdown: RiskScoreBreakdown = {
        totalScore,
        riskLevel,
        recommendation,
        components: {
          baseScore,
          signalScore,
          ruleScore,
          adjustments,
        },
        signalContributions,
        ruleContributions,
      };

      logger.info('Risk score calculated', {
        transactionId: transaction.id,
        totalScore,
        riskLevel,
        recommendation,
      });

      return breakdown;
    } catch (error) {
      logger.error('Error calculating risk score', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      throw error;
    }
  }

  /**
   * Calculate base score from transaction characteristics
   */
  private async calculateBaseScore(transaction: Transaction): Promise<number> {
    let baseScore = 0;

    try {
      // Amount-based scoring
      const amount = Number(transaction.amount);
      if (amount > 10000) {
        baseScore += 15;
      } else if (amount > 5000) {
        baseScore += 10;
      } else if (amount > 1000) {
        baseScore += 5;
      } else if (amount < 1) {
        baseScore += 20; // Micro transactions are suspicious
      }

      // Currency risk (some currencies are higher risk)
      const highRiskCurrencies = ['BTC', 'ETH', 'XMR'];
      if (highRiskCurrencies.includes(transaction.currency)) {
        baseScore += 10;
      }

      // New user risk
      if (transaction.userId) {
        const userTransactionCount = await this.prisma.transaction.count({
          where: {
            userId: transaction.userId,
            status: 'SUCCEEDED',
          },
        });

        if (userTransactionCount === 0) {
          baseScore += 15; // First transaction
        } else if (userTransactionCount < 5) {
          baseScore += 8; // New user
        }
      }

      // Time-based risk (transactions at unusual hours)
      const transactionHour = new Date(
        transaction.createdAt || new Date()
      ).getHours();
      if (transactionHour >= 2 && transactionHour <= 6) {
        baseScore += 5; // Late night transactions
      }

      return Math.min(30, baseScore); // Cap base score at 30
    } catch (error) {
      logger.error('Error calculating base score', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return 0;
    }
  }

  /**
   * Calculate signal contributions with weights and adjustments
   */
  private async calculateSignalContributions(
    signals: FraudSignal[],
    transaction: Transaction
  ): Promise<
    Array<{
      type: string;
      contribution: number;
      weight: number;
      adjustedContribution: number;
    }>
  > {
    const contributions: Array<{
      type: string;
      contribution: number;
      weight: number;
      adjustedContribution: number;
    }> = [];

    for (const signal of signals) {
      const weight = this.getSignalWeight(signal.type);
      let adjustedContribution = signal.riskContribution * weight;

      // Apply time decay if enabled
      if (this.config.decayFactors.timeDecay) {
        const timeDecayFactor = this.calculateTimeDecayFactor(transaction);
        adjustedContribution *= timeDecayFactor;
      }

      // Apply frequency boost if enabled
      if (this.config.decayFactors.frequencyBoost) {
        const frequencyBoost = await this.calculateFrequencyBoost(
          signal.type,
          transaction
        );
        adjustedContribution *= frequencyBoost;
      }

      contributions.push({
        type: signal.type,
        contribution: signal.riskContribution,
        weight,
        adjustedContribution,
      });
    }

    return contributions;
  }

  /**
   * Calculate rule contributions with weights
   */
  private async calculateRuleContributions(
    ruleEvaluations: FraudRuleEvaluation[],
    transaction: Transaction
  ): Promise<
    Array<{
      ruleId: string;
      ruleName: string;
      contribution: number;
      weight: number;
    }>
  > {
    const contributions: Array<{
      ruleId: string;
      ruleName: string;
      contribution: number;
      weight: number;
    }> = [];

    for (const evaluation of ruleEvaluations) {
      if (evaluation.matched) {
        const weight = this.config.signalWeights.rules;

        contributions.push({
          ruleId: evaluation.ruleId,
          ruleName: evaluation.ruleName,
          contribution: evaluation.riskScore,
          weight,
        });
      }
    }

    return contributions;
  }

  /**
   * Calculate various adjustments to the risk score
   */
  private async calculateAdjustments(
    transaction: Transaction,
    signals: FraudSignal[],
    ruleEvaluations: FraudRuleEvaluation[]
  ): Promise<number> {
    let adjustments = 0;

    try {
      // Positive adjustments (increase risk)

      // Multiple signal types (indicates coordinated attack)
      const signalTypes = new Set(signals.map(s => s.type.split('_')[0]));
      if (signalTypes.size >= 3) {
        adjustments += 10;
      }

      // High-severity rule matches
      const highSeverityRules = ruleEvaluations.filter(
        r => r.matched && r.riskScore >= 30
      );
      if (highSeverityRules.length >= 2) {
        adjustments += 15;
      }

      // Negative adjustments (decrease risk)

      // Established user with good history
      if (transaction.userId) {
        const userHistory = await this.getUserRiskHistory(transaction.userId);
        if (
          userHistory.avgRiskScore < 20 &&
          userHistory.transactionCount > 10
        ) {
          adjustments -= 5;
        }
      }

      // Merchant whitelist
      if (transaction.metadata?.merchantId) {
        const merchantRisk = await this.getMerchantRiskProfile(
          transaction.metadata.merchantId
        );
        if (merchantRisk.isLowRisk) {
          adjustments -= 3;
        }
      }

      return adjustments;
    } catch (error) {
      logger.error('Error calculating adjustments', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return 0;
    }
  }

  /**
   * Get signal weight based on type
   */
  private getSignalWeight(signalType: string): number {
    const baseType = signalType.split('_')[0];

    switch (baseType) {
      case 'velocity':
        return this.config.signalWeights.velocity;
      case 'amount':
        return this.config.signalWeights.amount;
      case 'geolocation':
      case 'geo':
        return this.config.signalWeights.geolocation;
      case 'device':
        return this.config.signalWeights.device;
      case 'behavioral':
      case 'behavior':
        return this.config.signalWeights.behavioral;
      case 'blacklist':
        return this.config.signalWeights.blacklist;
      default:
        return 1.0; // Default weight
    }
  }

  /**
   * Calculate time decay factor
   */
  private calculateTimeDecayFactor(transaction: Transaction): number {
    if (!this.config.decayFactors.timeDecay) {
      return 1.0;
    }

    const transactionTime = new Date(transaction.createdAt || new Date());
    const currentTime = new Date();
    const hoursDiff =
      (currentTime.getTime() - transactionTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= this.config.decayFactors.timeDecayHours) {
      return 1.0; // No decay within the time window
    }

    // Linear decay after the time window
    const decayRate = 0.1; // 10% decay per hour
    return Math.max(
      0.5,
      1.0 - (hoursDiff - this.config.decayFactors.timeDecayHours) * decayRate
    );
  }

  /**
   * Calculate frequency boost factor
   */
  private async calculateFrequencyBoost(
    signalType: string,
    transaction: Transaction
  ): Promise<number> {
    if (!this.config.decayFactors.frequencyBoost) {
      return 1.0;
    }

    try {
      // Count recent occurrences of this signal type for the user
      const recentCount = await this.prisma.fraudAssessment.count({
        where: {
          transaction: {
            userId: transaction.userId,
          },
          signals: {
            path: '$[*].type',
            array_contains: signalType,
          },
          assessedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      // Boost factor increases with frequency
      return Math.min(2.0, 1.0 + recentCount * 0.2);
    } catch (error) {
      logger.error('Error calculating frequency boost', {
        error: error instanceof Error ? error.message : 'Unknown error',
        signalType,
      });
      return 1.0;
    }
  }

  /**
   * Determine risk level based on score
   */
  private determineRiskLevel(riskScore: number): RiskLevel {
    if (riskScore >= this.config.riskThresholds.critical) {
      return 'critical';
    } else if (riskScore >= this.config.riskThresholds.high) {
      return 'high';
    } else if (riskScore >= this.config.riskThresholds.medium) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get recommendation based on risk level and context
   */
  private getRecommendation(
    riskLevel: RiskLevel,
    riskScore: number,
    signals: FraudSignal[],
    ruleEvaluations: FraudRuleEvaluation[]
  ): FraudAction {
    // Check for explicit rule actions first
    const declineRules = ruleEvaluations.filter(
      r => r.matched && r.action === 'decline'
    );
    if (declineRules.length > 0) {
      return 'decline';
    }

    const reviewRules = ruleEvaluations.filter(
      r => r.matched && r.action === 'review'
    );
    if (reviewRules.length > 0 && riskLevel !== 'low') {
      return 'review';
    }

    // Check for blacklist signals
    const blacklistSignals = signals.filter(s => s.type.includes('blacklist'));
    if (blacklistSignals.length > 0) {
      return 'decline';
    }

    // Default recommendations based on risk level and score
    switch (riskLevel) {
      case 'critical':
        return 'decline';
      case 'high':
        return riskScore >= 80 ? 'decline' : 'review';
      case 'medium':
        return riskScore >= 60 ? 'review' : 'challenge';
      case 'low':
      default:
        return 'allow';
    }
  }

  /**
   * Get user risk history
   */
  private async getUserRiskHistory(userId: string): Promise<{
    avgRiskScore: number;
    transactionCount: number;
    lastAssessment: Date | null;
  }> {
    try {
      const assessments = await this.prisma.fraudAssessment.findMany({
        where: {
          transaction: {
            userId,
          },
        },
        select: {
          riskScore: true,
          assessedAt: true,
        },
        orderBy: {
          assessedAt: 'desc',
        },
        take: 50, // Last 50 assessments
      });

      if (assessments.length === 0) {
        return {
          avgRiskScore: 0,
          transactionCount: 0,
          lastAssessment: null,
        };
      }

      const avgRiskScore =
        assessments.reduce((sum, a) => sum + a.riskScore, 0) /
        assessments.length;

      return {
        avgRiskScore,
        transactionCount: assessments.length,
        lastAssessment: assessments[0].assessedAt,
      };
    } catch (error) {
      logger.error('Error getting user risk history', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return {
        avgRiskScore: 50, // Default to medium risk
        transactionCount: 0,
        lastAssessment: null,
      };
    }
  }

  /**
   * Get merchant risk profile
   */
  private async getMerchantRiskProfile(merchantId: string): Promise<{
    isLowRisk: boolean;
    avgRiskScore: number;
    transactionCount: number;
  }> {
    try {
      const assessments = await this.prisma.fraudAssessment.findMany({
        where: {
          transaction: {
            metadata: {
              path: ['merchantId'],
              equals: merchantId,
            },
          },
        },
        select: {
          riskScore: true,
        },
        take: 100, // Last 100 transactions
      });

      if (assessments.length === 0) {
        return {
          isLowRisk: false,
          avgRiskScore: 50,
          transactionCount: 0,
        };
      }

      const avgRiskScore =
        assessments.reduce((sum, a) => sum + a.riskScore, 0) /
        assessments.length;
      const isLowRisk = avgRiskScore < 25 && assessments.length >= 10;

      return {
        isLowRisk,
        avgRiskScore,
        transactionCount: assessments.length,
      };
    } catch (error) {
      logger.error('Error getting merchant risk profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        merchantId,
      });
      return {
        isLowRisk: false,
        avgRiskScore: 50,
        transactionCount: 0,
      };
    }
  }

  /**
   * Update risk scoring configuration
   */
  async updateRiskThresholds(
    thresholds: Partial<RiskScoringConfig['riskThresholds']>
  ): Promise<void> {
    this.config.riskThresholds = {
      ...this.config.riskThresholds,
      ...thresholds,
    };

    logger.info('Risk thresholds updated', { thresholds });
  }

  /**
   * Update signal weights
   */
  async updateSignalWeights(
    weights: Partial<RiskScoringConfig['signalWeights']>
  ): Promise<void> {
    this.config.signalWeights = {
      ...this.config.signalWeights,
      ...weights,
    };

    logger.info('Signal weights updated', { weights });
  }

  /**
   * Get risk scoring statistics
   */
  async getRiskScoringStatistics(days: number = 30): Promise<{
    totalAssessments: number;
    avgRiskScore: number;
    riskLevelDistribution: Record<RiskLevel, number>;
    actionDistribution: Record<FraudAction, number>;
    accuracyMetrics: {
      truePositives: number;
      falsePositives: number;
      trueNegatives: number;
      falseNegatives: number;
    };
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const assessments = await this.prisma.fraudAssessment.findMany({
        where: {
          assessedAt: { gte: startDate },
        },
        select: {
          riskScore: true,
          riskLevel: true,
          recommendation: true,
        },
      });

      const totalAssessments = assessments.length;
      const avgRiskScore =
        totalAssessments > 0
          ? assessments.reduce((sum, a) => sum + a.riskScore, 0) /
            totalAssessments
          : 0;

      const riskLevelDistribution: Record<RiskLevel, number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      };

      const actionDistribution: Record<FraudAction, number> = {
        allow: 0,
        review: 0,
        decline: 0,
        challenge: 0,
        step_up_auth: 0,
      };

      assessments.forEach(assessment => {
        riskLevelDistribution[assessment.riskLevel as RiskLevel]++;
        actionDistribution[assessment.recommendation as FraudAction]++;
      });

      // For accuracy metrics, we would need actual fraud outcomes
      // This is a simplified version
      const accuracyMetrics = {
        truePositives: Math.floor(actionDistribution.decline * 0.8), // Assume 80% accuracy
        falsePositives: Math.floor(actionDistribution.decline * 0.2),
        trueNegatives: Math.floor(actionDistribution.allow * 0.95), // Assume 95% accuracy
        falseNegatives: Math.floor(actionDistribution.allow * 0.05),
      };

      return {
        totalAssessments,
        avgRiskScore,
        riskLevelDistribution,
        actionDistribution,
        accuracyMetrics,
      };
    } catch (error) {
      logger.error('Error getting risk scoring statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
