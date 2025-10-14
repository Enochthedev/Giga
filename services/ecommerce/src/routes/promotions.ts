import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import {
  handleAuthentication,
  handleSession,
} from '../middleware/session.middleware';

const router: Router = Router();

// Apply session middleware
router.use(handleSession);

/**
 * @swagger
 * /api/v1/promotions/validate:
 *   post:
 *     summary: Validate and apply a promotion code
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               subtotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promotion validation result
 */
router.post(
  '/validate',
  handleAuthentication,
  PromotionController.validatePromotion
);

/**
 * @swagger
 * /api/v1/promotions/active:
 *   get:
 *     summary: Get active promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of active promotions
 */
router.get('/active', PromotionController.getActivePromotions);

/**
 * @swagger
 * /api/v1/promotions/apply:
 *   post:
 *     summary: Apply a promotion to an order
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotionId:
 *                 type: string
 *               orderValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promotion applied successfully
 */
router.post('/apply', handleAuthentication, PromotionController.applyPromotion);

export default router;
