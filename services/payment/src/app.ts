import express from 'express';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import paymentMethodsRouter from './routes/payment-methods';
import paymentsRouter from './routes/payments';
import webhooksRouter from './routes/webhooks';

const app: express.Application = express();

// Webhook routes need raw body for signature verification
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }));

// Basic middleware for other routes
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
      service: 'payment-service',
      version: '1.0.0',
      environment: config.nodeEnv,
    },
  });
});

// API routes
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/payment-methods', paymentMethodsRouter);
app.use('/api/v1/webhooks', webhooksRouter);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
