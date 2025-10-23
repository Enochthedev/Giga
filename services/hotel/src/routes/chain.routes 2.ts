/**
 * Chain Routes - API routes for hotel chain management
 */

import { ChainController } from '@/controllers/chain.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { ChainService } from '@/services/chain.service';
import { Router } from 'express';

const router: any = Router();
const prisma = new PrismaClient();
const chainService = new ChainService(prisma);
const chainController = new ChainController(chainService);

/**
 * @swagger
 * /api/chains:
 *   post:
 *     summary: Create a new hotel chain
 *     tags: [Chains]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *                 description: Chain name
 *               description:
 *                 type: string
 *                 description: Chain description
 *               code:
 *                 type: string
 *                 description: Unique chain code
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   website:
 *                     type: string
 *               defaultCurrency:
 *                 type: string
 *                 default: USD
 *               defaultTimezone:
 *                 type: string
 *                 default: UTC
 *     responses:
 *       201:
 *         description: Chain created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', (req: Request, res: Response) =>
  chainController.createChain(req, res)
);

/**
 * @swagger
 * /api/chains:
 *   get:
 *     summary: Get all chains with filtering and pagination
 *     tags: [Chains]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query for chain name or code
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
 *         description: List of chains
 */
router.get('/', (req: Request, res: Response) =>
  chainController.getChains(req, res)
);

/**
 * @swagger
 * /api/chains/{id}:
 *   get:
 *     summary: Get chain by ID
 *     tags: [Chains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Chain ID
 *     responses:
 *       200:
 *         description: Chain details
 *       404:
 *         description: Chain not found
 */
router.get('/:id', (req: Request, res: Response) =>
  chainController.getChain(req, res)
);

/**
 * @swagger
 * /api/chains/{id}:
 *   put:
 *     summary: Update chain
 *     tags: [Chains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Chain ID
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
 *               contactInfo:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Chain updated successfully
 *       404:
 *         description: Chain not found
 */
router.put('/:id', (req: Request, res: Response) =>
  chainController.updateChain(req, res)
);

/**
 * @swagger
 * /api/chains/{id}:
 *   delete:
 *     summary: Delete chain
 *     tags: [Chains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Chain ID
 *     responses:
 *       200:
 *         description: Chain deleted successfully
 *       404:
 *         description: Chain not found
 */
router.delete('/:id', (req: Request, res: Response) =>
  chainController.deleteChain(req, res)
);

export default router;
