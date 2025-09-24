import { Request, Response } from 'express';
import { StorageManager } from '../services/storage-manager.service';
import { UploadService } from '../services/upload.service';
import { EntityType, FileData } from '../types/upload.types';

export class UploadController {
  private uploadService: UploadService;
  private storageManager: StorageManager;

  constructor() {
    this.uploadService = UploadService.getInstance();
    this.storageManager = StorageManager.getInstance();
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(_req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const fileData: FileData = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.uploadService.uploadProfilePhoto(userId, fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Profile photo uploaded successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Upload profile photo error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload profile photo',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Upload product image
   */
  async uploadProductImage(_req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      const { productId, vendorId } = req.body;
      if (!productId || !vendorId) {
        return res.status(400).json({
          success: false,
          error: 'productId and vendorId are required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const fileData: FileData = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.uploadService.uploadProductImage(productId, vendorId, fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Product image uploaded successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Upload product image error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload product image',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Upload property photo
   */
  async uploadPropertyPhoto(_req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      const { propertyId, hostId } = req.body;
      if (!propertyId || !hostId) {
        return res.status(400).json({
          success: false,
          error: 'propertyId and hostId are required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const fileData: FileData = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.uploadService.uploadPropertyPhoto(propertyId, hostId, fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Property photo uploaded successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Upload property photo error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload property photo',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Upload vehicle photo
   */
  async uploadVehiclePhoto(_req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      const { vehicleId, driverId } = req.body;
      if (!vehicleId || !driverId) {
        return res.status(400).json({
          success: false,
          error: 'vehicleId and driverId are required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const fileData: FileData = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.uploadService.uploadVehiclePhoto(vehicleId, driverId, fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Vehicle photo uploaded successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Upload vehicle photo error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload vehicle photo',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(_req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE',
          timestamp: new Date().toISOString(),
        });
      }

      const { entityId, entityType, uploadedBy } = req.body;
      if (!entityId || !entityType || !uploadedBy) {
        return res.status(400).json({
          success: false,
          error: 'entityId, entityType, and uploadedBy are required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate entityType
      if (!Object.values(EntityType).includes(entityType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid entityType',
          code: 'INVALID_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const fileData: FileData = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.uploadService.uploadDocument(entityId, entityType, uploadedBy, fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'Document uploaded successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          code: result.code,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload document',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(_req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
          code: 'NO_FILES',
          timestamp: new Date().toISOString(),
        });
      }

      const { entityId, entityType, uploadedBy } = req.body;
      if (!entityId || !entityType || !uploadedBy) {
        return res.status(400).json({
          success: false,
          error: 'entityId, entityType, and uploadedBy are required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const results = [];
      const errors = [];

      for (const file of req.files) {
        const fileData: FileData = {
          buffer: file.buffer,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        };

        try {
          const result = await this.uploadService.uploadDocument(entityId, entityType, uploadedBy, fileData);
          if (result.success) {
            results.push(result.data);
          } else {
            errors.push({
              fileName: file.originalname,
              error: result.error,
              code: result.code
            });
          }
        } catch (error) {
          errors.push({
            fileName: file.originalname,
            error: error instanceof Error ? error.message : 'Unknown error',
            code: 'UPLOAD_ERROR'
          });
        }
      }

      res.json({
        success: true,
        data: {
          uploaded: results,
          errors: errors,
          summary: {
            total: req.files.length,
            successful: results.length,
            failed: errors.length
          }
        },
        message: `${results.length} of ${req.files.length} files uploaded successfully`,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Upload multiple files error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload files',
        code: 'UPLOAD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Delete file
   */
  async deleteFile(_req: Request, res: Response) {
    try {
      const { fileId } = req.params;
      if (!fileId) {
        return res.status(400).json({
          success: false,
          error: 'fileId is required',
          code: 'MISSING_PARAMETER',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await this.uploadService.deleteFile(fileId);

      if (result) {
        res.json({
          success: true,
          message: 'File deleted successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'File not found or could not be deleted',
          code: 'FILE_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete file',
        code: 'DELETE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get upload service statistics
   */
  async getStats(_req: Request, res: Response) {
    try {
      const _stats = await this.storageManager.getStorageStats();

      res.json({
        success: true,
        data: {
          storage: stats,
          service: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.env.npm_package_version || '1.0.0'
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get statistics',
        code: 'STATS_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }
}