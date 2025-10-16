import { Router } from 'express';
import { ProductVariantController } from '../controllers/product-variant.controller';
import { handleSession } from '../middleware/session.middleware';

const router: Router = Router();

// Apply session middleware
router.use(handleSession);

/**
 * @swagger
 * /api/v1/products/{productId}/variants:
 *   get:
 *     summary: Get all variants for a product
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product variants
 */
router.get(
  '/products/:productId/variants',
  ProductVariantController.getProductVariants
);

/**
 * @swagger
 * /api/v1/products/{productId}/variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               attributes:
 *                 type: object
 *                 example: { "color": "blue", "size": "M" }
 *               inventory:
 *                 type: object
 *                 properties:
 *                   quantity:
 *                     type: integer
 *                   lowStockThreshold:
 *                     type: integer
 *     responses:
 *       201:
 *         description: Product variant created successfully
 */
router.post(
  '/products/:productId/variants',
  ProductVariantController.createVariant
);

/**
 * @swagger
 * /api/v1/variants/{variantId}:
 *   get:
 *     summary: Get a specific variant
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Product variant details
 */
router.get('/variants/:variantId', ProductVariantController.getVariant);

/**
 * @swagger
 * /api/v1/variants/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               attributes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 */
router.put('/variants/:variantId', ProductVariantController.updateVariant);

/**
 * @swagger
 * /api/v1/variants/{variantId}/inventory:
 *   put:
 *     summary: Update variant inventory
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               lowStockThreshold:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Variant inventory updated successfully
 */
router.put(
  '/variants/:variantId/inventory',
  ProductVariantController.updateVariantInventory
);

/**
 * @swagger
 * /api/v1/variants/search:
 *   get:
 *     summary: Search variants by attributes
 *     tags: [Product Variants]
 *     parameters:
 *       - in: query
 *         name: attributes
 *         schema:
 *           type: string
 *         description: JSON string of attributes to search for
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: List of matching variants
 */
router.get('/variants/search', ProductVariantController.searchVariants);

export default router;
