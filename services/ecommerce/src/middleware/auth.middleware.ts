import { Request, Response, NextFunction } from 'express'
import { AuthClient } from '@giga/auth-sdk'

const authClient = new AuthClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
})

/**
 * Middleware to authenticate requests using Supabase Auth
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      })
      return
    }

    authClient.setTokens(token)
    const user = await authClient.getCurrentUser()
    
    // Attach user to request
    ;(req as any).user = user
    
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token',
    })
  }
}

/**
 * Middleware to require specific roles
 * @param roles - Array of role names that are allowed
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      })
      return
    }

    const hasRole = user.roles.some((role: string) => roles.includes(role))

    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required_roles: roles,
        user_roles: user.roles,
      })
      return
    }

    next()
  }
}

/**
 * Middleware to require a specific active role
 * @param role - The role name that must be active
 */
export function requireActiveRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      })
      return
    }

    if (user.active_role !== role) {
      res.status(403).json({
        success: false,
        error: `Must be in ${role} mode`,
        current_role: user.active_role,
        required_role: role,
      })
      return
    }

    next()
  }
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
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (token) {
      authClient.setTokens(token)
      const user = await authClient.getCurrentUser()
      ;(req as any).user = user
    }
    
    next()
  } catch (error) {
    // Silently fail for optional auth
    next()
  }
}
