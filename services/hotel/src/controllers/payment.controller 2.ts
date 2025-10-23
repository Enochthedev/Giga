/**
 * Payment Controller for Hotel Service
 * Handles HTTP requests for payment processing, deposits, and refunds
 */

import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { ApiResponse } from '../types';
import {
  DepositRequest,
  DepositType,
  PaymentGatewayType,
  PaymentRequest,
  PaymentScheduleType,
  PaymentServiceConfig,
  RefundReason,
  RefundRequest,
} from '../types/payment.types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    // Initialize payment service with configuration
    const config: PaymentServiceConfig = this.getPaymentServiceConfig();
    this.paymentService = new PaymentService(config);
  }

  /**
   * Process a payment for a booking
   */
  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentRequest: PaymentRequest = {
        bookingId: req.body.bookingId,
        amount: req.body.amount,
        currency: req.body.currency,
        paymentMethod: req.body.paymentMethod,
        description: req.body.description,
        metadata: req.body.metadata,
        idempotencyKey: req.body.idempotencyKey,
      };

      const result = await this.paymentService.processPayment(paymentRequest);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Payment processed successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Payment processing error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_PROCESSING_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Payment processing failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Authorize a payment (without capturing)
   */
  async authorizePayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentRequest: PaymentRequest = {
        bookingId: req.body.bookingId,
        amount: req.body.amount,
        currency: req.body.currency,
        paymentMethod: req.body.paymentMethod,
        description: req.body.description,
        metadata: req.body.metadata,
      };

      const result = await this.paymentService.authorizePayment(paymentRequest);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Payment authorized successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Payment authorization error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_AUTHORIZATION_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Payment authorization failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Capture a previously authorized payment
   */
  async capturePayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;

      const result = await this.paymentService.capturePayment(
        paymentId,
        amount
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Payment captured successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Payment capture error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_CAPTURE_ERROR',
          message:
            error instanceof Error ? error.message : 'Payment capture failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Void a payment
   */
  async voidPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;

      const result = await this.paymentService.voidPayment(paymentId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Payment voided successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Payment void error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_VOID_ERROR',
          message:
            error instanceof Error ? error.message : 'Payment void failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;

      const result = await this.paymentService.getPaymentStatus(paymentId);

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get payment status error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_STATUS_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get payment status',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(404).json(response);
    }
  }

  /**
   * Calculate deposit amount for a booking
   */
  async calculateDeposit(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const { depositType, value } = req.body;

      // In a real implementation, you would fetch the booking from the booking service
      const booking = await this.getBookingFromService(bookingId);

      const result = await this.paymentService.calculateDeposit(
        booking,
        depositType as DepositType,
        value
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Deposit calculation error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DEPOSIT_CALCULATION_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Deposit calculation failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Process a deposit payment
   */
  async processDeposit(req: Request, res: Response): Promise<void> {
    try {
      const depositRequest: DepositRequest = {
        bookingId: req.body.bookingId,
        depositType: req.body.depositType,
        amount: req.body.amount,
        percentage: req.body.percentage,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        paymentMethod: req.body.paymentMethod,
        description: req.body.description,
      };

      const result = await this.paymentService.processDeposit(depositRequest);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Deposit processed successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Deposit processing error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'DEPOSIT_PROCESSING_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Deposit processing failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Create a payment schedule for a booking
   */
  async createPaymentSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const { scheduleType } = req.body;

      // In a real implementation, you would fetch the booking from the booking service
      const booking = await this.getBookingFromService(bookingId);

      const result = await this.paymentService.createPaymentSchedule(
        booking,
        scheduleType as PaymentScheduleType
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Payment schedule created successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Payment schedule creation error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PAYMENT_SCHEDULE_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Payment schedule creation failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Process a scheduled payment
   */
  async processScheduledPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;

      const result =
        await this.paymentService.processScheduledPayment(paymentId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Scheduled payment processed successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Scheduled payment processing error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'SCHEDULED_PAYMENT_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Scheduled payment processing failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Calculate refund amount for a booking cancellation
   */
  async calculateRefund(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      // In a real implementation, you would fetch the booking and cancellation policy
      const booking = await this.getBookingFromService(bookingId);
      const cancellationPolicy = await this.getCancellationPolicy(
        booking.propertyId
      );

      const result = await this.paymentService.calculateRefund(
        booking,
        cancellationPolicy
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Refund calculation error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REFUND_CALCULATION_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Refund calculation failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Process a refund
   */
  async processRefund(req: Request, res: Response): Promise<void> {
    try {
      const refundRequest: RefundRequest = {
        paymentId: req.body.paymentId,
        bookingId: req.body.bookingId,
        amount: req.body.amount,
        reason: req.body.reason as RefundReason,
        description: req.body.description,
        metadata: req.body.metadata,
      };

      const result = await this.paymentService.refundPayment(refundRequest);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Refund processed successfully',
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Refund processing error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REFUND_PROCESSING_ERROR',
          message:
            error instanceof Error ? error.message : 'Refund processing failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Get refund status
   */
  async getRefundStatus(req: Request, res: Response): Promise<void> {
    try {
      const { refundId } = req.params;

      const result = await this.paymentService.getRefundStatus(refundId);

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get refund status error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REFUND_STATUS_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get refund status',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(404).json(response);
    }
  }

  /**
   * Validate refund eligibility
   */
  async validateRefundEligibility(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const { amount } = req.query;

      const result = await this.paymentService.validateRefundEligibility(
        paymentId,
        parseFloat(amount as string)
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Refund eligibility validation error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REFUND_VALIDATION_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Refund eligibility validation failed',
        },
        timestamp: new Date(),
        requestId: req.headers['x-request-id'] as string,
      };

      res.status(400).json(response);
    }
  }

  // Private helper methods
  private getPaymentServiceConfig(): PaymentServiceConfig {
    return {
      defaultGateway: PaymentGatewayType.STRIPE,
      gateways: [
        {
          id: 'stripe-main',
          name: 'Stripe',
          type: PaymentGatewayType.STRIPE,
          isActive: true,
          supportedMethods: [
            'credit_card',
            'debit_card',
            'apple_pay',
            'google_pay',
          ] as any[],
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
          configuration: {
            apiKey: process.env.STRIPE_API_KEY || 'pk_test_mock',
            secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            environment: (process.env.NODE_ENV === 'production'
              ? 'production'
              : 'sandbox') as 'sandbox' | 'production',
          },
        },
      ],
      depositSettings: {
        defaultType: DepositType.PERCENTAGE,
        defaultPercentage: 30,
        minimumAmount: 50,
        maximumAmount: 10000,
        dueDateOffset: 1, // 1 day from booking
      },
      refundSettings: {
        automaticRefunds: true,
        maxRefundAmount: 50000,
        processingTime: 5, // 5 business days
        refundFeePercentage: 2.5,
        minimumRefundAmount: 10,
      },
      securitySettings: {
        enableFraudDetection: true,
        maxDailyAmount: 100000,
        maxTransactionAmount: 25000,
        requireCvv: true,
        require3DS: true,
        enableTokenization: true,
      },
    };
  }

  private async getBookingFromService(bookingId: string): Promise<any> {
    // Mock implementation - in real scenario, this would call the booking service
    return {
      id: bookingId,
      confirmationNumber: 'HTL123456',
      propertyId: 'prop_123',
      totalAmount: 500,
      currency: 'USD',
      nights: 2,
      checkInDate: new Date('2024-12-01'),
      checkOutDate: new Date('2024-12-03'),
      status: 'confirmed',
    };
  }

  private async getCancellationPolicy(propertyId: string): Promise<any> {
    // Mock implementation - in real scenario, this would fetch the cancellation policy
    return {
      id: 'policy_123',
      name: 'Moderate Cancellation',
      refundPercentage: 80,
      hoursBeforeCheckIn: 48,
      penaltyType: 'percentage',
      penaltyValue: 20,
    };
  }
}
