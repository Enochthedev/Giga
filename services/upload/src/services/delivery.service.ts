import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AccessLevel, FileMetadata } from '../types/upload.types';
import { AppError } from '../utils/error-utils';
import { CDNService, CDNUrlOptions } from './cdn.service';
import { MetadataService } from './metadata.service';
import { PermissionService } from './permission.service';
import { StorageManagerService } from './storage-manager.service';

export interface DeliveryOptions {
  enableCDN: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
  enableRangeRequests: boolean;
  maxCacheAge: number;
}

/**
 * File delivery service with CDN and optimization support
 */
export class DeliveryService {
  constructor(
    private metadataService: MetadataService,
    private storageManager: StorageManagerService,
    private permissionService: PermissionService,
    private cdnService: CDNService,
    private options: DeliveryOptions
  ) {}

  /**
   * Serve file with optimizations
   */
  async serveFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const acceptHeader = req.headers.accept || '';
      const userAgent = req.headers['user-agent'] || '';

      // Get file metadata
      const metadata = await this.metadataService.getMetadata(fileId);
      if (!metadata) {
        throw new AppError('File not found', 'NOT_FOUND', 404);
      }

      // Check permissions
      const hasAccess = await this.permissionService.checkFileAccess(
        metadata,
        req.user?.id || 'anonymous',
        'read'
      );

      if (!hasAccess) {
        throw new AppError('Access denied', 'FORBIDDEN', 403);
      }

      // Handle CDN redirect for public files
      if (
        this.options.enableCDN &&
        metadata.accessLevel === AccessLevel.PUBLIC
      ) {
        const cdnUrl = this.generateOptimizedCDNUrl(
          metadata,
          req,
          acceptHeader
        );
        if (cdnUrl !== metadata.url) {
          res.redirect(302, cdnUrl);
          return;
        }
      }

      // Check if client has cached version
      if (this.handleCacheValidation(req, res, metadata)) {
        return; // 304 Not Modified sent
      }

      // Set cache headers
      if (this.options.enableCaching) {
        const cacheHeaders = this.cdnService.generateCacheHeaders(
          metadata,
          metadata.accessLevel === AccessLevel.PUBLIC
        );
        Object.entries(cacheHeaders).forEach(([key, value]) => {
          if (value) res.setHeader(key, value);
        });
      }

      // Handle range requests for large files
      if (this.options.enableRangeRequests && req.headers.range) {
        await this.handleRangeRequest(req, res, metadata);
        return;
      }

      // Serve full file
      await this.serveFullFile(res, metadata, acceptHeader);
    } catch (error) {
      logger.error('File delivery failed', {
        error,
        fileId: req.params.fileId,
      });
      this.handleDeliveryError(error, res);
    }
  }

  /**
   * Generate presigned URL for direct access
   */
  async generatePresignedUrl(
    fileId: string,
    operation: 'read' | 'write' = 'read',
    expiresIn: number = 3600,
    userId?: string
  ): Promise<string> {
    const metadata = await this.metadataService.getMetadata(fileId);
    if (!metadata) {
      throw new AppError('File not found', 'NOT_FOUND', 404);
    }

    // Check permissions for private files
    if (metadata.accessLevel !== AccessLevel.PUBLIC && userId) {
      const hasAccess = await this.permissionService.checkFileAccess(
        metadata,
        userId,
        operation
      );

      if (!hasAccess) {
        throw new AppError('Access denied', 'FORBIDDEN', 403);
      }
    }

    // Generate presigned URL
    const presignedUrl = this.cdnService.generatePresignedUrl(
      metadata,
      operation,
      expiresIn
    );

    logger.info('Generated presigned URL', {
      fileId,
      operation,
      expiresIn,
      userId,
    });

    return presignedUrl;
  }

  /**
   * Get responsive image URLs
   */
  async getResponsiveUrls(
    fileId: string,
    userId?: string
  ): Promise<Record<string, string>> {
    const metadata = await this.metadataService.getMetadata(fileId);
    if (!metadata) {
      throw new AppError('File not found', 'NOT_FOUND', 404);
    }

    // Check permissions
    if (metadata.accessLevel !== AccessLevel.PUBLIC && userId) {
      const hasAccess = await this.permissionService.checkFileAccess(
        metadata,
        userId,
        'read'
      );
      if (!hasAccess) {
        throw new AppError('Access denied', 'FORBIDDEN', 403);
      }
    }

    // Generate responsive URLs
    const responsiveUrls = this.cdnService.generateResponsiveUrls(metadata);

    logger.debug('Generated responsive URLs', {
      fileId,
      urlCount: Object.keys(responsiveUrls).length,
    });

    return responsiveUrls;
  }

  /**
   * Validate presigned URL access
   */
  async validatePresignedAccess(url: string, path: string): Promise<boolean> {
    try {
      return this.cdnService.validatePresignedUrl(url, path);
    } catch (error) {
      logger.error('Presigned URL validation failed', { url, path, error });
      return false;
    }
  }

  /**
   * Generate optimized CDN URL based on request context
   */
  private generateOptimizedCDNUrl(
    metadata: FileMetadata,
    req: Request,
    acceptHeader: string
  ): string {
    const options: CDNUrlOptions = {};

    // Extract optimization parameters from query
    if (req.query.w) options.width = parseInt(req.query.w as string);
    if (req.query.h) options.height = parseInt(req.query.h as string);
    if (req.query.q) options.quality = parseInt(req.query.q as string);
    if (req.query.f) options.format = req.query.f as any;
    if (req.query.fit) options.fit = req.query.fit as any;

    // Auto-detect optimal format if not specified
    if (!options.format && metadata.mimeType.startsWith('image/')) {
      const originalFormat = metadata.mimeType.split('/')[1];
      options.format = this.cdnService.getOptimalFormat(
        acceptHeader,
        originalFormat
      ) as any;
    }

    return this.cdnService.generateCDNUrl(metadata, options);
  }

  /**
   * Handle cache validation (ETag, Last-Modified)
   */
  private handleCacheValidation(
    req: Request,
    res: Response,
    metadata: FileMetadata
  ): boolean {
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];

    const cacheHeaders = this.cdnService.generateCacheHeaders(
      metadata,
      metadata.accessLevel === AccessLevel.PUBLIC
    );

    // Check ETag
    if (ifNoneMatch && ifNoneMatch === cacheHeaders.ETag) {
      res.status(304).end();
      return true;
    }

    // Check Last-Modified
    if (ifModifiedSince) {
      const clientDate = new Date(ifModifiedSince);
      const fileDate = new Date(metadata.updatedAt);

      if (clientDate >= fileDate) {
        res.status(304).end();
        return true;
      }
    }

    return false;
  }

  /**
   * Handle range requests for partial content
   */
  private async handleRangeRequest(
    req: Request,
    res: Response,
    metadata: FileMetadata
  ): Promise<void> {
    const range = req.headers.range;
    if (!range) return;

    const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
    if (!rangeMatch) {
      res.status(416).json({ error: 'Invalid range' });
      return;
    }

    const start = parseInt(rangeMatch[1]);
    const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : metadata.size - 1;

    if (start >= metadata.size || end >= metadata.size || start > end) {
      res.status(416).json({ error: 'Range not satisfiable' });
      return;
    }

    // Set partial content headers
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${metadata.size}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', end - start + 1);
    res.setHeader('Content-Type', metadata.mimeType);

    // Stream partial content
    try {
      const fileData = await this.storageManager.retrieve(metadata.path);
      const partialBuffer = fileData.buffer.slice(start, end + 1);
      res.end(partialBuffer);
    } catch (error) {
      logger.error('Range request failed', {
        fileId: metadata.id,
        start,
        end,
        error,
      });
      res.status(500).json({ error: 'Failed to serve partial content' });
    }
  }

  /**
   * Serve full file content
   */
  private async serveFullFile(
    res: Response,
    metadata: FileMetadata,
    acceptHeader: string
  ): Promise<void> {
    try {
      // Set content headers
      res.setHeader('Content-Type', metadata.mimeType);
      res.setHeader('Content-Length', metadata.size);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${metadata.originalName}"`
      );

      // Enable compression for text-based files
      if (
        this.options.enableCompression &&
        this.isCompressible(metadata.mimeType)
      ) {
        res.setHeader('Content-Encoding', 'gzip');
      }

      // Retrieve and serve file
      const fileData = await this.storageManager.retrieve(metadata.path);
      res.end(fileData.buffer);

      logger.debug('File served successfully', {
        fileId: metadata.id,
        size: metadata.size,
        mimeType: metadata.mimeType,
      });
    } catch (error) {
      logger.error('Failed to serve file', { fileId: metadata.id, error });
      throw new AppError('Failed to serve file', 'DELIVERY_FAILED', 500);
    }
  }

  /**
   * Check if content type is compressible
   */
  private isCompressible(mimeType: string): boolean {
    const compressibleTypes = [
      'text/',
      'application/json',
      'application/javascript',
      'application/xml',
      'image/svg+xml',
    ];

    return compressibleTypes.some(type => mimeType.startsWith(type));
  }

  /**
   * Handle delivery errors
   */
  private handleDeliveryError(error: unknown, res: Response): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELIVERY_ERROR',
          message: 'Failed to deliver file',
        },
      });
    }
  }
}
