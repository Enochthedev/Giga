import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        roles = ['CUSTOMER'],
        acceptTerms,
      } = req.body;

      // Basic validation
      if (!email || !password || !firstName || !lastName || !acceptTerms) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
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
          timestamp: new Date().toISOString(),
        });
      }

      // Hash password
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
          // Create customer profile by default
          customerProfile: { create: {} },
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
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Store refresh token
      await req.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

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
        timestamp: new Date().toISOString(),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
          timestamp: new Date().toISOString(),
        });
      }

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
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date().toISOString(),
        });
      }

      // Update last login
      await req.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

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
        timestamp: new Date().toISOString(),
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
          timestamp: new Date().toISOString(),
        });
      }

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
          timestamp: new Date().toISOString(),
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(tokenRecord.user);

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
        timestamp: new Date().toISOString(),
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Delete the refresh token
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
          timestamp: new Date().toISOString(),
        });
      }

      const { firstName, lastName, phone, avatar } = req.body;

      const updatedUser = await req.prisma.user.update({
        where: { id: req.user.sub },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone && { phone }),
          ...(avatar && { avatar }),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      res.json({
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
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
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
          timestamp: new Date().toISOString(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required',
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
          timestamp: new Date().toISOString(),
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
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
          timestamp: new Date().toISOString(),
        });
      }

      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required',
          timestamp: new Date().toISOString(),
        });
      }

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
          timestamp: new Date().toISOString(),
        });
      }

      const hasRole = user.roles.some((ur: any) => ur.role.name === role);
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          error: 'You do not have this role',
          timestamp: new Date().toISOString(),
        });
      }

      // Update active role
      await req.prisma.user.update({
        where: { id: req.user.sub },
        data: { activeRole: role as any },
      });

      // Generate new token with updated role
      const { accessToken, refreshToken } = this.generateTokens({
        ...user,
        activeRole: role,
      });

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
        timestamp: new Date().toISOString(),
      });
    }
  }

  private generateTokens(user: any) {
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles.map((ur: any) => ur.role.name),
        activeRole: user.activeRole,
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '15m' }
    );

    const refreshToken = randomBytes(32).toString('hex');

    return { accessToken, refreshToken };
  }
}