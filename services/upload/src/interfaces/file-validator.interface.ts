import { FileData } from '../types/upload.types';

/**
 * File validation interface for security and format validation
 */
export interface IFileValidator {
  validateFile(file: FileData): Promise<ValidationResult>;
  scanForMalware(file: FileData): Promise<ScanResult>;
  validateMimeType(file: FileData, allowedTypes: string[]): boolean;
  validateFileSize(file: FileData, maxSize: number): boolean;
  sanitizeFileName(fileName: string): string;

  // Advanced validation
  validateFileContent(file: FileData): Promise<ContentValidationResult>;
  checkFileIntegrity(file: FileData): Promise<IntegrityResult>;

  // Batch validation
  validateMultipleFiles(files: FileData[]): Promise<ValidationResult[]>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  fileInfo?: {
    detectedMimeType: string;
    actualSize: number;
    sanitizedName: string;
  };
}

export interface ScanResult {
  isClean: boolean;
  threats: ThreatInfo[];
  scanTime: number;
  scannerVersion?: string;
}

export interface ThreatInfo {
  type: 'virus' | 'malware' | 'suspicious' | 'unknown';
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

export interface ContentValidationResult {
  isValid: boolean;
  contentType: string;
  actualMimeType: string;
  mimeTypeMismatch: boolean;
  hasEmbeddedContent: boolean;
  embeddedContentTypes?: string[];
  errors: string[];
}

export interface IntegrityResult {
  isIntact: boolean;
  checksum: string;
  algorithm: 'md5' | 'sha1' | 'sha256';
  corruptionDetected: boolean;
  errors: string[];
}

export interface ValidationConfig {
  allowedMimeTypes: string[];
  maxFileSize: number;
  enableMalwareScanning: boolean;
  enableContentValidation: boolean;
  enableIntegrityCheck: boolean;
  customValidators?: CustomValidator[];
}

export interface CustomValidator {
  name: string;
  validate: (file: FileData) => Promise<ValidationResult>;
}

export interface SecurityValidationResult {
  isSecure: boolean;
  basicValidation: ValidationResult;
  securityScan: {
    isSecure: boolean;
    threats: Array<{
      id: string;
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      name: string;
      description: string;
      confidence: number;
    }>;
    scanTime: number;
    scanId: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
  };
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  shouldBlock: boolean;
  requiresManualReview: boolean;
}
