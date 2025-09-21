import { OrderStatus, PaymentStatus, PrismaClient } from '@prisma/client';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../app';
import { redisService } from '../../services/redis.service';
import { TestDataFactory, mockNotificationServiceClient, mockPaymentServiceClient } from '../utils/test-helpers';

describe('Orders Integration Tests', () => {
  let prisma: PrismaClient;
  let testFactory: TestDataFactory;
  let vendor: any;
  let product: any;
  let customerId: string;
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
    vendor = await testFactory.createVendor();
    product = await testFactory.createProduct(vendor.id, {
      inventory: { quantity: 50, trackQuantity: true }
    });
    customerId = 'test-customer-123';
    authToken = 'Bearer test-token';

    // Mock auth middleware
    vi.doMock('../../middleware/auth.middleware', () => ({
      authMiddleware: (req: any, res: any, next: any) => {
        req.user = { id: customerId, role: 'CUSTOMER' };
        next();
      }
    }));

    // Mock service clients
    mockPaymentServiceClient.createPaymentIntent.mockResolvedValue({
      id: 'pi_test_123',
      clientSecret: 'pi_test_123_secret',
      status: 'requires_confirmation',
      amount: 11799,
      currency: 'usd'
    });

    mockPaymentServiceClient.confirmPayment.mockResolvedValue({
      success: true,
      paymentIntentId: 'pi_test_123',
      status: 'succeeded'
    });

    mockNotificationServiceClient.sendOrderConfirmation.mockResolvedValue(undefined);
    mockNotificationServiceClient.sendOrderStatusUpdate.mockResolvedValue(undefined);

    // Add item to cart for order creation tests
    await request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', authToken)
      .send({
        productId: product.id,
        quantity: 2
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('POST /api/v1/orders', () => {
    const validOrderData = {
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        phone: '+1234567890'
      },
      paymentMethodId: 'pm_test_123',
      notes: 'Please deliver to front door'
    };

    it('should create order from cart successfully', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.customerId).toBe(customerId);
      expect(response.body.data.status).toBe(OrderStatus.PENDING);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].productId).toBe(product.id);
      expect(response.body.data.items[0].quantity).toBe(2);
      expect(response.body.data.total).toBeGreaterThan(0);
      expect(response.body.data.shippingAddress.name).toBe('John Doe');

      // Verify cart is cleared after order creation
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken);
      expect(cartResponse.body.data.items).toHaveLength(0);
    });

    it('should create vendor orders for multi-vendor cart', async () => {
      // Create second vendor and product
      const vendor2 = await testFactory.createVendor({ name: 'Vendor 2' });
      const product2 = await testFactory.createProduct(vendor2.id, { name: 'Product 2' });

      // Add second product to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product2.id,
          quantity: 1
        });

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.vendorOrders).toHaveLength(2);

      const vendorOrder1 = response.body.data.vendorOrders.find((vo: any) => vo.vendorId === vendor.id);
      const vendorOrder2 = response.body.data.vendorOrders.find((vo: any) => vo.vendorId === vendor2.id);

      expect(vendorOrder1).toBeDefined();
      expect(vendorOrder2).toBeDefined();
      expect(vendorOrder1.items).toHaveLength(1);
      expect(vendorOrder2.items).toHaveLength(1);
    });

    it('should return 400 for empty cart', async () => {
      // Clear cart first
      await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', authToken);

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Cart is empty');
    });

    it('should return 400 for invalid shipping address', async () => {
      const invalidOrderData = {
        ...validOrderData,
        shippingAddress: {
          name: '', // Missing required field
          address: '123 Main St',
          city: 'New York',
          country: 'USA'
        }
      };

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(invalidOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for insufficient inventory', async () => {
      // Update product to have less inventory
      await prisma.product.update({
        where: { id: product.id },
        data: { inventory: { quantity: 1, trackQuantity: true } }
      });

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Insufficient stock');
    });

    it('should handle payment service failure', async () => {
      mockPaymentServiceClient.createPaymentIntent.mockRejectedValueOnce(
        new Error('Payment service unavailable')
      );

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Payment processing failed');
    });
  });

  describe('GET /api/v1/orders', () => {
    let order: any;

    beforeEach(async () => {
      // Create test order
      order = await testFactory.createOrder(customerId, {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID
      });
    });

    it('should get order history with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', authToken)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(response.body.data.orders[0].id).toBe(order.id);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
      expect(response.body.data.pagination.total).toBe(1);
    });

    it('should filter orders by status', async () => {
      // Create another order with different status
      await testFactory.createOrder(customerId, {
        status: OrderStatus.PENDING
      });

      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', authToken)
        .query({ status: OrderStatus.CONFIRMED })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(response.body.data.orders[0].status).toBe(OrderStatus.CONFIRMED);
    });

    it('should filter orders by date range', async () => {
      const dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
      const dateTo = new Date().toISOString();

      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', authToken)
        .query({ dateFrom, dateTo })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
    });

    it('should return empty array for customer with no orders', async () => {
      // Delete the test order
      await prisma.order.delete({ where: { id: order.id } });

      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(0);
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    let order: any;

    beforeEach(async () => {
      order = await testFactory.createOrder(customerId);
    });

    it('should get specific order details', async () => {
      const response = await request(app)
        .get(`/api/v1/orders/${order.id}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(order.id);
      expect(response.body.data.customerId).toBe(customerId);
      expect(response.body.data.status).toBe(order.status);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/v1/orders/non-existent-order')
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Order not found');
    });

    it('should return 403 for order belonging to different customer', async () => {
      // Create order for different customer
      const otherOrder = await testFactory.createOrder('other-customer-123');

      const response = await request(app)
        .get(`/api/v1/orders/${otherOrder.id}`)
        .set('Authorization', authToken)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access denied');
    });
  });

  describe('PUT /api/v1/orders/:id/status', () => {
    let order: any;

    beforeEach(async () => {
      order = await testFactory.createOrder(customerId, {
        status: OrderStatus.CONFIRMED
      });

      // Mock admin user
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = { id: 'admin-123', role: 'ADMIN' };
          next();
        }
      }));
    });

    it('should update order status successfully (admin only)', async () => {
      const response = await request(app)
        .put(`/api/v1/orders/${order.id}/status`)
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

    it('should return 400 for invalid status transition', async () => {
      const response = await request(app)
        .put(`/api/v1/orders/${order.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.DELIVERED // Invalid transition from CONFIRMED
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid status transition');
    });

    it('should return 403 for non-admin user', async () => {
      // Mock regular customer
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = { id: customerId, role: 'CUSTOMER' };
          next();
        }
      }));

      const response = await request(app)
        .put(`/api/v1/orders/${order.id}/status`)
        .set('Authorization', authToken)
        .send({
          status: OrderStatus.PROCESSING
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Insufficient permissions');
    });
  });

  describe('DELETE /api/v1/orders/:id/cancel', () => {
    let order: any;

    beforeEach(async () => {
      order = await testFactory.createOrder(customerId, {
        status: OrderStatus.CONFIRMED
      });
    });

    it('should cancel order successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/orders/${order.id}/cancel`)
        .set('Authorization', authToken)
        .send({
          reason: 'Changed my mind'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(OrderStatus.CANCELLED);
    });

    it('should return 400 for already delivered order', async () => {
      // Update order to delivered status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.DELIVERED }
      });

      const response = await request(app)
        .delete(`/api/v1/orders/${order.id}/cancel`)
        .set('Authorization', authToken)
        .send({
          reason: 'Changed my mind'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Cannot cancel order');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .delete('/api/v1/orders/non-existent-order/cancel')
        .set('Authorization', authToken)
        .send({
          reason: 'Changed my mind'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Order not found');
    });
  });

  describe('GET /api/v1/orders/:id/payment-status', () => {
    let order: any;

    beforeEach(async () => {
      order = await testFactory.createOrder(customerId, {
        paymentIntentId: 'pi_test_123'
      });

      mockPaymentServiceClient.getPaymentStatus = vi.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 11799,
        currency: 'usd'
      });
    });

    it('should get payment status for order', async () => {
      const response = await request(app)
        .get(`/api/v1/orders/${order.id}/payment-status`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentStatus).toBeDefined();
      expect(response.body.data.paymentIntentId).toBe('pi_test_123');
    });

    it('should return 404 for order without payment intent', async () => {
      // Create order without payment intent
      const orderWithoutPayment = await testFactory.createOrder(customerId, {
        paymentIntentId: null
      });

      const response = await request(app)
        .get(`/api/v1/orders/${orderWithoutPayment.id}/payment-status`)
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Payment intent not found');
    });
  });

  describe('POST /api/v1/orders/:id/confirm-payment', () => {
    let order: any;

    beforeEach(async () => {
      order = await testFactory.createOrder(customerId, {
        paymentIntentId: 'pi_test_123',
        paymentStatus: PaymentStatus.PENDING
      });
    });

    it('should confirm payment for order', async () => {
      const response = await request(app)
        .post(`/api/v1/orders/${order.id}/confirm-payment`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentStatus).toBe(PaymentStatus.PAID);
    });

    it('should return 400 for already confirmed payment', async () => {
      // Update order to paid status
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.PAID }
      });

      const response = await request(app)
        .post(`/api/v1/orders/${order.id}/confirm-payment`)
        .set('Authorization', authToken)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Payment already confirmed');
    });

    it('should handle payment service failure', async () => {
      mockPaymentServiceClient.confirmPayment.mockRejectedValueOnce(
        new Error('Payment confirmation failed')
      );

      const response = await request(app)
        .post(`/api/v1/orders/${order.id}/confirm-payment`)
        .set('Authorization', authToken)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Payment confirmation failed');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      vi.spyOn(prisma.order, 'findMany').mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', authToken)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should handle service client errors gracefully', async () => {
      // Mock payment service error during order creation
      mockPaymentServiceClient.createPaymentIntent.mockRejectedValueOnce(
        new Error('Service unavailable')
      );

      const validOrderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        paymentMethodId: 'pm_test_123'
      };

      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(validOrderData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Concurrent Order Creation', () => {
    it('should handle concurrent order creation with inventory conflicts', async () => {
      // Update product to have limited inventory
      await prisma.product.update({
        where: { id: product.id },
        data: { inventory: { quantity: 1, trackQuantity: true } }
      });

      // Add item to multiple carts
      const customer2Id = 'test-customer-456';
      const authToken2 = 'Bearer test-token-2';

      // Mock second customer
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          const token = req.headers.authorization;
          if (token === authToken2) {
            req.user = { id: customer2Id, role: 'CUSTOMER' };
          } else {
            req.user = { id: customerId, role: 'CUSTOMER' };
          }
          next();
        }
      }));

      // Add item to second customer's cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken2)
        .send({
          productId: product.id,
          quantity: 1
        });

      const validOrderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA'
        },
        paymentMethodId: 'pm_test_123'
      };

      // Try to create orders concurrently
      const [response1, response2] = await Promise.allSettled([
        request(app)
          .post('/api/v1/orders')
          .set('Authorization', authToken)
          .send(validOrderData),
        request(app)
          .post('/api/v1/orders')
          .set('Authorization', authToken2)
          .send(validOrderData)
      ]);

      // One should succeed, one should fail due to insufficient inventory
      const responses = [response1, response2].map(r =>
        r.status === 'fulfilled' ? r.value : null
      ).filter(Boolean);

      const successfulResponses = responses.filter(r => r.status === 201);
      const failedResponses = responses.filter(r => r.status === 400);

      expect(successfulResponses).toHaveLength(1);
      expect(failedResponses).toHaveLength(1);
    });
  });
});