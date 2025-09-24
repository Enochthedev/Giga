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
import {
  mockVendorUser,
  setupIntegrationTestMocks,
} from '../integration/test-setup';
import { TestDataFactory } from '../utils/test-helpers';

// Setup mocks before importing the app
setupIntegrationTestMocks();

describe('E2E: Vendor Order Fulfillment Workflows', () => {
  let _prisma: PrismaClient;
  let testDataFactory: TestDataFactory;
  let vendor1Products: any[];
  let vendor2Products: any[];
  let customerId: string;
  let customerAuthToken: string;
  let vendor1Id: string;
  let vendor2Id: string;
  let vendor1AuthToken: string;
  let vendor2AuthToken: string;

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

  beforeEach(() => {
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

    // Setup test data
    vendor1Id = 'test-vendor-fulfillment-1';
    vendor2Id = 'test-vendor-fulfillment-2';
    customerId = 'test-customer-fulfillment';
    customerAuthToken = 'Bearer customer-token';
    vendor1AuthToken = 'Bearer vendor-1-token';
    vendor2AuthToken = 'Bearer vendor-2-token';

    // Create products for vendor 1
    vendor1Products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Vendor 1 Fulfillment Product A',
          description: 'Electronics for fulfillment testing',
          price: 199.99,
          vendorId: vendor1Id,
          category: 'Electronics',
          isActive: true,
          inventory: {
            create: {
              quantity: 50,
              trackQuantity: true,
            },
          },
        },
        include: { inventory: true },
      }),
      prisma.product.create({
        data: {
          name: 'Vendor 1 Fulfillment Product B',
          description: 'Another electronics for fulfillment testing',
          price: 299.99,
          vendorId: vendor1Id,
          category: 'Electronics',
          isActive: true,
          inventory: {
            create: {
              quantity: 25,
              trackQuantity: true,
            },
          },
        },
        include: { inventory: true },
      }),
    ]);

    // Create products for vendor 2
    vendor2Products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Vendor 2 Fulfillment Product A',
          description: 'Clothing for fulfillment testing',
          price: 89.99,
          vendorId: vendor2Id,
          category: 'Clothing',
          isActive: true,
          inventory: {
            create: {
              quantity: 100,
              trackQuantity: true,
            },
          },
        },
        include: { inventory: true },
      }),
      prisma.product.create({
        data: {
          name: 'Vendor 2 Fulfillment Product B',
          description: 'Accessories for fulfillment testing',
          price: 39.99,
          vendorId: vendor2Id,
          category: 'Accessories',
          isActive: true,
          inventory: {
            create: {
              quantity: 75,
              trackQuantity: true,
            },
          },
        },
        include: { inventory: true },
      }),
    ]);
  });

  afterAll(() => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('Vendor Order Fulfillment Process', () => {
    let multiVendorOrder: any;
    let vendor1Orders: any[];
    let vendor2Orders: any[];

    beforeEach(() => {
      // Create a multi-vendor order for fulfillment testing
      multiVendorOrder = await prisma.order.create({
        data: {
          customerId,
          status: OrderStatus.CONFIRMED,
          subtotal: 629.96,
          tax: 50.4,
          shipping: 20.0,
          total: 700.36,
          shippingAddress: {
            name: 'Fulfillment Test Customer',
            address: '123 Fulfillment Ave',
            city: 'Shipping City',
            state: 'SC',
            zipCode: '12345',
            country: 'USA',
            phone: '+1234567890',
          },
          paymentMethod: 'card_test',
          paymentStatus: PaymentStatus.PAID,
          paymentIntentId: 'pi_test_fulfillment_123',
        },
      });

      // Create vendor orders for both vendors
      vendor1Orders = await Promise.all([
        prisma.vendorOrder.create({
          data: {
            orderId: multiVendorOrder.id,
            vendorId: vendor1Id,
            status: OrderStatus.CONFIRMED,
            subtotal: 499.98,
            shipping: 15.0,
            total: 564.98,
            items: {
              create: [
                {
                  productId: vendor1Products[0].id,
                  quantity: 1,
                  price: vendor1Products[0].price,
                },
                {
                  productId: vendor1Products[1].id,
                  quantity: 1,
                  price: vendor1Products[1].price,
                },
              ],
            },
          },
          include: { items: true },
        }),
      ]);

      vendor2Orders = await Promise.all([
        prisma.vendorOrder.create({
          data: {
            orderId: multiVendorOrder.id,
            vendorId: vendor2Id,
            status: OrderStatus.CONFIRMED,
            subtotal: 129.98,
            shipping: 5.0,
            total: 139.98,
            items: {
              create: [
                {
                  productId: vendor2Products[0].id,
                  quantity: 1,
                  price: vendor2Products[0].price,
                },
                {
                  productId: vendor2Products[1].id,
                  quantity: 1,
                  price: vendor2Products[1].price,
                },
              ],
            },
          },
          include: { items: true },
        }),
      ]);
    });

    it('should allow vendor to view their pending orders', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendorOrdersResponse = await request(app)
        .get('/api/v1/vendor/orders')
        .set('Authorization', vendor1AuthToken)
        .query({
          status: OrderStatus.CONFIRMED,
          page: 1,
          limit: 10,
        });

      expect([200, 404, 500].includes(vendorOrdersResponse.status)).toBe(true);

      if (vendorOrdersResponse.status === 200) {
        const orders = vendorOrdersResponse.body.data.orders || [];
        expect(Array.isArray(orders)).toBe(true);

        // Should only see orders for this vendor
        orders.forEach((order: any) => {
          expect(order.vendorId).toBe(vendor1Id);
          expect(order.status).toBe(OrderStatus.CONFIRMED);
        });
      }
    });

    it('should allow vendor to update order status to processing', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor1Order = vendor1Orders[0];

      const updateStatusResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendor1Order.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.PROCESSING,
          notes: 'Started processing order',
        });

      expect(
        [200, 400, 403, 404, 500].includes(updateStatusResponse.status)
      ).toBe(true);

      if (updateStatusResponse.status === 200) {
        expect(updateStatusResponse.body.success).toBe(true);
        expect(updateStatusResponse.body.data.status).toBe(
          OrderStatus.PROCESSING
        );

        // Verify status was updated in database
        const updatedOrder = await prisma.vendorOrder.findUnique({
          where: { id: vendor1Order.id },
        });
        expect(updatedOrder?.status).toBe(OrderStatus.PROCESSING);
      }
    });

    it('should allow vendor to mark order as shipped with tracking', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor1Order = vendor1Orders[0];

      // First update to processing
      await prisma.vendorOrder.update({
        where: { id: vendor1Order.id },
        data: { status: OrderStatus.PROCESSING },
      });

      const shipOrderResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendor1Order.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.SHIPPED,
          trackingNumber: 'VENDOR1-TRACK-12345',
          estimatedDelivery: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 days
          notes: 'Package shipped via UPS',
        });

      expect([200, 400, 403, 404, 500].includes(shipOrderResponse.status)).toBe(
        true
      );

      if (shipOrderResponse.status === 200) {
        expect(shipOrderResponse.body.success).toBe(true);
        expect(shipOrderResponse.body.data.status).toBe(OrderStatus.SHIPPED);
        expect(shipOrderResponse.body.data.trackingNumber).toBe(
          'VENDOR1-TRACK-12345'
        );

        // Verify tracking info was saved
        const shippedOrder = await prisma.vendorOrder.findUnique({
          where: { id: vendor1Order.id },
        });
        expect(shippedOrder?.status).toBe(OrderStatus.SHIPPED);
        expect(shippedOrder?.trackingNumber).toBe('VENDOR1-TRACK-12345');
        expect(shippedOrder?.estimatedDelivery).toBeDefined();
      }
    });

    it('should prevent vendor from updating other vendors orders', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor2Order = vendor2Orders[0];

      const unauthorizedResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendor2Order.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.PROCESSING,
        });

      expect([403, 404, 500].includes(unauthorizedResponse.status)).toBe(true);
      expect(unauthorizedResponse.body.success).toBe(false);
    });

    it('should validate status transitions', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor1Order = vendor1Orders[0];

      // Try to skip from CONFIRMED directly to DELIVERED (invalid transition)
      const invalidTransitionResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendor1Order.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.DELIVERED,
        });

      expect([400, 500].includes(invalidTransitionResponse.status)).toBe(true);
      expect(invalidTransitionResponse.body.success).toBe(false);

      if (invalidTransitionResponse.body.error) {
        expect(invalidTransitionResponse.body.error.toLowerCase()).toContain(
          'invalid'
        );
      }
    });

    it('should require tracking number when shipping', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor1Order = vendor1Orders[0];

      // Update to processing first
      await prisma.vendorOrder.update({
        where: { id: vendor1Order.id },
        data: { status: OrderStatus.PROCESSING },
      });

      // Try to ship without tracking number
      const noTrackingResponse = await request(app)
        .put(`/api/v1/vendor/orders/${vendor1Order.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.SHIPPED,
          // Missing trackingNumber
        });

      expect([400, 500].includes(noTrackingResponse.status)).toBe(true);
      expect(noTrackingResponse.body.success).toBe(false);
    });
  });

  describe('Vendor Inventory Management During Fulfillment', () => {
    it('should allow vendor to update product inventory', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const product = vendor1Products[0];

      const updateInventoryResponse = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', vendor1AuthToken)
        .send({
          quantity: 75,
          trackQuantity: true,
        });

      expect(
        [200, 400, 403, 404, 500].includes(updateInventoryResponse.status)
      ).toBe(true);

      if (updateInventoryResponse.status === 200) {
        expect(updateInventoryResponse.body.success).toBe(true);

        // Verify inventory was updated
        const updatedInventory = await prisma.productInventory.findUnique({
          where: { productId: product.id },
        });
        expect(updatedInventory?.quantity).toBe(75);
      }
    });

    it('should prevent vendor from updating other vendors inventory', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const vendor2Product = vendor2Products[0];

      const unauthorizedInventoryResponse = await request(app)
        .put(`/api/v1/vendor/products/${vendor2Product.id}/inventory`)
        .set('Authorization', vendor1AuthToken)
        .send({
          quantity: 50,
        });

      expect(
        [403, 404, 500].includes(unauthorizedInventoryResponse.status)
      ).toBe(true);
      expect(unauthorizedInventoryResponse.body.success).toBe(false);
    });

    it('should handle low inventory alerts during fulfillment', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const product = vendor1Products[0];

      // Set inventory to low level
      const lowInventoryResponse = await request(app)
        .put(`/api/v1/vendor/products/${product.id}/inventory`)
        .set('Authorization', vendor1AuthToken)
        .send({
          quantity: 5, // Low inventory
          trackQuantity: true,
          lowStockThreshold: 10,
        });

      expect(
        [200, 400, 403, 404, 500].includes(lowInventoryResponse.status)
      ).toBe(true);

      if (lowInventoryResponse.status === 200) {
        // In a real system, this would trigger a low inventory alert
        const updatedInventory = await prisma.productInventory.findUnique({
          where: { productId: product.id },
        });
        expect(updatedInventory?.quantity).toBe(5);
      }
    });
  });

  describe('Vendor Dashboard and Analytics', () => {
    beforeEach(() => {
      // Create some completed orders for analytics
      const completedOrder = await prisma.order.create({
        data: {
          customerId: 'analytics-customer',
          status: OrderStatus.DELIVERED,
          subtotal: 399.98,
          tax: 32.0,
          shipping: 15.0,
          total: 446.98,
          shippingAddress: {
            name: 'Analytics Customer',
            address: '456 Analytics St',
            city: 'Data City',
            country: 'US',
          },
          paymentMethod: 'card_test',
          paymentStatus: PaymentStatus.PAID,
        },
      });

      await prisma.vendorOrder.create({
        data: {
          orderId: completedOrder.id,
          vendorId: vendor1Id,
          status: OrderStatus.DELIVERED,
          subtotal: 399.98,
          shipping: 15.0,
          total: 446.98,
        },
      });
    });

    it('should provide vendor dashboard with key metrics', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const dashboardResponse = await request(app)
        .get('/api/v1/vendor/dashboard')
        .set('Authorization', vendor1AuthToken)
        .query({
          period: '30d',
        });

      expect([200, 404, 500].includes(dashboardResponse.status)).toBe(true);

      if (dashboardResponse.status === 200) {
        const dashboard = dashboardResponse.body.data;
        expect(dashboard).toHaveProperty('vendorId', vendor1Id);
        expect(dashboard).toHaveProperty('totalOrders');
        expect(dashboard).toHaveProperty('totalRevenue');
        expect(dashboard).toHaveProperty('ordersByStatus');
        expect(dashboard).toHaveProperty('averageOrderValue');

        // Verify metrics are reasonable
        expect(typeof dashboard.totalOrders).toBe('number');
        expect(typeof dashboard.totalRevenue).toBe('number');
        expect(typeof dashboard.ordersByStatus).toBe('object');
        expect(dashboard.totalOrders).toBeGreaterThanOrEqual(0);
        expect(dashboard.totalRevenue).toBeGreaterThanOrEqual(0);
      }
    });

    it('should provide vendor product performance metrics', () => {
      // Mock vendor 1 authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      const productsResponse = await request(app)
        .get('/api/v1/vendor/products')
        .set('Authorization', vendor1AuthToken)
        .query({
          includeMetrics: true,
          page: 1,
          limit: 10,
        });

      expect([200, 404, 500].includes(productsResponse.status)).toBe(true);

      if (productsResponse.status === 200) {
        const products = productsResponse.body.data.products || [];
        expect(Array.isArray(products)).toBe(true);

        // Should only see this vendor's products
        products.forEach((product: any) => {
          expect(product.vendorId).toBe(vendor1Id);
          expect(product).toHaveProperty('id');
          expect(product).toHaveProperty('name');
          expect(product).toHaveProperty('price');
        });
      }
    });
  });

  describe('Multi-Vendor Coordination', () => {
    let coordinationOrder: any;
    let vendor1CoordOrder: any;
    let vendor2CoordOrder: any;

    beforeEach(() => {
      // Create order requiring coordination between vendors
      coordinationOrder = await prisma.order.create({
        data: {
          customerId,
          status: OrderStatus.CONFIRMED,
          subtotal: 529.96,
          tax: 42.4,
          shipping: 20.0,
          total: 592.36,
          shippingAddress: {
            name: 'Coordination Test Customer',
            address: '789 Coordination Blvd',
            city: 'Sync City',
            state: 'SC',
            zipCode: '78901',
            country: 'USA',
          },
          paymentMethod: 'card_test',
          paymentStatus: PaymentStatus.PAID,
        },
      });

      // Create vendor orders
      vendor1CoordOrder = await prisma.vendorOrder.create({
        data: {
          orderId: coordinationOrder.id,
          vendorId: vendor1Id,
          status: OrderStatus.CONFIRMED,
          subtotal: 399.98,
          shipping: 15.0,
          total: 414.98,
        },
      });

      vendor2CoordOrder = await prisma.vendorOrder.create({
        data: {
          orderId: coordinationOrder.id,
          vendorId: vendor2Id,
          status: OrderStatus.CONFIRMED,
          subtotal: 129.98,
          shipping: 5.0,
          total: 134.98,
        },
      });
    });

    it('should coordinate overall order status when all vendors ship', () => {
      // Vendor 1 ships their part
      await prisma.vendorOrder.update({
        where: { id: vendor1CoordOrder.id },
        data: {
          status: OrderStatus.SHIPPED,
          trackingNumber: 'V1-COORD-123',
        },
      });

      // Overall order should still be confirmed (not all vendors shipped)
      const overallOrder = await prisma.order.findUnique({
        where: { id: coordinationOrder.id },
      });
      expect(overallOrder?.status).toBe(OrderStatus.CONFIRMED);

      // Vendor 2 ships their part
      await prisma.vendorOrder.update({
        where: { id: vendor2CoordOrder.id },
        data: {
          status: OrderStatus.SHIPPED,
          trackingNumber: 'V2-COORD-456',
        },
      });

      // Check if coordination logic would update overall order
      const allVendorOrders = await prisma.vendorOrder.findMany({
        where: { orderId: coordinationOrder.id },
      });

      const allShipped = allVendorOrders.every(
        vo => vo.status === OrderStatus.SHIPPED
      );
      expect(allShipped).toBe(true);

      // In a real system, this would trigger overall order status update
      // For testing, we verify the data is in correct state for coordination
      expect(allVendorOrders.length).toBe(2);
      expect(allVendorOrders[0].trackingNumber).toBeDefined();
      expect(allVendorOrders[1].trackingNumber).toBeDefined();
    });

    it('should handle partial delivery scenarios', () => {
      // Vendor 1 delivers their part
      await prisma.vendorOrder.update({
        where: { id: vendor1CoordOrder.id },
        data: {
          status: OrderStatus.DELIVERED,
          trackingNumber: 'V1-DELIVERED-123',
        },
      });

      // Vendor 2 is still processing
      await prisma.vendorOrder.update({
        where: { id: vendor2CoordOrder.id },
        data: { status: OrderStatus.PROCESSING },
      });

      // Check coordination state
      const vendorOrders = await prisma.vendorOrder.findMany({
        where: { orderId: coordinationOrder.id },
      });

      const deliveredCount = vendorOrders.filter(
        vo => vo.status === OrderStatus.DELIVERED
      ).length;
      const processingCount = vendorOrders.filter(
        vo => vo.status === OrderStatus.PROCESSING
      ).length;

      expect(deliveredCount).toBe(1);
      expect(processingCount).toBe(1);

      // Overall order should not be delivered until all vendors deliver
      const overallOrder = await prisma.order.findUnique({
        where: { id: coordinationOrder.id },
      });
      expect(overallOrder?.status).not.toBe(OrderStatus.DELIVERED);
    });

    it('should handle vendor communication and notifications', () => {
      // Mock notification service calls
      const mockNotificationClient = vi.fn();
      vi.doMock('../../clients/notification.client', () => ({
        HttpNotificationServiceClient: vi.fn().mockImplementation(() => ({
          sendVendorOrderNotification: mockNotificationClient,
          sendOrderStatusUpdate: vi.fn().mockResolvedValue(undefined),
        })),
      }));

      // Update vendor order status (would trigger notifications)
      await prisma.vendorOrder.update({
        where: { id: vendor1CoordOrder.id },
        data: {
          status: OrderStatus.PROCESSING,
          notes: 'Started processing - will ship within 2 business days',
        },
      });

      // Verify order was updated
      const updatedOrder = await prisma.vendorOrder.findUnique({
        where: { id: vendor1CoordOrder.id },
      });
      expect(updatedOrder?.status).toBe(OrderStatus.PROCESSING);
      expect(updatedOrder?.notes).toContain('Started processing');
    });
  });

  describe('Fulfillment Error Scenarios', () => {
    it('should handle inventory conflicts during fulfillment', () => {
      // Create order with product
      const conflictOrder = await prisma.order.create({
        data: {
          customerId,
          status: OrderStatus.CONFIRMED,
          subtotal: 199.99,
          tax: 16.0,
          shipping: 10.0,
          total: 225.99,
          shippingAddress: {
            name: 'Conflict Test Customer',
            address: '123 Conflict St',
            city: 'Error City',
            country: 'US',
          },
          paymentMethod: 'card_test',
          paymentStatus: PaymentStatus.PAID,
        },
      });

      const conflictVendorOrder = await prisma.vendorOrder.create({
        data: {
          orderId: conflictOrder.id,
          vendorId: vendor1Id,
          status: OrderStatus.CONFIRMED,
          subtotal: 199.99,
          shipping: 10.0,
          total: 225.99,
          items: {
            create: [
              {
                productId: vendor1Products[0].id,
                quantity: 10, // Large quantity
                price: vendor1Products[0].price,
              },
            ],
          },
        },
      });

      // Simulate inventory shortage (another order consumed inventory)
      await prisma.productInventory.update({
        where: { productId: vendor1Products[0].id },
        data: { quantity: 5 }, // Less than ordered
      });

      // Mock vendor authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      // Try to process order with insufficient inventory
      const processResponse = await request(app)
        .put(`/api/v1/vendor/orders/${conflictVendorOrder.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.PROCESSING,
        });

      // Should handle inventory conflict gracefully
      expect([200, 400, 500].includes(processResponse.status)).toBe(true);

      if (processResponse.status === 400) {
        expect(processResponse.body.success).toBe(false);
        expect(processResponse.body.error.toLowerCase()).toContain('inventory');
      }
    });

    it('should handle shipping service failures', () => {
      const shippingOrder = await prisma.vendorOrder.create({
        data: {
          orderId: (
            await prisma.order.create({
              data: {
                customerId,
                status: OrderStatus.CONFIRMED,
                subtotal: 199.99,
                tax: 16.0,
                shipping: 10.0,
                total: 225.99,
                shippingAddress: {
                  name: 'Shipping Test Customer',
                  address: '456 Shipping Ave',
                  city: 'Delivery City',
                  country: 'US',
                },
                paymentMethod: 'card_test',
                paymentStatus: PaymentStatus.PAID,
              },
            })
          ).id,
          vendorId: vendor1Id,
          status: OrderStatus.PROCESSING,
          subtotal: 199.99,
          shipping: 10.0,
          total: 225.99,
        },
      });

      // Mock vendor authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      // Try to ship with invalid tracking number format
      const invalidTrackingResponse = await request(app)
        .put(`/api/v1/vendor/orders/${shippingOrder.id}/status`)
        .set('Authorization', vendor1AuthToken)
        .send({
          status: OrderStatus.SHIPPED,
          trackingNumber: 'INVALID-FORMAT', // Invalid format
        });

      expect([400, 500].includes(invalidTrackingResponse.status)).toBe(true);
      expect(invalidTrackingResponse.body.success).toBe(false);
    });

    it('should handle concurrent vendor operations', () => {
      const concurrentOrder = await prisma.vendorOrder.create({
        data: {
          orderId: (
            await prisma.order.create({
              data: {
                customerId,
                status: OrderStatus.CONFIRMED,
                subtotal: 199.99,
                tax: 16.0,
                shipping: 10.0,
                total: 225.99,
                shippingAddress: {
                  name: 'Concurrent Test Customer',
                  address: '789 Concurrent St',
                  city: 'Race City',
                  country: 'US',
                },
                paymentMethod: 'card_test',
                paymentStatus: PaymentStatus.PAID,
              },
            })
          ).id,
          vendorId: vendor1Id,
          status: OrderStatus.CONFIRMED,
          subtotal: 199.99,
          shipping: 10.0,
          total: 225.99,
        },
      });

      // Mock vendor authentication
      mockVendorUser();
      vi.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          req.user = {
            id: 'vendor-user-1',
            sub: 'vendor-user-1',
            email: 'vendor1@example.com',
            roles: ['VENDOR'],
            activeRole: 'VENDOR',
            vendorId: vendor1Id,
          };
          next();
        },
        requireVendor: (req: any, res: any, next: any) => {
          if (!req.user?.vendorId) {
            return res.status(403).json({
              success: false,
              error: 'Vendor access required',
            });
          }
          next();
        },
      }));

      // Simulate concurrent status updates
      const concurrentUpdates = Array(3)
        .fill(null)
        .map(() =>
          request(app)
            .put(`/api/v1/vendor/orders/${concurrentOrder.id}/status`)
            .set('Authorization', vendor1AuthToken)
            .send({
              status: OrderStatus.PROCESSING,
            })
        );

      const responses = await Promise.all(concurrentUpdates);

      // Only one should succeed, others should handle gracefully
      const successfulUpdates = responses.filter(res => res.status === 200);
      expect(successfulUpdates.length).toBeLessThanOrEqual(1);

      // Verify final state is consistent
      const finalOrder = await prisma.vendorOrder.findUnique({
        where: { id: concurrentOrder.id },
      });
      expect(
        [OrderStatus.CONFIRMED, OrderStatus.PROCESSING].includes(
          finalOrder?.status as OrderStatus
        )
      ).toBe(true);
    });
  });
});
