/**
 * Unit tests for Phone Validator utilities
 */

import { describe, expect, it } from 'vitest';
import {
  extractPhoneNumbers,
  formatPhoneForDisplay,
  getPhoneNumberCountry,
  isMobileNumber,
  isSuppressionListFormat,
  sanitizePhoneNumber,
  validatePhoneNumber,
  validatePhoneNumbers,
} from '../utils/phone-validator';

describe('Phone Validator', () => {
  describe('validatePhoneNumber', () => {
    it('should validate correct US phone numbers', () => {
      const validNumbers = ['+12345678901', '+19876543210', '+15551234567'];

      validNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe(number);
        expect(result.country).toBe('US');
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should validate correct international phone numbers', () => {
      const validNumbers = [
        { number: '+447123456789', country: 'GB' },
        { number: '+33123456789', country: 'FR' },
        { number: '+4915123456789', country: 'DE' },
        { number: '+919876543210', country: 'IN' },
      ];

      validNumbers.forEach(({ number, country }) => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe(number);
        expect(result.country).toBe(country);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '',
        'invalid',
        '123',
        '+1',
        '+0123456789', // Cannot start with 0
        '+1111111111111111111', // Too long
        'abc123',
        '123-456-7890', // Not E.164 format
      ];

      invalidNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should handle phone numbers without + prefix', () => {
      const result = validatePhoneNumber('12345678901');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+12345678901');
    });

    it('should detect phone number type for known patterns', () => {
      // UK mobile number
      const ukMobile = validatePhoneNumber('+447123456789');
      expect(ukMobile.type).toBe('mobile');

      // UK landline
      const ukLandline = validatePhoneNumber('+441234567890');
      expect(ukLandline.type).toBe('landline');

      // German mobile
      const deMobile = validatePhoneNumber('+4915123456789');
      expect(deMobile.type).toBe('mobile');

      // Indian mobile
      const inMobile = validatePhoneNumber('+919876543210');
      expect(inMobile.type).toBe('mobile');
    });

    it('should reject numbers with invalid patterns', () => {
      const invalidPatterns = [
        '+0123456789', // Starts with +0
        '+1111111111', // Too many repeated digits
        '+1234567890', // Sequential numbers
      ];

      invalidPatterns.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(false);
        expect(
          result.errors.some(error => error.includes('invalid patterns'))
        ).toBe(true);
      });
    });
  });

  describe('validatePhoneNumbers', () => {
    it('should validate multiple phone numbers', () => {
      const numbers = [
        '+12345678901',
        'invalid',
        '+447123456789',
        '+33123456789',
      ];

      const results = validatePhoneNumbers(numbers);

      expect(results).toHaveLength(4);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
      expect(results[3].isValid).toBe(true);
    });
  });

  describe('isMobileNumber', () => {
    it('should identify mobile numbers correctly', () => {
      const mobileNumbers = [
        '+447123456789', // UK mobile
        '+4915123456789', // German mobile
        '+919876543210', // Indian mobile
      ];

      mobileNumbers.forEach(number => {
        expect(isMobileNumber(number)).toBe(true);
      });
    });

    it('should identify non-mobile numbers correctly', () => {
      const nonMobileNumbers = [
        '+441234567890', // UK landline
        'invalid',
        '+12345678901', // US (unknown type)
      ];

      nonMobileNumbers.forEach(number => {
        expect(isMobileNumber(number)).toBe(false);
      });
    });
  });

  describe('getPhoneNumberCountry', () => {
    it('should detect country correctly', () => {
      const testCases = [
        { number: '+12345678901', expectedCountry: 'US' },
        { number: '+447123456789', expectedCountry: 'GB' },
        { number: '+33123456789', expectedCountry: 'FR' },
        { number: '+4915123456789', expectedCountry: 'DE' },
      ];

      testCases.forEach(({ number, expectedCountry }) => {
        const country = getPhoneNumberCountry(number);
        expect(country?.code).toBe(expectedCountry);
      });
    });

    it('should return null for invalid numbers', () => {
      const country = getPhoneNumberCountry('invalid');
      expect(country).toBeNull();
    });
  });

  describe('formatPhoneForDisplay', () => {
    it('should format US numbers correctly', () => {
      const formatted = formatPhoneForDisplay('+12345678901');
      expect(formatted).toBe('+1 (234) 567-8901');
    });

    it('should format UK numbers correctly', () => {
      const formatted = formatPhoneForDisplay('+441234567890');
      expect(formatted).toBe('+44 1234 567890');
    });

    it('should handle invalid numbers gracefully', () => {
      const formatted = formatPhoneForDisplay('invalid');
      expect(formatted).toBe('invalid');
    });

    it('should use default formatting for unknown countries', () => {
      const formatted = formatPhoneForDisplay('+999123456789');
      expect(formatted).toMatch(/^\+999 123 456789$/);
    });
  });

  describe('sanitizePhoneNumber', () => {
    it('should remove invalid characters', () => {
      const testCases = [
        { input: '+1 (234) 567-8901', expected: '+1 (234) 567-8901' },
        { input: '+1.234.567.8901', expected: '+1.234.567.8901' },
        { input: '+1abc234def567ghi8901', expected: '+1234567-8901' },
        { input: 'call +1-234-567-8901 now!', expected: '+1-234-567-8901' },
      ];

      testCases.forEach(({ input, expected }) => {
        const sanitized = sanitizePhoneNumber(input);
        expect(sanitized).toBe(expected);
      });
    });

    it('should handle empty or invalid input', () => {
      expect(sanitizePhoneNumber('')).toBe('');
      expect(sanitizePhoneNumber(null as any)).toBe('');
      expect(sanitizePhoneNumber(undefined as any)).toBe('');
    });
  });

  describe('extractPhoneNumbers', () => {
    it('should extract phone numbers from text', () => {
      const text =
        'Call me at +1-234-567-8901 or +44 7123 456789 for more info';
      const extracted = extractPhoneNumbers(text);

      expect(extracted).toHaveLength(2);
      expect(extracted).toContain('+12345678901');
      expect(extracted).toContain('+447123456789');
    });

    it('should return empty array when no valid numbers found', () => {
      const text = 'No phone numbers here, just text and 123 random numbers';
      const extracted = extractPhoneNumbers(text);

      expect(extracted).toHaveLength(0);
    });

    it('should handle mixed valid and invalid numbers', () => {
      const text =
        'Valid: +1-234-567-8901, Invalid: 123, Another valid: +44 7123 456789';
      const extracted = extractPhoneNumbers(text);

      expect(extracted).toHaveLength(2);
      expect(extracted).toContain('+12345678901');
      expect(extracted).toContain('+447123456789');
    });
  });

  describe('isSuppressionListFormat', () => {
    it('should validate suppression list format', () => {
      const validNumbers = ['+12345678901', '+447123456789', '+33123456789'];

      validNumbers.forEach(number => {
        expect(isSuppressionListFormat(number)).toBe(true);
      });
    });

    it('should reject invalid suppression list format', () => {
      const invalidNumbers = ['invalid', '123', '', 'abc123'];

      invalidNumbers.forEach(number => {
        expect(isSuppressionListFormat(number)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long numbers', () => {
      const longNumber = '+1' + '2'.repeat(20);
      const result = validatePhoneNumber(longNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('length'))).toBe(true);
    });

    it('should handle very short numbers', () => {
      const shortNumber = '+12';
      const result = validatePhoneNumber(shortNumber);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('length'))).toBe(true);
    });

    it('should handle numbers with special characters', () => {
      const specialNumber = '+1-234-567-8901';
      const result = validatePhoneNumber(specialNumber);
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+12345678901');
    });

    it('should handle whitespace in numbers', () => {
      const spacedNumber = '  +1 234 567 8901  ';
      const result = validatePhoneNumber(spacedNumber);
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('+12345678901');
    });
  });

  describe('Country-Specific Validation', () => {
    it('should validate US numbers with correct area codes', () => {
      const validUSNumbers = [
        '+12125551234', // NYC
        '+13105551234', // LA
        '+17135551234', // Houston
      ];

      validUSNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.country).toBe('US');
      });
    });

    it('should validate UK numbers correctly', () => {
      const validUKNumbers = [
        '+447123456789', // Mobile
        '+442012345678', // London landline
        '+441234567890', // Other landline
      ];

      validUKNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.country).toBe('GB');
      });
    });

    it('should validate German numbers correctly', () => {
      const validGermanNumbers = [
        '+4915123456789', // Mobile
        '+493012345678', // Berlin landline
      ];

      validGermanNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.country).toBe('DE');
      });
    });
  });
});
