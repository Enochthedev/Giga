import { AccessLevel, EntityType, FileMetadata, FileStatus } from '../types/upload.types';

/**
 * Metadata management interface for file metadata operations
 */
export interface IMetadataManager {
  // CRUD operations
  createMetadata(metadata: CreateMetadataRequest): Promise<FileMetadata>;
  getMetadata(fileId: string): Promise<FileMetadata | null>;
  updateMetadata(
    fileId: string,
    updates: Partial<FileMetadata>
  ): Promise<FileMetadata>;
  deleteMetadata(fileId: string): Promise<boolean>;

  // Query operations
  findByEntity(
    entityType: EntityType,
    entityId: string
  ): Promise<FileMetadata[]>;
  findByUploader(uploaderId: string): Promise<FileMetadata[]>;
  findByTags(tags: string[]): Promise<FileMetadata[]>;
  searchFiles(query: MetadataQuery): Promise<MetadataSearchResult>;

  // Batch operations
  createMultipleMetadata(
    requests: CreateMetadataRequest[]
  ): Promise<FileMetadata[]>;
  deleteMultipleMetadata(fileIds: string[]): Promise<BatchDeleteResult>;

  // Relationship management
  linkFiles(parentId: string, childIds: string[]): Promise<boolean>;
  unlinkFiles(parentId: string, childIds: string[]): Promise<boolean>;
  getRelatedFiles(fileId: string): Promise<RelatedFilesResult>;

  // Access control
  updateAccessLevel(fileId: string, accessLevel: AccessLevel): Promise<boolean>;
  checkAccess(
    fileId: string,
    userId: string,
    operation: AccessOperation
  ): Promise<boolean>;
}

export interface CreateMetadataRequest {
  id?: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  cdnUrl?: string;
  uploadedBy: string;
  entityType: EntityType;
  entityId: string;
  status?: FileStatus;
  accessLevel: AccessLevel;
  metadata?: Record<string, any>;
  tags?: string[];
  expiresAt?: Date;
}

export interface MetadataQuery {
  entityType?: EntityType;
  entityId?: string;
  uploadedBy?: string;
  accessLevel?: AccessLevel;
  tags?: string[];
  mimeTypes?: string[];
  sizeRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  searchText?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'size' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface MetadataSearchResult {
  files: FileMetadata[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface BatchDeleteResult {
  success: boolean;
  deletedCount: number;
  failedIds: string[];
  errors: Array<{
    id: string;
    error: string;
  }>;
}

export interface RelatedFilesResult {
  parent?: FileMetadata;
  children: FileMetadata[];
  siblings: FileMetadata[];
  relationships: FileRelationship[];
}

export interface FileRelationship {
  id: string;
  parentId: string;
  childId: string;
  relationshipType: RelationshipType;
  createdAt: Date;
}

export enum RelationshipType {
  THUMBNAIL = 'thumbnail',
  VARIANT = 'variant',
  PROCESSED = 'processed',
  BACKUP = 'backup',
  RELATED = 'related',
}

export enum AccessOperation {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
}
