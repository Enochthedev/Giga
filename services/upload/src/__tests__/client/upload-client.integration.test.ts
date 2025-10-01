import axios from 'axios';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadClient, createUploadClient } from '../../client/upload-client';
import {
  AccessLevel,
  EntityType,
  UploadErrorCode,
} from '../../types/upload.types';

// Mock axios for testing
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('UploadClient Integration Tests', () => {
  let client: UploadClient;
  let mockAxiosInstance: any;

  beforeAll(() => {
    // Setup mock axios instance
    mockAxiosInstance = {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    client = createUploadClient({
      baseURL: 'http://localhost:3005',
      serviceToken: 'test-token',
      retryAttempts: 2,
      retryDelay: 100,
    });
  });

  describe('Client Configuration', () => {
    it('should create client with default configuration', () => {
      const defaultClient = createUploadClient({
        baseURL: 'http://localhost:3005',
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3005',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create client with custom configuration', () => {
      createUploadClient({
        baseURL: 'http://localhost:3005',
        serviceToken: 'custom-token',
        apiKey: 'api-key',
        timeout: 60000,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3005',
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer custom-token',
          'X-API-Key': 'api-key',
        },
      });
    });
  });

  describe('File Upload Operations', () => {
    const mockFileBuffer = Buffer.from('test file content');
    const mockUploadResult = {
      success: true,
      data: {
        id: 'file-123',
        url: 'http://localhost:3005/files/file-123',
        metadata: {
          id: 'file-123',
          originalName: 'test.jpg',
          size: 1024,
          mimeType: 'image/jpeg',
        },
      },
    };

    it('should upload a single file successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadFile(
        mockFileBuffer,
        'test.jpg',
        'image/jpeg',
        {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
          accessLevel: AccessLevel.PUBLIC,
        }
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload',
        expect.any(Object), // FormData
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload multiple files successfully', async () => {
      const mockMultipleResults = [mockUploadResult, mockUploadResult];
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { data: mockMultipleResults },
      });

      const files = [
        {
          buffer: mockFileBuffer,
          filename: 'test1.jpg',
          mimeType: 'image/jpeg',
        },
        {
          buffer: mockFileBuffer,
          filename: 'test2.jpg',
          mimeType: 'image/jpeg',
        },
      ];

      const result = await client.uploadMultipleFiles(files, {
        uploadedBy: 'user-123',
        files: [
          {
            entityType: EntityType.PRODUCT,
            entityId: 'product-1',
            accessLevel: AccessLevel.PUBLIC,
          },
          {
            entityType: EntityType.PRODUCT,
            entityId: 'product-2',
            accessLevel: AccessLevel.PUBLIC,
          },
        ],
      });

      expect(result).toEqual(mockMultipleResults);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/multiple',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload profile photo successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadProfilePhoto(
        'user-123',
        mockFileBuffer,
        'avatar.jpg',
        'image/jpeg'
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/profile/user-123',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload product image successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadProductImage(
        'product-456',
        mockFileBuffer,
        'product.jpg',
        'image/jpeg',
        'vendor-789',
        true
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/product/product-456',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload property photo successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadPropertyPhoto(
        'property-789',
        mockFileBuffer,
        'room.jpg',
        'image/jpeg',
        'hotel-manager-123',
        { roomType: 'deluxe', isPrimary: true }
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/property/property-789',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload vehicle photo successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadVehiclePhoto(
        'vehicle-456',
        mockFileBuffer,
        'car.jpg',
        'image/jpeg',
        'driver-789',
        'exterior'
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/vehicle/vehicle-456',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });

    it('should upload document successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockUploadResult,
      });

      const result = await client.uploadDocument(
        mockFileBuffer,
        'document.pdf',
        'application/pdf',
        {
          entityType: EntityType.DOCUMENT,
          entityId: 'doc-123',
          uploadedBy: 'user-456',
          accessLevel: AccessLevel.PRIVATE,
          metadata: { category: 'contract' },
          tags: ['legal'],
        }
      );

      expect(result).toEqual(mockUploadResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/document',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });
  });

  describe('File Management Operations', () => {
    it('should get file metadata successfully', async () => {
      const mockMetadata = {
        id: 'file-123',
        originalName: 'test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
        status: 'ready',
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: mockMetadata },
      });

      const result = await client.getFile('file-123');

      expect(result).toEqual(mockMetadata);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/upload/file-123'
      );
    });

    it('should get multiple files metadata successfully', async () => {
      const mockFiles = [
        { id: 'file-1', originalName: 'test1.jpg' },
        { id: 'file-2', originalName: 'test2.jpg' },
      ];

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { data: mockFiles },
      });

      const result = await client.getMultipleFiles(['file-1', 'file-2']);

      expect(result).toEqual(mockFiles);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/batch/get',
        { fileIds: ['file-1', 'file-2'] }
      );
    });

    it('should delete file successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await client.deleteFile('file-123');

      expect(result).toBe(true);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/api/v1/upload/file-123'
      );
    });

    it('should delete multiple files successfully', async () => {
      const mockBatchResult = {
        success: true,
        totalProcessed: 2,
        successCount: 2,
        errorCount: 0,
        results: [
          { id: 'file-1', success: true },
          { id: 'file-2', success: true },
        ],
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        data: mockBatchResult,
      });

      const result = await client.deleteMultipleFiles(['file-1', 'file-2']);

      expect(result).toEqual(mockBatchResult);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/batch/delete',
        { fileIds: ['file-1', 'file-2'] }
      );
    });

    it('should update file metadata successfully', async () => {
      const mockUpdatedMetadata = {
        id: 'file-123',
        tags: ['updated'],
        metadata: { processed: true },
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        data: { data: mockUpdatedMetadata },
      });

      const result = await client.updateFileMetadata('file-123', {
        tags: ['updated'],
        metadata: { processed: true },
      });

      expect(result).toEqual(mockUpdatedMetadata);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/api/v1/upload/file-123',
        { tags: ['updated'], metadata: { processed: true } }
      );
    });
  });

  describe('Processing and Monitoring Operations', () => {
    it('should get processing status successfully', async () => {
      const mockStatus = {
        fileId: 'file-123',
        status: 'processing',
        progress: 50,
        jobs: ['job-1', 'job-2'],
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: mockStatus },
      });

      const result = await client.getProcessingStatus('file-123');

      expect(result).toEqual(mockStatus);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/upload/file-123/status'
      );
    });

    it('should retry processing successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await client.retryProcessing('file-123');

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/file-123/retry'
      );
    });

    it('should cancel processing successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { cancelled: true },
      });

      const result = await client.cancelProcessing('file-123');

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/upload/file-123/cancel'
      );
    });

    it('should get queue health successfully', async () => {
      const mockHealth = {
        active: 5,
        waiting: 10,
        completed: 100,
        failed: 2,
        delayed: 0,
        paused: false,
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: mockHealth },
      });

      const result = await client.getQueueHealth();

      expect(result).toEqual(mockHealth);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/upload/queue/health'
      );
    });
  });

  describe('Search and Discovery Operations', () => {
    it('should search files successfully', async () => {
      const mockSearchResults = {
        files: [
          { id: 'file-1', originalName: 'test1.jpg' },
          { id: 'file-2', originalName: 'test2.jpg' },
        ],
        total: 2,
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: mockSearchResults },
      });

      const result = await client.searchFiles({
        entityType: EntityType.PRODUCT,
        tags: ['featured'],
        limit: 10,
      });

      expect(result).toEqual(mockSearchResults);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/upload/search',
        {
          params: {
            entityType: EntityType.PRODUCT,
            tags: ['featured'],
            limit: 10,
          },
        }
      );
    });

    it('should get download URL successfully', async () => {
      const mockDownloadUrl =
        'https://cdn.example.com/files/file-123?token=abc123';

      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: { url: mockDownloadUrl } },
      });

      const result = await client.getDownloadUrl('file-123', 3600);

      expect(result).toBe(mockDownloadUrl);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/upload/file-123/download-url',
        { params: { expiresIn: 3600 } }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors correctly', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              code: UploadErrorCode.INVALID_FILE_TYPE,
              message: 'File type not supported',
              details: { allowedTypes: ['image/jpeg', 'image/png'] },
            },
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        client.uploadFile(Buffer.from('test'), 'test.txt', 'text/plain', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toMatchObject({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        message: 'File type not supported',
        details: { allowedTypes: ['image/jpeg', 'image/png'] },
        retryable: false,
      });
    });

    it('should handle network errors correctly', async () => {
      const mockError = {
        code: 'ECONNREFUSED',
        message: 'Connection refused',
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        client.uploadFile(Buffer.from('test'), 'test.jpg', 'image/jpeg', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toMatchObject({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Upload service is unavailable',
        retryable: true,
      });
    });

    it('should handle timeout errors correctly', async () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'Request timeout',
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        client.uploadFile(Buffer.from('test'), 'test.jpg', 'image/jpeg', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toMatchObject({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Request timeout',
        retryable: true,
      });
    });
  });

  describe('Retry Logic', () => {
    it('should retry on server errors', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: { message: 'Internal server error' } },
        },
      };

      // First two calls fail, third succeeds
      mockAxiosInstance.post
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({
          data: {
            success: true,
            data: { id: 'file-123', url: 'http://example.com/file-123' },
          },
        });

      const result = await client.uploadFile(
        Buffer.from('test'),
        'test.jpg',
        'image/jpeg',
        {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        }
      );

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);
    });

    it('should retry on rate limiting', async () => {
      const mockError = {
        response: {
          status: 429,
          data: { error: { message: 'Rate limit exceeded' } },
        },
      };

      // First call fails with rate limit, second succeeds
      mockAxiosInstance.post
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({
          data: {
            success: true,
            data: { id: 'file-123', url: 'http://example.com/file-123' },
          },
        });

      const result = await client.uploadFile(
        Buffer.from('test'),
        'test.jpg',
        'image/jpeg',
        {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        }
      );

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
    });

    it('should not retry on client errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              code: UploadErrorCode.INVALID_FILE_TYPE,
              message: 'Invalid file type',
            },
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        client.uploadFile(Buffer.from('test'), 'test.txt', 'text/plain', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toMatchObject({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        retryable: false,
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });

    it('should respect maximum retry attempts', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { error: { message: 'Internal server error' } },
        },
      };

      // All calls fail
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(
        client.uploadFile(Buffer.from('test'), 'test.jpg', 'image/jpeg', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toMatchObject({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        retryable: true,
      });

      // Should be called 3 times: initial + 2 retries
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);
    });
  });

  describe('Custom Retry Conditions', () => {
    it('should use custom retry condition', async () => {
      const customClient = createUploadClient({
        baseURL: 'http://localhost:3005',
        retryAttempts: 2,
        retryCondition: error => {
          // Only retry on 503 Service Unavailable
          return error.response?.status === 503;
        },
      });

      const mockError = {
        response: {
          status: 500,
          data: { error: { message: 'Internal server error' } },
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(
        customClient.uploadFile(Buffer.from('test'), 'test.jpg', 'image/jpeg', {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          uploadedBy: 'user-456',
        })
      ).rejects.toThrow();

      // Should not retry because custom condition doesn't match
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });
  });
});
