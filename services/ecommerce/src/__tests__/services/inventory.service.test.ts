import { prisma } from '@tests/setup';
import { TestDataFactory } from '@tests/utils/test-helpers';
import { beforeEach, describe, expect, it } from 'vitest';
import { InventoryService } from '@/services/inventory.service';

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let testFactory: TestDataFactory;

  beforeEach(() => {
    testFactory = new TestDataFactory(prisma);
    inventoryService = new InventoryService(prisma);
  });

  describe('checkAvailability', () => {
    it('should return true for available inventory', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      const isAvailable = await inventoryService.checkAvailability(
        product.id,
        5
      );

      expect(isAvailable).toBe(true);
    });

    it('should return false for insufficient inventory', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 3, trackQuantity: true },
      });

      const isAvailable = await inventoryService.checkAvailability(
        product.id,
        5
      );

      expect(isAvailable).toBe(false);
    });

    it('should return true for products not tracking quantity', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 0, trackQuantity: false },
      });

      const isAvailable = await inventoryService.checkAvailability(
        product.id,
        100
      );

      expect(isAvailable).toBe(true);
    });

    it('should return false for inactive products', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        isActive: false,
        inventory: { quantity: 10, trackQuantity: true },
      });

      const isAvailable = await inventoryService.checkAvailability(
        product.id,
        1
      );

      expect(isAvailable).toBe(false);
    });
  });

  describe('reserveInventory', () => {
    it('should reserve inventory successfully', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      const items = [{ productId: product.id, quantity: 3 }];
      const result = await inventoryService.reserveInventory(
        items,
        'customer-1'
      );

      expect(result.success).toBe(true);
      expect(result.reservationId).toBeDefined();
      expect(result.failures).toHaveLength(0);

      // Verify reservation was created
      const reservation = await prisma.inventoryReservation.findUnique({
        where: { id: result.reservationId },
      });
      expect(reservation).toBeDefined();
      expect(reservation!.quantity).toBe(3);
    });

    it('should fail reservation for insufficient inventory', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 2, trackQuantity: true },
      });

      const items = [{ productId: product.id, quantity: 5 }];
      const result = await inventoryService.reserveInventory(
        items,
        'customer-1'
      );

      expect(result.success).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0]).toMatchObject({
        productId: product.id,
        requested: 5,
        available: 2,
        reason: 'Insufficient inventory',
      });
    });

    it('should handle partial failures in batch reservation', () => {
      const vendor = await testFactory.createVendor();
      const product1 = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });
      const product2 = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 2, trackQuantity: true },
      });

      const items = [
        { productId: product1.id, quantity: 3 },
        { productId: product2.id, quantity: 5 },
      ];
      const result = await inventoryService.reserveInventory(
        items,
        'customer-1'
      );

      expect(result.success).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].productId).toBe(product2.id);
    });

    it('should handle concurrent reservations with optimistic locking', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 5, trackQuantity: true },
      });

      const items = [{ productId: product.id, quantity: 3 }];

      // Simulate concurrent reservations
      const promises = [
        inventoryService.reserveInventory(items, 'customer-1'),
        inventoryService.reserveInventory(items, 'customer-2'),
      ];

      const results = await Promise.all(promises);

      // One should succeed, one should fail
      const successes = results.filter(r => r.success);
      const failures = results.filter(r => !r.success);

      expect(successes).toHaveLength(1);
      expect(failures).toHaveLength(1);
      expect(failures[0].failures[0].reason).toContain(
        'Insufficient inventory'
      );
    });

    it('should set expiration time for reservations', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      const items = [{ productId: product.id, quantity: 3 }];
      const result = await inventoryService.reserveInventory(
        items,
        'customer-1'
      );

      const reservation = await prisma.inventoryReservation.findUnique({
        where: { id: result.reservationId },
      });

      expect(reservation!.expiresAt).toBeInstanceOf(Date);
      expect(reservation!.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('releaseReservation', () => {
    it('should release reservation successfully', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      const items = [{ productId: product.id, quantity: 3 }];
      const reservationResult = await inventoryService.reserveInventory(
        items,
        'customer-1'
      );

      await inventoryService.releaseReservation(
        reservationResult.reservationId
      );

      // Verify reservation was deleted
      const reservation = await prisma.inventoryReservation.findUnique({
        where: { id: reservationResult.reservationId },
      });
      expect(reservation).toBeNull();
    });

    it('should handle non-existent reservation gracefully', () => {
      await expect(
        inventoryService.releaseReservation('non-existent')
      ).resolves.not.toThrow();
    });
  });

  describe('updateInventory', () => {
    it('should update inventory quantity', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      await inventoryService.updateInventory(product.id, 15);

      const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(updatedProduct!.inventory.quantity).toBe(15);
    });

    it('should handle concurrent inventory updates', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      // Simulate concurrent updates
      const promises = [
        inventoryService.updateInventory(product.id, 8),
        inventoryService.updateInventory(product.id, 12),
      ];

      await Promise.all(promises);

      const updatedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });

      // One of the updates should have succeeded
      expect([8, 12]).toContain(updatedProduct!.inventory.quantity);
    });
  });

  describe('getInventoryStatus', () => {
    it('should return inventory status', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      // Create a reservation
      const items = [{ productId: product.id, quantity: 3 }];
      await inventoryService.reserveInventory(items, 'customer-1');

      const status = await inventoryService.getInventoryStatus(product.id);

      expect(status).toMatchObject({
        productId: product.id,
        totalQuantity: 10,
        reservedQuantity: 3,
        availableQuantity: 7,
        trackQuantity: true,
      });
    });

    it('should handle products without reservations', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      const status = await inventoryService.getInventoryStatus(product.id);

      expect(status).toMatchObject({
        productId: product.id,
        totalQuantity: 10,
        reservedQuantity: 0,
        availableQuantity: 10,
        trackQuantity: true,
      });
    });
  });

  describe('cleanupExpiredReservations', () => {
    it('should remove expired reservations', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 10, trackQuantity: true },
      });

      // Create reservation with past expiration
      const expiredReservation = await prisma.inventoryReservation.create({
        data: {
          productId: product.id,
          quantity: 3,
          customerId: 'customer-1',
          expiresAt: new Date(Date.now() - 1000), // 1 second ago
        },
      });

      // Create valid reservation
      const validReservation = await prisma.inventoryReservation.create({
        data: {
          productId: product.id,
          quantity: 2,
          customerId: 'customer-2',
          expiresAt: new Date(Date.now() + 60000), // 1 minute from now
        },
      });

      await inventoryService.cleanupExpiredReservations();

      // Verify expired reservation was removed
      const expired = await prisma.inventoryReservation.findUnique({
        where: { id: expiredReservation.id },
      });
      expect(expired).toBeNull();

      // Verify valid reservation remains
      const valid = await prisma.inventoryReservation.findUnique({
        where: { id: validReservation.id },
      });
      expect(valid).toBeDefined();
    });
  });

  describe('stress testing', () => {
    it('should handle high concurrency inventory operations', () => {
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 100, trackQuantity: true },
      });

      // Create 50 concurrent reservation attempts
      const promises = Array.from({ length: 50 }, (_, i) =>
        inventoryService.reserveInventory(
          [{ productId: product.id, quantity: 2 }],
          `customer-${i}`
        )
      );

      const results = await Promise.allSettled(promises);
      const successes = results.filter(
        r => r.status === 'fulfilled' && r.value.success
      );

      // Should have exactly 50 successful reservations (100 / 2)
      expect(successes).toHaveLength(50);

      // Verify final inventory state
      const status = await inventoryService.getInventoryStatus(product.id);
      expect(status.reservedQuantity).toBe(100);
      expect(status.availableQuantity).toBe(0);
    });
  });
});
