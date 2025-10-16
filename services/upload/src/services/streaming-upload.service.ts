import { createWriteStream } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { logger } from '../lib/logger';
import { UploadRequest } from '../types/upload.types';
import { generateFileId } from '../utils/file-utils';

export class StreamingUploadService {
  private tempDir: string;
  private maxConcurrentStreams: number;
  private activeStreams = new Set<string>();

  constructor() {
    this.tempDir = process.env.TEMP_DIRECTORY || './temp';
    this.maxConcurrentStreams = parseInt(process.env.MAX_CONCURRENT_STREAMS || '50');
  }

  /**
   * Stream upload to prevent memory overflow
   */
  async streamUpload(
    fileStream: Readable,
    uploadRequest: Omit<UploadRequest, 'file'> & {
      file: Omit<UploadRequest['file'], 'buffer'>;
    }
  ): Promise<{ tempPath: string; fileId: string }> {
    const fileId = generateFileId();
    const tempPath = join(this.tempDir, `${fileId}_${uploadRequest.file.originalName}`);

    // Check concurrency limit
    if (this.activeStreams.size >= this.maxConcurrentStreams) {
      throw new Error('Maximum concurrent streams reached. Please try again later.');
    }

    this.activeStreams.add(fileId);

    try {
      // Stream file to temporary location
      const writeStream = createWriteStream(tempPath);

      await pipeline(fileStream, writeStream);

      logger.info('File streamed successfully', {
        fileId,
        originalName: uploadRequest.file.originalName,
        size: uploadRequest.file.size,
      });

      return { tempPath, fileId };
    } catch (error) {
      logger.error('Streaming upload failed', {
        fileId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      this.activeStreams.delete(fileId);
    }
  }

  /**
   * Get current streaming metrics
   */
  getStreamingMetrics() {
    return {
      activeStreams: this.activeStreams.size,
      maxConcurrentStreams: this.maxConcurrentStreams,
      utilizationPercent: (this.activeStreams.size / this.maxConcurrentStreams) * 100,
    };
  }

  /**
   * Check if streaming is available
   */
  isStreamingAvailable(): boolean {
    return this.activeStreams.size < this.maxConcurrentStreams;
  }
}