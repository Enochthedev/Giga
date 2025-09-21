import { PrismaClient } from '../generated/prisma-client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    prisma: PrismaClient;
  }
}
