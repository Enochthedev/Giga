import { randomUUID } from 'crypto';
import { Request } from 'express';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  error?: Error;
  [key: string]: any;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  service: string;
  version: string;
}

class LoggerService {
  private serviceName = 'auth-service';
  private version = process.env.npm_package_version || '1.0.0';

  private formatLog(
    level: LogLevel,
    message: string,
    context: LogContext = {}
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        correlationId: context.correlationId || this.generateCorrelationId(),
      },
      service: this.serviceName,
      version: this.version,
    };
  }

  private output(logEntry: LogEntry): void {
    const logString = JSON.stringify(logEntry);

    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.INFO:
        console.info(logString);
        break;
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(logString);
        }
        break;
    }
  }

  generateCorrelationId(): string {
    return randomUUID();
  }

  extractRequestContext(req: Request): LogContext {
    return {
      correlationId:
        (req.headers['x-correlation-id'] as string) ||
        this.generateCorrelationId(),
      userId: (req as any).user?.id,
      email: (req as any).user?.email,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      method: req.method,
      url: req.originalUrl || req.url,
    };
  }

  info(message: string, context: LogContext = {}): void {
    const logEntry = this.formatLog(LogLevel.INFO, message, context);
    this.output(logEntry);
  }

  warn(message: string, context: LogContext = {}): void {
    const logEntry = this.formatLog(LogLevel.WARN, message, context);
    this.output(logEntry);
  }

  error(message: string, error?: Error, context: LogContext = {}): void {
    const logEntry = this.formatLog(LogLevel.ERROR, message, {
      ...context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
    this.output(logEntry);
  }

  debug(message: string, context: LogContext = {}): void {
    const logEntry = this.formatLog(LogLevel.DEBUG, message, context);
    this.output(logEntry);
  }

  // Security event logging
  logSecurityEvent(event: string, context: LogContext = {}): void {
    this.warn(`SECURITY_EVENT: ${event}`, {
      ...context,
      securityEvent: true,
      eventType: event,
    });
  }

  // Authentication event logging
  logAuthEvent(event: string, context: LogContext = {}): void {
    this.info(`AUTH_EVENT: ${event}`, {
      ...context,
      authEvent: true,
      eventType: event,
    });
  }

  // Performance logging
  logPerformance(
    operation: string,
    duration: number,
    context: LogContext = {}
  ): void {
    this.info(`PERFORMANCE: ${operation}`, {
      ...context,
      performanceEvent: true,
      operation,
      duration,
      slow: duration > 1000, // Mark as slow if over 1 second
    });
  }

  // Database operation logging
  logDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    context: LogContext = {}
  ): void {
    this.debug(`DB_OPERATION: ${operation} on ${table}`, {
      ...context,
      databaseEvent: true,
      operation,
      table,
      duration,
    });
  }
}

export const logger = new LoggerService();
