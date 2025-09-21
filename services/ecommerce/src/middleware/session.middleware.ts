import { NextFunction, Request, Response } from 'express';
import { SessionData, SessionService } from '../services/session.service';

// Extend Request interface to include session
interface SessionRequest extends Request {
  session?: SessionData;
  sessionId?: string;
}

export class SessionMiddleware {
  constructor(private sessionService: SessionService) {}

  /**
   * Middleware to handle session management
   */
  handleSession = async (
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get session ID from header, cookie, or create new one
      let sessionId = this.extractSessionId(req);
      let session: SessionData | null = null;

      if (sessionId) {
        // Try to get existing session
        session = await this.sessionService.getSession(sessionId);
      }

      if (!session) {
        // Create new session
        const customerId = this.extractCustomerId(req);
        session = await this.sessionService.createSession(
          customerId || undefined
        );
        sessionId = session.sessionId;

        // Set session cookie
        this.setSessionCookie(res, sessionId);
      } else {
        // Extend existing session
        if (sessionId) {
          await this.sessionService.extendSession(sessionId);
        }
      }

      // Add session data to request
      req.session = session;
      req.sessionId = sessionId || undefined;

      next();
    } catch (error) {
      console.error('Session middleware error:', error);
      // Continue without session in case of error
      next();
    }
  };

  /**
   * Middleware to handle user authentication and cart merging
   */
  handleAuthentication = async (
    req: SessionRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const customerId = this.extractCustomerId(req);

      if (customerId && req.session && req.session.isAnonymous) {
        // User just authenticated, update session and prepare for cart merging
        const previousAnonymousCustomerId = req.session.customerId;

        const newSession = await this.sessionService.authenticateSession(
          req.session.sessionId,
          customerId
        );

        if (newSession) {
          req.session = newSession;

          // Store anonymous customer ID for potential cart merging
          if (
            previousAnonymousCustomerId &&
            previousAnonymousCustomerId.startsWith('anonymous_')
          ) {
            req.session.previousAnonymousCustomerId =
              previousAnonymousCustomerId;
          }

          // Update session cookie
          this.setSessionCookie(res, newSession.sessionId);

          // Add header to indicate authentication state change
          res.setHeader('X-Auth-State-Changed', 'true');
          res.setHeader(
            'X-Previous-Anonymous-Customer',
            previousAnonymousCustomerId || ''
          );
        }
      } else if (customerId && req.session && !req.session.isAnonymous) {
        // Already authenticated user, just extend session
        await this.sessionService.extendSession(req.session.sessionId);
      }

      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      next();
    }
  };

  /**
   * Extract session ID from request
   */
  private extractSessionId(req: Request): string | null {
    // Try header first (for API clients)
    const headerSessionId = req.headers['x-session-id'] as string;
    if (headerSessionId) {
      return headerSessionId;
    }

    // Try cookie (for web clients)
    const cookieSessionId = req.cookies?.sessionId;
    if (cookieSessionId) {
      return cookieSessionId;
    }

    return null;
  }

  /**
   * Extract customer ID from authenticated request
   */
  private extractCustomerId(req: Request): string | null {
    // This would typically come from JWT token or auth middleware
    const user = (req as any).user;
    return user?.id || user?.sub || null;
  }

  /**
   * Set session cookie
   */
  private setSessionCookie(res: Response, sessionId: string): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });

    // Also set in header for API clients
    res.setHeader('X-Session-Id', sessionId);
  }
}

// Create singleton instance
const sessionService = new SessionService();
export const sessionMiddleware = new SessionMiddleware(sessionService);

// Export individual middleware functions
export const handleSession = sessionMiddleware.handleSession;
export const handleAuthentication = sessionMiddleware.handleAuthentication;
