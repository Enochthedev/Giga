/**
 * Search Routes - Hotel search and filtering endpoints
 */

import {
  SearchController,
  searchValidation,
} from '@/controllers/search.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createSearchRoutes(prisma: PrismaClient, redis?: any): Router {
  const router = Router();
  const searchController = new SearchController(prisma, redis);

  /**
   * @swagger
   * /api/v1/search/hotels:
   *   get:
   *     summary: Comprehensive hotel search with filters
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *           minLength: 2
   *         description: Search query (hotel name, location, etc.)
   *       - in: query
   *         name: location
   *         schema:
   *           type: string
   *         description: Location filter (city or region)
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         description: City name
   *       - in: query
   *         name: country
   *         schema:
   *           type: string
   *         description: Country name
   *       - in: query
   *         name: checkIn
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-in date (YYYY-MM-DD)
   *       - in: query
   *         name: checkOut
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-out date (YYYY-MM-DD)
   *       - in: query
   *         name: rooms
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 10
   *           default: 1
   *         description: Number of rooms
   *       - in: query
   *         name: adults
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 20
   *           default: 2
   *         description: Number of adults
   *       - in: query
   *         name: children
   *         schema:
   *           type: integer
   *           minimum: 0
   *           maximum: 10
   *           default: 0
   *         description: Number of children
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [hotel, resort, hostel, villa, apartment, boutique, business]
   *         description: Property category
   *       - in: query
   *         name: starRating
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *         description: Star rating filter
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Minimum price per night
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Maximum price per night
   *       - in: query
   *         name: amenities
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *             enum: [wifi, parking, pool, gym, spa, restaurant, bar, room_service, air_conditioning, pet_friendly]
   *         description: Required amenities
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [relevance, price_asc, price_desc, star_rating, guest_rating, distance, popularity, name, newest]
   *           default: relevance
   *         description: Sort criteria
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Sort order
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Results per page
   *     responses:
   *       200:
   *         description: Search results with properties, pagination, and facets
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SearchResultProperty'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 metadata:
   *                   $ref: '#/components/schemas/SearchMetadata'
   *                 facets:
   *                   $ref: '#/components/schemas/SearchFacets'
   *       400:
   *         description: Invalid search parameters
   */
  router.get(
    '/hotels',
    searchValidation.searchHotels,
    searchController.searchHotels.bind(searchController)
  );

  /**
   * @swagger
   * /api/v1/search/nearby:
   *   get:
   *     summary: Search hotels near a specific location
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: lat
   *         required: true
   *         schema:
   *           type: number
   *           minimum: -90
   *           maximum: 90
   *         description: Latitude
   *       - in: query
   *         name: lng
   *         required: true
   *         schema:
   *           type: number
   *           minimum: -180
   *           maximum: 180
   *         description: Longitude
   *       - in: query
   *         name: radius
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Search radius in kilometers
   *       - in: query
   *         name: checkIn
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-in date (YYYY-MM-DD)
   *       - in: query
   *         name: checkOut
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-out date (YYYY-MM-DD)
   *       - in: query
   *         name: rooms
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 10
   *           default: 1
   *         description: Number of rooms
   *       - in: query
   *         name: adults
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 20
   *           default: 2
   *         description: Number of adults
   *       - in: query
   *         name: children
   *         schema:
   *           type: integer
   *           minimum: 0
   *           maximum: 10
   *           default: 0
   *         description: Number of children
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [hotel, resort, hostel, villa, apartment, boutique, business]
   *         description: Property category
   *       - in: query
   *         name: starRating
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *         description: Star rating filter
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Minimum price per night
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Maximum price per night
   *       - in: query
   *         name: amenities
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Required amenities
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [distance, price_asc, price_desc, star_rating, guest_rating, popularity, name]
   *           default: distance
   *         description: Sort criteria
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *         description: Sort order
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Results per page
   *     responses:
   *       200:
   *         description: Nearby hotels with distance information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     allOf:
   *                       - $ref: '#/components/schemas/SearchResultProperty'
   *                       - type: object
   *                         properties:
   *                           distance:
   *                             type: number
   *                             description: Distance in kilometers
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 metadata:
   *                   allOf:
   *                     - $ref: '#/components/schemas/SearchMetadata'
   *                     - type: object
   *                       properties:
   *                         searchLocation:
   *                           type: object
   *                           properties:
   *                             latitude:
   *                               type: number
   *                             longitude:
   *                               type: number
   *                         searchRadius:
   *                           type: number
   *       400:
   *         description: Invalid location parameters
   */
  router.get(
    '/nearby',
    searchValidation.searchNearby,
    searchController.searchNearby.bind(searchController)
  );

  /**
   * @swagger
   * /api/v1/search/suggestions:
   *   get:
   *     summary: Get search suggestions based on query
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *           minLength: 2
   *         description: Search query for suggestions
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50
   *           default: 10
   *         description: Maximum number of suggestions
   *     responses:
   *       200:
   *         description: Search suggestions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   *                 query:
   *                   type: string
   *       400:
   *         description: Invalid query parameter
   */
  router.get(
    '/suggestions',
    searchValidation.getSearchSuggestions,
    searchController.getSearchSuggestions.bind(searchController)
  );

  /**
   * @swagger
   * /api/v1/search/popular:
   *   get:
   *     summary: Get popular search terms
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50
   *           default: 10
   *         description: Maximum number of popular searches
   *     responses:
   *       200:
   *         description: Popular search terms
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: string
   */
  router.get(
    '/popular',
    searchController.getPopularSearches.bind(searchController)
  );

  /**
   * @swagger
   * /api/v1/search/advanced:
   *   post:
   *     summary: Advanced search with complex filters
   *     tags: [Search]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SearchRequest'
   *     responses:
   *       200:
   *         description: Advanced search results
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SearchResultProperty'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 metadata:
   *                   $ref: '#/components/schemas/SearchMetadata'
   *                 facets:
   *                   $ref: '#/components/schemas/SearchFacets'
   *       400:
   *         description: Invalid search request
   */
  router.post(
    '/advanced',
    searchValidation.advancedSearch,
    searchController.advancedSearch.bind(searchController)
  );

  return router;
}

export default createSearchRoutes;
