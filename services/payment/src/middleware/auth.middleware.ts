import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../lib/logger';
import { authService } from '../services/auth.service';
import { pciComplianceService } from '../services/pci-compliance.service';
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../utils/errors';

// Extend Request interface to include user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
        permissions: string[];
        sessionId: string;
        isServiceAccount?: boolean;
      };
      apiKey?: {
        id: string;
        name: string;
        permissions: string[];
        serviceId: string;
      };
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  sessionId: string;
  iat: number;
  exp: number;
}

export interface APIKeyPayload {
  keyId: string;
  name: string;
  permissions: string[];
  serviceId: string;
  iat: number;
  exp?: number;
}

/**
 * Middleware to authenticate JWT tokens from Auth Service
 */
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Validate token with Auth Service
    const isValid = await authService.validateToken(token);
    if (!isValid) {
      throw new AuthenticationError('Token validation failed');
    }

    // Set user context
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
      sessionId: decoded.sessionId,
    };

    // Log authentication event
    await pciComplianceService.logAuditEvent({
      eventType: 'AUTHENTICATION',
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: 'jwt_auth',
      severity: 'low',
      success: true,
      details: {
        authMethod: 'jwt',
        roles: decoded.roles,
      },
    });

    next();
  } catch (error) {
    await pciComplianceService.logAuditEvent({
      eventType: 'AUTHENTICATION',
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: 'jwt_auth',
      severity: 'medium',
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Authentication failed',
    });

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token',
        },
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired',
        },
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Authentication failed',
      },
    });
  }
};

/**
 * Middleware to authenticate API keys for service-to-service communication
 */
export const authenticateAPIKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new AuthenticationError('Missing API key');
    }

    // Validate API key
    const keyData = await authService.validateAPIKey(apiKey);
    if (!keyData) {
      throw new AuthenticationError('Invalid API key');
    }

    // Set API key context
    req.apiKey = {
      id: keyData.id,
      name: keyData.name,
      permissions: keyData.permissions,
      serviceId: keyData.serviceId,
    };

    // Log API key authentication
    await pciComplianceService.logAuditEvent({
      eventType: 'AUTHENTICATION',
      userId: keyData.serviceId,
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: 'api_key_auth',
      severity: 'low',
      success: true,
      details: {
        authMethod: 'api_key',
        keyId: keyData.id,
        serviceName: keyData.name,
      },
    });

    next();
  } catch (error) {
    await pciComplianceService.logAuditEvent({
      eventType: 'AUTHENTICATION',
      ipAddress: getClientIpAddress(req),
      userAgent: req.get('User-Agent'),
      resource: req.path,
      action: 'api_key_auth',
      severity: 'medium',
      success: false,
      errorMessage:
        error instanceof Error
          ? error.message
          : 'API key authentication failed',
    });

    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid or missing API key',
      },
    });
  }
};

/**
 * Middleware that accepts either JWT or API key authentication
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const hasJWT = req.headers.authorization?.startsWith('Bearer ');
  const hasAPIKey = !!req.headers['x-api-key'];

  if (hasJWT) {
    return authenticateJWT(req, res, next);
  } else if (hasAPIKey) {
    return authenticateAPIKey(req, res, next);
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message:
          'Authentication required. Provide either Bearer token or API key.',
      },
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (requiredRoles: string | string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user && !req.apiKey) {
        throw new AuthenticationError('Authentication required');
      }

      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      let hasRole = false;

      if (req.user) {
        hasRole = roles.some(role => req.user!.roles.includes(role));
      } else if (req.apiKey) {
        // Service accounts have implicit admin role for their operations
        hasRole = roles.includes('service') || roles.includes('admin');
      }

      if (!hasRole) {
        await pciComplianceService.logAuditEvent({
          eventType: 'AUTHORIZATION',
          userId: req.user?.id || req.apiKey?.serviceId,
          sessionId: req.user?.sessionId,
          ipAddress: getClientIpAddress(req),
          userAgent: req.get('User-Agent'),
          resource: req.path,
          action: 'role_check',
          severity: 'medium',
          success: false,
          details: {
            requiredRoles: roles,
            userRoles: req.user?.roles || [],
            isServiceAccount: !!req.apiKey,
          },
        });

        throw new AuthorizationError(
          `Insufficient permissions. Required roles: ${roles.join(', ')}`
        );
      }

      // Log successful authorization
      await pciComplianceService.logAuditEvent({
        eventType: 'AUTHORIZATION',
        userId: req.user?.id || req.apiKey?.serviceId,
        sessionId: req.user?.sessionId,
        ipAddress: getClientIpAddress(req),
        userAgent: req.get('User-Agent'),
        resource: req.path,
        action: 'role_check',
        severity: 'low',
        success: true,
        details: {
          requiredRoles: roles,
          userRoles: req.user?.roles || [],
          isServiceAccount: !!req.apiKey,
        },
      });

      next();
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Authorization check failed',
        },
      });
    }
  };
};

/**
 * Permission-based authorization middleware
 */
export const requirePermission = (requiredPermissions: string | string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user && !req.apiKey) {
        throw new AuthenticationError('Authentication required');
      }

      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      let hasPermission = false;

      if (req.user) {
        hasPermission = permissions.some(permission =>
          req.user!.permissions.includes(permission)
        );
      } else if (req.apiKey) {
        hasPermission = permissions.some(permission =>
          req.apiKey!.permissions.includes(permission)
        );
      }

      if (!hasPermission) {
        await pciComplianceService.logAuditEvent({
          eventType: 'AUTHORIZATION',
          userId: req.user?.id || req.apiKey?.serviceId,
          sessionId: req.user?.sessionId,
          ipAddress: getClientIpAddress(req),
          userAgent: req.get('User-Agent'),
          resource: req.path,
          action: 'permission_check',
          severity: 'medium',
          success: false,
          details: {
            requiredPermissions: permissions,
            userPermissions:
              req.user?.permissions || req.apiKey?.permissions || [],
            isServiceAccount: !!req.apiKey,
          },
        });

        throw new AuthorizationError(
          `Insufficient permissions. Required: ${permissions.join(', ')}`
        );
      }

      // Log successful authorization
      await pciComplianceService.logAuditEvent({
        eventType: 'AUTHORIZATION',
        userId: req.user?.id || req.apiKey?.serviceId,
        sessionId: req.user?.sessionId,
        ipAddress: getClientIpAddress(req),
        userAgent: req.get('User-Agent'),
        resource: req.path,
        action: 'permission_check',
        severity: 'low',
        success: true,
        details: {
          requiredPermissions: permissions,
          userPermissions:
            req.user?.permissions || req.apiKey?.permissions || [],
          isServiceAccount: !!req.apiKey,
        },
      });

      next();
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Permission check failed',
        },
      });
    }
  };
};

/**
 * Resource ownership authorization middleware
 */
export const requireOwnership = (resourceIdParam: string = 'id') => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError(
          'User authentication required for ownership check'
        );
      }

      const resourceId = req.params[resourceIdParam];
      if (!resourceId) {
        throw new ValidationError(
          `Resource ID parameter '${resourceIdParam}' is required`
        );
      }

      // Check if user owns the resource or has admin role
      const isOwner = await authService.checkResourceOwnership(
        req.user.id,
        resourceId,
        req.path
      );
      const isAdmin =
        req.user.roles.includes('admin') ||
        req.user.roles.includes('super_admin');

      if (!isOwner && !isAdmin) {
        await pciComplianceService.logAuditEvent({
          eventType: 'AUTHORIZATION',
          userId: req.user.id,
          sessionId: req.user.sessionId,
          ipAddress: getClientIpAddress(req),
          userAgent: req.get('User-Agent'),
          resource: req.path,
          action: 'ownership_check',
          severity: 'medium',
          success: false,
          details: {
            resourceId,
            resourceType: req.path.split('/')[3], // Extract resource type from path
          },
        });

        throw new AuthorizationError(
          'Access denied. You can only access your own resources.'
        );
      }

      next();
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError ||
        error instanceof ValidationError
      ) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'OWNERSHIP_CHECK_ERROR',
          message: 'Ownership verification failed',
        },
      });
    }
  };
};

/**
 * Rate limiting middleware for authentication attempts
 */
export const authRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIp = getClientIpAddress(req);
    const isAllowed = await authService.checkAuthRateLimit(clientIp);

    if (!isAllowed) {
      await pciComplianceService.logAuditEvent({
        eventType: 'RATE_LIMIT',
        ipAddress: clientIp,
        userAgent: req.get('User-Agent'),
        resource: req.path,
        action: 'auth_rate_limit',
        severity: 'medium',
        success: false,
        details: {
          reason: 'Too many authentication attempts',
        },
      });

      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many authentication attempts. Please try again later.',
        },
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Auth rate limit check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    next(); // Continue on rate limit check failure
  }
};

// Helper functions

/**
 * Get client IP address from request
 */
function getClientIpAddress(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Common permission constants
 */
export const PERMISSIONS = {
  // Payment operations
  PROCESS_PAYMENTS: 'payments:process',
  VIEW_PAYMENTS: 'payments:view',
  REFUND_PAYMENTS: 'payments:refund',
  CANCEL_PAYMENTS: 'payments:cancel',

  // Payment method operations
  MANAGE_PAYMENT_METHODS: 'payment_methods:manage',
  VIEW_PAYMENT_METHODS: 'payment_methods:view',
  DELETE_PAYMENT_METHODS: 'payment_methods:delete',

  // Subscription operations
  MANAGE_SUBSCRIPTIONS: 'subscriptions:manage',
  VIEW_SUBSCRIPTIONS: 'subscriptions:view',
  CANCEL_SUBSCRIPTIONS: 'subscriptions:cancel',

  // Administrative operations
  VIEW_ANALYTICS: 'analytics:view',
  MANAGE_GATEWAYS: 'gateways:manage',
  VIEW_AUDIT_LOGS: 'audit:view',
  MANAGE_COMPLIANCE: 'compliance:manage',

  // Webhook operations
  MANAGE_WEBHOOKS: 'webhooks:manage',
  VIEW_WEBHOOKS: 'webhooks:view',
} as const;

/**
 * Common role constants
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  FINANCE_MANAGER: 'finance_manager',
  CUSTOMER_SERVICE: 'customer_service',
  DEVELOPER: 'developer',
  USER: 'user',
  SERVICE: 'service',
} as const;
