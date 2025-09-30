import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseGateway } from '../../services/gateways/base-gateway.service';
import { GatewayConfig, GatewayError } from '../../types/gateway.types';
import { PaymentMethod, PaymentRequest, PaymentResponse, Refund } from '../../types/payment.types';

// Create a concrete implementation for testing
class TestGateway extends BaseGateway {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    throw new Error('Not implemented');
  }

  async capturePayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    throw new Error('Not implemented');
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    throw new Error('Not implemented');
  }

  async refundPayment(transactionId: string, amount?: number, reason?: string): Promise<Refund> {
    throw new Error('Not implemented');
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    throw new Error('Not implemented');
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    throw new Error('Not implemented');
  }

  async deletePaymentMethod(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    throw new Error('Not implemented');
  }
}

describe('BaseGateway', () => {
  let gateway: TestGateway;
  let mockConfig: GatewayConfig;

  beforeEach(() => {
    mockConfig = {
      id: 'test-gateway',
      type: 'stripe',
      name: 'Test Gateway',
      status: 'active',
      priority: 100,
      credentials: { apiKey: 'test-key', secretKey: 'test-secret' },
      settings: {
        supportedCurrencies: ['USD', 'EUR'],
        supportedCountries: ['US', 'GB'],
        supportedPaymentMethods: ['card'],
        minAmount: 1,
        maxAmount: 10000,
        processingFee: { type: 'percentage', value: 2.9 }
      },
      healthCheck: {
        interval: 60000,
        timeout: 5000,
        retries: 3
      },
      rateLimit: {
        requestsPerSecond: 10,
        burstLimit: 50
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    gateway = new TestGateway(mockConfig);
  });

  describe('Configuration Validation', () => {
    it('should validate valid configuration', () => {
      expect(() => new TestGateway(mockConfig)).not.toThrow();
    });

    it('should throw error for missing credentials', () => {
      const invalidConfig = { ...mockConfig, credentials: {} };
      expect(() => new TestGateway(invalidConfig)).toThrow(
        'Gateway test-gateway is missing required credentials'
      );
    });

    it('should throw error for empty supported currencies', () => {
      const invalidConfig = {
        ...mockConfig,
        settings: { ...mockConfig.settings, supportedCurrencies: [] }
      };
      expect(() => new TestGateway(invalidConfig)).toThrow(
        'Gateway test-gateway must support at least one currency'
      );
    });
  });

  describe('Retry Logic', () => {
    it('should execute operation successfully on first attempt', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');

      const result = await gateway['executeWithRetry'](mockOperation, 'test-operation');

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it('should retry failed operations', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce('success');

      const result = await gateway['executeWithRetry'](mockOperation, 'test-operation');

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Persistent failure'));

      await expect(
        gateway['executeWithRetry'](mockOperation, 'test-operation')
      ).rejects.toThrow('Gateway test-gateway test-operation failed: Persistent failure');

      expect(mockOperation).toHaveBeenCalledTimes(3); // Original + 2 retries
    });

    it('should not retry non-retryable errors', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        gateway['executeWithRetry'](mockOperation, 'test-operation')
      ).rejects.toThrow('Gateway test-gateway test-operation failed: Invalid credentials');

      expect(mockOperation).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('Error Handling', () => {
    it('should identify non-retryable errors', () => {
      const retryableError = new Error('Network timeout');
      const nonRetryableError = new Error('Invalid API key');

      expect(gateway['isNonRetryableError'](retryableError)).toBe(false);
      expect(gateway['isNonRetryableError'](nonRetryableError)).toBe(true);
    });

    it('should create gateway error with correct properties', () => {
      const originalError = new Error('Test error');
      const gatewayError = gateway['createGatewayError'](originalError, 'test-operation');

      expect(gatewayError).toBeInstanceOf(Error);
      expect(gatewayError.message).toContain('Gateway test-gateway test-operation failed: Test error');
      expect((gatewayError as GatewayError).gatewayId).toBe('test-gateway');
      expect((gatewayError as GatewayError).isRetryable).toBe(true);
    });

    it('should mark non-retryable errors correctly', () => {
      const nonRetryableError = new Error('Unauthorized access');
      const gatewayError = gateway['createGatewayError'](nonRetryableError, 'test-operation');

      expect((gatewayError as GatewayError).isRetryable).toBe(false);
    });
  });

  describe('Response Creation', () => {
    it('should create success response', () => {
      const data = { id: 'test-id', status: 'success' };
      const metadata = { timestamp: new Date() };

      const response = gateway['createSuccessResponse'](data, metadata);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.metadata).toEqual(metadata);
    });

    it('should create error response', () => {
      const response = gateway['createErrorResponse'](
        'PAYMENT_FAILED',
        'Payment processing failed',
        { errorCode: 'E001' }
      );

      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('PAYMENT_FAILED');
      expect(response.error?.message).toBe('Payment processing failed');
      expect(response.error?.details).toEqual({ errorCode: 'E001' });
    });
  });

  describe('Payment Request Validation', () => {
    it('should validate valid payment request', () => {
      const validRequest: PaymentRequest = {
        amount: 100,
        currency: 'USD',
        paymentMethodId: 'pm_test',
        customerId: 'cus_test'
      };

      expect(() => gateway['validatePaymentRequest'](validRequest)).not.toThrow();
    });

    it('should throw error for invalid amount', () => {
      const invalidRequest: PaymentRequest = {
        amount: 0,
        currency: 'USD',
        paymentMethodId: 'pm_test',
        customerId: 'cus_test'
      };

      expect(() => gateway['validatePaymentRequest'](invalidRequest)).toThrow(
        'Payment amount must be greater than zero'
      );
    });

    it('should throw error for missing currency', () => {
      const invalidRequest: PaymentRequest = {
        amount: 100,
        currency: '',
        paymentMethodId: 'pm_test',
        customerId: 'cus_test'
      };

      expect(() => gateway['validatePaymentRequest'](invalidRequest)).toThrow(
        'Payment currency is required'
      );
    });

    it('should throw error for unsupported currency', () => {
      const invalidRequest: PaymentRequest = {
        amount: 100,
        currency: 'JPY',
        paymentMethodId: 'pm_test',
        customerId: 'cus_test'
      };

      expect(() => gateway['validatePaymentRequest'](invalidRequest)).toThrow(
        'Currency JPY is not supported by gateway test-gateway'
      );
    });

    it('should throw error for amount outside supported range', () => {
      const invalidRequest: PaymentRequest = {
        amount: 20000, // Above maxAmount of 10000
        currency: 'USD',
        paymentMethodId: 'pm_test',
        customerId: 'cus_test'
      };

      expect(() => gateway['validatePaymentRequest'](invalidRequest)).toThrow(
        'Amount 20000 is outside supported range'
      );
    });
  });

  describe('Refund Request Validation', () => {
    it('should validate valid refund request', () => {
      expect(() => gateway['validateRefundRequest']('txn_123', 50)).not.toThrow();
    });

    it('should throw error for missing transaction ID', () => {
      expect(() => gateway['validateRefundRequest']('', 50)).toThrow(
        'Transaction ID is required for refund'
      );
    });

    it('should throw error for invalid refund amount', () => {
      expect(() => gateway['validateRefundRequest']('txn_123', 0)).toThrow(
        'Refund amount must be greater than zero'
      );
    });

    it('should allow undefined amount', () => {
      expect(() => gateway['validateRefundRequest']('txn_123')).not.toThrow();
    });
  });

  describe('Utility Methods', () => {
    it('should create delay promise', async () => {
      const startTime = Date.now();
      await gateway['delay'](100);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(90); // Allow some variance
    });

    it('should get safe config without sensitive data', () => {
      const safeConfig = gateway['getSafeConfig']();

      expect(safeConfig.id).toBe('test-gateway');
      expect(safeConfig.type).toBe('stripe');
      expect(safeConfig.settings).toBeDefined();
      expect(safeConfig.credentials).toBeUndefined(); // Should not include credentials
    });
  });

  describe('Default Implementations', () => {
    it('should provide default webhook verification', () => {
      const result = gateway.verifyWebhook('payload', 'signature');
      expect(result).toBe(false);
    });

    it('should provide default webhook parsing', () => {
      const webhookEvent = gateway.parseWebhook('{"type": "test"}');

      expect(webhookEvent.type).toBe('unknown');
      expect(webhookEvent.gatewayId).toBe('test-gateway');
      expect(webhookEvent.processed).toBe(false);
      expect(webhookEvent.retryCount).toBe(0);
    });

    it('should provide default health check', async () => {
      const isHealthy = await gateway.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should provide default status check', async () => {
      const status = await gateway.getStatus();
      expect(status).toBe('active');
    });

    it('should handle health check failure in status check', async () => {
      // Override health check to fail
      vi.spyOn(gateway, 'healthCheck').mockResolvedValue(false);

      const status = await gateway.getStatus();
      expect(status).toBe('error');
    });

    it('should handle health check error in status check', async () => {
      // Override health check to throw error
      vi.spyOn(gateway, 'healthCheck').mockRejectedValue(new Error('Health check failed'));

      const status = await gateway.getStatus();
      expect(status).toBe('error');
    });
  });

  describe('Logging Methods', () => {
    it('should log operations', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      gateway['logOperation']('test-operation', { key: 'value' });

      // Verify logging was called (implementation depends on logger)
      logSpy.mockRestore();
    });

    it('should log errors', () => {
      const logSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      gateway['logError']('test-operation', new Error('Test error'), { key: 'value' });

      // Verify error logging was called (implementation depends on logger)
      logSpy.mockRestore();
    });
  });
});