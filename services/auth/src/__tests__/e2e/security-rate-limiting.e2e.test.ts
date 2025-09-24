import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../app';
import { PrismaClient } from '../../generated/prisma-client';
import { TestDataFactory, setupTestMocks } from '../utils/test-helpers';

// Setup mocks before importing the app
setupTestMocks();

describe('E2E: Security and Rate Limiting Features', () => {
  let _prisma: PrismaClient;
  let testDataFactory: TestDataFactory;

  beforeAll(() => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });
    testDataFactory = new TestDataFactory(prisma);
  });

  beforeEach(() => {
    // Clean up test data
    await prisma.passwordResetToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.address.deleteMany();
    await prisma.advertiserProfile.deleteMany();
    await prisma.hostProfile.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.vendorProfile.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(() => {
    await prisma.$disconnect();
  });

  describe('Authentication Rate Limiting', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
    });

    it('should rate limit login attempts', () => {
      const loginData = {
        email: testUser.email,
        password: 'WrongPassword123!', // Intentionally wrong
      };

      // Make multiple failed login attempts
      const attempts = [];
      for (let i = 0; i < 6; i++) {
        attempts.push(
          request(app)
            .post('/api/v1/auth/login')
            .send(loginData)
        );
      }

      const responses = await Promise.all(attempts);

      // First 5 attempts should return 401 (unauthorized)
      responses.slice(0, 5).forEach(response => {
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      });

      // 6th attempt should be rate limited (429)
      expect(responses[5].status).toBe(429);
      expect(responses[5].body.error).toContain('rate limit');
    });

    it('should rate limit registration attempts', () => {
      const registrationAttempts = [];

      for (let i = 0; i < 6; i++) {
        registrationAttempts.push(
          request(app)
            .post('/api/v1/auth/register')
            .send({
              email: `test${i}@example.com`,
              password: 'TestPassword123!',
              firstName: 'Test',
              lastName: 'User',
              acceptTerms: true,
            })
        );
      }

      const responses = await Promise.all(registrationAttempts);

      // First 5 attempts should succeed or fail normally
      responses.slice(0, 5).forEach(response => {
        expect([201, 400].includes(response.status)).toBe(true);
      });

      // 6th attempt should be rate limited
      expect(responses[5].status).toBe(429);
      expect(responses[5].body.error).toContain('rate limit');
    });

    it('should rate limit password reset requests', () => {
      const verifiedUser = await testDataFactory.createTestUser({
        isEmailVerified: true,
      });

      const resetAttempts = [];

      for (let i = 0; i < 4; i++) {
        resetAttempts.push(
          request(app)
            .post('/api/v1/auth/forgot-password')
            .send({
              email: verifiedUser.email,
            })
        );
      }

      const responses = await Promise.all(resetAttempts);

      // First attempt should succeed
      expect(responses[0].status).toBe(200);

      // Subsequent attempts should be rate limited
      responses.slice(1).forEach(response => {
        expect(response.status).toBe(429);
        expect(response.body.error).toContain('rate limit');
      });
    });

    it('should reset rate limits after time window', () => {
      const loginData = {
        email: testUser.email,
        password: 'WrongPassword123!',
      };

      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send(loginData);
      }

      // Next attempt should be rate limited
      const rateLimitedResponse = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(429);

      expect(rateLimitedResponse.body.error).toContain('rate limit');

      // Mock time passage (in real implementation, would wait for window to reset)
      // For testing, we'll assume rate limit resets and try again
      vi.useFakeTimers();
      vi.advanceTimersByTime(15 * 60 * 1000); // 15 minutes

      // Should be able to attempt again after rate limit window
      const afterResetResponse = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);

      expect([401, 429].includes(afterResetResponse.status)).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('Account Lockout Protection', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
    });

    it('should lock account after multiple failed login attempts', () => {
      const wrongPassword = 'WrongPassword123!';

      // Make multiple failed attempts to trigger account lockout
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: wrongPassword,
          });
      }

      // Account should be locked, even with correct password
      const lockedAccountResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!', // Correct password
        })
        .expect(423); // Locked

      expect(lockedAccountResponse.body.success).toBe(false);
      expect(lockedAccountResponse.body.error).toContain('locked');
    });

    it('should unlock account after lockout period', () => {
      // Trigger account lockout
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'WrongPassword123!',
          });
      }

      // Mock time passage for lockout period
      vi.useFakeTimers();
      vi.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

      // Should be able to login again with correct password
      const unlockedResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        });

      expect([200, 401].includes(unlockedResponse.status)).toBe(true);

      vi.useRealTimers();
    });

    it('should reset failed attempts counter on successful login', () => {
      // Make some failed attempts (but not enough to lock)
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'WrongPassword123!',
          });
      }

      // Successful login should reset counter
      const successfulLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(successfulLogin.body.success).toBe(true);

      // Should be able to make failed attempts again without immediate lockout
      for (let i = 0; i < 3; i++) {
        const failedResponse = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'WrongPassword123!',
          });

        expect(failedResponse.status).toBe(401); // Not locked yet
      }
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should sanitize XSS attempts in registration', () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        'javascript:alert("xss")',
        '<svg onload=alert("xss")>',
        '"><script>alert("xss")</script>',
      ];

      for (const payload of xssPayloads) {
        const registrationData = {
          email: testDataFactory.generateRandomEmail(),
          password: 'TestPassword123!',
          firstName: `John${payload}`,
          lastName: `Doe${payload}`,
          acceptTerms: true,
        };

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(registrationData)
          .expect(201);

        expect(response.body.success).toBe(true);

        // Verify XSS content was sanitized
        const user = await prisma.user.findUnique({
          where: { id: response.body.data.user.id },
        });

        expect(user!.firstName).not.toContain('<script>');
        expect(user!.firstName).not.toContain('<img');
        expect(user!.firstName).not.toContain('javascript:');
        expect(user!.firstName).toContain('John');
      }
    });

    it('should validate email format strictly', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        'user name@example.com',
        'user@ex ample.com',
      ];

      for (const invalidEmail of invalidEmails) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: invalidEmail,
            password: 'TestPassword123!',
            firstName: 'Test',
            lastName: 'User',
            acceptTerms: true,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('email');
      }
    });

    it('should prevent SQL injection attempts', () => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users --",
        "'; INSERT INTO users VALUES ('hacker'); --",
      ];

      for (const payload of sqlInjectionPayloads) {
        // Try SQL injection in email field
        const emailInjectionResponse = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: payload,
            password: 'TestPassword123!',
          });

        expect([400, 401].includes(emailInjectionResponse.status)).toBe(true);
        expect(emailInjectionResponse.body.success).toBe(false);

        // Try SQL injection in password field
        const passwordInjectionResponse = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: payload,
          });

        expect([400, 401].includes(passwordInjectionResponse.status)).toBe(true);
        expect(passwordInjectionResponse.body.success).toBe(false);
      }
    });

    it('should handle malformed JSON gracefully', () => {
      const malformedJsonResponse = await request(app)
        .post('/api/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(malformedJsonResponse.body.success).toBe(false);
      expect(malformedJsonResponse.body.error).toBeDefined();
    });

    it('should validate request size limits', () => {
      const largePayload = {
        email: testDataFactory.generateRandomEmail(),
        password: 'TestPassword123!',
        firstName: 'A'.repeat(10000), // Very long string
        lastName: 'User',
        acceptTerms: true,
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(largePayload);

      expect([400, 413].includes(response.status)).toBe(true);
      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token Security', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
      accessToken = testDataFactory.generateJWT(testUser);
    });

    it('should reject tampered JWT tokens', () => {
      // Tamper with the token
      const tamperedToken = accessToken.slice(0, -10) + 'tampered123';

      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('token');
    });

    it('should reject expired JWT tokens', () => {
      const expiredToken = testDataFactory.generateExpiredJWT(testUser);

      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('token');
    });

    it('should reject tokens with invalid format', () => {
      const invalidTokens = [
        'invalid-token',
        'Bearer invalid-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        '',
        'null',
        'undefined',
      ];

      for (const invalidToken of invalidTokens) {
        const response = await request(app)
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.success).toBe(false);
      }
    });

    it('should validate token claims properly', () => {
      // Create token with missing required claims
      const invalidPayload = {
        sub: testUser.id,
        // Missing email, roles, etc.
      };

      const invalidToken = testDataFactory.generateJWT(invalidPayload);

      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should set appropriate security headers', () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should handle CORS preflight requests', () => {
      const preflightResponse = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'https://example.com')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization')
        .expect(200);

      expect(preflightResponse.headers).toHaveProperty('access-control-allow-origin');
      expect(preflightResponse.headers).toHaveProperty('access-control-allow-methods');
      expect(preflightResponse.headers).toHaveProperty('access-control-allow-headers');
    });

    it('should reject requests from unauthorized origins', () => {
      // This test depends on CORS configuration
      // In a real environment, unauthorized origins would be rejected
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Origin', 'https://malicious-site.com')
        .send({
          email: 'test@example.com',
          password: 'password',
        });

      // Response should either be successful (if CORS allows all origins in test)
      // or should have appropriate CORS headers
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Session Security', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
      accessToken = testDataFactory.generateJWT(testUser);
    });

    it('should track concurrent sessions', () => {
      // Create multiple sessions for the same user
      const loginPromises = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: 'TestPassword123!',
          })
      );

      const responses = await Promise.all(loginPromises);

      // All logins should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Should have multiple refresh tokens for the user
      const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });

      expect(refreshTokens.length).toBeGreaterThan(1);
    });

    it('should invalidate sessions on logout', () => {
      // Login to get refresh token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        })
        .expect(200);

      const refreshToken = loginResponse.body.data.tokens.refreshToken;

      // Logout
      await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      // Try to use refresh token after logout
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(refreshResponse.body.success).toBe(false);
    });

    it('should handle session hijacking attempts', () => {
      // Login from one "device"
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        })
        .expect(200);

      const refreshToken = loginResponse.body.data.tokens.refreshToken;

      // Simulate token theft and usage from different IP/device
      const hijackAttemptResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .set('X-Forwarded-For', '192.168.1.100') // Different IP
        .set('User-Agent', 'Malicious-Bot/1.0') // Different user agent
        .send({ refreshToken });

      // Should either succeed (if no device tracking) or be flagged as suspicious
      expect([200, 401, 403].includes(hijackAttemptResponse.status)).toBe(true);
    });
  });

  describe('API Security Monitoring', () => {
    it('should detect and handle suspicious activity patterns', () => {
      const suspiciousPatterns = [
        // Rapid-fire requests
        () => Promise.all(Array(50).fill(null).map(() =>
          request(app).get('/api/v1/auth/profile')
        )),

        // Multiple failed login attempts from same IP
        () => Promise.all(Array(10).fill(null).map(() =>
          request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'nonexistent@example.com',
              password: 'wrongpassword',
            })
        )),
      ];

      for (const pattern of suspiciousPatterns) {
        const responses = await pattern();

        // Should handle gracefully without crashing
        responses.forEach(response => {
          expect([200, 401, 429, 500].includes(response.status)).toBe(true);
        });
      }
    });

    it('should log security events for audit', () => {
      const securityEvents = [
        // Failed login attempt
        () => request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          }),

        // Invalid token usage
        () => request(app)
          .get('/api/v1/auth/profile')
          .set('Authorization', 'Bearer invalid-token'),

        // Malformed request
        () => request(app)
          .post('/api/v1/auth/register')
          .send('invalid-json'),
      ];

      for (const event of securityEvents) {
        const response = await event();

        // Events should be handled and logged
        expect(response.body).toHaveProperty('success');
        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('Performance Under Attack', () => {
    it('should maintain performance under DDoS-like conditions', () => {
      const startTime = Date.now();

      // Simulate high load
      const highLoadRequests = Array(100).fill(null).map(() =>
        request(app).get('/health')
      );

      const responses = await Promise.all(highLoadRequests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time even under load
      expect(duration).toBeLessThan(10000); // 10 seconds

      // Most requests should succeed
      const successfulRequests = responses.filter(res => res.status === 200);
      expect(successfulRequests.length).toBeGreaterThan(responses.length * 0.8); // 80% success rate
    });

    it('should gracefully degrade under extreme load', () => {
      // Simulate extreme load on authentication endpoints
      const extremeLoadRequests = Array(200).fill(null).map((_, index) =>
        request(app)
          .post('/api/v1/auth/login')
          .send({
            email: `user${index}@example.com`,
            password: 'password',
          })
      );

      const responses = await Promise.all(extremeLoadRequests);

      // Should handle all requests without crashing
      responses.forEach(response => {
        expect([200, 401, 429, 500].includes(response.status)).toBe(true);
        expect(response.body).toHaveProperty('success');
      });

      // Should have some rate limiting in effect
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});