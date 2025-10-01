import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { createApp } from '../../app';

// Mock external service clients
vi.mock('../../clients/auth.client', () => ({
  AuthClient: {
    validateToken: vi.fn().mockResolvedValue({
      valid: true,
      userId: 'test-user-123',
      serviceId: 'test-service',
      permissions: ['upload:create', 'upload:read', 'upload:delete'],
    }),
    getUserProfile: vi.fn().mockResolvedValue({
      id: 'test-user-123',
      email: 'test@example.com',
      role: 'user',
    }),
  },
}));

vi.mock('../../clients/notification.client', () => ({
  NotificationClient: {
    sendNotification: vi.fn().mockResolvedValue({ success: true }),
    sendBulkNotification: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('Multi-Service Integration E2E Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    app = createApp();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.TEST_DATABASE_URL ||
            'postgresql://test:test@localhost:5432/upload_test',
        },
      },
    });

    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.fileMetadata.deleteMany({
      where: {
        uploadedBy: {
          in: ['auth-service', 'ecommerce-service', 'hotel-service'],
        },
      },
    });

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('Auth Service Integration', () => {
    it('should integrate with auth service for user profile uploads', async () => {
      const authToken = 'valid-auth-token';
      const userId = 'auth-user-123';

      // Simulate auth service uploading user profile photo
      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Service-Name', 'auth-service')
        .field('userId', userId)
        .field('uploadedBy', 'auth-service')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      expect(uploadResponse.body.data).toMatchObject({
        entityType: 'user_profile',
        entityId: userId,
        uploadedBy: 'auth-service',
      });

      // Verify auth service can query user's files
      const queryResponse = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Service-Name', 'auth-service')
        .query({
          entityType: 'user_profile',
          entityId: userId,
        })
        .expect(200);

      expect(queryResponse.body.data).toHaveLength(1);
      expect(queryResponse.body.data[0].entityId).toBe(userId);
    });

    it('should handle auth service token validation', async () => {
      const invalidToken = 'invalid-token';

      // Mock auth client to return invalid token
      const { AuthClient } = await import('../../clients/auth.client');
      vi.mocked(AuthClient.validateToken).mockResolvedValueOnce({
        valid: false,
        error: 'Invalid token',
      });

      await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${invalidToken}`)
        .field('userId', 'test-user')
        .field('uploadedBy', 'auth-service')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(401);
    });
  });

  describe('Ecommerce Service Integration', () => {
    it('should integrate with ecommerce service for product images', async () => {
      const serviceToken = 'ecommerce-service-token';
      const productId = 'product-456';
      const vendorId = 'vendor-789';

      // Simulate ecommerce service uploading product images
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${serviceToken}`)
        .set('X-Service-Name', 'ecommerce-service')
        .field('productId', productId)
        .field('vendorId', vendorId)
        .field('uploadedBy', 'ecommerce-service')
        .field(
          'metadata',
          JSON.stringify({
            category: 'electronics',
            price: 299.99,
            featured: true,
          })
        )
        .attach('file', testImageBuffer, 'product.jpg')
        .expect(201);

      expect(uploadResponse.body.data).toMatchObject({
        entityType: 'product',
        entityId: productId,
        metadata: expect.objectContaining({
          category: 'electronics',
          vendorId: vendorId,
        }),
      });

      // Verify ecommerce service can batch upload multiple product images
      const batchUploadResponse = await request(app)
        .post('/api/v1/upload/batch')
        .set('Authorization', `Bearer ${serviceToken}`)
        .set('X-Service-Name', 'ecommerce-service')
        .field('entityType', 'product')
        .field('entityId', productId)
        .field('uploadedBy', 'ecommerce-service')
        .attach('files', testImageBuffer, 'product1.jpg')
        .attach('files', testImageBuffer, 'product2.jpg')
        .attach('files', testImageBuffer, 'product3.jpg')
        .expect(201);

      expect(batchUploadResponse.body.data).toHaveLength(3);

      // Query all product images
      const queryResponse = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${serviceToken}`)
        .query({
          entityType: 'product',
          entityId: productId,
        })
        .expect(200);

      expect(queryResponse.body.data).toHaveLength(4); // 1 + 3 from batch
    });

    it('should handle ecommerce service inventory updates', async () => {
      const serviceToken = 'ecommerce-service-token';
      const productId = 'product-inventory-test';

      // Upload product image
      const uploadResponse = await request(app)
        .post('/api/v1/upload/product-image')
        .set('Authorization', `Bearer ${serviceToken}`)
        .field('productId', productId)
        .field('uploadedBy', 'ecommerce-service')
        .attach('file', testImageBuffer, 'product.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Simulate product deletion - should trigger file cleanup
      await request(app)
        .post('/api/v1/files/cleanup/entity')
        .set('Authorization', `Bearer ${serviceToken}`)
        .send({
          entityType: 'product',
          entityId: productId,
          reason: 'product_deleted',
        })
        .expect(200);

      // Verify file is marked for deletion
      const fileStatus = await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${serviceToken}`)
        .expect(200);

      expect(fileStatus.body.data.status).toBe('deleted');
    });
  });

  describe('Hotel Service Integration', () => {
    it('should integrate with hotel service for property photos', async () => {
      const serviceToken = 'hotel-service-token';
      const propertyId = 'property-123';
      const roomId = 'room-456';

      // Upload property photos
      const propertyUpload = await request(app)
        .post('/api/v1/upload/property-photo')
        .set('Authorization', `Bearer ${serviceToken}`)
        .set('X-Service-Name', 'hotel-service')
        .field('propertyId', propertyId)
        .field('uploadedBy', 'hotel-service')
        .field('tags', JSON.stringify(['exterior', 'main']))
        .attach('file', testImageBuffer, 'property-exterior.jpg')
        .expect(201);

      // Upload room photos
      const roomUpload = await request(app)
        .post('/api/v1/upload/property-photo')
        .set('Authorization', `Bearer ${serviceToken}`)
        .field('propertyId', propertyId)
        .field('roomId', roomId)
        .field('uploadedBy', 'hotel-service')
        .field('tags', JSON.stringify(['room', 'interior']))
        .attach('file', testImageBuffer, 'room-interior.jpg')
        .expect(201);

      // Query property photos
      const propertyQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${serviceToken}`)
        .query({
          entityType: 'property',
          entityId: propertyId,
          tags: 'exterior',
        })
        .expect(200);

      expect(propertyQuery.body.data).toHaveLength(1);
      expect(propertyQuery.body.data[0].tags).toContain('exterior');

      // Query room photos
      const roomQuery = await request(app)
        .get('/api/v1/files/query')
        .set('Authorization', `Bearer ${serviceToken}`)
        .query({
          entityType: 'property',
          entityId: propertyId,
          'metadata.roomId': roomId,
        })
        .expect(200);

      expect(roomQuery.body.data).toHaveLength(1);
      expect(roomQuery.body.data[0].metadata.roomId).toBe(roomId);
    });
  });

  describe('Notification Service Integration', () => {
    it('should trigger notifications for upload events', async () => {
      const serviceToken = 'test-service-token';
      const userId = 'notification-test-user';

      // Upload file that should trigger notification
      await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${serviceToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'auth-service')
        .field('notifyUser', 'true')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      // Wait for async notification processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify notification was sent
      const { NotificationClient } = await import(
        '../../clients/notification.client'
      );
      expect(
        vi.mocked(NotificationClient.sendNotification)
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userId,
          type: 'upload_complete',
          data: expect.objectContaining({
            fileType: 'profile_photo',
          }),
        })
      );
    });

    it('should handle notification failures gracefully', async () => {
      const serviceToken = 'test-service-token';
      const userId = 'notification-fail-user';

      // Mock notification failure
      const { NotificationClient } = await import(
        '../../clients/notification.client'
      );
      vi.mocked(NotificationClient.sendNotification).mockRejectedValueOnce(
        new Error('Notification service unavailable')
      );

      // Upload should still succeed even if notification fails
      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${serviceToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'auth-service')
        .field('notifyUser', 'true')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      expect(uploadResponse.body.success).toBe(true);
    });
  });

  describe('Cross-Service File Sharing', () => {
    it('should handle cross-service file access', async () => {
      const authToken = 'auth-service-token';
      const ecommerceToken = 'ecommerce-service-token';
      const userId = 'shared-user-123';

      // Auth service uploads user profile photo
      const uploadResponse = await request(app)
        .post('/api/v1/upload/profile-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('userId', userId)
        .field('uploadedBy', 'auth-service')
        .field('accessLevel', 'public')
        .attach('file', testImageBuffer, 'profile.jpg')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Ecommerce service should be able to access public profile photo
      await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .expect(200);

      // Ecommerce service should be able to download public file
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .expect(200);
    });

    it('should enforce cross-service access controls', async () => {
      const authToken = 'auth-service-token';
      const hotelToken = 'hotel-service-token';
      const userId = 'private-user-456';

      // Auth service uploads private user document
      const uploadResponse = await request(app)
        .post('/api/v1/upload/document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('entityType', 'user_document')
        .field('entityId', userId)
        .field('uploadedBy', 'auth-service')
        .field('accessLevel', 'private')
        .attach('file', Buffer.from('Private document'), 'private.txt')
        .expect(201);

      const fileId = uploadResponse.body.data.id;

      // Hotel service should not be able to access private document
      await request(app)
        .get(`/api/v1/files/${fileId}`)
        .set('Authorization', `Bearer ${hotelToken}`)
        .expect(403);

      // Hotel service should not be able to download private file
      await request(app)
        .get(`/api/v1/files/${fileId}/download`)
        .set('Authorization', `Bearer ${hotelToken}`)
        .expect(403);
    });
  });
});
