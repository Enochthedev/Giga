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
import { PrismaClient } from '../../generated/prisma-client';
import { redisService } from '../../services/redis.service';

describe('Cart Integration Tests', () => {
  let _prisma: PrismaClient;
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

  beforeEach(() => {
    // Clean up test data
    await prisma.orderItem.deleteMany();
    await prisma.vendorOrder.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryReservation.deleteMany();
    await prisma.productInventory.deleteMany();
    await prisma.product.deleteMany();

    // Clear Redis test data
    const keys = await redisService.keys('test:*');
    if (keys.length > 0) {
      await redisService.del(keys);
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

  afterAll(() => {
    await prisma.$disconnect();
    await redisService.quit();
  });

  describe('GET /api/v1/cart', () => {
    it('should return empty cart for new customer', () => {
      const response = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });

    it('should return cart with items when cart exists', () => {
      // Add item to cart first
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        })
        .expect(200);

      const response = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].productId).toBe(product.id);
      expect(response.body.data.items[0].quantity).toBe(2);
      expect(response.body.data.total).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/cart/add', () => {
    it('should add item to cart successfully', () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].productId).toBe(product.id);
      expect(response.body.data.items[0].quantity).toBe(2);
    });

    it('should return 400 for invalid product ID', () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: 'invalid-product-id',
          quantity: 1,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Product not found');
    });

    it('should return 400 for insufficient stock', () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 100, // More than available stock
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Insufficient stock');
    });

    it('should return 400 for invalid quantity', () => {
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 0,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should update quantity if item already exists in cart', () => {
      // Add item first time
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        })
        .expect(200);

      // Add same item again
      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 3,
        })
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].quantity).toBe(5); // 2 + 3
    });
  });

  describe('PUT /api/v1/cart/items/:itemId', () => {
    let cartItem: any;

    beforeEach(() => {
      // Add item to cart first
      const addResponse = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
      cartItem = addResponse.body.data.items[0];
    });

    it('should update item quantity successfully', () => {
      const response = await request(app)
        .put(`/api/v1/cart/items/${cartItem.id}`)
        .set('Authorization', authToken)
        .send({
          quantity: 5,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items[0].quantity).toBe(5);
    });

    it('should return 404 for non-existent item', () => {
      const response = await request(app)
        .put('/api/v1/cart/items/non-existent-item')
        .set('Authorization', authToken)
        .send({
          quantity: 5,
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for insufficient stock', () => {
      const response = await request(app)
        .put(`/api/v1/cart/items/${cartItem.id}`)
        .set('Authorization', authToken)
        .send({
          quantity: 100, // More than available stock
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Insufficient stock');
    });
  });

  describe('DELETE /api/v1/cart/items/:itemId', () => {
    let cartItem: any;

    beforeEach(() => {
      // Add item to cart first
      const addResponse = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
      cartItem = addResponse.body.data.items[0];
    });

    it('should remove item from cart successfully', () => {
      const response = await request(app)
        .delete(`/api/v1/cart/items/${cartItem.id}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(0);
    });

    it('should return 404 for non-existent item', () => {
      const response = await request(app)
        .delete('/api/v1/cart/items/non-existent-item')
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/cart', () => {
    beforeEach(() => {
      // Add items to cart first
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
    });

    it('should clear entire cart successfully', () => {
      const response = await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify cart is empty
      const getResponse = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(200);

      expect(getResponse.body.data.items).toHaveLength(0);
    });
  });

  describe('GET /api/v1/cart/validate', () => {
    beforeEach(() => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
    });

    it('should validate cart successfully when all items are available', () => {
      const response = await request(app)
        .get('/api/v1/cart/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.validation.isValid).toBe(true);
      expect(response.body.data.validation.issues).toHaveLength(0);
    });

    it('should return validation issues when product becomes unavailable', () => {
      // Make product inactive
      await prisma.product.update({
        where: { id: product.id },
        data: { isActive: false },
      });

      const response = await request(app)
        .get('/api/v1/cart/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.validation.isValid).toBe(false);
      expect(response.body.data.validation.issues.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/cart/reserve', () => {
    beforeEach(() => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
    });

    it('should reserve inventory for cart items successfully', () => {
      const response = await request(app)
        .post('/api/v1/cart/reserve')
        .set('Authorization', authToken)
        .send({
          expirationMinutes: 30,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservationId).toBeDefined();
      expect(response.body.data.expiresInMinutes).toBe(30);
    });

    it('should return 400 for insufficient inventory', () => {
      // Update product inventory to have less stock
      await prisma.productInventory.update({
        where: { productId: product.id },
        data: { quantity: 1 },
      });

      const response = await request(app)
        .post('/api/v1/cart/reserve')
        .set('Authorization', authToken)
        .send({
          expirationMinutes: 30,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to reserve inventory');
    });
  });

  describe('GET /api/v1/cart/checkout/validate', () => {
    beforeEach(() => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
    });

    it('should validate cart for checkout successfully', () => {
      const response = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.validation.isValid).toBe(true);
      expect(response.body.data.validation.canProceedToCheckout).toBe(true);
      expect(response.body.data.validation.totalItems).toBe(2);
      expect(response.body.data.validation.totalValue).toBeGreaterThan(0);
    });

    it('should return validation issues for empty cart', () => {
      // Clear cart first
      await request(app).delete('/api/v1/cart').set('Authorization', authToken);

      const response = await request(app)
        .get('/api/v1/cart/checkout/validate')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.validation.isValid).toBe(false);
      expect(response.body.data.validation.canProceedToCheckout).toBe(false);
      expect(response.body.data.validation.totalItems).toBe(0);
    });
  });

  describe('POST /api/v1/cart/merge', () => {
    it('should merge anonymous cart with authenticated user cart', () => {
      const anonymousSessionId = 'anonymous-session-123';

      // Create anonymous cart in Redis
      const anonymousCart = {
        id: 'anonymous-cart',
        customerId: anonymousSessionId,
        items: [
          {
            id: 'item-1',
            productId: product.id,
            quantity: 1,
            price: product.price,
            addedAt: new Date().toISOString(),
          },
        ],
        subtotal: product.price,
        tax: product.price * 0.08,
        total: product.price * 1.08,
        updatedAt: new Date().toISOString(),
      };

      await redisService.set(
        `cart:${anonymousSessionId}`,
        JSON.stringify(anonymousCart),
        'EX',
        86400
      );

      const response = await request(app)
        .post('/api/v1/cart/merge')
        .set('Authorization', authToken)
        .send({
          anonymousSessionId,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].productId).toBe(product.id);
    });

    it('should return 400 for missing anonymous session ID', () => {
      const response = await request(app)
        .post('/api/v1/cart/merge')
        .set('Authorization', authToken)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/cart/inventory', () => {
    beforeEach(() => {
      // Add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 2,
        });
    });

    it('should return inventory status for cart items', () => {
      const response = await request(app)
        .get('/api/v1/cart/inventory')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inventoryStatuses).toHaveLength(1);
      expect(response.body.data.inventoryStatuses[0].productId).toBe(
        product.id
      );
      expect(response.body.data.inventoryStatuses[0].isAvailable).toBe(true);
      expect(response.body.data.summary.totalItems).toBe(1);
      expect(response.body.data.summary.availableItems).toBe(1);
      expect(response.body.data.summary.unavailableItems).toBe(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to cart operations', () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array(20)
        .fill(null)
        .map(() =>
          request(app).get('/api/v1/cart').set('Authorization', authToken)
        );

      const responses = await Promise.all(requests);

      // Some requests should be rate limited (429 status)
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', () => {
      // Mock database error
      vi.spyOn(prisma.product, 'findUnique').mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', authToken)
        .send({
          productId: product.id,
          quantity: 1,
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should handle Redis connection errors gracefully', () => {
      // Mock Redis error
      vi.spyOn(redisService, 'get').mockRejectedValueOnce(
        new Error('Redis connection failed')
      );

      const response = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', authToken)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
