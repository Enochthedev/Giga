import { PrismaClient } from '@prisma/client';
import { redisService } from '../services/redis.service';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      redis: typeof redisService;
      user?: {
        id: string;
        sub: string;
        email: string;
        roles: string[];
        activeRole: string;
      };
    }
  }
}