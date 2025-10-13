import 'dotenv/config';
import { createApp, initializeServices, shutdownServices } from './app';
import { getConfig } from './config';
import { createLogger } from './lib/logger';

const config = getConfig();
const logger = createLogger('Server');

async function startServer(): Promise<void> {
  try {
    // Initialize all services
    await initializeServices();

    // Create Express app
    const app = await createApp();

    // Start the server
    const server = app.listen(config.port, config.host, () => {
      logger.info('Upload service started', {
        port: config.port,
        host: config.host,
        environment: process.env.NODE_ENV || 'development',
      });

      // Log helpful documentation URLs
      const baseUrl = `http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`;
      console.log('\n📚 API Documentation Available:');
      console.log(`   Swagger UI: ${baseUrl}/api-docs`);
      console.log(`   OpenAPI JSON: ${baseUrl}/api-docs.json`);
      console.log(`   Health Check: ${baseUrl}/health`);
      console.log(`   Metrics: ${baseUrl}/metrics`);
      console.log('\n🚀 Upload Service Ready!\n');
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Shutdown services
          await shutdownServices();

          // Close database connections
          const { disconnectDatabase } = await import('./lib/prisma');
          await disconnectDatabase();

          // Close Redis connections
          const { disconnectRedis } = await import('./lib/redis');
          await disconnectRedis();

          logger.info('All connections closed, exiting process');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
      logger.error('Uncaught exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason, promise });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();
