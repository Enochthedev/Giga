import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  PaymentStatus,
  Refund,
  RefundNotification,
  RefundPolicy,
  RefundRequest,
} from '../types';
import {
  RefundError,
  RefundPolicyViolationError,
  TransactionNotFoundError,
  ValidationError,
} from '../utils/errors';
import { AuditService } from './audit.service';
import { GatewayManager } from './gateway-manager.service';
import { TransactionService } from './transaction.service';

export interface RefundAuthorizationRequest {
  transactionId: string;
  amount?: number;
  reason: string;
  requestedBy: string;
  merchantId?: string;
  metadata?: Record<string, any>;
}

export interface RefundAuthorizationResult {
  authorized: boolean;
  reason?: string;
  requiresApproval?: boolean;
  approvalLevel?: 'manager' | 'admin' | 'finance';
  maxRefundAmount?: number;
  policyViolations?: string[];
}

export class RefundService {
  private transactionService: TransactionService;
  private gatewayManager: GatewayManager;
  private auditService: AuditService;

  constructor() {
    this.transactionService = new TransactionService();
    this.gatewayManager = new GatewayManager();
    this.auditService = new AuditService();
  }

  /**
   * Process a comprehensive refund with authorization and policy enforcement
   */
  async processRefund(request: RefundRequest): Promise<Refund> {
    try {
      logger.info('Processing refund request', {
        transactionId: request.transactionId,
        amount: request.amount,
        reason: request.reason,
      });

      // Get the original transaction
      const transaction = await this.transactionService.getById(
        request.transactionId
      );

      if (!transaction) {
        throw new TransactionNotFoundError(
          `Transaction ${request.transactionId} not found`
        );
      }

      // Validate transaction status
      if (!['succeeded', 'partially_refunded'].includes(transaction.status)) {
        throw new RefundError(
          `Cannot refund transaction with status: ${transaction.status}`
        );
      }

      // Determine refund amount
      const refundAmount = request.amount
        ? new Decimal(request.amount)
        : transaction.amount;

      // Validate refund amount
      await this.validateRefundAmount(transaction, refundAmount);

      // Check refund authorization
      const authResult = await this.checkRefundAuthorization({
        transactionId: request.transactionId,
        amount: refundAmount.toNumber(),
        reason: request.reason,
        requestedBy: request.requestedBy,
        merchantId: transaction.merchantId,
        metadata: request.metadata,
      });

      if (!authResult.authorized) {
        throw new RefundError(
          `Refund not authorized: ${authResult.reason || 'Unknown reason'}`
        );
      }

      // Check refund policy compliance
      await this.enforceRefundPolicy(transaction, refundAmount, request.reason);

      // Create refund record
      const refund = await this.createRefundRecord(
        transaction,
        refundAmount,
        request
      );

      // Process refund through gateway
      const gatewayRefund = await this.processGatewayRefund(
        transaction,
        refund,
        refundAmount
      );

      // Update refund with gateway response
      const updatedRefund = await this.updateRefundStatus(
        refund.id,
        gatewayRefund.status,
        gatewayRefund.gatewayRefundId
      );

      // Update transaction status
      await this.updateTransactionRefundStatus(transaction.id, refundAmount);

      // Send refund notifications
      await this.sendRefundNotifications(transaction, updatedRefund);

      // Log audit trail
      await this.auditService.logRefundEvent({
        refundId: updatedRefund.id,
        transactionId: transaction.id,
        amount: refundAmount.toNumber(),
        reason: request.reason,
        requestedBy: request.requestedBy,
        status: updatedRefund.status,
        gatewayRefundId: gatewayRefund.gatewayRefundId,
      });

      logger.info('Refund processed successfully', {
        refundId: updatedRefund.id,
        transactionId: transaction.id,
        amount: refundAmount.toNumber(),
        status: updatedRefund.status,
      });

      return updatedRefund;
    } catch (error) {
      logger.error('Failed to process refund', {
        error,
        transactionId: request.transactionId,
      });
      throw error;
    }
  }

  /**
   * Process partial refund
   */
  async processPartialRefund(
    transactionId: string,
    amount: number,
    reason: string,
    requestedBy: string
  ): Promise<Refund> {
    return this.processRefund({
      transactionId,
      amount,
      reason,
      requestedBy,
      type: 'partial',
    });
  }

  /**
   * Process full refund
   */
  async processFullRefund(
    transactionId: string,
    reason: string,
    requestedBy: string
  ): Promise<Refund> {
    return this.processRefund({
      transactionId,
      reason,
      requestedBy,
      type: 'full',
    });
  }

  /**
   * Get refund by ID
   */
  async getRefund(refundId: string): Promise<Refund> {
    try {
      const refund = await prisma.refund.findUnique({
        where: { id: refundId },
        include: {
          transaction: true,
        },
      });

      if (!refund) {
        throw new TransactionNotFoundError(`Refund ${refundId} not found`);
      }

      return this.mapPrismaRefundToRefund(refund);
    } catch (error) {
      logger.error('Failed to get refund', { error, refundId });
      throw error;
    }
  }

  /**
   * Get refunds for a transaction
   */
  async getRefundsByTransaction(transactionId: string): Promise<Refund[]> {
    try {
      const refunds = await prisma.refund.findMany({
        where: { transactionId },
        include: {
          transaction: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return refunds.map(this.mapPrismaRefundToRefund);
    } catch (error) {
      logger.error('Failed to get refunds by transaction', {
        error,
        transactionId,
      });
      throw error;
    }
  }

  /**
   * Cancel a pending refund
   */
  async cancelRefund(refundId: string, reason: string): Promise<Refund> {
    try {
      logger.info('Canceling refund', { refundId, reason });

      const refund = await this.getRefund(refundId);

      if (refund.status !== 'PENDING') {
        throw new RefundError(
          `Cannot cancel refund with status: ${refund.status}`
        );
      }

      // Update refund status
      const updatedRefund = await this.updateRefundStatus(
        refundId,
        'CANCELLED'
      );

      // Log audit trail
      await this.auditService.logRefundEvent({
        refundId,
        transactionId: refund.transactionId,
        amount: refund.amount.toNumber(),
        reason: `Cancelled: ${reason}`,
        status: 'cancelled',
      });

      logger.info('Refund cancelled successfully', { refundId });

      return updatedRefund;
    } catch (error) {
      logger.error('Failed to cancel refund', { error, refundId });
      throw error;
    }
  }

  /**
   * Check refund authorization based on business rules
   */
  private async checkRefundAuthorization(
    request: RefundAuthorizationRequest
  ): Promise<RefundAuthorizationResult> {
    try {
      const transaction = await this.transactionService.getById(
        request.transactionId
      );

      // Basic authorization checks
      const result: RefundAuthorizationResult = {
        authorized: true,
        policyViolations: [],
      };

      // Check refund amount limits
      const maxRefundAmount = await this.getMaxRefundAmount(transaction);
      if (request.amount && request.amount > maxRefundAmount) {
        result.authorized = false;
        result.reason = `Refund amount exceeds maximum allowed: ${maxRefundAmount}`;
        result.policyViolations?.push('AMOUNT_EXCEEDS_LIMIT');
      }

      // Check time-based restrictions
      const daysSinceTransaction = Math.floor(
        (Date.now() - transaction.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const refundPolicy = await this.getRefundPolicy(
        transaction.merchantId || 'default'
      );

      if (daysSinceTransaction > refundPolicy.maxRefundDays) {
        result.authorized = false;
        result.reason = `Refund window expired (${refundPolicy.maxRefundDays} days)`;
        result.policyViolations?.push('REFUND_WINDOW_EXPIRED');
      }

      // Check if requires approval based on amount
      if (
        request.amount &&
        request.amount > refundPolicy.managerApprovalThreshold
      ) {
        result.requiresApproval = true;
        result.approvalLevel = 'manager';
      }

      if (
        request.amount &&
        request.amount > refundPolicy.adminApprovalThreshold
      ) {
        result.requiresApproval = true;
        result.approvalLevel = 'admin';
      }

      // Check merchant-specific rules
      if (transaction.merchantId) {
        const merchantRules = await this.getMerchantRefundRules(
          transaction.merchantId
        );
        if (merchantRules && !merchantRules.allowRefunds) {
          result.authorized = false;
          result.reason = 'Merchant does not allow refunds';
          result.policyViolations?.push('MERCHANT_REFUNDS_DISABLED');
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to check refund authorization', { error, request });
      return {
        authorized: false,
        reason: 'Authorization check failed',
      };
    }
  }

  /**
   * Enforce refund policy rules
   */
  private async enforceRefundPolicy(
    transaction: any,
    refundAmount: Decimal,
    reason: string
  ): Promise<void> {
    const policy = await this.getRefundPolicy(
      transaction.merchantId || 'default'
    );

    // Check if reason is required
    if (policy.requireReason && !reason) {
      throw new RefundPolicyViolationError('Refund reason is required');
    }

    // Check if reason is valid
    if (
      policy.validReasons &&
      policy.validReasons.length > 0 &&
      !policy.validReasons.includes(reason)
    ) {
      throw new RefundPolicyViolationError(
        `Invalid refund reason. Valid reasons: ${policy.validReasons.join(', ')}`
      );
    }

    // Check minimum refund amount
    if (refundAmount.lt(new Decimal(policy.minRefundAmount))) {
      throw new RefundPolicyViolationError(
        `Refund amount below minimum: ${policy.minRefundAmount}`
      );
    }

    // Check maximum refund amount
    if (refundAmount.gt(new Decimal(policy.maxRefundAmount))) {
      throw new RefundPolicyViolationError(
        `Refund amount exceeds maximum: ${policy.maxRefundAmount}`
      );
    }
  }

  /**
   * Validate refund amount against transaction and existing refunds
   */
  private async validateRefundAmount(
    transaction: any,
    refundAmount: Decimal
  ): Promise<void> {
    if (refundAmount.lte(new Decimal(0))) {
      throw new ValidationError('Refund amount must be positive');
    }

    if (refundAmount.gt(transaction.amount)) {
      throw new ValidationError(
        'Refund amount cannot exceed original transaction amount'
      );
    }

    // Check existing refunds
    const existingRefunds = await this.getRefundsByTransaction(transaction.id);
    const totalRefunded = existingRefunds
      .filter(r => r.status === 'SUCCEEDED')
      .reduce((sum, refund) => sum.plus(refund.amount), new Decimal(0));

    if (totalRefunded.plus(refundAmount).gt(transaction.amount)) {
      throw new ValidationError(
        `Total refund amount would exceed original amount. ` +
          `Already refunded: ${totalRefunded.toString()}, ` +
          `Requested: ${refundAmount.toString()}, ` +
          `Original: ${transaction.amount.toString()}`
      );
    }
  }

  /**
   * Create refund record in database
   */
  private async createRefundRecord(
    transaction: any,
    refundAmount: Decimal,
    request: RefundRequest
  ): Promise<Refund> {
    try {
      const refund = await prisma.refund.create({
        data: {
          transactionId: transaction.id,
          amount: refundAmount.toNumber(),
          currency: transaction.currency,
          reason: request.reason,
          status: 'PENDING',
          metadata: {
            requestedBy: request.requestedBy,
            type: request.type || 'partial',
            ...request.metadata,
          },
        },
      });

      return this.mapPrismaRefundToRefund(refund);
    } catch (error) {
      logger.error('Failed to create refund record', { error, request });
      throw error;
    }
  }

  /**
   * Process refund through payment gateway
   */
  private async processGatewayRefund(
    transaction: any,
    refund: Refund,
    refundAmount: Decimal
  ): Promise<{ status: PaymentStatus; gatewayRefundId?: string }> {
    try {
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
      if (!gateway) {
        throw new RefundError(
          `Gateway ${transaction.gatewayId} not available for refund`
        );
      }

      const gatewayRefund = await gateway.refundPayment(
        transaction.gatewayTransactionId || transaction.id,
        refundAmount.toNumber(),
        refund.reason
      );

      return {
        status: gatewayRefund.status,
        gatewayRefundId: gatewayRefund.gatewayRefundId,
      };
    } catch (error) {
      logger.error('Gateway refund failed', {
        error,
        transactionId: transaction.id,
        refundId: refund.id,
      });

      // Update refund status to failed
      await this.updateRefundStatus(refund.id, 'failed');

      throw new RefundError(`Gateway refund failed: ${error.message}`);
    }
  }

  /**
   * Update refund status
   */
  private async updateRefundStatus(
    refundId: string,
    status: PaymentStatus,
    gatewayRefundId?: string
  ): Promise<Refund> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (gatewayRefundId) {
        updateData.gatewayRefundId = gatewayRefundId;
      }

      if (status === 'SUCCEEDED') {
        updateData.processedAt = new Date();
      }

      const updatedRefund = await prisma.refund.update({
        where: { id: refundId },
        data: updateData,
      });

      return this.mapPrismaRefundToRefund(updatedRefund);
    } catch (error) {
      logger.error('Failed to update refund status', {
        error,
        refundId,
        status,
      });
      throw error;
    }
  }

  /**
   * Update transaction refund status
   */
  private async updateTransactionRefundStatus(
    transactionId: string,
    refundAmount: Decimal
  ): Promise<void> {
    try {
      const transaction = await this.transactionService.getById(transactionId);
      const existingRefunds = await this.getRefundsByTransaction(transactionId);

      const totalRefunded = existingRefunds
        .filter(r => r.status === 'SUCCEEDED')
        .reduce((sum, refund) => sum.plus(refund.amount), new Decimal(0))
        .plus(refundAmount);

      let newStatus: PaymentStatus;
      if (totalRefunded.equals(transaction.amount)) {
        newStatus = 'refunded';
      } else if (totalRefunded.gt(0)) {
        newStatus = 'partially_refunded';
      } else {
        return; // No status change needed
      }

      await this.transactionService.updateStatus(transactionId, newStatus);
    } catch (error) {
      logger.error('Failed to update transaction refund status', {
        error,
        transactionId,
      });
      // Don't throw here as the refund itself was successful
    }
  }

  /**
   * Send automated refund notifications
   */
  private async sendRefundNotifications(
    transaction: any,
    refund: Refund
  ): Promise<void> {
    try {
      const notifications: RefundNotification[] = [];

      // Customer notification
      if (transaction.userId) {
        notifications.push({
          type: 'customer_refund_processed',
          recipientId: transaction.userId,
          channel: 'email',
          data: {
            refundId: refund.id,
            transactionId: transaction.id,
            amount: refund.amount.toString(),
            currency: refund.currency,
            reason: refund.reason,
            processedAt: refund.processedAt,
          },
        });
      }

      // Merchant notification
      if (transaction.merchantId) {
        notifications.push({
          type: 'merchant_refund_processed',
          recipientId: transaction.merchantId,
          channel: 'email',
          data: {
            refundId: refund.id,
            transactionId: transaction.id,
            amount: refund.amount.toString(),
            currency: refund.currency,
            reason: refund.reason,
            processedAt: refund.processedAt,
          },
        });
      }

      // Send notifications (would integrate with notification service)
      for (const notification of notifications) {
        await this.sendNotification(notification);
      }

      logger.info('Refund notifications sent', {
        refundId: refund.id,
        notificationCount: notifications.length,
      });
    } catch (error) {
      logger.error('Failed to send refund notifications', {
        error,
        refundId: refund.id,
      });
      // Don't throw here as the refund itself was successful
    }
  }

  /**
   * Get refund policy for merchant or default
   */
  private async getRefundPolicy(merchantId: string): Promise<RefundPolicy> {
    // In a real implementation, this would fetch from database
    // For now, return default policy
    return {
      maxRefundDays: 30,
      requireReason: true,
      validReasons: [
        'customer_request',
        'defective_product',
        'service_not_delivered',
        'duplicate_charge',
        'fraud',
        'other',
      ],
      minRefundAmount: 0.01,
      maxRefundAmount: 10000,
      managerApprovalThreshold: 1000,
      adminApprovalThreshold: 5000,
      allowPartialRefunds: true,
      allowMultipleRefunds: true,
    };
  }

  /**
   * Get maximum refund amount for transaction
   */
  private async getMaxRefundAmount(transaction: any): Promise<number> {
    const existingRefunds = await this.getRefundsByTransaction(transaction.id);
    const totalRefunded = existingRefunds
      .filter(r => r.status === 'SUCCEEDED')
      .reduce((sum, refund) => sum.plus(refund.amount), new Decimal(0));

    return transaction.amount.minus(totalRefunded).toNumber();
  }

  /**
   * Get merchant-specific refund rules
   */
  private async getMerchantRefundRules(merchantId: string): Promise<any> {
    // In a real implementation, this would fetch from database
    return {
      allowRefunds: true,
      customPolicy: null,
    };
  }

  /**
   * Send notification (would integrate with notification service)
   */
  private async sendNotification(
    notification: RefundNotification
  ): Promise<void> {
    // This would integrate with the notification service
    logger.info('Sending refund notification', {
      type: notification.type,
      recipientId: notification.recipientId,
      channel: notification.channel,
    });
  }

  /**
   * Map Prisma refund to domain refund
   */
  private mapPrismaRefundToRefund(prismaRefund: any): Refund {
    return {
      id: prismaRefund.id,
      transactionId: prismaRefund.transactionId,
      amount: new Decimal(prismaRefund.amount),
      currency: prismaRefund.currency,
      reason: prismaRefund.reason,
      status: prismaRefund.status,
      gatewayRefundId: prismaRefund.gatewayRefundId,
      metadata: prismaRefund.metadata,
      processedAt: prismaRefund.processedAt,
      createdAt: prismaRefund.createdAt,
      updatedAt: prismaRefund.updatedAt,
    };
  }
}
