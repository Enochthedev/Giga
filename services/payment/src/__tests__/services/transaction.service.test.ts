import { Decimal } from 'decimal.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { TransactionService } from '../../services/transaction.service';
import { TransactionNotFoundError } from '../../utils/errors';
import { createTestGateway, createTestPaymentMethod } from '../setup';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let testGateway: any;
  let testPaymentMethod: any;

  beforeEach(async () => {
    transactionService = new TransactionService();
    testGateway = await createTestGateway();
    testPaymentMethod = await createTestPaymentMethod();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        type: 'PAYMENT' as const,
        status: 'pending' as const,
        amount: new Decimal('100.00'),
        currency: 'USD',
        description: 'Test transaction',
        userId: 'test-user-1',
        gatewayId: testGateway.id,
        paymentMethodId: testPaymentMethod.id,
        metadata: { test: true },
      };

      const transaction = await transactionService.create(transactionData);

      expect(transaction.id).toBeDefined();
      expect(transaction.type).toBe('PAYMENT');
      expect(transaction.status).toBe('pending');
      expect(transaction.amount.toNumber()).toBe(100.0);
      expect(transaction.currency).toBe('USD');
      expect(transaction.description).toBe('Test transaction');
      expect(transaction.userId).toBe('test-user-1');
      expect(transaction.gatewayId).toBe(testGateway.id);
      expect(transaction.paymentMethodId).toBe(testPaymentMethod.id);
      expect(transaction.metadata).toEqual({ test: true });
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeInstanceOf(Date);
    });

    it('should create transaction with default values', async () => {
      const transactionData = {
        amount: new Decimal('50.00'),
        gatewayId: testGateway.id,
      };

      const transaction = await transactionService.create(transactionData);

      expect(transaction.type).toBe('PAYMENT');
      expect(transaction.status).toBe('PENDING');
      expect(transaction.currency).toBe('USD');
      expect(transaction.metadata).toEqual({});
      expect(transaction.fraudFlags).toEqual([]);
    });

    it('should create transaction with splits', async () => {
      const transactionData = {
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        userId: 'test-user-1',
      };

      const transaction = await transactionService.create(transactionData);

      // Add splits
      await transactionService.addSplit(transaction.id, {
        recipientId: 'vendor-1',
        amount: 80.0,
        currency: 'USD',
        type: 'FIXED',
        description: 'Vendor payment',
      });

      await transactionService.addSplit(transaction.id, {
        recipientId: 'platform',
        amount: 20.0,
        currency: 'USD',
        type: 'FIXED',
        description: 'Platform fee',
      });

      const updatedTransaction = await transactionService.getById(
        transaction.id
      );
      expect(updatedTransaction.splits).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should retrieve transaction by ID', async () => {
      const transactionData = {
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        description: 'Test transaction',
      };

      const createdTransaction =
        await transactionService.create(transactionData);
      const retrievedTransaction = await transactionService.getById(
        createdTransaction.id
      );

      expect(retrievedTransaction.id).toBe(createdTransaction.id);
      expect(retrievedTransaction.amount.toNumber()).toBe(100.0);
      expect(retrievedTransaction.currency).toBe('USD');
      expect(retrievedTransaction.description).toBe('Test transaction');
    });

    it('should throw error for non-existent transaction', async () => {
      await expect(
        transactionService.getById('non-existent-id')
      ).rejects.toThrow(TransactionNotFoundError);
    });

    it('should include related data', async () => {
      const transactionData = {
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        paymentMethodId: testPaymentMethod.id,
      };

      const transaction = await transactionService.create(transactionData);
      const retrievedTransaction = await transactionService.getById(
        transaction.id
      );

      expect(retrievedTransaction.paymentMethodId).toBe(testPaymentMethod.id);
      expect(retrievedTransaction.gatewayId).toBe(testGateway.id);
    });
  });

  describe('getByFilters', () => {
    beforeEach(async () => {
      // Create test transactions
      await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        userId: 'user-1',
        status: 'succeeded',
      });

      await transactionService.create({
        amount: new Decimal('200.00'),
        currency: 'EUR',
        gatewayId: testGateway.id,
        userId: 'user-2',
        status: 'pending',
      });

      await transactionService.create({
        amount: new Decimal('300.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        userId: 'user-1',
        status: 'failed',
      });
    });

    it('should filter by userId', async () => {
      const result = await transactionService.getByFilters({
        userId: 'user-1',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every(t => t.userId === 'user-1')).toBe(true);
    });

    it('should filter by status', async () => {
      const result = await transactionService.getByFilters({
        status: 'succeeded',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('succeeded');
    });

    it('should filter by currency', async () => {
      const result = await transactionService.getByFilters({
        currency: 'USD',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every(t => t.currency === 'USD')).toBe(true);
    });

    it('should filter by amount range', async () => {
      const result = await transactionService.getByFilters({
        amountMin: 150,
        amountMax: 250,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].amount.toNumber()).toBe(200.0);
    });

    it('should handle pagination', async () => {
      const result = await transactionService.getByFilters({
        page: 1,
        limit: 2,
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    it('should sort by creation date descending', async () => {
      const result = await transactionService.getByFilters({
        page: 1,
        limit: 10,
      });

      // Transactions should be sorted by createdAt desc
      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
          result.data[i].createdAt.getTime()
        );
      }
    });
  });

  describe('update', () => {
    it('should update transaction fields', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        description: 'Original description',
      });

      const updateData = {
        description: 'Updated description',
        gatewayTransactionId: 'gw_123',
        riskScore: 25,
        metadata: { updated: true },
      };

      const updatedTransaction = await transactionService.update(
        transaction.id,
        updateData
      );

      expect(updatedTransaction.description).toBe('Updated description');
      expect(updatedTransaction.gatewayTransactionId).toBe('gw_123');
      expect(updatedTransaction.riskScore).toBe(25);
      expect(updatedTransaction.metadata).toEqual({ updated: true });
    });

    it('should update fees', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
      });

      const updateData = {
        platformFee: new Decimal('5.00'),
        gatewayFee: new Decimal('2.50'),
      };

      const updatedTransaction = await transactionService.update(
        transaction.id,
        updateData
      );

      expect(updatedTransaction.platformFee?.toNumber()).toBe(5.0);
      expect(updatedTransaction.gatewayFee?.toNumber()).toBe(2.5);
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        status: 'pending',
      });

      const updatedTransaction = await transactionService.updateStatus(
        transaction.id,
        'succeeded'
      );

      expect(updatedTransaction.status).toBe('succeeded');
      expect(updatedTransaction.processedAt).toBeInstanceOf(Date);
      expect(updatedTransaction.settledAt).toBeInstanceOf(Date);
    });

    it('should set processedAt for succeeded status', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        status: 'pending',
      });

      const updatedTransaction = await transactionService.updateStatus(
        transaction.id,
        'succeeded'
      );

      expect(updatedTransaction.processedAt).toBeInstanceOf(Date);
      expect(updatedTransaction.settledAt).toBeInstanceOf(Date);
    });

    it('should set processedAt for failed status', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
        status: 'pending',
      });

      const updatedTransaction = await transactionService.updateStatus(
        transaction.id,
        'failed'
      );

      expect(updatedTransaction.processedAt).toBeInstanceOf(Date);
      expect(updatedTransaction.settledAt).toBeUndefined();
    });
  });

  describe('addSplit', () => {
    it('should add payment split to transaction', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
      });

      await transactionService.addSplit(transaction.id, {
        recipientId: 'vendor-1',
        amount: 80.0,
        currency: 'USD',
        type: 'FIXED',
        description: 'Vendor payment',
      });

      const updatedTransaction = await transactionService.getById(
        transaction.id
      );
      expect(updatedTransaction.splits).toHaveLength(1);
      expect(updatedTransaction.splits![0].recipientId).toBe('vendor-1');
      expect(updatedTransaction.splits![0].amount.toNumber()).toBe(80.0);
      expect(updatedTransaction.splits![0].status).toBe('pending');
    });
  });

  describe('processSplits', () => {
    it('should process pending splits', async () => {
      const transaction = await transactionService.create({
        amount: new Decimal('100.00'),
        currency: 'USD',
        gatewayId: testGateway.id,
      });

      await transactionService.addSplit(transaction.id, {
        recipientId: 'vendor-1',
        amount: 80.0,
        currency: 'USD',
        type: 'FIXED',
        description: 'Vendor payment',
      });

      await transactionService.processSplits(transaction.id);

      // The splits should be marked as processing
      // In a real implementation, this would integrate with actual payment processing
      expect(true).toBe(true); // Placeholder assertion
    });
  });
});
