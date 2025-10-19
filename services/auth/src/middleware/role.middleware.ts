import { NextFunction, Request, Response } from 'express';
import { RoleName } from '../generated/prisma-client';

/**
 * Middleware to require specific roles for access
 */
export const requireRole = (allowedRoles: RoleName[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
      }

      const userId = req.user.sub;

      // Get user with roles
      const user = await req._prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user has any of the allowed roles
      const userRoles = user.roles.map((ur: any) => ur.role.name as RoleName);
      const hasRequiredRole = allowedRoles.some(role =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          message: `This endpoint requires one of the following roles: ${allowedRoles.join(', ')}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Add user roles to request for further use
      req.userRoles = userRoles;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Middleware to check if user has admin role
 */
export const requireAdmin = requireRole([RoleName.ADMIN]);

/**
 * Middleware to check if user has customer role
 */
export const requireCustomer = requireRole([RoleName.CUSTOMER]);

/**
 * Middleware to check if user has vendor role
 */
export const requireVendor = requireRole([RoleName.VENDOR]);

/**
 * Middleware to check if user has driver role
 */
export const requireDriver = requireRole([RoleName.DRIVER]);

/**
 * Middleware to check if user has host role
 */
export const requireHost = requireRole([RoleName.HOST]);

/**
 * Middleware to check if user has advertiser role
 */
export const requireAdvertiser = requireRole([RoleName.ADVERTISER]);
