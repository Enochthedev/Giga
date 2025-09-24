import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to require email verification for certain endpoints
 */
export const requireEmailVerification = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if user's email is verified
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: 'Email verification required',
        message: 'Please verify your email address to access this feature',
        code: 'EMAIL_VERIFICATION_REQUIRED',
        details: {
          email: req.user.email,
          verificationEndpoint: '/api/v1/auth/send-email-verification',
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Middleware to check email verification status and add warning if not verified
 */
export const checkEmailVerificationStatus = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next();
    }

    // Add verification status to response headers for client awareness
    if (!req.user.isEmailVerified) {
      res.setHeader('X-Email-Verification-Required', 'true');
      res.setHeader(
        'X-Email-Verification-Endpoint',
        '/api/v1/auth/send-email-verification'
      );
    }

    next();
  } catch (error) {
    console.error('Email verification status middleware error:', error);
    next(); // Don't block request for this middleware failure
  }
};
