import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import redis from '@fastify/redis';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin:
      process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true,
  });

  await fastify.register(helmet);

  await fastify.register(redis, {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'core',
    };
  });

  // Placeholder routes - will be expanded in Phase 2
  fastify.get('/api/v1/products', async () => {
    return {
      success: true,
      data: {
        items: [],
        total: 0,
        message: 'Product catalog coming in Phase 2',
      },
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/api/v1/vendor/dashboard', async () => {
    return {
      success: true,
      data: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        message: 'Vendor dashboard coming in Phase 2',
      },
      timestamp: new Date().toISOString(),
    };
  });

  // Global error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);

    reply.code(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  });

  return fastify;
}

async function start() {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3002');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🛒 Core Service running on http://${host}:${port}`);
  } catch (err) {
    console.error('Failed to start core service:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildApp };
