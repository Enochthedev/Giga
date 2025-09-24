import cors from 'cors';
import { NextFunction, Request, Response } from 'express';

/**
 * Enhanced security headers and CORS middleware
 */
export class EnhancedSecurityMiddleware {
  /**
   * Enhanced CORS configuration with security features
   */
  static configureCORS() {
    const allowedOrigins = this.getAllowedOrigins();

    return cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Log unauthorized origin attempts
        console.warn('CORS: Unauthorized origin attempt', {
          origin,
          timestamp: new Date().toISOString(),
        });

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Session-ID',
        'X-Device-ID',
        'X-2FA-Token',
        'X-2FA-Verified',
        'X-Request-ID',
        'X-Client-Version',
      ],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Request-ID',
        'X-Response-Time',
      ],
      maxAge: 86400, // 24 hours
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  /**
   * Comprehensive security headers middleware
   */
  static setSecurityHeaders = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Content Security Policy
      const cspDirectives = this.buildCSPDirectives(req);
      res.setHeader('Content-Security-Policy', cspDirectives);

      // Strict Transport Security (HTTPS only)
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload'
        );
      }

      // X-Frame-Options
      res.setHeader('X-Frame-Options', 'DENY');

      // X-Content-Type-Options
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // X-XSS-Protection
      res.setHeader('X-XSS-Protection', '1; mode=block');

      // Referrer Policy
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Permissions Policy
      const permissionsPolicy = [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'speaker=()',
        'vibrate=()',
        'fullscreen=(self)',
        'sync-xhr=()',
      ];
      res.setHeader('Permissions-Policy', permissionsPolicy.join(', '));

      // Cross-Origin Policies
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

      // Cache Control for sensitive endpoints
      if (this.isSensitiveEndpoint(req.path)) {
        res.setHeader(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
        );
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
      }

      // Custom security headers
      res.setHeader('X-API-Version', '1.0');
      res.setHeader('X-Security-Framework', 'Enhanced');
      res.setHeader('X-Request-ID', this.generateRequestId());

      // Remove server information
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');

      next();
    } catch (error) {
      console.error('Security headers error:', error);
      next(); // Continue on error
    }
  };

  /**
   * Advanced request validation middleware
   */
  static validateRequest = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate HTTP version
      if (req.httpVersion !== '1.1' && req.httpVersion !== '2.0') {
        return res.status(400).json({
          success: false,
          error: 'Unsupported HTTP version',
          code: 'UNSUPPORTED_HTTP_VERSION',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate Content-Length for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentLength = req.headers['content-length'];
        if (!contentLength) {
          return res.status(400).json({
            success: false,
            error: 'Content-Length header required',
            code: 'MISSING_CONTENT_LENGTH',
            timestamp: new Date().toISOString(),
          });
        }

        const length = parseInt(contentLength);
        if (isNaN(length) || length < 0) {
          return res.status(400).json({
            success: false,
            error: 'Invalid Content-Length header',
            code: 'INVALID_CONTENT_LENGTH',
            timestamp: new Date().toISOString(),
          });
        }

        // Maximum request size (10MB)
        if (length > 10 * 1024 * 1024) {
          return res.status(413).json({
            success: false,
            error: 'Request entity too large',
            code: 'REQUEST_TOO_LARGE',
            details: {
              maxSize: '10MB',
              receivedSize: `${Math.round(length / 1024 / 1024)}MB`,
            },
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Validate Host header
      const host = req.headers.host;
      if (!host || !this.isValidHost(host)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or missing Host header',
          code: 'INVALID_HOST',
          timestamp: new Date().toISOString(),
        });
      }

      // Check for suspicious headers
      const suspiciousHeaders = this.checkSuspiciousHeaders(req);
      if (suspiciousHeaders.length > 0) {
        console.warn('Suspicious headers detected', {
          headers: suspiciousHeaders,
          ip: req.clientIp || req.ip,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
        });

        // Log but don't block (could be legitimate)
      }

      // Validate User-Agent
      const userAgent = req.headers['user-agent'];
      if (!userAgent && process.env.NODE_ENV === 'production') {
        return res.status(400).json({
          success: false,
          error: 'User-Agent header required',
          code: 'MISSING_USER_AGENT',
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      console.error('Request validation error:', error);
      next(); // Continue on error
    }
  };

  /**
   * Security monitoring middleware
   */
  static securityMonitoring = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const startTime = Date.now();

      // Monitor response
      res.on('finish', () => {
        const duration = Date.now() - startTime;

        // Log security-relevant requests
        if (this.shouldLogRequest(req, res)) {
          console.info('Security monitoring', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ip: req.clientIp || req.ip,
            userAgent: req.headers['user-agent'],
            userId: req.user?.sub,
            sessionId: req.sessionId,
            timestamp: new Date().toISOString(),
          });
        }

        // Alert on suspicious patterns
        if (this.isSuspiciousResponse(req, res, duration)) {
          console.warn('Suspicious response pattern detected', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ip: req.clientIp || req.ip,
            timestamp: new Date().toISOString(),
          });
        }
      });

      next();
    } catch (error) {
      console.error('Security monitoring error:', error);
      next();
    }
  };

  /**
   * Get allowed origins based on environment
   */
  private static getAllowedOrigins(): string[] {
    const baseOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
    ];

    if (process.env.NODE_ENV === 'production') {
      const productionOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      return [...baseOrigins, ...productionOrigins];
    }

    return baseOrigins;
  }

  /**
   * Build Content Security Policy directives
   */
  private static buildCSPDirectives(req: Request): string {
    const baseDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Allow inline for Swagger
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

    // Add report-uri in production
    if (process.env.NODE_ENV === 'production' && process.env.CSP_REPORT_URI) {
      baseDirectives.push(`report-uri ${process.env.CSP_REPORT_URI}`);
    }

    return baseDirectives.join('; ');
  }

  /**
   * Check if endpoint is sensitive
   */
  private static isSensitiveEndpoint(path: string): boolean {
    const sensitivePatterns = [
      /^\/auth\//,
      /^\/users\//,
      /^\/admin\//,
      /^\/profile\//,
      /password/i,
      /token/i,
    ];

    return sensitivePatterns.some(pattern => pattern.test(path));
  }

  /**
   * Generate unique request ID
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate host header
   */
  private static isValidHost(host: string): boolean {
    const allowedHosts = [
      'localhost:3001',
      'localhost:3000',
      '127.0.0.1:3001',
      '127.0.0.1:3000',
    ];

    if (process.env.NODE_ENV === 'production') {
      const productionHosts = process.env.ALLOWED_HOSTS?.split(',') || [];
      allowedHosts.push(...productionHosts);
    }

    return allowedHosts.some(allowedHost =>
      host === allowedHost || host.startsWith(allowedHost)
    );
  }

  /**
   * Check for suspicious headers
   */
  private static checkSuspiciousHeaders(req: Request): string[] {
    const suspicious: string[] = [];

    // Check for proxy headers that might indicate tunneling
    const proxyHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-forwarded-proto',
      'x-forwarded-host',
    ];

    proxyHeaders.forEach(header => {
      const value = req.headers[header];
      if (value && typeof value === 'string') {
        // Check for multiple IPs (potential proxy chain)
        if (value.includes(',') && value.split(',').length > 3) {
          suspicious.push(`${header}: multiple_ips`);
        }

        // Check for private IP forwarding
        if (/192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\./.test(value)) {
          suspicious.push(`${header}: private_ip`);
        }
      }
    });

    // Check for unusual Accept headers
    const accept = req.headers.accept;
    if (accept && typeof accept === 'string') {
      if (accept.includes('*/*') && accept.length < 10) {
        suspicious.push('accept: too_generic');
      }
    }

    // Check for missing common headers
    if (!req.headers['accept-language']) {
      suspicious.push('missing: accept-language');
    }

    if (!req.headers['accept-encoding']) {
      suspicious.push('missing: accept-encoding');
    }

    return suspicious;
  }

  /**
   * Determine if request should be logged
   */
  private static shouldLogRequest(_req: Request, res: Response): boolean {
    // Always log authentication endpoints
    if (req.path.includes('/auth/')) return true;

    // Log admin endpoints
    if (req.path.includes('/admin/')) return true;

    // Log error responses
    if (res.statusCode >= 400) return true;

    // Log slow requests
    const duration = Date.now() - (req.startTime || Date.now());
    if (duration > 2000) return true; // 2 seconds

    return false;
  }

  /**
   * Check if response pattern is suspicious
   */
  private static isSuspiciousResponse(
    _req: Request,
    res: Response,
    duration: number
  ): boolean {
    // Very fast responses to complex endpoints
    if (duration < 10 && req.path.includes('/auth/login')) {
      return true;
    }

    // Multiple 401s from same IP
    if (res.statusCode === 401) {
      return true; // Let rate limiting handle the actual blocking
    }

    // Unusual status codes
    const unusualCodes = [418, 451, 499];
    if (unusualCodes.includes(res.statusCode)) {
      return true;
    }

    return false;
  }

  /**
   * Security headers for API responses
   */
  static setAPIResponseHeaders = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Set response timing header
    if (req.startTime) {
      const duration = Date.now() - req.startTime;
      res.setHeader('X-Response-Time', `${duration}ms`);
    }

    // Set security level based on endpoint
    if (this.isSensitiveEndpoint(req.path)) {
      res.setHeader('X-Security-Level', 'high');
    } else {
      res.setHeader('X-Security-Level', 'standard');
    }

    // Set rate limit information if available
    const rateLimitHeaders = [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ];

    rateLimitHeaders.forEach(header => {
      if (res.getHeader(header)) {
        // Header already set by rate limiting middleware
        return;
      }
    });

    next();
  };
}