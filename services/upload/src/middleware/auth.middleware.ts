import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../lib/logger';
import { AuthContext, AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { AccessLevel, EntityType } from '../types/upload.types';
import { ErrorUtils } from '../utils/error-utils';

const logger = createLogger('AuthMiddleware');
const authService = AuthService.getInstance();
const permissionService = PermissionService.getInstance();

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
  // Legacy support - will be deprecated
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
  service?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

/**
 * Enhanced authentication middleware for service-to-service and user authentication
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = ErrorUtils.createPermissionError(
        'upload service',
        'access'
      );
      return res.status(401).json({
        ...ErrorUtils.formatErrorResponse(error),
        code: 'MISSING_AUTH_HEADER',
        timestamp: new Date().toISOString(),
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      const error = ErrorUtils.createPermissionError(
        'upload service',
        'access'
      );
      return res.status(401).json({
        ...ErrorUtils.formatErrorResponse(error),
        code: 'INVALID_AUTH_FORMAT',
        message: 'Authorization header must use Bearer token format',
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token || token.trim() === '') {
      const error = ErrorUtils.createPermissionError(
        'upload service',
        'access'
      );
      return res.status(401).json({
        ...ErrorUtils.formatErrorResponse(error),
        code: 'EMPTY_TOKEN',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate token with auth service
    const authContext = await authService.validateToken(token);
    req.auth = authContext;

    // Set legacy properties for backward compatibility
    if (authContext.type === 'service') {
      req.service = {
        id: authContext.id,
        name: authContext.serviceName || 'unknown',
        permissions: authContext.permissions,
      };
    } else if (authContext.type === 'user') {
      req.user = {
        id: authContext.id,
        role: authContext.roles?.[0] || 'USER',
        permissions: authContext.permissions,
      };
    }

    logger.info('Authentication successful', {
      type: authContext.type,
      id: authContext.id,
      serviceName: authContext.serviceName,
      permissions: authContext.permissions.length,
    });

    next();
  } catch (error) {
    const err = error as any;
    logger.error('Authentication failed', { error: err.message });

    let errorCode = 'AUTHENTICATION_FAILED';
    let errorMessage = 'Authentication failed';

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Token has expired';
      } else if (error.message.includes('revoked')) {
        errorCode = 'TOKEN_REVOKED';
        errorMessage = 'Token has been revoked';
      } else if (error.message.includes('Invalid token')) {
        errorCode = 'INVALID_TOKEN';
        errorMessage = 'Invalid token';
      } else if (error.message.includes('malformed')) {
        errorCode = 'MALFORMED_TOKEN';
        errorMessage = 'Malformed token';
      }
    }

    const uploadError = ErrorUtils.createPermissionError(
      'upload service',
      'access'
    );
    res.status(401).json({
      ...ErrorUtils.formatErrorResponse(uploadError),
      code: errorCode,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Enhanced authorization middleware to check permissions
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        const error = ErrorUtils.createPermissionError('resource', permission);
        return res.status(401).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'NOT_AUTHENTICATED',
          message: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
      }

      const permissionCheck = permissionService.checkPermission(
        req.auth,
        permission
      );

      // Log permission check for audit
      permissionService.logPermissionCheck(
        req.auth,
        permission,
        permissionCheck
      );

      if (!permissionCheck.isAllowed) {
        const error = ErrorUtils.createPermissionError('resource', permission);
        return res.status(403).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'INSUFFICIENT_PERMISSIONS',
          message: permissionCheck.reason || 'Permission denied',
          requiredPermissions: permissionCheck.requiredPermissions,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      logger.error('Authorization error', error);
      const uploadError = ErrorUtils.createPermissionError(
        'resource',
        permission
      );
      res.status(500).json({
        ...ErrorUtils.formatErrorResponse(uploadError),
        code: 'AUTHORIZATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Check upload permission for specific entity type
 */
export function requireUploadPermission(entityType: EntityType) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        const error = ErrorUtils.createPermissionError('upload', 'create');
        return res.status(401).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'NOT_AUTHENTICATED',
          timestamp: new Date().toISOString(),
        });
      }

      const permissionCheck = permissionService.checkUploadPermission(
        req.auth,
        entityType
      );

      // Log permission check for audit
      permissionService.logPermissionCheck(
        req.auth,
        `upload:${entityType}`,
        permissionCheck
      );

      if (!permissionCheck.isAllowed) {
        const error = ErrorUtils.createPermissionError('upload', entityType);
        return res.status(403).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'INSUFFICIENT_UPLOAD_PERMISSIONS',
          message: permissionCheck.reason || 'Upload permission denied',
          requiredPermissions: permissionCheck.requiredPermissions,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      logger.error('Upload authorization error', error);
      const uploadError = ErrorUtils.createPermissionError(
        'upload',
        entityType
      );
      res.status(500).json({
        ...ErrorUtils.formatErrorResponse(uploadError),
        code: 'UPLOAD_AUTHORIZATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Check access permission for resource
 */
export function requireAccessPermission(
  accessLevel: AccessLevel,
  ownerId?: string
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        const error = ErrorUtils.createPermissionError('resource', 'access');
        return res.status(401).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'NOT_AUTHENTICATED',
          timestamp: new Date().toISOString(),
        });
      }

      const resourceContext = {
        entityType: EntityType.DOCUMENT, // Default, should be overridden
        entityId: req.params.id || 'unknown',
        accessLevel,
        ownerId,
      };

      const permissionCheck = permissionService.checkAccessPermission(
        req.auth,
        resourceContext
      );

      // Log permission check for audit
      permissionService.logPermissionCheck(
        req.auth,
        `access:${accessLevel}`,
        permissionCheck,
        resourceContext
      );

      if (!permissionCheck.isAllowed) {
        const error = ErrorUtils.createPermissionError('resource', 'access');
        return res.status(403).json({
          ...ErrorUtils.formatErrorResponse(error),
          code: 'INSUFFICIENT_ACCESS_PERMISSIONS',
          message: permissionCheck.reason || 'Access denied',
          requiredPermissions: permissionCheck.requiredPermissions,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      logger.error('Access authorization error', error);
      const uploadError = ErrorUtils.createPermissionError(
        'resource',
        'access'
      );
      res.status(500).json({
        ...ErrorUtils.formatErrorResponse(uploadError),
        code: 'ACCESS_AUTHORIZATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Require admin role
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.auth) {
      const error = ErrorUtils.createPermissionError('admin', 'access');
      return res.status(401).json({
        ...ErrorUtils.formatErrorResponse(error),
        code: 'NOT_AUTHENTICATED',
        timestamp: new Date().toISOString(),
      });
    }

    if (!permissionService.isAdmin(req.auth)) {
      const error = ErrorUtils.createPermissionError('admin', 'access');
      return res.status(403).json({
        ...ErrorUtils.formatErrorResponse(error),
        code: 'ADMIN_REQUIRED',
        message: 'Administrator privileges required',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    logger.error('Admin authorization error', error);
    const uploadError = ErrorUtils.createPermissionError('admin', 'access');
    res.status(500).json({
      ...ErrorUtils.formatErrorResponse(uploadError),
      code: 'ADMIN_AUTHORIZATION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Optional authentication middleware
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // If auth header is present, validate it
    return authenticate(req, res, next);
  } else {
    // If no auth header, continue without authentication
    next();
  }
}

// Legacy middleware for backward compatibility
export const authenticateService = authenticate;
export const authMiddleware = authenticate;
