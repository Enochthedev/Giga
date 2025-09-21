import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * Password strength validation utility
 */
export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  /**
   * Validates password strength according to security policies
   */
  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!password || typeof password !== 'string') {
      errors.push('Password is required and must be a string');
      return { isValid: false, errors };
    }

    // Length validation
    if (password.length < this.MIN_LENGTH) {
      errors.push(
        `Password must be at least ${this.MIN_LENGTH} characters long`
      );
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must not exceed ${this.MAX_LENGTH} characters`);
    }

    // Character requirements
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter (a-z)');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter (A-Z)');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number (0-9)');
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
      errors.push(
        'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)'
      );
    }

    // Advanced security checks
    if (this.isCommonPassword(password)) {
      errors.push(
        'Password is too common. Please choose a more unique password'
      );
    }

    if (this.hasSequentialChars(password)) {
      errors.push(
        'Password should not contain sequential characters (e.g., 123, abc, qwerty)'
      );
    }

    if (this.hasRepeatedChars(password)) {
      errors.push(
        'Password should not contain more than 2 consecutive identical characters'
      );
    }

    if (this.hasKeyboardPatterns(password)) {
      errors.push(
        'Password should not contain keyboard patterns (e.g., qwerty, asdf)'
      );
    }

    if (this.hasPersonalInfoPatterns(password)) {
      errors.push(
        'Password should not contain common personal information patterns'
      );
    }

    // Check for null bytes or control characters
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x1F\x7F]/.test(password)) {
      errors.push('Password contains invalid control characters');
    }

    // Check for Unicode normalization issues
    if (password !== password.normalize('NFC')) {
      errors.push('Password contains invalid Unicode characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if password is in common passwords list
   */
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      '1234567890',
      'password1',
      'qwerty123',
      'admin123',
      'root',
      'toor',
      'pass',
      'test',
      'guest',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Checks for sequential characters
   */
  private static hasSequentialChars(password: string): boolean {
    const sequences = [
      '0123456789',
      'abcdefghijklmnopqrstuvwxyz',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
    ];

    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        const subseq = seq.substring(i, i + 3);
        if (
          password.toLowerCase().includes(subseq) ||
          password.toLowerCase().includes(subseq.split('').reverse().join(''))
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks for repeated characters
   */
  private static hasRepeatedChars(password: string): boolean {
    // Check for 3 or more consecutive identical characters
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }

    // Check for patterns like "AAA" or "aaa" (case-insensitive)
    const lowerPassword = password.toLowerCase();
    for (let i = 0; i < lowerPassword.length - 2; i++) {
      if (
        lowerPassword[i] === lowerPassword[i + 1] &&
        lowerPassword[i] === lowerPassword[i + 2]
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks for keyboard patterns
   */
  private static hasKeyboardPatterns(password: string): boolean {
    const keyboardPatterns = [
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
      'qwertyuiopasdfghjklzxcvbnm',
      '1234567890',
      '0987654321',
    ];

    const lowerPassword = password.toLowerCase();

    for (const pattern of keyboardPatterns) {
      for (let i = 0; i <= pattern.length - 4; i++) {
        const subPattern = pattern.substring(i, i + 4);
        if (
          lowerPassword.includes(subPattern) ||
          lowerPassword.includes(subPattern.split('').reverse().join(''))
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks for personal information patterns
   */
  private static hasPersonalInfoPatterns(password: string): boolean {
    const personalPatterns = [
      /(name|user|admin|test|demo|guest)/i,
      /(password|pass|pwd|secret)/i,
      /(login|auth|account)/i,
      /(company|corp|inc|ltd)/i,
      /(email|mail|address)/i,
      /(phone|mobile|cell)/i,
      /(birth|birthday|date)/i,
      /(year|month|day)/i,
      /(19|20)\d{2}/, // Years like 2024
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, // Months
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, // Days
    ];

    return personalPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Generates password strength score (0-100)
   */
  static getStrengthScore(password: string): number {
    let score = 0;

    // Length bonus
    score += Math.min(password.length * 2, 20);

    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) score += 15;

    // Uniqueness bonus
    const uniqueChars = new Set(password).size;
    score += Math.min(uniqueChars * 2, 20);

    // Penalties
    if (this.isCommonPassword(password)) score -= 30;
    if (this.hasSequentialChars(password)) score -= 20;
    if (this.hasRepeatedChars(password)) score -= 15;

    return Math.max(0, Math.min(100, score));
  }
}

/**
 * Input sanitization utility
 */
export class InputSanitizer {
  /**
   * Sanitizes string input to prevent XSS attacks
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
      .replace(/document\./gi, '') // Remove document object access
      .replace(/window\./gi, '') // Remove window object access
      .replace(/eval\s*\(/gi, '') // Remove eval calls
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .trim();
  }

  /**
   * Sanitizes email input
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return '';

    return email
      .trim()
      .toLowerCase()
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove complete script tags first
      .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/alert\([^)]*\)/gi, '') // Remove alert calls
      .replace(/script/gi, '') // Remove any remaining script text
      .replace(/[/\\]/g, ''); // Remove slashes
  }

  /**
   * Sanitizes phone number input
   */
  static sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') return '';

    return phone
      .replace(/[^\d+\-\s]/g, '') // Keep only digits, +, -, spaces (removed parentheses)
      .trim();
  }

  /**
   * Sanitizes name input (first name, last name)
   */
  static sanitizeName(name: string): string {
    if (typeof name !== 'string') return '';

    return name
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove complete script tags first
      .replace(/[<>]/g, '') // Remove angle brackets but keep quotes for names like O'Connor
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/document\./gi, '') // Remove document object access
      .replace(/DROP\s+TABLE/gi, '') // Remove SQL injection attempts
      .replace(/--/g, '') // Remove SQL comments
      .replace(/script/gi, '') // Remove any remaining script text
      .replace(/alert\([^)]*\)/gi, '') // Remove alert calls
      .replace(/[^a-zA-ZÀ-ÿ\s\-'@.]/g, '') // Keep only letters, spaces, hyphens, apostrophes, @, .
      .trim();
  }
}

/**
 * JWT security utility
 */
export class JWTSecurity {
  private static readonly ALGORITHM = 'HS256';
  private static readonly KEY_ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generates a secure JWT secret
   */
  static generateSecureSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Validates JWT secret strength
   */
  static validateSecretStrength(secret: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!secret || secret.length < 32) {
      errors.push('JWT secret must be at least 32 characters long');
    }

    if (
      secret === 'your-super-secret-jwt-key-change-in-production' ||
      secret === 'your-super-secret-jwt-key-change-in-production-please'
    ) {
      errors.push('JWT secret must not use default development values');
    }

    if (!/[A-Za-z]/.test(secret) || !/[0-9]/.test(secret)) {
      errors.push('JWT secret should contain both letters and numbers');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates JWT payload with security headers
   */
  static createSecurePayload(
    user: any,
    additionalClaims: Record<string, any> = {}
  ): Record<string, any> {
    const now = Math.floor(Date.now() / 1000);

    return {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((ur: any) => ur.role?.name || ur) || [],
      activeRole: user.activeRole,
      iat: now,
      jti: crypto.randomUUID(), // JWT ID for tracking
      ...additionalClaims,
    };
  }

  /**
   * Validates token claims for security
   */
  static validateTokenClaims(payload: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!payload.sub) {
      errors.push('Token missing subject (user ID)');
    }

    if (!payload.email) {
      errors.push('Token missing email claim');
    }

    if (!payload.iat) {
      errors.push('Token missing issued at claim');
    }

    if (!payload.jti) {
      errors.push('Token missing JWT ID claim');
    }

    // Check token age
    const tokenAge = Date.now() / 1000 - payload.iat;
    if (tokenAge > 24 * 60 * 60) {
      // 24 hours
      errors.push('Token is too old');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Request validation utility
 */
export class RequestValidator {
  /**
   * Validates request size
   */
  static validateRequestSize(req: any): { isValid: boolean; error?: string } {
    const maxSize = 1024 * 1024; // 1MB
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > maxSize) {
      return {
        isValid: false,
        error: 'Request payload too large',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates content type
   */
  static validateContentType(
    req: any,
    allowedTypes: string[] = ['application/json']
  ): { isValid: boolean; error?: string } {
    const contentType = req.headers['content-type'];

    if (!contentType) {
      return {
        isValid: false,
        error: 'Content-Type header is required',
      };
    }

    const isAllowed = allowedTypes.some(type => contentType.includes(type));

    if (!isAllowed) {
      return {
        isValid: false,
        error: `Content-Type must be one of: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates request security aspects
   */
  static validateRequestSecurity(req: any): {
    isValid: boolean;
    error?: string;
  } {
    // Check for suspicious headers
    const suspiciousHeaders = ['x-forwarded-host', 'x-forwarded-proto'];
    for (const header of suspiciousHeaders) {
      const value = req.headers[header];
      if (value && typeof value === 'string') {
        // Check for header injection attempts
        if (
          value.includes('\n') ||
          value.includes('\r') ||
          value.includes('\0')
        ) {
          return {
            isValid: false,
            error: 'Suspicious header content detected',
          };
        }
      }
    }

    // Validate User-Agent header
    const userAgent = req.headers['user-agent'];
    if (!userAgent) {
      return {
        isValid: false,
        error: 'User-Agent header is required',
      };
    }

    if (userAgent.length > 500) {
      return {
        isValid: false,
        error: 'User-Agent header too long',
      };
    }

    // Check for suspicious User-Agent patterns
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http/i,
    ];

    // Allow legitimate bots but log them
    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      console.warn(
        `Suspicious User-Agent detected: ${userAgent} from IP: ${req.clientIp}`
      );
    }

    // Check request method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    if (!allowedMethods.includes(req.method)) {
      return {
        isValid: false,
        error: `HTTP method ${req.method} not allowed`,
      };
    }

    return { isValid: true };
  }
}

/**
 * Enhanced Zod schemas with security validation
 */
export const securePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .refine(
    password => {
      const validation = PasswordValidator.validate(password);
      return validation.isValid;
    },
    password => {
      const validation = PasswordValidator.validate(password);
      return { message: validation.errors.join(', ') };
    }
  );

export const secureEmailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email address too long')
  .transform(InputSanitizer.sanitizeEmail)
  .refine(email => {
    // Additional email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, 'Invalid email format');

export const secureNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name too long')
  .transform(InputSanitizer.sanitizeName)
  .refine(name => name.length > 0, 'Name cannot be empty after sanitization');

export const securePhoneSchema = z
  .string()
  .optional()
  .transform(phone => (phone ? InputSanitizer.sanitizePhone(phone) : undefined))
  .refine(phone => {
    if (!phone) return true;
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  }, 'Invalid phone number format');
