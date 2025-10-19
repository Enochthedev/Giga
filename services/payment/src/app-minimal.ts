import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { dummyPaymentRoutes } from './routes/dummy-payment.routes';
import { specs } from './swagger-minimal';

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

// Swagger documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Dummy Payment Service API',
  })
);

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
  res.json(specs);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'payment-service-minimal',
      version: '1.0.0',
      environment: config.nodeEnv,
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
