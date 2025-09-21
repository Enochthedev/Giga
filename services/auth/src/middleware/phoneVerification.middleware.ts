import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to require phone verification for certain endpoints
 */
export const requirePhoneVerification = (
  req: Request,
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

    // Check if user's phone is verified
    if (!req.user.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        error: 'Phone verification required',
        message: 'Please verify your phone number to access this feature',
        code: 'PHONE_VERIFICATION_REQUIRED',
        details: {
          phone: req.user.phone,
          verificationEndpoint: '/api/v1/auth/send-phone-verification',
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Phone verification middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Middleware to check phone verification status and add warning if not verified
 */
export const checkPhoneVerificationStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next();
    }

    // Add verification status to response headers for client awareness
    if (!req.user.isPhoneVerified && req.user.phone) {
      res.setHeader('X-Phone-Verification-Required', 'true');
      res.setHeader(
        'X-Phone-Verification-Endpoint',
        '/api/v1/auth/send-phone-verification'
      );
    }

    next();
  } catch (error) {
    console.error('Phone verification status middleware error:', error);
    next(); // Don't block request for this middleware failure
  }
};

/**
 * Middleware to require phone number to be set before verification
 */
export const requirePhoneNumber = (
  req: Request,
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

    // Check if user has a phone number set
    if (!req.user.phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number required',
        message:
          'Please add a phone number to your profile before requesting verification',
        code: 'PHONE_NUMBER_REQUIRED',
        details: {
          updateProfileEndpoint: '/api/v1/auth/profile',
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    console.error('Phone number requirement middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};
