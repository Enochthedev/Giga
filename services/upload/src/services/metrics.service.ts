import {
  Counter,
  Gauge,
  Histogram,
  collectDefaultMetrics,
  register,
} from 'prom-client';
import { createLogger } from '../lib/logger';

const logger = createLogger('MetricsService');

export class MetricsService {
  private static instance: MetricsService;

  // Upload metrics
  public readonly uploadCounter = new Counter({
    name: 'upload_requests_total',
    help: 'Total number of upload requests',
    labelNames: ['method', 'status', 'entity_type', 'file_type'],
  });

  public readonly uploadDuration = new Histogram({
    name: 'upload_duration_seconds',
    help: 'Duration of upload operations in seconds',
    labelNames: ['operation', 'entity_type', 'file_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  });

  public readonly uploadSize = new Histogram({
    name: 'upload_file_size_bytes',
    help: 'Size of uploaded files in bytes',
    labelNames: ['entity_type', 'file_type'],
    buckets: [1024, 10240, 102400, 1048576, 10485760, 52428800, 104857600], // 1KB to 100MB
  });

  // Processing metrics
  public readonly processingCounter = new Counter({
    name: 'file_processing_total',
    help: 'Total number of file processing operations',
    labelNames: ['operation', 'status', 'file_type'],
  });

  public readonly processingDuration = new Histogram({
    name: 'file_processing_duration_seconds',
    help: 'Duration of file processing operations in seconds',
    labelNames: ['operation', 'file_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120],
  });

  public readonly processingQueueSize = new Gauge({
    name: 'processing_queue_size',
    help: 'Current size of processing queue',
    labelNames: ['queue_name'],
  });

  // Storage metrics
  public readonly storageOperations = new Counter({
    name: 'storage_operations_total',
    help: 'Total number of storage operations',
    labelNames: ['operation', 'provider', 'status'],
  });

  public readonly storageSize = new Gauge({
    name: 'storage_total_size_bytes',
    help: 'Total size of stored files in bytes',
    labelNames: ['provider'],
  });

  public readonly storageFileCount = new Gauge({
    name: 'storage_file_count',
    help: 'Total number of stored files',
    labelNames: ['provider', 'entity_type'],
  });

  // Security metrics
  public readonly securityEvents = new Counter({
    name: 'security_events_total',
    help: 'Total number of security events',
    labelNames: ['event_type', 'severity'],
  });

  public readonly malwareDetections = new Counter({
    name: 'malware_detections_total',
    help: 'Total number of malware detections',
    labelNames: ['scanner', 'file_type'],
  });

  public readonly validationFailures = new Counter({
    name: 'validation_failures_total',
    help: 'Total number of validation failures',
    labelNames: ['validation_type', 'file_type'],
  });

  // Performance metrics
  public readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  });

  public readonly httpRequestSize = new Histogram({
    name: 'http_request_size_bytes',
    help: 'Size of HTTP requests in bytes',
    labelNames: ['method', 'route'],
    buckets: [1024, 10240, 102400, 1048576, 10485760, 52428800],
  });

  public readonly httpResponseSize = new Histogram({
    name: 'http_response_size_bytes',
    help: 'Size of HTTP responses in bytes',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1024, 10240, 102400, 1048576, 10485760],
  });

  // System metrics
  public readonly activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    labelNames: ['type'],
  });

  public readonly memoryUsage = new Gauge({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'],
  });

  public readonly cpuUsage = new Gauge({
    name: 'cpu_usage_percent',
    help: 'CPU usage percentage',
  });

  // Error metrics
  public readonly errorCounter = new Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['service', 'error_type', 'severity'],
  });

  private constructor() {
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register });

    // Start system metrics collection
    this.startSystemMetricsCollection();

    logger.info('Metrics service initialized');
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  /**
   * Get metrics in Prometheus format
   */
  public async getMetrics(): Promise<string> {
    return register.metrics();
  }

  /**
   * Record upload operation
   */
  public recordUpload(
    method: string,
    status: string,
    entityType: string,
    fileType: string,
    duration: number,
    fileSize: number
  ): void {
    this.uploadCounter.inc({
      method,
      status,
      entity_type: entityType,
      file_type: fileType,
    });
    this.uploadDuration.observe(
      { operation: 'upload', entity_type: entityType, file_type: fileType },
      duration
    );
    this.uploadSize.observe(
      { entity_type: entityType, file_type: fileType },
      fileSize
    );
  }

  /**
   * Record processing operation
   */
  public recordProcessing(
    operation: string,
    status: string,
    fileType: string,
    duration: number
  ): void {
    this.processingCounter.inc({ operation, status, file_type: fileType });
    this.processingDuration.observe(
      { operation, file_type: fileType },
      duration
    );
  }

  /**
   * Update processing queue size
   */
  public updateQueueSize(queueName: string, size: number): void {
    this.processingQueueSize.set({ queue_name: queueName }, size);
  }

  /**
   * Record storage operation
   */
  public recordStorageOperation(
    operation: string,
    provider: string,
    status: string
  ): void {
    this.storageOperations.inc({ operation, provider, status });
  }

  /**
   * Update storage metrics
   */
  public updateStorageMetrics(
    provider: string,
    totalSize: number,
    fileCount: number,
    entityType?: string
  ): void {
    this.storageSize.set({ provider }, totalSize);
    this.storageFileCount.set(
      { provider, entity_type: entityType || 'all' },
      fileCount
    );
  }

  /**
   * Record security event
   */
  public recordSecurityEvent(eventType: string, severity: string): void {
    this.securityEvents.inc({ event_type: eventType, severity });
  }

  /**
   * Record malware detection
   */
  public recordMalwareDetection(scanner: string, fileType: string): void {
    this.malwareDetections.inc({ scanner, file_type: fileType });
  }

  /**
   * Record validation failure
   */
  public recordValidationFailure(
    validationType: string,
    fileType: string
  ): void {
    this.validationFailures.inc({
      validation_type: validationType,
      file_type: fileType,
    });
  }

  /**
   * Record HTTP request
   */
  public recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
    requestSize?: number,
    responseSize?: number
  ): void {
    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      duration
    );

    if (requestSize !== undefined) {
      this.httpRequestSize.observe({ method, route }, requestSize);
    }

    if (responseSize !== undefined) {
      this.httpResponseSize.observe(
        { method, route, status_code: statusCode.toString() },
        responseSize
      );
    }
  }

  /**
   * Record error
   */
  public recordError(
    service: string,
    errorType: string,
    severity: string
  ): void {
    this.errorCounter.inc({ service, error_type: errorType, severity });
  }

  /**
   * Update active connections
   */
  public updateActiveConnections(type: string, count: number): void {
    this.activeConnections.set({ type }, count);
  }

  /**
   * Start collecting system metrics
   */
  private startSystemMetricsCollection(): void {
    setInterval(() => {
      try {
        const memUsage = process.memoryUsage();
        this.memoryUsage.set({ type: 'rss' }, memUsage.rss);
        this.memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
        this.memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal);
        this.memoryUsage.set({ type: 'external' }, memUsage.external);

        // CPU usage would require additional libraries like pidusage
        // For now, we'll use a simple approximation
        const cpuUsage = process.cpuUsage();
        const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
        this.cpuUsage.set(totalUsage);
      } catch (error) {
        logger.error('Failed to collect system metrics', error);
      }
    }, 30000); // Collect every 30 seconds
  }

  /**
   * Reset all metrics (useful for testing)
   */
  public reset(): void {
    // Reset metric values but keep the metric definitions
    this.uploadCounter.reset();
    this.uploadDuration.reset();
    this.uploadSize.reset();
    this.processingCounter.reset();
    this.processingDuration.reset();
    this.processingQueueSize.reset();
    this.storageOperations.reset();
    this.storageSize.reset();
    this.storageFileCount.reset();
    this.securityEvents.reset();
    this.malwareDetections.reset();
    this.validationFailures.reset();
    this.httpRequestDuration.reset();
    this.httpRequestSize.reset();
    this.httpResponseSize.reset();
    this.activeConnections.reset();
    this.memoryUsage.reset();
    this.cpuUsage.reset();
    this.errorCounter.reset();
  }

  /**
   * Get current metric values (useful for testing and debugging)
   */
  public async getCurrentMetrics(): Promise<any> {
    const metrics = await register.getMetricsAsJSON();
    return metrics.reduce((acc: any, metric: any) => {
      acc[metric.name] = metric.values;
      return acc;
    }, {});
  }
}

// Export singleton instance
export const metricsService = MetricsService.getInstance();
