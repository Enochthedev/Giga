import { describe, expect, it } from 'vitest';
import {
  detectCardBrand,
  validateAmount,
  validateCardNumber,
  validateCurrency,
  validateExpiryDate,
  validatePaymentRequest,
  validateRefundRequest,
  validateTransactionFilters,
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validatePaymentRequest', () => {
    it('should validate a valid payment request', () => {
      const validRequest = {
        amount: 100.0,
        currency: 'USD',
        description: 'Test payment',
        userId: 'user-123',
        paymentMethodId: 'pm-123',
        metadata: { orderId: 'order-123' },
      };

      expect(() => validatePaymentRequest(validRequest)).not.toThrow();
    });

    it('should validate payment request with card data', () => {
      const validRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodData: {
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        },
      };

      expect(() => validatePaymentRequest(validRequest)).not.toThrow();
    });

    it('should validate payment request with splits', () => {
      const validRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: 'pm-123',
        splits: [
          {
            recipientId: 'vendor-1',
            amount: 80,
            description: 'Vendor payment',
          },
          {
            recipientId: 'platform',
            percentage: 20,
            description: 'Platform fee',
          },
        ],
      };

      expect(() => validatePaymentRequest(validRequest)).not.toThrow();
    });

    it('should reject negative amounts', () => {
      const invalidRequest = {
        amount: -100,
        currency: 'USD',
        paymentMethodId: 'pm-123',
      };

      expect(() => validatePaymentRequest(invalidRequest)).toThrow();
    });

    it('should reject invalid currency', () => {
      const invalidRequest = {
        amount: 100,
        currency: 'INVALID',
        paymentMethodId: 'pm-123',
      };

      expect(() => validatePaymentRequest(invalidRequest)).toThrow();
    });

    it('should require either paymentMethodId or paymentMethodData', () => {
      const invalidRequest = {
        amount: 100,
        currency: 'USD',
        // Missing both paymentMethodId and paymentMethodData
      };

      expect(() => validatePaymentRequest(invalidRequest)).toThrow();
    });

    it('should validate split has either amount or percentage', () => {
      const invalidRequest = {
        amount: 100,
        currency: 'USD',
        paymentMethodId: 'pm-123',
        splits: [
          {
            recipientId: 'vendor-1',
            amount: 80,
            percentage: 20, // Both amount and percentage
          },
        ],
      };

      expect(() => validatePaymentRequest(invalidRequest)).toThrow();
    });
  });

  describe('validateRefundRequest', () => {
    it('should validate a valid refund request', () => {
      const validRequest = {
        transactionId: 'txn-123',
        amount: 50.0,
        reason: 'Customer request',
        metadata: { refundId: 'ref-123' },
      };

      expect(() => validateRefundRequest(validRequest)).not.toThrow();
    });

    it('should validate refund request without amount', () => {
      const validRequest = {
        transactionId: 'txn-123',
        reason: 'Customer request',
      };

      expect(() => validateRefundRequest(validRequest)).not.toThrow();
    });

    it('should reject negative refund amounts', () => {
      const invalidRequest = {
        transactionId: 'txn-123',
        amount: -50,
        reason: 'Customer request',
      };

      expect(() => validateRefundRequest(invalidRequest)).toThrow();
    });

    it('should require transaction ID', () => {
      const invalidRequest = {
        amount: 50,
        reason: 'Customer request',
      };

      expect(() => validateRefundRequest(invalidRequest)).toThrow();
    });
  });

  describe('validateTransactionFilters', () => {
    it('should validate valid filters', () => {
      const validFilters = {
        userId: 'user-123',
        status: 'succeeded',
        currency: 'USD',
        amountMin: 10,
        amountMax: 1000,
        dateFrom: '2023-01-01T00:00:00Z',
        dateTo: '2023-12-31T23:59:59Z',
        page: 1,
        limit: 20,
      };

      const result = validateTransactionFilters(validFilters);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should apply default values', () => {
      const filters = {
        userId: 'user-123',
      };

      const result = validateTransactionFilters(filters);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should reject invalid page numbers', () => {
      const invalidFilters = {
        page: 0,
      };

      expect(() => validateTransactionFilters(invalidFilters)).toThrow();
    });

    it('should reject limit exceeding maximum', () => {
      const invalidFilters = {
        limit: 200,
      };

      expect(() => validateTransactionFilters(invalidFilters)).toThrow();
    });

    it('should reject invalid date formats', () => {
      const invalidFilters = {
        dateFrom: 'invalid-date',
      };

      expect(() => validateTransactionFilters(invalidFilters)).toThrow();
    });
  });

  describe('validateCurrency', () => {
    it('should validate supported currencies', () => {
      expect(validateCurrency('USD')).toBe(true);
      expect(validateCurrency('EUR')).toBe(true);
      expect(validateCurrency('GBP')).toBe(true);
      expect(validateCurrency('usd')).toBe(true); // Case insensitive
    });

    it('should reject unsupported currencies', () => {
      expect(validateCurrency('INVALID')).toBe(false);
      expect(validateCurrency('XYZ')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate amounts above minimum', () => {
      expect(validateAmount(1.0, 'USD')).toBe(true);
      expect(validateAmount(5.0, 'EUR')).toBe(true);
      expect(validateAmount(100, 'JPY')).toBe(true);
    });

    it('should reject amounts below minimum', () => {
      expect(validateAmount(0.01, 'USD')).toBe(false); // Below $0.50 minimum
      expect(validateAmount(0.1, 'EUR')).toBe(false); // Below €0.50 minimum
      expect(validateAmount(10, 'JPY')).toBe(false); // Below ¥50 minimum
    });

    it('should handle unknown currencies with default minimum', () => {
      expect(validateAmount(1.0, 'UNKNOWN')).toBe(true);
      expect(validateAmount(0.01, 'UNKNOWN')).toBe(false);
    });
  });

  describe('validateCardNumber', () => {
    it('should validate valid card numbers', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true); // Visa test card
      expect(validateCardNumber('5555555555554444')).toBe(true); // Mastercard test card
      expect(validateCardNumber('378282246310005')).toBe(true); // Amex test card
    });

    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false); // Invalid Luhn
      expect(validateCardNumber('123')).toBe(false); // Too short
      expect(validateCardNumber('12345678901234567890')).toBe(false); // Too long
    });

    it('should handle card numbers with spaces and dashes', () => {
      expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
      expect(validateCardNumber('4242-4242-4242-4242')).toBe(true);
    });
  });

  describe('detectCardBrand', () => {
    it('should detect Visa cards', () => {
      expect(detectCardBrand('4242424242424242')).toBe('visa');
      expect(detectCardBrand('4000000000000002')).toBe('visa');
    });

    it('should detect Mastercard cards', () => {
      expect(detectCardBrand('5555555555554444')).toBe('mastercard');
      expect(detectCardBrand('5200828282828210')).toBe('mastercard');
    });

    it('should detect American Express cards', () => {
      expect(detectCardBrand('378282246310005')).toBe('amex');
      expect(detectCardBrand('371449635398431')).toBe('amex');
    });

    it('should detect Discover cards', () => {
      expect(detectCardBrand('6011111111111117')).toBe('discover');
      expect(detectCardBrand('6500000000000002')).toBe('discover');
    });

    it('should return unknown for unrecognized cards', () => {
      expect(detectCardBrand('1234567890123456')).toBe('unknown');
    });
  });

  describe('validateExpiryDate', () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    it('should validate future expiry dates', () => {
      expect(validateExpiryDate(12, currentYear + 1)).toBe(true);
      expect(validateExpiryDate(currentMonth + 1, currentYear)).toBe(true);
    });

    it('should validate current month and year', () => {
      expect(validateExpiryDate(currentMonth, currentYear)).toBe(true);
    });

    it('should reject past expiry dates', () => {
      expect(validateExpiryDate(currentMonth - 1, currentYear)).toBe(false);
      expect(validateExpiryDate(12, currentYear - 1)).toBe(false);
    });

    it('should reject expiry dates too far in the future', () => {
      expect(validateExpiryDate(12, currentYear + 25)).toBe(false);
    });

    it('should reject invalid months', () => {
      expect(validateExpiryDate(0, currentYear + 1)).toBe(false);
      expect(validateExpiryDate(13, currentYear + 1)).toBe(false);
    });
  });
});
