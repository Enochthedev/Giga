import { describe, expect, it } from 'vitest';
import {
  InputSanitizer,
  JWTSecurity,
  PasswordValidator,
  RequestValidator,
} from '../utils/security.utils';

describe('Enhanced Security Integration Tests', () => {
  describe('Comprehensive Password Validation', () => {
    it('should reject passwords with keyboard patterns', () => {
      const keyboardPassword = 'Qwerty123!';
      const result = PasswordValidator.validate(keyboardPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('keyboard'))).toBe(
        true
      );
    });

    it('should reject passwords with personal information patterns', () => {
      const personalPassword = 'Password2024!';
      const result = PasswordValidator.validate(personalPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('personal'))).toBe(
        true
      );
    });

    it('should reject passwords with control characters', () => {
      const controlPassword = 'MyPass\x00word123!';
      const result = PasswordValidator.validate(controlPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('control'))).toBe(true);
    });

    it('should accept strong, unique passwords', () => {
      const strongPassword = 'Zx9#mK8$pL2@vN5!';
      const result = PasswordValidator.validate(strongPassword);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should calculate accurate strength scores', () => {
      const strongPassword = 'Zx9#mK8$pL2@vN5!';
      const weakPassword = 'password';
      const mediumPassword = 'MyPassword123!';

      const strongScore = PasswordValidator.getStrengthScore(strongPassword);
      const weakScore = PasswordValidator.getStrengthScore(weakPassword);
      const mediumScore = PasswordValidator.getStrengthScore(mediumPassword);

      expect(strongScore).toBeGreaterThan(80);
      expect(mediumScore).toBeGreaterThan(weakScore);
      expect(mediumScore).toBeLessThan(strongScore);
      expect(weakScore).toBeLessThan(30);
    });
  });

  describe('Enhanced Input Sanitization', () => {
    it('should sanitize complex XSS attempts', () => {
      const maliciousInput =
        '<script>alert("xss")</script><iframe src="javascript:alert(1)"></iframe>Hello';
      const sanitized = InputSanitizer.sanitizeString(maliciousInput);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('<iframe>');
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).toContain('Hello');
    });

    it('should handle nested malicious content', () => {
      const nestedMalicious =
        'Hello<script>document.write("<script>alert(1)</script>")</script>World';
      const sanitized = InputSanitizer.sanitizeString(nestedMalicious);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('document.write');
      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
    });

    it('should preserve legitimate content while sanitizing', () => {
      const legitimateContent =
        "John O'Connor - Senior Developer @ Company Inc.";
      const sanitized = InputSanitizer.sanitizeName(legitimateContent);

      expect(sanitized).toContain('John');
      expect(sanitized).toContain("O'Connor");
      expect(sanitized).toContain('Senior Developer');
    });
  });

  describe('JWT Security Enhancements', () => {
    it('should generate cryptographically secure secrets', () => {
      const secret1 = JWTSecurity.generateSecureSecret();
      const secret2 = JWTSecurity.generateSecureSecret();

      expect(secret1).not.toBe(secret2);
      expect(secret1.length).toBe(128); // 64 bytes in hex
      expect(/^[a-f0-9]+$/.test(secret1)).toBe(true);
    });

    it('should create secure JWT payloads with all required claims', () => {
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
      expect(typeof payload.jti).toBe('string');
    });

    it('should validate token claims comprehensively', () => {
      const validPayload = {
        sub: 'user123',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
        jti: 'jwt-id-123',
      };

      const oldPayload = {
        sub: 'user123',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000) - 25 * 60 * 60, // 25 hours old
        jti: 'jwt-id-123',
      };

      const validValidation = JWTSecurity.validateTokenClaims(validPayload);
      const oldValidation = JWTSecurity.validateTokenClaims(oldPayload);

      expect(validValidation.isValid).toBe(true);
      expect(oldValidation.isValid).toBe(false);
      expect(
        oldValidation.errors.some(error => error.includes('too old'))
      ).toBe(true);
    });
  });

  describe('Request Security Validation', () => {
    it('should validate request size limits', () => {
      const mockReq = {
        headers: {
          'content-length': '2097152', // 2MB
        },
      };

      const validation = RequestValidator.validateRequestSize(mockReq);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('too large');
    });

    it('should validate content types', () => {
      const mockReq = {
        headers: {
          'content-type': 'text/plain',
        },
      };

      const validation = RequestValidator.validateContentType(mockReq);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('Content-Type must be');
    });

    it('should detect suspicious request patterns', () => {
      const mockReq = {
        headers: {
          'user-agent': 'curl/7.68.0',
          'content-type': 'application/json',
        },
        method: 'POST',
        clientIp: '192.168.1.1',
      };

      const validation = RequestValidator.validateRequestSecurity(mockReq);
      expect(validation.isValid).toBe(true); // Should pass but log warning
    });

    it('should reject requests with missing required headers', () => {
      const mockReq = {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      };

      const validation = RequestValidator.validateRequestSecurity(mockReq);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('User-Agent');
    });
  });

  describe('Complete Security Flow', () => {
    it('should handle a complete secure registration flow', () => {
      // Simulate a registration request with potential security issues
      const userInput = {
        email: '  TEST@EXAMPLE.COM<script>alert("xss")</script>  ',
        password: 'Zx9#mK8$pL2@vN5!', // Strong password
        firstName: 'John<script>alert("xss")</script>',
        lastName: "Doe's",
        phone: '+1-234-567-8900<script>',
      };

      // Apply security validations and sanitization
      const sanitizedEmail = InputSanitizer.sanitizeEmail(userInput.email);
      const sanitizedFirstName = InputSanitizer.sanitizeName(
        userInput.firstName
      );
      const sanitizedLastName = InputSanitizer.sanitizeName(userInput.lastName);
      const sanitizedPhone = InputSanitizer.sanitizePhone(userInput.phone);

      // Validate password
      const passwordValidation = PasswordValidator.validate(userInput.password);

      // Create JWT payload
      const mockUser = {
        id: 'user123',
        email: sanitizedEmail,
        roles: [{ role: { name: 'CUSTOMER' } }],
        activeRole: 'CUSTOMER',
      };
      const jwtPayload = JWTSecurity.createSecurePayload(mockUser);

      // Assertions
      expect(sanitizedEmail).toBe('test@example.com');
      expect(sanitizedFirstName).toBe('John');
      expect(sanitizedLastName).toBe("Doe's");
      expect(sanitizedPhone).toBe('+1-234-567-8900');
      expect(passwordValidation.isValid).toBe(true);
      expect(jwtPayload.sub).toBe('user123');
      expect(jwtPayload.email).toBe('test@example.com');
      expect(jwtPayload.jti).toBeDefined();
    });

    it('should reject malicious registration attempts', () => {
      const maliciousInput = {
        email: 'hacker@evil.com',
        password: 'password123', // Weak password
        firstName: '<script>document.location="http://evil.com"</script>',
        lastName: 'DROP TABLE users;--',
        phone: 'javascript:alert(1)',
      };

      // Apply security validations
      const sanitizedFirstName = InputSanitizer.sanitizeName(
        maliciousInput.firstName
      );
      const sanitizedLastName = InputSanitizer.sanitizeName(
        maliciousInput.lastName
      );
      const sanitizedPhone = InputSanitizer.sanitizePhone(maliciousInput.phone);
      const passwordValidation = PasswordValidator.validate(
        maliciousInput.password
      );

      // Assertions - malicious content should be removed/rejected
      expect(sanitizedFirstName).not.toContain('<script>');
      expect(sanitizedFirstName).not.toContain('document.location');
      expect(sanitizedLastName).not.toContain('DROP TABLE');
      expect(sanitizedLastName).not.toContain('--');
      expect(sanitizedPhone).not.toContain('javascript:');
      expect(passwordValidation.isValid).toBe(false);
      expect(
        passwordValidation.errors.some(error => error.includes('common'))
      ).toBe(true);
    });
  });
});
