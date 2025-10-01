import { logger } from '../lib/logger';
import { FileMetadata } from '../types/upload.types';

export interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'aws' | 'azure' | 'custom';
  baseUrl: string;
  customDomain?: string;
  cacheSettings: {
    defaultTtl: number;
    maxAge: number;
    staleWhileRevalidate: number;
  };
  optimization: {
    enableImageOptimization: boolean;
    enableCompression: boolean;
    enableWebP: boolean;
    enableAvif: boolean;
  };
  security: {
    enableSignedUrls: boolean;
    signedUrlExpiry: number;
    allowedOrigins: string[];
  };
}

export interface CDNUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  signed?: boolean;
  expiresIn?: number;
}

export interface CacheHeaders {
  'Cache-Control': string;
  ETag: string;
  'Last-Modified': string;
  Expires: string;
  Vary?: string;
}

/**
 * CDN service for optimized file delivery
 */
export class CDNService {
  constructor(private config: CDNConfig) {}

  /**
   * Generate CDN URL for a file
   */
  generateCDNUrl(
    fileMetadata: FileMetadata,
    options: CDNUrlOptions = {}
  ): string {
    if (!this.config.enabled) {
      return fileMetadata.url;
    }

    const baseUrl = this.config.customDomain || this.config.baseUrl;
    let cdnUrl = `${baseUrl}/${fileMetadata.path}`;

    // Add optimization parameters for images
    if (this.isImage(fileMetadata.mimeType)) {
      cdnUrl = this.addImageOptimizationParams(cdnUrl, options);
    }

    // Add signed URL parameters if required
    if (options.signed || this.config.security.enableSignedUrls) {
      cdnUrl = this.addSignedUrlParams(cdnUrl, options.expiresIn);
    }

    logger.debug('Generated CDN URL', {
      fileId: fileMetadata.id,
      originalUrl: fileMetadata.url,
      cdnUrl,
      options,
    });

    return cdnUrl;
  }

  /**
   * Generate multiple CDN URLs with different optimizations
   */
  generateResponsiveUrls(fileMetadata: FileMetadata): Record<string, string> {
    if (!this.isImage(fileMetadata.mimeType)) {
      return { original: this.generateCDNUrl(fileMetadata) };
    }

    const responsiveSizes = [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'small', width: 300, height: 300 },
      { name: 'medium', width: 600, height: 600 },
      { name: 'large', width: 1200, height: 1200 },
      { name: 'original', width: undefined, height: undefined },
    ];

    const urls: Record<string, string> = {};

    responsiveSizes.forEach(size => {
      urls[size.name] = this.generateCDNUrl(fileMetadata, {
        width: size.width,
        height: size.height,
        format: this.config.optimization.enableWebP ? 'webp' : undefined,
        quality: 85,
      });
    });

    return urls;
  }

  /**
   * Generate cache headers for file delivery
   */
  generateCacheHeaders(
    fileMetadata: FileMetadata,
    isPublic: boolean = true
  ): CacheHeaders {
    const now = new Date();
    const maxAge = this.config.cacheSettings.maxAge;
    const staleWhileRevalidate = this.config.cacheSettings.staleWhileRevalidate;

    const expires = new Date(now.getTime() + maxAge * 1000);
    const etag = this.generateETag(fileMetadata);

    let cacheControl = isPublic ? 'public' : 'private';
    cacheControl += `, max-age=${maxAge}`;
    cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;

    // Add immutable directive for files with content-based names
    if (this.isContentBasedName(fileMetadata.fileName)) {
      cacheControl += ', immutable';
    }

    const headers: CacheHeaders = {
      'Cache-Control': cacheControl,
      ETag: etag,
      'Last-Modified': fileMetadata.updatedAt.toUTCString(),
      Expires: expires.toUTCString(),
    };

    // Add Vary header for images that support format negotiation
    if (
      this.isImage(fileMetadata.mimeType) &&
      this.config.optimization.enableImageOptimization
    ) {
      headers.Vary = 'Accept, Accept-Encoding';
    }

    return headers;
  }

  /**
   * Generate presigned URL for direct access
   */
  generatePresignedUrl(
    fileMetadata: FileMetadata,
    operation: 'read' | 'write' = 'read',
    expiresIn: number = 3600
  ): string {
    const baseUrl = this.config.customDomain || this.config.baseUrl;
    const timestamp = Math.floor(Date.now() / 1000);
    const expiry = timestamp + expiresIn;

    // Create signature payload
    const payload = {
      path: fileMetadata.path,
      operation,
      expiry,
      fileId: fileMetadata.id,
    };

    const signature = this.generateSignature(payload);

    const presignedUrl =
      `${baseUrl}/${fileMetadata.path}?` +
      `operation=${operation}&` +
      `expires=${expiry}&` +
      `signature=${signature}`;

    logger.debug('Generated presigned URL', {
      fileId: fileMetadata.id,
      operation,
      expiresIn,
      expiry,
    });

    return presignedUrl;
  }

  /**
   * Validate presigned URL
   */
  validatePresignedUrl(url: string, path: string): boolean {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;

      const operation = params.get('operation');
      const expires = parseInt(params.get('expires') || '0');
      const signature = params.get('signature');

      if (!operation || !expires || !signature) {
        return false;
      }

      // Check expiry
      const now = Math.floor(Date.now() / 1000);
      if (expires < now) {
        logger.warn('Presigned URL expired', { path, expires, now });
        return false;
      }

      // Validate signature
      const payload = {
        path,
        operation,
        expiry: expires,
        fileId: path.split('/').pop()?.split('.')[0] || '',
      };

      const expectedSignature = this.generateSignature(payload);

      if (signature !== expectedSignature) {
        logger.warn('Invalid presigned URL signature', { path });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error validating presigned URL', { url, path, error });
      return false;
    }
  }

  /**
   * Get optimal format for client
   */
  getOptimalFormat(acceptHeader: string, originalFormat: string): string {
    if (!this.config.optimization.enableImageOptimization) {
      return originalFormat;
    }

    const accepts = acceptHeader.toLowerCase();

    // Check for AVIF support (most efficient)
    if (this.config.optimization.enableAvif && accepts.includes('image/avif')) {
      return 'avif';
    }

    // Check for WebP support (good efficiency)
    if (this.config.optimization.enableWebP && accepts.includes('image/webp')) {
      return 'webp';
    }

    // Fall back to original format
    return originalFormat;
  }

  /**
   * Check if file is an image
   */
  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Check if filename is content-based (contains hash)
   */
  private isContentBasedName(fileName: string): boolean {
    // Check if filename contains a hash-like pattern (32+ hex characters)
    const hashPattern = /[a-f0-9]{32,}/i;
    return hashPattern.test(fileName);
  }

  /**
   * Add image optimization parameters to URL
   */
  private addImageOptimizationParams(
    url: string,
    options: CDNUrlOptions
  ): string {
    const params = new URLSearchParams();

    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);
    if (options.fit) params.set('fit', options.fit);

    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  }

  /**
   * Add signed URL parameters
   */
  private addSignedUrlParams(url: string, expiresIn?: number): string {
    const expiry =
      Math.floor(Date.now() / 1000) +
      (expiresIn || this.config.security.signedUrlExpiry);
    const urlObj = new URL(url);

    urlObj.searchParams.set('expires', expiry.toString());
    urlObj.searchParams.set(
      'signature',
      this.generateUrlSignature(url, expiry)
    );

    return urlObj.toString();
  }

  /**
   * Generate ETag for file
   */
  private generateETag(fileMetadata: FileMetadata): string {
    const content = `${fileMetadata.id}-${fileMetadata.size}-${fileMetadata.updatedAt.getTime()}`;
    return `"${Buffer.from(content).toString('base64')}"`;
  }

  /**
   * Generate signature for payload
   */
  private generateSignature(payload: any): string {
    // In a real implementation, this would use HMAC with a secret key
    // For now, we'll use a simple hash
    const content = JSON.stringify(payload);
    return Buffer.from(content).toString('base64url');
  }

  /**
   * Generate URL signature
   */
  private generateUrlSignature(url: string, expiry: number): string {
    // In a real implementation, this would use HMAC with a secret key
    const content = `${url}-${expiry}`;
    return Buffer.from(content).toString('base64url');
  }
}
