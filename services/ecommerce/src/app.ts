import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { PrismaClient } from './generated/prisma-client';
import {
  correlationIdMiddleware,
  errorHandler,
  healthCheckErrorHandler,
  notFoundHandler,
} from './middleware/error.middleware';
import {
  cspMiddleware,
  generalRateLimit,
  sanitizeInput,
  validateRequestSize,
} from './middleware/validation.middleware';
import batchRoutes from './routes/batch';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { productRoutes } from './routes/products';
import { vendorRoutes } from './routes/vendor';
import { redisService } from './services/redis.service';
import { responseOptimizationService } from './services/response-optimization.service';
import { specs } from './swagger';

const app: express.Application = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Add correlation ID tracking
app.use(correlationIdMiddleware);

// Security and validation middleware
app.use(cspMiddleware);
app.use(generalRateLimit);
app.use(validateRequestSize());
app.use(sanitizeInput);

// Response optimization middleware
app.use(responseOptimizationService.getCompressionMiddleware());
app.use(responseOptimizationService.performanceMonitoringMiddleware());

// Add Prisma and Redis to request context
app.use((req, _res, next) => {
  req.prisma = prisma;
  req.redis = redisService;
  next();
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', async (req, res) => {
  const correlationId = req.correlationId;

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    await redisService.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      correlationId,
      service: 'ecommerce',
      dependencies: {
        database: 'connected',
        redis: 'connected',
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    const errorInfo = healthCheckErrorHandler(error as Error);
    res.status(503).json({
      ...errorInfo,
      timestamp: new Date().toISOString(),
      correlationId,
      service: 'ecommerce',
      dependencies: {
        database: 'unknown',
        redis: 'unknown',
      },
      uptime: process.uptime(),
    });
  }
});

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/batch', batchRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export { app, prisma };
