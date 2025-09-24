import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import {
  EntityType,
  FileData,
  FileMetadata,
  FileStatus,
  ProcessingOptions,
  ProcessingResults,
  ThumbnailInfo,
  UploadErrorCode,
  UploadRequest,
  UploadResult
} from '../types/upload.types';
import { FileValidator } from './file-validator.service';
import { StorageManager } from './storage-manager.service';

export class UploadService {
  private static instance: UploadService;
  private uploadDir: string;
  private maxFileSize: number;
  private fileValidator: FileValidator;
  private storageManager: StorageManager;

  private constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    this.fileValidator = FileValidator.getInstance();
    this.storageManager = StorageManager.getInstance();
    this.ensureUploadDirectory();
  }

  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  private async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }

    // Create subdirectories for different entity types
    const subdirs = ['profiles', 'products', 'properties', 'vehicles', 'documents', 'advertisements', 'temp'];
    for (const subdir of subdirs) {
      const fullPath = path.join(this.uploadDir, subdir);
      try {
        await fs.access(fullPath);
      } catch {
        await fs.mkdir(fullPath, { recursive: true });
      }
    }
  }

  /**
   * Upload a file with processing
   */
  async uploadFile(request: UploadRequest): Promise<UploadResult> {
    try {
      // Validate the file
      const validation = await this.fileValidator.validateFile(request.file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          code: UploadErrorCode.INVALID_FILE_TYPE
        };
      }

      // Generate unique file ID and path
      const fileId = uuidv4();
      const fileExtension = this.getFileExtension(request.file.originalName);
      const fileName = `${fileId}${fileExtension}`;
      const entityDir = this.getEntityDirectory(request.entityType);
      const filePath = path.join(entityDir, fileName);

      // Process the file if it's an image
      let processedFile = request.file;
      let processingResults: ProcessingResults | undefined;
      let thumbnails: ThumbnailInfo[] = [];

      if (this.isImageFile(request.file.mimeType)) {
        const processingResult = await this.processImage(request.file, request.processingOptions);
        processedFile = processingResult.processedFile;
        processingResults = processingResult.processingResults;
        thumbnails = processingResult.thumbnails;
      }

      // Store the file
      const storageResult = await this.storageManager.store(processedFile, filePath);
      if (!storageResult.success) {
        return {
          success: false,
          error: storageResult.error || 'Storage failed',
          code: UploadErrorCode.STORAGE_ERROR
        };
      }

      // Create metadata
      const metadata: FileMetadata = {
        id: fileId,
        originalName: request.file.originalName,
        fileName,
        mimeType: processedFile.mimeType,
        size: processedFile.size,
        path: filePath,
        url: storageResult.url!,
        cdnUrl: this.generateCDNUrl(storageResult.url!),
        uploadedBy: request.uploadedBy,
        entityType: request.entityType,
        entityId: request.entityId,
        status: FileStatus.READY,
        processingResults,
        thumbnails,
        accessLevel: request.accessLevel,
        metadata: request.metadata || {},
        tags: request.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // TODO: Save metadata to database
      // await this.saveMetadata(metadata);

      return {
        success: true,
        data: {
          id: fileId,
          url: storageResult.url!,
          cdnUrl: metadata.cdnUrl,
          thumbnails,
          metadata
        }
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: UploadErrorCode.SERVICE_UNAVAILABLE
      };
    }
  }

  /**
   * Specialized upload methods for different entity types
   */
  uploadProfilePhoto(_userId: string, file: FileData): Promise<UploadResult> {
    return this.uploadFile({
      file,
      entityType: EntityType.USER_PROFILE,
      entityId: userId,
      uploadedBy: userId,
      accessLevel: 'private',
      processingOptions: {
        resize: { width: 300, height: 300, fit: 'cover' },
        format: 'webp',
        quality: 85,
        generateThumbnails: [
          { width: 50, height: 50, name: 'small' },
          { width: 150, height: 150, name: 'medium' }
        ]
      }
    });
  }

  uploadProductImage(productId: string, vendorId: string, file: FileData): Promise<UploadResult> {
    return this.uploadFile({
      file,
      entityType: EntityType.PRODUCT,
      entityId: productId,
      uploadedBy: vendorId,
      accessLevel: 'public',
      processingOptions: {
        resize: { width: 800, height: 800, fit: 'contain' },
        format: 'webp',
        quality: 90,
        generateThumbnails: [
          { width: 150, height: 150, name: 'thumbnail' },
          { width: 300, height: 300, name: 'small' },
          { width: 600, height: 600, name: 'medium' }
        ]
      }
    });
  }

  uploadPropertyPhoto(propertyId: string, hostId: string, file: FileData): Promise<UploadResult> {
    return this.uploadFile({
      file,
      entityType: EntityType.PROPERTY,
      entityId: propertyId,
      uploadedBy: hostId,
      accessLevel: 'public',
      processingOptions: {
        resize: { width: 1200, height: 800, fit: 'cover' },
        format: 'webp',
        quality: 90,
        generateThumbnails: [
          { width: 200, height: 150, name: 'thumbnail' },
          { width: 400, height: 300, name: 'small' },
          { width: 800, height: 600, name: 'medium' }
        ]
      }
    });
  }

  uploadVehiclePhoto(vehicleId: string, driverId: string, file: FileData): Promise<UploadResult> {
    return this.uploadFile({
      file,
      entityType: EntityType.VEHICLE,
      entityId: vehicleId,
      uploadedBy: driverId,
      accessLevel: 'private',
      processingOptions: {
        resize: { width: 800, height: 600, fit: 'cover' },
        format: 'webp',
        quality: 85,
        generateThumbnails: [
          { width: 150, height: 100, name: 'thumbnail' },
          { width: 300, height: 200, name: 'small' }
        ]
      }
    });
  }

  uploadDocument(entityId: string, entityType: EntityType, uploadedBy: string, file: FileData): Promise<UploadResult> {
    return this.uploadFile({
      file,
      entityType,
      entityId,
      uploadedBy,
      accessLevel: 'private'
      // No processing options for documents
    });
  }

  /**
   * Delete a file
   */
  deleteFile(_fileId: string): Promise<boolean> {
    try {
      // TODO: Get file metadata from database
      // const metadata = await this.getFileMetadata(fileId);
      // if (!metadata) return false;

      // For now, we'll need the file path
      // await this.storageManager.delete(metadata.path);

      // TODO: Update database to mark as deleted
      // await this.updateFileStatus(fileId, FileStatus.DELETED);

      return Promise.resolve(true);
    } catch (error) {
      console.error('Delete file error:', error);
      return Promise.resolve(false);
    }
  }

  /**
   * Process image with Sharp
   */
  private async processImage(file: FileData, options?: ProcessingOptions): Promise<{
    processedFile: FileData;
    processingResults: ProcessingResults;
    thumbnails: ThumbnailInfo[];
  }> {
    const startTime = Date.now();
    let sharpInstance = sharp(file.buffer);

    // Get original metadata for future use
    await sharpInstance.metadata();
    const originalSize = file.size;

    // Apply resize if specified
    if (options?.resize) {
      sharpInstance = sharpInstance.resize(
        options.resize.width,
        options.resize.height,
        { fit: options.resize.fit }
      );
    }

    // Apply format conversion
    const targetFormat = options?.format || 'webp';
    const quality = options?.quality || 85;

    switch (targetFormat) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality });
        break;
    }

    // Process the main image
    const processedBuffer = await sharpInstance.toBuffer();
    const processedMetadata = await sharp(processedBuffer).metadata();

    // Generate thumbnails
    const thumbnails: ThumbnailInfo[] = [];
    if (options?.generateThumbnails) {
      for (const thumbSize of options.generateThumbnails) {
        await sharp(file.buffer)
          .resize(thumbSize.width, thumbSize.height, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();

        // TODO: Store thumbnail and get URL
        const thumbnailUrl = `thumbnail_${thumbSize.name}_url`;

        thumbnails.push({
          size: `${thumbSize.width}x${thumbSize.height}`,
          url: thumbnailUrl,
          width: thumbSize.width,
          height: thumbSize.height
        });
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      processedFile: {
        buffer: processedBuffer,
        originalName: file.originalName,
        mimeType: `image/${targetFormat}`,
        size: processedBuffer.length
      },
      processingResults: {
        originalSize,
        processedSize: processedBuffer.length,
        format: targetFormat,
        dimensions: {
          width: processedMetadata.width || 0,
          height: processedMetadata.height || 0
        },
        compressionRatio: originalSize / processedBuffer.length,
        processingTime
      },
      thumbnails
    };
  }

  /**
   * Utility methods
   */
  private getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }

  private getEntityDirectory(entityType: EntityType): string {
    const entityDirs = {
      [EntityType.USER_PROFILE]: 'profiles',
      [EntityType.PRODUCT]: 'products',
      [EntityType.PROPERTY]: 'properties',
      [EntityType.VEHICLE]: 'vehicles',
      [EntityType.DOCUMENT]: 'documents',
      [EntityType.ADVERTISEMENT]: 'advertisements'
    };

    return path.join(this.uploadDir, entityDirs[entityType]);
  }

  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private generateCDNUrl(originalUrl: string): string | undefined {
    const cdnBaseUrl = process.env.CDN_BASE_URL;
    if (!cdnBaseUrl || process.env.CDN_ENABLED !== 'true') {
      return undefined;
    }

    // Replace base URL with CDN URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3003';
    return originalUrl.replace(baseUrl, cdnBaseUrl);
  }

  /**
   * Get file info from buffer
   */
  async getImageInfo(buffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
  } | null> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: buffer.length,
      };
    } catch {
      return null;
    }
  }

  /**
   * Clean up old files (run periodically)
   */
  async cleanupOldFiles(maxAgeHours: number = 24): Promise<void> {
    try {
      const tempDir = path.join(this.uploadDir, 'temp');
      const files = await fs.readdir(tempDir);
      const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);

      for (const file of files) {
        const filepath = path.join(tempDir, file);
        const _stats = await fs.stat(filepath);

        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filepath);
        }
      }
    } catch (error) {
      console.error('Cleanup old files error:', error);
    }
  }
}

export default UploadService;