import { Router } from 'express';
import BatchController from '../controllers/batch.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { CartService } from '../services/cart.service';
import { InventoryService } from '../services/inventory.service';
import { responseOptimizationService } from '../services/response-optimization.service';

const router: Router = Router();

// Initialize controller with dependencies
const batchController = new BatchController(
  new CartService((global as any).prisma),
  new InventoryService()
);

// Apply optimization middlewares
router.use(responseOptimizationService.getCompressionMiddleware());
router.use(responseOptimizationService.fieldSelectionMiddleware());
router.use(responseOptimizationService.responseCachingMiddleware());
router.use(responseOptimizationService.batchOperationMiddleware());
router.use(responseOptimizationService.performanceMonitoringMiddleware());
router.use(responseOptimizationService.contentNegotiationMiddleware());

/**
 * @swagger
 * /api/v1/batch/cart:
 *   post:
 *     summary: Batch cart operations
 *     description: Perform multiple cart operations (add, update, remove) in a single request
 *     tags: [Batch Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 maxItems: 50
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 0
 *                     action:
 *                       type: string
 *                       enum: [add, update, remove]
 *                       default: update
 *               options:
 *                 type: object
 *                 properties:
 *                   validateInventory:
 *                     type: boolean
 *                     default: true
 *                   continueOnError:
 *                     type: boolean
 *                     default: false
 *                   returnDetails:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: Batch operations completed
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
 *                     operations:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         successful:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *                     details:
 *                       type: object
 *                       properties:
 *                         results:
 *                           type: array
 *                         errors:
 *                           type: array
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 */
router.post(
  '/cart',
  authMiddleware,
  batchController.batchCartOperations.bind(batchController)
);

/**
 * @swagger
 * /api/v1/batch/inventory:
 *   post:
 *     summary: Batch inventory updates
 *     description: Update multiple product inventories in a single request (vendor only)
 *     tags: [Batch Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 0
 *                     operation:
 *                       type: string
 *                       enum: [set, increment, decrement]
 *                       default: set
 *               options:
 *                 type: object
 *                 properties:
 *                   validateOnly:
 *                     type: boolean
 *                     default: false
 *                   notifyVendors:
 *                     type: boolean
 *                     default: true
 *                   updateCache:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: Batch inventory updates completed
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Vendor access required
 */
router.post(
  '/inventory',
  authMiddleware,
  batchController.batchInventoryUpdates.bind(batchController)
);

/**
 * @swagger
 * /api/v1/batch/cache/refresh:
 *   post:
 *     summary: Batch cache refresh
 *     description: Refresh cache for multiple products
 *     tags: [Batch Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: string
 *               options:
 *                 type: object
 *                 properties:
 *                   forceRefresh:
 *                     type: boolean
 *                     default: false
 *                   includePricing:
 *                     type: boolean
 *                     default: true
 *                   includeInventory:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: Batch cache refresh completed
 *       400:
 *         description: Invalid request data
 */
router.post(
  '/cache/refresh',
  batchController.batchCacheRefresh.bind(batchController)
);

/**
 * @swagger
 * /api/v1/batch/search:
 *   post:
 *     summary: Batch search operations
 *     description: Execute multiple search queries in a single request
 *     tags: [Batch Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - queries
 *             properties:
 *               queries:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                     category:
 *                       type: string
 *                     subcategory:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     minPrice:
 *                       type: number
 *                     maxPrice:
 *                       type: number
 *                     limit:
 *                       type: integer
 *                       default: 10
 *                       maximum: 50
 *               options:
 *                 type: object
 *                 properties:
 *                   cacheResults:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: Batch search completed
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
 *                     searches:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           query:
 *                             type: object
 *                           results:
 *                             type: object
 *                           cached:
 *                             type: boolean
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         successful:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *       400:
 *         description: Invalid request data
 */
router.post('/search', batchController.batchSearch.bind(batchController));

/**
 * @swagger
 * /api/v1/batch/status/{batchId}:
 *   get:
 *     summary: Get batch operation status
 *     description: Get the status of a batch operation
 *     tags: [Batch Operations]
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch operation ID
 *     responses:
 *       200:
 *         description: Batch operation status
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
 *                     batchId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed]
 *                     progress:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Batch operation not found
 */
router.get(
  '/status/:batchId',
  batchController.getBatchStatus.bind(batchController)
);

export default router;
