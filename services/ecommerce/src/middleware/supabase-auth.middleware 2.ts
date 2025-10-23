import {
  UserProfile,
  createGigaSupabaseClient,
} from '@platform/supabase-client';
import { NextFunction, Request, Response } from 'express';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

export interface AuthOptions {
  requiredRole?: string;
  requiredPermissions?: string[];
  optional?: boolean;
}

export const supabaseAuthMiddleware = (options: AuthOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        if (options.optional) {
          return next();
        }
        return res.status(401).json({
          success: false,
          error: 'No authorization token provided',
        });
      }

      const supabase = createGigaSupabaseClient({
        url: process.env.SUPABASE_URL!,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      });

      const user = await supabase.verifyToken(token);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'User account is not active',
        });
      }

      // Check role requirements
      if (
        options.requiredRole &&
        user.role !== options.requiredRole &&
        user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          error: `Required role: ${options.requiredRole}`,
        });
      }

      // Check specific permissions
      if (
        options.requiredPermissions &&
        options.requiredPermissions.length > 0
      ) {
        const hasPermissions = hasRequiredPermissions(
          user.role,
          options.requiredPermissions
        );

        if (!hasPermissions) {
          return res.status(403).json({
            success: false,
            error: 'Insufficient permissions',
          });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authentication service error',
      });
    }
  };
};

function hasRequiredPermissions(
  userRole: string,
  requiredPermissions: string[]
): boolean {
  // Admin has all permissions
  if (userRole === 'admin') {
    return true;
  }

  // Define role-based permissions
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    merchant: [
      'manage_products',
      'view_orders',
      'manage_inventory',
      'view_analytics',
      'manage_promotions',
      'manage_shipping',
    ],
    user: [
      'view_products',
      'place_orders',
      'view_own_orders',
      'manage_cart',
      'view_promotions',
    ],
  };

  const userPermissions = rolePermissions[userRole] || [];

  return requiredPermissions.every(
    permission =>
      userPermissions.includes(permission) || userPermissions.includes('*')
  );
}

// Convenience middleware functions
export const requireAuth = supabaseAuthMiddleware();
export const requireMerchant = supabaseAuthMiddleware({
  requiredRole: 'merchant',
});
export const requireAdmin = supabaseAuthMiddleware({ requiredRole: 'admin' });
export const optionalAuth = supabaseAuthMiddleware({ optional: true });
