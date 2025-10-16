import { Request, Response } from 'express';
import { DeliveryStatus, PrismaClient } from '../generated/prisma-client';
import { DeliveryTrackingService } from '../services/delivery-tracking.service';

const prisma = new PrismaClient();
const deliveryTrackingService = new DeliveryTrackingService(prisma);

export class DeliveryTrackingController {
  /**
   * @swagger
   * /api/v1/delivery/track/{trackingNumber}:
   *   get:
   *     summary: Track a delivery by tracking number
   *     tags: [Delivery Tracking]
   *     parameters:
   *       - in: path
   *         name: trackingNumber
   *         required: true
   *         schema:
   *           type: string
   *         description: Tracking number
   *     responses:
   *       200:
   *         description: Delivery tracking information
   */
  static async trackDelivery(req: Request, res: Response) {
    try {
      const { trackingNumber } = req.params;

      const tracking =
        await deliveryTrackingService.getTrackingInfo(trackingNumber);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          error: 'Tracking information not found',
        });
      }

      res.json({
        success: true,
        data: tracking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get tracking information',
      });
    }
  }

  /**
   * @swagger
   * /api/v1/delivery/order/{orderId}:
   *   get:
   *     summary: Get delivery tracking for an order
   *     tags: [Delivery Tracking]
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: Order ID
   *     responses:
   *       200:
   *         description: Order delivery tracking information
   */
  static async getOrderTracking(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const tracking = await deliveryTrackingService.getOrderTracking(orderId);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          error: 'Order tracking information not found',
        });
      }

      res.json({
        success: true,
        data: tracking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get order tracking',
      });
    }
  }

  /**
   * @swagger
   * /api/v1/delivery/update:
   *   post:
   *     summary: Update delivery status (internal use)
   *     tags: [Delivery Tracking]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               trackingId:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, RETURNED]
   *               location:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Delivery status updated successfully
   */
  static async updateDeliveryStatus(req: Request, res: Response) {
    try {
      const { trackingId, status, location, description } = req.body;

      const updatedTracking =
        await deliveryTrackingService.updateTrackingStatus(
          trackingId,
          status as DeliveryStatus,
          { location, description, timestamp: new Date() }
        );

      res.json({
        success: true,
        data: updatedTracking,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update delivery status',
      });
    }
  }

  /**
   * @swagger
   * /api/v1/delivery/analytics:
   *   get:
   *     summary: Get delivery analytics
   *     tags: [Delivery Tracking]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Delivery analytics data
   */
  static async getDeliveryAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const analytics = await deliveryTrackingService.getDeliveryAnalytics(
        startDate
          ? new Date(startDate as string)
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate ? new Date(endDate as string) : new Date()
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get delivery analytics',
      });
    }
  }
}
