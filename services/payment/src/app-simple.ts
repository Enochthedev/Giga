import express from 'express';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { dummyPaymentRoutes } from './routes/dummy-payment.routes';

const app: express.Application = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'payment-service-simple',
      version: '1.0.0',
      environment: config.nodeEnv,
    },
  });
});

// API documentation endpoint (simple JSON)
app.get('/docs', (req, res) => {
  res.json({
    service: 'Dummy Payment Service',
    version: '1.0.0',
    description: 'Simple payment service for frontend development and testing',
    endpoints: {
      'POST /api/v1/payment-intents': 'Create payment intent',
      'GET /api/v1/payment-intents/:id': 'Get payment intent',
      'POST /api/v1/payment-intents/:id/confirm': 'Confirm payment',
      'POST /api/v1/payment-intents/:id/cancel': 'Cancel payment',
      'POST /api/v1/payment-methods': 'Create payment method',
      'GET /api/v1/payment-methods/:id': 'Get payment method',
      'GET /api/v1/customers/:id/payment-methods': 'List payment methods',
      'POST /api/v1/refunds': 'Process refund',
      'GET /api/v1/payment-statistics': 'Get statistics',
      'DELETE /api/v1/test/clear-data': 'Clear test data (dev only)',
      'GET /api/v1/test/debug': 'Debug info (dev only)',
    },
    examples: {
      createPaymentIntent: {
        method: 'POST',
        url: '/api/v1/payment-intents',
        body: {
          amount: 2000,
          currency: 'usd',
          customerId: 'test_customer_123',
          metadata: {
            orderId: 'order_123',
          },
        },
      },
      confirmPayment: {
        method: 'POST',
        url: '/api/v1/payment-intents/{id}/confirm',
        note: 'Replace {id} with actual payment intent ID',
      },
    },
  });
});

// Dummy payment routes for frontend integration and testing
app.use('/api/v1', dummyPaymentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
