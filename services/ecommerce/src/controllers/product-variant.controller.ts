import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma-client';
import { ProductVariantService } from '../services/product-variant.service';

const prisma = new PrismaClient();
const productVariantService = new ProductVariantService(prisma);

export class ProductVariantController {
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
  static async getProductVariants(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const variants =
        await productVariantService.getProductVariants(productId);

      res.json({
        success: true,
        data: variants,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get product variants',
      });
    }
  }

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
  static async createVariant(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const variantData = { ...req.body, productId };

      const variant = await productVariantService.createVariant(variantData);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create product variant',
      });
    }
  }

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
  static async getVariant(req: Request, res: Response) {
    try {
      const { variantId } = req.params;

      const variant = await productVariantService.getVariant(variantId);

      if (!variant) {
        return res.status(404).json({
          success: false,
          error: 'Product variant not found',
        });
      }

      res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get product variant',
      });
    }
  }

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
  static async updateVariant(req: Request, res: Response) {
    try {
      const { variantId } = req.params;

      const variant = await productVariantService.updateVariant(
        variantId,
        req.body
      );

      res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update product variant',
      });
    }
  }

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
  static async updateVariantInventory(req: Request, res: Response) {
    try {
      const { variantId } = req.params;
      const { quantity, lowStockThreshold } = req.body;

      const inventory = await productVariantService.updateVariantInventory(
        variantId,
        { quantity, lowStockThreshold }
      );

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update variant inventory',
      });
    }
  }

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
  static async searchVariants(req: Request, res: Response) {
    try {
      const { attributes, productId } = req.query;

      const parsedAttributes = attributes
        ? JSON.parse(attributes as string)
        : {};

      const variants = await productVariantService.searchVariantsByAttributes(
        parsedAttributes,
        productId as string
      );

      res.json({
        success: true,
        data: variants,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to search variants',
      });
    }
  }
}
