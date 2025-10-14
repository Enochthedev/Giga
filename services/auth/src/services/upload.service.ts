import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

export class UploadService {
  private static instance: UploadService;
  private uploadDir: string;
  private maxFileSize: number = 5 * 1024 * 1024; // 5MB
  private allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  private constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
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

    // Create subdirectories
    const subdirs = ['avatars', 'temp'];
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
   * Configure multer for file uploads
   */
  getMulterConfig() {
    const storage = multer.memoryStorage();

    return multer({
      storage,
      limits: {
        fileSize: this.maxFileSize,
        files: 1,
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
            )
          );
        }
      },
    });
  }

  /**
   * Process and save avatar image
   */
  async processAvatar(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadResult> {
    try {
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Generate unique filename
      const filename = `${userId}-${uuidv4()}.webp`;
      const filepath = path.join(this.uploadDir, 'avatars', filename);

      // Process image with sharp
      await sharp(file.buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Generate URL (this would typically be a CDN URL in production)
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      const url = `${baseUrl}/uploads/avatars/${filename}`;

      return {
        success: true,
        url,
        filename,
      };
    } catch (error) {
      console.error('Avatar processing error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process image',
      };
    }
  }

  /**
   * Delete old avatar file
   */
  async deleteAvatar(filename: string): Promise<boolean> {
    try {
      if (!filename) return true;

      // Extract filename from URL if full URL is provided
      const actualFilename = filename.includes('/')
        ? path.basename(filename)
        : filename;

      const filepath = path.join(this.uploadDir, 'avatars', actualFilename);

      try {
        await fs.access(filepath);
        await fs.unlink(filepath);
        return true;
      } catch {
        // File doesn't exist, which is fine
        return true;
      }
    } catch (error) {
      console.error('Delete avatar error:', error);
      return false;
    }
  }

  /**
   * Validate image file
   */
  validateImageFile(file: Express.Multer.File): {
    isValid: boolean;
    error?: string;
  } {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      };
    }

    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB.`,
      };
    }

    return { isValid: true };
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
      const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;

      for (const file of files) {
        const filepath = path.join(tempDir, file);
        const stats = await fs.stat(filepath);

        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filepath);
        }
      }
    } catch (error) {
      console.error('Cleanup old files error:', error);
    }
  }

  /**
   * Generate presigned URL for direct upload (for cloud storage)
   */
  async generatePresignedUrl(
    userId: string,
    fileType: string
  ): Promise<{
    uploadUrl: string;
    fileUrl: string;
    filename: string;
  } | null> {
    try {
      // This would integrate with AWS S3, Google Cloud Storage, etc.
      // For now, return a mock response
      const filename = `${userId}-${uuidv4()}.${fileType.split('/')[1]}`;
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

      return {
        uploadUrl: `${baseUrl}/api/v1/upload/avatar`, // Direct upload endpoint
        fileUrl: `${baseUrl}/uploads/avatars/${filename}`,
        filename,
      };
    } catch (error) {
      console.error('Generate presigned URL error:', error);
      return null;
    }
  }
}

export default UploadService;
