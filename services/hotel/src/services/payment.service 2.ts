/**
 * Payment Service for Hotel Booking System
 * Handles payment processing, deposits, refunds, and payment schedules
 * Integrates with the existing payment service
 */

import { PaymentServiceClient } from '../clients/payment.client';
import { ValidationResult } from '../types';
import { Booking } from '../types/booking.types';
import {
  DepositCalculation,
  DepositManager,
  DepositRequest,
  DepositType,
  PaymentMethodType,
  PaymentProcessor,
  PaymentRequest,
  PaymentResult,
  PaymentSchedule,
  PaymentScheduleStatus,
  PaymentScheduleType,
  PaymentServiceConfig,
  PaymentStatus,
  PaymentTransaction,
  PaymentType,
  RefundProcessor,
  RefundRequest,
  RefundResult,
  RefundValidation,
  ScheduledPayment,
} from '../types/payment.types';

export class PaymentService
  implements PaymentProcessor, DepositManager, RefundProcessor
{
  private config: PaymentServiceConfig;
  private paymentClient: PaymentServiceClient;

  constructor(config: PaymentServiceConfig) {
    this.config = config;
    this.paymentClient = new PaymentServiceClient();
  }

  // Payment Processing Methods
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Validate payment request
      const validation = await this.validatePaymentRequest(request);
      if (!validation.isValid) {
        throw new Error(
          `Payment validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      // Process payment through payment service
      const result = await this.paymentClient.processPayment(request);

      // Store transaction record locally for hotel service tracking
      await this.createLocalPaymentRecord(request, result);

      return result;
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        id: this.generateTransactionId(),
        status: PaymentStatus.FAILED,
        amount: request.amount,
        currency: request.currency,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date(),
      };
    }
  }

  async authorizePayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const result = await this.paymentClient.authorizePayment(request);
      await this.createLocalPaymentRecord(request, result);
      return result;
    } catch (error) {
      console.error('Payment authorization failed:', error);
      throw error;
    }
  }

  async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<PaymentResult> {
    try {
      const result = await this.paymentClient.capturePayment(paymentId, amount);
      await this.updateLocalPaymentRecord(paymentId, {
        status: PaymentStatus.CAPTURED,
      });
      return result;
    } catch (error) {
      console.error('Payment capture failed:', error);
      throw error;
    }
  }

  async voidPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const result = await this.paymentClient.voidPayment(paymentId);
      await this.updateLocalPaymentRecord(paymentId, {
        status: PaymentStatus.CANCELLED,
      });
      return result;
    } catch (error) {
      console.error('Payment void failed:', error);
      throw error;
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResult> {
    try {
      // Validate refund eligibility
      const validation = await this.validateRefundEligibility(
        request.paymentId,
        request.amount
      );
      if (!validation.isEligible) {
        throw new Error(
          `Refund not eligible: ${validation.restrictions.join(', ')}`
        );
      }

      const result = await this.paymentClient.refundPayment(request);
      await this.createLocalRefundRecord(request, result);

      return result;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    try {
      return await this.paymentClient.getPaymentStatus(paymentId);
    } catch (error) {
      console.error('Get payment status failed:', error);
      throw error;
    }
  }

  // Deposit Management Methods
  async calculateDeposit(
    booking: Booking,
    depositType: DepositType,
    value?: number
  ): Promise<DepositCalculation> {
    const totalAmount = booking.totalAmount;
    let depositAmount = 0;
    let description = '';

    switch (depositType) {
      case DepositType.FIXED_AMOUNT:
        depositAmount = value || this.config.depositSettings.minimumAmount;
        description = `Fixed deposit of ${depositAmount} ${booking.currency}`;
        break;

      case DepositType.PERCENTAGE:
        const percentage =
          value || this.config.depositSettings.defaultPercentage;
        depositAmount = (totalAmount * percentage) / 100;
        description = `${percentage}% deposit of total booking amount`;
        break;

      case DepositType.FIRST_NIGHT:
        depositAmount = this.calculateFirstNightCost(booking);
        description = 'First night deposit';
        break;

      case DepositType.FULL_AMOUNT:
        depositAmount = totalAmount;
        description = 'Full payment required';
        break;

      case DepositType.NO_DEPOSIT:
        depositAmount = 0;
        description = 'No deposit required';
        break;
    }

    // Apply minimum and maximum limits (except for no deposit)
    if (depositType !== DepositType.NO_DEPOSIT) {
      depositAmount = Math.max(
        depositAmount,
        this.config.depositSettings.minimumAmount
      );
      depositAmount = Math.min(
        depositAmount,
        this.config.depositSettings.maximumAmount
      );
    }

    const dueDate = new Date();
    dueDate.setDate(
      dueDate.getDate() + this.config.depositSettings.dueDateOffset
    );

    return {
      amount: depositAmount,
      currency: booking.currency,
      dueDate,
      type: depositType,
      description,
      breakdown: this.calculateDepositBreakdown(depositAmount, booking),
    };
  }

  async processDeposit(request: DepositRequest): Promise<PaymentResult> {
    try {
      // Calculate deposit amount if not provided
      let depositAmount = request.amount;
      if (!depositAmount) {
        const booking = await this.getBooking(request.bookingId);
        const calculation = await this.calculateDeposit(
          booking,
          request.depositType,
          request.percentage
        );
        depositAmount = calculation.amount;
      }

      // Create payment request for deposit
      const paymentRequest: PaymentRequest = {
        bookingId: request.bookingId,
        amount: depositAmount,
        currency: 'USD', // Should be derived from booking
        paymentMethod: request.paymentMethod,
        description: request.description || 'Booking deposit',
        metadata: { type: 'deposit', depositType: request.depositType },
      };

      return await this.processPayment(paymentRequest);
    } catch (error) {
      console.error('Deposit processing failed:', error);
      throw error;
    }
  }

  async createPaymentSchedule(
    booking: Booking,
    scheduleType: PaymentScheduleType
  ): Promise<PaymentSchedule> {
    const schedule: PaymentSchedule = {
      id: this.generateScheduleId(),
      bookingId: booking.id,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      payments: [],
      status: PaymentScheduleStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (scheduleType) {
      case PaymentScheduleType.DEPOSIT_ONLY:
        schedule.payments = await this.createDepositOnlySchedule(booking);
        break;

      case PaymentScheduleType.DEPOSIT_AND_BALANCE:
        schedule.payments = await this.createDepositAndBalanceSchedule(booking);
        break;

      case PaymentScheduleType.INSTALLMENTS:
        schedule.payments = await this.createInstallmentSchedule(booking);
        break;

      case PaymentScheduleType.FULL_UPFRONT:
        schedule.payments = await this.createFullUpfrontSchedule(booking);
        break;

      case PaymentScheduleType.PAY_AT_PROPERTY:
        schedule.payments = await this.createPayAtPropertySchedule(booking);
        break;
    }

    // Save payment schedule to database
    await this.savePaymentSchedule(schedule);

    return schedule;
  }

  async processScheduledPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const scheduledPayment = await this.getScheduledPayment(paymentId);
      if (!scheduledPayment) {
        throw new Error('Scheduled payment not found');
      }

      // Get booking and payment method
      const booking = await this.getBooking(scheduledPayment.scheduleId);
      const paymentMethods = await this.paymentClient.getUserPaymentMethods(
        booking.guestId
      );

      if (!paymentMethods.length) {
        throw new Error('No payment method found for user');
      }

      const paymentRequest: PaymentRequest = {
        bookingId: booking.id,
        amount: scheduledPayment.amount,
        currency: booking.currency,
        paymentMethod: {
          type: PaymentMethodType.CREDIT_CARD, // Default to credit card
        },
        description: scheduledPayment.description || 'Scheduled payment',
        metadata: { scheduledPaymentId: paymentId },
      };

      const result = await this.processPayment(paymentRequest);

      // Update scheduled payment status
      await this.updateScheduledPayment(paymentId, {
        status: result.status,
        paymentResult: result,
        processedAt: new Date(),
      });

      return result;
    } catch (error) {
      console.error('Scheduled payment processing failed:', error);
      throw error;
    }
  }

  async updatePaymentSchedule(
    scheduleId: string,
    updates: Partial<PaymentSchedule>
  ): Promise<PaymentSchedule> {
    try {
      const existingSchedule = await this.getPaymentSchedule(scheduleId);
      if (!existingSchedule) {
        throw new Error('Payment schedule not found');
      }

      const updatedSchedule = {
        ...existingSchedule,
        ...updates,
        updatedAt: new Date(),
      };

      await this.savePaymentSchedule(updatedSchedule);
      return updatedSchedule;
    } catch (error) {
      console.error('Payment schedule update failed:', error);
      throw error;
    }
  }

  // Refund Processing Methods
  async calculateRefund(
    booking: Booking,
    cancellationPolicy: any
  ): Promise<any> {
    const totalAmount = booking.totalAmount;
    const hoursUntilCheckIn = this.calculateHoursUntilCheckIn(
      booking.checkInDate
    );

    // Apply cancellation policy
    let refundPercentage = 100;
    let cancellationFee = 0;

    if (hoursUntilCheckIn < cancellationPolicy.hoursBeforeCheckIn) {
      refundPercentage = cancellationPolicy.refundPercentage;

      if (cancellationPolicy.penaltyType === 'percentage') {
        cancellationFee = (totalAmount * cancellationPolicy.penaltyValue) / 100;
      } else if (cancellationPolicy.penaltyType === 'fixed_amount') {
        cancellationFee = cancellationPolicy.penaltyValue;
      }
    }

    const refundableAmount =
      (totalAmount * refundPercentage) / 100 - cancellationFee;

    return {
      originalAmount: totalAmount,
      refundableAmount: Math.max(0, refundableAmount),
      cancellationFee,
      penaltyAmount: cancellationFee,
      refundPercentage,
      hoursUntilCheckIn,
      policyApplied: cancellationPolicy,
      breakdown: [
        {
          description: 'Original booking amount',
          amount: totalAmount,
          type: 'refund',
        },
        {
          description: 'Cancellation fee',
          amount: -cancellationFee,
          type: 'fee',
        },
      ],
    };
  }

  async getRefundStatus(refundId: string): Promise<RefundResult> {
    try {
      return await this.paymentClient.getRefundStatus(refundId);
    } catch (error) {
      console.error('Get refund status failed:', error);
      throw error;
    }
  }

  async validateRefundEligibility(
    paymentId: string,
    amount: number
  ): Promise<RefundValidation> {
    try {
      // Get payment status from payment service
      const payment = await this.paymentClient.getPaymentStatus(paymentId);

      const restrictions: string[] = [];
      let maxRefundAmount = payment.amount;

      // Check if payment is in a refundable state
      if (
        ![PaymentStatus.CAPTURED, PaymentStatus.SUCCEEDED].includes(
          payment.status
        )
      ) {
        restrictions.push(
          'Payment must be captured or succeeded to be refunded'
        );
      }

      // Check refund amount limits
      if (amount > maxRefundAmount) {
        restrictions.push(`Refund amount cannot exceed ${maxRefundAmount}`);
      }

      if (amount < this.config.refundSettings.minimumRefundAmount) {
        restrictions.push(
          `Refund amount must be at least ${this.config.refundSettings.minimumRefundAmount}`
        );
      }

      // Calculate refund fees
      const refundFee =
        (amount * this.config.refundSettings.refundFeePercentage) / 100;

      return {
        isEligible: restrictions.length === 0,
        maxRefundAmount,
        restrictions,
        processingTime: `${this.config.refundSettings.processingTime} business days`,
        fees:
          refundFee > 0
            ? [
                {
                  type: 'processing_fee',
                  amount: refundFee,
                  description: 'Refund processing fee',
                },
              ]
            : [],
      };
    } catch (error) {
      console.error('Refund eligibility validation failed:', error);
      return {
        isEligible: false,
        maxRefundAmount: 0,
        restrictions: ['Error validating refund eligibility'],
        processingTime: '0 days',
        fees: [],
      };
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResult> {
    try {
      // Validate refund eligibility
      const validation = await this.validateRefundEligibility(
        request.paymentId,
        request.amount
      );

      if (!validation.isEligible) {
        throw new Error(
          `Refund not eligible: ${validation.restrictions.join(', ')}`
        );
      }

      const result = await this.paymentClient.refundPayment(request);
      await this.createLocalRefundRecord(request, result);
      return result;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  // Private helper methods
  private async validatePaymentRequest(
    request: PaymentRequest
  ): Promise<ValidationResult> {
    const errors: any[] = [];

    if (!request.bookingId) {
      errors.push({
        field: 'bookingId',
        message: 'Booking ID is required',
        code: 'REQUIRED',
      });
    }

    if (!request.amount || request.amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'Amount must be greater than 0',
        code: 'INVALID_AMOUNT',
      });
    }

    if (!request.currency) {
      errors.push({
        field: 'currency',
        message: 'Currency is required',
        code: 'REQUIRED',
      });
    }

    if (!request.paymentMethod) {
      errors.push({
        field: 'paymentMethod',
        message: 'Payment method is required',
        code: 'REQUIRED',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private calculateFirstNightCost(booking: Booking): number {
    return booking.totalAmount / booking.nights;
  }

  private calculateDepositBreakdown(amount: number, booking: Booking): any[] {
    return [
      {
        description: 'Deposit amount',
        amount: amount,
        type: 'base',
      },
    ];
  }

  private calculateHoursUntilCheckIn(checkInDate: Date): number {
    const now = new Date();
    const diffMs = checkInDate.getTime() - now.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateScheduleId(): string {
    return `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Local database operations for hotel service tracking
  private async createLocalPaymentRecord(
    request: PaymentRequest,
    result: PaymentResult
  ): Promise<void> {
    // Store payment record in hotel service database for tracking
    // This would integrate with the hotel service's database
    console.log('Creating local payment record:', { request, result });
  }

  private async updateLocalPaymentRecord(
    paymentId: string,
    updates: Partial<PaymentTransaction>
  ): Promise<void> {
    // Update payment record in hotel service database
    console.log('Updating local payment record:', { paymentId, updates });
  }

  private async createLocalRefundRecord(
    request: RefundRequest,
    result: RefundResult
  ): Promise<void> {
    // Store refund record in hotel service database for tracking
    console.log('Creating local refund record:', { request, result });
  }

  // Mock database operations - in real implementation, these would interact with actual database
  private async getBooking(bookingId: string): Promise<Booking> {
    // Mock implementation - would query booking service
    throw new Error(
      'Method not implemented - should integrate with booking service'
    );
  }

  private async savePaymentSchedule(schedule: PaymentSchedule): Promise<void> {
    // Mock implementation - would save to database
    console.log('Saving payment schedule:', schedule);
  }

  private async getPaymentSchedule(
    scheduleId: string
  ): Promise<PaymentSchedule | null> {
    // Mock implementation - would query database
    return null;
  }

  private async getScheduledPayment(
    paymentId: string
  ): Promise<ScheduledPayment | null> {
    // Mock implementation - would query database
    return null;
  }

  private async updateScheduledPayment(
    paymentId: string,
    updates: Partial<ScheduledPayment>
  ): Promise<void> {
    // Mock implementation - would update database
    console.log('Updating scheduled payment:', { paymentId, updates });
  }

  private async createDepositOnlySchedule(
    booking: Booking
  ): Promise<ScheduledPayment[]> {
    const depositCalculation = await this.calculateDeposit(
      booking,
      DepositType.PERCENTAGE,
      30
    );

    return [
      {
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: depositCalculation.amount,
        dueDate: depositCalculation.dueDate,
        type: PaymentType.DEPOSIT,
        status: PaymentStatus.PENDING,
        description: 'Booking deposit (30%)',
      },
    ];
  }

  private async createDepositAndBalanceSchedule(
    booking: Booking
  ): Promise<ScheduledPayment[]> {
    const depositCalculation = await this.calculateDeposit(
      booking,
      DepositType.PERCENTAGE,
      30
    );
    const balanceAmount = booking.totalAmount - depositCalculation.amount;

    const balanceDueDate = new Date(booking.checkInDate);
    balanceDueDate.setDate(balanceDueDate.getDate() - 7); // 7 days before check-in

    return [
      {
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: depositCalculation.amount,
        dueDate: depositCalculation.dueDate,
        type: PaymentType.DEPOSIT,
        status: PaymentStatus.PENDING,
        description: 'Booking deposit (30%)',
      },
      {
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: balanceAmount,
        dueDate: balanceDueDate,
        type: PaymentType.BALANCE,
        status: PaymentStatus.PENDING,
        description: 'Remaining balance',
      },
    ];
  }

  private async createInstallmentSchedule(
    booking: Booking
  ): Promise<ScheduledPayment[]> {
    const installmentCount = 3;
    const installmentAmount = booking.totalAmount / installmentCount;
    const payments: ScheduledPayment[] = [];

    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      payments.push({
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: installmentAmount,
        dueDate,
        type: PaymentType.INSTALLMENT,
        status: PaymentStatus.PENDING,
        description: `Installment ${i + 1} of ${installmentCount}`,
      });
    }

    return payments;
  }

  private async createFullUpfrontSchedule(
    booking: Booking
  ): Promise<ScheduledPayment[]> {
    return [
      {
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: booking.totalAmount,
        dueDate: new Date(),
        type: PaymentType.DEPOSIT,
        status: PaymentStatus.PENDING,
        description: 'Full payment',
      },
    ];
  }

  private async createPayAtPropertySchedule(
    booking: Booking
  ): Promise<ScheduledPayment[]> {
    return [
      {
        id: this.generateTransactionId(),
        scheduleId: '',
        amount: booking.totalAmount,
        dueDate: booking.checkInDate,
        type: PaymentType.BALANCE,
        status: PaymentStatus.PENDING,
        description: 'Pay at property',
      },
    ];
  }
}
