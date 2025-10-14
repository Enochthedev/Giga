import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { PrismaClient } from '../generated/prisma-client/index.js';
import { EmailService } from './email.service.js';

export interface PasswordResetResult {
  success: boolean;
  error?: string;
  code?: string;
  message?: string;
}

export interface PasswordChangeResult {
  success: boolean;
  error?: string;
  code?: string;
  message?: string;
}

export class PasswordService {
  private emailService: EmailService;

  constructor(private prisma: PrismaClient) {
    this.emailService = EmailService.getInstance();
  }

  async requestPasswordReset(
    email: string,
    req: Request
  ): Promise<PasswordResetResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists for security
        return {
          success: true,
          message:
            'If an account with that email exists, a password reset link has been sent',
        };
      }

      // Check for existing unexpired token
      const existingToken = await this.prisma.passwordResetToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingToken) {
        // Log potential abuse attempt
        console.warn(`Multiple password reset attempts:`, {
          userId: user.id,
          email: email,
          ipAddress: req.clientIp,
        });

        return {
          success: true,
          message:
            'If an account with that email exists, a password reset link has been sent',
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token
      await this.prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send reset email
      await this.emailService.sendPasswordResetEmail({
        email: user.email,
        firstName: user.firstName,
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`,
      });

      // Log successful password reset request
      console.log('Password reset email sent:', {
        userId: user.id,
        email: user.email,
        expiresAt: expiresAt.toISOString(),
      });

      return {
        success: true,
        message:
          'If an account with that email exists, a password reset link has been sent',
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<PasswordResetResult> {
    try {
      const resetToken = await this.prisma.passwordResetToken.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (!resetToken) {
        return {
          success: false,
          error: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and add to history
      await this.prisma.$transaction(async tx => {
        // Update user password
        await tx.user.update({
          where: { id: resetToken.user.id },
          data: { passwordHash: hashedPassword },
        });

        // Add to password history
        await tx.passwordHistory.create({
          data: {
            userId: resetToken.user.id,
            passwordHash: hashedPassword,
          },
        });

        // Delete used token
        await tx.passwordResetToken.delete({
          where: { id: resetToken.id },
        });

        // Invalidate all refresh tokens for security
        await tx.refreshToken.deleteMany({
          where: { userId: resetToken.user.id },
        });
      });

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD',
        };
      }

      // Check password history (prevent reuse of last 5 passwords)
      const passwordHistory = await this.prisma.passwordHistory.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      for (const historyEntry of passwordHistory) {
        const isReusedPassword = await bcrypt.compare(
          newPassword,
          historyEntry.passwordHash
        );
        if (isReusedPassword) {
          return {
            success: false,
            error: 'Cannot reuse recent passwords',
            code: 'PASSWORD_REUSED',
          };
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and add to history
      await this.prisma.$transaction(async tx => {
        await tx.user.update({
          where: { id: userId },
          data: { passwordHash: hashedPassword },
        });

        await tx.passwordHistory.create({
          data: {
            userId: userId,
            passwordHash: hashedPassword,
          },
        });
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async verifyResetToken(
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const resetToken = await this.prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetToken) {
        return {
          success: false,
          error: 'Invalid reset token',
        };
      }

      if (resetToken.expiresAt < new Date()) {
        return {
          success: false,
          error: 'Reset token has expired',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Verify reset token error:', error);
      return {
        success: false,
        error: 'Failed to verify reset token',
      };
    }
  }
}

export const passwordService = new PasswordService(new PrismaClient());
