import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { prisma } from '../lib/prisma';
import {
  handleAuthentication,
  handleSession,
} from '../middleware/session.middleware';
import { cartRateLimit, validate } from '../middleware/validation.middleware';
import {
  CartItemParamsSchema,
  SanitizedAddToCartSchema,
  UpdateCartItemSchema,
} from '../schemas/validation.schemas';
import { CartService } from '../services/cart.service';

const router = Router();

// Initialize cart service and controller
const cartService = new CartService(prisma);
const cartController = new CartController(cartService);

// Apply session middleware to all cart routes
router.use(handleSession);
router.use(handleAuthentication);

// Apply cart-specific rate limiting
router.use(cartRateLimit);

// Route handlers using the CartController

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get current user shopping cart with product enrichment
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => cartController.getCart(req, res));

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add item to shopping cart with inventory validation
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: clr123product1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid request or insufficient stock
 *       404:
 *         description: Product not found
 */
router.post('/add', validate({ body: SanitizedAddToCartSchema }), (req, res) =>
  cartController.addItem(req, res)
);

/**
 * @swagger
 * /api/v1/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         example: item_123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid request or insufficient stock
 *       404:
 *         description: Cart or item not found
 */
router.put(
  '/items/:itemId',
  validate({
    params: CartItemParamsSchema,
    body: UpdateCartItemSchema,
  }),
  (req, res) => cartController.updateItemQuantity(req, res)
);

/**
 * @swagger
 * /api/v1/cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         example: item_123
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart or item not found
 */
router.delete(
  '/items/:itemId',
  validate({ params: CartItemParamsSchema }),
  (req, res) => cartController.removeItem(req, res)
);

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/', (req, res) => cartController.clearCart(req, res));

/**
 * @swagger
 * /api/v1/cart/validate:
 *   get:
 *     summary: Validate cart items and return issues
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart validation completed
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
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *                     validation:
 *                       type: object
 *                       properties:
 *                         isValid:
 *                           type: boolean
 *                         issues:
 *                           type: array
 *                           items:
 *                             type: object
 */
router.get('/validate', (req, res) => cartController.validateCart(req, res));

/**
 * @swagger
 * /api/v1/cart/merge:
 *   post:
 *     summary: Merge anonymous cart with authenticated user cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - anonymousSessionId
 *             properties:
 *               anonymousSessionId:
 *                 type: string
 *                 example: anonymous_session_123
 *     responses:
 *       200:
 *         description: Cart merged successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: User must be authenticated
 */
router.post('/merge', (req, res) => cartController.mergeCart(req, res));

/**
 * @swagger
 * /api/v1/cart/merge-on-auth:
 *   post:
 *     summary: Automatically merge cart after user authentication
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart merged successfully after authentication
 *       401:
 *         description: User must be authenticated
 */
router.post('/merge-on-auth', (req, res) =>
  cartController.mergeCartOnAuth(req, res)
);

/**
 * @swagger
 * /api/v1/cart/stats:
 *   get:
 *     summary: Get cart statistics (admin endpoint)
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart statistics retrieved successfully
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
 *                         totalCarts:
 *                           type: number
 *                         anonymousCarts:
 *                           type: number
 *                         authenticatedCarts:
 *                           type: number
 *                         averageItems:
 *                           type: number
 *                         averageValue:
 *                           type: number
 *                         expiringCarts:
 *                           type: number
 */
router.get('/stats', (req, res) => cartController.getCartStatistics(req, res));

/**
 * @swagger
 * /api/v1/cart/expiration:
 *   get:
 *     summary: Get cart expiration information
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart expiration information retrieved successfully
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
 *                     customerId:
 *                       type: string
 *                     expiresInSeconds:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     isExpired:
 *                       type: boolean
 */
router.get('/expiration', (req, res) =>
  cartController.getCartExpiration(req, res)
);

/**
 * @swagger
 * /api/v1/cart/extend:
 *   post:
 *     summary: Extend cart expiration
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ttlSeconds:
 *                 type: number
 *                 minimum: 3600
 *                 maximum: 604800
 *                 default: 86400
 *                 description: TTL in seconds (min 1 hour, max 7 days)
 *     responses:
 *       200:
 *         description: Cart expiration extended successfully
 *       401:
 *         description: Customer ID is required
 */
router.post('/extend', (req, res) =>
  cartController.extendCartExpiration(req, res)
);

/**
 * @swagger
 * /api/v1/cart/reserve:
 *   post:
 *     summary: Reserve inventory for cart items during checkout
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expirationMinutes:
 *                 type: number
 *                 minimum: 5
 *                 maximum: 120
 *                 default: 30
 *                 description: Reservation expiration in minutes (min 5 minutes, max 2 hours)
 *     responses:
 *       200:
 *         description: Inventory reserved successfully
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
 *                     reservationId:
 *                       type: string
 *                     expiresInMinutes:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Failed to reserve inventory
 *       401:
 *         description: Customer ID is required
 */
router.post('/reserve', (req, res) =>
  cartController.reserveInventory(req, res)
);

/**
 * @swagger
 * /api/v1/cart/reserve/{reservationId}:
 *   delete:
 *     summary: Release inventory reservation
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         example: res_1234567890_abc123
 *     responses:
 *       200:
 *         description: Inventory reservation released successfully
 *       400:
 *         description: Reservation ID is required
 */
router.delete('/reserve/:reservationId', (req, res) =>
  cartController.releaseReservation(req, res)
);

/**
 * @swagger
 * /api/v1/cart/checkout/validate:
 *   get:
 *     summary: Validate cart for checkout with inventory check
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart validation for checkout completed
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
 *                     validation:
 *                       type: object
 *                       properties:
 *                         isValid:
 *                           type: boolean
 *                         issues:
 *                           type: array
 *                           items:
 *                             type: object
 *                         totalItems:
 *                           type: number
 *                         totalValue:
 *                           type: number
 *                         canProceedToCheckout:
 *                           type: boolean
 *       401:
 *         description: Customer ID is required
 */
router.get('/checkout/validate', (req, res) =>
  cartController.validateForCheckout(req, res)
);

/**
 * @swagger
 * /api/v1/cart/inventory:
 *   get:
 *     summary: Get inventory status for all cart items
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory status retrieved successfully
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
 *                     inventoryStatuses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           inventoryStatus:
 *                             type: object
 *                           isAvailable:
 *                             type: boolean
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: number
 *                         availableItems:
 *                           type: number
 *                         unavailableItems:
 *                           type: number
 *       401:
 *         description: Customer ID is required
 */
router.get('/inventory', (req, res) =>
  cartController.getInventoryStatus(req, res)
);

export const cartRoutes: Router = router;
