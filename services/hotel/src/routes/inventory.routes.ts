/**
 * Inventory Routes - API endpoints for inventory management
 */

import {
  InventoryController,
  inventoryValidation,
} from '@/controllers/inventory.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createInventoryRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const controller = new InventoryController(prisma);

  /**
   * @swagger
   * /api/inventory:
   *   put:
   *     summary: Update inventory for a specific date
   *     tags: [Inventory]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - propertyId
   *               - roomTypeId
   *               - date
   *             properties:
   *               propertyId:
   *                 type: string
   *               roomTypeId:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date
   *               totalRooms:
   *                 type: integer
   *               availableRooms:
   *                 type: integer
   *               reservedRooms:
   *                 type: integer
   *               blockedRooms:
   *                 type: integer
   *               minimumStay:
   *                 type: integer
   *               maximumStay:
   *                 type: integer
   *               closedToArrival:
   *                 type: boolean
   *               closedToDeparture:
   *                 type: boolean
   *               stopSell:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Inventory updated successfully
   *       400:
   *         description: Invalid request
   */
  router.put(
    '/',
    inventoryValidation.updateInventory,
    controller.updateInventory.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/bulk:
   *   put:
   *     summary: Bulk update inventory for a date range
   *     tags: [Inventory]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - propertyId
   *               - roomTypeId
   *               - startDate
   *               - endDate
   *               - updates
   *             properties:
   *               propertyId:
   *                 type: string
   *               roomTypeId:
   *                 type: string
   *               startDate:
   *                 type: string
   *                 format: date
   *               endDate:
   *                 type: string
   *                 format: date
   *               updates:
   *                 type: object
   *     responses:
   *       200:
   *         description: Bulk update completed
   *       400:
   *         description: Invalid request
   */
  router.put(
    '/bulk',
    inventoryValidation.bulkUpdateInventory,
    controller.bulkUpdateInventory.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/reserve:
   *   post:
   *     summary: Reserve inventory for a booking
   *     tags: [Inventory]
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
   *               - roomQuantity
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
   *               bookingId:
   *                 type: string
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       201:
   *         description: Inventory reserved successfully
   *       400:
   *         description: Invalid request
   *       409:
   *         description: Insufficient inventory
   */
  router.post(
    '/reserve',
    inventoryValidation.reserveInventory,
    controller.reserveInventory.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/reservation/{reservationId}:
   *   delete:
   *     summary: Release inventory reservation
   *     tags: [Inventory]
   *     parameters:
   *       - in: path
   *         name: reservationId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Reservation released successfully
   *       404:
   *         description: Reservation not found
   */
  router.delete(
    '/reservation/:reservationId',
    inventoryValidation.releaseInventoryReservation,
    controller.releaseInventoryReservation.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/lock:
   *   post:
   *     summary: Create inventory lock
   *     tags: [Inventory]
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
   *               - quantity
   *               - lockedBy
   *               - expiresAt
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
   *               quantity:
   *                 type: integer
   *                 minimum: 1
   *               lockedBy:
   *                 type: string
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       201:
   *         description: Lock created successfully
   *       409:
   *         description: Insufficient inventory
   */
  router.post(
    '/lock',
    inventoryValidation.createInventoryLock,
    controller.createInventoryLock.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/lock/{lockId}:
   *   delete:
   *     summary: Release inventory lock
   *     tags: [Inventory]
   *     parameters:
   *       - in: path
   *         name: lockId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lock released successfully
   *       404:
   *         description: Lock not found
   */
  router.delete(
    '/lock/:lockId',
    inventoryValidation.releaseInventoryLock,
    controller.releaseInventoryLock.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/status/{propertyId}/{roomTypeId}:
   *   get:
   *     summary: Get inventory status for a date range
   *     tags: [Inventory]
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
   *         description: Inventory status
   *       404:
   *         description: Room type not found
   */
  router.get(
    '/status/:propertyId/:roomTypeId',
    inventoryValidation.getInventoryStatus,
    controller.getInventoryStatus.bind(controller)
  );

  /**
   * @swagger
   * /api/inventory/cleanup:
   *   post:
   *     summary: Clean up expired locks and reservations
   *     tags: [Inventory]
   *     responses:
   *       200:
   *         description: Cleanup completed successfully
   */
  router.post('/cleanup', controller.cleanupExpiredItems.bind(controller));

  return router;
}
