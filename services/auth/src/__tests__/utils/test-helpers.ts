import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { vi } from 'vitest';
import { PrismaClient, RoleName } from '../../generated/prisma-client';

export class TestDataFactory {
  constructor(private _prisma: PrismaClient) { }

  async createTestUser(overrides: Partial<any> = {}) {
    const defaultUser = {
      email: `test-${Date.now()}@example.com`,
      passwordHash: await bcrypt.hash('TestPassword123!', 12),
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      isEmailVerified: false,
      isPhoneVerified: false,
      isActive: true,
      activeRole: RoleName.CUSTOMER,
      ...overrides,
    };

    const user = await this.prisma.user.create({
      data: defaultUser,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Create default customer role
    await this.createUserRole(user.id, RoleName.CUSTOMER);

    return user;
  }

  async createUserRole(_userId: string, roleName: RoleName) {
    // First ensure the role exists
    let role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: { name: roleName },
      });
    }

    // Create user role relationship
    const userRole = await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    // Create appropriate profile based on role
    await this.createProfileForRole(userId, roleName);

    return userRole;
  }

  createProfileForRole(_userId: string, roleName: RoleName) {
    switch (roleName) {
      case RoleName.CUSTOMER:
        return this.prisma.customerProfile.create({
          data: {
            userId,
            preferences: {},
          },
        });
      case RoleName.VENDOR:
        return this.prisma.vendorProfile.create({
          data: {
            userId,
            businessName: 'Test Business',
            businessType: 'Retail',
            description: 'Test business description',
            subscriptionTier: 'BASIC',
            commissionRate: 0.1,
            isVerified: false,
            totalSales: 0,
          },
        });
      case RoleName.DRIVER:
        return this.prisma.driverProfile.create({
          data: {
            userId,
            licenseNumber: 'TEST123456',
            vehicleInfo: {
              make: 'Toyota',
              model: 'Camry',
              year: 2020,
              color: 'Blue',
            },
            isOnline: false,
            isVerified: false,
            totalRides: 0,
            subscriptionTier: 'BASIC',
          },
        });
      case RoleName.HOST:
        return this.prisma.hostProfile.create({
          data: {
            userId,
            hostType: 'INDIVIDUAL',
            isVerified: false,
            totalBookings: 0,
            subscriptionTier: 'BASIC',
          },
        });
      case RoleName.ADVERTISER:
        return this.prisma.advertiserProfile.create({
          data: {
            userId,
            companyName: 'Test Company',
            industry: 'Technology',
            isVerified: false,
            totalCampaigns: 0,
            subscriptionTier: 'BASIC',
          },
        });
      default:
        return null;
    }
  }

  createRefreshToken(_userId: string, expiresAt?: Date) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
    const expiration = expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: expiration,
      },
    });
  }

  createEmailVerificationToken(_userId: string, expiresAt?: Date) {
    const token = Math.random().toString(36).substring(2, 15);
    const expiration = expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt: expiration,
      },
    });
  }

  createPasswordResetToken(_userId: string, expiresAt?: Date) {
    const token = Math.random().toString(36).substring(2, 15);
    const expiration = expiresAt || new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return this.prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt: expiration,
      },
    });
  }

  generateJWT(user: any, expiresIn: string = '15m') {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((ur: any) => ur.role.name) || [RoleName.CUSTOMER],
      activeRole: user.activeRole || RoleName.CUSTOMER,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
      expiresIn,
    });
  }

  generateExpiredJWT(user: any) {
    return this.generateJWT(user, '-1h'); // Expired 1 hour ago
  }

  async createAdminUser() {
    const adminUser = await this.createTestUser({
      email: `admin-${Date.now()}@example.com`,
      firstName: 'Admin',
      lastName: 'User',
      activeRole: RoleName.ADMIN,
    });

    await this.createUserRole(adminUser.id, RoleName.ADMIN);
    return adminUser;
  }

  async createMultiRoleUser(roles: RoleName[]) {
    const user = await this.createTestUser({
      activeRole: roles[0],
    });

    // Add additional roles
    for (const role of roles.slice(1)) {
      await this.createUserRole(user.id, role);
    }

    return user;
  }

  generateRandomEmail() {
    return `test-${Date.now()}-${Math.random().toString(36).substring(2)}@example.com`;
  }

  generateRandomPhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1${areaCode}${exchange}${number}`;
  }
}

export const mockEmailService = {
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
  sendWelcomeEmail: vi.fn().mockResolvedValue(true),
};

export const mockSMSService = {
  sendVerificationCode: vi.fn().mockResolvedValue(true),
  sendSecurityAlert: vi.fn().mockResolvedValue(true),
};

export function setupTestMocks() {
  // Mock external services
  vi.doMock('../../services/email.service', () => ({
    emailService: mockEmailService,
  }));

  vi.doMock('../../services/sms.service', () => ({
    smsService: mockSMSService,
  }));

  // Mock Redis for rate limiting
  vi.doMock('../../services/redis.service', () => ({
    redisService: {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      keys: vi.fn().mockResolvedValue([]),
    },
  }));
}