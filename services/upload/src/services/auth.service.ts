import jwt from 'jsonwebtoken';
import { createLogger } from '../lib/logger';
import { SecurityUtils } from '../utils/security-utils';

const logger = createLogger('AuthService');

export interface ServiceTokenPayload {
  sub: string; // Service ID
  serviceName: string;
  permissions: string[];
  type: 'service';
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface UserTokenPayload {
  sub: string; // User ID
  email: string;
  roles: string[];
  permissions: string[];
  type: 'user';
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface AuthContext {
  type: 'service' | 'user';
  id: string;
  permissions: string[];
  serviceName?: string;
  email?: string;
  roles?: string[];
}

/**
 * Authentication service for validating service and user tokens
 */
export class AuthService {
  private static instance: AuthService;
  private jwtSecret: string;
  private jwtIssuer: string;
  private jwtAudience: string;
  private blacklistedTokens: Set<string> = new Set();

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret';
    this.jwtIssuer = process.env.JWT_ISSUER || 'platform-auth';
    this.jwtAudience = process.env.JWT_AUDIENCE || 'platform-services';

    if (
      this.jwtSecret === 'default-secret' &&
      process.env.NODE_ENV === 'production'
    ) {
      throw new Error('JWT_SECRET must be set in production environment');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Validate and decode a JWT token
   */
  public async validateToken(token: string): Promise<AuthContext> {
    try {
      // Check if token is blacklisted
      if (this.isTokenBlacklisted(token)) {
        throw new Error('Token has been revoked');
      }

      // Verify and decode token
      const decoded = jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
        issuer: this.jwtIssuer,
        audience: this.jwtAudience,
      }) as ServiceTokenPayload | UserTokenPayload;

      // Validate token structure
      this.validateTokenStructure(decoded);

      // Create auth context based on token type
      if (decoded.type === 'service') {
        return this.createServiceContext(decoded as ServiceTokenPayload);
      } else if (decoded.type === 'user') {
        return this.createUserContext(decoded as UserTokenPayload);
      } else {
        throw new Error('Invalid token type');
      }
    } catch (error) {
      const err = error as any;
      logger.error('Token validation failed', { error: err.message });

      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.NotBeforeError) {
        throw new Error('Token not yet valid');
      }

      throw error;
    }
  }

  /**
   * Check if user/service has required permission
   */
  public hasPermission(context: AuthContext, permission: string): boolean {
    return (
      context.permissions.includes(permission) ||
      context.permissions.includes('*') ||
      context.permissions.includes('upload:*')
    );
  }

  /**
   * Check if user has required role
   */
  public hasRole(context: AuthContext, role: string): boolean {
    if (context.type !== 'user' || !context.roles) {
      return false;
    }
    return context.roles.includes(role) || context.roles.includes('ADMIN');
  }

  /**
   * Generate service token (for testing purposes)
   */
  public generateServiceToken(
    serviceId: string,
    serviceName: string,
    permissions: string[]
  ): string {
    const payload: Omit<ServiceTokenPayload, 'iat' | 'exp'> = {
      sub: serviceId,
      serviceName,
      permissions,
      type: 'service',
      iss: this.jwtIssuer,
      aud: this.jwtAudience,
    };

    return jwt.sign(payload, this.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });
  }

  /**
   * Blacklist a token
   */
  public blacklistToken(token: string): void {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.jti) {
        this.blacklistedTokens.add(decoded.jti);
      } else {
        // If no jti, blacklist the token hash
        const tokenHash = SecurityUtils.generateFileHash(Buffer.from(token));
        this.blacklistedTokens.add(tokenHash);
      }

      logger.info('Token blacklisted', { tokenId: decoded?.jti || 'no-jti' });
    } catch (error) {
      logger.error('Error blacklisting token', error);
    }
  }

  /**
   * Check if token is blacklisted
   */
  private isTokenBlacklisted(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.jti && this.blacklistedTokens.has(decoded.jti)) {
        return true;
      }

      // Also check token hash for tokens without jti
      if (!decoded || !decoded.jti) {
        const tokenHash = SecurityUtils.generateFileHash(Buffer.from(token));
        return this.blacklistedTokens.has(tokenHash);
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Validate token structure
   */
  private validateTokenStructure(decoded: any): void {
    if (!decoded.sub) {
      throw new Error('Token missing subject (sub) claim');
    }

    if (!decoded.type || !['service', 'user'].includes(decoded.type)) {
      throw new Error('Token missing or invalid type claim');
    }

    if (!decoded.permissions || !Array.isArray(decoded.permissions)) {
      throw new Error('Token missing or invalid permissions claim');
    }

    if (decoded.type === 'service' && !decoded.serviceName) {
      throw new Error('Service token missing serviceName claim');
    }

    if (decoded.type === 'user' && !decoded.email) {
      throw new Error('User token missing email claim');
    }
  }

  /**
   * Create service auth context
   */
  private createServiceContext(payload: ServiceTokenPayload): AuthContext {
    return {
      type: 'service',
      id: payload.sub,
      serviceName: payload.serviceName,
      permissions: payload.permissions,
    };
  }

  /**
   * Create user auth context
   */
  private createUserContext(payload: UserTokenPayload): AuthContext {
    return {
      type: 'user',
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }

  /**
   * Get service statistics
   */
  public getStats(): any {
    return {
      blacklistedTokensCount: this.blacklistedTokens.size,
      jwtIssuer: this.jwtIssuer,
      jwtAudience: this.jwtAudience,
    };
  }
}
