import express from 'express';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import { PrismaClient } from './generated/prisma-client';
import {
  APIAnalyticsMiddleware,
  APICacheMiddleware,
  ResponseOptimizationMiddleware
} from './middleware/apiOptimization.middleware';
import { APIVersioningMiddleware } from './middleware/apiVersioning.middleware';
import { extractDeviceInfo } from './middleware/device.middleware';
import { EnhancedSecurityMiddleware } from './middleware/enhancedSecurity.middleware';
import { IPAccessControlMiddleware } from './middleware/ipAccessControl.middleware';
import {
  correlationIdMiddleware,
  errorLoggingMiddleware,
  requestLoggingMiddleware,
  securityLoggingMiddleware
} from './middleware/logging.middleware';
import { apiRateLimit } from './middleware/rateLimit.middleware';
import {
  advancedXSSProtection,
  comprehensiveSecurityValidation,
  contentSecurityPolicy,
  ipValidation,
  requestSanitization,
  requestTiming,
  xssProtection,
} from './middleware/security.middleware';
import { SessionManagementMiddleware } from './middleware/sessionManagement.middleware';
import { TwoFactorAuthMiddleware } from './middleware/twoFactorAuth.middleware';
import { securityValidation } from './middleware/validation.middleware';
import { apiRoutes } from './routes/api';
import { authRoutes } from './routes/auth';
import healthRoutes from './routes/health';
import { profileRoutes } from './routes/profile';
import tokenAnalyticsRoutes from './routes/token-analytics';
import { userRoutes } from './routes/user';
import { CleanupService } from './services/cleanup.service';
import { connectionPoolService } from './services/connection-pool.service';
import { logger } from './services/logger.service';
import { performanceProfiler } from './services/performance-profiler.service';
import { responseCompressionService } from './services/response-compression.service';
import { specs } from './swagger';

const app: express.Application = express();
const prisma = new PrismaClient();

// Initialize services
const cleanupService = CleanupService.getInstance();
cleanupService.startAutomaticCleanup();

// Start performance monitoring
performanceProfiler.startContinuousMonitoring();

// Enhanced security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // We'll handle this with our custom middleware
    crossOriginEmbedderPolicy: false,
  })
);

// Enhanced CORS with security features
app.use(EnhancedSecurityMiddleware.configureCORS());

// Response compression
app.use(responseCompressionService.compress({
  threshold: 1024, // Compress responses larger than 1KB
  level: 6 // Balanced compression level
}));

// Request size limit and JSON parsing
app.use(
  express.json({
    limit: '1mb',
    strict: true,
    type: 'application/json',
  })
);

// Logging middleware (must be early in the stack)
app.use(correlationIdMiddleware);
app.use(requestLoggingMiddleware);
app.use(securityLoggingMiddleware);

// API versioning and optimization middleware
app.use(APIVersioningMiddleware.validateVersion());
app.use(APIVersioningMiddleware.versionRouter());
app.use(ResponseOptimizationMiddleware.addOptimizationHeaders());
app.use(ResponseOptimizationMiddleware.conditionalRequests());
app.use(ResponseOptimizationMiddleware.optimizePagination());
app.use(APIAnalyticsMiddleware.trackUsage());

// Enhanced security middleware stack
app.use(requestTiming);
app.use(ipValidation);
app.use(EnhancedSecurityMiddleware.setSecurityHeaders);
app.use(EnhancedSecurityMiddleware.validateRequest);
app.use(EnhancedSecurityMiddleware.securityMonitoring);
app.use(IPAccessControlMiddleware.checkIPAccess);
app.use(comprehensiveSecurityValidation);
app.use(contentSecurityPolicy);
app.use(requestSanitization);
app.use(xssProtection);
app.use(advancedXSSProtection);
app.use(securityValidation);

// Rate limiting
app.use(apiRateLimit);

// Add device info extraction globally
app.use(extractDeviceInfo);

// Add optimized Prisma client to request context
app.use((req, _res, next) => {
  try {
    req.prisma = await connectionPoolService.getClient('api');
    next();
  } catch (error) {
    logger.error('Failed to get database connection', error as Error);
    next(error);
  }
});

// API response caching for GET requests
app.use('/api/v1/users', APICacheMiddleware.cache(300)); // Cache user data for 5 minutes
app.use('/api/v1/profiles', APICacheMiddleware.cache(600)); // Cache profile data for 10 minutes

// Session management for authenticated routes
app.use(SessionManagementMiddleware.validateSession);

// 2FA requirement checking
app.use(TwoFactorAuthMiddleware.check2FARequirement);

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// API response headers
app.use(EnhancedSecurityMiddleware.setAPIResponseHeaders);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/api', apiRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/token-analytics', tokenAnalyticsRoutes);

// Error logging middleware
app.use(errorLoggingMiddleware);

// Global error handler
app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error('Unhandled error in global error handler', err as Error, req.logContext);

    res.status(err?.statusCode || 500).json({
      success: false,
      error: err?.message || 'Internal Server Error',
      code: err?.code || 'INTERNAL_ERROR',
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
