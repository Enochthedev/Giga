/**
 * Brand Routes - API routes for hotel brand management
 */

import { BrandController } from '@/controllers/brand.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { BrandService } from '@/services/brand.service';
import { Request, Response, Router } from 'express';

const router: any = Router();
const prisma = new PrismaClient();
const brandService = new BrandService(prisma);
const brandController = new BrandController(brandService);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new hotel brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chainId
 *               - name
 *               - code
 *             properties:
 *               chainId:
 *                 type: string
 *                 description: Parent chain ID
 *               name:
 *                 type: string
 *                 description: Brand name
 *               description:
 *                 type: string
 *                 description: Brand description
 *               code:
 *                 type: string
 *                 description: Brand code (unique within chain)
 *               brandStandards:
 *                 type: object
 *                 description: Brand standards and requirements
 *               amenityRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required amenities for this brand
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', (req, res) => brandController.createBrand(req, res));

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands with filtering and pagination
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query for brand name or code
 *       - in: query
 *         name: chainId
 *         schema:
 *           type: string
 *         description: Filter by chain ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', (req, res) => brandController.getBrands(req, res));

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand details
 *       404:
 *         description: Brand not found
 */
router.get('/:id', (req, res) => brandController.getBrand(req, res));

/**
 * @swagger
 * /api/brands/chain/{chainId}:
 *   get:
 *     summary: Get brands by chain ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: chainId
 *         required: true
 *         schema:
 *           type: string
 *         description: Chain ID
 *     responses:
 *       200:
 *         description: List of brands for the chain
 */
router.get('/chain/:chainId', (req, res) =>
  brandController.getBrandsByChain(req, res)
);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *               brandStandards:
 *                 type: object
 *               amenityRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */
router.put('/:id', (req, res) => brandController.updateBrand(req, res));

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete brand
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
router.delete('/:id', (req, res) => brandController.deleteBrand(req, res));

export default router;
