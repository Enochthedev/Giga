/**
 * Room Type Routes - API routes for room type management
 */

import {
  RoomTypeController,
  roomTypeValidation,
} from '@/controllers/room-type.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createRoomTypeRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const roomTypeController = new RoomTypeController(prisma);

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}:
   *   post:
   *     summary: Create a new room type for a property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID to create room type for
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRoomTypeRequest'
   *     responses:
   *       201:
   *         description: Room type created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/RoomType'
   *       400:
   *         description: Invalid request data
   *       404:
   *         description: Property not found
   */
  router.post(
    '/property/:propertyId',
    roomTypeValidation.createRoomTypeForProperty,
    roomTypeController.createRoomTypeForProperty.bind(roomTypeController)
  );

  // REMOVED: Generic room types endpoint - room types should always be accessed via property context

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}/search:
   *   get:
   *     summary: Search room types within a property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID to search within
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
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
   *                     $ref: '#/components/schemas/RoomType'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  router.get(
    '/property/:propertyId/search',
    roomTypeValidation.searchRoomTypesInProperty,
    roomTypeController.searchRoomTypesInProperty.bind(roomTypeController)
  );

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}:
   *   get:
   *     summary: Get room types by property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: includeInactive
   *         schema:
   *           type: boolean
   *           default: false
   *     responses:
   *       200:
   *         description: Property room types retrieved successfully
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
   *                     $ref: '#/components/schemas/RoomType'
   */
  router.get(
    '/property/:propertyId',
    roomTypeValidation.getRoomTypesByProperty,
    roomTypeController.getRoomTypesByProperty.bind(roomTypeController)
  );

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}/room/{roomTypeId}:
   *   get:
   *     summary: Get room type by ID within a property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID that owns the room type
   *       - in: path
   *         name: roomTypeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Room type ID to retrieve
   *     responses:
   *       200:
   *         description: Room type retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/RoomType'
   *       404:
   *         description: Room type or property not found
   *       403:
   *         description: Room type does not belong to this property
   */
  router.get(
    '/property/:propertyId/room/:roomTypeId',
    roomTypeValidation.getRoomTypeInProperty,
    roomTypeController.getRoomTypeInProperty.bind(roomTypeController)
  );

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}/room/{roomTypeId}:
   *   put:
   *     summary: Update room type within a property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID that owns the room type
   *       - in: path
   *         name: roomTypeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Room type ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRoomTypeRequest'
   *     responses:
   *       200:
   *         description: Room type updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/RoomType'
   *       404:
   *         description: Room type or property not found
   *       403:
   *         description: Room type does not belong to this property
   */
  router.put(
    '/property/:propertyId/room/:roomTypeId',
    roomTypeValidation.updateRoomTypeInProperty,
    roomTypeController.updateRoomTypeInProperty.bind(roomTypeController)
  );

  /**
   * @swagger
   * /api/v1/room-types/property/{propertyId}/room/{roomTypeId}:
   *   delete:
   *     summary: Delete room type within a property
   *     tags: [Room Types]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID that owns the room type
   *       - in: path
   *         name: roomTypeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Room type ID to delete
   *     responses:
   *       200:
   *         description: Room type deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Room type or property not found
   *       403:
   *         description: Room type does not belong to this property
   *       409:
   *         description: Cannot delete room type with existing bookings
   */
  router.delete(
    '/property/:propertyId/room/:roomTypeId',
    roomTypeValidation.deleteRoomTypeInProperty,
    roomTypeController.deleteRoomTypeInProperty.bind(roomTypeController)
  );

  return router;
}
