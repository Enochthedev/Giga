import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SMSService } from '../services/sms.service';

describe('Phone Verification - SMS Service Only', () => {
  let smsService: SMSService;

  beforeEach(() => {
    smsService = SMSService.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SMS Service', () => {
    describe('generateVerificationCode', () => {
      it('should generate a 6-digit code', () => {
        const code = smsService.generateVerificationCode();
        expect(code).toMatch(/^\d{6}$/);
        expect(code.length).toBe(6);
      });

      it('should generate unique codes', () => {
        const codes = new Set();
        for (let i = 0; i < 100; i++) {
          codes.add(smsService.generateVerificationCode());
        }
        expect(codes.size).toBeGreaterThan(90); // Should be mostly unique
      });
    });

    describe('validatePhoneNumber', () => {
      it('should validate correct phone numbers', () => {
        const validNumbers = [
          '+1234567890',
          '+12345678901',
          '+441234567890',
          '+33123456789',
          '+4912345678901',
        ];

        validNumbers.forEach(phone => {
          const result = smsService.validatePhoneNumber(phone);
          expect(result.isValid).toBe(true);
        });
      });

      it('should reject invalid phone numbers', () => {
        const invalidNumbers = [
          '123', // Too short
          '+123456789012345678', // Too long
          'abc123456789', // Contains letters
        ];

        invalidNumbers.forEach(phone => {
          const result = smsService.validatePhoneNumber(phone);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        });
      });
    });

    describe('formatPhoneNumber', () => {
      it('should format phone numbers correctly', () => {
        expect(smsService.formatPhoneNumber('1234567890')).toBe('+11234567890');
        expect(smsService.formatPhoneNumber('+1234567890')).toBe('+1234567890');
        expect(smsService.formatPhoneNumber('(123) 456-7890')).toBe('+11234567890');
      });
    });

    describe('createVerificationSMSTemplate', () => {
      it('should create proper SMS template', () => {
        const template = smsService.createVerificationSMSTemplate({
          phone: '+1234567890',
          firstName: 'John',
          verificationCode: '123456',
        });

        expect(template.message).toContain('John');
        expect(template.message).toContain('123456');
        expect(template.message).toContain('10 minutes');
      });
    });

    describe('sendVerificationSMS', () => {
      it('should mock SMS sending successfully', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await smsService.sendVerificationSMS({
          phone: '+1234567890',
          firstName: 'John',
          verificationCode: '123456',
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          '📱 SMS Verification Sent:',
          expect.objectContaining({
            to: '+1234567890',
            code: '123456',
          })
        );

        consoleSpy.mockRestore();
      });
    });

    describe('sendSecurityAlert', () => {
      it('should mock security alert SMS successfully', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await smsService.sendSecurityAlert('+1234567890', 'Test security alert');

        expect(consoleSpy).toHaveBeenCalledWith(
          '🔒 Security Alert SMS Sent:',
          expect.objectContaining({
            to: '+1234567890',
            message: 'Test security alert',
          })
        );

        consoleSpy.mockRestore();
      });
    });
  });
});