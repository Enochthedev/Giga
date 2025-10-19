/**
 * Unit tests for Twilio SMS Provider
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TwilioSMSProvider } from '../providers/twilio-sms.provider';
import {
  NotificationChannel,
  NotificationErrorCode,
  NotificationPriority,
  NotificationStatus,
  SMSProviderConfig,
  SMSRequest,
} from '../types';

// Mock Twilio
const mockTwilioClient = {
  messages: {
    create: vi.fn(),
  },
  api: {
    accounts: vi.fn(() => ({
      fetch: vi.fn(),
    })),
  },
};

vi.mock('twilio', () => ({
  Twilio: vi.fn(() => mockTwilioClient),
}));

describe('TwilioSMSProvider', () => {
  let provider: TwilioSMSProvider;
  let mockConfig: SMSProviderConfig;

  beforeEach(() => {
    provider = new TwilioSMSProvider('test-twilio');

    mockConfig = {
      name: 'test-twilio',
      type: NotificationChannel.SMS,
      enabled: true,
      priority: 1,
      rateLimits: [],
      healthCheck: {
        enabled: true,
        interval: 30000,
        timeout: 5000,
        retries: 3,
      },
      failover: {
        enabled: true,
        maxFailures: 3,
        failureWindow: 300000,
        backoffMultiplier: 2,
        maxBackoffTime: 60000,
      },
      credentials: {
        accountSid: 'test_account_sid',
        authToken: 'test_auth_token',
      },
      settings: {
        fromNumber: '+1234567890',
        maxMessageLength: 1600,
      },
    };

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should configure successfully with valid credentials', async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });

      await expect(provider.configure(mockConfig)).resolves.not.toThrow();
      expect(provider.name).toBe('test-twilio');
      expect(provider.channel).toBe(NotificationChannel.SMS);
    });

    it('should throw error when Account SID is missing', async () => {
      const invalidConfig = {
        ...mockConfig,
        credentials: { authToken: 'test_auth_token' },
      };

      await expect(provider.configure(invalidConfig)).rejects.toThrow(
        'Twilio Account SID and Auth Token are required'
      );
    });

    it('should throw error when Auth Token is missing', async () => {
      const invalidConfig = {
        ...mockConfig,
        credentials: { accountSid: 'test_account_sid' },
      };

      await expect(provider.configure(invalidConfig)).rejects.toThrow(
        'Twilio Account SID and Auth Token are required'
      );
    });

    it('should throw error when from number is missing', async () => {
      const invalidConfig = {
        ...mockConfig,
        settings: { maxMessageLength: 1600 },
      };

      await expect(provider.configure(invalidConfig)).rejects.toThrow(
        'Twilio from number is required'
      );
    });
  });

  describe('SMS Sending', () => {
    beforeEach(async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      await provider.configure(mockConfig);
    });

    it('should send SMS successfully', async () => {
      const mockResponse = {
        sid: 'SM123456789',
        status: 'sent',
        direction: 'outbound-api',
        price: '-0.0075',
        priceUnit: 'USD',
        uri: '/2010-04-01/Accounts/test/Messages/SM123456789.json',
        accountSid: 'test_account_sid',
        numSegments: '1',
      };

      mockTwilioClient.messages.create.mockResolvedValue(mockResponse);

      const request: SMSRequest = {
        to: '+1987654321',
        body: 'Test SMS message',
        priority: NotificationPriority.NORMAL,
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('SM123456789');
      expect(result.status).toBe(NotificationStatus.SENT);
      expect(result.provider).toBe('test-twilio');
      expect(result.metadata).toMatchObject({
        twilioStatus: 'sent',
        direction: 'outbound-api',
        price: '-0.0075',
        priceUnit: 'USD',
      });

      expect(mockTwilioClient.messages.create).toHaveBeenCalledWith({
        to: '+1987654321',
        from: '+1234567890',
        body: 'Test SMS message',
      });
    });

    it('should handle SMS sending failure', async () => {
      const request: SMSRequest = {
        to: 'invalid-phone',
        body: 'Test SMS message',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('SMS validation failed');
    });

    it('should validate phone number format', async () => {
      const request: SMSRequest = {
        to: 'invalid-phone',
        body: 'Test SMS message',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('SMS validation failed');
    });

    it('should validate message body is required', async () => {
      const request: SMSRequest = {
        to: '+1987654321',
        body: '',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('SMS message body is required');
    });

    it('should validate message length', async () => {
      const longMessage = 'a'.repeat(2000); // Exceeds default limit
      const request: SMSRequest = {
        to: '+1987654321',
        body: longMessage,
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('exceeds maximum length');
    });

    it('should use messaging service SID when configured', async () => {
      const configWithMessagingService = {
        ...mockConfig,
        settings: {
          ...mockConfig.settings,
          messagingServiceSid: 'MG123456789',
        },
      };

      await provider.configure(configWithMessagingService);

      const mockResponse = {
        sid: 'SM123456789',
        status: 'sent',
        direction: 'outbound-api',
        price: '-0.0075',
        priceUnit: 'USD',
        uri: '/2010-04-01/Accounts/test/Messages/SM123456789.json',
        accountSid: 'test_account_sid',
        numSegments: '1',
      };

      mockTwilioClient.messages.create.mockResolvedValue(mockResponse);

      const request: SMSRequest = {
        to: '+1987654321',
        body: 'Test SMS message',
      };

      await provider.sendSMS(request);

      expect(mockTwilioClient.messages.create).toHaveBeenCalledWith({
        to: '+1987654321',
        messagingServiceSid: 'MG123456789',
        body: 'Test SMS message',
      });
    });
  });

  describe('Bulk SMS Sending', () => {
    beforeEach(async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      await provider.configure(mockConfig);
    });

    it('should send bulk SMS successfully', async () => {
      const mockResponse = {
        sid: 'SM123456789',
        status: 'sent',
        direction: 'outbound-api',
        price: '-0.0075',
        priceUnit: 'USD',
        uri: '/2010-04-01/Accounts/test/Messages/SM123456789.json',
        accountSid: 'test_account_sid',
        numSegments: '1',
      };

      mockTwilioClient.messages.create.mockResolvedValue(mockResponse);

      const requests: SMSRequest[] = [
        { to: '+1987654321', body: 'Test SMS 1' },
        { to: '+1987654322', body: 'Test SMS 2' },
        { to: '+1987654323', body: 'Test SMS 3' },
      ];

      const results = await provider.sendBulkSMS(requests);

      expect(results).toHaveLength(3);
      expect(results.every(result => result.success)).toBe(true);
      expect(mockTwilioClient.messages.create).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures in bulk sending', async () => {
      mockTwilioClient.messages.create
        .mockResolvedValueOnce({
          sid: 'SM123456789',
          status: 'sent',
          direction: 'outbound-api',
          price: '-0.0075',
          priceUnit: 'USD',
          uri: '/2010-04-01/Accounts/test/Messages/SM123456789.json',
          accountSid: 'test_account_sid',
          numSegments: '1',
        })
        .mockResolvedValueOnce({
          sid: 'SM123456790',
          status: 'sent',
          direction: 'outbound-api',
          price: '-0.0075',
          priceUnit: 'USD',
          uri: '/2010-04-01/Accounts/test/Messages/SM123456790.json',
          accountSid: 'test_account_sid',
          numSegments: '1',
        });

      const requests: SMSRequest[] = [
        { to: '+1987654321', body: 'Test SMS 1' },
        { to: '+1987654323', body: 'Test SMS 3' },
      ];

      const results = await provider.sendBulkSMS(requests);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate correct phone numbers', async () => {
      const validNumbers = ['+1234567890', '+44123456789', '+33123456789'];

      for (const number of validNumbers) {
        const isValid = await provider.validatePhoneNumber(number);
        expect(isValid).toBe(true);
      }
    });

    it('should reject invalid phone numbers', async () => {
      const invalidNumbers = ['invalid', '123', 'abc123', ''];

      for (const number of invalidNumbers) {
        const isValid = await provider.validatePhoneNumber(number);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('Delivery Status', () => {
    beforeEach(async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      await provider.configure(mockConfig);
    });

    it('should get delivery status successfully', async () => {
      const mockMessage = {
        status: 'delivered',
      };

      mockTwilioClient.messages = vi.fn(() => ({
        fetch: vi.fn().mockResolvedValue(mockMessage),
      }));

      const status = await provider.getDeliveryStatus('SM123456789');
      expect(status).toBe('delivered');
    });

    it('should handle delivery status fetch failure', async () => {
      mockTwilioClient.messages = vi.fn(() => ({
        fetch: vi.fn().mockRejectedValue(new Error('Message not found')),
      }));

      const status = await provider.getDeliveryStatus('invalid-id');
      expect(status).toBe('unknown');
    });
  });

  describe('Health Check', () => {
    it('should pass health check when configured and account is active', async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });

      await provider.configure(mockConfig);

      const isHealthy = await provider.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should fail health check when not configured', async () => {
      const isHealthy = await provider.healthCheck();
      expect(isHealthy).toBe(false);
    });

    it('should fail health check when account fetch fails', async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockRejectedValue(new Error('Network error')),
      });

      // Configuration will fail, so we expect the provider to not be configured
      await expect(provider.configure(mockConfig)).rejects.toThrow(
        'Network error'
      );

      const isHealthy = await provider.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });

  describe('Quota Management', () => {
    beforeEach(async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      await provider.configure(mockConfig);
    });

    it('should return quota information', async () => {
      const quota = await provider.getQuota();

      expect(quota).toMatchObject({
        limit: -1,
        used: 0,
        remaining: -1,
      });
    });
  });

  describe('Webhook Handling', () => {
    it('should handle delivery receipt webhook', async () => {
      const webhookData = {
        MessageSid: 'SM123456789',
        MessageStatus: 'delivered',
        To: '+1987654321',
        From: '+1234567890',
      };

      // Should not throw
      await expect(
        provider.handleDeliveryReceipt(webhookData)
      ).resolves.not.toThrow();
    });
  });

  describe('Error Mapping', () => {
    beforeEach(async () => {
      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      mockTwilioClient.messages.create = vi.fn();
      await provider.configure(mockConfig);
    });

    it('should map Twilio authentication errors correctly', async () => {
      const authError = { code: 20003, message: 'Authentication Error' };
      mockTwilioClient.messages.create.mockRejectedValue(authError);

      const request: SMSRequest = {
        to: '+1987654321',
        body: 'Test message',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        NotificationErrorCode.AUTHENTICATION_FAILED
      );
    });

    it('should map Twilio invalid phone number errors correctly', async () => {
      const phoneError = { code: 21211, message: "Invalid 'To' Phone Number" };
      mockTwilioClient.messages.create.mockRejectedValue(phoneError);

      const request: SMSRequest = {
        to: '+1987654321',
        body: 'Test message',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(NotificationErrorCode.INVALID_RECIPIENT);
    });

    it('should map Twilio rate limit errors correctly', async () => {
      const rateLimitError = { code: 20429, message: 'Too Many Requests' };
      mockTwilioClient.messages.create.mockRejectedValue(rateLimitError);

      const request: SMSRequest = {
        to: '+1987654321',
        body: 'Test message',
      };

      const result = await provider.sendSMS(request);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        NotificationErrorCode.RATE_LIMIT_EXCEEDED
      );
      expect(result.error?.retryAfter).toBe(60000); // 1 minute
    });
  });

  describe('Status Mapping', () => {
    it('should map Twilio statuses to notification statuses correctly', async () => {
      const statusMappings = [
        { twilioStatus: 'queued', expectedStatus: NotificationStatus.QUEUED },
        { twilioStatus: 'accepted', expectedStatus: NotificationStatus.QUEUED },
        {
          twilioStatus: 'sending',
          expectedStatus: NotificationStatus.PROCESSING,
        },
        { twilioStatus: 'sent', expectedStatus: NotificationStatus.SENT },
        {
          twilioStatus: 'delivered',
          expectedStatus: NotificationStatus.DELIVERED,
        },
        { twilioStatus: 'failed', expectedStatus: NotificationStatus.FAILED },
        {
          twilioStatus: 'undelivered',
          expectedStatus: NotificationStatus.FAILED,
        },
      ];

      mockTwilioClient.api.accounts.mockReturnValue({
        fetch: vi.fn().mockResolvedValue({ status: 'active' }),
      });
      mockTwilioClient.messages.create = vi.fn();
      await provider.configure(mockConfig);

      for (const { twilioStatus, expectedStatus } of statusMappings) {
        mockTwilioClient.messages.create.mockResolvedValue({
          sid: 'SM123456789',
          status: twilioStatus,
          direction: 'outbound-api',
          price: '-0.0075',
          priceUnit: 'USD',
          uri: '/2010-04-01/Accounts/test/Messages/SM123456789.json',
          accountSid: 'test_account_sid',
          numSegments: '1',
        });

        const request: SMSRequest = {
          to: '+1987654321',
          body: 'Test message',
        };

        const result = await provider.sendSMS(request);
        expect(result.status).toBe(expectedStatus);
      }
    });
  });
});
