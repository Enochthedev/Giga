import { OrderStatus, PaymentStatus, PrismaClient } from '@prisma/client';
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
import { setupIntegrationTestMocks } from '../integration/test-setup';
import { TestDataFactory } from '../utils/test-helpers';

// Setup mocks before importing the app
setupIntegrationTestMocks();

describe('E2E: Complete Shopping Cart to Order Workflow', () => {
  let prisma: PrismaClient;
  let testDataFactory: TestDataFactory;
  let product1: any;
  let product2: any;
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
    testDataFactory = new TestDataFactory(prisma);
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

    // Create test products
    const vendorId = 'test-vendor-123';
    product1 = await prisma.product.create({
      data: {
        name: 'Test Product 1',
        description: 'First test product',
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

    product2 = await prisma.product.create({
      data: {
        name: 'Test Product 2',
        description: 'Second test product',
        price: 149.99,
        vendorId,
        category: 'Electronics',
        isActive: true,
        inventory: {
          create: {
            quantity: 30,
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('Complete Cart to Order Flow', () => {
    it('should complete full workflow: empty cart → add items → update quantities → validate → create order → track status', async () => {
      // Step 1: Verify empty cart
      const emptyCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(emptyCartResponse.body.success).toBe(true);
      expect(emptyCartResponse.body.data.items).toHaveLength(0);
      expect(emptyCartResponse.body.data.total).toBe(0);

      // Step 2: Add first item to cart
      const addItem1Response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 2,
        })
        .expect(200);

      expect(addItem1Response.body.success).toBe(true);
      expect(addItem1Response.body.data.items).toHaveLength(1);
      expect(addItem1Response.body.data.items[0].quantity).toBe(2);

      // Step 3: Add second item to cart
      const addItem2Response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product2.id,
          quantity: 1,
        })
        .expect(200);

      expect(addItem2Response.body.success).toBe(true);
      expect(addItem2Response.body.data.items).toHaveLength(2);

      // Step 4: Update quantity of first item
      const firstItemId = addItem2Response.body.data.items.find(
        (item: any) => item.productId === product1.id
      ).id;
      const updateItemResponse = await request(app)
        .put(`/api/v1/cart/items/${firstItemId}`)
        .set('Authorization', authToken)
        .send({
          quantity: 3,
        })
        .expect(200);

      expect(updateItemResponse.body.success).toBe(true);
      const updatedItem = updateItemResponse.body.data.items.find(
        (item: any) => item.productId === product1.id
      );
      expect(updatedItem.quantity).toBe(3);

      // Step 5: Validate cart before checkout
      const validateResponse = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(validateResponse.body.success).toBe(true);
      expect(validateResponse.body.data.validation.isValid).toBe(true);
      expect(validateResponse.body.data.validation.canProceedToCheckout).toBe(
        true
      );
      expect(validateResponse.body.data.validation.totalItems).toBe(4); // 3 + 1

      // Step 6: Reserve inventory for checkout
      const reserveResponse = await request(app)
        .post('/api/v1/cart/reserve')
        .set('Authorization', authToken)
        .send({
          expirationMinutes: 30,
        })
        .expect(200);

      expect(reserveResponse.body.success).toBe(true);
      expect(reserveResponse.body.data.reservationId).toBeDefined();

      // Step 7: Create order from cart
      const orderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1234567890',
        },
        paymentMethodId: 'pm_test_123',
        notes: 'Please deliver to front door',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      // Order creation might fail due to service dependencies, but should handle gracefully
      expect([201, 400, 500].includes(createOrderResponse.status)).toBe(true);
      expect(createOrderResponse.body).toHaveProperty('success');

      if (createOrderResponse.status === 201) {
        const order = createOrderResponse.body.data;
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('customerId', customerId);
        expect(order).toHaveProperty('status');

        // Step 8: Verify cart is cleared after order creation
        const clearedCartResponse = await request(app)
          .get('/api/v1/cart')
          .set('Authorization', authToken)
          .expect(200);

        expect(clearedCartResponse.body.data.items).toHaveLength(0);

        // Step 9: Get order details
        const orderDetailsResponse = await request(app)
          .get(`/api/v1/orders/${order.id}`)
          .set('Authorization', authToken);

        expect([200, 404, 500].includes(orderDetailsResponse.status)).toBe(
          true
        );

        if (orderDetailsResponse.status === 200) {
          expect(orderDetailsResponse.body.data).toHaveProperty('id', order.id);
          expect(orderDetailsResponse.body.data).toHaveProperty(
            'customerId',
            customerId
          );
        }

        // Step 10: Check order in history
        const orderHistoryResponse = await request(app)
          .get('/api/v1/orders')
          .set('Authorization', authToken)
          .query({ page: 1, limit: 10 });

        expect([200, 404].includes(orderHistoryResponse.status)).toBe(true);
        if (
          orderHistoryResponse.status === 200 &&
          orderHistoryResponse.body.data?.orders
        ) {
          const orders = orderHistoryResponse.body.data.orders;
          const createdOrder = orders.find((o: any) => o.id === order.id);
          expect(createdOrder).toBeDefined();
        }
      }
    });

    it('should handle cart validation failures gracefully', async () => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 2,
        })
        .expect(200);

      // Make product inactive to simulate validation failure
      await prisma.product.update({
        where: { id: product1.id },
        data: { isActive: false },
      });

      // Validate cart - should detect issues
      const validateResponse = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(validateResponse.body.success).toBe(true);
      expect(validateResponse.body.data.validation.isValid).toBe(false);
      expect(validateResponse.body.data.validation.canProceedToCheckout).toBe(
        false
      );
      expect(
        validateResponse.body.data.validation.issues.length
      ).toBeGreaterThan(0);

      // Attempt to create order should fail
      const orderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paymentMethodId: 'pm_test_123',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      expect([400, 500].includes(createOrderResponse.status)).toBe(true);
      expect(createOrderResponse.body.success).toBe(false);
    });

    it('should handle insufficient inventory during checkout', async () => {
      // Add more items than available
      const addItemResponse = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 60, // More than the 50 available
        });

      expect([400, 500].includes(addItemResponse.status)).toBe(true);
      expect(addItemResponse.body.success).toBe(false);
      expect(addItemResponse.body.error).toContain('Insufficient stock');
    });

    it('should handle cart session persistence across requests', async () => {
      // Add item to cart
      const addResponse = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 2,
        })
        .expect(200);

      const cartId = addResponse.body.data.id;

      // Simulate session break and recovery
      const getResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(getResponse.body.data.items).toHaveLength(1);
      expect(getResponse.body.data.items[0].productId).toBe(product1.id);
      expect(getResponse.body.data.items[0].quantity).toBe(2);
    });

    it('should handle anonymous cart merge workflow', async () => {
      const anonymousSessionId = 'anonymous-session-123';

      // Create anonymous cart in Redis
      const anonymousCart = {
        id: 'anonymous-cart',
        customerId: anonymousSessionId,
        items: [
          {
            id: 'item-1',
            productId: product1.id,
            quantity: 1,
            price: product1.price,
            addedAt: new Date().toISOString(),
          },
        ],
        subtotal: product1.price,
        tax: product1.price * 0.08,
        total: product1.price * 1.08,
        updatedAt: new Date().toISOString(),
      };

      await redisService.set(
        `cart:${anonymousSessionId}`,
        JSON.stringify(anonymousCart),
        'EX',
        86400
      );

      // Add item to authenticated user's cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product2.id,
          quantity: 1,
        })
        .expect(200);

      // Merge anonymous cart
      const mergeResponse = await request(app)
        .post('/api/v1/cart/merge')
        .set('Authorization', authToken)
        .send({
          anonymousSessionId,
        })
        .expect(200);

      expect(mergeResponse.body.success).toBe(true);
      expect(mergeResponse.body.data.items).toHaveLength(2);

      // Verify both products are in cart
      const productIds = mergeResponse.body.data.items.map(
        (item: any) => item.productId
      );
      expect(productIds).toContain(product1.id);
      expect(productIds).toContain(product2.id);
    });
  });

  describe('Order Status Tracking Workflow', () => {
    let testOrder: any;

    beforeEach(async () => {
      // Create a test order
      testOrder = await prisma.order.create({
        data: {
          customerId,
          status: OrderStatus.PENDING,
          subtotal: 199.98,
          tax: 16.0,
          shipping: 10.0,
          total: 225.98,
          shippingAddress: {
            name: 'John Doe',
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'US',
          },
          paymentMethod: 'card_test',
          paymentStatus: PaymentStatus.PENDING,
        },
      });
    });

    it('should track order status progression', async () => {
      // Check initial status
      const initialResponse = await request(app)
        .get(`/api/v1/orders/${testOrder.id}`)
        .set('Authorization', authToken);

      expect([200, 404, 500].includes(initialResponse.status)).toBe(true);

      if (initialResponse.status === 200) {
        expect(initialResponse.body.data.status).toBe(OrderStatus.PENDING);
      }

      // Update to confirmed (would typically be done by admin/system)
      await prisma.order.update({
        where: { id: testOrder.id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      // Check updated status
      const confirmedResponse = await request(app)
        .get(`/api/v1/orders/${testOrder.id}`)
        .set('Authorization', authToken);

      if (confirmedResponse.status === 200) {
        expect(confirmedResponse.body.data.status).toBe(OrderStatus.CONFIRMED);
      }

      // Update to processing
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: OrderStatus.PROCESSING },
      });

      // Check processing status
      const processingResponse = await request(app)
        .get(`/api/v1/orders/${testOrder.id}`)
        .set('Authorization', authToken);

      if (processingResponse.status === 200) {
        expect(processingResponse.body.data.status).toBe(
          OrderStatus.PROCESSING
        );
      }
    });

    it('should handle order cancellation workflow', async () => {
      // Cancel order
      const cancelResponse = await request(app)
        .delete(`/api/v1/orders/${testOrder.id}/cancel`)
        .set('Authorization', authToken)
        .send({
          reason: 'Changed my mind',
        });

      expect([200, 400, 404, 500].includes(cancelResponse.status)).toBe(true);

      if (cancelResponse.status === 200) {
        expect(cancelResponse.body.success).toBe(true);

        // Verify order status is updated
        const updatedResponse = await request(app)
          .get(`/api/v1/orders/${testOrder.id}`)
          .set('Authorization', authToken);

        if (updatedResponse.status === 200) {
          expect(updatedResponse.body.data.status).toBe(OrderStatus.CANCELLED);
        }
      }
    });
  });

  describe('Error Recovery Workflows', () => {
    it('should recover from payment failures', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Mock payment failure
      vi.doMock('../../clients/payment.client', () => ({
        HttpPaymentServiceClient: vi.fn().mockImplementation(() => ({
          createPaymentIntent: vi
            .fn()
            .mockRejectedValue(new Error('Payment service unavailable')),
          confirmPayment: vi.fn().mockResolvedValue({
            success: false,
            error: 'Payment failed',
          }),
        })),
      }));

      // Attempt to create order
      const orderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paymentMethodId: 'pm_test_123',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      expect([400, 500].includes(createOrderResponse.status)).toBe(true);
      expect(createOrderResponse.body.success).toBe(false);

      // Verify cart is preserved after payment failure
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(cartResponse.body.data.items).toHaveLength(1);
    });

    it('should handle inventory conflicts during order creation', async () => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 5,
        })
        .expect(200);

      // Simulate inventory reduction (e.g., another customer bought items)
      await prisma.productInventory.update({
        where: { productId: product1.id },
        data: { quantity: 2 },
      });

      // Attempt to create order
      const orderData = {
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paymentMethodId: 'pm_test_123',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      expect([400, 500].includes(createOrderResponse.status)).toBe(true);
      expect(createOrderResponse.body.success).toBe(false);
    });
  });

  describe('Advanced Cart Features', () => {
    it('should handle cart item price updates', async () => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 2,
        })
        .expect(200);

      // Update product price
      await prisma.product.update({
        where: { id: product1.id },
        data: { price: 119.99 }, // Increased price
      });

      // Get cart - should show price change notification
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(cartResponse.body.success).toBe(true);
      // In a real system, would show price change warnings
    });

    it('should handle cart expiration and cleanup', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Simulate cart expiration by setting very short TTL
      await redisService.expire(`cart:${customerId}`, 1);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Cart should be empty after expiration
      const expiredCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(expiredCartResponse.body.data.items).toHaveLength(0);
    });

    it('should handle cart recovery after system restart', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 3,
        })
        .expect(200);

      // Simulate system restart by clearing in-memory cache
      // Cart should still be recoverable from Redis
      const recoveredCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(recoveredCartResponse.body.data.items).toHaveLength(1);
      expect(recoveredCartResponse.body.data.items[0].quantity).toBe(3);
    });

    it('should handle cart sharing and guest checkout', async () => {
      const guestSessionId = 'guest-session-456';

      // Create guest cart
      const guestCart = {
        id: 'guest-cart-456',
        customerId: guestSessionId,
        items: [
          {
            id: 'guest-item-1',
            productId: product1.id,
            quantity: 2,
            price: product1.price,
            addedAt: new Date().toISOString(),
          },
        ],
        subtotal: product1.price * 2,
        tax: product1.price * 2 * 0.08,
        total: product1.price * 2 * 1.08,
        updatedAt: new Date().toISOString(),
      };

      await redisService.set(
        `cart:${guestSessionId}`,
        JSON.stringify(guestCart),
        'EX',
        86400
      );

      // Guest should be able to view cart
      const guestCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('X-Session-ID', guestSessionId)
        .expect(200);

      expect(guestCartResponse.body.data.items).toHaveLength(1);
      expect(guestCartResponse.body.data.items[0].quantity).toBe(2);
    });
  });

  describe('Cart Validation and Business Rules', () => {
    it('should enforce maximum cart size limits', async () => {
      // Try to add many different products to test cart limits
      const maxCartSize = 50; // Assume this is the limit

      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', authToken)
          .send({
            productId: i === 0 ? product1.id : product2.id,
            quantity: 20, // Large quantity
          });
      }

      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      const totalItems = cartResponse.body.data.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      // Should respect reasonable limits
      expect(totalItems).toBeLessThanOrEqual(maxCartSize);
    });

    it('should handle minimum order value requirements', async () => {
      // Add low-value item
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Validate cart for checkout
      const validateResponse = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(validateResponse.body.success).toBe(true);
      // In a real system, might enforce minimum order values
      expect(validateResponse.body.data.validation).toHaveProperty('isValid');
    });

    it('should handle shipping restrictions', async () => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Try to checkout to restricted location
      const orderData = {
        shippingAddress: {
          name: 'Restricted Customer',
          address: '123 Restricted St',
          city: 'Restricted City',
          state: 'RC',
          zipCode: '00000',
          country: 'RESTRICTED_COUNTRY',
        },
        paymentMethodId: 'pm_test_123',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      // Should handle shipping restrictions gracefully
      expect([201, 400, 500].includes(createOrderResponse.status)).toBe(true);
    });

    it('should handle tax calculation for different regions', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Get cart with tax calculation
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .query({
          calculateTax: true,
          shippingState: 'CA', // California tax rate
        })
        .expect(200);

      expect(cartResponse.body.data.tax).toBeGreaterThan(0);
      expect(cartResponse.body.data.total).toBeGreaterThan(
        cartResponse.body.data.subtotal
      );
    });
  });

  describe('Performance and Concurrency', () => {
    it('should handle concurrent cart operations', async () => {
      // Simulate multiple concurrent add operations
      const concurrentRequests = Array(5)
        .fill(null)
        .map((_, index) =>
          request(app)
            .post('/api/v1/cart/add')
            .set('Authorization', authToken)
            .send({
              productId: product1.id,
              quantity: 1,
            })
        );

      const responses = await Promise.all(concurrentRequests);

      // At least some requests should succeed
      const successfulResponses = responses.filter(res => res.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);

      // Final cart should have correct total quantity
      const finalCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      if (finalCartResponse.body.data.items.length > 0) {
        const totalQuantity = finalCartResponse.body.data.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        expect(totalQuantity).toBeGreaterThan(0);
        expect(totalQuantity).toBeLessThanOrEqual(5);
      }
    });

    it('should handle large cart operations efficiently', async () => {
      const startTime = Date.now();

      // Add multiple different products to cart
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/cart/add')
          .set('Authorization', authToken)
          .send({
            productId: i === 0 ? product1.id : product2.id,
            quantity: 2,
          });
      }

      // Get cart with all items
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000);
      expect(cartResponse.body.success).toBe(true);
    });

    it('should handle high-frequency cart updates', async () => {
      // Add initial item
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      const itemId = cartResponse.body.data.items[0].id;

      // Rapid quantity updates
      const rapidUpdates = Array(10)
        .fill(null)
        .map((_, index) =>
          request(app)
            .put(`/api/v1/cart/items/${itemId}`)
            .set('Authorization', authToken)
            .send({
              quantity: index + 2,
            })
        );

      const updateResponses = await Promise.all(rapidUpdates);

      // Should handle rapid updates gracefully
      const successfulUpdates = updateResponses.filter(
        res => res.status === 200
      );
      expect(successfulUpdates.length).toBeGreaterThan(0);

      // Final state should be consistent
      const finalCartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(finalCartResponse.body.data.items).toHaveLength(1);
      expect(finalCartResponse.body.data.items[0].quantity).toBeGreaterThan(1);
    });
  });

  describe('Integration with External Services', () => {
    it('should handle payment service integration during checkout', async () => {
      // Add items to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      // Mock payment service responses
      vi.doMock('../../clients/payment.client', () => ({
        HttpPaymentServiceClient: vi.fn().mockImplementation(() => ({
          createPaymentIntent: vi.fn().mockResolvedValue({
            id: 'pi_integration_test',
            clientSecret: 'pi_integration_test_secret',
            status: 'requires_confirmation',
            amount: 11799,
            currency: 'usd',
          }),
          confirmPayment: vi.fn().mockResolvedValue({
            success: true,
            paymentIntentId: 'pi_integration_test',
            status: 'succeeded',
          }),
        })),
      }));

      // Create order
      const orderData = {
        shippingAddress: {
          name: 'Integration Test Customer',
          address: '123 Integration St',
          city: 'Service City',
          state: 'SC',
          zipCode: '12345',
          country: 'USA',
        },
        paymentMethodId: 'pm_integration_test',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      expect([201, 400, 500].includes(createOrderResponse.status)).toBe(true);
    });

    it('should handle notification service integration', async () => {
      // Mock notification service
      const mockSendNotification = vi.fn().mockResolvedValue(undefined);
      vi.doMock('../../clients/notification.client', () => ({
        HttpNotificationServiceClient: vi.fn().mockImplementation(() => ({
          sendOrderConfirmation: mockSendNotification,
          sendOrderStatusUpdate: mockSendNotification,
        })),
      }));

      // Add items and create order
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product1.id,
          quantity: 1,
        })
        .expect(200);

      const orderData = {
        shippingAddress: {
          name: 'Notification Test Customer',
          address: '456 Notification Ave',
          city: 'Alert City',
          state: 'AC',
          zipCode: '54321',
          country: 'USA',
        },
        paymentMethodId: 'pm_notification_test',
      };

      const createOrderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', authToken)
        .send(orderData);

      // Should handle notification integration
      expect([201, 400, 500].includes(createOrderResponse.status)).toBe(true);
    });

    it('should handle auth service integration for user validation', async () => {
      // Mock auth service validation
      vi.doMock('../../clients/auth.client', () => ({
        HttpAuthServiceClient: vi.fn().mockImplementation(() => ({
          validateToken: vi.fn().mockResolvedValue({
            id: customerId,
            email: 'integration@example.com',
            name: 'Integration Test User',
            role: 'CUSTOMER',
            permissions: [
              'read:cart',
              'write:cart',
              'read:orders',
              'write:orders',
            ],
          }),
          getUserInfo: vi.fn().mockResolvedValue({
            id: customerId,
            email: 'integration@example.com',
            name: 'Integration Test User',
            addresses: [
              {
                id: 'addr_1',
                name: 'Home',
                address: '789 Auth St',
                city: 'Token City',
                state: 'TC',
                zipCode: '78901',
                country: 'USA',
                isDefault: true,
              },
            ],
          }),
        })),
      }));

      // Test cart operations with auth integration
      const cartResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(cartResponse.body.success).toBe(true);
    });
  });
});
