// @ts-nocheck
/**
 * Property Service - Handles property management operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  ConflictError,
  NotFoundError,
  PropertyCategory,
  PropertyStatus,
  ValidationError,
} from '@/types';
import logger from '@/utils/logger';

export interface CreatePropertyRequest {
  name: string;
  slug?: string; // Auto-generated if not provided
  description: string;
  category: PropertyCategory;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  starRating?: number;
  amenities: string[];
  policies: {
    cancellationPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  email?: string;
  phone?: string;
  website?: string;
  contactInfo: Record<string, unknown>; // Additional contact details
  checkInTime: string;
  checkOutTime: string;
  images: Array<{ url: string; alt?: string; caption?: string }>;
  virtualTour?: string;
  ownerId: string;
  chainId?: string;
  brandId?: string;
  taxId?: string;
  currency?: string;
  settings: {
    language: string;
    timezone: string;
  };
}

export interface UpdatePropertyRequest {
  name?: string;
  slug?: string;
  description?: string;
  category?: PropertyCategory;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  timezone?: string;
  starRating?: number;
  amenities?: string[];
  policies?: {
    cancellationPolicy?: string;
    petPolicy?: string;
    smokingPolicy?: string;
  };
  email?: string;
  phone?: string;
  website?: string;
  contactInfo?: Record<string, unknown>;
  checkInTime?: string;
  checkOutTime?: string;
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  virtualTour?: string;
  chainId?: string;
  brandId?: string;
  taxId?: string;
  currency?: string;
  settings?: {
    language?: string;
    timezone?: string;
  };
  status?: PropertyStatus;
}

export interface PropertySearchFilters {
  category?: PropertyCategory;
  status?: PropertyStatus;
  ownerId?: string;
  chainId?: string;
  city?: string;
  country?: string;
  starRating?: number;
  amenities?: string[];
}

export class PropertyService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new property
   */
  async createProperty(request: CreatePropertyRequest) {
    try {
      logger.info('Creating property', {
        name: request.name,
        ownerId: request.ownerId,
      });

      // Validate request
      await this.validatePropertyRequest(request);

      // Generate slug if not provided
      const slug = request.slug || this.generateSlug(request.name);

      // Check for duplicate slug
      await this.checkDuplicateSlug(slug);

      // Check for duplicate property names for the same owner
      await this.checkDuplicateProperty(request.name, request.ownerId);

      const property = await this.prisma.property.create({
        data: {
          name: request.name,
          slug,
          description: request.description,
          category: request.category,
          address: request.address,
          coordinates: request.coordinates,
          timezone: request.timezone,
          starRating: request.starRating,
          amenities: request.amenities,
          policies: request.policies,
          email: request.email,
          phone: request.phone,
          website: request.website,
          contactInfo: request.contactInfo,
          checkInTime: request.checkInTime,
          checkOutTime: request.checkOutTime,
          images: request.images,
          virtualTour: request.virtualTour,
          ownerId: request.ownerId,
          chainId: request.chainId,
          brandId: request.brandId,
          taxId: request.taxId,
          currency: request.currency || 'USD',
          settings: request.settings,
          status: PropertyStatus.ACTIVE,
        },
      });

      logger.info('Property created successfully', {
        propertyId: property.id,
        name: property.name,
        slug: property.slug,
      });

      return property;
    } catch (error) {
      logger.error('Error creating property', { error, request });
      throw error;
    }
  }

  /**
   * Get property by ID
   */
  async getProperty(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        roomTypes: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            roomTypes: true,
            bookings: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundError('Property', id);
    }

    return property;
  }

  /**
   * Get all properties with filtering and pagination
   */
  async getProperties(
    filters: PropertySearchFilters = {},
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
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters.chainId) {
      where.chainId = filters.chainId;
    }

    if (filters.city) {
      where.address = {
        path: ['city'],
        equals: filters.city,
      };
    }

    if (filters.country) {
      where.address = {
        ...(where.address as Record<string, unknown>),
        path: ['country'],
        equals: filters.country,
      };
    }

    if (filters.starRating) {
      where.starRating = filters.starRating;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = {
        array_contains: filters.amenities,
      };
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          _count: {
            select: {
              roomTypes: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update property
   */
  async updateProperty(id: string, request: UpdatePropertyRequest) {
    try {
      logger.info('Updating property', { propertyId: id });

      // Check if property exists
      const existingProperty = await this.prisma.property.findUnique({
        where: { id },
      });

      if (!existingProperty) {
        throw new NotFoundError('Property', id);
      }

      // Check for duplicate name if name is being updated
      if (request.name && request.name !== existingProperty.name) {
        await this.checkDuplicateProperty(
          request.name,
          existingProperty.ownerId,
          id
        );
      }

      // Build update data
      const updateData: Record<string, unknown> = {};

      if (request.name) updateData.name = request.name;
      if (request.slug) {
        await this.checkDuplicateSlug(request.slug, id);
        updateData.slug = request.slug;
      }
      if (request.description) updateData.description = request.description;
      if (request.category) updateData.category = request.category;
      if (request.address) {
        updateData.address = {
          ...(existingProperty.address as Record<string, unknown>),
          ...request.address,
        };
      }
      if (request.coordinates) updateData.coordinates = request.coordinates;
      if (request.timezone) updateData.timezone = request.timezone;
      if (request.starRating !== undefined)
        updateData.starRating = request.starRating;
      if (request.amenities) updateData.amenities = request.amenities;
      if (request.policies) {
        updateData.policies = {
          ...(existingProperty.policies as Record<string, unknown>),
          ...request.policies,
        };
      }
      if (request.email !== undefined) updateData.email = request.email;
      if (request.phone !== undefined) updateData.phone = request.phone;
      if (request.website !== undefined) updateData.website = request.website;
      if (request.contactInfo) {
        updateData.contactInfo = {
          ...(existingProperty.contactInfo as Record<string, unknown>),
          ...request.contactInfo,
        };
      }
      if (request.checkInTime) updateData.checkInTime = request.checkInTime;
      if (request.checkOutTime) updateData.checkOutTime = request.checkOutTime;
      if (request.images) updateData.images = request.images;
      if (request.virtualTour !== undefined)
        updateData.virtualTour = request.virtualTour;
      if (request.chainId !== undefined) updateData.chainId = request.chainId;
      if (request.brandId !== undefined) updateData.brandId = request.brandId;
      if (request.taxId !== undefined) updateData.taxId = request.taxId;
      if (request.currency) updateData.currency = request.currency;
      if (request.settings) {
        updateData.settings = {
          ...(existingProperty.settings as Record<string, unknown>),
          ...request.settings,
        };
      }
      if (request.status) updateData.status = request.status;

      const updatedProperty = await this.prisma.property.update({
        where: { id },
        data: updateData,
        include: {
          roomTypes: {
            where: { isActive: true },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              roomTypes: true,
              bookings: true,
            },
          },
        },
      });

      logger.info('Property updated successfully', { propertyId: id });

      return updatedProperty;
    } catch (error) {
      logger.error('Error updating property', { error, propertyId: id });
      throw error;
    }
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string) {
    try {
      logger.info('Deleting property', { propertyId: id });

      // Check if property exists
      const existingProperty = await this.prisma.property.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              roomTypes: true,
              bookings: true,
            },
          },
        },
      });

      if (!existingProperty) {
        throw new NotFoundError('Property', id);
      }

      // Check if property has active bookings
      if (existingProperty._count.bookings > 0) {
        throw new ConflictError(
          'Cannot delete property with existing bookings. Please cancel all bookings first.'
        );
      }

      // Soft delete by updating status
      await this.prisma.property.update({
        where: { id },
        data: {
          status: PropertyStatus.INACTIVE,
        },
      });

      logger.info('Property deleted successfully', { propertyId: id });
    } catch (error) {
      logger.error('Error deleting property', { error, propertyId: id });
      throw error;
    }
  }

  /**
   * Search properties by text
   */
  async searchProperties(
    query: string,
    filters: PropertySearchFilters = {},
    options: {
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Build where clause with text search
    const where: Record<string, unknown> = {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    };

    // Apply additional filters
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.ownerId) where.ownerId = filters.ownerId;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          _count: {
            select: {
              roomTypes: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get properties by owner
   */
  async getPropertiesByOwner(ownerId: string) {
    return this.prisma.property.findMany({
      where: {
        ownerId,
        status: PropertyStatus.ACTIVE,
      },
      include: {
        _count: {
          select: {
            roomTypes: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Validate property request
   */
  private validatePropertyRequest(request: CreatePropertyRequest) {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Property name is required');
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new ValidationError('Property description is required');
    }

    if (!Object.values(PropertyCategory).includes(request.category)) {
      throw new ValidationError(
        `Invalid property category: ${request.category}`
      );
    }

    if (!request.address || !request.address.street || !request.address.city) {
      throw new ValidationError('Complete address is required');
    }

    if (
      !request.coordinates ||
      typeof request.coordinates.lat !== 'number' ||
      typeof request.coordinates.lng !== 'number'
    ) {
      throw new ValidationError('Valid coordinates are required');
    }

    if (!request.timezone) {
      throw new ValidationError('Timezone is required');
    }

    if (!request.ownerId) {
      throw new ValidationError('Owner ID is required');
    }

    if (
      request.starRating &&
      (request.starRating < 1 || request.starRating > 5)
    ) {
      throw new ValidationError('Star rating must be between 1 and 5');
    }

    if (!request.checkInTime || !request.checkOutTime) {
      throw new ValidationError('Check-in and check-out times are required');
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(request.checkInTime)) {
      throw new ValidationError('Check-in time must be in HH:MM format');
    }
    if (!timeRegex.test(request.checkOutTime)) {
      throw new ValidationError('Check-out time must be in HH:MM format');
    }
  }

  /**
   * Check for duplicate property names
   */
  private async checkDuplicateProperty(
    name: string,
    ownerId: string,
    excludeId?: string
  ) {
    const where: Record<string, unknown> = {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      ownerId,
      status: PropertyStatus.ACTIVE,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingProperty = await this.prisma.property.findFirst({ where });

    if (existingProperty) {
      throw new ConflictError(
        `Property with name '${name}' already exists for this owner`
      );
    }
  }

  /**
   * Check for duplicate slug
   */
  private async checkDuplicateSlug(slug: string, excludeId?: string) {
    const where: Record<string, unknown> = {
      slug,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingProperty = await this.prisma.property.findFirst({ where });

    if (existingProperty) {
      throw new ConflictError(`Property with slug '${slug}' already exists`);
    }
  }

  /**
   * Generate URL-friendly slug from property name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}
