import { NextFunction, Request, Response } from 'express';
import { JWTService } from '../services/jwt.service';

const jwtService = JWTService.getInstance();

/**
 * Enhanced authentication middleware with comprehensive security
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Authorization header with Bearer token is required',
        code: 'MISSING_TOKEN',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate token format
    if (!/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(token)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT',
        timestamp: new Date().toISOString(),
      });
    }

    const decoded = jwtService.verifyToken(token);

    // Check if token needs refresh (using old key)
    if (decoded.needsRefresh) {
      res.setHeader('X-Token-Refresh-Required', 'true');
    }

    // Validate required claims
    if (!decoded.sub || !decoded.email) {
      return res.status(403).json({
        success: false,
        error: 'Invalid token claims',
        code: 'INVALID_CLAIMS',
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch current user data including verification status
    try {
      const user = await req.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          phone: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User account not found or inactive',
          code: 'USER_INACTIVE',
          timestamp: new Date().toISOString(),
        });
      }

      // Add verification status to decoded token data
      req.user = {
        ...decoded,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      };
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);

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
      }
    }

    return res.status(403).json({
      success: false,
      error: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Enhanced role-based authorization middleware
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource',
        code: 'AUTHENTICATION_REQUIRED',
        timestamp: new Date().toISOString(),
      });
    }

    const userRoles = req.user.roles || [];
    const activeRole = req.user.activeRole;

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    // Also check if the active role is one of the required roles
    const hasActiveRole = roles.includes(activeRole);

    if (!hasRequiredRole && !hasActiveRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${roles.join(', ')}. User roles: ${userRoles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        details: {
          requiredRoles: roles,
          userRoles: userRoles,
          activeRole: activeRole
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

/**
 * Admin-only access middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  return requireRole(['ADMIN'])(req, res, next);
};

/**
 * Active role validation middleware
 */
export const requireActiveRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
        timestamp: new Date().toISOString(),
      });
    }

    if (req.user.activeRole !== role) {
      return res.status(403).json({
        success: false,
        error: 'Active role mismatch',
        message: `This action requires active role: ${role}. Current active role: ${req.user.activeRole}`,
        code: 'ACTIVE_ROLE_MISMATCH',
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
  } catch (error) {
    // Log error but don't fail the request
    console.warn('Optional auth failed:', error);
  }

  next();
};

/**
 * Token validation middleware (for debugging/monitoring)
 */
export const validateTokenHealth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const tokenInfo = jwtService.getTokenInfo(token);
    if (tokenInfo) {
      // Add token health info to response headers (for debugging)
      res.setHeader('X-Token-Valid', jwtService.isTokenValid(token).toString());
      res.setHeader('X-Token-Blacklisted', tokenInfo.isBlacklisted.toString());
    }
  }

  next();
};