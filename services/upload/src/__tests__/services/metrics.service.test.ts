import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MetricsService, metricsService } from '../../services/metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = MetricsService.getInstance();
    service.reset(); // Clear metrics before each test
  });

  afterEach(() => {
    service.reset();
  });

  describe('Upload Metrics', () => {
    it('should record upload metrics correctly', async () => {
      // Record upload metrics
      service.recordUpload(
        'POST',
        'success',
        'user_profile',
        'image',
        1.5,
        1024000
      );
      service.recordUpload('POST', 'error', 'product', 'image', 0.8, 512000);

      const metrics = await service.getCurrentMetrics();

      expect(metrics.upload_requests_total).toBeDefined();
      expect(metrics.upload_duration_seconds).toBeDefined();
      expect(metrics.upload_file_size_bytes).toBeDefined();

      // Check that counters were incremented
      const uploadCounter = metrics.upload_requests_total;
      expect(
        uploadCounter.some(
          (m: any) =>
            m.labels.method === 'POST' &&
            m.labels.status === 'success' &&
            m.labels.entity_type === 'user_profile' &&
            m.value === 1
        )
      ).toBe(true);

      expect(
        uploadCounter.some(
          (m: any) =>
            m.labels.method === 'POST' &&
            m.labels.status === 'error' &&
            m.labels.entity_type === 'product' &&
            m.value === 1
        )
      ).toBe(true);
    });

    it('should record upload duration histogram', async () => {
      service.recordUpload(
        'POST',
        'success',
        'user_profile',
        'image',
        2.5,
        1024000
      );

      const metrics = await service.getCurrentMetrics();
      const durationMetric = metrics.upload_duration_seconds;

      expect(durationMetric).toBeDefined();
      expect(
        durationMetric.some(
          (m: any) =>
            m.labels.operation === 'upload' &&
            m.labels.entity_type === 'user_profile'
        )
      ).toBe(true);
    });

    it('should record file size histogram', async () => {
      service.recordUpload('POST', 'success', 'product', 'image', 1.0, 5242880); // 5MB

      const metrics = await service.getCurrentMetrics();
      const sizeMetric = metrics.upload_file_size_bytes;

      expect(sizeMetric).toBeDefined();
      expect(
        sizeMetric.some(
          (m: any) =>
            m.labels.entity_type === 'product' && m.labels.file_type === 'image'
        )
      ).toBe(true);
    });
  });

  describe('Processing Metrics', () => {
    it('should record processing metrics', async () => {
      service.recordProcessing('resize', 'success', 'image', 3.2);
      service.recordProcessing('thumbnail', 'error', 'image', 1.8);

      const metrics = await service.getCurrentMetrics();

      expect(metrics.file_processing_total).toBeDefined();
      expect(metrics.file_processing_duration_seconds).toBeDefined();

      const processingCounter = metrics.file_processing_total;
      expect(
        processingCounter.some(
          (m: any) =>
            m.labels.operation === 'resize' &&
            m.labels.status === 'success' &&
            m.value === 1
        )
      ).toBe(true);

      expect(
        processingCounter.some(
          (m: any) =>
            m.labels.operation === 'thumbnail' &&
            m.labels.status === 'error' &&
            m.value === 1
        )
      ).toBe(true);
    });

    it('should update queue size gauge', async () => {
      service.updateQueueSize('image-processing', 15);
      service.updateQueueSize('file-validation', 8);

      const metrics = await service.getCurrentMetrics();
      const queueMetric = metrics.processing_queue_size;

      expect(queueMetric).toBeDefined();
      expect(
        queueMetric.some(
          (m: any) =>
            m.labels.queue_name === 'image-processing' && m.value === 15
        )
      ).toBe(true);

      expect(
        queueMetric.some(
          (m: any) => m.labels.queue_name === 'file-validation' && m.value === 8
        )
      ).toBe(true);
    });
  });

  describe('Storage Metrics', () => {
    it('should record storage operations', async () => {
      service.recordStorageOperation('store', 'local', 'success');
      service.recordStorageOperation('retrieve', 's3', 'error');

      const metrics = await service.getCurrentMetrics();
      const storageMetric = metrics.storage_operations_total;

      expect(storageMetric).toBeDefined();
      expect(
        storageMetric.some(
          (m: any) =>
            m.labels.operation === 'store' &&
            m.labels.provider === 'local' &&
            m.labels.status === 'success' &&
            m.value === 1
        )
      ).toBe(true);
    });

    it('should update storage size and file count', async () => {
      service.updateStorageMetrics('local', 1073741824, 150, 'user_profile'); // 1GB, 150 files

      const metrics = await service.getCurrentMetrics();

      expect(metrics.storage_total_size_bytes).toBeDefined();
      expect(metrics.storage_file_count).toBeDefined();

      const sizeMetric = metrics.storage_total_size_bytes;
      expect(
        sizeMetric.some(
          (m: any) => m.labels.provider === 'local' && m.value === 1073741824
        )
      ).toBe(true);

      const countMetric = metrics.storage_file_count;
      expect(
        countMetric.some(
          (m: any) =>
            m.labels.provider === 'local' &&
            m.labels.entity_type === 'user_profile' &&
            m.value === 150
        )
      ).toBe(true);
    });
  });

  describe('Security Metrics', () => {
    it('should record security events', async () => {
      service.recordSecurityEvent('malware_detected', 'high');
      service.recordSecurityEvent('invalid_token', 'medium');

      const metrics = await service.getCurrentMetrics();
      const securityMetric = metrics.security_events_total;

      expect(securityMetric).toBeDefined();
      expect(
        securityMetric.some(
          (m: any) =>
            m.labels.event_type === 'malware_detected' &&
            m.labels.severity === 'high' &&
            m.value === 1
        )
      ).toBe(true);
    });

    it('should record malware detections', async () => {
      service.recordMalwareDetection('clamav', 'executable');
      service.recordMalwareDetection('virustotal', 'document');

      const metrics = await service.getCurrentMetrics();
      const malwareMetric = metrics.malware_detections_total;

      expect(malwareMetric).toBeDefined();
      expect(
        malwareMetric.some(
          (m: any) =>
            m.labels.scanner === 'clamav' &&
            m.labels.file_type === 'executable' &&
            m.value === 1
        )
      ).toBe(true);
    });

    it('should record validation failures', async () => {
      service.recordValidationFailure('mime_type', 'image');
      service.recordValidationFailure('file_size', 'document');

      const metrics = await service.getCurrentMetrics();
      const validationMetric = metrics.validation_failures_total;

      expect(validationMetric).toBeDefined();
      expect(
        validationMetric.some(
          (m: any) =>
            m.labels.validation_type === 'mime_type' &&
            m.labels.file_type === 'image' &&
            m.value === 1
        )
      ).toBe(true);
    });
  });

  describe('HTTP Metrics', () => {
    it('should record HTTP request metrics', async () => {
      service.recordHttpRequest('POST', '/upload', 200, 1.5, 1024, 512);
      service.recordHttpRequest('GET', '/health', 200, 0.1);

      const metrics = await service.getCurrentMetrics();

      expect(metrics.http_request_duration_seconds).toBeDefined();
      expect(metrics.http_request_size_bytes).toBeDefined();
      expect(metrics.http_response_size_bytes).toBeDefined();

      const durationMetric = metrics.http_request_duration_seconds;
      expect(
        durationMetric.some(
          (m: any) =>
            m.labels.method === 'POST' &&
            m.labels.route === '/upload' &&
            m.labels.status_code === '200'
        )
      ).toBe(true);
    });
  });

  describe('Error Metrics', () => {
    it('should record errors', async () => {
      service.recordError('upload-service', 'ValidationError', 'low');
      service.recordError('upload-service', 'DatabaseError', 'high');

      const metrics = await service.getCurrentMetrics();
      const errorMetric = metrics.errors_total;

      expect(errorMetric).toBeDefined();
      expect(
        errorMetric.some(
          (m: any) =>
            m.labels.service === 'upload-service' &&
            m.labels.error_type === 'ValidationError' &&
            m.labels.severity === 'low' &&
            m.value === 1
        )
      ).toBe(true);
    });
  });

  describe('System Metrics', () => {
    it('should update active connections', async () => {
      service.updateActiveConnections('http', 10);
      service.updateActiveConnections('database', 5);

      const metrics = await service.getCurrentMetrics();
      const connectionsMetric = metrics.active_connections;

      expect(connectionsMetric).toBeDefined();
      expect(
        connectionsMetric.some(
          (m: any) => m.labels.type === 'http' && m.value === 10
        )
      ).toBe(true);
    });
  });

  describe('Metrics Export', () => {
    it('should export metrics in Prometheus format', async () => {
      service.recordUpload(
        'POST',
        'success',
        'user_profile',
        'image',
        1.0,
        1024
      );

      const prometheusMetrics = await service.getMetrics();

      expect(typeof prometheusMetrics).toBe('string');
      expect(prometheusMetrics).toContain('upload_requests_total');
      expect(prometheusMetrics).toContain('# HELP');
      expect(prometheusMetrics).toContain('# TYPE');
    });

    it('should return current metrics as JSON', async () => {
      service.recordUpload(
        'POST',
        'success',
        'user_profile',
        'image',
        1.0,
        1024
      );

      const jsonMetrics = await service.getCurrentMetrics();

      expect(typeof jsonMetrics).toBe('object');
      expect(jsonMetrics.upload_requests_total).toBeDefined();
      expect(Array.isArray(jsonMetrics.upload_requests_total)).toBe(true);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MetricsService.getInstance();
      const instance2 = MetricsService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBe(metricsService);
    });
  });
});
