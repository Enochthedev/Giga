import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { GatewayManager } from '../services/gateway-manager.service';
import { WebhookEvent } from '../types/gateway.types';

export class WebhookController {
  constructor(private gatewayManager: GatewayManager) {}

  /**
   * Handle Stripe webhook events
   */
  handleStripeWebhook(req: Request, res: Response): void {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const payload = req.body;

      if (!signature) {
        logger.warn('Missing Stripe signature header');
        res.status(400).json({ error: 'Missing signature header' });
        return;
      }

      // Get Stripe gateway
      const stripeGateway = this.gatewayManager.getGateway('stripe');
      if (!stripeGateway) {
        logger.error('Stripe gateway not found');
        res.status(500).json({ error: 'Gateway not configured' });
        return;
      }

      // Verify webhook signature
      const isValid = stripeGateway.verifyWebhook(payload, signature);
      if (!isValid) {
        logger.warn('Invalid Stripe webhook signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Parse webhook event
      const webhookEvent = stripeGateway.parseWebhook(payload);

      // Process the webhook event
      this.processWebhookEvent(webhookEvent);

      logger.info('Stripe webhook processed successfully', {
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
      });

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Failed to process Stripe webhook', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Handle PayPal webhook events
   */
  handlePayPalWebhook(req: Request, res: Response): void {
    try {
      // TODO: Implement PayPal webhook handling
      logger.info('PayPal webhook received (not implemented yet)');
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Failed to process PayPal webhook', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Handle Paystack webhook events
   */
  handlePaystackWebhook(req: Request, res: Response): void {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const payload = req.body;

      if (!signature) {
        logger.warn('Missing Paystack signature header');
        res.status(400).json({ error: 'Missing signature header' });
        return;
      }

      // Get Paystack gateway
      const paystackGateway = this.gatewayManager.getGateway('paystack');
      if (!paystackGateway) {
        logger.error('Paystack gateway not found');
        res.status(500).json({ error: 'Gateway not configured' });
        return;
      }

      // Verify webhook signature
      const isValid = paystackGateway.verifyWebhook(payload, signature);
      if (!isValid) {
        logger.warn('Invalid Paystack webhook signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Parse webhook event
      const webhookEvent = paystackGateway.parseWebhook(payload);

      // Process the webhook event
      this.processWebhookEvent(webhookEvent);

      logger.info('Paystack webhook processed successfully', {
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
      });

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Failed to process Paystack webhook', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Handle Flutterwave webhook events
   */
  handleFlutterwaveWebhook(req: Request, res: Response): void {
    try {
      const signature = req.headers['verif-hash'] as string;
      const payload = req.body;

      if (!signature) {
        logger.warn('Missing Flutterwave signature header');
        res.status(400).json({ error: 'Missing signature header' });
        return;
      }

      // Get Flutterwave gateway
      const flutterwaveGateway = this.gatewayManager.getGateway('flutterwave');
      if (!flutterwaveGateway) {
        logger.error('Flutterwave gateway not found');
        res.status(500).json({ error: 'Gateway not configured' });
        return;
      }

      // Verify webhook signature
      const isValid = flutterwaveGateway.verifyWebhook(payload, signature);
      if (!isValid) {
        logger.warn('Invalid Flutterwave webhook signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Parse webhook event
      const webhookEvent = flutterwaveGateway.parseWebhook(payload);

      // Process the webhook event
      this.processWebhookEvent(webhookEvent);

      logger.info('Flutterwave webhook processed successfully', {
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
      });

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Failed to process Flutterwave webhook', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Generic webhook handler that routes to appropriate gateway
   */
  handleWebhook(req: Request, res: Response): void {
    try {
      const gatewayId = req.params.gatewayId;

      if (!gatewayId) {
        res.status(400).json({ error: 'Gateway ID is required' });
        return;
      }

      const gateway = this.gatewayManager.getGateway(gatewayId);
      if (!gateway) {
        logger.error('Gateway not found', { gatewayId });
        res.status(404).json({ error: 'Gateway not found' });
        return;
      }

      // Get signature header (different for each gateway)
      let signature: string | undefined;
      switch (gatewayId) {
        case 'stripe':
          signature = req.headers['stripe-signature'] as string;
          break;
        case 'paypal':
          signature = req.headers['paypal-transmission-sig'] as string;
          break;
        case 'paystack':
          signature = req.headers['x-paystack-signature'] as string;
          break;
        case 'flutterwave':
          signature = req.headers['verif-hash'] as string;
          break;
        default:
          signature = req.headers['x-signature'] as string;
      }

      if (!signature) {
        logger.warn('Missing webhook signature header', { gatewayId });
        res.status(400).json({ error: 'Missing signature header' });
        return;
      }

      const payload = req.body;

      // Verify webhook signature
      const isValid = gateway.verifyWebhook(payload, signature);
      if (!isValid) {
        logger.warn('Invalid webhook signature', { gatewayId });
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Parse webhook event
      const webhookEvent = gateway.parseWebhook(payload);

      // Process the webhook event
      this.processWebhookEvent(webhookEvent);

      logger.info('Webhook processed successfully', {
        gatewayId,
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
      });

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Failed to process webhook', {
        error: error instanceof Error ? error.message : 'Unknown error',
        gatewayId: req.params.gatewayId,
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  /**
   * Process webhook event based on event type
   */
  private processWebhookEvent(webhookEvent: WebhookEvent): void {
    try {
      logger.info('Processing webhook event', {
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
        gatewayId: webhookEvent.gatewayId,
      });

      this.routeWebhookEvent(webhookEvent);

      // Mark event as processed
      webhookEvent.processed = true;
    } catch (error) {
      logger.error('Failed to process webhook event', {
        eventId: webhookEvent.id,
        eventType: webhookEvent.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Route webhook event to appropriate handler
   */
  private routeWebhookEvent(webhookEvent: WebhookEvent): void {
    switch (webhookEvent.type) {
      case 'payment.succeeded':
        this.handlePaymentSucceeded(webhookEvent);
        break;

      case 'payment.failed':
        this.handlePaymentFailed(webhookEvent);
        break;

      case 'payment.cancelled':
        this.handlePaymentCancelled(webhookEvent);
        break;

      case 'payment.refunded':
        this.handlePaymentRefunded(webhookEvent);
        break;

      case 'payment.disputed':
        this.handlePaymentDisputed(webhookEvent);
        break;

      case 'payment_method.created':
        this.handlePaymentMethodCreated(webhookEvent);
        break;

      case 'payment_method.updated':
        this.handlePaymentMethodUpdated(webhookEvent);
        break;

      case 'payment_method.deleted':
        this.handlePaymentMethodDeleted(webhookEvent);
        break;

      default:
        logger.info('Unhandled webhook event type', {
          eventType: webhookEvent.type,
          eventId: webhookEvent.id,
        });
    }
  }

  /**
   * Handle payment succeeded event
   */
  private handlePaymentSucceeded(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment succeeded event', {
      eventId: webhookEvent.id,
      paymentId: webhookEvent.data.id,
    });

    // TODO: Update transaction status in database
    // TODO: Send confirmation notifications
    // TODO: Trigger fulfillment processes
  }

  /**
   * Handle payment failed event
   */
  private handlePaymentFailed(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment failed event', {
      eventId: webhookEvent.id,
      paymentId: webhookEvent.data.id,
    });

    // TODO: Update transaction status in database
    // TODO: Send failure notifications
    // TODO: Trigger retry logic if applicable
  }

  /**
   * Handle payment cancelled event
   */
  private handlePaymentCancelled(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment cancelled event', {
      eventId: webhookEvent.id,
      paymentId: webhookEvent.data.id,
    });

    // TODO: Update transaction status in database
    // TODO: Send cancellation notifications
    // TODO: Release any holds or reservations
  }

  /**
   * Handle payment refunded event
   */
  private handlePaymentRefunded(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment refunded event', {
      eventId: webhookEvent.id,
      refundId: webhookEvent.data.id,
    });

    // TODO: Update refund status in database
    // TODO: Send refund notifications
    // TODO: Update inventory if applicable
  }

  /**
   * Handle payment disputed event
   */
  private handlePaymentDisputed(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment disputed event', {
      eventId: webhookEvent.id,
      disputeId: webhookEvent.data.id,
    });

    // TODO: Create dispute record in database
    // TODO: Send dispute notifications to merchants
    // TODO: Trigger dispute response workflow
  }

  /**
   * Handle payment method created event
   */
  private handlePaymentMethodCreated(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment method created event', {
      eventId: webhookEvent.id,
      paymentMethodId: webhookEvent.data.id,
    });

    // TODO: Update payment method in database
    // TODO: Send confirmation to user
  }

  /**
   * Handle payment method updated event
   */
  private handlePaymentMethodUpdated(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment method updated event', {
      eventId: webhookEvent.id,
      paymentMethodId: webhookEvent.data.id,
    });

    // TODO: Update payment method in database
    // TODO: Send update notification to user
  }

  /**
   * Handle payment method deleted event
   */
  private handlePaymentMethodDeleted(webhookEvent: WebhookEvent): void {
    logger.info('Processing payment method deleted event', {
      eventId: webhookEvent.id,
      paymentMethodId: webhookEvent.data.id,
    });

    // TODO: Mark payment method as inactive in database
    // TODO: Send deletion confirmation to user
  }
}
