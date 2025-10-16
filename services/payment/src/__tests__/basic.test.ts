import { describe, expect, it } from 'vitest';
import { PaymentService } from '../services/payment.service';
import { TransactionService } from '../services/transaction.service';
import {
  validateAmount,
  validateCurrency,
  validatePaymentRequest,
} from '../utils/validation';

describe('Basic Payment Processing', () => {
  describe('PaymentService', () => {
    it('should create a PaymentService instance', () => {
      const paymentService = new PaymentService();
      expect(paymentService).toBeDefined();
    });
  });

  describe('TransactionService', () => {
    it('should create a TransactionService instance', () => {
      const transactionService = new TransactionService();
      expect(transactionService).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate a basic payment request', () => {
      const validRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: 'pm-123',
      };

      expect(() => validatePaymentRequest(validRequest)).not.toThrow();
    });

    it('should validate supported currencies', () => {
      expect(validateCurrency('USD')).toBe(true);
      expect(validateCurrency('EUR')).toBe(true);
      expect(validateCurrency('INVALID')).toBe(false);
    });

    it('should validate minimum amounts', () => {
      expect(validateAmount(1.0, 'USD')).toBe(true);
      expect(validateAmount(0.01, 'USD')).toBe(false);
    });
  });
});
