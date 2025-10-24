import { Router } from 'express';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { getAuthClient } from '../config/clients';
import { CheckoutController } from '../controllers/checkout.controller';
import { prisma } from '../lib/prisma';
import {
  handleAuthentication,
  handleSession,
} from '../middleware/session.middleware';
import { cartRateLimit } from '../middleware/validation.middleware';
import { CartService } from '../services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { InventoryService } from '../services/inventory.service';
import { OrderService } from '../services/order.service';

const router = Router();

// Initialize services
const cartService = new CartService(prisma);
const inventoryService = new InventoryService();
const paymentServiceClient = new HttpPaymentServiceClient(
  process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'
);
const authClient = getAuthClient();

// Initialize order service (simplified for checkout)
const orderService = new OrderService(
  prisma,
  cartService,
  inventoryService,
  // These would be properly initialized in a real implementation
  {} as any, // authServiceClient
  paymentServiceClient,
  {} as any // notificationServiceClient
);

// Initialize checkout service and controller
const checkoutService = new CheckoutService(
  prisma,
  cartService,
  orderService,
  inventoryService,
  paymentServiceClient,
  authClient
);

const checkoutController = new CheckoutController(
  checkoutService,
  cartService,
  paymentServiceClient
);

// Apply session middleware to all checkout routes
router.use(handleSession);
router.use(handleAuthentication);

// Apply rate limiting
router.use(cartRateLimit);

/**
 * @swagger
 * /api/v1/checkout:
 *   get:
 *     summary: Get checkout data with user info, addresses, and cart
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         phone:
 *                           type: string
 *                     addresses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           label:
 *                             type: string
 *                           street:
 *                             type: string
 *                           city:
 *                             type: string
 *                           country:
 *                             type: string
 *                           is_default:
 *                             type: boolean
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Authentication required
 */
router.get('/', (req, res) => checkoutController.getCheckoutData(req, res));

/**
 * @swagger
 * /api/v1/checkout/summary:
 *   get:
 *     summary: Get checkout summary with cart details and totals
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         customerId:
 *                           type: string
 *                         cart:
 *                           $ref: '#/components/schemas/Cart'
 *                         totals:
 *                           type: object
 *                           properties:
 *                             subtotal:
 *                               type: number
 *                             tax:
 *                               type: number
 *                             shipping:
 *                               type: number
 *                             total:
 *                               type: number
 *                         validation:
 *                           type: object
 *                           properties:
 *                             isValid:
 *                               type: boolean
 *                             canProceedToCheckout:
 *                               type: boolean
 *       401:
 *         description: Customer identification required
 */
router.get('/summary', (req, res) =>
  checkoutController.getCheckoutSummary(req, res)
);

/**
 * @swagger
 * /api/v1/checkout/initiate:
 *   post:
 *     summary: Initiate checkout process with payment intent creation
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddressId
 *               - paymentMethodId
 *             properties:
 *               shippingAddressId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: "ID of the user's saved address from Supabase"
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1234567890"
 *               notes:
 *                 type: string
 *                 example: "Please deliver to front door"
 *     responses:
 *       200:
 *         description: Checkout initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     checkout:
 *                       type: object
 *                       properties:
 *                         checkoutId:
 *                           type: string
 *                         customerId:
 *                           type: string
 *                         paymentIntent:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             clientSecret:
 *                               type: string
 *                             amount:
 *                               type: number
 *                             currency:
 *                               type: string
 *                             status:
 *                               type: string
 *                         totals:
 *                           type: object
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid checkout data or cart validation failed
 *       401:
 *         description: Customer identification required
 */
router.post('/initiate', (req, res) =>
  checkoutController.initiateCheckout(req, res)
);

/**
 * @swagger
 * /api/v1/checkout/confirm-payment:
 *   post:
 *     summary: Confirm payment and complete order
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Payment confirmed and order completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *                     paymentResult:
 *                       type: object
 *                       properties:
 *                         success:
 *                           type: boolean
 *                         paymentIntentId:
 *                           type: string
 *                         status:
 *                           type: string
 *       400:
 *         description: Payment confirmation failed
 *       401:
 *         description: Customer identification required
 *       404:
 *         description: Payment intent not found
 */
router.post('/confirm-payment', (req, res) =>
  checkoutController.confirmPayment(req, res)
);

/**
 * @swagger
 * /api/v1/checkout/payment-status/{paymentIntentId}:
 *   get:
 *     summary: Get payment status
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentIntentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "pi_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentStatus:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         status:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         currency:
 *                           type: string
 *       400:
 *         description: Payment intent ID is required
 *       404:
 *         description: Payment intent not found
 */
router.get('/payment-status/:paymentIntentId', (req, res) =>
  checkoutController.getPaymentStatus(req, res)
);

/**
 * @swagger
 * /api/v1/checkout/cancel/{paymentIntentId}:
 *   post:
 *     summary: Cancel payment intent and release reservations
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentIntentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "pi_1234567890abcdef"
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     message:
 *                       type: string
 *       400:
 *         description: Payment intent ID is required
 *       401:
 *         description: Customer identification required
 *       404:
 *         description: Payment intent not found
 */
router.post('/cancel/:paymentIntentId', (req, res) =>
  checkoutController.cancelPayment(req, res)
);

export const checkoutRoutes: Router = router;
