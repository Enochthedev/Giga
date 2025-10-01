import crypto from 'crypto';
import { FileData } from '../types/upload.types';

/**
 * Security utilities for file handling
 */
export class SecurityUtils {
  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate file hash for integrity checking
   */
  static generateFileHash(
    buffer: Buffer,
    algorithm: 'sha256' | 'sha512' = 'sha256'
  ): string {
    return crypto.createHash(algorithm).update(buffer).digest('hex');
  }

  /**
   * Sanitize file path to prevent directory traversal
   */
  static sanitizePath(filePath: string): string {
    // Remove any path traversal attempts
    return filePath
      .replace(/\.\./g, '') // Remove ..
      .replace(/\/+/g, '/') // Replace multiple slashes with single
      .replace(/^\/+/, '') // Remove leading slashes
      .replace(/\/+$/, ''); // Remove trailing slashes
  }

  /**
   * Check for suspicious file patterns
   */
  static checkSuspiciousPatterns(file: FileData): {
    isSuspicious: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const content = file.buffer.toString(
      'utf8',
      0,
      Math.min(file.buffer.length, 8192)
    );

    // Check for script injection patterns
    const scriptPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /vbscript:/i,
      /data:text\/html/i,
      /data:application\/javascript/i,
    ];

    for (const pattern of scriptPatterns) {
      if (pattern.test(content)) {
        reasons.push('Contains script injection patterns');
        break;
      }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(content)) {
        reasons.push('Contains SQL injection patterns');
        break;
      }
    }

    // Check for command injection patterns
    const commandPatterns = [
      /\$\([^)]*\)/,
      /`[^`]*`/,
      /\|\s*[a-zA-Z]/,
      /;\s*[a-zA-Z]/,
    ];

    for (const pattern of commandPatterns) {
      if (pattern.test(content)) {
        reasons.push('Contains command injection patterns');
        break;
      }
    }

    // Check for suspicious file extensions in content
    if (this.containsSuspiciousExtensions(content)) {
      reasons.push('Contains references to suspicious file extensions');
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Check for suspicious file extensions in content
   */
  private static containsSuspiciousExtensions(content: string): boolean {
    const suspiciousExtensions = [
      /\.exe\b/i,
      /\.bat\b/i,
      /\.cmd\b/i,
      /\.scr\b/i,
      /\.pif\b/i,
      /\.com\b/i,
      /\.vbs\b/i,
      /\.js\b/i,
      /\.jar\b/i,
    ];

    return suspiciousExtensions.some(pattern => pattern.test(content));
  }

  /**
   * Validate file name for security issues
   */
  static validateSecureFileName(fileName: string): {
    isSecure: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check for null bytes
    if (fileName.includes('\0')) {
      issues.push('File name contains null bytes');
    }

    // Check for directory traversal
    if (
      fileName.includes('..') ||
      fileName.includes('./') ||
      fileName.includes('.\\')
    ) {
      issues.push('File name contains directory traversal patterns');
    }

    // Check for reserved names (Windows)
    const reservedNames = [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9',
    ];
    const baseName = fileName.split('.')[0].toUpperCase();
    if (reservedNames.includes(baseName)) {
      issues.push('File name uses reserved system name');
    }

    // Check for dangerous characters
    // eslint-disable-next-line no-control-regex
    const dangerousChars = /[<>:"|?*\x00-\x1f]/;
    if (dangerousChars.test(fileName)) {
      issues.push('File name contains dangerous characters');
    }

    // Check for excessive length
    if (fileName.length > 255) {
      issues.push('File name is too long');
    }

    return {
      isSecure: issues.length === 0,
      issues,
    };
  }

  /**
   * Generate secure file URL with expiration
   */
  static generateSecureUrl(
    fileId: string,
    expiresIn: number = 3600
  ): { url: string; token: string; expiresAt: Date } {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const token = this.generateSecureToken(16);

    // Create signature
    const payload = `${fileId}:${expiresAt.getTime()}:${token}`;
    const signature = crypto
      .createHmac('sha256', process.env.FILE_URL_SECRET || 'default-secret')
      .update(payload)
      .digest('hex');

    const url = `/files/${fileId}?token=${token}&expires=${expiresAt.getTime()}&signature=${signature}`;

    return {
      url,
      token,
      expiresAt,
    };
  }

  /**
   * Verify secure file URL
   */
  static verifySecureUrl(
    fileId: string,
    token: string,
    expires: string,
    signature: string
  ): { isValid: boolean; error?: string } {
    try {
      const expiresAt = new Date(parseInt(expires));

      // Check expiration
      if (expiresAt < new Date()) {
        return { isValid: false, error: 'URL has expired' };
      }

      // Verify signature
      const payload = `${fileId}:${expires}:${token}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.FILE_URL_SECRET || 'default-secret')
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { isValid: false, error: 'Invalid signature' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  /**
   * Encrypt file content
   */
  static encryptFile(
    buffer: Buffer,
    key: string
  ): { encrypted: Buffer; iv: Buffer } {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return { encrypted, iv };
  }

  /**
   * Decrypt file content
   */
  static decryptFile(
    encryptedBuffer: Buffer,
    key: string,
    _iv: Buffer
  ): Buffer {
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(algorithm, key);

    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  }

  /**
   * Rate limiting utilities
   */
  static createRateLimitKey(identifier: string, operation: string): string {
    return `rate_limit:${operation}:${identifier}`;
  }

  /**
   * Check if operation is rate limited
   */
  static isRateLimited(
    attempts: number,
    maxAttempts: number,
    windowMs: number,
    lastAttempt: Date
  ): boolean {
    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - lastAttempt.getTime();

    // Reset counter if window has passed
    if (timeSinceLastAttempt > windowMs) {
      return false;
    }

    return attempts >= maxAttempts;
  }
}
