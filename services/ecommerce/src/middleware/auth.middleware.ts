import { NextFunction, Request, Response } from 'express';
import { HttpAuthServiceClient } from '../clients/auth.client';

// Extend Request interface for user properties
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    sub: string;
    email: string;
    roles: string[];
    activeRole: string;
    vendorId?: string;
  };
}

// Initialize auth service client
const authServiceClient = new HttpAuthServiceClient(
  process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
);

/**
 * Authentication middleware that validates JWT tokens
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication token required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Validate token with auth service
      const userInfo = await authServiceClient.validateToken(token);

      // Add user info to request
      req.user = {
        id: userInfo.id,
        sub: userInfo.id,
        email: userInfo.email,
        roles: [userInfo.role],
        activeRole: userInfo.role,
        vendorId: userInfo.vendorId,
      };

      next();
    } catch (authError) {
      console.error('Token validation failed:', authError);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        timestamp: new Date().toISOString(),
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication service error',
      timestamp: new Date().toISOString(),
    });
    return;
  }
};

/**
 * Optional authentication middleware that doesn't fail if no token is provided
 */
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const userInfo = await authServiceClient.validateToken(token);

      req.user = {
        id: userInfo.id,
        sub: userInfo.id,
        email: userInfo.email,
        roles: [userInfo.role],
        activeRole: userInfo.role,
        vendorId: userInfo.vendorId,
      };
    } catch (authError) {
      // Token validation failed, but continue without user info
      console.warn('Optional auth failed:', authError);
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue without user info on error
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const userRole = req.user.activeRole;
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Vendor authorization middleware
 */
export const requireVendor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (!req.user.vendorId) {
    res.status(403).json({
      success: false,
      error: 'Vendor access required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};

/**
 * Admin authorization middleware
 */
export const requireAdmin = requireRole(['ADMIN']);

/**
 * Customer authorization middleware
 */
export const requireCustomer = requireRole(['CUSTOMER', 'VENDOR', 'ADMIN']);
