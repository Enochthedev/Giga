# Upload Service Client Library

This document provides information about the Upload Service Client Library implementation for
task 12.

## Overview

The client library provides a TypeScript client for integrating with the Upload Service. It
includes:

- **TypeScript Client**: Full-featured client with type safety
- **Retry Logic**: Configurable retry mechanism with exponential backoff
- **Error Handling**: Comprehensive error handling with typed error responses
- **Usage Examples**: Practical examples for common use cases
- **Integration Tests**: Comprehensive test coverage

## Files Created

### Core Client Files

- `src/client/upload-client.ts` - Main client implementation
- `src/client/index.ts` - Public API exports
- `src/client/examples.ts` - Usage examples and integration patterns
- `src/client/README.md` - Comprehensive documentation

### Test Files

- `src/__tests__/client/upload-client.integration.test.ts` - Integration tests
- `src/__tests__/client/upload-client.unit.test.ts` - Unit tests
- `src/__tests__/client/examples.test.ts` - Example tests

## Key Features Implemented

### 1. TypeScript Client (`UploadClient`)

The main client class provides methods for all upload operations:

- **File Upload Methods**: `uploadFile`, `uploadMultipleFiles`
- **Specialized Upload Methods**: `uploadProfilePhoto`, `uploadProductImage`, `uploadPropertyPhoto`,
  `uploadVehiclePhoto`, `uploadDocument`
- **File Management**: `getFile`, `deleteFile`, `updateFileMetadata`
- **Batch Operations**: `deleteMultipleFiles`, `getMultipleFiles`
- **Processing Monitoring**: `getProcessingStatus`, `retryProcessing`, `cancelProcessing`
- **Search and Discovery**: `searchFiles`, `getDownloadUrl`
- **Health Monitoring**: `getQueueHealth`

### 2. Retry Logic and Error Handling

- **Configurable Retries**: Customizable retry attempts, delays, and conditions
- **Exponential Backoff**: Intelligent retry delays that increase exponentially
- **Smart Retry Conditions**: Only retries on transient errors (network issues, server errors, rate
  limiting)
- **Typed Error Responses**: Comprehensive error types with specific error codes
- **Error Recovery**: Graceful handling of different error scenarios

### 3. Usage Examples and Documentation

The `examples.ts` file provides practical examples for:

- Basic client setup and configuration
- Profile photo uploads
- Product image uploads with metadata
- Document uploads with access controls
- File processing monitoring
- Batch operations
- Error handling patterns
- Integration with Express.js and Next.js
- Queue health monitoring

### 4. Integration Tests

Comprehensive test coverage including:

- **Client Configuration**: Testing different configuration options
- **File Upload Operations**: All upload methods with various scenarios
- **File Management**: CRUD operations on file metadata
- **Error Handling**: Network errors, API errors, timeout handling
- **Retry Logic**: Testing retry behavior and conditions
- **Batch Operations**: Multi-file operations
- **Processing Monitoring**: Status tracking and queue health

## Configuration Options

```typescript
interface UploadClientConfig {
  baseURL: string; // Upload service base URL (required)
  timeout?: number; // Request timeout (default: 30000ms)
  retryAttempts?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Initial retry delay (default: 1000ms)
  maxRetryDelay?: number; // Maximum retry delay (default: 10000ms)
  apiKey?: string; // API key for authentication
  serviceToken?: string; // Service token for authentication
  retryCondition?: (error: any) => boolean; // Custom retry condition
}
```

## Usage Example

```typescript
import { createUploadClient, EntityType, AccessLevel } from '@platform/upload/client';

// Create client
const client = createUploadClient({
  baseURL: 'http://localhost:3005',
  serviceToken: 'your-service-token',
  retryAttempts: 3,
});

// Upload a file
const result = await client.uploadFile(fileBuffer, 'example.jpg', 'image/jpeg', {
  entityType: EntityType.PRODUCT,
  entityId: 'product-123',
  uploadedBy: 'user-456',
  accessLevel: AccessLevel.PUBLIC,
});
```

## Requirements Coverage

This implementation covers the following requirements from the task:

✅ **Build TypeScript client for service integration**

- Complete TypeScript client with full type safety
- Supports all upload service operations
- Configurable client options

✅ **Add retry logic and error handling**

- Configurable retry mechanism with exponential backoff
- Comprehensive error handling with typed responses
- Smart retry conditions for transient errors

✅ **Create usage examples and documentation**

- Extensive examples for all common use cases
- Integration patterns for Express.js and Next.js
- Comprehensive README with API documentation

✅ **Write client integration tests**

- Integration tests for all client methods
- Unit tests for client logic and utilities
- Example tests to verify usage patterns
- Error handling and retry logic tests

## Dependencies Added

- `axios`: HTTP client for API requests
- `form-data`: For multipart form uploads
- `@types/form-data`: TypeScript types for form-data

## Next Steps

The client library is ready for use by other platform services. To integrate:

1. Install the upload service package
2. Import the client from `@platform/upload/client`
3. Configure with your service's base URL and authentication
4. Use the provided examples as integration guides

The client provides a robust, type-safe interface for all upload operations with built-in
reliability features.
