/**
 * Upload Service Client Library
 *
 * This module provides a TypeScript client for integrating with the Upload Service.
 * It includes retry logic, error handling, and convenient methods for all file operations.
 */

export {
  UploadClient,
  createUploadClient,
  defaultUploadClientConfig,
} from './upload-client';

export type {
  FileUploadOptions,
  MultipleFileUploadOptions,
  ProcessingStatus,
  QueueHealth,
  UploadClientConfig,
} from './upload-client';

// Re-export types and enums from the main types module for convenience
export type {
  BatchResult,
  DocumentUploadResult,
  FileMetadata,
  FileStatus,
  ImageUploadResult,
  ProcessingOptions,
  ThumbnailInfo,
  ThumbnailSize,
  UploadError,
  UploadResult,
  ValidationResult,
} from '../types/upload.types';

// Re-export enums as values
export {
  AccessLevel,
  EntityType,
  UploadErrorCode,
} from '../types/upload.types';
