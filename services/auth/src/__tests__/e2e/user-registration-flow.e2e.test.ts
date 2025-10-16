import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { app } from '../../app';
import { PrismaClient, RoleName } from '../../generated/prisma-client';
import { TestDataFactory, setupTestMocks } from '../utils/test-helpers';

// Setup mocks before importing the app
setupTestMocks();

describe('E2E: Complete User Registration Flow', () => {
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

  describe('Standard User Registration Flow', () => {
    it('should complete full registration workflow: register → verify email → login → profile access', () => {
      const userData = {
        email: testDataFactory.generateRandomEmail(),
        password: 'StrongPassword123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: testDataFactory.generateRandomPhone(),
        acceptTerms: true,
      };

      // Step 1: Register new user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user).toHaveProperty('id');
      expect(registerResponse.body.data.user.email).toBe(userData.email);
      expect(registerResponse.body.data.user.isEmailVerified).toBe(false);
      expect(registerResponse.body.data.tokens).toHaveProperty('accessToken');
      expect(registerResponse.body.data.tokens).toHaveProperty('refreshToken');

      const userId = registerResponse.body.data.user.id;
      const accessToken = registerResponse.body.data.tokens.accessToken;

      // Step 2: Verify user was created with default CUSTOMER role
      const userInDb = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: { role: true },
          },
          customerProfile: true,
        },
      });

      expect(userInDb).toBeTruthy();
      expect(userInDb!.activeRole).toBe(RoleName.CUSTOMER);
      expect(userInDb!.roles).toHaveLength(1);
      expect(userInDb!.roles[0].role.name).toBe(RoleName.CUSTOMER);
      expect(userInDb!.customerProfile).toBeTruthy();

      // Step 3: Access profile with initial token
      const profileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data.id).toBe(userId);
      expect(profileResponse.body.data.email).toBe(userData.email);

      // Step 4: Request email verification
      const verificationResponse = await request(app)
        .post('/api/v1/auth/verify-email/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(verificationResponse.body.success).toBe(true);

      // Step 5: Get verification token from database
      const verificationToken = await prisma.emailVerificationToken.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      expect(verificationToken).toBeTruthy();

      // Step 6: Verify email with token
      const verifyEmailResponse = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .send({ token: verificationToken!.token })
        .expect(200);

      expect(verifyEmailResponse.body.success).toBe(true);

      // Step 7: Verify user is now email verified
      const verifiedUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      expect(verifiedUser!.isEmailVerified).toBe(true);

      // Step 8: Login with verified account
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.user.isEmailVerified).toBe(true);
      expect(loginResponse.body.data.tokens).toHaveProperty('accessToken');

      // Step 9: Access profile with new token
      const newAccessToken = loginResponse.body.data.tokens.accessToken;
      const finalProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      expect(finalProfileResponse.body.success).toBe(true);
      expect(finalProfileResponse.body.data.isEmailVerified).toBe(true);
    });

    it('should handle registration with multiple roles', () => {
      const userData = {
        email: testDataFactory.generateRandomEmail(),
        password: 'StrongPassword123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: testDataFactory.generateRandomPhone(),
        roles: [RoleName.CUSTOMER, RoleName.VENDOR],
        acceptTerms: true,
      };

      // Register user with multiple roles
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      const userId = registerResponse.body.data.user.id;

      // Verify user has both roles and profiles
      const userInDb = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: { role: true },
          },
          customerProfile: true,
          vendorProfile: true,
        },
      });

      expect(userInDb!.roles).toHaveLength(2);
      const roleNames = userInDb!.roles.map(ur => ur.role.name);
      expect(roleNames).toContain(RoleName.CUSTOMER);
      expect(roleNames).toContain(RoleName.VENDOR);
      expect(userInDb!.customerProfile).toBeTruthy();
      expect(userInDb!.vendorProfile).toBeTruthy();
    });

    it('should prevent duplicate email registration', () => {
      const email = testDataFactory.generateRandomEmail();
      const userData = {
        email,
        password: 'StrongPassword123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      // First registration should succeed
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email should fail
      const duplicateResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          firstName: 'Jane', // Different name, same email
        })
        .expect(409);

      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.error).toContain('already exists');
    });

    it('should validate registration input properly', () => {
      // Test invalid email
      const invalidEmailResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'StrongPassword123!',
          firstName: 'John',
          lastName: 'Doe',
          acceptTerms: true,
        })
        .expect(400);

      expect(invalidEmailResponse.body.success).toBe(false);
      expect(invalidEmailResponse.body.error).toContain('email');

      // Test weak password
      const weakPasswordResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testDataFactory.generateRandomEmail(),
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe',
          acceptTerms: true,
        })
        .expect(400);

      expect(weakPasswordResponse.body.success).toBe(false);
      expect(weakPasswordResponse.body.error).toContain('password');

      // Test missing required fields
      const missingFieldsResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testDataFactory.generateRandomEmail(),
          // Missing password, firstName, lastName, acceptTerms
        })
        .expect(400);

      expect(missingFieldsResponse.body.success).toBe(false);

      // Test terms not accepted
      const termsNotAcceptedResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testDataFactory.generateRandomEmail(),
          password: 'StrongPassword123!',
          firstName: 'John',
          lastName: 'Doe',
          acceptTerms: false,
        })
        .expect(400);

      expect(termsNotAcceptedResponse.body.success).toBe(false);
      expect(termsNotAcceptedResponse.body.error).toContain('terms');
    });
  });

  describe('Email Verification Flow', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
      accessToken = testDataFactory.generateJWT(testUser);
    });

    it('should handle email verification request and confirmation', () => {
      // Request email verification
      const requestResponse = await request(app)
        .post('/api/v1/auth/verify-email/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(requestResponse.body.success).toBe(true);

      // Get verification token
      const verificationToken = await prisma.emailVerificationToken.findFirst({
        where: { userId: testUser.id },
        orderBy: { createdAt: 'desc' },
      });

      expect(verificationToken).toBeTruthy();

      // Confirm email verification
      const confirmResponse = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .send({ token: verificationToken!.token })
        .expect(200);

      expect(confirmResponse.body.success).toBe(true);

      // Verify user is marked as email verified
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser!.isEmailVerified).toBe(true);
    });

    it('should reject invalid verification tokens', () => {
      const invalidTokenResponse = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(invalidTokenResponse.body.success).toBe(false);
      expect(invalidTokenResponse.body.error).toContain('Invalid');
    });

    it('should reject expired verification tokens', () => {
      // Create expired token
      const expiredToken = await testDataFactory.createEmailVerificationToken(
        testUser.id,
        new Date(Date.now() - 60 * 60 * 1000) // Expired 1 hour ago
      );

      const expiredTokenResponse = await request(app)
        .post('/api/v1/auth/verify-email/confirm')
        .send({ token: expiredToken.token })
        .expect(400);

      expect(expiredTokenResponse.body.success).toBe(false);
      expect(expiredTokenResponse.body.error).toContain('expired');
    });

    it('should prevent multiple verification requests within rate limit', () => {
      // First request should succeed
      await request(app)
        .post('/api/v1/auth/verify-email/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Second request immediately should be rate limited
      const rateLimitedResponse = await request(app)
        .post('/api/v1/auth/verify-email/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(429);

      expect(rateLimitedResponse.body.success).toBe(false);
      expect(rateLimitedResponse.body.error).toContain('rate limit');
    });
  });

  describe('Phone Verification Flow', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser({
        phone: testDataFactory.generateRandomPhone(),
      });
      accessToken = testDataFactory.generateJWT(testUser);
    });

    it('should handle phone verification request and confirmation', () => {
      // Request phone verification
      const requestResponse = await request(app)
        .post('/api/v1/auth/verify-phone/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(requestResponse.body.success).toBe(true);

      // In a real system, we'd get the code from SMS
      // For testing, we'll use a mock code
      const mockCode = '123456';

      // Confirm phone verification
      const confirmResponse = await request(app)
        .post('/api/v1/auth/verify-phone/confirm')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: mockCode })
        .expect(200);

      expect(confirmResponse.body.success).toBe(true);

      // Verify user is marked as phone verified
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
      });

      expect(updatedUser!.isPhoneVerified).toBe(true);
    });

    it('should reject invalid verification codes', () => {
      // Request verification first
      await request(app)
        .post('/api/v1/auth/verify-phone/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Try invalid code
      const invalidCodeResponse = await request(app)
        .post('/api/v1/auth/verify-phone/confirm')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: 'invalid' })
        .expect(400);

      expect(invalidCodeResponse.body.success).toBe(false);
      expect(invalidCodeResponse.body.error).toContain('Invalid');
    });

    it('should handle phone verification without phone number', () => {
      const userWithoutPhone = await testDataFactory.createTestUser({
        phone: null,
      });
      const tokenWithoutPhone = testDataFactory.generateJWT(userWithoutPhone);

      const requestResponse = await request(app)
        .post('/api/v1/auth/verify-phone/request')
        .set('Authorization', `Bearer ${tokenWithoutPhone}`)
        .expect(400);

      expect(requestResponse.body.success).toBe(false);
      expect(requestResponse.body.error).toContain('phone');
    });
  });

  describe('Registration Error Handling', () => {
    it('should handle database connection errors gracefully', () => {
      // Mock database error
      vi.spyOn(prisma.user, 'create').mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const userData = {
        email: testDataFactory.generateRandomEmail(),
        password: 'StrongPassword123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      const errorResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(500);

      expect(errorResponse.body.success).toBe(false);
      expect(errorResponse.body.error).toBeDefined();
    });

    it('should handle malformed JSON requests', () => {
      const malformedResponse = await request(app)
        .post('/api/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(malformedResponse.body.success).toBe(false);
    });

    it('should handle XSS attempts in registration data', () => {
      const xssData = {
        email: testDataFactory.generateRandomEmail(),
        password: 'StrongPassword123!',
        firstName: '<script>alert("xss")</script>John',
        lastName: '<img src=x onerror=alert("xss")>Doe',
        acceptTerms: true,
      };

      const xssResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(xssData)
        .expect(201);

      expect(xssResponse.body.success).toBe(true);

      // Verify XSS content was sanitized
      const user = await prisma.user.findUnique({
        where: { id: xssResponse.body.data.user.id },
      });

      expect(user!.firstName).not.toContain('<script>');
      expect(user!.lastName).not.toContain('<img');
      expect(user!.firstName).toContain('John');
      expect(user!.lastName).toContain('Doe');
    });
  });

  describe('Registration Performance', () => {
    it('should complete registration within acceptable time limits', () => {
      const startTime = Date.now();

      const userData = {
        email: testDataFactory.generateRandomEmail(),
        password: 'StrongPassword123!',
        firstName: 'Performance',
        lastName: 'Test',
        acceptTerms: true,
      };

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Registration should complete within 3 seconds
      expect(duration).toBeLessThan(3000);
    });

    it('should handle concurrent registration attempts', () => {
      const concurrentRegistrations = Array(5)
        .fill(null)
        .map((_, index) => ({
          email: `concurrent-${index}-${Date.now()}@example.com`,
          password: 'StrongPassword123!',
          firstName: `User${index}`,
          lastName: 'Test',
          acceptTerms: true,
        }));

      const registrationPromises = concurrentRegistrations.map(userData =>
        request(app).post('/api/v1/auth/register').send(userData)
      );

      const responses = await Promise.all(registrationPromises);

      // All registrations should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Verify all users were created
      const userCount = await prisma.user.count();
      expect(userCount).toBe(5);
    });
  });
});
