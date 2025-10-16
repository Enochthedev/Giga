import { PrismaClient } from '../generated/prisma-client';

const globalForPrisma = globalThis as unknown as {
  _prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma._prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma._prisma = prisma;
