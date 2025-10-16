/**
 * Unit tests for EmailProcessorService
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SMTPEmailProvider } from '../providers/smtp-email.provider';
import { EmailProcessorService } from '../services/email.service';
import {
  EmailRequest,
  NotificationErrorCode,
  NotificationStatus,
} from '../types';

// Mock dependencies
vi.mock('../lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('../services/template.service', () => ({
  TemplateEngineService: vi.fn().mockImplementation(() => ({
    renderEmailTemplate: vi.fn().mockResolvedValue({
      subject: 'Test Subject',
      htmlBody: '<p>Test HTML Body</p>',
      textBody: 'Test Text Body',
    }),
  })),
}));

vi.mock('../providers/smtp-email.provider');

describe('EmailProcessorService', () => {
  let emailProcessor: EmailProcessorService;
  let mockSMTPProvider: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock environment variables
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'test@test.com';
    process.env.SMTP_PASS = 'testpass';

    // Create mock SMTP provider
    mockSMTPProvider = {
      configure: vi.fn().mockResolvedValue(undefined),
      sendEmail: vi.fn().mockResolvedValue({
        messageId: 'test-message-id',
        status: NotificationStatus.SENT,
        provider: 'smtp-primary',
        timestamp: new Date(),
        responseTime: 100,
      }),
      sendBulkEmails: vi.fn().mockResolvedValue([
        {
          messageId: 'test-message-id-1',
          status: NotificationStatus.SENT,
          provider: 'smtp-primary',
          timestamp: new Date(),
        },
        {
          messageId: 'test-message-id-2',
          status: NotificationStatus.SENT,
          provider: 'smtp-primary',
          timestamp: new Date(),
        },
      ]),
      healthCheck: vi.fn().mockResolvedValue(true),
      validateEmailAddress: vi.fn().mockResolvedValue(true),
    };

    // Mock SMTPEmailProvider constructor
    (SMTPEmailProvider as any).mockImplementation(() => mockSMTPProvider);

    emailProcessor = new EmailProcessorService();

    // Manually add the mock provider for testing
    await emailProcessor.addProvider('smtp-primary', {
      name: 'smtp-primary',
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
      },
    });
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_SECURE;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });

  describe('processEmail', () => {
    it('should successfully process a valid email request', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        textBody: 'Test Text Body',
      };

      const result = await emailProcessor.processEmail(emailRequest);

      expect(result).toEqual({
        messageId: 'test-message-id',
        status: NotificationStatus.SENT,
        provider: 'smtp-primary',
        estimatedDelivery: expect.any(Date),
      });

      expect(mockSMTPProvider.sendEmail).toHaveBeenCalledWith(emailRequest);
    });

    it('should handle email validation errors', async () => {
      const emailRequest: EmailRequest = {
        to: 'invalid-email',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await emailProcessor.processEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(NotificationErrorCode.DELIVERY_FAILED);
      expect(result.error?.message).toContain('Email validation failed');
    });

    it('should handle missing required fields', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: '', // Empty subject
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await emailProcessor.processEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(NotificationErrorCode.DELIVERY_FAILED);
    });

    it('should process email with template rendering', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Original Subject', // Will be overridden by template
        htmlBody: '<p>Placeholder</p>', // Add placeholder content to pass validation
        templateId: 'test-template',
        variables: { name: 'John Doe' },
      };

      const result = await emailProcessor.processEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(mockSMTPProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Test Subject', // From template
          htmlBody: '<p>Test HTML Body</p>',
          textBody: 'Test Text Body',
        })
      );
    });

    it('should handle provider errors gracefully', async () => {
      mockSMTPProvider.sendEmail.mockRejectedValue(
        new Error('SMTP connection failed')
      );

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const result = await emailProcessor.processEmail(emailRequest);

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(NotificationErrorCode.DELIVERY_FAILED);
      expect(result.error?.message).toContain('SMTP connection failed');
    });
  });

  describe('processBulkEmails', () => {
    it('should successfully process multiple email requests', async () => {
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

      const results = await emailProcessor.processBulkEmails(emailRequests);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe(NotificationStatus.SENT);
      expect(results[1].status).toBe(NotificationStatus.SENT);
      expect(mockSMTPProvider.sendBulkEmails).toHaveBeenCalledWith(
        emailRequests
      );
    });

    it('should handle mixed success and failure in bulk processing', async () => {
      mockSMTPProvider.sendBulkEmails.mockResolvedValue([
        {
          messageId: 'success-id',
          status: NotificationStatus.SENT,
          provider: 'smtp-primary',
          timestamp: new Date(),
        },
        {
          messageId: '',
          status: NotificationStatus.FAILED,
          provider: 'smtp-primary',
          timestamp: new Date(),
          error: {
            code: NotificationErrorCode.INVALID_RECIPIENT,
            message: 'Invalid email address',
            details: {},
            retryable: false,
            retryAfter: 0,
            timestamp: new Date(),
          },
        },
      ]);

      const emailRequests: EmailRequest[] = [
        {
          to: 'valid@example.com',
          subject: 'Test Subject 1',
          htmlBody: '<p>Test HTML Body 1</p>',
        },
        {
          to: 'invalid-email',
          subject: 'Test Subject 2',
          htmlBody: '<p>Test HTML Body 2</p>',
        },
      ];

      const results = await emailProcessor.processBulkEmails(emailRequests);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe(NotificationStatus.SENT);
      expect(results[1].status).toBe(NotificationStatus.FAILED);
    });
  });

  describe('renderAndSendEmail', () => {
    it('should render template and send email successfully', async () => {
      const result = await emailProcessor.renderAndSendEmail(
        'test-template',
        { name: 'John Doe' },
        'test@example.com',
        {
          cc: ['cc@example.com'],
          priority: 'high',
          metadata: { campaign: 'welcome' },
        }
      );

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(mockSMTPProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject',
          htmlBody: '<p>Test HTML Body</p>',
          textBody: 'Test Text Body',
          cc: ['cc@example.com'],
          priority: 'high',
          metadata: { campaign: 'welcome' },
          trackingEnabled: true,
        })
      );
    });

    it('should handle template rendering errors', async () => {
      const mockTemplateEngine = (emailProcessor as any).templateEngine;
      mockTemplateEngine.renderEmailTemplate.mockRejectedValue(
        new Error('Template not found')
      );

      const result = await emailProcessor.renderAndSendEmail(
        'non-existent-template',
        { name: 'John Doe' },
        'test@example.com'
      );

      expect(result.status).toBe(NotificationStatus.FAILED);
      expect(result.error?.code).toBe(
        NotificationErrorCode.TEMPLATE_RENDER_ERROR
      );
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
        const isValid = await emailProcessor.validateEmailAddress(email);
        expect(isValid).toBe(true);
      }
    });

    it('should reject invalid email addresses', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        '',
      ];

      for (const email of invalidEmails) {
        const isValid = await emailProcessor.validateEmailAddress(email);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('validateEmailContent', () => {
    it('should validate correct email content', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
        textBody: 'Test Text Body',
      };

      const validation =
        await emailProcessor.validateEmailContent(emailRequest);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', async () => {
      const emailRequest: EmailRequest = {
        to: '',
        subject: '',
        // Missing body content
      };

      const validation =
        await emailProcessor.validateEmailContent(emailRequest);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'Recipient email address is required'
      );
      expect(validation.errors).toContain('Email subject is required');
      expect(validation.errors).toContain(
        'Either HTML body or text body is required'
      );
    });

    it('should validate CC and BCC email addresses', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        cc: ['invalid-cc-email'],
        bcc: ['invalid-bcc-email'],
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const validation =
        await emailProcessor.validateEmailContent(emailRequest);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'Invalid CC email address: invalid-cc-email'
      );
      expect(validation.errors).toContain(
        'Invalid BCC email address: invalid-bcc-email'
      );
    });
  });

  describe('selectProvider', () => {
    it('should select the default provider when healthy', async () => {
      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      const provider = await emailProcessor.selectProvider(emailRequest);

      expect(provider).toBe('smtp-primary');
      expect(mockSMTPProvider.healthCheck).toHaveBeenCalled();
    });

    it('should throw error when no healthy providers available', async () => {
      mockSMTPProvider.healthCheck.mockResolvedValue(false);

      const emailRequest: EmailRequest = {
        to: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test HTML Body</p>',
      };

      await expect(emailProcessor.selectProvider(emailRequest)).rejects.toThrow(
        'No healthy email providers available'
      );
    });
  });

  describe('getProviderHealth', () => {
    it('should return provider health status', async () => {
      const isHealthy = await emailProcessor.getProviderHealth('smtp-primary');

      expect(isHealthy).toBe(true);
      expect(mockSMTPProvider.healthCheck).toHaveBeenCalled();
    });

    it('should return false for non-existent provider', async () => {
      const isHealthy = await emailProcessor.getProviderHealth('non-existent');

      expect(isHealthy).toBe(false);
    });
  });

  describe('provider management', () => {
    it('should add new provider successfully', async () => {
      const config = {
        name: 'smtp-secondary',
        type: 'smtp' as const,
        enabled: true,
        priority: 2,
        smtp: {
          host: 'smtp2.test.com',
          port: 587,
          secure: false,
          auth: {
            user: 'test2@test.com',
            pass: 'testpass2',
          },
        },
      };

      await emailProcessor.addProvider('smtp-secondary', config);

      const providers = emailProcessor.getProviders();
      expect(providers).toContain('smtp-secondary');
    });

    it('should remove provider successfully', async () => {
      emailProcessor.removeProvider('smtp-primary');

      const providers = emailProcessor.getProviders();
      expect(providers).not.toContain('smtp-primary');
    });

    it('should handle provider configuration errors', async () => {
      const invalidConfig = {
        name: 'invalid-smtp',
        type: 'smtp' as const,
        enabled: true,
        priority: 1,
        // Missing SMTP configuration
      };

      mockSMTPProvider.configure.mockRejectedValue(
        new Error('Invalid configuration')
      );

      await expect(
        emailProcessor.addProvider('invalid-smtp', invalidConfig)
      ).rejects.toThrow('Invalid configuration');
    });
  });
});
