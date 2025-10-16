/**
 * Unit tests for SMTPEmailProvider
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailProviderConfig } from '../interfaces/email.interface';
import { SMTPEmailProvider } from '../providers/smtp-email.provider';
import {
  EmailRequest,
  NotificationErrorCode,
  NotificationStatus,
} from '../types';

// Mock nodemailer
const mockTransporter = {
  verify: vi.fn(),
  sendMail: vi.fn(),
};

vi.mock('nodemailer', () => ({
  default: {
    createTransporter: vi.fn(() => mockTransporter),
  },
}));

vi.mock('../lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('SMTPEmailProvider', () => {
  let provider: SMTPEmailProvider;
  let config: EmailProviderConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    config = {
      name: 'test-smtp',
      type: 'smtp',
      enabled: true,
      priority: 1,
      smtp: {
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@test.com',
          pass: 'testpass',
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      },
    };

    provider = new SMTPEmailProvider('test-smtp');
  });

  describe('configure', () => {
    it('should configure SMTP provider successfully', async () => {
      mockTransporter.verify.mockResolvedValue(true);

      await provider.configure(config);

      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('should throw error when SMTP config is missing', async () => {
      const invalidConfig = { ...config };
      delete invalidConfig.smtp;

      await expect(provider.configure(invalidConfig)).rejects.toThrow(
        'SMTP configuration is required'
      );
    });

    it('should handle SMTP verification failure', async () => {
      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));

      await expect(provider.configure(config)).rejects.toThrow(
        'Connection failed'
      );
    });
  });

  describe('sendEmail', () => {
    beforeEach(async () => {
      mockTransporter.verify.mockResolvedValue(true);
      await provider.configure(config);
    });

    it('should send email successfully', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        textBody: 'Test Text Body',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(result.messageId).toBe('test-message-id');
      expect(result.provider).toBe('test-smtp');
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>Test HTML Body</p>',
          text: 'Test Text Body',
        })
      );
    });

    it('should handle multiple recipients', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test1@example.com', 'test2@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test1@example.com, test2@example.com',
        })
      );
    });

    it('should include CC and BCC recipients', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com'],
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      await provider.sendEmail(emailRequest);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          cc: 'cc@example.com',
          bcc: 'bcc@example.com',
        })
      );
    });

    it('should include attachments', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        attachments: [
          {
            filename: 'test.pdf',
            content: Buffer.from('test content'),
            contentType: 'application/pdf',
          },
        ],
      };

      await provider.sendEmail(emailRequest);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: [
            {
              filename: 'test.pdf',
              content: Buffer.from('test content'),
              contentType: 'application/pdf',
              cid: undefined,
            },
          ],
        })
      );
    });

    it('should add priority headers', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        priority: 'urgent',
      };

      await provider.sendEmail(emailRequest);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
          }),
        })
      );
    });

    it('should add tracking headers when enabled', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        trackingEnabled: true,
      };

      await provider.sendEmail(emailRequest);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Track-Opens': 'true',
            'X-Track-Clicks': 'true',
          }),
        })
      );
    });

    it('should add metadata as custom headers', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        metadata: {
          campaign: 'welcome',
          userId: '12345',
        },
      };

      await provider.sendEmail(emailRequest);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Metadata-campaign': 'welcome',
            'X-Metadata-userId': '12345',
          }),
        })
      );
    });

    it('should handle SMTP errors gracefully', async () => {
      mockTransporter.sendMail.mockRejectedValue(
        new Error('SMTP connection failed')
      );

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(
        NotificationErrorCode.SERVICE_UNAVAILABLE
      );
      expect(result.error?.message).toBe('SMTP connection failed');
      expect(result.error?.retryable).toBe(true);
    });

    it('should handle authentication errors', async () => {
      mockTransporter.sendMail.mockRejectedValue(
        new Error('Invalid login credentials')
      );

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(
        NotificationErrorCode.AUTHENTICATION_FAILED
      );
      expect(result.error?.retryable).toBe(false);
    });

    it('should handle rate limit errors', async () => {
      mockTransporter.sendMail.mockRejectedValue(
        new Error('Rate limit exceeded')
      );

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(
        NotificationErrorCode.RATE_LIMIT_EXCEEDED
      );
      expect(result.error?.retryable).toBe(true);
      expect(result.error?.retryAfter).toBe(60000); // 1 minute
    });

    it('should validate email request before sending', async () => {
      const emailRequest: EmailRequest = {
        to: 'invalid-email',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.message).toContain('Email validation failed');
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should require either HTML or text body', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        // No body content
      };

      const result = await provider.sendEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.message).toContain(
        'Either HTML body or text body is required'
      );
    });
  });

  describe('sendBulkEmails', () => {
    beforeEach(async () => {
      mockTransporter.verify.mockResolvedValue(true);
      await provider.configure(config);
    });

    it('should send multiple emails in batches', async () => {
      const mockResult = {
        messageId: 'test-message-id',
        accepted: ['test@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      };

      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const emailRequests: EmailRequest[] = [
        {
          to: 'test1@example.com',
          subject: 'Test Subject 1',
          htmlBody: '<p>Test HTML Body 1</p>',
        },
        {
          to: 'test2@example.com',
          subject: 'Test Subject 2',
          htmlBody: '<p>Test HTML Body 2</p>',
        },
      ];

      const results = await provider.sendBulkEmails(emailRequests);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe(NotificationStatus.SENT);
      expect(results[1].status).toBe(NotificationStatus.SENT);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures in bulk sending', async () => {
      mockTransporter.sendMail
        .mockResolvedValueOnce({
          messageId: 'success-id',
          accepted: ['test1@example.com'],
          rejected: [],
          pending: [],
          response: '250 OK',
        })
        .mockRejectedValueOnce(new Error('SMTP error'));

      const emailRequests: EmailRequest[] = [
        {
          to: 'test1@example.com',
          subject: 'Test Subject 1',
          htmlBody: '<p>Test HTML Body 1</p>',
        },
        {
          to: 'test2@example.com',
          subject: 'Test Subject 2',
          htmlBody: '<p>Test HTML Body 2</p>',
        },
      ];

      const results = await provider.sendBulkEmails(emailRequests);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe(NotificationStatus.SENT);
      expect(results[1].status).toBe(NotificationStatus.FAILED);
    });
  });

  describe('validateEmailAddress', () => {
    it('should validate correct email addresses', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      for (const email of validEmails) {
        const isValid = await provider.validateEmailAddress(email);
        expect(isValid).toBe(true);
      }
    });

    it('should reject invalid email addresses', async () => {
      const invalidEmails = ['invalid-email', '@example.com', 'test@', ''];

      for (const email of invalidEmails) {
        const isValid = await provider.validateEmailAddress(email);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('healthCheck', () => {
    it('should return true when provider is healthy', async () => {
      mockTransporter.verify.mockResolvedValue(true);
      await provider.configure(config);

      mockTransporter.verify.mockResolvedValue(true);
      const isHealthy = await provider.healthCheck();

      expect(isHealthy).toBe(true);
    });

    it('should return false when provider is not configured', async () => {
      const isHealthy = await provider.healthCheck();

      expect(isHealthy).toBe(false);
    });

    it('should return false when SMTP verification fails', async () => {
      mockTransporter.verify.mockResolvedValue(true);
      await provider.configure(config);

      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));
      const isHealthy = await provider.healthCheck();

      expect(isHealthy).toBe(false);
    });
  });

  describe('getQuota', () => {
    it('should return unlimited quota for SMTP', async () => {
      const quota = await provider.getQuota();

      expect(quota).toEqual({
        limit: -1,
        used: 0,
        remaining: -1,
      });
    });
  });

  describe('getDeliveryStatus', () => {
    it('should return sent status for SMTP', async () => {
      const status = await provider.getDeliveryStatus('test-message-id');

      expect(status).toBe('sent');
    });
  });
});
