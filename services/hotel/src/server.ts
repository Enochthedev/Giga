import config from '@/config';
import prisma from '@/lib/prisma';
import { connectRedis } from '@/lib/redis';
import logger from '@/utils/logger';
import app from './app';

const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Test database connection
    await prisma.$connect();
    logger.info('Connected to database');

    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Hotel Service running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(
        `API Documentation: http://localhost:${config.port}/api/docs`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await prisma.$disconnect();
          logger.info('Database connection closed');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
