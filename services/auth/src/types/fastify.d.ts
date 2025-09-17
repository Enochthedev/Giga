import { PrismaClient } from '@prisma/client';

export interface JWTUser {
  sub: string;
  email: string;
  roles: string[];
  activeRole: string;
  iat?: number;
  exp?: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  activeRole: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: any, reply: any) => Promise<void>;
    requireRole: (role: string) => (request: any, reply: any) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTUser;
  }
}
