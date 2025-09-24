import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from '../controllers/auth.controller';
import { EmailService } from '../services/email.service';
import { PasswordValidator } from '../utils/security.utils';

// Mock dependencies
vi.mock('../services/email.service');
vi.mock('../services/jwt.service');
vi.mock('../services/token-management.service');
vi.mock('../utils/security.utils', () => ({
  PasswordValidator: {
    validate: vi.fn(),
    getStrengthScore: vi.fn(),
  },
  JWTSecurity: {
    validateSecretStrength: vi.fn(() => ({ isValid: true, errors: [] })),
  },
  InputSanitizer: {
    sanitizeString: vi.fn((str) => str),
  },
}));
vi.mock('bcryptjs');

describe('AuthController - Password Reset', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockPrisma: any;
  let mockEmailService: unknown;

  beforeEach(() => {
    authController = new AuthController();

    // Mock Prisma client
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      passwordResetToken: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
      passwordHistory: {
        findMany: vi.fn(),
        create: vi.fn(),
        deleteMany: vi.fn(),
      },
      refreshToken: {
        deleteMany: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    // Mock request and response
    mockRequest = {
      body: {},
      clientIp: '127.0.0.1',
      headers: { 'user-agent': 'test-agent' },
      prisma: mockPrisma,
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Mock EmailService
    mockEmailService = {
      generateVerificationToken: vi.fn(),
      createPasswordResetUrl: vi.fn(),
      sendPasswordResetEmail: vi.fn(),
    };

    vi.mocked(EmailService.getInstance).mockReturnValue(mockEmailService);

    // Mock TokenManagementService
    const mockTokenManagementService = {
      revokeTokens: vi.fn(),
    };

    // Mock the getInstance method for TokenManagementService
    const { TokenManagementService } = await import('../services/token-management.service');
    vi.mocked(TokenManagementService.getInstance).mockReturnValue(mockTokenManagementService);
  });

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      mockRequest.body = { email: 'test@example.com' };
    });

    it('should return success even for non-existent user (security)', () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await authController.requestPasswordReset(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent',
        timestamp: expect.any(String),
      });
    });

    it('should return success for inactive user (security)', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        isActive: false,
      });

      await authController.requestPasswordReset(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent',
        timestamp: expect.any(String),
      });
    });

    it('should not send email if token already exists', () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        firstName: 'Test',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
        id: 'token1',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      });

      await authController.requestPasswordReset(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent',
        timestamp: expect.any(String),
      });
    });

    it('should send reset email for valid user', () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        firstName: 'Test',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.passwordResetToken.findFirst.mockResolvedValue(null);
      mockEmailService.generateVerificationToken.mockReturnValue('reset-token-123');
      mockEmailService.createPasswordResetUrl.mockReturnValue('http://example.com/reset?token=reset-token-123');
      mockEmailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await authController.requestPasswordReset(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          token: 'reset-token-123',
          userId: 'user1',
          expiresAt: expect.any(Date),
        },
      });

      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'Test',
        resetToken: 'reset-token-123',
        resetUrl: 'http://example.com/reset?token=reset-token-123',
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent',
        timestamp: expect.any(String),
      });
    });

    it('should handle email sending failure', () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        firstName: 'Test',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.passwordResetToken.findFirst.mockResolvedValue(null);
      mockEmailService.generateVerificationToken.mockReturnValue('reset-token-123');
      mockEmailService.createPasswordResetUrl.mockReturnValue('http://example.com/reset?token=reset-token-123');
      mockEmailService.sendPasswordResetEmail.mockRejectedValue(new Error('Email service error'));

      await authController.requestPasswordReset(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'reset-token-123' },
      });

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to send password reset email',
        code: 'EMAIL_SEND_ERROR',
        timestamp: expect.any(String),
      });
    });
  });

  describe('verifyPasswordResetToken', () => {
    beforeEach(() => {
      mockRequest.body = { token: 'reset-token-123' };
    });

    it('should return error for invalid token', () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await authController.verifyPasswordResetToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid reset token',
        code: 'INVALID_TOKEN',
        timestamp: expect.any(String),
      });
    });

    it('should return error for expired token', () => {
      const expiredToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        user: { email: 'test@example.com', isActive: true },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(expiredToken);

      await authController.verifyPasswordResetToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { id: 'token1' },
      });

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Reset token has expired',
        message: 'Please request a new password reset',
        code: 'TOKEN_EXPIRED',
        timestamp: expect.any(String),
      });
    });

    it('should return error for inactive user', () => {
      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        user: { email: 'test@example.com', isActive: false },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);

      await authController.verifyPasswordResetToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Account is not active',
        code: 'ACCOUNT_INACTIVE',
        timestamp: expect.any(String),
      });
    });

    it('should return success for valid token', () => {
      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        user: { email: 'test@example.com', isActive: true },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);

      await authController.verifyPasswordResetToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reset token is valid',
        data: {
          email: 'test@example.com',
          expiresAt: validToken.expiresAt.toISOString(),
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('resetPassword', () => {
    beforeEach(() => {
      mockRequest.body = {
        token: 'reset-token-123',
        newPassword: 'NewSecurePass123!',
      };
    });

    it('should return error for weak password', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({
        isValid: false,
        errors: ['Password too weak'],
      });
      vi.mocked(PasswordValidator.getStrengthScore).mockReturnValue(2);

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Password does not meet security requirements',
        code: 'WEAK_PASSWORD',
        details: {
          errors: ['Password too weak'],
          strengthScore: 2,
          requirements: expect.any(Array),
        },
        timestamp: expect.any(String),
      });
    });

    it('should return error for invalid token', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid reset token',
        code: 'INVALID_TOKEN',
        timestamp: expect.any(String),
      });
    });

    it('should return error for password reuse', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'old-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany.mockResolvedValue([
        { passwordHash: 'hash1' },
        { passwordHash: 'hash2' },
      ]);

      vi.mocked(bcrypt.compare)
        .mockResolvedValueOnce(false) // First history entry
        .mockResolvedValueOnce(true); // Second history entry (match)

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cannot reuse recent passwords',
        message: 'Please choose a password you have not used recently',
        code: 'PASSWORD_REUSED',
        timestamp: expect.any(String),
      });
    });

    it('should successfully reset password', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-password-hash');
      vi.mocked(bcrypt.compare).mockResolvedValue(false); // No password reuse

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'old-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany.mockResolvedValue([]);

      // Mock transaction
      const mockTransaction = vi.fn().mockImplementation((callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.$transaction = mockTransaction;

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
        timestamp: expect.any(String),
      });
    });
  });

  describe('Password History Management', () => {
    it('should add current password to history before reset', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-password-hash');
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'current-password-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany.mockResolvedValue([]);

      const mockTransaction = vi.fn().mockImplementation((callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.$transaction = mockTransaction;

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordHistory.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          passwordHash: 'current-password-hash',
        },
      });
    });

    it('should clean up old password history', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-password-hash');
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'current-password-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany
        .mockResolvedValueOnce([]) // For password reuse check
        .mockResolvedValueOnce([   // For cleanup check
          { id: 'old1' },
          { id: 'old2' },
        ]);

      const mockTransaction = vi.fn().mockImplementation((callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.$transaction = mockTransaction;

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordHistory.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['old1', 'old2'] },
        },
      });
    });
  });

  describe('Security Features', () => {
    it('should invalidate all refresh tokens after password reset', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-password-hash');
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'old-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany.mockResolvedValue([]);

      const mockTransaction = vi.fn().mockImplementation((callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.$transaction = mockTransaction;

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
    });

    it('should delete used reset token', () => {
      vi.mocked(PasswordValidator.validate).mockReturnValue({ isValid: true });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-password-hash');
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const validToken = {
        id: 'token1',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user1',
          email: 'test@example.com',
          isActive: true,
          passwordHash: 'old-hash',
        },
      };

      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken);
      mockPrisma.passwordHistory.findMany.mockResolvedValue([]);

      const mockTransaction = vi.fn().mockImplementation((callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.$transaction = mockTransaction;

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockPrisma.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { id: 'token1' },
      });
    });
  });
});