import { UserProfile } from '@platform/supabase-client';
import { Request, Response } from 'express';
import { z } from 'zod';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { SessionData } from '../services/session.service';

// Extend Request interface for user and session properties
interface SessionRequest extends Request {
  user?: UserProfile;
  session?: SessionData;
  sessionId?: string;
}

// Request validation schemas
const CheckoutSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    address: z.string().min(5).max(200),
    city: z.string().min(2).max(50),
    country: z.string().min(2).max(50),
    phone: z.string().optional(),
  }),
  paymentMethodId: z.string().min(1),
  notes: z.string().optional(),
});

const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export class CheckoutController {
  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private paymentServiceClient: HttpPaymentServiceClient
  ) {}

  /**
   * POST /api/v1/checkout/initiate - Initiate checkout process
   */
  async initiateCheckout(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customer identification
      const customerId = this.getCustomerId(req);
      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer identification required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = CheckoutSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid checkout data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const checkoutData = validationResult.data;

      // Initiate checkout process
      const checkout = await this.checkoutService.initiateCheckout(
        customerId,
        checkoutData,
        {
          userInfo: req.user,
          sessionId: req.sessionId,
          isAuthenticated: !!req.user,
        }
      );

      res.json({
        success: true,
        data: { checkout },
        message: 'Checkout initiated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Initiate checkout error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initiate checkout';
      const statusCode =
        errorMessage.includes('Cart is empty') ||
        errorMessage.includes('validation failed') ||
        errorMessage.includes('insufficient stock')
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/checkout/confirm-payment - Confirm payment and complete order
   */
  async confirmPayment(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customer identification
      const customerId = this.getCustomerId(req);
      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer identification required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = ConfirmPaymentSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid payment confirmation data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { paymentIntentId } = validationResult.data;

      // Confirm payment and complete order
      const result = await this.checkoutService.confirmPayment(
        customerId,
        paymentIntentId,
        {
          userInfo: req.user,
          sessionId: req.sessionId,
          isAuthenticated: !!req.user,
        }
      );

      res.json({
        success: true,
        data: result,
        message: 'Payment confirmed and order completed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Confirm payment error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to confirm payment';
      const statusCode =
        errorMessage.includes('not found') ||
        errorMessage.includes('already confirmed')
          ? 404
          : errorMessage.includes('payment failed')
            ? 400
            : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/checkout/payment-status/:paymentIntentId - Get payment status
   */
  async getPaymentStatus(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { paymentIntentId } = req.params;

      if (!paymentIntentId) {
        res.status(400).json({
          success: false,
          error: 'Payment intent ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get payment status from payment service
      const paymentStatus =
        await this.paymentServiceClient.getPaymentStatus(paymentIntentId);

      res.json({
        success: true,
        data: { paymentStatus },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get payment status error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get payment status';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/checkout/cancel/:paymentIntentId - Cancel payment intent
   */
  async cancelPayment(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { paymentIntentId } = req.params;

      if (!paymentIntentId) {
        res.status(400).json({
          success: false,
          error: 'Payment intent ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get customer identification
      const customerId = this.getCustomerId(req);
      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer identification required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Cancel payment intent
      const result = await this.checkoutService.cancelPayment(
        customerId,
        paymentIntentId
      );

      res.json({
        success: true,
        data: result,
        message: 'Payment cancelled successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Cancel payment error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel payment';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/checkout/summary - Get checkout summary with cart details
   */
  async getCheckoutSummary(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customer identification
      const customerId = this.getCustomerId(req);
      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer identification required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get checkout summary
      const summary = await this.checkoutService.getCheckoutSummary(customerId);

      res.json({
        success: true,
        data: { summary },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get checkout summary error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to get checkout summary';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Helper method to get customer ID from request
   */
  private getCustomerId(req: SessionRequest): string | null {
    // Priority: authenticated user > session customer > anonymous session
    if (req.user?.id) {
      return req.user.id;
    }

    if (req.session?.customerId) {
      return req.session.customerId;
    }

    if (req.sessionId) {
      return `anonymous_${req.sessionId}`;
    }

    return null;
  }
}
