import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma-client';
import { ShippingService } from '../services/shipping.service';

const prisma = new PrismaClient();
const shippingService = new ShippingService(prisma);

export class ShippingController {
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
  static async calculateShipping(req: Request, res: Response) {
    try {
      const { items, destination, orderValue } = req.body;

      const shippingOptions = await shippingService.calculateShipping({
        items,
        destination,
        orderValue,
      });

      res.json({
        success: true,
        data: shippingOptions,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to calculate shipping',
      });
    }
  }

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
  static async getShippingZones(req: Request, res: Response) {
    try {
      const zones = await shippingService.getShippingZones();
      res.json({
        success: true,
        data: zones,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get shipping zones',
      });
    }
  }

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
  static async getShippingMethods(req: Request, res: Response) {
    try {
      const { zoneId } = req.query;
      const methods = await shippingService.getShippingMethods(
        zoneId as string
      );

      res.json({
        success: true,
        data: methods,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get shipping methods',
      });
    }
  }
}
