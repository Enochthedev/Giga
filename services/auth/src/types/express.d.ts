import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      user?: {
        sub: string;
        email: string;
        roles: string[];
        activeRole: string;
      };
    }
  }
}
