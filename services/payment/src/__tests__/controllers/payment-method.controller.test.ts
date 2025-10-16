import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentMethodController } from '../../controllers/payment-method.controller';
import {
  PaymentMethodNotFoundError,
  ValidationError,
} from '../../utils/errors';

// Create mock service
const mockPaymentMethodService = {
  create: vi.fn(),
  getById: vi.fn(),
  getByUserId: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  setDefault: vi.fn(),
  tokenize: vi.fn(),
  validateToken: vi.fn(),
};

// Mock the PaymentMethodService
vi.mock('../../services/payment-method.service', () => ({
  PaymentMethodService: vi
    .fn()
    .mockImplementation(() => mockPaymentMethodService),
}));

describe('PaymentMethodController', () => {
  let controller: PaymentMethodController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new PaymentMethodController();

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createPaymentMethod', () => {
    it('should create payment method successfully', async () => {
      const paymentMethodData = {
        userId: 'user123',
        type: 'card',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      const createdPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        token: 'pm_token',
        isDefault: false,
        metadata: {
          last4: '4242',
          brand: 'visa',
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = paymentMethodData;
      mockPaymentMethodService.create.mockResolvedValue(createdPaymentMethod);

      await controller.createPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.create).toHaveBeenCalledWith(
        paymentMethodData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdPaymentMethod,
      });
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'card',
        // Missing card data
      };

      mockRequest.body = invalidData;
      mockPaymentMethodService.create.mockRejectedValue(
        new ValidationError('Card data is required')
      );

      await controller.createPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Card data is required',
        },
      });
    });

    it('should handle internal server errors', async () => {
      mockRequest.body = { userId: 'user123', type: 'card' };
      mockPaymentMethodService.create.mockRejectedValue(
        new Error('Database error')
      );

      await controller.createPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
        },
      });
    });
  });

  describe('getPaymentMethod', () => {
    it('should get payment method successfully', async () => {
      const paymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        metadata: { last4: '4242' },
      };

      mockRequest.params = { id: 'pm_123' };
      mockPaymentMethodService.getById.mockResolvedValue(paymentMethod);

      await controller.getPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.getById).toHaveBeenCalledWith('pm_123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: paymentMethod,
      });
    });

    it('should handle payment method not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockPaymentMethodService.getById.mockRejectedValue(
        new PaymentMethodNotFoundError('nonexistent')
      );

      await controller.getPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'PAYMENT_METHOD_NOT_FOUND',
          message: 'Payment method not found: nonexistent',
        },
      });
    });
  });

  describe('getUserPaymentMethods', () => {
    it('should get user payment methods successfully', async () => {
      const paymentMethods = [
        {
          id: 'pm_1',
          userId: 'user123',
          type: 'card',
          isDefault: true,
        },
        {
          id: 'pm_2',
          userId: 'user123',
          type: 'bank_account',
          isDefault: false,
        },
      ];

      mockRequest.params = { userId: 'user123' };
      mockPaymentMethodService.getByUserId.mockResolvedValue(paymentMethods);

      await controller.getUserPaymentMethods(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.getByUserId).toHaveBeenCalledWith(
        'user123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: paymentMethods,
        count: 2,
      });
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method successfully', async () => {
      const updateData = {
        billingAddress: {
          line1: '456 Oak St',
          city: 'Boston',
          postalCode: '02101',
          country: 'US',
        },
        isDefault: true,
      };

      const updatedPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        isDefault: true,
        billingAddress: updateData.billingAddress,
      };

      mockRequest.params = { id: 'pm_123' };
      mockRequest.body = updateData;
      mockPaymentMethodService.update.mockResolvedValue(updatedPaymentMethod);

      await controller.updatePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.update).toHaveBeenCalledWith(
        'pm_123',
        updateData
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedPaymentMethod,
      });
    });

    it('should handle invalid billing address', async () => {
      const invalidUpdateData = {
        billingAddress: {
          line1: '456 Oak St',
          // Missing required fields
        },
      };

      mockRequest.params = { id: 'pm_123' };
      mockRequest.body = invalidUpdateData;

      await controller.updatePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete payment method successfully', async () => {
      mockRequest.params = { id: 'pm_123' };
      mockPaymentMethodService.delete.mockResolvedValue(undefined);

      await controller.deletePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.delete).toHaveBeenCalledWith('pm_123');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Payment method deleted successfully',
      });
    });

    it('should handle payment method not found during deletion', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockPaymentMethodService.delete.mockRejectedValue(
        new PaymentMethodNotFoundError('nonexistent')
      );

      await controller.deletePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set default payment method successfully', async () => {
      const requestData = { userId: 'user123' };
      const updatedPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        isDefault: true,
      };

      mockRequest.params = { id: 'pm_123' };
      mockRequest.body = requestData;
      mockPaymentMethodService.setDefault.mockResolvedValue(
        updatedPaymentMethod
      );

      await controller.setDefaultPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.setDefault).toHaveBeenCalledWith(
        'pm_123',
        'user123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedPaymentMethod,
      });
    });

    it('should handle validation error when user mismatch', async () => {
      mockRequest.params = { id: 'pm_123' };
      mockRequest.body = { userId: 'user123' };
      mockPaymentMethodService.setDefault.mockRejectedValue(
        new ValidationError('Payment method does not belong to user')
      );

      await controller.setDefaultPaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('tokenizePaymentMethod', () => {
    it('should tokenize payment method successfully', async () => {
      const paymentMethodData = {
        userId: 'user123',
        type: 'card',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      const token = 'pm_tokenized_123';

      mockRequest.body = paymentMethodData;
      mockPaymentMethodService.tokenize.mockResolvedValue(token);

      await controller.tokenizePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.tokenize).toHaveBeenCalledWith(
        paymentMethodData
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { token },
      });
    });

    it('should handle validation errors during tokenization', async () => {
      const invalidData = {
        userId: 'user123',
        type: 'card',
        // Invalid card data
      };

      mockRequest.body = invalidData;

      await controller.tokenizePaymentMethod(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      mockRequest.params = { token: 'valid_token' };
      mockPaymentMethodService.validateToken.mockResolvedValue(true);

      await controller.validateToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPaymentMethodService.validateToken).toHaveBeenCalledWith(
        'valid_token'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { valid: true },
      });
    });

    it('should return false for invalid token', async () => {
      mockRequest.params = { token: 'invalid_token' };
      mockPaymentMethodService.validateToken.mockResolvedValue(false);

      await controller.validateToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { valid: false },
      });
    });

    it('should handle service errors during token validation', async () => {
      mockRequest.params = { token: 'error_token' };
      mockPaymentMethodService.validateToken.mockRejectedValue(
        new Error('Service error')
      );

      await controller.validateToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
