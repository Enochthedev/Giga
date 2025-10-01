import {
  IStorageManager,
  StorageConfig,
  StorageInfo,
  StorageListResult,
  StorageResult,
} from '../interfaces/storage.interface';
import { logger } from '../lib/logger';
import { FileData } from '../types/upload.types';
import { LocalStorageProvider } from './storage/local-storage.provider';

/**
 * Storage manager service that provides abstraction over different storage backends
 */
export class StorageManagerService implements IStorageManager {
  private provider: IStorageManager;

  constructor(private config: StorageConfig) {
    this.provider = this.createProvider(config);
  }

  private createProvider(config: StorageConfig): IStorageManager {
    switch (config.type) {
      case 'local':
        return new LocalStorageProvider(config);
      case 's3':
        // TODO: Implement S3 provider in future tasks
        throw new Error('S3 storage provider not implemented yet');
      case 'gcs':
        // TODO: Implement GCS provider in future tasks
        throw new Error('GCS storage provider not implemented yet');
      case 'azure':
        // TODO: Implement Azure provider in future tasks
        throw new Error('Azure storage provider not implemented yet');
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }

  async store(file: FileData, path: string): Promise<StorageResult> {
    try {
      logger.debug('Storing file', {
        path,
        size: file.size,
        mimeType: file.mimeType,
      });
      const result = await this.provider.store(file, path);
      logger.info('File stored successfully', {
        path,
        success: result.success,
      });
      return result;
    } catch (error) {
      logger.error('Failed to store file', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async retrieve(path: string): Promise<FileData> {
    try {
      logger.debug('Retrieving file', { path });
      const result = await this.provider.retrieve(path);
      logger.debug('File retrieved successfully', { path, size: result.size });
      return result;
    } catch (error) {
      logger.error('Failed to retrieve file', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(path: string): Promise<boolean> {
    try {
      logger.debug('Deleting file', { path });
      const result = await this.provider.delete(path);
      logger.info('File deletion completed', { path, success: result });
      return result;
    } catch (error) {
      logger.error('Failed to delete file', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      return await this.provider.exists(path);
    } catch (error) {
      logger.error('Failed to check file existence', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async generatePresignedUrl(
    path: string,
    operation: 'read' | 'write',
    expiresIn: number
  ): Promise<string> {
    try {
      logger.debug('Generating presigned URL', { path, operation, expiresIn });
      const url = await this.provider.generatePresignedUrl(
        path,
        operation,
        expiresIn
      );
      logger.debug('Presigned URL generated', { path, operation });
      return url;
    } catch (error) {
      logger.error('Failed to generate presigned URL', {
        path,
        operation,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Generate CDN URL for a file path
   */
  generateCDNUrl(path: string, baseUrl?: string): string {
    const cdnBaseUrl = baseUrl || this.config.options?.cdnBaseUrl || '';
    if (!cdnBaseUrl) {
      return `/files/${path}`;
    }
    return `${cdnBaseUrl}/${path}`;
  }

  async storeMultiple(
    files: FileData[],
    paths: string[]
  ): Promise<StorageResult[]> {
    if (files.length !== paths.length) {
      throw new Error('Files and paths arrays must have the same length');
    }

    try {
      logger.debug('Storing multiple files', { count: files.length });
      const result = await this.provider.storeMultiple(files, paths);
      const successCount = result.filter(r => r.success).length;
      logger.info('Multiple files storage completed', {
        total: files.length,
        successful: successCount,
        failed: files.length - successCount,
      });
      return result;
    } catch (error) {
      logger.error('Failed to store multiple files', {
        count: files.length,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async deleteMultiple(paths: string[]): Promise<boolean[]> {
    try {
      logger.debug('Deleting multiple files', { count: paths.length });
      const result = await this.provider.deleteMultiple(paths);
      const successCount = result.filter(r => r).length;
      logger.info('Multiple files deletion completed', {
        total: paths.length,
        successful: successCount,
        failed: paths.length - successCount,
      });
      return result;
    } catch (error) {
      logger.error('Failed to delete multiple files', {
        count: paths.length,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async getStorageInfo(path: string): Promise<StorageInfo> {
    try {
      logger.debug('Getting storage info', { path });
      const info = await this.provider.getStorageInfo(path);
      logger.debug('Storage info retrieved', { path, size: info.size });
      return info;
    } catch (error) {
      logger.error('Failed to get storage info', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async listFiles(prefix: string, limit?: number): Promise<StorageListResult> {
    try {
      logger.debug('Listing files', { prefix, limit });
      const result = await this.provider.listFiles(prefix, limit);
      logger.debug('Files listed', {
        prefix,
        count: result.files.length,
        hasMore: result.hasMore,
      });
      return result;
    } catch (error) {
      logger.error('Failed to list files', {
        prefix,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
