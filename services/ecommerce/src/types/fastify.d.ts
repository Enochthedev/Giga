import { PrismaClient } from '../generated/prisma-client';

declare module 'fastify' {
  interface FastifyInstance {
    _prisma: PrismaClient;
  }

  interface FastifyRequest {
    _prisma: PrismaClient;
  }
}
