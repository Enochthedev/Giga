/**
 * Unit tests for PricingService
 */

import { PrismaClient } from '@/generated/prisma-client';
import { PricingService } from '@/services/pricing.service';
import {
  AdjustmentMethod,
  DiscountType,
  PriceCalculationRequest,
  PromotionType,
  RateType,
} from '@/types';
import { Redis } from 'redis';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
const mockPrisma = {
  property: {
    findUnique: vi.fn(),
  },
  roomType: {
    findUnique: vi.fn(),
  },
  rateRecord: {
    findMany: vi.fn(),
  },
  seasonalRate: {
    findMany: vi.fn(),
  },
  dynamicPricingRule: {
    findMany: vi.fn(),
  },
  promotion: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  taxConfiguration: {
    findMany: vi.fn(),
  },
} as unknown as PrismaClient;

const mockRedis = {
  get: vi.fn(),
  setex: vi.fn(),
} as unknown as Redis;

describe('PricingService', () => {
  let pricingService: PricingService;

  beforeEach(() => {
    pricingService = new PricingService(mockPrisma, mockRedis);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('calculatePrice', () => {
    const mockRequest: PriceCalculationRequest = {
      propertyId: 'property-1',
      roomTypeId: 'room-type-1',
      checkInDate: new Date('2024-01-15'),
      checkOutDate: new Date('2024-01-17'),
      guestCount: 2,
      roomQuantity: 1,
    };

    beforeEach(() => {
      // Mock property and room type validation
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });

      (mockPrisma.roomType.findUnique as any).mockResolvedValue({
        id: 'room-type-1',
        name: 'Standard Room',
        propertyId: 'property-1',
      });

      // Mock Redis cache miss
      (mockRedis.get as any).mockResolvedValue(null);
      (mockRedis.setex as any).mockResolvedValue('OK');
    });

    it('should calculate basic price without adjustments', async () => {
      // Mock base rates
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
        {
          id: 'rate-2',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-16'),
          rate: 120,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      // Mock no seasonal rates, dynamic rules, or promotions
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);
      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([]);
      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([]);

      const result = await pricingService.calculatePrice(mockRequest);

      expect(result).toBeDefined();
      expect(result.baseAmount).toBe(220); // 100 + 120
      expect(result.totalAmount).toBe(220);
      expect(result.currency).toBe('USD');
      expect(result.nightlyRates).toHaveLength(2);
    });

    it('should apply seasonal pricing adjustments', async () => {
      // Mock base rates
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      // Mock seasonal rate with 20% increase
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([
        {
          id: 'seasonal-1',
          propertyId: 'property-1',
          name: 'Winter Season',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          priority: 1,
          roomTypeRates: [
            {
              roomTypeId: 'room-type-1',
              adjustmentType: AdjustmentMethod.PERCENTAGE,
              adjustmentValue: 20,
            },
          ],
        },
      ]);

      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([]);
      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([]);

      const result = await pricingService.calculatePrice(mockRequest);

      expect(result.baseAmount).toBe(120); // 100 * 1.2
      expect(result.totalAmount).toBe(120);
    });

    it('should apply dynamic pricing rules', async () => {
      // Mock base rates
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);

      // Mock dynamic pricing rule for high occupancy
      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([
        {
          id: 'dynamic-1',
          propertyId: 'property-1',
          name: 'High Occupancy Premium',
          type: 'occupancy_based',
          priority: 1,
          conditions: [
            {
              type: 'occupancy_rate',
              operator: 'greater_than',
              value: 80,
            },
          ],
          adjustments: [
            {
              type: 'occupancy_based',
              method: AdjustmentMethod.PERCENTAGE,
              value: 15,
            },
          ],
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
        },
      ]);

      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([]);

      const result = await pricingService.calculatePrice(mockRequest);

      // Should apply 15% increase due to high occupancy (mocked at 85%)
      expect(result.baseAmount).toBe(115); // 100 * 1.15
      expect(result.totalAmount).toBe(115);
    });

    it('should apply promotions and discounts', async () => {
      const requestWithPromo = {
        ...mockRequest,
        promotionCodes: ['SAVE20'],
      };

      // Mock base rates
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);
      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([]);

      // Mock promotion
      (mockPrisma.promotion.findFirst as any).mockResolvedValue({
        id: 'promo-1',
        code: 'SAVE20',
        name: '20% Off',
        description: '20% discount',
        type: PromotionType.PUBLIC,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        conditions: [],
        usage: {
          maxTotalUsage: 1000,
          maxUsagePerGuest: 1,
          currentUsage: 0,
          usageHistory: [],
        },
        isActive: true,
      });

      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([]);

      const result = await pricingService.calculatePrice(requestWithPromo);

      expect(result.baseAmount).toBe(100);
      expect(result.discountAmount).toBe(20); // 20% of 100
      expect(result.totalAmount).toBe(80); // 100 - 20
      expect(result.appliedPromotions).toHaveLength(1);
      expect(result.appliedPromotions[0].code).toBe('SAVE20');
    });

    it('should calculate taxes correctly', async () => {
      // Mock base rates
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);
      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([]);
      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);

      // Mock tax configuration
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([
        {
          id: 'tax-1',
          propertyId: 'property-1',
          name: 'City Tax',
          type: 'city_tax',
          rate: 10,
          isPercentage: true,
          isInclusive: false,
          isActive: true,
          validFrom: new Date('2024-01-01'),
        },
      ]);

      const result = await pricingService.calculatePrice(mockRequest);

      expect(result.baseAmount).toBe(100);
      expect(result.taxAmount).toBe(10); // 10% of 100
      expect(result.totalAmount).toBe(110); // 100 + 10
      expect(result.breakdown.taxes).toHaveLength(1);
      expect(result.breakdown.taxes[0].name).toBe('City Tax');
    });

    it('should handle validation errors', async () => {
      const invalidRequest = {
        ...mockRequest,
        propertyId: '',
      };

      await expect(
        pricingService.calculatePrice(invalidRequest)
      ).rejects.toThrow('Property ID is required');
    });

    it('should handle missing property', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue(null);

      await expect(pricingService.calculatePrice(mockRequest)).rejects.toThrow(
        'Property not found'
      );
    });

    it('should handle missing room type', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });
      (mockPrisma.roomType.findUnique as any).mockResolvedValue(null);

      await expect(pricingService.calculatePrice(mockRequest)).rejects.toThrow(
        'Room type not found'
      );
    });

    it('should handle no base rates found', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });
      (mockPrisma.roomType.findUnique as any).mockResolvedValue({
        id: 'room-type-1',
        name: 'Standard Room',
        propertyId: 'property-1',
      });
      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([]);

      await expect(pricingService.calculatePrice(mockRequest)).rejects.toThrow(
        'No base rates found for the specified date range'
      );
    });

    it('should use cached results when available', async () => {
      const cachedResult = {
        baseAmount: 150,
        totalAmount: 150,
        currency: 'USD',
      };

      (mockRedis.get as any).mockResolvedValue(JSON.stringify(cachedResult));

      // Should not call database methods when cache hit
      const result = await pricingService.calculatePrice(mockRequest);

      expect(mockPrisma.rateRecord.findMany).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResult);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle invalid date ranges', async () => {
      const invalidRequest: PriceCalculationRequest = {
        propertyId: 'property-1',
        roomTypeId: 'room-type-1',
        checkInDate: new Date('2024-01-17'),
        checkOutDate: new Date('2024-01-15'), // Check-out before check-in
        guestCount: 2,
      };

      await expect(
        pricingService.calculatePrice(invalidRequest)
      ).rejects.toThrow('Check-out date must be after check-in date');
    });

    it('should handle zero or negative guest count', async () => {
      const invalidRequest: PriceCalculationRequest = {
        propertyId: 'property-1',
        roomTypeId: 'room-type-1',
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-17'),
        guestCount: 0,
      };

      await expect(
        pricingService.calculatePrice(invalidRequest)
      ).rejects.toThrow('Guest count must be at least 1');
    });

    it('should handle multiple seasonal rates with different priorities', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue({
        id: 'property-1',
        name: 'Test Hotel',
      });
      (mockPrisma.roomType.findUnique as any).mockResolvedValue({
        id: 'room-type-1',
        name: 'Standard Room',
        propertyId: 'property-1',
      });
      (mockRedis.get as any).mockResolvedValue(null);
      (mockRedis.setex as any).mockResolvedValue('OK');

      (mockPrisma.rateRecord.findMany as any).mockResolvedValue([
        {
          id: 'rate-1',
          propertyId: 'property-1',
          roomTypeId: 'room-type-1',
          date: new Date('2024-01-15'),
          rate: 100,
          currency: 'USD',
          rateType: RateType.BASE,
        },
      ]);

      // Mock multiple seasonal rates with different priorities
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([
        {
          id: 'seasonal-1',
          propertyId: 'property-1',
          name: 'Winter Season',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          priority: 1,
          roomTypeRates: [
            {
              roomTypeId: 'room-type-1',
              adjustmentType: AdjustmentMethod.PERCENTAGE,
              adjustmentValue: 20,
            },
          ],
        },
        {
          id: 'seasonal-2',
          propertyId: 'property-1',
          name: 'Holiday Premium',
          startDate: new Date('2024-01-10'),
          endDate: new Date('2024-01-20'),
          priority: 2, // Higher priority
          roomTypeRates: [
            {
              roomTypeId: 'room-type-1',
              adjustmentType: AdjustmentMethod.PERCENTAGE,
              adjustmentValue: 30,
            },
          ],
        },
      ]);

      (mockPrisma.dynamicPricingRule.findMany as any).mockResolvedValue([]);
      (mockPrisma.promotion.findMany as any).mockResolvedValue([]);
      (mockPrisma.taxConfiguration.findMany as any).mockResolvedValue([]);

      const result = await pricingService.calculatePrice({
        propertyId: 'property-1',
        roomTypeId: 'room-type-1',
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-16'),
        guestCount: 2,
      });

      // Should apply both adjustments: 100 * 1.2 * 1.3 = 156
      expect(result.baseAmount).toBe(156);
    });
  });
});
