import { beforeEach, describe, expect, it } from 'vitest';
import { ValidationConfig } from '../../interfaces/file-validator.interface';
import {
  DEFAULT_VALIDATION_CONFIG,
  FileValidatorService,
  createFileValidator,
} from '../../services/file-validator.service';
import { FileData } from '../../types/upload.types';

describe('FileValidatorService', () => {
  let validator: FileValidatorService;
  let config: ValidationConfig;

  beforeEach(() => {
    config = { ...DEFAULT_VALIDATION_CONFIG };
    validator = new FileValidatorService(config);
  });

  describe('validateFile', () => {
    it('should validate a valid JPEG file', async () => {
      const jpegBuffer = Buffer.from([
        0xff,
        0xd8,
        0xff,
        0xe0, // JPEG header
        ...Array(100).fill(0x00), // Some content
        0xff,
        0xd9, // JPEG end marker
      ]);

      const file: FileData = {
        buffer: jpegBuffer,
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: jpegBuffer.length,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fileInfo?.detectedMimeType).toBe('image/jpeg');
      expect(result.fileInfo?.sanitizedName).toBe('test.jpg');
    });

    it('should validate a valid PNG file', async () => {
      const pngBuffer = Buffer.from([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG signature
        ...Array(100).fill(0x00), // Some content
        0x00,
        0x00,
        0x00,
        0x00,
        0x49,
        0x45,
        0x4e,
        0x44,
        0xae,
        0x42,
        0x60,
        0x82, // IEND chunk
      ]);

      const file: FileData = {
        buffer: pngBuffer,
        originalName: 'test.png',
        mimeType: 'image/png',
        size: pngBuffer.length,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fileInfo?.detectedMimeType).toBe('image/png');
    });

    it('should reject empty file buffer', async () => {
      const file: FileData = {
        buffer: Buffer.alloc(0),
        originalName: 'empty.jpg',
        mimeType: 'image/jpeg',
        size: 0,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File buffer is empty');
    });

    it('should reject file without name', async () => {
      const file: FileData = {
        buffer: Buffer.from([0xff, 0xd8, 0xff]),
        originalName: '',
        mimeType: 'image/jpeg',
        size: 3,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File name is required');
    });

    it('should reject file with disallowed MIME type', async () => {
      const file: FileData = {
        buffer: Buffer.from([0x00, 0x01, 0x02]),
        originalName: 'test.exe',
        mimeType: 'application/x-executable',
        size: 3,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject oversized file', async () => {
      const largeBuffer = Buffer.alloc(config.maxFileSize + 1);
      const file: FileData = {
        buffer: largeBuffer,
        originalName: 'large.jpg',
        mimeType: 'image/jpeg',
        size: largeBuffer.length,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(error => error.includes('exceeds maximum'))
      ).toBe(true);
    });

    it('should detect MIME type mismatch', async () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      const file: FileData = {
        buffer: pngBuffer,
        originalName: 'fake.jpg',
        mimeType: 'image/jpeg', // Wrong MIME type
        size: pngBuffer.length,
      };

      const result = await validator.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(error => error.includes('MIME type mismatch'))
      ).toBe(true);
    });
  });

  describe('validateMimeType', () => {
    it('should validate allowed MIME type', () => {
      const file: FileData = {
        buffer: Buffer.from([0xff, 0xd8, 0xff]),
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 3,
      };

      const result = validator.validateMimeType(file, [
        'image/jpeg',
        'image/png',
      ]);
      expect(result).toBe(true);
    });

    it('should reject disallowed MIME type', () => {
      const file: FileData = {
        buffer: Buffer.from([0x00, 0x01, 0x02]),
        originalName: 'test.exe',
        mimeType: 'application/x-executable',
        size: 3,
      };

      const result = validator.validateMimeType(file, [
        'image/jpeg',
        'image/png',
      ]);
      expect(result).toBe(false);
    });

    it('should allow any MIME type when no restrictions', () => {
      const file: FileData = {
        buffer: Buffer.from([0x00, 0x01, 0x02]),
        originalName: 'test.exe',
        mimeType: 'application/x-executable',
        size: 3,
      };

      const result = validator.validateMimeType(file, []);
      expect(result).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    it('should validate file within size limit', () => {
      const file: FileData = {
        buffer: Buffer.alloc(1000),
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1000,
      };

      const result = validator.validateFileSize(file, 2000);
      expect(result).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const file: FileData = {
        buffer: Buffer.alloc(3000),
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 3000,
      };

      const result = validator.validateFileSize(file, 2000);
      expect(result).toBe(false);
    });

    it('should reject empty file', () => {
      const file: FileData = {
        buffer: Buffer.alloc(0),
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 0,
      };

      const result = validator.validateFileSize(file, 2000);
      expect(result).toBe(false);
    });
  });

  describe('sanitizeFileName', () => {
    it('should keep valid filename unchanged', () => {
      const result = validator.sanitizeFileName('test.jpg');
      expect(result).toBe('test.jpg');
    });

    it('should replace dangerous characters', () => {
      const result = validator.sanitizeFileName('test<>:"/\\|?*.jpg');
      expect(result).toBe('test_________.jpg');
    });

    it('should remove leading dots', () => {
      const result = validator.sanitizeFileName('...test.jpg');
      expect(result).toBe('test.jpg');
    });

    it('should remove trailing dots', () => {
      const result = validator.sanitizeFileName('test.jpg...');
      expect(result).toBe('test.jpg');
    });

    it('should replace spaces with underscores', () => {
      const result = validator.sanitizeFileName('my test file.jpg');
      expect(result).toBe('my_test_file.jpg');
    });

    it('should handle empty filename', () => {
      const result = validator.sanitizeFileName('');
      expect(result).toBe('unnamed_file');
    });

    it('should handle null filename', () => {
      const result = validator.sanitizeFileName(null as any);
      expect(result).toBe('unnamed_file');
    });

    it('should truncate very long filenames', () => {
      const longName = 'a'.repeat(300) + '.jpg';
      const result = validator.sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
      expect(result.endsWith('.jpg')).toBe(true);
    });

    it('should remove leading and trailing special characters', () => {
      const result = validator.sanitizeFileName('_-test.jpg-_');
      expect(result).toBe('test.jpg');
    });
  });

  describe('scanForMalware', () => {
    it('should pass clean file', async () => {
      const cleanBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      const file: FileData = {
        buffer: cleanBuffer,
        originalName: 'clean.jpg',
        mimeType: 'image/jpeg',
        size: cleanBuffer.length,
      };

      const result = await validator.scanForMalware(file);

      expect(result.isClean).toBe(true);
      expect(result.threats).toHaveLength(0);
      expect(result.scanTime).toBeGreaterThan(0);
    });

    it('should detect suspicious script content', async () => {
      const suspiciousBuffer = Buffer.from('<script>alert("xss")</script>');
      const file: FileData = {
        buffer: suspiciousBuffer,
        originalName: 'suspicious.html',
        mimeType: 'text/html',
        size: suspiciousBuffer.length,
      };

      const result = await validator.scanForMalware(file);

      expect(result.isClean).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.threats.some(threat => threat.type === 'suspicious')).toBe(
        true
      );
    });

    it('should detect executable content', async () => {
      const executableBuffer = Buffer.from([0x7f, 0x45, 0x4c, 0x46]); // ELF header
      const file: FileData = {
        buffer: executableBuffer,
        originalName: 'malware.bin',
        mimeType: 'application/octet-stream',
        size: executableBuffer.length,
      };

      const result = await validator.scanForMalware(file);

      expect(result.isClean).toBe(false);
      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.threats.some(threat => threat.type === 'malware')).toBe(
        true
      );
    });
  });

  describe('validateFileContent', () => {
    it('should validate matching MIME type and content', async () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      const file: FileData = {
        buffer: jpegBuffer,
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: jpegBuffer.length,
      };

      const result = await validator.validateFileContent(file);

      expect(result.isValid).toBe(true);
      expect(result.mimeTypeMismatch).toBe(false);
      expect(result.actualMimeType).toBe('image/jpeg');
    });

    it('should detect MIME type mismatch', async () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      const file: FileData = {
        buffer: pngBuffer,
        originalName: 'fake.jpg',
        mimeType: 'image/jpeg',
        size: pngBuffer.length,
      };

      const result = await validator.validateFileContent(file);

      expect(result.mimeTypeMismatch).toBe(true);
      expect(result.actualMimeType).toBe('image/png');
      expect(result.contentType).toBe('image/jpeg');
    });

    it('should detect embedded content', async () => {
      const scriptBuffer = Buffer.from('<script>alert("test")</script>');
      const file: FileData = {
        buffer: scriptBuffer,
        originalName: 'test.html',
        mimeType: 'text/html',
        size: scriptBuffer.length,
      };

      const result = await validator.validateFileContent(file);

      expect(result.hasEmbeddedContent).toBe(true);
      expect(result.embeddedContentTypes).toContain('script');
    });
  });

  describe('checkFileIntegrity', () => {
    it('should generate checksum for valid file', async () => {
      const buffer = Buffer.from('test content');
      const file: FileData = {
        buffer,
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: buffer.length,
      };

      const result = await validator.checkFileIntegrity(file);

      expect(result.isIntact).toBe(true);
      expect(result.checksum).toBeTruthy();
      expect(result.algorithm).toBe('sha256');
      expect(result.corruptionDetected).toBe(false);
    });

    it('should detect corrupted JPEG', async () => {
      const corruptedJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x01]); // Missing end marker
      const file: FileData = {
        buffer: corruptedJpeg,
        originalName: 'corrupted.jpg',
        mimeType: 'image/jpeg',
        size: corruptedJpeg.length,
      };

      const result = await validator.checkFileIntegrity(file);

      expect(result.corruptionDetected).toBe(true);
      expect(result.isIntact).toBe(false);
    });
  });

  describe('validateMultipleFiles', () => {
    it('should validate multiple files', async () => {
      const files: FileData[] = [
        {
          buffer: Buffer.from([0xff, 0xd8, 0xff]),
          originalName: 'test1.jpg',
          mimeType: 'image/jpeg',
          size: 3,
        },
        {
          buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
          originalName: 'test2.png',
          mimeType: 'image/png',
          size: 4,
        },
      ];

      const results = await validator.validateMultipleFiles(files);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(true);
    });

    it('should handle mixed valid and invalid files', async () => {
      const files: FileData[] = [
        {
          buffer: Buffer.from([0xff, 0xd8, 0xff]),
          originalName: 'valid.jpg',
          mimeType: 'image/jpeg',
          size: 3,
        },
        {
          buffer: Buffer.alloc(0),
          originalName: 'invalid.jpg',
          mimeType: 'image/jpeg',
          size: 0,
        },
      ];

      const results = await validator.validateMultipleFiles(files);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
    });
  });

  describe('createFileValidator', () => {
    it('should create validator with default config', () => {
      const validator = createFileValidator();
      expect(validator).toBeInstanceOf(FileValidatorService);
    });

    it('should create validator with custom config', () => {
      const customConfig = {
        maxFileSize: 5 * 1024 * 1024,
        enableMalwareScanning: false,
      };

      const validator = createFileValidator(customConfig);
      expect(validator).toBeInstanceOf(FileValidatorService);
    });
  });

  describe('edge cases', () => {
    it('should handle very small files', async () => {
      const tinyBuffer = Buffer.from([0x01]);
      const file: FileData = {
        buffer: tinyBuffer,
        originalName: 'tiny.bin',
        mimeType: 'application/octet-stream',
        size: 1,
      };

      const result = await validator.validateFile(file);
      // Should not crash, may or may not be valid depending on config
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should handle files with unicode names', async () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff]);
      const unicodeName = '测试文件.jpg';

      const sanitized = validator.sanitizeFileName(unicodeName);
      expect(sanitized).toBeTruthy();
      expect(sanitized.length).toBeGreaterThan(0);
    });

    it('should handle binary data in text files', async () => {
      const binaryInText = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      const file: FileData = {
        buffer: binaryInText,
        originalName: 'binary.txt',
        mimeType: 'text/plain',
        size: binaryInText.length,
      };

      const integrity = await validator.checkFileIntegrity(file);
      expect(integrity.corruptionDetected).toBe(true);
    });
  });
});
