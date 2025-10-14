import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { PrismaClient } from '../generated/prisma-client/index.js';
import { SessionManagementMiddleware } from '../middleware/sessionManagement.middleware.js';
import { EmailService } from './email.service.js';
import { SecurityMonitoringService } from './security-monitoring.service.js';
import { TokenManagementService } from './token-management.service.js';

export interface LoginCredentials {
  email: string;
  password: string;
  deviceFingerprint?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
  code?: string;
}

export class AuthService {
  private tokenService: TokenManagementService;
  private emailService: EmailService;
  private securityService: SecurityMonitoringService;
  private sessionService: SessionManagementMiddleware;

  constructor(private prisma: PrismaClient) {
    this.tokenService = TokenManagementService.getInstance();
    this.emailService = EmailService.getInstance();
    this.securityService = SecurityMonitoringService.getInstance();
    this.sessionService = new SessionManagementMiddleware();
  }

  async login(
    credentials: LoginCredentials,
    req: Request
  ): Promise<AuthResult> {
    try {
      const { email, password } = credentials;

      // Find user with roles
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        // Log failed attempt
        console.warn(`Invalid password attempt from IP ${req.clientIp}:`, {
          userId: user.id,
          email: email,
          userAgent: req.headers['user-agent'],
        });

        return {
          success: false,
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED',
        };
      }

      // Security analysis
      const loginAnalysis = await this.securityService.analyzeLoginAttempt(
        this.prisma,
        {
          userId: user.id,
          email: user.email,
          ipAddress: req.clientIp || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          deviceFingerprint: credentials.deviceFingerprint,
          success: true,
          timestamp: new Date(),
        }
      );

      if (loginAnalysis.recommendedAction === 'block_access') {
        console.warn(`Login blocked due to high risk score:`, {
          userId: user.id,
          email: user.email,
          riskScore: loginAnalysis.riskScore,
        });

        return {
          success: false,
          error: 'Login blocked for security reasons',
          code: 'SECURITY_BLOCK',
        };
      }

      // Generate tokens
      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        platform: Array.isArray(req.headers['sec-ch-ua-platform'])
          ? req.headers['sec-ch-ua-platform'][0] || 'unknown'
          : req.headers['sec-ch-ua-platform'] || 'unknown',
        language: Array.isArray(req.headers['accept-language'])
          ? req.headers['accept-language'][0] || 'en'
          : req.headers['accept-language'] || 'en',
      };

      const tokens = await this.tokenService.generateDeviceTokens(
        this.prisma,
        user,
        deviceInfo,
        req.clientIp || 'unknown'
      );

      // Initialize session
      await SessionManagementMiddleware.initializeSession(user.id, req, tokens);

      // Log successful login
      console.log(`Successful login from IP ${req.clientIp}:`, {
        userId: user.id,
        email: user.email,
        roles: user.roles.map((ur: any) => ur.role.name),
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles.map((ur: any) => ur.role.name),
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
        tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async register(data: RegisterData, req: Request): Promise<AuthResult> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        role = 'CUSTOMER',
      } = data;

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists',
          code: 'USER_EXISTS',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with role
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          phone,
          roles: {
            create: {
              role: {
                connect: { name: role as any },
              },
            },
          },
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      // Generate tokens
      const deviceInfo = {
        userAgent: req.headers['user-agent'] || 'unknown',
        platform: Array.isArray(req.headers['sec-ch-ua-platform'])
          ? req.headers['sec-ch-ua-platform'][0] || 'unknown'
          : req.headers['sec-ch-ua-platform'] || 'unknown',
        language: Array.isArray(req.headers['accept-language'])
          ? req.headers['accept-language'][0] || 'en'
          : req.headers['accept-language'] || 'en',
      };

      const tokens = await this.tokenService.generateDeviceTokens(
        this.prisma,
        user,
        deviceInfo,
        req.clientIp || 'unknown'
      );

      // Initialize session
      await SessionManagementMiddleware.initializeSession(user.id, req, tokens);

      // Send verification email
      await this.emailService.sendVerificationEmail({
        email: user.email,
        firstName: user.firstName,
        verificationToken: 'temp-token', // This should be generated properly
        verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/temp-token`,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles.map((ur: unknown) => ur.role.name),
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
        tokens,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  async logout(
    userId: string,
    req: Request
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Invalidate refresh tokens
      await this.prisma.refreshToken.deleteMany({
        where: { userId: userId },
      });

      // Clear session - we'll need to get the session ID from the request
      // For now, we'll just invalidate all refresh tokens
      // TODO: Implement proper session termination

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  }
}

export const authService = new AuthService(new PrismaClient());
