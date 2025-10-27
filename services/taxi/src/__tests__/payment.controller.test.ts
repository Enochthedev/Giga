import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';

// Mock the PaymentService
vi.mock('../services/payment.service');

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let mockPaymentService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockPaymentService = {
      processRidePayment: vi.fn(),
      refundRidePayment: vi.fn(),
      getPaymentTransaction: vi.fn(),
      getDriverEarningsSummary: vi.fn(),
      createDriverPayout: vi.fn(),
      processDriverPayouts: vi.fn(),
    };

    // Mock the PaymentService constructor
    (PaymentService as any).mockImplementation(() => mockPaymentService);

    paymentController = new PaymentController();

    mockRequest = {
      params: {},
      body: {},
      query: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('processRidePayment', () => {
    const mockPaymentRequest = {
      passengerId: 'passenger-123',
      driverId: 'driver-123',
      fareBreakdown: {
        baseFare: 5.0,
        distanceFare: 8.0,
        timeFare: 3.0,
        surgeFare: 2.0,
        tolls: 1.0,
        fees: 0.5,
        discounts: 0.0,
        tips: 2.0,
        taxes: 1.5,
        total: 23.0,
      },
      currency: 'USD',
    };

    const mockPaymentResult = {
      success: true,
      transactionId: 'txn-123',
      status: 'succeeded',
      amount: 23.0,
      currency: 'USD',
      processedAt: new Date(),
    };

    beforeEach(() => {
      mockRequest.params = { rideId: 'ride-123' };
      mockRequest.body = mockPaymentRequest;
      mockPaymentService.processRidePayment.mockResolvedValue(
        mockPaymentResult
      );
    });

    it('should process ride payment successfully', async () => {
      await paymentController.processRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.processRidePayment).toHaveBeenCalledWith({
        ...mockPaymentRequest,
        rideId: 'ride-123',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPaymentResult,
      });
    });

    it('should return 400 for missing required fields', async () => {
      mockRequest.body = { fareBreakdown: mockPaymentRequest.fareBreakdown };

      await paymentController.processRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required payment information',
      });
    });

    it('should return 400 for failed payment', async () => {
      const failedResult = {
        success: false,
        status: 'failed',
        amount: 23.0,
        currency: 'USD',
        error: 'Payment failed',
        processedAt: new Date(),
      };
      mockPaymentService.processRidePayment.mockResolvedValue(failedResult);

      await paymentController.processRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: failedResult,
      });
    });

    it('should handle service errors', async () => {
      mockPaymentService.processRidePayment.mockRejectedValue(
        new Error('Service error')
      );

      await paymentController.processRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('refundRidePayment', () => {
    const mockRefund = {
      id: 'refund-123',
      transactionId: 'txn-123',
      amount: 23.0,
      currency: 'USD',
      reason: 'Customer request',
      status: 'succeeded',
      processedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockRequest.params = { rideId: 'ride-123' };
      mockRequest.body = { amount: 23.0, reason: 'Customer request' };
      mockPaymentService.refundRidePayment.mockResolvedValue(mockRefund);
    });

    it('should refund ride payment successfully', async () => {
      await paymentController.refundRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.refundRidePayment).toHaveBeenCalledWith(
        'ride-123',
        23.0,
        'Customer request'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockRefund,
      });
    });

    it('should handle refund errors', async () => {
      mockPaymentService.refundRidePayment.mockRejectedValue(
        new Error('Refund failed')
      );

      await paymentController.refundRidePayment(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Refund failed',
      });
    });
  });

  describe('getPaymentTransaction', () => {
    const mockTransaction = {
      id: 'txn-123',
      type: 'payment',
      status: 'succeeded',
      amount: 23.0,
      currency: 'USD',
      userId: 'passenger-123',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockRequest.params = { transactionId: 'txn-123' };
      mockPaymentService.getPaymentTransaction.mockResolvedValue(
        mockTransaction
      );
    });

    it('should get payment transaction successfully', async () => {
      await paymentController.getPaymentTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.getPaymentTransaction).toHaveBeenCalledWith(
        'txn-123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTransaction,
      });
    });

    it('should handle transaction not found', async () => {
      mockPaymentService.getPaymentTransaction.mockRejectedValue(
        new Error('Transaction not found')
      );

      await paymentController.getPaymentTransaction(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Transaction not found',
      });
    });
  });

  describe('getDriverEarningsSummary', () => {
    const mockSummary = {
      totalEarnings: 450.0,
      totalRides: 20,
      averageEarningsPerRide: 22.5,
      totalCommission: 90.0,
      totalTips: 50.0,
      totalBonuses: 25.0,
      breakdown: [],
    };

    beforeEach(() => {
      mockRequest.params = { driverId: 'driver-123' };
      mockRequest.query = {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      };
      mockPaymentService.getDriverEarningsSummary.mockResolvedValue(
        mockSummary
      );
    });

    it('should get driver earnings summary successfully', async () => {
      await paymentController.getDriverEarningsSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.getDriverEarningsSummary).toHaveBeenCalledWith(
        'driver-123',
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-31T23:59:59Z')
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSummary,
      });
    });

    it('should return 400 for missing date parameters', async () => {
      mockRequest.query = { startDate: '2024-01-01T00:00:00Z' };

      await paymentController.getDriverEarningsSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Start date and end date are required',
      });
    });
  });

  describe('createDriverPayout', () => {
    const mockPayout = {
      id: 'payout-123',
      driverId: 'driver-123',
      amount: 100.0,
      currency: 'USD',
      status: 'pending',
      payoutMethod: 'bank_transfer',
      scheduledAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockRequest.params = { driverId: 'driver-123' };
      mockRequest.body = {
        amount: 100.0,
        currency: 'USD',
        payoutMethod: 'bank_transfer',
      };
      mockPaymentService.createDriverPayout.mockResolvedValue(mockPayout);
    });

    it('should create driver payout successfully', async () => {
      await paymentController.createDriverPayout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.createDriverPayout).toHaveBeenCalledWith({
        ...mockRequest.body,
        driverId: 'driver-123',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPayout,
      });
    });

    it('should handle payout creation errors', async () => {
      mockPaymentService.createDriverPayout.mockRejectedValue(
        new Error('Payout creation failed')
      );

      await paymentController.createDriverPayout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Payout creation failed',
      });
    });
  });

  describe('processDriverPayouts', () => {
    beforeEach(() => {
      mockPaymentService.processDriverPayouts.mockResolvedValue();
    });

    it('should process driver payouts successfully', async () => {
      await paymentController.processDriverPayouts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentService.processDriverPayouts).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Driver payouts processed successfully',
      });
    });

    it('should handle payout processing errors', async () => {
      mockPaymentService.processDriverPayouts.mockRejectedValue(
        new Error('Payout processing failed')
      );

      await paymentController.processDriverPayouts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Payout processing failed',
      });
    });
  });

  describe('handlePaymentWebhook', () => {
    const mockWebhookEvent = {
      id: 'evt_123',
      type: 'payment.succeeded',
      data: {
        object: {
          id: 'txn-123',
          status: 'succeeded',
          amount: 23.0,
        },
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
    };

    beforeEach(() => {
      mockRequest.body = mockWebhookEvent;
    });

    it('should handle payment webhook successfully', async () => {
      await paymentController.handlePaymentWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ received: true });
    });

    it('should handle webhook processing errors', async () => {
      // Mock an error by making one of the handler methods throw
      const mockWebhookEvent = {
        id: 'evt_123',
        type: 'payment.succeeded',
        data: {
          object: {
            id: 'txn-123',
            status: 'succeeded',
            amount: 23.0,
          },
        },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
      };

      mockRequest.body = mockWebhookEvent;

      // Mock the private method to throw an error
      const originalMethod = (paymentController as any).handlePaymentSucceeded;
      (paymentController as any).handlePaymentSucceeded = vi
        .fn()
        .mockRejectedValue(new Error('Processing error'));

      await paymentController.handlePaymentWebhook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });

      // Restore original method
      (paymentController as any).handlePaymentSucceeded = originalMethod;
    });
  });
});
