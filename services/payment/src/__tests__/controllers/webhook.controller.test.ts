import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WebhookController } from '../../controllers/webhook.controller';
import { GatewayManager } from '../../services/gateway-manager.service';
import { PaymentGateway, WebhookEvent } from '../../types/gateway.types';

// Mock the GatewayManager
vi.mock('../../services/gateway-manager.service');

describe('WebhookController', () => {
  let webhookController: WebhookController;
  let mockGatewayManager: vi.Mocked<GatewayManager>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockGateway: Partial<PaymentGateway>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock gateway manager
    mockGatewayManager = {
      getGateway: vi.fn(),
    } as any;

    // Create mock gateway
    mockGateway = {
      verifyWebhook: vi.fn(),
      parseWebhook: vi.fn(),
      getId: vi.fn().mockReturnValue('stripe'),
    };

    webhookController = new WebhookController(mockGatewayManager);

    // Create mock request and response
    mockRequest = {
      headers: {},
      body: '',
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('handleStripeWebhook', () => {
    it('should process valid Stripe webhook successfully', async () => {
      const webhookPayload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_123' } },
      });

      const webhookEvent: WebhookEvent = {
        id: 'stripe_evt_test_webhook',
        type: 'payment.succeeded',
        gatewayId: 'stripe',
        gatewayEventId: 'evt_test_webhook',
        data: { id: 'pi_test_123' },
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
      };

      mockRequest.headers = { 'stripe-signature': 't=1234567890,v1=signature_hash' };
      mockRequest.body = webhookPayload;

      mockGatewayManager.getGateway.mockReturnValue(mockGateway as PaymentGateway);
      mockGateway.verifyWebhook!.mockReturnValue(true);
      mockGateway.parseWebhook!.mockReturnValue(webhookEvent);

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockGatewayManager.getGateway).toHaveBeenCalledWith('stripe');
      expect(mockGateway.verifyWebhook).toHaveBeenCalledWith(webhookPayload, 't=1234567890,v1=signature_hash');
      expect(mockGateway.parseWebhook).toHaveBeenCalledWith(webhookPayload);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });

    it('should reject webhook with missing signature', async () => {
      mockRequest.headers = {}; // No signature header
      mockRequest.body = JSON.stringify({ id: 'evt_test' });

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Missing signature header' });
    });

    it('should reject webhook with invalid signature', async () => {
      const webhookPayload = JSON.stringify({ id: 'evt_test' });

      mockRequest.headers = { 'stripe-signature': 'invalid_signature' };
      mockRequest.body = webhookPayload;

      mockGatewayManager.getGateway.mockReturnValue(mockGateway as PaymentGateway);
      mockGateway.verifyWebhook!.mockReturnValue(false);

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockGateway.verifyWebhook).toHaveBeenCalledWith(webhookPayload, 'invalid_signature');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid signature' });
    });

    it('should handle gateway not found error', async () => {
      mockRequest.headers = { 'stripe-signature': 't=1234567890,v1=signature_hash' };
      mockRequest.body = JSON.stringify({ id: 'evt_test' });

      mockGatewayManager.getGateway.mockReturnValue(undefined);

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Gateway not configured' });
    });

    it('should handle webhook processing errors', async () => {
      const webhookPayload = JSON.stringify({ id: 'evt_test' });

      mockRequest.headers = { 'stripe-signature': 't=1234567890,v1=signature_hash' };
      mockRequest.body = webhookPayload;

      mockGatewayManager.getGateway.mockReturnValue(mockGateway as PaymentGateway);
      mockGateway.verifyWebhook!.mockReturnValue(true);
      mockGateway.parseWebhook!.mockImplementation(() => {
        throw new Error('Parsing failed');
      });

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Webhook processing failed' });
    });
  });

  describe('handleWebhook', () => {
    it('should process webhook for any gateway', async () => {
      const webhookPayload = JSON.stringify({
        id: 'evt_paypal_test',
        type: 'PAYMENT.CAPTURE.COMPLETED',
      });

      const webhookEvent: WebhookEvent = {
        id: 'paypal_evt_test',
        type: 'payment.succeeded',
        gatewayId: 'paypal',
        gatewayEventId: 'evt_paypal_test',
        data: { id: 'payment_123' },
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
      };

      mockRequest.params = { gatewayId: 'paypal' };
      mockRequest.headers = { 'paypal-transmission-sig': 'paypal_signature_hash' };
      mockRequest.body = webhookPayload;

      const mockPayPalGateway = {
        ...mockGateway,
        getId: vi.fn().mockReturnValue('paypal'),
      };

      mockGatewayManager.getGateway.mockReturnValue(mockPayPalGateway as PaymentGateway);
      mockPayPalGateway.verifyWebhook!.mockReturnValue(true);
      mockPayPalGateway.parseWebhook!.mockReturnValue(webhookEvent);

      await webhookController.handleWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockGatewayManager.getGateway).toHaveBeenCalledWith('paypal');
      expect(mockPayPalGateway.verifyWebhook).toHaveBeenCalledWith(webhookPayload, 'paypal_signature_hash');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });

    it('should reject webhook with missing gateway ID', async () => {
      mockRequest.params = {}; // No gatewayId

      await webhookController.handleWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Gateway ID is required' });
    });

    it('should reject webhook for unknown gateway', async () => {
      mockRequest.params = { gatewayId: 'unknown_gateway' };
      mockRequest.headers = { 'x-signature': 'some_signature' };

      mockGatewayManager.getGateway.mockReturnValue(undefined);

      await webhookController.handleWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockGatewayManager.getGateway).toHaveBeenCalledWith('unknown_gateway');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Gateway not found' });
    });

    it('should handle different signature headers for different gateways', async () => {
      const testCases = [
        { gatewayId: 'stripe', headerName: 'stripe-signature', headerValue: 'stripe_sig' },
        { gatewayId: 'paypal', headerName: 'paypal-transmission-sig', headerValue: 'paypal_sig' },
        { gatewayId: 'square', headerName: 'x-signature', headerValue: 'square_sig' },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();

        mockRequest.params = { gatewayId: testCase.gatewayId };
        mockRequest.headers = { [testCase.headerName]: testCase.headerValue };
        mockRequest.body = JSON.stringify({ id: 'test_event' });

        const mockTestGateway = {
          ...mockGateway,
          getId: vi.fn().mockReturnValue(testCase.gatewayId),
        };

        mockGatewayManager.getGateway.mockReturnValue(mockTestGateway as PaymentGateway);
        mockTestGateway.verifyWebhook!.mockReturnValue(true);
        mockTestGateway.parseWebhook!.mockReturnValue({
          id: 'test_event',
          type: 'test.event',
          gatewayId: testCase.gatewayId,
          gatewayEventId: 'test_event',
          data: {},
          timestamp: new Date(),
          processed: false,
          retryCount: 0,
        });

        await webhookController.handleWebhook(mockRequest as Request, mockResponse as Response);

        expect(mockTestGateway.verifyWebhook).toHaveBeenCalledWith(
          JSON.stringify({ id: 'test_event' }),
          testCase.headerValue
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      }
    });
  });

  describe('handlePayPalWebhook', () => {
    it('should acknowledge PayPal webhook (not implemented)', async () => {
      await webhookController.handlePayPalWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });
  });

  describe('Webhook Event Processing', () => {
    it('should process different event types correctly', async () => {
      const eventTypes = [
        'payment.succeeded',
        'payment.failed',
        'payment.cancelled',
        'payment.refunded',
        'payment.disputed',
        'payment_method.created',
        'payment_method.updated',
        'payment_method.deleted',
      ];

      for (const eventType of eventTypes) {
        vi.clearAllMocks();

        const webhookEvent: WebhookEvent = {
          id: `test_${eventType}`,
          type: eventType,
          gatewayId: 'stripe',
          gatewayEventId: `evt_${eventType}`,
          data: { id: 'test_object' },
          timestamp: new Date(),
          processed: false,
          retryCount: 0,
        };

        mockRequest.headers = { 'stripe-signature': 't=1234567890,v1=signature_hash' };
        mockRequest.body = JSON.stringify({ type: eventType });

        mockGatewayManager.getGateway.mockReturnValue(mockGateway as PaymentGateway);
        mockGateway.verifyWebhook!.mockReturnValue(true);
        mockGateway.parseWebhook!.mockReturnValue(webhookEvent);

        await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
      }
    });

    it('should handle unknown event types gracefully', async () => {
      const webhookEvent: WebhookEvent = {
        id: 'test_unknown',
        type: 'unknown.event.type',
        gatewayId: 'stripe',
        gatewayEventId: 'evt_unknown',
        data: { id: 'test_object' },
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
      };

      mockRequest.headers = { 'stripe-signature': 't=1234567890,v1=signature_hash' };
      mockRequest.body = JSON.stringify({ type: 'unknown.event.type' });

      mockGatewayManager.getGateway.mockReturnValue(mockGateway as PaymentGateway);
      mockGateway.verifyWebhook!.mockReturnValue(true);
      mockGateway.parseWebhook!.mockReturnValue(webhookEvent);

      await webhookController.handleStripeWebhook(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });
  });
});