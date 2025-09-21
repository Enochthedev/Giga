import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailService } from '../services/email.service';

// Mock crypto module
vi.mock('crypto', () => ({
  default: {
    randomBytes: vi.fn(() => ({
      toString: vi.fn(
        () => 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
      ),
    })),
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = EmailService.getInstance();
  });

  describe('generateVerificationToken', () => {
    it('should generate a valid hex token', () => {
      const token = emailService.generateVerificationToken();

      expect(token).toBe(
        'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
      );
      expect(token.length).toBe(64);
    });
  });

  describe('createVerificationUrl', () => {
    it('should create a valid verification URL', () => {
      const token = 'test-token-123';
      const url = emailService.createVerificationUrl(token);

      expect(url).toBe(
        'http://localhost:3000/verify-email?token=test-token-123'
      );
    });
  });

  describe('createVerificationEmailTemplate', () => {
    it('should create email template with all required fields', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'John',
        verificationToken: 'test-token',
        verificationUrl: 'http://localhost:3000/verify-email?token=test-token',
      };

      const template = emailService.createVerificationEmailTemplate(data);

      expect(template.subject).toBe('Verify Your Email Address');
      expect(template.html).toContain('John');
      expect(template.html).toContain(data.verificationUrl);
      expect(template.text).toContain('John');
      expect(template.text).toContain(data.verificationUrl);
    });

    it('should include security warnings in template', () => {
      const data = {
        email: 'test@example.com',
        firstName: 'Jane',
        verificationToken: 'test-token',
        verificationUrl: 'http://localhost:3000/verify-email?token=test-token',
      };

      const template = emailService.createVerificationEmailTemplate(data);

      expect(template.html).toContain('Security Notice');
      expect(template.html).toContain('24 hours');
      expect(template.text).toContain('Security Notice');
      expect(template.text).toContain('24 hours');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should log email sending attempt', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const data = {
        email: 'test@example.com',
        firstName: 'John',
        verificationToken: 'test-token',
        verificationUrl: 'http://localhost:3000/verify-email?token=test-token',
      };

      await emailService.sendVerificationEmail(data);

      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 Email Verification Sent:',
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Verify Your Email Address',
          verificationUrl:
            'http://localhost:3000/verify-email?token=test-token',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should log welcome email sending attempt', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await emailService.sendWelcomeEmail('test@example.com', 'John');

      expect(consoleSpy).toHaveBeenCalledWith(
        '📧 Welcome Email Sent:',
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Welcome to Our Platform!',
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
