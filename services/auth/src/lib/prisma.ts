import { PrismaClient } from '../generated/prisma-client';

// Create a global variable to store the Prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var ___prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', () => {
  await prisma.$disconnect();
});

process.on('SIGINT', () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  await prisma.$disconnect();
  process.exit(0);
});
