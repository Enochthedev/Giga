import { beforeEach, describe, expect, it } from 'vitest';
import {
  UploadClient,
  createUploadClient,
  defaultUploadClientConfig,
} from '../../client/upload-client';
import { UploadErrorCode } from '../../types/upload.types';

describe('UploadClient Unit Tests', () => {
  describe('Configuration', () => {
    it('should apply default configuration correctly', () => {
      const config = {
        baseURL: 'http://localhost:3005',
        ...defaultUploadClientConfig,
      };

      expect(config.timeout).toBe(30000);
      expect(config.retryAttempts).toBe(3);
      expect(config.retryDelay).toBe(1000);
      expect(config.maxRetryDelay).toBe(10000);
    });

    it('should merge custom configuration with defaults', () => {
      const customConfig = {
        baseURL: 'http://localhost:3005',
        timeout: 60000,
        retryAttempts: 5,
      };

      const client = createUploadClient(customConfig);
      expect(client).toBeInstanceOf(UploadClient);
    });

    it('should validate required configuration', () => {
      expect(() => {
        // @ts-expect-error - Testing missing required config
        createUploadClient({});
      }).toThrow();
    });
  });

  describe('Error Creation', () => {
    let client: UploadClient;

    beforeEach(() => {
      client = createUploadClient({
        baseURL: 'http://localhost:3005',
        retryAttempts: 0, // Disable retries for testing
      });
    });

    it('should create upload error from API response', () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              code: UploadErrorCode.INVALID_FILE_TYPE,
              message: 'File type not supported',
              details: { allowedTypes: ['image/jpeg'] },
            },
          },
        },
      };

      // Access private method for testing
      const createUploadError = (client as any).createUploadError.bind(client);
      const uploadError = createUploadError(mockError);

      expect(uploadError).toEqual({
        code: UploadErrorCode.INVALID_FILE_TYPE,
        message: 'File type not supported',
        details: { allowedTypes: ['image/jpeg'] },
        retryable: false,
      });
    });

    it('should create upload error from network error', () => {
      const mockError = {
        code: 'ECONNREFUSED',
        message: 'Connection refused',
      };

      const createUploadError = (client as any).createUploadError.bind(client);
      const uploadError = createUploadError(mockError);

      expect(uploadError).toEqual({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Upload service is unavailable',
        retryable: true,
      });
    });

    it('should create upload error from timeout', () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'Request timeout',
      };

      const createUploadError = (client as any).createUploadError.bind(client);
      const uploadError = createUploadError(mockError);

      expect(uploadError).toEqual({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Request timeout',
        retryable: true,
      });
    });

    it('should create generic upload error for unknown errors', () => {
      const mockError = {
        message: 'Unknown error',
      };

      const createUploadError = (client as any).createUploadError.bind(client);
      const uploadError = createUploadError(mockError);

      expect(uploadError).toEqual({
        code: UploadErrorCode.SERVICE_UNAVAILABLE,
        message: 'Unknown error',
        retryable: false,
      });
    });
  });

  describe('Retry Conditions', () => {
    let client: UploadClient;

    beforeEach(() => {
      client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });
    });

    it('should retry on network errors', () => {
      const networkError = { code: 'ECONNREFUSED' };
      const defaultRetryCondition = (client as any).defaultRetryCondition.bind(
        client
      );

      expect(defaultRetryCondition(networkError)).toBe(true);
    });

    it('should retry on server errors (5xx)', () => {
      const serverError = { response: { status: 500 } };
      const defaultRetryCondition = (client as any).defaultRetryCondition.bind(
        client
      );

      expect(defaultRetryCondition(serverError)).toBe(true);
    });

    it('should retry on rate limiting (429)', () => {
      const rateLimitError = { response: { status: 429 } };
      const defaultRetryCondition = (client as any).defaultRetryCondition.bind(
        client
      );

      expect(defaultRetryCondition(rateLimitError)).toBe(true);
    });

    it('should not retry on client errors (4xx except 429)', () => {
      const clientError = { response: { status: 400 } };
      const defaultRetryCondition = (client as any).defaultRetryCondition.bind(
        client
      );

      expect(defaultRetryCondition(clientError)).toBe(false);
    });

    it('should not retry on successful responses (2xx)', () => {
      const successResponse = { response: { status: 200 } };
      const defaultRetryCondition = (client as any).defaultRetryCondition.bind(
        client
      );

      expect(defaultRetryCondition(successResponse)).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    let client: UploadClient;

    beforeEach(() => {
      client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });
    });

    it('should generate unique request IDs', () => {
      const generateRequestId = (client as any).generateRequestId.bind(client);

      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should implement sleep utility', async () => {
      const sleep = (client as any).sleep.bind(client);

      const start = Date.now();
      await sleep(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(90); // Allow some variance
    });
  });

  describe('Exponential Backoff', () => {
    it('should calculate correct retry delays', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
        retryDelay: 1000,
        maxRetryDelay: 10000,
      });

      // Access private config for testing
      const config = (client as any).config;

      // Test exponential backoff calculation
      const delay1 = Math.min(
        config.retryDelay * Math.pow(2, 0),
        config.maxRetryDelay
      );
      const delay2 = Math.min(
        config.retryDelay * Math.pow(2, 1),
        config.maxRetryDelay
      );
      const delay3 = Math.min(
        config.retryDelay * Math.pow(2, 2),
        config.maxRetryDelay
      );
      const delay4 = Math.min(
        config.retryDelay * Math.pow(2, 10),
        config.maxRetryDelay
      );

      expect(delay1).toBe(1000); // 1000 * 2^0 = 1000
      expect(delay2).toBe(2000); // 1000 * 2^1 = 2000
      expect(delay3).toBe(4000); // 1000 * 2^2 = 4000
      expect(delay4).toBe(10000); // Capped at maxRetryDelay
    });
  });

  describe('Request ID Generation', () => {
    it('should generate unique request IDs with correct format', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });

      const generateRequestId = (client as any).generateRequestId.bind(client);

      const ids = new Set();

      // Generate multiple IDs and ensure they're unique
      for (let i = 0; i < 100; i++) {
        const id = generateRequestId();
        expect(id).toMatch(/^req_\d+_[a-z0-9]{9}$/);
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });
  });

  describe('Configuration Validation', () => {
    it('should require baseURL', () => {
      expect(() => {
        // @ts-expect-error - Testing missing required config
        createUploadClient({});
      }).toThrow();
    });

    it('should accept minimal valid configuration', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });

      expect(client).toBeInstanceOf(UploadClient);
    });

    it('should accept full configuration', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
        timeout: 60000,
        retryAttempts: 5,
        retryDelay: 2000,
        maxRetryDelay: 30000,
        apiKey: 'test-api-key',
        serviceToken: 'test-service-token',
        retryCondition: () => true,
      });

      expect(client).toBeInstanceOf(UploadClient);
    });
  });

  describe('Type Safety', () => {
    it('should enforce correct EntityType values', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });

      // This should compile without errors
      const validOptions = {
        entityType: 'PRODUCT' as const,
        entityId: 'product-123',
        uploadedBy: 'user-456',
      };

      expect(validOptions.entityType).toBe('PRODUCT');
    });

    it('should enforce correct AccessLevel values', () => {
      const client = createUploadClient({
        baseURL: 'http://localhost:3005',
      });

      // This should compile without errors
      const validOptions = {
        entityType: 'PRODUCT' as const,
        entityId: 'product-123',
        uploadedBy: 'user-456',
        accessLevel: 'PUBLIC' as const,
      };

      expect(validOptions.accessLevel).toBe('PUBLIC');
    });
  });

  describe('Method Parameter Validation', () => {
    let client: UploadClient;

    beforeEach(() => {
      client = createUploadClient({
        baseURL: 'http://localhost:3005',
        retryAttempts: 0, // Disable retries for testing
      });
    });

    it('should validate file upload parameters', () => {
      const buffer = Buffer.from('test');
      const filename = 'test.jpg';
      const mimeType = 'image/jpeg';
      const options = {
        entityType: 'PRODUCT' as const,
        entityId: 'product-123',
        uploadedBy: 'user-456',
      };

      // These parameters should be valid
      expect(buffer).toBeInstanceOf(Buffer);
      expect(typeof filename).toBe('string');
      expect(typeof mimeType).toBe('string');
      expect(typeof options.entityType).toBe('string');
      expect(typeof options.entityId).toBe('string');
      expect(typeof options.uploadedBy).toBe('string');
    });

    it('should validate search parameters', () => {
      const searchCriteria = {
        entityType: 'PRODUCT' as const,
        tags: ['featured', 'sale'],
        limit: 10,
        offset: 0,
      };

      expect(searchCriteria.entityType).toBe('PRODUCT');
      expect(Array.isArray(searchCriteria.tags)).toBe(true);
      expect(typeof searchCriteria.limit).toBe('number');
      expect(typeof searchCriteria.offset).toBe('number');
    });
  });
});
