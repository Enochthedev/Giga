import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { prisma } from '../lib/prisma';
import { cartRateLimit, validate } from '../middleware/validation.middleware';
import {
  CartItemParamsSchema,
  UpdateCartItemSchema,
} from '../schemas/validation.schemas';
import { CartService } from '../services/cart.service';

const router = Router();

// Initialize cart service and controller
const cartService = new CartService(prisma);
const cartController = new CartController(cartService);

// Apply cart-specific rate limiting
router.use(cartRateLimit);

// Note: Authentication is optional for cart routes
// Guest users can use X-Cart-Id header to identify their cart
// Authenticated users will have their user ID from auth middleware

// Route handlers using the CartController

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get current user shopping cart with product enrichment
 *     description: |
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
 *     security:
 *       - bearerAuth: []
 *       - {}
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
 *       400:
 *         description: X-Cart-Id header required for guest users or invalid cart ID format
 */
router.get('/', (req, res) => cartController.getCart(req, res));

/**
 * @swagger
 * /api/v1/cart/add:
 *   post:
 *     summary: Add item(s) to shopping cart with inventory validation
 *     description: |
 *       Unified endpoint that supports both single item and bulk operations.
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 title: Single Item
 *                 required:
 *                   - productId
 *                   - quantity
 *                 properties:
 *                   productId:
 *                     type: string
 *                     example: clr123product1
 *                   quantity:
 *                     type: integer
 *                     minimum: 1
 *                     example: 2
 *               - type: object
 *                 title: Multiple Items
 *                 required:
 *                   - items
 *                 properties:
 *                   items:
 *                     type: array
 *                     minItems: 1
 *                     maxItems: 50
 *                     items:
 *                       type: object
 *                       required:
 *                         - productId
 *                         - quantity
 *                       properties:
 *                         productId:
 *                           type: string
 *                           example: clr123product1
 *                         quantity:
 *                           type: integer
 *                           minimum: 1
 *                           example: 2
 *           examples:
 *             singleItem:
 *               summary: Add single item
 *               value:
 *                 productId: "cmgrnxxab0017seeuiqtbj7we"
 *                 quantity: 3
 *             multipleItems:
 *               summary: Add multiple items
 *               value:
 *                 items:
 *                   - productId: "cmgrnxxab0017seeuiqtbj7we"
 *                     quantity: 3
 *                   - productId: "cmgrnxxa80014seeuww1kxorh"
 *                     quantity: 4
 *                   - productId: "cmgrnxxa50011seeuap1ht0om"
 *                     quantity: 3
 *     responses:
 *       200:
 *         description: Item(s) added to cart successfully
 *       400:
 *         description: Invalid request or insufficient stock
 *       404:
 *         description: Product(s) not found
 */
router.post('/add', (req, res) => cartController.addItems(req, res));

/**
 * @swagger
 * /api/v1/cart/items/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     description: |
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         example: item_123
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
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
 *     description: |
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         example: item_123
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
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
 *     description: |
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       400:
 *         description: X-Cart-Id header required for guest users
 */
router.delete('/', (req, res) => cartController.clearCart(req, res));

/**
 * @swagger
 * /api/v1/cart/validate:
 *   get:
 *     summary: Validate cart items and return issues
 *     description: |
 *       Supports both authenticated and guest users.
 *       - Authenticated users: Include Bearer token in Authorization header
 *       - Guest users: Include X-Cart-Id header with format cart_anonymous_{uuid}
 *     tags: [Shopping Cart]
 *     parameters:
 *       - in: header
 *         name: X-Cart-Id
 *         schema:
 *           type: string
 *           example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *         required: false
 *         description: Required for guest users. Format cart_anonymous_{uuid}
 *     security:
 *       - bearerAuth: []
 *       - {}
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
 *     description: |
 *       Merges items from an anonymous cart into the authenticated user's cart.
 *       Requires authentication. Duplicate items will have their quantities combined.
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
 *               - anonymousCartId
 *             properties:
 *               anonymousCartId:
 *                 type: string
 *                 example: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
 *                 description: Anonymous cart ID with format cart_anonymous_{uuid}
 *     responses:
 *       200:
 *         description: Cart merged successfully
 *       400:
 *         description: Invalid request or invalid cart ID format
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
