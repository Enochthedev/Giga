import { v4 as uuidv4 } from 'uuid';

// Spec-aligned enums
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REQUIRES_ACTION = 'requires_action',
  DISPUTED = 'disputed',
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  PAYOUT = 'payout',
  FEE = 'fee',
}

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  DIGITAL_WALLET = 'digital_wallet',
  CRYPTOCURRENCY = 'cryptocurrency',
  BUY_NOW_PAY_LATER = 'buy_now_pay_later',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Enhanced interfaces aligned with specifications
export interface EnhancedPaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  description?: string;

  // Customer information
  customerId: string;
  customerEmail?: string;

  // Gateway information
  gatewayUsed: string;

  // Risk assessment
  riskScore: number;
  riskLevel: RiskLevel;

  // Enhanced metadata with service identification
  metadata: {
    service: string;
    serviceVersion: string;
    source: string;
    timestamp: string;
    environment: string;
    orderId?: string;
    bookingId?: string;
    subscriptionId?: string;
    [key: string]: any;
  };

  // Timestamps
  created: number;
  processedAt?: number;
  settledAt?: number;
}

export interface EnhancedPaymentMethod {
  id: string;
  type: PaymentMethodType;

  // Card details (tokenized)
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
  };

  // Bank account details (tokenized)
  bankAccount?: {
    last4: string;
    bankName: string;
    accountType: string;
    routingNumber?: string;
  };

  // Digital wallet info
  wallet?: {
    type: string;
    email?: string;
    phone?: string;
  };

  // Verification status
  verified: boolean;
  verificationMethod?: string;

  // Metadata
  isDefault: boolean;
  customerId: string;
  created: number;
}

export interface EnhancedPaymentResult {
  success: boolean;
  paymentIntentId: string;
  status: TransactionStatus;
  transactionId?: string;
  paymentMethodId?: string;
  gatewayTransactionId?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  gatewayId: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  processedAt?: number;
}

export interface ServiceMetrics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalAmount: number;
  averageAmount: number;
  averageResponseTime: number;

  serviceBreakdown: Record<
    string,
    {
      count: number;
      amount: number;
      successRate: number;
      averageRiskScore: number;
    }
  >;

  gatewayBreakdown: Record<
    string,
    {
      count: number;
      amount: number;
      successRate: number;
      averageResponseTime: number;
    }
  >;

  riskBreakdown: Record<
    string,
    {
      count: number;
      successRate: number;
    }
  >;

  periodStart: string;
  periodEnd: string;
}

/**
 * Enhanced Dummy Payment Service - Spec Aligned
 * This simulates a comprehensive payment processor with all spec features
 */
export class EnhancedDummyPaymentService {
  private paymentIntents: Map<string, EnhancedPaymentIntent> = new Map();
  private paymentMethods: Map<string, EnhancedPaymentMethod> = new Map();

  constructor() {
    this.initializeDummyPaymentMethods();
  }

  /**
   * Create a payment intent (spec-aligned)
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId: string,
    metadata: Record<string, any> = {},
    options: {
      description?: string;
      customerEmail?: string;
      type?: TransactionType;
      gatewayId?: string;
    } = {}
  ): Promise<EnhancedPaymentIntent> {
    // Simulate basic fraud detection
    const riskScore = this.calculateRiskScore(amount, customerId, metadata);
    const riskLevel = this.determineRiskLevel(riskScore);

    const paymentIntent: EnhancedPaymentIntent = {
      id: `pi_${uuidv4().replace(/-/g, '')}`,
      clientSecret: `pi_${uuidv4().replace(/-/g, '')}_secret_${uuidv4().substring(0, 8)}`,
      amount,
      currency: currency.toLowerCase(),
      status: TransactionStatus.PENDING,
      type: options.type || TransactionType.PAYMENT,
      description: options.description,
      customerId,
      customerEmail: options.customerEmail,
      gatewayUsed: options.gatewayId || 'dummy-gateway',
      riskScore,
      riskLevel,
      metadata: {
        service: metadata.service || 'unknown',
        serviceVersion: metadata.serviceVersion || '1.0.0',
        source: metadata.source || 'payment-service',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        ...metadata,
      },
      created: Math.floor(Date.now() / 1000),
    };

    this.paymentIntents.set(paymentIntent.id, paymentIntent);
    await this.simulateDelay(100, 300);
    return paymentIntent;
  }

  /**
   * Confirm payment intent with enhanced fraud detection
   */
  async confirmPaymentIntent(
    paymentIntentId: string
  ): Promise<EnhancedPaymentResult> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      return {
        success: false,
        paymentIntentId,
        status: TransactionStatus.FAILED,
        riskScore: 0,
        riskLevel: RiskLevel.LOW,
        gatewayId: 'dummy-gateway',
        error: {
          code: 'payment_intent_not_found',
          message: 'Payment intent not found',
        },
      };
    }

    // Simulate processing time based on risk level
    const processingTime = this.getProcessingTime(paymentIntent.riskLevel);
    await this.simulateDelay(processingTime.min, processingTime.max);

    // Determine success based on risk level
    const successRate = this.getSuccessRate(paymentIntent.riskLevel);
    const isSuccessful = Math.random() < successRate;
    const processedAt = Math.floor(Date.now() / 1000);

    if (isSuccessful) {
      paymentIntent.status = TransactionStatus.SUCCEEDED;
      paymentIntent.processedAt = processedAt;
      paymentIntent.settledAt = processedAt + 3600;
      this.paymentIntents.set(paymentIntentId, paymentIntent);

      return {
        success: true,
        paymentIntentId,
        status: TransactionStatus.SUCCEEDED,
        transactionId: `txn_${uuidv4().substring(0, 16)}`,
        gatewayTransactionId: `gw_${uuidv4().substring(0, 12)}`,
        paymentMethodId: this.getRandomPaymentMethodId(),
        riskScore: paymentIntent.riskScore,
        riskLevel: paymentIntent.riskLevel,
        gatewayId: paymentIntent.gatewayUsed,
        processedAt,
      };
    } else {
      const failureInfo = this.getFailureInfo(paymentIntent.riskLevel);
      paymentIntent.status = failureInfo.status;
      paymentIntent.processedAt = processedAt;
      this.paymentIntents.set(paymentIntentId, paymentIntent);

      return {
        success: false,
        paymentIntentId,
        status: failureInfo.status,
        riskScore: paymentIntent.riskScore,
        riskLevel: paymentIntent.riskLevel,
        gatewayId: paymentIntent.gatewayUsed,
        error: failureInfo.error,
        processedAt,
      };
    }
  }

  /**
   * Create enhanced payment method
   */
  async createPaymentMethod(
    type: PaymentMethodType,
    details: any,
    customerId: string
  ): Promise<EnhancedPaymentMethod> {
    const paymentMethod: EnhancedPaymentMethod = {
      id: `pm_${uuidv4().replace(/-/g, '')}`,
      type,
      verified: false,
      isDefault: details.isDefault || false,
      customerId,
      created: Math.floor(Date.now() / 1000),
    };

    switch (type) {
      case PaymentMethodType.CARD:
        if (details.card) {
          paymentMethod.card = {
            brand: details.card.brand || 'visa',
            last4: details.card.number?.slice(-4) || '4242',
            exp_month: details.card.exp_month || 12,
            exp_year: details.card.exp_year || 2025,
            fingerprint: `fp_${uuidv4().substring(0, 16)}`,
          };
          paymentMethod.verified = true;
          paymentMethod.verificationMethod = 'cvv_check';
        }
        break;

      case PaymentMethodType.DIGITAL_WALLET:
        if (details.wallet) {
          paymentMethod.wallet = {
            type: details.wallet.type || 'paypal',
            email: details.wallet.email,
            phone: details.wallet.phone,
          };
          paymentMethod.verified = true;
          paymentMethod.verificationMethod = 'oauth';
        }
        break;
    }

    this.paymentMethods.set(paymentMethod.id, paymentMethod);
    await this.simulateDelay(100, 300);
    return paymentMethod;
  }

  /**
   * Get enhanced service metrics
   */
  async getServiceMetrics(): Promise<ServiceMetrics> {
    await this.simulateDelay(200, 500);

    const allPayments = Array.from(this.paymentIntents.values());
    const successfulPayments = allPayments.filter(
      p => p.status === TransactionStatus.SUCCEEDED
    );
    const failedPayments = allPayments.filter(
      p =>
        p.status === TransactionStatus.FAILED ||
        p.status === TransactionStatus.CANCELLED ||
        p.status === TransactionStatus.REQUIRES_ACTION
    );

    const totalAmount = successfulPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // Service breakdown
    const serviceBreakdown: Record<
      string,
      {
        count: number;
        amount: number;
        successRate: number;
        averageRiskScore: number;
      }
    > = {};

    allPayments.forEach(payment => {
      const service = payment.metadata.service;
      if (!serviceBreakdown[service]) {
        serviceBreakdown[service] = {
          count: 0,
          amount: 0,
          successRate: 0,
          averageRiskScore: 0,
        };
      }
      serviceBreakdown[service].count++;
      if (payment.status === TransactionStatus.SUCCEEDED) {
        serviceBreakdown[service].amount += payment.amount;
      }
    });

    // Calculate rates
    Object.keys(serviceBreakdown).forEach(service => {
      const servicePayments = allPayments.filter(
        p => p.metadata.service === service
      );
      const serviceSuccessful = servicePayments.filter(
        p => p.status === TransactionStatus.SUCCEEDED
      );

      serviceBreakdown[service].successRate =
        servicePayments.length > 0
          ? (serviceSuccessful.length / servicePayments.length) * 100
          : 0;

      serviceBreakdown[service].averageRiskScore =
        servicePayments.length > 0
          ? servicePayments.reduce((sum, p) => sum + p.riskScore, 0) /
            servicePayments.length
          : 0;
    });

    // Gateway breakdown
    const gatewayBreakdown: Record<
      string,
      {
        count: number;
        amount: number;
        successRate: number;
        averageResponseTime: number;
      }
    > = {};

    allPayments.forEach(payment => {
      const gateway = payment.gatewayUsed;
      if (!gatewayBreakdown[gateway]) {
        gatewayBreakdown[gateway] = {
          count: 0,
          amount: 0,
          successRate: 0,
          averageResponseTime: Math.random() * 1500 + 500,
        };
      }
      gatewayBreakdown[gateway].count++;
      if (payment.status === TransactionStatus.SUCCEEDED) {
        gatewayBreakdown[gateway].amount += payment.amount;
      }
    });

    // Risk breakdown
    const riskBreakdown: Record<
      string,
      {
        count: number;
        successRate: number;
      }
    > = {};

    Object.values(RiskLevel).forEach(level => {
      const riskPayments = allPayments.filter(p => p.riskLevel === level);
      const riskSuccessful = riskPayments.filter(
        p => p.status === TransactionStatus.SUCCEEDED
      );

      riskBreakdown[level] = {
        count: riskPayments.length,
        successRate:
          riskPayments.length > 0
            ? (riskSuccessful.length / riskPayments.length) * 100
            : 0,
      };
    });

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      totalPayments: allPayments.length,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      totalAmount,
      averageAmount:
        successfulPayments.length > 0
          ? totalAmount / successfulPayments.length
          : 0,
      averageResponseTime: Math.random() * 1500 + 500,
      serviceBreakdown,
      gatewayBreakdown,
      riskBreakdown,
      periodStart: dayAgo.toISOString(),
      periodEnd: now.toISOString(),
    };
  }

  // Helper methods
  private calculateRiskScore(
    amount: number,
    customerId: string,
    metadata: Record<string, any>
  ): number {
    let riskScore = 0;

    if (amount > 10000) riskScore += 30;
    else if (amount > 5000) riskScore += 15;
    else if (amount > 1000) riskScore += 5;

    const customerRisk = parseInt(customerId.slice(-1)) || 0;
    riskScore += customerRisk * 5;

    if (metadata.service === 'unknown') riskScore += 20;

    return Math.min(riskScore, 100);
  }

  private determineRiskLevel(riskScore: number): RiskLevel {
    if (riskScore >= 75) return RiskLevel.CRITICAL;
    if (riskScore >= 50) return RiskLevel.HIGH;
    if (riskScore >= 25) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private getProcessingTime(riskLevel: RiskLevel): {
    min: number;
    max: number;
  } {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return { min: 5000, max: 10000 };
      case RiskLevel.HIGH:
        return { min: 2000, max: 5000 };
      case RiskLevel.MEDIUM:
        return { min: 1000, max: 3000 };
      default:
        return { min: 500, max: 2000 };
    }
  }

  private getSuccessRate(riskLevel: RiskLevel): number {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return 0.3;
      case RiskLevel.HIGH:
        return 0.6;
      case RiskLevel.MEDIUM:
        return 0.85;
      default:
        return 0.95;
    }
  }

  private getFailureInfo(riskLevel: RiskLevel): {
    status: TransactionStatus;
    error: { code: string; message: string };
  } {
    const failureReasons = {
      [RiskLevel.CRITICAL]: [
        {
          code: 'fraud_suspected',
          message: 'Transaction flagged for potential fraud',
        },
        {
          code: 'manual_review_required',
          message: 'Transaction requires manual review',
        },
      ],
      [RiskLevel.HIGH]: [
        {
          code: 'additional_verification_required',
          message: 'Additional verification required',
        },
        {
          code: 'risk_threshold_exceeded',
          message: 'Transaction exceeds risk threshold',
        },
      ],
      [RiskLevel.MEDIUM]: [
        { code: 'card_declined', message: 'Your card was declined' },
        { code: 'insufficient_funds', message: 'Insufficient funds' },
      ],
      [RiskLevel.LOW]: [
        { code: 'card_declined', message: 'Your card was declined' },
        { code: 'expired_card', message: 'Your card has expired' },
      ],
    };

    const reasons = failureReasons[riskLevel];
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

    return {
      status:
        riskLevel === RiskLevel.CRITICAL
          ? TransactionStatus.REQUIRES_ACTION
          : TransactionStatus.FAILED,
      error: randomReason,
    };
  }

  private getRandomPaymentMethodId(): string {
    const methods = Array.from(this.paymentMethods.keys());
    return methods.length > 0
      ? methods[Math.floor(Math.random() * methods.length)]
      : 'pm_default';
  }

  private async simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private initializeDummyPaymentMethods(): void {
    const dummyMethods = [
      {
        type: PaymentMethodType.CARD,
        customerId: 'demo_customer',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025,
          fingerprint: 'fp_demo_visa',
        },
        verified: true,
        isDefault: true,
      },
      {
        type: PaymentMethodType.DIGITAL_WALLET,
        customerId: 'demo_customer',
        wallet: { type: 'paypal', email: 'demo@example.com' },
        verified: true,
        isDefault: false,
      },
    ];

    dummyMethods.forEach(method => {
      const paymentMethod: EnhancedPaymentMethod = {
        id: `pm_${uuidv4().replace(/-/g, '')}`,
        type: method.type,
        verified: method.verified,
        isDefault: method.isDefault,
        customerId: method.customerId,
        created: Math.floor(Date.now() / 1000),
        verificationMethod: 'cvv_check',
      };

      if (method.card) paymentMethod.card = method.card;
      if (method.wallet) paymentMethod.wallet = method.wallet;

      this.paymentMethods.set(paymentMethod.id, paymentMethod);
    });
  }

  // Additional methods for completeness
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<EnhancedPaymentIntent | null> {
    await this.simulateDelay(50, 150);
    return this.paymentIntents.get(paymentIntentId) || null;
  }

  async listPaymentMethods(
    customerId: string
  ): Promise<EnhancedPaymentMethod[]> {
    await this.simulateDelay(100, 300);
    return Array.from(this.paymentMethods.values())
      .filter(
        pm => pm.customerId === customerId || pm.customerId === 'demo_customer'
      )
      .slice(0, 5);
  }

  clearAllData(): void {
    this.paymentIntents.clear();
    this.paymentMethods.clear();
    this.initializeDummyPaymentMethods();
  }
}
