import { FileData } from '../types/upload.types';

/**
 * Image processing interface for handling image transformations and optimizations
 */
export interface IImageProcessor {
  processImage(
    file: FileData,
    options: ProcessingOptions
  ): Promise<ProcessedImage>;
  generateThumbnails(
    imageId: string,
    sizes: ThumbnailSize[]
  ): Promise<ThumbnailResult[]>;
  optimizeForWeb(imageId: string): Promise<OptimizedImage>;
  convertFormat(
    imageId: string,
    targetFormat: ImageFormat
  ): Promise<ConvertedImage>;
  extractMetadata(file: FileData): Promise<ImageMetadata>;

  // Batch processing
  processMultipleImages(
    files: FileData[],
    options: ProcessingOptions
  ): Promise<ProcessedImage[]>;

  // Validation
  validateImageFile(file: FileData): Promise<ImageValidationResult>;
}

export interface ProcessingOptions {
  resize?: {
    width: number;
    height: number;
    fit: 'cover' | 'contain' | 'fill';
  };
  format?: ImageFormat;
  quality?: number;
  generateThumbnails?: ThumbnailSize[];
  optimize?: boolean;
  removeMetadata?: boolean;
}

export interface ProcessedImage {
  success: boolean;
  originalFile: FileData;
  processedFile: FileData;
  metadata: ImageMetadata;
  processingTime: number;
  compressionRatio: number;
  error?: string;
}

export interface ThumbnailSize {
  width: number;
  height: number;
  name: string; // e.g., "small", "medium", "large"
  quality?: number;
}

export interface ThumbnailResult {
  size: ThumbnailSize;
  file: FileData;
  url: string;
  success: boolean;
  error?: string;
}

export interface OptimizedImage {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: ImageFormat;
  file: FileData;
  url: string;
}

export interface ConvertedImage {
  originalFormat: ImageFormat;
  targetFormat: ImageFormat;
  file: FileData;
  url: string;
  sizeChange: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: ImageFormat;
  colorSpace: string;
  hasAlpha: boolean;
  density?: number;
  exif?: Record<string, any>;
  icc?: Record<string, any>;
}

export interface ImageValidationResult {
  isValid: boolean;
  format?: ImageFormat;
  dimensions?: {
    width: number;
    height: number;
  };
  errors: string[];
  warnings: string[];
}

export type ImageFormat =
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'avif'
  | 'tiff'
  | 'gif'
  | 'svg';
