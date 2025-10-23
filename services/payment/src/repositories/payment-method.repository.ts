import { PaymentMethod, Prisma } from '@prisma/client';
import { queryOptimizations } from '../lib/prisma';
import { BaseRepository, handleDatabaseError } from './base.repository';

export type PaymentMethodCreateInput = Prisma.PaymentMethodCreateInput;
export type PaymentMethodUpdateInput = Prisma.PaymentMethodUpdateInput;
export type PaymentMethodWhereInput = Prisma.PaymentMethodWhereInput;

export interface PaymentMethodWithRelations extends PaymentMethod {
  transactions?: any[];
  subscriptions?: any[];
}

export class PaymentMethodRepository extends BaseRepository<
  PaymentMethod,
  PaymentMethodCreateInput,
  PaymentMethodUpdateInput
> {
  constructor() {
    super('paymentMethod');
  }

  async findById(id: string): Promise<PaymentMethodWithRelations | null> {
    try {
      return await this.prisma.paymentMethod.findUnique({
        where: { id },
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findMany(
    options: {
      where?: PaymentMethodWhereInput;
      orderBy?: any;
      skip?: number;
      take?: number;
      include?: any;
    } = {}
  ): Promise<PaymentMethodWithRelations[]> {
    try {
      return await this.prisma.paymentMethod.findMany({
        where: options.where,
        orderBy: options.orderBy || { createdAt: 'desc' },
        skip: options.skip,
        take: options.take,
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async create(data: PaymentMethodCreateInput): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.create({
        data,
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async update(
    id: string,
    data: PaymentMethodUpdateInput
  ): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.update({
        where: { id },
        data,
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async delete(id: string): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.delete({
        where: { id },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async count(where?: PaymentMethodWhereInput): Promise<number> {
    try {
      return await this.prisma.paymentMethod.count({ where });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findFirst(options: {
    where?: PaymentMethodWhereInput;
    orderBy?: any;
    include?: any;
  }): Promise<PaymentMethodWithRelations | null> {
    try {
      return await this.prisma.paymentMethod.findFirst({
        where: options.where,
        orderBy: options.orderBy,
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async upsert(options: {
    where: Prisma.PaymentMethodWhereUniqueInput;
    create: PaymentMethodCreateInput;
    update: PaymentMethodUpdateInput;
  }): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.upsert({
        where: options.where,
        create: options.create,
        update: options.update,
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async createMany(
    data: PaymentMethodCreateInput[]
  ): Promise<{ count: number }> {
    try {
      return await this.prisma.paymentMethod.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async updateMany(options: {
    where: PaymentMethodWhereInput;
    data: Partial<PaymentMethodUpdateInput>;
  }): Promise<{ count: number }> {
    try {
      return await this.prisma.paymentMethod.updateMany({
        where: options.where,
        data: options.data,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async deleteMany(where: PaymentMethodWhereInput): Promise<{ count: number }> {
    try {
      return await this.prisma.paymentMethod.deleteMany({ where });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  // Specialized methods for payment methods

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    try {
      return await this.prisma.paymentMethod.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findByToken(token: string): Promise<PaymentMethod | null> {
    try {
      return await this.prisma.paymentMethod.findUnique({
        where: { token },
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findDefaultByUserId(userId: string): Promise<PaymentMethod | null> {
    try {
      return await this.prisma.paymentMethod.findFirst({
        where: {
          userId,
          isDefault: true,
          isActive: true,
        },
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async setAsDefault(id: string, userId: string): Promise<PaymentMethod> {
    try {
      // Use transaction to ensure atomicity
      return await this.prisma.$transaction(async tx => {
        // First, unset all other default payment methods for this user
        await tx.paymentMethod.updateMany({
          where: {
            userId,
            isDefault: true,
            id: { not: id },
          },
          data: {
            isDefault: false,
          },
        });

        // Then set the specified payment method as default
        return await tx.paymentMethod.update({
          where: { id },
          data: { isDefault: true },
          select: queryOptimizations.paymentMethodSelect,
        });
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async deactivate(id: string): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.update({
        where: { id },
        data: {
          isActive: false,
          isDefault: false, // Can't be default if inactive
        },
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async activate(id: string): Promise<PaymentMethod> {
    try {
      return await this.prisma.paymentMethod.update({
        where: { id },
        data: { isActive: true },
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findByType(userId: string, type: string): Promise<PaymentMethod[]> {
    try {
      return await this.prisma.paymentMethod.findMany({
        where: {
          userId,
          type: type as any,
          isActive: true,
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findByProvider(
    userId: string,
    provider: string
  ): Promise<PaymentMethod[]> {
    try {
      return await this.prisma.paymentMethod.findMany({
        where: {
          userId,
          provider,
          isActive: true,
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        select: queryOptimizations.paymentMethodSelect,
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getUserPaymentMethodStats(userId: string): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
    byProvider: Record<string, number>;
    hasDefault: boolean;
  }> {
    try {
      const [total, active, byType, byProvider, defaultMethod] =
        await Promise.all([
          this.prisma.paymentMethod.count({
            where: { userId },
          }),
          this.prisma.paymentMethod.count({
            where: { userId, isActive: true },
          }),
          this.prisma.paymentMethod.groupBy({
            by: ['type'],
            where: { userId, isActive: true },
            _count: true,
          }),
          this.prisma.paymentMethod.groupBy({
            by: ['provider'],
            where: { userId, isActive: true },
            _count: true,
          }),
          this.prisma.paymentMethod.findFirst({
            where: { userId, isDefault: true, isActive: true },
            select: { id: true },
          }),
        ]);

      return {
        total,
        active,
        byType: byType.reduce(
          (acc, item) => {
            acc[item.type] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        byProvider: byProvider.reduce(
          (acc, item) => {
            acc[item.provider] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        hasDefault: !!defaultMethod,
      };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async cleanupExpiredMethods(): Promise<{ count: number }> {
    try {
      // This would typically check for expired cards based on metadata
      // For now, we'll just mark inactive methods older than 2 years as candidates for cleanup
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      return await this.prisma.paymentMethod.deleteMany({
        where: {
          isActive: false,
          updatedAt: {
            lt: twoYearsAgo,
          },
        },
      });
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
