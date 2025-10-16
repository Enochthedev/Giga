import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import {
  AccessLevel,
  BatchResult,
  DocumentUploadResult,
  EntityType,
  FileMetadata,
  ImageUploadResult,
  UploadError,
  UploadErrorCode,
  UploadResult,
} from '../types/upload.types';

export interface UploadClientConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  apiKey?: string;
  serviceToken?: string;
  maxRetryDelay?: number;
  retryCondition?: (error: any) => boolean;
}

export interface FileUploadOptions {
  entityType: EntityType;
  entityId: string;
  uploadedBy: string;
  accessLevel?: AccessLevel;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface MultipleFileUploadOptions {
  uploadedBy: string;
  files: Array<{
    entityType: EntityType;
    entityId: string;
    accessLevel?: AccessLevel;
    metadata?: Record<string, any>;
    tags?: string[];
  }>;
}

export interface ProcessingStatus {
  fileId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  jobs?: string[];
  error?: string;
  completedAt?: Date;
}

export interface QueueHealth {
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

/**
 * Upload Service Client
 *
 * A TypeScript client for integrating with the Upload Service.
 * Provides retry logic, error handling, and convenient methods for file operations.
 */
export class UploadClient {
  private client: AxiosInstance;
  private config: UploadClientConfig & {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    maxRetryDelay: number;
    retryCondition: (error: any) => boolean;
  };

  constructor(config: UploadClientConfig) {
    if (!config.baseURL) {
      throw new Error('baseURL is required');
    }

    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      maxRetryDelay: 10000,
      retryCondition: this.defaultRetryCondition,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
        ...(this.config.serviceToken && {
          Authorization: `Bearer ${this.config.serviceToken}`,
        }),
      },
    });

    this.setupInterceptors();
  }

  /**
   * Upload a single file
   */
  async uploadFile(
    file: Buffer | File,
    filename: string,
    mimeType: string,
    options: FileUploadOptions
  ): Promise<UploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    // Add metadata
    formData.append('entityType', options.entityType);
    formData.append('entityId', options.entityId);
    formData.append('uploadedBy', options.uploadedBy);

    if (options.accessLevel) {
      formData.append('accessLevel', options.accessLevel);
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    if (options.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }

    return this.executeWithRetry(async () => {
      const response = await this.client.post('/api/v1/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      return response.data;
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer | File; filename: string; mimeType: string }>,
    options: MultipleFileUploadOptions
  ): Promise<UploadResult[]> {
    const formData = new FormData();

    // Add files
    files.forEach((file, index) => {
      if (file.buffer instanceof Buffer) {
        formData.append('files', file.buffer, {
          filename: file.filename,
          contentType: file.mimeType,
        });
      } else {
        formData.append('files', file.buffer, file.filename);
      }
    });

    // Add metadata
    formData.append('uploadedBy', options.uploadedBy);
    formData.append('files', JSON.stringify(options.files));

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        '/api/v1/upload/multiple',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data.data;
    });
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(
    userId: string,
    file: Buffer | File,
    filename: string,
    mimeType: string,
    uploadedBy?: string
  ): Promise<ImageUploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    if (uploadedBy) {
      formData.append('uploadedBy', uploadedBy);
    }

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        `/api/v1/upload/profile/${userId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    });
  }

  /**
   * Upload product image
   */
  async uploadProductImage(
    productId: string,
    file: Buffer | File,
    filename: string,
    mimeType: string,
    uploadedBy: string,
    isPrimary: boolean = false
  ): Promise<ImageUploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    formData.append('uploadedBy', uploadedBy);
    formData.append('isPrimary', isPrimary.toString());

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        `/api/v1/upload/product/${productId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    });
  }

  /**
   * Upload property photo
   */
  async uploadPropertyPhoto(
    propertyId: string,
    file: Buffer | File,
    filename: string,
    mimeType: string,
    uploadedBy: string,
    options?: { roomType?: string; isPrimary?: boolean }
  ): Promise<ImageUploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    formData.append('uploadedBy', uploadedBy);

    if (options?.roomType) {
      formData.append('roomType', options.roomType);
    }

    if (options?.isPrimary) {
      formData.append('isPrimary', options.isPrimary.toString());
    }

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        `/api/v1/upload/property/${propertyId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    });
  }

  /**
   * Upload vehicle photo
   */
  async uploadVehiclePhoto(
    vehicleId: string,
    file: Buffer | File,
    filename: string,
    mimeType: string,
    uploadedBy: string,
    photoType: string = 'exterior'
  ): Promise<ImageUploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    formData.append('uploadedBy', uploadedBy);
    formData.append('photoType', photoType);

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        `/api/v1/upload/vehicle/${vehicleId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    });
  }

  /**
   * Upload document
   */
  async uploadDocument(
    file: Buffer | File,
    filename: string,
    mimeType: string,
    options: FileUploadOptions
  ): Promise<DocumentUploadResult> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', file, { filename, contentType: mimeType });
    } else {
      formData.append('file', file, filename);
    }

    // Add metadata
    formData.append('entityType', options.entityType);
    formData.append('entityId', options.entityId);
    formData.append('uploadedBy', options.uploadedBy);

    if (options.accessLevel) {
      formData.append('accessLevel', options.accessLevel);
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    if (options.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }

    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        '/api/v1/upload/document',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      return response.data;
    });
  }

  /**
   * Get file metadata
   */
  async getFile(fileId: string): Promise<FileMetadata> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get(`/api/v1/upload/${fileId}`);
      return response.data.data;
    });
  }

  /**
   * Get multiple files metadata
   */
  async getMultipleFiles(fileIds: string[]): Promise<FileMetadata[]> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post('/api/v1/upload/batch/get', {
        fileIds,
      });
      return response.data.data;
    });
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<boolean> {
    return this.executeWithRetry(async () => {
      const response = await this.client.delete(`/api/v1/upload/${fileId}`);
      return response.data.success;
    });
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(fileIds: string[]): Promise<BatchResult> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post('/api/v1/upload/batch/delete', {
        fileIds,
      });
      return response.data;
    });
  }

  /**
   * Get file processing status
   */
  async getProcessingStatus(fileId: string): Promise<ProcessingStatus> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get(`/api/v1/upload/${fileId}/status`);
      return response.data.data;
    });
  }

  /**
   * Retry failed processing
   */
  async retryProcessing(fileId: string): Promise<boolean> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post(`/api/v1/upload/${fileId}/retry`);
      return response.data.success;
    });
  }

  /**
   * Cancel file processing
   */
  async cancelProcessing(fileId: string): Promise<boolean> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post(
        `/api/v1/upload/${fileId}/cancel`
      );
      return response.data.cancelled;
    });
  }

  /**
   * Get queue health status
   */
  async getQueueHealth(): Promise<QueueHealth> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get('/api/v1/upload/queue/health');
      return response.data.data;
    });
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(
    fileId: string,
    metadata: Partial<Pick<FileMetadata, 'metadata' | 'tags' | 'accessLevel'>>
  ): Promise<FileMetadata> {
    return this.executeWithRetry(async () => {
      const response = await this.client.patch(
        `/api/v1/upload/${fileId}`,
        metadata
      );
      return response.data.data;
    });
  }

  /**
   * Search files by criteria
   */
  async searchFiles(criteria: {
    entityType?: EntityType;
    entityId?: string;
    uploadedBy?: string;
    tags?: string[];
    mimeType?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ files: FileMetadata[]; total: number }> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get('/api/v1/upload/search', {
        params: criteria,
      });
      return response.data.data;
    });
  }

  /**
   * Get file download URL (for private files)
   */
  async getDownloadUrl(
    fileId: string,
    expiresIn: number = 3600
  ): Promise<string> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get(
        `/api/v1/upload/${fileId}/download-url`,
        {
          params: { expiresIn },
        }
      );
      return response.data.data.url;
    });
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (
          attempt === this.config.retryAttempts ||
          !this.config.retryCondition(error)
        ) {
          break;
        }

        const delay = Math.min(
          this.config.retryDelay * Math.pow(2, attempt),
          this.config.maxRetryDelay
        );

        await this.sleep(delay);
      }
    }

    throw this.createUploadError(lastError);
  }

  /**
   * Default retry condition
   */
  private defaultRetryCondition(error: any): boolean {
    if (!error.response) {
      // Network errors should be retried
      return true;
    }

    const status = error.response.status;

    // Retry on server errors and rate limiting
    return status >= 500 || status === 429;
  }

  /**
   * Create standardized upload error
   */
  private createUploadError(error: unknown): UploadError {
    const err = error as any;
    if (err.response?.data?.error) {
      const errorData = err.response.data.error;
      return {
        code: errorData.code || UploadErrorCode.SERVICE_UNAVAILABLE,
        message: errorData.message || 'Upload service error',
        details: errorData.details,
        retryable: this.config.retryCondition(error),
      };
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return {
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Upload service is unavailable',
        retryable: true,
      };
    }

    if (err.code === 'ECONNABORTED') {
      return {
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Request timeout',
        retryable: true,
      };
    }

    return {
      code: UploadErrorCode.SERVICE_UNAVAILABLE,
      message: err.message || 'Unknown error occurred',
      retryable: false,
    };
  }

  /**
   * Setup axios interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        // Log error details for debugging
        if (error.response) {
          console.error('Upload client error:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
          });
        } else {
          console.error('Upload client network error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create upload client instance
 */
export function createUploadClient(config: UploadClientConfig): UploadClient {
  return new UploadClient(config);
}

/**
 * Default upload client configuration
 */
export const defaultUploadClientConfig: Partial<UploadClientConfig> = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  maxRetryDelay: 10000,
};
