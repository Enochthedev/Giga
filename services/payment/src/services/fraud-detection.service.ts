import { logger } from '../lib/logger';
import {
  BlacklistEntry,
  FraudAction,
  FraudAssessment,
  FraudRule,
  FraudRuleEvaluation,
  FraudSignal,
  Geolocation,
  RiskLevel,
  VelocityCheck,
  WhitelistEntry,
} from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface FraudDetectionConfig {
  defaultRiskThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  velocityLimits: {
    transactionCount: { [key: number]: number };
    amount: { [key: number]: number };
  };
  geolocationChecks: {
    enabled: boolean;
    vpnDetection: boolean;
    countryBlacklist: string[];
  };
  mlModelEnabled: boolean;
}

export class FraudDetectionService {
  private config: FraudDetectionConfig;
  private rules: Map<string, FraudRule> = new Map();
  private blacklist: Map<string, BlacklistEntry[]> = new Map();
  private whitelist: Map<string, WhitelistEntry[]> = new Map();

  constructor(config: FraudDetectionConfig) {
    this.config = config;
    this.initializeDefaultRules();
  }

  /**
   * Analyze a transaction for fraud indicators
   */
  async analyzeTransaction(transaction: Transaction): Promise<FraudAssessment> {
    const assessmentId = this.generateAssessmentId();
    const signals: FraudSignal[] = [];
    const ruleEvaluations: FraudRuleEvaluation[] = [];

    try {
      logger.info(`Starting fraud analysis for transaction ${transaction.id}`, {
        transactionId: transaction.id,
        assessmentId,
      });

      // Check whitelist first
      const whitelistResult = await this.checkWhitelist(transaction);
      if (whitelistResult.isWhitelisted) {
        return this.createLowRiskAssessment(
          assessmentId,
          transaction.id,
          'Whitelisted entity',
          ruleEvaluations,
          signals
        );
      }

      // Check blacklist
      const blacklistResult = await this.checkBlacklist(transaction);
      if (blacklistResult.isBlacklisted) {
        signals.push({
          type: 'blacklist_match',
          value: blacklistResult.matches,
          riskContribution: 100,
          description: 'Transaction matches blacklisted entity',
        });

        return this.createHighRiskAssessment(
          assessmentId,
          transaction.id,
          'Blacklisted entity detected',
          ruleEvaluations,
          signals
        );
      }

      // Velocity checks
      const velocityResult = await this.checkVelocity(transaction);
      if (velocityResult.isViolation) {
        signals.push({
          type: 'velocity_violation',
          value: velocityResult.violatedWindows,
          riskContribution: 40,
          description: 'Transaction velocity limits exceeded',
        });
      }

      // Amount-based checks
      const amountSignals = await this.checkAmount(transaction);
      signals.push(...amountSignals);

      // Geolocation checks
      if (this.config.geolocationChecks.enabled) {
        const geoSignals = await this.checkGeolocation(transaction);
        signals.push(...geoSignals);
      }

      // Device fingerprint checks
      const deviceSignals = await this.checkDeviceFingerprint(transaction);
      signals.push(...deviceSignals);

      // Evaluate custom rules
      const activeRules = Array.from(this.rules.values()).filter(rule => rule.isActive);
      for (const rule of activeRules) {
        const evaluation = await this.evaluateRule(rule, transaction);
        ruleEvaluations.push(evaluation);

        if (evaluation.matched) {
          signals.push({
            type: `rule_${rule.type}`,
            value: rule.name,
            riskContribution: evaluation.riskScore,
            description: rule.description || `Rule ${rule.name} triggered`,
          });
        }
      }

      // Calculate composite risk score
      const riskScore = this.calculateRiskScore(signals, ruleEvaluations);
      const riskLevel = this.determineRiskLevel(riskScore);
      const recommendation = this.getRecommendation(riskLevel, riskScore);

      const assessment: FraudAssessment = {
        id: assessmentId,
        transactionId: transaction.id,
        riskScore,
        riskLevel,
        recommendation,
        ruleEvaluations,
        signals,
        deviceFingerprint: transaction.metadata?.deviceFingerprint,
        ipAddress: transaction.metadata?.ipAddress,
        geolocation: transaction.metadata?.geolocation,
        assessedAt: new Date(),
      };

      logger.info(`Fraud analysis completed for transaction ${transaction.id}`, {
        transactionId: transaction.id,
        assessmentId,
        riskScore,
        riskLevel,
        recommendation,
        signalCount: signals.length,
      });

      return assessment;

    } catch (error) {
      logger.error(`Error during fraud analysis for transaction ${transaction.id}`, {
        transactionId: transaction.id,
        assessmentId,
        error: error.message,
      });

      // Return medium risk assessment on error to be safe
      return this.createMediumRiskAssessment(
        assessmentId,
        transaction.id,
        'Error during fraud analysis',
        ruleEvaluations,
        signals
      );
    }
  }

  /**
   * Check if transaction matches any blacklist entries
   */
  private async checkBlacklist(transaction: Transaction): Promise<{
    isBlacklisted: boolean;
    matches: string[];
  }> {
    const matches: string[] = [];

    // Check user blacklist
    const userBlacklist = this.blacklist.get('user') || [];
    if (userBlacklist.some(entry =>
      entry.isActive && entry.value === transaction.userId
    )) {
      matches.push('user');
    }

    // Check email blacklist
    if (transaction.metadata?.email) {
      const emailBlacklist = this.blacklist.get('email') || [];
      if (emailBlacklist.some(entry =>
        entry.isActive && entry.value === transaction.metadata.email
      )) {
        matches.push('email');
      }
    }

    // Check IP blacklist
    if (transaction.metadata?.ipAddress) {
      const ipBlacklist = this.blacklist.get('ip') || [];
      if (ipBlacklist.some(entry =>
        entry.isActive && entry.value === transaction.metadata.ipAddress
      )) {
        matches.push('ip');
      }
    }

    // Check device blacklist
    if (transaction.metadata?.deviceFingerprint) {
      const deviceBlacklist = this.blacklist.get('device') || [];
      if (deviceBlacklist.some(entry =>
        entry.isActive && entry.value === transaction.metadata.deviceFingerprint
      )) {
        matches.push('device');
      }
    }

    return {
      isBlacklisted: matches.length > 0,
      matches,
    };
  }

  /**
   * Check if transaction matches any whitelist entries
   */
  private async checkWhitelist(transaction: Transaction): Promise<{
    isWhitelisted: boolean;
    matches: string[];
  }> {
    const matches: string[] = [];

    // Check user whitelist
    const userWhitelist = this.whitelist.get('user') || [];
    if (userWhitelist.some(entry =>
      entry.isActive && entry.value === transaction.userId
    )) {
      matches.push('user');
    }

    // Check merchant whitelist
    if (transaction.metadata?.merchantId) {
      const merchantWhitelist = this.whitelist.get('merchant') || [];
      if (merchantWhitelist.some(entry =>
        entry.isActive && entry.value === transaction.metadata.merchantId
      )) {
        matches.push('merchant');
      }
    }

    return {
      isWhitelisted: matches.length > 0,
      matches,
    };
  }

  /**
   * Check transaction velocity limits
   */
  private async checkVelocity(transaction: Transaction): Promise<VelocityCheck> {
    const timeWindows = [5, 15, 60, 1440]; // 5min, 15min, 1hr, 24hr
    const velocityCheck: VelocityCheck = {
      userId: transaction.userId,
      ipAddress: transaction.metadata?.ipAddress,
      deviceFingerprint: transaction.metadata?.deviceFingerprint,
      paymentMethodId: transaction.paymentMethodId,
      timeWindows,
      transactionCountLimit: 10,
      amountLimit: 10000,
      transactionCounts: {},
      amounts: {},
      isViolation: false,
      violatedWindows: [],
    };

    // In a real implementation, this would query the database
    // For now, we'll simulate some basic velocity checks
    for (const window of timeWindows) {
      const configLimit = this.config.velocityLimits.transactionCount[window];
      const amountLimit = this.config.velocityLimits.amount[window];

      // Simulate transaction count and amount for this window
      const transactionCount = Math.floor(Math.random() * 15);
      const totalAmount = Math.floor(Math.random() * 15000);

      velocityCheck.transactionCounts[window] = transactionCount;
      velocityCheck.amounts[window] = totalAmount;

      if (transactionCount > (configLimit || velocityCheck.transactionCountLimit) ||
        totalAmount > (amountLimit || velocityCheck.amountLimit)) {
        velocityCheck.isViolation = true;
        velocityCheck.violatedWindows.push(window);
      }
    }

    return velocityCheck;
  }

  /**
   * Check transaction amount for suspicious patterns
   */
  private async checkAmount(transaction: Transaction): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    // High amount check
    if (transaction.amount > 5000) {
      signals.push({
        type: 'high_amount',
        value: transaction.amount,
        riskContribution: Math.min(30, transaction.amount / 1000),
        description: 'Transaction amount is unusually high',
      });
    }

    // Round amount check (potential testing)
    if (transaction.amount % 100 === 0 && transaction.amount >= 1000) {
      signals.push({
        type: 'round_amount',
        value: transaction.amount,
        riskContribution: 10,
        description: 'Transaction amount is a round number',
      });
    }

    // Small amount check (potential card testing)
    if (transaction.amount < 1) {
      signals.push({
        type: 'micro_amount',
        value: transaction.amount,
        riskContribution: 25,
        description: 'Transaction amount is very small (potential card testing)',
      });
    }

    return signals;
  }

  /**
   * Check geolocation for suspicious patterns
   */
  private async checkGeolocation(transaction: Transaction): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];
    const geolocation = transaction.metadata?.geolocation as Geolocation;

    if (!geolocation) {
      return signals;
    }

    // VPN/Proxy detection
    if (this.config.geolocationChecks.vpnDetection && geolocation.isVpn) {
      signals.push({
        type: 'vpn_detected',
        value: true,
        riskContribution: 20,
        description: 'Transaction originated from VPN/Proxy',
      });
    }

    // Tor detection
    if (geolocation.isTor) {
      signals.push({
        type: 'tor_detected',
        value: true,
        riskContribution: 40,
        description: 'Transaction originated from Tor network',
      });
    }

    // Country blacklist check
    if (this.config.geolocationChecks.countryBlacklist.includes(geolocation.country)) {
      signals.push({
        type: 'blacklisted_country',
        value: geolocation.country,
        riskContribution: 35,
        description: 'Transaction originated from blacklisted country',
      });
    }

    return signals;
  }

  /**
   * Check device fingerprint for suspicious patterns
   */
  private async checkDeviceFingerprint(transaction: Transaction): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];
    const deviceFingerprint = transaction.metadata?.deviceFingerprint;

    if (!deviceFingerprint) {
      signals.push({
        type: 'missing_device_fingerprint',
        value: null,
        riskContribution: 15,
        description: 'Device fingerprint is missing',
      });
    }

    // In a real implementation, you would check for:
    // - Device reputation
    // - Multiple users from same device
    // - Device characteristics inconsistencies

    return signals;
  }

  /**
   * Evaluate a specific fraud rule against a transaction
   */
  private async evaluateRule(rule: FraudRule, transaction: Transaction): Promise<FraudRuleEvaluation> {
    let matched = true;
    const details: Record<string, any> = {};

    // Evaluate each condition in the rule
    for (const condition of rule.conditions) {
      const fieldValue = this.getFieldValue(transaction, condition.field);
      const conditionMet = this.evaluateCondition(fieldValue, condition);

      details[condition.field] = {
        value: fieldValue,
        condition: condition,
        met: conditionMet,
      };

      // Handle logical operators
      if (condition.logicalOperator === 'or') {
        if (conditionMet) {
          matched = true;
          break;
        }
      } else {
        // Default is 'and'
        if (!conditionMet) {
          matched = false;
          break;
        }
      }
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched,
      riskScore: matched ? rule.riskScore : 0,
      action: matched ? rule.action : 'allow',
      details,
    };
  }

  /**
   * Get field value from transaction object
   */
  private getFieldValue(transaction: Transaction, field: string): any {
    const parts = field.split('.');
    let value: any = transaction;

    for (const part of parts) {
      value = value?.[part];
    }

    return value;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(fieldValue: any, condition: any): boolean {
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      default:
        return false;
    }
  }

  /**
   * Calculate composite risk score from signals and rule evaluations
   */
  private calculateRiskScore(signals: FraudSignal[], ruleEvaluations: FraudRuleEvaluation[]): number {
    let totalScore = 0;

    // Add signal contributions
    for (const signal of signals) {
      totalScore += signal.riskContribution;
    }

    // Add rule evaluation scores
    for (const evaluation of ruleEvaluations) {
      if (evaluation.matched) {
        totalScore += evaluation.riskScore;
      }
    }

    // Cap at 100
    return Math.min(100, totalScore);
  }

  /**
   * Determine risk level based on score
   */
  private determineRiskLevel(riskScore: number): RiskLevel {
    if (riskScore >= this.config.defaultRiskThresholds.high) {
      return 'high';
    } else if (riskScore >= this.config.defaultRiskThresholds.medium) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get recommendation based on risk level and score
   */
  private getRecommendation(riskLevel: RiskLevel, riskScore: number): FraudAction {
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
   * Initialize default fraud rules
   */
  private initializeDefaultRules(): void {
    // High amount rule
    this.addRule({
      id: 'high-amount-rule',
      name: 'High Amount Transaction',
      type: 'amount',
      isActive: true,
      priority: 1,
      conditions: [
        {
          field: 'amount',
          operator: 'greater_than',
          value: 10000,
        },
      ],
      action: 'review',
      riskScore: 30,
      description: 'Flag transactions over $10,000 for review',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Velocity rule
    this.addRule({
      id: 'velocity-rule',
      name: 'High Velocity Transactions',
      type: 'velocity',
      isActive: true,
      priority: 2,
      conditions: [
        {
          field: 'metadata.velocityCount',
          operator: 'greater_than',
          value: 5,
        },
      ],
      action: 'challenge',
      riskScore: 25,
      description: 'Challenge users with high transaction velocity',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Add a new fraud rule
   */
  addRule(rule: FraudRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a fraud rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Add blacklist entry
   */
  addBlacklistEntry(entry: BlacklistEntry): void {
    const typeEntries = this.blacklist.get(entry.type) || [];
    typeEntries.push(entry);
    this.blacklist.set(entry.type, typeEntries);
  }

  /**
   * Add whitelist entry
   */
  addWhitelistEntry(entry: WhitelistEntry): void {
    const typeEntries = this.whitelist.get(entry.type) || [];
    typeEntries.push(entry);
    this.whitelist.set(entry.type, typeEntries);
  }

  /**
   * Helper methods for creating assessments
   */
  private createLowRiskAssessment(
    id: string,
    transactionId: string,
    reason: string,
    ruleEvaluations: FraudRuleEvaluation[],
    signals: FraudSignal[]
  ): FraudAssessment {
    return {
      id,
      transactionId,
      riskScore: 0,
      riskLevel: 'low',
      recommendation: 'allow',
      ruleEvaluations,
      signals: [...signals, {
        type: 'whitelist_match',
        value: reason,
        riskContribution: -100,
        description: reason,
      }],
      assessedAt: new Date(),
    };
  }

  private createHighRiskAssessment(
    id: string,
    transactionId: string,
    reason: string,
    ruleEvaluations: FraudRuleEvaluation[],
    signals: FraudSignal[]
  ): FraudAssessment {
    return {
      id,
      transactionId,
      riskScore: 100,
      riskLevel: 'critical',
      recommendation: 'decline',
      ruleEvaluations,
      signals,
      assessedAt: new Date(),
    };
  }

  private createMediumRiskAssessment(
    id: string,
    transactionId: string,
    reason: string,
    ruleEvaluations: FraudRuleEvaluation[],
    signals: FraudSignal[]
  ): FraudAssessment {
    return {
      id,
      transactionId,
      riskScore: 50,
      riskLevel: 'medium',
      recommendation: 'review',
      ruleEvaluations,
      signals: [...signals, {
        type: 'analysis_error',
        value: reason,
        riskContribution: 50,
        description: reason,
      }],
      assessedAt: new Date(),
    };
  }

  private generateAssessmentId(): string {
    return `fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}