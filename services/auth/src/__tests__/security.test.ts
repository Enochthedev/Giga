import { describe, expect, it } from 'vitest';
import {
  InputSanitizer,
  JWTSecurity,
  PasswordValidator,
} from '../utils/security.utils';

describe('Security Utils', () => {
  describe('PasswordValidator', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'MyStr0ng!P@ssw0rd';
      const result = PasswordValidator.validate(strongPassword);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPassword = 'password';
      const result = PasswordValidator.validate(weakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject common passwords', () => {
      const commonPassword = 'password123';
      const result = PasswordValidator.validate(commonPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('common'))).toBe(true);
    });

    it('should reject passwords with sequential characters', () => {
      const sequentialPassword = 'Abc123!@#';
      const result = PasswordValidator.validate(sequentialPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('sequential'))).toBe(
        true
      );
    });

    it('should reject passwords with repeated characters', () => {
      const repeatedPassword = 'Aaa123!@#';
      const result = PasswordValidator.validate(repeatedPassword);

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          error => error.includes('consecutive') || error.includes('identical')
        )
      ).toBe(true);
    });

    it('should calculate password strength score', () => {
      const strongPassword = 'MyStr0ng!P@ssw0rd';
      const weakPassword = 'password';

      const strongScore = PasswordValidator.getStrengthScore(strongPassword);
      const weakScore = PasswordValidator.getStrengthScore(weakPassword);

      expect(strongScore).toBeGreaterThan(weakScore);
      expect(strongScore).toBeGreaterThan(70);
      expect(weakScore).toBeLessThan(50);
    });
  });

  describe('InputSanitizer', () => {
    it('should sanitize string input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = InputSanitizer.sanitizeString(maliciousInput);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('Hello World');
    });

    it('should sanitize email input', () => {
      const maliciousEmail = 'test@example.com<script>alert("xss")</script>';
      const sanitized = InputSanitizer.sanitizeEmail(maliciousEmail);

      expect(sanitized).toContain('test@example.com');
      expect(sanitized).not.toContain('<script>');
    });

    it('should sanitize phone input', () => {
      const maliciousPhone = '+1-234-567-8900<script>alert("xss")</script>';
      const sanitized = InputSanitizer.sanitizePhone(maliciousPhone);

      expect(sanitized).toBe('+1-234-567-8900');
      expect(sanitized).not.toContain('<script>');
    });

    it('should sanitize name input', () => {
      const maliciousName = 'John<script>alert("xss")</script> Doe';
      const sanitized = InputSanitizer.sanitizeName(maliciousName);

      expect(sanitized).toContain('John');
      expect(sanitized).toContain('Doe');
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('JWTSecurity', () => {
    it('should generate secure JWT secret', () => {
      const secret = JWTSecurity.generateSecureSecret();

      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThanOrEqual(128); // 64 bytes = 128 hex chars
      expect(/^[a-f0-9]+$/.test(secret)).toBe(true);
    });

    it('should validate JWT secret strength', () => {
      const strongSecret = JWTSecurity.generateSecureSecret();
      const weakSecret = 'weak';
      const defaultSecret = 'your-super-secret-jwt-key-change-in-production';

      const strongValidation = JWTSecurity.validateSecretStrength(strongSecret);
      const weakValidation = JWTSecurity.validateSecretStrength(weakSecret);
      const defaultValidation =
        JWTSecurity.validateSecretStrength(defaultSecret);

      expect(strongValidation.isValid).toBe(true);
      expect(weakValidation.isValid).toBe(false);
      expect(defaultValidation.isValid).toBe(false);
    });

    it('should create secure JWT payload', () => {
      const user = {
        id: 'user123',
        email: 'test@example.com',
        roles: [{ role: { name: 'CUSTOMER' } }],
        activeRole: 'CUSTOMER',
      };

      const payload = JWTSecurity.createSecurePayload(user);

      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.roles).toEqual(['CUSTOMER']);
      expect(payload.activeRole).toBe('CUSTOMER');
      expect(payload.iat).toBeDefined();
      expect(payload.jti).toBeDefined();
    });

    it('should validate token claims', () => {
      const validPayload = {
        sub: 'user123',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
        jti: 'jwt-id-123',
      };

      const invalidPayload = {
        sub: 'user123',
        // Missing required claims
      };

      const validValidation = JWTSecurity.validateTokenClaims(validPayload);
      const invalidValidation = JWTSecurity.validateTokenClaims(invalidPayload);

      expect(validValidation.isValid).toBe(true);
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Security Integration', () => {
  it('should handle complete security validation flow', () => {
    // Test a complete flow with password validation and input sanitization
    const userInput = {
      email: '  TEST@EXAMPLE.COM<script>  ',
      password: 'MyStr0ng!P@ssw0rd',
      firstName: 'John<script>alert("xss")</script>',
      lastName: 'Doe',
    };

    // Sanitize inputs
    const sanitizedEmail = InputSanitizer.sanitizeEmail(userInput.email);
    const sanitizedFirstName = InputSanitizer.sanitizeName(userInput.firstName);
    const sanitizedLastName = InputSanitizer.sanitizeName(userInput.lastName);

    // Validate password
    const passwordValidation = PasswordValidator.validate(userInput.password);

    // Assertions
    expect(sanitizedEmail).toContain('test@example.com');
    expect(sanitizedFirstName).toContain('John');
    expect(sanitizedLastName).toBe('Doe');
    expect(passwordValidation.isValid).toBe(true);
  });
});
