/**
 * Availability Routes - API endpoints for availability checking
 */

import {
  AvailabilityController,
  availabilityValidation,
} from '@/controllers/availability.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createAvailabilityRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const controller = new AvailabilityController(prisma);

  /**
   * @swagger
   * /api/availability/check:
   *   post:
   *     summary: Check availability for a specific room type
   *     tags: [Availability]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - propertyId
   *               - roomTypeId
   *               - checkInDate
   *               - checkOutDate
   *             properties:
   *               propertyId:
   *                 type: string
   *               roomTypeId:
   *                 type: string
   *               checkInDate:
   *                 type: string
   *                 format: date
   *               checkOutDate:
   *                 type: string
   *                 format: date
   *               roomQuantity:
   *                 type: integer
   *                 minimum: 1
   *               guestCount:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       200:
   *         description: Availability result
   *       400:
   *         description: Invalid request
   */
  router.post(
    '/check',
    availabilityValidation.checkAvailability,
    controller.checkAvailability.bind(controller)
  );

  /**
   * @swagger
   * /api/availability/check-bulk:
   *   post:
   *     summary: Check availability for all room types in a property
   *     tags: [Availability]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - propertyId
   *               - checkInDate
   *               - checkOutDate
   *             properties:
   *               propertyId:
   *                 type: string
   *               checkInDate:
   *                 type: string
   *                 format: date
   *               checkOutDate:
   *                 type: string
   *                 format: date
   *               roomQuantity:
   *                 type: integer
   *                 minimum: 1
   *               guestCount:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       200:
   *         description: Availability results for all room types
   *       400:
   *         description: Invalid request
   */
  router.post(
    '/check-bulk',
    availabilityValidation.checkBulkAvailability,
    controller.checkBulkAvailability.bind(controller)
  );

  /**
   * @swagger
   * /api/availability/calendar/{propertyId}/{roomTypeId}:
   *   get:
   *     summary: Get availability calendar for a room type
   *     tags: [Availability]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: roomTypeId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Availability calendar
   *       404:
   *         description: Room type not found
   */
  router.get(
    '/calendar/:propertyId/:roomTypeId',
    availabilityValidation.getAvailabilityCalendar,
    controller.getAvailabilityCalendar.bind(controller)
  );

  return router;
}
