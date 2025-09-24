import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export interface FieldSelectionOptions {
  fields?: string[];
  exclude?: string[];
  include?: Record<string, boolean | FieldSelectionOptions>;
}

export interface ResponseOptimizationConfig {
  enableCompression: boolean;
  compressionLevel: number;
  compressionThreshold: number;
  enableFieldSelection: boolean;
  enableBatchOperations: boolean;
  maxBatchSize: number;
  enableResponseCaching: boolean;
  cacheMaxAge: number;
}

export class ResponseOptimizationService {
  private config: ResponseOptimizationConfig;

  constructor(config?: Partial<ResponseOptimizationConfig>) {
    this.config = {
      enableCompression: true,
      compressionLevel: 6,
      compressionThreshold: 1024, // 1KB
      enableFieldSelection: true,
      enableBatchOperations: true,
      maxBatchSize: 100,
      enableResponseCaching: true,
      cacheMaxAge: 300, // 5 minutes
      ...config,
    };
  }

  // Compression middleware
  getCompressionMiddleware() {
    if (!this.config.enableCompression) {
      return (_req: Request, res: Response, next: NextFunction) => next();
    }

    return compression({
      level: this.config.compressionLevel,
      threshold: this.config.compressionThreshold,
      filter: (req, res) => {
        // Don't compress responses with this request header
        if (req.headers['x-no-compression']) {
          return false;
        }

        // Fallback to standard filter function
        return compression.filter(req, res);
      },
    });
  }

  // Field selection middleware
  fieldSelectionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableFieldSelection) {
        return next();
      }

      const originalJson = res.json;

      res.json = function (data: any) {
        const fields = req.query.fields as string;
        const exclude = req.query.exclude as string;

        if (fields || exclude) {
          const optimizedData = ResponseOptimizationService.selectFields(data, {
            fields: fields ? fields.split(',') : undefined,
            exclude: exclude ? exclude.split(',') : undefined,
          });
          return originalJson.call(this, optimizedData);
        }

        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Response caching middleware
  responseCachingMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableResponseCaching) {
        return next();
      }

      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Set cache headers for cacheable responses
      const cacheControl =
        req.query.cache === 'false'
          ? 'no-cache'
          : `public, max-age=${this.config.cacheMaxAge}`;
      res.set('Cache-Control', cacheControl);

      // Add ETag for conditional requests
      const originalJson = res.json;
      res.json = function (data: any) {
        const etag = ResponseOptimizationService.generateETag(data);
        res.set('ETag', etag);

        // Check if client has cached version
        if (req.headers['if-none-match'] === etag) {
          return res.status(304).end();
        }

        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Static method for field selection
  static selectFields(data: any, options: FieldSelectionOptions): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.selectFields(item, options));
    }

    const result: any = {};
    const { fields, exclude, include } = options;

    // If specific fields are requested
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (field.includes('.')) {
          // Handle nested field selection
          const [parent, ...nested] = field.split('.');
          if (data[parent] !== undefined) {
            if (!result[parent]) result[parent] = {};
            this.setNestedField(result[parent], nested.join('.'), data[parent]);
          }
        } else if (data[field] !== undefined) {
          result[field] = data[field];
        }
      }
      return result;
    }

    // Start with all fields
    Object.assign(result, data);

    // Remove excluded fields
    if (exclude && exclude.length > 0) {
      for (const field of exclude) {
        if (field.includes('.')) {
          // Handle nested field exclusion
          const [parent, ...nested] = field.split('.');
          if (result[parent]) {
            this.deleteNestedField(result[parent], nested.join('.'));
          }
        } else {
          delete result[field];
        }
      }
    }

    // Handle include options for nested objects
    if (include) {
      for (const [key, value] of Object.entries(include)) {
        if (result[key] && typeof value === 'object' && value !== null) {
          result[key] = this.selectFields(
            result[key],
            value as FieldSelectionOptions
          );
        }
      }
    }

    return result;
  }

  private static setNestedField(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  private static deleteNestedField(obj: any, path: string): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }

    delete current[keys[keys.length - 1]];
  }

  // Generate ETag for response caching
  static generateETag(data: any): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify(data));
    return `"${hash.digest('hex')}"`;
  }

  // Batch operation handler
  async handleBatchOperation<T, R>(
    items: T[],
    operation: (item: T) => Promise<R>,
    options: {
      batchSize?: number;
      concurrency?: number;
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<{
    results: R[];
    errors: Array<{ index: number; error: string }>;
  }> {
    const {
      batchSize = this.config.maxBatchSize,
      concurrency = 5,
      onProgress,
    } = options;

    if (items.length > this.config.maxBatchSize) {
      throw new Error(
        `Batch size exceeds maximum allowed (${this.config.maxBatchSize})`
      );
    }

    const results: R[] = [];
    const errors: Array<{ index: number; error: string }> = [];
    let completed = 0;

    // Process items in batches with controlled concurrency
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(async (item, batchIndex) => {
        const globalIndex = i + batchIndex;
        try {
          const result = await operation(item);
          results[globalIndex] = result;
          completed++;
          if (onProgress) onProgress(completed, items.length);
          return { success: true, result, index: globalIndex };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          errors.push({ index: globalIndex, error: errorMessage });
          completed++;
          if (onProgress) onProgress(completed, items.length);
          return { success: false, error: errorMessage, index: globalIndex };
        }
      });

      // Process batch with concurrency control
      const semaphore = new Array(Math.min(concurrency, batch.length)).fill(
        null
      );
      await Promise.all(
        semaphore.map(async (_, semIndex) => {
          for (let j = semIndex; j < batchPromises.length; j += concurrency) {
            await batchPromises[j];
          }
          return Promise.resolve(); // Ensure this is properly async
        })
      );
    }

    return { results: results.filter(r => r !== undefined), errors };
  }

  // Response transformation utilities
  static transformResponse(
    data: any,
    transformations: {
      renameFields?: Record<string, string>;
      formatDates?: boolean;
      formatNumbers?: { decimals?: number; currency?: string };
      addMetadata?: boolean;
    }
  ): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.transformResponse(item, transformations));
    }

    const result = { ...data };

    // Rename fields
    if (transformations.renameFields) {
      for (const [oldName, newName] of Object.entries(
        transformations.renameFields
      )) {
        if (result[oldName] !== undefined) {
          result[newName] = result[oldName];
          delete result[oldName];
        }
      }
    }

    // Format dates
    if (transformations.formatDates) {
      for (const [key, value] of Object.entries(result)) {
        if (
          value instanceof Date ||
          (typeof value === 'string' && !isNaN(Date.parse(value)))
        ) {
          result[key] = new Date(value).toISOString();
        }
      }
    }

    // Format numbers
    if (transformations.formatNumbers) {
      const { decimals, currency } = transformations.formatNumbers;
      for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'number') {
          if (
            currency &&
            (key.includes('price') ||
              key.includes('total') ||
              key.includes('amount'))
          ) {
            result[key] = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: decimals || 2,
            }).format(value);
          } else if (decimals !== undefined) {
            result[key] = Number(value.toFixed(decimals));
          }
        }
      }
    }

    // Add metadata
    if (transformations.addMetadata) {
      result._metadata = {
        timestamp: new Date().toISOString(),
        version: '1.0',
      };
    }

    return result;
  }

  // Pagination response helper
  static createPaginatedResponse<T>(
    data: T[],
    pagination: {
      page?: number;
      limit: number;
      total?: number;
      hasMore?: boolean;
      nextCursor?: string;
    },
    metadata?: Record<string, any>
  ) {
    return {
      success: true,
      data,
      pagination,
      metadata: {
        timestamp: new Date().toISOString(),
        count: data.length,
        ...metadata,
      },
    };
  }

  // Error response helper
  static createErrorResponse(
    error: string | Error,
    statusCode: number = 500,
    details?: any
  ) {
    const message = error instanceof Error ? error.message : error;

    return {
      success: false,
      error: {
        message,
        statusCode,
        details,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Validation schema for batch operations
  static createBatchValidationSchema<T>(itemSchema: z.ZodSchema<T>) {
    return z.object({
      items: z.array(itemSchema).min(1).max(100),
      options: z
        .object({
          validateOnly: z.boolean().optional(),
          continueOnError: z.boolean().optional(),
          returnDetails: z.boolean().optional(),
        })
        .optional(),
    });
  }

  // Middleware for batch operations
  batchOperationMiddleware() {
    // eslint-disable-next-line require-await
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableBatchOperations) {
        return next();
      }

      // Check if this is a batch operation
      if (!req.path.includes('/batch') && !req.body.items) {
        return next();
      }

      // Validate batch size
      if (req.body.items && req.body.items.length > this.config.maxBatchSize) {
        return res
          .status(400)
          .json(
            ResponseOptimizationService.createErrorResponse(
              `Batch size exceeds maximum allowed (${this.config.maxBatchSize})`,
              400
            )
          );
      }

      // Add batch processing utilities to request
      (req as any).batchProcessor = {
        process: (
          items: any[],
          operation: (item: any) => Promise<any>,
          options?: any
        ) => this.handleBatchOperation(items, operation, options),
      };

      next();
    };
  }

  // Performance monitoring middleware
  performanceMonitoringMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();

      // Override res.json to measure response time
      const originalJson = res.json;
      res.json = function (data: any) {
        const responseTime = Date.now() - startTime;

        // Add performance headers
        res.set('X-Response-Time', `${responseTime}ms`);
        res.set('X-Timestamp', new Date().toISOString());

        // Log slow responses
        if (responseTime > 1000) {
          console.warn(
            `Slow response: ${req.method} ${req.path} took ${responseTime}ms`
          );
        }

        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Content negotiation middleware
  contentNegotiationMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const acceptHeader = req.headers.accept || 'application/json';

      // Override res.json to handle different content types
      const originalJson = res.json;
      res.json = function (data: any) {
        // Handle CSV export
        if (acceptHeader.includes('text/csv') || req.query.format === 'csv') {
          if (Array.isArray(data)) {
            const csv = ResponseOptimizationService.convertToCSV(data);
            res.set('Content-Type', 'text/csv');
            res.set('Content-Disposition', 'attachment; filename="export.csv"');
            return res.send(csv);
          }
        }

        // Handle XML export
        if (
          acceptHeader.includes('application/xml') ||
          req.query.format === 'xml'
        ) {
          const xml = ResponseOptimizationService.convertToXML(data);
          res.set('Content-Type', 'application/xml');
          return res.send(xml);
        }

        // Default JSON response
        res.set('Content-Type', 'application/json');
        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Utility methods for format conversion
  static convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  static convertToXML(data: any, rootElement: string = 'root'): string {
    const convertValue = (value: any, key: string): string => {
      if (value === null || value === undefined) {
        return `<${key}></${key}>`;
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value
            .map(item => convertValue(item, key.slice(0, -1)))
            .join('');
        } else {
          const inner = Object.entries(value)
            .map(([k, v]) => convertValue(v, k))
            .join('');
          return `<${key}>${inner}</${key}>`;
        }
      }

      return `<${key}>${String(value)}</${key}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>${convertValue(data, rootElement)}`;
  }
}

// Export singleton instance
export const responseOptimizationService = new ResponseOptimizationService();
