/**
 * Property Routes - Property management API for hotel owners/admins
 */

import { PropertyController, propertyValidation } from '@/controllers/property.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createPropertyRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const propertyController = new PropertyController(prisma);

  /**
   * @swagger
   * /api/v1/properties:
   *   post:
   *     summary: Create a new property
   *     tags: [Properties]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePropertyRequest'
   *     responses:
   *       201:
   *         description: Property created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Property'
   *       400:
   *         description: Invalid request data
   */
  router.post(
    '/',
    propertyValidation.createProperty,
    propertyController.createProperty.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties:
   *   get:
   *     summary: Get properties with filtering
   *     tags: [Properties]
   *     parameters:
   *       - in: query
   *         name: ownerId
   *         schema:
   *           type: string
   *         description: Filter by owner ID
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter by category
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, inactive, pending, suspended]
   *         description: Filter by status
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         description: Filter by city
   *       - in: query
   *         name: country
   *         schema:
   *           type: string
   *         description: Filter by country
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
   *         description: Properties retrieved successfully
   */
  router.get(
    '/',
    propertyValidation.getProperties,
    propertyController.getProperties.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties/search:
   *   get:
   *     summary: Search properties by text
   *     tags: [Properties]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query
   *       - in: query
   *         name: ownerId
   *         schema:
   *           type: string
   *         description: Filter by owner ID
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
   */
  router.get(
    '/search',
    propertyValidation.searchProperties,
    propertyController.searchProperties.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties/owner/{ownerId}:
   *   get:
   *     summary: Get properties by owner
   *     tags: [Properties]
   *     parameters:
   *       - in: path
   *         name: ownerId
   *         required: true
   *         schema:
   *           type: string
   *         description: Owner ID
   *     responses:
   *       200:
   *         description: Owner properties retrieved successfully
   */
  router.get(
    '/owner/:ownerId',
    propertyValidation.getPropertiesByOwner,
    propertyController.getPropertiesByOwner.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties/{id}:
   *   get:
   *     summary: Get property by ID
   *     tags: [Properties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID
   *     responses:
   *       200:
   *         description: Property retrieved successfully
   *       404:
   *         description: Property not found
   */
  router.get(
    '/:id',
    propertyValidation.getProperty,
    propertyController.getProperty.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties/{id}:
   *   put:
   *     summary: Update property
   *     tags: [Properties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdatePropertyRequest'
   *     responses:
   *       200:
   *         description: Property updated successfully
   *       404:
   *         description: Property not found
   */
  router.put(
    '/:id',
    propertyValidation.updateProperty,
    propertyController.updateProperty.bind(propertyController)
  );

  /**
   * @swagger
   * /api/v1/properties/{id}:
   *   delete:
   *     summary: Delete property
   *     tags: [Properties]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Property ID
   *     responses:
   *       200:
   *         description: Property deleted successfully
   *       404:
   *         description: Property not found
   *       409:
   *         description: Cannot delete property with existing bookings
   */
  router.delete(
    '/:id',
    propertyValidation.deleteProperty,
    propertyController.deleteProperty.bind(propertyController)
  );

  return router;
}