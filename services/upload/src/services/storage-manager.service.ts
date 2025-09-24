import fs from 'fs/promises';
import path from 'path';
import { FileData, StorageResult } from '../types/upload.types';

export class StorageManager {
  private static instance: StorageManager;
  private baseUrl: string;
  private uploadDir: string;

  private constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3003';
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Store a file to the configured storage backend
   */
  async store(file: FileData, relativePath: string): Promise<StorageResult> {
    try {
      // For now, we'll use local filesystem storage
      // TODO: Add support for S3, Google Cloud Storage, etc.

      const fullPath = path.join(this.uploadDir, relativePath);
      const directory = path.dirname(fullPath);

      // Ensure directory exists
      await fs.mkdir(directory, { recursive: true });

      // Write file to disk
      await fs.writeFile(fullPath, file.buffer);

      // Generate URL
      const url = this.generateFileUrl(relativePath);

      return {
        success: true,
        path: relativePath,
        url
      };

    } catch (error) {
      console.error('Storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown storage error'
      };
    }
  }

  /**
   * Retrieve a file from storage
   */
  async retrieve(relativePath: string): Promise<FileData | null> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath);
      const buffer = await fs.readFile(fullPath);
      const _stats = await fs.stat(fullPath);

      return {
        buffer,
        originalName: path.basename(relativePath),
        mimeType: this.getMimeTypeFromExtension(relativePath),
        size: stats.size
      };

    } catch (error) {
      console.error('Retrieve error:', error);
      return null;
    }
  }

  /**
   * Delete a file from storage
   */
  async delete(relativePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath);
      await fs.unlink(fullPath);
      return true;

    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * Check if a file exists in storage
   */
  async exists(relativePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath);
      await fs.access(fullPath);
      return true;

    } catch {
      return false;
    }
  }

  /**
   * Generate a presigned URL for direct upload (for future cloud storage integration)
   */
  generatePresignedUrl(
    relativePath: string,
    operation: 'read' | 'write',
    _expiresIn: number = 3600
  ): Promise<string> {
    // TODO: Implement presigned URLs for cloud storage
    // For now, return regular URL for local storage

    if (operation === 'write') {
      // For write operations, return upload endpoint
      return `${this.baseUrl}/api/v1/upload/presigned/${encodeURIComponent(relativePath)}`;
    } else {
      // For read operations, return file URL
      return this.generateFileUrl(relativePath);
    }
  }

  /**
   * Store multiple files (batch operation)
   */
  async storeMultiple(files: FileData[], paths: string[]): Promise<StorageResult[]> {
    if (files.length !== paths.length) {
      throw new Error('Files and paths arrays must have the same length');
    }

    const results: StorageResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await this.store(files[i], paths[i]);
      results.push(result);
    }

    return results;
  }

  /**
   * Delete multiple files (batch operation)
   */
  async deleteMultiple(paths: string[]): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const path of paths) {
      const result = await this.delete(path);
      results.push(result);
    }

    return results;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    availableSpace: number;
  }> {
    try {
      const _stats = await this.calculateDirectoryStats(this.uploadDir);

      // TODO: Calculate available space based on storage backend
      const availableSpace = 1024 * 1024 * 1024 * 100; // 100GB placeholder

      return {
        totalFiles: stats.fileCount,
        totalSize: stats.totalSize,
        availableSpace
      };

    } catch (error) {
      console.error('Storage stats error:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        availableSpace: 0
      };
    }
  }

  /**
   * Private helper methods
   */
  private generateFileUrl(relativePath: string): string {
    return `${this.baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`;
  }

  private getMimeTypeFromExtension(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  private async calculateDirectoryStats(dirPath: string): Promise<{
    fileCount: number;
    totalSize: number;
  }> {
    let fileCount = 0;
    let totalSize = 0;

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          const subStats = await this.calculateDirectoryStats(itemPath);
          fileCount += subStats.fileCount;
          totalSize += subStats.totalSize;
        } else if (item.isFile()) {
          const _stats = await fs.stat(itemPath);
          fileCount++;
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.error('Error calculating directory stats:', error);
    }

    return { fileCount, totalSize };
  }

  /**
   * Cleanup empty directories
   */
  async cleanupEmptyDirectories(dirPath: string = this.uploadDir): Promise<void> {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory()) {
          const subDirPath = path.join(dirPath, item.name);
          await this.cleanupEmptyDirectories(subDirPath);

          // Check if directory is now empty
          const subItems = await fs.readdir(subDirPath);
          if (subItems.length === 0) {
            await fs.rmdir(subDirPath);
          }
        }
      }
    } catch (error) {
      console.error('Cleanup empty directories error:', error);
    }
  }
}

export default StorageManager;