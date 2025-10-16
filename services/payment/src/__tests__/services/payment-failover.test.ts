import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GatewayManager } from '../../services/gateway-manager.service';
import { PaymentService } from '../../services/payment.service';
import { TransactionService } from '../../services/transaction.service';
import { PaymentRequest } from '../../types/payment.types';

// Mock the dependencies
vi.mock('../../services/gateway-manager.service');
vi.mock('../../services/transaction.service');

describe('PaymentService Failover Integration', () => {
  let paymentService: PaymentService;
  let mockGatewayManager: vi.Mocked<GatewayManager>;
  let mockTransactionService: vi.Mocked<TransactionService>;
  let mockPrimaryGateway: any;
  let mockFallbackGateway: any;

  const createMockPaymentRequest = (
    overrides: Partial<PaymentRequest> = {}
  ): PaymentRequest => ({
    amount: 100.0,
    currency: 'USD',
    description: 'Test payment',
    userId: 'user-123',
    paymentMethodId: 'pm-123',
    ...overrides,
  });

  const createMockTransaction = () => ({
    id: 'txn-123',
    type: 'payment',
    status: 'pending',
    amount: {
      toNumber: () => 100.0,
      gt: vi.fn().mockReturnValue(false),
      plus: vi.fn().mockReturnValue({ toNumber: () => 100.0 }),
      equals: vi.fn().mockReturnValue(true),
    },
    currency: 'USD',
    description: 'Test payment',
    userId: 'user-123',
    paymentMethodId: 'pm-123',
    gatewayId: 'stripe',
    createdAt: new Date(),
    metadata: {},
    refunds: [],
  });

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock gateways
    mockPrimaryGateway = {
      getId: vi.fn().mockReturnValue('stripe'),
      getType: vi.fn().mockReturnValue('stripe'),
      processPayment: vi.fn(),
      capturePayment: vi.fn(),
      cancelPayment: vi.fn(),
      refundPayment: vi.fn(),
    };

    mockFallbackGateway = {
      getId: vi.fn().mockReturnValue('paystack'),
      getType: vi.fn().mockReturnValue('paystack'),
      processPayment: vi.fn(),
      capturePayment: vi.fn(),
      cancelPayment: vi.fn(),
      refundPayment: vi.fn(),
    };

    // Create mock services
    mockGatewayManager = {
      selectBestGateway: vi.fn(),
      handleGatewayFailure: vi.fn(),
      recordMetrics: vi.fn(),
      registerGateway: vi.fn(),
      getActiveGateways: vi
        .fn()
        .mockReturnValue([mockPrimaryGateway, mockFallbackGateway]),
      enableFailover: vi.fn(),
      getGateway: vi.fn(),
    } as any;

    mockTransactionService = {
      create: vi.fn(),
      update: vi.fn(),
      getById: vi.fn(),
      updateStatus: vi.fn(),
    } as any;

    // Mock constructors
    vi.mocked(GatewayManager).mockImplementation(() => mockGatewayManager);
    vi.mocked(TransactionService).mockImplementation(
      () => mockTransactionService
    );

    // Create PaymentService instance
    paymentService = new PaymentService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Gateway Failover Scenarios', () => {
    beforeEach(() => {
      // Setup default mocks
      mockGatewayManager.selectBestGateway.mockResolvedValue(
        mockPrimaryGateway
      );
      mockTransactionService.create.mockResolvedValue(createMockTransaction());
      mockTransactionService.update.mockResolvedValue(createMockTransaction());
    });

    it('should process payment successfully with primary gateway', async () => {
      const paymentRequest = createMockPaymentRequest();
      const mockPaymentResult = {
        id: 'stripe_pi_123',
        status: 'succeeded',
        amount: 100.0,
        currency: 'USD',
      };

      mockPrimaryGateway.processPayment.mockResolvedValue(mockPaymentResult);

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.status).toBe('succeeded');
      expect(mockPrimaryGateway.processPayment).toHaveBeenCalledWith(
        expect.objectContaining(paymentRequest)
      );
      expect(mockGatewayManager.handleGatewayFailure).not.toHaveBeenCalled();
      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'stripe',
        expect.objectContaining({
          transactionCount: 1,
          successRate: 1.0,
          errorRate: 0.0,
        })
      );
    });

    it('should failover to backup gateway when primary fails', async () => {
      const paymentRequest = createMockPaymentRequest();
      const primaryError = new Error('Gateway timeout');
      const mockFallbackResult = {
        id: 'paystack_txn_456',
        status: 'succeeded',
        amount: 100.0,
        currency: 'USD',
      };

      // Primary gateway fails
      mockPrimaryGateway.processPayment.mockRejectedValue(primaryError);

      // Failover returns backup gateway
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(
        mockFallbackGateway
      );

      // Backup gateway succeeds
      mockFallbackGateway.processPayment.mockResolvedValue(mockFallbackResult);

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.status).toBe('succeeded');
      expect(mockPrimaryGateway.processPayment).toHaveBeenCalled();
      expect(mockGatewayManager.handleGatewayFailure).toHaveBeenCalledWith(
        'stripe',
        primaryError
      );
      expect(mockFallbackGateway.processPayment).toHaveBeenCalledWith(
        expect.objectContaining(paymentRequest)
      );

      // Verify metrics recorded for both gateways
      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'stripe',
        expect.objectContaining({
          successRate: 0.0,
          errorRate: 1.0,
        })
      );
      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'paystack',
        expect.objectContaining({
          successRate: 1.0,
          errorRate: 0.0,
        })
      );

      // Verify transaction updated with fallback gateway ID
      expect(mockTransactionService.update).toHaveBeenCalledWith(
        'txn-123',
        expect.objectContaining({
          gatewayId: 'paystack',
        })
      );
    });

    it('should fail when both primary and fallback gateways fail', async () => {
      const paymentRequest = createMockPaymentRequest();
      const primaryError = new Error('Primary gateway timeout');
      const fallbackError = new Error('Fallback gateway error');

      // Primary gateway fails
      mockPrimaryGateway.processPayment.mockRejectedValue(primaryError);

      // Failover returns backup gateway
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(
        mockFallbackGateway
      );

      // Backup gateway also fails
      mockFallbackGateway.processPayment.mockRejectedValue(fallbackError);

      await expect(
        paymentService.processPayment(paymentRequest)
      ).rejects.toThrow('Fallback gateway error');

      expect(mockPrimaryGateway.processPayment).toHaveBeenCalled();
      expect(mockFallbackGateway.processPayment).toHaveBeenCalled();

      // Verify failure metrics recorded for both gateways
      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'stripe',
        expect.objectContaining({ errorRate: 1.0 })
      );
      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'paystack',
        expect.objectContaining({ errorRate: 1.0 })
      );
    });

    it('should fail when no fallback gateway is available', async () => {
      const paymentRequest = createMockPaymentRequest();
      const primaryError = new Error('Gateway timeout');

      // Primary gateway fails
      mockPrimaryGateway.processPayment.mockRejectedValue(primaryError);

      // No fallback gateway available
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(null);

      await expect(
        paymentService.processPayment(paymentRequest)
      ).rejects.toThrow('Gateway timeout');

      expect(mockPrimaryGateway.processPayment).toHaveBeenCalled();
      expect(mockGatewayManager.handleGatewayFailure).toHaveBeenCalledWith(
        'stripe',
        primaryError
      );
      expect(mockFallbackGateway.processPayment).not.toHaveBeenCalled();
    });

    it('should handle validation errors without triggering failover', async () => {
      const paymentRequest = createMockPaymentRequest({ currency: 'INVALID' });

      await expect(
        paymentService.processPayment(paymentRequest)
      ).rejects.toThrow('Currency must be a 3-letter ISO code');

      expect(mockPrimaryGateway.processPayment).not.toHaveBeenCalled();
      expect(mockGatewayManager.handleGatewayFailure).not.toHaveBeenCalled();
    });
  });

  describe('Capture Payment Failover', () => {
    beforeEach(() => {
      const mockTransaction = {
        ...createMockTransaction(),
        status: 'pending',
        gatewayId: 'stripe',
      };

      mockTransactionService.getById.mockResolvedValue(mockTransaction);
      mockTransactionService.updateStatus.mockResolvedValue(mockTransaction);
      mockGatewayManager.getGateway.mockReturnValue(mockPrimaryGateway);
    });

    it('should capture payment with failover support', async () => {
      const captureError = new Error('Capture failed');
      const mockCaptureResult = {
        id: 'paystack_capture_123',
        status: 'succeeded',
        amount: 100.0,
        currency: 'USD',
      };

      // Primary gateway capture fails
      mockPrimaryGateway.capturePayment.mockRejectedValue(captureError);

      // Failover returns backup gateway
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(
        mockFallbackGateway
      );

      // Backup gateway capture succeeds
      mockFallbackGateway.capturePayment.mockResolvedValue(mockCaptureResult);

      const result = await paymentService.capturePayment('txn-123');

      expect(result.status).toBe('succeeded');
      expect(mockGatewayManager.handleGatewayFailure).toHaveBeenCalledWith(
        'stripe',
        captureError
      );
    });
  });

  describe('Refund Payment Failover', () => {
    beforeEach(() => {
      const mockTransaction = {
        ...createMockTransaction(),
        status: 'succeeded',
        gatewayId: 'stripe',
        refunds: [],
      };

      mockTransactionService.getById.mockResolvedValue(mockTransaction);
      mockTransactionService.updateStatus.mockResolvedValue(mockTransaction);
      mockGatewayManager.getGateway.mockReturnValue(mockPrimaryGateway);
    });

    it('should refund payment with failover support', async () => {
      const refundError = new Error('Refund failed');
      const mockRefundResult = {
        id: 'paystack_refund_123',
        status: 'succeeded',
        amount: 100.0,
        currency: 'USD',
      };

      // Primary gateway refund fails
      mockPrimaryGateway.refundPayment.mockRejectedValue(refundError);

      // Failover returns backup gateway
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(
        mockFallbackGateway
      );

      // Backup gateway refund succeeds
      mockFallbackGateway.refundPayment.mockResolvedValue(mockRefundResult);

      const result = await paymentService.refundPayment('txn-123');

      expect(result.status).toBe('succeeded');
      expect(mockGatewayManager.handleGatewayFailure).toHaveBeenCalledWith(
        'stripe',
        refundError
      );
    });
  });

  describe('Gateway Performance Scoring', () => {
    it('should record performance metrics during payment processing', async () => {
      const paymentRequest = createMockPaymentRequest();
      const mockPaymentResult = {
        id: 'stripe_pi_123',
        status: 'succeeded',
        amount: 100.0,
        currency: 'USD',
      };

      // Ensure gateway is returned properly
      mockGatewayManager.selectBestGateway.mockResolvedValue(
        mockPrimaryGateway
      );
      mockPrimaryGateway.processPayment.mockResolvedValue(mockPaymentResult);

      await paymentService.processPayment(paymentRequest);

      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'stripe',
        expect.objectContaining({
          transactionCount: 1,
          successRate: 1.0,
          errorRate: 0.0,
          responseTime: expect.any(Number),
        })
      );
    });

    it('should record failure metrics when gateway fails', async () => {
      const paymentRequest = createMockPaymentRequest();
      const gatewayError = new Error('Gateway error');

      // Ensure gateway is returned properly
      mockGatewayManager.selectBestGateway.mockResolvedValue(
        mockPrimaryGateway
      );
      mockPrimaryGateway.processPayment.mockRejectedValue(gatewayError);
      mockGatewayManager.handleGatewayFailure.mockResolvedValue(null);

      await expect(
        paymentService.processPayment(paymentRequest)
      ).rejects.toThrow();

      expect(mockGatewayManager.recordMetrics).toHaveBeenCalledWith(
        'stripe',
        expect.objectContaining({
          transactionCount: 1,
          successRate: 0.0,
          errorRate: 1.0,
        })
      );
    });
  });
});
