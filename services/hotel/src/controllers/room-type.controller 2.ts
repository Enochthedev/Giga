/**
 * Room Type Controller - Handles room type management API endpoints
 */

import { PrismaClient } from '@/generated/prisma-client';
import { RoomTypeService } from '@/services/room-type.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export class RoomTypeController {
  private roomTypeService: RoomTypeService;

  constructor(prisma: PrismaClient) {
    this.roomTypeService = new RoomTypeService(prisma);
  }

  /**
   * Create a new room type for a specific property
   */
  async createRoomTypeForProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;

      // Ensure the propertyId in the request body matches the URL parameter
      const roomTypeData = {
        ...req.body,
        propertyId,
      };

      const roomType = await this.roomTypeService.createRoomType(roomTypeData);

      res.status(201).json({
        success: true,
        data: roomType,
        message: 'Room type created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get room type by ID within a property (with ownership validation)
   */
  async getRoomTypeInProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, roomTypeId } = req.params;
      const roomType = await this.roomTypeService.getRoomTypeInProperty(
        roomTypeId,
        propertyId
      );

      res.json({
        success: true,
        data: roomType,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  // REMOVED: Generic getRoomTypes method - room types should always be accessed via property context

  /**
   * Get room types by property
   */
  async getRoomTypesByProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const { includeInactive } = req.query;

      const roomTypes = await this.roomTypeService.getRoomTypesByProperty(
        propertyId,
        includeInactive === 'true'
      );

      res.json({
        success: true,
        data: roomTypes,
        count: roomTypes.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update room type within a property (with ownership validation)
   */
  async updateRoomTypeInProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, roomTypeId } = req.params;
      const roomType = await this.roomTypeService.updateRoomTypeInProperty(
        roomTypeId,
        propertyId,
        req.body
      );

      res.json({
        success: true,
        data: roomType,
        message: 'Room type updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete room type within a property (with ownership validation)
   */
  async deleteRoomTypeInProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, roomTypeId } = req.params;
      await this.roomTypeService.deleteRoomTypeInProperty(
        roomTypeId,
        propertyId
      );

      res.json({
        success: true,
        message: 'Room type deleted successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search room types within a specific property
   */
  async searchRoomTypesInProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId } = req.params;
      const { q: query, category, isActive, page, limit } = req.query;

      if (!query) {
        throw new ValidationError('Search query is required');
      }

      const filters = {
        propertyId, // Always filter by the property from URL
        ...(category && { category: category as any }),
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
      };

      const options = {
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      const result = await this.roomTypeService.searchRoomTypes(
        query as string,
        filters,
        options
      );

      res.json({
        success: true,
        data: result.roomTypes,
        pagination: result.pagination,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const roomTypeValidation = {
  createRoomTypeForProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Room type name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('category').isString().notEmpty().withMessage('Category is required'),
    body('maxOccupancy')
      .isInt({ min: 1 })
      .withMessage('Max occupancy must be at least 1'),
    body('maxAdults')
      .isInt({ min: 1 })
      .withMessage('Max adults must be at least 1'),
    body('maxChildren')
      .isInt({ min: 0 })
      .withMessage('Max children must be non-negative'),
    body('bedConfiguration')
      .isArray({ min: 1 })
      .withMessage('Bed configuration is required'),
    body('roomSize')
      .isFloat({ min: 0.1 })
      .withMessage('Room size must be greater than 0'),
    body('roomSizeUnit')
      .isString()
      .notEmpty()
      .withMessage('Room size unit is required'),
    body('totalRooms')
      .isInt({ min: 1 })
      .withMessage('Total rooms must be at least 1'),
    body('baseRate')
      .isFloat({ min: 0.01 })
      .withMessage('Base rate must be greater than 0'),
    body('currency').isString().notEmpty().withMessage('Currency is required'),
    body('amenities').isArray().withMessage('Amenities must be an array'),
    body('images').isArray().withMessage('Images must be an array'),
  ],

  updateRoomTypeInProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    param('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('maxOccupancy')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Max occupancy must be at least 1'),
    body('maxAdults')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Max adults must be at least 1'),
    body('maxChildren')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Max children must be non-negative'),
    body('roomSize')
      .optional()
      .isFloat({ min: 0.1 })
      .withMessage('Room size must be greater than 0'),
    body('totalRooms')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Total rooms must be at least 1'),
    body('baseRate')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Base rate must be greater than 0'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],

  getRoomTypeInProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    param('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
  ],

  deleteRoomTypeInProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    param('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
  ],

  getRoomTypesByProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    query('includeInactive')
      .optional()
      .isBoolean()
      .withMessage('includeInactive must be a boolean'),
  ],

  searchRoomTypesInProperty: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    query('q').isString().notEmpty().withMessage('Search query is required'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be 1-100'),
  ],
};
