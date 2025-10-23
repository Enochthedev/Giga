/**
 * Hotel Routes - Public-facing hotel discovery API
 */

import { HotelController, hotelValidation } from '@/controllers/hotel.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createHotelRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const hotelController = new HotelController(prisma);

  /**
   * @swagger
   * /api/v1/hotels:
   *   get:
   *     summary: Get list of hotels with filters
   *     tags: [Hotels]
   *     parameters:
   *       - in: query
   *         name: location
   *         schema:
   *           type: string
   *         description: City or location name
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         description: City name
   *       - in: query
   *         name: country
   *         schema:
   *           type: string
   *         description: Country code
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [hotel, resort, hostel, villa, apartment]
   *         description: Hotel category
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
   *         description: Minimum price filter
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Maximum price filter
   *       - in: query
   *         name: amenities
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Required amenities
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [name, starRating, createdAt]
   *           default: name
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *     responses:
   *       200:
   *         description: Hotels retrieved successfully
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
   *                     $ref: '#/components/schemas/Hotel'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  router.get(
    '/',
    hotelValidation.getHotels,
    hotelController.getHotels.bind(hotelController)
  );

  /**
   * @swagger
   * /api/v1/hotels/nearby:
   *   get:
   *     summary: Get hotels near user's location
   *     tags: [Hotels]
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
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50
   *           default: 20
   *         description: Maximum number of results
   *     responses:
   *       200:
   *         description: Nearby hotels retrieved successfully
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
   *                       - $ref: '#/components/schemas/Hotel'
   *                       - type: object
   *                         properties:
   *                           distance:
   *                             type: number
   *                             description: Distance in kilometers
   *                 location:
   *                   type: object
   *                   properties:
   *                     lat:
   *                       type: number
   *                     lng:
   *                       type: number
   *                 radius:
   *                   type: integer
   */
  router.get(
    '/nearby',
    hotelValidation.getNearbyHotels,
    hotelController.getNearbyHotels.bind(hotelController)
  );

  /**
   * @swagger
   * /api/v1/hotels/search:
   *   get:
   *     summary: Search hotels with query parameters
   *     tags: [Hotels]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *           minLength: 2
   *         description: Search query
   *       - in: query
   *         name: location
   *         schema:
   *           type: string
   *         description: Location filter
   *       - in: query
   *         name: checkIn
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-in date
   *       - in: query
   *         name: checkOut
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-out date
   *       - in: query
   *         name: guests
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Number of guests
   *       - in: query
   *         name: rooms
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Number of rooms
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Hotel category
   *       - in: query
   *         name: starRating
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *         description: Star rating
   *       - in: query
   *         name: amenities
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Required amenities
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *     responses:
   *       200:
   *         description: Search results
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
   *                     $ref: '#/components/schemas/Hotel'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *                 searchParams:
   *                   type: object
   *                   description: Applied search parameters
   */
  router.get(
    '/search',
    hotelValidation.searchHotels,
    hotelController.searchHotels.bind(hotelController)
  );

  /**
   * @swagger
   * /api/v1/hotels/{hotelId}:
   *   get:
   *     summary: Get specific hotel details
   *     tags: [Hotels]
   *     parameters:
   *       - in: path
   *         name: hotelId
   *         required: true
   *         schema:
   *           type: string
   *         description: Hotel ID
   *     responses:
   *       200:
   *         description: Hotel details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/HotelDetails'
   *       404:
   *         description: Hotel not found
   */
  router.get(
    '/:hotelId',
    hotelController.getHotel.bind(hotelController)
  );

  return router;
}