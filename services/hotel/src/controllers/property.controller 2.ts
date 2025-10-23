/**
 * Property Controller - Handles property management API endpoints
 */

import { PrismaClient } from '@/generated/prisma-client';
import { PropertyService } from '@/services/property.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export class PropertyController {
  private propertyService: PropertyService;

  constructor(prisma: PrismaClient) {
    this.propertyService = new PropertyService(prisma);
  }

  /**
   * Create a new property
   */
  async createProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const property = await this.propertyService.createProperty(req.body);

      res.status(201).json({
        success: true,
        data: property,
        message: 'Property created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get property by ID
   */
  async getProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const property = await this.propertyService.getProperty(id);

      res.json({
        success: true,
        data: property,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all properties with filtering
   */
  async getProperties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        ownerId,
        category,
        status,
        city,
        country,
        starRating,
        amenities,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const filters = {
        ...(ownerId && { ownerId: ownerId as string }),
        ...(category && { category: category as any }),
        ...(status && { status: status as any }),
        ...(city && { city: city as string }),
        ...(country && { country: country as string }),
        ...(starRating && { starRating: parseInt(starRating as string) }),
        ...(amenities && {
          amenities: Array.isArray(amenities)
            ? (amenities as string[])
            : [amenities as string],
        }),
      };

      const options = {
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(sortBy && { sortBy: sortBy as string }),
        ...(sortOrder && { sortOrder: sortOrder as 'asc' | 'desc' }),
      };

      const result = await this.propertyService.getProperties(filters, options);

      res.json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update property
   */
  async updateProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      const property = await this.propertyService.updateProperty(id, req.body);

      res.json({
        success: true,
        data: property,
        message: 'Property updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete property
   */
  async deleteProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { id } = req.params;
      await this.propertyService.deleteProperty(id);

      res.json({
        success: true,
        message: 'Property deleted successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search properties
   */
  async searchProperties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        q: query,
        ownerId,
        category,
        status,
        page,
        limit,
      } = req.query;

      if (!query) {
        throw new ValidationError('Search query is required');
      }

      const filters = {
        ...(ownerId && { ownerId: ownerId as string }),
        ...(category && { category: category as any }),
        ...(status && { status: status as any }),
      };

      const options = {
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      const result = await this.propertyService.searchProperties(
        query as string,
        filters,
        options
      );

      res.json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get properties by owner
   */
  async getPropertiesByOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { ownerId } = req.params;
      const properties = await this.propertyService.getPropertiesByOwner(ownerId);

      res.json({
        success: true,
        data: properties,
        count: properties.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const propertyValidation = {
  createProperty: [
    body('name')
      .isString()
      .notEmpty()
      .withMessage('Property name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('category')
      .isString()
      .notEmpty()
      .withMessage('Category is required'),
    body('address')
      .isObject()
      .withMessage('Address object is required'),
    body('address.street')
      .isString()
      .notEmpty()
      .withMessage('Street address is required'),
    body('address.city')
      .isString()
      .notEmpty()
      .withMessage('City is required'),
    body('address.country')
      .isString()
      .notEmpty()
      .withMessage('Country is required'),
    body('coordinates')
      .isObject()
      .withMessage('Coordinates object is required'),
    body('coordinates.lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    body('coordinates.lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required'),
    body('timezone')
      .isString()
      .notEmpty()
      .withMessage('Timezone is required'),
    body('checkInTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-in time must be in HH:MM format'),
    body('checkOutTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-out time must be in HH:MM format'),
    body('ownerId')
      .isString()
      .notEmpty()
      .withMessage('Owner ID is required'),
    body('amenities')
      .isArray()
      .withMessage('Amenities must be an array'),
    body('images')
      .isArray()
      .withMessage('Images must be an array'),
  ],

  updateProperty: [
    param('id').isString().notEmpty().withMessage('Property ID is required'),
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
    body('coordinates.lat')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    body('coordinates.lng')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required'),
    body('checkInTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-in time must be in HH:MM format'),
    body('checkOutTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-out time must be in HH:MM format'),
  ],

  getProperty: [
    param('id').isString().notEmpty().withMessage('Property ID is required'),
  ],

  deleteProperty: [
    param('id').isString().notEmpty().withMessage('Property ID is required'),
  ],

  getPropertiesByOwner: [
    param('ownerId')
      .isString()
      .notEmpty()
      .withMessage('Owner ID is required'),
  ],

  searchProperties: [
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

  getProperties: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be 1-100'),
    query('starRating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Star rating must be 1-5'),
  ],
};