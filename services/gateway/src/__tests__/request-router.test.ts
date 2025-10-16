import { FastifyRequest } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RequestRouter } from '../services/request-router.js';
import { ServiceRegistry } from '../services/service-registry.js';
import { RoutingRule, ServiceDefinition } from '../types/index.js';

describe('RequestRouter', () => {
  let serviceRegistry: ServiceRegistry;
  let requestRouter: RequestRouter;

  beforeEach(() => {
    serviceRegistry = new ServiceRegistry();
    requestRouter = new RequestRouter(serviceRegistry);

    // Register test services
    const authService: ServiceDefinition = {
      id: 'auth',
      name: 'auth',
      version: '1.0.0',
      endpoints: [{ url: 'http://localhost:3001', weight: 1, metadata: {} }],
      healthCheck: {
        enabled: false,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {},
    };

    const ecommerceService: ServiceDefinition = {
      id: 'ecommerce',
      name: 'ecommerce',
      version: '1.0.0',
      endpoints: [{ url: 'http://localhost:3002', weight: 1, metadata: {} }],
      healthCheck: {
        enabled: false,
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
        expectedStatus: [200],
      },
      metadata: {},
    };

    serviceRegistry.registerService(authService);
    serviceRegistry.registerService(ecommerceService);
  });

  afterEach(() => {
    serviceRegistry.destroy();
  });

  describe('resolveRoute', () => {
    it('should route auth requests correctly', () => {
      const mockRequest = {
        url: '/api/v1/auth/login',
        method: 'POST',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.serviceConfig.id).toBe('auth');
      expect(routeMatch?.rule.pattern).toBe('/api/v1/auth/*');
    });

    it('should route ecommerce product requests correctly', () => {
      const mockRequest = {
        url: '/api/v1/products/123',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.serviceConfig.id).toBe('ecommerce');
      expect(routeMatch?.rule.pattern).toBe('/api/v1/products/*');
    });

    it('should return null for unmatched routes', () => {
      const mockRequest = {
        url: '/api/v1/unknown/endpoint',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeNull();
    });

    it('should respect HTTP method restrictions', () => {
      const mockRequest = {
        url: '/api/v1/auth/login',
        method: 'TRACE', // Not allowed method
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeNull();
    });
  });

  describe('addRoutingRule', () => {
    it('should add custom routing rule', () => {
      const customRule: RoutingRule = {
        id: 'custom-auth-rule',
        pattern: '/api/v2/auth/*',
        method: ['GET', 'POST'],
        serviceId: 'auth',
        priority: 200,
        conditions: [],
        transformations: [],
        metadata: { description: 'Custom auth rule' },
      };

      requestRouter.addRoutingRule(customRule);

      const mockRequest = {
        url: '/api/v2/auth/profile',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.rule.id).toBe('custom-auth-rule');
      expect(routeMatch?.serviceConfig.id).toBe('auth');
    });

    it('should respect rule priority order', () => {
      // Add high priority rule that matches same pattern
      const highPriorityRule: RoutingRule = {
        id: 'high-priority-auth',
        pattern: '/api/v1/auth/*',
        method: ['POST'],
        serviceId: 'ecommerce', // Different service
        priority: 500,
        conditions: [],
        transformations: [],
        metadata: {},
      };

      requestRouter.addRoutingRule(highPriorityRule);

      const mockRequest = {
        url: '/api/v1/auth/login',
        method: 'POST',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.rule.id).toBe('high-priority-auth');
      expect(routeMatch?.serviceConfig.id).toBe('ecommerce');
    });
  });

  describe('removeRoutingRule', () => {
    it('should remove routing rule by ID', () => {
      const customRule: RoutingRule = {
        id: 'removable-rule',
        pattern: '/api/v1/temp/*',
        method: ['GET'],
        serviceId: 'auth',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: {},
      };

      requestRouter.addRoutingRule(customRule);

      // Verify rule exists
      const mockRequest = {
        url: '/api/v1/temp/test',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      let routeMatch = requestRouter.resolveRoute(mockRequest);
      expect(routeMatch?.rule.id).toBe('removable-rule');

      // Remove rule
      requestRouter.removeRoutingRule('removable-rule');

      // Verify rule is removed
      routeMatch = requestRouter.resolveRoute(mockRequest);
      expect(routeMatch).toBeNull();
    });
  });

  describe('path parameter extraction', () => {
    it('should extract path parameters correctly', () => {
      const paramRule: RoutingRule = {
        id: 'param-rule',
        pattern: '/api/v1/users/:userId/posts/:postId',
        method: ['GET'],
        serviceId: 'auth',
        priority: 100,
        conditions: [],
        transformations: [],
        metadata: {},
      };

      requestRouter.addRoutingRule(paramRule);

      const mockRequest = {
        url: '/api/v1/users/123/posts/456',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.pathParams).toEqual({
        userId: '123',
        postId: '456',
      });
    });
  });

  describe('routing conditions', () => {
    it('should evaluate header conditions correctly', () => {
      const conditionalRule: RoutingRule = {
        id: 'conditional-rule',
        pattern: '/api/v1/conditional/*',
        method: ['GET'],
        serviceId: 'auth',
        priority: 100,
        conditions: [
          {
            type: 'header',
            field: 'x-api-version',
            operator: 'equals',
            value: 'v2',
          },
        ],
        transformations: [],
        metadata: {},
      };

      requestRouter.addRoutingRule(conditionalRule);

      // Request without required header
      const mockRequest = {
        url: '/api/v1/conditional/test',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      let routeMatch = requestRouter.resolveRoute(mockRequest);
      expect(routeMatch).toBeNull();

      // Request with required header
      const mockRequestWithHeader = {
        url: '/api/v1/conditional/test',
        method: 'GET',
        headers: { 'x-api-version': 'v2' },
        query: {},
      } as unknown as FastifyRequest;

      routeMatch = requestRouter.resolveRoute(mockRequestWithHeader);
      expect(routeMatch).toBeDefined();
      expect(routeMatch?.rule.id).toBe('conditional-rule');
    });

    it('should evaluate query conditions correctly', () => {
      const queryRule: RoutingRule = {
        id: 'query-rule',
        pattern: '/api/v1/search/*',
        method: ['GET'],
        serviceId: 'ecommerce',
        priority: 100,
        conditions: [
          {
            type: 'query',
            field: 'version',
            operator: 'equals',
            value: 'beta',
          },
        ],
        transformations: [],
        metadata: {},
      };

      requestRouter.addRoutingRule(queryRule);

      const mockRequest = {
        url: '/api/v1/search/products',
        method: 'GET',
        headers: {},
        query: { version: 'beta' },
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.rule.id).toBe('query-rule');
    });
  });

  describe('path transformations', () => {
    it('should apply path rewrite transformations', () => {
      const rewriteRule: RoutingRule = {
        id: 'rewrite-rule',
        pattern: '/api/v1/legacy/*',
        method: ['GET'],
        serviceId: 'auth',
        priority: 100,
        conditions: [],
        transformations: [
          {
            type: 'path',
            action: 'rewrite',
            field: '',
            pattern: '/api/v1/legacy/(.*)',
            replacement: '/api/v2/new/$1',
          },
        ],
        metadata: {},
      };

      requestRouter.addRoutingRule(rewriteRule);

      const mockRequest = {
        url: '/api/v1/legacy/users',
        method: 'GET',
        headers: {},
        query: {},
      } as FastifyRequest;

      const routeMatch = requestRouter.resolveRoute(mockRequest);

      expect(routeMatch).toBeDefined();
      expect(routeMatch?.transformedPath).toBe('/api/v2/new/users');
    });
  });

  describe('getStats', () => {
    it('should return routing statistics', () => {
      const _stats = requestRouter.getStats();

      expect(stats.totalRules).toBeGreaterThan(0);
      expect(stats.rulesByService).toHaveProperty('auth');
      expect(stats.rulesByService).toHaveProperty('ecommerce');
      expect(typeof stats.cachedPatterns).toBe('number');
    });
  });
});
