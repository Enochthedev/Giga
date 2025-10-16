import crypto from 'crypto';
import { PrismaClient } from '../generated/prisma-client/index.js';
import { EmailService } from './email.service.js';
import { smsService } from './sms.service.js';

export interface VerificationResult {
  success: boolean;
  error?: string;
  code?: string;
  message?: string;
}

export class VerificationService {
  private emailService: EmailService;

  constructor(private prisma: PrismaClient) {
    this.emailService = EmailService.getInstance();
  }

  async sendEmailVerification(userId: string): Promise<VerificationResult> {
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

      if (user.isEmailVerified) {
        return {
          success: false,
          error: 'Email is already verified',
          code: 'EMAIL_ALREADY_VERIFIED',
        };
      }

      // Check for existing unexpired token
      const existingToken = await this.prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingToken) {
        return {
          success: false,
          error: 'Verification email already sent',
          message:
            'Please check your email or wait before requesting another verification email',
          code: 'VERIFICATION_EMAIL_ALREADY_SENT',
        };
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save token
      await this.prisma.emailVerificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send email
      await this.emailService.sendVerificationEmail({
        email: user.email,
        firstName: user.firstName,
        verificationToken,
        verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`,
      });

      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      console.error('Send email verification error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async verifyEmail(token: string): Promise<VerificationResult> {
    try {
      const verificationToken =
        await this.prisma.emailVerificationToken.findFirst({
          where: {
            token,
            expiresAt: { gt: new Date() },
          },
          include: {
            user: true,
          },
        });

      if (!verificationToken) {
        return {
          success: false,
          error: 'Invalid or expired verification token',
          code: 'INVALID_TOKEN',
        };
      }

      // Update user as verified
      await this.prisma.user.update({
        where: { id: verificationToken.user.id },
        data: { isEmailVerified: true },
      });

      // Delete used token
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async sendPhoneVerification(userId: string): Promise<VerificationResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.phone) {
        return {
          success: false,
          error: 'User not found or phone number not provided',
          code: 'USER_NOT_FOUND_OR_NO_PHONE',
        };
      }

      if (user.isPhoneVerified) {
        return {
          success: false,
          error: 'Phone number is already verified',
          code: 'PHONE_ALREADY_VERIFIED',
        };
      }

      // Check for existing unexpired code
      const existingCode = await this.prisma.phoneVerificationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingCode) {
        return {
          success: false,
          error: 'Verification code already sent',
          message: 'Please wait before requesting another verification code',
          code: 'VERIFICATION_CODE_ALREADY_SENT',
        };
      }

      // Generate verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clean up expired codes
      await this.prisma.phoneVerificationCode.deleteMany({
        where: {
          userId: user.id,
          expiresAt: { lt: new Date() },
        },
      });

      // Save code
      await this.prisma.phoneVerificationCode.create({
        data: {
          code: verificationCode,
          userId: user.id,
          expiresAt,
        },
      });

      // Send SMS
      await smsService.sendVerificationCode(user.phone, verificationCode);

      return {
        success: true,
        message: 'Verification code sent successfully',
      };
    } catch (error) {
      console.error('Send phone verification error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async verifyPhone(userId: string, code: string): Promise<VerificationResult> {
    try {
      const verificationCode =
        await this.prisma.phoneVerificationCode.findFirst({
          where: {
            userId: userId,
            code,
            expiresAt: { gt: new Date() },
          },
        });

      if (!verificationCode) {
        return {
          success: false,
          error: 'Invalid or expired verification code',
          code: 'INVALID_CODE',
        };
      }

      // Update user as verified
      await this.prisma.user.update({
        where: { id: userId },
        data: { isPhoneVerified: true },
      });

      // Delete used code
      await this.prisma.phoneVerificationCode.delete({
        where: { id: verificationCode.id },
      });

      return {
        success: true,
        message: 'Phone number verified successfully',
      };
    } catch (error) {
      console.error('Verify phone error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }
}

export const verificationService = new VerificationService(new PrismaClient());
