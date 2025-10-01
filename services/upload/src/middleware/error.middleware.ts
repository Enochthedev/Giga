import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../lib/logger';
import { UploadErrorCode } from '../types/upload.types';
import { ErrorUtils, UploadServiceError } from '../utils/error-utils';

const logger = createLogger('ErrorMiddleware');

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error | UploadServiceError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error
  logger.error('Request error', error, {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  // Handle UploadServiceError
  if (error instanceof UploadServiceError) {
    const statusCode = ErrorUtils.getHttpStatusCode(error);
    return res.status(statusCode).json(ErrorUtils.formatErrorResponse(error));
  }

  // Handle other errors
  const uploadError = ErrorUtils.createUploadError(
    UploadErrorCode.SERVICE_UNAVAILABLE,
    'Internal server error',
    { originalError: error instanceof Error ? error.message : String(error) },
    false
  );

  res.status(500).json(ErrorUtils.formatErrorResponse(uploadError));
}
