/**
 * Hotel Controller - Public-facing hotel discovery and search
 * Maps to Property entity but provides customer-focused API
 */

import { PrismaClient } from '@/generated/prisma-client';
import { PropertyService } from '@/services/property.service';
import { PropertyCategory, PropertyStatus } from '@/types';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

export class HotelController {
  private propertyService: PropertyService;

  constructor(prisma: PrismaClient) {
    this.propertyService = new PropertyService(prisma);
  }

  /**
   * Get list of hotels with filters
   * GET /api/hotels
   */
  async getHotels(
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
        location,
        city,
        country,
        category,
        starRating,
        minPrice,
        maxPrice,
        amenities,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const filters = {
        status: PropertyStatus.ACTIVE, // Only show active properties
        ...(city && { city: city as string }),
        ...(country && { country: country as string }),
        ...(category && { category: category as PropertyCategory }),
        ...(starRating && { starRating: parseInt(starRating as string) }),
        ...(amenities && {
          amenities: Array.isArray(amenities)
            ? (amenities as string[])
            : [amenities as string],
        }),
      };

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        sortBy: (sortBy as string) || 'name',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
      };

      const result = await this.propertyService.getProperties(filters, options);

      // Transform properties to hotel format for public API
      const hotels = result.properties.map(property => ({
        id: property.id,
        slug: property.slug,
        name: property.name,
        description: property.description,
        category: property.category,
        starRating: property.starRating,
        address: property.address,
        coordinates: property.coordinates,
        images: property.images,
        amenities: property.amenities,
        currency: property.currency,
        checkInTime: property.checkInTime,
        checkOutTime: property.checkOutTime,
        email: property.email,
        phone: property.phone,
        website: property.website,
        // Add computed fields
        roomCount: property._count?.roomTypes || 0,
        reviewCount: 0, // TODO: Add reviews count when reviews are implemented
        // Don't expose internal fields like ownerId, settings, etc.
      }));

      res.json({
        success: true,
        data: hotels,
        pagination: result.pagination,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get hotels near user's location
   * GET /api/hotels/nearby
   */
  async getNearbyHotels(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { lat, lng, radius = 10, limit = 20 } = req.query;

      if (!lat || !lng) {
        throw new ValidationError('Latitude and longitude are required');
      }

      // TODO: Implement geospatial search
      // For now, return all hotels (would need PostGIS or similar for proper geo search)
      const result = await this.propertyService.getProperties(
        { status: PropertyStatus.ACTIVE },
        { limit: parseInt(limit as string) }
      );

      const hotels = result.properties.map(property => ({
        id: property.id,
        slug: property.slug,
        name: property.name,
        description: property.description,
        starRating: property.starRating,
        address: property.address,
        coordinates: property.coordinates,
        images: property.images,
        // Calculate distance (placeholder - would need proper geo calculation)
        distance: Math.random() * 10, // km
        currency: property.currency,
      }));

      res.json({
        success: true,
        data: hotels,
        location: {
          lat: parseFloat(lat as string),
          lng: parseFloat(lng as string),
        },
        radius: parseInt(radius as string),
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific hotel details
   * GET /api/hotels/{hotelId}
   */
  async getHotel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { hotelId } = req.params;
      const property = await this.propertyService.getProperty(hotelId);

      // Transform to public hotel format
      const hotel = {
        id: property.id,
        slug: property.slug,
        name: property.name,
        description: property.description,
        category: property.category,
        starRating: property.starRating,
        address: property.address,
        coordinates: property.coordinates,
        timezone: property.timezone,
        images: property.images,
        virtualTour: property.virtualTour,
        amenities: property.amenities,
        policies: property.policies,
        currency: property.currency,
        checkInTime: property.checkInTime,
        checkOutTime: property.checkOutTime,
        email: property.email,
        phone: property.phone,
        website: property.website,
        roomTypes: property.roomTypes?.map(roomType => ({
          id: roomType.id,
          name: roomType.name,
          description: roomType.description,
          category: roomType.category,
          maxOccupancy: roomType.maxOccupancy,
          maxAdults: roomType.maxAdults,
          maxChildren: roomType.maxChildren,
          roomSize: roomType.roomSize,
          roomSizeUnit: roomType.roomSizeUnit,
          amenities: roomType.amenities,
          view: roomType.view,
          images: roomType.images,
          baseRate: roomType.baseRate,
          currency: roomType.currency,
        })),
        stats: {
          roomCount: property._count?.roomTypes || 0,
          reviewCount: 0, // TODO: Add reviews count when reviews are implemented
          bookingCount: property._count?.bookings || 0,
        },
      };

      res.json({
        success: true,
        data: hotel,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search hotels with query parameters
   * GET /api/hotels/search
   */
  async searchHotels(
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
        location,
        checkIn,
        checkOut,
        guests,
        rooms,
        category,
        starRating,
        minPrice,
        maxPrice,
        amenities,
        page,
        limit,
      } = req.query;

      if (!query) {
        throw new ValidationError('Search query is required');
      }

      const filters = {
        status: 'active',
        ...(location && { city: location as string }),
        ...(category && { category: category as string }),
        ...(starRating && { starRating: parseInt(starRating as string) }),
        ...(amenities && {
          amenities: Array.isArray(amenities)
            ? (amenities as string[])
            : [amenities as string],
        }),
      };

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      };

      const result = await this.propertyService.searchProperties(
        query as string,
        filters as any,
        options
      );

      const hotels = result.properties.map(property => ({
        id: property.id,
        slug: property.slug,
        name: property.name,
        description: property.description,
        category: property.category,
        starRating: property.starRating,
        address: property.address,
        coordinates: property.coordinates,
        images: property.images,
        amenities: property.amenities,
        currency: property.currency,
        roomCount: property._count?.roomTypes || 0,
        reviewCount: 0, // TODO: Add reviews count when reviews are implemented
      }));

      res.json({
        success: true,
        data: hotels,
        pagination: result.pagination,
        searchParams: {
          query,
          location,
          checkIn,
          checkOut,
          guests: guests ? parseInt(guests as string) : undefined,
          rooms: rooms ? parseInt(rooms as string) : undefined,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const hotelValidation = {
  getHotels: [
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
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Min price must be non-negative'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Max price must be non-negative'),
  ],

  getNearbyHotels: [
    query('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    query('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required'),
    query('radius')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Radius must be 1-100 km'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be 1-50'),
  ],

  searchHotels: [
    query('q')
      .isString()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be 1-100'),
    query('guests')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Guests must be positive'),
    query('rooms')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Rooms must be positive'),
  ],
};
