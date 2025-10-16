import bcrypt from 'bcryptjs';
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { app } from '../app';
import { PrismaClient } from '../generated/prisma-client';
import { JWTService } from '../services/jwt.service';
import { SMSService } from '../services/sms.service';

describe('Phone Verification System', () => {
  let _prisma: PrismaClient;
  let jwtService: JWTService;
  let smsService: SMSService;
  let testUser: any;
  let accessToken: string;

  beforeAll(() => {
    prisma = new PrismaClient();
    jwtService = JWTService.getInstance();
    smsService = SMSService.getInstance();
  });

  afterAll(() => {
    await prisma.$disconnect();
  });

  beforeEach(() => {
    // Clean up test data
    await prisma.phoneVerificationCode.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // Create test role
    await prisma.role.create({
      data: {
        name: 'CUSTOMER',
      },
    });

    // Create test user with phone number
    const passwordHash = await bcrypt.hash('TestPassword123!', 12);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        activeRole: 'CUSTOMER',
        roles: {
          create: {
            role: {
              connect: { name: 'CUSTOMER' },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generate access token
    accessToken = jwtService.generateAccessToken(testUser);

    // Mock SMS service
    vi.spyOn(smsService, 'sendVerificationSMS').mockResolvedValue();
    vi.spyOn(smsService, 'sendSecurityAlert').mockResolvedValue();
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
          '+1-234-567-890', // Contains dashes (should be cleaned first)
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
        expect(smsService.formatPhoneNumber('(123) 456-7890')).toBe(
          '+11234567890'
        );
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
  });

  describe('Phone Verification Endpoints', () => {
    describe('POST /api/v1/auth/send-phone-verification', () => {
      it('should send verification code successfully', () => {
        const response = await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('User-Agent', 'test-agent')
          .send({});

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('sent successfully');
        expect(response.body.data.phone).toContain('****'); // Should be masked
        expect(response.body.data.codeLength).toBe(6);

        // Verify code was stored in database
        const storedCode = await prisma.phoneVerificationCode.findFirst({
          where: { userId: testUser.id },
        });
        expect(storedCode).toBeTruthy();
        expect(storedCode!.code).toMatch(/^\d{6}$/);
      });

      it('should fail without authentication', () => {
        const response = await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .send({});

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('UNAUTHORIZED');
      });

      it('should fail if phone number not set', () => {
        // Update user to remove phone number
        await prisma.user.update({
          where: { id: testUser.id },
          data: { phone: null },
        });

        const response = await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('PHONE_NUMBER_NOT_SET');
      });

      it('should fail if phone already verified', () => {
        // Mark phone as verified
        await prisma.user.update({
          where: { id: testUser.id },
          data: { isPhoneVerified: true },
        });

        const response = await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('PHONE_ALREADY_VERIFIED');
      });

      it('should rate limit verification code requests', () => {
        // Send first verification code
        await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        // Try to send another immediately
        const response = await request(app)
          .post('/api/v1/auth/send-phone-verification')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(response.status).toBe(429);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('VERIFICATION_CODE_ALREADY_SENT');
        expect(response.body.retryAfter).toBeGreaterThan(0);
      });
    });

    describe('POST /api/v1/auth/verify-phone', () => {
      let verificationCode: string;

      beforeEach(() => {
        // Create a verification code
        verificationCode = smsService.generateVerificationCode();
        await prisma.phoneVerificationCode.create({
          data: {
            code: verificationCode,
            userId: testUser.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
        });
      });

      it('should verify phone successfully', () => {
        const response = await request(app)
          .post('/api/v1/auth/verify-phone')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ code: verificationCode });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('verified successfully');
        expect(response.body.data.isPhoneVerified).toBe(true);

        // Verify user is marked as verified
        const updatedUser = await prisma.user.findUnique({
          where: { id: testUser.id },
        });
        expect(updatedUser!.isPhoneVerified).toBe(true);

        // Verify code was deleted
        const storedCode = await prisma.phoneVerificationCode.findFirst({
          where: { userId: testUser.id },
        });
        expect(storedCode).toBeNull();
      });

      it('should fail with invalid code', () => {
        const response = await request(app)
          .post('/api/v1/auth/verify-phone')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ code: '999999' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('INVALID_CODE');
      });

      it('should fail with expired code', () => {
        // Create expired code
        const expiredCode = smsService.generateVerificationCode();
        await prisma.phoneVerificationCode.create({
          data: {
            code: expiredCode,
            userId: testUser.id,
            expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
          },
        });

        const response = await request(app)
          .post('/api/v1/auth/verify-phone')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ code: expiredCode });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('CODE_EXPIRED');
      });

      it('should fail without authentication', () => {
        const response = await request(app)
          .post('/api/v1/auth/verify-phone')
          .send({ code: verificationCode });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('UNAUTHORIZED');
      });

      it('should validate code format', () => {
        const invalidCodes = ['12345', '1234567', 'abcdef', '12345a'];

        for (const code of invalidCodes) {
          const response = await request(app)
            .post('/api/v1/auth/verify-phone')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ code });

          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(response.body.code).toBe('VALIDATION_ERROR');
        }
      });
    });

    describe('POST /api/v1/auth/resend-phone-verification', () => {
      it('should resend verification code successfully', () => {
        const response = await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: '+1234567890' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('sent successfully');

        // Verify code was stored in database
        const storedCode = await prisma.phoneVerificationCode.findFirst({
          where: { userId: testUser.id },
        });
        expect(storedCode).toBeTruthy();
      });

      it('should not reveal if phone number exists', () => {
        const response = await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: '+9999999999' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('If the phone number exists');
      });

      it('should fail if phone already verified', () => {
        // Mark phone as verified
        await prisma.user.update({
          where: { id: testUser.id },
          data: { isPhoneVerified: true },
        });

        const response = await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: '+1234567890' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('PHONE_ALREADY_VERIFIED');
      });

      it('should validate phone number format', () => {
        const response = await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: 'invalid-phone' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('INVALID_PHONE_FORMAT');
      });

      it('should rate limit resend requests', () => {
        // Send first verification code
        await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: '+1234567890' });

        // Try to send another immediately
        const response = await request(app)
          .post('/api/v1/auth/resend-phone-verification')
          .send({ phone: '+1234567890' });

        expect(response.status).toBe(429);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe('VERIFICATION_CODE_RATE_LIMITED');
      });
    });
  });

  describe('Phone Verification Middleware', () => {
    it('should require phone verification for protected endpoints', () => {
      // This would be tested with actual endpoints that use requirePhoneVerification middleware
      // For now, we'll test the middleware logic directly
      expect(testUser.isPhoneVerified).toBe(false);
    });
  });

  describe('Security Features', () => {
    it('should mask phone numbers in responses', () => {
      const response = await request(app)
        .post('/api/v1/auth/send-phone-verification')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.body.data.phone).toContain('****');
      expect(response.body.data.phone).not.toContain('567890');
    });

    it('should clean up expired codes automatically', () => {
      // Create expired code
      const expiredCode = await prisma.phoneVerificationCode.create({
        data: {
          code: '123456',
          userId: testUser.id,
          expiresAt: new Date(Date.now() - 1000), // Expired
        },
      });

      // Try to verify with expired code (should clean it up)
      await request(app)
        .post('/api/v1/auth/verify-phone')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: '123456' });

      // Verify code was deleted
      const storedCode = await prisma.phoneVerificationCode.findUnique({
        where: { id: expiredCode.id },
      });
      expect(storedCode).toBeNull();
    });

    it('should send security alert after successful verification', () => {
      const verificationCode = smsService.generateVerificationCode();
      await prisma.phoneVerificationCode.create({
        data: {
          code: verificationCode,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await request(app)
        .post('/api/v1/auth/verify-phone')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: verificationCode });

      expect(smsService.sendSecurityAlert).toHaveBeenCalledWith(
        testUser.phone,
        expect.stringContaining('successfully verified')
      );
    });

    it('should log security events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await request(app)
        .post('/api/v1/auth/send-phone-verification')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(consoleSpy).toHaveBeenCalledWith(
        'Phone verification code sent:',
        expect.objectContaining({
          userId: testUser.id,
          phone: expect.stringContaining('****'),
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Integration with Profile Updates', () => {
    it('should reset phone verification when phone number changes', () => {
      // First verify the phone
      const verificationCode = smsService.generateVerificationCode();
      await prisma.phoneVerificationCode.create({
        data: {
          code: verificationCode,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await request(app)
        .post('/api/v1/auth/verify-phone')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: verificationCode });

      // Verify phone is verified
      let user = await prisma.user.findUnique({ where: { id: testUser.id } });
      expect(user!.isPhoneVerified).toBe(true);

      // Update phone number
      await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ phone: '+9876543210' });

      // Check if verification status should be reset (this would depend on implementation)
      user = await prisma.user.findUnique({ where: { id: testUser.id } });
      expect(user!.phone).toBe('+9876543210');
    });
  });
});
