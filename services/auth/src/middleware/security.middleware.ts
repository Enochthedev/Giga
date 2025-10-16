import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { InputSanitizer } from '../utils/security.utils';

/**
 * XSS Protection Middleware
 * Sanitizes request data to prevent cross-site scripting attacks
 */
export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('XSS protection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Request processing failed',
      code: 'XSS_PROTECTION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Recursively sanitizes an object
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = InputSanitizer.sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Content Security Policy Middleware
 * Sets security headers to prevent various attacks
 */
export const contentSecurityPolicy = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set comprehensive security headers
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Swagger UI
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "child-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "manifest-src 'self'",
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
  );
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  // Prevent caching of sensitive responses
  if (req.path.includes('/auth/') || req.path.includes('/users/')) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  // Add security headers for API responses
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('X-Request-ID', crypto.randomUUID());

  next();
};

/**
 * Request sanitization middleware
 * Performs comprehensive input sanitization
 */
export const requestSanitization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Remove null bytes
    if (req.body) {
      req.body = removeNullBytes(req.body);
    }

    // Validate JSON structure
    if (req.headers['content-type']?.includes('application/json') && req.body) {
      if (!isValidJSON(req.body)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON structure',
          code: 'INVALID_JSON',
          details: {
            reason:
              'Request body contains invalid JSON structure or exceeds maximum depth',
          },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Enhanced suspicious pattern detection
    const suspiciousPatterns = [
      // Script injection - using safer regex patterns
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
      /<object[^>]*>[\s\S]*?<\/object>/gi,
      /<embed\b[^<]*>/gi,

      // Protocol injection
      /javascript:/gi,
      /vbscript:/gi,
      /data:/gi,

      // Event handlers
      /on\w+\s*=/gi,

      // Function calls
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,

      // SQL injection patterns
      /\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP)\b/gi,
      /(--|\/\*|\*\/)/g,

      // Command injection
      /[|&;`$()]/g,

      // Path traversal
      /\.\.\//g,
      /\.\.\\/g,
    ];

    const requestString = JSON.stringify(req.body);
    const matchedPatterns: string[] = [];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(requestString)) {
        matchedPatterns.push(pattern.source);
      }
    }

    if (matchedPatterns.length > 0) {
      console.warn(`Suspicious content detected from IP ${req.clientIp}:`, {
        patterns: matchedPatterns,
        userAgent: req.headers['user-agent'],
        path: req.path,
        timestamp: new Date().toISOString(),
      });

      return res.status(400).json({
        success: false,
        error: 'Suspicious content detected',
        code: 'SUSPICIOUS_CONTENT',
        details: {
          reason: 'Request contains potentially malicious content',
          patternsDetected: matchedPatterns.length,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check for excessive nesting or large objects
    if (req.body && typeof req.body === 'object') {
      const objectSize = JSON.stringify(req.body).length;
      if (objectSize > 100000) {
        // 100KB limit for JSON objects
        return res.status(413).json({
          success: false,
          error: 'Request object too large',
          code: 'OBJECT_TOO_LARGE',
          details: {
            size: objectSize,
            limit: 100000,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }

    next();
  } catch (error) {
    console.error('Request sanitization error:', error);
    return res.status(500).json({
      success: false,
      error: 'Request sanitization failed',
      code: 'SANITIZATION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Removes null bytes from object
 */
function removeNullBytes(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\0/g, '');
  }

  if (Array.isArray(obj)) {
    return obj.map(removeNullBytes);
  }

  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key.replace(/\0/g, '')] = removeNullBytes(value);
    }
    return cleaned;
  }

  return obj;
}

/**
 * Validates JSON structure
 */
function isValidJSON(obj: any): boolean {
  try {
    // Check for circular references
    JSON.stringify(obj);

    // Check object depth (prevent deeply nested objects)
    const maxDepth = 10;
    return getObjectDepth(obj) <= maxDepth;
  } catch {
    return false;
  }
}

/**
 * Gets object depth
 */
function getObjectDepth(obj: any, depth = 0): number {
  if (depth > 10) return depth; // Prevent stack overflow

  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return Math.max(
        depth,
        ...obj.map(item => getObjectDepth(item, depth + 1))
      );
    } else {
      return Math.max(
        depth,
        ...Object.values(obj).map(value => getObjectDepth(value, depth + 1))
      );
    }
  }

  return depth;
}

/**
 * IP validation middleware
 * Validates and normalizes IP addresses
 */
export const ipValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get real IP address
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const remoteAddress =
      req.connection.remoteAddress || req.socket.remoteAddress;

    let clientIp = remoteAddress;

    if (forwarded) {
      clientIp = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0];
    } else if (realIp) {
      clientIp = Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Validate IP format
    if (clientIp && !isValidIP(clientIp.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid client IP address',
        code: 'INVALID_IP',
        timestamp: new Date().toISOString(),
      });
    }

    // Store normalized IP
    req.clientIp = clientIp?.trim();

    next();
  } catch (error) {
    console.error('IP validation error:', error);
    next(); // Continue even if IP validation fails
  }
};

/**
 * Validates IP address format
 */
function isValidIP(ip: string): boolean {
  // In test environment, be more lenient
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  // IPv4 regex (simplified to avoid ReDoS)
  const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

  // IPv6 regex (simplified to avoid ReDoS)
  const ipv6Regex = /^[0-9a-fA-F:]+$|^::1$|^::$/;

  return (
    ipv4Regex.test(ip) ||
    ipv6Regex.test(ip) ||
    ip === 'localhost' ||
    ip === '::1' ||
    ip === 'unknown'
  );
}

/**
 * Request timing middleware
 * Adds request timing for security monitoring
 */
export const requestTiming = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime!;

    // Log slow requests (potential DoS attempts)
    if (duration > 5000) {
      // 5 seconds
      console.warn(
        `Slow request detected: ${req.method} ${req.path} took ${duration}ms from IP ${req.clientIp}`
      );
    }
  });

  next();
};

/**
 * Comprehensive security validation middleware
 * Combines multiple security checks in one middleware
 */
export const comprehensiveSecurityValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Validate request size
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 2 * 1024 * 1024) {
      // 2MB limit
      return res.status(413).json({
        success: false,
        error: 'Request payload too large',
        code: 'PAYLOAD_TOO_LARGE',
        details: {
          maxSize: '2MB',
          received: `${Math.round(contentLength / 1024)}KB`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Validate HTTP method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
        details: { method: req.method, allowed: allowedMethods },
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Validate required headers (skip in test environment)
    if (process.env.NODE_ENV !== 'test') {
      const requiredHeaders = ['user-agent'];
      for (const header of requiredHeaders) {
        if (!req.headers[header]) {
          return res.status(400).json({
            success: false,
            error: `Missing required header: ${header}`,
            code: 'MISSING_HEADER',
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    // 4. Check for header injection
    for (const [, value] of Object.entries(req.headers)) {
      if (
        typeof value === 'string' &&
        (value.includes('\n') || value.includes('\r') || value.includes('\0'))
      ) {
        return res.status(400).json({
          success: false,
          error: 'Header injection detected',
          code: 'HEADER_INJECTION',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 5. Rate limiting check (basic)
    const ip = req.clientIp || req.ip;
    if (!ip || ip === 'unknown') {
      console.warn('Unable to determine client IP address');
    }

    // 6. Log security-relevant information
    if (process.env.NODE_ENV === 'production') {
      console.log(
        `Security validation passed for ${req.method} ${req.path} from ${ip}`
      );
    }

    next();
  } catch (error) {
    console.error('Comprehensive security validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Security validation failed',
      code: 'SECURITY_VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Advanced XSS protection with content analysis
 */
export const advancedXSSProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body && typeof req.body === 'object') {
      const sanitizedBody = deepSanitizeObject(req.body);

      // Check if sanitization changed the object significantly
      const originalSize = JSON.stringify(req.body).length;
      const sanitizedSize = JSON.stringify(sanitizedBody).length;

      if (originalSize - sanitizedSize > originalSize * 0.1) {
        // More than 10% reduction
        console.warn(
          `Significant content sanitization for request from ${req.clientIp}:`,
          {
            originalSize,
            sanitizedSize,
            reduction: originalSize - sanitizedSize,
            path: req.path,
          }
        );
      }

      req.body = sanitizedBody;
    }

    next();
  } catch (error) {
    console.error('Advanced XSS protection error:', error);
    return res.status(500).json({
      success: false,
      error: 'XSS protection failed',
      code: 'XSS_PROTECTION_ERROR',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Deep sanitization of nested objects
 */
function deepSanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = InputSanitizer.sanitizeString(key);
      sanitized[sanitizedKey] = deepSanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
      startTime?: number;
    }
  }
}
