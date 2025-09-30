import { beforeEach, describe, expect, it } from 'vitest';
import { PaymentService } from '../../services/payment.service';
import { RefundError, ValidationError } from '../../utils/errors';
import { createTestGateway, createTestPaymentMethod } from '../setup';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let testGateway: any;
  let testPaymentMethod: any;

  beforeEach(async () => {
    paymentService = new PaymentService();
    testGateway = await createTestGateway();
    testPaymentMethod = await createTestPaymentMethod();
  });

  describe('processPayment', () => {
    it('should process a valid payment request successfully', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
        metadata: {
          orderId: 'order-123',
        },
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(result).toMatchObject({
        status: 'succeeded',
        amount: expect.any(Object), // Decimal object
        currency: 'USD',
        metadata: {
          orderId: 'order-123',
        },
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle large amounts requiring manual review', async () => {
      const paymentRequest = {
        amount: 15000.00, // Large amount
        currency: 'USD',
        description: 'Large payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.status).toBe('processing');
      expect(result.requiresAction).toBe(true);
      expect(result.nextAction).toMatchObject({
        type: 'manual_review',
      });
    });

    it('should simulate payment failure for specific amounts', async () => {
      const paymentRequest = {
        amount: 1.00, // Amount that triggers failure
        currency: 'USD',
        description: 'Failing payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.status).toBe('failed');
    });

    it('should validate currency', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'INVALID',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      await expect(paymentService.processPayment(paymentRequest))
        .rejects
        .toThrow(ValidationError);
    });

    it('should validate minimum amount', async () => {
      const paymentRequest = {
        amount: 0.01, // Below minimum for USD
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      await expect(paymentService.processPayment(paymentRequest))
        .rejects
        .toThrow(ValidationError);
    });

    it('should process payment splits', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment with splits',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
        splits: [
          {
            recipientId: 'vendor-1',
            amount: 80.00,
            description: 'Vendor payment',
          },
          {
            recipientId: 'platform',
            amount: 20.00,
            description: 'Platform fee',
          },
        ],
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.status).toBe('succeeded');
      expect(result.id).toBeDefined();
    });

    it('should validate payment request schema', async () => {
      const invalidRequest = {
        amount: -100, // Negative amount
        currency: 'USD',
      };

      await expect(paymentService.processPayment(invalidRequest as any))
        .rejects
        .toThrow();
    });

    it('should generate internal reference if not provided', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const result = await paymentService.processPayment(paymentRequest);

      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });
  });

  describe('capturePayment', () => {
    it('should capture a pending payment', async () => {
      // First create a payment
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);

      // Simulate pending status by updating the transaction
      await paymentService.updateTransactionStatus(payment.id, 'pending');

      const result = await paymentService.capturePayment(payment.id);

      expect(result.status).toBe('succeeded');
      expect(result.id).toBe(payment.id);
    });

    it('should capture partial amount', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      await paymentService.updateTransactionStatus(payment.id, 'pending');

      const result = await paymentService.capturePayment(payment.id, 50.00);

      expect(result.status).toBe('succeeded');
      expect(result.amount.toNumber()).toBe(50.00);
    });

    it('should reject capture for non-pending payments', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      // Payment is already succeeded, cannot capture

      await expect(paymentService.capturePayment(payment.id))
        .rejects
        .toThrow(ValidationError);
    });

    it('should reject capture amount exceeding original amount', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      await paymentService.updateTransactionStatus(payment.id, 'pending');

      await expect(paymentService.capturePayment(payment.id, 150.00))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('cancelPayment', () => {
    it('should cancel a pending payment', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      await paymentService.updateTransactionStatus(payment.id, 'pending');

      const result = await paymentService.cancelPayment(payment.id);

      expect(result.status).toBe('cancelled');
      expect(result.id).toBe(payment.id);
    });

    it('should cancel a processing payment', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      await paymentService.updateTransactionStatus(payment.id, 'processing');

      const result = await paymentService.cancelPayment(payment.id);

      expect(result.status).toBe('cancelled');
    });

    it('should reject cancellation for succeeded payments', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      // Payment is already succeeded

      await expect(paymentService.cancelPayment(payment.id))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('refundPayment', () => {
    it('should refund a succeeded payment', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);

      const refund = await paymentService.refundPayment(
        payment.id,
        undefined,
        'Customer request'
      );

      expect(refund.transactionId).toBe(payment.id);
      expect(refund.amount.toNumber()).toBe(100.00);
      expect(refund.reason).toBe('Customer request');
      expect(refund.status).toBe('succeeded');
    });

    it('should refund partial amount', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);

      const refund = await paymentService.refundPayment(
        payment.id,
        50.00,
        'Partial refund'
      );

      expect(refund.amount.toNumber()).toBe(50.00);
      expect(refund.reason).toBe('Partial refund');
    });

    it('should reject refund for non-succeeded payments', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      await paymentService.updateTransactionStatus(payment.id, 'pending');

      await expect(paymentService.refundPayment(payment.id))
        .rejects
        .toThrow(RefundError);
    });

    it('should reject refund amount exceeding original amount', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);

      await expect(paymentService.refundPayment(payment.id, 150.00))
        .rejects
        .toThrow(ValidationError);
    });

    it('should use default reason if not provided', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);

      const refund = await paymentService.refundPayment(payment.id);

      expect(refund.reason).toBe('Customer request');
    });
  });

  describe('getTransaction', () => {
    it('should retrieve transaction by ID', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      const transaction = await paymentService.getTransaction(payment.id);

      expect(transaction.id).toBe(payment.id);
      expect(transaction.amount.toNumber()).toBe(100.00);
      expect(transaction.currency).toBe('USD');
      expect(transaction.description).toBe('Test payment');
    });

    it('should throw error for non-existent transaction', async () => {
      await expect(paymentService.getTransaction('non-existent-id'))
        .rejects
        .toThrow();
    });
  });

  describe('getTransactions', () => {
    it('should retrieve transactions with filters', async () => {
      // Create multiple test transactions
      const paymentRequest1 = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment 1',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentRequest2 = {
        amount: 200.00,
        currency: 'USD',
        description: 'Test payment 2',
        userId: 'test-user-2',
        paymentMethodId: testPaymentMethod.id,
      };

      await paymentService.processPayment(paymentRequest1);
      await paymentService.processPayment(paymentRequest2);

      const result = await paymentService.getTransactions({
        userId: 'test-user-1',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].userId).toBe('test-user-1');
      expect(result.pagination.total).toBe(1);
    });

    it('should handle pagination', async () => {
      const result = await paymentService.getTransactions({
        page: 1,
        limit: 5,
      });

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(5);
      expect(result.pagination.hasNext).toBeDefined();
      expect(result.pagination.hasPrev).toBeDefined();
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update transaction status', async () => {
      const paymentRequest = {
        amount: 100.00,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
      };

      const payment = await paymentService.processPayment(paymentRequest);
      const updatedTransaction = await paymentService.updateTransactionStatus(
        payment.id,
        'processing'
      );

      expect(updatedTransaction.status).toBe('processing');
      expect(updatedTransaction.id).toBe(payment.id);
    });
  });
});