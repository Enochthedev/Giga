import { createLogger } from '../lib/logger';
import { AccessLevel, EntityType } from '../types/upload.types';
import { AuthContext } from './auth.service';

const logger = createLogger('PermissionService');

export interface PermissionCheck {
  isAllowed: boolean;
  reason?: string;
  requiredPermissions?: string[];
}

export interface ResourceContext {
  entityType: EntityType;
  entityId: string;
  accessLevel: AccessLevel;
  ownerId?: string;
  organizationId?: string;
}

/**
 * Permission service for role-based access control
 */
export class PermissionService {
  private static instance: PermissionService;

  // Permission definitions
  private static readonly PERMISSIONS = {
    // Upload permissions
    UPLOAD_CREATE: 'upload:create',
    UPLOAD_READ: 'upload:read',
    UPLOAD_UPDATE: 'upload:update',
    UPLOAD_DELETE: 'upload:delete',
    UPLOAD_ADMIN: 'upload:admin',

    // Entity-specific permissions
    PROFILE_UPLOAD: 'upload:profile',
    PRODUCT_UPLOAD: 'upload:product',
    PROPERTY_UPLOAD: 'upload:property',
    VEHICLE_UPLOAD: 'upload:vehicle',
    DOCUMENT_UPLOAD: 'upload:document',
    ADVERTISEMENT_UPLOAD: 'upload:advertisement',

    // Access level permissions
    PUBLIC_ACCESS: 'access:public',
    PRIVATE_ACCESS: 'access:private',
    RESTRICTED_ACCESS: 'access:restricted',

    // Administrative permissions
    ADMIN_ALL: 'admin:all',
    ADMIN_UPLOAD: 'admin:upload',
    ADMIN_USERS: 'admin:users',
    ADMIN_SERVICES: 'admin:services',

    // Service permissions
    SERVICE_AUTH: 'service:auth',
    SERVICE_ECOMMERCE: 'service:ecommerce',
    SERVICE_HOTEL: 'service:hotel',
    SERVICE_TAXI: 'service:taxi',
    SERVICE_NOTIFICATION: 'service:notification',
    SERVICE_PAYMENT: 'service:payment',
  };

  // Role definitions with their permissions
  private static readonly ROLES = {
    ADMIN: [
      PermissionService.PERMISSIONS.ADMIN_ALL,
      PermissionService.PERMISSIONS.UPLOAD_ADMIN,
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.UPLOAD_DELETE,
    ],
    USER: [
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.PROFILE_UPLOAD,
      PermissionService.PERMISSIONS.PUBLIC_ACCESS,
      PermissionService.PERMISSIONS.PRIVATE_ACCESS,
    ],
    VENDOR: [
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.PRODUCT_UPLOAD,
      PermissionService.PERMISSIONS.ADVERTISEMENT_UPLOAD,
      PermissionService.PERMISSIONS.PUBLIC_ACCESS,
      PermissionService.PERMISSIONS.PRIVATE_ACCESS,
    ],
    HOTEL_MANAGER: [
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.PROPERTY_UPLOAD,
      PermissionService.PERMISSIONS.PUBLIC_ACCESS,
      PermissionService.PERMISSIONS.PRIVATE_ACCESS,
    ],
    DRIVER: [
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.VEHICLE_UPLOAD,
      PermissionService.PERMISSIONS.PROFILE_UPLOAD,
      PermissionService.PERMISSIONS.PUBLIC_ACCESS,
      PermissionService.PERMISSIONS.PRIVATE_ACCESS,
    ],
  };

  // Service permissions
  private static readonly SERVICE_PERMISSIONS = {
    'auth-service': [
      PermissionService.PERMISSIONS.SERVICE_AUTH,
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_DELETE,
      PermissionService.PERMISSIONS.PROFILE_UPLOAD,
    ],
    'ecommerce-service': [
      PermissionService.PERMISSIONS.SERVICE_ECOMMERCE,
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.UPLOAD_DELETE,
      PermissionService.PERMISSIONS.PRODUCT_UPLOAD,
      PermissionService.PERMISSIONS.ADVERTISEMENT_UPLOAD,
    ],
    'hotel-service': [
      PermissionService.PERMISSIONS.SERVICE_HOTEL,
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.UPLOAD_DELETE,
      PermissionService.PERMISSIONS.PROPERTY_UPLOAD,
    ],
    'taxi-service': [
      PermissionService.PERMISSIONS.SERVICE_TAXI,
      PermissionService.PERMISSIONS.UPLOAD_CREATE,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.UPLOAD_UPDATE,
      PermissionService.PERMISSIONS.UPLOAD_DELETE,
      PermissionService.PERMISSIONS.VEHICLE_UPLOAD,
    ],
    'notification-service': [
      PermissionService.PERMISSIONS.SERVICE_NOTIFICATION,
      PermissionService.PERMISSIONS.UPLOAD_READ,
    ],
    'payment-service': [
      PermissionService.PERMISSIONS.SERVICE_PAYMENT,
      PermissionService.PERMISSIONS.UPLOAD_READ,
      PermissionService.PERMISSIONS.DOCUMENT_UPLOAD,
    ],
  };

  private constructor() { }

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * Check if context has permission to perform action
   */
  public checkPermission(
    context: AuthContext,
    permission: string
  ): PermissionCheck {
    // Validate inputs
    if (!context || !permission || typeof permission !== 'string') {
      return { isAllowed: false, reason: 'Invalid permission or context' };
    }

    // Admin has all permissions
    if (this.isAdmin(context)) {
      return { isAllowed: true, reason: 'Admin access' };
    }

    // Check direct permission
    if (context.permissions.includes(permission)) {
      return { isAllowed: true, reason: 'Direct permission' };
    }

    // Check wildcard permissions
    if (context.permissions.includes('*')) {
      return { isAllowed: true, reason: 'Wildcard permission' };
    }

    // Check upload wildcard permissions (only for upload-related permissions)
    if (
      permission.startsWith('upload:') &&
      context.permissions.includes('upload:*')
    ) {
      return { isAllowed: true, reason: 'Wildcard permission' };
    }

    // Check role-based permissions for users
    if (context.type === 'user' && context.roles) {
      const rolePermissions = this.getRolePermissions(context.roles);
      if (rolePermissions.includes(permission)) {
        return { isAllowed: true, reason: 'Role-based permission' };
      }
    }

    // Check service-based permissions
    if (context.type === 'service' && context.serviceName) {
      const servicePermissions =
        (PermissionService.SERVICE_PERMISSIONS as any)[context.serviceName] || [];
      if (servicePermissions.includes(permission)) {
        return { isAllowed: true, reason: 'Service permission' };
      }
    }

    return {
      isAllowed: false,
      reason: 'Permission denied',
      requiredPermissions: [permission],
    };
  }

  /**
   * Check upload permission for specific entity type
   */
  public checkUploadPermission(
    context: AuthContext,
    entityType: EntityType
  ): PermissionCheck {
    // Admin has all permissions
    if (this.isAdmin(context)) {
      return { isAllowed: true, reason: 'Admin access' };
    }

    const entityPermissionMap = {
      [EntityType.USER_PROFILE]: PermissionService.PERMISSIONS.PROFILE_UPLOAD,
      [EntityType.PRODUCT]: PermissionService.PERMISSIONS.PRODUCT_UPLOAD,
      [EntityType.PROPERTY]: PermissionService.PERMISSIONS.PROPERTY_UPLOAD,
      [EntityType.VEHICLE]: PermissionService.PERMISSIONS.VEHICLE_UPLOAD,
      [EntityType.DOCUMENT]: PermissionService.PERMISSIONS.DOCUMENT_UPLOAD,
      [EntityType.ADVERTISEMENT]:
        PermissionService.PERMISSIONS.ADVERTISEMENT_UPLOAD,
    };

    const requiredPermission = entityPermissionMap[entityType];
    if (!requiredPermission) {
      return { isAllowed: false, reason: 'Unknown entity type' };
    }

    // Check entity-specific permission first
    const entityCheck = this.checkPermission(context, requiredPermission);
    if (entityCheck.isAllowed) {
      return entityCheck;
    }

    // Only allow general upload permission for admin or wildcard permissions
    if (
      context.permissions.includes('*') ||
      context.permissions.includes('upload:*')
    ) {
      return { isAllowed: true, reason: 'Wildcard permission' };
    }

    if (
      context.permissions.includes(PermissionService.PERMISSIONS.UPLOAD_CREATE)
    ) {
      // General upload permission only works for admins or specific cases
      if (this.isAdmin(context)) {
        return { isAllowed: true, reason: 'Admin access' };
      }
    }

    return {
      isAllowed: false,
      reason: 'Insufficient upload permissions',
      requiredPermissions: [requiredPermission],
    };
  }

  /**
   * Check access permission for resource
   */
  public checkAccessPermission(
    context: AuthContext,
    resource: ResourceContext
  ): PermissionCheck {
    // Public resources are accessible to everyone first
    if (resource.accessLevel === AccessLevel.PUBLIC) {
      return { isAllowed: true, reason: 'Public resource' };
    }

    // Admin has access to everything
    if (this.isAdmin(context)) {
      return { isAllowed: true, reason: 'Admin access' };
    }

    // Check if user owns the resource
    if (resource.ownerId && context.id === resource.ownerId) {
      return { isAllowed: true, reason: 'Resource owner' };
    }

    // For private and restricted resources, only allow access with explicit permissions for services
    // or if the user is the owner
    if (
      resource.accessLevel === AccessLevel.PRIVATE ||
      resource.accessLevel === AccessLevel.RESTRICTED
    ) {
      // Services with explicit permissions can access private/restricted files
      if (context.type === 'service') {
        const accessPermissionMap = {
          [AccessLevel.PRIVATE]: PermissionService.PERMISSIONS.PRIVATE_ACCESS,
          [AccessLevel.RESTRICTED]:
            PermissionService.PERMISSIONS.RESTRICTED_ACCESS,
        };

        const requiredPermission = accessPermissionMap[resource.accessLevel];
        if (requiredPermission) {
          const accessCheck = this.checkPermission(context, requiredPermission);
          if (accessCheck.isAllowed) {
            return accessCheck;
          }
        }
      }
    }

    // For private and restricted resources, don't allow general read permission
    // Only explicit ownership or service permissions should grant access
    if (
      resource.accessLevel === AccessLevel.PRIVATE ||
      resource.accessLevel === AccessLevel.RESTRICTED
    ) {
      return {
        isAllowed: false,
        reason: 'Insufficient access permissions',
        requiredPermissions: [
          'Resource ownership or explicit service permission',
        ],
      };
    }

    // For other access levels, check general read permission
    const readCheck = this.checkPermission(
      context,
      PermissionService.PERMISSIONS.UPLOAD_READ
    );
    if (readCheck.isAllowed) {
      return readCheck;
    }

    return {
      isAllowed: false,
      reason: 'Insufficient access permissions',
      requiredPermissions: [PermissionService.PERMISSIONS.UPLOAD_READ],
    };
  }

  /**
   * Check if context is admin
   */
  public isAdmin(context: AuthContext): boolean {
    if (context.permissions.includes(PermissionService.PERMISSIONS.ADMIN_ALL)) {
      return true;
    }

    if (context.type === 'user' && context.roles?.includes('ADMIN')) {
      return true;
    }

    return false;
  }

  /**
   * Get permissions for roles
   */
  private getRolePermissions(roles: string[]): string[] {
    const permissions = new Set<string>();

    for (const role of roles) {
      const rolePermissions =
        PermissionService.ROLES[role as keyof typeof PermissionService.ROLES] ||
        [];
      rolePermissions.forEach(permission => permissions.add(permission));
    }

    return Array.from(permissions);
  }

  /**
   * Get all available permissions
   */
  public getAvailablePermissions(): Record<string, string> {
    return PermissionService.PERMISSIONS;
  }

  /**
   * Get permissions for service
   */
  public getServicePermissions(serviceName: string): string[] {
    return (PermissionService.SERVICE_PERMISSIONS as any)[serviceName] || [];
  }

  /**
   * Check file access permissions
   */
  public async checkFileAccess(
    fileMetadata: unknown,
    userId: string,
    operation: string = 'read'
  ): Promise<boolean> {
    try {
      const metadata = fileMetadata as any;

      // Public files are accessible to everyone
      if (metadata.accessLevel === AccessLevel.PUBLIC) {
        return true;
      }

      // File owner always has access
      if (metadata.uploadedBy === userId) {
        return true;
      }

      // For private files, check specific permissions
      const context: AuthContext = {
        type: 'user',
        id: userId,
        serviceName: 'upload-service',
        permissions: [], // Add default empty permissions
      };

      const resource: ResourceContext = {
        entityType: metadata.entityType,
        entityId: metadata.entityId,
        accessLevel: metadata.accessLevel,
        ownerId: metadata.uploadedBy,
      };

      const permission = `file:${operation}`;
      const result = await this.checkPermission(context, permission);

      return result.isAllowed;
    } catch (error) {
      logger.error('Error checking file access', { error, fileId: (fileMetadata as any).id, userId });
      return false;
    }
  }

  /**
   * Log permission check for audit
   */
  public logPermissionCheck(
    context: AuthContext,
    permission: string,
    result: PermissionCheck,
    resource?: ResourceContext
  ): void {
    logger.info('Permission check', {
      contextType: context.type,
      contextId: context.id,
      serviceName: context.serviceName,
      permission,
      result: result.isAllowed,
      reason: result.reason,
      resource: resource
        ? {
          entityType: resource.entityType,
          entityId: resource.entityId,
          accessLevel: resource.accessLevel,
        }
        : undefined,
    });
  }
}
