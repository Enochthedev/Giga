import { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { PaymentService } from '../services/payment.service';
import { validateTransactionFilters } from '../utils/validation';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * @swagger
   * /api/v1/payments:
   *   post:
   *     summary: Process a payment
   *     tags: [Payments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *               - currency
   *             properties:
   *               amount:
   *                 type: number
   *                 description: Payment amount
   *                 example: 100.00
   *               currency:
   *                 type: string
   *                 description: Currency code (ISO 4217)
   *                 example: "USD"
   *               description:
   *                 type: string
   *                 description: Payment description
   *                 example: "Order payment"
   *               userId:
   *                 type: string
   *                 description: User ID
   *               merchantId:
   *                 type: string
   *                 description: Merchant ID
   *               paymentMethodId:
   *                 type: string
   *                 description: Payment method ID
   *               metadata:
   *                 type: object
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Payment processed successfully
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Internal server error
   */
  processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Processing payment request', { body: req.body });

      const paymentResult = await this.paymentService.processPayment(req.body);

      res.status(200).json({
        success: true,
        data: paymentResult,
      });
    } catch (error) {
      logger.error('Payment processing failed', { error, body: req.body });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments/{transactionId}/capture:
   *   post:
   *     summary: Capture a payment
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *                 description: Amount to capture (optional, defaults to full amount)
   *     responses:
   *       200:
   *         description: Payment captured successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  capturePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;
      const { amount } = req.body;

      logger.info('Capturing payment', { transactionId, amount });

      const result = await this.paymentService.capturePayment(transactionId!, amount);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Payment capture failed', { error, transactionId: req.params.transactionId });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments/{transactionId}/cancel:
   *   post:
   *     summary: Cancel a payment
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     responses:
   *       200:
   *         description: Payment canceled successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  cancelPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;

      logger.info('Canceling payment', { transactionId });

      const result = await this.paymentService.cancelPayment(transactionId!);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Payment cancellation failed', { error, transactionId: req.params.transactionId });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments/{transactionId}/refund:
   *   post:
   *     summary: Refund a payment
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *                 description: Amount to refund (optional, defaults to full amount)
   *               reason:
   *                 type: string
   *                 description: Refund reason
   *                 example: "Customer request"
   *     responses:
   *       200:
   *         description: Refund processed successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;
      const { amount, reason } = req.body;

      logger.info('Processing refund', { transactionId, amount, reason });

      const result = await this.paymentService.refundPayment(transactionId!, amount, reason);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Refund processing failed', { error, transactionId: req.params.transactionId });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments/{transactionId}:
   *   get:
   *     summary: Get transaction details
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
   *     responses:
   *       200:
   *         description: Transaction details retrieved successfully
   *       404:
   *         description: Transaction not found
   */
  getTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;

      logger.info('Getting transaction', { transactionId });

      const transaction = await this.paymentService.getTransaction(transactionId!);

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error('Failed to get transaction', { error, transactionId: req.params.transactionId });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments:
   *   get:
   *     summary: Get transactions with filters
   *     tags: [Payments]
   *     parameters:
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         description: Filter by user ID
   *       - in: query
   *         name: merchantId
   *         schema:
   *           type: string
   *         description: Filter by merchant ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, processing, succeeded, failed, cancelled, refunded, partially_refunded, disputed, expired]
   *         description: Filter by payment status
   *       - in: query
   *         name: currency
   *         schema:
   *           type: string
   *         description: Filter by currency
   *       - in: query
   *         name: amountMin
   *         schema:
   *           type: number
   *         description: Minimum amount filter
   *       - in: query
   *         name: amountMax
   *         schema:
   *           type: number
   *         description: Maximum amount filter
   *       - in: query
   *         name: dateFrom
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date filter
   *       - in: query
   *         name: dateTo
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date filter
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
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Transactions retrieved successfully
   *       400:
   *         description: Invalid query parameters
   */
  getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Getting transactions', { query: req.query });

      const filters = validateTransactionFilters(req.query);
      const result = await this.paymentService.getTransactions(filters as any);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Failed to get transactions', { error, query: req.query });
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/payments/{transactionId}/status:
   *   patch:
   *     summary: Update transaction status
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: transactionId
   *         required: true
   *         schema:
   *           type: string
   *         description: Transaction ID
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
   *                 enum: [pending, processing, succeeded, failed, cancelled, refunded, partially_refunded, disputed, expired]
   *                 description: New transaction status
   *     responses:
   *       200:
   *         description: Transaction status updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Transaction not found
   */
  updateTransactionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;

      logger.info('Updating transaction status', { transactionId, status });

      const transaction = await this.paymentService.updateTransactionStatus(transactionId!, status);

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error('Failed to update transaction status', {
        error,
        transactionId: req.params.transactionId,
        status: req.body.status
      });
      next(error);
    }
  };
}