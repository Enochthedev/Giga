import app from './app-simple';
import { config } from './config';
import { logger } from './lib/logger';

const startServer = async () => {
  try {
    // Start the server
    const server = app.listen(config.port, config.host, () => {
      logger.info(`Payment service (simple) started`, {
        port: config.port,
        host: config.host,
        environment: config.nodeEnv,
        docs: `http://${config.host}:${config.port}/docs`,
      });

      console.log('\n🚀 Payment Service Started Successfully!');
      console.log(
        `📋 API Documentation: http://${config.host}:${config.port}/docs`
      );
      console.log(
        `🏥 Health Check: http://${config.host}:${config.port}/health`
      );
      console.log(
        `🧪 Test Endpoint: http://${config.host}:${config.port}/api/v1/payment-statistics`
      );
      console.log('\n💡 Ready for frontend integration!\n');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);

      server.close(async () => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
      logger.error('Uncaught exception', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason, promise });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Start the server
startServer();
