/**
 * Unit tests for DynamicPricingService
 */

import { PrismaClient } from '@/generated/prisma-client';
import { DynamicPricingService } from '@/services/dynamic-pricing.service';
import {
  AdjustmentMethod,
  ConditionOperator,
  ConditionType,
  DynamicPricingType,
} from '@/types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma client
const mockPrisma = {
  dynamicPricingRule: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  property: {
    findUnique: vi.fn(),
  },
  roomType: {
    findMany: vi.fn(),
  },
} as unknown as PrismaClient;

describe('DynamicPricingService', () => {
  let dynamicPricingService: DynamicPricingService;

  beforeEach(() => {
    dynamicPricingService = new DynamicPricingService(mockPrisma);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createDynamicPricingRule', () => {
    const mockCreateRequest = {
      propertyId: 'property-1',
      name: 'High Occupancy Premium',
      description: 'Increase rates when occupancy is high',
      type: DynamicPricingType.OCCUPANCY_BASED,
      priority: 1,
      conditions: [
        {
          type: ConditionType.OCCUPANCY_RATE,
          operator: ConditionOperator.GREATER_THAN,
          value: 80,
          description: 'Occupancy rate above 80%',
        },
      ],
      adjustments: [
        {
          type: 'occupancy_based' as any,
          method: AdjustmentMethod.PERCENTAGE,
          value: 15,
          maxAdjustment: 25,
        },
      ],
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      applicableRoomTypes: ['room-type-1'],
    };

    beforeEach(() => {
      // Mock property exists
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });

      // Mock room types exist
      (mockPrisma.roomType.findMany as any).mockResolvedValue([
        {
          id: 'room-type-1',
          name: 'Standard Room',
          propertyId: 'property-1',
        },
      ]);
    });

    it('should create a dynamic pricing rule successfully', async () => {
      const mockCreatedRule = {
        id: 'rule-1',
        ...mockCreateRequest,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.dynamicPricingRule.create as any).mockResolvedValue(
        mockCreatedRule
      );

      const result =
        await dynamicPricingService.createDynamicPricingRule(mockCreateRequest);

      expect(result).toEqual(mockCreatedRule);
      expect(mockPrisma.dynamicPricingRule.create).toHaveBeenCalledWith({
        data: {
          propertyId: mockCreateRequest.propertyId,
          name: mockCreateRequest.name,
          description: mockCreateRequest.description,
          type: mockCreateRequest.type,
          priority: mockCreateRequest.priority,
          conditions: mockCreateRequest.conditions,
          adjustments: mockCreateRequest.adjustments,
          validFrom: mockCreateRequest.validFrom,
          validTo: mockCreateRequest.validTo,
          applicableRoomTypes: mockCreateRequest.applicableRoomTypes,
          isActive: true,
        },
      });
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        propertyId: '',
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should validate dynamic pricing type', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        type: 'invalid_type' as any,
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('Invalid dynamic pricing type');
    });

    it('should validate date range', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        validFrom: new Date('2024-12-31'),
        validTo: new Date('2024-01-01'), // End before start
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('Valid to date must be after valid from date');
    });

    it('should validate conditions', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        conditions: [],
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('At least one condition is required');
    });

    it('should validate adjustments', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        adjustments: [],
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('At least one adjustment is required');
    });

    it('should validate condition types', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        conditions: [
          {
            type: 'invalid_condition' as any,
            operator: ConditionOperator.GREATER_THAN,
            value: 80,
          },
        ],
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('Invalid condition type');
    });

    it('should validate adjustment methods', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: 'invalid_method' as any,
            value: 15,
          },
        ],
      };

      await expect(
        dynamicPricingService.createDynamicPricingRule(invalidRequest)
      ).rejects.toThrow('Invalid adjustment method');
    });

    it('should check for property existence', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue(null);

      await expect(
        dynamicPricingService.createDynamicPricingRule(mockCreateRequest)
      ).rejects.toThrow(NotFoundError);
    });

    it('should check for room type existence', async () => {
      (mockPrisma.roomType.findMany as any).mockResolvedValue([]); // No room types found

      await expect(
        dynamicPricingService.createDynamicPricingRule(mockCreateRequest)
      ).rejects.toThrow('Room types not found');
    });
  });

  describe('evaluateRule', () => {
    const mockRule = {
      id: 'rule-1',
      propertyId: 'property-1',
      name: 'High Occupancy Premium',
      description: 'Test rule',
      type: DynamicPricingType.OCCUPANCY_BASED,
      isActive: true,
      priority: 1,
      conditions: [
        {
          type: ConditionType.OCCUPANCY_RATE,
          operator: ConditionOperator.GREATER_THAN,
          value: 80,
        },
      ],
      adjustments: [],
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      applicableRoomTypes: ['room-type-1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOccupancyData = {
      date: new Date('2024-07-15'),
      occupancyRate: 85,
      demandScore: 8.5,
      bookingPace: 1.2,
    };

    it('should evaluate rule as applicable when conditions are met', () => {
      const result = dynamicPricingService.evaluateRule(
        mockRule,
        mockOccupancyData,
        new Date('2024-07-15'),
        3,
        'room-type-1'
      );

      expect(result).toBe(true);
    });

    it('should evaluate rule as not applicable when conditions are not met', () => {
      const lowOccupancyData = {
        ...mockOccupancyData,
        occupancyRate: 70, // Below threshold
      };

      const result = dynamicPricingService.evaluateRule(
        mockRule,
        lowOccupancyData,
        new Date('2024-07-15'),
        3,
        'room-type-1'
      );

      expect(result).toBe(false);
    });

    it('should evaluate rule as not applicable for wrong room type', () => {
      const result = dynamicPricingService.evaluateRule(
        mockRule,
        mockOccupancyData,
        new Date('2024-07-15'),
        3,
        'room-type-2' // Different room type
      );

      expect(result).toBe(false);
    });

    it('should evaluate rule as not applicable when date is outside valid range', () => {
      const result = dynamicPricingService.evaluateRule(
        mockRule,
        mockOccupancyData,
        new Date('2025-01-15'), // Outside valid range
        3,
        'room-type-1'
      );

      expect(result).toBe(false);
    });

    it('should handle advance booking days condition', () => {
      const advanceBookingRule = {
        ...mockRule,
        conditions: [
          {
            type: ConditionType.ADVANCE_BOOKING_DAYS,
            operator: ConditionOperator.LESS_THAN_OR_EQUAL,
            value: 3,
          },
        ],
      };

      // Mock current date to be 2 days before booking date
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 2);

      const result = dynamicPricingService.evaluateRule(
        advanceBookingRule,
        mockOccupancyData,
        bookingDate,
        3,
        'room-type-1'
      );

      expect(result).toBe(true);
    });

    it('should handle length of stay condition', () => {
      const lengthOfStayRule = {
        ...mockRule,
        conditions: [
          {
            type: ConditionType.LENGTH_OF_STAY,
            operator: ConditionOperator.GREATER_THAN,
            value: 5,
          },
        ],
      };

      const result = dynamicPricingService.evaluateRule(
        lengthOfStayRule,
        mockOccupancyData,
        new Date('2024-07-15'),
        7, // 7 nights > 5
        'room-type-1'
      );

      expect(result).toBe(true);
    });

    it('should handle day of week condition', () => {
      const dayOfWeekRule = {
        ...mockRule,
        conditions: [
          {
            type: ConditionType.DAY_OF_WEEK,
            operator: ConditionOperator.IN,
            value: [5, 6], // Friday and Saturday
          },
        ],
      };

      // Create a Friday date
      const friday = new Date('2024-07-19'); // This is a Friday

      const result = dynamicPricingService.evaluateRule(
        dayOfWeekRule,
        mockOccupancyData,
        friday,
        3,
        'room-type-1'
      );

      expect(result).toBe(true);
    });
  });

  describe('calculateAdjustment', () => {
    const mockRule = {
      id: 'rule-1',
      propertyId: 'property-1',
      name: 'High Occupancy Premium',
      description: 'Test rule',
      type: DynamicPricingType.OCCUPANCY_BASED,
      isActive: true,
      priority: 1,
      conditions: [],
      adjustments: [
        {
          type: 'occupancy_based' as any,
          method: AdjustmentMethod.PERCENTAGE,
          value: 15,
          maxAdjustment: 25,
        },
      ],
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      applicableRoomTypes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOccupancyData = {
      date: new Date('2024-07-15'),
      occupancyRate: 85,
      demandScore: 8.5,
      bookingPace: 1.2,
    };

    it('should calculate percentage adjustment correctly', () => {
      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        mockRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(115); // 100 * 1.15
      expect(result.adjustmentAmount).toBe(15);
      expect(result.adjustmentPercentage).toBe(15);
      expect(result.reason).toContain('High occupancy');
    });

    it('should calculate fixed amount adjustment correctly', () => {
      const fixedAmountRule = {
        ...mockRule,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: AdjustmentMethod.FIXED_AMOUNT,
            value: 20,
          },
        ],
      };

      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        fixedAmountRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(120); // 100 + 20
      expect(result.adjustmentAmount).toBe(20);
    });

    it('should calculate multiplier adjustment correctly', () => {
      const multiplierRule = {
        ...mockRule,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: AdjustmentMethod.MULTIPLIER,
            value: 1.25,
          },
        ],
      };

      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        multiplierRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(125); // 100 * 1.25
      expect(result.adjustmentAmount).toBe(25);
    });

    it('should apply minimum rate constraint', () => {
      const constrainedRule = {
        ...mockRule,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: AdjustmentMethod.PERCENTAGE,
            value: -50, // 50% decrease
            minRate: 80,
          },
        ],
      };

      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        constrainedRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(80); // Constrained to minimum
    });

    it('should apply maximum rate constraint', () => {
      const constrainedRule = {
        ...mockRule,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: AdjustmentMethod.PERCENTAGE,
            value: 100, // 100% increase
            maxRate: 150,
          },
        ],
      };

      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        constrainedRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(150); // Constrained to maximum
    });

    it('should apply maximum adjustment constraint', () => {
      const constrainedRule = {
        ...mockRule,
        adjustments: [
          {
            type: 'occupancy_based' as any,
            method: AdjustmentMethod.PERCENTAGE,
            value: 50, // 50% increase
            maxAdjustment: 20, // But max 20% adjustment
          },
        ],
      };

      const baseRate = 100;

      const result = dynamicPricingService.calculateAdjustment(
        constrainedRule,
        baseRate,
        mockOccupancyData
      );

      expect(result.adjustedRate).toBe(120); // 100 + 20 (max adjustment)
    });
  });

  describe('createPredefinedRules', () => {
    beforeEach(() => {
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });
      (mockPrisma.roomType.findMany as any).mockResolvedValue([]);
    });

    it('should create predefined dynamic pricing rules', async () => {
      const mockCreatedRules = [
        { id: 'rule-1', name: 'High Occupancy Premium' },
        { id: 'rule-2', name: 'Last Minute Booking Premium' },
        { id: 'rule-3', name: 'Extended Stay Discount' },
        { id: 'rule-4', name: 'Weekend Premium' },
      ];

      (mockPrisma.dynamicPricingRule.create as any)
        .mockResolvedValueOnce(mockCreatedRules[0])
        .mockResolvedValueOnce(mockCreatedRules[1])
        .mockResolvedValueOnce(mockCreatedRules[2])
        .mockResolvedValueOnce(mockCreatedRules[3]);

      const result =
        await dynamicPricingService.createPredefinedRules('property-1');

      expect(result).toHaveLength(4);
      expect(mockPrisma.dynamicPricingRule.create).toHaveBeenCalledTimes(4);
    });
  });

  describe('getDynamicPricingRules', () => {
    it('should get all dynamic pricing rules for a property', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          propertyId: 'property-1',
          name: 'High Occupancy Premium',
          isActive: true,
        },
        {
          id: 'rule-2',
          propertyId: 'property-1',
          name: 'Weekend Premium',
          isActive: true,
        },
      ];

      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue(
        mockRules
      );

      const result =
        await dynamicPricingService.getDynamicPricingRules('property-1');

      expect(result).toEqual(mockRules);
      expect(mockPrisma.dynamicPricingRule.findMany).toHaveBeenCalledWith({
        where: { propertyId: 'property-1' },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });
    });

    it('should filter by active status', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          propertyId: 'property-1',
          name: 'High Occupancy Premium',
          isActive: true,
        },
      ];

      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue(
        mockRules
      );

      const result = await dynamicPricingService.getDynamicPricingRules(
        'property-1',
        {
          isActive: true,
        }
      );

      expect(result).toEqual(mockRules);
      expect(mockPrisma.dynamicPricingRule.findMany).toHaveBeenCalledWith({
        where: { propertyId: 'property-1', isActive: true },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });
    });
  });

  describe('updateDynamicPricingRule', () => {
    const mockUpdateRequest = {
      name: 'Updated Rule Name',
      description: 'Updated description',
      priority: 2,
    };

    beforeEach(() => {
      (mockPrisma.dynamicPricingRule.findUnique as any).mockResolvedValue({
        id: 'rule-1',
        propertyId: 'property-1',
        name: 'Original Rule',
        description: 'Original description',
        type: DynamicPricingType.OCCUPANCY_BASED,
        priority: 1,
        conditions: [],
        adjustments: [],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      });
    });

    it('should update a dynamic pricing rule successfully', async () => {
      const mockUpdatedRule = {
        id: 'rule-1',
        ...mockUpdateRequest,
        updatedAt: new Date(),
      };

      (mockPrisma.dynamicPricingRule.update as any).mockResolvedValue(
        mockUpdatedRule
      );

      const result = await dynamicPricingService.updateDynamicPricingRule(
        'rule-1',
        mockUpdateRequest
      );

      expect(result).toEqual(mockUpdatedRule);
      expect(mockPrisma.dynamicPricingRule.update).toHaveBeenCalledWith({
        where: { id: 'rule-1' },
        data: mockUpdateRequest,
      });
    });

    it('should handle non-existent rule', async () => {
      (mockPrisma.dynamicPricingRule.findUnique as any).mockResolvedValue(null);

      await expect(
        dynamicPricingService.updateDynamicPricingRule(
          'non-existent',
          mockUpdateRequest
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteDynamicPricingRule', () => {
    it('should delete a dynamic pricing rule successfully', async () => {
      (mockPrisma.dynamicPricingRule.findUnique as any).mockResolvedValue({
        id: 'rule-1',
        name: 'Test Rule',
      });

      (mockPrisma.dynamicPricingRule.delete as any).mockResolvedValue({});

      await dynamicPricingService.deleteDynamicPricingRule('rule-1');

      expect(mockPrisma.dynamicPricingRule.delete).toHaveBeenCalledWith({
        where: { id: 'rule-1' },
      });
    });

    it('should handle non-existent rule', async () => {
      (mockPrisma.dynamicPricingRule.findUnique as any).mockResolvedValue(null);

      await expect(
        dynamicPricingService.deleteDynamicPricingRule('non-existent')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
