/**
 * Search Controller - Handles hotel search and filtering requests
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  SearchRequest,
  SearchService,
  SearchSortBy,
} from '@/services/search.service';
import { PropertyAmenity, PropertyCategory } from '@/types';
import { ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

export class SearchController {
  private searchService: SearchService;

  constructor(prisma: PrismaClient, redis?: any) {
    this.searchService = new SearchService(prisma, redis);
  }

  /**
   * Comprehensive hotel search
   * GET /api/v1/search/hotels
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
        city,
        country,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        category,
        starRating,
        minPrice,
        maxPrice,
        amenities,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      // Build search request
      const searchRequest: SearchRequest = {
        query: query as string,
        location: {
          ...(city && { city: city as string }),
          ...(country && { country: country as string }),
          ...(location && { city: location as string }),
        },
        ...(checkIn && { checkInDate: new Date(checkIn as string) }),
        ...(checkOut && { checkOutDate: new Date(checkOut as string) }),
        ...(rooms && { rooms: parseInt(rooms as string) }),
        ...(adults && { adults: parseInt(adults as string) }),
        ...(children && { children: parseInt(children as string) }),
        ...(category && { category: category as PropertyCategory }),
        ...(starRating && { starRating: parseInt(starRating as string) }),
        ...(minPrice && { minPrice: parseFloat(minPrice as string) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice as string) }),
        ...(amenities && {
          amenities: Array.isArray(amenities)
            ? (amenities as PropertyAmenity[])
            : [amenities as PropertyAmenity],
        }),
        ...(sortBy && { sortBy: sortBy as SearchSortBy }),
        ...(sortOrder && { sortOrder: sortOrder as 'asc' | 'desc' }),
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      logger.info('Processing hotel search request', { searchRequest });

      const result = await this.searchService.searchHotels(searchRequest);

      res.json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
        metadata: result.searchMetadata,
        facets: result.facets,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search hotels by location with coordinates
   * GET /api/v1/search/nearby
   */
  async searchNearby(
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
        lat,
        lng,
        radius = 10,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        category,
        starRating,
        minPrice,
        maxPrice,
        amenities,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      if (!lat || !lng) {
        throw new ValidationError('Latitude and longitude are required');
      }

      const coordinates = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      };

      const searchOptions: Partial<SearchRequest> = {
        ...(checkIn && { checkInDate: new Date(checkIn as string) }),
        ...(checkOut && { checkOutDate: new Date(checkOut as string) }),
        ...(rooms && { rooms: parseInt(rooms as string) }),
        ...(adults && { adults: parseInt(adults as string) }),
        ...(children && { children: parseInt(children as string) }),
        ...(category && { category: category as PropertyCategory }),
        ...(starRating && { starRating: parseInt(starRating as string) }),
        ...(minPrice && { minPrice: parseFloat(minPrice as string) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice as string) }),
        ...(amenities && {
          amenities: Array.isArray(amenities)
            ? (amenities as PropertyAmenity[])
            : [amenities as PropertyAmenity],
        }),
        ...(sortBy && { sortBy: sortBy as SearchSortBy }),
        ...(sortOrder && { sortOrder: sortOrder as 'asc' | 'desc' }),
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      logger.info('Processing nearby hotel search', {
        coordinates,
        radius: parseInt(radius as string),
        options: searchOptions,
      });

      const result = await this.searchService.searchByLocation(
        coordinates,
        parseInt(radius as string),
        searchOptions
      );

      res.json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
        metadata: {
          ...result.searchMetadata,
          searchLocation: coordinates,
          searchRadius: parseInt(radius as string),
        },
        facets: result.facets,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get search suggestions
   * GET /api/v1/search/suggestions
   */
  async getSearchSuggestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { q: query, limit = 10 } = req.query;

      if (!query) {
        throw new ValidationError('Query parameter is required');
      }

      logger.info('Getting search suggestions', { query, limit });

      const suggestions = await this.searchService.getSearchSuggestions(
        query as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: suggestions,
        query: query as string,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get popular searches
   * GET /api/v1/search/popular
   */
  async getPopularSearches(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      logger.info('Getting popular searches', { limit });

      const popularSearches = await this.searchService.getPopularSearches(
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: popularSearches,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Advanced search with complex filters
   * POST /api/v1/search/advanced
   */
  async advancedSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const searchRequest: SearchRequest = req.body;

      logger.info('Processing advanced search request', { searchRequest });

      const result = await this.searchService.searchHotels(searchRequest);

      res.json({
        success: true,
        data: result.properties,
        pagination: result.pagination,
        metadata: result.searchMetadata,
        facets: result.facets,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const searchValidation = {
  searchHotels: [
    query('q')
      .optional()
      .isString()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
    query('checkIn')
      .optional()
      .isISO8601()
      .withMessage('Check-in date must be a valid date'),
    query('checkOut')
      .optional()
      .isISO8601()
      .withMessage('Check-out date must be a valid date'),
    query('rooms')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Rooms must be between 1 and 10'),
    query('adults')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Adults must be between 1 and 20'),
    query('children')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Children must be between 0 and 10'),
    query('starRating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Star rating must be between 1 and 5'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be non-negative'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be non-negative'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  searchNearby: [
    query('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Valid latitude is required'),
    query('lng')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Valid longitude is required'),
    query('radius')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Radius must be between 1 and 100 km'),
    query('checkIn')
      .optional()
      .isISO8601()
      .withMessage('Check-in date must be a valid date'),
    query('checkOut')
      .optional()
      .isISO8601()
      .withMessage('Check-out date must be a valid date'),
    query('rooms')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Rooms must be between 1 and 10'),
    query('adults')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Adults must be between 1 and 20'),
    query('children')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Children must be between 0 and 10'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  getSearchSuggestions: [
    query('q')
      .isString()
      .isLength({ min: 2 })
      .withMessage('Query must be at least 2 characters'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],

  advancedSearch: [
    // Body validation would be handled by a JSON schema validator
    // For now, we'll rely on the service-level validation
  ],
};
