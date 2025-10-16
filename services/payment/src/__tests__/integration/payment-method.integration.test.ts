import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { prisma } from '../../lib/prisma';

describe('Payment Method Integration Tests', () => {
  const testUserId = 'test_user_123';
  let createdPaymentMethodId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.paymentMethod.deleteMany({
      where: { userId: testUserId },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.paymentMethod.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.paymentMethod.deleteMany({
      where: { userId: testUserId },
    });
  });

  describe('POST /api/v1/payment-methods', () => {
    it('should create a card payment method successfully', async () => {
      const paymentMethodData = {
        userId: testUserId,
        type: 'card',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'US',
        },
        isDefault: true,
      };

      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.userId).toBe(testUserId);
      expect(response.body.data.type).toBe('card');
      expect(response.body.data.isDefault).toBe(true);
      expect(response.body.data.metadata.last4).toBe('4242');
      expect(response.body.data.metadata.brand).toBe('visa');

      createdPaymentMethodId = response.body.data.id;
    });

    it('should create a bank account payment method successfully', async () => {
      const paymentMethodData = {
        userId: testUserId,
        type: 'bank_account',
        bankAccount: {
          accountNumber: '123456789',
          routingNumber: '021000021',
          accountType: 'checking',
          accountHolderName: 'John Doe',
          bankName: 'Test Bank',
        },
      };

      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send(paymentMethodData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('bank_account');
      expect(response.body.data.metadata.last4).toBe('6789');
      expect(response.body.data.metadata.bankName).toBe('Test Bank');
    });

    it('should reject invalid card data', async () => {
      const invalidPaymentMethodData = {
        userId: testUserId,
        type: 'card',
        card: {
          number: '1234', // Invalid card number
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send(invalidPaymentMethodData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing required fields', async () => {
      const incompleteData = {
        type: 'card',
        // Missing userId
      };

      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/payment-methods/:id', () => {
    beforeEach(async () => {
      // Create a test payment method
      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        });

      createdPaymentMethodId = response.body.data.id;
    });

    it('should get payment method by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdPaymentMethodId);
      expect(response.body.data.userId).toBe(testUserId);
      expect(response.body.data.type).toBe('card');
    });

    it('should return 404 for non-existent payment method', async () => {
      const response = await request(app)
        .get('/api/v1/payment-methods/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PAYMENT_METHOD_NOT_FOUND');
    });
  });

  describe('GET /api/v1/payment-methods/users/:userId', () => {
    beforeEach(async () => {
      // Create multiple test payment methods
      await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
          isDefault: true,
        });

      await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'bank_account',
          bankAccount: {
            accountNumber: '123456789',
            routingNumber: '021000021',
            accountType: 'checking',
            accountHolderName: 'John Doe',
            bankName: 'Test Bank',
          },
        });
    });

    it('should get all payment methods for a user', async () => {
      const response = await request(app)
        .get(`/api/v1/payment-methods/users/${testUserId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);

      // Default payment method should be first
      expect(response.body.data[0].isDefault).toBe(true);
      expect(response.body.data[1].isDefault).toBe(false);
    });

    it('should return empty array for user with no payment methods', async () => {
      const response = await request(app)
        .get('/api/v1/payment-methods/users/nonexistent_user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('PUT /api/v1/payment-methods/:id', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        });

      createdPaymentMethodId = response.body.data.id;
    });

    it('should update payment method billing address', async () => {
      const updateData = {
        billingAddress: {
          line1: '456 Oak St',
          city: 'Boston',
          postalCode: '02101',
          country: 'US',
        },
      };

      const response = await request(app)
        .put(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.billingAddress.line1).toBe('456 Oak St');
      expect(response.body.data.billingAddress.city).toBe('Boston');
    });

    it('should update payment method default status', async () => {
      const updateData = {
        isDefault: true,
      };

      const response = await request(app)
        .put(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isDefault).toBe(true);
    });

    it('should reject invalid billing address', async () => {
      const updateData = {
        billingAddress: {
          line1: '456 Oak St',
          // Missing required fields
        },
      };

      const response = await request(app)
        .put(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .send(updateData)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/payment-methods/:id/default', () => {
    let paymentMethod1Id: string;
    let paymentMethod2Id: string;

    beforeEach(async () => {
      // Create two payment methods
      const response1 = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
          isDefault: true,
        });

      const response2 = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'bank_account',
          bankAccount: {
            accountNumber: '123456789',
            routingNumber: '021000021',
            accountType: 'checking',
            accountHolderName: 'John Doe',
            bankName: 'Test Bank',
          },
        });

      paymentMethod1Id = response1.body.data.id;
      paymentMethod2Id = response2.body.data.id;
    });

    it('should set payment method as default', async () => {
      const response = await request(app)
        .put(`/api/v1/payment-methods/${paymentMethod2Id}/default`)
        .send({ userId: testUserId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isDefault).toBe(true);

      // Verify the previous default is no longer default
      const userPaymentMethods = await request(app)
        .get(`/api/v1/payment-methods/users/${testUserId}`)
        .expect(200);

      const defaultPaymentMethod = userPaymentMethods.body.data.find(
        (pm: any) => pm.isDefault
      );
      expect(defaultPaymentMethod.id).toBe(paymentMethod2Id);
    });

    it('should reject setting default for wrong user', async () => {
      const response = await request(app)
        .put(`/api/v1/payment-methods/${paymentMethod1Id}/default`)
        .send({ userId: 'wrong_user' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/v1/payment-methods/:id', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        });

      createdPaymentMethodId = response.body.data.id;
    });

    it('should delete payment method successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Payment method deleted successfully');

      // Verify payment method is no longer accessible
      await request(app)
        .get(`/api/v1/payment-methods/${createdPaymentMethodId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent payment method', async () => {
      const response = await request(app)
        .delete('/api/v1/payment-methods/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PAYMENT_METHOD_NOT_FOUND');
    });
  });

  describe('POST /api/v1/payment-methods/tokenize', () => {
    it('should tokenize payment method data successfully', async () => {
      const paymentMethodData = {
        userId: testUserId,
        type: 'card',
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      const response = await request(app)
        .post('/api/v1/payment-methods/tokenize')
        .send(paymentMethodData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.token).toMatch(/^pm_/);
    });

    it('should reject invalid payment method data for tokenization', async () => {
      const invalidData = {
        userId: testUserId,
        type: 'card',
        // Missing card data
      };

      const response = await request(app)
        .post('/api/v1/payment-methods/tokenize')
        .send(invalidData)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/payment-methods/validate/:token', () => {
    let validToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/payment-methods')
        .send({
          userId: testUserId,
          type: 'card',
          card: {
            number: '4242424242424242',
            expiryMonth: 12,
            expiryYear: 2025,
            cvc: '123',
            holderName: 'John Doe',
          },
        });

      validToken = response.body.data.token;
    });

    it('should validate valid token', async () => {
      const response = await request(app)
        .get(`/api/v1/payment-methods/validate/${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/payment-methods/validate/invalid_token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
    });
  });
});
