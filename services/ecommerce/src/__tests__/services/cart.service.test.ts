import { CartService } from '@/services/cart.service';
import { prisma } from '@tests/setup';
import { TestDataFactory, createMockRedisClient } from '@tests/utils/test-helpers';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CartService', () => {
  let cartService: CartService;
  let testFactory: TestDataFactory;
  let mockRedis: ReturnType<typeof createMockRedisClient>;

  beforeEach(() => {
    testFactory = new TestDataFactory(prisma);
    mockRedis = createMockRedisClient();
    cartService = new CartService(mockRedis as any, prisma);
  });

  describe('getCart', () => {
    it('should return empty cart for new customer', async () => {
      const customerId = 'customer-1';
      mockRedis.get.mockResolvedValue(null);

      const cart = await cartService.getCart(customerId);

      expect(cart).toEqual({
        id: expect.any(String),
        customerId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        updatedAt: expect.any(String)
      });
      expect(mockRedis.get).toHaveBeenCalledWith(`cart:${customerId}`);
    });

    it('should return existing cart from Redis', async () => {
      const customerId = 'customer-1';
      const existingCart = testFactory.createCart(customerId, [
        testFactory.createCartItem('product-1', 2)
      ]);

      mockRedis.get.mockResolvedValue(JSON.stringify(existingCart));

      const cart = await cartService.getCart(customerId);

      expect(cart).toEqual(existingCart);
    });

    it('should enrich cart items with product data', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id);

      const cartWithItem = testFactory.createCart(customerId, [
        testFactory.createCartItem(product.id, 1)
      ]);

      mockRedis.get.mockResolvedValue(JSON.stringify(cartWithItem));

      const cart = await cartService.getCart(customerId);

      expect(cart.items[0]).toMatchObject({
        productId: product.id,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          isActive: true
        }
      });
    });
  });

  describe('addItem', () => {
    it('should add new item to empty cart', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, { price: 50.00 });

      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');

      const cart = await cartService.addItem(customerId, product.id, 2);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toMatchObject({
        productId: product.id,
        quantity: 2,
        price: 50.00
      });
      expect(cart.subtotal).toBe(100.00);
      expect(cart.total).toBe(108.00); // Including 8% tax
      expect(mockRedis.set).toHaveBeenCalledWith(
        `cart:${customerId}`,
        expect.any(String),
        { EX: 86400 } // 24 hours
      );
    });

    it('should update quantity for existing item', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, { price: 50.00 });

      const existingCart = testFactory.createCart(customerId, [
        testFactory.createCartItem(product.id, 1)
      ]);

      mockRedis.get.mockResolvedValue(JSON.stringify(existingCart));
      mockRedis.set.mockResolvedValue('OK');

      const cart = await cartService.addItem(customerId, product.id, 2);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    it('should throw error for inactive product', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, { isActive: false });

      mockRedis.get.mockResolvedValue(null);

      await expect(cartService.addItem(customerId, product.id, 1))
        .rejects.toThrow('Product is not available');
    });

    it('should throw error for insufficient inventory', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 5, trackQuantity: true }
      });

      mockRedis.get.mockResolvedValue(null);

      await expect(cartService.addItem(customerId, product.id, 10))
        .rejects.toThrow('Insufficient inventory');
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id);

      const cartItem = testFactory.createCartItem(product.id, 2);
      const existingCart = testFactory.createCart(customerId, [cartItem]);

      mockRedis.get.mockResolvedValue(JSON.stringify(existingCart));
      mockRedis.set.mockResolvedValue('OK');

      const cart = await cartService.updateItemQuantity(customerId, cartItem.id, 5);

      expect(cart.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id);

      const cartItem = testFactory.createCartItem(product.id, 2);
      const existingCart = testFactory.createCart(customerId, [cartItem]);

      mockRedis.get.mockResolvedValue(JSON.stringify(existingCart));
      mockRedis.set.mockResolvedValue('OK');

      const cart = await cartService.updateItemQuantity(customerId, cartItem.id, 0);

      expect(cart.items).toHaveLength(0);
    });

    it('should throw error for non-existent item', async () => {
      const customerId = 'customer-1';
      mockRedis.get.mockResolvedValue(JSON.stringify(testFactory.createCart(customerId)));

      await expect(cartService.updateItemQuantity(customerId, 'non-existent', 1))
        .rejects.toThrow('Cart item not found');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product1 = await testFactory.createProduct(vendor.id);
      const product2 = await testFactory.createProduct(vendor.id);

      const cartItem1 = testFactory.createCartItem(product1.id, 1);
      const cartItem2 = testFactory.createCartItem(product2.id, 2);
      const existingCart = testFactory.createCart(customerId, [cartItem1, cartItem2]);

      mockRedis.get.mockResolvedValue(JSON.stringify(existingCart));
      mockRedis.set.mockResolvedValue('OK');

      const cart = await cartService.removeItem(customerId, cartItem1.id);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe(product2.id);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const customerId = 'customer-1';
      mockRedis.del.mockResolvedValue(1);

      await cartService.clearCart(customerId);

      expect(mockRedis.del).toHaveBeenCalledWith(`cart:${customerId}`);
    });
  });

  describe('validateCartItems', () => {
    it('should return valid for available items', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true }
      });

      const cart = testFactory.createCart(customerId, [
        testFactory.createCartItem(product.id, 2)
      ]);

      const result = await cartService.validateCartItems(cart);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect unavailable products', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, { isActive: false });

      const cart = testFactory.createCart(customerId, [
        testFactory.createCartItem(product.id, 1)
      ]);

      const result = await cartService.validateCartItems(cart);

      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('UNAVAILABLE');
    });

    it('should detect insufficient stock', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 2, trackQuantity: true }
      });

      const cart = testFactory.createCart(customerId, [
        testFactory.createCartItem(product.id, 5)
      ]);

      const result = await cartService.validateCartItems(cart);

      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('INSUFFICIENT_STOCK');
    });
  });
});