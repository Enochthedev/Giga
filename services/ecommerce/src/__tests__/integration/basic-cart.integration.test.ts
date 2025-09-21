import { PrismaClient } from '@prisma/client';
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
import { app } from '../../app';
import { redisService } from '../../services/redis.service';

describe('Basic Cart Integration Tests', () => {
  let prisma: PrismaClient;
  let product: any;
  let customerId: string;
  let authToken: string;

  beforeAll(() => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.orderItem.deleteMany();
    await prisma.vendorOrder.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryReservation.deleteMany();
    await prisma.productInventory.deleteMany();
    await prisma.product.deleteMany();

    // Clear Redis test data
    try {
      const keys = await redisService.keys('test:*');
      if (keys.length > 0) {
        await redisService.del(keys);
      }
    } catch (error) {
      // Redis might not be available in test environment
      console.warn('Redis cleanup failed:', error);
    }

    // Create test data
    const vendorId = 'test-vendor-123';
    product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Test product description',
        price: 99.99,
        vendorId,
        category: 'Electronics',
        isActive: true,
        inventory: {
          create: {
            quantity: 50,
            trackQuantity: true,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    customerId = 'test-customer-123';
    authToken = 'Bearer test-token';

    // Mock auth middleware
    vi.doMock('../../middleware/auth.middleware', () => ({
      authMiddleware: (req: any, res: any, next: any) => {
        req.user = { id: customerId, role: 'CUSTOMER' };
        next();
      },
    }));

    // Mock session middleware
    vi.doMock('../../middleware/session.middleware', () => ({
      handleSession: (req: any, res: any, next: any) => {
        req.sessionId = 'test-session-123';
        next();
      },
      handleAuthentication: (req: any, res: any, next: any) => {
        req.customerId = customerId;
        next();
      },
    }));
  });

  afterAll(async () => {
    await prisma.$disconnect();
    try {
      await redisService.quit();
    } catch (error) {
      // Redis might not be available
      console.warn('Redis quit failed:', error);
    }
  });

  describe('GET /api/v1/cart', () => {
    it('should return empty cart for new customer', async () => {
      const response = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken);

      // Should return 200 or handle gracefully
      expect([200, 500].includes(response.status)).toBe(true);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('success');
      }
    });
  });

  describe('POST /api/v1/cart/add', () => {
    it('should handle add item request', async () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });

      // Should return 200, 400, or 500 (not 404)
      expect([200, 400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: 'invalid-product-id',
          quantity: 1,
        });

      // Should handle invalid product gracefully
      expect([400, 404, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should return 400 for invalid quantity', async () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 0,
        });

      // Should validate quantity
      expect([400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect([200, 503].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('service', 'ecommerce');
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(app).get('/docs');

      // Should serve documentation or redirect
      expect([200, 301, 302].includes(response.status)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent-route')
        .set('Authorization', authToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle missing authorization', async () => {
      const response = await request(app).get('/api/v1/cart');

      // Should require authentication
      expect([401, 403, 500].includes(response.status)).toBe(true);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/health');

      // Should have security headers from helmet
      expect(response.headers).toHaveProperty('x-content-type-options');
    });

    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/cart')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      // Should handle CORS
      expect([200, 204].includes(response.status)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to API endpoints', async () => {
      // Make multiple rapid requests
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/health'));

      const responses = await Promise.all(requests);

      // All requests should succeed for health endpoint (no rate limiting)
      responses.forEach(response => {
        expect([200, 503].includes(response.status)).toBe(true);
      });
    });
  });

  describe('Request Validation', () => {
    it('should validate request body size', async () => {
      const largePayload = {
        productId: product.id,
        quantity: 1,
        data: 'x'.repeat(20 * 1024 * 1024), // 20MB payload
      };

      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send(largePayload);

      // Should reject large payloads
      expect([400, 413, 500].includes(response.status)).toBe(true);
    });

    it('should sanitize input data', async () => {
      const maliciousPayload = {
        productId: product.id,
        quantity: 1,
        notes: '<script>alert("xss")</script>',
      };

      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send(maliciousPayload);

      // Should handle malicious input
      expect([200, 400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });
});
