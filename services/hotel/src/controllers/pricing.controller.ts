// @ts-nocheck
/**
 * Pricing Controller - Handles pricing-related API endpoints
 */

import { PrismaClient } from '@/generated/prisma-client';
import { DynamicPricingService } from '@/services/dynamic-pricing.service';
import { PricingService } from '@/services/pricing.service';
import { PromotionService } from '@/services/promotion.service';
import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { RedisClientType } from 'redis';
// import { SeasonalPricingService } from '@/services/seasonal-pricing.service';
import { ValidationError } from '@/utils/errors';

export class PricingController {
  private pricingService: PricingService;
  // private seasonalPricingService: SeasonalPricingService;
  private dynamicPricingService: DynamicPricingService;
  private promotionService: PromotionService;

  constructor(prisma: PrismaClient, redis: RedisClientType) {
    this.pricingService = new PricingService(prisma, redis);
    // this.seasonalPricingService = new SeasonalPricingService(prisma);
    this.dynamicPricingService = new DynamicPricingService(prisma);
    this.promotionService = new PromotionService(prisma);
  }

  /**
   * Calculate price for a booking request
   */
  async calculatePrice(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        propertyId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        guestCount,
        roomQuantity = 1,
        promotionCodes,
        corporateCode,
        loyaltyMemberId,
        bookingSource,
      } = req.body;

      const priceCalculation = await this.pricingService.calculatePrice({
        propertyId,
        roomTypeId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guestCount,
        roomQuantity,
        promotionCodes,
        corporateCode,
        loyaltyMemberId,
        bookingSource,
      });

      res.json({
        success: true,
        data: priceCalculation,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a seasonal rate
   */
  async createSeasonalRate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      // const seasonalRate = await this.seasonalPricingService.createSeasonalRate(
      //   req.body
      // );
      throw new Error('Seasonal pricing service not implemented');

      res.status(201).json({
        success: true,
        data: seasonalRate,
        message: 'Seasonal rate created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get seasonal rates for a property
   */
  async getSeasonalRates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const { isActive, includeExpired } = req.query;

      const seasonalRates = await this.seasonalPricingService.getSeasonalRates(
        propertyId,
        {
          isActive: isActive ? isActive === 'true' : undefined,
          includeExpired: includeExpired === 'true',
        }
      );

      res.json({
        success: true,
        data: seasonalRates,
        count: seasonalRates.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a seasonal rate
   */
  async updateSeasonalRate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const seasonalRate = await this.seasonalPricingService.updateSeasonalRate(
        id,
        req.body
      );

      res.json({
        success: true,
        data: seasonalRate,
        message: 'Seasonal rate updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a seasonal rate
   */
  async deleteSeasonalRate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      await this.seasonalPricingService.deleteSeasonalRate(id);

      res.json({
        success: true,
        message: 'Seasonal rate deleted successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a dynamic pricing rule
   */
  async createDynamicPricingRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const rule = await this.dynamicPricingService.createDynamicPricingRule(
        req.body
      );

      res.status(201).json({
        success: true,
        data: rule,
        message: 'Dynamic pricing rule created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get dynamic pricing rules for a property
   */
  async getDynamicPricingRules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const { isActive, type, includeExpired } = req.query;

      const rules = await this.dynamicPricingService.getDynamicPricingRules(
        propertyId,
        {
          isActive: isActive ? isActive === 'true' : undefined,
          type: type as any,
          includeExpired: includeExpired === 'true',
        }
      );

      res.json({
        success: true,
        data: rules,
        count: rules.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a dynamic pricing rule
   */
  async updateDynamicPricingRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const rule = await this.dynamicPricingService.updateDynamicPricingRule(
        id,
        req.body
      );

      res.json({
        success: true,
        data: rule,
        message: 'Dynamic pricing rule updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a dynamic pricing rule
   */
  async deleteDynamicPricingRule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      await this.dynamicPricingService.deleteDynamicPricingRule(id);

      res.json({
        success: true,
        message: 'Dynamic pricing rule deleted successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create predefined dynamic pricing rules
   */
  async createPredefinedRules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const rules =
        await this.dynamicPricingService.createPredefinedRules(propertyId);

      res.status(201).json({
        success: true,
        data: rules,
        message: 'Predefined dynamic pricing rules created successfully',
        count: rules.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a promotion
   */
  async createPromotion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const promotion = await this.promotionService.createPromotion(req.body);

      res.status(201).json({
        success: true,
        data: promotion,
        message: 'Promotion created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get promotions for a property
   */
  async getPromotions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const { isActive, type, includeExpired } = req.query;

      const promotions = await this.promotionService.getPromotions(propertyId, {
        isActive: isActive ? isActive === 'true' : undefined,
        type: type as any,
        includeExpired: includeExpired === 'true',
      });

      res.json({
        success: true,
        data: promotions,
        count: promotions.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a promotion
   */
  async updatePromotion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const promotion = await this.promotionService.updatePromotion(
        id,
        req.body
      );

      res.json({
        success: true,
        data: promotion,
        message: 'Promotion updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a promotion
   */
  async deletePromotion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      await this.promotionService.deletePromotion(id);

      res.json({
        success: true,
        message: 'Promotion deleted successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate a promotion code
   */
  async validatePromotion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        promotionCode,
        propertyId,
        guestId,
        bookingAmount,
        roomTypeId,
        checkInDate,
        checkOutDate,
        bookingSource,
      } = req.body;

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const lengthOfStay = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const advanceBookingDays = Math.ceil(
        (checkIn.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const validation = await this.promotionService.validateAndApplyPromotion({
        promotionCode,
        propertyId,
        guestId,
        bookingAmount,
        roomTypeId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        lengthOfStay,
        advanceBookingDays,
        bookingSource,
      });

      res.json({
        success: true,
        data: validation,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get promotion usage statistics
   */
  async getPromotionStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const stats = await this.promotionService.getPromotionUsageStats(id);

      res.json({
        success: true,
        data: stats,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create predefined promotions
   */
  async createPredefinedPromotions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const promotions =
        await this.promotionService.createPredefinedPromotions(propertyId);

      res.status(201).json({
        success: true,
        data: promotions,
        message: 'Predefined promotions created successfully',
        count: promotions.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const pricingValidation = {
  calculatePrice: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('guestCount')
      .isInt({ min: 1 })
      .withMessage('Guest count must be at least 1'),
    body('roomQuantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Room quantity must be at least 1'),
    body('promotionCodes')
      .optional()
      .isArray()
      .withMessage('Promotion codes must be an array'),
  ],

  createSeasonalRate: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('roomTypeRates')
      .isArray({ min: 1 })
      .withMessage('At least one room type rate is required'),
    body('priority')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Priority must be a non-negative integer'),
  ],

  createDynamicPricingRule: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('type').isString().notEmpty().withMessage('Type is required'),
    body('conditions')
      .isArray({ min: 1 })
      .withMessage('At least one condition is required'),
    body('adjustments')
      .isArray({ min: 1 })
      .withMessage('At least one adjustment is required'),
    body('validFrom').isISO8601().withMessage('Valid from date is required'),
    body('validTo').isISO8601().withMessage('Valid to date is required'),
  ],

  createPromotion: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('type').isString().notEmpty().withMessage('Type is required'),
    body('discountType')
      .isString()
      .notEmpty()
      .withMessage('Discount type is required'),
    body('discountValue')
      .isFloat({ min: 0 })
      .withMessage('Discount value must be positive'),
    body('validFrom').isISO8601().withMessage('Valid from date is required'),
    body('validTo').isISO8601().withMessage('Valid to date is required'),
    body('conditions')
      .isArray({ min: 1 })
      .withMessage('At least one condition is required'),
  ],

  validatePromotion: [
    body('promotionCode')
      .isString()
      .notEmpty()
      .withMessage('Promotion code is required'),
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('guestId').isString().notEmpty().withMessage('Guest ID is required'),
    body('bookingAmount')
      .isFloat({ min: 0 })
      .withMessage('Booking amount must be positive'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
  ],

  propertyId: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
  ],

  id: [param('id').isString().notEmpty().withMessage('ID is required')],
};
