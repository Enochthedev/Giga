import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StripeGateway } from '../../services/gateways/stripe-gateway.service';
import { GatewayConfig } from '../../types/gateway.types';
import { PaymentRequest } from '../../types/payment.types';

// Mock Stripe
const mockStripe = {
  paymentIntents: {
    create: vi.fn(),
    capture: vi.fn(),
    cancel: vi.fn(),
  },
  paymentMethods: {
    create: vi.fn(),
    update: vi.fn(),
    retrieve: vi.fn(),
    attach: vi.fn(),
    detach: vi.fn(),
  },
  refunds: {
    create: vi.fn(),
  },
  accounts: {
    retrieve: vi.fn(),
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
};

vi.mock('stripe', () => {
  return {
    default: vi.fn(() => mockStripe),
  };
});

describe('StripeGateway Integration Tests', () => {
  let stripeGateway: StripeGateway;
  let gatewayConfig: GatewayConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    gatewayConfig = {
      id: 'stripe-test',
      type: 'stripe',
      name: 'Stripe Test Gateway',
      status: 'active',
      priority: 1,
      credentials: {
        secretKey: 'sk_test_123456789',
        publishableKey: 'pk_test_123456789',
        webhookSecret: 'whsec_test_123456789',
      },
      settings: {
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        supportedCountries: ['US', 'GB', 'DE'],
        supportedPaymentMethods: ['card', 'bank_account'],
        minAmount: 0.5,
        maxAmount: 999999,
      },
      healthCheck: {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      },
      rateLimit: {
        requestsPerSecond: 100,
        burstLimit: 200,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    stripeGateway = new StripeGateway(gatewayConfig);
  });

  describe('Payment Processing', () => {
    it('should process payment with payment method ID', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 2000,
        currency: 'usd',
        client_secret: 'pi_test_123_secret_abc',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
        payment_method: 'pm_test_123',
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const paymentRequest: PaymentRequest = {
        amount: 20.0,
        currency: 'USD',
        description: 'Test payment',
        userId: 'user_123',
        paymentMethodId: 'pm_test_123',
        metadata: { orderId: 'order_123' },
      };

      const result = await stripeGateway.processPayment(paymentRequest);

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2000,
        currency: 'usd',
        description: 'Test payment',
        payment_method: 'pm_test_123',
        confirmation_method: 'automatic',
        confirm: true,
        metadata: {
          userId: 'user_123',
          merchantId: '',
          internalReference: '',
          externalReference: '',
          orderId: 'order_123',
        },
      });

      expect(result).toEqual({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: expect.any(Object), // Decimal object
        currency: 'USD',
        clientSecret: 'pi_test_123_secret_abc',
        requiresAction: false,
        paymentMethod: {
          id: 'pm_test_123',
          type: 'card',
          metadata: {},
        },
        metadata: {},
        createdAt: expect.any(Date),
      });
    });

    it('should process payment with card data', async () => {
      const mockPaymentMethod = {
        id: 'pm_test_new',
        type: 'card',
        created: Math.floor(Date.now() / 1000),
      };

      const mockPaymentIntent = {
        id: 'pi_test_456',
        status: 'succeeded',
        amount: 1500,
        currency: 'usd',
        client_secret: 'pi_test_456_secret_def',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
        payment_method: 'pm_test_new',
      };

      mockStripe.paymentMethods.create.mockResolvedValue(mockPaymentMethod);
      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const paymentRequest: PaymentRequest = {
        amount: 15.0,
        currency: 'USD',
        description: 'Test payment with card',
        userId: 'user_456',
        paymentMethodData: {
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        },
      };

      const result = await stripeGateway.processPayment(paymentRequest);

      expect(mockStripe.paymentMethods.create).toHaveBeenCalledWith({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
        billing_details: {
          name: 'John Doe',
        },
      });

      expect(result.status).toBe('succeeded');
      expect(result.id).toBe('pi_test_456');
    });

    it('should handle payment requiring action', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_3ds',
        status: 'requires_action',
        amount: 3000,
        currency: 'usd',
        client_secret: 'pi_test_3ds_secret_ghi',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
        next_action: {
          type: 'redirect_to_url',
          redirect_to_url: {
            url: 'https://hooks.stripe.com/redirect/authenticate/src_123',
          },
        },
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const paymentRequest: PaymentRequest = {
        amount: 30.0,
        currency: 'USD',
        paymentMethodId: 'pm_test_3ds',
      };

      const result = await stripeGateway.processPayment(paymentRequest);

      expect(result.status).toBe('pending');
      expect(result.requiresAction).toBe(true);
      expect(result.nextAction).toEqual({
        type: 'redirect_to_url',
        redirectUrl: 'https://hooks.stripe.com/redirect/authenticate/src_123',
        useStripeSdk: false,
      });
    });
  });

  describe('Payment Capture', () => {
    it('should capture payment successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_capture',
        status: 'succeeded',
        amount: 2500,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      };

      mockStripe.paymentIntents.capture.mockResolvedValue(mockPaymentIntent);

      const result = await stripeGateway.capturePayment(
        'pi_test_capture',
        25.0
      );

      expect(mockStripe.paymentIntents.capture).toHaveBeenCalledWith(
        'pi_test_capture',
        {
          amount_to_capture: 2500,
        }
      );

      expect(result.status).toBe('succeeded');
      expect(result.id).toBe('pi_test_capture');
    });

    it('should capture full payment amount when no amount specified', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_full_capture',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      };

      mockStripe.paymentIntents.capture.mockResolvedValue(mockPaymentIntent);

      const result = await stripeGateway.capturePayment('pi_test_full_capture');

      expect(mockStripe.paymentIntents.capture).toHaveBeenCalledWith(
        'pi_test_full_capture',
        {}
      );
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Payment Cancellation', () => {
    it('should cancel payment successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_cancel',
        status: 'canceled',
        amount: 1000,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      };

      mockStripe.paymentIntents.cancel.mockResolvedValue(mockPaymentIntent);

      const result = await stripeGateway.cancelPayment('pi_test_cancel');

      expect(mockStripe.paymentIntents.cancel).toHaveBeenCalledWith(
        'pi_test_cancel'
      );
      expect(result.status).toBe('cancelled');
      expect(result.id).toBe('pi_test_cancel');
    });
  });

  describe('Refund Processing', () => {
    it('should process full refund successfully', async () => {
      const mockRefund = {
        id: 're_test_123',
        amount: 2000,
        currency: 'usd',
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      };

      mockStripe.refunds.create.mockResolvedValue(mockRefund);

      const result = await stripeGateway.refundPayment('pi_test_123');

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_test_123',
        reason: 'requested_by_customer',
      });

      expect(result.id).toBe('re_test_123');
      expect(result.status).toBe('succeeded');
      expect(result.transactionId).toBe('pi_test_123');
    });

    it('should process partial refund successfully', async () => {
      const mockRefund = {
        id: 're_test_partial',
        amount: 1000,
        currency: 'usd',
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      };

      mockStripe.refunds.create.mockResolvedValue(mockRefund);

      const result = await stripeGateway.refundPayment(
        'pi_test_123',
        10.0,
        'duplicate'
      );

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_test_123',
        amount: 1000,
        reason: 'duplicate',
      });

      expect(result.amount.toNumber()).toBe(10);
      expect(result.reason).toBe('duplicate');
    });
  });

  describe('Payment Method Management', () => {
    it('should create payment method successfully', async () => {
      const mockPaymentMethod = {
        id: 'pm_test_create',
        type: 'card',
        created: Math.floor(Date.now() / 1000),
        card: {
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2025,
        },
        billing_details: {
          name: 'Jane Doe',
        },
      };

      mockStripe.paymentMethods.create.mockResolvedValue(mockPaymentMethod);
      mockStripe.paymentMethods.attach.mockResolvedValue(mockPaymentMethod);

      const result = await stripeGateway.createPaymentMethod({
        type: 'card',
        userId: 'user_123',
        customerId: 'cus_test_123',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
        },
        billingDetails: {
          name: 'Jane Doe',
        },
      });

      expect(mockStripe.paymentMethods.attach).toHaveBeenCalledWith(
        'pm_test_create',
        {
          customer: 'cus_test_123',
        }
      );

      expect(result.id).toBe('pm_test_create');
      expect(result.type).toBe('card');
      expect(result.metadata.last4).toBe('4242');
      expect(result.metadata.brand).toBe('visa');
    });

    it('should retrieve payment method successfully', async () => {
      const mockPaymentMethod = {
        id: 'pm_test_retrieve',
        type: 'card',
        created: Math.floor(Date.now() / 1000),
        card: {
          last4: '1234',
          brand: 'mastercard',
          exp_month: 6,
          exp_year: 2026,
        },
        billing_details: {
          name: 'Bob Smith',
        },
      };

      mockStripe.paymentMethods.retrieve.mockResolvedValue(mockPaymentMethod);

      const result = await stripeGateway.getPaymentMethod('pm_test_retrieve');

      expect(mockStripe.paymentMethods.retrieve).toHaveBeenCalledWith(
        'pm_test_retrieve'
      );
      expect(result.id).toBe('pm_test_retrieve');
      expect(result.metadata.last4).toBe('1234');
      expect(result.metadata.brand).toBe('mastercard');
    });

    it('should delete payment method successfully', async () => {
      mockStripe.paymentMethods.detach.mockResolvedValue({});

      await stripeGateway.deletePaymentMethod('pm_test_delete');

      expect(mockStripe.paymentMethods.detach).toHaveBeenCalledWith(
        'pm_test_delete'
      );
    });
  });

  describe('Webhook Handling', () => {
    it('should verify webhook signature successfully', () => {
      mockStripe.webhooks.constructEvent.mockReturnValue({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
      });

      const payload = JSON.stringify({
        id: 'evt_test',
        type: 'payment_intent.succeeded',
      });
      const signature = 't=1234567890,v1=signature_hash';

      const isValid = stripeGateway.verifyWebhook(payload, signature);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        payload,
        signature,
        'whsec_test_123456789'
      );
      expect(isValid).toBe(true);
    });

    it('should reject invalid webhook signature', () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const payload = JSON.stringify({
        id: 'evt_test',
        type: 'payment_intent.succeeded',
      });
      const signature = 'invalid_signature';

      const isValid = stripeGateway.verifyWebhook(payload, signature);

      expect(isValid).toBe(false);
    });

    it('should parse webhook event successfully', () => {
      const webhookPayload = {
        id: 'evt_test_parse',
        type: 'payment_intent.succeeded',
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        api_version: '2023-10-16',
        data: {
          object: {
            id: 'pi_test_webhook',
            amount: 2000,
            currency: 'usd',
          },
        },
      };

      const result = stripeGateway.parseWebhook(JSON.stringify(webhookPayload));

      expect(result.id).toBe('stripe_evt_test_parse');
      expect(result.type).toBe('payment.succeeded');
      expect(result.gatewayId).toBe('stripe-test');
      expect(result.gatewayEventId).toBe('evt_test_parse');
      expect(result.data).toEqual(webhookPayload.data.object);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when Stripe API is accessible', async () => {
      mockStripe.accounts.retrieve.mockResolvedValue({ id: 'acct_test' });

      const isHealthy = await stripeGateway.healthCheck();

      expect(mockStripe.accounts.retrieve).toHaveBeenCalled();
      expect(isHealthy).toBe(true);
    });

    it('should return unhealthy status when Stripe API is not accessible', async () => {
      mockStripe.accounts.retrieve.mockRejectedValue(new Error('API Error'));

      const isHealthy = await stripeGateway.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle Stripe API errors gracefully', async () => {
      const stripeError = new Error('Your card was declined.');
      mockStripe.paymentIntents.create.mockRejectedValue(stripeError);

      const paymentRequest: PaymentRequest = {
        amount: 20.0,
        currency: 'USD',
        paymentMethodId: 'pm_test_declined',
      };

      await expect(
        stripeGateway.processPayment(paymentRequest)
      ).rejects.toThrow();
    });

    it('should retry on retryable errors', async () => {
      const retryableError = new Error('Rate limit exceeded');
      mockStripe.paymentIntents.create
        .mockRejectedValueOnce(retryableError)
        .mockRejectedValueOnce(retryableError)
        .mockResolvedValue({
          id: 'pi_test_retry',
          status: 'succeeded',
          amount: 1000,
          currency: 'usd',
          created: Math.floor(Date.now() / 1000),
          metadata: {},
        });

      const paymentRequest: PaymentRequest = {
        amount: 10.0,
        currency: 'USD',
        paymentMethodId: 'pm_test_retry',
      };

      const result = await stripeGateway.processPayment(paymentRequest);

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledTimes(3);
      expect(result.id).toBe('pi_test_retry');
    });
  });
});
