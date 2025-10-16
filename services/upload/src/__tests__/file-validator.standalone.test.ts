import { beforeEach, describe, expect, it } from 'vitest';
import { ValidationConfig } from '../interfaces/file-validator.interface';
import {
  DEFAULT_VALIDATION_CONFIG,
  FileValidatorService,
  createFileValidator,
} from '../services/file-validator.service';
import { FileData } from '../types/upload.types';

describe('FileValidatorService (Standalone)', () => {
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
  });

  describe('sanitizeFileName', () => {
    it('should keep valid filename unchanged', () => {
      const result = validator.sanitizeFileName('test.jpg');
      expect(result).toBe('test.jpg');
    });

    it('should replace dangerous characters', () => {
      const result = validator.sanitizeFileName('test<>:"/\\|?*.jpg');
      expect(result).toBe('test_.jpg');
    });

    it('should remove leading dots', () => {
      const result = validator.sanitizeFileName('...test.jpg');
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

    it('should truncate very long filenames', () => {
      const longName = 'a'.repeat(300) + '.jpg';
      const result = validator.sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
      expect(result.endsWith('.jpg')).toBe(true);
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
});
