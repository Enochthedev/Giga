import * as zlib from 'zlib';
import { NextFunction, Request, Response } from 'express';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';

interface CompressionOptions {
  threshold: number; // Minimum response size to compress (bytes)
  level: number; // Compression level (1-9)
  chunkSize: number; // Chunk size for streaming compression
  memLevel: number; // Memory level (1-9)
  strategy: number; // Compression strategy
}

interface CompressionStats {
  totalRequests: number;
  compressedRequests: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageCompressionRatio: number;
  averageCompressionTime: number;
}

class ResponseCompressionService {
  private stats: CompressionStats = {
    totalRequests: 0,
    compressedRequests: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    averageCompressionRatio: 0,
    averageCompressionTime: 0,
  };

  private compressionTimes: number[] = [];
  private readonly maxCompressionTimeHistory = 1000;

  private readonly defaultOptions: CompressionOptions = {
    threshold: parseInt(process.env.COMPRESSION_THRESHOLD || '1024'), // 1KB
    level: parseInt(process.env.COMPRESSION_LEVEL || '6'), // Balanced compression
    chunkSize: parseInt(process.env.COMPRESSION_CHUNK_SIZE || '16384'), // 16KB
    memLevel: parseInt(process.env.COMPRESSION_MEM_LEVEL || '8'),
    strategy: zlib.constants.Z_DEFAULT_STRATEGY,
  };

  // Main compression middleware - temporarily disabled
  compress(options?: Partial<CompressionOptions>) {
    return (req: Request, res: Response, next: NextFunction) => {
      next();
    };

    /* Disabled due to TypeScript issues
    const config = { ...this.defaultOptions, ...options };

    return (req: Request, res: Response, next: NextFunction) => {
      // Skip compression for certain conditions
      if (this.shouldSkipCompression(req, res)) {
        return next();
      }

      const originalSend = res.json;
      const originalEnd = res.end;

      // Override res.json to compress JSON responses
      res.json = (data: any) => {
        const jsonString = JSON.stringify(data);
        const originalSize = Buffer.byteLength(jsonString, 'utf8');

        this.stats.totalRequests++;
        this.stats.totalOriginalSize += originalSize;

        // Only compress if above threshold
        if (originalSize < config.threshold) {
          res.set('Content-Type', 'application/json');
          return originalSend.call(res, data);
        }

        this.compressResponse(
          jsonString,
          originalSize,
          config,
          req,
          res,
          () => {
            return originalSend.call(res, data);
          }
        );

        return res;
      };

      // Override res.end for other response types
      const originalEnd = res.end;
      res.end = function (
        chunk?: any,
        encoding?: BufferEncoding,
        cb?: () => void
      ): any {
        if (chunk && typeof chunk === 'string') {
          const originalSize = Buffer.byteLength(chunk, encoding || 'utf8');

          this.stats.totalRequests++;
          this.stats.totalOriginalSize += originalSize;

          if (originalSize >= config.threshold) {
            return this.compressResponse(
              chunk,
              originalSize,
              config,
              req,
              res,
              () => {
                return originalEnd.call(res, chunk, encoding || 'utf8');
              }
            );
          }
        }

        return originalEnd.call(res, chunk, encoding || 'utf8');
      };

      next();
    };
    */
  }

  // Compress response data
  private compressResponse(
    data: string,
    originalSize: number,
    config: CompressionOptions,
    req: Request,
    res: Response,
    fallback: () => any
  ): void {
    const startTime = Date.now();
    const acceptEncoding = req.headers['accept-encoding'] || '';

    try {
      // Determine compression method based on client support
      if (acceptEncoding.includes('br') && this.supportsBrotli()) {
        this.compressBrotli(data, originalSize, config, res, startTime);
      } else if (acceptEncoding.includes('gzip')) {
        this.compressGzip(data, originalSize, config, res, startTime);
      } else if (acceptEncoding.includes('deflate')) {
        this.compressDeflate(data, originalSize, config, res, startTime);
      } else {
        // Client doesn't support compression
        res.set('Content-Type', 'application/json');
        fallback();
      }
    } catch (error) {
      logger.error(
        'Compression failed, sending uncompressed response',
        error as Error,
        {
          originalSize,
          path: req.path,
          method: req.method,
        }
      );

      // Fallback to uncompressed response
      fallback();
    }
  }

  // Gzip compression
  private compressGzip(
    data: string,
    originalSize: number,
    config: CompressionOptions,
    res: Response,
    startTime: number
  ): void {
    zlib.gzip(
      data,
      {
        level: config.level,
        chunkSize: config.chunkSize,
        memLevel: config.memLevel,
        strategy: config.strategy,
      },
      (error, compressed) => {
        if (error) {
          logger.error('Gzip compression failed', error);
          return res.status(500).json({ error: 'Compression failed' });
        }

        this.finishCompression(
          compressed,
          originalSize,
          'gzip',
          res,
          startTime
        );
      }
    );
  }

  // Deflate compression
  private compressDeflate(
    data: string,
    originalSize: number,
    config: CompressionOptions,
    res: Response,
    startTime: number
  ): void {
    zlib.deflate(
      data,
      {
        level: config.level,
        chunkSize: config.chunkSize,
        memLevel: config.memLevel,
        strategy: config.strategy,
      },
      (error, compressed) => {
        if (error) {
          logger.error('Deflate compression failed', error);
          return res.status(500).json({ error: 'Compression failed' });
        }

        this.finishCompression(
          compressed,
          originalSize,
          'deflate',
          res,
          startTime
        );
      }
    );
  }

  // Brotli compression (if supported)
  private compressBrotli(
    data: string,
    originalSize: number,
    config: CompressionOptions,
    res: Response,
    startTime: number
  ): void {
    if (!zlib.brotliCompress) {
      // Fallback to gzip if Brotli not available
      return this.compressGzip(data, originalSize, config, res, startTime);
    }

    zlib.brotliCompress(
      data,
      {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: Math.min(config.level, 11),
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: originalSize,
        },
      },
      (error, compressed) => {
        if (error) {
          logger.error('Brotli compression failed', error);
          return res.status(500).json({ error: 'Compression failed' });
        }

        this.finishCompression(compressed, originalSize, 'br', res, startTime);
      }
    );
  }

  // Finish compression and send response
  private finishCompression(
    compressed: Buffer,
    originalSize: number,
    encoding: string,
    res: Response,
    startTime: number
  ): void {
    const compressionTime = Date.now() - startTime;
    const compressedSize = compressed.length;
    const compressionRatio = (originalSize - compressedSize) / originalSize;

    // Update statistics
    this.updateStats(
      originalSize,
      compressedSize,
      compressionTime,
      compressionRatio
    );

    // Set response headers
    res.set({
      'Content-Encoding': encoding,
      'Content-Type': 'application/json',
      'Content-Length': compressedSize.toString(),
      'X-Original-Size': originalSize.toString(),
      'X-Compressed-Size': compressedSize.toString(),
      'X-Compression-Ratio': (compressionRatio * 100).toFixed(2) + '%',
      'X-Compression-Time': compressionTime + 'ms',
      Vary: 'Accept-Encoding',
    });

    // Send compressed response
    res.end(compressed);

    logger.debug('Response compressed', {
      encoding,
      originalSize,
      compressedSize,
      compressionRatio: compressionRatio * 100,
      compressionTime,
    });
  }

  // Check if compression should be skipped
  private shouldSkipCompression(req: Request, res: Response): boolean {
    // Skip if already compressed
    if (res.get('Content-Encoding')) {
      return true;
    }

    // Skip for certain content types
    const contentType = res.get('Content-Type') || '';
    const skipContentTypes = [
      'image/',
      'video/',
      'audio/',
      'application/zip',
      'application/gzip',
      'application/x-compressed',
    ];

    if (skipContentTypes.some(type => contentType.startsWith(type))) {
      return true;
    }

    // Skip if client doesn't support compression
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (
      !acceptEncoding.includes('gzip') &&
      !acceptEncoding.includes('deflate') &&
      !acceptEncoding.includes('br')
    ) {
      return true;
    }

    // Skip for certain user agents (if needed)
    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('MSIE 6')) {
      return true;
    }

    return false;
  }

  // Check if Brotli compression is supported
  private supportsBrotli(): boolean {
    return typeof zlib.brotliCompress === 'function';
  }

  // Update compression statistics
  private updateStats(
    originalSize: number,
    compressedSize: number,
    compressionTime: number,
    compressionRatio: number
  ): void {
    this.stats.compressedRequests++;
    this.stats.totalCompressedSize += compressedSize;

    // Track compression times
    this.compressionTimes.push(compressionTime);
    if (this.compressionTimes.length > this.maxCompressionTimeHistory) {
      this.compressionTimes = this.compressionTimes.slice(
        -this.maxCompressionTimeHistory
      );
    }

    // Calculate averages
    this.stats.averageCompressionRatio =
      (this.stats.totalOriginalSize - this.stats.totalCompressedSize) /
      this.stats.totalOriginalSize;

    this.stats.averageCompressionTime =
      this.compressionTimes.reduce((sum, time) => sum + time, 0) /
      this.compressionTimes.length;

    // Record metrics
    metricsService.recordMetric(
      'compression_ratio',
      compressionRatio * 100,
      'percent'
    );
    metricsService.recordMetric('compression_time', compressionTime, 'ms');
    metricsService.recordMetric(
      'compression_original_size',
      originalSize,
      'bytes'
    );
    metricsService.recordMetric(
      'compression_compressed_size',
      compressedSize,
      'bytes'
    );
  }

  // Get compression statistics
  getCompressionStats(): CompressionStats {
    return { ...this.stats };
  }

  // Get compression performance report
  getPerformanceReport(): {
    stats: CompressionStats;
    efficiency: {
      compressionRate: number;
      averageSavings: number;
      totalBytesSaved: number;
    };
    performance: {
      averageCompressionTime: number;
      maxCompressionTime: number;
      minCompressionTime: number;
    };
    recommendations: string[];
  } {
    const compressionRate =
      this.stats.totalRequests > 0
        ? (this.stats.compressedRequests / this.stats.totalRequests) * 100
        : 0;

    const totalBytesSaved =
      this.stats.totalOriginalSize - this.stats.totalCompressedSize;
    const averageSavings =
      this.stats.compressedRequests > 0
        ? totalBytesSaved / this.stats.compressedRequests
        : 0;

    const maxCompressionTime =
      this.compressionTimes.length > 0 ? Math.max(...this.compressionTimes) : 0;

    const minCompressionTime =
      this.compressionTimes.length > 0 ? Math.min(...this.compressionTimes) : 0;

    const recommendations = this.generateRecommendations();

    return {
      stats: this.stats,
      efficiency: {
        compressionRate,
        averageSavings,
        totalBytesSaved,
      },
      performance: {
        averageCompressionTime: this.stats.averageCompressionTime,
        maxCompressionTime,
        minCompressionTime,
      },
      recommendations,
    };
  }

  // Generate optimization recommendations
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.stats.averageCompressionRatio < 0.3) {
      recommendations.push(
        'Low compression ratio - consider optimizing response data structure'
      );
    }

    if (this.stats.averageCompressionTime > 100) {
      recommendations.push(
        'High compression time - consider reducing compression level or threshold'
      );
    }

    const compressionRate =
      this.stats.totalRequests > 0
        ? (this.stats.compressedRequests / this.stats.totalRequests) * 100
        : 0;

    if (compressionRate < 50) {
      recommendations.push(
        'Low compression rate - consider lowering compression threshold'
      );
    }

    if (
      this.stats.totalRequests > 1000 &&
      this.stats.compressedRequests === 0
    ) {
      recommendations.push(
        'No responses compressed - check compression configuration'
      );
    }

    return recommendations;
  }

  // Reset statistics (useful for testing)
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      compressedRequests: 0,
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      averageCompressionRatio: 0,
      averageCompressionTime: 0,
    };
    this.compressionTimes = [];
  }
}

export const responseCompressionService = new ResponseCompressionService();
export { ResponseCompressionService };
