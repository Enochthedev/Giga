import { PrismaClient } from '../generated/prisma-client';
import { DeviceInfo } from '../services/token-management.service';

declare global {
  namespace Express {
    interface Request {
      _prisma: PrismaClient;
      user?: {
        sub: string;
        email: string;
        phone?: string;
        roles: string[];
        activeRole: string;
        isEmailVerified?: boolean;
        isPhoneVerified?: boolean;
      };
      userRoles?: string[];
      deviceInfo?: DeviceInfo;
      clientIp?: string;
      deviceFingerprint?: string;
    }
  }
}
