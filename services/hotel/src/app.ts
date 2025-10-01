import config from '@/config';
import { createErrorHandler } from '@/utils/errors';
import logger from '@/utils/logger';
import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitConfig.windowMs,
  max: config.rateLimitConfig.maxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
    timestamp: new Date(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? req.body : undefined,
  });
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hotel Service is healthy',
    timestamp: new Date(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes will be added here
app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hotel Service API v1',
    timestamp: new Date(),
    endpoints: {
      properties: '/api/v1/properties',
      roomTypes: '/api/v1/room-types',
      availability: '/api/v1/availability',
      bookings: '/api/v1/bookings',
      pricing: '/api/v1/pricing',
      guests: '/api/v1/guests',
      docs: '/api/docs',
    },
  });
});

// API documentation placeholder
app.get('/api/docs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API documentation will be available here',
    timestamp: new Date(),
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use(createErrorHandler());

export default app;
