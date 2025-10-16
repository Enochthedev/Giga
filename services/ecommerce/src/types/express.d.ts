import { PrismaClient } from '../generated/prisma-client';
import { redisService } from '../services/redis.service';

declare global {
  namespace Express {
    interface Request {
      _prisma: PrismaClient;
      redis: typeof redisService;
      user?: {
        id: string;
        sub: string;
        email: string;
        roles: string[];
        activeRole: string;
      };
      correlationId?: string;
    }
  }
}
