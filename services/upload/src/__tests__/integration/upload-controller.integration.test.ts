import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import request from 'supertest';
import { createApp, initializeServices } from '../../app';
import { disconnectDatabase } from '../../lib/prisma';
import { disconnectRedis } from '../../lib/redis';

describe('Upload Controller Integration Tests', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    // Initialize services
    await initializeServices();
    app = createApp();

    // Mock auth token for testing
    authToken = 'Bearer test-token';
  });

  afterAll(async () => {
    await disconnectDatabase();
    await disconnectRedis();
  });

  describe('POST /api/v1/uploads', () => {
    it('should upload a single file successfully', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      // Create a test image if it doesn't exist
      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake-image-data');
        fs.mkdirSync(path.dirname(testImagePath), { recursive: true });
        fs.writeFileSync(testImagePath, testImageBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .field('accessLevel', 'public')
        .attach('file', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('metadata');
      expect(response.body.data.processingStatus).toBe('completed');
    });

    it('should return 400 when no file is provided', async () => {
      const response = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_REQUEST');
    });

    it('should return 400 when required fields are missing', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const response = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .attach('file', testImagePath);
      // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 when no auth token is provided', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const response = await request(app)
        .post('/api/v1/uploads')
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .attach('file', testImagePath);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/uploads/multiple', () => {
    it('should upload multiple files successfully', async () => {
      const testImagePath1 = path.join(
        __dirname,
        '../fixtures/test-image-1.jpg'
      );
      const testImagePath2 = path.join(
        __dirname,
        '../fixtures/test-image-2.jpg'
      );

      // Create test images if they don't exist
      [testImagePath1, testImagePath2].forEach(imagePath => {
        if (!fs.existsSync(imagePath)) {
          const testImageBuffer = Buffer.from('fake-image-data');
          fs.mkdirSync(path.dirname(imagePath), { recursive: true });
          fs.writeFileSync(imagePath, testImageBuffer);
        }
      });

      const filesMetadata = JSON.stringify([
        {
          entityType: 'product',
          entityId: 'product-123',
          accessLevel: 'public',
          metadata: { category: 'product_image' },
        },
        {
          entityType: 'product',
          entityId: 'product-123',
          accessLevel: 'public',
          metadata: { category: 'product_image' },
        },
      ]);

      const response = await request(app)
        .post('/api/v1/uploads/multiple')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('files', filesMetadata)
        .attach('files', testImagePath1)
        .attach('files', testImagePath2);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[1]).toHaveProperty('id');
    });

    it('should return 400 when file count mismatch with metadata', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const filesMetadata = JSON.stringify([
        {
          entityType: 'product',
          entityId: 'product-123',
          accessLevel: 'public',
        },
        {
          entityType: 'product',
          entityId: 'product-123',
          accessLevel: 'public',
        },
      ]);

      const response = await request(app)
        .post('/api/v1/uploads/multiple')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('files', filesMetadata)
        .attach('files', testImagePath); // Only one file but two metadata entries

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('File count mismatch');
    });
  });

  describe('POST /api/v1/uploads/profile/:userId', () => {
    it('should upload profile photo successfully', async () => {
      const testImagePath = path.join(
        __dirname,
        '../fixtures/test-profile.jpg'
      );

      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake-image-data');
        fs.mkdirSync(path.dirname(testImagePath), { recursive: true });
        fs.writeFileSync(testImagePath, testImageBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads/profile/user-123')
        .set('Authorization', authToken)
        .attach('file', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.entityType).toBe('user_profile');
      expect(response.body.data.metadata.entityId).toBe('user-123');
      expect(response.body.data.metadata.accessLevel).toBe('public');
      expect(response.body.data.metadata.tags).toContain('profile');
    });
  });

  describe('POST /api/v1/uploads/product/:productId', () => {
    it('should upload product image successfully', async () => {
      const testImagePath = path.join(
        __dirname,
        '../fixtures/test-product.jpg'
      );

      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake-image-data');
        fs.mkdirSync(path.dirname(testImagePath), { recursive: true });
        fs.writeFileSync(testImagePath, testImageBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads/product/product-123')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('isPrimary', 'true')
        .attach('file', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.entityType).toBe('product');
      expect(response.body.data.metadata.entityId).toBe('product-123');
      expect(response.body.data.metadata.metadata.isPrimary).toBe(true);
      expect(response.body.data.metadata.tags).toContain('product');
    });
  });

  describe('POST /api/v1/uploads/property/:propertyId', () => {
    it('should upload property photo successfully', async () => {
      const testImagePath = path.join(
        __dirname,
        '../fixtures/test-property.jpg'
      );

      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake-image-data');
        fs.mkdirSync(path.dirname(testImagePath), { recursive: true });
        fs.writeFileSync(testImagePath, testImageBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads/property/property-123')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('roomType', 'bedroom')
        .field('isPrimary', 'false')
        .attach('file', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.entityType).toBe('property');
      expect(response.body.data.metadata.entityId).toBe('property-123');
      expect(response.body.data.metadata.metadata.roomType).toBe('bedroom');
      expect(response.body.data.metadata.tags).toContain('property');
    });
  });

  describe('POST /api/v1/uploads/vehicle/:vehicleId', () => {
    it('should upload vehicle photo successfully', async () => {
      const testImagePath = path.join(
        __dirname,
        '../fixtures/test-vehicle.jpg'
      );

      if (!fs.existsSync(testImagePath)) {
        const testImageBuffer = Buffer.from('fake-image-data');
        fs.mkdirSync(path.dirname(testImagePath), { recursive: true });
        fs.writeFileSync(testImagePath, testImageBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads/vehicle/vehicle-123')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('photoType', 'exterior')
        .attach('file', testImagePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.entityType).toBe('vehicle');
      expect(response.body.data.metadata.entityId).toBe('vehicle-123');
      expect(response.body.data.metadata.metadata.photoType).toBe('exterior');
      expect(response.body.data.metadata.tags).toContain('vehicle');
    });
  });

  describe('POST /api/v1/uploads/document', () => {
    it('should upload document successfully', async () => {
      const testDocPath = path.join(__dirname, '../fixtures/test-document.pdf');

      if (!fs.existsSync(testDocPath)) {
        const testDocBuffer = Buffer.from('fake-pdf-data');
        fs.mkdirSync(path.dirname(testDocPath), { recursive: true });
        fs.writeFileSync(testDocPath, testDocBuffer);
      }

      const response = await request(app)
        .post('/api/v1/uploads/document')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .field('accessLevel', 'private')
        .attach('file', testDocPath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata.metadata.category).toBe('document');
      expect(response.body.data.metadata.tags).toContain('document');
    });
  });

  describe('GET /api/v1/uploads/:fileId', () => {
    it('should get file metadata successfully', async () => {
      // First upload a file
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const uploadResponse = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .attach('file', testImagePath);

      const fileId = uploadResponse.body.data.id;

      // Then get the file metadata
      const response = await request(app)
        .get(`/api/v1/uploads/${fileId}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(fileId);
    });

    it('should return 404 for non-existent file', async () => {
      const response = await request(app)
        .get('/api/v1/uploads/non-existent-id')
        .set('Authorization', authToken);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/uploads/:fileId', () => {
    it('should delete file successfully', async () => {
      // First upload a file
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const uploadResponse = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .attach('file', testImagePath);

      const fileId = uploadResponse.body.data.id;

      // Then delete the file
      const response = await request(app)
        .delete(`/api/v1/uploads/${fileId}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File deleted successfully');
    });

    it('should return 404 when trying to delete non-existent file', async () => {
      const response = await request(app)
        .delete('/api/v1/uploads/non-existent-id')
        .set('Authorization', authToken);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('File size limits', () => {
    it('should reject files that exceed size limits', async () => {
      // Create a large file buffer (simulate a file larger than allowed)
      const largeBuffer = Buffer.alloc(100 * 1024 * 1024); // 100MB
      const largePath = path.join(__dirname, '../fixtures/large-file.jpg');

      fs.mkdirSync(path.dirname(largePath), { recursive: true });
      fs.writeFileSync(largePath, largeBuffer);

      const response = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'user_profile')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .attach('file', largePath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FILE_TOO_LARGE');

      // Clean up
      fs.unlinkSync(largePath);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON in multiple upload metadata', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const response = await request(app)
        .post('/api/v1/uploads/multiple')
        .set('Authorization', authToken)
        .field('uploadedBy', 'user-123')
        .field('files', 'invalid-json')
        .attach('files', testImagePath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle invalid entity types', async () => {
      const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');

      const response = await request(app)
        .post('/api/v1/uploads')
        .set('Authorization', authToken)
        .field('entityType', 'invalid_type')
        .field('entityId', 'user-123')
        .field('uploadedBy', 'user-123')
        .attach('file', testImagePath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
