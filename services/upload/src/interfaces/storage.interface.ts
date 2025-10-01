import { FileData } from '../types/upload.types';

/**
 * Storage abstraction interface for different storage backends
 */
export interface IStorageManager {
  store(file: FileData, path: string): Promise<StorageResult>;
  retrieve(path: string): Promise<FileData>;
  delete(path: string): Promise<boolean>;
  exists(path: string): Promise<boolean>;
  generatePresignedUrl(
    path: string,
    operation: 'read' | 'write',
    expiresIn: number
  ): Promise<string>;

  // Batch operations
  storeMultiple(files: FileData[], paths: string[]): Promise<StorageResult[]>;
  deleteMultiple(paths: string[]): Promise<boolean[]>;

  // Storage management
  getStorageInfo(path: string): Promise<StorageInfo>;
  listFiles(prefix: string, limit?: number): Promise<StorageListResult>;
}

export interface StorageResult {
  success: boolean;
  path?: string;
  url?: string;
  size?: number;
  error?: string;
}

export interface StorageInfo {
  path: string;
  size: number;
  lastModified: Date;
  etag?: string;
  contentType?: string;
}

export interface StorageListResult {
  files: StorageInfo[];
  hasMore: boolean;
  nextToken?: string;
}

export interface StorageConfig {
  type: 'local' | 's3' | 'gcs' | 'azure';
  basePath: string;
  credentials?: Record<string, any>;
  options?: Record<string, any>;
}
