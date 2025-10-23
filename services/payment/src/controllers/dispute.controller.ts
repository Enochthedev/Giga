import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { DisputeService } from '../services/dispute.service';

export class DisputeController {
  private disputeService: DisputeService;

  constructor() {
    this.disputeService = new DisputeService();
  }

  /**
   * @swagger
   * /api/v1/disputes:
   *   post:
   *     summary: Create a new dispute
   *     tags: [Disputes]
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
   *             properties:
   *               transactionId:
   *                 type: string
   *                 description: ID of the disputed transaction
   *                 example: "txn_1234567890"
   *               amount:
   *                 type: number
   *                 description: Disputed amount
   *                 example: 100.00
   *               reason:
   *                 type: string
   *                 description: Reason for the dispute
   *                 example: "fraudulent"
   *               evidenceDeadline:
   *                 type: string
   *                 format: date-time
   *                 description: Deadline for evidence submission
   *               gatewayDisputeId:
   *                 type: string
   *                 description: Gateway-specific dispute ID
   *               metadata:
   *                 type: object
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Dispute created successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  createDispute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('Creating dispute', { body: req.body });

      const dispute = await this.disputeService.createDispute(req.body);

      res.status(200).json({
        success: true,
        data: dispute,
      });
    } catch (error) {
      logger.error('Dispute creation failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/disputes/{disputeId}:
   *   get:
   *     summary: Get dispute details
   *     tags: [Disputes]
   *     parameters:
   *       - in: path
   *         name: disputeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Dispute ID
   *     responses:
   *       200:
   *         description: Dispute details retrieved successfully
   *       404:
   *         description: Dispute not found
   */
  getDispute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { disputeId } = req.params;

      logger.info('Getting dispute details', { disputeId });

      const dispute = await this.disputeService.getDispute(disputeId!);

      res.status(200).json({
        success: true,
        data: dispute,
      });
    } catch (error) {
      logger.error('Failed to get dispute', {
        error,
        disputeId: req.params.disputeId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/transactions/{transactionId}/disputes:
   *   get:
   *     summary: Get disputes for a transaction
   *     tags: [Disputes]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     responses:
   *       200:
   *         description: Disputes retrieved successfully
   *       404:
   *         description: Transaction not found
   */
  getDisputesByTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { transactionId } = req.params;

      logger.info('Getting disputes for transaction', { transactionId });

      const disputes = await this.disputeService.getDisputesByTransaction(
        transactionId!
      );

      res.status(200).json({
        success: true,
        data: disputes,
      });
    } catch (error) {
      logger.error('Failed to get disputes for transaction', {
        error,
        transactionId: req.params.transactionId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/disputes/{disputeId}/evidence:
   *   post:
   *     summary: Submit evidence for a dispute
   *     tags: [Disputes]
   *     parameters:
   *       - in: path
   *         name: disputeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Dispute ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - evidence
   *               - submittedBy
   *             properties:
   *               evidence:
   *                 type: object
   *                 description: Evidence documents and information
   *                 properties:
   *                   customerCommunication:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: Customer communication records
   *                   receiptOrInvoice:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: Receipt or invoice documents
   *                   shippingDocumentation:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: Shipping and delivery proof
   *                   productOrServiceDescription:
   *                     type: string
   *                     description: Description of product or service
   *               submittedBy:
   *                 type: string
   *                 description: ID of the user submitting evidence
   *               metadata:
   *                 type: object
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Evidence submitted successfully
   *       400:
   *         description: Invalid request or evidence deadline passed
   *       404:
   *         description: Dispute not found
   */
  submitEvidence = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { disputeId } = req.params;
      const { evidence, submittedBy, metadata } = req.body;

      logger.info('Submitting dispute evidence', { disputeId, submittedBy });

      const dispute = await this.disputeService.submitEvidence({
        disputeId: disputeId!,
        evidence,
        submittedBy,
        metadata,
      });

      res.status(200).json({
        success: true,
        data: dispute,
      });
    } catch (error) {
      logger.error('Failed to submit dispute evidence', {
        error,
        disputeId: req.params.disputeId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/disputes/{disputeId}/respond:
   *   post:
   *     summary: Respond to a dispute automatically
   *     tags: [Disputes]
   *     parameters:
   *       - in: path
   *         name: disputeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Dispute ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - response
   *               - submittedBy
   *             properties:
   *               response:
   *                 type: string
   *                 description: Response to the dispute
   *               evidence:
   *                 type: object
   *                 description: Supporting evidence
   *               submittedBy:
   *                 type: string
   *                 description: ID of the user submitting response
   *               metadata:
   *                 type: object
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Response submitted successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Dispute not found
   */
  respondToDispute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { disputeId } = req.params;
      const { response, evidence, submittedBy, metadata } = req.body;

      logger.info('Responding to dispute', { disputeId, submittedBy });

      const dispute = await this.disputeService.respondToDispute({
        disputeId: disputeId!,
        response,
        evidence,
        submittedBy,
        metadata,
      });

      res.status(200).json({
        success: true,
        data: dispute,
      });
    } catch (error) {
      logger.error('Failed to respond to dispute', {
        error,
        disputeId: req.params.disputeId,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/disputes/{disputeId}/status:
   *   patch:
   *     summary: Update dispute status
   *     tags: [Disputes]
   *     parameters:
   *       - in: path
   *         name: disputeId
   *         required: true
   *         schema:
   *           type: string
   *         description: Dispute ID
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
   *                 enum: [open, under_review, won, lost, warning_closed]
   *                 description: New dispute status
   *               gatewayData:
   *                 type: object
   *                 description: Additional data from gateway
   *     responses:
   *       200:
   *         description: Dispute status updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Dispute not found
   */
  updateDisputeStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { disputeId } = req.params;
      const { status, gatewayData } = req.body;

      logger.info('Updating dispute status', { disputeId, status });

      const dispute = await this.disputeService.updateDisputeStatus(
        disputeId!,
        status,
        gatewayData
      );

      res.status(200).json({
        success: true,
        data: dispute,
      });
    } catch (error) {
      logger.error('Failed to update dispute status', {
        error,
        disputeId: req.params.disputeId,
        status: req.body.status,
      });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/disputes/analytics:
   *   get:
   *     summary: Get dispute analytics and reporting
   *     tags: [Disputes]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date for analytics period
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date for analytics period
   *       - in: query
   *         name: merchantId
   *         schema:
   *           type: string
   *         description: Filter by merchant ID
   *     responses:
   *       200:
   *         description: Analytics retrieved successfully
   *       400:
   *         description: Invalid date parameters
   */
  getDisputeAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { startDate, endDate, merchantId } = req.query;

      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }

      logger.info('Getting dispute analytics', {
        startDate,
        endDate,
        merchantId,
      });

      const analytics = await this.disputeService.getDisputeAnalytics(
        new Date(startDate as string),
        new Date(endDate as string),
        merchantId as string
      );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Failed to get dispute analytics', {
        error,
        query: req.query,
      });
      next(error);
    }
  };
}
