import { Router } from 'express';
import { DeliveryTrackingController } from '../controllers/delivery-tracking.controller';
import {
  handleAuthentication,
  handleSession,
} from '../middleware/session.middleware';

const router: Router = Router();

// Apply session middleware
router.use(handleSession);

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
router.get('/track/:trackingNumber', DeliveryTrackingController.trackDelivery);

/**
 * @swagger
 * /api/v1/delivery/order/{orderId}:
 *   get:
 *     summary: Get delivery tracking for an order
 *     tags: [Delivery Tracking]
 *     security:
 *       - bearerAuth: []
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
router.get(
  '/order/:orderId',
  handleAuthentication,
  DeliveryTrackingController.getOrderTracking
);

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
router.post('/update', DeliveryTrackingController.updateDeliveryStatus);

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
router.get('/analytics', DeliveryTrackingController.getDeliveryAnalytics);

export default router;
