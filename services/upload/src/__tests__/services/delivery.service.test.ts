import { Request, Response } from 'express';
import { vi } from 'vitest';
import {
  DeliveryOptions,
  DeliveryService,
} from '../../services/delivery.service';
import {
  AccessLevel,
  EntityType,
  FileMetadata,
  FileStatus,
} from '../../types/upload.types';
import { AppError } from '../../utils/error-utils';

describe('DeliveryService', () => {
  let deliveryService: DeliveryService;
  let mockMetadataService: any;
  let mockStorageManager: any;
  let mockPermissionService: any;
  let mockCDNService: any;
  let mockOptions: DeliveryOptions;
  let mockFileMetadata: FileMetadata;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockMetadataService = {
      getMetadata: vi.fn(),
    };
    mockStorageManager = {
      retrieve: vi.fn(),
    };
    mockPermissionService = {
      checkFileAccess: vi.fn(),
    };
    mockCDNService = {
      generateCDNUrl: vi.fn(),
      generateCacheHeaders: vi.fn(),
      generatePresignedUrl: vi.fn(),
      generateResponsiveUrls: vi.fn(),
      validatePresignedUrl: vi.fn(),
    };

    mockOptions = {
      enableCDN: true,
      enableCaching: true,
      enableCompression: true,
      enableRangeRequests: true,
      maxCacheAge: 86400,
    };

    mockFileMetadata = {
      id: 'test-file-id',
      originalName: 'test-image.jpg',
      fileName: 'test-file-id.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      path: 'product/123/test-file-id.jpg',
      url: '/api/v1/uploads/test-file-id',
      uploadedBy: 'user-123',
      entityType: EntityType.PRODUCT,
      entityId: '123',
      accessLevel: AccessLevel.PUBLIC,
      status: FileStatus.READY,
      metadata: {},
      tags: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    };

    mockRequest = {
      params: { fileId: 'test-file-id' },
      headers: {
        accept: 'image/webp,image/*',
        'user-agent': 'Mozilla/5.0',
      },
      query: {},
      user: { id: 'user-123' },
    };

    mockResponse = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      end: vi.fn(),
      json: vi.fn(),
    };

    deliveryService = new DeliveryService(
      mockMetadataService,
      mockStorageManager,
      mockPermissionService,
      mockCDNService,
      mockOptions
    );
  });

  describe('generatePresignedUrl', () => {
    beforeEach(() => {
      mockMetadataService.getMetadata.mockResolvedValue(mockFileMetadata);
      mockPermissionService.checkFileAccess.mockResolvedValue(true);
      mockCDNService.generatePresignedUrl.mockReturnValue(
        'https://cdn.example.com/signed-url'
      );
    });

    it('should generate presigned URL for authorized user with private file', async () => {
      const privateFile = {
        ...mockFileMetadata,
        accessLevel: AccessLevel.PRIVATE,
      };
      mockMetadataService.getMetadata.mockResolvedValue(privateFile);

      const result = await deliveryService.generatePresignedUrl(
        'test-file-id',
        'read',
        3600,
        'user-123'
      );

      expect(result).toBe('https://cdn.example.com/signed-url');
      expect(mockMetadataService.getMetadata).toHaveBeenCalledWith(
        'test-file-id'
      );
      expect(mockPermissionService.checkFileAccess).toHaveBeenCalledWith(
        privateFile,
        'user-123',
        'read'
      );
      expect(mockCDNService.generatePresignedUrl).toHaveBeenCalledWith(
        privateFile,
        'read',
        3600
      );
    });

    it('should generate presigned URL for public files without user check', async () => {
      const result = await deliveryService.generatePresignedUrl(
        'test-file-id',
        'read',
        3600
      );

      expect(result).toBe('https://cdn.example.com/signed-url');
      expect(mockPermissionService.checkFileAccess).not.toHaveBeenCalled();
    });

    it('should throw error for non-existent file', async () => {
      mockMetadataService.getMetadata.mockResolvedValue(null);

      await expect(
        deliveryService.generatePresignedUrl(
          'non-existent',
          'read',
          3600,
          'user-123'
        )
      ).rejects.toThrow(AppError);
    });

    it('should throw error for unauthorized access', async () => {
      const privateFile = {
        ...mockFileMetadata,
        accessLevel: AccessLevel.PRIVATE,
      };
      mockMetadataService.getMetadata.mockResolvedValue(privateFile);
      mockPermissionService.checkFileAccess.mockResolvedValue(false);

      await expect(
        deliveryService.generatePresignedUrl(
          'test-file-id',
          'read',
          3600,
          'user-123'
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe('getResponsiveUrls', () => {
    beforeEach(() => {
      mockMetadataService.getMetadata.mockResolvedValue(mockFileMetadata);
      mockPermissionService.checkFileAccess.mockResolvedValue(true);
      mockCDNService.generateResponsiveUrls.mockReturnValue({
        thumbnail: 'https://cdn.example.com/thumb.jpg',
        small: 'https://cdn.example.com/small.jpg',
        medium: 'https://cdn.example.com/medium.jpg',
        large: 'https://cdn.example.com/large.jpg',
        original: 'https://cdn.example.com/original.jpg',
      });
    });

    it('should generate responsive URLs for authorized user', async () => {
      const result = await deliveryService.getResponsiveUrls(
        'test-file-id',
        'user-123'
      );

      expect(result).toEqual({
        thumbnail: 'https://cdn.example.com/thumb.jpg',
        small: 'https://cdn.example.com/small.jpg',
        medium: 'https://cdn.example.com/medium.jpg',
        large: 'https://cdn.example.com/large.jpg',
        original: 'https://cdn.example.com/original.jpg',
      });
      expect(mockCDNService.generateResponsiveUrls).toHaveBeenCalledWith(
        mockFileMetadata
      );
    });

    it('should generate responsive URLs for public files without user check', async () => {
      const result = await deliveryService.getResponsiveUrls('test-file-id');

      expect(result).toBeDefined();
      expect(mockPermissionService.checkFileAccess).not.toHaveBeenCalled();
    });

    it('should throw error for unauthorized access to private files', async () => {
      const privateFile = {
        ...mockFileMetadata,
        accessLevel: AccessLevel.PRIVATE,
      };
      mockMetadataService.getMetadata.mockResolvedValue(privateFile);
      mockPermissionService.checkFileAccess.mockResolvedValue(false);

      await expect(
        deliveryService.getResponsiveUrls('test-file-id', 'user-123')
      ).rejects.toThrow(AppError);
    });
  });

  describe('validatePresignedAccess', () => {
    it('should validate presigned URL successfully', async () => {
      mockCDNService.validatePresignedUrl.mockReturnValue(true);

      const result = await deliveryService.validatePresignedAccess(
        'https://cdn.example.com/signed-url',
        'product/123/test-file-id.jpg'
      );

      expect(result).toBe(true);
      expect(mockCDNService.validatePresignedUrl).toHaveBeenCalledWith(
        'https://cdn.example.com/signed-url',
        'product/123/test-file-id.jpg'
      );
    });

    it('should return false for invalid presigned URL', async () => {
      mockCDNService.validatePresignedUrl.mockReturnValue(false);

      const result = await deliveryService.validatePresignedAccess(
        'https://cdn.example.com/invalid-url',
        'product/123/test-file-id.jpg'
      );

      expect(result).toBe(false);
    });

    it('should handle validation errors gracefully', async () => {
      mockCDNService.validatePresignedUrl.mockImplementation(() => {
        throw new Error('Validation error');
      });

      const result = await deliveryService.validatePresignedAccess(
        'https://cdn.example.com/error-url',
        'product/123/test-file-id.jpg'
      );

      expect(result).toBe(false);
    });
  });
});
