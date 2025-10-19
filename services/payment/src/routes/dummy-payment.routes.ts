import { Router } from 'express';
import { DummyPaymentController } from '../controllers/dummy-payment.controller';
import { DummyPaymentService } from '../services/dummy-payment.service';

const router = Router();

// Initialize dummy payment service and controller
const dummyPaymentService = new DummyPaymentService();
const dummyPaymentController = new DummyPaymentController(dummyPaymentService);

/**
 * @swagger
 * /api/v1/payment-intents:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - customerId
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount in cents
 *                 example: 2000
 *               currency:
 *                 type: string
 *                 default: "usd"
 *                 example: "usd"
 *               customerId:
 *                 type: string
 *                 example: "cust_1234567890"
 *               metadata:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   orderId: "order_123"
 *                   checkoutId: "checkout_456"
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/payment-intents', (req, res) =>
  dummyPaymentController.createPaymentIntent(req, res)
);

/**
 * @swagger
 * /api/v1/payment-intents/{id}:
 *   get:
 *     summary: Get payment intent by ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "pi_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment intent retrieved successfully
 *       404:
 *         description: Payment intent not found
 */
router.get('/payment-intents/:id', (req, res) =>
  dummyPaymentController.getPaymentIntent(req, res)
);

/**
 * @swagger
 * /api/v1/payment-intents/{id}/confirm:
 *   post:
 *     summary: Confirm payment intent
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "pi_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Payment confirmation failed
 *       404:
 *         description: Payment intent not found
 */
router.post('/payment-intents/:id/confirm', (req, res) =>
  dummyPaymentController.confirmPaymentIntent(req, res)
);

/**
 * @swagger
 * /api/v1/payment-intents/{id}/cancel:
 *   post:
 *     summary: Cancel payment intent
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "pi_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment intent cancelled successfully
 *       400:
 *         description: Payment cancellation failed
 *       404:
 *         description: Payment intent not found
 */
router.post('/payment-intents/:id/cancel', (req, res) =>
  dummyPaymentController.cancelPaymentIntent(req, res)
);

/**
 * @swagger
 * /api/v1/payment-methods:
 *   post:
 *     summary: Create payment method
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [card, bank_account, wallet]
 *                 example: "card"
 *               card:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: string
 *                     example: "4242424242424242"
 *                   exp_month:
 *                     type: integer
 *                     example: 12
 *                   exp_year:
 *                     type: integer
 *                     example: 2025
 *                   cvc:
 *                     type: string
 *                     example: "123"
 *                   brand:
 *                     type: string
 *                     example: "visa"
 *     responses:
 *       201:
 *         description: Payment method created successfully
 *       400:
 *         description: Invalid payment method data
 */
router.post('/payment-methods', (req, res) =>
  dummyPaymentController.createPaymentMethod(req, res)
);

/**
 * @swagger
 * /api/v1/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "pm_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment method retrieved successfully
 *       404:
 *         description: Payment method not found
 */
router.get('/payment-methods/:id', (req, res) =>
  dummyPaymentController.getPaymentMethod(req, res)
);

/**
 * @swagger
 * /api/v1/customers/{customerId}/payment-methods:
 *   get:
 *     summary: List customer payment methods
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         example: "cust_1234567890"
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *       400:
 *         description: Customer ID is required
 */
router.get('/customers/:customerId/payment-methods', (req, res) =>
  dummyPaymentController.listPaymentMethods(req, res)
);

/**
 * @swagger
 * /api/v1/refunds:
 *   post:
 *     summary: Process refund
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 example: "pi_1234567890abcdef"
 *               amount:
 *                 type: integer
 *                 description: Amount to refund in cents (optional, defaults to full amount)
 *                 example: 1000
 *               reason:
 *                 type: string
 *                 example: "Customer requested refund"
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Refund processing failed
 */
router.post('/refunds', (req, res) =>
  dummyPaymentController.processRefund(req, res)
);

/**
 * @swagger
 * /api/v1/payment-statistics:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Payment, Admin]
 *     responses:
 *       200:
 *         description: Payment statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalPayments:
 *                           type: integer
 *                         successfulPayments:
 *                           type: integer
 *                         failedPayments:
 *                           type: integer
 *                         totalAmount:
 *                           type: integer
 *                         averageAmount:
 *                           type: number
 */
router.get('/payment-statistics', (req, res) =>
  dummyPaymentController.getPaymentStatistics(req, res)
);

// Development/Testing endpoints
if (process.env.NODE_ENV !== 'production') {
  /**
   * @swagger
   * /api/v1/test/clear-data:
   *   delete:
   *     summary: Clear all test data (development only)
   *     tags: [Testing]
   *     responses:
   *       200:
   *         description: Test data cleared successfully
   *       403:
   *         description: Not allowed in production environment
   */
  router.delete('/test/clear-data', (req, res) =>
    dummyPaymentController.clearTestData(req, res)
  );

  /**
   * @swagger
   * /api/v1/test/debug:
   *   get:
   *     summary: Get debug information (development only)
   *     tags: [Testing]
   *     responses:
   *       200:
   *         description: Debug information retrieved successfully
   *       403:
   *         description: Not allowed in production environment
   */
  router.get('/test/debug', (req, res) =>
    dummyPaymentController.getDebugInfo(req, res)
  );
}

export const dummyPaymentRoutes: Router = router;
