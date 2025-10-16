import { Request, Response } from 'express';
import pLimit from 'p-limit';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { AsyncProcessingService } from '../services/async-processing.service';
import { FileValidatorService } from '../services/file-validator.service';
import { MetadataService } from '../services/metadata.service';
import { ProcessingStatusService } from '../services/processing-status.service';
import { StorageManagerService } from '../services/storage-manager.service';
import {
  AccessLevel,
  EntityType,
  FileStatus,
  UploadRequest,
  UploadResult,
} from '../types/upload.types';
import { AppError } from '../utils/error-utils';
import { generateFileId, sanitizeFileName } from '../utils/file-utils';

// Validation schemas
const uploadRequestSchema = z.object({
  entityType: z.nativeEnum(EntityType),
  entityId: z.string().min(1),
  uploadedBy: z.string().min(1),
  accessLevel: z
    .nativeEnum(AccessLevel)
    .optional()
    .default(AccessLevel.PRIVATE),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

const multipleUploadSchema = z.object({
  files: z.array(
    z.object({
      entityType: z.nativeEnum(EntityType),
      entityId: z.string().min(1),
      accessLevel: z
        .nativeEnum(AccessLevel)
        .optional()
        .default(AccessLevel.PRIVATE),
      metadata: z.record(z.any()).optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
  uploadedBy: z.string().min(1),
});

export class UploadController {
  private concurrencyLimit = pLimit(parseInt(process.env.MAX_CONCURRENT_UPLOADS || '10'));

  constructor(
    private fileValidator: FileValidatorService,
    private storageManager: StorageManagerService,
    private metadataService: MetadataService,
    private asyncProcessingService: AsyncProcessingService,
    private processingStatusService: ProcessingStatusService
  ) { }

  /**
   * Upload a single file with streaming
   */
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware
      const validatedData = uploadRequestSchema.parse(req.body);

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        ...validatedData,
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload multiple files with streaming and memory management
   */
  async uploadMultipleFiles(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new AppError('No files provided', 'INVALID_REQUEST', 400);
      }

      const validatedData = multipleUploadSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];

      if (files.length !== validatedData.files.length) {
        throw new AppError(
          'File count mismatch with metadata',
          'INVALID_REQUEST',
          400
        );
      }

      // Memory monitoring handled by middleware
      const uploadPromises = files.map((file, index) => {
        const fileData = validatedData.files[index];
        if (!fileData) {
          throw new AppError('Missing file metadata', 'INVALID_REQUEST', 400);
        }

        const uploadRequest: UploadRequest = {
          file: {
            buffer: file.buffer,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          },
          uploadedBy: validatedData.uploadedBy,
          ...fileData,
        };
        // Use concurrency limit to prevent memory explosion
        return this.concurrencyLimit(() => this.processStreamingUpload(uploadRequest));
      });

      const results = await Promise.allSettled(uploadPromises);

      // Process results and handle failures gracefully
      const successResults: UploadResult['data'][] = [];
      const errors: Array<{ index: number; fileName: string; error: string }> = [];

      results.forEach((result, index) => {
        const file = files[index];
        if (!file) return;

        if (result.status === 'fulfilled') {
          successResults.push(result.value.data);
        } else {
          errors.push({
            index,
            fileName: file.originalname,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          });
        }
      });

      res.status(201).json({
        success: true,
        data: {
          results: successResults,
          totalProcessed: results.length,
          successCount: successResults.length,
          errorCount: errors.length,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      logger.error('Multiple upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware

      const { userId } = req.params;
      const uploadedBy = req.body.uploadedBy || userId;

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        entityType: EntityType.USER_PROFILE,
        entityId: userId,
        uploadedBy,
        accessLevel: AccessLevel.PUBLIC,
        metadata: { category: 'profile_photo' },
        tags: ['profile', 'avatar'],
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Profile photo upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload product image
   */
  async uploadProductImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware

      const { productId } = req.params;
      const { uploadedBy, isPrimary = false } = req.body;

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        entityType: EntityType.PRODUCT,
        entityId: productId,
        uploadedBy,
        accessLevel: AccessLevel.PUBLIC,
        metadata: {
          category: 'product_image',
          isPrimary: Boolean(isPrimary),
        },
        tags: ['product', 'ecommerce'],
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Product image upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload property photo
   */
  async uploadPropertyPhoto(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware

      const { propertyId } = req.params;
      const { uploadedBy, roomType, isPrimary = false } = req.body;

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        entityType: EntityType.PROPERTY,
        entityId: propertyId,
        uploadedBy,
        accessLevel: AccessLevel.PUBLIC,
        metadata: {
          category: 'property_photo',
          roomType: roomType || 'general',
          isPrimary: Boolean(isPrimary),
        },
        tags: ['property', 'hotel', 'accommodation'],
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Property photo upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload vehicle photo
   */
  async uploadVehiclePhoto(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware

      const { vehicleId } = req.params;
      const { uploadedBy, photoType = 'exterior' } = req.body;

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        entityType: EntityType.VEHICLE,
        entityId: vehicleId,
        uploadedBy,
        accessLevel: AccessLevel.PUBLIC,
        metadata: {
          category: 'vehicle_photo',
          photoType,
        },
        tags: ['vehicle', 'taxi', 'transport'],
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Vehicle photo upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 'INVALID_REQUEST', 400);
      }

      // Memory monitoring handled by middleware

      const validatedData = uploadRequestSchema.parse(req.body);

      const uploadRequest: UploadRequest = {
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
        ...validatedData,
        metadata: {
          ...validatedData.metadata,
          category: 'document',
        },
        tags: [...(validatedData.tags || []), 'document'],
      };

      const result = await this.processStreamingUpload(uploadRequest);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Document upload failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Get file metadata
   */
  async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const metadata = await this.metadataService.getMetadata(fileId);
      if (!metadata) {
        throw new AppError('File not found', 'NOT_FOUND', 404);
      }

      res.json({
        success: true,
        data: metadata,
      });
    } catch (error) {
      logger.error('Get file failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Delete file
   */
  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const metadata = await this.metadataService.getMetadata(fileId);
      if (!metadata) {
        throw new AppError('File not found', 'NOT_FOUND', 404);
      }

      // Cancel any ongoing processing
      await this.asyncProcessingService.cancelProcessing(fileId);

      // Delete from storage
      await this.storageManager.delete(metadata.path);

      // Update metadata status
      await this.metadataService.updateMetadata(fileId, {
        status: FileStatus.DELETED,
        updatedAt: new Date(),
      });

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      logger.error('Delete file failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Get file processing status
   */
  async getProcessingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const status =
        await this.asyncProcessingService.getProcessingStatus(fileId);

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      logger.error('Get processing status failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Retry failed processing
   */
  async retryProcessing(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const success =
        await this.asyncProcessingService.retryFailedProcessing(fileId);

      if (!success) {
        throw new AppError('Failed to retry processing', 'RETRY_FAILED', 500);
      }

      res.json({
        success: true,
        message: 'Processing retry initiated',
      });
    } catch (error) {
      logger.error('Retry processing failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Cancel file processing
   */
  async cancelProcessing(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const success =
        await this.asyncProcessingService.cancelProcessing(fileId);

      res.json({
        success: true,
        cancelled: success,
        message: success
          ? 'Processing cancelled'
          : 'No active processing to cancel',
      });
    } catch (error) {
      logger.error('Cancel processing failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Get queue health status
   */
  async getQueueHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.asyncProcessingService.getQueueHealth();

      res.json({
        success: true,
        data: health,
      });
    } catch (error) {
      logger.error('Get queue health failed:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Process upload request with streaming for memory efficiency
   */
  private async processStreamingUpload(
    uploadRequest: UploadRequest
  ): Promise<UploadResult> {
    // Basic file validation (quick checks only)
    const basicValidation = await this.fileValidator.validateBasicFile(
      uploadRequest.file
    );
    if (!basicValidation.isValid) {
      throw new AppError(
        `File validation failed: ${basicValidation.errors.join(', ')}`,
        'VALIDATION_FAILED',
        400
      );
    }

    // Generate file ID and sanitize filename
    const fileId = generateFileId();
    const sanitizedName = sanitizeFileName(uploadRequest.file.originalName);
    const fileExtension = sanitizedName.split('.').pop() || '';
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `${uploadRequest.entityType}/${uploadRequest.entityId}/${fileName}`;

    // Store file using storage manager (already optimized for streaming)
    const storageResult = await this.storageManager.store(
      uploadRequest.file,
      filePath
    );

    // Create initial metadata with processing status
    const fileUrl = storageResult.url || `/api/v1/uploads/${fileId}`;
    const metadata = await this.metadataService.createMetadata({
      id: fileId,
      originalName: uploadRequest.file.originalName,
      fileName,
      mimeType: uploadRequest.file.mimeType,
      size: uploadRequest.file.size,
      path: filePath,
      url: fileUrl,
      uploadedBy: uploadRequest.uploadedBy,
      entityType: uploadRequest.entityType,
      entityId: uploadRequest.entityId,
      accessLevel: uploadRequest.accessLevel,
      status: FileStatus.PROCESSING, // Set to processing initially
      metadata: uploadRequest.metadata || {},
      tags: uploadRequest.tags || [],
    });

    // Queue async processing
    try {
      const jobIds = await this.asyncProcessingService.processFileUpload({
        fileId,
        filePath,
        originalName: uploadRequest.file.originalName,
        mimeType: uploadRequest.file.mimeType,
        size: uploadRequest.file.size,
        entityType: uploadRequest.entityType,
        entityId: uploadRequest.entityId,
      });

      logger.info(`Async processing queued for file ${fileId}:`, jobIds);

      return {
        success: true,
        data: {
          id: fileId,
          url: fileUrl,
          metadata: metadata,
        },
      };
    } catch (processingError) {
      logger.error(
        `Failed to queue async processing for file ${fileId}:`,
        processingError
      );

      // Update status to failed
      await this.metadataService.updateMetadata(fileId, {
        status: FileStatus.FAILED,
        updatedAt: new Date(),
      });

      throw new AppError(
        'Failed to queue file processing',
        'PROCESSING_QUEUE_FAILED',
        500
      );
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
