/**
 * Chain Service - Handles hotel chain management operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import { Chain, CreateChainRequest } from '@/types';
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
interface ChainSearchCriteria {
  query?: string;
  isActive?: boolean;
  country?: string;
}

interface UpdateChainRequest {
  name?: string;
  description?: string;
  code?: string;
  contactInfo?: any;
  defaultCurrency?: string;
  defaultTimezone?: string;
  chainPolicies?: any;
  isActive?: boolean;
}

export class ChainService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new hotel chain
   */
  async createChain(request: CreateChainRequest): Promise<Chain> {
    try {
      logger.info('Creating chain', { name: request.name, code: request.code });

      // Validate request
      this.validateChainRequest(request);

      // Check for duplicate code
      await this.checkDuplicateCode(request.code);

      const chain = await this.prisma.chain.create({
        data: {
          name: request.name,
          description: request.description,
          code: request.code.toUpperCase(),
          contactInfo: request.contactInfo,
          defaultCurrency: request.defaultCurrency || 'USD',
          defaultTimezone: request.defaultTimezone || 'UTC',
          chainPolicies: request.chainPolicies || {},
        },
        include: {
          _count: {
            select: {
              brands: true,
              properties: true,
            },
          },
        },
      });

      logger.info('Chain created successfully', {
        chainId: chain.id,
        name: chain.name,
        code: chain.code,
      });

      return chain as Chain;
    } catch (error) {
      logger.error('Error creating chain', { error, request });
      throw error;
    }
  }

  /**
   * Get chain by ID
   */
  async getChain(id: string): Promise<Chain> {
    const chain = await this.prisma.chain.findUnique({
      where: { id },
      include: {
        brands: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        properties: {
          where: { status: 'active' },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            brands: true,
            properties: true,
          },
        },
      },
    });

    if (!chain) {
      throw new NotFoundError('Chain', id);
    }

    return chain as Chain;
  } /**

   * Get all chains with filtering and pagination
   */
  async getChains(
    criteria: ChainSearchCriteria = {},
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

    if (criteria.isActive !== undefined) {
      where.isActive = criteria.isActive;
    }

    const [chains, total] = await Promise.all([
      this.prisma.chain.findMany({
        where,
        include: {
          _count: {
            select: {
              brands: true,
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
      this.prisma.chain.count({ where }),
    ]);

    return {
      chains: chains as Chain[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update chain
   */
  async updateChain(id: string, request: UpdateChainRequest): Promise<Chain> {
    try {
      logger.info('Updating chain', { chainId: id });

      // Check if chain exists
      const existingChain = await this.prisma.chain.findUnique({
        where: { id },
      });

      if (!existingChain) {
        throw new NotFoundError('Chain', id);
      }

      // Check for duplicate code if code is being updated
      if (request.code && request.code !== existingChain.code) {
        await this.checkDuplicateCode(request.code, id);
      }

      // Build update data
      const updateData: Record<string, unknown> = {};

      if (request.name) updateData.name = request.name;
      if (request.description !== undefined)
        updateData.description = request.description;
      if (request.code) updateData.code = request.code.toUpperCase();
      if (request.contactInfo) {
        updateData.contactInfo = {
          ...(existingChain.contactInfo as Record<string, unknown>),
          ...request.contactInfo,
        };
      }
      if (request.defaultCurrency)
        updateData.defaultCurrency = request.defaultCurrency;
      if (request.defaultTimezone)
        updateData.defaultTimezone = request.defaultTimezone;
      if (request.chainPolicies) {
        updateData.chainPolicies = {
          ...(existingChain.chainPolicies as Record<string, unknown>),
          ...request.chainPolicies,
        };
      }
      if (request.isActive !== undefined)
        updateData.isActive = request.isActive;

      const updatedChain = await this.prisma.chain.update({
        where: { id },
        data: updateData,
        include: {
          brands: {
            where: { isActive: true },
            orderBy: { name: 'asc' },
          },
          properties: {
            where: { status: 'active' },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              brands: true,
              properties: true,
            },
          },
        },
      });

      logger.info('Chain updated successfully', { chainId: id });

      return updatedChain as Chain;
    } catch (error) {
      logger.error('Error updating chain', { error, chainId: id });
      throw error;
    }
  }

  /**
   * Delete chain (soft delete)
   */
  async deleteChain(id: string): Promise<void> {
    try {
      logger.info('Deleting chain', { chainId: id });

      // Check if chain exists
      const existingChain = await this.prisma.chain.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              brands: true,
              properties: true,
            },
          },
        },
      });

      if (!existingChain) {
        throw new NotFoundError('Chain', id);
      }

      // Check if chain has active brands or properties
      if (
        existingChain._count.brands > 0 ||
        existingChain._count.properties > 0
      ) {
        throw new ConflictError(
          'Cannot delete chain with active brands or properties. Please deactivate them first.'
        );
      }

      // Soft delete by updating status
      await this.prisma.chain.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      logger.info('Chain deleted successfully', { chainId: id });
    } catch (error) {
      logger.error('Error deleting chain', { error, chainId: id });
      throw error;
    }
  }

  /**
   * Validate chain request
   */
  private validateChainRequest(request: CreateChainRequest): void {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Chain name is required');
    }

    if (!request.code || request.code.trim().length === 0) {
      throw new ValidationError('Chain code is required');
    }

    if (request.code.length < 2 || request.code.length > 10) {
      throw new ValidationError(
        'Chain code must be between 2 and 10 characters'
      );
    }

    if (!request.contactInfo || !request.contactInfo.email) {
      throw new ValidationError('Contact information with email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.contactInfo.email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  /**
   * Check for duplicate chain code
   */
  private async checkDuplicateCode(
    code: string,
    excludeId?: string
  ): Promise<void> {
    const where: Record<string, unknown> = {
      code: code.toUpperCase(),
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingChain = await this.prisma.chain.findFirst({ where });

    if (existingChain) {
      throw new ConflictError(`Chain with code '${code}' already exists`);
    }
  }
}
