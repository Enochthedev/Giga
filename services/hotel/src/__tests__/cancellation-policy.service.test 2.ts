/**
 * Cancellation Policy Service Tests
 */

import { CancellationPolicyService } from '@/services/cancellation-policy.service';
import { CancellationPenaltyType } from '@/types';
import { NotFoundError } from '@/utils/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma
vi.mock('@/generated/prisma-client');

describe('CancellationPolicyService', () => {
  let service: CancellationPolicyService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      booking: {
        findUnique: vi.fn(),
      },
      cancellationPolicy: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        updateMany: vi.fn(),
      },
    };
    service = new CancellationPolicyService(mockPrisma);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCancellationPolicy', () => {
    it('should return specific policy when policyId provided', async () => {
      const mockPolicy = {
        id: 'policy-1',
        name: 'Flexible Policy',
        description: 'Free cancellation up to 24 hours',
        refundPercentage: 100,
        hoursBeforeCheckIn: 24,
        penaltyType: 'percentage',
        penaltyValue: 0,
        isActive: true,
        isDefault: false,
      };

      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        mockPolicy as any
      );

      const result = await service.getCancellationPolicy(
        'property-1',
        'policy-1'
      );

      expect(result.id).toBe('policy-1');
      expect(result.name).toBe('Flexible Policy');
      expect(result.refundPercentage).toBe(100);
      expect(result.penaltyType).toBe(CancellationPenaltyType.PERCENTAGE);
    });

    it('should return default policy when no policyId provided', async () => {
      const mockDefaultPolicy = {
        id: 'default-policy',
        name: 'Standard Policy',
        description: 'Standard cancellation terms',
        refundPercentage: 80,
        hoursBeforeCheckIn: 48,
        penaltyType: 'percentage',
        penaltyValue: 20,
        isActive: true,
        isDefault: true,
      };

      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        mockDefaultPolicy as any
      );

      const result = await service.getCancellationPolicy('property-1');

      expect(result.id).toBe('default-policy');
      expect(result.isDefault).toBe(true);
    });

    it('should return standard policy when no policy found', async () => {
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(null);

      const result = await service.getCancellationPolicy('property-1');

      expect(result.id).toBe('standard');
      expect(result.name).toBe('Standard Cancellation Policy');
      expect(result.isDefault).toBe(true);
    });
  });

  describe('calculateRefund', () => {
    const mockBooking = {
      id: 'booking-1',
      propertyId: 'property-1',
      checkInDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
      totalAmount: 300,
      nights: 2,
      cancellationPolicyId: null,
      property: {
        id: 'property-1',
        name: 'Test Hotel',
      },
    };

    const mockPolicy = {
      id: 'policy-1',
      name: 'Standard Policy',
      description: 'Standard cancellation terms',
      refundPercentage: 100,
      hoursBeforeCheckIn: 24,
      penaltyType: 'no_penalty',
      penaltyValue: null,
      isActive: true,
      isDefault: true,
    };

    it('should calculate full refund for early cancellation', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        mockPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      expect(result.originalAmount).toBe(300);
      expect(result.refundPercentage).toBe(100);
      expect(result.refundableAmount).toBe(300);
      expect(result.cancellationFee).toBe(0);
      expect(result.penaltyAmount).toBe(0);
    });

    it('should calculate reduced refund for late cancellation', async () => {
      const lateBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      };

      mockPrisma.booking.findUnique.mockResolvedValue(lateBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        mockPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      expect(result.originalAmount).toBe(300);
      expect(result.refundPercentage).toBeLessThan(100);
      expect(result.refundableAmount).toBeLessThan(300);
    });

    it('should apply percentage penalty', async () => {
      const penaltyPolicy = {
        ...mockPolicy,
        penaltyType: 'percentage',
        penaltyValue: 25, // 25% penalty
      };

      const lateBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      };

      mockPrisma.booking.findUnique.mockResolvedValue(lateBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        penaltyPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      expect(result.penaltyAmount).toBeGreaterThan(0);
      expect(result.penaltyAmount).toBe(75); // 25% of 300
    });

    it('should apply fixed amount penalty', async () => {
      const fixedPenaltyPolicy = {
        ...mockPolicy,
        penaltyType: 'fixed_amount',
        penaltyValue: 50,
      };

      const lateBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
      };

      mockPrisma.booking.findUnique.mockResolvedValue(lateBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        fixedPenaltyPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      expect(result.penaltyAmount).toBe(50);
    });

    it('should apply nights-based penalty', async () => {
      const nightsPenaltyPolicy = {
        ...mockPolicy,
        penaltyType: 'nights',
        penaltyValue: 1, // 1 night penalty
      };

      const lateBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
      };

      mockPrisma.booking.findUnique.mockResolvedValue(lateBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        nightsPenaltyPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      const expectedPenalty = 300 / 2; // 1 night out of 2 nights
      expect(result.penaltyAmount).toBe(expectedPenalty);
    });

    it('should include cancellation fee for last-minute cancellation', async () => {
      const veryLateBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      };

      mockPrisma.booking.findUnique.mockResolvedValue(veryLateBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(
        mockPolicy as any
      );

      const result = await service.calculateRefund('booking-1');

      expect(result.cancellationFee).toBeGreaterThan(0);
      expect(result.breakdown.some(b => b.type === 'fee')).toBe(true);
    });

    it('should throw error for non-existent booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.calculateRefund('booking-1')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('validateCancellation', () => {
    const mockBooking = {
      id: 'booking-1',
      status: 'confirmed',
      checkInDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      totalAmount: 300,
    };

    it('should allow cancellation for valid booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue({
        id: 'policy-1',
        refundPercentage: 100,
        hoursBeforeCheckIn: 24,
        penaltyType: 'no_penalty',
        isActive: true,
        isDefault: true,
      } as any);

      const result = await service.validateCancellation('booking-1');

      expect(result.canCancel).toBe(true);
      expect(result.refundCalculation).toBeDefined();
    });

    it('should reject cancellation for cancelled booking', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: 'cancelled',
      };

      mockPrisma.booking.findUnique.mockResolvedValue(cancelledBooking as any);

      const result = await service.validateCancellation('booking-1');

      expect(result.canCancel).toBe(false);
      expect(result.reason).toContain('Cannot cancel booking with status');
    });

    it('should reject cancellation for past booking', async () => {
      const pastBooking = {
        ...mockBooking,
        checkInDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      };

      mockPrisma.booking.findUnique.mockResolvedValue(pastBooking as any);

      const result = await service.validateCancellation('booking-1');

      expect(result.canCancel).toBe(false);
      expect(result.reason).toContain('after check-in date has passed');
    });

    it('should reject cancellation for non-existent booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      const result = await service.validateCancellation('booking-1');

      expect(result.canCancel).toBe(false);
      expect(result.reason).toBe('Booking not found');
    });
  });

  describe('createCancellationPolicy', () => {
    it('should create new cancellation policy', async () => {
      const policyData = {
        name: 'Flexible Policy',
        description: 'Free cancellation up to 24 hours',
        refundPercentage: 100,
        hoursBeforeCheckIn: 24,
        penaltyType: CancellationPenaltyType.NO_PENALTY,
        isDefault: false,
      };

      const mockCreatedPolicy = {
        id: 'new-policy-1',
        ...policyData,
        penaltyType: 'no_penalty',
        penaltyValue: null,
        isActive: true,
      };

      mockPrisma.cancellationPolicy.create.mockResolvedValue(
        mockCreatedPolicy as any
      );

      const result = await service.createCancellationPolicy(
        'property-1',
        policyData
      );

      expect(result.id).toBe('new-policy-1');
      expect(result.name).toBe('Flexible Policy');
      expect(result.penaltyType).toBe(CancellationPenaltyType.NO_PENALTY);
    });

    it('should unset other default policies when creating default policy', async () => {
      const policyData = {
        name: 'New Default Policy',
        description: 'New default cancellation terms',
        refundPercentage: 90,
        hoursBeforeCheckIn: 48,
        penaltyType: CancellationPenaltyType.PERCENTAGE,
        penaltyValue: 10,
        isDefault: true,
      };

      mockPrisma.cancellationPolicy.updateMany.mockResolvedValue({
        count: 1,
      } as any);
      mockPrisma.cancellationPolicy.create.mockResolvedValue({
        id: 'new-default-policy',
        ...policyData,
        penaltyType: 'percentage',
        isActive: true,
      } as any);

      await service.createCancellationPolicy('property-1', policyData);

      expect(mockPrisma.cancellationPolicy.updateMany).toHaveBeenCalledWith({
        where: {
          propertyId: 'property-1',
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    });
  });

  describe('getPropertyCancellationPolicies', () => {
    it('should return all active policies for property', async () => {
      const mockPolicies = [
        {
          id: 'policy-1',
          name: 'Flexible',
          description: 'Flexible cancellation',
          refundPercentage: 100,
          hoursBeforeCheckIn: 24,
          penaltyType: 'no_penalty',
          penaltyValue: null,
          isActive: true,
          isDefault: true,
        },
        {
          id: 'policy-2',
          name: 'Strict',
          description: 'Strict cancellation',
          refundPercentage: 50,
          hoursBeforeCheckIn: 72,
          penaltyType: 'percentage',
          penaltyValue: 50,
          isActive: true,
          isDefault: false,
        },
      ];

      mockPrisma.cancellationPolicy.findMany.mockResolvedValue(
        mockPolicies as any
      );

      const result =
        await service.getPropertyCancellationPolicies('property-1');

      expect(result).toHaveLength(2);
      expect(result[0].isDefault).toBe(true);
      expect(result[1].isDefault).toBe(false);
    });

    it('should return empty array when no policies found', async () => {
      mockPrisma.cancellationPolicy.findMany.mockResolvedValue([]);

      const result =
        await service.getPropertyCancellationPolicies('property-1');

      expect(result).toHaveLength(0);
    });
  });
});
