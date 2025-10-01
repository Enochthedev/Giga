import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { PaymentMethodService } from '../services/payment-method.service';
import { formatErrorResponse } from '../utils/errors';
import {
  validateAddress,
  validatePaymentMethodData,
} from '../utils/validation';

export class PaymentMethodController {
  private paymentMethodService: PaymentMethodService;

  constructor() {
    this.paymentMethodService = new PaymentMethodService();
  }

  /**
   * Create a new payment method
   */
  async createPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Creating payment method', {
        userId: req.body.userId,
        type: req.body.type,
      });

      const paymentMethod = await this.paymentMethodService.create(req.body);

      res.status(201).json({
        success: true,
        data: paymentMethod,
      });
    } catch (error) {
      logger.error('Failed to create payment method', {
        error,
        body: req.body,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Get payment method by ID
   */
  async getPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info('Getting payment method', { paymentMethodId: id });

      const paymentMethod = await this.paymentMethodService.getById(id);

      res.json({
        success: true,
        data: paymentMethod,
      });
    } catch (error) {
      logger.error('Failed to get payment method', {
        error,
        paymentMethodId: req.params.id,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Get all payment methods for a user
   */
  async getUserPaymentMethods(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      logger.info('Getting user payment methods', { userId });

      const paymentMethods =
        await this.paymentMethodService.getByUserId(userId);

      res.json({
        success: true,
        data: paymentMethods,
        count: paymentMethods.length,
      });
    } catch (error) {
      logger.error('Failed to get user payment methods', {
        error,
        userId: req.params.userId,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info('Updating payment method', { paymentMethodId: id });

      // Validate billing address if provided
      if (req.body.billingAddress) {
        validateAddress(req.body.billingAddress);
      }

      const paymentMethod = await this.paymentMethodService.update(
        id,
        req.body
      );

      res.json({
        success: true,
        data: paymentMethod,
      });
    } catch (error) {
      logger.error('Failed to update payment method', {
        error,
        paymentMethodId: req.params.id,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info('Deleting payment method', { paymentMethodId: id });

      await this.paymentMethodService.delete(id);

      res.json({
        success: true,
        message: 'Payment method deleted successfully',
      });
    } catch (error) {
      logger.error('Failed to delete payment method', {
        error,
        paymentMethodId: req.params.id,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Set payment method as default
   */
  async setDefaultPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      logger.info('Setting default payment method', {
        paymentMethodId: id,
        userId,
      });

      const paymentMethod = await this.paymentMethodService.setDefault(
        id,
        userId
      );

      res.json({
        success: true,
        data: paymentMethod,
      });
    } catch (error) {
      logger.error('Failed to set default payment method', {
        error,
        paymentMethodId: req.params.id,
        userId: req.body.userId,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Tokenize payment method data
   */
  async tokenizePaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Tokenizing payment method', {
        userId: req.body.userId,
        type: req.body.type,
      });

      // Validate payment method data
      validatePaymentMethodData(req.body);

      const token = await this.paymentMethodService.tokenize(req.body);

      res.json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      logger.error('Failed to tokenize payment method', {
        error,
        body: req.body,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }

  /**
   * Validate payment method token
   */
  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      logger.info('Validating payment method token', { token });

      const isValid = await this.paymentMethodService.validateToken(token);

      res.json({
        success: true,
        data: {
          valid: isValid,
        },
      });
    } catch (error) {
      logger.error('Failed to validate token', {
        error,
        token: req.params.token,
      });
      const errorResponse = formatErrorResponse(error as Error);
      res.status((error as any).statusCode || 500).json({
        success: false,
        ...errorResponse,
      });
    }
  }
}
