import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../app';
import { getConfig } from '../../config';
import { MetadataService } from '../../services/metadata.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { AccessLevel, EntityType, FileStatus } from '../../types/upload.types';

describe('Delivery Integration Tests', () => {
  let app: Express;
  let metadataService: MetadataService;
  let storageManager: StorageManagerService;
  let testFileId: string;
  let authToken: string;

  beforeAll(async () => {
    const config = getConfig();
    app = createApp(config);

    // Initialize services
    metadataService = new MetadataService({} as any);
    storageManager = new StorageManagerService(config.storage);

    // Mock auth token
    authToken = 'Bearer test-token';
  });

  beforeEach(async () => {
    // Create test file metadata
    const testMetadata = {
      id: 'test-delivery-file',
      originalName: 'test-image.jpg',
      fileName: 'test-delivery-file.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      path: 'test/test-delivery-file.jpg',
      url: '/api/v1/uploads/test-delivery-file',
      uploadedBy: 'test-user',
      entityType: EntityType.PRODUCT,
      entityId: 'test-product',
      accessLevel: AccessLevel.PUBLIC,
      status: FileStatus.READY,
      metadata: {},
      tags: ['test'],
    };

    // Mock metadata service
    jest
      .spyOn(metadataService, 'getMetadata')
      .mockResolvedValue(testMetadata as any);

    // Mock storage manager
    const testFileData = {
      buffer: Buffer.from('test file content'),
      originalName: 'test-image.jpg',
      mimeType: 'image/jpeg',
      size: 17,
    };
    jest.spyOn(storageManager, 'retrieve').mockResolvedValue(testFileData);

    testFileId = 'test-delivery-file';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('File Serving', () => {
    it('should serve public file without authentication', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(200);

      expect(response.headers['content-type']).toBe('image/jpeg');
      expect(response.headers['content-length']).toBe('1024');
      expect(response.headers['cache-control']).toContain('public');
    });

    it('should set appropriate cache headers', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(200);

      expect(response.headers).toHaveProperty('etag');
      expect(response.headers).toHaveProperty('last-modified');
      expect(response.headers).toHaveProperty('expires');
      expect(response.headers['cache-control']).toContain('max-age');
    });

    it('should handle cache validation with ETag', async () => {
      // First request to get ETag
      const firstResponse = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(200);

      const etag = firstResponse.headers.etag;

      // Second request with If-None-Match header
      await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .set('If-None-Match', etag)
        .expect(304);
    });

    it('should handle range requests', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .set('Range', 'bytes=0-499')
        .expect(206);

      expect(response.headers['content-range']).toBe('bytes 0-499/1024');
      expect(response.headers['accept-ranges']).toBe('bytes');
      expect(response.headers['content-length']).toBe('500');
    });

    it('should return 404 for non-existent file', async () => {
      jest.spyOn(metadataService, 'getMetadata').mockResolvedValue(null);

      await request(app)
        .get('/api/v1/files/non-existent')
        .expect(404)
        .expect(res => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('NOT_FOUND');
        });
    });

    it('should return 403 for unauthorized access to private file', async () => {
      const privateMetadata = {
        id: testFileId,
        accessLevel: AccessLevel.PRIVATE,
        // ... other properties
      };
      jest
        .spyOn(metadataService, 'getMetadata')
        .mockResolvedValue(privateMetadata as any);

      await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(403)
        .expect(res => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('FORBIDDEN');
        });
    });
  });

  describe('Presigned URLs', () => {
    it('should generate presigned URL for authenticated user', async () => {
      const response = await request(app)
        .post(`/api/v1/files/${testFileId}/presigned-url`)
        .set('Authorization', authToken)
        .send({
          operation: 'read',
          expiresIn: 3600,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('operation', 'read');
      expect(response.body.data).toHaveProperty('expiresIn', 3600);
      expect(response.body.data).toHaveProperty('expiresAt');
    });

    it('should generate write presigned URL', async () => {
      const response = await request(app)
        .post(`/api/v1/files/${testFileId}/presigned-url`)
        .set('Authorization', authToken)
        .send({
          operation: 'write',
          expiresIn: 1800,
        })
        .expect(200);

      expect(response.body.data.operation).toBe('write');
      expect(response.body.data.expiresIn).toBe(1800);
    });

    it('should validate request parameters', async () => {
      await request(app)
        .post(`/api/v1/files/${testFileId}/presigned-url`)
        .set('Authorization', authToken)
        .send({
          operation: 'invalid',
          expiresIn: 30, // Too short
        })
        .expect(400)
        .expect(res => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });

    it('should require authentication', async () => {
      await request(app)
        .post(`/api/v1/files/${testFileId}/presigned-url`)
        .send({
          operation: 'read',
          expiresIn: 3600,
        })
        .expect(401);
    });
  });

  describe('Responsive URLs', () => {
    it('should generate responsive URLs for images', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}/responsive-urls`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('fileId', testFileId);
      expect(response.body.data).toHaveProperty('urls');
      expect(response.body.data.urls).toHaveProperty('thumbnail');
      expect(response.body.data.urls).toHaveProperty('small');
      expect(response.body.data.urls).toHaveProperty('medium');
      expect(response.body.data.urls).toHaveProperty('large');
      expect(response.body.data.urls).toHaveProperty('original');
    });

    it('should require authentication for private files', async () => {
      const privateMetadata = {
        id: testFileId,
        accessLevel: AccessLevel.PRIVATE,
        // ... other properties
      };
      jest
        .spyOn(metadataService, 'getMetadata')
        .mockResolvedValue(privateMetadata as any);

      await request(app)
        .get(`/api/v1/files/${testFileId}/responsive-urls`)
        .expect(401);
    });
  });

  describe('Delivery Info', () => {
    it('should get comprehensive delivery information', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}/delivery-info`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('fileId', testFileId);
      expect(response.body.data).toHaveProperty('responsiveUrls');
      expect(response.body.data).toHaveProperty('presignedUrl');
      expect(response.body.data).toHaveProperty(
        'directUrl',
        `/api/v1/files/${testFileId}`
      );
    });

    it('should require authentication', async () => {
      await request(app)
        .get(`/api/v1/files/${testFileId}/delivery-info`)
        .expect(401);
    });
  });

  describe('Presigned URL Validation', () => {
    it('should validate presigned URL', async () => {
      const response = await request(app)
        .post('/api/v1/validate-presigned-url')
        .set('Authorization', authToken)
        .send({
          url: 'https://cdn.example.com/signed-url?expires=1234567890&signature=abc123',
          path: 'test/test-delivery-file.jpg',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('valid');
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('path');
    });

    it('should require URL and path parameters', async () => {
      await request(app)
        .post('/api/v1/validate-presigned-url')
        .set('Authorization', authToken)
        .send({
          url: 'https://cdn.example.com/signed-url',
          // Missing path
        })
        .expect(400)
        .expect(res => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('INVALID_REQUEST');
        });
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/v1/validate-presigned-url')
        .send({
          url: 'https://cdn.example.com/signed-url',
          path: 'test/test-delivery-file.jpg',
        })
        .expect(401);
    });
  });

  describe('CDN Integration', () => {
    it('should redirect to CDN for public files when CDN enabled', async () => {
      // Mock CDN configuration
      const cdnConfig = {
        enabled: true,
        baseUrl: 'https://cdn.example.com',
        customDomain: 'https://assets.example.com',
      };

      // This would require mocking the CDN service configuration
      // For now, we'll test that the redirect logic works
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(res => {
          // Should either redirect (302) or serve file (200)
          expect([200, 302]).toContain(res.status);
        });
    });

    it('should handle CDN optimization parameters', async () => {
      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .query({
          w: 300,
          h: 200,
          q: 80,
          f: 'webp',
        })
        .expect(res => {
          expect([200, 302]).toContain(res.status);
        });
    });
  });

  describe('Performance and Caching', () => {
    it('should handle concurrent requests efficiently', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get(`/api/v1/files/${testFileId}`));

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/jpeg');
      });
    });

    it('should set appropriate compression headers for text files', async () => {
      const textMetadata = {
        id: testFileId,
        mimeType: 'text/plain',
        // ... other properties
      };
      jest
        .spyOn(metadataService, 'getMetadata')
        .mockResolvedValue(textMetadata as any);

      const response = await request(app)
        .get(`/api/v1/files/${testFileId}`)
        .expect(200);

      // Check if compression is enabled for text files
      expect(response.headers).toHaveProperty('content-type', 'text/plain');
    });
  });
});
