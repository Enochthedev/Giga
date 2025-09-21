import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import httpProxy from '@fastify/http-proxy';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';

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

// Service registry
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  ecommerce: process.env.ECOMMERCE_SERVICE_URL || 'http://localhost:3002',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
  taxi: process.env.TAXI_SERVICE_URL || 'http://localhost:3004',
  hotel: process.env.HOTEL_SERVICE_URL || 'http://localhost:3005',
  ads: process.env.ADS_SERVICE_URL || 'http://localhost:3006',
};

async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin:
      process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // await fastify.register(redis, {
  //   host: process.env.REDIS_HOST || 'localhost',
  //   port: parseInt(process.env.REDIS_PORT || '6379'),
  // });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    // redis: fastify.redis,
  });

  // Health check
  fastify.get('/health', () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: Object.keys(services),
    };
  });

  // Service routing with load balancing
  const routes = [
    { prefix: '/api/v1/auth', upstream: services.auth },
    { prefix: '/api/v1/products', upstream: services.ecommerce },
    { prefix: '/api/v1/vendor', upstream: services.ecommerce },
    { prefix: '/api/v1/cart', upstream: services.ecommerce },
    { prefix: '/api/v1/orders', upstream: services.ecommerce },
    { prefix: '/api/v1/payments', upstream: services.payment },
    { prefix: '/api/v1/rides', upstream: services.taxi },
    { prefix: '/api/v1/drivers', upstream: services.taxi },
    { prefix: '/api/v1/properties', upstream: services.hotel },
    { prefix: '/api/v1/host', upstream: services.hotel },
    { prefix: '/api/v1/bookings', upstream: services.hotel },
    { prefix: '/api/v1/campaigns', upstream: services.ads },
    { prefix: '/api/v1/advertiser', upstream: services.ads },
  ];

  // Register proxy routes
  for (const route of routes) {
    await fastify.register(httpProxy, {
      upstream: route.upstream,
      prefix: route.prefix,
      rewritePrefix: route.prefix, // Keep the full path when forwarding
      http2: false,
      replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => {
          return {
            ...headers,
            'x-forwarded-host': originalReq.headers.host,
            'x-forwarded-proto':
              originalReq.headers['x-forwarded-proto'] || 'http',
          };
        },
      },
    });
  }

  // Catch-all for unmatched routes
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      error: 'Route not found',
      message: `${request.method} ${request.url} is not available`,
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
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
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🚀 API Gateway running on http://${host}:${port}`);
  } catch (err) {
    console.error('Failed to start gateway:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildApp };
