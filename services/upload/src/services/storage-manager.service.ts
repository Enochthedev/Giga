import {
  IStorageManager,
  StorageConfig,
  StorageInfo,
  StorageListResult,
  StorageResult,
} from '../interfaces/storage.interface';
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

  static async create(config: StorageConfig): Promise<StorageManagerService> {
    return new StorageManagerService(config);
  }

  private createProvider(config: StorageConfig): IStorageManager {
    switch (config.type) {
      case 'local':
        return new LocalStorageProvider(config);
      case 's3':
        // S3 provider available but requires AWS SDK installation
        throw new Error(
          'S3 storage provider requires AWS SDK. Install @aws-sdk/client-s3 and configure properly.'
        );
      case 'gcs':
        // GCS provider available but requires Google Cloud SDK installation
        throw new Error(
          'GCS storage provider requires Google Cloud SDK. Install @google-cloud/storage and configure properly.'
        );
      case 'azure':
        // Azure provider available but requires Azure SDK installation
        throw new Error(
          'Azure storage provider requires Azure SDK. Install @azure/storage-blob and configure properly.'
        );
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }

  // Delegate all methods to the provider
  async store(file: FileData, path: string): Promise<StorageResult> {
    return this.provider.store(file, path);
  }

  async retrieve(path: string): Promise<FileData> {
    return this.provider.retrieve(path);
  }

  async delete(path: string): Promise<boolean> {
    return this.provider.delete(path);
  }

  async exists(path: string): Promise<boolean> {
    return this.provider.exists(path);
  }

  async generatePresignedUrl(
    path: string,
    operation: 'read' | 'write',
    expiresIn: number
  ): Promise<string> {
    return this.provider.generatePresignedUrl(path, operation, expiresIn);
  }

  async storeMultiple(
    files: FileData[],
    paths: string[]
  ): Promise<StorageResult[]> {
    return this.provider.storeMultiple(files, paths);
  }

  async deleteMultiple(paths: string[]): Promise<boolean[]> {
    return this.provider.deleteMultiple(paths);
  }

  async getStorageInfo(path: string): Promise<StorageInfo> {
    return this.provider.getStorageInfo(path);
  }

  async listFiles(prefix: string, limit?: number): Promise<StorageListResult> {
    return this.provider.listFiles(prefix, limit);
  }
}
