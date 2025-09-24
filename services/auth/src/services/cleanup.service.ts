import { PrismaClient } from '../generated/prisma-client';

export class CleanupService {
  private static instance: CleanupService;
  private _prisma: PrismaClient;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService();
    }
    return CleanupService.instance;
  }

  /**
   * Start automatic cleanup of expired tokens
   */
  startAutomaticCleanup(): void {
    // Run cleanup every hour
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredTokens();
      },
      60 * 60 * 1000
    );

    console.log('🧹 Automatic token cleanup started (runs every hour)');
  }

  /**
   * Stop automatic cleanup
   */
  stopAutomaticCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🧹 Automatic token cleanup stopped');
    }
  }

  /**
   * Clean up expired email verification tokens
   */
  async cleanupExpiredEmailVerificationTokens(): Promise<number> {
    try {
      const result = await this.prisma.emailVerificationToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(
          `🧹 Cleaned up ${result.count} expired email verification tokens`
        );
      }

      return result.count;
    } catch (error) {
      console.error(
        'Error cleaning up expired email verification tokens:',
        error
      );
      return 0;
    }
  }

  /**
   * Clean up expired refresh tokens
   */
  async cleanupExpiredRefreshTokens(): Promise<number> {
    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(`🧹 Cleaned up ${result.count} expired refresh tokens`);
      }

      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired refresh tokens:', error);
      return 0;
    }
  }

  /**
   * Clean up expired password reset tokens
   */
  async cleanupExpiredPasswordResetTokens(): Promise<number> {
    try {
      const result = await this.prisma.passwordResetToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(
          `🧹 Cleaned up ${result.count} expired password reset tokens`
        );
      }

      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired password reset tokens:', error);
      return 0;
    }
  }

  /**
   * Clean up expired phone verification codes
   */
  async cleanupExpiredPhoneVerificationCodes(): Promise<number> {
    try {
      const result = await this.prisma.phoneVerificationCode.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(
          `🧹 Cleaned up ${result.count} expired phone verification codes`
        );
      }

      return result.count;
    } catch (error) {
      console.error(
        'Error cleaning up expired phone verification codes:',
        error
      );
      return 0;
    }
  }

  /**
   * Clean up all expired tokens
   */
  async cleanupExpiredTokens(): Promise<void> {
    console.log('🧹 Starting cleanup of expired tokens...');

    const startTime = Date.now();

    const [
      emailTokensDeleted,
      refreshTokensDeleted,
      passwordResetTokensDeleted,
      phoneCodesDeleted,
    ] = await Promise.all([
      this.cleanupExpiredEmailVerificationTokens(),
      this.cleanupExpiredRefreshTokens(),
      this.cleanupExpiredPasswordResetTokens(),
      this.cleanupExpiredPhoneVerificationCodes(),
    ]);

    const totalDeleted =
      emailTokensDeleted +
      refreshTokensDeleted +
      passwordResetTokensDeleted +
      phoneCodesDeleted;
    const duration = Date.now() - startTime;

    console.log(
      `🧹 Token cleanup completed in ${duration}ms. Total tokens cleaned: ${totalDeleted}`
    );
  }

  /**
   * Get cleanup statistics
   */
  async getCleanupStats(): Promise<{
    expiredEmailTokens: number;
    expiredRefreshTokens: number;
    expiredPasswordResetTokens: number;
    expiredPhoneCodes: number;
    totalExpired: number;
  }> {
    try {
      const now = new Date();

      const [
        expiredEmailTokens,
        expiredRefreshTokens,
        expiredPasswordResetTokens,
        expiredPhoneCodes,
      ] = await Promise.all([
        this.prisma.emailVerificationToken.count({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.refreshToken.count({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.passwordResetToken.count({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.phoneVerificationCode.count({
          where: { expiresAt: { lt: now } },
        }),
      ]);

      const totalExpired =
        expiredEmailTokens +
        expiredRefreshTokens +
        expiredPasswordResetTokens +
        expiredPhoneCodes;

      return {
        expiredEmailTokens,
        expiredRefreshTokens,
        expiredPasswordResetTokens,
        expiredPhoneCodes,
        totalExpired,
      };
    } catch (error) {
      console.error('Error getting cleanup stats:', error);
      return {
        expiredEmailTokens: 0,
        expiredRefreshTokens: 0,
        expiredPasswordResetTokens: 0,
        expiredPhoneCodes: 0,
        totalExpired: 0,
      };
    }
  }

  /**
   * Clean up tokens for a specific user
   */
  async cleanupUserTokens(_userId: string): Promise<void> {
    try {
      await Promise.all([
        this.prisma.emailVerificationToken.deleteMany({
          where: { userId },
        }),
        this.prisma.refreshToken.deleteMany({
          where: { userId },
        }),
        this.prisma.passwordResetToken.deleteMany({
          where: { userId },
        }),
        this.prisma.phoneVerificationCode.deleteMany({
          where: { userId },
        }),
      ]);

      console.log(`🧹 Cleaned up all tokens for user ${userId}`);
    } catch (error) {
      console.error(`Error cleaning up tokens for user ${userId}:`, error);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.stopAutomaticCleanup();
    await this.prisma.$disconnect();
    console.log('🧹 Cleanup service shutdown complete');
  }
}
