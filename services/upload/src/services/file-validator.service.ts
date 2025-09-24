import { FileData, ValidationResult } from '../types/upload.types';

export class FileValidator {
  private static instance: FileValidator;
  private maxFileSize: number;
  private allowedImageTypes: string[];
  private allowedDocumentTypes: string[];

  private constructor() {
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    this.allowedImageTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(',');
    this.allowedDocumentTypes = (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf,text/plain').split(',');
  }

  static getInstance(): FileValidator {
    if (!FileValidator.instance) {
      FileValidator.instance = new FileValidator();
    }
    return FileValidator.instance;
  }

  /**
   * Validate a file for upload
   */
  validateFile(file: FileData): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (!this.validateFileSize(file, this.maxFileSize)) {
      errors.push(`File size ${file.size} bytes exceeds maximum allowed size of ${this.maxFileSize} bytes`);
    }

    // Check MIME type
    if (!this.validateMimeType(file)) {
      errors.push(`File type ${file.mimeType} is not allowed`);
    }

    // Check file name
    const sanitizedName = this.sanitizeFileName(file.originalName);
    if (sanitizedName !== file.originalName) {
      warnings.push('File name was sanitized for security');
    }

    // Check for suspicious file characteristics
    if (this.hasSuspiciousCharacteristics(file)) {
      errors.push('File has suspicious characteristics and cannot be uploaded');
    }

    // TODO: Add virus scanning
    // const scanResult = await this.scanForMalware(file);
    // if (!scanResult.isClean) {
    //   errors.push('File failed malware scan');
    // }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate file size
   */
  validateFileSize(file: FileData, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * Validate MIME type
   */
  validateMimeType(file: FileData): boolean {
    const allAllowedTypes = [...this.allowedImageTypes, ...this.allowedDocumentTypes];
    return allAllowedTypes.includes(file.mimeType.toLowerCase());
  }

  /**
   * Sanitize file name to prevent security issues
   */
  sanitizeFileName(fileName: string): string {
    if (!fileName) return 'unnamed';

    // Remove path separators and dangerous characters
    let sanitized = fileName
      .replace(/[<>:"/\\|?*]/g, '') // Remove dangerous characters
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/^\.+/, '') // Remove leading dots
      .trim();

    // Ensure we have a valid filename
    if (!sanitized || sanitized.length === 0) {
      sanitized = 'unnamed';
    }

    // Limit length
    if (sanitized.length > 255) {
      const ext = sanitized.substring(sanitized.lastIndexOf('.'));
      sanitized = sanitized.substring(0, 255 - ext.length) + ext;
    }

    return sanitized;
  }

  /**
   * Check for suspicious file characteristics
   */
  private hasSuspiciousCharacteristics(file: FileData): boolean {
    // Check for files that are too small (might be malicious)
    if (file.size < 10) {
      return true;
    }

    // Check for suspicious file extensions in the name
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar'];
    const fileName = file.originalName.toLowerCase();

    for (const ext of suspiciousExtensions) {
      if (fileName.includes(ext)) {
        return true;
      }
    }

    // Check for MIME type spoofing (basic check)
    if (this.isPotentialMimeTypeSpoofing(file)) {
      return true;
    }

    return false;
  }

  /**
   * Basic MIME type spoofing detection
   */
  private isPotentialMimeTypeSpoofing(file: FileData): boolean {
    const fileName = file.originalName.toLowerCase();
    const mimeType = file.mimeType.toLowerCase();

    // Check if file extension matches MIME type
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return !mimeType.includes('jpeg');
    }

    if (fileName.endsWith('.png')) {
      return !mimeType.includes('png');
    }

    if (fileName.endsWith('.gif')) {
      return !mimeType.includes('gif');
    }

    if (fileName.endsWith('.pdf')) {
      return !mimeType.includes('pdf');
    }

    return false;
  }

  /**
   * Scan file for malware (placeholder for future implementation)
   */
  scanForMalware(_file: FileData): Promise<{ isClean: boolean; details?: string }> {
    // TODO: Implement actual virus scanning
    // This could integrate with ClamAV, VirusTotal API, or other scanning services

    if (process.env.ENABLE_VIRUS_SCANNING === 'true') {
      // Placeholder for actual scanning logic
      console.log('Virus scanning not yet implemented');
    }

    return { isClean: true };
  }

  /**
   * Get allowed file types for a specific category
   */
  getAllowedTypes(category: 'image' | 'document' | 'all'): string[] {
    switch (category) {
      case 'image':
        return [...this.allowedImageTypes];
      case 'document':
        return [...this.allowedDocumentTypes];
      case 'all':
      default:
        return [...this.allowedImageTypes, ...this.allowedDocumentTypes];
    }
  }

  /**
   * Check if file type is allowed for specific category
   */
  isAllowedForCategory(mimeType: string, category: 'image' | 'document'): boolean {
    const allowedTypes = this.getAllowedTypes(category);
    return allowedTypes.includes(mimeType.toLowerCase());
  }
}

export default FileValidator;