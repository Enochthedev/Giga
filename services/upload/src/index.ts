// Main entry point for the upload service
export * from './config';
export * from './interfaces';
export * from './lib/logger';
export * from './utils';

// Re-export the app for testing purposes
export { createApp, initializeServices } from './app';

// Export specific types to avoid conflicts
export type {
  AccessLevel,
  EntityType,
  FileData,
  FileMetadata,
  FileStatus,
  UploadError,
  UploadErrorCode,
  UploadRequest,
  UploadResult,
} from './types/upload.types';
