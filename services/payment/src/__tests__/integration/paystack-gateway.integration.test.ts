import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaystackGateway } from '../../services/gateways/paystack-gateway.service';
import { GatewayConfig } from '../../types/gateway.types';
import { PaymentRequest } from '../../types/payment.types';

// Mock the Paystack module
vi.mock('paystack', () => {
  return {
    Paystack: vi.fn().mockImplementation(() => ({
      transaction: {
        initialize: vi.fn(),
        verify: vi.fn(),
      },
      refund: {
        create: vi.fn(),
      },
      customer: {
        create: vi.fn(),
        update: vi.fn(),
        fetch: vi.fn(),
        deactivate: vi.fn(),
      },
      misc: {
        list_banks: vi.fn(),
      },
    })),
  };
});

describe('PaystackGateway Integration Tests', () => {
  let paystackGateway: PaystackGateway;
  let gatewayConfig: GatewayConfig;
  let mockPaystack: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    gatewayConfig = {
      id: 'paystack-test',
      type: 'paystack',
      name: 'Paystack Test Gateway',
      status: 'active',
      priority: 1,
      credentials: {
        secretKey: 'sk_test_paystack_secret_key',
        publicKey: 'pk_test_paystack_public_key',
        webhookSecret: 'whsec_test_paystack_webhook_secret',
      },
      settings: {
        supportedCurrencies: ['NGN', 'USD', 'GHS'],
        supportedCountries: ['NG', 'GH', 'ZA'],
        supportedPaymentMethods: ['card', 'bank_account'],
        minAmount: 1,
        maxAmount: 10000000,
      },
      healthCheck: {
        interval: 60000,
        timeout: 5000,
        retries: 3,
      },
      rateLimit: {
        requestsPerSecond: 50,
        burstLimit: 100,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    paystackGateway = new PaystackGateway(gatewayConfig);

    // Get the mocked Paystack instance
    const { Paystack } = require('paystack');
    mockPaystack = new Paystack();
  });

  describe('Payment Processing', () => {
    it('should process payment successfully', async () => {
      const paymentRequest: PaymentRequest = {
        amount: 100.0,
        currency: 'NGN',
        userId: 'user-123',
        customerEmail: 'test@example.com',
        description: 'Test payment',
        internalReference: 'test-ref-123',
      };

      const mockResponse = {
        status: true,
        message: 'Authorization URL created',
        data: {
          authorization_url: 'https://checkout.paystack.com/test-url',
          access_code: 'test-access-code',
          reference: 'test-ref-123',
        },
      };

      mockPaystack.transaction.initialize.mockResolvedValue(mockResponse);

      const result = await paystackGateway.processPayment(paymentRequest);

      expect(result).toEqual({
        id: 'test-ref-123',
        status: 'pending',
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        clientSecret: 'test-access-code',
        requiresAction: true,
        nextAction: {
          type: 'redirect',
          redirectUrl: 'https://checkout.paystack.com/test-url',
        },
        metadata: {
          paystackReference: 'test-ref-123',
          accessCode: 'test-access-code',
          userId: 'user-123',
          merchantId: '',
          internalReference: 'test-ref-123',
          externalReference: '',
        },
        createdAt: expect.any(Date),
      });

      expect(mockPaystack.transaction.initialize).toHaveBeenCalledWith({
        amount: 10000, // 100 NGN in kobo
        currency: 'NGN',
        email: 'test@example.com',
        reference: 'test-ref-123',
        callback_url: undefined,
        metadata: {
          userId: 'user-123',
          merchantId: '',
          internalReference: 'test-ref-123',
          externalReference: '',
        },
      });
    });

    it('should handle payment processing failure', async () => {
      const paymentRequest: PaymentRequest = {
        amount: 100.0,
        currency: 'NGN',
        userId: 'user-123',
        customerEmail: 'test@example.com',
        description: 'Test payment',
      };

      const mockResponse = {
        status: false,
        message: 'Invalid email address',
      };

      mockPaystack.transaction.initialize.mockResolvedValue(mockResponse);

      await expect(
        paystackGateway.processPayment(paymentRequest)
      ).rejects.toThrow('Invalid email address');
    });
  });

  describe('Payment Capture', () => {
    it('should capture payment successfully', async () => {
      const transactionId = 'test-ref-123';

      const mockResponse = {
        status: true,
        message: 'Verification successful',
        data: {
          id: 12345,
          reference: 'test-ref-123',
          amount: 10000,
          currency: 'NGN',
          status: 'success',
          gateway_response: 'Successful',
          paid_at: '2023-01-01T00:00:00.000Z',
          created_at: '2023-01-01T00:00:00.000Z',
          channel: 'card',
        },
      };

      mockPaystack.transaction.verify.mockResolvedValue(mockResponse);

      const result = await paystackGateway.capturePayment(transactionId);

      expect(result).toEqual({
        id: 'test-ref-123',
        status: 'succeeded',
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        metadata: {
          paystackId: 12345,
          gatewayResponse: 'Successful',
          paidAt: '2023-01-01T00:00:00.000Z',
          channel: 'card',
        },
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      });

      expect(mockPaystack.transaction.verify).toHaveBeenCalledWith(
        transactionId
      );
    });
  });

  describe('Refund Processing', () => {
    it('should process refund successfully', async () => {
      const transactionId = 'test-ref-123';
      const refundAmount = 50.0;
      const reason = 'Customer request';

      // Mock transaction verification
      const mockVerifyResponse = {
        status: true,
        data: {
          id: 12345,
          amount: 10000,
          currency: 'NGN',
        },
      };

      // Mock refund creation
      const mockRefundResponse = {
        status: true,
        message: 'Refund created successfully',
        data: {
          id: 67890,
          amount: 5000,
          currency: 'NGN',
          status: 'processed',
          customer_note: reason,
          merchant_note: reason,
          refunded_by: 'test@example.com',
          refunded_at: '2023-01-01T00:00:00.000Z',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      };

      mockPaystack.transaction.verify.mockResolvedValue(mockVerifyResponse);
      mockPaystack.refund.create.mockResolvedValue(mockRefundResponse);

      const result = await paystackGateway.refundPayment(
        transactionId,
        refundAmount,
        reason
      );

      expect(result).toEqual({
        id: 'paystack_refund_67890',
        transactionId,
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        reason,
        status: 'succeeded',
        gatewayRefundId: '67890',
        metadata: {
          paystackRefundId: 67890,
          customerNote: reason,
          merchantNote: reason,
          refundedBy: 'test@example.com',
        },
        processedAt: new Date('2023-01-01T00:00:00.000Z'),
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: expect.any(Date),
      });

      expect(mockPaystack.refund.create).toHaveBeenCalledWith({
        transaction: transactionId,
        amount: 5000, // 50 NGN in kobo
        customer_note: reason,
        merchant_note: reason,
      });
    });
  });

  describe('Payment Method Management', () => {
    it('should create payment method successfully', async () => {
      const paymentMethodData = {
        userId: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+2348012345678',
      };

      const mockResponse = {
        status: true,
        message: 'Customer created',
        data: {
          id: 12345,
          customer_code: 'CUS_test123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+2348012345678',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      };

      mockPaystack.customer.create.mockResolvedValue(mockResponse);

      const result =
        await paystackGateway.createPaymentMethod(paymentMethodData);

      expect(result).toEqual({
        id: 'paystack_pm_CUS_test123',
        userId: 'user-123',
        type: 'card',
        provider: 'paystack',
        token: 'CUS_test123',
        isDefault: false,
        metadata: {
          customerCode: 'CUS_test123',
          customerId: 12345,
          email: 'test@example.com',
        },
        isActive: true,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: expect.any(Date),
      });

      expect(mockPaystack.customer.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+2348012345678',
      });
    });
  });

  describe('Webhook Handling', () => {
    it('should verify webhook signature correctly', () => {
      const payload = JSON.stringify({
        event: 'charge.success',
        data: {
          id: 12345,
          reference: 'test-ref-123',
        },
      });

      // Mock crypto module
      const crypto = require('crypto');
      const expectedHash = crypto
        .createHmac('sha512', gatewayConfig.credentials.webhookSecret)
        .update(payload)
        .digest('hex');

      const isValid = paystackGateway.verifyWebhook(payload, expectedHash);

      expect(isValid).toBe(true);
    });

    it('should parse webhook event correctly', () => {
      const payload = JSON.stringify({
        event: 'charge.success',
        data: {
          id: 12345,
          reference: 'test-ref-123',
          amount: 10000,
          currency: 'NGN',
        },
        domain: 'test',
      });

      const webhookEvent = paystackGateway.parseWebhook(payload);

      expect(webhookEvent).toEqual({
        id: 'paystack_12345',
        type: 'payment.succeeded',
        gatewayId: 'paystack-test',
        gatewayEventId: '12345',
        data: {
          id: 12345,
          reference: 'test-ref-123',
          amount: 10000,
          currency: 'NGN',
        },
        timestamp: expect.any(Date),
        processed: false,
        retryCount: 0,
        metadata: {
          paystackEvent: 'charge.success',
          domain: 'test',
        },
      });
    });
  });

  describe('Health Check', () => {
    it('should perform health check successfully', async () => {
      const mockResponse = {
        status: true,
        message: 'Banks retrieved successfully',
        data: [],
      };

      mockPaystack.misc.list_banks.mockResolvedValue(mockResponse);

      const isHealthy = await paystackGateway.healthCheck();

      expect(isHealthy).toBe(true);
      expect(mockPaystack.misc.list_banks).toHaveBeenCalled();
    });

    it('should handle health check failure', async () => {
      const mockResponse = {
        status: false,
        message: 'API error',
      };

      mockPaystack.misc.list_banks.mockResolvedValue(mockResponse);

      const isHealthy = await paystackGateway.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('Gateway Status', () => {
    it('should return active status when healthy', async () => {
      const mockResponse = {
        status: true,
        data: [],
      };

      mockPaystack.misc.list_banks.mockResolvedValue(mockResponse);

      const status = await paystackGateway.getStatus();

      expect(status).toBe('active');
    });

    it('should return error status when unhealthy', async () => {
      mockPaystack.misc.list_banks.mockRejectedValue(
        new Error('Network error')
      );

      const status = await paystackGateway.getStatus();

      expect(status).toBe('error');
    });
  });
});
