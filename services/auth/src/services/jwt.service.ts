import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWTSecurity } from '../utils/security.utils';

/**
 * Enhanced JWT Service with key rotation and security features
 */
export class JWTService {
  private static instance: JWTService;
  private currentSecret: string;
  private previousSecret?: string;
  private keyRotationInterval: number = 24 * 60 * 60 * 1000; // 24 hours
  private lastRotation: number = Date.now();
  private blacklistedTokens: Set<string> = new Set();

  private constructor() {
    this.currentSecret = this.getOrGenerateSecret();
    this.validateSecretSecurity();

    // Start key rotation timer
    this.startKeyRotation();
  }

  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  /**
   * Generates a secure access token
   */
  public generateAccessToken(user: any, additionalClaims: Record<string, any> = {}): string {
    const payload = JWTSecurity.createSecurePayload(user, {
      type: 'access',
      keyVersion: this.getKeyVersion(),
      sessionId: crypto.randomUUID(), // Add session tracking
      ...additionalClaims
    });

    return jwt.sign(payload, this.currentSecret, {
      algorithm: 'HS256',
      expiresIn: '15m',
      issuer: 'auth-service',
      audience: 'platform-users',
      notBefore: Math.floor(Date.now() / 1000), // Token not valid before now
    });
  }

  /**
   * Generates a secure refresh token
   */
  public generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verifies and decodes a JWT token
   */
  public verifyToken(token: string): any {
    try {
      // Check if token is blacklisted
      if (this.isTokenBlacklisted(token)) {
        throw new Error('Token has been revoked');
      }

      // Try current secret first
      try {
        const decoded = jwt.verify(token, this.currentSecret, {
          algorithms: ['HS256'],
          issuer: 'auth-service',
          audience: 'platform-users'
        });

        // Validate token claims
        const validation = JWTSecurity.validateTokenClaims(decoded);
        if (!validation.isValid) {
          throw new Error(`Invalid token claims: ${validation.errors.join(', ')}`);
        }

        return decoded;
      } catch (error) {
        // If current secret fails and we have a previous secret, try it
        if (this.previousSecret) {
          const decoded = jwt.verify(token, this.previousSecret, {
            algorithms: ['HS256'],
            issuer: 'auth-service',
            audience: 'platform-users'
          });

          // Validate token claims
          const validation = JWTSecurity.validateTokenClaims(decoded);
          if (!validation.isValid) {
            throw new Error(`Invalid token claims: ${validation.errors.join(', ')}`);
          }

          // Mark token for refresh since it's using old key
          (decoded as any).needsRefresh = true;
          return decoded;
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      throw error;
    }
  }

  /**
   * Blacklists a token (for logout, password change, etc.)
   */
  public blacklistToken(token: string): void {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.jti) {
        this.blacklistedTokens.add(decoded.jti);

        // Clean up old blacklisted tokens periodically
        if (this.blacklistedTokens.size > 10000) {
          this.cleanupBlacklistedTokens();
        }
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  /**
   * Checks if a token is blacklisted
   */
  private isTokenBlacklisted(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      return decoded && decoded.jti && this.blacklistedTokens.has(decoded.jti);
    } catch {
      return false;
    }
  }

  /**
   * Gets or generates JWT secret
   */
  private getOrGenerateSecret(): string {
    let secret = process.env.JWT_SECRET;

    if (!secret) {
      console.warn('JWT_SECRET not found in environment, generating secure secret');
      secret = JWTSecurity.generateSecureSecret();
    }

    return secret;
  }

  /**
   * Validates secret security
   */
  private validateSecretSecurity(): void {
    const validation = JWTSecurity.validateSecretStrength(this.currentSecret);
    if (!validation.isValid) {
      console.error('JWT Secret Security Issues:', validation.errors);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Insecure JWT secret detected in production');
      }
    }
  }

  /**
   * Starts automatic key rotation
   */
  private startKeyRotation(): void {
    // Only enable key rotation in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_KEY_ROTATION) {
      console.log('JWT key rotation disabled in development mode');
      return;
    }

    console.log('JWT key rotation enabled - keys will rotate every 24 hours');
    setInterval(() => {
      this.rotateKey();
    }, this.keyRotationInterval);
  }

  /**
   * Rotates the JWT signing key
   */
  private rotateKey(): void {
    console.log('Rotating JWT signing key');

    this.previousSecret = this.currentSecret;
    this.currentSecret = JWTSecurity.generateSecureSecret();
    this.lastRotation = Date.now();

    // Clear previous secret after grace period (1 hour)
    setTimeout(() => {
      this.previousSecret = undefined;
      console.log('Previous JWT key cleared');
    }, 60 * 60 * 1000);
  }

  /**
   * Gets current key version for tracking
   */
  private getKeyVersion(): string {
    return crypto.createHash('sha256')
      .update(this.currentSecret)
      .digest('hex')
      .substring(0, 8);
  }

  /**
   * Cleans up old blacklisted tokens
   */
  private cleanupBlacklistedTokens(): void {
    // In a production environment, this should be moved to a database
    // and cleaned up based on token expiration times
    const tokensToKeep = Array.from(this.blacklistedTokens).slice(-5000);
    this.blacklistedTokens = new Set(tokensToKeep);
  }

  /**
   * Gets token information for debugging
   */
  public getTokenInfo(token: string): any {
    try {
      const decoded = jwt.decode(token, { complete: true });
      return {
        header: decoded?.header,
        payload: decoded?.payload,
        isBlacklisted: this.isTokenBlacklisted(token)
      };
    } catch {
      return null;
    }
  }

  /**
   * Validates token without throwing errors
   */
  public isTokenValid(token: string): boolean {
    try {
      this.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets service statistics
   */
  public getStats(): any {
    return {
      keyVersion: this.getKeyVersion(),
      lastRotation: new Date(this.lastRotation).toISOString(),
      blacklistedTokensCount: this.blacklistedTokens.size,
      keyRotationEnabled: process.env.NODE_ENV === 'production' || !!process.env.ENABLE_KEY_ROTATION
    };
  }
}