import { PrismaClient } from '../generated/prisma-client/index.js';

export interface CreateVariantData {
  productId: string;
  name: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  attributes: Record<string, string>; // e.g., { "color": "blue", "size": "M" }
  images?: string[];
  inventory?: {
    quantity: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
  };
}

export interface UpdateVariantData {
  name?: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  attributes?: Record<string, string>;
  images?: string[];
  isActive?: boolean;
}

export interface VariantWithInventory {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  attributes: Record<string, string>;
  images: string[];
  isActive: boolean;
  inventory?: {
    quantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    isInStock: boolean;
    isLowStock: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ProductVariantService {
  constructor(private prisma: PrismaClient) {}

  async createVariant(data: CreateVariantData): Promise<VariantWithInventory> {
    const variant = await this.prisma.$transaction(async tx => {
      // Create the variant
      const newVariant = await tx.productVariant.create({
        data: {
          productId: data.productId,
          name: data.name,
          sku: data.sku,
          price: data.price,
          comparePrice: data.comparePrice,
          attributes: data.attributes,
          images: data.images || [],
          isActive: true,
        },
      });

      // Create inventory if provided
      if (data.inventory) {
        await tx.productVariantInventory.create({
          data: {
            variantId: newVariant.id,
            quantity: data.inventory.quantity,
            lowStockThreshold: data.inventory.lowStockThreshold || 10,
            trackQuantity: data.inventory.trackQuantity ?? true,
          },
        });
      }

      // Update product to indicate it has variants
      await tx.product.update({
        where: { id: data.productId },
        data: { hasVariants: true },
      });

      return newVariant;
    });

    return this.getVariantWithInventory(variant.id);
  }

  async updateVariant(
    variantId: string,
    data: UpdateVariantData
  ): Promise<VariantWithInventory> {
    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        name: data.name,
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice,
        attributes: data.attributes,
        images: data.images,
        isActive: data.isActive,
      },
    });

    return this.getVariantWithInventory(variantId);
  }

  async getVariantWithInventory(
    variantId: string
  ): Promise<VariantWithInventory> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        inventory: true,
      },
    });

    if (!variant) {
      throw new Error('Product variant not found');
    }

    return this.formatVariantWithInventory(variant);
  }

  async getProductVariants(productId: string): Promise<VariantWithInventory[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
      },
      include: {
        inventory: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return variants.map(variant => this.formatVariantWithInventory(variant));
  }

  async updateVariantInventory(
    variantId: string,
    data: {
      quantity?: number;
      lowStockThreshold?: number;
      trackQuantity?: boolean;
    }
  ): Promise<void> {
    await this.prisma.productVariantInventory.upsert({
      where: { variantId },
      create: {
        variantId,
        quantity: data.quantity || 0,
        lowStockThreshold: data.lowStockThreshold || 10,
        trackQuantity: data.trackQuantity ?? true,
      },
      update: {
        quantity: data.quantity,
        lowStockThreshold: data.lowStockThreshold,
        trackQuantity: data.trackQuantity,
      },
    });
  }

  async reserveVariantInventory(
    variantId: string,
    quantity: number,
    customerId: string,
    sessionId?: string
  ): Promise<boolean> {
    return this.prisma.$transaction(async tx => {
      const inventory = await tx.productVariantInventory.findUnique({
        where: { variantId },
      });

      if (!inventory || !inventory.trackQuantity) {
        return true; // Don't track inventory
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (availableQuantity < quantity) {
        return false; // Insufficient inventory
      }

      // Update reserved quantity
      await tx.productVariantInventory.update({
        where: { variantId },
        data: {
          reservedQuantity: { increment: quantity },
        },
      });

      // Create reservation record
      await tx.inventoryReservation.create({
        data: {
          productId: '', // We need to get this from the variant
          variantId,
          quantity,
          customerId,
          sessionId,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      });

      return true;
    });
  }

  async releaseVariantInventory(
    variantId: string,
    quantity: number
  ): Promise<void> {
    await this.prisma.productVariantInventory.update({
      where: { variantId },
      data: {
        reservedQuantity: { decrement: quantity },
      },
    });
  }

  async confirmVariantInventoryUsage(
    variantId: string,
    quantity: number
  ): Promise<void> {
    await this.prisma.productVariantInventory.update({
      where: { variantId },
      data: {
        quantity: { decrement: quantity },
        reservedQuantity: { decrement: quantity },
      },
    });
  }

  async getVariant(variantId: string): Promise<VariantWithInventory | null> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        inventory: true,
      },
    });

    if (!variant) return null;

    return this.formatVariantWithInventory(variant);
  }

  async searchVariantsByAttributes(
    attributes: Record<string, string>,
    productId?: string
  ): Promise<VariantWithInventory[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        ...(productId && { productId }),
        isActive: true,
      },
      include: {
        inventory: true,
      },
    });

    // Filter variants that match the provided attributes
    const matchingVariants = variants.filter(variant => {
      const variantAttributes = variant.attributes as Record<string, string>;
      return Object.entries(attributes).every(
        ([key, value]) => variantAttributes[key] === value
      );
    });

    return matchingVariants.map(variant =>
      this.formatVariantWithInventory(variant)
    );
  }

  async getVariantsByAttributes(
    productId: string,
    attributes: Record<string, string>
  ): Promise<VariantWithInventory[]> {
    // This is a simplified search - in a real implementation, you'd want more sophisticated filtering
    const variants = await this.prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
      },
      include: {
        inventory: true,
      },
    });

    // Filter variants that match the provided attributes
    const matchingVariants = variants.filter(variant => {
      const variantAttributes = variant.attributes as Record<string, string>;
      return Object.entries(attributes).every(
        ([key, value]) => variantAttributes[key] === value
      );
    });

    return matchingVariants.map(variant =>
      this.formatVariantWithInventory(variant)
    );
  }

  async getAvailableAttributeValues(
    productId: string
  ): Promise<Record<string, string[]>> {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
      },
      select: {
        attributes: true,
      },
    });

    const attributeValues: Record<string, Set<string>> = {};

    variants.forEach(variant => {
      const attributes = variant.attributes as Record<string, string>;
      Object.entries(attributes).forEach(([key, value]) => {
        if (!attributeValues[key]) {
          attributeValues[key] = new Set();
        }
        attributeValues[key].add(value);
      });
    });

    // Convert Sets to Arrays
    return Object.entries(attributeValues).reduce(
      (result, [key, valueSet]) => {
        result[key] = Array.from(valueSet).sort();
        return result;
      },
      {} as Record<string, string[]>
    );
  }

  async deleteVariant(variantId: string): Promise<void> {
    await this.prisma.$transaction(async tx => {
      // Delete inventory first
      await tx.productVariantInventory.deleteMany({
        where: { variantId },
      });

      // Delete reservations
      await tx.inventoryReservation.deleteMany({
        where: { variantId },
      });

      // Delete the variant
      await tx.productVariant.delete({
        where: { id: variantId },
      });

      // Check if product still has variants
      const variant = await tx.productVariant.findFirst({
        where: { id: variantId },
        select: { productId: true },
      });

      if (variant) {
        const remainingVariants = await tx.productVariant.count({
          where: {
            productId: variant.productId,
            isActive: true,
          },
        });

        if (remainingVariants === 0) {
          await tx.product.update({
            where: { id: variant.productId },
            data: { hasVariants: false },
          });
        }
      }
    });
  }

  async getLowStockVariants(
    threshold?: number
  ): Promise<VariantWithInventory[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        isActive: true,
        inventory: {
          trackQuantity: true,
          ...(threshold && {
            quantity: { lte: threshold },
          }),
        },
      },
      include: {
        inventory: true,
        product: {
          select: {
            name: true,
            vendor: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return variants
      .map(variant => this.formatVariantWithInventory(variant))
      .filter(variant => variant.inventory?.isLowStock);
  }

  private formatVariantWithInventory(variant: any): VariantWithInventory {
    const inventory = variant.inventory;

    return {
      id: variant.id,
      productId: variant.productId,
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      comparePrice: variant.comparePrice,
      attributes: variant.attributes as Record<string, string>,
      images: variant.images,
      isActive: variant.isActive,
      inventory: inventory
        ? {
            quantity: inventory.quantity,
            reservedQuantity: inventory.reservedQuantity,
            availableQuantity: inventory.quantity - inventory.reservedQuantity,
            lowStockThreshold: inventory.lowStockThreshold,
            trackQuantity: inventory.trackQuantity,
            isInStock: inventory.quantity > inventory.reservedQuantity,
            isLowStock: inventory.quantity <= inventory.lowStockThreshold,
          }
        : undefined,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}

export const productVariantService = new ProductVariantService(
  new PrismaClient()
);
