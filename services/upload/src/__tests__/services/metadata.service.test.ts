import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AccessOperation,
  RelationshipType,
} from '../../interfaces/metadata.interface';
import { MetadataService } from '../../services/metadata.service';
import { AccessLevel, EntityType, FileStatus } from '../../types/upload.types';

// Mock Prisma client
const mockPrismaClient = {
  fileMetadata: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  fileRelationship: {
    upsert: vi.fn(),
    deleteMany: vi.fn(),
    findMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

// Mock logger
vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('MetadataService', () => {
  let metadataService: MetadataService;

  beforeEach(() => {
    vi.clearAllMocks();
    metadataService = new MetadataService(mockPrismaClient as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createMetadata', () => {
    it('should create metadata successfully', async () => {
      const mockRequest = {
        originalName: 'test.jpg',
        fileName: 'test-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: '/uploads/test-123.jpg',
        url: 'https://example.com/test-123.jpg',
        uploadedBy: 'user-123',
        entityType: EntityType.USER_PROFILE,
        entityId: 'profile-123',
        accessLevel: AccessLevel.PRIVATE,
        metadata: { width: 800, height: 600 },
        tags: ['profile', 'avatar'],
      };

      const mockCreatedFile = {
        id: 'file-123',
        ...mockRequest,
        status: 'UPLOADING',
        createdAt: new Date(),
        updatedAt: new Date(),
        cdnUrl: null,
        processingResults: null,
        thumbnails: null,
        permissions: null,
        expiresAt: null,
      };

      mockPrismaClient.fileMetadata.create.mockResolvedValue(mockCreatedFile);

      const result = await metadataService.createMetadata(mockRequest);

      expect(mockPrismaClient.fileMetadata.create).toHaveBeenCalledWith({
        data: {
          id: undefined,
          originalName: mockRequest.originalName,
          fileName: mockRequest.fileName,
          mimeType: mockRequest.mimeType,
          size: mockRequest.size,
          path: mockRequest.path,
          url: mockRequest.url,
          cdnUrl: undefined,
          uploadedBy: mockRequest.uploadedBy,
          entityType: mockRequest.entityType,
          entityId: mockRequest.entityId,
          accessLevel: mockRequest.accessLevel,
          status: 'UPLOADING',
          metadata: mockRequest.metadata,
          tags: mockRequest.tags,
          expiresAt: undefined,
        },
      });

      expect(result).toEqual({
        id: 'file-123',
        originalName: mockRequest.originalName,
        fileName: mockRequest.fileName,
        mimeType: mockRequest.mimeType,
        size: mockRequest.size,
        path: mockRequest.path,
        url: mockRequest.url,
        cdnUrl: undefined,
        uploadedBy: mockRequest.uploadedBy,
        entityType: mockRequest.entityType,
        entityId: mockRequest.entityId,
        status: 'uploading',
        processingResults: undefined,
        thumbnails: undefined,
        accessLevel: mockRequest.accessLevel,
        metadata: mockRequest.metadata,
        tags: mockRequest.tags,
        createdAt: mockCreatedFile.createdAt,
        updatedAt: mockCreatedFile.updatedAt,
        expiresAt: undefined,
      });
    });

    it('should handle creation errors', async () => {
      const mockRequest = {
        originalName: 'test.jpg',
        fileName: 'test-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: '/uploads/test-123.jpg',
        url: 'https://example.com/test-123.jpg',
        uploadedBy: 'user-123',
        entityType: EntityType.USER_PROFILE,
        entityId: 'profile-123',
        accessLevel: AccessLevel.PRIVATE,
      };

      mockPrismaClient.fileMetadata.create.mockRejectedValue(
        new Error('Database error')
      );

      await expect(metadataService.createMetadata(mockRequest)).rejects.toThrow(
        'Failed to create metadata: Database error'
      );
    });
  });

  describe('getMetadata', () => {
    it('should return metadata when file exists', async () => {
      const mockFile = {
        id: 'file-123',
        originalName: 'test.jpg',
        fileName: 'test-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: '/uploads/test-123.jpg',
        url: 'https://example.com/test-123.jpg',
        cdnUrl: null,
        uploadedBy: 'user-123',
        entityType: 'USER_PROFILE',
        entityId: 'profile-123',
        status: 'READY',
        processingResults: null,
        thumbnails: null,
        accessLevel: 'PRIVATE',
        permissions: null,
        metadata: {},
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: null,
      };

      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(mockFile);

      const result = await metadataService.getMetadata('file-123');

      expect(mockPrismaClient.fileMetadata.findUnique).toHaveBeenCalledWith({
        where: { id: 'file-123' },
      });

      expect(result).toEqual({
        id: 'file-123',
        originalName: 'test.jpg',
        fileName: 'test-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: '/uploads/test-123.jpg',
        url: 'https://example.com/test-123.jpg',
        cdnUrl: undefined,
        uploadedBy: 'user-123',
        entityType: EntityType.USER_PROFILE,
        entityId: 'profile-123',
        status: 'ready',
        processingResults: undefined,
        thumbnails: undefined,
        accessLevel: AccessLevel.PRIVATE,
        metadata: {},
        tags: [],
        createdAt: mockFile.createdAt,
        updatedAt: mockFile.updatedAt,
        expiresAt: undefined,
      });
    });

    it('should return null when file does not exist', async () => {
      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(null);

      const result = await metadataService.getMetadata('non-existent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockPrismaClient.fileMetadata.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(metadataService.getMetadata('file-123')).rejects.toThrow(
        'Failed to get metadata: Database error'
      );
    });
  });

  describe('updateMetadata', () => {
    it('should update metadata successfully', async () => {
      const updates = {
        status: FileStatus.READY,
        cdnUrl: 'https://cdn.example.com/test-123.jpg',
        processingResults: {
          originalSize: 2048,
          processedSize: 1024,
          format: 'webp',
          dimensions: { width: 800, height: 600 },
          compressionRatio: 0.5,
          processingTime: 150,
        },
      };

      const mockUpdatedFile = {
        id: 'file-123',
        originalName: 'test.jpg',
        fileName: 'test-123.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        path: '/uploads/test-123.jpg',
        url: 'https://example.com/test-123.jpg',
        cdnUrl: 'https://cdn.example.com/test-123.jpg',
        uploadedBy: 'user-123',
        entityType: 'USER_PROFILE',
        entityId: 'profile-123',
        status: 'READY',
        processingResults: {
          originalSize: 2048,
          processedSize: 1024,
          format: 'webp',
          dimensions: { width: 800, height: 600 },
          compressionRatio: 0.5,
          processingTime: 150,
        },
        thumbnails: null,
        accessLevel: 'PRIVATE',
        permissions: null,
        metadata: {},
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: null,
      };

      mockPrismaClient.fileMetadata.update.mockResolvedValue(mockUpdatedFile);

      const result = await metadataService.updateMetadata('file-123', updates);

      expect(mockPrismaClient.fileMetadata.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: {
          status: 'ready',
          cdnUrl: 'https://cdn.example.com/test-123.jpg',
          processingResults: {
            originalSize: 2048,
            processedSize: 1024,
            format: 'webp',
            dimensions: { width: 800, height: 600 },
            compressionRatio: 0.5,
            processingTime: 150,
          },
        },
      });

      expect(result.status).toBe(FileStatus.READY);
      expect(result.cdnUrl).toBe('https://cdn.example.com/test-123.jpg');
    });

    it('should handle update errors', async () => {
      mockPrismaClient.fileMetadata.update.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        metadataService.updateMetadata('file-123', { status: FileStatus.READY })
      ).rejects.toThrow('Failed to update metadata: Database error');
    });
  });

  describe('deleteMetadata', () => {
    it('should delete metadata successfully', async () => {
      mockPrismaClient.fileMetadata.delete.mockResolvedValue({});

      const result = await metadataService.deleteMetadata('file-123');

      expect(mockPrismaClient.fileMetadata.delete).toHaveBeenCalledWith({
        where: { id: 'file-123' },
      });

      expect(result).toBe(true);
    });

    it('should return false on delete error', async () => {
      mockPrismaClient.fileMetadata.delete.mockRejectedValue(
        new Error('Database error')
      );

      const result = await metadataService.deleteMetadata('file-123');

      expect(result).toBe(false);
    });
  });

  describe('findByEntity', () => {
    it('should find files by entity type and ID', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          originalName: 'test1.jpg',
          fileName: 'test1-123.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          path: '/uploads/test1-123.jpg',
          url: 'https://example.com/test1-123.jpg',
          cdnUrl: null,
          uploadedBy: 'user-123',
          entityType: 'PRODUCT',
          entityId: 'product-123',
          status: 'READY',
          processingResults: null,
          thumbnails: null,
          accessLevel: 'PUBLIC',
          permissions: null,
          metadata: {},
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: null,
        },
      ];

      mockPrismaClient.fileMetadata.findMany.mockResolvedValue(mockFiles);

      const result = await metadataService.findByEntity(
        EntityType.PRODUCT,
        'product-123'
      );

      expect(mockPrismaClient.fileMetadata.findMany).toHaveBeenCalledWith({
        where: {
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          status: { not: 'DELETED' },
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toHaveLength(1);
      expect(result[0].entityType).toBe(EntityType.PRODUCT);
      expect(result[0].entityId).toBe('product-123');
    });
  });

  describe('searchFiles', () => {
    it('should search files with query parameters', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          originalName: 'test1.jpg',
          fileName: 'test1-123.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          path: '/uploads/test1-123.jpg',
          url: 'https://example.com/test1-123.jpg',
          cdnUrl: null,
          uploadedBy: 'user-123',
          entityType: 'PRODUCT',
          entityId: 'product-123',
          status: 'READY',
          processingResults: null,
          thumbnails: null,
          accessLevel: 'PUBLIC',
          permissions: null,
          metadata: {},
          tags: ['product'],
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: null,
        },
      ];

      mockPrismaClient.fileMetadata.findMany.mockResolvedValue(mockFiles);
      mockPrismaClient.fileMetadata.count.mockResolvedValue(1);

      const query = {
        entityType: EntityType.PRODUCT,
        tags: ['product'],
        limit: 10,
        offset: 0,
      };

      const result = await metadataService.searchFiles(query);

      expect(result.files).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.hasMore).toBe(false);
      expect(result.nextOffset).toBeUndefined();
    });

    it('should handle search with text query', async () => {
      mockPrismaClient.fileMetadata.findMany.mockResolvedValue([]);
      mockPrismaClient.fileMetadata.count.mockResolvedValue(0);

      const query = {
        searchText: 'test',
        limit: 10,
      };

      await metadataService.searchFiles(query);

      expect(mockPrismaClient.fileMetadata.findMany).toHaveBeenCalledWith({
        where: {
          status: { not: 'DELETED' },
          OR: [
            { originalName: { contains: 'test', mode: 'insensitive' } },
            { fileName: { contains: 'test', mode: 'insensitive' } },
            { tags: { hasSome: ['test'] } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });
  });

  describe('linkFiles', () => {
    it('should link files with relationships', async () => {
      mockPrismaClient.$transaction.mockImplementation(operations =>
        Promise.all(operations.map((op: unknown) => op))
      );
      mockPrismaClient.fileRelationship.upsert.mockResolvedValue({});

      const result = await metadataService.linkFiles(
        'parent-123',
        ['child-1', 'child-2'],
        RelationshipType.THUMBNAIL
      );

      expect(mockPrismaClient.$transaction).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle linking errors', async () => {
      mockPrismaClient.$transaction.mockRejectedValue(
        new Error('Database error')
      );

      const result = await metadataService.linkFiles('parent-123', ['child-1']);

      expect(result).toBe(false);
    });
  });

  describe('unlinkFiles', () => {
    it('should unlink files successfully', async () => {
      mockPrismaClient.fileRelationship.deleteMany.mockResolvedValue({
        count: 2,
      });

      const result = await metadataService.unlinkFiles('parent-123', [
        'child-1',
        'child-2',
      ]);

      expect(mockPrismaClient.fileRelationship.deleteMany).toHaveBeenCalledWith(
        {
          where: {
            parentId: 'parent-123',
            childId: { in: ['child-1', 'child-2'] },
          },
        }
      );

      expect(result).toBe(true);
    });

    it('should handle unlinking errors', async () => {
      mockPrismaClient.fileRelationship.deleteMany.mockRejectedValue(
        new Error('Database error')
      );

      const result = await metadataService.unlinkFiles('parent-123', [
        'child-1',
      ]);

      expect(result).toBe(false);
    });
  });

  describe('getRelatedFiles', () => {
    it('should get related files successfully', async () => {
      const mockParentRelationships = [
        {
          id: 'rel-1',
          parentId: 'parent-123',
          childId: 'file-123',
          relationshipType: 'THUMBNAIL',
          createdAt: new Date(),
          parent: {
            id: 'parent-123',
            originalName: 'parent.jpg',
            fileName: 'parent-123.jpg',
            mimeType: 'image/jpeg',
            size: 2048,
            path: '/uploads/parent-123.jpg',
            url: 'https://example.com/parent-123.jpg',
            cdnUrl: null,
            uploadedBy: 'user-123',
            entityType: 'PRODUCT',
            entityId: 'product-123',
            status: 'READY',
            processingResults: null,
            thumbnails: null,
            accessLevel: 'PUBLIC',
            permissions: null,
            metadata: {},
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: null,
          },
        },
      ];

      const mockChildRelationships = [
        {
          id: 'rel-2',
          parentId: 'file-123',
          childId: 'child-123',
          relationshipType: 'VARIANT',
          createdAt: new Date(),
          child: {
            id: 'child-123',
            originalName: 'child.jpg',
            fileName: 'child-123.jpg',
            mimeType: 'image/jpeg',
            size: 512,
            path: '/uploads/child-123.jpg',
            url: 'https://example.com/child-123.jpg',
            cdnUrl: null,
            uploadedBy: 'user-123',
            entityType: 'PRODUCT',
            entityId: 'product-123',
            status: 'READY',
            processingResults: null,
            thumbnails: null,
            accessLevel: 'PUBLIC',
            permissions: null,
            metadata: {},
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: null,
          },
        },
      ];

      mockPrismaClient.fileRelationship.findMany
        .mockResolvedValueOnce(mockParentRelationships)
        .mockResolvedValueOnce(mockChildRelationships)
        .mockResolvedValueOnce([]); // siblings

      const result = await metadataService.getRelatedFiles('file-123');

      expect(result.parent).toBeDefined();
      expect(result.children).toHaveLength(1);
      expect(result.siblings).toHaveLength(0);
      expect(result.relationships).toHaveLength(2);
    });
  });

  describe('checkAccess', () => {
    it('should allow access to public files for read operation', async () => {
      const mockFile = {
        id: 'file-123',
        uploadedBy: 'user-123',
        accessLevel: 'PUBLIC',
        permissions: null,
      };

      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(mockFile);

      const result = await metadataService.checkAccess(
        'file-123',
        'other-user',
        AccessOperation.READ
      );

      expect(result).toBe(true);
    });

    it('should allow full access to file owner', async () => {
      const mockFile = {
        id: 'file-123',
        uploadedBy: 'user-123',
        accessLevel: 'PRIVATE',
        permissions: null,
      };

      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(mockFile);

      const result = await metadataService.checkAccess(
        'file-123',
        'user-123',
        AccessOperation.DELETE
      );

      expect(result).toBe(true);
    });

    it('should deny access to private files for non-owners', async () => {
      const mockFile = {
        id: 'file-123',
        uploadedBy: 'user-123',
        accessLevel: 'PRIVATE',
        permissions: null,
      };

      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(mockFile);

      const result = await metadataService.checkAccess(
        'file-123',
        'other-user',
        AccessOperation.READ
      );

      expect(result).toBe(false);
    });

    it('should return false for non-existent files', async () => {
      mockPrismaClient.fileMetadata.findUnique.mockResolvedValue(null);

      const result = await metadataService.checkAccess(
        'non-existent',
        'user-123',
        AccessOperation.READ
      );

      expect(result).toBe(false);
    });
  });

  describe('createMultipleMetadata', () => {
    it('should create multiple metadata records in transaction', async () => {
      const requests = [
        {
          originalName: 'test1.jpg',
          fileName: 'test1-123.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          path: '/uploads/test1-123.jpg',
          url: 'https://example.com/test1-123.jpg',
          uploadedBy: 'user-123',
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          accessLevel: AccessLevel.PUBLIC,
        },
        {
          originalName: 'test2.jpg',
          fileName: 'test2-123.jpg',
          mimeType: 'image/jpeg',
          size: 2048,
          path: '/uploads/test2-123.jpg',
          url: 'https://example.com/test2-123.jpg',
          uploadedBy: 'user-123',
          entityType: EntityType.PRODUCT,
          entityId: 'product-123',
          accessLevel: AccessLevel.PUBLIC,
        },
      ];

      const mockResults = requests.map((req, index) => ({
        id: `file-${index + 1}`,
        ...req,
        status: 'UPLOADING',
        createdAt: new Date(),
        updatedAt: new Date(),
        cdnUrl: null,
        processingResults: null,
        thumbnails: null,
        permissions: null,
        metadata: {},
        tags: [],
        expiresAt: null,
      }));

      mockPrismaClient.$transaction.mockResolvedValue(mockResults);

      const result = await metadataService.createMultipleMetadata(requests);

      expect(mockPrismaClient.$transaction).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].originalName).toBe('test1.jpg');
      expect(result[1].originalName).toBe('test2.jpg');
    });
  });

  describe('deleteMultipleMetadata', () => {
    it('should delete multiple metadata records and return results', async () => {
      const fileIds = ['file-1', 'file-2', 'file-3'];

      // Mock the delete operations - first two succeed, third fails
      mockPrismaClient.fileMetadata.delete
        .mockResolvedValueOnce({}) // file-1 success
        .mockResolvedValueOnce({}) // file-2 success
        .mockRejectedValueOnce(new Error('Delete failed')); // file-3 failure

      const result = await metadataService.deleteMultipleMetadata(fileIds);

      expect(result.success).toBe(false);
      expect(result.deletedCount).toBe(2);
      expect(result.failedIds).toEqual(['file-3']);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].id).toBe('file-3');
      expect(result.errors[0].error).toBe('Delete failed');
    });
  });
});
