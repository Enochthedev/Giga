import { beforeEach, describe, expect, it } from 'vitest';
import { AuthContext } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { AccessLevel, EntityType } from '../../types/upload.types';

describe('Access Control Tests', () => {
  let permissionService: PermissionService;

  beforeEach(() => {
    permissionService = PermissionService.getInstance();
  });

  describe('Service-to-Service Access Control', () => {
    it('should allow auth service to upload profile photos', () => {
      const authServiceContext: AuthContext = {
        type: 'service',
        id: 'auth-service',
        serviceName: 'auth-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        authServiceContext,
        EntityType.USER_PROFILE
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Service permission');
    });

    it('should allow ecommerce service to upload product images', () => {
      const ecommerceContext: AuthContext = {
        type: 'service',
        id: 'ecommerce-service',
        serviceName: 'ecommerce-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        ecommerceContext,
        EntityType.PRODUCT
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should deny auth service from uploading product images', () => {
      const authServiceContext: AuthContext = {
        type: 'service',
        id: 'auth-service',
        serviceName: 'auth-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        authServiceContext,
        EntityType.PRODUCT
      );
      expect(result.isAllowed).toBe(false);
    });

    it('should allow hotel service to upload property photos', () => {
      const hotelContext: AuthContext = {
        type: 'service',
        id: 'hotel-service',
        serviceName: 'hotel-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        hotelContext,
        EntityType.PROPERTY
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should allow taxi service to upload vehicle photos', () => {
      const taxiContext: AuthContext = {
        type: 'service',
        id: 'taxi-service',
        serviceName: 'taxi-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        taxiContext,
        EntityType.VEHICLE
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should allow payment service to upload documents', () => {
      const paymentContext: AuthContext = {
        type: 'service',
        id: 'payment-service',
        serviceName: 'payment-service',
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        paymentContext,
        EntityType.DOCUMENT
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should allow notification service to read files only', () => {
      const notificationContext: AuthContext = {
        type: 'service',
        id: 'notification-service',
        serviceName: 'notification-service',
        permissions: [],
      };

      const readResult = permissionService.checkPermission(
        notificationContext,
        'upload:read'
      );
      expect(readResult.isAllowed).toBe(true);

      const createResult = permissionService.checkPermission(
        notificationContext,
        'upload:create'
      );
      expect(createResult.isAllowed).toBe(false);
    });
  });

  describe('User Role-Based Access Control', () => {
    it('should allow regular users to upload profile photos', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        userContext,
        EntityType.USER_PROFILE
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should deny regular users from uploading product images', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        userContext,
        EntityType.PRODUCT
      );
      expect(result.isAllowed).toBe(false);
    });

    it('should allow vendors to upload product images and advertisements', () => {
      const vendorContext: AuthContext = {
        type: 'user',
        id: 'vendor-123',
        email: 'vendor@example.com',
        roles: ['VENDOR'],
        permissions: [],
      };

      const productResult = permissionService.checkUploadPermission(
        vendorContext,
        EntityType.PRODUCT
      );
      expect(productResult.isAllowed).toBe(true);

      const adResult = permissionService.checkUploadPermission(
        vendorContext,
        EntityType.ADVERTISEMENT
      );
      expect(adResult.isAllowed).toBe(true);
    });

    it('should allow hotel managers to upload property photos', () => {
      const hotelManagerContext: AuthContext = {
        type: 'user',
        id: 'manager-123',
        email: 'manager@hotel.com',
        roles: ['HOTEL_MANAGER'],
        permissions: [],
      };

      const result = permissionService.checkUploadPermission(
        hotelManagerContext,
        EntityType.PROPERTY
      );
      expect(result.isAllowed).toBe(true);
    });

    it('should allow drivers to upload vehicle photos', () => {
      const driverContext: AuthContext = {
        type: 'user',
        id: 'driver-123',
        email: 'driver@example.com',
        roles: ['DRIVER'],
        permissions: [],
      };

      const vehicleResult = permissionService.checkUploadPermission(
        driverContext,
        EntityType.VEHICLE
      );
      expect(vehicleResult.isAllowed).toBe(true);

      const profileResult = permissionService.checkUploadPermission(
        driverContext,
        EntityType.USER_PROFILE
      );
      expect(profileResult.isAllowed).toBe(true);
    });

    it('should allow admins to upload anything', () => {
      const adminContext: AuthContext = {
        type: 'user',
        id: 'admin-123',
        email: 'admin@example.com',
        roles: ['ADMIN'],
        permissions: [],
      };

      const entityTypes = Object.values(EntityType);
      for (const entityType of entityTypes) {
        const result = permissionService.checkUploadPermission(
          adminContext,
          entityType
        );
        expect(result.isAllowed).toBe(true);
        expect(result.reason).toBe('Admin access');
      }
    });
  });

  describe('File Access Control', () => {
    it('should allow anyone to access public files', () => {
      const contexts = [
        {
          type: 'user' as const,
          id: 'user-123',
          email: 'user@example.com',
          roles: ['USER'],
          permissions: [],
        },
        {
          type: 'service' as const,
          id: 'any-service',
          serviceName: 'any-service',
          permissions: [],
        },
      ];

      const publicResource = {
        entityType: EntityType.PRODUCT,
        entityId: 'product-123',
        accessLevel: AccessLevel.PUBLIC,
      };

      for (const context of contexts) {
        const result = permissionService.checkAccessPermission(
          context,
          publicResource
        );
        expect(result.isAllowed).toBe(true);
        expect(result.reason).toBe('Public resource');
      }
    });

    it('should allow owners to access their private files', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const privateResource = {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        accessLevel: AccessLevel.PRIVATE,
        ownerId: 'user-123',
      };

      const result = permissionService.checkAccessPermission(
        userContext,
        privateResource
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Resource owner');
    });

    it('should deny non-owners from accessing private files', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-456',
        email: 'user2@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const privateResource = {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        accessLevel: AccessLevel.PRIVATE,
        ownerId: 'user-123', // Different owner
      };

      const result = permissionService.checkAccessPermission(
        userContext,
        privateResource
      );
      expect(result.isAllowed).toBe(false);
    });

    it('should allow services with proper permissions to access private files', () => {
      const serviceContext: AuthContext = {
        type: 'service',
        id: 'auth-service',
        serviceName: 'auth-service',
        permissions: ['access:private'],
      };

      const privateResource = {
        entityType: EntityType.USER_PROFILE,
        entityId: 'profile-123',
        accessLevel: AccessLevel.PRIVATE,
        ownerId: 'user-123',
      };

      const result = permissionService.checkAccessPermission(
        serviceContext,
        privateResource
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Direct permission');
    });

    it('should handle restricted access properly', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: [],
      };

      const restrictedResource = {
        entityType: EntityType.DOCUMENT,
        entityId: 'doc-123',
        accessLevel: AccessLevel.RESTRICTED,
        ownerId: 'user-123',
      };

      const result = permissionService.checkAccessPermission(
        userContext,
        restrictedResource
      );
      expect(result.isAllowed).toBe(true);
      expect(result.reason).toBe('Resource owner');
    });
  });

  describe('Permission Inheritance and Wildcards', () => {
    it('should respect wildcard permissions', () => {
      const context: AuthContext = {
        type: 'service',
        id: 'admin-service',
        serviceName: 'admin-service',
        permissions: ['*'],
      };

      const permissions = [
        'upload:create',
        'upload:read',
        'upload:update',
        'upload:delete',
        'admin:all',
        'service:auth',
      ];

      for (const permission of permissions) {
        const result = permissionService.checkPermission(context, permission);
        expect(result.isAllowed).toBe(true);
        expect(result.reason).toBe('Wildcard permission');
      }
    });

    it('should respect upload wildcard permissions', () => {
      const context: AuthContext = {
        type: 'service',
        id: 'upload-service',
        serviceName: 'upload-service',
        permissions: ['upload:*'],
      };

      const uploadPermissions = [
        'upload:create',
        'upload:read',
        'upload:update',
        'upload:delete',
      ];

      for (const permission of uploadPermissions) {
        const result = permissionService.checkPermission(context, permission);
        expect(result.isAllowed).toBe(true);
        expect(result.reason).toBe('Wildcard permission');
      }

      // Should not allow non-upload permissions
      const nonUploadResult = permissionService.checkPermission(
        context,
        'admin:all'
      );
      expect(nonUploadResult.isAllowed).toBe(false);
    });

    it('should handle multiple roles correctly', () => {
      const context: AuthContext = {
        type: 'user',
        id: 'multi-role-user',
        email: 'user@example.com',
        roles: ['USER', 'VENDOR', 'DRIVER'],
        permissions: [],
      };

      // Should have permissions from all roles
      const profileResult = permissionService.checkUploadPermission(
        context,
        EntityType.USER_PROFILE
      );
      expect(profileResult.isAllowed).toBe(true);

      const productResult = permissionService.checkUploadPermission(
        context,
        EntityType.PRODUCT
      );
      expect(productResult.isAllowed).toBe(true);

      const vehicleResult = permissionService.checkUploadPermission(
        context,
        EntityType.VEHICLE
      );
      expect(vehicleResult.isAllowed).toBe(true);
    });
  });

  describe('Security Boundaries', () => {
    it('should prevent cross-service access without proper permissions', () => {
      const authServiceContext: AuthContext = {
        type: 'service',
        id: 'auth-service',
        serviceName: 'auth-service',
        permissions: [],
      };

      // Auth service should not be able to upload ecommerce-specific content
      const productResult = permissionService.checkUploadPermission(
        authServiceContext,
        EntityType.PRODUCT
      );
      expect(productResult.isAllowed).toBe(false);

      const adResult = permissionService.checkUploadPermission(
        authServiceContext,
        EntityType.ADVERTISEMENT
      );
      expect(adResult.isAllowed).toBe(false);
    });

    it('should prevent privilege escalation through role manipulation', () => {
      const userContext: AuthContext = {
        type: 'user',
        id: 'user-123',
        email: 'user@example.com',
        roles: ['USER'],
        permissions: ['upload:read'], // Only read permission
      };

      // User should not be able to perform admin actions
      const adminResult = permissionService.checkPermission(
        userContext,
        'admin:all'
      );
      expect(adminResult.isAllowed).toBe(false);

      // User should not be able to access service-specific permissions
      const serviceResult = permissionService.checkPermission(
        userContext,
        'service:auth'
      );
      expect(serviceResult.isAllowed).toBe(false);
    });

    it('should enforce strict entity type boundaries', () => {
      const hotelServiceContext: AuthContext = {
        type: 'service',
        id: 'hotel-service',
        serviceName: 'hotel-service',
        permissions: [],
      };

      // Hotel service should only access property-related uploads
      const propertyResult = permissionService.checkUploadPermission(
        hotelServiceContext,
        EntityType.PROPERTY
      );
      expect(propertyResult.isAllowed).toBe(true);

      const vehicleResult = permissionService.checkUploadPermission(
        hotelServiceContext,
        EntityType.VEHICLE
      );
      expect(vehicleResult.isAllowed).toBe(false);

      const productResult = permissionService.checkUploadPermission(
        hotelServiceContext,
        EntityType.PRODUCT
      );
      expect(productResult.isAllowed).toBe(false);
    });
  });
});
