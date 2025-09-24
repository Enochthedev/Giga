import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { LoadBalancer } from './services/load-balancer.js';
import { RequestRouter } from './services/request-router.js';
import { ServiceRegistry } from './services/service-registry.js';
import { RouteMatch, ServiceDefinition } from './types/index.js';

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

// Initialize core components
const serviceRegistry = new ServiceRegistry();
const requestRouter = new RequestRouter(serviceRegistry);
const loadBalancer = new LoadBalancer();

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

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Initialize services
  initializeServices();

  // Add correlation ID middleware
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    const correlationId = request.headers['x-correlation-id'] as string ||
      `gw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    (request as any).correlationId = correlationId;
    request.headers['x-correlation-id'] = correlationId;
    await Promise.resolve(); // Ensure async function has await
  });

  // Add request logging middleware
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    await Promise.resolve(); // Ensure async function has await
    request.log.info({
      correlationId: (request as any).correlationId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    }, 'Incoming request');
  });

  // Health check with service registry status
  fastify.get('/health', async () => {
    await Promise.resolve(); // Ensure async function has await
    const stats = serviceRegistry.getStats();
    const routerStats = requestRouter.getStats();
    const loadBalancerStats = loadBalancer.getStats();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      gateway: {
        version: '1.0.0',
        uptime: process.uptime(),
      },
      services: stats,
      routing: routerStats,
      loadBalancing: loadBalancerStats,
    };
  });

  // Gateway management endpoints
  fastify.get('/gateway/services', async () => {
    await Promise.resolve(); // Ensure async function has await
    return {
      success: true,
      data: serviceRegistry.getServices(),
    };
  });

  fastify.get('/gateway/services/:serviceId/versions', async (request: FastifyRequest) => {
    await Promise.resolve(); // Ensure async function has await
    const { serviceId } = request.params as { serviceId: string };
    return {
      success: true,
      data: serviceRegistry.getServiceVersions(serviceId),
    };
  });

  fastify.post('/gateway/services/:serviceId/versions', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const { serviceId } = request.params as { serviceId: string };
    const versionConfig = request.body as any;

    try {
      serviceRegistry.registerServiceVersion(serviceId, versionConfig);
      return reply.code(201).send({
        success: true,
        message: `Version ${versionConfig.version} registered for service ${serviceId}`,
      });
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register version',
      });
    }
  });

  fastify.get('/gateway/routes', async () => {
    await Promise.resolve(); // Ensure async function has await
    return {
      success: true,
      data: requestRouter.getAllRoutingRules(),
    };
  });

  fastify.post('/gateway/routes', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const rule = request.body as any;

    try {
      requestRouter.addDynamicRoutingRule(rule);
      return reply.code(201).send({
        success: true,
        message: `Routing rule ${rule.id} added successfully`,
      });
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add routing rule',
      });
    }
  });

  fastify.put('/gateway/routes/:ruleId/toggle', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const { ruleId } = request.params as { ruleId: string };
    const { enabled } = request.body as { enabled: boolean };

    try {
      requestRouter.toggleRoutingRule(ruleId, enabled);
      return {
        success: true,
        message: `Routing rule ${ruleId} ${enabled ? 'enabled' : 'disabled'}`,
      };
    } catch (error) {
      return reply.code(404).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle routing rule',
      });
    }
  });

  fastify.post('/gateway/services/:serviceId/rewrite-rules', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const { serviceId } = request.params as { serviceId: string };
    const rule = request.body as any;

    try {
      serviceRegistry.addPathRewriteRule(serviceId, rule);
      return reply.code(201).send({
        success: true,
        message: `Path rewrite rule added for service ${serviceId}`,
      });
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add rewrite rule',
      });
    }
  });

  fastify.get('/gateway/stats', async () => {
    await Promise.resolve(); // Ensure async function has await
    return {
      success: true,
      data: {
        services: serviceRegistry.getStats(),
        routing: requestRouter.getStats(),
        loadBalancing: loadBalancer.getStats(),
      },
    };
  });

  fastify.post('/gateway/discovery/configure', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const config = request.body as any;

    try {
      serviceRegistry.configureDiscovery(config);
      return {
        success: true,
        message: 'Service discovery configured successfully',
      };
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to configure discovery',
      });
    }
  });

  fastify.post('/gateway/discovery/trigger', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    try {
      const discoveredServices = await serviceRegistry.discoverServices();
      return {
        success: true,
        message: `Discovered ${discoveredServices.length} services`,
        data: discoveredServices,
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Service discovery failed',
      });
    }
  });

  // Dynamic proxy handler for all API routes
  fastify.all('/api/*', async (request: FastifyRequest, reply: FastifyReply) => {
    await Promise.resolve(); // Ensure async function has await
    const startTime = Date.now();

    try {
      // Resolve route using the request router
      const routeMatch = requestRouter.resolveRoute(request);

      if (!routeMatch) {
        return reply.code(404).send({
          success: false,
          error: 'Route not found',
          message: `${request.method} ${request.url} is not available`,
          correlationId: (request as any).correlationId,
          timestamp: new Date().toISOString(),
        });
      }

      // Get healthy instances for the service
      const instances = serviceRegistry.getHealthyInstances(routeMatch.serviceConfig.id);

      if (instances.length === 0) {
        return reply.code(503).send({
          success: false,
          error: 'Service Unavailable',
          message: `No healthy instances available for service: ${routeMatch.serviceConfig.name}`,
          correlationId: (request as any).correlationId,
          timestamp: new Date().toISOString(),
          retryAfter: 30,
        });
      }

      // Select instance using load balancer
      const selectedInstance = loadBalancer.selectInstanceWithStickySession(
        routeMatch.serviceConfig.id,
        instances,
        routeMatch.serviceConfig.loadBalancing,
        request
      );

      if (!selectedInstance) {
        return reply.code(503).send({
          success: false,
          error: 'Service Unavailable',
          message: 'Failed to select service instance',
          correlationId: (request as any).correlationId,
          timestamp: new Date().toISOString(),
        });
      }

      // Increment connection count
      loadBalancer.incrementConnections(selectedInstance.id, instances);

      try {
        // Forward request with automatic failover
        const response = await forwardRequestWithFailover(request, routeMatch, instances);

        // Update metrics
        const responseTime = Date.now() - startTime;
        serviceRegistry.updateInstanceMetrics(
          routeMatch.serviceConfig.id,
          response.instanceId,
          {
            responseTime,
            errorCount: response.statusCode >= 400 ? 1 : 0,
            requestCount: 1,
            timestamp: new Date(),
          }
        );

        // Add response headers
        reply.headers({
          'x-correlation-id': (request as any).correlationId,
          'x-response-time': `${responseTime}ms`,
          'x-service-instance': response.instanceId,
          'x-service-name': routeMatch.serviceConfig.name,
          'x-retry-count': response.retryCount?.toString() || '0',
        });

        return reply.code(response.statusCode).send(response.body);

      } finally {
        // Decrement connection count for all instances that were used
        loadBalancer.decrementConnections(selectedInstance.id, instances);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;

      request.log.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        correlationId: (request as any).correlationId,
        responseTime,
      }, 'Request forwarding failed');

      return reply.code(500).send({
        success: false,
        error: 'Internal Server Error',
        correlationId: (request as any).correlationId,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Catch-all for unmatched routes
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      error: 'Route not found',
      message: `${request.method} ${request.url} is not available`,
      correlationId: (request as any).correlationId,
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error({
      error: error.message,
      stack: error.stack,
      correlationId: (request as any).correlationId,
    });

    reply.code(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal Server Error',
      correlationId: (request as any).correlationId,
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

/**
 * Initialize services in the registry
 */
function initializeServices(): void {
  const services: ServiceDefinition[] = [
    {
      id: 'auth',
      name: 'auth',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Authentication and user management service',
      },
    },
    {
      id: 'ecommerce',
      name: 'ecommerce',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.ECOMMERCE_SERVICE_URL || 'http://localhost:3002',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Ecommerce products, cart, and orders service',
      },
    },
    {
      id: 'payment',
      name: 'payment',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Payment processing service',
      },
    },
    {
      id: 'taxi',
      name: 'taxi',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.TAXI_SERVICE_URL || 'http://localhost:3004',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Taxi booking and driver management service',
      },
    },
    {
      id: 'hotel',
      name: 'hotel',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.HOTEL_SERVICE_URL || 'http://localhost:3005',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Hotel booking and property management service',
      },
    },
    {
      id: 'ads',
      name: 'ads',
      version: '1.0.0',
      endpoints: [
        {
          url: process.env.ADS_SERVICE_URL || 'http://localhost:3006',
          weight: 1,
          metadata: {},
        },
      ],
      healthCheck: {
        enabled: true,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {
        description: 'Advertising campaigns and management service',
      },
    },
  ];

  // Register all services
  for (const service of services) {
    try {
      serviceRegistry.registerService(service);
      console.log(`✅ Registered service: ${service.name}`);
    } catch (error) {
      console.error(`❌ Failed to register service ${service.name}:`, error);
    }
  }

  console.log(`🎯 Initialized ${services.length} services in registry`);
}

/**
 * Forward request with automatic failover support
 */
async function forwardRequestWithFailover(
  request: FastifyRequest,
  routeMatch: RouteMatch,
  availableInstances: any[]
): Promise<{ statusCode: number; body: any; headers?: Record<string, string>; instanceId: string; retryCount?: number }> {
  const failoverConfig = routeMatch.serviceConfig.failover;
  let lastError: Error | null = null;
  let retryCount = 0;

  for (let attempt = 0; attempt <= failoverConfig.maxRetries; attempt++) {
    // Select instance for this attempt
    const instance = loadBalancer.selectInstance(
      routeMatch.serviceConfig.id,
      availableInstances.filter(inst => inst.isHealthy),
      routeMatch.serviceConfig.loadBalancing,
      request
    );

    if (!instance) {
      throw new Error('No healthy instances available for failover');
    }

    try {
      const response = await forwardRequest(request, instance, routeMatch);

      // Success - return response with instance info
      return {
        ...response,
        instanceId: instance.id,
        retryCount: attempt,
      };
    } catch (error) {
      lastError = error as Error;
      retryCount = attempt;

      // Mark instance as potentially unhealthy if it's a connection error
      if (error instanceof Error && (
        error.message.includes('timeout') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ENOTFOUND')
      )) {
        serviceRegistry.updateInstanceHealth(routeMatch.serviceConfig.id, instance.id, false);
      }

      // Don't retry on the last attempt
      if (attempt < failoverConfig.maxRetries) {
        const delay = failoverConfig.retryDelay * Math.pow(failoverConfig.backoffMultiplier, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));

        request.log.warn({
          correlationId: (request as any).correlationId,
          attempt: attempt + 1,
          instanceId: instance.id,
          error: error instanceof Error ? error.message : 'Unknown error',
          nextRetryIn: delay,
        }, 'Request failed, retrying with failover');
      }
    }
  }

  // All attempts failed
  throw new Error(`Request failed after ${retryCount + 1} attempts. Last error: ${lastError?.message}`);
}

/**
 * Forward request to selected service instance
 */
async function forwardRequest(
  request: FastifyRequest,
  instance: any,
  routeMatch: RouteMatch
): Promise<{ statusCode: number; body: any; headers?: Record<string, string> }> {
  const targetUrl = `${instance.url}${routeMatch.transformedPath}`;

  // Prepare headers
  const forwardHeaders = {
    ...request.headers,
    'x-forwarded-host': request.headers.host,
    'x-forwarded-proto': request.headers['x-forwarded-proto'] || 'http',
    'x-forwarded-for': request.ip,
    'x-correlation-id': (request as any).correlationId,
    'x-gateway-version': '1.0.0',
  };

  // Remove hop-by-hop headers
  delete (forwardHeaders as any)['connection'];
  delete (forwardHeaders as any)['keep-alive'];
  delete (forwardHeaders as any)['proxy-authenticate'];
  delete (forwardHeaders as any)['proxy-authorization'];
  delete (forwardHeaders as any)['te'];
  delete (forwardHeaders as any)['trailer'];
  delete (forwardHeaders as any)['transfer-encoding'];
  delete (forwardHeaders as any)['upgrade'];

  const requestOptions: any = {
    method: request.method,
    headers: forwardHeaders,
    signal: AbortSignal.timeout(routeMatch.serviceConfig.timeout),
  };

  // Add body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (request.body) {
      requestOptions.body = typeof request.body === 'string'
        ? request.body
        : JSON.stringify(request.body);
    }
  }

  try {
    const response = await fetch(targetUrl, requestOptions);

    let body;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    return {
      statusCode: response.status,
      body,
      headers: Object.fromEntries(response.headers.entries()),
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout to ${instance.url}`);
    }
    throw error;
  }
}