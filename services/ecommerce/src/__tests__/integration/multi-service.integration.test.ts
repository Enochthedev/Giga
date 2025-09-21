import { OrderStatus, PaymentStatus, PrismaClient } from '@prisma/client';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../app';
import { redisService } from '../../services/redis.service';
import { TestDataFactory, mockAuthServiceClient, mockNotificationServiceClient, mockPaymentServiceClient } from '../utils/test-helpers';

describe('Multi-Service Integration Tests', () => {
  let prisma: PrismaClient;
  let testFactory: TestDataFactory;
  let vendor1: any;
  let vendor2: any;
  let product1: any;
  let product2: any;
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
    vendor1 = await testFactory.createVendor({ name: 'Electronics Vendor' });
    vendor2 = await testFactory.createVendor({ name: 'Books Vendor' });

    product1 = await testFactory.createProduct(vendor1.id, {
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics',
      inventory: { quantity: 10, trackQuantity: true }
    });

    product2 = await testFactory.createProduct(vendor2.id, {
      name: 'Programming Book',
      price: 49.99,
      category: 'Books',
      inventory: { quantity: 25, trackQuantity: true }
    });

    customerId = 'test-customer-123';
    authToken = 'Bearer test-token';

    // Mock auth service client
    mockAuthServiceClient.validateToken.mockResolvedValue({
      id: customerId,
      email: 'customer@test.com',
      role: 'CUSTOMER'
    });

    mockAuthServiceClient.getUserInfo.mockResolvedValue({
      id: customerId,
      email: 'customer@test.com',
      name: 'Test Customer',
      role: 'CUSTOMER'
    });

    // Mock payment service client
    mockPaymentServiceClient.createPaymentIntent.mockResolvedValue({
      id: 'pi_test_123',
      clientSecret: 'pi_test_123_secret',
      status: 'requires_confirmation',
      amount: 104999, // $1049.99 in cents
      currency: 'usd'
    });

    mockPaymentServiceClient.confirmPayment.mockResolvedValue({
      success: true,
      paymentIntentId: 'pi_test_123',
      status: 'succeeded'
    });

    // Mock notification service client
    mockNotificationServiceClient.sendOrderConfirmation.mockResolvedValue(undefined);
    mockNotificationServiceClient.sendOrderStatusUpdate.mockResolvedValue(undefined);
    mockNotificationServiceClient.sendVendorOrderNotification.mockResolvedValue(undefined);

    // Mock auth middleware
    vi.doMock('../../middleware/auth.middleware', () => ({
      authMiddleware: (req: any, res: any, next: any) => {
        req.user = { id: customerId, role: 'CUSTOMER' };
        next();
      }
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
      }
    }));
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('Complete Shopping Workflow', () => {
    it('should handle complete cart-to-order workflow with multiple vendors', async () => {
      // Step 1: Add items from multiple vendors to cart
      const addItem1Response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1
        })
        .expect(200);

      expect(addItem1Response.body.success).toBe(true);

      const addItem2Response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product2.id,
          quantity: 2
        })
        .expect(200);

      expect(addItem2Response.body.success).toBe(true);

      // Step 2: Validate cart before checkout
      const validateResponse = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(validateResponse.body.success).toBe(true);
      expect(validateResponse.body.data.validation.isValid).toBe(true);
      expect(validateResponse.body.data.validation.canProceedToCheckout).toBe(true);

      // Step 3: Reserve inventory for checkout
      const reserveResponse = await request(app)
        .post('/api/v1/cart/reserve')
        .set('Authorization', authToken)
        .send({
          expirationMinutes: 30
        })
        .expect(200);

      expect(reserveResponse.body.success).toBe(true);
      expect(reserveResponse.body.data.reservationId).toBeDefined();

      // Step 4: Create order from cart
      const orderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          phone: '+1234567890'
        },
        paymentMethodId: 'pm_test_123',
        notes: 'Please handle with care'
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData)
        .expect(201);

      expect(createOrderResponse.body.success).toBe(true);
      const order = createOrderResponse.body.data;

      // Verify order structure
      expect(order.id).toBeDefined();
      expect(order.customerId).toBe(customerId);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.items).toHaveLength(2);
      expect(order.vendorOrders).toHaveLength(2);
      expect(order.total).toBeGreaterThan(1000); // Should be around $1049.99

      // Verify vendor orders
      const vendor1Order = order.vendorOrders.find((vo: any) => vo.vendorId === vendor1.id);
      const vendor2Order = order.vendorOrders.find((vo: any) => vo.vendorId === vendor2.id);

      expect(vendor1Order).toBeDefined();
      expect(vendor2Order).toBeDefined();
      expect(vendor1Order.items).toHaveLength(1);
      expect(vendor2Order.items).toHaveLength(1);

      // Step 5: Verify cart is cleared
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(cartResponse.body.data.items).toHaveLength(0);

      // Step 6: Verify inventory was updated
      const updatedProduct1 = await prisma.product.findUnique({
        where: { id: product1.id }
      });
      const updatedProduct2 = await prisma.product.findUnique({
        where: { id: product2.id }
      });

      expect(updatedProduct1?.inventory.quantity).toBe(9); // 10 - 1
      expect(updatedProduct2?.inventory.quantity).toBe(23); // 25 - 2

      // Step 7: Verify service integrations were called
      expect(mockPaymentServiceClient.createPaymentIntent).toHaveBeenCalledWith(
        expect.any(Number),
        'usd',
        customerId
      );
      expect(mockNotificationServiceClient.sendOrderConfirmation).toHaveBeenCalledWith(
        customerId,
        expect.objectContaining({ id: order.id })
      );
      expect(mockNotificationServiceClient.sendVendorOrderNotification).toHaveBeenCalledTimes(2);
    });

    it('should handle order cancellation with inventory restoration', async () => {
      // Create order first
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 2 });

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(201);

      const orderId = orderResponse.body.data.id;

      // Verify inventory was reduced
      const productAfterOrder = await prisma.product.findUnique({
        where: { id: product1.id }
      });
      expect(productAfterOrder?.inventory.quantity).toBe(8); // 10 - 2

      // Cancel the order
      const cancelResponse = await request(app)
        .delete(`/api/v1/orders/${orderId}/cancel`)
        .set('Authorization', authToken)
        .send({
          reason: 'Changed my mind'
        })
        .expect(200);

      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.data.status).toBe(OrderStatus.CANCELLED);

      // Verify inventory was restored
      const productAfterCancel = await prisma.product.findUnique({
        where: { id: product1.id }
      });
      expect(productAfterCancel?.inventory.quantity).toBe(10); // Restored to original

      // Verify notification was sent
      expect(mockNotificationServiceClient.sendOrderStatusUpdate).toHaveBeenCalledWith(
        customerId,
        expect.objectContaining({
          id: orderId,
          status: OrderStatus.CANCELLED
        }),
        OrderStatus.PENDING
      );
    });
  });

  describe('Vendor Order Fulfillment Workflow', () => {
    let order: any;
    let vendorOrder1: any;
    let vendorOrder2: any;

    beforeEach(async () => {
      // Create multi-vendor order
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 1 });

      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product2.id, quantity: 1 });

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        });

      order = orderResponse.body.data;
      vendorOrder1 = order.vendorOrders.find((vo: any) => vo.vendorId === vendor1.id);
      vendorOrder2 = order.vendorOrders.find((vo: any) => vo.vendorId === vendor2.id);
    });

    it('should handle vendor order status updates independently', async () => {
      // Mock vendor 1 authentication
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = { id: 'vendor1-user', role: 'VENDOR', vendorId: vendor1.id };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (req.user.role !== 'VENDOR') {
            return res.status(403).json({ success: false, error: 'Vendor access required' });
          }
          next();
        }
      }));

      // Vendor 1 updates their order to processing
      const vendor1UpdateResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder1.id}/status`)
        .set('Authorization', 'Bearer vendor1-token')
        .send({
          status: OrderStatus.PROCESSING
        })
        .expect(200);

      expect(vendor1UpdateResponse.body.success).toBe(true);
      expect(vendor1UpdateResponse.body.data.status).toBe(OrderStatus.PROCESSING);

      // Mock vendor 2 authentication
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = { id: 'vendor2-user', role: 'VENDOR', vendorId: vendor2.id };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (req.user.role !== 'VENDOR') {
            return res.status(403).json({ success: false, error: 'Vendor access required' });
          }
          next();
        }
      }));

      // Vendor 2 ships their order
      const vendor2UpdateResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendorOrder2.id}/status`)
        .set('Authorization', 'Bearer vendor2-token')
        .send({
          status: OrderStatus.SHIPPED,
          trackingNumber: '1Z999AA1234567890'
        })
        .expect(200);

      expect(vendor2UpdateResponse.body.success).toBe(true);
      expect(vendor2UpdateResponse.body.data.status).toBe(OrderStatus.SHIPPED);
      expect(vendor2UpdateResponse.body.data.trackingNumber).toBe('1Z999AA1234567890');

      // Verify main order status is updated appropriately
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { vendorOrders: true }
      });

      expect(updatedOrder?.status).toBe(OrderStatus.PROCESSING); // Should reflect the most advanced status
    });

    it('should complete order when all vendor orders are delivered', async () => {
      // Update both vendor orders to delivered
      await prisma.vendorOrder.updateMany({
        where: { orderId: order.id },
        data: { status: OrderStatus.DELIVERED }
      });

      // Check if main order status is updated
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { vendorOrders: true }
      });

      expect(updatedOrder?.vendorOrders.every(vo => vo.status === OrderStatus.DELIVERED)).toBe(true);
    });
  });

  describe('Payment Integration Workflow', () => {
    it('should handle payment confirmation workflow', async () => {
      // Add item to cart and create order
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 1 });

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(201);

      const orderId = orderResponse.body.data.id;

      // Check payment status
      const paymentStatusResponse = await request(app)
        .get(`/api/v1/orders/${orderId}/payment-status`)
        .set('Authorization', authToken)
        .expect(200);

      expect(paymentStatusResponse.body.success).toBe(true);
      expect(paymentStatusResponse.body.data.paymentIntentId).toBe('pi_test_123');

      // Confirm payment
      const confirmPaymentResponse = await request(app)
        .post(`/api/v1/orders/${orderId}/confirm-payment`)
        .set('Authorization', authToken)
        .expect(200);

      expect(confirmPaymentResponse.body.success).toBe(true);
      expect(confirmPaymentResponse.body.data.paymentStatus).toBe(PaymentStatus.PAID);

      // Verify payment service was called
      expect(mockPaymentServiceClient.confirmPayment).toHaveBeenCalledWith('pi_test_123');
    });

    it('should handle payment failure during order creation', async () => {
      // Mock payment service failure
      mockPaymentServiceClient.createPaymentIntent.mockRejectedValueOnce(
        new Error('Payment service unavailable')
      );

      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 1 });

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(500);

      expect(orderResponse.body.success).toBe(false);
      expect(orderResponse.body.error).toContain('Payment processing failed');

      // Verify cart is not cleared on payment failure
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken);

      expect(cartResponse.body.data.items).toHaveLength(1);
    });
  });

  describe('Inventory Management Workflow', () => {
    it('should handle concurrent inventory updates', async () => {
      // Create multiple customers trying to order the same limited product
      const limitedProduct = await testFactory.createProduct(vendor1.id, {
        name: 'Limited Product',
        inventory: { quantity: 1, trackQuantity: true }
      });

      const customer2Id = 'customer-456';
      const authToken2 = 'Bearer token-2';

      // Mock second customer authentication
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

      // Both customers add the item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: limitedProduct.id, quantity: 1 });

      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken2)
        .send({ productId: limitedProduct.id, quantity: 1 });

      const orderData = {
        shippingAddress: {
          name: 'Customer',
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
          .send(orderData),
        request(app)
          .post('/api/v1/orders')
          .set('Authorization', authToken2)
          .send(orderData)
      ]);

      // One should succeed, one should fail
      const responses = [response1, response2].map(r =>
        r.status === 'fulfilled' ? r.value : null
      ).filter(Boolean);

      const successfulResponses = responses.filter(r => r.status === 201);
      const failedResponses = responses.filter(r => r.status === 400);

      expect(successfulResponses).toHaveLength(1);
      expect(failedResponses).toHaveLength(1);
      expect(failedResponses[0].body.error).toContain('Insufficient stock');
    });

    it('should handle inventory reservation expiration', async () => {
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 5 });

      // Reserve inventory with short expiration
      const reserveResponse = await request(app)
        .post('/api/v1/cart/reserve')
        .set('Authorization', authToken)
        .send({
          expirationMinutes: 1 // Very short for testing
        })
        .expect(200);

      const reservationId = reserveResponse.body.data.reservationId;

      // Wait for reservation to expire (in real scenario, this would be handled by background job)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Try to create order after reservation expires
      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        });

      // Should still succeed as inventory is available
      expect(orderResponse.status).toBe(201);

      // Manually release reservation for cleanup
      await request(app)
        .delete(`/api/v1/cart/reserve/${reservationId}`)
        .set('Authorization', authToken);
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should handle auth service unavailability gracefully', async () => {
      // Mock auth service failure
      mockAuthServiceClient.validateToken.mockRejectedValueOnce(
        new Error('Auth service unavailable')
      );

      const response = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle notification service failures gracefully', async () => {
      // Mock notification service failure
      mockNotificationServiceClient.sendOrderConfirmation.mockRejectedValueOnce(
        new Error('Notification service unavailable')
      );

      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 1 });

      // Order creation should still succeed even if notification fails
      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(201);

      expect(orderResponse.body.success).toBe(true);
    });

    it('should handle database transaction failures', async () => {
      // Mock database transaction failure
      vi.spyOn(prisma, '$transaction').mockRejectedValueOnce(
        new Error('Database transaction failed')
      );

      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({ productId: product1.id, quantity: 1 });

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(500);

      expect(orderResponse.body.success).toBe(false);
      expect(orderResponse.body.error).toBeDefined();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle high-volume cart operations', async () => {
      const operations = Array(50).fill(null).map((_, index) =>
        request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', authToken)
          .send({
            productId: index % 2 === 0 ? product1.id : product2.id,
            quantity: 1
          })
      );

      const responses = await Promise.all(operations);

      // Most operations should succeed (some might be rate limited)
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(40);
    });

    it('should handle large order creation efficiently', async () => {
      // Add many items to cart
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', authToken)
          .send({
            productId: i % 2 === 0 ? product1.id : product2.id,
            quantity: 1
          });
      }

      const startTime = Date.now();

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send({
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          paymentMethodId: 'pm_test_123'
        })
        .expect(201);

      const duration = Date.now() - startTime;

      expect(orderResponse.body.success).toBe(true);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});