import { OrderStatus, PrismaClient } from '@prisma/client';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../app';
import { redisService } from '../../services/redis.service';
import { TestDataFactory, mockNotificationServiceClient } from '../utils/test-helpers';

describe('Vendor Integration Tests', () => {
  let prisma: PrismaClient;
  let testFactory: TestDataFactory;
  let vendor: any;
  let vendor2: any;
  let product: any;
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
    testFactory = new TestDataFactory(prisma);
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.orderItem.deleteMany();
    await prisma.vendorOrder.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryReservation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.vendor.deleteMany();

    // Clear Redis test data
    const keys = await redisService.keys('test:*');
    if (keys.length > 0) {
      await redisService.del(keys);
    }

    // Create test data
    vendor = await testFactory.createVendor({ name: 'Test Vendor 1' });
    vendor2 = await testFactory.createVendor({ name: 'Test Vendor 2' });

    product = await testFactory.createProduct(vendor.id, {
      name: 'Vendor 1 Product',
      inventory: { quantity: 50, trackQuantity: true }
    });

    product2 = await testFactory.createProduct(vendor.id, {
      name: 'Vendor 1 Product 2',
      inventory: { quantity: 25, trackQuantity: true }
    });

    vendorId = vendor.id;
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
    const order = await testFactory.createOrder('customer-123', {
      status: OrderStatus.CONFIRMED
    });

    vendorOrder = await prisma.vendorOrder.create({
      data: {
        id: 'vendor-order-123',
        orderId: order.id,
        vendorId: vendor.id,
        status: OrderStatus.CONFIRMED,
        subtotal: 199.98,
        shipping: 10.00,
        total: 209.98,
        items: {
          create: [{
            productId: product.id,
            quantity: 2,
            price: 99.99
          }]
        }
      },
      include: {
        items: true
      }
    });

    // Mock notification service
    mockNotificationServiceClient.sendVendorOrderNotification.mockResolvedValue(undefined);
    mockNotificationServiceClient.sendInventoryAlert.mockResolvedValue(undefined);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('GET /api/v1/vendor/orders', () => {
    it('should get vendor orders with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(response.body.data.orders[0].id).toBe(vendorOrder.id);
      expect(response.body.data.orders[0].vendorId).toBe(vendor.id);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
      expect(response.body.data.pagination.total).toBe(1);
    });

    it('should filter vendor orders by status', async () => {
      // Create another vendor order with different status
      const order2 = await testFactory.createOrder('customer-456');
      await prisma.vendorOrder.create({
        data: {
          orderId: order2.id,
          vendorId: vendor.id,
          status: OrderStatus.PENDING,
          subtotal: 99.99,
          shipping: 5.00,
          total: 104.99
        }
      });

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ status: OrderStatus.CONFIRMED })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(response.body.data.orders[0].status).toBe(OrderStatus.CONFIRMED);
    });

    it('should filter vendor orders by date range', async () => {
      const dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const dateTo = new Date().toISOString();

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .query({ dateFrom, dateTo })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
    });

    it('should only return orders for the authenticated vendor', async () => {
      // Create order for different vendor
      const order3 = await testFactory.createOrder('customer-789');
      await prisma.vendorOrder.create({
        data: {
          orderId: order3.id,
          vendorId: vendor2.id, // Different vendor
          status: OrderStatus.CONFIRMED,
          subtotal: 149.99,
          shipping: 8.00,
          total: 157.99
        }
      });

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(response.body.data.orders[0].vendorId).toBe(vendor.id);
    });

    it('should return empty array for vendor with no orders', async () => {
      // Delete the test vendor order
      await prisma.vendorOrder.delete({ where: { id: vendorOrder.id } });

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(0);
    });
  });

  describe('PUT /api/v1/vendor/orders/:id/status', () => {
    it('should update vendor order status successfully', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING,
          trackingNumber: '1Z999AA1234567890'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(OrderStatus.PROCESSING);
      expect(response.body.data.trackingNumber).toBe('1Z999AA1234567890');
    });

    it('should update to shipped status with tracking number', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.SHIPPED,
          trackingNumber: '1Z999AA1234567890'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(OrderStatus.SHIPPED);
      expect(response.body.data.trackingNumber).toBe('1Z999AA1234567890');
    });

    it('should return 400 for invalid status transition', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.DELIVERED // Invalid transition from CONFIRMED
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid status transition');
    });

    it('should return 404 for non-existent vendor order', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/orders/non-existent-order/status')
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Vendor order not found');
    });

    it('should return 403 for vendor order belonging to different vendor', async () => {
      // Create order for different vendor
      const order3 = await testFactory.createOrder('customer-789');
      const otherVendorOrder = await prisma.vendorOrder.create({
        data: {
          orderId: order3.id,
          vendorId: vendor2.id, // Different vendor
          status: OrderStatus.CONFIRMED,
          subtotal: 149.99,
          shipping: 8.00,
          total: 157.99
        }
      });

      const response = await request(app)
        .put(`/api/v1/vendor/orders/${otherVendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access denied');
    });
  });

  describe('GET /api/v1/vendor/dashboard', () => {
    beforeEach(async () => {
      // Create additional test data for dashboard
      const order2 = await testFactory.createOrder('customer-456');
      await prisma.vendorOrder.create({
        data: {
          orderId: order2.id,
          vendorId: vendor.id,
          status: OrderStatus.DELIVERED,
          subtotal: 149.99,
          shipping: 8.00,
          total: 157.99
        }
      });

      // Create low stock product
      await testFactory.createProduct(vendor.id, {
        name: 'Low Stock Product',
        inventory: { quantity: 2, trackQuantity: true, lowStockThreshold: 5 }
      });
    });

    it('should get vendor dashboard analytics', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/dashboard')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalProducts).toBeGreaterThan(0);
      expect(response.body.data.totalOrders).toBeGreaterThan(0);
      expect(response.body.data.totalRevenue).toBeGreaterThan(0);
      expect(response.body.data.pendingOrders).toBeGreaterThanOrEqual(0);
      expect(response.body.data.lowStockProducts).toBeGreaterThan(0);
      expect(response.body.data.recentOrders).toBeDefined();
      expect(response.body.data.analytics).toBeDefined();
      expect(response.body.data.analytics.salesThisMonth).toBeGreaterThanOrEqual(0);
      expect(response.body.data.analytics.ordersThisMonth).toBeGreaterThanOrEqual(0);
    });

    it('should include recent orders in dashboard', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/dashboard')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.recentOrders).toHaveLength(2);
      expect(response.body.data.recentOrders[0].vendorId).toBe(vendor.id);
    });

    it('should include top selling products in analytics', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/dashboard')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics.topSellingProducts).toBeDefined();
      expect(Array.isArray(response.body.data.analytics.topSellingProducts)).toBe(true);
    });
  });

  describe('GET /api/v1/vendor/products', () => {
    it('should get vendor products with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 20 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.products[0].vendorId).toBe(vendor.id);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(20);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should filter products by status', async () => {
      // Make one product inactive
      await prisma.product.update({
        where: { id: product2.id },
        data: { isActive: false }
      });

      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ status: 'active' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].isActive).toBe(true);
    });

    it('should filter products by category', async () => {
      // Update one product category
      await prisma.product.update({
        where: { id: product2.id },
        data: { category: 'Books' }
      });

      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ category: 'Electronics' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].category).toBe('Electronics');
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .query({ search: 'Product 2' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain('Product 2');
    });

    it('should only return products for the authenticated vendor', async () => {
      // Create product for different vendor
      await testFactory.createProduct(vendor2.id, { name: 'Other Vendor Product' });

      const response = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      response.body.data.products.forEach((product: any) => {
        expect(product.vendorId).toBe(vendor.id);
      });
    });
  });

  describe('PUT /api/v1/vendor/products/:id/inventory', () => {
    it('should update product inventory successfully', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 75,
          lowStockThreshold: 10,
          trackQuantity: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inventory.quantity).toBe(75);
      expect(response.body.data.inventory.lowStockThreshold).toBe(10);
      expect(response.body.data.inventory.trackQuantity).toBe(true);
    });

    it('should disable inventory tracking', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 0,
          trackQuantity: false
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inventory.trackQuantity).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/non-existent-product/inventory')
        .set('Authorization', authToken)
        .send({
          quantity: 50
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Product not found');
    });

    it('should return 403 for product belonging to different vendor', async () => {
      // Create product for different vendor
      const otherProduct = await testFactory.createProduct(vendor2.id, { name: 'Other Product' });

      const response = await request(app)
        .put(`/api/v1/vendor/products/${otherProduct.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 50
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access denied');
    });

    it('should return 400 for invalid inventory data', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: -5 // Invalid negative quantity
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/vendor/products/inventory/bulk', () => {
    it('should bulk update product inventories successfully', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/inventory/bulk')
        .set('Authorization', authToken)
        .send({
          updates: [
            {
              productId: product.id,
              quantity: 100,
              lowStockThreshold: 15
            },
            {
              productId: product2.id,
              quantity: 50,
              lowStockThreshold: 8
            }
          ]
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.updated).toBe(2);
      expect(response.body.data.failed).toBe(0);
      expect(response.body.data.results).toHaveLength(2);
    });

    it('should handle partial failures in bulk update', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/inventory/bulk')
        .set('Authorization', authToken)
        .send({
          updates: [
            {
              productId: product.id,
              quantity: 100
            },
            {
              productId: 'non-existent-product',
              quantity: 50
            }
          ]
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.updated).toBe(1);
      expect(response.body.data.failed).toBe(1);
      expect(response.body.data.results).toHaveLength(2);
      expect(response.body.data.results[1].success).toBe(false);
    });

    it('should return 400 for empty updates array', async () => {
      const response = await request(app)
        .put('/api/v1/vendor/products/inventory/bulk')
        .set('Authorization', authToken)
        .send({
          updates: []
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/vendor/products/low-stock', () => {
    beforeEach(async () => {
      // Create low stock products
      await testFactory.createProduct(vendor.id, {
        name: 'Low Stock Product 1',
        inventory: { quantity: 2, trackQuantity: true, lowStockThreshold: 5 }
      });

      await testFactory.createProduct(vendor.id, {
        name: 'Low Stock Product 2',
        inventory: { quantity: 1, trackQuantity: true, lowStockThreshold: 3 }
      });
    });

    it('should get products with low stock', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/products/low-stock')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products.length).toBeGreaterThan(0);
      expect(response.body.data.count).toBeGreaterThan(0);

      // Verify all returned products are actually low stock
      response.body.data.products.forEach((product: any) => {
        expect(product.inventory.quantity).toBeLessThanOrEqual(product.inventory.lowStockThreshold);
      });
    });

    it('should return empty array when no low stock products', async () => {
      // Update all products to have sufficient stock
      await prisma.product.updateMany({
        where: { vendorId: vendor.id },
        data: { inventory: { quantity: 100, trackQuantity: true, lowStockThreshold: 5 } }
      });

      const response = await request(app)
        .get('/api/v1/vendor/products/low-stock')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(0);
      expect(response.body.data.count).toBe(0);
    });
  });

  describe('Authorization', () => {
    it('should return 403 for non-vendor user', async () => {
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
        .set('Authorization', authToken)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Vendor access required');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      vi.spyOn(prisma.vendorOrder, 'findMany').mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', authToken)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should handle notification service errors gracefully', async () => {
      // Mock notification service error
      mockNotificationServiceClient.sendVendorOrderNotification.mockRejectedValueOnce(
        new Error('Notification service unavailable')
      );

      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING
        })
        .expect(200); // Should still succeed even if notification fails

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(OrderStatus.PROCESSING);
    });
  });

  describe('Multi-Service Workflows', () => {
    it('should handle vendor order status update with customer notification', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.SHIPPED,
          trackingNumber: '1Z999AA1234567890'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(OrderStatus.SHIPPED);

      // Verify notification was sent
      expect(mockNotificationServiceClient.sendVendorOrderNotification).toHaveBeenCalledWith(
        vendor.id,
        expect.objectContaining({
          id: vendorOrder.id,
          status: OrderStatus.SHIPPED
        })
      );
    });

    it('should handle inventory update with low stock alert', async () => {
      const response = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', authToken)
        .send({
          quantity: 2,
          lowStockThreshold: 5,
          trackQuantity: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify low stock alert was sent
      expect(mockNotificationServiceClient.sendInventoryAlert).toHaveBeenCalledWith(
        vendor.id,
        expect.objectContaining({
          id: product.id,
          inventory: expect.objectContaining({
            quantity: 2,
            lowStockThreshold: 5
          })
        })
      );
    });
  });
});