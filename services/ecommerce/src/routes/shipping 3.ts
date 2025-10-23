import { Router } from 'express';
import { ShippingController } from '../controllers/shipping.controller';
import { handleSession } from '../middleware/session.middleware';

const router: Router = Router();

// Apply session middleware to shipping routes that need authentication
router.use(handleSession);

/**
 * @swagger
 * /api/v1/shipping/calculate:
 *   post:
 *     summary: Calculate shipping options for items
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     weight:
 *                       type: number
 *               destination:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               orderValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Available shipping options
 */
router.post('/calculate', ShippingController.calculateShipping);

/**
 * @swagger
 * /api/v1/shipping/zones:
 *   get:
 *     summary: Get all shipping zones
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: List of shipping zones
 */
router.get('/zones', ShippingController.getShippingZones);

/**
 * @swagger
 * /api/v1/shipping/methods:
 *   get:
 *     summary: Get shipping methods for a zone
 *     tags: [Shipping]
 *     parameters:
 *       - in: query
 *         name: zoneId
 *         schema:
 *           type: string
 *         description: Shipping zone ID
 *     responses:
 *       200:
 *         description: List of shipping methods
 */
router.get('/methods', ShippingController.getShippingMethods);

export default router;
