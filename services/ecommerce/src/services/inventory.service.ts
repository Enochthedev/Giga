import { InventoryReservation, ReservationResult } from '@platform/types';
import { prisma } from '../lib/prisma';

export interface ReservationItem {
  productId: string;
  quantity: number;
}

export interface ReservationFailure {
  productId: string;
  requested: number;
  available: number;
  reason: string;
}

export interface InventoryStatus {
  productId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  trackQuantity: boolean;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export class InventoryService {
  /**
   * Check if the requested quantity is available for a product
   */
  async checkAvailability(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    const inventory = await prisma.productInventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      // If no inventory record exists, assume unlimited stock
      return true;
    }

    if (!inventory.trackQuantity) {
      // If quantity tracking is disabled, assume unlimited stock
      return true;
    }

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    return availableQuantity >= quantity;
  }

  /**
   * Get detailed inventory status for a product
   */
  async getInventoryStatus(productId: string): Promise<InventoryStatus | null> {
    const inventory = await prisma.productInventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      return null;
    }

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    const isLowStock =
      inventory.trackQuantity &&
      availableQuantity <= inventory.lowStockThreshold;

    return {
      productId,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      availableQuantity,
      trackQuantity: inventory.trackQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      isLowStock,
    };
  }

  /**
   * Reserve inventory for multiple items atomically
   * Uses optimistic locking to handle concurrent updates
   */
  async reserveInventory(
    items: ReservationItem[],
    customerId: string,
    sessionId?: string,
    expirationMinutes: number = 30
  ): Promise<ReservationResult> {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    const failures: ReservationFailure[] = [];
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Use a transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx: any) => {
        // First, check availability for all items
        for (const item of items) {
          const inventory = await tx.productInventory.findUnique({
            where: { productId: item.productId },
          });

          if (!inventory) {
            // Create inventory record if it doesn't exist (unlimited stock)
            await tx.productInventory.create({
              data: {
                productId: item.productId,
                quantity: 999999, // Large number for unlimited stock
                reservedQuantity: 0,
                trackQuantity: false,
              },
            });
            continue;
          }

          if (inventory.trackQuantity) {
            const availableQuantity =
              inventory.quantity - inventory.reservedQuantity;
            if (availableQuantity < item.quantity) {
              failures.push({
                productId: item.productId,
                requested: item.quantity,
                available: availableQuantity,
                reason: 'Insufficient stock available',
              });
            }
          }
        }

        // If there are any failures, don't proceed with reservations
        if (failures.length > 0) {
          return { reservationId, success: false, failures };
        }

        // Reserve inventory for all items
        for (const item of items) {
          const inventory = await tx.productInventory.findUnique({
            where: { productId: item.productId },
          });

          if (inventory && inventory.trackQuantity) {
            // Update reserved quantity with optimistic locking
            const updated = await tx.productInventory.updateMany({
              where: {
                productId: item.productId,
                updatedAt: inventory.updatedAt, // Optimistic locking
              },
              data: {
                reservedQuantity: {
                  increment: item.quantity,
                },
              },
            });

            // If no rows were updated, it means another transaction modified the record
            if (updated.count === 0) {
              throw new Error(
                `Concurrent modification detected for product ${item.productId}`
              );
            }
          }

          // Create reservation record
          await tx.inventoryReservation.create({
            data: {
              id: `${reservationId}_${item.productId}`,
              productId: item.productId,
              quantity: item.quantity,
              customerId,
              sessionId,
              expiresAt,
            },
          });
        }

        return { reservationId, success: true, failures: [] };
      });

      return result;
    } catch (error) {
      console.error('Error reserving inventory:', error);

      // If it's a concurrent modification error, retry once
      if (
        error instanceof Error &&
        error.message.includes('Concurrent modification')
      ) {
        // Wait a small random amount to reduce collision probability
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

        // Retry the reservation
        return this.reserveInventory(
          items,
          customerId,
          sessionId,
          expirationMinutes
        );
      }

      throw new Error('Failed to reserve inventory');
    }
  }

  /**
   * Release a reservation and restore inventory
   */
  async releaseReservation(reservationId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx: any) => {
        // Find all reservation records for this reservation ID
        const reservations = await tx.inventoryReservation.findMany({
          where: {
            id: {
              startsWith: reservationId,
            },
          },
        });

        if (reservations.length === 0) {
          return; // Reservation doesn't exist or already released
        }

        // Release inventory for each reserved item
        for (const reservation of reservations) {
          const inventory = await tx.productInventory.findUnique({
            where: { productId: reservation.productId },
          });

          if (inventory && inventory.trackQuantity) {
            await tx.productInventory.update({
              where: { productId: reservation.productId },
              data: {
                reservedQuantity: {
                  decrement: reservation.quantity,
                },
              },
            });
          }
        }

        // Delete reservation records
        await tx.inventoryReservation.deleteMany({
          where: {
            id: {
              startsWith: reservationId,
            },
          },
        });
      });
    } catch (error) {
      console.error('Error releasing reservation:', error);
      throw new Error('Failed to release reservation');
    }
  }

  /**
   * Update inventory quantity for a product
   */
  async updateInventory(productId: string, quantity: number): Promise<void> {
    try {
      await prisma.productInventory.upsert({
        where: { productId },
        update: { quantity },
        create: {
          productId,
          quantity,
          reservedQuantity: 0,
          trackQuantity: true,
        },
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw new Error('Failed to update inventory');
    }
  }

  /**
   * Clean up expired reservations
   */
  async cleanupExpiredReservations(): Promise<number> {
    try {
      const expiredReservations = await prisma.inventoryReservation.findMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (expiredReservations.length === 0) {
        return 0;
      }

      await prisma.$transaction(async (tx: any) => {
        // Release inventory for expired reservations
        for (const reservation of expiredReservations) {
          const inventory = await tx.productInventory.findUnique({
            where: { productId: reservation.productId },
          });

          if (inventory && inventory.trackQuantity) {
            await tx.productInventory.update({
              where: { productId: reservation.productId },
              data: {
                reservedQuantity: {
                  decrement: reservation.quantity,
                },
              },
            });
          }
        }

        // Delete expired reservations
        await tx.inventoryReservation.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });
      });

      return expiredReservations.length;
    } catch (error) {
      console.error('Error cleaning up expired reservations:', error);
      throw new Error('Failed to cleanup expired reservations');
    }
  }

  /**
   * Get all reservations for a customer
   */
  async getCustomerReservations(
    customerId: string
  ): Promise<InventoryReservation[]> {
    const reservations = await prisma.inventoryReservation.findMany({
      where: { customerId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return reservations.map((reservation: any) => ({
      id: reservation.id,
      productId: reservation.productId,
      quantity: reservation.quantity,
      customerId: reservation.customerId,
      orderId: reservation.orderId || undefined,
      sessionId: reservation.sessionId || undefined,
      expiresAt: reservation.expiresAt.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
    }));
  }

  /**
   * Convert reservation to order (mark as used)
   */
  async convertReservationToOrder(
    reservationId: string,
    orderId: string
  ): Promise<void> {
    try {
      await prisma.inventoryReservation.updateMany({
        where: {
          id: {
            startsWith: reservationId,
          },
        },
        data: {
          orderId,
        },
      });
    } catch (error) {
      console.error('Error converting reservation to order:', error);
      throw new Error('Failed to convert reservation to order');
    }
  }

  /**
   * Restore inventory quantities (for order cancellations)
   */
  async restoreInventory(items: ReservationItem[]): Promise<void> {
    try {
      await prisma.$transaction(async (tx: any) => {
        for (const item of items) {
          const inventory = await tx.productInventory.findUnique({
            where: { productId: item.productId },
          });

          if (inventory && inventory.trackQuantity) {
            await tx.productInventory.update({
              where: { productId: item.productId },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
          }
        }
      });
    } catch (error) {
      console.error('Error restoring inventory:', error);
      throw new Error('Failed to restore inventory');
    }
  }

  /**
   * Get products with low stock for a vendor
   */
  async getLowStockProducts(vendorId: string): Promise<any[]> {
    const products = await prisma.product.findMany({
      where: {
        vendorId,
        isActive: true,
        inventory: {
          trackQuantity: true,
        },
      },
      include: {
        inventory: true,
      },
    });

    return products.filter((product: any) => {
      if (!product.inventory) return false;
      const availableQuantity =
        product.inventory.quantity - product.inventory.reservedQuantity;
      return availableQuantity <= product.inventory.lowStockThreshold;
    });
  }

  /**
   * Update product inventory for a vendor
   */
  async updateProductInventory(
    productId: string,
    vendorId: string,
    updateData: {
      quantity: number;
      lowStockThreshold?: number;
      trackQuantity?: boolean;
    }
  ): Promise<{
    productId: string;
    inventory: {
      quantity: number;
      lowStockThreshold: number;
      trackQuantity: boolean;
    };
  }> {
    // Verify product belongs to vendor
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        vendorId,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    // Update inventory
    const updatedInventory = await prisma.productInventory.upsert({
      where: {
        productId,
      },
      update: {
        quantity: updateData.quantity,
        lowStockThreshold: updateData.lowStockThreshold ?? undefined,
        trackQuantity: updateData.trackQuantity ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        productId,
        quantity: updateData.quantity,
        lowStockThreshold: updateData.lowStockThreshold || 10,
        trackQuantity:
          updateData.trackQuantity !== undefined
            ? updateData.trackQuantity
            : true,
      },
    });

    return {
      productId,
      inventory: {
        quantity: updatedInventory.quantity,
        lowStockThreshold: updatedInventory.lowStockThreshold,
        trackQuantity: updatedInventory.trackQuantity,
      },
    };
  }

  /**
   * Bulk update inventory for multiple products
   */
  async bulkUpdateInventory(
    vendorId: string,
    updates: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold?: number;
    }>
  ): Promise<{
    updatedCount: number;
    lowStockAlerts: number;
    results: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold: number;
    }>;
  }> {
    // Verify all products belong to vendor
    const productIds = updates.map(update => update.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        vendorId,
      },
      include: {
        inventory: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products not found or access denied');
    }

    // Perform bulk updates in transaction
    const results = await prisma.$transaction(
      updates.map(update =>
        prisma.productInventory.upsert({
          where: {
            productId: update.productId,
          },
          update: {
            quantity: update.quantity,
            lowStockThreshold: update.lowStockThreshold ?? undefined,
            updatedAt: new Date(),
          },
          create: {
            productId: update.productId,
            quantity: update.quantity,
            lowStockThreshold: update.lowStockThreshold || 10,
            trackQuantity: true,
          },
        })
      )
    );

    // Count low stock alerts
    const lowStockAlerts = results.filter(
      result =>
        result.trackQuantity && result.quantity <= result.lowStockThreshold
    ).length;

    return {
      updatedCount: results.length,
      lowStockAlerts,
      results: results.map(result => ({
        productId: result.productId,
        quantity: result.quantity,
        lowStockThreshold: result.lowStockThreshold,
      })),
    };
  }

  /**
   * Check if product inventory is low and needs alert
   */
  isLowStock(inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  }): boolean {
    return (
      inventory.trackQuantity &&
      inventory.quantity <= inventory.lowStockThreshold
    );
  }
}

export const inventoryService = new InventoryService();
