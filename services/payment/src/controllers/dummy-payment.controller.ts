import { Request, Response } from 'express';
import { z } from 'zod';
import { DummyPaymentService } from '../services/dummy-payment.service';

// Request validation schemas
const CreatePaymentIntentSchema = z.object({
  amount: z.number().positive().int(),
  currency: z.string().default('usd'),
  customerId: z.string().min(1),
  metadata: z.record(z.string()).optional().default({}),
});

const ConfirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1),
});

const CreatePaymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account', 'wallet']),
  card: z
    .object({
      number: z.string().min(13).max(19),
      exp_month: z.number().min(1).max(12),
      exp_year: z.number().min(2024),
      cvc: z.string().min(3).max(4),
      brand: z.string().optional(),
    })
    .optional(),
});

const ProcessRefundSchema = z.object({
  paymentIntentId: z.string().min(1),
  amount: z.number().positive().int().optional(),
  reason: z.string().optional(),
});

export class DummyPaymentController {
  constructor(private dummyPaymentService: DummyPaymentService) {}

  /**
   * POST /api/v1/payment-intents - Create payment intent
   */
  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = CreatePaymentIntentSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { amount, currency, customerId, metadata } = validationResult.data;

      const paymentIntent = await this.dummyPaymentService.createPaymentIntent(
        amount,
        currency,
        customerId,
        metadata
      );

      res.status(201).json({
        success: true,
        data: { paymentIntent },
        message: 'Payment intent created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment intent',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/payment-intents/:id - Get payment intent
   */
  async getPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment intent ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const paymentIntent = await this.dummyPaymentService.getPaymentIntent(id);

      if (!paymentIntent) {
        res.status(404).json({
          success: false,
          error: 'Payment intent not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: { paymentIntent },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get payment intent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payment intent',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/payment-intents/:id/confirm - Confirm payment intent
   */
  async confirmPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment intent ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await this.dummyPaymentService.confirmPaymentIntent(id);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Payment confirmation failed',
          data: { paymentResult: result },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: { paymentResult: result },
        message: 'Payment confirmed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Confirm payment intent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to confirm payment',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/payment-intents/:id/cancel - Cancel payment intent
   */
  async cancelPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment intent ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await this.dummyPaymentService.cancelPaymentIntent(id);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Payment cancellation failed',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        message: 'Payment intent cancelled successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Cancel payment intent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel payment intent',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/payment-methods - Create payment method
   */
  async createPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = CreatePaymentMethodSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid payment method data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { type, card } = validationResult.data;

      const paymentMethod = await this.dummyPaymentService.createPaymentMethod(
        type,
        { card }
      );

      res.status(201).json({
        success: true,
        data: { paymentMethod },
        message: 'Payment method created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Create payment method error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment method',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/payment-methods/:id - Get payment method
   */
  async getPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment method ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const paymentMethod = await this.dummyPaymentService.getPaymentMethod(id);

      if (!paymentMethod) {
        res.status(404).json({
          success: false,
          error: 'Payment method not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: { paymentMethod },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get payment method error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payment method',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/customers/:customerId/payment-methods - List customer payment methods
   */
  async listPaymentMethods(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const paymentMethods =
        await this.dummyPaymentService.listPaymentMethods(customerId);

      res.json({
        success: true,
        data: { paymentMethods },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('List payment methods error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list payment methods',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/refunds - Process refund
   */
  async processRefund(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = ProcessRefundSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid refund data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { paymentIntentId, amount, reason } = validationResult.data;

      const result = await this.dummyPaymentService.processRefund(
        paymentIntentId,
        amount,
        reason
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Refund processing failed',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: { refund: result },
        message: 'Refund processed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Process refund error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process refund',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/payment-statistics - Get payment statistics
   */
  async getPaymentStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await this.dummyPaymentService.getPaymentStatistics();

      res.json({
        success: true,
        data: { statistics },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get payment statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payment statistics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/v1/test/clear-data - Clear all test data (development only)
   */
  async clearTestData(req: Request, res: Response): Promise<void> {
    try {
      // Only allow in development environment
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          error: 'Not allowed in production environment',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      this.dummyPaymentService.clearAllData();

      res.json({
        success: true,
        message: 'All test data cleared successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Clear test data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear test data',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/test/debug - Get debug information (development only)
   */
  async getDebugInfo(req: Request, res: Response): Promise<void> {
    try {
      // Only allow in development environment
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({
          success: false,
          error: 'Not allowed in production environment',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const paymentIntents = this.dummyPaymentService.getAllPaymentIntents();
      const paymentMethods = this.dummyPaymentService.getAllPaymentMethods();

      res.json({
        success: true,
        data: {
          paymentIntents,
          paymentMethods,
          counts: {
            paymentIntents: paymentIntents.length,
            paymentMethods: paymentMethods.length,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get debug info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get debug information',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
