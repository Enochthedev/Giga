import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { productRoutes } from './routes/products';
import { vendorRoutes } from './routes/vendor';
import { redisService } from './services/redis.service';
import { specs } from './swagger';

const app: express.Application = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Add Prisma and Redis to request context
app.use((req, _res, next) => {
  req.prisma = prisma;
  req.redis = redisService;
  next();
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'ecommerce',
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'ecommerce',
    });
  }
});

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/vendor', vendorRoutes);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} is not available`,
    timestamp: new Date().toISOString(),
  });
});

export { app, prisma };
