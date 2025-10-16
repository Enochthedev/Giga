import { readFileSync } from 'fs';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import * as examples from '../../client/examples';
import { UploadClient } from '../../client/upload-client';
import { AccessLevel, EntityType } from '../../types/upload.types';

// Mock fs module
vi.mock('fs');
const mockReadFileSync = readFileSync as Mock;

// Mock the upload client
vi.mock('../../client/upload-client');
const MockUploadClient = UploadClient as unknown as Mock;

describe('Upload Client Examples', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock client
    mockClient = {
      uploadProfilePhoto: vi.fn(),
      uploadMultipleFiles: vi.fn(),
      uploadDocument: vi.fn(),
      getProcessingStatus: vi.fn(),
      getFile: vi.fn(),
      retryProcessing: vi.fn(),
      searchFiles: vi.fn(),
      getMultipleFiles: vi.fn(),
      updateFileMetadata: vi.fn(),
      uploadFile: vi.fn(),
      deleteMultipleFiles: vi.fn(),
      getDownloadUrl: vi.fn(),
      getQueueHealth: vi.fn(),
    };

    // Set the mock client for examples
    examples.setClientForTesting(mockClient as any);

    // Mock file reading
    mockReadFileSync.mockReturnValue(Buffer.from('mock file content'));
  });

  describe('createBasicUploadClient', () => {
    it('should create upload client with correct configuration', () => {
      // Reset the global client first
      examples.resetClient();

      const client = examples.createBasicUploadClient();

      expect(client).toBeDefined();
      expect(typeof client).toBe('object');
    });
  });

  describe('uploadUserProfilePhoto', () => {
    it('should upload profile photo successfully', async () => {
      const mockResult = {
        success: true,
        data: {
          id: 'file-123',
          url: 'http://example.com/file-123',
          thumbnails: [
            {
              size: '150x150',
              url: 'http://example.com/thumb-150.jpg',
              width: 150,
              height: 150,
            },
          ],
        },
      };

      mockClient.uploadProfilePhoto.mockResolvedValueOnce(mockResult);

      const result = await examples.uploadUserProfilePhoto();

      expect(mockReadFileSync).toHaveBeenCalledWith(
        './path/to/profile-photo.jpg'
      );
      expect(mockClient.uploadProfilePhoto).toHaveBeenCalledWith(
        'user-123',
        Buffer.from('mock file content'),
        'profile-photo.jpg',
        'image/jpeg',
        'user-123'
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Upload failed');
      mockClient.uploadProfilePhoto.mockRejectedValueOnce(mockError);

      await expect(examples.uploadUserProfilePhoto()).rejects.toThrow(
        'Upload failed'
      );
    });
  });

  describe('uploadProductImages', () => {
    it('should upload multiple product images successfully', async () => {
      const mockResults = [
        {
          success: true,
          data: { id: 'file-1', url: 'http://example.com/file-1' },
        },
        {
          success: true,
          data: { id: 'file-2', url: 'http://example.com/file-2' },
        },
      ];

      mockClient.uploadMultipleFiles.mockResolvedValueOnce(mockResults);

      const result = await examples.uploadProductImages();

      expect(mockClient.uploadMultipleFiles).toHaveBeenCalledWith(
        [
          {
            buffer: Buffer.from('mock file content'),
            filename: 'product-image-1.jpg',
            mimeType: 'image/jpeg',
          },
          {
            buffer: Buffer.from('mock file content'),
            filename: 'product-image-2.jpg',
            mimeType: 'image/jpeg',
          },
        ],
        {
          uploadedBy: 'vendor-456',
          files: [
            {
              entityType: EntityType.PRODUCT,
              entityId: 'product-789',
              accessLevel: AccessLevel.PUBLIC,
              metadata: { isPrimary: true, category: 'main' },
              tags: ['product', 'ecommerce', 'featured'],
            },
            {
              entityType: EntityType.PRODUCT,
              entityId: 'product-789',
              accessLevel: AccessLevel.PUBLIC,
              metadata: { isPrimary: false, category: 'gallery' },
              tags: ['product', 'ecommerce', 'gallery'],
            },
          ],
        }
      );
      expect(result).toEqual(mockResults);
    });
  });

  describe('uploadDocument', () => {
    it('should upload document with custom metadata successfully', async () => {
      const mockResult = {
        success: true,
        data: {
          id: 'doc-123',
          url: 'http://example.com/doc-123',
        },
      };

      mockClient.uploadDocument.mockResolvedValueOnce(mockResult);

      const result = await examples.uploadDocument();

      expect(mockClient.uploadDocument).toHaveBeenCalledWith(
        Buffer.from('mock file content'),
        'contract.pdf',
        'application/pdf',
        {
          entityType: EntityType.DOCUMENT,
          entityId: 'contract-001',
          uploadedBy: 'user-123',
          accessLevel: AccessLevel.PRIVATE,
          metadata: {
            documentType: 'contract',
            version: '1.0',
            department: 'legal',
            confidential: true,
          },
          tags: ['contract', 'legal', 'confidential'],
        }
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('monitorFileProcessing', () => {
    it('should monitor processing until completion', async () => {
      const fileId = 'file-123';
      const mockFinalMetadata = {
        id: fileId,
        status: 'ready',
        url: 'http://example.com/file-123',
      };

      // Mock processing status progression
      mockClient.getProcessingStatus
        .mockResolvedValueOnce({ fileId, status: 'queued' })
        .mockResolvedValueOnce({ fileId, status: 'processing', progress: 50 })
        .mockResolvedValueOnce({ fileId, status: 'completed' });

      mockClient.getFile.mockResolvedValueOnce(mockFinalMetadata);

      const result = await examples.monitorFileProcessing(fileId);

      expect(mockClient.getProcessingStatus).toHaveBeenCalledTimes(3);
      expect(mockClient.getFile).toHaveBeenCalledWith(fileId);
      expect(result).toEqual(mockFinalMetadata);
    });

    it('should handle processing failure and retry', async () => {
      const fileId = 'file-123';

      mockClient.getProcessingStatus.mockResolvedValueOnce({
        fileId,
        status: 'failed',
        error: 'Processing failed',
      });

      mockClient.retryProcessing.mockResolvedValueOnce(true);

      await expect(examples.monitorFileProcessing(fileId)).rejects.toThrow(
        'File processing failed: Processing failed'
      );

      expect(mockClient.retryProcessing).toHaveBeenCalledWith(fileId);
    });
  });

  describe('searchAndManageFiles', () => {
    it('should search and manage files successfully', async () => {
      const mockSearchResults = {
        files: [
          { id: 'file-1', tags: ['product'], metadata: {} },
          { id: 'file-2', tags: ['product'], metadata: {} },
        ],
        total: 2,
      };

      const mockDetailedFiles = [
        { id: 'file-1', tags: ['product'], metadata: {} },
        { id: 'file-2', tags: ['product'], metadata: {} },
      ];

      const mockUpdatedFile = {
        id: 'file-1',
        tags: ['product', 'updated'],
        metadata: { lastModified: expect.any(String) },
      };

      mockClient.searchFiles.mockResolvedValueOnce(mockSearchResults);
      mockClient.getMultipleFiles.mockResolvedValueOnce(mockDetailedFiles);
      mockClient.updateFileMetadata.mockResolvedValueOnce(mockUpdatedFile);

      const result = await examples.searchAndManageFiles();

      expect(mockClient.searchFiles).toHaveBeenCalledWith({
        entityType: EntityType.PRODUCT,
        tags: ['product'],
        limit: 10,
        offset: 0,
      });
      expect(mockClient.getMultipleFiles).toHaveBeenCalledWith([
        'file-1',
        'file-2',
      ]);
      expect(mockClient.updateFileMetadata).toHaveBeenCalledWith('file-1', {
        tags: ['product', 'updated'],
        metadata: {
          lastModified: expect.any(String),
        },
      });
      expect(result).toEqual(mockSearchResults);
    });
  });

  describe('handleErrorsAndRetries', () => {
    it('should handle successful upload with retries', async () => {
      const mockResult = {
        success: true,
        data: { id: 'file-123', url: 'http://example.com/file-123' },
      };

      mockClient.uploadFile.mockResolvedValueOnce(mockResult);

      const result = await examples.handleErrorsAndRetries();

      expect(result).toEqual(mockResult);
    });

    it('should handle specific error types', async () => {
      const mockError = { code: 'FILE_TOO_LARGE', message: 'File too large' };
      mockClient.uploadFile.mockRejectedValueOnce(mockError);

      await expect(examples.handleErrorsAndRetries()).rejects.toEqual(
        mockError
      );
    });
  });

  describe('performBatchOperations', () => {
    it('should perform batch upload and delete operations', async () => {
      const mockUploadResults = [
        { success: true, data: { id: 'file-1' } },
        { success: true, data: { id: 'file-2' } },
        { success: true, data: { id: 'file-3' } },
      ];

      const mockDeleteResult = {
        totalProcessed: 2,
        successCount: 2,
        errorCount: 0,
        results: [
          { id: 'file-1', success: true },
          { id: 'file-2', success: true },
        ],
      };

      mockClient.uploadMultipleFiles.mockResolvedValueOnce(mockUploadResults);
      mockClient.deleteMultipleFiles.mockResolvedValueOnce(mockDeleteResult);

      const result = await examples.performBatchOperations();

      expect(mockClient.uploadMultipleFiles).toHaveBeenCalled();
      expect(mockClient.deleteMultipleFiles).toHaveBeenCalledWith([
        'file-1',
        'file-2',
      ]);
      expect(result).toEqual({
        uploadResults: mockUploadResults,
        deleteResult: mockDeleteResult,
      });
    });
  });

  describe('getPrivateFileDownloadUrl', () => {
    it('should upload private file and get download URL', async () => {
      const mockUploadResult = {
        success: true,
        data: { id: 'doc-123', url: 'http://example.com/doc-123' },
      };

      const mockDownloadUrl =
        'https://cdn.example.com/files/doc-123?token=abc123';

      mockClient.uploadDocument.mockResolvedValueOnce(mockUploadResult);
      mockClient.getDownloadUrl.mockResolvedValueOnce(mockDownloadUrl);

      const result = await examples.getPrivateFileDownloadUrl();

      expect(mockClient.uploadDocument).toHaveBeenCalled();
      expect(mockClient.getDownloadUrl).toHaveBeenCalledWith('doc-123', 3600);
      expect(result).toBe(mockDownloadUrl);
    });

    it('should handle upload failure', async () => {
      const mockUploadResult = { success: false };
      mockClient.uploadDocument.mockResolvedValueOnce(mockUploadResult);

      await expect(examples.getPrivateFileDownloadUrl()).rejects.toThrow(
        'Upload failed'
      );
    });
  });

  describe('monitorQueueHealth', () => {
    it('should monitor queue health successfully', async () => {
      const mockHealth = {
        active: 5,
        waiting: 10,
        completed: 100,
        failed: 2,
        delayed: 0,
        paused: false,
      };

      mockClient.getQueueHealth.mockResolvedValueOnce(mockHealth);

      const result = await examples.monitorQueueHealth();

      expect(mockClient.getQueueHealth).toHaveBeenCalled();
      expect(result).toEqual(mockHealth);
    });

    it('should detect unhealthy queue conditions', async () => {
      const mockHealth = {
        active: 5,
        waiting: 150, // High backlog
        completed: 100,
        failed: 15, // High failure rate
        delayed: 0,
        paused: true, // Queue is paused
      };

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockClient.getQueueHealth.mockResolvedValueOnce(mockHealth);

      const result = await examples.monitorQueueHealth();

      expect(consoleSpy).toHaveBeenCalledWith(
        'High number of failed jobs detected!'
      );
      expect(consoleSpy).toHaveBeenCalledWith('Queue backlog is high!');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Queue is paused!');
      expect(result).toEqual(mockHealth);

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('nextJsApiRouteExample', () => {
    it('should return Next.js API route code example', () => {
      const example = examples.nextJsApiRouteExample();

      expect(typeof example).toBe('string');
      expect(example).toContain('pages/api/upload.js');
      expect(example).toContain('createUploadClient');
      expect(example).toContain('export async function POST');
    });
  });
});
