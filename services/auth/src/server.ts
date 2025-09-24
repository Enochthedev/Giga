import { app, prisma } from './app';
import { healthService } from './services/health.service';
import { logger } from './services/logger.service';
import { redisService } from './services/redis.service';

const PORT = parseInt(process.env.AUTH_PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

let server: any;

async function start() {
  try {
    // Connect to Prisma
    await prisma.$connect();
    logger.info('✅ Connected to database');

    // Connect to Redis
    await redisService.connect();
    logger.info('✅ Connected to Redis');

    // Start server
    server = app.listen(PORT, HOST, () => {
      logger.info(`🔐 Auth Service running on http://${HOST}:${PORT}`, {
        port: PORT,
        host: HOST,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        pid: process.pid
      });
      logger.info(`📚 API Documentation: http://${HOST}:${PORT}/docs`);
      logger.info(`🏥 Health Check: http://${HOST}:${PORT}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start auth service', error as Error);
    process.exit(1);
  }
}

// Graceful shutdown handler
async async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received, starting graceful shutdown`);

  if (server) {
    // Stop accepting new connections
    server.close(async (err: any) => {
      if (err) {
        logger.error('Error during server shutdown', err);
        process.exit(1);
      }

      try {
        // Cleanup services
        await Promise.all([
          prisma.$disconnect(),
          redisService.disconnect(),
          healthService.cleanup()
        ]);

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', error as Error);
        process.exit(1);
      }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', new Error(String(reason)), {
    promise: promise.toString()
  });
  process.exit(1);
});

if (require.main === module) {
  start();
}

export { start };
