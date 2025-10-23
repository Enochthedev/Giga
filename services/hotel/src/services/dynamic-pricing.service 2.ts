// @ts-nocheck
/**
 * Dynamic Pricing Service - Manages demand-based and occupancy-based pricing rules
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  AdjustmentMethod,
  AdjustmentType,
  ConditionOperator,
  ConditionType,
  DynamicPricingRule,
  DynamicPricingType,
  NotFoundError,
  PricingAdjustment,
  PricingCondition,
  ValidationError,
} from '@/types';
import logger from '@/utils/logger';
import { differenceInDays, isWithinInterval } from 'date-fns';

export interface CreateDynamicPricingRuleRequest {
  propertyId: string;
  name: string;
  description: string;
  type: DynamicPricingType;
  priority?: number;
  conditions: PricingCondition[];
  adjustments: PricingAdjustment[];
  validFrom: Date;
  validTo: Date;
  applicableRoomTypes?: string[];
}

export interface UpdateDynamicPricingRuleRequest {
  name?: string;
  description?: string;
  type?: DynamicPricingType;
  priority?: number;
  conditions?: PricingCondition[];
  adjustments?: PricingAdjustment[];
  validFrom?: Date;
  validTo?: Date;
  applicableRoomTypes?: string[];
  isActive?: boolean;
}

export interface OccupancyData {
  date: Date;
  occupancyRate: number;
  demandScore: number;
  bookingPace: number;
  competitorRate?: number;
}

export class DynamicPricingService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new dynamic pricing rule
   */
  async createDynamicPricingRule(
    request: CreateDynamicPricingRuleRequest
  ): Promise<DynamicPricingRule> {
    try {
      logger.info('Creating dynamic pricing rule', { request });

      // Validate request
      await this.validateDynamicPricingRuleRequest(request);

      const rule = await this.prisma.dynamicPricingRule.create({
        data: {
          propertyId: request.propertyId,
          name: request.name,
          description: request.description,
          type: request.type,
          priority: request.priority || 0,
          conditions: request.conditions as any,
          adjustments: request.adjustments as any,
          validFrom: request.validFrom,
          validTo: request.validTo,
          applicableRoomTypes: request.applicableRoomTypes,
          isActive: true,
        },
      });

      logger.info('Dynamic pricing rule created successfully', {
        ruleId: rule.id,
        propertyId: request.propertyId,
      });

      return {
        ...rule,
        type: rule.type as DynamicPricingType,
        conditions: rule.conditions as unknown as PricingCondition[],
        adjustments: rule.adjustments as unknown as PricingAdjustment[],
        applicableRoomTypes: rule.applicableRoomTypes as string[],
      };
    } catch (error) {
      logger.error('Error creating dynamic pricing rule', { error, request });
      throw error;
    }
  }

  /**
   * Update an existing dynamic pricing rule
   */
  async updateDynamicPricingRule(
    id: string,
    request: UpdateDynamicPricingRuleRequest
  ): Promise<DynamicPricingRule> {
    try {
      logger.info('Updating dynamic pricing rule', { id, request });

      // Check if rule exists
      const existingRule = await this.prisma.dynamicPricingRule.findUnique({
        where: { id },
      });

      if (!existingRule) {
        throw new NotFoundError('Dynamic pricing rule', id);
      }

      // Validate update request
      if (
        request.conditions ||
        request.adjustments ||
        request.applicableRoomTypes
      ) {
        const updateRequest = {
          propertyId: existingRule.propertyId,
          name: request.name || existingRule.name,
          description: request.description || existingRule.description,
          type: request.type || (existingRule.type as DynamicPricingType),
          priority:
            request.priority !== undefined
              ? request.priority
              : existingRule.priority,
          conditions:
            request.conditions ||
            (existingRule.conditions as unknown as PricingCondition[]),
          adjustments:
            request.adjustments ||
            (existingRule.adjustments as unknown as PricingAdjustment[]),
          validFrom: request.validFrom || existingRule.validFrom,
          validTo: request.validTo || existingRule.validTo,
          applicableRoomTypes:
            request.applicableRoomTypes ||
            (existingRule.applicableRoomTypes as string[]),
        };

        await this.validateDynamicPricingRuleRequest(updateRequest);
      }

      const updatedRule = await this.prisma.dynamicPricingRule.update({
        where: { id },
        data: {
          ...(request.name && { name: request.name }),
          ...(request.description && { description: request.description }),
          ...(request.type && { type: request.type }),
          ...(request.priority !== undefined && { priority: request.priority }),
          ...(request.conditions && { conditions: request.conditions as any }),
          ...(request.adjustments && {
            adjustments: request.adjustments as any,
          }),
          ...(request.validFrom && { validFrom: request.validFrom }),
          ...(request.validTo && { validTo: request.validTo }),
          ...(request.applicableRoomTypes && {
            applicableRoomTypes: request.applicableRoomTypes,
          }),
          ...(request.isActive !== undefined && { isActive: request.isActive }),
        },
      });

      logger.info('Dynamic pricing rule updated successfully', { id });

      return {
        ...updatedRule,
        type: updatedRule.type as DynamicPricingType,
        conditions: updatedRule.conditions as PricingCondition[],
        adjustments: updatedRule.adjustments as PricingAdjustment[],
        applicableRoomTypes: updatedRule.applicableRoomTypes as string[],
      };
    } catch (error) {
      logger.error('Error updating dynamic pricing rule', {
        error,
        id,
        request,
      });
      throw error;
    }
  }

  /**
   * Get dynamic pricing rule by ID
   */
  async getDynamicPricingRule(id: string): Promise<DynamicPricingRule> {
    const rule = await this.prisma.dynamicPricingRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundError('Dynamic pricing rule', id);
    }

    return rule;
  }

  /**
   * Get all dynamic pricing rules for a property
   */
  async getDynamicPricingRules(
    propertyId: string,
    options?: {
      isActive?: boolean;
      type?: DynamicPricingType;
      includeExpired?: boolean;
    }
  ): Promise<DynamicPricingRule[]> {
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

    const rules = await this.prisma.dynamicPricingRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    return rules.map(rule => ({
      ...rule,
      type: rule.type as DynamicPricingType,
      conditions: rule.conditions as PricingCondition[],
      adjustments: rule.adjustments as PricingAdjustment[],
      applicableRoomTypes: rule.applicableRoomTypes as string[],
    }));
  }

  /**
   * Get active dynamic pricing rules for a specific date range
   */
  async getActiveDynamicPricingRulesForDateRange(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    roomTypeId?: string
  ): Promise<DynamicPricingRule[]> {
    const where: any = {
      propertyId,
      isActive: true,
      validFrom: {
        lte: endDate,
      },
      validTo: {
        gte: startDate,
      },
    };

    if (roomTypeId) {
      where.OR = [
        { applicableRoomTypes: null },
        { applicableRoomTypes: { array_contains: roomTypeId } },
      ];
    }

    const rules = await this.prisma.dynamicPricingRule.findMany({
      where,
      orderBy: {
        priority: 'desc',
      },
    });

    return rules.map(rule => ({
      ...rule,
      type: rule.type as DynamicPricingType,
      conditions: rule.conditions as PricingCondition[],
      adjustments: rule.adjustments as PricingAdjustment[],
      applicableRoomTypes: rule.applicableRoomTypes as string[],
    }));
  }

  /**
   * Delete a dynamic pricing rule
   */
  async deleteDynamicPricingRule(id: string): Promise<void> {
    try {
      logger.info('Deleting dynamic pricing rule', { id });

      const existingRule = await this.prisma.dynamicPricingRule.findUnique({
        where: { id },
      });

      if (!existingRule) {
        throw new NotFoundError('Dynamic pricing rule', id);
      }

      await this.prisma.dynamicPricingRule.delete({
        where: { id },
      });

      logger.info('Dynamic pricing rule deleted successfully', { id });
    } catch (error) {
      logger.error('Error deleting dynamic pricing rule', { error, id });
      throw error;
    }
  }

  /**
   * Activate or deactivate a dynamic pricing rule
   */
  async toggleDynamicPricingRule(
    id: string,
    isActive: boolean
  ): Promise<DynamicPricingRule> {
    try {
      logger.info('Toggling dynamic pricing rule status', { id, isActive });

      const existingRule = await this.prisma.dynamicPricingRule.findUnique({
        where: { id },
      });

      if (!existingRule) {
        throw new NotFoundError('Dynamic pricing rule', id);
      }

      const updatedRule = await this.prisma.dynamicPricingRule.update({
        where: { id },
        data: { isActive },
      });

      logger.info('Dynamic pricing rule status updated', { id, isActive });

      return {
        ...updatedRule,
        type: updatedRule.type as DynamicPricingType,
        conditions: updatedRule.conditions as PricingCondition[],
        adjustments: updatedRule.adjustments as PricingAdjustment[],
        applicableRoomTypes: updatedRule.applicableRoomTypes as string[],
      };
    } catch (error) {
      logger.error('Error toggling dynamic pricing rule status', {
        error,
        id,
        isActive,
      });
      throw error;
    }
  }

  /**
   * Evaluate if a dynamic pricing rule applies to given conditions
   */
  evaluateRule(
    rule: DynamicPricingRule,
    occupancyData: OccupancyData,
    bookingDate: Date,
    lengthOfStay: number,
    roomTypeId?: string
  ): boolean {
    // Check if rule applies to this room type
    if (rule.applicableRoomTypes && roomTypeId) {
      const roomTypes = rule.applicableRoomTypes as string[];
      if (!roomTypes.includes(roomTypeId)) {
        return false;
      }
    }

    // Check if rule is valid for the booking date
    if (
      !isWithinInterval(bookingDate, {
        start: rule.validFrom,
        end: rule.validTo,
      })
    ) {
      return false;
    }

    // Evaluate all conditions
    const conditions = rule.conditions as PricingCondition[];
    return conditions.every(condition =>
      this.evaluateCondition(
        condition,
        occupancyData,
        bookingDate,
        lengthOfStay
      )
    );
  }

  /**
   * Calculate price adjustment based on rule
   */
  calculateAdjustment(
    rule: DynamicPricingRule,
    baseRate: number,
    occupancyData: OccupancyData
  ): {
    adjustedRate: number;
    adjustmentAmount: number;
    adjustmentPercentage: number;
    reason: string;
  } {
    let adjustedRate = baseRate;
    const adjustments = rule.adjustments as PricingAdjustment[];
    let totalAdjustmentPercentage = 0;

    for (const adjustment of adjustments) {
      const originalRate = adjustedRate;

      switch (adjustment.method) {
        case AdjustmentMethod.PERCENTAGE:
          adjustedRate = adjustedRate * (1 + adjustment.value / 100);
          totalAdjustmentPercentage += adjustment.value;
          break;
        case AdjustmentMethod.FIXED_AMOUNT:
          adjustedRate = adjustedRate + adjustment.value;
          totalAdjustmentPercentage += (adjustment.value / originalRate) * 100;
          break;
        case AdjustmentMethod.MULTIPLIER:
          adjustedRate = adjustedRate * adjustment.value;
          totalAdjustmentPercentage += (adjustment.value - 1) * 100;
          break;
        case AdjustmentMethod.SET_RATE:
          adjustedRate = adjustment.value;
          totalAdjustmentPercentage =
            ((adjustment.value - baseRate) / baseRate) * 100;
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
        const maxChange = baseRate * (adjustment.maxAdjustment / 100);
        if (Math.abs(adjustedRate - baseRate) > maxChange) {
          adjustedRate =
            baseRate + (adjustedRate > baseRate ? maxChange : -maxChange);
        }
      }
    }

    return {
      adjustedRate: Math.round(adjustedRate * 100) / 100,
      adjustmentAmount: adjustedRate - baseRate,
      adjustmentPercentage: totalAdjustmentPercentage,
      reason: this.generateAdjustmentReason(rule, occupancyData),
    };
  }

  /**
   * Create predefined dynamic pricing rules for common scenarios
   */
  async createPredefinedRules(
    propertyId: string
  ): Promise<DynamicPricingRule[]> {
    const rules: CreateDynamicPricingRuleRequest[] = [
      // High occupancy rule
      {
        propertyId,
        name: 'High Occupancy Premium',
        description: 'Increase rates when occupancy is above 80%',
        type: DynamicPricingType.OCCUPANCY_BASED,
        priority: 100,
        conditions: [
          {
            type: ConditionType.OCCUPANCY_RATE,
            operator: ConditionOperator.GREATER_THAN,
            value: 80,
          },
        ],
        adjustments: [
          {
            type: AdjustmentType.OCCUPANCY_BASED,
            method: AdjustmentMethod.PERCENTAGE,
            value: 15,
            maxAdjustment: 25,
          },
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      // Last minute booking premium
      {
        propertyId,
        name: 'Last Minute Booking Premium',
        description: 'Increase rates for bookings made within 3 days',
        type: DynamicPricingType.ADVANCE_BOOKING,
        priority: 90,
        conditions: [
          {
            type: ConditionType.ADVANCE_BOOKING_DAYS,
            operator: ConditionOperator.LESS_THAN_OR_EQUAL,
            value: 3,
          },
        ],
        adjustments: [
          {
            type: AdjustmentType.ADVANCE_BOOKING,
            method: AdjustmentMethod.PERCENTAGE,
            value: 10,
            maxAdjustment: 20,
          },
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      // Extended stay discount
      {
        propertyId,
        name: 'Extended Stay Discount',
        description: 'Discount for stays longer than 7 nights',
        type: DynamicPricingType.LENGTH_OF_STAY,
        priority: 80,
        conditions: [
          {
            type: ConditionType.LENGTH_OF_STAY,
            operator: ConditionOperator.GREATER_THAN,
            value: 7,
          },
        ],
        adjustments: [
          {
            type: AdjustmentType.LENGTH_OF_STAY,
            method: AdjustmentMethod.PERCENTAGE,
            value: -10,
            maxAdjustment: 15,
          },
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      // Weekend premium
      {
        propertyId,
        name: 'Weekend Premium',
        description: 'Premium rates for Friday and Saturday nights',
        type: DynamicPricingType.DAY_OF_WEEK,
        priority: 70,
        conditions: [
          {
            type: ConditionType.DAY_OF_WEEK,
            operator: ConditionOperator.IN,
            value: '5,6', // Friday and Saturday
          },
        ],
        adjustments: [
          {
            type: AdjustmentType.DAY_OF_WEEK,
            method: AdjustmentMethod.PERCENTAGE,
            value: 20,
            maxAdjustment: 30,
          },
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    ];

    const createdRules: DynamicPricingRule[] = [];
    for (const ruleRequest of rules) {
      try {
        const rule = await this.createDynamicPricingRule(ruleRequest);
        createdRules.push(rule);
      } catch (error) {
        logger.warn('Failed to create predefined rule', {
          error,
          rule: ruleRequest.name,
        });
      }
    }

    return createdRules;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    condition: PricingCondition,
    occupancyData: OccupancyData,
    bookingDate: Date,
    lengthOfStay: number
  ): boolean {
    let value: number | number[];

    switch (condition.type) {
      case ConditionType.OCCUPANCY_RATE:
        value = occupancyData.occupancyRate;
        break;
      case ConditionType.ADVANCE_BOOKING_DAYS:
        value = differenceInDays(bookingDate, new Date());
        break;
      case ConditionType.LENGTH_OF_STAY:
        value = lengthOfStay;
        break;
      case ConditionType.DAY_OF_WEEK:
        value = bookingDate.getDay();
        break;
      case ConditionType.DEMAND_SCORE:
        value = occupancyData.demandScore;
        break;
      case ConditionType.BOOKING_PACE:
        value = occupancyData.bookingPace;
        break;
      case ConditionType.COMPETITOR_RATE:
        value = occupancyData.competitorRate || 0;
        break;
      default:
        return true;
    }

    return this.evaluateOperator(value, condition.operator, condition.value);
  }

  /**
   * Evaluate operator condition
   */
  private evaluateOperator(
    value: number | number[],
    operator: ConditionOperator,
    targetValue: any
  ): boolean {
    if (Array.isArray(value)) {
      // Handle array values (e.g., day of week)
      switch (operator) {
        case ConditionOperator.IN:
          return (
            Array.isArray(targetValue) &&
            targetValue.some(tv => value.includes(tv))
          );
        case ConditionOperator.NOT_IN:
          return (
            Array.isArray(targetValue) &&
            !targetValue.some(tv => value.includes(tv))
          );
        default:
          return false;
      }
    }

    const numValue = value as number;
    const numTarget =
      typeof targetValue === 'number' ? targetValue : parseFloat(targetValue);

    switch (operator) {
      case ConditionOperator.EQUALS:
        return numValue === numTarget;
      case ConditionOperator.NOT_EQUALS:
        return numValue !== numTarget;
      case ConditionOperator.GREATER_THAN:
        return numValue > numTarget;
      case ConditionOperator.GREATER_THAN_OR_EQUAL:
        return numValue >= numTarget;
      case ConditionOperator.LESS_THAN:
        return numValue < numTarget;
      case ConditionOperator.LESS_THAN_OR_EQUAL:
        return numValue <= numTarget;
      case ConditionOperator.IN:
        return Array.isArray(targetValue) && targetValue.includes(numValue);
      case ConditionOperator.NOT_IN:
        return Array.isArray(targetValue) && !targetValue.includes(numValue);
      case ConditionOperator.BETWEEN:
        return (
          Array.isArray(targetValue) &&
          targetValue.length === 2 &&
          numValue >= targetValue[0] &&
          numValue <= targetValue[1]
        );
      default:
        return true;
    }
  }

  /**
   * Generate adjustment reason text
   */
  private generateAdjustmentReason(
    rule: DynamicPricingRule,
    occupancyData: OccupancyData
  ): string {
    switch (rule.type) {
      case DynamicPricingType.OCCUPANCY_BASED:
        return `High occupancy (${occupancyData.occupancyRate.toFixed(1)}%)`;
      case DynamicPricingType.DEMAND_BASED:
        return `High demand (score: ${occupancyData.demandScore.toFixed(1)})`;
      case DynamicPricingType.ADVANCE_BOOKING:
        return 'Last minute booking premium';
      case DynamicPricingType.LENGTH_OF_STAY:
        return 'Extended stay adjustment';
      case DynamicPricingType.DAY_OF_WEEK:
        return 'Weekend/weekday adjustment';
      default:
        return rule.name;
    }
  }

  /**
   * Validate dynamic pricing rule request
   */
  private async validateDynamicPricingRuleRequest(
    request: CreateDynamicPricingRuleRequest
  ): Promise<void> {
    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }

    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Rule name is required');
    }

    if (!Object.values(DynamicPricingType).includes(request.type)) {
      throw new ValidationError(
        `Invalid dynamic pricing type: ${request.type}`
      );
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

    if (!request.adjustments || request.adjustments.length === 0) {
      throw new ValidationError('At least one adjustment is required');
    }

    // Validate conditions
    for (const condition of request.conditions) {
      if (!Object.values(ConditionType).includes(condition.type)) {
        throw new ValidationError(`Invalid condition type: ${condition.type}`);
      }

      if (!Object.values(ConditionOperator).includes(condition.operator)) {
        throw new ValidationError(
          `Invalid condition operator: ${condition.operator}`
        );
      }

      if (condition.value === undefined || condition.value === null) {
        throw new ValidationError('Condition value is required');
      }
    }

    // Validate adjustments
    for (const adjustment of request.adjustments) {
      if (!Object.values(AdjustmentMethod).includes(adjustment.method)) {
        throw new ValidationError(
          `Invalid adjustment method: ${adjustment.method}`
        );
      }

      if (adjustment.value === undefined || adjustment.value === null) {
        throw new ValidationError('Adjustment value is required');
      }

      if (adjustment.minRate !== undefined && adjustment.minRate < 0) {
        throw new ValidationError('Minimum rate cannot be negative');
      }

      if (adjustment.maxRate !== undefined && adjustment.maxRate < 0) {
        throw new ValidationError('Maximum rate cannot be negative');
      }

      if (
        adjustment.minRate !== undefined &&
        adjustment.maxRate !== undefined &&
        adjustment.minRate >= adjustment.maxRate
      ) {
        throw new ValidationError(
          'Maximum rate must be greater than minimum rate'
        );
      }
    }

    // Verify property exists
    const property = await this.prisma.property.findUnique({
      where: { id: request.propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', request.propertyId);
    }

    // Verify room types exist if specified
    if (request.applicableRoomTypes && request.applicableRoomTypes.length > 0) {
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          id: { in: request.applicableRoomTypes },
          propertyId: request.propertyId,
        },
      });

      if (roomTypes.length !== request.applicableRoomTypes.length) {
        const foundIds = roomTypes.map(rt => rt.id);
        const missingIds = request.applicableRoomTypes.filter(
          id => !foundIds.includes(id)
        );
        throw new ValidationError(
          `Room types not found: ${missingIds.join(', ')}`
        );
      }
    }
  }
}
