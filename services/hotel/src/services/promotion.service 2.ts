// @ts-nocheck
/**
 * Promotion Service - Manages promotions and discount management
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  ConflictError,
  DiscountType,
  NotFoundError,
  Promotion,
  PromotionCondition,
  PromotionConditionType,
  PromotionType,
  PromotionUsage,
  PromotionUsageRecord,
  ValidationError,
} from '@/types';
import logger from '@/utils/logger';
import { addDays } from 'date-fns';

export interface CreatePromotionRequest {
  propertyId: string;
  code?: string;
  name: string;
  description: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  conditions: PromotionCondition[];
  maxTotalUsage?: number;
  maxUsagePerGuest?: number;
}

export interface UpdatePromotionRequest {
  code?: string;
  name?: string;
  description?: string;
  type?: PromotionType;
  discountType?: DiscountType;
  discountValue?: number;
  maxDiscount?: number;
  validFrom?: Date;
  validTo?: Date;
  conditions?: PromotionCondition[];
  maxTotalUsage?: number;
  maxUsagePerGuest?: number;
  isActive?: boolean;
}

export interface ApplyPromotionRequest {
  promotionCode: string;
  propertyId: string;
  guestId: string;
  bookingAmount: number;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  lengthOfStay: number;
  advanceBookingDays: number;
  bookingSource?: string;
}

export interface PromotionValidationResult {
  isValid: boolean;
  errors: string[];
  discountAmount?: number;
  finalAmount?: number;
}

export class PromotionService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new promotion
   */
  async createPromotion(request: CreatePromotionRequest): Promise<Promotion> {
    try {
      logger.info('Creating promotion', { request });

      // Validate request
      await this.validatePromotionRequest(request);

      // Check for code conflicts if code is provided
      if (request.code) {
        await this.checkCodeConflict(request.code, request.propertyId);
      }

      const promotion = await this.prisma.promotion.create({
        data: {
          propertyId: request.propertyId,
          code: request.code,
          name: request.name,
          description: request.description,
          type: request.type,
          discountType: request.discountType,
          discountValue: request.discountValue,
          maxDiscount: request.maxDiscount,
          validFrom: request.validFrom,
          validTo: request.validTo,
          conditions: request.conditions as any,
          usage: {
            maxTotalUsage: request.maxTotalUsage,
            maxUsagePerGuest: request.maxUsagePerGuest,
            currentUsage: 0,
            usageHistory: [],
          },
          isActive: true,
        },
      });

      logger.info('Promotion created successfully', {
        promotionId: promotion.id,
        propertyId: request.propertyId,
        code: request.code,
      });

      return {
        ...promotion,
        code: promotion.code ?? undefined,
        type: promotion.type as PromotionType,
        discountType: promotion.discountType as DiscountType,
        conditions: promotion.conditions as PromotionCondition[],
        usage: promotion.usage as PromotionUsage,
      };
    } catch (error) {
      logger.error('Error creating promotion', { error, request });
      throw error;
    }
  }

  /**
   * Update an existing promotion
   */
  async updatePromotion(
    id: string,
    request: UpdatePromotionRequest
  ): Promise<Promotion> {
    try {
      logger.info('Updating promotion', { id, request });

      // Check if promotion exists
      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!existingPromotion) {
        throw new NotFoundError('Promotion', id);
      }

      // Check for code conflicts if code is being updated
      if (request.code && request.code !== existingPromotion.code) {
        await this.checkCodeConflict(
          request.code,
          existingPromotion.propertyId,
          id
        );
      }

      // Validate update request
      if (request.conditions || request.discountType || request.discountValue) {
        const updateRequest = {
          propertyId: existingPromotion.propertyId,
          code: request.code || existingPromotion.code,
          name: request.name || existingPromotion.name,
          description: request.description || existingPromotion.description,
          type: request.type || (existingPromotion.type as PromotionType),
          discountType:
            request.discountType ||
            (existingPromotion.discountType as DiscountType),
          discountValue:
            request.discountValue !== undefined
              ? request.discountValue
              : existingPromotion.discountValue,
          maxDiscount:
            request.maxDiscount !== undefined
              ? request.maxDiscount
              : existingPromotion.maxDiscount,
          validFrom: request.validFrom || existingPromotion.validFrom,
          validTo: request.validTo || existingPromotion.validTo,
          conditions:
            request.conditions ||
            (existingPromotion.conditions as PromotionCondition[]),
          maxTotalUsage: request.maxTotalUsage,
          maxUsagePerGuest: request.maxUsagePerGuest,
        };

        await this.validatePromotionRequest(updateRequest);
      }

      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: {
          ...(request.code !== undefined && { code: request.code }),
          ...(request.name && { name: request.name }),
          ...(request.description && { description: request.description }),
          ...(request.type && { type: request.type }),
          ...(request.discountType && { discountType: request.discountType }),
          ...(request.discountValue !== undefined && {
            discountValue: request.discountValue,
          }),
          ...(request.maxDiscount !== undefined && {
            maxDiscount: request.maxDiscount,
          }),
          ...(request.validFrom && { validFrom: request.validFrom }),
          ...(request.validTo && { validTo: request.validTo }),
          ...(request.conditions && { conditions: request.conditions }),
          ...(request.isActive !== undefined && { isActive: request.isActive }),
          ...((request.maxTotalUsage !== undefined ||
            request.maxUsagePerGuest !== undefined) && {
            usage: {
              ...(existingPromotion.usage as PromotionUsage),
              ...(request.maxTotalUsage !== undefined && {
                maxTotalUsage: request.maxTotalUsage,
              }),
              ...(request.maxUsagePerGuest !== undefined && {
                maxUsagePerGuest: request.maxUsagePerGuest,
              }),
            },
          }),
        },
      });

      logger.info('Promotion updated successfully', { id });

      return {
        ...updatedPromotion,
        code: updatedPromotion.code ?? undefined,
        type: updatedPromotion.type as PromotionType,
        discountType: updatedPromotion.discountType as DiscountType,
        conditions: updatedPromotion.conditions as PromotionCondition[],
        usage: updatedPromotion.usage as PromotionUsage,
      };
    } catch (error) {
      logger.error('Error updating promotion', { error, id, request });
      throw error;
    }
  }

  /**
   * Get promotion by ID
   */
  async getPromotion(id: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundError('Promotion', id);
    }

    return promotion;
  }

  /**
   * Get promotion by code
   */
  async getPromotionByCode(
    code: string,
    propertyId: string
  ): Promise<Promotion | null> {
    return this.prisma.promotion.findFirst({
      where: {
        code,
        propertyId,
        isActive: true,
        validFrom: {
          lte: new Date(),
        },
        validTo: {
          gte: new Date(),
        },
      },
    });
  }

  /**
   * Get all promotions for a property
   */
  async getPromotions(
    propertyId: string,
    options?: {
      isActive?: boolean;
      type?: PromotionType;
      includeExpired?: boolean;
    }
  ): Promise<Promotion[]> {
    const where: any = { propertyId };

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.type) {
      where.type = options.type;
    }

    if (!options?.includeExpired) {
      where.validTo = {
        gte: new Date(),
      };
    }

    return this.prisma.promotion.findMany({
      where,
      orderBy: [{ validFrom: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get auto-applicable promotions for a booking
   */
  async getAutoApplicablePromotions(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date,
    roomTypeId: string,
    bookingAmount: number,
    lengthOfStay: number,
    advanceBookingDays: number,
    bookingSource?: string
  ): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        propertyId,
        isActive: true,
        type: PromotionType.PUBLIC,
        code: null, // Auto-applicable promotions don't have codes
        validFrom: {
          lte: checkOutDate,
        },
        validTo: {
          gte: checkInDate,
        },
      },
    });

    // Filter promotions based on conditions
    const applicablePromotions: Promotion[] = [];

    for (const promotion of promotions) {
      const validation = await this.validatePromotionConditions(promotion, {
        roomTypeId,
        checkInDate,
        checkOutDate,
        lengthOfStay,
        advanceBookingDays,
        bookingAmount,
        bookingSource,
      });

      if (validation.isValid) {
        applicablePromotions.push(promotion);
      }
    }

    return applicablePromotions;
  }

  /**
   * Validate and apply a promotion
   */
  async validateAndApplyPromotion(
    request: ApplyPromotionRequest
  ): Promise<PromotionValidationResult> {
    try {
      logger.info('Validating and applying promotion', { request });

      // Get promotion by code
      const promotion = await this.getPromotionByCode(
        request.promotionCode,
        request.propertyId
      );

      if (!promotion) {
        return {
          isValid: false,
          errors: ['Promotion code not found or expired'],
        };
      }

      // Validate promotion conditions
      const validation = await this.validatePromotionConditions(promotion, {
        roomTypeId: request.roomTypeId,
        checkInDate: request.checkInDate,
        checkOutDate: request.checkOutDate,
        lengthOfStay: request.lengthOfStay,
        advanceBookingDays: request.advanceBookingDays,
        bookingAmount: request.bookingAmount,
        bookingSource: request.bookingSource,
      });

      if (!validation.isValid) {
        return validation;
      }

      // Check usage limits
      const usageValidation = await this.validatePromotionUsage(
        promotion,
        request.guestId
      );
      if (!usageValidation.isValid) {
        return usageValidation;
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(
        promotion,
        request.bookingAmount
      );
      const finalAmount = Math.max(0, request.bookingAmount - discountAmount);

      logger.info('Promotion validation successful', {
        promotionId: promotion.id,
        discountAmount,
        finalAmount,
      });

      return {
        isValid: true,
        errors: [],
        discountAmount,
        finalAmount,
      };
    } catch (error) {
      logger.error('Error validating promotion', { error, request });
      return {
        isValid: false,
        errors: ['Error validating promotion'],
      };
    }
  }

  /**
   * Record promotion usage
   */
  async recordPromotionUsage(
    promotionId: string,
    bookingId: string,
    guestId: string,
    discountAmount: number
  ): Promise<void> {
    try {
      logger.info('Recording promotion usage', {
        promotionId,
        bookingId,
        guestId,
        discountAmount,
      });

      const promotion = await this.getPromotion(promotionId);
      const usage = promotion.usage as PromotionUsage;

      const usageRecord: PromotionUsageRecord = {
        bookingId,
        guestId,
        usedAt: new Date(),
        discountAmount,
      };

      const updatedUsage: PromotionUsage = {
        ...usage,
        currentUsage: usage.currentUsage + 1,
        usageHistory: [...usage.usageHistory, usageRecord],
      };

      await this.prisma.promotion.update({
        where: { id: promotionId },
        data: { usage: updatedUsage },
      });

      logger.info('Promotion usage recorded successfully', {
        promotionId,
        bookingId,
      });
    } catch (error) {
      logger.error('Error recording promotion usage', {
        error,
        promotionId,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Delete a promotion
   */
  async deletePromotion(id: string): Promise<void> {
    try {
      logger.info('Deleting promotion', { id });

      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!existingPromotion) {
        throw new NotFoundError('Promotion', id);
      }

      await this.prisma.promotion.delete({
        where: { id },
      });

      logger.info('Promotion deleted successfully', { id });
    } catch (error) {
      logger.error('Error deleting promotion', { error, id });
      throw error;
    }
  }

  /**
   * Activate or deactivate a promotion
   */
  async togglePromotion(id: string, isActive: boolean): Promise<Promotion> {
    try {
      logger.info('Toggling promotion status', { id, isActive });

      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!existingPromotion) {
        throw new NotFoundError('Promotion', id);
      }

      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: { isActive },
      });

      logger.info('Promotion status updated', { id, isActive });

      return updatedPromotion;
    } catch (error) {
      logger.error('Error toggling promotion status', { error, id, isActive });
      throw error;
    }
  }

  /**
   * Get promotion usage statistics
   */
  async getPromotionUsageStats(id: string): Promise<{
    totalUsage: number;
    totalDiscount: number;
    usageByGuest: Record<string, number>;
    usageByMonth: Record<string, number>;
    remainingUsage?: number;
  }> {
    const promotion = await this.getPromotion(id);
    const usage = promotion.usage as PromotionUsage;

    const totalUsage = usage.currentUsage;
    const totalDiscount = usage.usageHistory.reduce(
      (sum, record) => sum + record.discountAmount,
      0
    );

    const usageByGuest: Record<string, number> = {};
    const usageByMonth: Record<string, number> = {};

    for (const record of usage.usageHistory) {
      // Usage by guest
      usageByGuest[record.guestId] = (usageByGuest[record.guestId] || 0) + 1;

      // Usage by month
      const monthKey = record.usedAt.toISOString().substring(0, 7); // YYYY-MM
      usageByMonth[monthKey] = (usageByMonth[monthKey] || 0) + 1;
    }

    const stats: any = {
      totalUsage,
      totalDiscount,
      usageByGuest,
      usageByMonth,
    };

    if (usage.maxTotalUsage) {
      stats.remainingUsage = Math.max(0, usage.maxTotalUsage - totalUsage);
    }

    return stats;
  }

  /**
   * Create predefined promotions for common scenarios
   */
  async createPredefinedPromotions(propertyId: string): Promise<Promotion[]> {
    const promotions: CreatePromotionRequest[] = [
      // Early bird discount
      {
        propertyId,
        code: 'EARLYBIRD15',
        name: 'Early Bird Discount',
        description: '15% off for bookings made 30 days in advance',
        type: PromotionType.PUBLIC,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 15,
        maxDiscount: 200,
        validFrom: new Date(),
        validTo: addDays(new Date(), 365),
        conditions: [
          {
            type: PromotionConditionType.ADVANCE_BOOKING,
            value: 30,
            description: 'Must book at least 30 days in advance',
          },
        ],
        maxTotalUsage: 1000,
        maxUsagePerGuest: 2,
      },
      // Extended stay discount
      {
        propertyId,
        code: 'STAY7SAVE',
        name: 'Extended Stay Discount',
        description: '20% off for stays of 7 nights or more',
        type: PromotionType.PUBLIC,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        maxDiscount: 500,
        validFrom: new Date(),
        validTo: addDays(new Date(), 365),
        conditions: [
          {
            type: PromotionConditionType.MINIMUM_STAY,
            value: 7,
            description: 'Minimum stay of 7 nights required',
          },
        ],
        maxTotalUsage: 500,
        maxUsagePerGuest: 1,
      },
      // Last minute deal
      {
        propertyId,
        name: 'Last Minute Deal',
        description: '25% off for bookings made within 24 hours',
        type: PromotionType.PUBLIC,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 25,
        maxDiscount: 150,
        validFrom: new Date(),
        validTo: addDays(new Date(), 90),
        conditions: [
          {
            type: PromotionConditionType.ADVANCE_BOOKING,
            value: 1,
            description: 'Must book within 24 hours of check-in',
          },
        ],
        maxTotalUsage: 200,
        maxUsagePerGuest: 1,
      },
    ];

    const createdPromotions: Promotion[] = [];
    for (const promotionRequest of promotions) {
      try {
        const promotion = await this.createPromotion(promotionRequest);
        createdPromotions.push(promotion);
      } catch (error) {
        logger.warn('Failed to create predefined promotion', {
          error,
          promotion: promotionRequest.name,
        });
      }
    }

    return createdPromotions;
  }

  /**
   * Validate promotion conditions
   */
  private async validatePromotionConditions(
    promotion: Promotion,
    bookingData: {
      roomTypeId: string;
      checkInDate: Date;
      checkOutDate: Date;
      lengthOfStay: number;
      advanceBookingDays: number;
      bookingAmount: number;
      bookingSource?: string;
    }
  ): Promise<PromotionValidationResult> {
    const conditions = promotion.conditions as PromotionCondition[];
    const errors: string[] = [];

    for (const condition of conditions) {
      let isConditionMet = false;

      switch (condition.type) {
        case PromotionConditionType.MINIMUM_STAY:
          isConditionMet = bookingData.lengthOfStay >= condition.value;
          if (!isConditionMet) {
            errors.push(`Minimum stay of ${condition.value} nights required`);
          }
          break;

        case PromotionConditionType.ADVANCE_BOOKING:
          isConditionMet = bookingData.advanceBookingDays >= condition.value;
          if (!isConditionMet) {
            errors.push(
              `Must book at least ${condition.value} days in advance`
            );
          }
          break;

        case PromotionConditionType.BOOKING_WINDOW:
          const [minDays, maxDays] = condition.value as [number, number];
          isConditionMet =
            bookingData.advanceBookingDays >= minDays &&
            bookingData.advanceBookingDays <= maxDays;
          if (!isConditionMet) {
            errors.push(
              `Must book between ${minDays} and ${maxDays} days in advance`
            );
          }
          break;

        case PromotionConditionType.ROOM_TYPES:
          const allowedRoomTypes = condition.value as string[];
          isConditionMet = allowedRoomTypes.includes(bookingData.roomTypeId);
          if (!isConditionMet) {
            errors.push('Promotion not applicable to selected room type');
          }
          break;

        case PromotionConditionType.BOOKING_SOURCE:
          const allowedSources = condition.value as string[];
          isConditionMet =
            !bookingData.bookingSource ||
            allowedSources.includes(bookingData.bookingSource);
          if (!isConditionMet) {
            errors.push('Promotion not applicable to this booking source');
          }
          break;

        case PromotionConditionType.MINIMUM_AMOUNT:
          isConditionMet = bookingData.bookingAmount >= condition.value;
          if (!isConditionMet) {
            errors.push(
              `Minimum booking amount of $${condition.value} required`
            );
          }
          break;

        case PromotionConditionType.BLACKOUT_DATES:
          const blackoutDates = condition.value as string[];
          const checkInStr = bookingData.checkInDate
            .toISOString()
            .split('T')[0];
          const checkOutStr = bookingData.checkOutDate
            .toISOString()
            .split('T')[0];
          isConditionMet =
            !blackoutDates.includes(checkInStr) &&
            !blackoutDates.includes(checkOutStr);
          if (!isConditionMet) {
            errors.push('Promotion not available for selected dates');
          }
          break;

        default:
          isConditionMet = true;
      }

      if (!isConditionMet) {
        break; // Stop at first failed condition
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate promotion usage limits
   */
  private async validatePromotionUsage(
    promotion: Promotion,
    guestId: string
  ): Promise<PromotionValidationResult> {
    const usage = promotion.usage as PromotionUsage;
    const errors: string[] = [];

    // Check total usage limit
    if (usage.maxTotalUsage && usage.currentUsage >= usage.maxTotalUsage) {
      errors.push('Promotion usage limit exceeded');
    }

    // Check per-guest usage limit
    if (usage.maxUsagePerGuest) {
      const guestUsage = usage.usageHistory.filter(
        record => record.guestId === guestId
      ).length;
      if (guestUsage >= usage.maxUsagePerGuest) {
        errors.push(
          'You have already used this promotion the maximum number of times'
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate discount amount
   */
  private calculateDiscount(
    promotion: Promotion,
    bookingAmount: number
  ): number {
    let discountAmount = 0;

    switch (promotion.discountType) {
      case DiscountType.PERCENTAGE:
        discountAmount = bookingAmount * (promotion.discountValue / 100);
        break;
      case DiscountType.FIXED_AMOUNT:
        discountAmount = promotion.discountValue;
        break;
    }

    // Apply max discount limit
    if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
      discountAmount = promotion.maxDiscount;
    }

    return Math.round(discountAmount * 100) / 100;
  }

  /**
   * Check for promotion code conflicts
   */
  private async checkCodeConflict(
    code: string,
    propertyId: string,
    excludeId?: string
  ): Promise<void> {
    const where: any = {
      code,
      propertyId,
      isActive: true,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingPromotion = await this.prisma.promotion.findFirst({ where });

    if (existingPromotion) {
      throw new ConflictError(
        `Promotion code '${code}' already exists for this property`
      );
    }
  }

  /**
   * Validate promotion request
   */
  private async validatePromotionRequest(
    request: CreatePromotionRequest
  ): Promise<void> {
    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }

    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Promotion name is required');
    }

    if (!Object.values(PromotionType).includes(request.type)) {
      throw new ValidationError(`Invalid promotion type: ${request.type}`);
    }

    if (!Object.values(DiscountType).includes(request.discountType)) {
      throw new ValidationError(
        `Invalid discount type: ${request.discountType}`
      );
    }

    if (request.discountValue <= 0) {
      throw new ValidationError('Discount value must be greater than 0');
    }

    if (
      request.discountType === DiscountType.PERCENTAGE &&
      request.discountValue > 100
    ) {
      throw new ValidationError('Percentage discount cannot exceed 100%');
    }

    if (request.maxDiscount !== undefined && request.maxDiscount <= 0) {
      throw new ValidationError('Maximum discount must be greater than 0');
    }

    if (!request.validFrom || !request.validTo) {
      throw new ValidationError('Valid from and valid to dates are required');
    }

    if (request.validFrom >= request.validTo) {
      throw new ValidationError('Valid to date must be after valid from date');
    }

    if (!request.conditions || request.conditions.length === 0) {
      throw new ValidationError('At least one condition is required');
    }

    // Validate conditions
    for (const condition of request.conditions) {
      if (!Object.values(PromotionConditionType).includes(condition.type)) {
        throw new ValidationError(`Invalid condition type: ${condition.type}`);
      }

      if (condition.value === undefined || condition.value === null) {
        throw new ValidationError('Condition value is required');
      }
    }

    // Verify property exists
    const property = await this.prisma.property.findUnique({
      where: { id: request.propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', request.propertyId);
    }
  }
}
