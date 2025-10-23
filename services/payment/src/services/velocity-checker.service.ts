import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { FraudSignal, VelocityCheck } from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface VelocityLimits {
  transactionCount: { [timeWindowMinutes: number]: number };
  amount: { [timeWindowMinutes: number]: number };
  uniqueCards: { [timeWindowMinutes: number]: number };
  uniqueIPs: { [timeWindowMinutes: number]: number };
}

export interface VelocityCheckerConfig {
  defaultLimits: VelocityLimits;
  timeWindows: number[]; // in minutes
  enablePatternDetection: boolean;
  enableBehavioralAnalysis: boolean;
}

export class VelocityCheckerService {
  private prisma: PrismaClient;
  private config: VelocityCheckerConfig;

  constructor(prisma: PrismaClient, config: VelocityCheckerConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Perform comprehensive velocity checks on a transaction
   */
  async checkVelocity(transaction: Transaction): Promise<VelocityCheck> {
    try {
      logger.info('Starting velocity check', { transactionId: transaction.id });

      const velocityCheck: VelocityCheck = {
        userId: transaction.userId,
        ipAddress: transaction.metadata?.ipAddress,
        deviceFingerprint: transaction.metadata?.deviceFingerprint,
        paymentMethodId: transaction.paymentMethodId,
        timeWindows: this.config.timeWindows,
        transactionCountLimit: 0,
        amountLimit: 0,
        transactionCounts: {},
        amounts: {},
        isViolation: false,
        violatedWindows: [],
      };

      // Check each time window
      for (const windowMinutes of this.config.timeWindows) {
        const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

        // Get transaction count and amount limits for this window
        const countLimit =
          this.config.defaultLimits.transactionCount[windowMinutes] || 10;
        const amountLimit =
          this.config.defaultLimits.amount[windowMinutes] || 10000;

        // Check user-based velocity
        if (transaction.userId) {
          const userStats = await this.getUserVelocityStats(
            transaction.userId,
            windowStart
          );
          velocityCheck.transactionCounts[windowMinutes] =
            userStats.transactionCount;
          velocityCheck.amounts[windowMinutes] = userStats.totalAmount;

          if (
            userStats.transactionCount >= countLimit ||
            userStats.totalAmount >= amountLimit
          ) {
            velocityCheck.isViolation = true;
            velocityCheck.violatedWindows.push(windowMinutes);
          }
        }

        // Check IP-based velocity
        if (transaction.metadata?.ipAddress) {
          const ipStats = await this.getIPVelocityStats(
            transaction.metadata.ipAddress,
            windowStart
          );

          if (
            ipStats.transactionCount >= countLimit ||
            ipStats.totalAmount >= amountLimit
          ) {
            velocityCheck.isViolation = true;
            velocityCheck.violatedWindows.push(windowMinutes);
          }
        }

        // Check device-based velocity
        if (transaction.metadata?.deviceFingerprint) {
          const deviceStats = await this.getDeviceVelocityStats(
            transaction.metadata.deviceFingerprint,
            windowStart
          );

          if (
            deviceStats.transactionCount >= countLimit ||
            deviceStats.totalAmount >= amountLimit
          ) {
            velocityCheck.isViolation = true;
            velocityCheck.violatedWindows.push(windowMinutes);
          }
        }

        // Check payment method velocity
        if (transaction.paymentMethodId) {
          const pmStats = await this.getPaymentMethodVelocityStats(
            transaction.paymentMethodId,
            windowStart
          );

          if (
            pmStats.transactionCount >= countLimit ||
            pmStats.totalAmount >= amountLimit
          ) {
            velocityCheck.isViolation = true;
            velocityCheck.violatedWindows.push(windowMinutes);
          }
        }
      }

      logger.info('Velocity check completed', {
        transactionId: transaction.id,
        isViolation: velocityCheck.isViolation,
        violatedWindows: velocityCheck.violatedWindows,
      });

      return velocityCheck;
    } catch (error) {
      logger.error('Error during velocity check', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      throw error;
    }
  }

  /**
   * Generate fraud signals based on velocity patterns
   */
  async generateVelocitySignals(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const velocityCheck = await this.checkVelocity(transaction);

      if (velocityCheck.isViolation) {
        // High velocity signal
        signals.push({
          type: 'velocity_violation',
          value: velocityCheck.violatedWindows,
          riskContribution: this.calculateVelocityRiskScore(velocityCheck),
          description: `Velocity limits exceeded in ${velocityCheck.violatedWindows.length} time windows`,
        });
      }

      // Pattern detection signals
      if (this.config.enablePatternDetection) {
        const patternSignals = await this.detectVelocityPatterns(transaction);
        signals.push(...patternSignals);
      }

      // Behavioral analysis signals
      if (this.config.enableBehavioralAnalysis) {
        const behavioralSignals =
          await this.analyzeBehavioralVelocity(transaction);
        signals.push(...behavioralSignals);
      }

      return signals;
    } catch (error) {
      logger.error('Error generating velocity signals', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  /**
   * Get user velocity statistics for a time window
   */
  private async getUserVelocityStats(
    userId: string,
    windowStart: Date
  ): Promise<{
    transactionCount: number;
    totalAmount: number;
    uniqueCards: number;
  }> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          createdAt: { gte: windowStart },
          status: { in: ['SUCCEEDED', 'PROCESSING'] },
        },
        select: {
          amount: true,
          paymentMethodId: true,
        },
      });

      const totalAmount = transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );
      const uniqueCards = new Set(
        transactions.map(t => t.paymentMethodId).filter(Boolean)
      ).size;

      return {
        transactionCount: transactions.length,
        totalAmount,
        uniqueCards,
      };
    } catch (error) {
      logger.error('Error getting user velocity stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return { transactionCount: 0, totalAmount: 0, uniqueCards: 0 };
    }
  }

  /**
   * Get IP velocity statistics for a time window
   */
  private async getIPVelocityStats(
    ipAddress: string,
    windowStart: Date
  ): Promise<{
    transactionCount: number;
    totalAmount: number;
    uniqueUsers: number;
  }> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          createdAt: { gte: windowStart },
          status: { in: ['SUCCEEDED', 'PROCESSING'] },
          metadata: {
            path: ['ipAddress'],
            equals: ipAddress,
          },
        },
        select: {
          amount: true,
          userId: true,
        },
      });

      const totalAmount = transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );
      const uniqueUsers = new Set(
        transactions.map(t => t.userId).filter(Boolean)
      ).size;

      return {
        transactionCount: transactions.length,
        totalAmount,
        uniqueUsers,
      };
    } catch (error) {
      logger.error('Error getting IP velocity stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress,
      });
      return { transactionCount: 0, totalAmount: 0, uniqueUsers: 0 };
    }
  }

  /**
   * Get device velocity statistics for a time window
   */
  private async getDeviceVelocityStats(
    deviceFingerprint: string,
    windowStart: Date
  ): Promise<{
    transactionCount: number;
    totalAmount: number;
    uniqueUsers: number;
  }> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          createdAt: { gte: windowStart },
          status: { in: ['SUCCEEDED', 'PROCESSING'] },
          metadata: {
            path: ['deviceFingerprint'],
            equals: deviceFingerprint,
          },
        },
        select: {
          amount: true,
          userId: true,
        },
      });

      const totalAmount = transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );
      const uniqueUsers = new Set(
        transactions.map(t => t.userId).filter(Boolean)
      ).size;

      return {
        transactionCount: transactions.length,
        totalAmount,
        uniqueUsers,
      };
    } catch (error) {
      logger.error('Error getting device velocity stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        deviceFingerprint,
      });
      return { transactionCount: 0, totalAmount: 0, uniqueUsers: 0 };
    }
  }

  /**
   * Get payment method velocity statistics for a time window
   */
  private async getPaymentMethodVelocityStats(
    paymentMethodId: string,
    windowStart: Date
  ): Promise<{
    transactionCount: number;
    totalAmount: number;
    uniqueUsers: number;
  }> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          paymentMethodId,
          createdAt: { gte: windowStart },
          status: { in: ['SUCCEEDED', 'PROCESSING'] },
        },
        select: {
          amount: true,
          userId: true,
        },
      });

      const totalAmount = transactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );
      const uniqueUsers = new Set(
        transactions.map(t => t.userId).filter(Boolean)
      ).size;

      return {
        transactionCount: transactions.length,
        totalAmount,
        uniqueUsers,
      };
    } catch (error) {
      logger.error('Error getting payment method velocity stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentMethodId,
      });
      return { transactionCount: 0, totalAmount: 0, uniqueUsers: 0 };
    }
  }

  /**
   * Detect suspicious velocity patterns
   */
  private async detectVelocityPatterns(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      // Burst pattern detection - many transactions in very short time
      if (transaction.userId) {
        const burstWindow = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes
        const recentTransactions = await this.prisma.transaction.count({
          where: {
            userId: transaction.userId,
            createdAt: { gte: burstWindow },
            status: { in: ['SUCCEEDED', 'PROCESSING'] },
          },
        });

        if (recentTransactions >= 5) {
          signals.push({
            type: 'burst_pattern',
            value: recentTransactions,
            riskContribution: Math.min(40, recentTransactions * 5),
            description: `${recentTransactions} transactions in 5 minutes (burst pattern)`,
          });
        }
      }

      // Round amount pattern - potential testing
      const amount = Number(transaction.amount);
      if (amount > 0 && amount % 100 === 0 && amount <= 1000) {
        signals.push({
          type: 'round_amount_pattern',
          value: amount,
          riskContribution: 15,
          description: 'Round amount potentially indicating card testing',
        });
      }

      // Micro transaction pattern - card testing
      if (amount < 1) {
        signals.push({
          type: 'micro_transaction_pattern',
          value: amount,
          riskContribution: 30,
          description: 'Micro transaction potentially indicating card testing',
        });
      }

      // Escalating amount pattern
      if (transaction.userId) {
        const escalationSignal = await this.detectAmountEscalation(transaction);
        if (escalationSignal) {
          signals.push(escalationSignal);
        }
      }

      return signals;
    } catch (error) {
      logger.error('Error detecting velocity patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  /**
   * Analyze behavioral velocity patterns
   */
  private async analyzeBehavioralVelocity(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      if (!transaction.userId) {
        return signals;
      }

      // Get user's historical transaction pattern
      const historicalPattern = await this.getUserHistoricalPattern(
        transaction.userId
      );

      // Compare current velocity with historical pattern
      const currentVelocity = await this.getCurrentVelocity(transaction.userId);

      if (historicalPattern.avgDailyTransactions > 0) {
        const velocityRatio =
          currentVelocity.dailyTransactions /
          historicalPattern.avgDailyTransactions;

        if (velocityRatio > 3) {
          signals.push({
            type: 'behavioral_velocity_anomaly',
            value: velocityRatio,
            riskContribution: Math.min(35, velocityRatio * 10),
            description: `Transaction velocity ${velocityRatio.toFixed(1)}x higher than historical average`,
          });
        }
      }

      // Time-of-day analysis
      const transactionHour = new Date(
        transaction.createdAt || new Date()
      ).getHours();
      if (historicalPattern.commonHours.length > 0) {
        const isUnusualTime =
          !historicalPattern.commonHours.includes(transactionHour);

        if (isUnusualTime) {
          signals.push({
            type: 'unusual_time_pattern',
            value: transactionHour,
            riskContribution: 10,
            description: `Transaction at unusual time (${transactionHour}:00) for this user`,
          });
        }
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing behavioral velocity', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  /**
   * Detect amount escalation pattern
   */
  private async detectAmountEscalation(
    transaction: Transaction
  ): Promise<FraudSignal | null> {
    try {
      const recentTransactions = await this.prisma.transaction.findMany({
        where: {
          userId: transaction.userId,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24 hours
          status: { in: ['SUCCEEDED', 'PROCESSING'] },
        },
        orderBy: { createdAt: 'asc' },
        select: { amount: true, createdAt: true },
      });

      if (recentTransactions.length < 3) {
        return null;
      }

      // Check if amounts are escalating
      let isEscalating = true;
      for (let i = 1; i < recentTransactions.length; i++) {
        if (
          Number(recentTransactions[i].amount) <=
          Number(recentTransactions[i - 1].amount)
        ) {
          isEscalating = false;
          break;
        }
      }

      if (isEscalating) {
        const firstAmount = Number(recentTransactions[0].amount);
        const lastAmount = Number(
          recentTransactions[recentTransactions.length - 1].amount
        );
        const escalationRatio = lastAmount / firstAmount;

        if (escalationRatio > 2) {
          return {
            type: 'amount_escalation_pattern',
            value: escalationRatio,
            riskContribution: Math.min(25, escalationRatio * 5),
            description: `Amount escalation pattern detected (${escalationRatio.toFixed(1)}x increase)`,
          };
        }
      }

      return null;
    } catch (error) {
      logger.error('Error detecting amount escalation', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: transaction.userId,
      });
      return null;
    }
  }

  /**
   * Get user's historical transaction pattern
   */
  private async getUserHistoricalPattern(userId: string): Promise<{
    avgDailyTransactions: number;
    avgTransactionAmount: number;
    commonHours: number[];
  }> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
          status: 'SUCCEEDED',
        },
        select: {
          amount: true,
          createdAt: true,
        },
      });

      if (transactions.length === 0) {
        return {
          avgDailyTransactions: 0,
          avgTransactionAmount: 0,
          commonHours: [],
        };
      }

      const avgDailyTransactions = transactions.length / 30;
      const avgTransactionAmount =
        transactions.reduce((sum, t) => sum + Number(t.amount), 0) /
        transactions.length;

      // Find common transaction hours
      const hourCounts: Record<number, number> = {};
      transactions.forEach(t => {
        const hour = new Date(t.createdAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const commonHours = Object.entries(hourCounts)
        .filter(([, count]) => count >= 2)
        .map(([hour]) => parseInt(hour));

      return {
        avgDailyTransactions,
        avgTransactionAmount,
        commonHours,
      };
    } catch (error) {
      logger.error('Error getting user historical pattern', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return {
        avgDailyTransactions: 0,
        avgTransactionAmount: 0,
        commonHours: [],
      };
    }
  }

  /**
   * Get current velocity for user
   */
  private async getCurrentVelocity(userId: string): Promise<{
    dailyTransactions: number;
    hourlyTransactions: number;
  }> {
    try {
      const now = new Date();
      const dayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const hourStart = new Date(now.getTime() - 60 * 60 * 1000);

      const [dailyCount, hourlyCount] = await Promise.all([
        this.prisma.transaction.count({
          where: {
            userId,
            createdAt: { gte: dayStart },
            status: { in: ['SUCCEEDED', 'PROCESSING'] },
          },
        }),
        this.prisma.transaction.count({
          where: {
            userId,
            createdAt: { gte: hourStart },
            status: { in: ['SUCCEEDED', 'PROCESSING'] },
          },
        }),
      ]);

      return {
        dailyTransactions: dailyCount,
        hourlyTransactions: hourlyCount,
      };
    } catch (error) {
      logger.error('Error getting current velocity', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return { dailyTransactions: 0, hourlyTransactions: 0 };
    }
  }

  /**
   * Calculate risk score based on velocity violations
   */
  private calculateVelocityRiskScore(velocityCheck: VelocityCheck): number {
    let riskScore = 0;

    // Base score for any violation
    if (velocityCheck.isViolation) {
      riskScore += 20;
    }

    // Additional score based on number of violated windows
    riskScore += velocityCheck.violatedWindows.length * 10;

    // Additional score for short time windows (more suspicious)
    const shortWindowViolations = velocityCheck.violatedWindows.filter(
      w => w <= 15
    ).length;
    riskScore += shortWindowViolations * 15;

    return Math.min(50, riskScore);
  }
}
