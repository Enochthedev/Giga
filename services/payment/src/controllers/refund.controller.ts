import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { RefundService } from '../services/refund.service';
import { validateRefundRequest } from '../utils/validation';

export class RefundController {
  private refundService: RefundService;

  constructor() {
    this.refundService = new RefundService();
  }

  /**
   * @swagger
   * /api/v1/refunds:
   *   post:
   *     summary: Process a refund
   *     tags: [Refunds]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - transactionId
   *               - reason
   *               - requestedBy
   *             properties:
   *               transactionId:
   *                 type: string
   *                 description: ID of the transaction to refund
   *                 example: "txn_1234567890"
   *               amount:
   *                 type: number
   *                 description: Amount to refund (optional, defaults to full amount)
   *                 example: 50.00
   *               reason:
   *                 type: string
   *                 description: Reason for the refund
   *                 example: "customer_request"
   *               requestedBy:
   *                 type: string
   *                 description: ID of the user requesting the refund
   *                 example: "user_123"
   *               type:
   *                 type: string
   *                 enum: [full, partial]
   *                 description: Type of refund
   *                 example: "partial"
   *               metadata:
   *                 type: object
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Refund processed successfully
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
   *                     id:
   *                       type: string
   *                       example: "ref_1234567890"
   *                     transactionId:
   *                       type: string
   *                       example: "txn_1234567890"
   *                     amount:
   *                       type: number
   *                       example: 50.00
   *                     currency:
   *                       type: string
   *                       example: "USD"
   *                     status:
   *                       type: string
   *                       example: "succeeded"
   *                     reason:
   *                       type: string
   *                       example: "customer_request"
   *       400:
   *         description: Invalid request or refund policy violation
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Internal server error
   */
  processRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('Processing refund request', { body: req.body });

      const refundRequest = validateRefundRequest(req.body);
      const refund = await this.refundService.processRefund(refundRequest);

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      logger.error('Refund processing failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/refunds/{refundId}:
   *   get:
   *     summary: Get refund details
   *     tags: [Refunds]
   *     parameters:
   *       - in: path
   *         name: refundId
   *         required: true
   *         schema:
   *           type: string
   *         description: Refund ID
   *     responses:
   *       200:
   *         description: Refund details retrieved successfully
   *       404:
   *         description: Refund not found
   */
  getRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refundId } = req.params;

      logger.info('Getting refund details', { refundId });

      const refund = await this.refundService.getRefund(refundId!);

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      logger.error('Failed to get refund', {
        error,
        refundId: req.params.refundId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/transactions/{transactionId}/refunds:
   *   get:
   *     summary: Get refunds for a transaction
   *     tags: [Refunds]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     responses:
   *       200:
   *         description: Refunds retrieved successfully
   *       404:
   *         description: Transaction not found
   */
  getRefundsByTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { transactionId } = req.params;

      logger.info('Getting refunds for transaction', { transactionId });

      const refunds = await this.refundService.getRefundsByTransaction(
        transactionId!
      );

      res.status(200).json({
        success: true,
        data: refunds,
      });
    } catch (error) {
      logger.error('Failed to get refunds for transaction', {
        error,
        transactionId: req.params.transactionId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/refunds/{refundId}/cancel:
   *   post:
   *     summary: Cancel a pending refund
   *     tags: [Refunds]
   *     parameters:
   *       - in: path
   *         name: refundId
   *         required: true
   *         schema:
   *           type: string
   *         description: Refund ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - reason
   *             properties:
   *               reason:
   *                 type: string
   *                 description: Reason for cancelling the refund
   *                 example: "Customer changed mind"
   *     responses:
   *       200:
   *         description: Refund cancelled successfully
   *       400:
   *         description: Cannot cancel refund in current status
   *       404:
   *         description: Refund not found
   */
  cancelRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refundId } = req.params;
      const { reason } = req.body;

      logger.info('Cancelling refund', { refundId, reason });

      const refund = await this.refundService.cancelRefund(refundId!, reason);

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      logger.error('Failed to cancel refund', {
        error,
        refundId: req.params.refundId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/refunds/partial:
   *   post:
   *     summary: Process a partial refund
   *     tags: [Refunds]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - transactionId
   *               - amount
   *               - reason
   *               - requestedBy
   *             properties:
   *               transactionId:
   *                 type: string
   *                 description: ID of the transaction to refund
   *               amount:
   *                 type: number
   *                 description: Amount to refund
   *               reason:
   *                 type: string
   *                 description: Reason for the refund
   *               requestedBy:
   *                 type: string
   *                 description: ID of the user requesting the refund
   *     responses:
   *       200:
   *         description: Partial refund processed successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  processPartialRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { transactionId, amount, reason, requestedBy } = req.body;

      logger.info('Processing partial refund', {
        transactionId,
        amount,
        reason,
      });

      const refund = await this.refundService.processPartialRefund(
        transactionId,
        amount,
        reason,
        requestedBy
      );

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      logger.error('Partial refund processing failed', {
        error,
        body: req.body,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/refunds/full:
   *   post:
   *     summary: Process a full refund
   *     tags: [Refunds]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - transactionId
   *               - reason
   *               - requestedBy
   *             properties:
   *               transactionId:
   *                 type: string
   *                 description: ID of the transaction to refund
   *               reason:
   *                 type: string
   *                 description: Reason for the refund
   *               requestedBy:
   *                 type: string
   *                 description: ID of the user requesting the refund
   *     responses:
   *       200:
   *         description: Full refund processed successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  processFullRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { transactionId, reason, requestedBy } = req.body;

      logger.info('Processing full refund', { transactionId, reason });

      const refund = await this.refundService.processFullRefund(
        transactionId,
        reason,
        requestedBy
      );

      res.status(200).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      logger.error('Full refund processing failed', { error, body: req.body });
      next(error);
    }
  };
}
