import crypto from 'crypto';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique file identifier
 */
export function generateFileId(): string {
  return uuidv4();
}

/**
 * Generate a secure file path based on file ID and original name
 */
export function generateFilePath(
  fileId: string,
  originalName: string,
  entityType?: string
): string {
  const ext = path.extname(originalName);
  const sanitizedName = sanitizeFileName(path.basename(originalName, ext));
  const datePath = new Date().toISOString().slice(0, 10).replace(/-/g, '/'); // YYYY/MM/DD

  if (entityType) {
    return `${entityType}/${datePath}/${fileId}/${sanitizedName}${ext}`;
  }

  return `uploads/${datePath}/${fileId}/${sanitizedName}${ext}`;
}

/**
 * Sanitize file name to prevent security issues
 */
export function sanitizeFileName(fileName: string): string {
  // Remove or replace dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase()
    .slice(0, 100); // Limit length
}

/**
 * Get file extension from filename or MIME type
 */
export function getFileExtension(fileName: string, mimeType?: string): string {
  const ext = path.extname(fileName);
  if (ext) {
    return ext.toLowerCase();
  }

  // Fallback to MIME type mapping
  if (mimeType) {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        '.docx',
    };

    return mimeToExt[mimeType] || '';
  }

  return '';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * Calculate file checksum
 */
export function calculateChecksum(
  buffer: Buffer,
  algorithm: 'md5' | 'sha1' | 'sha256' = 'sha256'
): string {
  return crypto.createHash(algorithm).update(buffer).digest('hex');
}

/**
 * Check if file is an image based on MIME type
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a document based on MIME type
 */
export function isDocumentFile(mimeType: string): boolean {
  const documentMimes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  return documentMimes.includes(mimeType);
}

/**
 * Get MIME type category
 */
export function getMimeTypeCategory(
  mimeType: string
): 'image' | 'document' | 'video' | 'audio' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (isDocumentFile(mimeType)) return 'document';
  return 'other';
}

/**
 * Generate thumbnail file name
 */
export function generateThumbnailName(
  originalName: string,
  size: string
): string {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  return `${baseName}_thumb_${size}${ext}`;
}

/**
 * Parse file size string (e.g., "10MB", "500KB") to bytes
 */
export function parseFileSize(sizeStr: string): number {
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i);
  if (!match) {
    throw new Error(`Invalid file size format: ${sizeStr}`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return Math.floor(value * multipliers[unit]);
}

/**
 * Validate file name
 */
export function validateFileName(fileName: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!fileName || fileName.trim().length === 0) {
    errors.push('File name cannot be empty');
  }

  if (fileName.length > 255) {
    errors.push('File name is too long (max 255 characters)');
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"|?*]/, // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names (Windows) - eslint-disable-line security/detect-unsafe-regex
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(fileName)) {
      errors.push('File name contains invalid characters or patterns');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
