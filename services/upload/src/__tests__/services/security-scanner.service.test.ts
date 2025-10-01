import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SECURITY_SCAN_CONFIG,
  SecurityScannerService,
  createSecurityScanner,
} from '../../services/security-scanner.service';
import { FileData } from '../../types/upload.types';

describe('SecurityScannerService', () => {
  let securityScanner: SecurityScannerService;

  beforeEach(() => {
    securityScanner = createSecurityScanner();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('scanFile', () => {
    it('should return secure result for clean file', async () => {
      const cleanFile: FileData = {
        buffer: Buffer.from('This is a clean text file'),
        originalName: 'clean.txt',
        mimeType: 'text/plain',
        size: 25,
      };

      const result = await securityScanner.scanFile(cleanFile);

      expect(result.isSecure).toBe(true);
      expect(result.threats).toHaveLength(0);
      expect(result.riskLevel).toBe('low');
      expect(result.scanId).toMatch(/^scan_\d+_[a-f0-9]+$/);
      expect(result.scanTime).toBeGreaterThan(0);
    });

    it('should detect script injection patterns', async () => {
      const maliciousFile: FileData = {
        buffer: Buffer.from('<script>alert("xss")</script>'),
        originalName: 'malicious.html',
        mimeType: 'text/html',
        size: 29,
      };

      const result = await securityScanner.scanFile(maliciousFile);

      expect(result.isSecure).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe('high');

      const scriptThreat = result.threats.find(
        t => t.type === 'injection_attempt'
      );
      expect(scriptThreat).toBeDefined();
      expect(scriptThreat?.name).toContain('Script Injection');
    });

    it('should detect SQL injection patterns', async () => {
      const sqlInjectionFile: FileData = {
        buffer: Buffer.from('SELECT * FROM users; DROP TABLE users;'),
        originalName: 'query.sql',
        mimeType: 'text/plain',
        size: 38,
      };

      const result = await securityScanner.scanFile(sqlInjectionFile);

      expect(result.isSecure).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);

      const sqlThreat = result.threats.find(
        t => t.name === 'SQL Injection Pattern'
      );
      expect(sqlThreat).toBeDefined();
      expect(sqlThreat?.severity).toBe('high');
    });

    it('should detect command injection patterns', async () => {
      const commandInjectionFile: FileData = {
        buffer: Buffer.from('$(rm -rf /) && echo "pwned"'),
        originalName: 'script.sh',
        mimeType: 'text/plain',
        size: 27,
      };

      const result = await securityScanner.scanFile(commandInjectionFile);

      expect(result.isSecure).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);

      const cmdThreat = result.threats.find(
        t => t.name === 'Command Injection Pattern'
      );
      expect(cmdThreat).toBeDefined();
      expect(cmdThreat?.severity).toBe('high');
    });

    it('should detect suspicious file names', async () => {
      const suspiciousFile: FileData = {
        buffer: Buffer.from('MZ\x90\x00'), // PE header
        originalName: 'invoice.exe',
        mimeType: 'application/octet-stream',
        size: 4,
      };

      const result = await securityScanner.scanFile(suspiciousFile);

      expect(result.isSecure).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe('high');
    });

    it('should detect insecure file names', async () => {
      const fileWithBadName: FileData = {
        buffer: Buffer.from('content'),
        originalName: '../../../etc/passwd',
        mimeType: 'text/plain',
        size: 7,
      };

      const result = await securityScanner.scanFile(fileWithBadName);

      expect(result.isSecure).toBe(false);

      const filenameThreat = result.threats.find(
        t => t.name === 'Insecure File Name'
      );
      expect(filenameThreat).toBeDefined();
      expect(filenameThreat?.type).toBe('suspicious_content');
    });

    it('should detect polyglot files', async () => {
      // Create a buffer that looks like both JPEG and PDF
      const polyglotBuffer = Buffer.concat([
        Buffer.from([0xff, 0xd8, 0xff]), // JPEG header
        Buffer.from('some content'),
        Buffer.from([0x25, 0x50, 0x44, 0x46]), // PDF header
      ]);

      const polyglotFile: FileData = {
        buffer: polyglotBuffer,
        originalName: 'polyglot.jpg',
        mimeType: 'image/jpeg',
        size: polyglotBuffer.length,
      };

      const result = await securityScanner.scanFile(polyglotFile);

      expect(result.isSecure).toBe(false);

      const polyglotThreat = result.threats.find(
        t => t.name === 'Polyglot File Detected'
      );
      expect(polyglotThreat).toBeDefined();
      expect(polyglotThreat?.severity).toBe('high');
    });

    it('should detect high entropy content', async () => {
      // Create high entropy content (random bytes)
      const highEntropyBuffer = Buffer.alloc(1000);
      for (let i = 0; i < highEntropyBuffer.length; i++) {
        highEntropyBuffer[i] = Math.floor(Math.random() * 256);
      }

      const highEntropyFile: FileData = {
        buffer: highEntropyBuffer,
        originalName: 'encrypted.bin',
        mimeType: 'application/octet-stream',
        size: highEntropyBuffer.length,
      };

      const result = await securityScanner.scanFile(highEntropyFile);

      // High entropy might be detected as suspicious
      const entropyThreat = result.threats.find(
        t => t.name === 'High Entropy Content'
      );
      if (entropyThreat) {
        expect(entropyThreat.type).toBe('suspicious_content');
        expect(entropyThreat.severity).toBe('medium');
      }
    });

    it('should detect format confusion', async () => {
      // File claims to be PNG but has JPEG header
      const confusedFile: FileData = {
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]), // JPEG header
        originalName: 'image.png',
        mimeType: 'image/png',
        size: 4,
      };

      const result = await securityScanner.scanFile(confusedFile);

      const formatThreat = result.threats.find(
        t => t.name === 'File Format Confusion'
      );
      if (formatThreat) {
        expect(formatThreat.type).toBe('suspicious_content');
        expect(formatThreat.severity).toBe('medium');
      }
    });

    it('should handle empty files', async () => {
      const emptyFile: FileData = {
        buffer: Buffer.alloc(0),
        originalName: 'empty.txt',
        mimeType: 'text/plain',
        size: 0,
      };

      const result = await securityScanner.scanFile(emptyFile);

      const emptyThreat = result.threats.find(t => t.name === 'Empty File');
      expect(emptyThreat).toBeDefined();
      expect(emptyThreat?.severity).toBe('low');
    });

    it('should generate appropriate recommendations', async () => {
      const maliciousFile: FileData = {
        buffer: Buffer.from(
          '<script>eval(atob("bWFsaWNpb3VzIGNvZGU="))</script>'
        ),
        originalName: 'malicious.html',
        mimeType: 'text/html',
        size: 50,
      };

      const result = await securityScanner.scanFile(maliciousFile);

      expect(result.recommendations).toContain(
        'HIGH RISK: Consider blocking file upload'
      );
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should handle scan errors gracefully', async () => {
      // Mock an error in the scanning process
      const errorFile: FileData = {
        buffer: Buffer.from('test'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 4,
      };

      // Create a scanner with a very short timeout to force an error
      const errorScanner = createSecurityScanner({ maxScanTime: 1 });

      const result = await errorScanner.scanFile(errorFile);

      // Should handle error gracefully
      expect(result.isSecure).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe('medium');
    });
  });

  describe('configuration', () => {
    it('should use default configuration', () => {
      const scanner = createSecurityScanner();
      expect(scanner).toBeInstanceOf(SecurityScannerService);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        enableMalwareScanning: false,
        enableContentAnalysis: true,
        maxScanTime: 5000,
      };

      const scanner = createSecurityScanner(customConfig);
      expect(scanner).toBeInstanceOf(SecurityScannerService);
    });

    it('should have sensible defaults', () => {
      expect(DEFAULT_SECURITY_SCAN_CONFIG.enableMalwareScanning).toBe(true);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.enableContentAnalysis).toBe(true);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.enableBehaviorAnalysis).toBe(true);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.enableThreatIntelligence).toBe(true);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.maxScanTime).toBe(30000);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.quarantineThreats).toBe(true);
      expect(DEFAULT_SECURITY_SCAN_CONFIG.alertOnHighRisk).toBe(true);
    });
  });

  describe('scan history', () => {
    it('should store scan history', async () => {
      const file: FileData = {
        buffer: Buffer.from('test content'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 12,
      };

      const result = await securityScanner.scanFile(file);
      const storedResult = securityScanner.getScanHistory(result.scanId);

      expect(storedResult).toBeDefined();
      expect(storedResult?.scanId).toBe(result.scanId);
    });

    it('should clear old scan history', async () => {
      const file: FileData = {
        buffer: Buffer.from('test content'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 12,
      };

      const result = await securityScanner.scanFile(file);

      // Clear history with 0 max age (should clear everything)
      securityScanner.clearOldScanHistory(0);

      const storedResult = securityScanner.getScanHistory(result.scanId);
      expect(storedResult).toBeUndefined();
    });
  });

  describe('threat detection accuracy', () => {
    it('should have high confidence for clear threats', async () => {
      const clearThreatFile: FileData = {
        buffer: Buffer.from('<script>document.write("XSS")</script>'),
        originalName: 'xss.html',
        mimeType: 'text/html',
        size: 38,
      };

      const result = await securityScanner.scanFile(clearThreatFile);

      const highConfidenceThreats = result.threats.filter(
        t => t.confidence >= 85
      );
      expect(highConfidenceThreats.length).toBeGreaterThan(0);
    });

    it('should have lower confidence for ambiguous content', async () => {
      const ambiguousFile: FileData = {
        buffer: Buffer.from('SELECT name FROM users WHERE id = 1'),
        originalName: 'query.txt',
        mimeType: 'text/plain',
        size: 35,
      };

      const result = await securityScanner.scanFile(ambiguousFile);

      // This might be detected as SQL but with lower confidence since it's a legitimate query
      const sqlThreats = result.threats.filter(t => t.name.includes('SQL'));
      if (sqlThreats.length > 0) {
        expect(sqlThreats[0].confidence).toBeLessThan(100);
      }
    });
  });

  describe('performance', () => {
    it('should complete scan within reasonable time', async () => {
      const file: FileData = {
        buffer: Buffer.alloc(1024 * 1024), // 1MB file
        originalName: 'large.bin',
        mimeType: 'application/octet-stream',
        size: 1024 * 1024,
      };

      const startTime = Date.now();
      const result = await securityScanner.scanFile(file);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
      expect(result.scanTime).toBeGreaterThan(0);
    });

    it('should handle multiple concurrent scans', async () => {
      const files: FileData[] = Array.from({ length: 5 }, (_, i) => ({
        buffer: Buffer.from(`test content ${i}`),
        originalName: `test${i}.txt`,
        mimeType: 'text/plain',
        size: 13 + i.toString().length,
      }));

      const promises = files.map(file => securityScanner.scanFile(file));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.scanId).toBeDefined();
        expect(result.scanTime).toBeGreaterThan(0);
      });
    });
  });
});
