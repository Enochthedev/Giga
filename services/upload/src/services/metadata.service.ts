import {
  AccessLevel as PrismaAccessLevel,
  EntityType as PrismaEntityType,
  FileMetadata as PrismaFileMetadata,
  RelationshipType as PrismaRelationshipType,
} from '../generated/prisma-client';
import {
  AccessOperation,
  BatchDeleteResult,
  CreateMetadataRequest,
  FileRelationship,
  IMetadataManager,
  MetadataQuery,
  MetadataSearchResult,
  RelatedFilesResult,
  RelationshipType,
} from '../interfaces/metadata.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { AccessLevel, EntityType, FileMetadata } from '../types/upload.types';

/**
 * Metadata management service for file metadata operations
 * Handles CRUD operations, relationships, and access control for file metadata
 */
export class MetadataService implements IMetadataManager {
  constructor(private readonly db: any = prisma) {}

  /**
   * Create new file metadata record
   */
  async createMetadata(request: CreateMetadataRequest): Promise<FileMetadata> {
    try {
      logger.info('Creating metadata for file', {
        fileName: request.fileName,
        entityType: request.entityType,
        entityId: request.entityId,
      });

      const metadata = await this.db.fileMetadata.create({
        data: {
          id: request.id,
          originalName: request.originalName,
          fileName: request.fileName,
          mimeType: request.mimeType,
          size: request.size,
          path: request.path,
          url: request.url,
          cdnUrl: request.cdnUrl,
          uploadedBy: request.uploadedBy,
          entityType: request.entityType as unknown as PrismaEntityType,
          entityId: request.entityId,
          accessLevel: request.accessLevel as unknown as PrismaAccessLevel,
          status: 'UPLOADING',
          metadata: request.metadata || {},
          tags: request.tags || [],
          expiresAt: request.expiresAt,
        },
      });

      logger.info('Metadata created successfully', { fileId: metadata.id });
      return this.mapPrismaToFileMetadata(metadata);
    } catch (error) {
      logger.error('Failed to create metadata', { error, request });
      throw new Error(
        `Failed to create metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get file metadata by ID
   */
  async getMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const metadata = await this.db.fileMetadata.findUnique({
        where: { id: fileId },
      });

      if (!metadata) {
        return null;
      }

      return this.mapPrismaToFileMetadata(metadata);
    } catch (error) {
      logger.error('Failed to get metadata', { error, fileId });
      throw new Error(
        `Failed to get metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update file metadata
   */
  async updateMetadata(
    fileId: string,
    updates: Partial<FileMetadata>
  ): Promise<FileMetadata> {
    try {
      logger.info('Updating metadata', {
        fileId,
        updates: Object.keys(updates),
      });

      const updateData: any = {};

      // Map updates to Prisma format
      if (updates.originalName !== undefined)
        updateData.originalName = updates.originalName;
      if (updates.fileName !== undefined)
        updateData.fileName = updates.fileName;
      if (updates.mimeType !== undefined)
        updateData.mimeType = updates.mimeType;
      if (updates.size !== undefined) updateData.size = updates.size;
      if (updates.path !== undefined) updateData.path = updates.path;
      if (updates.url !== undefined) updateData.url = updates.url;
      if (updates.cdnUrl !== undefined) updateData.cdnUrl = updates.cdnUrl;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.accessLevel !== undefined)
        updateData.accessLevel =
          updates.accessLevel as unknown as PrismaAccessLevel;
      if (updates.metadata !== undefined)
        updateData.metadata = updates.metadata;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.expiresAt !== undefined)
        updateData.expiresAt = updates.expiresAt;
      if (updates.processingResults !== undefined)
        updateData.processingResults = updates.processingResults;
      if (updates.thumbnails !== undefined)
        updateData.thumbnails = updates.thumbnails;

      const metadata = await this.db.fileMetadata.update({
        where: { id: fileId },
        data: updateData,
      });

      logger.info('Metadata updated successfully', { fileId });
      return this.mapPrismaToFileMetadata(metadata);
    } catch (error) {
      logger.error('Failed to update metadata', { error, fileId, updates });
      throw new Error(
        `Failed to update metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete file metadata
   */
  async deleteMetadata(fileId: string): Promise<boolean> {
    try {
      logger.info('Deleting metadata', { fileId });

      await this.db.fileMetadata.delete({
        where: { id: fileId },
      });

      logger.info('Metadata deleted successfully', { fileId });
      return true;
    } catch (error) {
      logger.error('Failed to delete metadata', { error, fileId });
      return false;
    }
  }

  /**
   * Find files by entity
   */
  async findByEntity(
    entityType: EntityType,
    entityId: string
  ): Promise<FileMetadata[]> {
    try {
      const files = await this.db.fileMetadata.findMany({
        where: {
          entityType: entityType as unknown as PrismaEntityType,
          entityId,
          status: { not: 'DELETED' },
        },
        orderBy: { createdAt: 'desc' },
      });

      return files.map((file: PrismaFileMetadata) =>
        this.mapPrismaToFileMetadata(file)
      );
    } catch (error) {
      logger.error('Failed to find files by entity', {
        error,
        entityType,
        entityId,
      });
      throw new Error(
        `Failed to find files by entity: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Find files by uploader
   */
  async findByUploader(uploaderId: string): Promise<FileMetadata[]> {
    try {
      const files = await this.db.fileMetadata.findMany({
        where: {
          uploadedBy: uploaderId,
          status: { not: 'DELETED' },
        },
        orderBy: { createdAt: 'desc' },
      });

      return files.map((file: PrismaFileMetadata) =>
        this.mapPrismaToFileMetadata(file)
      );
    } catch (error) {
      logger.error('Failed to find files by uploader', { error, uploaderId });
      throw new Error(
        `Failed to find files by uploader: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Find files by tags
   */
  async findByTags(tags: string[]): Promise<FileMetadata[]> {
    try {
      const files = await this.db.fileMetadata.findMany({
        where: {
          tags: {
            hasSome: tags,
          },
          status: { not: 'DELETED' },
        },
        orderBy: { createdAt: 'desc' },
      });

      return files.map((file: PrismaFileMetadata) =>
        this.mapPrismaToFileMetadata(file)
      );
    } catch (error) {
      logger.error('Failed to find files by tags', { error, tags });
      throw new Error(
        `Failed to find files by tags: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Search files with advanced query options
   */
  async searchFiles(query: MetadataQuery): Promise<MetadataSearchResult> {
    try {
      const where: any = {
        status: { not: 'DELETED' },
      };

      // Build where clause
      if (query.entityType)
        where.entityType = query.entityType as unknown as PrismaEntityType;
      if (query.entityId) where.entityId = query.entityId;
      if (query.uploadedBy) where.uploadedBy = query.uploadedBy;
      if (query.accessLevel)
        where.accessLevel = query.accessLevel as unknown as PrismaAccessLevel;
      if (query.tags && query.tags.length > 0)
        where.tags = { hasSome: query.tags };
      if (query.mimeTypes && query.mimeTypes.length > 0)
        where.mimeType = { in: query.mimeTypes };

      if (query.sizeRange) {
        where.size = {};
        if (query.sizeRange.min !== undefined)
          where.size.gte = query.sizeRange.min;
        if (query.sizeRange.max !== undefined)
          where.size.lte = query.sizeRange.max;
      }

      if (query.dateRange) {
        where.createdAt = {};
        if (query.dateRange.from) where.createdAt.gte = query.dateRange.from;
        if (query.dateRange.to) where.createdAt.lte = query.dateRange.to;
      }

      if (query.searchText) {
        where.OR = [
          { originalName: { contains: query.searchText, mode: 'insensitive' } },
          { fileName: { contains: query.searchText, mode: 'insensitive' } },
          { tags: { hasSome: [query.searchText] } },
        ];
      }

      // Build order by
      const orderBy: any = {};
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'desc';
      orderBy[sortBy] = sortOrder;

      // Execute query with pagination
      const limit = Math.min(query.limit || 50, 100); // Max 100 items per page
      const offset = query.offset || 0;

      const [files, total] = await Promise.all([
        this.db.fileMetadata.findMany({
          where,
          orderBy,
          take: limit,
          skip: offset,
        }),
        this.db.fileMetadata.count({ where }),
      ]);

      const hasMore = offset + files.length < total;
      const nextOffset = hasMore ? offset + limit : undefined;

      return {
        files: files.map((file: PrismaFileMetadata) =>
          this.mapPrismaToFileMetadata(file)
        ),
        total,
        hasMore,
        nextOffset,
      };
    } catch (error) {
      logger.error('Failed to search files', { error, query });
      throw new Error(
        `Failed to search files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create multiple metadata records in batch
   */
  async createMultipleMetadata(
    requests: CreateMetadataRequest[]
  ): Promise<FileMetadata[]> {
    try {
      logger.info('Creating multiple metadata records', {
        count: requests.length,
      });

      const results = await this.db.$transaction(
        requests.map(request =>
          this.db.fileMetadata.create({
            data: {
              id: request.id,
              originalName: request.originalName,
              fileName: request.fileName,
              mimeType: request.mimeType,
              size: request.size,
              path: request.path,
              url: request.url,
              cdnUrl: request.cdnUrl,
              uploadedBy: request.uploadedBy,
              entityType: request.entityType as unknown as PrismaEntityType,
              entityId: request.entityId,
              accessLevel: request.accessLevel as unknown as PrismaAccessLevel,
              status: 'UPLOADING',
              metadata: request.metadata || {},
              tags: request.tags || [],
              expiresAt: request.expiresAt,
            },
          })
        )
      );

      logger.info('Multiple metadata records created successfully', {
        count: results.length,
      });
      return results.map((result: PrismaFileMetadata) =>
        this.mapPrismaToFileMetadata(result)
      );
    } catch (error) {
      logger.error('Failed to create multiple metadata records', {
        error,
        count: requests.length,
      });
      throw new Error(
        `Failed to create multiple metadata records: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete multiple metadata records in batch
   */
  async deleteMultipleMetadata(fileIds: string[]): Promise<BatchDeleteResult> {
    try {
      logger.info('Deleting multiple metadata records', {
        count: fileIds.length,
      });

      const results = await Promise.allSettled(
        fileIds.map(async (fileId: string) => {
          await this.db.fileMetadata.delete({
            where: { id: fileId },
          });
          return fileId;
        })
      );

      const successfulIds: string[] = [];
      const failedIds: string[] = [];
      const errors: Array<{ id: string; error: string }> = [];

      results.forEach((result: PromiseSettledResult<string>, index: number) => {
        const fileId = fileIds[index];
        if (result.status === 'fulfilled') {
          successfulIds.push(fileId);
        } else {
          failedIds.push(fileId);
          errors.push({
            id: fileId,
            error: (result.reason as Error)?.message || 'Unknown error',
          });
        }
      });

      logger.info('Multiple metadata deletion completed', {
        total: fileIds.length,
        successful: successfulIds.length,
        failed: failedIds.length,
      });

      return {
        success: failedIds.length === 0,
        deletedCount: successfulIds.length,
        failedIds,
        errors,
      };
    } catch (error) {
      logger.error('Failed to delete multiple metadata records', {
        error,
        count: fileIds.length,
      });
      throw new Error(
        `Failed to delete multiple metadata records: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Link files with relationships
   */
  async linkFiles(
    parentId: string,
    childIds: string[],
    relationshipType: RelationshipType = RelationshipType.RELATED
  ): Promise<boolean> {
    try {
      logger.info('Linking files', { parentId, childIds, relationshipType });

      await this.db.$transaction(
        childIds.map(childId =>
          this.db.fileRelationship.upsert({
            where: {
              parentId_childId_relationshipType: {
                parentId,
                childId,
                relationshipType:
                  relationshipType as unknown as PrismaRelationshipType,
              },
            },
            update: {},
            create: {
              parentId,
              childId,
              relationshipType:
                relationshipType as unknown as PrismaRelationshipType,
            },
          })
        )
      );

      logger.info('Files linked successfully', { parentId, childIds });
      return true;
    } catch (error) {
      logger.error('Failed to link files', { error, parentId, childIds });
      return false;
    }
  }

  /**
   * Unlink files by removing relationships
   */
  async unlinkFiles(parentId: string, childIds: string[]): Promise<boolean> {
    try {
      logger.info('Unlinking files', { parentId, childIds });

      await this.db.fileRelationship.deleteMany({
        where: {
          parentId,
          childId: { in: childIds },
        },
      });

      logger.info('Files unlinked successfully', { parentId, childIds });
      return true;
    } catch (error) {
      logger.error('Failed to unlink files', { error, parentId, childIds });
      return false;
    }
  }

  /**
   * Get related files for a given file
   */
  async getRelatedFiles(fileId: string): Promise<RelatedFilesResult> {
    try {
      const [parentRelationships, childRelationships, file] = await Promise.all(
        [
          this.db.fileRelationship.findMany({
            where: { childId: fileId },
            include: { parent: true },
          }),
          this.db.fileRelationship.findMany({
            where: { parentId: fileId },
            include: { child: true },
          }),
          this.db.fileMetadata.findUnique({
            where: { id: fileId },
          }),
        ]
      );

      const parent =
        parentRelationships.length > 0
          ? this.mapPrismaToFileMetadata(parentRelationships[0].parent)
          : undefined;

      const children = childRelationships.map((rel: any) =>
        this.mapPrismaToFileMetadata(rel.child)
      );

      // Get siblings (files with same parent)
      const siblings: FileMetadata[] = [];
      if (parent) {
        const siblingRelationships = await this.db.fileRelationship.findMany({
          where: {
            parentId: parent.id,
            childId: { not: fileId },
          },
          include: { child: true },
        });
        siblings.push(
          ...siblingRelationships.map((rel: any) =>
            this.mapPrismaToFileMetadata(rel.child)
          )
        );
      }

      const relationships: FileRelationship[] = [
        ...parentRelationships.map((rel: any) => ({
          id: rel.id,
          parentId: rel.parentId,
          childId: rel.childId,
          relationshipType: rel.relationshipType as RelationshipType,
          createdAt: rel.createdAt,
        })),
        ...childRelationships.map((rel: any) => ({
          id: rel.id,
          parentId: rel.parentId,
          childId: rel.childId,
          relationshipType: rel.relationshipType as RelationshipType,
          createdAt: rel.createdAt,
        })),
      ];

      return {
        parent,
        children,
        siblings,
        relationships,
      };
    } catch (error) {
      logger.error('Failed to get related files', { error, fileId });
      throw new Error(
        `Failed to get related files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update access level for a file
   */
  async updateAccessLevel(
    fileId: string,
    accessLevel: AccessLevel
  ): Promise<boolean> {
    try {
      logger.info('Updating access level', { fileId, accessLevel });

      await this.db.fileMetadata.update({
        where: { id: fileId },
        data: { accessLevel: accessLevel as unknown as PrismaAccessLevel },
      });

      logger.info('Access level updated successfully', { fileId, accessLevel });
      return true;
    } catch (error) {
      logger.error('Failed to update access level', {
        error,
        fileId,
        accessLevel,
      });
      return false;
    }
  }

  /**
   * Check if user has access to perform operation on file
   */
  async checkAccess(
    fileId: string,
    userId: string,
    operation: AccessOperation
  ): Promise<boolean> {
    try {
      const file = await this.db.fileMetadata.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        return false;
      }

      // Public files are readable by anyone
      if (file.accessLevel === 'PUBLIC' && operation === AccessOperation.READ) {
        return true;
      }

      // Owner has full access
      if (file.uploadedBy === userId) {
        return true;
      }

      // For private and restricted files, implement additional logic
      // This is a basic implementation - extend based on your access control requirements
      if (file.accessLevel === 'PRIVATE') {
        return false;
      }

      if (file.accessLevel === 'RESTRICTED') {
        // Check permissions in metadata or implement role-based access
        const permissions = file.permissions as any;
        if (permissions && permissions.allowedUsers) {
          return permissions.allowedUsers.includes(userId);
        }
        return false;
      }

      return false;
    } catch (error) {
      logger.error('Failed to check access', {
        error,
        fileId,
        userId,
        operation,
      });
      return false;
    }
  }

  /**
   * Map Prisma FileMetadata to application FileMetadata type
   */
  private mapPrismaToFileMetadata(
    prismaFile: PrismaFileMetadata
  ): FileMetadata {
    // Map Prisma enum values to application enum values
    const entityTypeMap: Record<string, EntityType> = {
      USER_PROFILE: EntityType.USER_PROFILE,
      PRODUCT: EntityType.PRODUCT,
      PROPERTY: EntityType.PROPERTY,
      VEHICLE: EntityType.VEHICLE,
      DOCUMENT: EntityType.DOCUMENT,
      ADVERTISEMENT: EntityType.ADVERTISEMENT,
    };

    const accessLevelMap: Record<string, AccessLevel> = {
      PUBLIC: AccessLevel.PUBLIC,
      PRIVATE: AccessLevel.PRIVATE,
      RESTRICTED: AccessLevel.RESTRICTED,
    };

    const statusMap: Record<string, any> = {
      UPLOADING: 'uploading',
      PROCESSING: 'processing',
      READY: 'ready',
      FAILED: 'failed',
      DELETED: 'deleted',
    };

    return {
      id: prismaFile.id,
      originalName: prismaFile.originalName,
      fileName: prismaFile.fileName,
      mimeType: prismaFile.mimeType,
      size: prismaFile.size,
      path: prismaFile.path,
      url: prismaFile.url,
      cdnUrl: prismaFile.cdnUrl || undefined,
      uploadedBy: prismaFile.uploadedBy,
      entityType:
        entityTypeMap[prismaFile.entityType] ||
        (prismaFile.entityType as EntityType),
      entityId: prismaFile.entityId,
      status: statusMap[prismaFile.status] || (prismaFile.status as any),
      processingResults: prismaFile.processingResults
        ? (prismaFile.processingResults as any)
        : undefined,
      thumbnails: prismaFile.thumbnails
        ? (prismaFile.thumbnails as any)
        : undefined,
      accessLevel:
        accessLevelMap[prismaFile.accessLevel] ||
        (prismaFile.accessLevel as AccessLevel),
      metadata: (prismaFile.metadata as Record<string, unknown>) || {},
      tags: prismaFile.tags,
      createdAt: prismaFile.createdAt,
      updatedAt: prismaFile.updatedAt,
      expiresAt: prismaFile.expiresAt || undefined,
    };
  }
}

// Export singleton instance
export const metadataService = new MetadataService();
