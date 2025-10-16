/**
 * Upload Service Client Usage Examples
 *
 * This file contains practical examples of how to use the Upload Service Client
 * in different scenarios across the platform services.
 */

import { readFileSync } from 'fs';
import {
  AccessLevel,
  EntityType,
  UploadClient,
  createUploadClient,
} from './index';

// Example 1: Basic client setup
export function createBasicUploadClient(): UploadClient {
  return createUploadClient({
    baseURL: 'http://localhost:3005',
    serviceToken: 'your-service-token-here',
    retryAttempts: 3,
    timeout: 30000,
  });
}

// Global client instance for examples
let globalClient: UploadClient | null = null;

function getClient(): UploadClient {
  if (!globalClient) {
    globalClient = createBasicUploadClient();
  }
  return globalClient;
}

// For testing purposes
export function setClientForTesting(client: UploadClient): void {
  globalClient = client;
}

export function resetClient(): void {
  globalClient = null;
}

// Example 2: Upload a user profile photo
export async function uploadUserProfilePhoto() {
  const client = getClient();

  try {
    // Read file from filesystem (in real app, this might come from a form upload)
    const fileBuffer = readFileSync('./path/to/profile-photo.jpg');

    const result = await client.uploadProfilePhoto(
      'user-123',
      fileBuffer,
      'profile-photo.jpg',
      'image/jpeg',
      'user-123' // uploadedBy
    );

    console.log('Profile photo uploaded successfully:', {
      fileId: result.data?.id,
      url: result.data?.url,
      thumbnails: result.data?.thumbnails,
    });

    return result;
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    throw error;
  }
}

// Example 3: Upload multiple product images
export async function uploadProductImages() {
  const client = getClient();

  try {
    const files = [
      {
        buffer: readFileSync('./product-image-1.jpg'),
        filename: 'product-image-1.jpg',
        mimeType: 'image/jpeg',
      },
      {
        buffer: readFileSync('./product-image-2.jpg'),
        filename: 'product-image-2.jpg',
        mimeType: 'image/jpeg',
      },
    ];

    const results = await client.uploadMultipleFiles(files, {
      uploadedBy: 'vendor-456',
      files: [
        {
          entityType: EntityType.PRODUCT,
          entityId: 'product-789',
          accessLevel: AccessLevel.PUBLIC,
          metadata: { isPrimary: true, category: 'main' },
          tags: ['product', 'ecommerce', 'featured'],
        },
        {
          entityType: EntityType.PRODUCT,
          entityId: 'product-789',
          accessLevel: AccessLevel.PUBLIC,
          metadata: { isPrimary: false, category: 'gallery' },
          tags: ['product', 'ecommerce', 'gallery'],
        },
      ],
    });

    console.log(`Uploaded ${results.length} product images successfully`);

    return results;
  } catch (error) {
    console.error('Failed to upload product images:', error);
    throw error;
  }
}

// Example 4: Upload a document with custom metadata
export async function uploadDocument() {
  const client = getClient();

  try {
    const documentBuffer = readFileSync('./contract.pdf');

    const result = await client.uploadDocument(
      documentBuffer,
      'contract.pdf',
      'application/pdf',
      {
        entityType: EntityType.DOCUMENT,
        entityId: 'contract-001',
        uploadedBy: 'user-123',
        accessLevel: AccessLevel.PRIVATE,
        metadata: {
          documentType: 'contract',
          version: '1.0',
          department: 'legal',
          confidential: true,
        },
        tags: ['contract', 'legal', 'confidential'],
      }
    );

    console.log('Document uploaded successfully:', {
      fileId: result.data?.id,
      url: result.data?.url,
    });

    return result;
  } catch (error) {
    console.error('Failed to upload document:', error);
    throw error;
  }
}

// Example 5: Monitor file processing status
export async function monitorFileProcessing(fileId: string) {
  const client = getClient();

  try {
    let status = await client.getProcessingStatus(fileId);

    console.log('Initial processing status:', status);

    // Poll for completion
    while (status.status === 'queued' || status.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      status = await client.getProcessingStatus(fileId);
      console.log('Processing status update:', status);
    }

    if (status.status === 'completed') {
      console.log('File processing completed successfully');

      // Get the updated file metadata
      const fileMetadata = await client.getFile(fileId);
      console.log('Final file metadata:', fileMetadata);

      return fileMetadata;
    } else if (status.status === 'failed') {
      console.error('File processing failed:', status.error);

      // Optionally retry processing
      console.log('Retrying processing...');
      await client.retryProcessing(fileId);

      throw new Error(`File processing failed: ${status.error}`);
    }
  } catch (error) {
    console.error('Error monitoring file processing:', error);
    throw error;
  }
}

// Example 6: Search and manage files
export async function searchAndManageFiles() {
  const client = getClient();

  try {
    // Search for all product images
    const searchResults = await client.searchFiles({
      entityType: EntityType.PRODUCT,
      tags: ['product'],
      limit: 10,
      offset: 0,
    });

    console.log(`Found ${searchResults.total} product files`);

    // Get detailed metadata for specific files
    const fileIds = searchResults.files.map(file => file.id);
    const detailedFiles = await client.getMultipleFiles(fileIds);

    console.log('Detailed file information:', detailedFiles);

    // Update metadata for a file
    if (detailedFiles.length > 0) {
      const updatedFile = await client.updateFileMetadata(detailedFiles[0].id, {
        tags: [...detailedFiles[0].tags, 'updated'],
        metadata: {
          ...detailedFiles[0].metadata,
          lastModified: new Date().toISOString(),
        },
      });

      console.log('Updated file metadata:', updatedFile);
    }

    return searchResults;
  } catch (error) {
    console.error('Error searching and managing files:', error);
    throw error;
  }
}

// Example 7: Handle errors and retries
export async function handleErrorsAndRetries() {
  const client = createUploadClient({
    baseURL: 'http://localhost:3005',
    serviceToken: 'your-service-token-here',
    retryAttempts: 5,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    // Custom retry condition
    retryCondition: error => {
      // Retry on network errors and server errors
      if (!error.response) return true;

      const status = error.response.status;
      return status >= 500 || status === 429 || status === 408;
    },
  });

  try {
    const fileBuffer = readFileSync('./large-file.jpg');

    const result = await client.uploadFile(
      fileBuffer,
      'large-file.jpg',
      'image/jpeg',
      {
        entityType: EntityType.PRODUCT,
        entityId: 'product-123',
        uploadedBy: 'user-456',
        accessLevel: AccessLevel.PUBLIC,
      }
    );

    console.log('File uploaded successfully after retries:', result);

    return result;
  } catch (error) {
    console.error('Upload failed after all retry attempts:', error);

    // Handle specific error types
    const uploadError = error as any;
    if (uploadError.code === 'FILE_TOO_LARGE') {
      console.log('File is too large, consider compressing it');
    } else if (uploadError.code === 'INVALID_FILE_TYPE') {
      console.log('File type not supported');
    } else if (uploadError.code === 'SERVICE_UNAVAILABLE') {
      console.log('Upload service is temporarily unavailable');
    }

    throw error;
  }
}

// Example 8: Batch operations
export async function performBatchOperations() {
  const client = getClient();

  try {
    // Upload multiple files
    const files = [
      {
        buffer: readFileSync('./file1.jpg'),
        filename: 'file1.jpg',
        mimeType: 'image/jpeg',
      },
      {
        buffer: readFileSync('./file2.jpg'),
        filename: 'file2.jpg',
        mimeType: 'image/jpeg',
      },
      {
        buffer: readFileSync('./file3.jpg'),
        filename: 'file3.jpg',
        mimeType: 'image/jpeg',
      },
    ];

    const uploadResults = await client.uploadMultipleFiles(files, {
      uploadedBy: 'user-123',
      files: files.map((_, index) => ({
        entityType: EntityType.PRODUCT,
        entityId: `product-${index + 1}`,
        accessLevel: AccessLevel.PUBLIC,
      })),
    });

    const fileIds = uploadResults
      .filter(result => result.success)
      .map(result => result.data?.id);

    console.log(`Successfully uploaded ${fileIds.length} files`);

    // Later, delete some files in batch
    const filesToDelete = fileIds.slice(0, 2); // Delete first 2 files

    const deleteResult = await client.deleteMultipleFiles(filesToDelete.filter((id): id is string => Boolean(id)));

    console.log('Batch delete result:', {
      totalProcessed: deleteResult.totalProcessed,
      successCount: deleteResult.successCount,
      errorCount: deleteResult.errorCount,
    });

    return { uploadResults, deleteResult };
  } catch (error) {
    console.error('Batch operations failed:', error);
    throw error;
  }
}

// Example 9: Get download URLs for private files
export async function getPrivateFileDownloadUrl() {
  const client = getClient();

  try {
    // Upload a private document
    const documentBuffer = readFileSync('./private-document.pdf');

    const uploadResult = await client.uploadDocument(
      documentBuffer,
      'private-document.pdf',
      'application/pdf',
      {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        uploadedBy: 'user-456',
        accessLevel: AccessLevel.PRIVATE,
      }
    );

    if (!uploadResult.success || !uploadResult.data) {
      throw new Error('Upload failed');
    }

    const fileId = uploadResult.data.id;

    // Get a temporary download URL (expires in 1 hour)
    const downloadUrl = await client.getDownloadUrl(fileId, 3600);

    console.log('Private file download URL:', downloadUrl);
    console.log('URL expires in 1 hour');

    return downloadUrl;
  } catch (error) {
    console.error('Failed to get download URL:', error);
    throw error;
  }
}

// Example 10: Monitor queue health
export async function monitorQueueHealth() {
  const client = getClient();

  try {
    const health = await client.getQueueHealth();

    console.log('Queue health status:', {
      active: health.active,
      waiting: health.waiting,
      completed: health.completed,
      failed: health.failed,
      delayed: health.delayed,
      paused: health.paused,
    });

    // Alert if queue is unhealthy
    if (health.failed > 10) {
      console.warn('High number of failed jobs detected!');
    }

    if (health.waiting > 100) {
      console.warn('Queue backlog is high!');
    }

    if (health.paused) {
      console.error('Queue is paused!');
    }

    return health;
  } catch (error) {
    console.error('Failed to get queue health:', error);
    throw error;
  }
}

// Example usage in an Express.js service
export function setupExpressUploadEndpoint() {
  const express = require('express');
  const multer = require('multer');
  const app = express();

  const upload = multer({ storage: multer.memoryStorage() });
  const uploadClient = getClient();

  app.post('/api/upload-profile', upload.single('file'), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const result = await uploadClient.uploadProfilePhoto(
        req.body.userId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.body.uploadedBy
      );

      res.json(result);
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  return app;
}

// Example usage in a Next.js API route
export function nextJsApiRouteExample() {
  return `
// pages/api/upload.js or app/api/upload/route.js
import { createUploadClient } from '@platform/upload/client';

const uploadClient = createUploadClient({
  baseURL: process.env.UPLOAD_SERVICE_URL,
  serviceToken: process.env.UPLOAD_SERVICE_TOKEN,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const result = await uploadClient.uploadFile(
      buffer,
      file.name,
      file.type,
      {
        entityType: 'PRODUCT',
        entityId: formData.get('productId'),
        uploadedBy: formData.get('userId'),
        accessLevel: 'PUBLIC',
      }
    );
    
    return Response.json(result);
  } catch (error) {
    console.error('Upload failed:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
`;
}
