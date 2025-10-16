/**
 * Room Type Service - Handles room type management operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  ConflictError,
  NotFoundError,
  RoomCategory,
  RoomSizeUnit,
  ValidationError,
} from '@/types';
import logger from '@/utils/logger';

export interface CreateRoomTypeRequest {
  propertyId: string;
  name: string;
  description: string;
  category: RoomCategory;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  bedConfiguration: {
    type: string;
    quantity: number;
  }[];
  roomSize: number;
  roomSizeUnit: RoomSizeUnit;
  amenities: string[];
  view?: string;
  floor?: string;
  totalRooms: number;
  baseRate: number;
  currency: string;
  images: Array<{ url: string; alt?: string; caption?: string }>;
}

export interface UpdateRoomTypeRequest {
  name?: string;
  description?: string;
  category?: RoomCategory;
  maxOccupancy?: number;
  maxAdults?: number;
  maxChildren?: number;
  bedConfiguration?: {
    type: string;
    quantity: number;
  }[];
  roomSize?: number;
  roomSizeUnit?: RoomSizeUnit;
  amenities?: string[];
  view?: string;
  floor?: string;
  totalRooms?: number;
  baseRate?: number;
  currency?: string;
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  isActive?: boolean;
}

export interface RoomTypeFilters {
  propertyId?: string;
  category?: RoomCategory;
  maxOccupancy?: number;
  minRate?: number;
  maxRate?: number;
  amenities?: string[];
  isActive?: boolean;
}

export class RoomTypeService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new room type
   */
  async createRoomType(request: CreateRoomTypeRequest) {
    try {
      logger.info('Creating room type', {
        name: request.name,
        propertyId: request.propertyId,
      });

      // Validate request
      await this.validateRoomTypeRequest(request);

      // Check if property exists
      await this.validatePropertyExists(request.propertyId);

      // Check for duplicate room type names within the property
      await this.checkDuplicateRoomType(request.name, request.propertyId);

      const roomType = await this.prisma.roomType.create({
        data: {
          propertyId: request.propertyId,
          name: request.name,
          description: request.description,
          category: request.category,
          maxOccupancy: request.maxOccupancy,
          maxAdults: request.maxAdults,
          maxChildren: request.maxChildren,
          bedConfiguration: request.bedConfiguration,
          roomSize: request.roomSize,
          roomSizeUnit: request.roomSizeUnit,
          amenities: request.amenities,
          view: request.view,
          floor: request.floor,
          totalRooms: request.totalRooms,
          baseRate: request.baseRate,
          currency: request.currency,
          images: request.images,
          isActive: true,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      logger.info('Room type created successfully', {
        roomTypeId: roomType.id,
        name: roomType.name,
      });

      return roomType;
    } catch (error) {
      logger.error('Error creating room type', { error, request });
      throw error;
    }
  }

  // REMOVED: Duplicate method - using the one at the end of the class

  /**
   * Get all room types with filtering
   */
  async getRoomTypes(
    filters: RoomTypeFilters = {},
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
    const where: any = {};

    if (filters.propertyId) {
      where.propertyId = filters.propertyId;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.maxOccupancy) {
      where.maxOccupancy = {
        gte: filters.maxOccupancy,
      };
    }

    if (filters.minRate || filters.maxRate) {
      where.baseRate = {};
      if (filters.minRate) where.baseRate.gte = filters.minRate;
      if (filters.maxRate) where.baseRate.lte = filters.maxRate;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      where.amenities = {
        array_contains: filters.amenities,
      };
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [roomTypes, total] = await Promise.all([
      this.prisma.roomType.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookedRooms: true,
              inventory: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.roomType.count({ where }),
    ]);

    return {
      roomTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get room types by property
   */
  async getRoomTypesByProperty(propertyId: string, includeInactive = false) {
    const where: any = { propertyId };

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.prisma.roomType.findMany({
      where,
      include: {
        _count: {
          select: {
            bookedRooms: true,
            inventory: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Update room type
   */
  async updateRoomType(id: string, request: UpdateRoomTypeRequest) {
    try {
      logger.info('Updating room type', { roomTypeId: id });

      // Check if room type exists
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id },
      });

      if (!existingRoomType) {
        throw new NotFoundError('Room type', id);
      }

      // Check for duplicate name if name is being updated
      if (request.name && request.name !== existingRoomType.name) {
        await this.checkDuplicateRoomType(
          request.name,
          existingRoomType.propertyId,
          id
        );
      }

      // Build update data
      const updateData: any = {};

      if (request.name) updateData.name = request.name;
      if (request.description) updateData.description = request.description;
      if (request.category) updateData.category = request.category;
      if (request.maxOccupancy) updateData.maxOccupancy = request.maxOccupancy;
      if (request.bedConfiguration)
        updateData.bedConfiguration = request.bedConfiguration;
      if (request.roomSize) updateData.roomSize = request.roomSize;
      if (request.roomSizeUnit) updateData.roomSizeUnit = request.roomSizeUnit;
      if (request.amenities) updateData.amenities = request.amenities;
      if (request.view !== undefined) updateData.view = request.view;
      if (request.floor !== undefined) updateData.floor = request.floor;
      if (request.totalRooms) updateData.totalRooms = request.totalRooms;
      if (request.baseRate) updateData.baseRate = request.baseRate;
      if (request.currency) updateData.currency = request.currency;
      if (request.images) updateData.images = request.images;
      if (request.isActive !== undefined)
        updateData.isActive = request.isActive;

      const updatedRoomType = await this.prisma.roomType.update({
        where: { id },
        data: updateData,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookedRooms: true,
              inventory: true,
              rates: true,
            },
          },
        },
      });

      logger.info('Room type updated successfully', { roomTypeId: id });

      return updatedRoomType;
    } catch (error) {
      logger.error('Error updating room type', { error, roomTypeId: id });
      throw error;
    }
  }

  /**
   * Delete room type
   */
  async deleteRoomType(id: string) {
    try {
      logger.info('Deleting room type', { roomTypeId: id });

      // Check if room type exists
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              bookedRooms: true,
            },
          },
        },
      });

      if (!existingRoomType) {
        throw new NotFoundError('Room type', id);
      }

      // Check if room type has active bookings
      if (existingRoomType._count.bookedRooms > 0) {
        throw new ConflictError(
          'Cannot delete room type with existing bookings. Please deactivate instead.'
        );
      }

      // Soft delete by deactivating
      await this.prisma.roomType.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      logger.info('Room type deleted successfully', { roomTypeId: id });
    } catch (error) {
      logger.error('Error deleting room type', { error, roomTypeId: id });
      throw error;
    }
  }

  /**
   * Search room types
   */
  async searchRoomTypes(
    query: string,
    filters: RoomTypeFilters = {},
    options: {
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Build where clause with text search
    const where: any = {
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
    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.category) where.category = filters.category;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const [roomTypes, total] = await Promise.all([
      this.prisma.roomType.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookedRooms: true,
              inventory: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.roomType.count({ where }),
    ]);

    return {
      roomTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Validate room type request
   */
  private async validateRoomTypeRequest(request: CreateRoomTypeRequest) {
    if (!request.name || request.name.trim().length === 0) {
      throw new ValidationError('Room type name is required');
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new ValidationError('Room type description is required');
    }

    if (!Object.values(RoomCategory).includes(request.category)) {
      throw new ValidationError(`Invalid room category: ${request.category}`);
    }

    if (!request.maxOccupancy || request.maxOccupancy < 1) {
      throw new ValidationError('Max occupancy must be at least 1');
    }

    if (!request.bedConfiguration || request.bedConfiguration.length === 0) {
      throw new ValidationError('Bed configuration is required');
    }

    if (!request.roomSize || request.roomSize <= 0) {
      throw new ValidationError('Room size must be greater than 0');
    }

    if (!Object.values(RoomSizeUnit).includes(request.roomSizeUnit)) {
      throw new ValidationError(
        `Invalid room size unit: ${request.roomSizeUnit}`
      );
    }

    if (!request.totalRooms || request.totalRooms < 1) {
      throw new ValidationError('Total rooms must be at least 1');
    }

    if (!request.baseRate || request.baseRate <= 0) {
      throw new ValidationError('Base rate must be greater than 0');
    }

    if (!request.currency) {
      throw new ValidationError('Currency is required');
    }

    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }
  }

  /**
   * Validate property exists
   */
  private async validatePropertyExists(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', propertyId);
    }
  }

  /**
   * Check for duplicate room type names within property
   */
  private async checkDuplicateRoomType(
    name: string,
    propertyId: string,
    excludeId?: string
  ) {
    const where: any = {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      propertyId,
      isActive: true,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existingRoomType = await this.prisma.roomType.findFirst({ where });

    if (existingRoomType) {
      throw new ConflictError(
        `Room type with name '${name}' already exists in this property`
      );
    }
  }

  /**
   * Get room type by ID with property ownership validation
   */
  async getRoomTypeInProperty(roomTypeId: string, propertyId: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: {
            bookedRooms: true,
            inventory: true,
            rates: true,
          },
        },
      },
    });

    if (!roomType) {
      throw new NotFoundError('Room type', roomTypeId);
    }

    // Validate that the room type belongs to the specified property
    if (roomType.propertyId !== propertyId) {
      throw new ValidationError(
        `Room type ${roomTypeId} does not belong to property ${propertyId}`
      );
    }

    return roomType;
  }

  /**
   * Update room type with property ownership validation
   */
  async updateRoomTypeInProperty(
    roomTypeId: string,
    propertyId: string,
    request: UpdateRoomTypeRequest
  ) {
    try {
      logger.info('Updating room type', { roomTypeId, propertyId });

      // Check if room type exists and belongs to the property
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id: roomTypeId },
      });

      if (!existingRoomType) {
        throw new NotFoundError('Room type', roomTypeId);
      }

      // Validate property ownership
      if (existingRoomType.propertyId !== propertyId) {
        throw new ValidationError(
          `Room type ${roomTypeId} does not belong to property ${propertyId}`
        );
      }

      // Check for duplicate name within the same property if name is being updated
      if (request.name && request.name !== existingRoomType.name) {
        await this.checkDuplicateRoomType(request.name, propertyId, roomTypeId);
      }

      // Build update data
      const updateData: any = {};

      if (request.name) updateData.name = request.name;
      if (request.description) updateData.description = request.description;
      if (request.category) updateData.category = request.category;
      if (request.maxOccupancy) updateData.maxOccupancy = request.maxOccupancy;
      if (request.maxAdults) updateData.maxAdults = request.maxAdults;
      if (request.maxChildren !== undefined)
        updateData.maxChildren = request.maxChildren;
      if (request.bedConfiguration)
        updateData.bedConfiguration = request.bedConfiguration;
      if (request.roomSize) updateData.roomSize = request.roomSize;
      if (request.roomSizeUnit) updateData.roomSizeUnit = request.roomSizeUnit;
      if (request.amenities) updateData.amenities = request.amenities;
      if (request.view !== undefined) updateData.view = request.view;
      if (request.floor !== undefined) updateData.floor = request.floor;
      if (request.totalRooms) updateData.totalRooms = request.totalRooms;
      if (request.baseRate) updateData.baseRate = request.baseRate;
      if (request.currency) updateData.currency = request.currency;
      if (request.images) updateData.images = request.images;
      if (request.isActive !== undefined)
        updateData.isActive = request.isActive;

      const updatedRoomType = await this.prisma.roomType.update({
        where: { id: roomTypeId },
        data: updateData,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          _count: {
            select: {
              bookedRooms: true,
              inventory: true,
              rates: true,
            },
          },
        },
      });

      logger.info('Room type updated successfully', { roomTypeId, propertyId });

      return updatedRoomType;
    } catch (error) {
      logger.error('Error updating room type', {
        error,
        roomTypeId,
        propertyId,
      });
      throw error;
    }
  }

  /**
   * Delete room type with property ownership validation
   */
  async deleteRoomTypeInProperty(roomTypeId: string, propertyId: string) {
    try {
      logger.info('Deleting room type', { roomTypeId, propertyId });

      // Check if room type exists and belongs to the property
      const existingRoomType = await this.prisma.roomType.findUnique({
        where: { id: roomTypeId },
        include: {
          _count: {
            select: {
              bookedRooms: true,
            },
          },
        },
      });

      if (!existingRoomType) {
        throw new NotFoundError('Room type', roomTypeId);
      }

      // Validate property ownership
      if (existingRoomType.propertyId !== propertyId) {
        throw new ValidationError(
          `Room type ${roomTypeId} does not belong to property ${propertyId}`
        );
      }

      // Check if room type has active bookings
      if (existingRoomType._count.bookedRooms > 0) {
        throw new ConflictError(
          'Cannot delete room type with existing bookings. Please deactivate instead.'
        );
      }

      // Soft delete by setting isActive to false
      await this.prisma.roomType.update({
        where: { id: roomTypeId },
        data: {
          isActive: false,
        },
      });

      logger.info('Room type deleted successfully', { roomTypeId, propertyId });
    } catch (error) {
      logger.error('Error deleting room type', {
        error,
        roomTypeId,
        propertyId,
      });
      throw error;
    }
  }
}
