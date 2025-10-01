export interface UploadResult {
  success: boolean;
  data?: {
    id: string;
    url: string;
    cdnUrl?: string;
    thumbnails?: ThumbnailInfo[];
    metadata: FileMetadata;
  };
  error?: string;
  code?: string;
}

export interface BatchResult {
  success: boolean;
  results: Array<{
    id: string;
    success: boolean;
    error?: string;
  }>;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
}

export interface ImageUploadResult extends UploadResult {
  data?: UploadResult['data'] & {
    thumbnails: ThumbnailInfo[];
    optimizedVersions: OptimizedVersion[];
  };
}

export interface DocumentUploadResult extends UploadResult {
  data?: UploadResult['data'] & {
    documentType: string;
    pageCount?: number;
    textExtracted?: boolean;
  };
}

export interface OptimizedVersion {
  format: string;
  url: string;
  size: number;
  quality: number;
}

export interface FileMetadata {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  cdnUrl?: string;

  // Context information
  uploadedBy: string;
  entityType: EntityType;
  entityId: string;

  // Processing information
  status: FileStatus;
  processingResults?: ProcessingResults;
  thumbnails?: ThumbnailInfo[];

  // Security and access
  accessLevel: AccessLevel;

  // Additional metadata
  metadata: Record<string, any>;
  tags: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export enum EntityType {
  USER_PROFILE = 'USER_PROFILE',
  PRODUCT = 'PRODUCT',
  PROPERTY = 'PROPERTY',
  VEHICLE = 'VEHICLE',
  DOCUMENT = 'DOCUMENT',
  ADVERTISEMENT = 'ADVERTISEMENT',
}

export enum FileStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  RESTRICTED = 'RESTRICTED',
}

export interface ThumbnailInfo {
  size: string; // e.g., "150x150"
  url: string;
  width: number;
  height: number;
}

export interface ProcessingResults {
  originalSize: number;
  processedSize: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  compressionRatio: number;
  processingTime: number;
}

export interface UploadRequest {
  file: FileData;
  entityType: EntityType;
  entityId: string;
  uploadedBy: string;
  accessLevel: AccessLevel;
  processingOptions?: ProcessingOptions;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface FileData {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface ProcessingOptions {
  resize?: {
    width: number;
    height: number;
    fit: 'cover' | 'contain' | 'fill';
  };
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
  generateThumbnails?: ThumbnailSize[];
}

export interface ThumbnailSize {
  width: number;
  height: number;
  name: string; // e.g., "small", "medium", "large"
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface StorageResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export enum UploadErrorCode {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  MALWARE_DETECTED = 'MALWARE_DETECTED',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

export interface UploadError {
  code: UploadErrorCode;
  message: string;
  details?: Record<string, any>;
  retryable: boolean;
}

// Re-export job types for convenience
export * from './job.types';

// Retention and compliance types
export interface RetentionPolicy {
  id: string;
  name: string;
  entityType: EntityType;
  retentionPeriodDays: number;
  jurisdiction: string;
  isActive: boolean;
  description?: string;
  legalBasis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalHold {
  id: string;
  name: string;
  description: string;
  entityType?: EntityType;
  entityIds: string[];
  fileIds: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface DataDeletionRequest {
  id: string;
  requestType: 'user_request' | 'gdpr_request' | 'policy_expiration' | 'legal_hold_release';
  entityType: EntityType;
  entityId: string;
  requestedBy: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  scheduledAt: Date;
  processedAt?: Date;
  filesDeleted: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum SecurityEventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Request interface extensions
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: string;
        permissions: string[];
      };
    }
  }
}