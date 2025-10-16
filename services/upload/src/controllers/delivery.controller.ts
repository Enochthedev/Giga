import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { DeliveryService } from '../services/delivery.service';
import { AppError } from '../utils/error-utils';

// Validation schemas
const presignedUrlSchema = z.object({
  operation: z.enum(['read', 'write']).optional().default('read'),
  expiresIn: z.number().min(60).max(86400).optional().default(3600), // 1 minute to 24 hours
});

const responsiveUrlsSchema = z.object({
  sizes: z.array(z.string()).optional(),
});

/**
 * Controller for file delivery and CDN operations
 */
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  /**
   * Serve file with optimizations
   */
  async serveFile(req: Request, res: Response): Promise<void> {
    await this.deliveryService.serveFile(req, res);
  }

  /**
   * Generate presigned URL for file access
   */
  async generatePresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const validatedData = presignedUrlSchema.parse(req.body);
      const userId = req.user?.id;

      const presignedUrl = await this.deliveryService.generatePresignedUrl(
        fileId,
        validatedData.operation,
        validatedData.expiresIn,
        userId
      );

      res.json({
        success: true,
        data: {
          url: presignedUrl,
          operation: validatedData.operation,
          expiresIn: validatedData.expiresIn,
          expiresAt: new Date(
            Date.now() + validatedData.expiresIn * 1000
          ).toISOString(),
        },
      });
    } catch (error) {
      logger.error('Generate presigned URL failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Get responsive image URLs
   */
  async getResponsiveUrls(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = req.user?.id;

      const responsiveUrls = await this.deliveryService.getResponsiveUrls(
        fileId,
        userId
      );

      res.json({
        success: true,
        data: {
          fileId,
          urls: responsiveUrls,
        },
      });
    } catch (error) {
      logger.error('Get responsive URLs failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Validate presigned URL
   */
  async validatePresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url, path } = req.body;

      if (!url || !path) {
        throw new AppError('URL and path are required', 'INVALID_REQUEST', 400);
      }

      const isValid = await this.deliveryService.validatePresignedAccess(
        url,
        path
      );

      res.json({
        success: true,
        data: {
          valid: isValid,
          url,
          path,
        },
      });
    } catch (error) {
      logger.error('Validate presigned URL failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Get file delivery info
   */
  async getDeliveryInfo(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = req.user?.id;

      // Get responsive URLs
      const responsiveUrls = await this.deliveryService.getResponsiveUrls(
        fileId,
        userId
      );

      // Generate presigned URL for direct access
      const presignedUrl = await this.deliveryService.generatePresignedUrl(
        fileId,
        'read',
        3600,
        userId
      );

      res.json({
        success: true,
        data: {
          fileId,
          responsiveUrls,
          presignedUrl,
          directUrl: `/api/v1/files/${fileId}`,
        },
      });
    } catch (error) {
      logger.error('Get delivery info failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown, res: Response): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    } else if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  }
}
