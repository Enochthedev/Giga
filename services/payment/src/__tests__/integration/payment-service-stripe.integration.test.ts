import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentService } from '../../services/payment.service';
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

// Mock TransactionService
vi.mock('../../services/transaction.service', () => ({
  TransactionService: vi.fn().mockImplementation(() => ({
    create: vi.fn().mockResolvedValue({
      id: 'test-transaction-id',
      type: 'payment',
      status: 'pending',
      amount: { toNumber: () => 100 },
      currency: 'USD',
      description: 'Test payment',
      userId: 'user-123',
      gatewayId: 'stripe',
      createdAt: new Date(),
      metadata: {},
    }),
    getById: vi.fn().mockResolvedValue({
      id: 'test-transaction-id',
      type: 'payment',
      status: 'pending',
      amount: { toNumber: () => 100, gt: () => false },
      currency: 'USD',
      description: 'Test payment',
      userId: 'user-123',
      gatewayId: 'stripe',
      gatewayTransactionId: 'pi_test_123',
      createdAt: new Date(),
      metadata: {},
      refunds: [],
    }),
    update: vi.fn().mockResolvedValue({
      id: 'test-transaction-id',
      status: 'succeeded',
    }),
    updateStatus: vi.fn().mockResolvedValue({
      id: 'test-transaction-id',
      status: 'succeeded',
    }),
    getByFilters: vi.fn().mockResolvedValue({
      data: [],
      pagination: { page: 1, limit: 20, total: 0 },
    }),
    addSplit: vi.fn().mockResolvedValue({}),
  })),
}));

describe('PaymentService Stripe Integration Tests', () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock successful Stripe responses
    mockStripe.paymentIntents.create.mockResolvedValue({
      id: 'pi_test_123',
      status: 'succeeded',
      amount: 10000,
      currency: 'usd',
      client_secret: 'pi_test_123_secret',
      created: Math.floor(Date.now() / 1000),
      metadata: {},
    });

    mockStripe.accounts.retrieve.mockResolvedValue({ id: 'acct_test' });

    paymentService = new PaymentService();

    // Wait a bit for gateway initialization
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('Payment Processing with Stripe', () => {
    it('should process payment through Stripe gateway', async () => {
      const paymentRequest: PaymentRequest = {
        amount: 100.0,
        currency: 'USD',
        description: 'Test Stripe payment',
        userId: 'user-123',
        paymentMethodId: 'pm_test_stripe',
        metadata: { orderId: 'order-123' },
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10000,
          currency: 'usd',
          description: 'Test Stripe payment',
          payment_method: 'pm_test_stripe',
          metadata: expect.objectContaining({
            userId: 'user-123',
            orderId: 'order-123',
          }),
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: 'test-transaction-id',
          status: 'succeeded',
          currency: 'USD',
        })
      );
    });

    it('should capture payment through Stripe gateway', async () => {
      mockStripe.paymentIntents.capture.mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 5000,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      });

      const result = await paymentService.capturePayment(
        'test-transaction-id',
        50.0
      );

      expect(mockStripe.paymentIntents.capture).toHaveBeenCalledWith(
        'pi_test_123',
        {
          amount_to_capture: 5000,
        }
      );

      expect(result.status).toBe('succeeded');
    });

    it('should cancel payment through Stripe gateway', async () => {
      mockStripe.paymentIntents.cancel.mockResolvedValue({
        id: 'pi_test_123',
        status: 'canceled',
        amount: 10000,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      });

      const result = await paymentService.cancelPayment('test-transaction-id');

      expect(mockStripe.paymentIntents.cancel).toHaveBeenCalledWith(
        'pi_test_123'
      );
      expect(result.status).toBe('cancelled');
    });

    it('should refund payment through Stripe gateway', async () => {
      // Create a new service instance with updated mock
      const paymentServiceForRefund = new PaymentService();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock the transaction service to return succeeded transaction
      const mockTransactionService =
        paymentServiceForRefund['transactionService'];
      vi.mocked(mockTransactionService.getById).mockResolvedValue({
        id: 'test-transaction-id',
        type: 'payment',
        status: 'succeeded',
        amount: { toNumber: () => 100, gt: () => false },
        currency: 'USD',
        description: 'Test payment',
        userId: 'user-123',
        gatewayId: 'stripe',
        gatewayTransactionId: 'pi_test_123',
        createdAt: new Date(),
        metadata: {},
        refunds: [],
      });

      mockStripe.refunds.create.mockResolvedValue({
        id: 're_test_123',
        amount: 5000,
        currency: 'usd',
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000),
        metadata: {},
      });

      const result = await paymentServiceForRefund.refundPayment(
        'test-transaction-id',
        50.0,
        'Customer request'
      );

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_test_123',
        amount: 5000,
        reason: 'requested_by_customer',
      });

      expect(result.id).toBe('re_test_123');
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Payment Method Management with Stripe', () => {
    it('should create payment method through Stripe gateway', async () => {
      mockStripe.paymentMethods.create.mockResolvedValue({
        id: 'pm_test_new',
        type: 'card',
        created: Math.floor(Date.now() / 1000),
        card: {
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2025,
        },
        billing_details: {
          name: 'John Doe',
        },
      });

      mockStripe.paymentMethods.attach.mockResolvedValue({});

      const paymentMethodData = {
        type: 'card',
        userId: 'user-123',
        customerId: 'cus_test_123',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
        },
        billingDetails: {
          name: 'John Doe',
        },
      };

      const result =
        await paymentService.createPaymentMethod(paymentMethodData);

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

      expect(result.id).toBe('pm_test_new');
      expect(result.type).toBe('card');
    });

    it('should retrieve payment method through Stripe gateway', async () => {
      mockStripe.paymentMethods.retrieve.mockResolvedValue({
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
          name: 'Jane Smith',
        },
      });

      const result = await paymentService.getPaymentMethod('pm_test_retrieve');

      expect(mockStripe.paymentMethods.retrieve).toHaveBeenCalledWith(
        'pm_test_retrieve'
      );
      expect(result.id).toBe('pm_test_retrieve');
      expect(result.metadata.last4).toBe('1234');
    });

    it('should delete payment method through Stripe gateway', async () => {
      mockStripe.paymentMethods.detach.mockResolvedValue({});

      await paymentService.deletePaymentMethod('pm_test_delete');

      expect(mockStripe.paymentMethods.detach).toHaveBeenCalledWith(
        'pm_test_delete'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Stripe API errors gracefully', async () => {
      const stripeError = new Error('Your card was declined.');
      mockStripe.paymentIntents.create.mockRejectedValue(stripeError);

      const paymentRequest: PaymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: 'pm_test_declined',
      };

      await expect(
        paymentService.processPayment(paymentRequest)
      ).rejects.toThrow();
    });

    it('should handle gateway not found errors', async () => {
      // Create a new service instance without gateways
      const emptyService = new PaymentService();

      await expect(
        emptyService.capturePayment('test-transaction-id')
      ).rejects.toThrow('Gateway stripe not found');
    });
  });
});
