import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  errorMetricsMiddleware,
  metricsMiddleware,
  processingMetricsMiddleware,
  securityMetricsMiddleware,
  storageMetricsMiddleware,
  uploadMetricsMiddleware,
} from '../../middleware/monitoring.middleware';
import { metricsService } from '../../services/metrics.service';

// Mock metrics service
vi.mock('../../services/metrics.service', () => ({
  metricsService: {
    recordHttpRequest: vi.fn(),
    recordUpload: vi.fn(),
    recordProcessing: vi.fn(),
    recordSecurityEvent: vi.fn(),
    recordError: vi.fn(),
    recordStorageOperation: vi.fn(),
    updateStorageMetrics: vi.fn(),
    updateActiveConnections: vi.fn(),
  },
}));

describe('Monitoring Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let endCallback: () => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      method: 'POST',
      path: '/upload',
      originalUrl: '/upload',
      route: { path: '/upload' },
      headers: {
        'content-length': '1024',
        'user-agent': 'test-agent',
      },
      ip: '127.0.0.1',
      body: {},
      file: undefined,
    };

    mockRes = {
      statusCode: 200,
      end: vi.fn(),
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          endCallback = callback;
        }
      }),
      get: vi.fn(),
    };

    mockNext = vi.fn();
  });

  describe('metricsMiddleware', () => {
    it('should record HTTP request metrics', done => {
      const middleware = metricsMiddleware as any;

      // Mock res.end to capture metrics
      const originalEnd = vi.fn();
      mockRes.end = function (chunk?: any, encoding?: any) {
        // Simulate response completion
        setTimeout(() => {
          expect(metricsService.recordHttpRequest).toHaveBeenCalledWith(
            'POST',
            '/upload',
            200,
            expect.any(Number), // duration
            1024, // request size
            expect.any(Number) // response size
          );
          done();
        }, 0);

        return originalEnd.call(this, chunk, encoding);
      };

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(metricsService.updateActiveConnections).toHaveBeenCalledWith(
        'http',
        1
      );

      // Simulate response end
      (mockRes.end as any)('response data');
    });

    it('should handle requests without content-length', () => {
      delete mockReq.headers!['content-length'];

      const middleware = metricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockReq as any).requestSize).toBe(0);
    });

    it('should log slow requests', done => {
      const middleware = metricsMiddleware as any;

      // Mock a slow request by delaying the end call
      mockRes.end = function (chunk?: any, encoding?: any) {
        // Simulate slow response (> 5 seconds)
        setTimeout(() => {
          expect(metricsService.recordHttpRequest).toHaveBeenCalledWith(
            'POST',
            '/upload',
            200,
            expect.any(Number),
            1024,
            expect.any(Number)
          );
          done();
        }, 0);

        return vi.fn().call(this, chunk, encoding);
      };

      // Mock Date.now to simulate slow request
      const originalNow = Date.now;
      let callCount = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => {
        callCount++;
        if (callCount === 1) return 1000; // Start time
        return 7000; // End time (6 seconds later)
      });

      middleware(mockReq, mockRes, mockNext);
      (mockRes.end as any)('response');

      Date.now = originalNow;
    });
  });

  describe('uploadMetricsMiddleware', () => {
    it('should record upload metrics for upload routes', () => {
      mockReq.path = '/upload';
      mockReq.body = { entityType: 'user_profile' };
      mockReq.file = {
        mimetype: 'image/jpeg',
        size: 2048,
      } as any;

      const middleware = uploadMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();

      // Trigger finish event
      endCallback();

      expect(metricsService.recordUpload).toHaveBeenCalledWith(
        'POST',
        'success',
        'user_profile',
        'image',
        expect.any(Number),
        2048
      );
    });

    it('should skip non-upload routes', () => {
      mockReq.path = '/health';

      const middleware = uploadMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(metricsService.recordUpload).not.toHaveBeenCalled();
    });

    it('should handle missing file data', () => {
      mockReq.path = '/upload';
      mockReq.body = { entityType: 'document' };
      // No file property

      const middleware = uploadMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      endCallback();

      expect(metricsService.recordUpload).toHaveBeenCalledWith(
        'POST',
        'success',
        'document',
        'unknown',
        expect.any(Number),
        0
      );
    });

    it('should record error status for failed uploads', () => {
      mockReq.path = '/upload';
      mockRes.statusCode = 400;

      const middleware = uploadMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      endCallback();

      expect(metricsService.recordUpload).toHaveBeenCalledWith(
        'POST',
        'error',
        'unknown',
        'unknown',
        expect.any(Number),
        0
      );
    });
  });

  describe('processingMetricsMiddleware', () => {
    it('should record processing metrics', () => {
      mockReq.file = {
        mimetype: 'image/png',
      } as any;

      const middleware = processingMetricsMiddleware('resize', 'image');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();

      endCallback();

      expect(metricsService.recordProcessing).toHaveBeenCalledWith(
        'resize',
        'success',
        'image',
        expect.any(Number)
      );
    });

    it('should use file type from request if not provided', () => {
      mockReq.file = {
        mimetype: 'application/pdf',
      } as any;

      const middleware = processingMetricsMiddleware('validate');
      middleware(mockReq, mockRes, mockNext);

      endCallback();

      expect(metricsService.recordProcessing).toHaveBeenCalledWith(
        'validate',
        'success',
        'application',
        expect.any(Number)
      );
    });

    it('should record error status for failed processing', () => {
      mockRes.statusCode = 500;

      const middleware = processingMetricsMiddleware('thumbnail', 'image');
      middleware(mockReq, mockRes, mockNext);

      endCallback();

      expect(metricsService.recordProcessing).toHaveBeenCalledWith(
        'thumbnail',
        'error',
        'image',
        expect.any(Number)
      );
    });
  });

  describe('securityMetricsMiddleware', () => {
    it('should record authentication failures', () => {
      mockRes.statusCode = 401;

      const middleware = securityMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(metricsService.recordSecurityEvent).toHaveBeenCalledWith(
        'authentication_failure',
        'medium'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should record authorization failures', () => {
      mockRes.statusCode = 403;

      const middleware = securityMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(metricsService.recordSecurityEvent).toHaveBeenCalledWith(
        'authorization_failure',
        'medium'
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not record events for successful requests', () => {
      mockRes.statusCode = 200;

      const middleware = securityMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      expect(metricsService.recordSecurityEvent).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle other 4xx errors', () => {
      mockRes.statusCode = 429; // Too Many Requests

      const middleware = securityMetricsMiddleware as any;
      middleware(mockReq, mockRes, mockNext);

      // Should not record specific security events for other 4xx codes
      expect(metricsService.recordSecurityEvent).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('errorMetricsMiddleware', () => {
    it('should record error metrics', () => {
      const error = new Error('Test error');
      error.name = 'ValidationError';
      mockRes.statusCode = 400;

      const middleware = errorMetricsMiddleware as any;
      middleware(error, mockReq, mockRes, mockNext);

      expect(metricsService.recordError).toHaveBeenCalledWith(
        'upload-service',
        'ValidationError',
        'medium'
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should determine error severity correctly', () => {
      const error = new Error('Database error');
      error.name = 'DatabaseError';
      mockRes.statusCode = 500;

      const middleware = errorMetricsMiddleware as any;
      middleware(error, mockReq, mockRes, mockNext);

      expect(metricsService.recordError).toHaveBeenCalledWith(
        'upload-service',
        'DatabaseError',
        'high'
      );
    });

    it('should handle errors without names', () => {
      const error = new Error('Unknown error');
      delete (error as any).name;
      mockRes.statusCode = 500;

      const middleware = errorMetricsMiddleware as any;
      middleware(error, mockReq, mockRes, mockNext);

      expect(metricsService.recordError).toHaveBeenCalledWith(
        'upload-service',
        'UnknownError',
        'high'
      );
    });
  });

  describe('storageMetricsMiddleware', () => {
    it('should create storage metrics recorder', () => {
      const recorder = storageMetricsMiddleware('local');

      expect(recorder).toHaveProperty('recordOperation');
      expect(recorder).toHaveProperty('updateMetrics');
    });

    it('should record storage operations', () => {
      const recorder = storageMetricsMiddleware('s3');

      recorder.recordOperation('store', true);

      expect(metricsService.recordStorageOperation).toHaveBeenCalledWith(
        'store',
        's3',
        'success'
      );
    });

    it('should record failed storage operations', () => {
      const recorder = storageMetricsMiddleware('local');

      recorder.recordOperation('retrieve', false);

      expect(metricsService.recordStorageOperation).toHaveBeenCalledWith(
        'retrieve',
        'local',
        'error'
      );
    });

    it('should update storage metrics', () => {
      const recorder = storageMetricsMiddleware('gcs');

      recorder.updateMetrics(1073741824, 500, 'user_profile');

      expect(metricsService.updateStorageMetrics).toHaveBeenCalledWith(
        'gcs',
        1073741824,
        500,
        'user_profile'
      );
    });
  });
});
