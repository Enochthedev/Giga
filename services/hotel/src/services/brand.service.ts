/**
 * Brand Service - Handles hotel brand management operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import { Brand, CreateBrandRequest } from '@/types';
import logger from '@/utils/logger';

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// Types
interface BrandSearchCriteria {
  query?: string;
  chainId?: string;
  isActive?: boolean;
}

interface UpdateBrandRequest {
  name?: string;
  description?: string;
  code?: string;
  brandStandards?: any;
  amenityRequirements?: string[];
  logo?: string;
  colorScheme?: any;
  isActive?: boolean;
}

export class BrandService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new hotel brand
   */
  async createBrand(request: CreateBrandRequest): Promise<Brand> {
    try {
      logger.info('Creating brand', {
        name: request.name,
        code: request.code,
        chainId: request.chainId,
      });

      // Validate request
      await this.validateBrandRequest(request);

      // Check for duplicate code within the chain
      await this.checkDuplicateCode(request.chainId, request.code);

      const brand = await this.prisma.brand.create({
        data: {
          chainId: request.chainId,
          name: request.name,
          description: request.description,
          code: request.code.toUpperCase(),
          brandStandards: request.brandStandards || {},
          amenityRequirements: request.amenityRequirements || [],
          logo: request.logo,
          colorScheme: request.colorScheme,
        },
        include: {
          chain: true,
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });

      logger.info('Brand created successfully', {
        brandId: brand.id,
        name: brand.name,
        code: brand.code,
        chainId: brand.chainId,
      });

      return brand as Brand;
    } catch (error) {
      logger.error('Error creating brand', { error, request });
      throw error;
    }
  }

  /**
   * Get brand by ID
   */
  async getBrand(id: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        chain: true,
        properties: {
          where: { status: 'active' },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError('Brand', id);
    }

    return brand as Brand;
  } /**

   * Get all brands with filtering and pagination
   */
  async getBrands(
    criteria: BrandSearchCriteria = {},
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (criteria.query) {
      where.OR = [
        {
          name: {
            contains: criteria.query,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: criteria.query,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (criteria.chainId) {
      where.chainId = criteria.chainId;
    }

    if (criteria.isActive !== undefined) {
      where.isActive = criteria.isActive;
    }

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        include: {
          chain: true,
          _count: {
            select: {
              properties: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      brands: brands as Brand[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get brands by chain ID
   */
  async getBrandsByChain(chainId: string): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      where: {
        chainId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }) as Promise<Brand[]>;
  }

  /**
   * Update brand
   */
  async updateBrand(id: string, request: UpdateBrandRequest): Promise<Brand> {
    try {
      logger.info('Updating brand', { brandId: id });

      // Check if brand exists
      const existingBrand = await this.prisma.brand.findUnique({
        where: { id },
      });

      if (!existingBrand) {
        throw new NotFoundError('Brand', id);
      }

      // Check for duplicate code if code is being updated
      if (request.code && request.code !== existingBrand.code) {
        await this.checkDuplicateCode(existingBrand.chainId, request.code, id);
      }

      // Build update data
      const updateData: Record<string, unknown> = {};

      if (request.name) updateData.name = request.name;
      if (request.description !== undefined)
        updateData.description = request.description;
      if (request.code) updateData.code = request.code.toUpperCase();
      if (request.brandStandards) {
        updateData.brandStandards = {
          ...(existingBrand.brandStandards as Record<string, unknown>),
          ...request.brandStandards,
        };
      }
      if (request.amenityRequirements)
        updateData.amenityRequirements = request.amenityRequirements;
      if (request.logo !== undefined) updateData.logo = request.logo;
      if (request.colorScheme) updateData.colorScheme = request.colorScheme;
      if (request.isActive !== undefined)
        updateData.isActive = request.isActive;

      const updatedBrand = await this.prisma.brand.update({
        where: { id },
        data: updateData,
        include: {
          chain: true,
          properties: {
            where: { status: 'active' },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });

      logger.info('Brand updated successfully', { brandId: id });

      return updatedBrand as Brand;
    } catch (error) {
      logger.error('Error updating brand', { error, brandId: id });
      throw error;
    }
  }

  /**
   * Delete brand (soft delete)
   */
  async deleteBrand(id: string): Promise<void> {
    try {
      logger.info('Deleting brand', { brandId: id });

      // Check if brand exists
      const existingBrand = await this.prisma.brand.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });

      if (!existingBrand) {
        throw new NotFoundError('Brand', id);
      }

      // Check if brand has active properties
      if (existingBrand._count.properties > 0) {
        throw new ConflictError(
          'Cannot delete brand with active properties. Please deactivate them first.'
        );
      }

      // Soft delete by updating status
      await this.prisma.brand.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      logger.info('Brand deleted successfully', { brandId: id });
    } catch (error) {
      logger.error('Error deleting brand', { error, brandId: id });
      throw error;
    }
  }

  /**
   * Validate brand request
   */
  private async validateBrandRequest(
    request: CreateBrandRequest
  ): Promise<void> {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Brand name is required');
    }

    if (!request.code || request.code.trim().length === 0) {
      throw new ValidationError('Brand code is required');
    }

    if (request.code.length < 2 || request.code.length > 10) {
      throw new ValidationError(
        'Brand code must be between 2 and 10 characters'
      );
    }

    if (!request.chainId) {
      throw new ValidationError('Chain ID is required');
    }

    // Verify chain exists
    const chain = await this.prisma.chain.findUnique({
      where: { id: request.chainId },
    });

    if (!chain) {
      throw new ValidationError('Invalid chain ID');
    }

    if (!chain.isActive) {
      throw new ValidationError('Cannot create brand for inactive chain');
    }
  }

  /**
   * Check for duplicate brand code within a chain
   */
  private async checkDuplicateCode(
    chainId: string,
    code: string,
    excludeId?: string
  ): Promise<void> {
    const where: Record<string, unknown> = {
      chainId,
      code: code.toUpperCase(),
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingBrand = await this.prisma.brand.findFirst({ where });

    if (existingBrand) {
      throw new ConflictError(
        `Brand with code '${code}' already exists in this chain`
      );
    }
  }
}
