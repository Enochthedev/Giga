import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { PaymentService } from '../services/payment.service';
import {
  PaymentWebhookEvent,
  RidePaymentRequest,
} from '../types/payment.types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Process payment for a ride
   */
  processRidePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rideId } = req.params;
      const paymentRequest: RidePaymentRequest = req.body;

      // Validate request
      if (
        !paymentRequest.passengerId ||
        !paymentRequest.driverId ||
        !paymentRequest.fareBreakdown
      ) {
        res.status(400).json({
          success: false,
          error: 'Missing required payment information',
        });
        return;
      }

      // Set rideId from params
      paymentRequest.rideId = rideId!;

      const result =
        await this.paymentService.processRidePayment(paymentRequest);

      res.status(result.success ? 200 : 400).json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      logger.error('Failed to process ride payment', {
        error,
        rideId: req.params.rideId,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * Refund ride payment
   */
  refundRidePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rideId } = req.params;
      const { amount, reason } = req.body;

      const refund = await this.paymentService.refundRidePayment(
        rideId!,
        amount,
        reason
      );

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error: any) {
      logger.error('Failed to refund ride payment', {
        error,
        rideId: req.params.rideId,
      });
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };

  /**
   * Get payment transaction details
   */
  getPaymentTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { transactionId } = req.params;

      const transaction = await this.paymentService.getPaymentTransaction(
        transactionId!
      );

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error: any) {
      logger.error('Failed to get payment transaction', {
        error,
        transactionId: req.params.transactionId,
      });
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };

  /**
   * Get driver earnings summary
   */
  getDriverEarningsSummary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { driverId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
        });
        return;
      }

      const summary = await this.paymentService.getDriverEarningsSummary(
        driverId!,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      logger.error('Failed to get driver earnings summary', {
        error,
        driverId: req.params.driverId,
      });
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };

  /**
   * Create driver payout
   */
  createDriverPayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { driverId } = req.params;
      const payoutRequest = {
        ...req.body,
        driverId: driverId!,
      };

      const payout =
        await this.paymentService.createDriverPayout(payoutRequest);

      res.status(201).json({
        success: true,
        data: payout,
      });
    } catch (error: any) {
      logger.error('Failed to create driver payout', {
        error,
        driverId: req.params.driverId,
      });
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };

  /**
   * Process driver payouts (batch operation)
   */
  processDriverPayouts = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.paymentService.processDriverPayouts();

      res.status(200).json({
        success: true,
        message: 'Driver payouts processed successfully',
      });
    } catch (error: any) {
      logger.error('Failed to process driver payouts', { error });
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  };

  /**
   * Handle payment webhooks from payment service
   */
  handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const event: PaymentWebhookEvent = req.body;

      logger.info('Received payment webhook', {
        eventId: event.id,
        eventType: event.type,
      });

      // Handle different webhook event types
      switch (event.type) {
        case 'payment.succeeded':
          await this.handlePaymentSucceeded(event);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event);
          break;
        case 'payment.refunded':
          await this.handlePaymentRefunded(event);
          break;
        case 'payout.completed':
          await this.handlePayoutCompleted(event);
          break;
        case 'payout.failed':
          await this.handlePayoutFailed(event);
          break;
        default:
          logger.warn('Unhandled webhook event type', {
            eventType: event.type,
          });
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error('Failed to handle payment webhook', {
        error,
        event: req.body,
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  // Private webhook handlers
  private async handlePaymentSucceeded(
    event: PaymentWebhookEvent
  ): Promise<void> {
    const transaction = event.data.object;
    logger.info('Payment succeeded webhook', { transactionId: transaction.id });

    // Update ride status or trigger any post-payment actions
    // This would typically update the ride status to completed
  }

  private async handlePaymentFailed(event: PaymentWebhookEvent): Promise<void> {
    const transaction = event.data.object;
    logger.info('Payment failed webhook', { transactionId: transaction.id });

    // Handle payment failure - might need to cancel the ride or retry payment
  }

  private async handlePaymentRefunded(
    event: PaymentWebhookEvent
  ): Promise<void> {
    const refund = event.data.object;
    logger.info('Payment refunded webhook', { refundId: refund.id });

    // Handle refund completion - update ride status, notify parties
  }

  private async handlePayoutCompleted(
    event: PaymentWebhookEvent
  ): Promise<void> {
    const payout = event.data.object;
    logger.info('Payout completed webhook', { payoutId: payout.id });

    // Update payout status in database
  }

  private async handlePayoutFailed(event: PaymentWebhookEvent): Promise<void> {
    const payout = event.data.object;
    logger.info('Payout failed webhook', { payoutId: payout.id });

    // Handle payout failure - update status, notify driver
  }
}
