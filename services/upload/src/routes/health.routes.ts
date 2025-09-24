import { Request, Response, Router } from 'express';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'upload-service',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 */
router.get('/ready', (_req: Request, res: Response) => {
  try {
    // Check if upload directory is accessible
    const fs = require('fs/promises');
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    await fs.access(uploadDir);

    res.json({
      status: 'ready',
      service: 'upload-service',
      checks: {
        uploadDirectory: 'accessible',
        memory: 'ok'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      service: 'upload-service',
      checks: {
        uploadDirectory: 'inaccessible',
        memory: 'ok'
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export { router as healthRoutes };
