import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import { createTestGateway, createTestPaymentMethod } from '../setup';

describe('PaymentController', () => {
  let testGateway: any;
  let testPaymentMethod: any;

  beforeEach(async () => {
    testGateway = await createTestGateway();
    testPaymentMethod = await createTestPaymentMethod();
  });

  describe('POST /api/v1/payments', () => {
    it('should process a valid payment request', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        description: 'Test payment',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
        metadata: {
          orderId: 'order-123',
        },
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        status: expect.any(String),
        amount: expect.any(Object),
        currency: 'USD',
        metadata: {
          orderId: 'order-123',
        },
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        currency: 'USD',
        // Missing amount
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate amount is positive', async () => {
      const invalidRequest = {
        amount: -100,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate currency format', async () => {
      const invalidRequest = {
        amount: 100,
        currency: 'INVALID',
        paymentMethodId: testPaymentMethod.id,
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle payment with splits', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        description: 'Test payment with splits',
        userId: 'test-user-1',
        paymentMethodId: testPaymentMethod.id,
        splits: [
          {
            recipientId: 'vendor-1',
            amount: 80.0,
            description: 'Vendor payment',
          },
          {
            recipientId: 'platform',
            amount: 20.0,
            description: 'Platform fee',
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    it('should validate split business rules', async () => {
      const invalidRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
        splits: [
          {
            recipientId: 'vendor-1',
            // Missing both amount and percentage
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/payments')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/payments/:transactionId/capture', () => {
    it('should capture a pending payment', async () => {
      // First create a payment
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      // Update status to pending for capture
      await request(app)
        .patch(`/api/v1/payments/${transactionId}/status`)
        .send({ status: 'pending' });

      const response = await request(app)
        .post(`/api/v1/payments/${transactionId}/capture`)
        .send()
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('succeeded');
    });

    it('should capture partial amount', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      await request(app)
        .patch(`/api/v1/payments/${transactionId}/status`)
        .send({ status: 'pending' });

      const response = await request(app)
        .post(`/api/v1/payments/${transactionId}/capture`)
        .send({ amount: 50.0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(50);
    });

    it('should validate transaction ID', async () => {
      const response = await request(app)
        .post('/api/v1/payments/invalid-id/capture')
        .send()
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/payments/:transactionId/cancel', () => {
    it('should cancel a pending payment', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      await request(app)
        .patch(`/api/v1/payments/${transactionId}/status`)
        .send({ status: 'pending' });

      const response = await request(app)
        .post(`/api/v1/payments/${transactionId}/cancel`)
        .send()
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });
  });

  describe('POST /api/v1/payments/:transactionId/refund', () => {
    it('should refund a succeeded payment', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      const response = await request(app)
        .post(`/api/v1/payments/${transactionId}/refund`)
        .send({
          reason: 'Customer request',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactionId).toBe(transactionId);
      expect(response.body.data.reason).toBe('Customer request');
    });

    it('should refund partial amount', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      const response = await request(app)
        .post(`/api/v1/payments/${transactionId}/refund`)
        .send({
          amount: 50.0,
          reason: 'Partial refund',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(50);
    });
  });

  describe('GET /api/v1/payments/:transactionId', () => {
    it('should retrieve transaction by ID', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        description: 'Test payment',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      const response = await request(app)
        .get(`/api/v1/payments/${transactionId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(transactionId);
      expect(response.body.data.description).toBe('Test payment');
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/v1/payments/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/payments', () => {
    beforeEach(async () => {
      // Create test transactions
      await request(app).post('/api/v1/payments').send({
        amount: 100.0,
        currency: 'USD',
        userId: 'user-1',
        paymentMethodId: testPaymentMethod.id,
      });

      await request(app).post('/api/v1/payments').send({
        amount: 200.0,
        currency: 'EUR',
        userId: 'user-2',
        paymentMethodId: testPaymentMethod.id,
      });
    });

    it('should retrieve transactions with filters', async () => {
      const response = await request(app)
        .get('/api/v1/payments')
        .query({
          userId: 'user-1',
          page: 1,
          limit: 10,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].userId).toBe('user-1');
      expect(response.body.pagination).toBeDefined();
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/v1/payments')
        .query({
          page: 1,
          limit: 1,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/payments')
        .query({
          page: 0, // Invalid page
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PATCH /api/v1/payments/:transactionId/status', () => {
    it('should update transaction status', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/payments/${transactionId}/status`)
        .send({ status: 'processing' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('processing');
    });

    it('should validate status value', async () => {
      const paymentRequest = {
        amount: 100.0,
        currency: 'USD',
        paymentMethodId: testPaymentMethod.id,
      };

      const paymentResponse = await request(app)
        .post('/api/v1/payments')
        .send(paymentRequest);

      const transactionId = paymentResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/v1/payments/${transactionId}/status`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Error handling', () => {
    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/v1/payments')
        .send({
          amount: 'invalid',
          currency: 'USD',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/payments')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_JSON');
    });
  });

  describe('Health check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.data.service).toBe('payment-service');
    });
  });
});
