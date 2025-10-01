import { Request, Response } from 'express';
import { DeliveryController } from '../../controllers/delivery.controller';
import { AppError } from '../../utils/error-utils';

// Mock dependencies

describe('DeliveryController', () => {
  let deliveryController: DeliveryController;
  let mockDeliveryService: unknown;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockDeliveryService = {
      serveFile: vi.fn(),
      generatePresignedUrl: vi.fn(),
      getResponsiveUrls: vi.fn(),
      validatePresignedAccess: vi.fn(),
    };
    deliveryController = new DeliveryController(mockDeliveryService);

    mockRequest = {
      params: { fileId: 'test-file-id' },
      body: {},
      user: { id: 'user-123' },
    };

    mockResponse = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe('serveFile', () => {
    it('should delegate to delivery service', async () => {
      mockDeliveryService.serveFile.mockResolvedValue();

      await deliveryController.serveFile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.serveFile).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });
  });

  describe('generatePresignedUrl', () => {
    it('should generate presigned URL with default parameters', async () => {
      const mockUrl = 'https://cdn.example.com/signed-url';
      mockDeliveryService.generatePresignedUrl.mockResolvedValue(mockUrl);

      await deliveryController.generatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.generatePresignedUrl).toHaveBeenCalledWith(
        'test-file-id',
        'read',
        3600,
        'user-123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          url: mockUrl,
          operation: 'read',
          expiresIn: 3600,
          expiresAt: expect.any(String),
        },
      });
    });

    it('should generate presigned URL with custom parameters', async () => {
      mockRequest.body = {
        operation: 'write',
        expiresIn: 7200,
      };

      const mockUrl = 'https://cdn.example.com/signed-url-write';
      mockDeliveryService.generatePresignedUrl.mockResolvedValue(mockUrl);

      await deliveryController.generatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.generatePresignedUrl).toHaveBeenCalledWith(
        'test-file-id',
        'write',
        7200,
        'user-123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          url: mockUrl,
          operation: 'write',
          expiresIn: 7200,
          expiresAt: expect.any(String),
        },
      });
    });

    it('should handle validation errors', async () => {
      mockRequest.body = {
        operation: 'invalid',
        expiresIn: 30, // Too short
      };

      await deliveryController.generatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: expect.any(Array),
        },
      });
    });

    it('should handle service errors', async () => {
      mockDeliveryService.generatePresignedUrl.mockRejectedValue(
        new AppError('File not found', 'NOT_FOUND', 404)
      );

      await deliveryController.generatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'File not found',
        },
      });
    });
  });

  describe('getResponsiveUrls', () => {
    it('should get responsive URLs successfully', async () => {
      const mockUrls = {
        thumbnail: 'https://cdn.example.com/thumb.jpg',
        small: 'https://cdn.example.com/small.jpg',
        medium: 'https://cdn.example.com/medium.jpg',
        large: 'https://cdn.example.com/large.jpg',
        original: 'https://cdn.example.com/original.jpg',
      };
      mockDeliveryService.getResponsiveUrls.mockResolvedValue(mockUrls);

      await deliveryController.getResponsiveUrls(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.getResponsiveUrls).toHaveBeenCalledWith(
        'test-file-id',
        'user-123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          fileId: 'test-file-id',
          urls: mockUrls,
        },
      });
    });

    it('should handle service errors', async () => {
      mockDeliveryService.getResponsiveUrls.mockRejectedValue(
        new AppError('Access denied', 'FORBIDDEN', 403)
      );

      await deliveryController.getResponsiveUrls(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied',
        },
      });
    });
  });

  describe('validatePresignedUrl', () => {
    it('should validate presigned URL successfully', async () => {
      mockRequest.body = {
        url: 'https://cdn.example.com/signed-url',
        path: 'product/123/test-file-id.jpg',
      };
      mockDeliveryService.validatePresignedAccess.mockResolvedValue(true);

      await deliveryController.validatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.validatePresignedAccess).toHaveBeenCalledWith(
        'https://cdn.example.com/signed-url',
        'product/123/test-file-id.jpg'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          valid: true,
          url: 'https://cdn.example.com/signed-url',
          path: 'product/123/test-file-id.jpg',
        },
      });
    });

    it('should return false for invalid URL', async () => {
      mockRequest.body = {
        url: 'https://cdn.example.com/invalid-url',
        path: 'product/123/test-file-id.jpg',
      };
      mockDeliveryService.validatePresignedAccess.mockResolvedValue(false);

      await deliveryController.validatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          valid: false,
          url: 'https://cdn.example.com/invalid-url',
          path: 'product/123/test-file-id.jpg',
        },
      });
    });

    it('should handle missing parameters', async () => {
      mockRequest.body = {
        url: 'https://cdn.example.com/signed-url',
        // Missing path
      };

      await deliveryController.validatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'URL and path are required',
        },
      });
    });
  });

  describe('getDeliveryInfo', () => {
    it('should get comprehensive delivery info', async () => {
      const mockResponsiveUrls = {
        thumbnail: 'https://cdn.example.com/thumb.jpg',
        small: 'https://cdn.example.com/small.jpg',
        medium: 'https://cdn.example.com/medium.jpg',
        large: 'https://cdn.example.com/large.jpg',
        original: 'https://cdn.example.com/original.jpg',
      };
      const mockPresignedUrl = 'https://cdn.example.com/presigned-url';

      mockDeliveryService.getResponsiveUrls.mockResolvedValue(
        mockResponsiveUrls
      );
      mockDeliveryService.generatePresignedUrl.mockResolvedValue(
        mockPresignedUrl
      );

      await deliveryController.getDeliveryInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeliveryService.getResponsiveUrls).toHaveBeenCalledWith(
        'test-file-id',
        'user-123'
      );
      expect(mockDeliveryService.generatePresignedUrl).toHaveBeenCalledWith(
        'test-file-id',
        'read',
        3600,
        'user-123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          fileId: 'test-file-id',
          responsiveUrls: mockResponsiveUrls,
          presignedUrl: mockPresignedUrl,
          directUrl: '/api/v1/files/test-file-id',
        },
      });
    });

    it('should handle service errors', async () => {
      mockDeliveryService.getResponsiveUrls.mockRejectedValue(
        new AppError('File not found', 'NOT_FOUND', 404)
      );

      await deliveryController.getDeliveryInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'File not found',
        },
      });
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors', async () => {
      mockDeliveryService.generatePresignedUrl.mockRejectedValue(
        new Error('Unexpected error')
      );

      await deliveryController.generatePresignedUrl(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    });
  });
});
