import { Router } from 'express';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { VendorController } from '../controllers/vendor.controller';
import { PrismaClient } from '../generated/prisma-client';
import { authMiddleware, requireVendor } from '../middleware/auth.middleware';
import { InventoryService } from '../services/inventory.service';
import { VendorOrderService } from '../services/vendor-order.service';

const router = Router();

// Initialize services and clients
const prisma = new PrismaClient();
// const cartService = new CartService(prisma);
const inventoryService = new InventoryService();

// Initialize service clients - commented out until needed
// const authServiceClient = new HttpAuthServiceClient(
//   process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
// );
// const paymentServiceClient = new HttpPaymentServiceClient(
//   process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'
// );
const notificationServiceClient = new HttpNotificationServiceClient(
  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004'
);

// Note: orderService not used in vendor routes but kept for potential future use

// Initialize vendor order service
const vendorOrderService = new VendorOrderService(
  prisma,
  notificationServiceClient
);

// Initialize vendor controller
const vendorController = new VendorController(
  prisma,
  vendorOrderService,
  inventoryService,
  notificationServiceClient
);

// Apply authentication and vendor authorization middleware to all routes
router.use(authMiddleware);
router.use(requireVendor);

/**
 * @swagger
 * /api/v1/vendor/orders:
 *   get:
 *     summary: Get vendor orders with pagination and filters
 *     tags: [Vendor]
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
 *         description: Vendor orders retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       500:
 *         description: Internal server error
 */
router.get('/orders', vendorController.getVendorOrders.bind(vendorController));

/**
 * @swagger
 * /api/v1/vendor/orders/{id}/status:
 *   put:
 *     summary: Update vendor order status
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor order ID
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
 *         description: Vendor order status updated successfully
 *       400:
 *         description: Invalid status transition or request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       404:
 *         description: Vendor order not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/orders/:id/status',
  vendorController.updateVendorOrderStatus.bind(vendorController)
);

/**
 * @swagger
 * /api/v1/vendor/dashboard:
 *   get:
 *     summary: Get vendor dashboard analytics
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
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
 *                     totalProducts:
 *                       type: integer
 *                     totalOrders:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     pendingOrders:
 *                       type: integer
 *                     lowStockProducts:
 *                       type: integer
 *                     recentOrders:
 *                       type: array
 *                     analytics:
 *                       type: object
 *                       properties:
 *                         salesThisMonth:
 *                           type: number
 *                         ordersThisMonth:
 *                           type: integer
 *                         averageOrderValue:
 *                           type: number
 *                         conversionRate:
 *                           type: number
 *                         topSellingProducts:
 *                           type: array
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/dashboard',
  vendorController.getVendorDashboard.bind(vendorController)
);

/**
 * @swagger
 * /api/v1/vendor/products:
 *   get:
 *     summary: Get vendor products with filtering and pagination
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 20
 *         description: Number of products per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: all
 *         description: Filter by product status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name, description, or SKU
 *     responses:
 *       200:
 *         description: Vendor products retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/products',
  vendorController.getVendorProducts.bind(vendorController)
);

/**
 * @swagger
 * /api/v1/vendor/products/{id}/inventory:
 *   put:
 *     summary: Update product inventory
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *                 minimum: 0
 *                 description: New inventory quantity
 *               lowStockThreshold:
 *                 type: integer
 *                 minimum: 0
 *                 description: Low stock alert threshold
 *               trackQuantity:
 *                 type: boolean
 *                 description: Whether to track inventory quantity
 *     responses:
 *       200:
 *         description: Product inventory updated successfully
 *       400:
 *         description: Invalid inventory data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/products/:id/inventory',
  vendorController.updateProductInventory.bind(vendorController)
);

/**
 * @swagger
 * /api/v1/vendor/products/inventory/bulk:
 *   put:
 *     summary: Bulk update product inventories
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updates
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: integer
 *                       minimum: 0
 *                       description: New inventory quantity
 *                     lowStockThreshold:
 *                       type: integer
 *                       minimum: 0
 *                       description: Low stock alert threshold
 *     responses:
 *       200:
 *         description: Bulk inventory update completed successfully
 *       400:
 *         description: Invalid bulk inventory data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       500:
 *         description: Internal server error
 */
router.put(
  '/products/inventory/bulk',
  vendorController.bulkUpdateInventory.bind(vendorController)
);

/**
 * @swagger
 * /api/v1/vendor/products/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products retrieved successfully
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     count:
 *                       type: integer
 *                       description: Number of low stock products
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Vendor access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/products/low-stock',
  vendorController.getLowStockProducts.bind(vendorController)
);

export const vendorRoutes: Router = router;
