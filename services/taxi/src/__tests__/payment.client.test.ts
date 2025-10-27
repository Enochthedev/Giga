import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentRequest, PaymentStatus } from '../types/payment.types';

// Mock axios
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

// Mock logger
vi.mock('../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('PaymentClient', () => {
  let PaymentClient: any;
  let paymentClient: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Import PaymentClient after mocking
    const module = await import('../clients/payment.client');
    PaymentClient = module.PaymentClient;
    paymentClient = new PaymentClient('http://localhost:3003');
  });

  describe('processPayment', () => {
    const mockPaymentRequest: PaymentRequest = {
      amount: 23.0,
      currency: 'USD',
      description: 'Ride payment',
      userId: 'passenger-123',
      paymentMethodId: 'pm_123',
      metadata: { rideId: 'ride-123' },
    };

    const mockPaymentResponse = {
      id: 'txn-123',
      status: 'succeeded' as PaymentStatus,
      amount: 23.0,
      currency: 'USD',
      createdAt: new Date(),
    };

    it('should process payment successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: mockPaymentResponse,
      });

      const result = await paymentClient.processPayment(mockPaymentRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/payments',
        mockPaymentRequest
      );
      expect(result).toEqual(mockPaymentResponse);
    });

    it('should handle payment processing errors', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Invalid payment method' },
        },
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(
        paymentClient.processPayment(mockPaymentRequest)
      ).rejects.toThrow('Payment processing failed: Invalid payment method');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(networkError);

      await expect(
        paymentClient.processPayment(mockPaymentRequest)
      ).rejects.toThrow('Payment processing failed: Network error');
    });
  });

  describe('capturePayment', () => {
    const mockCaptureResponse = {
      id: 'txn-123',
      status: 'succeeded' as PaymentStatus,
      amount: 23.0,
      currency: 'USD',
      createdAt: new Date(),
    };

    it('should capture payment successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: mockCaptureResponse,
      });

      const result = await paymentClient.capturePayment('txn-123', 23.0);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/payments/txn-123/capture',
        {
          amount: 23.0,
        }
      );
      expect(result).toEqual(mockCaptureResponse);
    });

    it('should capture payment without amount', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: mockCaptureResponse,
      });

      const result = await paymentClient.capturePayment('txn-123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/payments/txn-123/capture',
        {
          amount: undefined,
        }
      );
      expect(result).toEqual(mockCaptureResponse);
    });

    it('should handle capture errors', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Cannot capture payment' },
        },
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(paymentClient.capturePayment('txn-123')).rejects.toThrow(
        'Payment capture failed: Cannot capture payment'
      );
    });
  });

  describe('refundPayment', () => {
    const mockRefund = {
      id: 'refund-123',
      transactionId: 'txn-123',
      amount: 23.0,
      currency: 'USD',
      reason: 'Customer request',
      status: 'succeeded' as PaymentStatus,
      processedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should refund payment successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: mockRefund,
      });

      const result = await paymentClient.refundPayment(
        'txn-123',
        23.0,
        'Customer request'
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/payments/txn-123/refund',
        {
          amount: 23.0,
          reason: 'Customer request',
        }
      );
      expect(result).toEqual(mockRefund);
    });

    it('should handle refund errors', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Cannot refund payment' },
        },
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(paymentClient.refundPayment('txn-123')).rejects.toThrow(
        'Payment refund failed: Cannot refund payment'
      );
    });
  });

  describe('getTransaction', () => {
    const mockTransaction = {
      id: 'txn-123',
      type: 'payment',
      status: 'succeeded' as PaymentStatus,
      amount: 23.0,
      currency: 'USD',
      userId: 'passenger-123',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get transaction successfully', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockTransaction,
      });

      const result = await paymentClient.getTransaction('txn-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/transactions/txn-123'
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should handle transaction not found', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Transaction not found' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(paymentClient.getTransaction('txn-123')).rejects.toThrow(
        'Failed to get transaction: Transaction not found'
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true for successful health check', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
      });

      const result = await paymentClient.healthCheck();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
      expect(result).toBe(true);
    });

    it('should return false for failed health check', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Service unavailable'));

      const result = await paymentClient.healthCheck();

      expect(result).toBe(false);
    });
  });
});
