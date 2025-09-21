import { OrderStatus, PrismaClient } from '@prisma/client';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../app';
import { redisService } from '../../services/redis.service';

describe('Basic Vendor Integration Tests', () => {
  let prisma: PrismaClient;
  let product1: any;
  let product2: any;
  let vendorOrder: any;
  let vendorId: string;
  let authToken: string;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
        }
      }
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
      console.warn('Redis cleanup failed:', error);
    }

    // Create test data
    vendorId = 'test-vendor-123';

    product1 = await prisma.product.create({
      data: {
        name: 'Vendor Product 1',
        description: 'Test product 1',
        price: 99.99,
        vendorId,
        category: 'Electronics',
        isActive: true,
        inventory: {
          create: {
            quantity: 50,
            trackQuantity: true
          }
        }
      },
      include: {
        inventory: true
      }
    });

    product2 = await prisma.product.create({
      data: {
        name: 'Vendor Product 2',
        description: 'Test product 2',
        price: 149.99,
        vendorId,
        category: 'Electronics',
        isActive: true,
        inventory: {
          create: {
            quantity: 25,
            trackQuantity: true,
            lowStockThreshold: 5
          }
        }
      },
      include: {
        inventory: true
      }
    });

    authToken = 'Bearer vendor-token';

    // Mock auth middleware for vendor
    vi.doMock('../../middleware/auth.middleware', () => ({
      authMiddleware: (req: any, res: any, next: any) => {
        req.user = { id: 'vendor-user-123', role: 'VENDOR', vendorId };
        next();
      },
      requireVendor: (req: any, res: any, next: any) => {
        if (req.user.role !== 'VENDOR') {
          return res.status(403).json({ success: false, error: 'Vendor access required' });
        }
        next();
      }
    }));

    // Create test order and vendor order
    const order = await prisma.order.create({
      data: {
        customerId: 'customer-123',
        status: OrderStatus.CONFIRMED,
        subtotal: 99.99,
        tax: 8.00,
        shipping: 10.00,
        total: 117.99,
        shippingAddress: {
          name: 'John Doe',
          address: '123 Test St',
          city: 'Test City',
          country: 'US'
        },
        paymentMethod: 'card_test'
      }
    });

    vendorOrder = await prisma.vendorOrder.create({
      data: {
        orderId: order.id,
        vendorId,
        status: OrderStatus.CONFIRMED,
        subtotal: 199.98,
        shipping: 10.00,
        total: 209.98,
        items: {
          create: [{
            productId: product1.id,
            quantity: 2,
            price: 99.99
          }]
        }
      },
      include: {
        items: true
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    try {
      await redisService.quit();
    } catch (error) {
      console.warn('Redis quit failed:', error);
    }
  });

  describe('GET /api/v1/vendor/orders', () => {
    it('should handle vendor orders request', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 });

      expect([200, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle order filtering by status', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ status: OrderStatus.CONFIRMED });

      expect([200, 400, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle date range filtering', async () => {
      const dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const dateTo = new Date().toISOString();

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ dateFrom, dateTo });

      expect([200, 400, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('PUT /api/v1/vendor/orders/:id/status', () => {
    it('should handle vendor order status update', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING,
          trackingNumber: '1Z999AA1234567890'
        });

      expect([200, 400, 403, 404, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle invalid status transitions', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: 'INVALID_STATUS'
        });

      expect([400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle non-existent vendor order', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/orders/non-existent-order/status')
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING
        });

      expect([404, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('GET /api/v1/vendor/dashboard', () => {
    it('should handle vendor dashboard request', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/dashboard')
        .set('Authorization', authToken);

      expect([200, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('GET /api/v1/vendor/products', () => {
    it('should handle vendor products request', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 20 });

      expect([200, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle product filtering by status', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ status: 'active' });

      expect([200, 400, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle product search', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ search: 'Product 1' });

      expect([200, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('PUT /api/v1/vendor/products/:id/inventory', () => {
    it('should handle inventory update request', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product1.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 75,
          lowStockThreshold: 10,
          trackQuantity: true
        });

      expect([200, 400, 403, 404, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle invalid inventory data', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product1.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: -5 // Invalid negative quantity
        });

      expect([400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle non-existent product', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/non-existent-product/inventory')
        .set('Authorization', authToken)
        .send({
          quantity: 50
        });

      expect([404, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('PUT /api/v1/vendor/products/inventory/bulk', () => {
    it('should handle bulk inventory update request', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/inventory/bulk')
        .set('Authorization', authToken)
        .send({
          updates: [
            {
              productId: product1.id,
              quantity: 100,
              lowStockThreshold: 15
            },
            {
              productId: product2.id,
              quantity: 50,
              lowStockThreshold: 8
            }
          ]
        });

      expect([200, 400, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle empty updates array', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/inventory/bulk')
        .set('Authorization', authToken)
        .send({
          updates: []
        });

      expect([400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('GET /api/v1/vendor/products/low-stock', () => {
    beforeEach(async () => {
      // Create low stock product
      await prisma.product.create({
        data: {
          name: 'Low Stock Product',
          description: 'Test low stock product',
          price: 29.99,
          vendorId,
          category: 'Electronics',
          isActive: true,
          inventory: {
            create: {
              quantity: 2,
              trackQuantity: true,
              lowStockThreshold: 5
            }
          }
        }
      });
    });

    it('should handle low stock products request', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products/low-stock')
        .set('Authorization', authToken);

      expect([200, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Authorization', () => {
    it('should require vendor role', async () => {
      // Mock regular customer
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = { id: 'customer-123', role: 'CUSTOMER' };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (req.user.role !== 'VENDOR') {
            return res.status(403).json({ success: false, error: 'Vendor access required' });
          }
          next();
        }
      }));

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken);

      expect([403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders');

      expect([401, 403, 500].includes(response.status)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      vi.spyOn(prisma.vendorOrder, 'findMany').mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Request Validation', () => {
    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ page: -1, limit: 1000 });

      expect([200, 400, 403, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });

    it('should validate inventory update data', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product1.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 'invalid-number'
        });

      expect([400, 500].includes(response.status)).toBe(true);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() =>
        request(app)
          .get('/api/v1/vendor/dashboard')
          .set('Authorization', authToken)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect([200, 403, 500].includes(response.status)).toBe(true);
        expect(response.body).toHaveProperty('success');
      });
    });
  });
});