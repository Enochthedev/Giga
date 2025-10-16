/**
 * Unit tests for SeasonalPricingService
 */

import { PrismaClient } from '@/generated/prisma-client';
import { SeasonalPricingService } from '@/services/seasonal-pricing.service';
import { AdjustmentMethod } from '@/types';
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma client
const mockPrisma = {
  seasonalRate: {
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

describe('SeasonalPricingService', () => {
  let seasonalPricingService: SeasonalPricingService;

  beforeEach(() => {
    seasonalPricingService = new SeasonalPricingService(mockPrisma);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createSeasonalRate', () => {
    const mockCreateRequest = {
      propertyId: 'property-1',
      name: 'Summer Season',
      description: 'Summer pricing adjustment',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      roomTypeRates: [
        {
          roomTypeId: 'room-type-1',
          adjustmentType: AdjustmentMethod.PERCENTAGE,
          adjustmentValue: 25,
          minimumRate: 80,
          maximumRate: 300,
        },
      ],
      priority: 1,
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

      // Mock no conflicts
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);
    });

    it('should create a seasonal rate successfully', async () => {
      const mockCreatedRate = {
        id: 'seasonal-1',
        ...mockCreateRequest,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.seasonalRate.create as any).mockResolvedValue(
        mockCreatedRate
      );

      const result =
        await seasonalPricingService.createSeasonalRate(mockCreateRequest);

      expect(result).toEqual(mockCreatedRate);
      expect(mockPrisma.seasonalRate.create).toHaveBeenCalledWith({
        data: {
          propertyId: mockCreateRequest.propertyId,
          name: mockCreateRequest.name,
          description: mockCreateRequest.description,
          startDate: mockCreateRequest.startDate,
          endDate: mockCreateRequest.endDate,
          roomTypeRates: mockCreateRequest.roomTypeRates,
          priority: mockCreateRequest.priority,
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
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should validate date range', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        startDate: new Date('2024-08-31'),
        endDate: new Date('2024-06-01'), // End before start
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('End date must be after start date');
    });

    it('should validate room type rates', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        roomTypeRates: [],
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('At least one room type rate is required');
    });

    it('should validate adjustment types', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        roomTypeRates: [
          {
            roomTypeId: 'room-type-1',
            adjustmentType: 'invalid_type' as any,
            adjustmentValue: 25,
          },
        ],
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('Invalid adjustment type');
    });

    it('should validate percentage adjustments', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        roomTypeRates: [
          {
            roomTypeId: 'room-type-1',
            adjustmentType: AdjustmentMethod.PERCENTAGE,
            adjustmentValue: -150, // Less than -100%
          },
        ],
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('Percentage adjustment cannot be less than -100%');
    });

    it('should validate multiplier adjustments', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        roomTypeRates: [
          {
            roomTypeId: 'room-type-1',
            adjustmentType: AdjustmentMethod.MULTIPLIER,
            adjustmentValue: 0, // Must be greater than 0
          },
        ],
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('Multiplier adjustment must be greater than 0');
    });

    it('should validate min/max rates', async () => {
      const invalidRequest = {
        ...mockCreateRequest,
        roomTypeRates: [
          {
            roomTypeId: 'room-type-1',
            adjustmentType: AdjustmentMethod.PERCENTAGE,
            adjustmentValue: 25,
            minimumRate: 100,
            maximumRate: 80, // Max less than min
          },
        ],
      };

      await expect(
        seasonalPricingService.createSeasonalRate(invalidRequest)
      ).rejects.toThrow('Maximum rate must be greater than minimum rate');
    });

    it('should check for property existence', async () => {
      (mockPrisma.property.findUnique as any).mockResolvedValue(null);

      await expect(
        seasonalPricingService.createSeasonalRate(mockCreateRequest)
      ).rejects.toThrow(NotFoundError);
    });

    it('should check for room type existence', async () => {
      (mockPrisma.roomType.findMany as any).mockResolvedValue([]); // No room types found

      await expect(
        seasonalPricingService.createSeasonalRate(mockCreateRequest)
      ).rejects.toThrow('Room types not found');
    });

    it('should check for conflicts with higher priority rates', async () => {
      // Mock existing overlapping rate with higher priority
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([
        {
          id: 'existing-1',
          propertyId: 'property-1',
          name: 'Existing Rate',
          priority: 2, // Higher than request priority (1)
          roomTypeRates: [
            {
              roomTypeId: 'room-type-1',
              adjustmentType: AdjustmentMethod.PERCENTAGE,
              adjustmentValue: 30,
            },
          ],
        },
      ]);

      await expect(
        seasonalPricingService.createSeasonalRate(mockCreateRequest)
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('updateSeasonalRate', () => {
    const mockUpdateRequest = {
      name: 'Updated Summer Season',
      description: 'Updated description',
      priority: 2,
    };

    beforeEach(() => {
      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue({
        id: 'seasonal-1',
        propertyId: 'property-1',
        name: 'Summer Season',
        description: 'Original description',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        roomTypeRates: [
          {
            roomTypeId: 'room-type-1',
            adjustmentType: AdjustmentMethod.PERCENTAGE,
            adjustmentValue: 25,
          },
        ],
        priority: 1,
        isActive: true,
      });
    });

    it('should update a seasonal rate successfully', async () => {
      const mockUpdatedRate = {
        id: 'seasonal-1',
        ...mockUpdateRequest,
        updatedAt: new Date(),
      };

      (mockPrisma.seasonalRate.update as any).mockResolvedValue(
        mockUpdatedRate
      );

      const result = await seasonalPricingService.updateSeasonalRate(
        'seasonal-1',
        mockUpdateRequest
      );

      expect(result).toEqual(mockUpdatedRate);
      expect(mockPrisma.seasonalRate.update).toHaveBeenCalledWith({
        where: { id: 'seasonal-1' },
        data: mockUpdateRequest,
      });
    });

    it('should handle non-existent seasonal rate', async () => {
      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(null);

      await expect(
        seasonalPricingService.updateSeasonalRate(
          'non-existent',
          mockUpdateRequest
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getSeasonalRate', () => {
    it('should get a seasonal rate by ID', async () => {
      const mockRate = {
        id: 'seasonal-1',
        propertyId: 'property-1',
        name: 'Summer Season',
      };

      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(mockRate);

      const result = await seasonalPricingService.getSeasonalRate('seasonal-1');

      expect(result).toEqual(mockRate);
      expect(mockPrisma.seasonalRate.findUnique).toHaveBeenCalledWith({
        where: { id: 'seasonal-1' },
      });
    });

    it('should handle non-existent seasonal rate', async () => {
      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(null);

      await expect(
        seasonalPricingService.getSeasonalRate('non-existent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getSeasonalRates', () => {
    it('should get all seasonal rates for a property', async () => {
      const mockRates = [
        {
          id: 'seasonal-1',
          propertyId: 'property-1',
          name: 'Summer Season',
          isActive: true,
        },
        {
          id: 'seasonal-2',
          propertyId: 'property-1',
          name: 'Winter Season',
          isActive: true,
        },
      ];

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue(mockRates);

      const result =
        await seasonalPricingService.getSeasonalRates('property-1');

      expect(result).toEqual(mockRates);
      expect(mockPrisma.seasonalRate.findMany).toHaveBeenCalledWith({
        where: { propertyId: 'property-1' },
        orderBy: [{ priority: 'desc' }, { startDate: 'asc' }],
      });
    });

    it('should filter by active status', async () => {
      const mockRates = [
        {
          id: 'seasonal-1',
          propertyId: 'property-1',
          name: 'Summer Season',
          isActive: true,
        },
      ];

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue(mockRates);

      const result = await seasonalPricingService.getSeasonalRates(
        'property-1',
        {
          isActive: true,
        }
      );

      expect(result).toEqual(mockRates);
      expect(mockPrisma.seasonalRate.findMany).toHaveBeenCalledWith({
        where: { propertyId: 'property-1', isActive: true },
        orderBy: [{ priority: 'desc' }, { startDate: 'asc' }],
      });
    });

    it('should exclude expired rates by default', async () => {
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);

      await seasonalPricingService.getSeasonalRates('property-1');

      expect(mockPrisma.seasonalRate.findMany).toHaveBeenCalledWith({
        where: {
          propertyId: 'property-1',
          endDate: { gte: expect.any(Date) },
        },
        orderBy: [{ priority: 'desc' }, { startDate: 'asc' }],
      });
    });
  });

  describe('deleteSeasonalRate', () => {
    it('should delete a seasonal rate successfully', async () => {
      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue({
        id: 'seasonal-1',
        name: 'Summer Season',
      });

      (mockPrisma.seasonalRate.delete as any).mockResolvedValue({});

      await seasonalPricingService.deleteSeasonalRate('seasonal-1');

      expect(mockPrisma.seasonalRate.delete).toHaveBeenCalledWith({
        where: { id: 'seasonal-1' },
      });
    });

    it('should handle non-existent seasonal rate', async () => {
      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(null);

      await expect(
        seasonalPricingService.deleteSeasonalRate('non-existent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('toggleSeasonalRate', () => {
    it('should activate a seasonal rate', async () => {
      const mockRate = {
        id: 'seasonal-1',
        name: 'Summer Season',
        isActive: false,
      };

      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(mockRate);
      (mockPrisma.seasonalRate.update as any).mockResolvedValue({
        ...mockRate,
        isActive: true,
      });

      const result = await seasonalPricingService.toggleSeasonalRate(
        'seasonal-1',
        true
      );

      expect(result.isActive).toBe(true);
      expect(mockPrisma.seasonalRate.update).toHaveBeenCalledWith({
        where: { id: 'seasonal-1' },
        data: { isActive: true },
      });
    });

    it('should deactivate a seasonal rate', async () => {
      const mockRate = {
        id: 'seasonal-1',
        name: 'Summer Season',
        isActive: true,
      };

      (mockPrisma.seasonalRate.findUnique as any).mockResolvedValue(mockRate);
      (mockPrisma.seasonalRate.update as any).mockResolvedValue({
        ...mockRate,
        isActive: false,
      });

      const result = await seasonalPricingService.toggleSeasonalRate(
        'seasonal-1',
        false
      );

      expect(result.isActive).toBe(false);
    });
  });

  describe('getSeasonalAdjustmentsForDate', () => {
    it('should get seasonal adjustments for a specific date', async () => {
      const mockSeasonalRates = [
        {
          id: 'seasonal-1',
          propertyId: 'property-1',
          name: 'Summer Season',
          roomTypeRates: [
            {
              roomTypeId: 'room-type-1',
              adjustmentType: AdjustmentMethod.PERCENTAGE,
              adjustmentValue: 25,
            },
          ],
        },
      ];

      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue(
        mockSeasonalRates
      );

      const result = await seasonalPricingService.getSeasonalAdjustmentsForDate(
        'property-1',
        'room-type-1',
        new Date('2024-07-15')
      );

      expect(result.adjustments).toHaveLength(1);
      expect(result.adjustments[0].roomTypeRate.adjustmentValue).toBe(25);
      expect(result.totalAdjustment).toBe(25);
    });

    it('should return empty adjustments when no seasonal rates apply', async () => {
      (mockPrisma.seasonalRate.findMany as any).mockResolvedValue([]);

      const result = await seasonalPricingService.getSeasonalAdjustmentsForDate(
        'property-1',
        'room-type-1',
        new Date('2024-07-15')
      );

      expect(result.adjustments).toHaveLength(0);
      expect(result.totalAdjustment).toBe(0);
    });
  });
});
