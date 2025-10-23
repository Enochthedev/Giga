import { Prisma, Transaction } from '@prisma/client';
import { queryOptimizations } from '../lib/prisma';
import {
  BaseRepository,
  PaginatedResult,
  PaginationOptions,
  applyPagination,
  createPaginatedResult,
  handleDatabaseError,
} from './base.repository';

export type TransactionCreateInput = Prisma.TransactionCreateInput;
export type TransactionUpdateInput = Prisma.TransactionUpdateInput;
export type TransactionWhereInput = Prisma.TransactionWhereInput;
export type TransactionOrderByInput =
  Prisma.TransactionOrderByWithRelationInput;

export interface TransactionWithRelations extends Transaction {
  paymentMethod?: any;
  gateway?: any;
  refunds?: any[];
  disputes?: any[];
  splits?: any[];
  fraudAssessment?: any;
}

export interface TransactionFilters {
  userId?: string;
  merchantId?: string;
  status?: string[];
  type?: string[];
  gatewayId?: string;
  amountRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  currency?: string;
  search?: string; // Search in description, reference, etc.
}

export class TransactionRepository extends BaseRepository<
  Transaction,
  TransactionCreateInput,
  TransactionUpdateInput
> {
  constructor() {
    super('transaction');
  }

  async findById(id: string): Promise<TransactionWithRelations | null> {
    try {
      return await this.prisma.transaction.findUnique({
        where: { id },
        include: queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findMany(
    options: {
      where?: TransactionWhereInput;
      orderBy?: TransactionOrderByInput;
      skip?: number;
      take?: number;
      include?: any;
    } = {}
  ): Promise<TransactionWithRelations[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: options.where,
        orderBy: options.orderBy || { createdAt: 'desc' },
        skip: options.skip,
        take: options.take,
        include: options.include || queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findManyPaginated(
    filters: TransactionFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<TransactionWithRelations>> {
    try {
      const where = this.buildWhereClause(filters);
      const { skip, take, page, limit } = applyPagination(pagination);

      const [data, total] = await Promise.all([
        this.prisma.transaction.findMany({
          where,
          orderBy: pagination.orderBy || { createdAt: 'desc' },
          skip,
          take,
          include: queryOptimizations.transactionInclude,
        }),
        this.prisma.transaction.count({ where }),
      ]);

      return createPaginatedResult(data, total, page, limit);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async create(data: TransactionCreateInput): Promise<Transaction> {
    try {
      return await this.prisma.transaction.create({
        data,
        include: queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async update(id: string, data: TransactionUpdateInput): Promise<Transaction> {
    try {
      return await this.prisma.transaction.update({
        where: { id },
        data,
        include: queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async delete(id: string): Promise<Transaction> {
    try {
      return await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async count(where?: TransactionWhereInput): Promise<number> {
    try {
      return await this.prisma.transaction.count({ where });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findFirst(options: {
    where?: TransactionWhereInput;
    orderBy?: TransactionOrderByInput;
    include?: any;
  }): Promise<TransactionWithRelations | null> {
    try {
      return await this.prisma.transaction.findFirst({
        where: options.where,
        orderBy: options.orderBy,
        include: options.include || queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async upsert(options: {
    where: Prisma.TransactionWhereUniqueInput;
    create: TransactionCreateInput;
    update: TransactionUpdateInput;
  }): Promise<Transaction> {
    try {
      return await this.prisma.transaction.upsert({
        where: options.where,
        create: options.create,
        update: options.update,
        include: queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async createMany(data: TransactionCreateInput[]): Promise<{ count: number }> {
    try {
      // Convert TransactionCreateInput to TransactionCreateManyInput
      const createManyData = data.map(item => {
        // Extract the required fields for createMany
        const { gateway, paymentMethod, ...rest } = item as any;
        return {
          ...rest,
          gatewayId:
            typeof gateway === 'string' ? gateway : gateway?.connect?.id,
          paymentMethodId:
            typeof paymentMethod === 'string'
              ? paymentMethod
              : paymentMethod?.connect?.id,
        };
      });

      return await this.prisma.transaction.createMany({
        data: createManyData,
        skipDuplicates: true,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async updateMany(options: {
    where: TransactionWhereInput;
    data: Partial<TransactionUpdateInput>;
  }): Promise<{ count: number }> {
    try {
      return await this.prisma.transaction.updateMany({
        where: options.where,
        data: options.data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async deleteMany(where: TransactionWhereInput): Promise<{ count: number }> {
    try {
      return await this.prisma.transaction.deleteMany({ where });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  // Specialized methods for transactions

  async findByReference(reference: string): Promise<Transaction | null> {
    try {
      return await this.prisma.transaction.findFirst({
        where: {
          OR: [
            { internalReference: reference },
            { externalReference: reference },
            { gatewayTransactionId: reference },
          ],
        },
        include: queryOptimizations.transactionInclude,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findByUserId(
    userId: string,
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<TransactionWithRelations>> {
    return this.findManyPaginated({ userId }, pagination);
  }

  async findByMerchantId(
    merchantId: string,
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<TransactionWithRelations>> {
    return this.findManyPaginated({ merchantId }, pagination);
  }

  async findByStatus(
    status: string[],
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<TransactionWithRelations>> {
    return this.findManyPaginated({ status }, pagination);
  }

  async findPendingTransactions(): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: new Date(Date.now() - 30 * 60 * 1000), // Older than 30 minutes
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 100, // Limit to prevent overwhelming
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getTransactionStats(filters: TransactionFilters = {}): Promise<{
    totalCount: number;
    totalAmount: number;
    successfulCount: number;
    successfulAmount: number;
    failedCount: number;
    averageAmount: number;
    statusBreakdown: Record<string, number>;
    typeBreakdown: Record<string, number>;
  }> {
    try {
      const where = this.buildWhereClause(filters);

      const [
        totalCount,
        totalAmountResult,
        successfulStats,
        failedCount,
        statusBreakdown,
        typeBreakdown,
      ] = await Promise.all([
        this.prisma.transaction.count({ where }),
        this.prisma.transaction.aggregate({
          where,
          _sum: { amount: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            ...where,
            status: 'SUCCEEDED',
          },
          _count: true,
          _sum: { amount: true },
        }),
        this.prisma.transaction.count({
          where: {
            ...where,
            status: 'FAILED',
          },
        }),
        this.prisma.transaction.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        this.prisma.transaction.groupBy({
          by: ['type'],
          where,
          _count: true,
        }),
      ]);

      const totalAmount = Number(totalAmountResult._sum.amount || 0);
      const successfulAmount = Number(successfulStats._sum.amount || 0);
      const successfulCount = successfulStats._count;

      return {
        totalCount,
        totalAmount,
        successfulCount,
        successfulAmount,
        failedCount,
        averageAmount: totalCount > 0 ? totalAmount / totalCount : 0,
        statusBreakdown: statusBreakdown.reduce(
          (acc, item) => {
            acc[item.status] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        typeBreakdown: typeBreakdown.reduce(
          (acc, item) => {
            acc[item.type] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  private buildWhereClause(filters: TransactionFilters): TransactionWhereInput {
    const where: TransactionWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.merchantId) {
      where.merchantId = filters.merchantId;
    }

    if (filters.status && filters.status.length > 0) {
      where.status = { in: filters.status as any[] };
    }

    if (filters.type && filters.type.length > 0) {
      where.type = { in: filters.type as any[] };
    }

    if (filters.gatewayId) {
      where.gatewayId = filters.gatewayId;
    }

    if (filters.currency) {
      where.currency = filters.currency;
    }

    if (filters.amountRange) {
      where.amount = {};
      if (filters.amountRange.min !== undefined) {
        where.amount.gte = filters.amountRange.min;
      }
      if (filters.amountRange.max !== undefined) {
        where.amount.lte = filters.amountRange.max;
      }
    }

    if (filters.dateRange) {
      where.createdAt = {};
      if (filters.dateRange.from) {
        where.createdAt.gte = filters.dateRange.from;
      }
      if (filters.dateRange.to) {
        where.createdAt.lte = filters.dateRange.to;
      }
    }

    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        {
          internalReference: { contains: filters.search, mode: 'insensitive' },
        },
        {
          externalReference: { contains: filters.search, mode: 'insensitive' },
        },
        {
          gatewayTransactionId: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }
}
