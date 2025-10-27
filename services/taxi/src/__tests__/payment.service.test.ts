import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { paymentClient } from '../clients/payment.client';
import { prisma } from '../lib/prisma';
import { PaymentService } from '../services/payment.service';
import { PaymentStatus } from '../types/payment.types';
import { VehicleType } from '../types/ride.types';

// Mock dependencies
vi.mock('../clients/payment.client');
vi.mock('../lib/prisma', () => ({
  prisma: {
    ride: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    ridePayment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    driverEarnings: {
      create: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
      updateMany: vi.fn(),
    },
    driverPayout: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    driver: {
      findUnique: vi.fn(),
    },
  },
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  const mockPaymentClient = paymentClient as any;

  beforeEach(() => {
    vi.clearAllMocks();
    paymentService = new PaymentService();
  });

  describe('processRidePayment', () => {
    const mockRidePaymentRequest = {
      rideId: 'ride-123',
      passengerId: 'passenger-123',
      driverId: 'driver-123',
      fareBreakdown: {
        baseFare: 5.0,
        distanceFare: 8.0,
        timeFare: 3.0,
        surgeFare: 2.0,
        tolls: 1.0,
        fees: 0.5,
        discounts: 0.0,
        tips: 2.0,
        taxes: 1.5,
        total: 23.0,
      },
      currency: 'USD',
      paymentMethodId: 'pm_123',
    };

    const mockRide = {
      id: 'ride-123',
      vehicleType: VehicleType.ECONOMY,
      passengerId: 'passenger-123',
      driverId: 'driver-123',
    };

    const mockPaymentResponse = {
      id: 'txn-123',
      status: 'succeeded' as PaymentStatus,
      amount: 23.0,
      currency: 'USD',
      metadata: {},
    };

    beforeEach(() => {
      (prisma.ride.findUnique as Mock).mockResolvedValue(mockRide);
      (mockPaymentClient.processPayment as Mock).mockResolvedValue(
        mockPaymentResponse
      );
      (prisma.ridePayment.create as Mock).mockResolvedValue({});
      (prisma.driverEarnings.create as Mock).mockResolvedValue({});
      (prisma.driver.findUnique as Mock).mockResolvedValue({
        id: 'driver-123',
        preferences: {
          paymentPreferences: {
            payoutThreshold: 100,
            autoPayoutEnabled: true,
          },
        },
      });
      (prisma.driverEarnings.aggregate as Mock).mockResolvedValue({
        _sum: { totalEarnings: 50 },
      });
      (prisma.ride.count as Mock).mockResolvedValue(3);
    });

    it('should process ride payment successfully', async () => {
      const result = await paymentService.processRidePayment(
        mockRidePaymentRequest
      );

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn-123');
      expect(result.status).toBe('succeeded');
      expect(result.amount).toBe(23.0);
      expect(result.driverEarnings).toBeDefined();
      expect(mockPaymentClient.processPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 23.0,
          currency: 'USD',
          userId: 'passenger-123',
          paymentMethodId: 'pm_123',
        })
      );
    });

    it('should calculate driver earnings correctly', async () => {
      const result = await paymentService.processRidePayment(
        mockRidePaymentRequest
      );

      expect(result.driverEarnings).toMatchObject({
        grossFare: expect.any(Number),
        platformCommission: expect.any(Number),
        netEarnings: expect.any(Number),
        tips: 2.0,
        bonuses: expect.any(Number),
        totalEarnings: expect.any(Number),
      });
    });

    it('should store payment record in database', async () => {
      await paymentService.processRidePayment(mockRidePaymentRequest);

      expect(prisma.ridePayment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          rideId: 'ride-123',
          transactionId: 'txn-123',
          passengerId: 'passenger-123',
          driverId: 'driver-123',
          amount: 23.0,
          currency: 'USD',
          status: 'succeeded',
        }),
      });
    });

    it('should handle payment failure gracefully', async () => {
      const error = new Error('Payment failed');
      (mockPaymentClient.processPayment as Mock).mockRejectedValue(error);

      const result = await paymentService.processRidePayment(
        mockRidePaymentRequest
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('failed');
      expect(result.error).toBe('Payment failed');
    });
  });

  describe('calculateDriverEarnings', () => {
    const mockFareBreakdown = {
      baseFare: 5.0,
      distanceFare: 8.0,
      timeFare: 3.0,
      surgeFare: 2.0,
      tolls: 1.0,
      fees: 0.5,
      discounts: 0.0,
      tips: 2.0,
      taxes: 1.5,
      total: 23.0,
    };

    beforeEach(() => {
      (prisma.ride.count as Mock).mockResolvedValue(3);
    });

    it('should calculate earnings for economy vehicle correctly', async () => {
      const earnings = await paymentService.calculateDriverEarnings(
        mockFareBreakdown,
        VehicleType.ECONOMY,
        'driver-123'
      );

      expect(earnings.grossFare).toBe(21.5); // total - taxes
      expect(earnings.platformCommission).toBe(4.3); // 20% of gross fare
      expect(earnings.netEarnings).toBe(17.2); // gross - commission
      expect(earnings.tips).toBe(2.0);
      expect(earnings.totalEarnings).toBeGreaterThan(earnings.netEarnings);
    });

    it('should calculate earnings for premium vehicle correctly', async () => {
      const earnings = await paymentService.calculateDriverEarnings(
        mockFareBreakdown,
        VehicleType.PREMIUM,
        'driver-123'
      );

      expect(earnings.platformCommission).toBe(3.225); // 15% of gross fare
      expect(earnings.netEarnings).toBe(18.275); // gross - commission
    });

    it('should apply minimum commission when calculated commission is too low', async () => {
      const lowFareBreakdown = {
        ...mockFareBreakdown,
        total: 3.0,
        taxes: 0.5,
      };

      const earnings = await paymentService.calculateDriverEarnings(
        lowFareBreakdown,
        VehicleType.ECONOMY,
        'driver-123'
      );

      expect(earnings.platformCommission).toBe(1.0); // minimum commission
    });

    it('should include bonuses in total earnings', async () => {
      // Mock peak hour (8 AM)
      const mockDate = new Date('2024-01-01T08:00:00Z');
      vi.setSystemTime(mockDate);

      const earnings = await paymentService.calculateDriverEarnings(
        mockFareBreakdown,
        VehicleType.ECONOMY,
        'driver-123'
      );

      expect(earnings.bonuses).toBeGreaterThan(0);
      expect(earnings.breakdown.peakHourBonus).toBeGreaterThan(0);

      vi.useRealTimers();
    });
  });

  describe('scheduleDriverPayout', () => {
    const mockEarnings = {
      grossFare: 21.5,
      platformCommission: 4.3,
      netEarnings: 17.2,
      tips: 2.0,
      bonuses: 1.0,
      totalEarnings: 20.2,
      breakdown: {
        baseFareEarnings: 4.0,
        distanceEarnings: 6.4,
        timeEarnings: 2.4,
        surgeEarnings: 1.6,
        peakHourBonus: 0.5,
        qualityBonus: 0.3,
        referralBonus: 0.0,
        completionBonus: 0.2,
      },
    };

    beforeEach(() => {
      (prisma.driver.findUnique as Mock).mockResolvedValue({
        id: 'driver-123',
        preferences: {
          paymentPreferences: {
            payoutThreshold: 100,
            autoPayoutEnabled: true,
          },
        },
      });
      (prisma.driverEarnings.create as Mock).mockResolvedValue({});
      (prisma.driverPayout.create as Mock).mockResolvedValue({
        id: 'payout-123',
        driverId: 'driver-123',
        amount: 120.2,
        status: 'pending',
      });
    });

    it('should schedule payout when threshold is reached', async () => {
      (prisma.driverEarnings.aggregate as Mock).mockResolvedValue({
        _sum: { totalEarnings: 100 },
      });

      await paymentService.scheduleDriverPayout('driver-123', mockEarnings);

      expect(prisma.driverPayout.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          driverId: 'driver-123',
          amount: 120.2, // 100 + 20.2
          currency: 'USD',
          payoutMethod: 'bank_transfer',
          status: 'pending',
        }),
      });
    });

    it('should not schedule payout when threshold is not reached', async () => {
      (prisma.driverEarnings.aggregate as Mock).mockResolvedValue({
        _sum: { totalEarnings: 50 },
      });

      await paymentService.scheduleDriverPayout('driver-123', mockEarnings);

      expect(prisma.driverPayout.create).not.toHaveBeenCalled();
    });

    it('should not schedule payout when auto payout is disabled', async () => {
      (prisma.driver.findUnique as Mock).mockResolvedValue({
        id: 'driver-123',
        preferences: {
          paymentPreferences: {
            payoutThreshold: 100,
            autoPayoutEnabled: false,
          },
        },
      });
      (prisma.driverEarnings.aggregate as Mock).mockResolvedValue({
        _sum: { totalEarnings: 100 },
      });

      await paymentService.scheduleDriverPayout('driver-123', mockEarnings);

      expect(prisma.driverPayout.create).not.toHaveBeenCalled();
    });
  });

  describe('refundRidePayment', () => {
    const mockPaymentRecord = {
      rideId: 'ride-123',
      transactionId: 'txn-123',
      amount: 23.0,
      refundedAmount: 0,
    };

    const mockRefund = {
      id: 'refund-123',
      transactionId: 'txn-123',
      amount: 23.0,
      currency: 'USD',
      reason: 'Customer request',
      status: 'succeeded' as PaymentStatus,
      processedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      (prisma.ridePayment.findUnique as Mock).mockResolvedValue(
        mockPaymentRecord
      );
      (mockPaymentClient.refundPayment as Mock).mockResolvedValue(mockRefund);
      (prisma.ridePayment.update as Mock).mockResolvedValue({});
    });

    it('should process full refund successfully', async () => {
      const result = await paymentService.refundRidePayment(
        'ride-123',
        undefined,
        'Customer request'
      );

      expect(result).toEqual(mockRefund);
      expect(mockPaymentClient.refundPayment).toHaveBeenCalledWith(
        'txn-123',
        undefined,
        'Customer request'
      );
      expect(prisma.ridePayment.update).toHaveBeenCalledWith({
        where: { rideId: 'ride-123' },
        data: expect.objectContaining({
          status: 'refunded',
          refundedAmount: 23.0,
        }),
      });
    });

    it('should process partial refund successfully', async () => {
      const result = await paymentService.refundRidePayment(
        'ride-123',
        10.0,
        'Partial refund'
      );

      expect(result).toEqual(mockRefund);
      expect(prisma.ridePayment.update).toHaveBeenCalledWith({
        where: { rideId: 'ride-123' },
        data: expect.objectContaining({
          status: 'partially_refunded',
          refundedAmount: 10.0,
        }),
      });
    });

    it('should throw error when payment record not found', async () => {
      (prisma.ridePayment.findUnique as Mock).mockResolvedValue(null);

      await expect(
        paymentService.refundRidePayment('ride-123', 10.0, 'Test refund')
      ).rejects.toThrow('Payment record not found for ride: ride-123');
    });
  });

  describe('getDriverEarningsSummary', () => {
    const mockEarnings = [
      {
        driverId: 'driver-123',
        totalEarnings: 20.0,
        platformCommission: 4.0,
        tips: 2.0,
        bonuses: 1.0,
      },
      {
        driverId: 'driver-123',
        totalEarnings: 25.0,
        platformCommission: 5.0,
        tips: 3.0,
        bonuses: 2.0,
      },
    ];

    beforeEach(() => {
      (prisma.driverEarnings.findMany as Mock).mockResolvedValue(mockEarnings);
    });

    it('should calculate earnings summary correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const summary = await paymentService.getDriverEarningsSummary(
        'driver-123',
        startDate,
        endDate
      );

      expect(summary).toEqual({
        totalEarnings: 45.0,
        totalRides: 2,
        averageEarningsPerRide: 22.5,
        totalCommission: 9.0,
        totalTips: 5.0,
        totalBonuses: 3.0,
        breakdown: mockEarnings,
      });
    });

    it('should handle empty earnings correctly', async () => {
      (prisma.driverEarnings.findMany as Mock).mockResolvedValue([]);

      const summary = await paymentService.getDriverEarningsSummary(
        'driver-123',
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(summary).toEqual({
        totalEarnings: 0,
        totalRides: 0,
        averageEarningsPerRide: 0,
        totalCommission: 0,
        totalTips: 0,
        totalBonuses: 0,
        breakdown: [],
      });
    });
  });
});
