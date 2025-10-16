import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';
import { getConfig } from '../config';

const config = getConfig();

// Async local storage for request context
const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

// Create logger instance
export const logger = pino({
  level: config.monitoring.logging.level,
  transport:
    config.monitoring.logging.format === 'pretty'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: label => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin: () => {
    // Add request context to all logs
    const context = asyncLocalStorage.getStore();
    if (context) {
      return Object.fromEntries(context);
    }
    return {};
  },
});

// Enhanced structured logging utilities
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    meta?: any
  ) {
    const logData = {
      context: this.context,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    logger[level](logData);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | any, meta?: any) {
    const errorMeta =
      error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: (error as any).code,
            },
          }
        : { error };

    this.log('error', message, { ...errorMeta, ...meta });
  }

  // Request logging with correlation ID
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    meta?: any
  ) {
    this.info('HTTP Request', {
      http: {
        method,
        url,
        statusCode,
        responseTime,
      },
      ...meta,
    });
  }

  // Upload operation logging with detailed context
  logUpload(
    operation: string,
    fileId: string,
    fileName: string,
    size: number,
    duration: number,
    success: boolean,
    error?: string,
    meta?: any
  ) {
    const level = success ? 'info' : 'error';
    this.log(level, `Upload ${operation}`, {
      upload: {
        operation,
        fileId,
        fileName,
        size,
        duration,
        success,
        error,
      },
      ...meta,
    });
  }

  // Security event logging with enhanced details
  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    meta?: any
  ) {
    this.warn('Security Event', {
      security: {
        event,
        severity,
        details,
        timestamp: new Date().toISOString(),
      },
      ...meta,
    });
  }

  // Performance logging with metrics
  logPerformance(operation: string, duration: number, metadata?: any) {
    this.info('Performance Metric', {
      performance: {
        operation,
        duration,
        timestamp: new Date().toISOString(),
      },
      ...metadata,
    });
  }

  // Business event logging
  logBusinessEvent(
    event: string,
    entityType: string,
    entityId: string,
    action: string,
    metadata?: any
  ) {
    this.info('Business Event', {
      business: {
        event,
        entityType,
        entityId,
        action,
        timestamp: new Date().toISOString(),
      },
      ...metadata,
    });
  }

  // Audit logging for compliance
  logAudit(
    action: string,
    resource: string,
    userId?: string,
    result: 'success' | 'failure' = 'success',
    metadata?: any
  ) {
    this.info('Audit Log', {
      audit: {
        action,
        resource,
        userId,
        result,
        timestamp: new Date().toISOString(),
      },
      ...metadata,
    });
  }

  // Database operation logging
  logDatabase(
    operation: string,
    table: string,
    duration: number,
    success: boolean,
    error?: string,
    metadata?: any
  ) {
    const level = success ? 'debug' : 'error';
    this.log(level, `Database ${operation}`, {
      database: {
        operation,
        table,
        duration,
        success,
        error,
      },
      ...metadata,
    });
  }

  // External service call logging
  logExternalService(
    service: string,
    operation: string,
    duration: number,
    success: boolean,
    statusCode?: number,
    error?: string,
    metadata?: any
  ) {
    const level = success ? 'info' : 'error';
    this.log(level, `External Service Call`, {
      external: {
        service,
        operation,
        duration,
        success,
        statusCode,
        error,
      },
      ...metadata,
    });
  }

  // Queue operation logging
  logQueue(
    operation: string,
    queueName: string,
    jobId?: string,
    duration?: number,
    success: boolean = true,
    error?: string,
    metadata?: any
  ) {
    const level = success ? 'info' : 'error';
    this.log(level, `Queue ${operation}`, {
      queue: {
        operation,
        queueName,
        jobId,
        duration,
        success,
        error,
      },
      ...metadata,
    });
  }

  // File system operation logging
  logFileSystem(
    operation: string,
    path: string,
    duration: number,
    success: boolean,
    error?: string,
    metadata?: any
  ) {
    const level = success ? 'debug' : 'error';
    this.log(level, `File System ${operation}`, {
      filesystem: {
        operation,
        path,
        duration,
        success,
        error,
      },
      ...metadata,
    });
  }
}

// Create context-specific loggers
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};

// Default loggers for common contexts
export const uploadLogger = createLogger('UploadService');
export const storageLogger = createLogger('StorageManager');
export const processingLogger = createLogger('ImageProcessor');
export const validationLogger = createLogger('FileValidator');
export const metadataLogger = createLogger('MetadataManager');
export const securityLogger = createLogger('Security');

// Note: requestLogger is defined below with enhanced context support

// Request context management
export class RequestContext {
  private static instance: RequestContext;

  private constructor() {}

  public static getInstance(): RequestContext {
    if (!RequestContext.instance) {
      RequestContext.instance = new RequestContext();
    }
    return RequestContext.instance;
  }

  /**
   * Run code with request context
   */
  public run<T>(context: Map<string, any>, callback: () => T): T {
    return asyncLocalStorage.run(context, callback);
  }

  /**
   * Get current request context
   */
  public getContext(): Map<string, any> | undefined {
    return asyncLocalStorage.getStore();
  }

  /**
   * Set context value
   */
  public set(key: string, value: any): void {
    const context = asyncLocalStorage.getStore();
    if (context) {
      context.set(key, value);
    }
  }

  /**
   * Get context value
   */
  public get(key: string): any {
    const context = asyncLocalStorage.getStore();
    return context?.get(key);
  }

  /**
   * Generate correlation ID
   */
  public generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Update existing loggers with new ones
export const healthLogger = createLogger('HealthService');
export const metricsLogger = createLogger('MetricsService');

// Express middleware for request logging with context
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId =
    req.headers['x-request-id'] ||
    RequestContext.getInstance().generateCorrelationId();
  const userId = req.user?.id || req.headers['x-user-id'];
  const serviceId = req.headers['x-service-id'];

  // Create request context
  const context = new Map([
    ['requestId', requestId],
    ['userId', userId],
    ['serviceId', serviceId],
    ['method', req.method],
    ['url', req.originalUrl],
    ['userAgent', req.headers['user-agent']],
    ['ip', req.ip],
  ]);

  // Run request in context
  RequestContext.getInstance().run(context, () => {
    req.requestId = requestId;
    req.logger = createLogger(`Request:${requestId}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      uploadLogger.logRequest(
        req.method,
        req.originalUrl,
        res.statusCode,
        duration,
        {
          requestId,
          userId,
          serviceId,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          contentLength: res.get('content-length'),
        }
      );
    });

    next();
  });
};

// Structured error logging
export const logError = (error: Error, context?: any) => {
  const errorLogger = createLogger('ErrorHandler');
  errorLogger.error('Unhandled error', error, context);
};

// Performance monitoring decorator
export function logPerformance(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    const logger = createLogger(target.constructor.name);

    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - start;
      logger.logPerformance(`${propertyName}`, duration, {
        className: target.constructor.name,
        methodName: propertyName,
        success: true,
      });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.logPerformance(`${propertyName}`, duration, {
        className: target.constructor.name,
        methodName: propertyName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  return descriptor;
}

// Export request context instance
export const requestContext = RequestContext.getInstance();
