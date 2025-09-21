import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { PrismaClient } from './generated/prisma-client';
import {
  advancedXSSProtection,
  comprehensiveSecurityValidation,
  contentSecurityPolicy,
  ipValidation,
  requestSanitization,
  requestTiming,
  xssProtection,
} from './middleware/security.middleware';
import { securityValidation } from './middleware/validation.middleware';
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profile';
import { userRoutes } from './routes/user';
import { CleanupService } from './services/cleanup.service';
import { specs } from './swagger';

const app: express.Application = express();
const prisma = new PrismaClient();

// Initialize cleanup service
const cleanupService = CleanupService.getInstance();
cleanupService.startAutomaticCleanup();

// Enhanced security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // We'll handle this with our custom middleware
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGINS?.split(',') || ['https://yourdomain.com']
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  })
);

// Request size limit and JSON parsing
app.use(
  express.json({
    limit: '1mb',
    strict: true,
    type: 'application/json',
  })
);

// Enhanced security middleware stack
app.use(requestTiming);
app.use(ipValidation);
app.use(comprehensiveSecurityValidation);
app.use(contentSecurityPolicy);
app.use(requestSanitization);
app.use(xssProtection);
app.use(advancedXSSProtection);
app.use(securityValidation);

// Add Prisma to request context
app.use((req, _res, next) => {
  req.prisma = prisma;
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
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/users', userRoutes);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
);

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
