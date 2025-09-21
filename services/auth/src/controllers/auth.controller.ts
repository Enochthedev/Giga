import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';
import { JWTService } from '../services/jwt.service';
import { ProfileService } from '../services/profile.service';
import { SMSService } from '../services/sms.service';
import { PasswordValidator } from '../utils/security.utils';

export class AuthController {
  private jwtService = JWTService.getInstance();
  private emailService = EmailService.getInstance();
  private smsService = SMSService.getInstance();
  private profileService = ProfileService.getInstance();

  async register(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        roles = ['CUSTOMER'],

      } = req.body;

      // Enhanced password validation
      const passwordValidation = PasswordValidator.validate(password);
      if (!passwordValidation.isValid) {
        // Log security event for monitoring
        console.warn(`Weak password attempt from IP ${req.clientIp}:`, {
          email: email,
          errors: passwordValidation.errors,
          strengthScore: PasswordValidator.getStrengthScore(password),
          timestamp: new Date().toISOString()
        });

        return res.status(400).json({
          success: false,
          error: 'Password does not meet security requirements',
          code: 'WEAK_PASSWORD',
          details: {
            errors: passwordValidation.errors,
            strengthScore: PasswordValidator.getStrengthScore(password),
            requirements: [
              'At least 8 characters long',
              'Contains uppercase and lowercase letters',
              'Contains at least one number',
              'Contains at least one special character',
              'Does not contain common patterns or personal information'
            ]
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user already exists
      const existingUser = await req.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: 'An account with this email address already exists',
          code: 'USER_EXISTS',
          timestamp: new Date().toISOString(),
        });
      }

      // Hash password with enhanced security
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user with roles
      const user = await req.prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          phone,
          activeRole: roles[0] as any,
          roles: {
            create: roles.map((roleName: string) => ({
              role: {
                connectOrCreate: {
                  where: { name: roleName as any },
                  create: { name: roleName as any },
                },
              },
            })),
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

      // Create all necessary profiles for the user's roles
      await this.profileService.createProfilesForRoles(
        req.prisma,
        user.id,
        roles as any[]
      );

      // Generate tokens using enhanced JWT service
      const accessToken = this.jwtService.generateAccessToken(user);
      const refreshToken = this.jwtService.generateRefreshToken();

      // Store refresh token
      await req.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Send email verification automatically
      try {
        const verificationToken = this.emailService.generateVerificationToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await req.prisma.emailVerificationToken.create({
          data: {
            token: verificationToken,
            userId: user.id,
            expiresAt,
          },
        });

        const verificationUrl = this.emailService.createVerificationUrl(verificationToken);
        await this.emailService.sendVerificationEmail({
          email: user.email,
          firstName: user.firstName,
          verificationToken,
          verificationUrl,
        });
      } catch (emailError) {
        console.error('Failed to send verification email during registration:', emailError);
        // Don't fail registration if email sending fails
      }

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: user.activeRole,
            avatar: user.avatar,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await req.prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user || !user.isActive) {
        // Log failed login attempt for security monitoring
        console.warn(`Failed login attempt from IP ${req.clientIp}:`, {
          email: email,
          reason: !user ? 'user_not_found' : 'user_inactive',
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });

        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        // Log failed password attempt for security monitoring
        console.warn(`Invalid password attempt from IP ${req.clientIp}:`, {
          userId: user.id,
          email: email,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });

        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
        });
      }

      // Update last login
      await req.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Log successful login for security monitoring
      console.log(`Successful login from IP ${req.clientIp}:`, {
        userId: user.id,
        email: user.email,
        roles: user.roles.map((ur: any) => ur.role.name),
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });

      // Generate tokens using enhanced JWT service
      const accessToken = this.jwtService.generateAccessToken(user);
      const refreshToken = this.jwtService.generateRefreshToken();

      // Store refresh token
      await req.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: user.activeRole,
            avatar: user.avatar,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
        code: 'LOGIN_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      // Find and validate refresh token
      const tokenRecord = await req.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user is still active
      if (!tokenRecord.user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User account is inactive',
          code: 'INACTIVE_USER',
          timestamp: new Date().toISOString(),
        });
      }

      // Generate new tokens using enhanced JWT service
      const accessToken = this.jwtService.generateAccessToken(tokenRecord.user);
      const newRefreshToken = this.jwtService.generateRefreshToken();

      // Delete old refresh token and create new one
      await req.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });

      await req.prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: tokenRecord.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.json({
        success: true,
        data: {
          tokens: {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: 900, // 15 minutes
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Token refresh failed',
        code: 'REFRESH_TOKEN_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];

      // Blacklist the access token if provided
      if (accessToken) {
        this.jwtService.blacklistToken(accessToken);
      }

      // Delete the refresh token if provided
      if (refreshToken) {
        await req.prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        code: 'LOGOUT_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: user.activeRole,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            lastLoginAt: user.lastLoginAt,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
        code: 'GET_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { firstName, lastName, phone, avatar } = req.body;

      // Get current user to check if phone number is changing
      const currentUser = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
      });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if phone number is changing
      const isPhoneChanging = phone && phone !== currentUser.phone;

      // Validate new phone number format if provided
      if (phone) {
        const phoneValidation = this.smsService.validatePhoneNumber(phone);
        if (!phoneValidation.isValid) {
          return res.status(400).json({
            success: false,
            error: 'Invalid phone number format',
            message: phoneValidation.error,
            code: 'INVALID_PHONE_FORMAT',
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Format phone number for consistent storage
      const formattedPhone = phone ? this.smsService.formatPhoneNumber(phone) : undefined;

      const updateData: any = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(formattedPhone && { phone: formattedPhone }),
        ...(avatar && { avatar }),
      };

      // Reset phone verification if phone number is changing
      if (isPhoneChanging) {
        updateData.isPhoneVerified = false;

        // Clean up any existing phone verification codes
        await req.prisma.phoneVerificationCode.deleteMany({
          where: { userId: req.user.sub },
        });

        // Log security event
        console.log('Phone number changed, verification reset:', {
          userId: req.user.sub,
          oldPhone: currentUser.phone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
          newPhone: formattedPhone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
          timestamp: new Date().toISOString(),
        });
      }

      const updatedUser = await req.prisma.user.update({
        where: { id: req.user.sub },
        data: updateData,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      const responseData: any = {
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            roles: updatedUser.roles.map((ur: any) => ur.role.name),
            activeRole: updatedUser.activeRole,
            avatar: updatedUser.avatar,
            isEmailVerified: updatedUser.isEmailVerified,
            isPhoneVerified: updatedUser.isPhoneVerified,
          },
        },
        timestamp: new Date().toISOString(),
      };

      // Add warning if phone verification was reset
      if (isPhoneChanging) {
        responseData.message = 'Profile updated successfully. Phone verification has been reset due to phone number change.';
        responseData.data.phoneVerificationReset = true;
      }

      res.json(responseData);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Enhanced password validation for new password
      const passwordValidation = PasswordValidator.validate(newPassword);
      if (!passwordValidation.isValid) {
        // Log security event for monitoring
        console.warn(`Weak password change attempt from user ${req.user.sub}:`, {
          userId: req.user.sub,
          errors: passwordValidation.errors,
          strengthScore: PasswordValidator.getStrengthScore(newPassword),
          timestamp: new Date().toISOString()
        });

        return res.status(400).json({
          success: false,
          error: 'New password does not meet security requirements',
          code: 'WEAK_PASSWORD',
          details: {
            errors: passwordValidation.errors,
            strengthScore: PasswordValidator.getStrengthScore(newPassword),
            requirements: [
              'At least 8 characters long',
              'Contains uppercase and lowercase letters',
              'Contains at least one number',
              'Contains at least one special character',
              'Does not contain common patterns or personal information',
              'Must be different from current password'
            ]
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Get user with current password
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD',
          timestamp: new Date().toISOString(),
        });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password and invalidate all refresh tokens
      await req.prisma.user.update({
        where: { id: req.user.sub },
        data: { passwordHash: newPasswordHash },
      });

      await req.prisma.refreshToken.deleteMany({
        where: { userId: req.user.sub },
      });

      // Blacklist current access token
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];
      if (accessToken) {
        this.jwtService.blacklistToken(accessToken);
      }

      res.json({
        success: true,
        message: 'Password changed successfully. Please log in again.',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password',
        code: 'CHANGE_PASSWORD_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async switchRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { role } = req.body;

      // Check if user has this role
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      const hasRole = user.roles.some((ur: any) => ur.role.name === role);
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          error: 'You do not have this role',
          code: 'ROLE_NOT_ASSIGNED',
          timestamp: new Date().toISOString(),
        });
      }

      // Update active role
      await req.prisma.user.update({
        where: { id: req.user.sub },
        data: { activeRole: role as any },
      });

      // Generate new token with updated role using enhanced JWT service
      const accessToken = this.jwtService.generateAccessToken({
        ...user,
        activeRole: role,
      });
      const refreshToken = this.jwtService.generateRefreshToken();

      // Store new refresh token
      await req.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: role,
            avatar: user.avatar,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 900,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Switch role error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to switch role',
        code: 'SWITCH_ROLE_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async sendEmailVerification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Get user details
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified',
          code: 'EMAIL_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check for existing unexpired token
      const existingToken = await req.prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingToken) {
        return res.status(429).json({
          success: false,
          error: 'Verification email already sent',
          message: 'Please check your email or wait before requesting another verification email',
          code: 'VERIFICATION_EMAIL_ALREADY_SENT',
          retryAfter: Math.ceil((existingToken.expiresAt.getTime() - Date.now()) / 1000),
          timestamp: new Date().toISOString(),
        });
      }

      // Generate verification token
      const verificationToken = this.emailService.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await req.prisma.emailVerificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send verification email
      const verificationUrl = this.emailService.createVerificationUrl(verificationToken);
      await this.emailService.sendVerificationEmail({
        email: user.email,
        firstName: user.firstName,
        verificationToken,
        verificationUrl,
      });

      res.json({
        success: true,
        message: 'Verification email sent successfully',
        data: {
          email: user.email,
          expiresAt: expiresAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Send email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email',
        code: 'SEND_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required',
          code: 'TOKEN_REQUIRED',
          timestamp: new Date().toISOString(),
        });
      }

      // Find and validate token
      const tokenRecord = await req.prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!tokenRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid verification token',
          code: 'INVALID_TOKEN',
          timestamp: new Date().toISOString(),
        });
      }

      if (tokenRecord.expiresAt < new Date()) {
        // Clean up expired token
        await req.prisma.emailVerificationToken.delete({
          where: { id: tokenRecord.id },
        });

        return res.status(400).json({
          success: false,
          error: 'Verification token has expired',
          message: 'Please request a new verification email',
          code: 'TOKEN_EXPIRED',
          timestamp: new Date().toISOString(),
        });
      }

      if (tokenRecord.user.isEmailVerified) {
        // Clean up token for already verified user
        await req.prisma.emailVerificationToken.delete({
          where: { id: tokenRecord.id },
        });

        return res.status(400).json({
          success: false,
          error: 'Email is already verified',
          code: 'EMAIL_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Update user verification status and clean up token
      await req.prisma.$transaction([
        req.prisma.user.update({
          where: { id: tokenRecord.userId },
          data: { isEmailVerified: true },
        }),
        req.prisma.emailVerificationToken.delete({
          where: { id: tokenRecord.id },
        }),
      ]);

      // Send welcome email
      await this.emailService.sendWelcomeEmail(
        tokenRecord.user.email,
        tokenRecord.user.firstName
      );

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: {
          email: tokenRecord.user.email,
          isEmailVerified: true,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed',
        code: 'VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async resendEmailVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
          code: 'EMAIL_REQUIRED',
          timestamp: new Date().toISOString(),
        });
      }

      // Find user by email
      const user = await req.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists for security
        return res.json({
          success: true,
          message: 'If the email exists in our system, a verification email has been sent',
          timestamp: new Date().toISOString(),
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified',
          code: 'EMAIL_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check for existing unexpired token
      const existingToken = await req.prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingToken) {
        return res.status(429).json({
          success: false,
          error: 'Verification email already sent recently',
          message: 'Please check your email or wait before requesting another verification email',
          code: 'VERIFICATION_EMAIL_RATE_LIMITED',
          retryAfter: Math.ceil((existingToken.expiresAt.getTime() - Date.now()) / 1000),
          timestamp: new Date().toISOString(),
        });
      }

      // Clean up any expired tokens for this user
      await req.prisma.emailVerificationToken.deleteMany({
        where: {
          userId: user.id,
          expiresAt: { lt: new Date() },
        },
      });

      // Generate new verification token
      const verificationToken = this.emailService.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store verification token
      await req.prisma.emailVerificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt,
        },
      });

      // Send verification email
      const verificationUrl = this.emailService.createVerificationUrl(verificationToken);
      await this.emailService.sendVerificationEmail({
        email: user.email,
        firstName: user.firstName,
        verificationToken,
        verificationUrl,
      });

      res.json({
        success: true,
        message: 'Verification email sent successfully',
        data: {
          email: user.email,
          expiresAt: expiresAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Resend email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email',
        code: 'RESEND_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async sendPhoneVerification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      // Get user details
      const user = await req.prisma.user.findUnique({
        where: { id: req.user.sub },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        });
      }

      if (!user.phone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number not set',
          message: 'Please add a phone number to your profile before requesting verification',
          code: 'PHONE_NUMBER_NOT_SET',
          details: {
            updateProfileEndpoint: '/api/v1/auth/profile',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          error: 'Phone is already verified',
          code: 'PHONE_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate phone number format
      const phoneValidation = this.smsService.validatePhoneNumber(user.phone);
      if (!phoneValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid phone number format',
          message: phoneValidation.error,
          code: 'INVALID_PHONE_FORMAT',
          timestamp: new Date().toISOString(),
        });
      }

      // Check for existing unexpired code
      const existingCode = await req.prisma.phoneVerificationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingCode) {
        const retryAfter = Math.ceil((existingCode.expiresAt.getTime() - Date.now()) / 1000);
        return res.status(429).json({
          success: false,
          error: 'Verification code already sent',
          message: 'Please wait before requesting another verification code',
          code: 'VERIFICATION_CODE_ALREADY_SENT',
          retryAfter,
          timestamp: new Date().toISOString(),
        });
      }

      // Clean up any expired codes for this user
      await req.prisma.phoneVerificationCode.deleteMany({
        where: {
          userId: user.id,
          expiresAt: { lt: new Date() },
        },
      });

      // Generate verification code
      const verificationCode = this.smsService.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code
      await req.prisma.phoneVerificationCode.create({
        data: {
          code: verificationCode,
          userId: user.id,
          expiresAt,
        },
      });

      // Send verification SMS
      await this.smsService.sendVerificationSMS({
        phone: user.phone,
        firstName: user.firstName,
        verificationCode,
      });

      // Log security event
      console.log('Phone verification code sent:', {
        userId: user.id,
        phone: user.phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'), // Mask phone number
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Verification code sent successfully',
        data: {
          phone: user.phone.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'), // Mask phone number in response
          expiresAt: expiresAt.toISOString(),
          codeLength: 6,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Send phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send verification code',
        code: 'SEND_PHONE_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async verifyPhone(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        });
      }

      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Verification code is required',
          code: 'CODE_REQUIRED',
          timestamp: new Date().toISOString(),
        });
      }

      // Find and validate code
      const codeRecord = await req.prisma.phoneVerificationCode.findFirst({
        where: {
          userId: req.user.sub,
          code,
        },
        include: { user: true },
      });

      if (!codeRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid verification code',
          code: 'INVALID_CODE',
          timestamp: new Date().toISOString(),
        });
      }

      if (codeRecord.expiresAt < new Date()) {
        // Clean up expired code
        await req.prisma.phoneVerificationCode.delete({
          where: { id: codeRecord.id },
        });

        return res.status(400).json({
          success: false,
          error: 'Verification code has expired',
          message: 'Please request a new verification code',
          code: 'CODE_EXPIRED',
          timestamp: new Date().toISOString(),
        });
      }

      if (codeRecord.user.isPhoneVerified) {
        // Clean up code for already verified user
        await req.prisma.phoneVerificationCode.delete({
          where: { id: codeRecord.id },
        });

        return res.status(400).json({
          success: false,
          error: 'Phone is already verified',
          code: 'PHONE_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Update user verification status and clean up code
      await req.prisma.$transaction([
        req.prisma.user.update({
          where: { id: codeRecord.userId },
          data: { isPhoneVerified: true },
        }),
        req.prisma.phoneVerificationCode.delete({
          where: { id: codeRecord.id },
        }),
      ]);

      // Clean up any other verification codes for this user
      await req.prisma.phoneVerificationCode.deleteMany({
        where: { userId: codeRecord.userId },
      });

      // Log security event
      console.log('Phone verification successful:', {
        userId: codeRecord.userId,
        phone: codeRecord.user.phone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        timestamp: new Date().toISOString(),
      });

      // Send security alert SMS
      if (codeRecord.user.phone) {
        await this.smsService.sendSecurityAlert(
          codeRecord.user.phone,
          `Hello ${codeRecord.user.firstName}! Your phone number has been successfully verified. If this wasn't you, please contact support immediately.`
        );
      }

      res.json({
        success: true,
        message: 'Phone verified successfully',
        data: {
          phone: codeRecord.user.phone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
          isPhoneVerified: true,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Phone verification failed',
        code: 'PHONE_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async resendPhoneVerification(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is required',
          code: 'PHONE_REQUIRED',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate phone number format
      const phoneValidation = this.smsService.validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid phone number format',
          message: phoneValidation.error,
          code: 'INVALID_PHONE_FORMAT',
          timestamp: new Date().toISOString(),
        });
      }

      // Format phone number for consistent lookup
      const formattedPhone = this.smsService.formatPhoneNumber(phone);

      // Find user by phone
      const user = await req.prisma.user.findUnique({
        where: { phone: formattedPhone },
      });

      if (!user) {
        // Don't reveal if phone exists for security
        return res.json({
          success: true,
          message: 'If the phone number exists in our system, a verification code has been sent',
          timestamp: new Date().toISOString(),
        });
      }

      if (user.isPhoneVerified) {
        return res.status(400).json({
          success: false,
          error: 'Phone is already verified',
          code: 'PHONE_ALREADY_VERIFIED',
          timestamp: new Date().toISOString(),
        });
      }

      // Check for existing unexpired code
      const existingCode = await req.prisma.phoneVerificationCode.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingCode) {
        const retryAfter = Math.ceil((existingCode.expiresAt.getTime() - Date.now()) / 1000);
        return res.status(429).json({
          success: false,
          error: 'Verification code already sent recently',
          message: 'Please wait before requesting another verification code',
          code: 'VERIFICATION_CODE_RATE_LIMITED',
          retryAfter,
          timestamp: new Date().toISOString(),
        });
      }

      // Clean up any expired codes for this user
      await req.prisma.phoneVerificationCode.deleteMany({
        where: {
          userId: user.id,
          expiresAt: { lt: new Date() },
        },
      });

      // Generate new verification code
      const verificationCode = this.smsService.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code
      await req.prisma.phoneVerificationCode.create({
        data: {
          code: verificationCode,
          userId: user.id,
          expiresAt,
        },
      });

      // Send verification SMS
      await this.smsService.sendVerificationSMS({
        phone: user.phone!,
        firstName: user.firstName,
        verificationCode,
      });

      // Log security event
      console.log('Phone verification code resent:', {
        userId: user.id,
        phone: user.phone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Verification code sent successfully',
        data: {
          phone: user.phone?.replace(/(\+\d{1,3})\d+(\d{4})/, '$1****$2'),
          expiresAt: expiresAt.toISOString(),
          codeLength: 6,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Resend phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification code',
        code: 'RESEND_PHONE_VERIFICATION_ERROR',
        timestamp: new Date().toISOString(),
      });
    }
  }
}