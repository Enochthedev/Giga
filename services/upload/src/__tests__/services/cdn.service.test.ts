import { CDNConfig, CDNService } from '../../services/cdn.service';
import {
  AccessLevel,
  EntityType,
  FileMetadata,
  FileStatus,
} from '../../types/upload.types';

describe('CDNService', () => {
  let cdnService: CDNService;
  let mockConfig: CDNConfig;
  let mockFileMetadata: FileMetadata;

  beforeEach(() => {
    mockConfig = {
      enabled: true,
      provider: 'custom',
      baseUrl: 'https://cdn.example.com',
      customDomain: 'https://assets.example.com',
      cacheSettings: {
        defaultTtl: 86400,
        maxAge: 31536000,
        staleWhileRevalidate: 86400,
      },
      optimization: {
        enableImageOptimization: true,
        enableCompression: true,
        enableWebP: true,
        enableAvif: false,
      },
      security: {
        enableSignedUrls: false,
        signedUrlExpiry: 3600,
        allowedOrigins: ['*'],
      },
    };

    mockFileMetadata = {
      id: 'test-file-id',
      originalName: 'test-image.jpg',
      fileName: 'test-file-id.jpg',
      mimeType: 'image/jpeg',
      size: 1024000,
      path: 'product/123/test-file-id.jpg',
      url: '/api/v1/uploads/test-file-id',
      uploadedBy: 'user-123',
      entityType: EntityType.PRODUCT,
      entityId: '123',
      accessLevel: AccessLevel.PUBLIC,
      status: FileStatus.READY,
      metadata: {},
      tags: [],
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    };

    cdnService = new CDNService(mockConfig);
  });

  describe('generateCDNUrl', () => {
    it('should return original URL when CDN is disabled', () => {
      const disabledConfig = { ...mockConfig, enabled: false };
      const service = new CDNService(disabledConfig);

      const result = service.generateCDNUrl(mockFileMetadata);

      expect(result).toBe(mockFileMetadata.url);
    });

    it('should generate basic CDN URL', () => {
      const result = cdnService.generateCDNUrl(mockFileMetadata);

      expect(result).toBe(
        'https://assets.example.com/product/123/test-file-id.jpg'
      );
    });

    it('should add image optimization parameters', () => {
      const options = {
        width: 300,
        height: 200,
        quality: 80,
        format: 'webp' as const,
        fit: 'cover' as const,
      };

      const result = cdnService.generateCDNUrl(mockFileMetadata, options);

      expect(result).toContain('w=300');
      expect(result).toContain('h=200');
      expect(result).toContain('q=80');
      expect(result).toContain('f=webp');
      expect(result).toContain('fit=cover');
    });

    it('should add signed URL parameters when enabled', () => {
      const signedConfig = {
        ...mockConfig,
        security: { ...mockConfig.security, enableSignedUrls: true },
      };
      const service = new CDNService(signedConfig);

      const result = service.generateCDNUrl(mockFileMetadata, { signed: true });

      expect(result).toContain('expires=');
      expect(result).toContain('signature=');
    });

    it('should not add optimization parameters for non-images', () => {
      const pdfMetadata = {
        ...mockFileMetadata,
        mimeType: 'application/pdf',
        fileName: 'document.pdf',
      };

      const result = cdnService.generateCDNUrl(pdfMetadata, {
        width: 300,
        height: 200,
      });

      expect(result).not.toContain('w=');
      expect(result).not.toContain('h=');
    });
  });

  describe('generateResponsiveUrls', () => {
    it('should generate multiple responsive URLs for images', () => {
      const result = cdnService.generateResponsiveUrls(mockFileMetadata);

      expect(result).toHaveProperty('thumbnail');
      expect(result).toHaveProperty('small');
      expect(result).toHaveProperty('medium');
      expect(result).toHaveProperty('large');
      expect(result).toHaveProperty('original');

      expect(result.thumbnail).toContain('w=150');
      expect(result.small).toContain('w=300');
      expect(result.medium).toContain('w=600');
      expect(result.large).toContain('w=1200');
    });

    it('should return only original URL for non-images', () => {
      const pdfMetadata = {
        ...mockFileMetadata,
        mimeType: 'application/pdf',
      };

      const result = cdnService.generateResponsiveUrls(pdfMetadata);

      expect(Object.keys(result)).toEqual(['original']);
    });

    it('should include WebP format when enabled', () => {
      const result = cdnService.generateResponsiveUrls(mockFileMetadata);

      Object.values(result).forEach(url => {
        if (url.includes('?')) {
          expect(url).toContain('f=webp');
        }
      });
    });
  });

  describe('generateCacheHeaders', () => {
    it('should generate public cache headers', () => {
      const result = cdnService.generateCacheHeaders(mockFileMetadata, true);

      expect(result['Cache-Control']).toContain('public');
      expect(result['Cache-Control']).toContain('max-age=31536000');
      expect(result['Cache-Control']).toContain('stale-while-revalidate=86400');
      expect(result).toHaveProperty('ETag');
      expect(result).toHaveProperty('Last-Modified');
      expect(result).toHaveProperty('Expires');
    });

    it('should generate private cache headers', () => {
      const result = cdnService.generateCacheHeaders(mockFileMetadata, false);

      expect(result['Cache-Control']).toContain('private');
    });

    it('should add immutable directive for content-based names', () => {
      const hashMetadata = {
        ...mockFileMetadata,
        fileName: 'abc123def456789012345678901234567890.jpg',
      };

      const result = cdnService.generateCacheHeaders(hashMetadata, true);

      expect(result['Cache-Control']).toContain('immutable');
    });

    it('should add Vary header for images with optimization', () => {
      const result = cdnService.generateCacheHeaders(mockFileMetadata, true);

      expect(result).toHaveProperty('Vary', 'Accept, Accept-Encoding');
    });

    it('should not add Vary header for non-images', () => {
      const pdfMetadata = {
        ...mockFileMetadata,
        mimeType: 'application/pdf',
      };

      const result = cdnService.generateCacheHeaders(pdfMetadata, true);

      expect(result).not.toHaveProperty('Vary');
    });
  });

  describe('generatePresignedUrl', () => {
    it('should generate presigned URL with default expiry', () => {
      const result = cdnService.generatePresignedUrl(mockFileMetadata);

      expect(result).toContain('operation=read');
      expect(result).toContain('expires=');
      expect(result).toContain('signature=');
    });

    it('should generate presigned URL for write operation', () => {
      const result = cdnService.generatePresignedUrl(
        mockFileMetadata,
        'write',
        1800
      );

      expect(result).toContain('operation=write');
    });

    it('should use custom expiry time', () => {
      const customExpiry = 7200;
      const beforeTime = Math.floor(Date.now() / 1000) + customExpiry;

      const result = cdnService.generatePresignedUrl(
        mockFileMetadata,
        'read',
        customExpiry
      );

      const url = new URL(result);
      const expires = parseInt(url.searchParams.get('expires') || '0');

      expect(expires).toBeGreaterThanOrEqual(beforeTime - 5); // Allow 5 second tolerance
      expect(expires).toBeLessThanOrEqual(beforeTime + 5);
    });
  });

  describe('validatePresignedUrl', () => {
    it('should validate valid presigned URL', () => {
      const presignedUrl = cdnService.generatePresignedUrl(
        mockFileMetadata,
        'read',
        3600
      );

      const result = cdnService.validatePresignedUrl(
        presignedUrl,
        mockFileMetadata.path
      );

      expect(result).toBe(true);
    });

    it('should reject expired presigned URL', () => {
      // Create URL with past expiry
      const baseUrl = 'https://assets.example.com/product/123/test-file-id.jpg';
      const pastExpiry = Math.floor(Date.now() / 1000) - 3600;
      const expiredUrl = `${baseUrl}?operation=read&expires=${pastExpiry}&signature=test`;

      const result = cdnService.validatePresignedUrl(
        expiredUrl,
        mockFileMetadata.path
      );

      expect(result).toBe(false);
    });

    it('should reject URL with missing parameters', () => {
      const invalidUrl =
        'https://assets.example.com/product/123/test-file-id.jpg?operation=read';

      const result = cdnService.validatePresignedUrl(
        invalidUrl,
        mockFileMetadata.path
      );

      expect(result).toBe(false);
    });

    it('should reject URL with invalid signature', () => {
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      const invalidUrl = `https://assets.example.com/product/123/test-file-id.jpg?operation=read&expires=${futureExpiry}&signature=invalid`;

      const result = cdnService.validatePresignedUrl(
        invalidUrl,
        mockFileMetadata.path
      );

      expect(result).toBe(false);
    });
  });

  describe('getOptimalFormat', () => {
    it('should return AVIF when supported and enabled', () => {
      const avifConfig = {
        ...mockConfig,
        optimization: { ...mockConfig.optimization, enableAvif: true },
      };
      const service = new CDNService(avifConfig);

      const result = service.getOptimalFormat(
        'image/avif,image/webp,image/*',
        'jpeg'
      );

      expect(result).toBe('avif');
    });

    it('should return WebP when supported and AVIF not available', () => {
      const result = cdnService.getOptimalFormat('image/webp,image/*', 'jpeg');

      expect(result).toBe('webp');
    });

    it('should return original format when no optimization supported', () => {
      const result = cdnService.getOptimalFormat(
        'image/jpeg,image/png',
        'jpeg'
      );

      expect(result).toBe('jpeg');
    });

    it('should return original format when optimization disabled', () => {
      const disabledConfig = {
        ...mockConfig,
        optimization: {
          ...mockConfig.optimization,
          enableImageOptimization: false,
        },
      };
      const service = new CDNService(disabledConfig);

      const result = service.getOptimalFormat('image/avif,image/webp', 'jpeg');

      expect(result).toBe('jpeg');
    });
  });
});
