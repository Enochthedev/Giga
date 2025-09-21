import { vi } from 'vitest';

/**
 * Mock the auth middleware to bypass authentication in tests
 */
export const mockAuthMiddleware = () => {
  // Mock the auth middleware module
  vi.doMock('../../middleware/auth.middleware', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
      // Add mock user to request
      req.user = {
        id: 'test-customer-123',
        sub: 'test-customer-123',
        email: 'test@example.com',
        roles: ['CUSTOMER'],
        activeRole: 'CUSTOMER',
        vendorId: undefined
      };
      next();
    },
    requireVendor: (req: any, res: any, next: any) => {
      if (!req.user?.vendorId) {
        return res.status(403).json({
          success: false,
          error: 'Vendor access required'
        });
      }
      next();
    },
    requireAdmin: (req: any, res: any, next: any) => {
      if (req.user?.activeRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      next();
    },
    requireRole: (allowedRoles: string[]) => (req: any, res: any, next: any) => {
      if (!req.user || !allowedRoles.includes(req.user.activeRole)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }
      next();
    }
  }));
};

/**
 * Mock the session middleware to bypass session handling in tests
 */
export const mockSessionMiddleware = () => {
  vi.doMock('../../middleware/session.middleware', () => ({
    handleSession: (req: any, res: any, next: any) => {
      req.sessionId = 'test-session-123';
      req.session = {
        sessionId: 'test-session-123',
        customerId: 'test-customer-123',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
        data: {}
      };
      next();
    },
    handleAuthentication: (req: any, res: any, next: any) => {
      req.customerId = 'test-customer-123';
      req.user = {
        id: 'test-customer-123',
        email: 'test@example.com',
        role: 'CUSTOMER'
      };
      next();
    }
  }));
};

/**
 * Mock service clients to avoid external service calls
 */
export const mockServiceClients = () => {
  // Mock auth service client
  vi.doMock('../../clients/auth.client', () => ({
    HttpAuthServiceClient: vi.fn().mockImplementation(() => ({
      validateToken: vi.fn().mockResolvedValue({
        id: 'test-customer-123',
        email: 'test@example.com',
        name: 'Test Customer',
        role: 'CUSTOMER',
        permissions: ['read:cart', 'write:cart', 'read:orders', 'write:orders']
      }),
      getUserInfo: vi.fn().mockResolvedValue({
        id: 'test-customer-123',
        email: 'test@example.com',
        name: 'Test Customer',
        role: 'CUSTOMER',
        permissions: ['read:cart', 'write:cart', 'read:orders', 'write:orders']
      }),
      getUserPermissions: vi.fn().mockResolvedValue(['read:cart', 'write:cart', 'read:orders', 'write:orders']),
      healthCheck: vi.fn().mockResolvedValue(true)
    }))
  }));

  // Mock payment service client
  vi.doMock('../../clients/payment.client', () => ({
    HttpPaymentServiceClient: vi.fn().mockImplementation(() => ({
      createPaymentIntent: vi.fn().mockResolvedValue({
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret',
        status: 'requires_confirmation',
        amount: 11799,
        currency: 'usd'
      }),
      confirmPayment: vi.fn().mockResolvedValue({
        success: true,
        paymentIntentId: 'pi_test_123',
        status: 'succeeded'
      }),
      refundPayment: vi.fn().mockResolvedValue({
        success: true,
        refundId: 'rf_test_123',
        amount: 11799
      }),
      getPaymentMethods: vi.fn().mockResolvedValue([
        { id: 'pm_test_123', type: 'card', last4: '4242' }
      ]),
      healthCheck: vi.fn().mockResolvedValue(true)
    }))
  }));

  // Mock notification service client
  vi.doMock('../../clients/notification.client', () => ({
    HttpNotificationServiceClient: vi.fn().mockImplementation(() => ({
      sendOrderConfirmation: vi.fn().mockResolvedValue(undefined),
      sendOrderStatusUpdate: vi.fn().mockResolvedValue(undefined),
      sendVendorOrderNotification: vi.fn().mockResolvedValue(undefined),
      sendInventoryAlert: vi.fn().mockResolvedValue(undefined),
      healthCheck: vi.fn().mockResolvedValue(true)
    }))
  }));
};

/**
 * Mock Redis service to avoid Redis dependency in tests
 */
export const mockRedisService = () => {
  vi.doMock('../../services/redis.service', () => ({
    redisService: {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
      exists: vi.fn().mockResolvedValue(0),
      expire: vi.fn().mockResolvedValue(1),
      keys: vi.fn().mockResolvedValue([]),
      hget: vi.fn().mockResolvedValue(null),
      hset: vi.fn().mockResolvedValue(1),
      hdel: vi.fn().mockResolvedValue(1),
      hgetall: vi.fn().mockResolvedValue({}),
      ping: vi.fn().mockResolvedValue('PONG'),
      quit: vi.fn().mockResolvedValue('OK'),
      disconnect: vi.fn().mockResolvedValue(undefined),
      isReady: true
    }
  }));
};

/**
 * Setup all mocks for integration tests
 */
export const setupIntegrationTestMocks = () => {
  mockAuthMiddleware();
  mockSessionMiddleware();
  mockServiceClients();
  mockRedisService();
};

/**
 * Mock vendor user for vendor-specific tests
 */
export const mockVendorUser = () => {
  vi.doMock('../../middleware/auth.middleware', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
      req.user = {
        id: 'test-vendor-user-123',
        sub: 'test-vendor-user-123',
        email: 'vendor@example.com',
        roles: ['VENDOR'],
        activeRole: 'VENDOR',
        vendorId: 'test-vendor-123'
      };
      next();
    },
    requireVendor: (req: any, res: any, next: any) => {
      if (!req.user?.vendorId) {
        return res.status(403).json({
          success: false,
          error: 'Vendor access required'
        });
      }
      next();
    },
    requireAdmin: (req: any, res: any, next: any) => {
      if (req.user?.activeRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      next();
    },
    requireRole: (allowedRoles: string[]) => (req: any, res: any, next: any) => {
      if (!req.user || !allowedRoles.includes(req.user.activeRole)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }
      next();
    }
  }));
};

/**
 * Mock admin user for admin-specific tests
 */
export const mockAdminUser = () => {
  vi.doMock('../../middleware/auth.middleware', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
      req.user = {
        id: 'test-admin-user-123',
        sub: 'test-admin-user-123',
        email: 'admin@example.com',
        roles: ['ADMIN'],
        activeRole: 'ADMIN',
        vendorId: undefined
      };
      next();
    },
    requireVendor: (req: any, res: any, next: any) => {
      if (!req.user?.vendorId) {
        return res.status(403).json({
          success: false,
          error: 'Vendor access required'
        });
      }
      next();
    },
    requireAdmin: (req: any, res: any, next: any) => {
      if (req.user?.activeRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      next();
    },
    requireRole: (allowedRoles: string[]) => (req: any, res: any, next: any) => {
      if (!req.user || !allowedRoles.includes(req.user.activeRole)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }
      next();
    }
  }));
};