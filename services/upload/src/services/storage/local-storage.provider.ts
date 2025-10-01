import * as fs from 'fs/promises';
import * as path from 'path';
import {
  IStorageManager,
  StorageConfig,
  StorageInfo,
  StorageListResult,
  StorageResult,
} from '../../interfaces/storage.interface';
import { logger } from '../../lib/logger';
import { FileData } from '../../types/upload.types';

/**
 * Local filesystem storage provider implementation
 */
export class LocalStorageProvider implements IStorageManager {
  private basePath: string;

  constructor(private config: StorageConfig) {
    this.basePath = path.resolve(config.basePath);
    // Initialize base directory asynchronously
    this.ensureBaseDirectory().catch(error => {
      logger.error('Failed to create base storage directory', {
        basePath: this.basePath,
        error: error.message,
      });
    });
  }

  private async ensureBaseDirectory(): Promise<void> {
    try {
      await fs.access(this.basePath);
    } catch {
      try {
        await fs.mkdir(this.basePath, { recursive: true });
        logger.info('Created base storage directory', {
          basePath: this.basePath,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error('Failed to create base storage directory', {
          basePath: this.basePath,
          error: errorMessage,
        });
        throw error;
      }
    }
  }

  private getFullPath(filePath: string): string {
    // Sanitize path to prevent directory traversal
    const sanitizedPath = filePath.replace(/\.\./g, '').replace(/^\/+/, '');
    return path.join(this.basePath, sanitizedPath);
  }

  private async ensureDirectory(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async store(file: FileData, filePath: string): Promise<StorageResult> {
    try {
      const fullPath = this.getFullPath(filePath);
      await this.ensureDirectory(fullPath);

      await fs.writeFile(fullPath, file.buffer);

      const stats = await fs.stat(fullPath);

      return {
        success: true,
        path: filePath,
        url: this.generateFileUrl(filePath),
        size: stats.size,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to store file locally', {
        path: filePath,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async retrieve(filePath: string): Promise<FileData> {
    try {
      const fullPath = this.getFullPath(filePath);
      const buffer = await fs.readFile(fullPath);
      const stats = await fs.stat(fullPath);

      // Extract original name from path
      const originalName = path.basename(filePath);

      // Determine MIME type based on file extension (basic implementation)
      const mimeType = this.getMimeTypeFromExtension(originalName);

      return {
        buffer,
        originalName,
        mimeType,
        size: stats.size,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to retrieve file locally', {
        path: filePath,
        error: errorMessage,
      });
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      const fullPath = this.getFullPath(filePath);
      await fs.unlink(fullPath);

      // Try to remove empty parent directories
      await this.cleanupEmptyDirectories(path.dirname(fullPath));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to delete file locally', {
        path: filePath,
        error: errorMessage,
      });
      return false;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = this.getFullPath(filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  generatePresignedUrl(
    filePath: string,
    operation: 'read' | 'write',
    expiresIn: number
  ): Promise<string> {
    // For local storage, we'll generate a simple URL with expiration token
    // In a real implementation, this would be more sophisticated
    const baseUrl = this.generateFileUrl(filePath);
    const expirationTime = Date.now() + expiresIn * 1000;
    const token = Buffer.from(
      `${filePath}:${expirationTime}:${operation}`
    ).toString('base64');

    return Promise.resolve(
      `${baseUrl}?token=${token}&expires=${expirationTime}`
    );
  }

  async storeMultiple(
    files: FileData[],
    paths: string[]
  ): Promise<StorageResult[]> {
    const results: StorageResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await this.store(files[i], paths[i]);
      results.push(result);
    }

    return results;
  }

  async deleteMultiple(paths: string[]): Promise<boolean[]> {
    const results: boolean[] = [];

    for (const filePath of paths) {
      const result = await this.delete(filePath);
      results.push(result);
    }

    return results;
  }

  async getStorageInfo(filePath: string): Promise<StorageInfo> {
    try {
      const fullPath = this.getFullPath(filePath);
      const stats = await fs.stat(fullPath);

      return {
        path: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        contentType: this.getMimeTypeFromExtension(path.basename(filePath)),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to get storage info locally', {
        path: filePath,
        error: errorMessage,
      });
      throw new Error(`File not found: ${filePath}`);
    }
  }

  async listFiles(
    prefix: string,
    limit: number = 100
  ): Promise<StorageListResult> {
    try {
      const prefixPath = this.getFullPath(prefix);
      const files: StorageInfo[] = [];

      const entries = await this.readDirectoryRecursive(prefixPath, limit);

      for (const entry of entries) {
        const relativePath = path.relative(this.basePath, entry.fullPath);
        const stats = await fs.stat(entry.fullPath);

        if (stats.isFile()) {
          files.push({
            path: relativePath,
            size: stats.size,
            lastModified: stats.mtime,
            contentType: this.getMimeTypeFromExtension(
              path.basename(entry.fullPath)
            ),
          });
        }
      }

      return {
        files: files.slice(0, limit),
        hasMore: files.length > limit,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error('Failed to list files locally', {
        prefix,
        error: errorMessage,
      });
      return {
        files: [],
        hasMore: false,
      };
    }
  }

  private async readDirectoryRecursive(
    dirPath: string,
    maxFiles: number
  ): Promise<Array<{ fullPath: string }>> {
    const results: Array<{ fullPath: string }> = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (results.length >= maxFiles) break;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const subResults = await this.readDirectoryRecursive(
            fullPath,
            maxFiles - results.length
          );
          results.push(...subResults);
        } else if (entry.isFile()) {
          results.push({ fullPath });
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.debug('Could not read directory', {
        dirPath,
        error: errorMessage,
      });
    }

    return results;
  }

  private async cleanupEmptyDirectories(dirPath: string): Promise<void> {
    try {
      // Don't remove the base directory
      if (dirPath === this.basePath) return;

      const entries = await fs.readdir(dirPath);
      if (entries.length === 0) {
        await fs.rmdir(dirPath);
        // Recursively try to remove parent directories
        await this.cleanupEmptyDirectories(path.dirname(dirPath));
      }
    } catch {
      // Ignore errors - directory might not be empty or might not exist
    }
  }

  private generateFileUrl(filePath: string): string {
    // In a real implementation, this would generate a proper URL
    // For now, we'll use a simple path-based URL
    const baseUrl =
      this.config.options && typeof this.config.options.baseUrl === 'string'
        ? this.config.options.baseUrl
        : 'http://localhost:3005';
    return `${baseUrl}/files/${filePath}`;
  }

  private getMimeTypeFromExtension(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
