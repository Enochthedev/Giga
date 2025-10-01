import {
  BatchResult,
  DocumentUploadResult,
  FileData,
  FileMetadata,
  ImageUploadResult,
  UploadRequest,
  UploadResult,
} from '../types/upload.types';

/**
 * Main upload service interface for handling all file upload operations
 */
export interface IUploadService {
  // Primary upload operations
  uploadFile(request: UploadRequest): Promise<UploadResult>;
  uploadMultipleFiles(requests: UploadRequest[]): Promise<UploadResult[]>;

  // Specialized upload methods
  uploadProfilePhoto(
    userId: string,
    file: FileData
  ): Promise<ImageUploadResult>;
  uploadProductImage(
    productId: string,
    file: FileData
  ): Promise<ImageUploadResult>;
  uploadPropertyPhoto(
    propertyId: string,
    file: FileData
  ): Promise<ImageUploadResult>;
  uploadVehiclePhoto(
    vehicleId: string,
    file: FileData
  ): Promise<ImageUploadResult>;
  uploadDocument(
    entityId: string,
    entityType: string,
    file: FileData
  ): Promise<DocumentUploadResult>;

  // File management
  getFile(fileId: string): Promise<FileMetadata>;
  deleteFile(fileId: string): Promise<boolean>;
  updateFileMetadata(
    fileId: string,
    metadata: Partial<FileMetadata>
  ): Promise<FileMetadata>;

  // Batch operations
  deleteMultipleFiles(fileIds: string[]): Promise<BatchResult>;
  getMultipleFiles(fileIds: string[]): Promise<FileMetadata[]>;
}

// Types are imported from upload.types.ts to avoid duplication
