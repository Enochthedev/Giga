import { Product } from '@platform/types';
import { Prisma, PrismaClient } from '../generated/prisma-client';

export interface VendorProductFilters {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'all';
  category?: string;
  search?: string;
}

export interface PaginatedVendorProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type PrismaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  category: string;
  subcategory: string | null;
  brand: string | null;
  images: string[];
  specifications: any;
  vendorId: string;
  isActive: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  } | null;
};

/**
 * VendorProductService handles vendor-specific product operations
 */
export class VendorProductService {
  private readonly DEFAULT_PAGE_SIZE = 20;
  private readonly MAX_PAGE_SIZE = 100;

  constructor(private prisma: PrismaClient) {}

  /**
   * Get products for a specific vendor with filtering
   */
  async getVendorProducts(
    vendorId: string,
    filters: VendorProductFilters
  ): Promise<PaginatedVendorProducts> {
    const normalizedFilters = this.normalizeFilters(filters);
    const where = this.buildVendorProductWhereClause(
      vendorId,
      normalizedFilters
    );

    const skip = (normalizedFilters.page - 1) * normalizedFilters.limit;
    const take = normalizedFilters.limit;

    // Get products with inventory
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          inventory: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(p => this.mapToProductDto(p)),
      total,
      page: normalizedFilters.page,
      limit: normalizedFilters.limit,
      totalPages: Math.ceil(total / normalizedFilters.limit),
    };
  }

  /**
   * Verify that a product belongs to a vendor
   */
  async verifyVendorOwnership(
    productId: string,
    vendorId: string
  ): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        vendorId,
      },
    });

    if (!product) {
      throw new Error('Product not found or access denied');
    }
  }

  /**
   * Verify that multiple products belong to a vendor
   */
  async verifyVendorOwnershipBulk(
    productIds: string[],
    vendorId: string
  ): Promise<void> {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        vendorId,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products not found or access denied');
    }
  }

  /**
   * Build where clause for vendor product queries
   */
  private buildVendorProductWhereClause(
    vendorId: string,
    filters: VendorProductFilters
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      vendorId,
    };

    // Status filter
    if (filters.status !== 'all') {
      where.isActive = filters.status === 'active';
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * Map Prisma product to Product DTO
   */
  private mapToProductDto(product: PrismaProduct): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || undefined,
      sku: product.sku || undefined,
      category: product.category,
      subcategory: product.subcategory || undefined,
      brand: product.brand || undefined,
      images: product.images,
      specifications:
        (product.specifications as Record<string, string>) || undefined,
      vendorId: product.vendorId,
      inventory: product.inventory
        ? {
            quantity: product.inventory.quantity,
            lowStockThreshold: product.inventory.lowStockThreshold,
            trackQuantity: product.inventory.trackQuantity,
          }
        : {
            quantity: 0,
            lowStockThreshold: 10,
            trackQuantity: true,
          },
      isActive: product.isActive,
      rating: product.rating || undefined,
      reviewCount: product.reviewCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  /**
   * Normalize and validate filters
   */
  private normalizeFilters(
    filters: VendorProductFilters
  ): Required<VendorProductFilters> {
    return {
      page: Math.max(1, filters.page || 1),
      limit: Math.min(
        this.MAX_PAGE_SIZE,
        Math.max(1, filters.limit || this.DEFAULT_PAGE_SIZE)
      ),
      status: filters.status || 'all',
      category: filters.category || '',
      search: filters.search || '',
    };
  }
}
