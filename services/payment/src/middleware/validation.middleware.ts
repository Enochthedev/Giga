import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/errors';

// Simple validation middleware without express-validator for now
export const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new ValidationError('Amount must be a positive number');
  }

  if (!currency || typeof currency !== 'string' || currency.length !== 3) {
    throw new ValidationError('Currency must be a 3-letter ISO code');
  }

  next();
};

export const validateRefundRequest = (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params;
  const { amount } = req.body;

  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  if (amount && (typeof amount !== 'number' || amount <= 0)) {
    throw new ValidationError('Refund amount must be positive');
  }

  next();
};

export const validateTransactionId = (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  if (!status) {
    throw new ValidationError('Status is required');
  }

  const validStatuses = ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded', 'disputed', 'expired'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError('Invalid payment status');
  }

  next();
};

export const validateTransactionFilters = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    throw new ValidationError('Page must be a positive integer');
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  next();
};

export const validateCaptureRequest = (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params;
  const { amount } = req.body;

  if (!transactionId) {
    throw new ValidationError('Transaction ID is required');
  }

  if (amount && (typeof amount !== 'number' || amount <= 0)) {
    throw new ValidationError('Capture amount must be positive');
  }

  next();
};

export const validatePaymentBusinessRules = (req: Request, res: Response, next: NextFunction) => {
  const { paymentMethodId, paymentMethodData, splits } = req.body;

  if (!paymentMethodId && !paymentMethodData) {
    throw new ValidationError('Either paymentMethodId or paymentMethodData must be provided');
  }

  if (splits && Array.isArray(splits)) {
    const totalPercentage = splits
      .filter((split: any) => split.percentage)
      .reduce((sum: number, split: any) => sum + split.percentage, 0);

    if (totalPercentage > 100) {
      throw new ValidationError('Total split percentage cannot exceed 100%');
    }

    for (const split of splits) {
      const hasAmount = split.amount !== undefined;
      const hasPercentage = split.percentage !== undefined;

      if (hasAmount === hasPercentage) {
        throw new ValidationError('Each split must have either amount or percentage, but not both');
      }
    }
  }

  next();
};