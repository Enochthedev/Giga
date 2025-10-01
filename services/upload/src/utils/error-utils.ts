import { UploadError, UploadErrorCode } from '../types/upload.types';

/**
 * Error handling utilities for the upload service
 */
export class ErrorUtils {
  /**
   * Create a standardized upload error
   */
  static createUploadError(
    code: UploadErrorCode,
    message: string,
    details?: Record<string, any>,
    retryable: boolean = false
  ): UploadError {
    return {
      code,
      message,
      details,
      retryable,
    };
  }

  /**
   * Create error from validation result
   */
  static createValidationError(
    errors: string[],
    details?: Record<string, any>
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.INVALID_REQUEST,
      `Validation failed: ${errors.join(', ')}`,
      { validationErrors: errors, ...details },
      false
    );
  }

  /**
   * Create error for file type validation
   */
  static createFileTypeError(
    actualType: string,
    allowedTypes: string[]
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.INVALID_FILE_TYPE,
      `File type '${actualType}' is not allowed`,
      { actualType, allowedTypes },
      false
    );
  }

  /**
   * Create error for file size validation
   */
  static createFileSizeError(actualSize: number, maxSize: number): UploadError {
    return this.createUploadError(
      UploadErrorCode.FILE_TOO_LARGE,
      `File size (${this.formatBytes(actualSize)}) exceeds maximum allowed size (${this.formatBytes(maxSize)})`,
      { actualSize, maxSize },
      false
    );
  }

  /**
   * Create error for malware detection
   */
  static createMalwareError(threats: string[]): UploadError {
    return this.createUploadError(
      UploadErrorCode.MALWARE_DETECTED,
      `Malware detected in file: ${threats.join(', ')}`,
      { threats },
      false
    );
  }

  /**
   * Create error for processing failures
   */
  static createProcessingError(
    operation: string,
    originalError?: Error
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.PROCESSING_FAILED,
      `File processing failed during ${operation}`,
      {
        operation,
        originalError: originalError
          ? {
              name: originalError.name,
              message: originalError.message,
              stack: originalError.stack,
            }
          : undefined,
      },
      true
    );
  }

  /**
   * Create error for storage failures
   */
  static createStorageError(
    operation: string,
    originalError?: Error
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.STORAGE_ERROR,
      `Storage operation failed: ${operation}`,
      {
        operation,
        originalError: originalError
          ? {
              name: originalError.name,
              message: originalError.message,
            }
          : undefined,
      },
      true
    );
  }

  /**
   * Create error for permission issues
   */
  static createPermissionError(
    resource: string,
    operation: string
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.PERMISSION_DENIED,
      `Permission denied for ${operation} on ${resource}`,
      { resource, operation },
      false
    );
  }

  /**
   * Create error for quota exceeded
   */
  static createQuotaError(currentUsage: number, quota: number): UploadError {
    return this.createUploadError(
      UploadErrorCode.QUOTA_EXCEEDED,
      `Storage quota exceeded: ${this.formatBytes(currentUsage)} / ${this.formatBytes(quota)}`,
      { currentUsage, quota },
      false
    );
  }

  /**
   * Create error for service unavailability
   */
  static createServiceUnavailableError(
    service: string,
    reason?: string
  ): UploadError {
    return this.createUploadError(
      UploadErrorCode.SERVICE_UNAVAILABLE,
      `Service unavailable: ${service}${reason ? ` - ${reason}` : ''}`,
      { service, reason },
      true
    );
  }

  /**
   * Convert error to HTTP status code
   */
  static getHttpStatusCode(error: UploadError): number {
    const statusMap: Record<UploadErrorCode, number> = {
      [UploadErrorCode.INVALID_FILE_TYPE]: 400,
      [UploadErrorCode.FILE_TOO_LARGE]: 413,
      [UploadErrorCode.MALWARE_DETECTED]: 400,
      [UploadErrorCode.PROCESSING_FAILED]: 500,
      [UploadErrorCode.STORAGE_ERROR]: 500,
      [UploadErrorCode.PERMISSION_DENIED]: 403,
      [UploadErrorCode.QUOTA_EXCEEDED]: 429,
      [UploadErrorCode.SERVICE_UNAVAILABLE]: 503,
      [UploadErrorCode.INVALID_REQUEST]: 400,
    };

    return statusMap[error.code] || 500;
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: UploadError): boolean {
    return error.retryable;
  }

  /**
   * Format error for API response
   */
  static formatErrorResponse(error: UploadError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        retryable: error.retryable,
        ...(error.details && { details: error.details }),
      },
    };
  }

  /**
   * Format error for logging
   */
  static formatErrorForLogging(
    error: UploadError,
    context?: Record<string, any>
  ) {
    return {
      errorCode: error.code,
      errorMessage: error.message,
      retryable: error.retryable,
      errorDetails: error.details,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Wrap async function with error handling
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorContext: string
  ): Promise<
    { success: true; data: T } | { success: false; error: UploadError }
  > {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      if (error instanceof Error) {
        const uploadError = this.createProcessingError(errorContext, error);
        return { success: false, error: uploadError };
      }

      const uploadError = this.createProcessingError(errorContext);
      return { success: false, error: uploadError };
    }
  }

  /**
   * Format bytes to human readable string
   */
  private static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

/**
 * Custom error classes
 */
export class UploadServiceError extends Error {
  public readonly code: UploadErrorCode;
  public readonly retryable: boolean;
  public readonly details?: Record<string, any>;

  constructor(error: UploadError) {
    super(error.message);
    this.name = 'UploadServiceError';
    this.code = error.code;
    this.retryable = error.retryable;
    this.details = error.details;
  }
}

export class ValidationError extends UploadServiceError {
  constructor(errors: string[], details?: Record<string, any>) {
    super(ErrorUtils.createValidationError(errors, details));
    this.name = 'ValidationError';
  }
}

export class SecurityError extends UploadServiceError {
  constructor(message: string, details?: Record<string, any>) {
    super(
      ErrorUtils.createUploadError(
        UploadErrorCode.MALWARE_DETECTED,
        message,
        details,
        false
      )
    );
    this.name = 'SecurityError';
  }
}

export class StorageError extends UploadServiceError {
  constructor(operation: string, originalError?: Error) {
    super(ErrorUtils.createStorageError(operation, originalError));
    this.name = 'StorageError';
  }
}

export class ProcessingError extends UploadServiceError {
  constructor(operation: string, originalError?: Error) {
    super(ErrorUtils.createProcessingError(operation, originalError));
    this.name = 'ProcessingError';
  }
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
