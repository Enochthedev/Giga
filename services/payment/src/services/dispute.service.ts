import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  Dispute,
  DisputeAnalytics,
  DisputeEvidence,
  DisputeStatus,
} from '../types';
import {
  DisputeError,
  TransactionNotFoundError,
  ValidationError,
} from '../utils/errors';
import { AuditService } from './audit.service';
import { GatewayManager } from './gateway-manager.service';
import { TransactionService } from './transaction.service';

export interface DisputeRequest {
  transactionId: string;
  amount: number;
  reason: string;
  evidenceDeadline?: Date;
  gatewayDisputeId?: string;
  metadata?: Record<string, any>;
}

export interface EvidenceSubmissionRequest {
  disputeId: string;
  evidence: DisputeEvidence;
  submittedBy: string;
  metadata?: Record<string, any>;
}

export interface DisputeResponseRequest {
  disputeId: string;
  response: string;
  evidence?: DisputeEvidence;
  submittedBy: string;
  metadata?: Record<string, any>;
}

export class DisputeService {
  private transactionService: TransactionService;
  private gatewayManager: GatewayManager;
  private auditService: AuditService;

  constructor() {
    this.transactionService = new TransactionService();
    this.gatewayManager = new GatewayManager();
    this.auditService = new AuditService();
  }

  /**
   * Create a new dispute (typically from gateway webhook)
   */
  async createDispute(request: DisputeRequest): Promise<Dispute> {
    try {
      logger.info('Creating dispute', {
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

      // Validate dispute amount
      if (request.amount > transaction.amount.toNumber()) {
        throw new ValidationError(
          'Dispute amount cannot exceed original transaction amount'
        );
      }

      // Create dispute record
      const dispute = await this.createDisputeRecord(transaction, request);

      // Update transaction status
      await this.updateTransactionDisputeStatus(transaction.id);

      // Send dispute notifications
      await this.sendDisputeNotifications(transaction, dispute, 'created');

      // Log audit trail
      await this.auditService.logDisputeEvent({
        disputeId: dispute.id,
        transactionId: transaction.id,
        amount: request.amount,
        reason: request.reason,
        status: dispute.status,
        gatewayDisputeId: request.gatewayDisputeId,
      });

      logger.info('Dispute created successfully', {
        disputeId: dispute.id,
        transactionId: transaction.id,
      });

      return dispute;
    } catch (error) {
      logger.error('Failed to create dispute', {
        error,
        transactionId: request.transactionId,
      });
      throw error;
    }
  }

  /**
   * Get dispute by ID
   */
  async getDispute(disputeId: string): Promise<Dispute> {
    try {
      const dispute = await prisma.dispute.findUnique({
        where: { id: disputeId },
        include: {
          transaction: true,
        },
      });

      if (!dispute) {
        throw new TransactionNotFoundError(`Dispute ${disputeId} not found`);
      }

      return this.mapPrismaDisputeToDispute(dispute);
    } catch (error) {
      logger.error('Failed to get dispute', { error, disputeId });
      throw error;
    }
  }

  /**
   * Get disputes for a transaction
   */
  async getDisputesByTransaction(transactionId: string): Promise<Dispute[]> {
    try {
      const disputes = await prisma.dispute.findMany({
        where: { transactionId },
        include: {
          transaction: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return disputes.map(this.mapPrismaDisputeToDispute);
    } catch (error) {
      logger.error('Failed to get disputes by transaction', {
        error,
        transactionId,
      });
      throw error;
    }
  }

  /**
   * Submit evidence for a dispute
   */
  async submitEvidence(request: EvidenceSubmissionRequest): Promise<Dispute> {
    try {
      logger.info('Submitting dispute evidence', {
        disputeId: request.disputeId,
        submittedBy: request.submittedBy,
      });

      const dispute = await this.getDispute(request.disputeId);

      if (!['open', 'under_review'].includes(dispute.status)) {
        throw new DisputeError(
          `Cannot submit evidence for dispute with status: ${dispute.status}`
        );
      }

      // Check evidence deadline
      if (dispute.evidenceDeadline && new Date() > dispute.evidenceDeadline) {
        throw new DisputeError('Evidence submission deadline has passed');
      }

      // Submit evidence to gateway
      const transaction = await this.transactionService.getById(
        dispute.transactionId
      );
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);

      if (gateway && dispute.gatewayDisputeId) {
        await this.submitEvidenceToGateway(
          gateway,
          dispute.gatewayDisputeId,
          request.evidence
        );
      }

      // Update dispute with evidence
      const updatedDispute = await this.updateDisputeEvidence(
        request.disputeId,
        request.evidence,
        request.submittedBy
      );

      // Send notifications
      await this.sendDisputeNotifications(
        transaction,
        updatedDispute,
        'evidence_submitted'
      );

      // Log audit trail
      await this.auditService.logDisputeEvent({
        disputeId: updatedDispute.id,
        transactionId: transaction.id,
        amount: updatedDispute.amount.toNumber(),
        reason: updatedDispute.reason,
        status: updatedDispute.status,
        evidenceSubmitted: true,
        gatewayDisputeId: updatedDispute.gatewayDisputeId,
      });

      logger.info('Dispute evidence submitted successfully', {
        disputeId: request.disputeId,
      });

      return updatedDispute;
    } catch (error) {
      logger.error('Failed to submit dispute evidence', {
        error,
        disputeId: request.disputeId,
      });
      throw error;
    }
  }

  /**
   * Respond to a dispute automatically
   */
  async respondToDispute(request: DisputeResponseRequest): Promise<Dispute> {
    try {
      logger.info('Responding to dispute', {
        disputeId: request.disputeId,
        submittedBy: request.submittedBy,
      });

      const dispute = await this.getDispute(request.disputeId);

      if (dispute.status !== 'open') {
        throw new DisputeError(
          `Cannot respond to dispute with status: ${dispute.status}`
        );
      }

      // Generate automated response based on dispute reason and evidence
      const response = await this.generateAutomatedResponse(
        dispute,
        request.evidence
      );

      // Submit response to gateway
      const transaction = await this.transactionService.getById(
        dispute.transactionId
      );
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);

      if (gateway && dispute.gatewayDisputeId) {
        await this.submitResponseToGateway(
          gateway,
          dispute.gatewayDisputeId,
          response,
          request.evidence
        );
      }

      // Update dispute status
      const updatedDispute = await this.updateDisputeStatus(
        request.disputeId,
        'under_review'
      );

      // Send notifications
      await this.sendDisputeNotifications(
        transaction,
        updatedDispute,
        'response_submitted'
      );

      // Log audit trail
      await this.auditService.logDisputeEvent({
        disputeId: updatedDispute.id,
        transactionId: transaction.id,
        amount: updatedDispute.amount.toNumber(),
        reason: updatedDispute.reason,
        status: updatedDispute.status,
        gatewayDisputeId: updatedDispute.gatewayDisputeId,
      });

      logger.info('Dispute response submitted successfully', {
        disputeId: request.disputeId,
      });

      return updatedDispute;
    } catch (error) {
      logger.error('Failed to respond to dispute', {
        error,
        disputeId: request.disputeId,
      });
      throw error;
    }
  }

  /**
   * Update dispute status (typically from gateway webhook)
   */
  async updateDisputeStatus(
    disputeId: string,
    status: DisputeStatus,
    gatewayData?: any
  ): Promise<Dispute> {
    try {
      logger.info('Updating dispute status', { disputeId, status });

      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (gatewayData) {
        updateData.metadata = {
          ...updateData.metadata,
          gatewayData,
        };
      }

      const updatedDispute = await prisma.dispute.update({
        where: { id: disputeId },
        data: updateData,
      });

      const dispute = this.mapPrismaDisputeToDispute(updatedDispute);

      // Update transaction status if dispute is resolved
      if (['won', 'lost', 'warning_closed'].includes(status)) {
        await this.handleDisputeResolution(dispute, status);
      }

      // Send notifications
      const transaction = await this.transactionService.getById(
        dispute.transactionId
      );
      await this.sendDisputeNotifications(
        transaction,
        dispute,
        'status_updated'
      );

      // Log audit trail
      await this.auditService.logDisputeEvent({
        disputeId: dispute.id,
        transactionId: transaction.id,
        amount: dispute.amount.toNumber(),
        reason: dispute.reason,
        status: dispute.status,
        gatewayDisputeId: dispute.gatewayDisputeId,
      });

      return dispute;
    } catch (error) {
      logger.error('Failed to update dispute status', {
        error,
        disputeId,
        status,
      });
      throw error;
    }
  }

  /**
   * Get dispute analytics and reporting
   */
  async getDisputeAnalytics(
    startDate: Date,
    endDate: Date,
    merchantId?: string
  ): Promise<DisputeAnalytics> {
    try {
      const whereClause: any = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (merchantId) {
        whereClause.transaction = {
          merchantId,
        };
      }

      const disputes = await prisma.dispute.findMany({
        where: whereClause,
        include: {
          transaction: true,
        },
      });

      const analytics: DisputeAnalytics = {
        totalDisputes: disputes.length,
        disputesByStatus: this.groupDisputesByStatus(disputes),
        disputesByReason: this.groupDisputesByReason(disputes),
        totalDisputeAmount: disputes.reduce(
          (sum, dispute) => sum.plus(dispute.amount),
          new Decimal(0)
        ),
        averageDisputeAmount:
          disputes.length > 0
            ? disputes
                .reduce(
                  (sum, dispute) => sum.plus(dispute.amount),
                  new Decimal(0)
                )
                .div(disputes.length)
            : new Decimal(0),
        winRate: this.calculateWinRate(disputes),
        averageResolutionTime: this.calculateAverageResolutionTime(disputes),
        disputesByGateway: this.groupDisputesByGateway(disputes),
        monthlyTrend: this.calculateMonthlyTrend(disputes),
      };

      return analytics;
    } catch (error) {
      logger.error('Failed to get dispute analytics', {
        error,
        startDate,
        endDate,
        merchantId,
      });
      throw error;
    }
  }

  /**
   * Create dispute record in database
   */
  private async createDisputeRecord(
    transaction: any,
    request: DisputeRequest
  ): Promise<Dispute> {
    try {
      const dispute = await prisma.dispute.create({
        data: {
          transactionId: transaction.id,
          amount: new Decimal(request.amount),
          currency: transaction.currency,
          reason: request.reason,
          status: 'open',
          evidenceDeadline: request.evidenceDeadline,
          gatewayDisputeId: request.gatewayDisputeId,
          metadata: request.metadata || {},
        },
      });

      return this.mapPrismaDisputeToDispute(dispute);
    } catch (error) {
      logger.error('Failed to create dispute record', { error, request });
      throw error;
    }
  }

  /**
   * Update transaction dispute status
   */
  private async updateTransactionDisputeStatus(
    transactionId: string
  ): Promise<void> {
    try {
      await this.transactionService.updateStatus(transactionId, 'disputed');
    } catch (error) {
      logger.error('Failed to update transaction dispute status', {
        error,
        transactionId,
      });
      // Don't throw here as the dispute itself was created successfully
    }
  }

  /**
   * Update dispute with evidence
   */
  private async updateDisputeEvidence(
    disputeId: string,
    evidence: DisputeEvidence,
    submittedBy: string
  ): Promise<Dispute> {
    try {
      const updatedDispute = await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: 'under_review',
          metadata: {
            evidence,
            evidenceSubmittedBy: submittedBy,
            evidenceSubmittedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      });

      return this.mapPrismaDisputeToDispute(updatedDispute);
    } catch (error) {
      logger.error('Failed to update dispute evidence', {
        error,
        disputeId,
      });
      throw error;
    }
  }

  /**
   * Submit evidence to payment gateway
   */
  private async submitEvidenceToGateway(
    gateway: any,
    gatewayDisputeId: string,
    evidence: DisputeEvidence
  ): Promise<void> {
    try {
      if (gateway.submitDisputeEvidence) {
        await gateway.submitDisputeEvidence(gatewayDisputeId, evidence);
      }
    } catch (error) {
      logger.error('Failed to submit evidence to gateway', {
        error,
        gatewayDisputeId,
      });
      // Don't throw here as we still want to record the evidence locally
    }
  }

  /**
   * Submit response to payment gateway
   */
  private async submitResponseToGateway(
    gateway: any,
    gatewayDisputeId: string,
    response: string,
    evidence?: DisputeEvidence
  ): Promise<void> {
    try {
      if (gateway.respondToDispute) {
        await gateway.respondToDispute(gatewayDisputeId, response, evidence);
      }
    } catch (error) {
      logger.error('Failed to submit response to gateway', {
        error,
        gatewayDisputeId,
      });
      // Don't throw here as we still want to record the response locally
    }
  }

  /**
   * Generate automated dispute response
   */
  private async generateAutomatedResponse(
    dispute: Dispute,
    evidence?: DisputeEvidence
  ): Promise<string> {
    // This would use AI/ML to generate appropriate responses
    // For now, return a basic template response
    const responses: Record<string, string> = {
      fraudulent:
        'This transaction was legitimate and authorized by the cardholder. We have provided evidence of the transaction details and customer verification.',
      unrecognized:
        'This transaction was processed correctly and the customer received the goods/services as described. Transaction details and delivery confirmation are provided.',
      duplicate:
        'This transaction is unique and not a duplicate. Each transaction has a distinct reference number and was processed for different goods/services.',
      subscription_canceled:
        'The subscription was active at the time of billing and was canceled according to our terms of service. Billing was legitimate.',
      product_unacceptable:
        'The product/service was delivered as described and meets the quality standards outlined in our terms of service.',
      credit_not_processed:
        "The credit was processed according to our refund policy. Processing times may vary based on the customer's financial institution.",
      general:
        'We believe this dispute is invalid. We have provided comprehensive evidence supporting the legitimacy of this transaction.',
    };

    return responses[dispute.reason] || responses.general;
  }

  /**
   * Handle dispute resolution
   */
  private async handleDisputeResolution(
    dispute: Dispute,
    status: DisputeStatus
  ): Promise<void> {
    try {
      const transaction = await this.transactionService.getById(
        dispute.transactionId
      );

      if (status === 'lost') {
        // If dispute is lost, create a chargeback transaction
        await this.createChargebackTransaction(transaction, dispute);
      }

      // Update transaction status based on dispute outcome
      let newTransactionStatus = transaction.status;
      if (status === 'lost') {
        newTransactionStatus = 'disputed'; // Keep as disputed for lost disputes
      } else if (status === 'won' || status === 'warning_closed') {
        newTransactionStatus = 'succeeded'; // Restore to succeeded for won disputes
      }

      if (newTransactionStatus !== transaction.status) {
        await this.transactionService.updateStatus(
          transaction.id,
          newTransactionStatus
        );
      }
    } catch (error) {
      logger.error('Failed to handle dispute resolution', {
        error,
        disputeId: dispute.id,
        status,
      });
      // Don't throw here as the dispute status was updated successfully
    }
  }

  /**
   * Create chargeback transaction for lost disputes
   */
  private async createChargebackTransaction(
    originalTransaction: any,
    dispute: Dispute
  ): Promise<void> {
    try {
      await this.transactionService.create({
        type: 'chargeback',
        status: 'succeeded',
        amount: dispute.amount.negated(), // Negative amount for chargeback
        currency: dispute.currency,
        description: `Chargeback for dispute ${dispute.id}`,
        userId: originalTransaction.userId,
        merchantId: originalTransaction.merchantId,
        gatewayId: originalTransaction.gatewayId,
        parentId: originalTransaction.id,
        metadata: {
          disputeId: dispute.id,
          originalTransactionId: originalTransaction.id,
          chargebackReason: dispute.reason,
        },
      });
    } catch (error) {
      logger.error('Failed to create chargeback transaction', {
        error,
        disputeId: dispute.id,
      });
      // Don't throw here as the main dispute processing was successful
    }
  }

  /**
   * Send dispute notifications
   */
  private async sendDisputeNotifications(
    transaction: any,
    dispute: Dispute,
    eventType: string
  ): Promise<void> {
    try {
      // This would integrate with the notification service
      logger.info('Sending dispute notification', {
        disputeId: dispute.id,
        transactionId: transaction.id,
        eventType,
      });

      // Merchant notification
      if (transaction.merchantId) {
        // Send notification to merchant about dispute
      }

      // Internal team notification for high-value disputes
      if (dispute.amount.gt(1000)) {
        // Send notification to internal team
      }
    } catch (error) {
      logger.error('Failed to send dispute notifications', {
        error,
        disputeId: dispute.id,
      });
      // Don't throw here as the dispute processing was successful
    }
  }

  /**
   * Group disputes by status for analytics
   */
  private groupDisputesByStatus(disputes: any[]): Record<string, number> {
    return disputes.reduce((acc, dispute) => {
      acc[dispute.status] = (acc[dispute.status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Group disputes by reason for analytics
   */
  private groupDisputesByReason(disputes: any[]): Record<string, number> {
    return disputes.reduce((acc, dispute) => {
      acc[dispute.reason] = (acc[dispute.reason] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Group disputes by gateway for analytics
   */
  private groupDisputesByGateway(disputes: any[]): Record<string, number> {
    return disputes.reduce((acc, dispute) => {
      const gatewayId = dispute.transaction?.gatewayId || 'unknown';
      acc[gatewayId] = (acc[gatewayId] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calculate dispute win rate
   */
  private calculateWinRate(disputes: any[]): number {
    const resolvedDisputes = disputes.filter(d =>
      ['won', 'lost', 'warning_closed'].includes(d.status)
    );
    if (resolvedDisputes.length === 0) return 0;

    const wonDisputes = resolvedDisputes.filter(d =>
      ['won', 'warning_closed'].includes(d.status)
    );
    return (wonDisputes.length / resolvedDisputes.length) * 100;
  }

  /**
   * Calculate average resolution time
   */
  private calculateAverageResolutionTime(disputes: any[]): number {
    const resolvedDisputes = disputes.filter(d =>
      ['won', 'lost', 'warning_closed'].includes(d.status)
    );
    if (resolvedDisputes.length === 0) return 0;

    const totalTime = resolvedDisputes.reduce((sum, dispute) => {
      const resolutionTime =
        dispute.updatedAt.getTime() - dispute.createdAt.getTime();
      return sum + resolutionTime;
    }, 0);

    return totalTime / resolvedDisputes.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  /**
   * Calculate monthly trend
   */
  private calculateMonthlyTrend(disputes: any[]): Record<string, number> {
    return disputes.reduce((acc, dispute) => {
      const month = dispute.createdAt.toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Map Prisma dispute to domain dispute
   */
  private mapPrismaDisputeToDispute(prismaDispute: any): Dispute {
    return {
      id: prismaDispute.id,
      transactionId: prismaDispute.transactionId,
      amount: new Decimal(prismaDispute.amount),
      currency: prismaDispute.currency,
      reason: prismaDispute.reason,
      status: prismaDispute.status,
      evidenceDeadline: prismaDispute.evidenceDeadline,
      gatewayDisputeId: prismaDispute.gatewayDisputeId,
      metadata: prismaDispute.metadata,
      createdAt: prismaDispute.createdAt,
      updatedAt: prismaDispute.updatedAt,
    };
  }
}
