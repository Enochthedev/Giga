import fs from 'fs/promises';
import path from 'path';
import { Job } from 'bull';
import sharp from 'sharp';
import {
  ImageProcessingJobData,
  QueueProcessor,
} from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { ProcessedFile, ProcessingResult } from '../types/job.types';

export class ImageProcessingWorker
  implements QueueProcessor<ImageProcessingJobData>
{
  async process(job: Job<ImageProcessingJobData>): Promise<ProcessingResult> {
    const {
      fileId,
      filePath,
      originalName,
      mimeType: _mimeType,
      entityType: _entityType,
      entityId: _entityId,
      processingOptions,
    } = job.data;

    logger.info(`Starting image processing for file ${fileId}`);

    try {
      // Update job progress
      await job.progress(10);

      // Validate that the file exists
      const fileExists = await this.fileExists(filePath);
      if (!fileExists) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Update processing status in database
      await this.updateFileStatus(fileId, 'processing');
      await job.progress(20);

      const processedFiles: ProcessedFile[] = [];
      const metadata: Record<string, any> = {};

      // Extract image metadata
      const imageInfo = await sharp(filePath).metadata();
      metadata.originalWidth = imageInfo.width;
      metadata.originalHeight = imageInfo.height;
      metadata.format = imageInfo.format;
      metadata.colorSpace = imageInfo.space;
      metadata.hasAlpha = imageInfo.hasAlpha;

      await job.progress(30);

      // Process main image (resize and optimize)
      if (
        processingOptions.resize ||
        processingOptions.format ||
        processingOptions.quality
      ) {
        const optimizedFile = await this.processMainImage(
          filePath,
          fileId,
          processingOptions,
          originalName
        );
        processedFiles.push(optimizedFile);
      }

      await job.progress(50);

      // Generate thumbnails
      if (
        processingOptions.generateThumbnails &&
        processingOptions.generateThumbnails.length > 0
      ) {
        const thumbnails = await this.generateThumbnails(
          filePath,
          fileId,
          processingOptions.generateThumbnails,
          originalName
        );
        processedFiles.push(...thumbnails);
      }

      await job.progress(80);

      // Store original file info
      const originalStats = await fs.stat(filePath);
      const originalFile: ProcessedFile = {
        type: 'original',
        name: 'original',
        path: filePath,
        url: await this.generateFileUrl(filePath),
        width: imageInfo.width,
        height: imageInfo.height,
        size: originalStats.size,
        format: imageInfo.format || path.extname(originalName).slice(1),
      };
      processedFiles.unshift(originalFile);

      // Update database with processed file information
      await this.updateFileWithProcessedData(fileId, processedFiles, metadata);

      await job.progress(90);

      // Update processing status to completed
      await this.updateFileStatus(fileId, 'ready');

      await job.progress(100);

      logger.info(`Image processing completed for file ${fileId}`);

      return {
        success: true,
        fileId,
        originalPath: filePath,
        processedFiles,
        metadata,
      };
    } catch (error) {
      logger.error(`Image processing failed for file ${fileId}:`, error);

      // Update status to failed
      await this.updateFileStatus(fileId, 'failed');

      return {
        success: false,
        fileId,
        originalPath: filePath,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async processMainImage(
    inputPath: string,
    fileId: string,
    options: ImageProcessingJobData['processingOptions'],
    originalName: string
  ): Promise<ProcessedFile> {
    const outputDir = path.dirname(inputPath);
    const baseName = path.parse(originalName).name;
    const outputFormat = options.format || 'webp';
    const outputPath = path.join(
      outputDir,
      `${baseName}_optimized.${outputFormat}`
    );

    let pipeline = sharp(inputPath);

    // Apply resize if specified
    if (options.resize) {
      pipeline = pipeline.resize(options.resize.width, options.resize.height, {
        fit: options.resize.fit as any,
        withoutEnlargement: true,
      });
    }

    // Apply format conversion and quality
    if (outputFormat === 'webp') {
      pipeline = pipeline.webp({ quality: options.quality || 80 });
    } else if (outputFormat === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: options.quality || 80 });
    } else if (outputFormat === 'png') {
      pipeline = pipeline.png({ quality: options.quality || 80 });
    }

    // Process and save
    const info = await pipeline.toFile(outputPath);
    const stats = await fs.stat(outputPath);

    return {
      type: 'optimized',
      name: 'optimized',
      path: outputPath,
      url: await this.generateFileUrl(outputPath),
      width: info.width,
      height: info.height,
      size: stats.size,
      format: outputFormat,
    };
  }

  private async generateThumbnails(
    inputPath: string,
    fileId: string,
    thumbnailSizes: Array<{ name: string; width: number; height: number }>,
    originalName: string
  ): Promise<ProcessedFile[]> {
    const outputDir = path.dirname(inputPath);
    const baseName = path.parse(originalName).name;
    const thumbnails: ProcessedFile[] = [];

    for (const size of thumbnailSizes) {
      const outputPath = path.join(outputDir, `${baseName}_${size.name}.webp`);

      const info = await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);

      thumbnails.push({
        type: 'thumbnail',
        name: size.name,
        path: outputPath,
        url: await this.generateFileUrl(outputPath),
        width: info.width,
        height: info.height,
        size: stats.size,
        format: 'webp',
      });
    }

    return thumbnails;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private generateFileUrl(filePath: string): string {
    // This would typically generate a CDN URL or public URL
    // For now, return a relative path
    const relativePath = path.relative(process.cwd(), filePath);
    return `/files/${relativePath}`;
  }

  private async updateFileStatus(
    fileId: string,
    status: string
  ): Promise<void> {
    await prisma.fileMetadata.update({
      where: { id: fileId },
      data: { status: status as unknown },
    });
  }

  private async updateFileWithProcessedData(
    fileId: string,
    processedFiles: ProcessedFile[],
    metadata: Record<string, unknown>
  ): Promise<void> {
    // Find the optimized version for the main URL
    const optimizedFile = processedFiles.find(f => f.type === 'optimized');
    const originalFile = processedFiles.find(f => f.type === 'original');
    const mainUrl = optimizedFile?.url || originalFile?.url;

    // Prepare thumbnails data
    const thumbnails = processedFiles
      .filter(f => f.type === 'thumbnail')
      .map(t => ({
        name: t.name,
        url: t.url,
        width: t.width!,
        height: t.height!,
        size: t.size,
      }));

    await prisma.fileMetadata.update({
      where: { id: fileId },
      data: {
        url: mainUrl,
        metadata: {
          ...metadata,
          processedFiles: processedFiles.map(f => ({
            type: f.type,
            name: f.name,
            path: f.path,
            url: f.url,
            width: f.width,
            height: f.height,
            size: f.size,
            format: f.format,
          })),
          thumbnails,
        },
      },
    });
  }
}

export const imageProcessingWorker = new ImageProcessingWorker();
