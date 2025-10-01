# Upload Service Client Library

A TypeScript client library for integrating with the Upload Service. This library provides a
convenient, type-safe interface for all file upload operations with built-in retry logic, error
handling, and comprehensive documentation.

## Features

- 🚀 **Easy Integration**: Simple API for all upload operations
- 🔄 **Automatic Retries**: Configurable retry logic with exponential backoff
- 🛡️ **Error Handling**: Comprehensive error handling with typed error responses
- 📝 **TypeScript Support**: Full TypeScript support with detailed type definitions
- 🎯 **Specialized Methods**: Dedicated methods for different file types (profiles, products,
  properties, etc.)
- 📊 **Monitoring**: Built-in support for processing status monitoring and queue health
- 🔐 **Security**: Support for authentication tokens and private file access

## Installation

```bash
npm install @platform/upload
```

## Quick Start

```typescript
import { createUploadClient, EntityType, AccessLevel } from '@platform/upload/client';

// Create client instance
const uploadClient = createUploadClient({
  baseURL: 'http://localhost:3005',
  serviceToken: 'your-service-token-here',
  retryAttempts: 3,
  timeout: 30000,
});

// Upload a file
const result = await uploadClient.uploadFile(fileBuffer, 'example.jpg', 'image/jpeg', {
  entityType: EntityType.PRODUCT,
  entityId: 'product-123',
  uploadedBy: 'user-456',
  accessLevel: AccessLevel.PUBLIC,
});

console.log('File uploaded:', result.data?.url);
```

## Configuration

### UploadClientConfig

```typescript
interface UploadClientConfig {
  baseURL: string; // Upload service base URL
  timeout?: number; // Request timeout (default: 30000ms)
  retryAttempts?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Initial retry delay (default: 1000ms)
  maxRetryDelay?: number; // Maximum retry delay (default: 10000ms)
  apiKey?: string; // API key for authentication
  serviceToken?: string; // Service token for authentication
  retryCondition?: (error: any) => boolean; // Custom retry condition
}
```

### Default Configuration

```typescript
const defaultConfig = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  maxRetryDelay: 10000,
  retryCondition: error => {
    // Retry on network errors and server errors (5xx) or rate limiting (429)
    if (!error.response) return true;
    const status = error.response.status;
    return status >= 500 || status === 429;
  },
};
```

## API Reference

### File Upload Methods

#### `uploadFile(file, filename, mimeType, options)`

Upload a single file with custom options.

```typescript
const result = await client.uploadFile(fileBuffer, 'document.pdf', 'application/pdf', {
  entityType: EntityType.DOCUMENT,
  entityId: 'doc-123',
  uploadedBy: 'user-456',
  accessLevel: AccessLevel.PRIVATE,
  metadata: { category: 'contract' },
  tags: ['legal', 'important'],
});
```

#### `uploadMultipleFiles(files, options)`

Upload multiple files in a single request.

```typescript
const results = await client.uploadMultipleFiles(
  [
    { buffer: file1Buffer, filename: 'image1.jpg', mimeType: 'image/jpeg' },
    { buffer: file2Buffer, filename: 'image2.jpg', mimeType: 'image/jpeg' },
  ],
  {
    uploadedBy: 'user-123',
    files: [
      {
        entityType: EntityType.PRODUCT,
        entityId: 'product-456',
        accessLevel: AccessLevel.PUBLIC,
      },
      {
        entityType: EntityType.PRODUCT,
        entityId: 'product-456',
        accessLevel: AccessLevel.PUBLIC,
      },
    ],
  }
);
```

### Specialized Upload Methods

#### `uploadProfilePhoto(userId, file, filename, mimeType, uploadedBy?)`

Upload a user profile photo with automatic optimization.

```typescript
const result = await client.uploadProfilePhoto('user-123', fileBuffer, 'avatar.jpg', 'image/jpeg');
```

#### `uploadProductImage(productId, file, filename, mimeType, uploadedBy, isPrimary?)`

Upload a product image with ecommerce-specific metadata.

```typescript
const result = await client.uploadProductImage(
  'product-456',
  fileBuffer,
  'product-main.jpg',
  'image/jpeg',
  'vendor-789',
  true // isPrimary
);
```

#### `uploadPropertyPhoto(propertyId, file, filename, mimeType, uploadedBy, options?)`

Upload a property photo for hotel/accommodation listings.

```typescript
const result = await client.uploadPropertyPhoto(
  'property-123',
  fileBuffer,
  'room-view.jpg',
  'image/jpeg',
  'hotel-manager-456',
  {
    roomType: 'deluxe',
    isPrimary: false,
  }
);
```

#### `uploadVehiclePhoto(vehicleId, file, filename, mimeType, uploadedBy, photoType?)`

Upload a vehicle photo for taxi/transport services.

```typescript
const result = await client.uploadVehiclePhoto(
  'vehicle-789',
  fileBuffer,
  'car-exterior.jpg',
  'image/jpeg',
  'driver-123',
  'exterior'
);
```

#### `uploadDocument(file, filename, mimeType, options)`

Upload a document with custom metadata and access controls.

```typescript
const result = await client.uploadDocument(fileBuffer, 'contract.pdf', 'application/pdf', {
  entityType: EntityType.DOCUMENT,
  entityId: 'contract-001',
  uploadedBy: 'user-123',
  accessLevel: AccessLevel.PRIVATE,
  metadata: { documentType: 'contract', version: '1.0' },
  tags: ['legal', 'confidential'],
});
```

### File Management Methods

#### `getFile(fileId)`

Get file metadata by ID.

```typescript
const metadata = await client.getFile('file-123');
console.log(metadata.url, metadata.status, metadata.thumbnails);
```

#### `getMultipleFiles(fileIds)`

Get metadata for multiple files.

```typescript
const files = await client.getMultipleFiles(['file-1', 'file-2', 'file-3']);
```

#### `deleteFile(fileId)`

Delete a single file.

```typescript
const success = await client.deleteFile('file-123');
```

#### `deleteMultipleFiles(fileIds)`

Delete multiple files in batch.

```typescript
const result = await client.deleteMultipleFiles(['file-1', 'file-2']);
console.log(`Deleted ${result.successCount} files`);
```

#### `updateFileMetadata(fileId, metadata)`

Update file metadata, tags, or access level.

```typescript
const updatedFile = await client.updateFileMetadata('file-123', {
  tags: ['updated', 'processed'],
  metadata: { processed: true },
  accessLevel: AccessLevel.PUBLIC,
});
```

### Processing and Monitoring

#### `getProcessingStatus(fileId)`

Get the current processing status of a file.

```typescript
const status = await client.getProcessingStatus('file-123');
console.log(status.status, status.progress, status.jobs);
```

#### `retryProcessing(fileId)`

Retry failed file processing.

```typescript
const success = await client.retryProcessing('file-123');
```

#### `cancelProcessing(fileId)`

Cancel ongoing file processing.

```typescript
const cancelled = await client.cancelProcessing('file-123');
```

#### `getQueueHealth()`

Get processing queue health status.

```typescript
const health = await client.getQueueHealth();
console.log(`Active: ${health.active}, Waiting: ${health.waiting}`);
```

### Search and Discovery

#### `searchFiles(criteria)`

Search files by various criteria.

```typescript
const results = await client.searchFiles({
  entityType: EntityType.PRODUCT,
  uploadedBy: 'user-123',
  tags: ['featured'],
  mimeType: 'image/jpeg',
  limit: 20,
  offset: 0,
});

console.log(`Found ${results.total} files`);
```

#### `getDownloadUrl(fileId, expiresIn?)`

Get a temporary download URL for private files.

```typescript
const downloadUrl = await client.getDownloadUrl('file-123', 3600); // 1 hour
```

## Error Handling

The client provides comprehensive error handling with typed error responses:

```typescript
import { UploadError, UploadErrorCode } from '@platform/upload/client';

try {
  const result = await client.uploadFile(/* ... */);
} catch (error) {
  if (error instanceof UploadError) {
    switch (error.code) {
      case UploadErrorCode.FILE_TOO_LARGE:
        console.log('File is too large');
        break;
      case UploadErrorCode.INVALID_FILE_TYPE:
        console.log('File type not supported');
        break;
      case UploadErrorCode.SERVICE_UNAVAILABLE:
        console.log('Service temporarily unavailable');
        if (error.retryable) {
          // The client will automatically retry
        }
        break;
      default:
        console.log('Upload failed:', error.message);
    }
  }
}
```

### Error Codes

- `INVALID_FILE_TYPE`: File type not allowed
- `FILE_TOO_LARGE`: File exceeds size limits
- `MALWARE_DETECTED`: File failed security scan
- `PROCESSING_FAILED`: File processing failed
- `STORAGE_ERROR`: Storage operation failed
- `PERMISSION_DENIED`: Insufficient permissions
- `QUOTA_EXCEEDED`: Storage quota exceeded
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `INVALID_REQUEST`: Invalid request parameters

## Retry Logic

The client includes intelligent retry logic:

- **Automatic Retries**: Failed requests are automatically retried
- **Exponential Backoff**: Retry delays increase exponentially
- **Configurable**: Customize retry attempts, delays, and conditions
- **Smart Conditions**: Only retries on transient errors (network issues, server errors, rate
  limiting)

```typescript
const client = createUploadClient({
  baseURL: 'http://localhost:3005',
  retryAttempts: 5,
  retryDelay: 1000,
  maxRetryDelay: 30000,
  retryCondition: error => {
    // Custom retry logic
    if (!error.response) return true; // Network error
    const status = error.response.status;
    return status >= 500 || status === 429 || status === 408;
  },
});
```

## Integration Examples

### Express.js Integration

```typescript
import express from 'express';
import multer from 'multer';
import { createUploadClient } from '@platform/upload/client';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const uploadClient = createUploadClient({
  baseURL: process.env.UPLOAD_SERVICE_URL!,
  serviceToken: process.env.UPLOAD_SERVICE_TOKEN!,
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadClient.uploadFile(
      req.file!.buffer,
      req.file!.originalname,
      req.file!.mimetype,
      {
        entityType: req.body.entityType,
        entityId: req.body.entityId,
        uploadedBy: req.user.id,
        accessLevel: req.body.accessLevel || 'PRIVATE',
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Next.js API Route

```typescript
// app/api/upload/route.ts
import { createUploadClient } from '@platform/upload/client';

const uploadClient = createUploadClient({
  baseURL: process.env.UPLOAD_SERVICE_URL!,
  serviceToken: process.env.UPLOAD_SERVICE_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadClient.uploadFile(buffer, file.name, file.type, {
      entityType: formData.get('entityType') as string,
      entityId: formData.get('entityId') as string,
      uploadedBy: formData.get('userId') as string,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### React Hook

```typescript
import { useState } from 'react';
import { createUploadClient } from '@platform/upload/client';

const uploadClient = createUploadClient({
  baseURL: process.env.REACT_APP_UPLOAD_SERVICE_URL!,
  serviceToken: process.env.REACT_APP_UPLOAD_SERVICE_TOKEN!,
});

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, options: any) => {
    setUploading(true);
    setProgress(0);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await uploadClient.uploadFile(buffer, file.name, file.type, options);

      setProgress(100);
      return result;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
}
```

## Best Practices

### 1. Error Handling

Always handle errors appropriately and provide user feedback:

```typescript
try {
  const result = await client.uploadFile(/* ... */);
  // Handle success
} catch (error) {
  if (error.code === 'FILE_TOO_LARGE') {
    showError('File is too large. Please choose a smaller file.');
  } else if (error.retryable) {
    showError('Upload failed. Please try again.');
  } else {
    showError('Upload failed. Please check your file and try again.');
  }
}
```

### 2. Progress Monitoring

For long-running uploads, monitor processing status:

```typescript
const result = await client.uploadFile(/* ... */);
const fileId = result.data?.id;

if (fileId) {
  // Poll for completion
  const checkStatus = async () => {
    const status = await client.getProcessingStatus(fileId);

    if (status.status === 'processing') {
      setTimeout(checkStatus, 2000);
    } else if (status.status === 'completed') {
      // Processing complete
      const finalMetadata = await client.getFile(fileId);
      console.log('Processing complete:', finalMetadata);
    }
  };

  checkStatus();
}
```

### 3. Batch Operations

Use batch operations for better performance:

```typescript
// Instead of multiple individual uploads
const results = await client.uploadMultipleFiles(files, options);

// Instead of multiple individual deletes
const deleteResult = await client.deleteMultipleFiles(fileIds);
```

### 4. Configuration Management

Use environment-specific configuration:

```typescript
const config = {
  baseURL: process.env.UPLOAD_SERVICE_URL || 'http://localhost:3005',
  serviceToken: process.env.UPLOAD_SERVICE_TOKEN,
  retryAttempts: process.env.NODE_ENV === 'production' ? 5 : 3,
  timeout: process.env.NODE_ENV === 'production' ? 60000 : 30000,
};

const client = createUploadClient(config);
```

## Troubleshooting

### Common Issues

1. **Network Timeouts**: Increase timeout for large files
2. **Authentication Errors**: Verify service token is correct
3. **File Type Errors**: Check allowed MIME types
4. **Size Limit Errors**: Verify file size limits

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=upload-client npm start
```

## Support

For issues and questions:

1. Check the [examples](./examples.ts) for common use cases
2. Review error codes and messages
3. Enable debug logging for detailed information
4. Contact the platform team for service-specific issues

## License

This client library is part of the platform services and follows the same licensing terms.
