// @ts-nocheck
/**
 * Pricing Service - Handles all pricing calculations and dynamic pricing logic
 */

import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns';
import { PrismaClient } from '@/generated/prisma-client';
import {
  AdjustmentMethod,
  ConditionOperator,
  DiscountType,
  DynamicPricingRule,
  NotFoundError,
  PriceCalculation,
  PriceCalculationRequest,
  PricingError,
  Promotion,
  PromotionType,
  RateRecord,
  RateType,
  RedisClientType,
  SeasonalRate,
  ValidationError,
} from '@/types';
import logger from '@/utils/logger';

export class PricingService {
  constructor(
    private prisma: PrismaClient,
    private redis: RedisClientType
  ) {}

  /**
   * Calculate price for a booking request with all applicable adjustments
   */
  async calculatePrice(
    request: PriceCalculationRequest
  ): Promise<PriceCalculation> {
    try {
      logger.info('Calculating price for booking request', { request });

      // Validate request
      await this.validatePriceRequest(request);

      // Get base rates for the date range
      const baseRates = await this.getBaseRates(
        request.propertyId,
        request.roomTypeId,
        request.checkInDate,
        request.checkOutDate
      );

      if (baseRates.length === 0) {
        throw new PricingError(
          'No base rates found for the specified date range'
        );
      }

      // Apply seasonal adjustments
      const seasonalRates = await this.applySeasonalAdjustments(
        baseRates,
        request
      );

      // Apply dynamic pricing rules
      const dynamicRates = await this.applyDynamicPricing(
        seasonalRates,
        request
      );

      // Apply promotions and discounts
      const discountedRates = await this.applyPromotions(dynamicRates, request);

      // Calculate taxes and fees
      const taxCalculation = (await this.calculateTaxesAndFees(
        discountedRates,
        request
      )) as { totalTaxAmount: number; taxes: any[] };

      // Build final price calculation
      const priceCalculation = this.buildPriceCalculation(
        discountedRates,
        taxCalculation,
        request
      );

      // Cache the result for a short period
      await this.cachePriceCalculation(request, priceCalculation);

      logger.info('Price calculation completed', {
        propertyId: request.propertyId,
        totalAmount: priceCalculation.totalAmount,
      });

      return priceCalculation;
    } catch (error) {
      logger.error('Error calculating price', { error, request });
      throw error;
    }
  }

  /**
   * Apply seasonal pricing adjustments to base rates
   */
  private async applySeasonalAdjustments(
    baseRates: RateRecord[],
    request: PriceCalculationRequest
  ): Promise<RateRecord[]> {
    const seasonalRates = await this.getActiveSeasonalRates(
      request.propertyId,
      request.checkInDate,
      request.checkOutDate
    );

    if (seasonalRates.length === 0) {
      return baseRates;
    }

    return baseRates.map(rate => {
      let adjustedRate = rate.rate;
      let adjustmentReason = '';

      // Apply seasonal adjustments in priority order
      const applicableSeasons = seasonalRates
        .filter(season =>
          isWithinInterval(rate.date, {
            start: season.startDate,
            end: season.endDate,
          })
        )
        .sort((a, b) => b.priority - a.priority);

      for (const season of applicableSeasons) {
        const roomTypeRate = (season.roomTypeRates as any[]).find(
          rtr => rtr.roomTypeId === request.roomTypeId
        );

        if (roomTypeRate) {
          const originalRate = adjustedRate;

          switch (roomTypeRate.adjustmentType) {
            case AdjustmentMethod.PERCENTAGE:
              adjustedRate =
                adjustedRate * (1 + roomTypeRate.adjustmentValue / 100);
              break;
            case AdjustmentMethod.FIXED_AMOUNT:
              adjustedRate = adjustedRate + roomTypeRate.adjustmentValue;
              break;
            case AdjustmentMethod.MULTIPLIER:
              adjustedRate = adjustedRate * roomTypeRate.adjustmentValue;
              break;
            case AdjustmentMethod.SET_RATE:
              adjustedRate = roomTypeRate.adjustmentValue;
              break;
          }

          // Apply min/max constraints
          if (
            roomTypeRate.minimumRate &&
            adjustedRate < roomTypeRate.minimumRate
          ) {
            adjustedRate = roomTypeRate.minimumRate;
          }
          if (
            roomTypeRate.maximumRate &&
            adjustedRate > roomTypeRate.maximumRate
          ) {
            adjustedRate = roomTypeRate.maximumRate;
          }

          adjustmentReason += `${season.name} (${(((adjustedRate - originalRate) / originalRate) * 100).toFixed(1)}%); `;
        }
      }

      return {
        ...rate,
        rate: Math.round(adjustedRate * 100) / 100,
        adjustmentReason: adjustmentReason.trim(),
      };
    });
  }

  /**
   * Apply dynamic pricing rules based on occupancy, demand, etc.
   */
  private async applyDynamicPricing(
    baseRates: RateRecord[],
    request: PriceCalculationRequest
  ): Promise<RateRecord[]> {
    const dynamicRules = await this.getActiveDynamicPricingRules(
      request.propertyId,
      request.checkInDate,
      request.checkOutDate
    );

    if (dynamicRules.length === 0) {
      return baseRates;
    }

    // Get occupancy data for demand-based pricing
    const occupancyData = await this.getOccupancyData(
      request.propertyId,
      request.checkInDate,
      request.checkOutDate
    );

    return Promise.all(
      baseRates.map(async rate => {
        let adjustedRate = rate.rate;
        let adjustmentReason = (rate as any).adjustmentReason || '';

        // Apply dynamic pricing rules in priority order
        const applicableRules = dynamicRules
          .filter(rule =>
            this.isRuleApplicable(rule, rate, request, occupancyData)
          )
          .sort((a, b) => b.priority - a.priority);

        for (const rule of applicableRules) {
          const originalRate = adjustedRate;

          for (const adjustment of rule.adjustments as any[]) {
            switch (adjustment.method) {
              case AdjustmentMethod.PERCENTAGE:
                adjustedRate = adjustedRate * (1 + adjustment.value / 100);
                break;
              case AdjustmentMethod.FIXED_AMOUNT:
                adjustedRate = adjustedRate + adjustment.value;
                break;
              case AdjustmentMethod.MULTIPLIER:
                adjustedRate = adjustedRate * adjustment.value;
                break;
            }

            // Apply constraints
            if (adjustment.minRate && adjustedRate < adjustment.minRate) {
              adjustedRate = adjustment.minRate;
            }
            if (adjustment.maxRate && adjustedRate > adjustment.maxRate) {
              adjustedRate = adjustment.maxRate;
            }
            if (adjustment.maxAdjustment) {
              const maxChange = originalRate * (adjustment.maxAdjustment / 100);
              if (Math.abs(adjustedRate - originalRate) > maxChange) {
                adjustedRate =
                  originalRate +
                  (adjustedRate > originalRate ? maxChange : -maxChange);
              }
            }
          }

          adjustmentReason += `${rule.name} (${(((adjustedRate - originalRate) / originalRate) * 100).toFixed(1)}%); `;
        }

        return {
          ...rate,
          rate: Math.round(adjustedRate * 100) / 100,
          adjustmentReason: adjustmentReason.trim(),
        };
      })
    );
  }

  /**
   * Apply promotions and discounts
   */
  private async applyPromotions(
    baseRates: RateRecord[],
    request: PriceCalculationRequest
  ): Promise<{ rates: RateRecord[]; appliedPromotions: any[] }> {
    const appliedPromotions: any[] = [];
    let rates = [...baseRates];

    // Apply promotion codes if provided
    if (request.promotionCodes && request.promotionCodes.length > 0) {
      for (const code of request.promotionCodes) {
        const promotion = await this.getPromotionByCode(
          code,
          request.propertyId
        );
        if (promotion && this.isPromotionValid(promotion, request)) {
          const discountResult = this.applyPromotionDiscount(
            rates,
            promotion,
            request
          );
          rates = discountResult.rates;
          appliedPromotions.push(discountResult.appliedPromotion);
        }
      }
    }

    // Apply automatic promotions (public promotions that don't require codes)
    const autoPromotions = await this.getAutoApplicablePromotions(
      request.propertyId,
      request.checkInDate,
      request.checkOutDate
    );

    for (const promotion of autoPromotions) {
      if (this.isPromotionValid(promotion, request)) {
        const discountResult = this.applyPromotionDiscount(
          rates,
          promotion,
          request
        );
        rates = discountResult.rates;
        appliedPromotions.push(discountResult.appliedPromotion);
      }
    }

    return { rates, appliedPromotions };
  }

  /**
   * Get base rates for a date range
   */
  private async getBaseRates(
    propertyId: string,
    roomTypeId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<RateRecord[]> {
    const cacheKey = `base_rates:${propertyId}:${roomTypeId}:${format(checkInDate, 'yyyy-MM-dd')}:${format(checkOutDate, 'yyyy-MM-dd')}`;

    // Try to get from cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const rates = await this.prisma.rateRecord.findMany({
      where: {
        propertyId,
        roomTypeId,
        date: {
          gte: checkInDate,
          lt: checkOutDate,
        },
        rateType: RateType.BASE,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Cache for 5 minutes
    await this.redis.setEx(cacheKey, 300, JSON.stringify(rates));

    return rates.map(rate => ({
      ...rate,
      rateType: rate.rateType as RateType,
      restrictions: rate.restrictions as any,
      minimumStay: rate.minimumStay ?? undefined,
      maximumStay: rate.maximumStay ?? undefined,
      advanceBookingDays: rate.advanceBookingDays ?? undefined,
    }));
  }

  /**
   * Get active seasonal rates for a property and date range
   */
  private async getActiveSeasonalRates(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<SeasonalRate[]> {
    const rates = await this.prisma.seasonalRate.findMany({
      where: {
        propertyId,
        isActive: true,
        OR: [
          {
            startDate: {
              lte: checkOutDate,
            },
            endDate: {
              gte: checkInDate,
            },
          },
        ],
      },
      orderBy: {
        priority: 'desc',
      },
    });

    return rates.map(rate => ({
      ...rate,
      roomTypeRates: rate.roomTypeRates as unknown as SeasonalRoomTypeRate[],
    }));
  }

  /**
   * Get active dynamic pricing rules
   */
  private async getActiveDynamicPricingRules(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<DynamicPricingRule[]> {
    const rules = await this.prisma.dynamicPricingRule.findMany({
      where: {
        propertyId,
        isActive: true,
        validFrom: {
          lte: checkOutDate,
        },
        validTo: {
          gte: checkInDate,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });

    return rules.map(rule => ({
      ...rule,
      type: rule.type as DynamicPricingType,
      conditions: rule.conditions as unknown as PricingCondition[],
      adjustments: rule.adjustments as unknown as PricingAdjustment[],
      applicableRoomTypes: rule.applicableRoomTypes as unknown as string[],
    }));
  }

  /**
   * Get occupancy data for demand-based pricing
   */
  private async getOccupancyData(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<any[]> {
    // This would typically come from analytics or be calculated from bookings
    // For now, return mock data
    const dates = [];
    let currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      dates.push({
        date: new Date(currentDate),
        occupancyRate: Math.random() * 100, // Mock occupancy rate
        demandScore: Math.random() * 10, // Mock demand score
      });
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  }

  /**
   * Check if a dynamic pricing rule is applicable
   */
  private isRuleApplicable(
    rule: DynamicPricingRule,
    rate: RateRecord,
    request: PriceCalculationRequest,
    occupancyData: any[]
  ): boolean {
    // Check if rule applies to this room type
    if (rule.applicableRoomTypes) {
      const roomTypes = rule.applicableRoomTypes as string[];
      if (!roomTypes.includes(request.roomTypeId)) {
        return false;
      }
    }

    // Check conditions
    const conditions = rule.conditions as unknown[];
    const occupancy = occupancyData.find(
      o => format(o.date, 'yyyy-MM-dd') === format(rate.date, 'yyyy-MM-dd')
    );

    return conditions.every(condition => {
      switch (condition.type) {
        case 'occupancy_rate':
          return (
            occupancy &&
            this.evaluateCondition(
              occupancy.occupancyRate,
              condition.operator,
              condition.value
            )
          );
        case 'advance_booking_days':
          const advanceDays = differenceInDays(rate.date, new Date());
          return this.evaluateCondition(
            advanceDays,
            condition.operator,
            condition.value
          );
        case 'length_of_stay':
          const lengthOfStay = differenceInDays(
            request.checkOutDate,
            request.checkInDate
          );
          return this.evaluateCondition(
            lengthOfStay,
            condition.operator,
            condition.value
          );
        case 'day_of_week':
          const dayOfWeek = rate.date.getDay();
          return this.evaluateCondition(
            dayOfWeek,
            condition.operator,
            condition.value
          );
        default:
          return true;
      }
    });
  }

  /**
   * Evaluate a condition based on operator
   */
  private evaluateCondition(
    value: number,
    operator: string,
    targetValue: number
  ): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return value === targetValue;
      case ConditionOperator.GREATER_THAN:
        return value > targetValue;
      case ConditionOperator.GREATER_THAN_OR_EQUAL:
        return value >= targetValue;
      case ConditionOperator.LESS_THAN:
        return value < targetValue;
      case ConditionOperator.LESS_THAN_OR_EQUAL:
        return value <= targetValue;
      default:
        return true;
    }
  }

  /**
   * Get promotion by code
   */
  private async getPromotionByCode(
    code: string,
    propertyId: string
  ): Promise<Promotion | null> {
    const promotion = await this.prisma.promotion.findFirst({
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

    if (!promotion) return null;

    return {
      ...promotion,
      code: promotion.code ?? undefined,
      type: promotion.type as PromotionType,
      discountType: promotion.discountType as DiscountType,
      conditions: promotion.conditions as unknown as PromotionCondition[],
      usage: promotion.usage as unknown as PromotionUsage,
      maxDiscount: promotion.maxDiscount ?? undefined,
    };
  }

  /**
   * Get auto-applicable promotions
   */
  private async getAutoApplicablePromotions(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
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

    return promotions.map(promotion => ({
      ...promotion,
      code: promotion.code ?? undefined,
      type: promotion.type as PromotionType,
      discountType: promotion.discountType as DiscountType,
      conditions: promotion.conditions as unknown as PromotionCondition[],
      usage: promotion.usage as unknown as PromotionUsage,
      maxDiscount: promotion.maxDiscount ?? undefined,
    }));
  }

  /**
   * Check if promotion is valid for the request
   */
  private isPromotionValid(
    promotion: Promotion,
    request: PriceCalculationRequest
  ): boolean {
    const conditions = promotion.conditions as any[];

    return conditions.every(condition => {
      switch (condition.type) {
        case 'minimum_stay':
          const lengthOfStay = differenceInDays(
            request.checkOutDate,
            request.checkInDate
          );
          return lengthOfStay >= condition.value;
        case 'advance_booking':
          const advanceDays = differenceInDays(request.checkInDate, new Date());
          return advanceDays >= condition.value;
        case 'room_types':
          return condition.value.includes(request.roomTypeId);
        default:
          return true;
      }
    });
  }

  /**
   * Apply promotion discount to rates
   */
  private applyPromotionDiscount(
    rates: RateRecord[],
    promotion: Promotion,
    request: PriceCalculationRequest
  ): { rates: RateRecord[]; appliedPromotion: any } {
    const totalAmount = rates.reduce((sum, rate) => sum + rate.rate, 0);
    let discountAmount = 0;

    switch (promotion.discountType) {
      case DiscountType.PERCENTAGE:
        discountAmount = totalAmount * (promotion.discountValue / 100);
        break;
      case DiscountType.FIXED_AMOUNT:
        discountAmount = promotion.discountValue;
        break;
    }

    // Apply max discount limit
    if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
      discountAmount = promotion.maxDiscount;
    }

    // Distribute discount proportionally across rates
    const discountPerRate = discountAmount / rates.length;
    const adjustedRates = rates.map(rate => ({
      ...rate,
      rate: Math.max(0, rate.rate - discountPerRate),
    }));

    return {
      rates: adjustedRates,
      appliedPromotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        description: promotion.description,
        discountAmount,
        discountPercentage:
          promotion.discountType === DiscountType.PERCENTAGE
            ? promotion.discountValue
            : undefined,
        conditions: promotion.conditions,
      },
    };
  }

  /**
   * Calculate taxes and fees
   */
  private async calculateTaxesAndFees(
    ratesData: { rates: RateRecord[]; appliedPromotions: any[] },
    request: PriceCalculationRequest
  ): Promise<any> {
    const taxConfigs = await this.prisma.taxConfiguration.findMany({
      where: {
        propertyId: request.propertyId,
        isActive: true,
        validFrom: {
          lte: new Date(),
        },
        OR: [{ validTo: null }, { validTo: { gte: new Date() } }],
      },
    });

    const subtotal = ratesData.rates.reduce((sum, rate) => sum + rate.rate, 0);
    let totalTaxAmount = 0;
    const taxes: any[] = [];

    for (const taxConfig of taxConfigs) {
      let taxAmount = 0;

      if (taxConfig.isPercentage) {
        taxAmount = subtotal * (taxConfig.rate / 100);
      } else {
        taxAmount = taxConfig.rate * ratesData.rates.length; // Per night
      }

      taxes.push({
        name: taxConfig.name,
        type: taxConfig.type,
        rate: taxConfig.rate,
        amount: taxAmount,
        isInclusive: taxConfig.isInclusive,
      });

      if (!taxConfig.isInclusive) {
        totalTaxAmount += taxAmount;
      }
    }

    return {
      taxes,
      totalTaxAmount,
      subtotal,
    };
  }

  /**
   * Build final price calculation
   */
  private buildPriceCalculation(
    ratesData: { rates: RateRecord[]; appliedPromotions: any[] },
    taxCalculation: unknown,
    request: PriceCalculationRequest
  ): PriceCalculation {
    const baseAmount = ratesData.rates.reduce(
      (sum, rate) => sum + rate.rate,
      0
    );
    const discountAmount = ratesData.appliedPromotions.reduce(
      (sum, promo) => sum + promo.discountAmount,
      0
    );

    return {
      baseAmount,
      discountAmount,
      taxAmount: taxCalculation.totalTaxAmount,
      feeAmount: 0, // Fees would be calculated similarly to taxes
      totalAmount: baseAmount - discountAmount + taxCalculation.totalTaxAmount,
      currency: 'USD', // This should come from property settings
      breakdown: {
        roomCharges: ratesData.rates.map(rate => ({
          date: rate.date,
          roomTypeId: rate.roomTypeId,
          baseRate: rate.rate,
          adjustedRate: rate.rate,
          adjustmentReason: (rate as unknown).adjustmentReason,
          quantity: request.roomQuantity || 1,
          totalAmount: rate.rate * (request.roomQuantity || 1),
        })),
        taxes: taxCalculation.taxes,
        fees: [],
        discounts: ratesData.appliedPromotions.map(promo => ({
          name: promo.name,
          type: DiscountType.PROMOTIONAL,
          amount: promo.discountAmount,
          percentage: promo.discountPercentage,
          code: promo.code,
          description: promo.description,
        })),
        subtotal: baseAmount - discountAmount,
        total: baseAmount - discountAmount + taxCalculation.totalTaxAmount,
      },
      nightlyRates: ratesData.rates.map(rate => ({
        date: rate.date,
        baseRate: rate.rate,
        adjustedRate: rate.rate,
        adjustments: [],
        finalRate: rate.rate,
      })),
      appliedPromotions: ratesData.appliedPromotions,
      validUntil: addDays(new Date(), 1), // Valid for 24 hours
    };
  }

  /**
   * Cache price calculation
   */
  private async cachePriceCalculation(
    request: PriceCalculationRequest,
    calculation: PriceCalculation
  ): Promise<void> {
    const cacheKey = `price_calc:${request.propertyId}:${request.roomTypeId}:${format(request.checkInDate, 'yyyy-MM-dd')}:${format(request.checkOutDate, 'yyyy-MM-dd')}:${request.guestCount}`;
    await this.redis.setEx(cacheKey, 1800, JSON.stringify(calculation)); // Cache for 30 minutes
  }

  /**
   * Validate price calculation request
   */
  private async validatePriceRequest(
    request: PriceCalculationRequest
  ): Promise<void> {
    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }
    if (!request.roomTypeId) {
      throw new ValidationError('Room type ID is required');
    }
    if (!request.checkInDate || !request.checkOutDate) {
      throw new ValidationError('Check-in and check-out dates are required');
    }
    if (request.checkInDate >= request.checkOutDate) {
      throw new ValidationError('Check-out date must be after check-in date');
    }
    if (request.guestCount < 1) {
      throw new ValidationError('Guest count must be at least 1');
    }

    // Verify property and room type exist
    const property = await this.prisma.property.findUnique({
      where: { id: request.propertyId },
    });
    if (!property) {
      throw new NotFoundError('Property', request.propertyId);
    }

    const roomType = await this.prisma.roomType.findUnique({
      where: { id: request.roomTypeId },
    });
    if (!roomType) {
      throw new NotFoundError('Room type', request.roomTypeId);
    }
  }
}
