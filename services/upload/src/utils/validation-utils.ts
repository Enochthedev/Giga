import { FileData } from '../types/upload.types';

/**
 * MIME type validation utilities
 */
export class MimeTypeValidator {
  private static readonly MAGIC_NUMBERS: Record<string, Buffer[]> = {
    'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
    'image/png': [
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ],
    'image/gif': [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
    'image/webp': [Buffer.from('RIFF')],
    'application/pdf': [Buffer.from('%PDF')],
    'application/zip': [
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      Buffer.from([0x50, 0x4b, 0x05, 0x06]),
      Buffer.from([0x50, 0x4b, 0x07, 0x08]),
    ],
  };

  /**
   * Validate MIME type against file content
   */
  static validateMimeType(file: FileData): {
    isValid: boolean;
    detectedType?: string;
    errors: string[];
  } {
    const errors: string[] = [];
    const detectedType = this.detectMimeType(file.buffer);

    if (!detectedType) {
      errors.push('Could not detect file type from content');
      return { isValid: false, errors };
    }

    // Check if detected type matches declared type
    if (detectedType !== file.mimeType) {
      errors.push(
        `MIME type mismatch: declared ${file.mimeType}, detected ${detectedType}`
      );
      return { isValid: false, detectedType, errors };
    }

    return { isValid: true, detectedType, errors: [] };
  }

  /**
   * Detect MIME type from file buffer
   */
  static detectMimeType(buffer: Buffer): string | null {
    for (const [mimeType, signatures] of Object.entries(this.MAGIC_NUMBERS)) {
      for (const signature of signatures) {
        if (buffer.subarray(0, signature.length).equals(signature)) {
          return mimeType;
        }
      }
    }

    // Special case for WebP (needs additional check)
    if (
      buffer.subarray(0, 4).equals(Buffer.from('RIFF')) &&
      buffer.subarray(8, 12).equals(Buffer.from('WEBP'))
    ) {
      return 'image/webp';
    }

    return null;
  }

  /**
   * Check if MIME type is allowed
   */
  static isAllowedMimeType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }
}

/**
 * File size validation utilities
 */
export class FileSizeValidator {
  /**
   * Validate file size against limits
   */
  static validateSize(
    file: FileData,
    maxSize: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (file.size <= 0) {
      errors.push('File is empty');
    }

    if (file.size > maxSize) {
      errors.push(
        `File size (${this.formatBytes(file.size)}) exceeds maximum allowed size (${this.formatBytes(maxSize)})`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format bytes to human readable string
   */
  private static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

/**
 * Content validation utilities
 */
export class ContentValidator {
  /**
   * Check for embedded content in files
   */
  static checkForEmbeddedContent(buffer: Buffer): {
    hasEmbedded: boolean;
    types: string[];
  } {
    const embeddedTypes: string[] = [];

    // Check for embedded scripts
    if (this.containsScript(buffer)) {
      embeddedTypes.push('script');
    }

    // Check for embedded executables
    if (this.containsExecutable(buffer)) {
      embeddedTypes.push('executable');
    }

    // Check for embedded archives
    if (this.containsArchive(buffer)) {
      embeddedTypes.push('archive');
    }

    return {
      hasEmbedded: embeddedTypes.length > 0,
      types: embeddedTypes,
    };
  }

  /**
   * Check for script content
   */
  private static containsScript(buffer: Buffer): boolean {
    const scriptPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];

    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 8192));
    return scriptPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check for executable content
   */
  private static containsExecutable(buffer: Buffer): boolean {
    // Check for PE header (Windows executables)
    if (buffer.length >= 64) {
      const peOffset = buffer.readUInt32LE(60);
      if (peOffset < buffer.length - 4) {
        const peSignature = buffer.subarray(peOffset, peOffset + 4);
        if (peSignature.equals(Buffer.from('PE\0\0'))) {
          return true;
        }
      }
    }

    // Check for ELF header (Linux executables)
    if (
      buffer.length >= 4 &&
      buffer.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))
    ) {
      return true;
    }

    // Check for Mach-O header (macOS executables)
    const machOSignatures = [
      Buffer.from([0xfe, 0xed, 0xfa, 0xce]),
      Buffer.from([0xfe, 0xed, 0xfa, 0xcf]),
      Buffer.from([0xce, 0xfa, 0xed, 0xfe]),
      Buffer.from([0xcf, 0xfa, 0xed, 0xfe]),
    ];

    return machOSignatures.some(
      signature => buffer.length >= 4 && buffer.subarray(0, 4).equals(signature)
    );
  }

  /**
   * Check for archive content
   */
  private static containsArchive(buffer: Buffer): boolean {
    // ZIP signatures
    const zipSignatures = [
      Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      Buffer.from([0x50, 0x4b, 0x05, 0x06]),
      Buffer.from([0x50, 0x4b, 0x07, 0x08]),
    ];

    // RAR signature
    const rarSignature = Buffer.from('Rar!');

    // 7z signature
    const sevenZipSignature = Buffer.from([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]);

    return (
      zipSignatures.some(sig => buffer.subarray(0, sig.length).equals(sig)) ||
      (buffer.length >= 4 && buffer.subarray(0, 4).equals(rarSignature)) ||
      (buffer.length >= 6 && buffer.subarray(0, 6).equals(sevenZipSignature))
    );
  }
}

/**
 * Image validation utilities
 */
export class ImageValidator {
  /**
   * Validate image dimensions
   */
  static validateDimensions(
    width: number,
    height: number,
    constraints: {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
    }
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (constraints.minWidth && width < constraints.minWidth) {
      errors.push(
        `Image width (${width}px) is below minimum (${constraints.minWidth}px)`
      );
    }

    if (constraints.maxWidth && width > constraints.maxWidth) {
      errors.push(
        `Image width (${width}px) exceeds maximum (${constraints.maxWidth}px)`
      );
    }

    if (constraints.minHeight && height < constraints.minHeight) {
      errors.push(
        `Image height (${height}px) is below minimum (${constraints.minHeight}px)`
      );
    }

    if (constraints.maxHeight && height > constraints.maxHeight) {
      errors.push(
        `Image height (${height}px) exceeds maximum (${constraints.maxHeight}px)`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate aspect ratio
   */
  static validateAspectRatio(
    width: number,
    height: number,
    expectedRatio: number,
    tolerance: number = 0.1
  ): { isValid: boolean; actualRatio: number; errors: string[] } {
    const actualRatio = width / height;
    const difference = Math.abs(actualRatio - expectedRatio);
    const isValid = difference <= tolerance;

    const errors = isValid
      ? []
      : [
          `Aspect ratio (${actualRatio.toFixed(2)}) does not match expected ratio (${expectedRatio.toFixed(2)})`,
        ];

    return {
      isValid,
      actualRatio,
      errors,
    };
  }
}
