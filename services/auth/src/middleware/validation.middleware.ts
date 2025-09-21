import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import {
  InputSanitizer,
  RequestValidator,
  secureEmailSchema,
  secureNameSchema,
  securePasswordSchema,
  securePhoneSchema
} from '../utils/security.utils';

// Enhanced validation schemas with comprehensive security
export const registerSchema = z.object({
  email: secureEmailSchema,
  password: securePasswordSchema,
  firstName: secureNameSchema,
  lastName: secureNameSchema,
  phone: securePhoneSchema,
  roles: z.array(z.enum(['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER']))
    .default(['CUSTOMER'])
    .refine((roles) => roles.length > 0, 'At least one role is required')
    .refine((roles) => roles.length <= 5, 'Too many roles specified'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).strict(); // Reject unknown properties

export const loginSchema = z.object({
  email: secureEmailSchema,
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password too long')
    .transform(InputSanitizer.sanitizeString),
}).strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required')
    .max(256, 'Invalid refresh token format')
    .regex(/^[a-f0-9]+$/, 'Invalid refresh token format'),
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .max(128, 'Current password too long')
    .transform(InputSanitizer.sanitizeString),
  newPassword: securePasswordSchema,
}).strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const switchRoleSchema = z.object({
  role: z.enum(['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER'], {
    errorMap: () => ({ message: 'Invalid role specified' })
  }),
}).strict();

export const updateProfileSchema = z.object({
  firstName: secureNameSchema.optional(),
  lastName: secureNameSchema.optional(),
  phone: securePhoneSchema,
  avatar: z.string()
    .url('Invalid avatar URL format')
    .max(500, 'Avatar URL too long')
    .optional()
    .transform((url) => url ? InputSanitizer.sanitizeString(url) : undefined),
}).strict()
  .refine((data) => {
    // At least one field must be provided for update
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

export const verifyEmailSchema = z.object({
  token: z.string()
    .min(1, 'Verification token is required')
    .max(128, 'Invalid token format')
    .regex(/^[a-f0-9]+$/, 'Invalid token format')
    .transform(InputSanitizer.sanitizeString),
}).strict();

export const resendEmailVerificationSchema = z.object({
  email: secureEmailSchema,
}).strict();

export const sendPhoneVerificationSchema = z.object({}).strict(); // No body needed, uses authenticated user's phone

export const verifyPhoneSchema = z.object({
  code: z.string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits')
    .transform(InputSanitizer.sanitizeString),
}).strict();

export const resendPhoneVerificationSchema = z.object({
  phone: securePhoneSchema,
}).strict();

// Profile-specific validation schemas
export const updateCustomerProfileSchema = z.object({
  preferences: z.record(z.any()).optional(),
}).strict();

export const updateVendorProfileSchema = z.object({
  businessName: z.string()
    .min(1, 'Business name is required')
    .max(100, 'Business name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  businessType: z.string()
    .min(1, 'Business type is required')
    .max(50, 'Business type too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  description: z.string()
    .max(1000, 'Description too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  logo: z.string()
    .url('Invalid logo URL format')
    .max(500, 'Logo URL too long')
    .optional()
    .transform((url) => url ? InputSanitizer.sanitizeString(url) : undefined),
  website: z.string()
    .url('Invalid website URL format')
    .max(500, 'Website URL too long')
    .optional()
    .transform((url) => url ? InputSanitizer.sanitizeString(url) : undefined),
  subscriptionTier: z.enum(['BASIC', 'PRO', 'ENTERPRISE'], {
    errorMap: () => ({ message: 'Invalid subscription tier' })
  }).optional(),
}).strict()
  .refine((data) => {
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

export const updateDriverProfileSchema = z.object({
  licenseNumber: z.string()
    .min(1, 'License number is required')
    .max(50, 'License number too long')
    .regex(/^[A-Z0-9-]+$/, 'Invalid license number format')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  vehicleInfo: z.object({
    make: z.string().min(1).max(50).optional(),
    model: z.string().min(1).max(50).optional(),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    color: z.string().min(1).max(30).optional(),
    licensePlate: z.string().min(1).max(20).optional(),
    type: z.enum(['CAR', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER']).optional(),
  }).optional(),
  isOnline: z.boolean().optional(),
  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().max(200).optional(),
  }).optional(),
  subscriptionTier: z.enum(['BASIC', 'PRO'], {
    errorMap: () => ({ message: 'Invalid subscription tier' })
  }).optional(),
}).strict()
  .refine((data) => {
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

export const updateHostProfileSchema = z.object({
  businessName: z.string()
    .min(1, 'Business name is required')
    .max(100, 'Business name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  description: z.string()
    .max(1000, 'Description too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  subscriptionTier: z.enum(['BASIC', 'PRO'], {
    errorMap: () => ({ message: 'Invalid subscription tier' })
  }).optional(),
  responseRate: z.number()
    .min(0, 'Response rate cannot be negative')
    .max(100, 'Response rate cannot exceed 100%')
    .optional(),
  responseTime: z.number()
    .int()
    .min(1, 'Response time must be at least 1 minute')
    .max(1440, 'Response time cannot exceed 24 hours')
    .optional(),
}).strict()
  .refine((data) => {
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

export const updateAdvertiserProfileSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  industry: z.string()
    .min(1, 'Industry is required')
    .max(50, 'Industry name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  website: z.string()
    .url('Invalid website URL format')
    .max(500, 'Website URL too long')
    .optional()
    .transform((url) => url ? InputSanitizer.sanitizeString(url) : undefined),
}).strict()
  .refine((data) => {
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

export const addAddressSchema = z.object({
  label: z.string()
    .min(1, 'Address label is required')
    .max(50, 'Address label too long')
    .transform(InputSanitizer.sanitizeString),
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address too long')
    .transform(InputSanitizer.sanitizeString),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City name too long')
    .transform(InputSanitizer.sanitizeString),
  country: z.string()
    .min(1, 'Country is required')
    .max(50, 'Country name too long')
    .transform(InputSanitizer.sanitizeString),
  isDefault: z.boolean().default(false),
}).strict();

export const updateAddressSchema = z.object({
  label: z.string()
    .min(1, 'Address label is required')
    .max(50, 'Address label too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  country: z.string()
    .min(1, 'Country is required')
    .max(50, 'Country name too long')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  isDefault: z.boolean().optional(),
}).strict()
  .refine((data) => {
    return Object.values(data).some(value => value !== undefined);
  }, {
    message: 'At least one field must be provided for update',
  });

// Enhanced profile management validation schemas
export const updateProfileVerificationSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required')
    .transform(InputSanitizer.sanitizeString),
  role: z.enum(['VENDOR', 'DRIVER', 'HOST', 'ADVERTISER'], {
    errorMap: () => ({ message: 'Invalid role for verification' })
  }),
  isVerified: z.boolean(),
}).strict();

export const updateProfileRatingSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required')
    .transform(InputSanitizer.sanitizeString)
    .optional(),
  role: z.enum(['VENDOR', 'DRIVER', 'HOST'], {
    errorMap: () => ({ message: 'Invalid role for rating update' })
  }),
  rating: z.number()
    .min(0, 'Rating cannot be negative')
    .max(5, 'Rating cannot exceed 5')
    .refine((val) => Number.isFinite(val), 'Rating must be a valid number'),
}).strict();

// Admin user management validation schemas
export const bulkUpdateUsersSchema = z.object({
  userIds: z.array(z.string().cuid('Invalid user ID format'))
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot update more than 100 users at once'),
  action: z.enum(['activate', 'deactivate', 'verify_email', 'verify_phone', 'update_fields'], {
    errorMap: () => ({ message: 'Invalid bulk action' })
  }),
  data: z.record(z.any()).optional(),
}).strict()
  .refine((data) => {
    if (data.action === 'update_fields' && !data.data) {
      return false;
    }
    return true;
  }, {
    message: 'data object is required for update_fields action',
    path: ['data'],
  });

export const assignUserRoleSchema = z.object({
  role: z.enum(['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER', 'ADMIN'], {
    errorMap: () => ({ message: 'Invalid role specified' })
  }),
}).strict();

export const removeUserRoleSchema = z.object({
  role: z.enum(['VENDOR', 'DRIVER', 'HOST', 'ADVERTISER', 'ADMIN'], {
    errorMap: () => ({ message: 'Invalid role specified' })
  }),
}).strict();

// Enhanced validation middleware with comprehensive security checks
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pre-validation security checks
      const sizeValidation = RequestValidator.validateRequestSize(req);
      if (!sizeValidation.isValid) {
        return res.status(413).json({
          success: false,
          error: 'Request too large',
          message: sizeValidation.error,
          code: 'REQUEST_TOO_LARGE',
          details: {
            maxSize: '1MB',
            received: req.headers['content-length'] || 'unknown'
          },
          timestamp: new Date().toISOString(),
        });
      }

      const contentTypeValidation = RequestValidator.validateContentType(req);
      if (!contentTypeValidation.isValid) {
        return res.status(415).json({
          success: false,
          error: 'Unsupported media type',
          message: contentTypeValidation.error,
          code: 'UNSUPPORTED_MEDIA_TYPE',
          details: {
            received: req.headers['content-type'] || 'none',
            expected: ['application/json']
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Additional security validations
      const securityValidation = RequestValidator.validateRequestSecurity(req);
      if (!securityValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Security validation failed',
          message: securityValidation.error,
          code: 'SECURITY_VALIDATION_FAILED',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate and sanitize request body
      const result = schema.parse(req.body);
      req.body = result; // Replace with validated and sanitized data

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Enhanced error formatting with detailed field information
        const fieldErrors: Record<string, string[]> = {};
        const generalErrors: string[] = [];
        const securityIssues: string[] = [];

        error.errors.forEach(err => {
          const fieldPath = err.path.join('.');
          const message = err.message;

          // Categorize security-related errors
          if (message.includes('security') || message.includes('strength') ||
            message.includes('sanitization') || message.includes('suspicious')) {
            securityIssues.push(`${fieldPath}: ${message}`);
          } else if (fieldPath) {
            if (!fieldErrors[fieldPath]) {
              fieldErrors[fieldPath] = [];
            }
            fieldErrors[fieldPath].push(message);
          } else {
            generalErrors.push(message);
          }
        });

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'The request contains invalid or missing data',
          code: 'VALIDATION_ERROR',
          details: {
            fields: fieldErrors,
            general: generalErrors.length > 0 ? generalErrors : undefined,
            security: securityIssues.length > 0 ? securityIssues : undefined,
            totalErrors: error.errors.length
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Handle other validation errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal validation error',
        code: 'VALIDATION_INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Security middleware for additional request validation
export const securityValidation = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for suspicious patterns in headers
    const userAgent = req.headers['user-agent'];
    if (!userAgent || userAgent.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request headers',
        code: 'INVALID_HEADERS',
        timestamp: new Date().toISOString(),
      });
    }

    // Check for SQL injection patterns in query parameters
    const queryString = JSON.stringify(req.query);
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bOR\b|\bAND\b).*[=<>]/i
    ];

    if (sqlPatterns.some(pattern => pattern.test(queryString))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters',
        code: 'SUSPICIOUS_REQUEST',
        timestamp: new Date().toISOString(),
      });
    }

    // Rate limiting headers validation
    const rateLimitHeaders = ['x-forwarded-for', 'x-real-ip'];
    for (const header of rateLimitHeaders) {
      const value = req.headers[header];
      if (value && typeof value === 'string' && value.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request headers',
          code: 'INVALID_HEADERS',
          timestamp: new Date().toISOString(),
        });
      }
    }

    next();
  } catch (error) {
    console.error('Security validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Security validation failed',
      code: 'SECURITY_VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};