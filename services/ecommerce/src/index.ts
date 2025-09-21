import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import redis from '@fastify/redis';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { productRoutes } from './routes/products';
import { vendorRoutes } from './routes/vendor';
// Type declarations are automatically loaded

const prisma = new PrismaClient();

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
  ajv: {
    customOptions: {
      strict: false,
      keywords: ['example'],
    },
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

  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Multi-Sided Platform - Ecommerce Service',
        description:
          'Multi-vendor marketplace with products, orders, and vendor management',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3002',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  await fastify.register(redis, {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  // Connect to Prisma and add to Fastify context
  await prisma.$connect();
  fastify.decorate('prisma', prisma);

  // Add Prisma cleanup hook
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  // Health check
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'healthy' },
              timestamp: { type: 'string', format: 'date-time' },
              database: { type: 'string', example: 'connected' },
              service: { type: 'string', example: 'ecommerce' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return reply.send({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected',
          service: 'ecommerce',
        });
      } catch (error) {
        fastify.log.error(error, 'Database health check failed');
        return reply.code(503).send({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          service: 'ecommerce',
        });
      }
    }
  );

  // Register routes
  await fastify.register(productRoutes, { prefix: '/api/v1/products' });
  await fastify.register(cartRoutes, { prefix: '/api/v1/cart' });
  await fastify.register(orderRoutes, { prefix: '/api/v1/orders' });
  await fastify.register(vendorRoutes, { prefix: '/api/v1/vendor' });

  // Global error handler
  // eslint-disable-next-line require-await
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
    const port = parseInt(process.env.ECOMMERCE_PORT || '3002');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🛒 Ecommerce Service running on http://${host}:${port}`);
    console.log(`📚 API Documentation: http://${host}:${port}/docs`);
  } catch (err) {
    console.error('Failed to start ecommerce service:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down ecommerce service...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { buildApp };
