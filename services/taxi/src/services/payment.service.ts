import { paymentClient } from '../clients/payment.client';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  CommissionStructure,
  DriverEarnings,
  DriverPayout,
  PaymentStatus,
  PayoutRequest,
  Refund,
  RidePaymentRequest,
  RidePaymentResult,
  Transaction,
} from '../types/payment.types';
import { FareBreakdown } from '../types/pricing.types';
import { Ride, VehicleType } from '../types/ride.types';

export class PaymentService {
  private commissionStructures: Map<VehicleType, CommissionStructure> =
    new Map();

  constructor() {
    this.initializeCommissionStructures();
  }

  private initializeCommissionStructures(): void {
    // Default commission structures for different vehicle types
    this.commissionStructures.set(VehicleType.ECONOMY, {
      vehicleType: VehicleType.ECONOMY,
      baseCommissionRate: 0.2, // 20%
      minimumCommission: 1.0,
      maximumCommission: 50.0,
    });

    this.commissionStructures.set(VehicleType.COMFORT, {
      vehicleType: VehicleType.COMFORT,
      baseCommissionRate: 0.18, // 18%
      minimumCommission: 1.5,
      maximumCommission: 60.0,
    });

    this.commissionStructures.set(VehicleType.PREMIUM, {
      vehicleType: VehicleType.PREMIUM,
      baseCommissionRate: 0.15, // 15%
      minimumCommission: 2.0,
      maximumCommission: 75.0,
    });

    this.commissionStructures.set(VehicleType.SUV, {
      vehicleType: VehicleType.SUV,
      baseCommissionRate: 0.17, // 17%
      minimumCommission: 2.0,
      maximumCommission: 70.0,
    });

    this.commissionStructures.set(VehicleType.MOTORCYCLE, {
      vehicleType: VehicleType.MOTORCYCLE,
      baseCommissionRate: 0.25, // 25%
      minimumCommission: 0.5,
      maximumCommission: 25.0,
    });

    this.commissionStructures.set(VehicleType.ACCESSIBLE, {
      vehicleType: VehicleType.ACCESSIBLE,
      baseCommissionRate: 0.15, // 15% (lower to incentivize accessibility)
      minimumCommission: 1.5,
      maximumCommission: 60.0,
    });
  }

  /**
   * Process payment for a completed ride
   */
  async processRidePayment(
    request: RidePaymentRequest
  ): Promise<RidePaymentResult> {
    try {
      logger.info('Processing ride payment', {
        rideId: request.rideId,
        passengerId: request.passengerId,
        amount: request.fareBreakdown.total,
      });

      // Create payment request for the payment service
      const paymentRequest: any = {
        amount: request.fareBreakdown.total,
        currency: request.currency,
        description: `Ride payment for ride ${request.rideId}`,
        userId: request.passengerId,
        paymentMethodId: request.paymentMethodId,
        metadata: {
          rideId: request.rideId,
          driverId: request.driverId,
          fareBreakdown: request.fareBreakdown,
          ...request.metadata,
        },
        internalReference: `ride_${request.rideId}_${Date.now()}`,
        options: {
          captureMethod: 'automatic',
          confirmationMethod: 'automatic',
        },
      };

      // Process payment through payment service
      const paymentResponse =
        await paymentClient.processPayment(paymentRequest);

      // Calculate driver earnings
      const ride = await this.getRideById(request.rideId);
      const fareBreakdownWithCurrency = {
        ...request.fareBreakdown,
        currency: request.currency,
        fees: [], // Convert number to array for FareBreakdown compatibility
      };
      const driverEarnings = await this.calculateDriverEarnings(
        fareBreakdownWithCurrency as any,
        ride.vehicleType,
        request.driverId
      );

      // Store payment record in database
      await this.storePaymentRecord({
        rideId: request.rideId,
        transactionId: paymentResponse.id,
        passengerId: request.passengerId,
        driverId: request.driverId,
        amount: request.fareBreakdown.total,
        currency: request.currency,
        status: paymentResponse.status,
        driverEarnings,
        metadata: paymentResponse.metadata || {},
      });

      // Schedule driver payout if payment succeeded
      if (paymentResponse.status === 'succeeded') {
        await this.scheduleDriverPayout(request.driverId, driverEarnings);
      }

      logger.info('Ride payment processed successfully', {
        rideId: request.rideId,
        transactionId: paymentResponse.id,
        status: paymentResponse.status,
      });

      return {
        success: paymentResponse.status === 'succeeded',
        transactionId: paymentResponse.id,
        paymentId: paymentResponse.id,
        status: paymentResponse.status,
        amount: request.fareBreakdown.total,
        currency: request.currency,
        driverEarnings,
        processedAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to process ride payment', {
        error,
        rideId: request.rideId,
        passengerId: request.passengerId,
      });

      return {
        success: false,
        status: 'failed' as PaymentStatus,
        amount: request.fareBreakdown.total,
        currency: request.currency,
        error: (error as Error).message,
        processedAt: new Date(),
      };
    }
  }

  /**
   * Calculate driver earnings from fare breakdown
   */
  async calculateDriverEarnings(
    fareBreakdown: FareBreakdown,
    vehicleType: VehicleType,
    driverId: string
  ): Promise<DriverEarnings> {
    const commissionStructure = this.commissionStructures.get(vehicleType);
    if (!commissionStructure) {
      throw new Error(
        `No commission structure found for vehicle type: ${vehicleType}`
      );
    }

    const grossFare = fareBreakdown.total - fareBreakdown.taxes;

    // Calculate platform commission
    let platformCommission = grossFare * commissionStructure.baseCommissionRate;

    // Apply commission limits
    if (commissionStructure.minimumCommission) {
      platformCommission = Math.max(
        platformCommission,
        commissionStructure.minimumCommission
      );
    }
    if (commissionStructure.maximumCommission) {
      platformCommission = Math.min(
        platformCommission,
        commissionStructure.maximumCommission
      );
    }

    const netEarnings = grossFare - platformCommission;
    const tips = fareBreakdown.tips || 0;

    // Calculate bonuses
    const bonuses = await this.calculateDriverBonuses(
      driverId,
      fareBreakdown,
      vehicleType
    );

    const totalEarnings = netEarnings + tips + bonuses.total;

    return {
      grossFare,
      platformCommission,
      netEarnings,
      tips,
      bonuses: bonuses.total,
      totalEarnings,
      breakdown: {
        baseFareEarnings:
          fareBreakdown.baseFare * (1 - commissionStructure.baseCommissionRate),
        distanceEarnings:
          fareBreakdown.distanceFare *
          (1 - commissionStructure.baseCommissionRate),
        timeEarnings:
          fareBreakdown.timeFare * (1 - commissionStructure.baseCommissionRate),
        surgeEarnings:
          fareBreakdown.surgeFare *
          (1 - commissionStructure.baseCommissionRate),
        peakHourBonus: bonuses.peakHour,
        qualityBonus: bonuses.quality,
        referralBonus: bonuses.referral,
        completionBonus: bonuses.completion,
      },
    };
  }

  /**
   * Calculate driver bonuses
   */
  private async calculateDriverBonuses(
    driverId: string,
    fareBreakdown: FareBreakdown,
    vehicleType: VehicleType
  ): Promise<{
    peakHour: number;
    quality: number;
    referral: number;
    completion: number;
    total: number;
  }> {
    // Get driver metrics for bonus calculations
    const driverMetrics = await this.getDriverMetrics(driverId);

    let peakHourBonus = 0;
    let qualityBonus = 0;
    let referralBonus = 0;
    let completionBonus = 0;

    // Peak hour bonus (during high-demand periods)
    const currentHour = new Date().getHours();
    if (
      (currentHour >= 7 && currentHour <= 9) ||
      (currentHour >= 17 && currentHour <= 19)
    ) {
      peakHourBonus = fareBreakdown.total * 0.05; // 5% bonus during peak hours
    }

    // Quality bonus based on driver rating
    if (driverMetrics.averageRating >= 4.8) {
      qualityBonus = fareBreakdown.total * 0.03; // 3% bonus for high-rated drivers
    } else if (driverMetrics.averageRating >= 4.5) {
      qualityBonus = fareBreakdown.total * 0.01; // 1% bonus for good-rated drivers
    }

    // Completion bonus for completing multiple rides in a day
    const ridesCompletedToday = await this.getRidesCompletedToday(driverId);
    if (ridesCompletedToday >= 10) {
      completionBonus = 5.0; // $5 bonus for 10+ rides per day
    } else if (ridesCompletedToday >= 5) {
      completionBonus = 2.0; // $2 bonus for 5+ rides per day
    }

    const total =
      peakHourBonus + qualityBonus + referralBonus + completionBonus;

    return {
      peakHour: peakHourBonus,
      quality: qualityBonus,
      referral: referralBonus,
      completion: completionBonus,
      total,
    };
  }

  /**
   * Schedule driver payout
   */
  async scheduleDriverPayout(
    driverId: string,
    earnings: DriverEarnings
  ): Promise<void> {
    try {
      // Get driver payout preferences
      const driver = await prisma.driver.findUnique({
        where: { id: driverId },
        include: { preferences: true },
      });

      if (!driver) {
        throw new Error(`Driver not found: ${driverId}`);
      }

      // Check if driver has reached payout threshold
      const pendingEarnings = await this.getPendingEarnings(driverId);
      const totalPendingEarnings = pendingEarnings + earnings.totalEarnings;

      const payoutThreshold =
        driver.preferences?.paymentPreferences?.payoutThreshold || 100;
      const autoPayoutEnabled =
        driver.preferences?.paymentPreferences?.autoPayoutEnabled ?? true;

      if (autoPayoutEnabled && totalPendingEarnings >= payoutThreshold) {
        // Schedule immediate payout
        await this.createDriverPayout({
          driverId,
          amount: totalPendingEarnings,
          currency: 'USD', // Default currency
          payoutMethod: 'bank_transfer',
          scheduledAt: new Date(),
          metadata: {
            triggeredBy: 'threshold_reached',
            threshold: payoutThreshold,
          },
        });
      }

      // Store earnings record
      await this.storeDriverEarnings(driverId, earnings);

      logger.info('Driver payout scheduled', {
        driverId,
        earnings: earnings.totalEarnings,
        totalPending: totalPendingEarnings,
        threshold: payoutThreshold,
      });
    } catch (error) {
      logger.error('Failed to schedule driver payout', {
        error,
        driverId,
        earnings,
      });
      throw error;
    }
  }

  /**
   * Create driver payout
   */
  async createDriverPayout(request: PayoutRequest): Promise<DriverPayout> {
    try {
      const payout = await prisma.driverPayout.create({
        data: {
          driverId: request.driverId,
          amount: request.amount,
          currency: request.currency,
          status: 'pending',
          payoutMethod: request.payoutMethod,
          payoutMethodId: request.payoutMethodId,
          scheduledAt: request.scheduledAt || new Date(),
          metadata: request.metadata || {},
        },
      });

      logger.info('Driver payout created', {
        payoutId: payout.id,
        driverId: request.driverId,
        amount: request.amount,
      });

      return payout;
    } catch (error) {
      logger.error('Failed to create driver payout', { error, request });
      throw error;
    }
  }

  /**
   * Process driver payouts
   */
  async processDriverPayouts(): Promise<void> {
    try {
      // Get pending payouts
      const pendingPayouts = await prisma.driverPayout.findMany({
        where: {
          status: 'pending',
          scheduledAt: {
            lte: new Date(),
          },
        },
        include: {
          driver: true,
        },
      });

      logger.info('Processing driver payouts', {
        count: pendingPayouts.length,
      });

      for (const payout of pendingPayouts) {
        try {
          await this.processSinglePayout(payout);
        } catch (error) {
          logger.error('Failed to process individual payout', {
            error,
            payoutId: payout.id,
            driverId: payout.driverId,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to process driver payouts', { error });
      throw error;
    }
  }

  /**
   * Refund ride payment
   */
  async refundRidePayment(
    rideId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    try {
      // Get payment record
      const paymentRecord = await prisma.ridePayment.findUnique({
        where: { rideId },
      });

      if (!paymentRecord) {
        throw new Error(`Payment record not found for ride: ${rideId}`);
      }

      // Process refund through payment service
      const refund = await paymentClient.refundPayment(
        paymentRecord.transactionId,
        amount,
        reason
      );

      // Update payment record
      await prisma.ridePayment.update({
        where: { rideId },
        data: {
          status:
            amount && amount < paymentRecord.amount
              ? 'partially_refunded'
              : 'refunded',
          refundedAmount:
            (paymentRecord.refundedAmount || 0) +
            (amount || paymentRecord.amount),
          updatedAt: new Date(),
        },
      });

      logger.info('Ride payment refunded', {
        rideId,
        refundId: refund.id,
        amount: amount || paymentRecord.amount,
      });

      return refund;
    } catch (error) {
      logger.error('Failed to refund ride payment', {
        error,
        rideId,
        amount,
        reason,
      });
      throw error;
    }
  }

  /**
   * Get payment transaction
   */
  async getPaymentTransaction(transactionId: string): Promise<Transaction> {
    return paymentClient.getTransaction(transactionId);
  }

  /**
   * Get driver earnings summary
   */
  async getDriverEarningsSummary(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalEarnings: number;
    totalRides: number;
    averageEarningsPerRide: number;
    totalCommission: number;
    totalTips: number;
    totalBonuses: number;
    breakdown: any;
  }> {
    const earnings = await prisma.driverEarnings.findMany({
      where: {
        driverId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalEarnings = earnings.reduce(
      (sum: number, e: any) => sum + e.totalEarnings,
      0
    );
    const totalRides = earnings.length;
    const averageEarningsPerRide =
      totalRides > 0 ? totalEarnings / totalRides : 0;
    const totalCommission = earnings.reduce(
      (sum: number, e: any) => sum + e.platformCommission,
      0
    );
    const totalTips = earnings.reduce((sum: number, e: any) => sum + e.tips, 0);
    const totalBonuses = earnings.reduce(
      (sum: number, e: any) => sum + e.bonuses,
      0
    );

    return {
      totalEarnings,
      totalRides,
      averageEarningsPerRide,
      totalCommission,
      totalTips,
      totalBonuses,
      breakdown: earnings,
    };
  }

  // Private helper methods
  private async getRideById(rideId: string): Promise<Ride> {
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      throw new Error(`Ride not found: ${rideId}`);
    }

    return ride as Ride;
  }

  private async storePaymentRecord(data: {
    rideId: string;
    transactionId: string;
    passengerId: string;
    driverId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    driverEarnings: DriverEarnings;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await prisma.ridePayment.create({
      data: {
        rideId: data.rideId,
        transactionId: data.transactionId,
        passengerId: data.passengerId,
        driverId: data.driverId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        driverEarnings: data.driverEarnings as any,
        metadata: data.metadata || {},
      },
    });
  }

  private async storeDriverEarnings(
    driverId: string,
    earnings: DriverEarnings
  ): Promise<void> {
    await prisma.driverEarnings.create({
      data: {
        driverId,
        grossFare: earnings.grossFare,
        platformCommission: earnings.platformCommission,
        netEarnings: earnings.netEarnings,
        tips: earnings.tips,
        bonuses: earnings.bonuses,
        totalEarnings: earnings.totalEarnings,
        breakdown: earnings.breakdown as any,
      },
    });
  }

  private async getDriverMetrics(driverId: string): Promise<{
    averageRating: number;
    totalRides: number;
    acceptanceRate: number;
  }> {
    // This would typically come from the driver service or database
    // For now, return mock data
    return {
      averageRating: 4.7,
      totalRides: 150,
      acceptanceRate: 0.85,
    };
  }

  private async getRidesCompletedToday(driverId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await prisma.ride.count({
      where: {
        driverId,
        status: 'completed',
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return count;
  }

  private async getPendingEarnings(driverId: string): Promise<number> {
    const result = await prisma.driverEarnings.aggregate({
      where: {
        driverId,
        payoutStatus: 'pending',
      },
      _sum: {
        totalEarnings: true,
      },
    });

    return result._sum.totalEarnings || 0;
  }

  private async processSinglePayout(payout: any): Promise<void> {
    try {
      // Update status to processing
      await prisma.driverPayout.update({
        where: { id: payout.id },
        data: {
          status: 'processing',
          processedAt: new Date(),
        },
      });

      // In a real implementation, this would integrate with a payout provider
      // For now, we'll simulate successful payout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update status to completed
      await prisma.driverPayout.update({
        where: { id: payout.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      // Mark earnings as paid out
      await prisma.driverEarnings.updateMany({
        where: {
          driverId: payout.driverId,
          payoutStatus: 'pending',
        },
        data: {
          payoutStatus: 'completed',
          payoutId: payout.id,
        },
      });

      logger.info('Payout processed successfully', {
        payoutId: payout.id,
        driverId: payout.driverId,
        amount: payout.amount,
      });
    } catch (error) {
      // Update status to failed
      await prisma.driverPayout.update({
        where: { id: payout.id },
        data: {
          status: 'failed',
          failureReason: (error as Error).message,
        },
      });

      throw error;
    }
  }
}
