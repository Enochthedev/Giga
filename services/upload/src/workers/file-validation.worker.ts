import fs from 'fs/promises';
import { Job } from 'bull';
import {
  FileValidationJobData,
  QueueProcessor,
} from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { FileValidatorService } from '../services/file-validator.service';
import { ValidationIssue, ValidationResult } from '../types/job.types';

export class FileValidationWorker
  implements QueueProcessor<FileValidationJobData>
{
  private fileValidatorService: FileValidatorService;

  constructor() {
    this.fileValidatorService = new FileValidatorService({
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
      enableMalwareScanning: true,
      enableContentValidation: true,
      enableIntegrityCheck: true,
    });
  }
  async process(job: Job<FileValidationJobData>): Promise<ValidationResult> {
    const { fileId, filePath, originalName, mimeType, size } = job.data;

    logger.info(`Starting file validation for file ${fileId}`);

    try {
      await job.progress(10);

      // Check if file exists
      const fileExists = await this.fileExists(filePath);
      if (!fileExists) {
        throw new Error(`File not found: ${filePath}`);
      }

      const issues: ValidationIssue[] = [];
      const metadata: Record<string, any> = {};

      await job.progress(20);

      // Validate file signature and MIME type
      const buffer = await fs.readFile(filePath);
      const actualMimeType = await this.detectMimeType(buffer);
      metadata.actualMimeType = actualMimeType;
      metadata.fileSignature = buffer.slice(0, 16).toString('hex');

      if (actualMimeType !== mimeType) {
        issues.push({
          type: 'mime_type_mismatch',
          message: `Expected ${mimeType}, but detected ${actualMimeType}`,
          severity: 'warning',
        });
      }

      await job.progress(40);

      // Validate file size
      const stats = await fs.stat(filePath);
      if (stats.size !== size) {
        logger.warn(
          `File size mismatch for ${fileId}: expected ${size}, actual ${stats.size}`
        );
      }

      // Check file size limits
      const maxSize = this.getMaxFileSize(mimeType);
      if (stats.size > maxSize) {
        issues.push({
          type: 'size_exceeded',
          message: `File size ${stats.size} exceeds maximum allowed size ${maxSize}`,
          severity: 'error',
        });
      }

      await job.progress(60);

      // Perform virus scan (mock implementation)
      const virusScanResult = await this.performVirusScan(buffer);
      metadata.virusScanResult = virusScanResult;

      if (virusScanResult === 'infected') {
        issues.push({
          type: 'virus_detected',
          message: 'Malicious content detected in file',
          severity: 'error',
        });
      }

      await job.progress(80);

      // Validate file content based on type
      if (mimeType.startsWith('image/')) {
        const imageValidation = await this.validateImageContent(buffer);
        if (!imageValidation.valid) {
          issues.push({
            type: 'invalid_signature',
            message: imageValidation.error || 'Invalid image content',
            severity: 'error',
          });
        }
      }

      await job.progress(90);

      const isValid = !issues.some(issue => issue.severity === 'error');

      // Update file validation status in database
      await this.updateFileValidation(fileId, isValid, issues, metadata);

      await job.progress(100);

      logger.info(
        `File validation completed for file ${fileId}: ${isValid ? 'valid' : 'invalid'}`
      );

      return {
        valid: isValid,
        fileId,
        issues: issues.length > 0 ? issues : undefined,
        metadata,
      };
    } catch (error) {
      logger.error(`File validation failed for file ${fileId}:`, error);

      // Mark file as validation failed
      await this.updateFileValidation(fileId, false, [
        {
          type: 'invalid_signature',
          message: error instanceof Error ? error.message : 'Validation error',
          severity: 'error',
        },
      ]);

      return {
        valid: false,
        fileId,
        issues: [
          {
            type: 'invalid_signature',
            message:
              error instanceof Error ? error.message : 'Validation error',
            severity: 'error',
          },
        ],
      };
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async detectMimeType(buffer: Buffer): Promise<string> {
    // Simple MIME type detection based on file signatures
    const signatures: Record<string, string> = {
      '89504e47': 'image/png',
      ffd8ffe0: 'image/jpeg',
      ffd8ffe1: 'image/jpeg',
      ffd8ffe2: 'image/jpeg',
      '47494638': 'image/gif',
      '52494646': 'image/webp', // RIFF header, need to check further
      '25504446': 'application/pdf',
      '504b0304': 'application/zip',
      '504b0506': 'application/zip',
      '504b0708': 'application/zip',
    };

    const header = buffer.slice(0, 4).toString('hex');

    // Special case for WebP
    if (header === '52494646' && buffer.slice(8, 12).toString() === 'WEBP') {
      return 'image/webp';
    }

    return signatures[header] || 'application/octet-stream';
  }

  private getMaxFileSize(mimeType: string): number {
    // Define size limits based on MIME type (in bytes)
    const sizeLimits: Record<string, number> = {
      'image/jpeg': 10 * 1024 * 1024, // 10MB
      'image/png': 10 * 1024 * 1024, // 10MB
      'image/gif': 5 * 1024 * 1024, // 5MB
      'image/webp': 10 * 1024 * 1024, // 10MB
      'application/pdf': 25 * 1024 * 1024, // 25MB
      'video/mp4': 100 * 1024 * 1024, // 100MB
      'video/quicktime': 100 * 1024 * 1024, // 100MB
    };

    return sizeLimits[mimeType] || 5 * 1024 * 1024; // Default 5MB
  }

  private async performVirusScan(
    buffer: Buffer
  ): Promise<'clean' | 'infected' | 'suspicious'> {
    // Mock virus scan implementation
    // In a real implementation, this would integrate with ClamAV or similar

    // Check for some basic suspicious patterns
    const suspiciousPatterns = [
      Buffer.from('eval('),
      Buffer.from('<script'),
      Buffer.from('javascript:'),
      Buffer.from('vbscript:'),
    ];

    for (const pattern of suspiciousPatterns) {
      if (buffer.includes(pattern)) {
        return 'suspicious';
      }
    }

    // Simulate random scan results for testing
    const random = Math.random();
    if (random < 0.001) {
      // 0.1% chance of infected
      return 'infected';
    } else if (random < 0.01) {
      // 1% chance of suspicious
      return 'suspicious';
    }

    return 'clean';
  }

  private async validateImageContent(
    buffer: Buffer
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // Use the existing file validator service for image validation
      const result =
        await this.fileValidatorService.validateImageContent(buffer);
      return { valid: result };
    } catch (error) {
      return {
        valid: false,
        error:
          error instanceof Error ? error.message : 'Image validation failed',
      };
    }
  }

  private async updateFileValidation(
    fileId: string,
    isValid: boolean,
    issues: ValidationIssue[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const status = isValid ? 'validated' : 'validation_failed';

    await prisma.fileMetadata.update({
      where: { id: fileId },
      data: {
        status: status as any,
        metadata: {
          validation: {
            valid: isValid,
            issues: issues as any,
            validatedAt: new Date().toISOString(),
            ...metadata,
          },
        } as any,
      },
    });
  }
}

export const fileValidationWorker = new FileValidationWorker();
