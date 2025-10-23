/**
 * Cross-Property Transfer Routes - API routes for property transfers
 */

import { CrossPropertyTransferController } from '@/controllers/cross-property-transfer.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { CrossPropertyTransferService } from '@/services/cross-property-transfer.service';
import { Router, Request, Response } from 'express';

const router: any = Router();
const prisma = new PrismaClient();
const transferService = new CrossPropertyTransferService(prisma);
const transferController = new CrossPropertyTransferController(transferService);

/**
 * @swagger
 * /api/transfers:
 *   post:
 *     summary: Create a new cross-property transfer request
 *     tags: [Cross-Property Transfers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromPropertyId
 *               - toPropertyId
 *               - transferType
 *               - entityId
 *               - entityType
 *               - reason
 *               - transferData
 *             properties:
 *               fromPropertyId:
 *                 type: string
 *                 description: Source property ID
 *               toPropertyId:
 *                 type: string
 *                 description: Destination property ID
 *               transferType:
 *                 type: string
 *                 enum: [inventory, booking, guest, staff]
 *                 description: Type of transfer
 *               entityId:
 *                 type: string
 *                 description: ID of the entity being transferred
 *               entityType:
 *                 type: string
 *                 description: Type of entity being transferred
 *               reason:
 *                 type: string
 *                 description: Reason for the transfer
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               transferData:
 *                 type: object
 *                 description: Transfer-specific data
 *     responses:
 *       201:
 *         description: Transfer request created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', (req, res) => transferController.createTransfer(req, res));

/**
 * @swagger
 * /api/transfers/{id}:
 *   get:
 *     summary: Get transfer by ID
 *     tags: [Cross-Property Transfers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID
 *     responses:
 *       200:
 *         description: Transfer details
 *       404:
 *         description: Transfer not found
 */
router.get('/:id', (req, res) => transferController.getTransfer(req, res));

/**
 * @swagger
 * /api/transfers/property/{propertyId}:
 *   get:
 *     summary: Get transfers for a property
 *     tags: [Cross-Property Transfers]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *       - in: query
 *         name: direction
 *         schema:
 *           type: string
 *           enum: [incoming, outgoing, both]
 *           default: both
 *         description: Transfer direction
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, completed, cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: transferType
 *         schema:
 *           type: string
 *           enum: [inventory, booking, guest, staff]
 *         description: Filter by transfer type
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
 *         description: List of transfers for the property
 */
router.get('/property/:propertyId', (req, res) =>
  transferController.getTransfersForProperty(req, res)
);

/**
 * @swagger
 * /api/transfers/{id}/approve:
 *   post:
 *     summary: Approve a transfer request
 *     tags: [Cross-Property Transfers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approvedBy
 *             properties:
 *               approvedBy:
 *                 type: string
 *                 description: User ID who approved the transfer
 *     responses:
 *       200:
 *         description: Transfer approved successfully
 *       404:
 *         description: Transfer not found
 */
router.post('/:id/approve', (req, res) =>
  transferController.approveTransfer(req, res)
);

/**
 * @swagger
 * /api/transfers/{id}/complete:
 *   post:
 *     summary: Complete a transfer (execute the actual transfer)
 *     tags: [Cross-Property Transfers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *       404:
 *         description: Transfer not found
 */
router.post('/:id/complete', (req, res) =>
  transferController.completeTransfer(req, res)
);

/**
 * @swagger
 * /api/transfers/{id}/cancel:
 *   post:
 *     summary: Cancel a transfer request
 *     tags: [Cross-Property Transfers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transfer ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Transfer cancelled successfully
 *       404:
 *         description: Transfer not found
 */
router.post('/:id/cancel', (req, res) =>
  transferController.cancelTransfer(req, res)
);

export default router;
