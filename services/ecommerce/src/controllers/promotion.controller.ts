import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma-client';
import { PromotionService } from '../services/promotion.service';

const prisma = new PrismaClient();
const promotionService = new PromotionService(prisma);

export class PromotionController {
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
   *               customerId:
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
  static async validatePromotion(req: Request, res: Response) {
    try {
      const { code, items, subtotal } = req.body;
      const customerId = (req as any).customerId; // From authentication middleware

      const result = await promotionService.validatePromotion({
        code,
        customerId,
        items,
        subtotal,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to validate promotion',
      });
    }
  }

  /**
   * @swagger
   * /api/v1/promotions/active:
   *   get:
   *     summary: Get active promotions
   *     tags: [Promotions]
   *     parameters:
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *         description: Customer ID for personalized promotions
   *     responses:
   *       200:
   *         description: List of active promotions
   */
  static async getActivePromotions(req: Request, res: Response) {
    try {
      const { customerId } = req.query;
      const promotions = await promotionService.getActivePromotions();

      res.json({
        success: true,
        data: promotions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get active promotions',
      });
    }
  }

  /**
   * @swagger
   * /api/v1/promotions/apply:
   *   post:
   *     summary: Apply a promotion to an order
   *     tags: [Promotions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               promotionId:
   *                 type: string
   *               customerId:
   *                 type: string
   *               orderValue:
   *                 type: number
   *     responses:
   *       200:
   *         description: Promotion applied successfully
   */
  static async applyPromotion(req: Request, res: Response) {
    try {
      const { promotionId, customerId, orderValue } = req.body;

      const result = await promotionService.applyPromotion(
        promotionId,
        customerId,
        orderValue
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to apply promotion',
      });
    }
  }
}
