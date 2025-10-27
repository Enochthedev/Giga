import type {
  DeleteFileResponse,
  FileMetadata,
  ListFilesOptions,
  ProcessImageResponse,
  ProcessingOperation,
  UploadOptions,
  UploadResponse,
} from './types';
import { FileStorageError } from './types';

export interface FileStorageClientConfig {
  supabaseUrl: string;
  supabaseKey: string;
  functionsUrl?: string;
}

export class FileStorageClient {
  private supabaseUrl: string;
  private supabaseKey: string;
  private functionsUrl: string;
  private userToken?: string;

  constructor(config: FileStorageClientConfig) {
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
    this.functionsUrl =
      config.functionsUrl || `${config.supabaseUrl}/functions/v1`;
  }

  /**
   * Set the user authentication token
   */
  setUserToken(token: string): void {
    this.userToken = token;
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: File | Blob,
    options: UploadOptions
  ): Promise<UploadResponse> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const formData = new FormData();

    // Handle File vs Blob
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      // If it's a Blob, create a File from it
      const fileName = `file-${Date.now()}`;
      formData.append('file', new File([file], fileName));
    }

    formData.append('entityType', options.entityType);
    formData.append('entityId', options.entityId);

    if (options.accessLevel) {
      formData.append('accessLevel', options.accessLevel);
    }

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    if (options.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }

    const response = await fetch(`${this.functionsUrl}/upload-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.userToken}`,
      },
      body: formData,
    });

    const data = (await response.json()) as UploadResponse & { error?: string };

    if (!response.ok) {
      throw new FileStorageError(
        data.error || 'Upload failed',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Array<{ file: File | Blob; options: UploadOptions }>
  ): Promise<UploadResponse[]> {
    const uploads = files.map(({ file, options }) =>
      this.uploadFile(file, options)
    );
    return Promise.all(uploads);
  }

  /**
   * Process an image (resize, thumbnail, compress)
   */
  async processImage(
    fileId: string,
    operations: ProcessingOperation[]
  ): Promise<ProcessImageResponse> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const response = await fetch(`${this.functionsUrl}/process-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        operations,
      }),
    });

    const data = (await response.json()) as ProcessImageResponse & {
      error?: string;
    };

    if (!response.ok) {
      throw new FileStorageError(
        data.error || 'Image processing failed',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Get file metadata by ID
   */
  async getFile(fileId: string): Promise<FileMetadata> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/file_metadata?id=eq.${fileId}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await response.json()) as FileMetadata[];

    if (!response.ok) {
      throw new FileStorageError('Failed to fetch file', response.status, data);
    }

    if (!data || data.length === 0) {
      throw new FileStorageError('File not found', 404);
    }

    return data[0];
  }

  /**
   * List files with filters
   */
  async listFiles(options: ListFilesOptions = {}): Promise<FileMetadata[]> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const params = new URLSearchParams();
    params.append('select', '*');
    params.append('order', 'created_at.desc');

    if (options.entityType) {
      params.append('entity_type', `eq.${options.entityType}`);
    }

    if (options.entityId) {
      params.append('entity_id', `eq.${options.entityId}`);
    }

    if (options.status) {
      params.append('status', `eq.${options.status}`);
    }

    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    if (options.offset) {
      params.append('offset', options.offset.toString());
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/file_metadata?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await response.json()) as FileMetadata[];

    if (!response.ok) {
      throw new FileStorageError('Failed to list files', response.status, data);
    }

    return data;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<DeleteFileResponse> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const response = await fetch(`${this.functionsUrl}/delete-file`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    const data = (await response.json()) as DeleteFileResponse & {
      error?: string;
    };

    if (!response.ok) {
      throw new FileStorageError(
        data.error || 'Delete failed',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(
    fileId: string,
    expiresIn: number = 3600
  ): Promise<string> {
    if (!this.userToken) {
      throw new FileStorageError(
        'User token not set. Call setUserToken() first.',
        401
      );
    }

    const file = await this.getFile(fileId);

    if (file.access_level === 'public') {
      // Public files don't need signed URLs
      return `${this.supabaseUrl}/storage/v1/object/public/${file.storage_path}`;
    }

    // For private files, we'd need to call a Supabase storage API
    // This is a simplified version - you might want to create an edge function for this
    const response = await fetch(
      `${this.supabaseUrl}/storage/v1/object/sign/private-files/${file.storage_path}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiresIn }),
      }
    );

    const data = (await response.json()) as { signedURL: string };

    if (!response.ok) {
      throw new FileStorageError(
        'Failed to generate signed URL',
        response.status,
        data
      );
    }

    return data.signedURL;
  }

  /**
   * Upload and process in one go (convenience method)
   */
  async uploadAndProcess(
    file: File | Blob,
    options: UploadOptions,
    operations: ProcessingOperation[]
  ): Promise<{ upload: UploadResponse; processing: ProcessImageResponse }> {
    const uploadResult = await this.uploadFile(file, options);
    const processingResult = await this.processImage(
      uploadResult.data.id,
      operations
    );

    return {
      upload: uploadResult,
      processing: processingResult,
    };
  }
}
