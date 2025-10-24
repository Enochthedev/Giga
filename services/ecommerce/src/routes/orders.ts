import { Router } from 'express';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { OrderController } from '../controllers/order.controller';
import { PrismaClient } from '../generated/prisma-client';
import { authMiddleware } from '../middleware/auth.middleware';
import { CartService } from '../services/cart.service';
import { InventoryService } from '../services/inventory.service';
import { OrderServiceFactory } from '../services/order-service.factory';

const router = Router();

// Initialize services and clients
const prisma = new PrismaClient();
const cartService = new CartService(prisma);
const inventoryService = new InventoryService();

// Initialize service clients
// Note: Auth is handled by middleware, not a service client
const paymentServiceClient = new HttpPaymentServiceClient(
  process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'
);
const notificationServiceClient = new HttpNotificationServiceClient(
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004'
);

// Initialize order service using factory
const orderServiceConfig = OrderServiceFactory.getConfigForEnvironment();
const orderService = OrderServiceFactory.create(
  orderServiceConfig,
  prisma,
  cartService,
  inventoryService,
  paymentServiceClient,
  notificationServiceClient
);

// Initialize controller
const orderController = new OrderController(
  orderService,
  cartService,
  inventoryService,
  paymentServiceClient,
  notificationServiceClient
);

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethodId
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address
 *                   - city
 *                   - country
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1234567890"
 *               notes:
 *                 type: string
 *                 example: "Please deliver to front door"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request data or cart validation failed
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/', orderController.createOrder.bind(orderController));

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get order history with pagination and filters
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *         description: Filter by order status
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter orders from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter orders to this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of orders per page
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/', orderController.getOrderHistory.bind(orderController));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get specific order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', orderController.getOrder.bind(orderController));

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *               trackingNumber:
 *                 type: string
 *                 example: "1Z999AA1234567890"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status transition or request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id/status',
  orderController.updateOrderStatus.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   delete:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Changed my mind"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel order (already delivered, etc.)
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id/cancel', orderController.cancelOrder.bind(orderController));

/**
 * @swagger
 * /api/v1/orders/{id}/payment-status:
 *   get:
 *     summary: Get payment status for order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order or payment intent not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id/payment-status',
  orderController.getOrderPaymentStatus.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/{id}/confirm-payment:
 *   post:
 *     summary: Confirm payment for order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Payment already confirmed or confirmation failed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id/confirm-payment',
  orderController.confirmOrderPayment.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/{id}/saga-status:
 *   get:
 *     summary: Get saga execution status (admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saga ID
 *     responses:
 *       200:
 *         description: Saga status retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       501:
 *         description: Saga pattern not enabled
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id/saga-status',
  orderController.getSagaStatus.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/{id}/transaction-status:
 *   get:
 *     summary: Get transaction status (admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction status retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       501:
 *         description: Distributed transactions not enabled
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id/transaction-status',
  orderController.getTransactionStatus.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/{id}/retry-saga:
 *   post:
 *     summary: Retry failed saga (admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saga ID
 *     responses:
 *       200:
 *         description: Saga retried successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       501:
 *         description: Saga pattern not enabled
 *       500:
 *         description: Internal server error
 */
router.post('/:id/retry-saga', orderController.retrySaga.bind(orderController));

/**
 * @swagger
 * /api/v1/orders/{id}/retry-transaction:
 *   post:
 *     summary: Retry failed transaction (admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retried successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       501:
 *         description: Distributed transactions not enabled
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id/retry-transaction',
  orderController.retryTransaction.bind(orderController)
);

/**
 * @swagger
 * /api/v1/orders/processing-metrics:
 *   get:
 *     summary: Get order processing metrics (admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for metrics (defaults to 24 hours ago)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for metrics (defaults to now)
 *     responses:
 *       200:
 *         description: Order processing metrics retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       501:
 *         description: Enhanced metrics not available
 *       500:
 *         description: Internal server error
 */
router.get(
  '/processing-metrics',
  orderController.getOrderProcessingMetrics.bind(orderController)
);

export const orderRoutes: Router = router;
