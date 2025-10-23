import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { FraudSignal } from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface BehavioralProfile {
  userId: string;
  transactionPatterns: {
    avgAmount: number;
    commonAmounts: number[];
    avgTransactionsPerDay: number;
    commonTimeWindows: Array<{ start: number; end: number }>;
    commonDaysOfWeek: number[];
    preferredCurrencies: string[];
    avgTimeBetweenTransactions: number;
  };
  paymentPatterns: {
    preferredMethods: string[];
    methodSwitchFrequency: number;
    newMethodAdoptionRate: number;
  };
  locationPatterns: {
    commonCountries: string[];
    commonCities: string[];
    locationStability: number;
    travelFrequency: number;
  };
  devicePatterns: {
    commonDevices: string[];
    deviceSwitchFrequency: number;
    newDeviceAdoptionRate: number;
  };
  riskMetrics: {
    avgRiskScore: number;
    riskTrend: 'increasing' | 'decreasing' | 'stable';
    fraudIncidents: number;
    lastFraudDate?: Date;
  };
  profileConfidence: number;
  lastUpdated: Date;
}

export interface BehavioralAnomaly {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedValue: any;
  actualValue: any;
  deviationScore: number;
  confidence: number;
}

export interface BehavioralAnalysisConfig {
  enablePatternLearning: boolean;
  enableAnomalyDetection: boolean;
  enableRiskTrending: boolean;
  minTransactionsForProfile: number;
  profileUpdateFrequencyDays: number;
  anomalyThresholds: {
    amount: number;
    frequency: number;
    timing: number;
    location: number;
    device: number;
  };
  learningPeriodDays: number;
}

export class BehavioralPatternDetectionService {
  private prisma: PrismaClient;
  private config: BehavioralAnalysisConfig;
  private profileCache: Map<string, BehavioralProfile> = new Map();

  constructor(prisma: PrismaClient, config: BehavioralAnalysisConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Analyze behavioral patterns for fraud signals
   */
  async analyzeBehavioralPatterns(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      if (!transaction.userId) {
        return signals;
      }

      logger.info('Analyzing behavioral patterns', {
        transactionId: transaction.id,
        userId: transaction.userId,
      });

      // Get or build user behavioral profile
      const profile = await this.getUserBehavioralProfile(transaction.userId);

      if (!profile || profile.profileConfidence < 0.5) {
        // Not enough data for reliable behavioral analysis
        signals.push({
          type: 'insufficient_behavioral_data',
          value: profile?.profileConfidence || 0,
          riskContribution: 5,
          description:
            'Insufficient transaction history for behavioral analysis',
        });
        return signals;
      }

      // Detect behavioral anomalies
      const anomalies = await this.detectBehavioralAnomalies(
        transaction,
        profile
      );

      // Convert anomalies to fraud signals
      for (const anomaly of anomalies) {
        const riskContribution = this.calculateAnomalyRiskContribution(anomaly);

        signals.push({
          type: `behavioral_${anomaly.type}`,
          value: {
            expected: anomaly.expectedValue,
            actual: anomaly.actualValue,
            deviation: anomaly.deviationScore,
          },
          riskContribution,
          description: anomaly.description,
        });
      }

      // Pattern-based signals
      const patternSignals = await this.analyzeSpecificPatterns(
        transaction,
        profile
      );
      signals.push(...patternSignals);

      logger.info('Behavioral analysis completed', {
        transactionId: transaction.id,
        userId: transaction.userId,
        anomaliesFound: anomalies.length,
        totalSignals: signals.length,
      });

      return signals;
    } catch (error) {
      logger.error('Error analyzing behavioral patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
        userId: transaction.userId,
      });
      return signals;
    }
  }

  /**
   * Get or build user behavioral profile
   */
  async getUserBehavioralProfile(
    userId: string
  ): Promise<BehavioralProfile | null> {
    try {
      // Check cache first
      const cachedProfile = this.profileCache.get(userId);
      if (cachedProfile && this.isProfileFresh(cachedProfile)) {
        return cachedProfile;
      }

      // Build profile from transaction history
      const profile = await this.buildBehavioralProfile(userId);

      if (profile) {
        this.profileCache.set(userId, profile);
      }

      return profile;
    } catch (error) {
      logger.error('Error getting behavioral profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return null;
    }
  }

  /**
   * Build behavioral profile from transaction history
   */
  private async buildBehavioralProfile(
    userId: string
  ): Promise<BehavioralProfile | null> {
    try {
      const learningPeriodStart = new Date();
      learningPeriodStart.setDate(
        learningPeriodStart.getDate() - this.config.learningPeriodDays
      );

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          createdAt: { gte: learningPeriodStart },
          status: 'SUCCEEDED',
        },
        orderBy: { createdAt: 'asc' },
        select: {
          amount: true,
          currency: true,
          paymentMethodId: true,
          createdAt: true,
          metadata: true,
          riskScore: true,
          fraudFlags: true,
        },
      });

      if (transactions.length < this.config.minTransactionsForProfile) {
        return null;
      }

      // Analyze transaction patterns
      const transactionPatterns = this.analyzeTransactionPatterns(transactions);
      const paymentPatterns = this.analyzePaymentPatterns(transactions);
      const locationPatterns = this.analyzeLocationPatterns(transactions);
      const devicePatterns = this.analyzeDevicePatterns(transactions);
      const riskMetrics = this.analyzeRiskMetrics(transactions);

      // Calculate profile confidence based on data quality and quantity
      const profileConfidence = this.calculateProfileConfidence(transactions);

      const profile: BehavioralProfile = {
        userId,
        transactionPatterns,
        paymentPatterns,
        locationPatterns,
        devicePatterns,
        riskMetrics,
        profileConfidence,
        lastUpdated: new Date(),
      };

      return profile;
    } catch (error) {
      logger.error('Error building behavioral profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return null;
    }
  }

  /**
   * Detect behavioral anomalies
   */
  private async detectBehavioralAnomalies(
    transaction: Transaction,
    profile: BehavioralProfile
  ): Promise<BehavioralAnomaly[]> {
    const anomalies: BehavioralAnomaly[] = [];

    try {
      // Amount anomaly detection
      const amountAnomaly = this.detectAmountAnomaly(transaction, profile);
      if (amountAnomaly) anomalies.push(amountAnomaly);

      // Timing anomaly detection
      const timingAnomaly = this.detectTimingAnomaly(transaction, profile);
      if (timingAnomaly) anomalies.push(timingAnomaly);

      // Frequency anomaly detection
      const frequencyAnomaly = await this.detectFrequencyAnomaly(
        transaction,
        profile
      );
      if (frequencyAnomaly) anomalies.push(frequencyAnomaly);

      // Location anomaly detection
      const locationAnomaly = this.detectLocationAnomaly(transaction, profile);
      if (locationAnomaly) anomalies.push(locationAnomaly);

      // Device anomaly detection
      const deviceAnomaly = this.detectDeviceAnomaly(transaction, profile);
      if (deviceAnomaly) anomalies.push(deviceAnomaly);

      // Payment method anomaly detection
      const paymentAnomaly = this.detectPaymentMethodAnomaly(
        transaction,
        profile
      );
      if (paymentAnomaly) anomalies.push(paymentAnomaly);

      return anomalies;
    } catch (error) {
      logger.error('Error detecting behavioral anomalies', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  /**
   * Detect amount-based anomalies
   */
  private detectAmountAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): BehavioralAnomaly | null {
    const amount = Number(transaction.amount);
    const avgAmount = profile.transactionPatterns.avgAmount;

    // Calculate deviation from average
    const deviation = Math.abs(amount - avgAmount) / avgAmount;

    if (deviation > this.config.anomalyThresholds.amount) {
      return {
        type: 'amount_anomaly',
        severity: deviation > 2 ? 'high' : deviation > 1 ? 'medium' : 'low',
        description: `Transaction amount (${amount}) deviates significantly from user's average (${avgAmount.toFixed(2)})`,
        expectedValue: avgAmount,
        actualValue: amount,
        deviationScore: deviation,
        confidence: Math.min(0.95, profile.profileConfidence + 0.1),
      };
    }

    return null;
  }

  /**
   * Detect timing-based anomalies
   */
  private detectTimingAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): BehavioralAnomaly | null {
    const transactionTime = new Date(transaction.createdAt || new Date());
    const hour = transactionTime.getHours();
    const dayOfWeek = transactionTime.getDay();

    // Check if time is within common windows
    const isCommonTime = profile.transactionPatterns.commonTimeWindows.some(
      window => hour >= window.start && hour <= window.end
    );

    // Check if day is common
    const isCommonDay =
      profile.transactionPatterns.commonDaysOfWeek.includes(dayOfWeek);

    if (!isCommonTime || !isCommonDay) {
      const severity = !isCommonTime && !isCommonDay ? 'high' : 'medium';

      return {
        type: 'timing_anomaly',
        severity,
        description: `Transaction at unusual time (${hour}:00 on day ${dayOfWeek}) for this user`,
        expectedValue: {
          commonHours: profile.transactionPatterns.commonTimeWindows,
          commonDays: profile.transactionPatterns.commonDaysOfWeek,
        },
        actualValue: { hour, dayOfWeek },
        deviationScore: (!isCommonTime ? 0.5 : 0) + (!isCommonDay ? 0.5 : 0),
        confidence: profile.profileConfidence,
      };
    }

    return null;
  }

  /**
   * Detect frequency-based anomalies
   */
  private async detectFrequencyAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): Promise<BehavioralAnomaly | null> {
    try {
      // Get recent transaction count
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      const todayTransactionCount = await this.prisma.transaction.count({
        where: {
          userId: transaction.userId,
          createdAt: { gte: dayStart },
          status: 'SUCCEEDED',
        },
      });

      const expectedDailyCount =
        profile.transactionPatterns.avgTransactionsPerDay;
      const deviation =
        Math.abs(todayTransactionCount - expectedDailyCount) /
        Math.max(1, expectedDailyCount);

      if (deviation > this.config.anomalyThresholds.frequency) {
        return {
          type: 'frequency_anomaly',
          severity: deviation > 3 ? 'high' : deviation > 2 ? 'medium' : 'low',
          description: `Daily transaction frequency (${todayTransactionCount}) deviates from user's average (${expectedDailyCount.toFixed(1)})`,
          expectedValue: expectedDailyCount,
          actualValue: todayTransactionCount,
          deviationScore: deviation,
          confidence: profile.profileConfidence,
        };
      }

      return null;
    } catch (error) {
      logger.error('Error detecting frequency anomaly', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Detect location-based anomalies
   */
  private detectLocationAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): BehavioralAnomaly | null {
    const geolocation = transaction.metadata?.geolocation;

    if (!geolocation) {
      return null;
    }

    const country = geolocation.country;
    const city = geolocation.city;

    const isCommonCountry =
      profile.locationPatterns.commonCountries.includes(country);
    const isCommonCity = city
      ? profile.locationPatterns.commonCities.includes(city)
      : true;

    if (!isCommonCountry) {
      return {
        type: 'location_anomaly',
        severity: 'medium',
        description: `Transaction from unusual country (${country}) for this user`,
        expectedValue: profile.locationPatterns.commonCountries,
        actualValue: country,
        deviationScore: 1.0,
        confidence: profile.profileConfidence,
      };
    }

    if (!isCommonCity && city) {
      return {
        type: 'city_anomaly',
        severity: 'low',
        description: `Transaction from unusual city (${city}) for this user`,
        expectedValue: profile.locationPatterns.commonCities,
        actualValue: city,
        deviationScore: 0.5,
        confidence: profile.profileConfidence * 0.8,
      };
    }

    return null;
  }

  /**
   * Detect device-based anomalies
   */
  private detectDeviceAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): BehavioralAnomaly | null {
    const deviceFingerprint = transaction.metadata?.deviceFingerprint;

    if (!deviceFingerprint) {
      return {
        type: 'device_anomaly',
        severity: 'low',
        description: 'No device fingerprint available',
        expectedValue: 'device_fingerprint',
        actualValue: null,
        deviationScore: 0.3,
        confidence: 0.5,
      };
    }

    const isCommonDevice =
      profile.devicePatterns.commonDevices.includes(deviceFingerprint);

    if (!isCommonDevice) {
      return {
        type: 'device_anomaly',
        severity: 'medium',
        description: 'Transaction from new or unusual device',
        expectedValue: profile.devicePatterns.commonDevices,
        actualValue: deviceFingerprint,
        deviationScore: 0.8,
        confidence: profile.profileConfidence,
      };
    }

    return null;
  }

  /**
   * Detect payment method anomalies
   */
  private detectPaymentMethodAnomaly(
    transaction: Transaction,
    profile: BehavioralProfile
  ): BehavioralAnomaly | null {
    if (!transaction.paymentMethodId) {
      return null;
    }

    const isPreferredMethod = profile.paymentPatterns.preferredMethods.includes(
      transaction.paymentMethodId
    );

    if (!isPreferredMethod) {
      return {
        type: 'payment_method_anomaly',
        severity: 'low',
        description: 'Transaction using unusual payment method for this user',
        expectedValue: profile.paymentPatterns.preferredMethods,
        actualValue: transaction.paymentMethodId,
        deviationScore: 0.4,
        confidence: profile.profileConfidence,
      };
    }

    return null;
  }

  /**
   * Analyze specific behavioral patterns
   */
  private async analyzeSpecificPatterns(
    transaction: Transaction,
    profile: BehavioralProfile
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      // Escalating risk pattern
      if (profile.riskMetrics.riskTrend === 'increasing') {
        signals.push({
          type: 'escalating_risk_pattern',
          value: profile.riskMetrics.avgRiskScore,
          riskContribution: 15,
          description:
            'User shows escalating risk pattern in recent transactions',
        });
      }

      // Recent fraud history
      if (profile.riskMetrics.lastFraudDate) {
        const daysSinceLastFraud =
          (Date.now() - profile.riskMetrics.lastFraudDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (daysSinceLastFraud < 30) {
          signals.push({
            type: 'recent_fraud_history',
            value: Math.round(daysSinceLastFraud),
            riskContribution: Math.max(5, 30 - daysSinceLastFraud),
            description: `User had fraud incident ${Math.round(daysSinceLastFraud)} days ago`,
          });
        }
      }

      // Rapid behavior change
      const behaviorChangeSignal = await this.detectRapidBehaviorChange(
        transaction.userId!,
        profile
      );
      if (behaviorChangeSignal) {
        signals.push(behaviorChangeSignal);
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing specific patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  /**
   * Detect rapid behavior change
   */
  private async detectRapidBehaviorChange(
    userId: string,
    profile: BehavioralProfile
  ): Promise<FraudSignal | null> {
    try {
      // Get very recent transactions (last 7 days)
      const recentStart = new Date();
      recentStart.setDate(recentStart.getDate() - 7);

      const recentTransactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          createdAt: { gte: recentStart },
          status: 'SUCCEEDED',
        },
        select: {
          amount: true,
          createdAt: true,
          metadata: true,
        },
      });

      if (recentTransactions.length < 3) {
        return null;
      }

      // Calculate recent patterns
      const recentAvgAmount =
        recentTransactions.reduce((sum, t) => sum + Number(t.amount), 0) /
        recentTransactions.length;
      const recentCountries = new Set(
        recentTransactions
          .map(t => t.metadata?.geolocation?.country)
          .filter(Boolean)
      );

      // Compare with historical patterns
      const amountChange =
        Math.abs(recentAvgAmount - profile.transactionPatterns.avgAmount) /
        profile.transactionPatterns.avgAmount;
      const locationChange =
        recentCountries.size > profile.locationPatterns.commonCountries.length;

      if (amountChange > 1.5 || locationChange) {
        return {
          type: 'rapid_behavior_change',
          value: {
            amountChange: amountChange.toFixed(2),
            newLocations: recentCountries.size,
          },
          riskContribution: 20,
          description:
            'User behavior has changed rapidly in recent transactions',
        };
      }

      return null;
    } catch (error) {
      logger.error('Error detecting rapid behavior change', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return null;
    }
  }

  /**
   * Helper methods for pattern analysis
   */
  private analyzeTransactionPatterns(
    transactions: any[]
  ): BehavioralProfile['transactionPatterns'] {
    const amounts = transactions.map(t => Number(t.amount));
    const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

    // Find common amounts (amounts that appear more than once)
    const amountCounts = new Map<number, number>();
    amounts.forEach(amount => {
      amountCounts.set(amount, (amountCounts.get(amount) || 0) + 1);
    });
    const commonAmounts = Array.from(amountCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([amount]) => amount)
      .slice(0, 5);

    // Calculate daily transaction average
    const daySpan =
      (transactions[transactions.length - 1].createdAt.getTime() -
        transactions[0].createdAt.getTime()) /
      (1000 * 60 * 60 * 24);
    const avgTransactionsPerDay = transactions.length / Math.max(1, daySpan);

    // Find common time windows
    const hourCounts = new Map<number, number>();
    transactions.forEach(t => {
      const hour = new Date(t.createdAt).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const commonHours = Array.from(hourCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([hour]) => hour)
      .sort((a, b) => a - b);

    const commonTimeWindows = this.groupConsecutiveHours(commonHours);

    // Find common days of week
    const dayOfWeekCounts = new Map<number, number>();
    transactions.forEach(t => {
      const day = new Date(t.createdAt).getDay();
      dayOfWeekCounts.set(day, (dayOfWeekCounts.get(day) || 0) + 1);
    });

    const commonDaysOfWeek = Array.from(dayOfWeekCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([day]) => day);

    // Find preferred currencies
    const currencyCounts = new Map<string, number>();
    transactions.forEach(t => {
      currencyCounts.set(t.currency, (currencyCounts.get(t.currency) || 0) + 1);
    });

    const preferredCurrencies = Array.from(currencyCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([currency]) => currency);

    // Calculate average time between transactions
    let totalTimeBetween = 0;
    for (let i = 1; i < transactions.length; i++) {
      totalTimeBetween +=
        transactions[i].createdAt.getTime() -
        transactions[i - 1].createdAt.getTime();
    }
    const avgTimeBetweenTransactions =
      transactions.length > 1
        ? totalTimeBetween / (transactions.length - 1)
        : 0;

    return {
      avgAmount,
      commonAmounts,
      avgTransactionsPerDay,
      commonTimeWindows,
      commonDaysOfWeek,
      preferredCurrencies,
      avgTimeBetweenTransactions,
    };
  }

  private analyzePaymentPatterns(
    transactions: any[]
  ): BehavioralProfile['paymentPatterns'] {
    const methodCounts = new Map<string, number>();
    const methodSwitches = new Set<string>();
    let lastMethod: string | null = null;

    transactions.forEach(t => {
      if (t.paymentMethodId) {
        methodCounts.set(
          t.paymentMethodId,
          (methodCounts.get(t.paymentMethodId) || 0) + 1
        );

        if (lastMethod && lastMethod !== t.paymentMethodId) {
          methodSwitches.add(`${lastMethod}->${t.paymentMethodId}`);
        }
        lastMethod = t.paymentMethodId;
      }
    });

    const preferredMethods = Array.from(methodCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([method]) => method);

    const methodSwitchFrequency =
      methodSwitches.size / Math.max(1, transactions.length - 1);
    const newMethodAdoptionRate =
      methodCounts.size / Math.max(1, transactions.length);

    return {
      preferredMethods,
      methodSwitchFrequency,
      newMethodAdoptionRate,
    };
  }

  private analyzeLocationPatterns(
    transactions: any[]
  ): BehavioralProfile['locationPatterns'] {
    const countryCounts = new Map<string, number>();
    const cityCounts = new Map<string, number>();
    const locations = new Set<string>();

    transactions.forEach(t => {
      const geolocation = t.metadata?.geolocation;
      if (geolocation) {
        if (geolocation.country) {
          countryCounts.set(
            geolocation.country,
            (countryCounts.get(geolocation.country) || 0) + 1
          );
          locations.add(geolocation.country);
        }
        if (geolocation.city) {
          cityCounts.set(
            geolocation.city,
            (cityCounts.get(geolocation.city) || 0) + 1
          );
          locations.add(`${geolocation.city}, ${geolocation.country}`);
        }
      }
    });

    const commonCountries = Array.from(countryCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([country]) => country);

    const commonCities = Array.from(cityCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([city]) => city);

    const locationStability =
      commonCountries.length > 0 ? 1 / commonCountries.length : 0;
    const travelFrequency = locations.size / Math.max(1, transactions.length);

    return {
      commonCountries,
      commonCities,
      locationStability,
      travelFrequency,
    };
  }

  private analyzeDevicePatterns(
    transactions: any[]
  ): BehavioralProfile['devicePatterns'] {
    const deviceCounts = new Map<string, number>();
    const deviceSwitches = new Set<string>();
    let lastDevice: string | null = null;

    transactions.forEach(t => {
      const device = t.metadata?.deviceFingerprint;
      if (device) {
        deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1);

        if (lastDevice && lastDevice !== device) {
          deviceSwitches.add(`${lastDevice}->${device}`);
        }
        lastDevice = device;
      }
    });

    const commonDevices = Array.from(deviceCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([device]) => device);

    const deviceSwitchFrequency =
      deviceSwitches.size / Math.max(1, transactions.length - 1);
    const newDeviceAdoptionRate =
      deviceCounts.size / Math.max(1, transactions.length);

    return {
      commonDevices,
      deviceSwitchFrequency,
      newDeviceAdoptionRate,
    };
  }

  private analyzeRiskMetrics(
    transactions: any[]
  ): BehavioralProfile['riskMetrics'] {
    const riskScores = transactions
      .map(t => t.riskScore)
      .filter(score => score !== null && score !== undefined);

    const avgRiskScore =
      riskScores.length > 0
        ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length
        : 0;

    // Calculate risk trend
    let riskTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (riskScores.length >= 5) {
      const firstHalf = riskScores.slice(0, Math.floor(riskScores.length / 2));
      const secondHalf = riskScores.slice(Math.floor(riskScores.length / 2));

      const firstHalfAvg =
        firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
      const secondHalfAvg =
        secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

      const trendDiff = secondHalfAvg - firstHalfAvg;
      if (trendDiff > 5) riskTrend = 'increasing';
      else if (trendDiff < -5) riskTrend = 'decreasing';
    }

    const fraudTransactions = transactions.filter(
      t => t.fraudFlags && t.fraudFlags.length > 0
    );
    const fraudCount = fraudTransactions.length;
    const lastFraudDate =
      fraudTransactions.length > 0
        ? new Date(
            Math.max(
              ...fraudTransactions.map(t => new Date(t.createdAt).getTime())
            )
          )
        : undefined;

    return {
      avgRiskScore,
      riskTrend,
      fraudIncidents: fraudCount,
      lastFraudDate,
    };
  }

  private calculateProfileConfidence(transactions: any[]): number {
    let confidence = 0;

    // Base confidence from transaction count
    confidence += Math.min(0.5, transactions.length / 20);

    // Time span confidence
    const timeSpanDays =
      (transactions[transactions.length - 1].createdAt.getTime() -
        transactions[0].createdAt.getTime()) /
      (1000 * 60 * 60 * 24);
    confidence += Math.min(0.3, timeSpanDays / 30);

    // Data quality confidence
    const hasLocationData = transactions.some(t => t.metadata?.geolocation);
    const hasDeviceData = transactions.some(t => t.metadata?.deviceFingerprint);

    if (hasLocationData) confidence += 0.1;
    if (hasDeviceData) confidence += 0.1;

    return Math.min(1.0, confidence);
  }

  private calculateAnomalyRiskContribution(anomaly: BehavioralAnomaly): number {
    let baseRisk = 0;

    switch (anomaly.severity) {
      case 'critical':
        baseRisk = 40;
        break;
      case 'high':
        baseRisk = 30;
        break;
      case 'medium':
        baseRisk = 20;
        break;
      case 'low':
        baseRisk = 10;
        break;
    }

    // Adjust by confidence and deviation score
    return Math.round(
      baseRisk * anomaly.confidence * Math.min(1, anomaly.deviationScore)
    );
  }

  private groupConsecutiveHours(
    hours: number[]
  ): Array<{ start: number; end: number }> {
    if (hours.length === 0) return [];

    const windows: Array<{ start: number; end: number }> = [];
    let start = hours[0];
    let end = hours[0];

    for (let i = 1; i < hours.length; i++) {
      if (hours[i] === end + 1) {
        end = hours[i];
      } else {
        windows.push({ start, end });
        start = hours[i];
        end = hours[i];
      }
    }

    windows.push({ start, end });
    return windows;
  }

  private isProfileFresh(profile: BehavioralProfile): boolean {
    const ageHours =
      (Date.now() - profile.lastUpdated.getTime()) / (1000 * 60 * 60);
    return ageHours < this.config.profileUpdateFrequencyDays * 24;
  }

  /**
   * Update behavioral profile after transaction
   */
  async updateBehavioralProfile(
    userId: string,
    transaction: Transaction,
    isFraud: boolean
  ): Promise<void> {
    try {
      // Remove from cache to force rebuild on next access
      this.profileCache.delete(userId);

      logger.info('Behavioral profile updated', {
        userId,
        transactionId: transaction.id,
        isFraud,
      });
    } catch (error) {
      logger.error('Error updating behavioral profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }

  /**
   * Get behavioral analysis statistics
   */
  async getBehavioralStatistics(days: number = 30): Promise<{
    profilesAnalyzed: number;
    anomaliesDetected: number;
    topAnomalyTypes: Array<{ type: string; count: number }>;
    avgProfileConfidence: number;
    behavioralFraudCases: number;
  }> {
    try {
      // This would typically query a behavioral analysis log
      // For now, return mock statistics
      return {
        profilesAnalyzed: 1500,
        anomaliesDetected: 450,
        topAnomalyTypes: [
          { type: 'amount_anomaly', count: 120 },
          { type: 'timing_anomaly', count: 95 },
          { type: 'location_anomaly', count: 80 },
          { type: 'device_anomaly', count: 75 },
          { type: 'frequency_anomaly', count: 50 },
        ],
        avgProfileConfidence: 0.78,
        behavioralFraudCases: 35,
      };
    } catch (error) {
      logger.error('Error getting behavioral statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
