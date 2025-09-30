import { ITransactionService } from '../interfaces/payment.interface';
import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { FilterParams, PaginatedResponse, PaymentStatus, Transaction } from '../types';
import { TransactionNotFoundError } from '../utils/errors';

export class TransactionService implements ITransactionService {
  async create(data: Partial<Transaction>): Promise<Transaction> {
    try {
      logger.info('Creating new transaction', {
        amount: data.amount?.toString(),
        currency: data.currency,
        userId: data.userId
      });

      const transaction = await prisma.transaction.create({
        data: {
          type: data.type || 'PAYMENT',
          status: data.status || 'PENDING',
          amount: new Decimal(data.amount?.toString() || '0'),
          currency: data.currency || 'USD',
          description: data.description,
          userId: data.userId,
          merchantId: data.merchantId,
          vendorId: data.vendorId,
          paymentMethodId: data.paymentMethodId,
          gatewayId: data.gatewayId || '',
          gatewayTransactionId: data.gatewayTransactionId,
          internalReference: data.internalReference,
          externalReference: data.externalReference,
          platformFee: data.platformFee ? new Decimal(data.platformFee.toString()) : undefined,
          gatewayFee: data.gatewayFee ? new Decimal(data.gatewayFee.toString()) : undefined,
          riskScore: data.riskScore,
          fraudFlags: data.fraudFlags || [],
          metadata: data.metadata || {},
          processedAt: data.processedAt,
          settledAt: data.settledAt,
          parentId: data.parent?.id,
        },
        include: {
          paymentMethod: true,
          gateway: true,
          refunds: true,
          disputes: true,
          splits: true,
          fraudAssessment: true,
          parent: true,
          children: true,
        },
      });

      logger.info('Transaction created successfully', { transactionId: transaction.id });
      return this.mapPrismaToTransaction(transaction);
    } catch (error) {
      logger.error('Failed to create transaction', { error, data });
      throw error;
    }
  }

  async getById(id: string): Promise<Transaction> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          paymentMethod: true,
          gateway: true,
          refunds: true,
          disputes: true,
          splits: true,
          fraudAssessment: true,
          parent: true,
          children: true,
        },
      });

      if (!transaction) {
        throw new TransactionNotFoundError(id);
      }

      return this.mapPrismaToTransaction(transaction);
    } catch (error) {
      logger.error('Failed to get transaction by ID', { error, transactionId: id });
      throw error;
    }
  }

  async getByFilters(filters: FilterParams): Promise<PaginatedResponse<Transaction>> {
    try {
      const {
        userId,
        merchantId,
        status,
        currency,
        amountMin,
        amountMax,
        dateFrom,
        dateTo,
        gatewayId,
        page = 1,
        limit = 20,
      } = filters;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (userId) where.userId = userId;
      if (merchantId) where.merchantId = merchantId;
      if (status) where.status = status;
      if (currency) where.currency = currency;
      if (gatewayId) where.gatewayId = gatewayId;

      if (amountMin || amountMax) {
        where.amount = {};
        if (amountMin) where.amount.gte = new Decimal(amountMin);
        if (amountMax) where.amount.lte = new Decimal(amountMax);
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            paymentMethod: true,
            gateway: true,
            refunds: true,
            disputes: true,
            splits: true,
            fraudAssessment: true,
            parent: true,
            children: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.transaction.count({ where }),
      ]);

      const mappedTransactions = transactions.map(this.mapPrismaToTransaction);

      return {
        data: mappedTransactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Failed to get transactions by filters', { error, filters });
      throw error;
    }
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    try {
      logger.info('Updating transaction', { transactionId: id, updates: data });

      const updateData: any = {};

      if (data.status) updateData.status = data.status;
      if (data.description) updateData.description = data.description;
      if (data.gatewayTransactionId) updateData.gatewayTransactionId = data.gatewayTransactionId;
      if (data.platformFee) updateData.platformFee = new Decimal(data.platformFee.toString());
      if (data.gatewayFee) updateData.gatewayFee = new Decimal(data.gatewayFee.toString());
      if (data.riskScore !== undefined) updateData.riskScore = data.riskScore;
      if (data.fraudFlags) updateData.fraudFlags = data.fraudFlags;
      if (data.metadata) updateData.metadata = data.metadata;
      if (data.processedAt) updateData.processedAt = data.processedAt;
      if (data.settledAt) updateData.settledAt = data.settledAt;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          paymentMethod: true,
          gateway: true,
          refunds: true,
          disputes: true,
          splits: true,
          fraudAssessment: true,
          parent: true,
          children: true,
        },
      });

      logger.info('Transaction updated successfully', { transactionId: id });
      return this.mapPrismaToTransaction(transaction);
    } catch (error) {
      logger.error('Failed to update transaction', { error, transactionId: id, data });
      throw error;
    }
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Transaction> {
    try {
      logger.info('Updating transaction status', { transactionId: id, status });

      const updateData: any = { status };

      // Set processedAt when status changes to succeeded or failed
      if (status === 'succeeded' || status === 'failed') {
        updateData.processedAt = new Date();
      }

      // Set settledAt when status changes to succeeded
      if (status === 'succeeded') {
        updateData.settledAt = new Date();
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          paymentMethod: true,
          gateway: true,
          refunds: true,
          disputes: true,
          splits: true,
          fraudAssessment: true,
          parent: true,
          children: true,
        },
      });

      logger.info('Transaction status updated successfully', { transactionId: id, status });
      return this.mapPrismaToTransaction(transaction);
    } catch (error) {
      logger.error('Failed to update transaction status', { error, transactionId: id, status });
      throw error;
    }
  }

  async addSplit(transactionId: string, split: any): Promise<void> {
    try {
      logger.info('Adding payment split', { transactionId, split });

      await prisma.paymentSplit.create({
        data: {
          transactionId,
          recipientId: split.recipientId,
          amount: new Decimal(split.amount.toString()),
          currency: split.currency,
          type: split.type || 'FIXED',
          description: split.description,
          status: 'PENDING',
        },
      });

      logger.info('Payment split added successfully', { transactionId });
    } catch (error) {
      logger.error('Failed to add payment split', { error, transactionId, split });
      throw error;
    }
  }

  async processSplits(transactionId: string): Promise<void> {
    try {
      logger.info('Processing payment splits', { transactionId });

      const splits = await prisma.paymentSplit.findMany({
        where: { transactionId, status: 'PENDING' },
      });

      for (const split of splits) {
        // In a real implementation, this would integrate with the gateway
        // to actually transfer the funds to the recipient
        await prisma.paymentSplit.update({
          where: { id: split.id },
          data: {
            status: 'PROCESSING',
            processedAt: new Date(),
          },
        });

        // Simulate processing delay
        // In production, this would be handled by a background job
        setTimeout(async () => {
          await prisma.paymentSplit.update({
            where: { id: split.id },
            data: { status: 'SUCCEEDED' },
          });
        }, 1000);
      }

      logger.info('Payment splits processed successfully', { transactionId });
    } catch (error) {
      logger.error('Failed to process payment splits', { error, transactionId });
      throw error;
    }
  }

  private mapPrismaToTransaction(prismaTransaction: any): Transaction {
    return {
      id: prismaTransaction.id,
      type: prismaTransaction.type,
      status: prismaTransaction.status,
      amount: new Decimal(prismaTransaction.amount.toString()),
      currency: prismaTransaction.currency,
      description: prismaTransaction.description,
      userId: prismaTransaction.userId,
      merchantId: prismaTransaction.merchantId,
      vendorId: prismaTransaction.vendorId,
      paymentMethodId: prismaTransaction.paymentMethodId,
      gatewayId: prismaTransaction.gatewayId,
      gatewayTransactionId: prismaTransaction.gatewayTransactionId,
      metadata: prismaTransaction.metadata,
      internalReference: prismaTransaction.internalReference,
      externalReference: prismaTransaction.externalReference,
      platformFee: prismaTransaction.platformFee ? new Decimal(prismaTransaction.platformFee.toString()) : undefined,
      gatewayFee: prismaTransaction.gatewayFee ? new Decimal(prismaTransaction.gatewayFee.toString()) : undefined,
      riskScore: prismaTransaction.riskScore,
      fraudFlags: prismaTransaction.fraudFlags,
      processedAt: prismaTransaction.processedAt,
      settledAt: prismaTransaction.settledAt,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
      refunds: prismaTransaction.refunds?.map((refund: any) => ({
        id: refund.id,
        transactionId: refund.transactionId,
        amount: new Decimal(refund.amount.toString()),
        currency: refund.currency,
        reason: refund.reason,
        status: refund.status,
        gatewayRefundId: refund.gatewayRefundId,
        metadata: refund.metadata,
        processedAt: refund.processedAt,
        createdAt: refund.createdAt,
        updatedAt: refund.updatedAt,
      })),
      disputes: prismaTransaction.disputes?.map((dispute: any) => ({
        id: dispute.id,
        transactionId: dispute.transactionId,
        amount: new Decimal(dispute.amount.toString()),
        currency: dispute.currency,
        reason: dispute.reason,
        status: dispute.status,
        evidenceDeadline: dispute.evidenceDeadline,
        gatewayDisputeId: dispute.gatewayDisputeId,
        metadata: dispute.metadata,
        createdAt: dispute.createdAt,
        updatedAt: dispute.updatedAt,
      })),
      splits: prismaTransaction.splits?.map((split: any) => ({
        id: split.id,
        transactionId: split.transactionId,
        recipientId: split.recipientId,
        amount: new Decimal(split.amount.toString()),
        currency: split.currency,
        type: split.type,
        description: split.description,
        status: split.status,
        processedAt: split.processedAt,
      })),
      parent: prismaTransaction.parent ? this.mapPrismaToTransaction(prismaTransaction.parent) : undefined,
      children: prismaTransaction.children?.map(this.mapPrismaToTransaction.bind(this)),
    } as Transaction;
  }
}