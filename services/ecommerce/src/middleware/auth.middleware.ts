import { AuthClient } from '@giga/auth-sdk';
import { NextFunction, Request, Response } from 'express';

// Extend Express Request type to include user
// This matches the AuthUser type from @giga/auth-sdk
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
        active_role: string;
        profile: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          avatar?: string;
          is_phone_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        // Note: vendorId should be fetched from a vendor table if needed
        // It's not part of the core auth user object
      };
    }
  }
}

const authClient = new AuthClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
});

/**
 * Middleware to authenticate requests using Supabase Auth
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      });
      return;
    }

    authClient.setTokens(token);
    const user = await authClient.getCurrentUser();

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token',
    });
  }
}

// Alias for consistency with existing code
export const authMiddleware = authenticate;

/**
 * Middleware to require specific roles
 * @param roles - Array of role names that are allowed
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const hasRole = user.roles.some((role: string) => roles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required_roles: roles,
        user_roles: user.roles,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to require a specific active role
 * @param role - The role name that must be active
 */
export function requireActiveRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (user.active_role !== role) {
      res.status(403).json({
        success: false,
        error: `Must be in ${role} mode`,
        current_role: user.active_role,
        required_role: role,
      });
      return;
    }

    next();
  };
}

/**
 * Optional authentication - attaches user if token is present but doesn't fail if missing
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      authClient.setTokens(token);
      const user = await authClient.getCurrentUser();
      req.user = user;
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}

// Convenience middleware for common role requirements
export const requireVendor = requireActiveRole('vendor');
export const requireAdmin = requireActiveRole('admin');
export const requireCustomer = requireActiveRole('customer');
