/**
 * Pricing Routes - API routes for pricing functionality
 */

import {
  PricingController,
  pricingValidation,
} from '@/controllers/pricing.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';
import { RedisClientType } from 'redis';

export function createPricingRoutes(
  prisma: PrismaClient,
  redis: RedisClientType
): Router {
  const router = Router();
  const pricingController = new PricingController(prisma, redis);

  /**
   * @swagger
   * /api/v1/pricing/calculate:
   *   post:
   *     summary: Calculate price for a booking request
   *     tags: [Pricing]
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
   *               - guestCount
   *             properties:
   *               propertyId:
   *                 type: string
   *                 description: Property ID
   *               roomTypeId:
   *                 type: string
   *                 description: Room type ID
   *               checkInDate:
   *                 type: string
   *                 format: date
   *                 description: Check-in date
   *               checkOutDate:
   *                 type: string
   *                 format: date
   *                 description: Check-out date
   *               guestCount:
   *                 type: integer
   *                 minimum: 1
   *                 description: Number of guests
   *               roomQuantity:
   *                 type: integer
   *                 minimum: 1
   *                 default: 1
   *                 description: Number of rooms
   *               promotionCodes:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Promotion codes to apply
   *               corporateCode:
   *                 type: string
   *                 description: Corporate discount code
   *               loyaltyMemberId:
   *                 type: string
   *                 description: Loyalty member ID
   *               bookingSource:
   *                 type: string
   *                 description: Source of the booking
   *     responses:
   *       200:
   *         description: Price calculation successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/PriceCalculation'
   *       400:
   *         description: Invalid request data
   *       404:
   *         description: Property or room type not found
   */
  router.post(
    '/calculate',
    pricingValidation.calculatePrice,
    pricingController.calculatePrice.bind(pricingController)
  );

  // Seasonal Pricing Routes
  /**
   * @swagger
   * /api/v1/pricing/seasonal:
   *   post:
   *     summary: Create a seasonal rate
   *     tags: [Seasonal Pricing]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateSeasonalRateRequest'
   *     responses:
   *       201:
   *         description: Seasonal rate created successfully
   *       400:
   *         description: Invalid request data
   */
  router.post(
    '/seasonal',
    pricingValidation.createSeasonalRate,
    pricingController.createSeasonalRate.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/seasonal/property/{propertyId}:
   *   get:
   *     summary: Get seasonal rates for a property
   *     tags: [Seasonal Pricing]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: includeExpired
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Seasonal rates retrieved successfully
   */
  router.get(
    '/seasonal/property/:propertyId',
    pricingValidation.propertyId,
    pricingController.getSeasonalRates.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/seasonal/{id}:
   *   put:
   *     summary: Update a seasonal rate
   *     tags: [Seasonal Pricing]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateSeasonalRateRequest'
   *     responses:
   *       200:
   *         description: Seasonal rate updated successfully
   */
  router.put(
    '/seasonal/:id',
    pricingValidation.id,
    pricingController.updateSeasonalRate.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/seasonal/{id}:
   *   delete:
   *     summary: Delete a seasonal rate
   *     tags: [Seasonal Pricing]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Seasonal rate deleted successfully
   */
  router.delete(
    '/seasonal/:id',
    pricingValidation.id,
    pricingController.deleteSeasonalRate.bind(pricingController)
  );

  // Dynamic Pricing Routes
  /**
   * @swagger
   * /api/v1/pricing/dynamic:
   *   post:
   *     summary: Create a dynamic pricing rule
   *     tags: [Dynamic Pricing]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDynamicPricingRuleRequest'
   *     responses:
   *       201:
   *         description: Dynamic pricing rule created successfully
   */
  router.post(
    '/dynamic',
    pricingValidation.createDynamicPricingRule,
    pricingController.createDynamicPricingRule.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/dynamic/property/{propertyId}:
   *   get:
   *     summary: Get dynamic pricing rules for a property
   *     tags: [Dynamic Pricing]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *       - in: query
   *         name: includeExpired
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Dynamic pricing rules retrieved successfully
   */
  router.get(
    '/dynamic/property/:propertyId',
    pricingValidation.propertyId,
    pricingController.getDynamicPricingRules.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/dynamic/{id}:
   *   put:
   *     summary: Update a dynamic pricing rule
   *     tags: [Dynamic Pricing]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Dynamic pricing rule updated successfully
   */
  router.put(
    '/dynamic/:id',
    pricingValidation.id,
    pricingController.updateDynamicPricingRule.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/dynamic/{id}:
   *   delete:
   *     summary: Delete a dynamic pricing rule
   *     tags: [Dynamic Pricing]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Dynamic pricing rule deleted successfully
   */
  router.delete(
    '/dynamic/:id',
    pricingValidation.id,
    pricingController.deleteDynamicPricingRule.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/dynamic/predefined/{propertyId}:
   *   post:
   *     summary: Create predefined dynamic pricing rules
   *     tags: [Dynamic Pricing]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: Predefined rules created successfully
   */
  router.post(
    '/dynamic/predefined/:propertyId',
    pricingValidation.propertyId,
    pricingController.createPredefinedRules.bind(pricingController)
  );

  // Promotion Routes
  /**
   * @swagger
   * /api/v1/pricing/promotions:
   *   post:
   *     summary: Create a promotion
   *     tags: [Promotions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreatePromotionRequest'
   *     responses:
   *       201:
   *         description: Promotion created successfully
   */
  router.post(
    '/promotions',
    pricingValidation.createPromotion,
    pricingController.createPromotion.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/property/{propertyId}:
   *   get:
   *     summary: Get promotions for a property
   *     tags: [Promotions]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *       - in: query
   *         name: includeExpired
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Promotions retrieved successfully
   */
  router.get(
    '/promotions/property/:propertyId',
    pricingValidation.propertyId,
    pricingController.getPromotions.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/{id}:
   *   put:
   *     summary: Update a promotion
   *     tags: [Promotions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Promotion updated successfully
   */
  router.put(
    '/promotions/:id',
    pricingValidation.id,
    pricingController.updatePromotion.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/{id}:
   *   delete:
   *     summary: Delete a promotion
   *     tags: [Promotions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Promotion deleted successfully
   */
  router.delete(
    '/promotions/:id',
    pricingValidation.id,
    pricingController.deletePromotion.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/validate:
   *   post:
   *     summary: Validate a promotion code
   *     tags: [Promotions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - promotionCode
   *               - propertyId
   *               - guestId
   *               - bookingAmount
   *               - roomTypeId
   *               - checkInDate
   *               - checkOutDate
   *             properties:
   *               promotionCode:
   *                 type: string
   *               propertyId:
   *                 type: string
   *               guestId:
   *                 type: string
   *               bookingAmount:
   *                 type: number
   *               roomTypeId:
   *                 type: string
   *               checkInDate:
   *                 type: string
   *                 format: date
   *               checkOutDate:
   *                 type: string
   *                 format: date
   *               bookingSource:
   *                 type: string
   *     responses:
   *       200:
   *         description: Promotion validation result
   */
  router.post(
    '/promotions/validate',
    pricingValidation.validatePromotion,
    pricingController.validatePromotion.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/{id}/stats:
   *   get:
   *     summary: Get promotion usage statistics
   *     tags: [Promotions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Promotion statistics retrieved successfully
   */
  router.get(
    '/promotions/:id/stats',
    pricingValidation.id,
    pricingController.getPromotionStats.bind(pricingController)
  );

  /**
   * @swagger
   * /api/v1/pricing/promotions/predefined/{propertyId}:
   *   post:
   *     summary: Create predefined promotions
   *     tags: [Promotions]
   *     parameters:
   *       - in: path
   *         name: propertyId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: Predefined promotions created successfully
   */
  router.post(
    '/promotions/predefined/:propertyId',
    pricingValidation.propertyId,
    pricingController.createPredefinedPromotions.bind(pricingController)
  );

  return router;
}
