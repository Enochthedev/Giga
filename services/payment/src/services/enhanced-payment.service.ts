/**
 * Enhanced Payment Service - Spec-Aligned Implementation
 * This service provides a more comprehensive payment processing system
 * aligned with the payment service specifications
 */

import { v4 as uuidv4 } from 'uuid';
import {
  CaptureResult,
  EnhancedPaymentRequest,
  EnhancedPaymentResult,
  EnhancedTransaction,
  FraudAnalysis,
  FraudRecommendation,
  PaymentGateway,
  PaymentMethodInfo,
  PaymentServiceConfig,
  RefundRequest,
  RefundResult,
  TransactionStatus,
} from '../types/enhanced-payment.types';

/**
 * Enhanced Payment Service with spec-aligned features
 */
export class EnhancedPaymentService {
  private transactions: Map<string, EnhancedTransaction> = new Map();
  private paymentMethods: Map<string, PaymentMethodInfo> = new Map();
  private gateways: Map<string, PaymentGateway> = new Map();
  private config: PaymentServiceConfig;

  constructor(config?: Partial<PaymentServiceConfig>) {
    this.config = {
      service: {
        name: 'enhanced-payment-service',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
      fraud: {
        enabled: true,
        riskThresholds: {
          low: 25,
          medium: 50,
          high: 75,
          critical: 90,
        },
      },
      features: {
        fraudDetection: true,
        multiGateway: true,
        marketplace: true,
        subscriptions: false, // Future feature
      },
      ...config,
    };

    this.initializeGateways();
    this.initializeDummyPaymentMethods();
  }

  /**
   * Process a payment with enhanced features
   */
  async processPayment(
    request: EnhancedPaymentRequest
  ): Promise<EnhancedPaymentResult> {
    // Validate request
    this.validatePaymentRequest(request);

    // Create transaction record
    const transaction = await this.createTransaction(request);

    try {
      // Fraud analysis (if enabled)
      let fraudAnalysis: FraudAnalysis | undefined;
      if (this.config.fraud.enabled) {
        fraudAnalysis = await this.performFraudAnalysis(transaction);
        transaction.fraudAnalysis = fraudAnalysis;
        transaction.riskScore = fraudAnalysis.riskScore;

        // Handle high-risk transactions
        if (fraudAnalysis.recommendation === FraudRecommendation.DECLINE) {
          transaction.status = TransactionStatus.FAILED;
          this.transactions.set(transaction.id, transaction);
          throw new Error(
            `Transaction declined due to high fraud risk: ${fraudAnalysis.riskScore}`
          );
        }

        if (fraudAnalysis.recommendation === FraudRecommendation.REVIEW) {
          transaction.status = TransactionStatus.REQUIRES_ACTION;
          this.transactions.set(transaction.id, transaction);

          return {
            id: transaction.id,
            status: TransactionStatus.REQUIRES_ACTION,
            amount: transaction.amount,
            currency: transaction.currency,
            gatewayId: 'fraud-review',
            riskScore: fraudAnalysis.riskScore,
            riskLevel: fraudAnalysis.riskLevel,
            fraudAnalysis,
            requiresAction: true,
            nextAction: {
              type: 'manual_review',
              redirectUrl: `/fraud-review/${transaction.id}`,
            },
            metadata: transaction.metadata,
            createdAt: transaction.createdAt,
          };
        }
      }

      // Select optimal gateway
      const gateway = await this.selectOptimalGateway(request);
      transaction.gatewayUsed = gateway.id;

      // Process payment through gateway
      const gatewayResponse = await gateway.processPayment(request);

      // Update transaction with gateway response
      transaction.status = gatewayResponse.status;
      transaction.externalId = gatewayResponse.gatewayTransactionId;
      transaction.processedAt = new Date();

      if (
        gatewayResponse.success &&
        gatewayResponse.status === TransactionStatus.SUCCEEDED
      ) {
        transaction.settledAt = new Date();
      }

      this.transactions.set(transaction.id, transaction);

      // Return enhanced result
      return {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        gatewayId: gateway.id,
        gatewayTransactionId: gatewayResponse.gatewayTransactionId,
        clientSecret: gatewayResponse.clientSecret,
        confirmationUrl: gatewayResponse.confirmationUrl,
        requiresAction: gatewayResponse.requiresAction,
        nextAction: gatewayResponse.requiresAction
          ? {
              type: 'redirect',
              redirectUrl: gatewayResponse.confirmationUrl,
            }
          : undefined,
        paymentMethod: transaction.paymentMethod,
        riskScore: transaction.riskScore,
        riskLevel: this.determineRiskLevel(transaction.riskScore || 0),
        fraudAnalysis: transaction.fraudAnalysis,
        splits: transaction.splits,
        platformFee: transaction.platformFee,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
        processedAt: transaction.processedAt,
      };
    } catch (error) {
      // Handle payment failure
      transaction.status = TransactionStatus.FAILED;
      transaction.processedAt = new Date();
      this.transactions.set(transaction.id, transaction);

      throw new Error(
        `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process a refund
   */
  async processRefund(refundRequest: RefundRequest): Promise<RefundResult> {
    const transaction = this.transactions.get(refundRequest.paymentId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.SUCCEEDED) {
      throw new Error('Can only refund succeeded transactions');
    }

    const refundAmount = refundRequest.amount || transaction.amount;
    if (refundAmount > transaction.amount) {
      throw new Error(
        'Refund amount cannot exceed original transaction amount'
      );
    }

    // Get gateway and process refund
    const gateway = this.gateways.get(transaction.gatewayUsed);
    if (!gateway) {
      throw new Error('Gateway not available for refund');
    }

    try {
      const gatewayResponse = await gateway.refundPayment(
        transaction.externalId || transaction.id,
        refundAmount,
        refundRequest.reason
      );

      // Create refund record
      const refund = {
        id: `re_${uuidv4().replace(/-/g, '')}`,
        transactionId: transaction.id,
        amount: refundAmount,
        currency: transaction.currency,
        reason: refundRequest.reason || 'Customer request',
        status: gatewayResponse.success ? 'succeeded' : 'failed',
        processedAt: gatewayResponse.success ? new Date() : undefined,
        createdAt: new Date(),
      };

      // Add refund to transaction
      if (!transaction.refunds) {
        transaction.refunds = [];
      }
      transaction.refunds.push(refund);
      this.transactions.set(transaction.id, transaction);

      return {
        id: refund.id,
        paymentId: transaction.id,
        amount: refundAmount,
        currency: transaction.currency,
        status: refund.status,
        reason: refund.reason,
        processedAt: refund.processedAt,
        estimatedArrival: this.calculateRefundArrivalDate(),
      };
    } catch (error) {
      throw new Error(
        `Refund processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Capture a payment (for manual capture)
   */
  async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<CaptureResult> {
    const transaction = this.transactions.get(paymentId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (
      transaction.status !== TransactionStatus.REQUIRES_ACTION &&
      transaction.status !== TransactionStatus.PROCESSING
    ) {
      throw new Error('Transaction cannot be confirmed in current status');
    }

    // Update transaction status
    transaction.status = TransactionStatus.SUCCEEDED;
    transaction.capturedAt = new Date();

    if (amount && amount !== transaction.amount) {
      transaction.capturedAmount = amount;
    }

    return {
      id: transaction.id,
      status: transaction.status,
      amount: amount || transaction.amount,
      capturedAt: transaction.capturedAt,
    };
  }
}
