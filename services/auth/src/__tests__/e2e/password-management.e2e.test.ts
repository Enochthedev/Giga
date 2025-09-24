import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app';
import { PrismaClient } from '../../generated/prisma-client';
import { TestDataFactory, setupTestMocks } from '../utils/test-helpers';

// Setup mocks before importing the app
setupTestMocks();

describe('E2E: Password Management Workflows', () => {
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

  describe('Password Change Workflow', () => {
    let testUser: any;
    let accessToken: string;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
      accessToken = testDataFactory.generateJWT(testUser);
    });

    it('should allow authenticated user to change password', () => {
      const newPassword = 'NewStrongPassword123!';
      const currentPassword = 'TestPassword123!'; // Default from test factory

      // Change password
      const changePasswordResponse = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword,
          newPassword,
          confirmPassword: newPassword,
        })
        .expect(200);

      expect(changePasswordResponse.body.success).toBe(true);

      // Verify old password no longer works
      const oldPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: currentPassword,
        })
        .expect(401);

      expect(oldPasswordLoginResponse.body.success).toBe(false);

      // Verify new password works
      const newPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);

      expect(newPasswordLoginResponse.body.success).toBe(true);
      expect(newPasswordLoginResponse.body.data.tokens).toHaveProperty('accessToken');
    });

    it('should reject password change with incorrect current password', () => {
      const changePasswordResponse = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewStrongPassword123!',
          confirmPassword: 'NewStrongPassword123!',
        })
        .expect(400);

      expect(changePasswordResponse.body.success).toBe(false);
      expect(changePasswordResponse.body.error).toContain('current password');
    });

    it('should reject password change when new passwords do not match', () => {
      const changePasswordResponse = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewStrongPassword123!',
          confirmPassword: 'DifferentPassword123!',
        })
        .expect(400);

      expect(changePasswordResponse.body.success).toBe(false);
      expect(changePasswordResponse.body.error).toContain('match');
    });

    it('should reject weak new passwords', () => {
      const weakPasswords = [
        'weak',
        '12345678',
        'password',
        'Password123', // Missing special character
        'password123!', // Missing uppercase
        'PASSWORD123!', // Missing lowercase
        'Password!', // Too short
      ];

      for (const weakPassword of weakPasswords) {
        const changePasswordResponse = await request(app)
          .put('/api/v1/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword: 'TestPassword123!',
            newPassword: weakPassword,
            confirmPassword: weakPassword,
          })
          .expect(400);

        expect(changePasswordResponse.body.success).toBe(false);
        expect(changePasswordResponse.body.error).toContain('password');
      }
    });

    it('should invalidate all refresh tokens after password change', () => {
      // Create some refresh tokens
      const refreshToken1 = await testDataFactory.createRefreshToken(testUser.id);
      const refreshToken2 = await testDataFactory.createRefreshToken(testUser.id);

      // Verify tokens exist
      const tokensBefore = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensBefore).toHaveLength(2);

      // Change password
      await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewStrongPassword123!',
          confirmPassword: 'NewStrongPassword123!',
        })
        .expect(200);

      // Verify all refresh tokens are invalidated
      const tokensAfter = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensAfter).toHaveLength(0);

      // Verify old refresh tokens cannot be used
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: refreshToken1.token,
        })
        .expect(401);

      expect(refreshResponse.body.success).toBe(false);
    });

    it('should enforce password history to prevent reuse', () => {
      const originalPassword = 'TestPassword123!';
      const newPassword = 'NewStrongPassword123!';

      // Change password first time
      await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: originalPassword,
          newPassword: newPassword,
          confirmPassword: newPassword,
        })
        .expect(200);

      // Login with new password to get new token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);

      const newAccessToken = loginResponse.body.data.tokens.accessToken;

      // Try to change back to original password (should be prevented)
      const revertPasswordResponse = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .send({
          currentPassword: newPassword,
          newPassword: originalPassword,
          confirmPassword: originalPassword,
        })
        .expect(400);

      expect(revertPasswordResponse.body.success).toBe(false);
      expect(revertPasswordResponse.body.error).toContain('recently used');
    });
  });

  describe('Password Reset Workflow', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser({
        isEmailVerified: true, // Email must be verified for password reset
      });
    });

    it('should complete full password reset workflow', () => {
      // Step 1: Request password reset
      const resetRequestResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email,
        })
        .expect(200);

      expect(resetRequestResponse.body.success).toBe(true);

      // Step 2: Get reset token from database
      const resetToken = await prisma.passwordResetToken.findFirst({
        where: { userId: testUser.id },
        orderBy: { createdAt: 'desc' },
      });

      expect(resetToken).toBeTruthy();

      // Step 3: Reset password with token
      const newPassword = 'ResetPassword123!';
      const resetPasswordResponse = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: resetToken!.token,
          newPassword,
          confirmPassword: newPassword,
        })
        .expect(200);

      expect(resetPasswordResponse.body.success).toBe(true);

      // Step 4: Verify old password no longer works
      const oldPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!', // Original password
        })
        .expect(401);

      expect(oldPasswordLoginResponse.body.success).toBe(false);

      // Step 5: Verify new password works
      const newPasswordLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(200);

      expect(newPasswordLoginResponse.body.success).toBe(true);

      // Step 6: Verify reset token is consumed/deleted
      const usedToken = await prisma.passwordResetToken.findUnique({
        where: { id: resetToken!.id },
      });

      expect(usedToken).toBeNull();
    });

    it('should reject password reset for non-existent email', () => {
      const resetRequestResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(404);

      expect(resetRequestResponse.body.success).toBe(false);
      expect(resetRequestResponse.body.error).toContain('not found');
    });

    it('should reject password reset for unverified email', () => {
      const unverifiedUser = await testDataFactory.createTestUser({
        isEmailVerified: false,
      });

      const resetRequestResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: unverifiedUser.email,
        })
        .expect(400);

      expect(resetRequestResponse.body.success).toBe(false);
      expect(resetRequestResponse.body.error).toContain('verified');
    });

    it('should reject invalid reset tokens', () => {
      const resetPasswordResponse = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        })
        .expect(400);

      expect(resetPasswordResponse.body.success).toBe(false);
      expect(resetPasswordResponse.body.error).toContain('Invalid');
    });

    it('should reject expired reset tokens', () => {
      // Create expired reset token
      const expiredToken = await testDataFactory.createPasswordResetToken(
        testUser.id,
        new Date(Date.now() - 60 * 60 * 1000) // Expired 1 hour ago
      );

      const resetPasswordResponse = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: expiredToken.token,
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        })
        .expect(400);

      expect(resetPasswordResponse.body.success).toBe(false);
      expect(resetPasswordResponse.body.error).toContain('expired');
    });

    it('should rate limit password reset requests', () => {
      // First request should succeed
      await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email,
        })
        .expect(200);

      // Second request immediately should be rate limited
      const rateLimitedResponse = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email,
        })
        .expect(429);

      expect(rateLimitedResponse.body.success).toBe(false);
      expect(rateLimitedResponse.body.error).toContain('rate limit');
    });

    it('should invalidate all refresh tokens after password reset', () => {
      // Create some refresh tokens
      await testDataFactory.createRefreshToken(testUser.id);
      await testDataFactory.createRefreshToken(testUser.id);

      // Verify tokens exist
      const tokensBefore = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensBefore).toHaveLength(2);

      // Request password reset
      await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: testUser.email,
        })
        .expect(200);

      // Get reset token
      const resetToken = await prisma.passwordResetToken.findFirst({
        where: { userId: testUser.id },
        orderBy: { createdAt: 'desc' },
      });

      // Reset password
      await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: resetToken!.token,
          newPassword: 'ResetPassword123!',
          confirmPassword: 'ResetPassword123!',
        })
        .expect(200);

      // Verify all refresh tokens are invalidated
      const tokensAfter = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensAfter).toHaveLength(0);
    });
  });

  describe('Password Security and Validation', () => {
    it('should enforce strong password requirements', () => {
      const userData = {
        email: testDataFactory.generateRandomEmail(),
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      };

      const weakPasswords = [
        'short',
        '12345678',
        'onlylowercase',
        'ONLYUPPERCASE',
        'NoSpecialChar123',
        'no-numbers!',
        'common-password',
        'password123',
        'qwerty123!',
        '123456789!',
      ];

      for (const weakPassword of weakPasswords) {
        const registerResponse = await request(app)
          .post('/api/v1/auth/register')
          .send({
            ...userData,
            password: weakPassword,
          })
          .expect(400);

        expect(registerResponse.body.success).toBe(false);
        expect(registerResponse.body.error).toContain('password');
      }
    });

    it('should accept strong passwords', () => {
      const strongPasswords = [
        'StrongPassword123!',
        'MySecure@Pass2023',
        'Complex#Password456',
        'Ungu3ssable$Passw0rd',
        'Str0ng&Secure#2023',
      ];

      for (const strongPassword of strongPasswords) {
        const userData = {
          email: testDataFactory.generateRandomEmail(),
          password: strongPassword,
          firstName: 'Test',
          lastName: 'User',
          acceptTerms: true,
        };

        const registerResponse = await request(app)
          .post('/api/v1/auth/register')
          .send(userData)
          .expect(201);

        expect(registerResponse.body.success).toBe(true);

        // Clean up for next iteration
        await prisma.user.delete({
          where: { id: registerResponse.body.data.user.id },
        });
      }
    });

    it('should properly hash passwords with bcrypt', () => {
      const password = 'TestPassword123!';
      const userData = {
        email: testDataFactory.generateRandomEmail(),
        password,
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true,
      };

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      const userId = registerResponse.body.data.user.id;

      // Get user from database
      const userInDb = await prisma.user.findUnique({
        where: { id: userId },
      });

      // Verify password is hashed
      expect(userInDb!.passwordHash).not.toBe(password);
      expect(userInDb!.passwordHash.startsWith('$2b$')).toBe(true);

      // Verify hash can be verified
      const isValidHash = await bcrypt.compare(password, userInDb!.passwordHash);
      expect(isValidHash).toBe(true);

      // Verify wrong password fails
      const isInvalidHash = await bcrypt.compare('wrongpassword', userInDb!.passwordHash);
      expect(isInvalidHash).toBe(false);
    });

    it('should prevent password reuse across multiple changes', () => {
      const testUser = await testDataFactory.createTestUser();
      let accessToken = testDataFactory.generateJWT(testUser);

      const passwords = [
        'FirstPassword123!',
        'SecondPassword123!',
        'ThirdPassword123!',
      ];

      let currentPassword = 'TestPassword123!'; // Original password

      // Change password multiple times
      for (const newPassword of passwords) {
        const changeResponse = await request(app)
          .put('/api/v1/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword,
            newPassword,
            confirmPassword: newPassword,
          })
          .expect(200);

        expect(changeResponse.body.success).toBe(true);

        // Login with new password to get new token
        const loginResponse = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: testUser.email,
            password: newPassword,
          })
          .expect(200);

        accessToken = loginResponse.body.data.tokens.accessToken;
        currentPassword = newPassword;
      }

      // Try to reuse any of the previous passwords
      const previousPasswords = ['TestPassword123!', ...passwords.slice(0, -1)];

      for (const oldPassword of previousPasswords) {
        const reuseResponse = await request(app)
          .put('/api/v1/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword,
            newPassword: oldPassword,
            confirmPassword: oldPassword,
          })
          .expect(400);

        expect(reuseResponse.body.success).toBe(false);
        expect(reuseResponse.body.error).toContain('recently used');
      }
    });
  });

  describe('Password Management Edge Cases', () => {
    it('should handle concurrent password change attempts', () => {
      const testUser = await testDataFactory.createTestUser();
      const accessToken = testDataFactory.generateJWT(testUser);

      const concurrentChanges = [
        request(app)
          .put('/api/v1/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword: 'TestPassword123!',
            newPassword: 'NewPassword1!',
            confirmPassword: 'NewPassword1!',
          }),
        request(app)
          .put('/api/v1/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            currentPassword: 'TestPassword123!',
            newPassword: 'NewPassword2!',
            confirmPassword: 'NewPassword2!',
          }),
      ];

      const responses = await Promise.all(concurrentChanges);

      // Only one should succeed
      const successfulChanges = responses.filter(res => res.status === 200);
      expect(successfulChanges).toHaveLength(1);

      // The other should fail with appropriate error
      const failedChanges = responses.filter(res => res.status !== 200);
      expect(failedChanges).toHaveLength(1);
    });

    it('should handle password reset token cleanup', () => {
      const testUser = await testDataFactory.createTestUser({
        isEmailVerified: true,
      });

      // Create multiple reset requests
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/auth/forgot-password')
          .send({
            email: testUser.email,
          });

        // Wait a bit to avoid rate limiting in test
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Should have multiple tokens
      const tokensBefore = await prisma.passwordResetToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensBefore.length).toBeGreaterThan(1);

      // Use the latest token
      const latestToken = tokensBefore.sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      )[0];

      // Reset password
      await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token: latestToken.token,
          newPassword: 'ResetPassword123!',
          confirmPassword: 'ResetPassword123!',
        })
        .expect(200);

      // All tokens for this user should be cleaned up
      const tokensAfter = await prisma.passwordResetToken.findMany({
        where: { userId: testUser.id },
      });
      expect(tokensAfter).toHaveLength(0);
    });

    it('should handle password operations with expired JWT tokens', () => {
      const testUser = await testDataFactory.createTestUser();
      const expiredToken = testDataFactory.generateExpiredJWT(testUser);

      // Try to change password with expired token
      const changePasswordResponse = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        })
        .expect(401);

      expect(changePasswordResponse.body.success).toBe(false);
      expect(changePasswordResponse.body.error).toContain('token');
    });
  });
});