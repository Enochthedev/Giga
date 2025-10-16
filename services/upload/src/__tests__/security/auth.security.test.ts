import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { AccessLevel, EntityType } from '../../types/upload.types';

describe('Authentication Security Tests', () => {
  let authService: AuthService;
  let permissionService: PermissionService;

  beforeEach(() => {
    authService = AuthService.getInstance();
    permissionService = PermissionService.getInstance();
    vi.clearAllMocks();
  });

  describe('Token Validation Security', () => {
    it('should reject malformed tokens', async () => {
      const malformedTokens = [
        'invalid-token',
        'Bearer',
        'Bearer ',
        'Bearer invalid.token',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid',
      ];

      for (const token of malformedTokens) {
        await expect(
          authService.validateToken(token.replace('Bearer ', ''))
        ).rejects.toThrow();
      }
    });

    it('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        {
          sub: 'test-service',
          serviceName: 'test-service',
          permissions: ['upload:read'],
          type: 'service',
          iss: process.env.JWT_ISSUER || 'platform-auth',
          aud: process.env.JWT_AUDIENCE || 'platform-services',
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      await expect(authService.validateToken(expiredToken)).rejects.toThrow(
        'Token expired'
      );
    });

    it('should reject tokens with invalid signature', async () => {
      const invalidToken = jwt.sign(
        {
          sub: 'test-service',
          serviceName: 'test-service',
          permissions: ['upload:read'],
          type: 'service',
          iss: 'platform-auth',
          aud: 'platform-services',
        },
        'wrong-secret'
      );

      await expect(authService.validateToken(invalidToken)).rejects.toThrow(
        'Invalid token'
      );
    });

    it('should reject tokens with missing required claims', async () => {
      const invalidTokens = [
        // Missing sub
        jwt.sign(
          {
            serviceName: 'test-service',
            permissions: ['upload:read'],
            type: 'service',
            iss: 'platform-auth',
            aud: 'platform-services',
          },
          process.env.JWT_SECRET || 'default-secret'
        ),

        // Missing type
        jwt.sign(
          {
            sub: 'test-service',
            serviceName: 'test-service',
            permissions: ['upload:read'],
            iss: 'platform-auth',
            aud: 'platform-services',
          },
          process.env.JWT_SECRET || 'default-secret'
        ),

        // Missing permissions
        jwt.sign(
          {
            sub: 'test-service',
            serviceName: 'test-service',
            type: 'service',
            iss: 'platform-auth',
            aud: 'platform-services',
          },
          process.env.JWT_SECRET || 'default-secret'
        ),

        // Invalid permissions type
        jwt.sign(
          {
            sub: 'test-service',
            serviceName: 'test-service',
            permissions: 'invalid',
            type: 'service',
            iss: 'platform-auth',
            aud: 'platform-services',
          },
          process.env.JWT_SECRET || 'default-secret'
        ),
      ];

      for (const token of invalidTokens) {
        await expect(authService.validateToken(token)).rejects.toThrow();
      }
    });

    it('should reject blacklisted tokens', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );

      // Blacklist the token
      authService.blacklistToken(token);

      await expect(authService.validateToken(token)).rejects.toThrow(
        'Token has been revoked'
      );
    });

    it('should validate service tokens correctly', async () => {
      // Create a fresh auth service instance to avoid blacklist conflicts
      const freshAuthService = AuthService.getInstance();
      const token = freshAuthService.generateServiceToken(
        'test-service-2',
        'test-service-2',
        ['upload:read']
      );
      const context = await freshAuthService.validateToken(token);

      expect(context.type).toBe('service');
      expect(context.id).toBe('test-service-2');
      expect(context.serviceName).toBe('test-service-2');
      expect(context.permissions).toContain('upload:read');
    });

    it('should validate user tokens correctly', async () => {
      const userToken = jwt.sign(
        {
          sub: 'user-123',
          email: 'test@example.com',
          roles: ['USER'],
          permissions: ['upload:create'],
          type: 'user',
          iss: 'platform-auth',
          aud: 'platform-services',
        },
        process.env.JWT_SECRET || 'default-secret'
      );

      const context = await authService.validateToken(userToken);

      expect(context.type).toBe('user');
      expect(context.id).toBe('user-123');
      expect(context.email).toBe('test@example.com');
      expect(context.roles).toContain('USER');
      expect(context.permissions).toContain('upload:create');
    });
  });

  describe('Permission System Security', () => {
    it('should deny access without proper permissions', () => {
      const context = {
        type: 'service' as const,
        id: 'test-service',
        serviceName: 'test-service',
        permissions: ['upload:read'],
      };

      const result = permissionService.checkPermission(
        context,
        'upload:delete'
      );
      expect(result.isAllowed).toBe(false);
      expect(result.reason).toBe('Permission denied');
    });

    it('should allow access with proper permissions', () => {
      const context = {
        type: 'service' as const,
        id: 'test-service',
        serviceName: 'test-service',
        permissions: ['upload:delete'],
      };

      const result = permissionService.checkPermission(
        context,
        'upload:delete'
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should allow admin access to everything', () => {
      const adminContext = {
        type: 'user' as const,
        id: 'admin-user',
        email: 'admin@example.com',
        roles: ['ADMIN'],
        permissions: ['admin:all'],
      };

      const result = permissionService.checkPermission(
        adminContext,
        'upload:delete'
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Admin access');
    });

    it('should respect wildcard permissions', () => {
      const context = {
        type: 'service' as const,
        id: 'test-service',
        serviceName: 'test-service',
        permissions: ['upload:*'],
      };

      const result = permissionService.checkPermission(
        context,
        'upload:delete'
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Wildcard permission');
    });

    it('should check entity-specific upload permissions', () => {
      const context = {
        type: 'service' as const,
        id: 'auth-service',
        serviceName: 'auth-service',
        permissions: ['upload:profile'],
      };

      const profileResult = permissionService.checkUploadPermission(
        context,
        EntityType.USER_PROFILE
      );
      expect(profileResult.isAllowed).toBe(true);

      const productResult = permissionService.checkUploadPermission(
        context,
        EntityType.PRODUCT
      );
      expect(productResult.isAllowed).toBe(false);
    });

    it('should check access level permissions correctly', () => {
      const context = {
        type: 'user' as const,
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: ['access:private'],
      };

      const resource = {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        accessLevel: AccessLevel.PRIVATE,
        ownerId: 'user-123',
      };

      const result = permissionService.checkAccessPermission(context, resource);
      expect(result.isAllowed).toBe(true);
    });

    it('should deny access to private resources for non-owners', () => {
      const context = {
        type: 'user' as const,
        id: 'user-456',
        email: 'user2@example.com',
        roles: ['USER'],
        permissions: ['access:private'],
      };

      const resource = {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        accessLevel: AccessLevel.PRIVATE,
        ownerId: 'user-123', // Different owner
      };

      const result = permissionService.checkAccessPermission(context, resource);
      expect(result.isAllowed).toBe(false);
    });

    it('should allow access to public resources', () => {
      const context = {
        type: 'user' as const,
        id: 'user-456',
        email: 'user2@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const resource = {
        entityType: EntityType.PRODUCT,
        entityId: 'product-123',
        accessLevel: AccessLevel.PUBLIC,
      };

      const result = permissionService.checkAccessPermission(context, resource);
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Public resource');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should grant permissions based on user roles', () => {
      const vendorContext = {
        type: 'user' as const,
        id: 'vendor-123',
        email: 'vendor@example.com',
        roles: ['VENDOR'],
        permissions: [],
      };

      const productUpload = permissionService.checkUploadPermission(
        vendorContext,
        EntityType.PRODUCT
      );
      expect(productUpload.isAllowed).toBe(true);

      const profileUpload = permissionService.checkUploadPermission(
        vendorContext,
        EntityType.USER_PROFILE
      );
      expect(profileUpload.isAllowed).toBe(false);
    });

    it('should grant permissions based on service identity', () => {
      const ecommerceContext = {
        type: 'service' as const,
        id: 'ecommerce-service',
        serviceName: 'ecommerce-service',
        permissions: [],
      };

      const productUpload = permissionService.checkUploadPermission(
        ecommerceContext,
        EntityType.PRODUCT
      );
      expect(productUpload.isAllowed).toBe(true);

      const profileUpload = permissionService.checkUploadPermission(
        ecommerceContext,
        EntityType.USER_PROFILE
      );
      expect(profileUpload.isAllowed).toBe(false);
    });
  });

  describe('Security Edge Cases', () => {
    it('should handle empty permissions arrays', () => {
      const context = {
        type: 'service' as const,
        id: 'test-service',
        serviceName: 'test-service',
        permissions: [],
      };

      const result = permissionService.checkPermission(context, 'upload:read');
      expect(result.isAllowed).toBe(false);
    });

    it('should handle null/undefined contexts gracefully', () => {
      expect(() => {
        permissionService.checkPermission(null as any, 'upload:read');
      }).toThrow();
    });

    it('should validate permission strings', () => {
      const context = {
        type: 'service' as const,
        id: 'test-service',
        serviceName: 'test-service',
        permissions: ['upload:read'],
      };

      // Test with invalid permission strings
      const invalidPermissions = ['', null, undefined, 123, {}, []];

      for (const permission of invalidPermissions) {
        expect(() => {
          permissionService.checkPermission(context, permission as any);
        }).not.toThrow(); // Should handle gracefully
      }
    });

    it('should prevent privilege escalation', () => {
      const userContext = {
        type: 'user' as const,
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: ['upload:read'],
      };

      // User should not be able to access admin functions
      const adminCheck = permissionService.checkPermission(
        userContext,
        'admin:all'
      );
      expect(adminCheck.isAllowed).toBe(false);

      // User should not be able to access other services' permissions
      const serviceCheck = permissionService.checkPermission(
        userContext,
        'service:auth'
      );
      expect(serviceCheck.isAllowed).toBe(false);
    });
  });
});
