import {
  DiscountType,
  PrismaClient,
  PromotionType,
} from '../generated/prisma-client/index.js';

export interface PromotionValidationRequest {
  code?: string;
  customerId: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    category: string;
  }>;
  subtotal: number;
}

export interface PromotionResult {
  success: boolean;
  promotion?: {
    id: string;
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
  };
  discount: number;
  error?: string;
}

export interface CreatePromotionData {
  name: string;
  description?: string;
  code?: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userUsageLimit?: number;
  startDate: Date;
  endDate: Date;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

export class PromotionService {
  constructor(private prisma: PrismaClient) {}

  async validatePromotion(
    request: PromotionValidationRequest
  ): Promise<PromotionResult> {
    try {
      let promotion;

      if (request.code) {
        // Validate coupon code
        promotion = await this.prisma.promotion.findFirst({
          where: {
            code: request.code,
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        });

        if (!promotion) {
          return {
            success: false,
            discount: 0,
            error: 'Invalid or expired coupon code',
          };
        }
      } else {
        // Find automatic promotions
        promotion = await this.findBestAutomaticPromotion(request);
      }

      if (!promotion) {
        return {
          success: false,
          discount: 0,
          error: 'No applicable promotions found',
        };
      }

      // Check usage limits
      const usageCheck = await this.checkUsageLimits(
        promotion,
        request.customerId
      );
      if (!usageCheck.valid) {
        return {
          success: false,
          discount: 0,
          error: usageCheck.error,
        };
      }

      // Check minimum order value
      if (
        promotion.minOrderValue &&
        request.subtotal < promotion.minOrderValue
      ) {
        return {
          success: false,
          discount: 0,
          error: `Minimum order value of $${promotion.minOrderValue} required`,
        };
      }

      // Check product/category applicability
      if (!this.isPromotionApplicable(promotion, request.items)) {
        return {
          success: false,
          discount: 0,
          error: 'Promotion not applicable to items in cart',
        };
      }

      // Calculate discount
      const discount = this.calculateDiscount(promotion, request);

      return {
        success: true,
        promotion: {
          id: promotion.id,
          name: promotion.name,
          description: promotion.description || undefined,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
        },
        discount,
      };
    } catch (error) {
      console.error('Promotion validation error:', error);
      return {
        success: false,
        discount: 0,
        error: 'Failed to validate promotion',
      };
    }
  }

  private async findBestAutomaticPromotion(
    request: PromotionValidationRequest
  ) {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        type: PromotionType.AUTOMATIC,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
        OR: [
          { minOrderValue: null },
          { minOrderValue: { lte: request.subtotal } },
        ],
      },
      orderBy: { discountValue: 'desc' },
    });

    // Find the best applicable promotion
    for (const promotion of promotions) {
      if (this.isPromotionApplicable(promotion, request.items)) {
        const usageCheck = await this.checkUsageLimits(
          promotion,
          request.customerId
        );
        if (usageCheck.valid) {
          return promotion;
        }
      }
    }

    return null;
  }

  private async checkUsageLimits(promotion: any, customerId: string) {
    // Check total usage limit
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { valid: false, error: 'Promotion usage limit exceeded' };
    }

    // Check per-user usage limit
    if (promotion.userUsageLimit) {
      const userUsageCount = await this.prisma.promotionUsage.count({
        where: {
          promotionId: promotion.id,
          customerId,
        },
      });

      if (userUsageCount >= promotion.userUsageLimit) {
        return { valid: false, error: 'You have already used this promotion' };
      }
    }

    return { valid: true };
  }

  private isPromotionApplicable(
    promotion: any,
    items: PromotionValidationRequest['items']
  ): boolean {
    // If no restrictions, applicable to all
    if (
      promotion.applicableProducts.length === 0 &&
      promotion.applicableCategories.length === 0
    ) {
      return true;
    }

    // Check if any item matches the promotion criteria
    return items.some(item => {
      const productMatch =
        promotion.applicableProducts.length === 0 ||
        promotion.applicableProducts.includes(item.productId);
      const categoryMatch =
        promotion.applicableCategories.length === 0 ||
        promotion.applicableCategories.includes(item.category);

      return productMatch && categoryMatch;
    });
  }

  private calculateDiscount(
    promotion: any,
    request: PromotionValidationRequest
  ): number {
    let discount = 0;

    switch (promotion.discountType) {
      case DiscountType.PERCENTAGE:
        discount = (request.subtotal * promotion.discountValue) / 100;
        if (promotion.maxDiscount) {
          discount = Math.min(discount, promotion.maxDiscount);
        }
        break;

      case DiscountType.FIXED_AMOUNT:
        discount = Math.min(promotion.discountValue, request.subtotal);
        break;

      case DiscountType.FREE_SHIPPING:
        // This would be handled in shipping calculation
        discount = 0;
        break;

      case DiscountType.BUY_X_GET_Y:
        // Implement buy X get Y logic
        discount = this.calculateBuyXGetYDiscount(promotion, request);
        break;

      default:
        discount = 0;
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  private calculateBuyXGetYDiscount(
    promotion: any,
    request: PromotionValidationRequest
  ): number {
    // Simple implementation - buy 2 get 1 free logic
    // This would need to be more sophisticated in a real implementation
    const applicableItems = request.items.filter(item =>
      this.isPromotionApplicable(promotion, [item])
    );

    let discount = 0;
    for (const item of applicableItems) {
      const freeItems = Math.floor(item.quantity / 3); // Every 3rd item is free
      discount += freeItems * item.price;
    }

    return discount;
  }

  async applyPromotion(
    promotionId: string,
    customerId: string,
    orderId?: string
  ) {
    // Record promotion usage
    await this.prisma.promotionUsage.create({
      data: {
        promotionId,
        customerId,
        orderId,
      },
    });

    // Increment usage count
    await this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }

  async createPromotion(data: CreatePromotionData) {
    return this.prisma.promotion.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        type: data.type,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        userUsageLimit: data.userUsageLimit,
        startDate: data.startDate,
        endDate: data.endDate,
        applicableProducts: data.applicableProducts || [],
        applicableCategories: data.applicableCategories || [],
        isActive: true,
      },
    });
  }

  async getActivePromotions() {
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromotionByCode(code: string) {
    return this.prisma.promotion.findFirst({
      where: {
        code,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
  }

  async getPromotionUsage(promotionId: string) {
    return this.prisma.promotionUsage.findMany({
      where: { promotionId },
      orderBy: { usedAt: 'desc' },
    });
  }
}

export const promotionService = new PromotionService(new PrismaClient());
