import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadController } from '../../controllers/upload.controller';
import { FileValidatorService } from '../../services/file-validator.service';
import { MetadataService } from '../../services/metadata.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { AccessLevel, EntityType, FileStatus } from '../../types/upload.types';

// Mock services
const mockFileValidator = {
  validateFile: vi.fn(),
} as unknown as FileValidatorService;

const mockStorageManager = {
  store: vi.fn(),
  delete: vi.fn(),
} as unknown as StorageManagerService;

const mockMetadataService = {
  createMetadata: vi.fn(),
  getMetadata: vi.fn(),
  updateMetadata: vi.fn(),
} as unknown as MetadataService;

describe('UploadController Unit Tests', () => {
  let controller: UploadController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new UploadController(
      mockFileValidator,
      mockStorageManager,
      mockMetadataService
    );

    mockRequest = {
      file: {
        buffer: Buffer.from('test-file-content'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File,
      body: {
        entityType: EntityType.USER_PROFILE,
        entityId: 'user-123',
        uploadedBy: 'user-123',
        accessLevel: AccessLevel.PUBLIC,
      },
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      // Arrange
      const mockValidationResult = { isValid: true, errors: [] };
      const mockStorageResult = {
        success: true,
        url: 'http://example.com/file.jpg',
      };
      const mockMetadata = {
        id: 'file-123',
        originalName: 'test.jpg',
        fileName: 'file-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: 'user_profile/user-123/file-123.jpg',
        url: 'http://example.com/file.jpg',
        uploadedBy: 'user-123',
        entityType: EntityType.USER_PROFILE,
        entityId: 'user-123',
        status: FileStatus.READY,
        accessLevel: AccessLevel.PUBLIC,
        permissions: {
          read: ['user-123'],
          write: ['user-123'],
          delete: ['user-123'],
        },
        metadata: {},
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockFileValidator.validateFile).mockResolvedValue(
        mockValidationResult
      );
      vi.mocked(mockStorageManager.store).mockResolvedValue(mockStorageResult);
      vi.mocked(mockMetadataService.createMetadata).mockResolvedValue(
        mockMetadata
      );

      // Act
      await controller.uploadFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockFileValidator.validateFile).toHaveBeenCalledWith({
        buffer: Buffer.from('test-file-content'),
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      });

      expect(mockStorageManager.store).toHaveBeenCalled();
      expect(mockMetadataService.createMetadata).toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          url: 'http://example.com/file.jpg',
          metadata: mockMetadata,
        }),
      });
    });

    it('should return 400 when no file is provided', async () => {
      // Arrange
      mockRequest.file = undefined;

      // Act
      await controller.uploadFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'No file provided',
        },
      });
    });

    it('should return 400 when file validation fails', async () => {
      // Arrange
      const mockValidationResult = {
        isValid: false,
        errors: ['Invalid file type', 'File too large'],
      };

      vi.mocked(mockFileValidator.validateFile).mockResolvedValue(
        mockValidationResult
      );

      // Act
      await controller.uploadFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'File validation failed: Invalid file type, File too large',
        },
      });
    });
  });

  describe('getFile', () => {
    it('should successfully get file metadata', async () => {
      // Arrange
      const fileId = 'file-123';
      const mockMetadata = {
        id: fileId,
        originalName: 'test.jpg',
        fileName: 'file-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: 'user_profile/user-123/file-123.jpg',
        url: 'http://example.com/file.jpg',
        uploadedBy: 'user-123',
        entityType: EntityType.USER_PROFILE,
        entityId: 'user-123',
        status: FileStatus.READY,
        accessLevel: AccessLevel.PUBLIC,
        permissions: {
          read: ['user-123'],
          write: ['user-123'],
          delete: ['user-123'],
        },
        metadata: {},
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { fileId };
      vi.mocked(mockMetadataService.getMetadata).mockResolvedValue(
        mockMetadata
      );

      // Act
      await controller.getFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockMetadataService.getMetadata).toHaveBeenCalledWith(fileId);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMetadata,
      });
    });

    it('should return 404 when file is not found', async () => {
      // Arrange
      const fileId = 'non-existent-file';
      mockRequest.params = { fileId };
      vi.mocked(mockMetadataService.getMetadata).mockResolvedValue(null);

      // Act
      await controller.getFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
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

  describe('uploadProfilePhoto', () => {
    it('should successfully upload a profile photo', async () => {
      // Arrange
      const userId = 'user-123';
      mockRequest.params = { userId };
      mockRequest.body = { uploadedBy: userId };

      const mockValidationResult = { isValid: true, errors: [] };
      const mockStorageResult = {
        success: true,
        url: 'http://example.com/profile.jpg',
      };
      const mockMetadata = {
        id: 'file-123',
        entityType: EntityType.USER_PROFILE,
        entityId: userId,
        accessLevel: AccessLevel.PUBLIC,
        tags: ['profile', 'avatar'],
      };

      vi.mocked(mockFileValidator.validateFile).mockResolvedValue(
        mockValidationResult
      );
      vi.mocked(mockStorageManager.store).mockResolvedValue(mockStorageResult);
      vi.mocked(mockMetadataService.createMetadata).mockResolvedValue(
        mockMetadata
      );

      // Act
      await controller.uploadProfilePhoto(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          url: 'http://example.com/profile.jpg',
          metadata: mockMetadata,
        }),
      });

      // Verify the metadata was created with correct profile-specific data
      expect(mockMetadataService.createMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: EntityType.USER_PROFILE,
          entityId: userId,
          accessLevel: AccessLevel.PUBLIC,
          metadata: { category: 'profile_photo' },
          tags: ['profile', 'avatar'],
        })
      );
    });
  });
});
