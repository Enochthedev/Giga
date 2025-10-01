import crypto from 'crypto';
import path from 'path';
import {
  ContentValidationResult,
  IFileValidator,
  IntegrityResult,
  ScanResult,
  SecurityValidationResult,
  ThreatInfo,
  ValidationConfig,
  ValidationResult,
} from '../interfaces/file-validator.interface';
import { securityLogger } from '../lib/logger';
import { FileData } from '../types/upload.types';
import {
  ContentValidator,
  FileSizeValidator,
  MimeTypeValidator,
} from '../utils/validation-utils';
import {
  SecurityScanResult,
  SecurityScannerService,
  createSecurityScanner,
} from './security-scanner.service';

/**
 * File validation service implementing comprehensive security and format validation
 */
export class FileValidatorService implements IFileValidator {
  private config: ValidationConfig;
  private securityScanner: SecurityScannerService;

  constructor(config: ValidationConfig) {
    this.config = config;
    this.securityScanner = createSecurityScanner({
      enableMalwareScanning: config.enableMalwareScanning,
      enableContentAnalysis: config.enableContentValidation,
      maxScanTime: 30000,
    });
  }

  /**
   * Basic file validation (quick checks only)
   */
  async validateBasicFile(file: FileData): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Basic file validation
      if (!file.buffer || file.buffer.length === 0) {
        errors.push('File buffer is empty');
        return { isValid: false, errors, warnings };
      }

      if (!file.originalName || file.originalName.trim() === '') {
        errors.push('File name is required');
      }

      // 2. MIME type validation
      if (!this.validateMimeType(file, this.config.allowedMimeTypes)) {
        const mimeValidation = MimeTypeValidator.validateMimeType(file);
        errors.push(...mimeValidation.errors);
      }

      // 3. File size validation
      if (!this.validateFileSize(file, this.config.maxFileSize)) {
        const sizeValidation = FileSizeValidator.validateSize(
          file,
          this.config.maxFileSize
        );
        errors.push(...sizeValidation.errors);
      }

      const detectedMimeType = MimeTypeValidator.detectMimeType(file.buffer);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
          detectedMimeType: detectedMimeType || 'unknown',
          actualSize: file.buffer.length,
          sanitizedName: this.sanitizeFileName(file.originalName),
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          `Basic validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
        warnings,
      };
    }
  }

  /**
   * Comprehensive file validation
   */
  async validateFile(file: FileData): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Basic file validation
      if (!file.buffer || file.buffer.length === 0) {
        errors.push('File buffer is empty');
        return { isValid: false, errors, warnings };
      }

      if (!file.originalName || file.originalName.trim() === '') {
        errors.push('File name is required');
      }

      // 2. MIME type validation
      if (!this.validateMimeType(file, this.config.allowedMimeTypes)) {
        const mimeValidation = MimeTypeValidator.validateMimeType(file);
        errors.push(...mimeValidation.errors);
      }

      // 3. File size validation
      if (!this.validateFileSize(file, this.config.maxFileSize)) {
        const sizeValidation = FileSizeValidator.validateSize(
          file,
          this.config.maxFileSize
        );
        errors.push(...sizeValidation.errors);
      }

      // 4. Filename sanitization check
      const sanitizedName = this.sanitizeFileName(file.originalName);
      if (sanitizedName !== file.originalName) {
        warnings.push(
          `Filename was sanitized from "${file.originalName}" to "${sanitizedName}"`
        );
      }

      // 5. Content validation (if enabled)
      if (this.config.enableContentValidation) {
        const contentValidation = await this.validateFileContent(file);
        if (!contentValidation.isValid) {
          errors.push(...contentValidation.errors);
        }
        if (contentValidation.mimeTypeMismatch) {
          warnings.push(
            'MIME type mismatch detected between header and content'
          );
        }
      }

      // 6. Malware scanning (if enabled)
      if (this.config.enableMalwareScanning) {
        const scanResult = await this.scanForMalware(file);
        if (!scanResult.isClean) {
          errors.push('File failed malware scan');
          scanResult.threats.forEach(threat => {
            errors.push(
              `Threat detected: ${threat.name} (${threat.type}, severity: ${threat.severity})`
            );
          });
        }
      }

      const detectedMimeType = MimeTypeValidator.detectMimeType(file.buffer);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
          detectedMimeType: detectedMimeType || 'unknown',
          actualSize: file.buffer.length,
          sanitizedName: sanitizedName,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
        warnings,
      };
    }
  }

  /**
   * MIME type validation against allowed types
   */
  validateMimeType(file: FileData, allowedTypes: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) {
      return true; // No restrictions
    }

    // Check declared MIME type
    if (!MimeTypeValidator.isAllowedMimeType(file.mimeType, allowedTypes)) {
      return false;
    }

    // Verify MIME type matches file content
    const validation = MimeTypeValidator.validateMimeType(file);
    return validation.isValid;
  }

  /**
   * File size validation
   */
  validateFileSize(file: FileData, maxSize: number): boolean {
    const validation = FileSizeValidator.validateSize(file, maxSize);
    return validation.isValid;
  }

  /**
   * Sanitize filename to prevent security issues
   */
  sanitizeFileName(fileName: string): string {
    if (!fileName) {
      return 'unnamed_file';
    }

    // Remove path separators and dangerous characters
    let sanitized = fileName
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_') // Replace dangerous characters
      .replace(/^\.+/, '') // Remove leading dots
      .replace(/\.+$/, '') // Remove trailing dots
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();

    // Ensure filename is not empty after sanitization
    if (!sanitized || sanitized === '_') {
      sanitized = 'unnamed_file';
    }

    // Limit filename length
    const maxLength = 255;
    if (sanitized.length > maxLength) {
      const ext = path.extname(sanitized);
      const nameWithoutExt = path.basename(sanitized, ext);
      const truncatedName = nameWithoutExt.substring(
        0,
        maxLength - ext.length - 1
      );
      sanitized = truncatedName + ext;
    }

    // Ensure filename doesn't start or end with special characters
    sanitized = sanitized.replace(/^[._-]+/, '').replace(/[._-]+$/, '');

    // Replace multiple underscores with single (after other processing)
    sanitized = sanitized.replace(/_+/g, '_');

    // Add extension if missing and we can detect the type
    if (!path.extname(sanitized)) {
      const detectedType = MimeTypeValidator.detectMimeType(Buffer.alloc(0)); // This would need the actual buffer
      if (detectedType) {
        const extensions: Record<string, string> = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'image/webp': '.webp',
          'application/pdf': '.pdf',
          'application/zip': '.zip',
        };
        const ext = extensions[detectedType];
        if (ext) {
          sanitized += ext;
        }
      }
    }

    return sanitized || 'unnamed_file';
  }

  /**
   * Malware scanning (basic implementation)
   */
  async scanForMalware(file: FileData): Promise<ScanResult> {
    const startTime = Date.now();
    const threats: ThreatInfo[] = [];

    try {
      // Basic content-based threat detection
      const contentCheck = ContentValidator.checkForEmbeddedContent(
        file.buffer
      );

      if (contentCheck.hasEmbedded) {
        contentCheck.types.forEach(type => {
          threats.push({
            type: type === 'executable' ? 'malware' : 'suspicious',
            name: `Embedded ${type} content`,
            severity: type === 'executable' ? 'high' : 'medium',
            description: `File contains embedded ${type} content which may be malicious`,
          });
        });
      }

      // Check for suspicious file patterns
      const suspiciousPatterns = this.checkSuspiciousPatterns(file.buffer);
      threats.push(...suspiciousPatterns);

      const scanTime = Math.max(1, Date.now() - startTime); // Ensure at least 1ms

      return {
        isClean: threats.length === 0,
        threats,
        scanTime,
        scannerVersion: '1.0.0-basic',
      };
    } catch (error) {
      return {
        isClean: false,
        threats: [
          {
            type: 'unknown',
            name: 'Scan Error',
            severity: 'medium',
            description: `Malware scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        scanTime: Math.max(1, Date.now() - startTime),
        scannerVersion: '1.0.0-basic',
      };
    }
  }

  /**
   * Advanced content validation
   */
  async validateFileContent(file: FileData): Promise<ContentValidationResult> {
    const errors: string[] = [];

    try {
      const detectedMimeType = MimeTypeValidator.detectMimeType(file.buffer);
      const mimeTypeMismatch =
        detectedMimeType !== null && detectedMimeType !== file.mimeType;

      const embeddedContent = ContentValidator.checkForEmbeddedContent(
        file.buffer
      );

      // Additional content validation based on file type
      if (file.mimeType.startsWith('image/')) {
        const imageValidation = this.validateImageContentInternal(file.buffer);
        errors.push(...imageValidation.errors);
      }

      return {
        isValid: errors.length === 0,
        contentType: file.mimeType,
        actualMimeType: detectedMimeType || 'unknown',
        mimeTypeMismatch,
        hasEmbeddedContent: embeddedContent.hasEmbedded,
        embeddedContentTypes: embeddedContent.types,
        errors,
      };
    } catch (error) {
      return {
        isValid: false,
        contentType: file.mimeType,
        actualMimeType: 'unknown',
        mimeTypeMismatch: false,
        hasEmbeddedContent: false,
        errors: [
          `Content validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      };
    }
  }

  /**
   * File integrity check
   */
  async checkFileIntegrity(file: FileData): Promise<IntegrityResult> {
    try {
      const hash = crypto.createHash('sha256');
      hash.update(file.buffer);
      const checksum = hash.digest('hex');

      // Basic corruption detection
      const corruptionDetected = this.detectCorruption(
        file.buffer,
        file.mimeType
      );

      return {
        isIntact: !corruptionDetected,
        checksum,
        algorithm: 'sha256',
        corruptionDetected,
        errors: corruptionDetected ? ['File appears to be corrupted'] : [],
      };
    } catch (error) {
      return {
        isIntact: false,
        checksum: '',
        algorithm: 'sha256',
        corruptionDetected: true,
        errors: [
          `Integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      };
    }
  }

  /**
   * Batch file validation
   */
  async validateMultipleFiles(files: FileData[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const file of files) {
      try {
        const result = await this.validateFile(file);
        results.push(result);
      } catch (error) {
        results.push({
          isValid: false,
          errors: [
            `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
        });
      }
    }

    return results;
  }

  /**
   * Check for suspicious patterns in file content
   */
  private checkSuspiciousPatterns(buffer: Buffer): ThreatInfo[] {
    const threats: ThreatInfo[] = [];
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 8192));

    // Check for suspicious URLs
    const suspiciousUrlPatterns = [
      /https?:\/\/[^\s]*\.(tk|ml|ga|cf)\b/gi, // Suspicious TLDs
      /bit\.ly|tinyurl|t\.co/gi, // URL shorteners
    ];

    suspiciousUrlPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        threats.push({
          type: 'suspicious',
          name: 'Suspicious URL',
          severity: 'medium',
          description: 'File contains potentially suspicious URLs',
        });
      }
    });

    // Check for suspicious keywords
    const suspiciousKeywords = [
      'eval\\s*\\(',
      'document\\.write',
      'innerHTML\\s*=',
      'fromCharCode',
      'unescape\\s*\\(',
    ];

    suspiciousKeywords.forEach(keyword => {
      // Use a safer approach for regex creation
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedKeyword, 'gi');
      if (regex.test(content)) {
        threats.push({
          type: 'suspicious',
          name: 'Suspicious Code Pattern',
          severity: 'medium',
          description: `File contains suspicious code pattern: ${keyword}`,
        });
      }
    });

    return threats;
  }

  /**
   * Validate image-specific content
   */
  private validateImageContentInternal(buffer: Buffer): { errors: string[] } {
    const errors: string[] = [];

    try {
      // Check for minimum image size
      if (buffer.length < 100) {
        errors.push('Image file is too small to be valid');
      }

      // Check for image-specific corruption patterns
      const mimeType = MimeTypeValidator.detectMimeType(buffer);

      if (mimeType === 'image/jpeg') {
        // JPEG should end with FFD9
        if (buffer.length >= 2) {
          const lastTwoBytes = buffer.subarray(-2);
          if (!lastTwoBytes.equals(Buffer.from([0xff, 0xd9]))) {
            errors.push('JPEG file appears to be truncated or corrupted');
          }
        }
      }

      if (mimeType === 'image/png') {
        // PNG should end with IEND chunk
        if (buffer.length >= 12) {
          const lastChunk = buffer.subarray(-12);
          if (!lastChunk.subarray(4, 8).equals(Buffer.from('IEND'))) {
            errors.push('PNG file appears to be truncated or corrupted');
          }
        }
      }
    } catch (error) {
      errors.push(
        `Image validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return { errors };
  }

  /**
   * Detect file corruption based on MIME type
   */
  private detectCorruption(buffer: Buffer, mimeType: string): boolean {
    try {
      if (mimeType.startsWith('image/')) {
        const imageValidation = this.validateImageContentInternal(buffer);
        return imageValidation.errors.length > 0;
      }

      // Basic corruption check - file should have some content
      if (buffer.length === 0) {
        return true;
      }

      // Check for null bytes in text files
      if (mimeType.startsWith('text/') || mimeType === 'application/json') {
        const hasNullBytes = buffer.indexOf(0) !== -1;
        return hasNullBytes;
      }

      return false;
    } catch (error) {
      return true; // Assume corrupted if we can't validate
    }
  }

  /**
   * Public method to validate image content (used by workers)
   */
  async validateImageContent(buffer: Buffer): Promise<boolean> {
    const validation = this.validateImageContentInternal(buffer);
    return validation.errors.length === 0;
  }

  /**
   * Comprehensive security validation using enhanced security scanner
   */
  async validateFileSecurity(
    file: FileData,
    uploadContext?: any
  ): Promise<SecurityValidationResult> {
    try {
      securityLogger.info('Starting comprehensive security validation', {
        fileName: file.originalName,
        fileSize: file.size,
        mimeType: file.mimeType,
      });

      // Perform enhanced security scan
      const securityScanResult = await this.securityScanner.scanFile(
        file,
        uploadContext
      );

      // Combine with existing validation
      const basicValidation = await this.validateFile(file);

      // Create comprehensive result
      const result: SecurityValidationResult = {
        isSecure: basicValidation.isValid && securityScanResult.isSecure,
        basicValidation,
        securityScan: securityScanResult,
        overallRiskLevel: this.calculateOverallRisk(
          basicValidation,
          securityScanResult
        ),
        recommendations: [
          ...securityScanResult.recommendations,
          ...(basicValidation.errors.length > 0
            ? ['Fix basic validation errors']
            : []),
        ],
        shouldBlock: this.shouldBlockFile(basicValidation, securityScanResult),
        requiresManualReview: this.requiresManualReview(securityScanResult),
      };

      // Log security validation result
      securityLogger.logSecurityEvent(
        'comprehensive_security_validation',
        result.overallRiskLevel,
        {
          fileName: file.originalName,
          isSecure: result.isSecure,
          shouldBlock: result.shouldBlock,
          requiresManualReview: result.requiresManualReview,
          basicValidationErrors: basicValidation.errors.length,
          securityThreats: securityScanResult.threats.length,
          scanId: securityScanResult.scanId,
        }
      );

      return result;
    } catch (error) {
      securityLogger.error('Security validation failed', error, {
        fileName: file.originalName,
        fileSize: file.size,
      });

      return {
        isSecure: false,
        basicValidation: {
          isValid: false,
          errors: [
            `Security validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
        },
        securityScan: {
          isSecure: false,
          threats: [
            {
              id: `validation_error_${Date.now()}`,
              type: 'unknown',
              severity: 'medium',
              name: 'Validation Error',
              description: 'Security validation process failed',
              confidence: 100,
            },
          ],
          scanTime: 0,
          scanId: `error_${Date.now()}`,
          riskLevel: 'medium',
          recommendations: [
            'Retry security validation',
            'Manual review required',
          ],
        },
        overallRiskLevel: 'high',
        recommendations: [
          'Retry security validation',
          'Manual review required',
        ],
        shouldBlock: true,
        requiresManualReview: true,
      };
    }
  }

  /**
   * Calculate overall risk level combining basic validation and security scan
   */
  private calculateOverallRisk(
    basicValidation: ValidationResult,
    securityScan: SecurityScanResult
  ): 'low' | 'medium' | 'high' | 'critical' {
    // If basic validation fails, at least medium risk
    if (!basicValidation.isValid) {
      const hasHighSeverityErrors = basicValidation.errors.some(
        error =>
          error.toLowerCase().includes('malware') ||
          error.toLowerCase().includes('virus') ||
          error.toLowerCase().includes('threat')
      );

      if (hasHighSeverityErrors) {
        return 'high';
      }

      // Combine with security scan risk
      if (securityScan.riskLevel === 'critical') return 'critical';
      if (securityScan.riskLevel === 'high') return 'high';
      return 'medium';
    }

    // If basic validation passes, use security scan risk level
    return securityScan.riskLevel;
  }

  /**
   * Determine if file should be blocked
   */
  private shouldBlockFile(
    basicValidation: ValidationResult,
    securityScan: SecurityScanResult
  ): boolean {
    // Block if basic validation fails with critical errors
    if (!basicValidation.isValid) {
      const hasCriticalErrors = basicValidation.errors.some(
        error =>
          error.toLowerCase().includes('malware') ||
          error.toLowerCase().includes('virus') ||
          error.toLowerCase().includes('threat') ||
          error.toLowerCase().includes('failed malware scan')
      );

      if (hasCriticalErrors) return true;
    }

    // Block if security scan indicates high or critical risk
    return (
      securityScan.riskLevel === 'high' || securityScan.riskLevel === 'critical'
    );
  }

  /**
   * Determine if file requires manual review
   */
  private requiresManualReview(securityScan: SecurityScanResult): boolean {
    return (
      securityScan.riskLevel === 'medium' ||
      securityScan.riskLevel === 'high' ||
      securityScan.threats.some(threat => threat.confidence < 80)
    );
  }
}

/**
 * Default validation configuration
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  allowedMimeTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  enableMalwareScanning: true,
  enableContentValidation: true,
  enableIntegrityCheck: false, // Can be expensive for large files
  customValidators: [],
};

/**
 * Create a FileValidator instance with default configuration
 */
export function createFileValidator(
  config?: Partial<ValidationConfig>
): FileValidatorService {
  const finalConfig = { ...DEFAULT_VALIDATION_CONFIG, ...config };
  return new FileValidatorService(finalConfig);
}
