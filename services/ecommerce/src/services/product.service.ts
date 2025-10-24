import { Product } from '@platform/types';
import { Prisma, PrismaClient } from '../generated/prisma-client';
import { cacheService } from './cache.service';

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CategoryTree {
  name: string;
  subcategories: Array<{
    name: string | null;
    productCount: number;
  }>;
  totalProducts: number;
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
  reviews?: any[];
};

/**
 * ProductService handles all product-related business logic
 */
export class ProductService {
  private readonly FEATURED_PRODUCT_MIN_RATING = 4.0;
  private readonly DEFAULT_PAGE_SIZE = 20;
  private readonly MAX_PAGE_SIZE = 100;

  constructor(private prisma: PrismaClient) {}

  /**
   * Get products with filtering, search, and pagination
   */
  async getProducts(filters: ProductFilters): Promise<PaginatedProducts> {
    const normalizedFilters = this.normalizeFilters(filters);

    // Try to get cached results
    const cachedResults =
      await cacheService.getCachedSearchResults(normalizedFilters);
    if (cachedResults) {
      return cachedResults;
    }

    // Build query
    const where = this.buildProductWhereClause(normalizedFilters);
    const orderBy = this.buildOrderByClause(
      normalizedFilters.sortBy || 'createdAt',
      normalizedFilters.sortOrder || 'desc'
    );
    const skip =
      ((normalizedFilters.page || 1) - 1) *
      (normalizedFilters.limit || this.DEFAULT_PAGE_SIZE);
    const take = normalizedFilters.limit || this.DEFAULT_PAGE_SIZE;

    // Fetch products and total count
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          inventory: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result: PaginatedProducts = {
      products: products.map(p => this.mapToProductDto(p)),
      pagination: {
        page: normalizedFilters.page || 1,
        limit: normalizedFilters.limit || this.DEFAULT_PAGE_SIZE,
        total,
        pages: Math.ceil(
          total / (normalizedFilters.limit || this.DEFAULT_PAGE_SIZE)
        ),
      },
    };

    // Cache results
    await cacheService.cacheSearchResults(normalizedFilters, result);

    // Cache individual products for better performance
    if (products.length > 0) {
      await cacheService.cacheProductsBatch(products);
    }

    return result;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    // Try to get cached product
    const cachedProduct = await cacheService.getCachedProduct(id);
    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        inventory: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const productDto = this.mapToProductDto(product);

    // Cache product
    await cacheService.cacheProduct(id, productDto);

    return productDto;
  }

  /**
   * Get product categories with subcategories and counts
   */
  async getCategories(): Promise<CategoryTree[]> {
    // Try to get cached categories
    const cachedCategories = await cacheService.getCachedCategories();
    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.prisma.product.groupBy({
      by: ['category', 'subcategory'],
      where: { isActive: true },
      _count: {
        id: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    const result = this.groupCategories(categories);

    // Cache categories
    await cacheService.cacheCategories(result);

    return result;
  }

  /**
   * Get featured products (high-rated products)
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    // Try to get cached featured products
    const cachedProducts = await cacheService.getCachedFeaturedProducts();
    if (cachedProducts) {
      return cachedProducts.slice(0, limit);
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        rating: {
          gte: this.FEATURED_PRODUCT_MIN_RATING,
        },
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
      include: {
        inventory: true,
      },
    });

    const productDtos = products.map(p => this.mapToProductDto(p));

    // Cache featured products
    await cacheService.cacheFeaturedProducts(productDtos);

    return productDtos;
  }

  /**
   * Build Prisma where clause from filters
   */
  private buildProductWhereClause(
    filters: ProductFilters
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      isActive: filters.isActive !== undefined ? filters.isActive : true,
    };

    // Search across multiple fields
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Category filters
    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.subcategory) {
      where.subcategory = filters.subcategory;
    }

    // Brand filter
    if (filters.brand) {
      where.brand = filters.brand;
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      where.rating = {
        gte: filters.minRating,
      };
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause
   */
  private buildOrderByClause(
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Prisma.ProductOrderByWithRelationInput {
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    orderBy[sortBy as keyof Prisma.ProductOrderByWithRelationInput] = sortOrder;
    return orderBy;
  }

  /**
   * Group categories by category and subcategory
   */
  private groupCategories(
    categories: Array<{
      category: string;
      subcategory: string | null;
      _count: { id: number };
    }>
  ): CategoryTree[] {
    const grouped = categories.reduce(
      (acc: Record<string, CategoryTree>, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            name: item.category,
            subcategories: [],
            totalProducts: 0,
          };
        }

        acc[item.category].subcategories.push({
          name: item.subcategory,
          productCount: item._count.id,
        });
        acc[item.category].totalProducts += item._count.id;

        return acc;
      },
      {}
    );

    return Object.values(grouped);
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
  private normalizeFilters(filters: ProductFilters): ProductFilters {
    return {
      ...filters,
      page: Math.max(1, filters.page || 1),
      limit: Math.min(
        this.MAX_PAGE_SIZE,
        Math.max(1, filters.limit || this.DEFAULT_PAGE_SIZE)
      ),
      sortOrder: filters.sortOrder === 'asc' ? 'asc' : 'desc',
    };
  }
}
