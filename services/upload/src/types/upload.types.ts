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
  USER_PROFILE = 'user_profile',
  PRODUCT = 'product',
  PROPERTY = 'property',
  VEHICLE = 'vehicle',
  DOCUMENT = 'document',
  ADVERTISEMENT = 'advertisement'
}

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
  DELETED = 'deleted'
}

export enum AccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted'
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
  INVALID_REQUEST = 'INVALID_REQUEST'
}

export interface UploadError {
  code: UploadErrorCode;
  message: string;
  details?: Record<string, any>;
  retryable: boolean;
}