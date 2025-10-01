import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FlutterwaveGateway } from '../../services/gateways/flutterwave-gateway.service';
import { GatewayConfig } from '../../types/gateway.types';
import { PaymentRequest } from '../../types/payment.types';

// Mock the Flutterwave module
vi.mock('flutterwave-node-v3', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      StandardSubaccount: {
        create: vi.fn(),
      },
      Transaction: {
        verify: vi.fn(),
        refund: vi.fn(),
      },
      Customer: {
        create: vi.fn(),
        update: vi.fn(),
        fetch: vi.fn(),
      },
      Misc: {
        balance: vi.fn(),
      },
    })),
  };
});

describe('FlutterwaveGateway Integration Tests', () => {
  let flutterwaveGateway: FlutterwaveGateway;
  let gatewayConfig: GatewayConfig;
  let mockFlutterwave: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    gatewayConfig = {
      id: 'flutterwave-test',
      type: 'flutterwave',
      name: 'Flutterwave Test Gateway',
      status: 'active',
      priority: 1,
      credentials: {
        secretKey: 'FLWSECK_TEST-secret-key',
        publicKey: 'FLWPUBK_TEST-public-key',
        webhookSecret: 'flw-webhook-secret',
      },
      settings: {
        supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP', 'GHS'],
        supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA'],
        supportedPaymentMethods: ['card', 'bank_account', 'mobile_money'],
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

    flutterwaveGateway = new FlutterwaveGateway(gatewayConfig);

    // Get the mocked Flutterwave instance
    const Flutterwave = require('flutterwave-node-v3').default;
    mockFlutterwave = new Flutterwave();
  });

  describe('Payment Processing', () => {
    it('should process payment successfully', async () => {
      const paymentRequest: PaymentRequest = {
        amount: 100.0,
        currency: 'NGN',
        userId: 'user-123',
        customerEmail: 'test@example.com',
        customerName: 'John Doe',
        description: 'Test payment',
        internalReference: 'test-ref-123',
      };

      const mockResponse = {
        status: 'success',
        message: 'Hosted Link',
        data: {
          link: 'https://checkout.flutterwave.com/v3/hosted/pay/test-link',
        },
      };

      mockFlutterwave.StandardSubaccount.create.mockResolvedValue(mockResponse);

      const result = await flutterwaveGateway.processPayment(paymentRequest);

      expect(result).toEqual({
        id: 'test-ref-123',
        status: 'pending',
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        clientSecret:
          'https://checkout.flutterwave.com/v3/hosted/pay/test-link',
        requiresAction: true,
        nextAction: {
          type: 'redirect',
          redirectUrl:
            'https://checkout.flutterwave.com/v3/hosted/pay/test-link',
        },
        metadata: {
          flutterwaveReference: 'test-ref-123',
          paymentLink:
            'https://checkout.flutterwave.com/v3/hosted/pay/test-link',
          userId: 'user-123',
          merchantId: '',
          internalReference: 'test-ref-123',
          externalReference: '',
        },
        createdAt: expect.any(Date),
      });

      expect(mockFlutterwave.StandardSubaccount.create).toHaveBeenCalledWith({
        tx_ref: 'test-ref-123',
        amount: 100,
        currency: 'NGN',
        redirect_url: 'https://example.com/callback',
        customer: {
          email: 'test@example.com',
          phonenumber: '',
          name: 'John Doe',
        },
        customizations: {
          title: 'Payment',
          description: 'Test payment',
          logo: undefined,
        },
        meta: {
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
        status: 'error',
        message: 'Invalid currency',
      };

      mockFlutterwave.StandardSubaccount.create.mockResolvedValue(mockResponse);

      await expect(
        flutterwaveGateway.processPayment(paymentRequest)
      ).rejects.toThrow('Invalid currency');
    });
  });

  describe('Payment Capture', () => {
    it('should capture payment successfully', async () => {
      const transactionId = 'test-ref-123';

      const mockResponse = {
        status: 'success',
        message: 'Transaction fetched successfully',
        data: {
          id: 12345,
          tx_ref: 'test-ref-123',
          amount: 100,
          currency: 'NGN',
          status: 'successful',
          processor: 'CARD',
          payment_type: 'card',
          charged_amount: 100,
          app_fee: 1.4,
          merchant_fee: 0,
          processor_response: 'Approved',
          auth_model: 'PIN',
          ip: '127.0.0.1',
          narration: 'Test payment',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      };

      mockFlutterwave.Transaction.verify.mockResolvedValue(mockResponse);

      const result = await flutterwaveGateway.capturePayment(transactionId);

      expect(result).toEqual({
        id: 'test-ref-123',
        status: 'succeeded',
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        metadata: {
          flutterwaveId: 12345,
          processor: 'CARD',
          paymentType: 'card',
          chargedAmount: 100,
          appFee: 1.4,
          merchantFee: 0,
          processorResponse: 'Approved',
          authModel: 'PIN',
          ip: '127.0.0.1',
          narration: 'Test payment',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      });

      expect(mockFlutterwave.Transaction.verify).toHaveBeenCalledWith({
        id: transactionId,
      });
    });
  });

  describe('Refund Processing', () => {
    it('should process refund successfully', async () => {
      const transactionId = 'test-ref-123';
      const refundAmount = 50.0;
      const reason = 'Customer request';

      // Mock transaction verification
      const mockVerifyResponse = {
        status: 'success',
        data: {
          id: 12345,
          amount: 100,
          currency: 'NGN',
        },
      };

      // Mock refund creation
      const mockRefundResponse = {
        status: 'success',
        message: 'Refund created successfully',
        data: {
          id: 67890,
          amount_refunded: 50,
          status: 'completed',
          refunded_by: 'test@example.com',
          refunded_at: '2023-01-01T00:00:00.000Z',
          created_at: '2023-01-01T00:00:00.000Z',
          comments: reason,
          settlement_id: 'SETTLE_123',
        },
      };

      mockFlutterwave.Transaction.verify.mockResolvedValue(mockVerifyResponse);
      mockFlutterwave.Transaction.refund.mockResolvedValue(mockRefundResponse);

      const result = await flutterwaveGateway.refundPayment(
        transactionId,
        refundAmount,
        reason
      );

      expect(result).toEqual({
        id: 'flw_refund_67890',
        transactionId,
        amount: expect.any(Object), // Decimal object
        currency: 'NGN',
        reason,
        status: 'succeeded',
        gatewayRefundId: '67890',
        metadata: {
          flutterwaveRefundId: 67890,
          refundedBy: 'test@example.com',
          refundedAt: '2023-01-01T00:00:00.000Z',
          comments: reason,
          settlementId: 'SETTLE_123',
        },
        processedAt: new Date('2023-01-01T00:00:00.000Z'),
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: expect.any(Date),
      });

      expect(mockFlutterwave.Transaction.refund).toHaveBeenCalledWith({
        id: 12345,
        amount: 50,
        comments: reason,
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
        status: 'success',
        message: 'Customer created successfully',
        data: {
          id: 12345,
          email: 'test@example.com',
          full_name: 'John Doe',
          phone_number: '+2348012345678',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      };

      mockFlutterwave.Customer.create.mockResolvedValue(mockResponse);

      const result =
        await flutterwaveGateway.createPaymentMethod(paymentMethodData);

      expect(result).toEqual({
        id: 'flw_pm_12345',
        userId: 'user-123',
        type: 'card',
        provider: 'flutterwave',
        token: '12345',
        isDefault: false,
        metadata: {
          customerId: 12345,
          email: 'test@example.com',
          fullName: 'John Doe',
          phoneNumber: '+2348012345678',
        },
        isActive: true,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: expect.any(Date),
      });

      expect(mockFlutterwave.Customer.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        full_name: 'John Doe',
        phone_number: '+2348012345678',
      });
    });
  });

  describe('Webhook Handling', () => {
    it('should verify webhook signature correctly', () => {
      const payload = JSON.stringify({
        event: 'charge.completed',
        data: {
          id: 12345,
          tx_ref: 'test-ref-123',
        },
      });

      // Mock crypto module
      const crypto = require('crypto');
      const expectedHash = crypto
        .createHmac('sha256', gatewayConfig.credentials.webhookSecret)
        .update(payload)
        .digest('hex');

      const isValid = flutterwaveGateway.verifyWebhook(payload, expectedHash);

      expect(isValid).toBe(true);
    });

    it('should parse webhook event correctly', () => {
      const payload = JSON.stringify({
        event: 'charge.completed',
        'event.type': 'CARD_TRANSACTION',
        data: {
          id: 12345,
          tx_ref: 'test-ref-123',
          amount: 100,
          currency: 'NGN',
        },
      });

      const webhookEvent = flutterwaveGateway.parseWebhook(payload);

      expect(webhookEvent).toEqual({
        id: 'flw_12345',
        type: 'payment.succeeded',
        gatewayId: 'flutterwave-test',
        gatewayEventId: '12345',
        data: {
          id: 12345,
          tx_ref: 'test-ref-123',
          amount: 100,
          currency: 'NGN',
        },
        timestamp: expect.any(Date),
        processed: false,
        retryCount: 0,
        metadata: {
          flutterwaveEvent: 'charge.completed',
          eventType: 'CARD_TRANSACTION',
        },
      });
    });
  });

  describe('Health Check', () => {
    it('should perform health check successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: 'Balance retrieved successfully',
        data: {
          currency: 'NGN',
          balance: 1000,
        },
      };

      mockFlutterwave.Misc.balance.mockResolvedValue(mockResponse);

      const isHealthy = await flutterwaveGateway.healthCheck();

      expect(isHealthy).toBe(true);
      expect(mockFlutterwave.Misc.balance).toHaveBeenCalledWith({
        currency: 'NGN',
      });
    });

    it('should handle health check failure', async () => {
      const mockResponse = {
        status: 'error',
        message: 'API error',
      };

      mockFlutterwave.Misc.balance.mockResolvedValue(mockResponse);

      const isHealthy = await flutterwaveGateway.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('Gateway Status', () => {
    it('should return active status when healthy', async () => {
      const mockResponse = {
        status: 'success',
        data: { balance: 1000 },
      };

      mockFlutterwave.Misc.balance.mockResolvedValue(mockResponse);

      const status = await flutterwaveGateway.getStatus();

      expect(status).toBe('active');
    });

    it('should return error status when unhealthy', async () => {
      mockFlutterwave.Misc.balance.mockRejectedValue(
        new Error('Network error')
      );

      const status = await flutterwaveGateway.getStatus();

      expect(status).toBe('error');
    });
  });
});
