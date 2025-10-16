import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaClient } from '../generated/prisma-client';
import { SecurityMonitoringService } from '../services/security-monitoring.service';
import {
  DeviceInfo,
  TokenManagementService,
} from '../services/token-management.service';

// Mock Prisma
const mockPrisma = {
  refreshToken: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  tokenEvent: {
    create: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  securityEvent: {
    create: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  deviceSession: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
} as unknown as PrismaClient;

// Mock Redis Service
vi.mock('../services/redis.service', () => ({
  RedisService: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    set: vi.fn(),
    get: vi.fn().mockResolvedValue(null),
    del: vi.fn(),
    incrementRateLimit: vi.fn().mockResolvedValue(1),
    getCounter: vi.fn().mockResolvedValue(0),
    storeDeviceSession: vi.fn(),
    getDeviceSession: vi.fn().mockResolvedValue(null),
    removeDeviceSession: vi.fn(),
    blacklistToken: vi.fn(),
    isTokenBlacklisted: vi.fn().mockResolvedValue(false),
  })),
}));

// Mock JWT Service
vi.mock('../services/jwt.service', () => ({
  JWTService: {
    getInstance: vi.fn().mockReturnValue({
      generateAccessToken: vi.fn().mockReturnValue('mock-access-token'),
      generateRefreshToken: vi.fn().mockReturnValue('mock-refresh-token'),
      verifyToken: vi.fn(),
      blacklistToken: vi.fn(),
    }),
  },
}));

describe('TokenManagementService', () => {
  let tokenManagementService: TokenManagementService;
  let securityMonitoringService: SecurityMonitoringService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [{ role: { name: 'CUSTOMER' } }],
    activeRole: 'CUSTOMER',
  };

  const mockDeviceInfo: DeviceInfo = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    platform: 'Windows',
    language: 'en-US',
    timezone: 'America/New_York',
    screen: { width: 1920, height: 1080 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tokenManagementService = TokenManagementService.getInstance();
    securityMonitoringService = SecurityMonitoringService.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateDeviceTokens', () => {
    it('should generate device-specific tokens with tracking', () => {
      mockPrisma.refreshToken.create.mockResolvedValue({
        id: 'token-123',
        token: 'mock-refresh-token',
        userId: mockUser.id,
        deviceId: 'device-123',
        sessionId: 'session-123',
      });

      mockPrisma.tokenEvent.create.mockResolvedValue({});

      const tokens = await tokenManagementService.generateDeviceTokens(
        mockPrisma,
        mockUser,
        mockDeviceInfo,
        '192.168.1.1'
      );

      expect(tokens).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 900,
        deviceId: expect.any(String),
        sessionId: expect.any(String),
      });

      expect(mockPrisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          token: 'mock-refresh-token',
          userId: mockUser.id,
          deviceId: expect.any(String),
          sessionId: expect.any(String),
          ipAddress: expect.any(String),
          userAgent: mockDeviceInfo.userAgent,
        }),
      });

      expect(mockPrisma.tokenEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          eventType: 'TOKEN_GENERATED',
          deviceId: expect.any(String),
          sessionId: expect.any(String),
        }),
      });
    });

    it('should create device fingerprint for security tracking', () => {
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      const tokens = await tokenManagementService.generateDeviceTokens(
        mockPrisma,
        mockUser,
        mockDeviceInfo,
        '192.168.1.1'
      );

      expect(tokens.deviceId).toBeDefined();
      expect(tokens.sessionId).toBeDefined();
      expect(typeof tokens.deviceId).toBe('string');
      expect(typeof tokens.sessionId).toBe('string');
    });
  });

  describe('refreshDeviceToken', () => {
    it('should refresh tokens with device verification', () => {
      const mockTokenRecord = {
        id: 'token-123',
        token: 'old-refresh-token',
        userId: mockUser.id,
        deviceId: 'device-123',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        user: mockUser,
      };

      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockTokenRecord);
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      // Mock the generateDeviceTokens method to return expected tokens
      const generateDeviceTokensSpy = vi.spyOn(
        tokenManagementService,
        'generateDeviceTokens' as any
      );
      generateDeviceTokensSpy.mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 900,
        deviceId: 'device-123',
        sessionId: 'session-123',
      });

      const newTokens = await tokenManagementService.refreshDeviceToken(
        mockPrisma,
        'old-refresh-token',
        mockDeviceInfo,
        '192.168.1.1'
      );

      expect(newTokens).toBeDefined();
      expect(newTokens?.accessToken).toBe('mock-access-token');
      expect(newTokens?.refreshToken).toBe('mock-refresh-token');

      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: mockTokenRecord.id },
      });

      generateDeviceTokensSpy.mockRestore();
    });

    it('should return null for expired tokens', () => {
      const expiredTokenRecord = {
        id: 'token-123',
        token: 'expired-refresh-token',
        userId: mockUser.id,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired
        user: mockUser,
      };

      mockPrisma.refreshToken.findUnique.mockResolvedValue(expiredTokenRecord);
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      const result = await tokenManagementService.refreshDeviceToken(
        mockPrisma,
        'expired-refresh-token',
        mockDeviceInfo,
        '192.168.1.1'
      );

      expect(result).toBeNull();
      expect(mockPrisma.tokenEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventType: 'TOKEN_REFRESH_FAILED',
          metadata: expect.objectContaining({
            reason: 'token_expired',
          }),
        }),
      });
    });

    it('should return null for non-existent tokens', () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      const result = await tokenManagementService.refreshDeviceToken(
        mockPrisma,
        'non-existent-token',
        mockDeviceInfo,
        '192.168.1.1'
      );

      expect(result).toBeNull();
      expect(mockPrisma.tokenEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventType: 'TOKEN_REFRESH_FAILED',
          metadata: expect.objectContaining({
            reason: 'token_not_found',
          }),
        }),
      });
    });
  });

  describe('revokeTokens', () => {
    it('should revoke all tokens when allDevices is true', () => {
      const mockRefreshTokens = [
        { id: '1', token: 'token1', deviceId: 'device1' },
        { id: '2', token: 'token2', deviceId: 'device2' },
      ];

      mockPrisma.refreshToken.findMany.mockResolvedValue(mockRefreshTokens);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      await tokenManagementService.revokeTokens(mockPrisma, mockUser.id, {
        allDevices: true,
        reason: 'user_logout_all',
      });

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });

      expect(mockPrisma.tokenEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          eventType: 'ALL_TOKENS_REVOKED',
          metadata: expect.objectContaining({
            reason: 'user_logout_all',
            tokenCount: 2,
          }),
        }),
      });
    });

    it('should revoke tokens for specific device', () => {
      const mockRefreshTokens = [
        { id: '1', token: 'token1', deviceId: 'device1' },
      ];

      mockPrisma.refreshToken.findMany.mockResolvedValue(mockRefreshTokens);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.tokenEvent.create.mockResolvedValue({});

      await tokenManagementService.revokeTokens(mockPrisma, mockUser.id, {
        deviceId: 'device1',
        reason: 'user_revoked_device',
      });

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id, deviceId: 'device1' },
      });

      expect(mockPrisma.tokenEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          eventType: 'DEVICE_TOKENS_REVOKED',
          deviceId: 'device1',
          metadata: expect.objectContaining({
            reason: 'user_revoked_device',
            tokenCount: 1,
          }),
        }),
      });
    });
  });

  describe('getTokenAnalytics', () => {
    it('should return comprehensive token analytics', () => {
      const timeRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      };

      mockPrisma.tokenEvent.count
        .mockResolvedValueOnce(100) // totalEvents
        .mockResolvedValueOnce(50) // tokenGenerations
        .mockResolvedValueOnce(40) // tokenRefreshes
        .mockResolvedValueOnce(5) // suspiciousEvents
        .mockResolvedValueOnce(2); // rateLimitEvents

      mockPrisma.tokenEvent.groupBy.mockResolvedValue([
        { deviceId: 'device1', _count: { id: 25 } },
        { deviceId: 'device2', _count: { id: 15 } },
      ]);

      const analytics = await tokenManagementService.getTokenAnalytics(
        mockPrisma,
        mockUser.id,
        timeRange
      );

      expect(analytics).toEqual({
        totalEvents: 100,
        tokenGenerations: 50,
        tokenRefreshes: 40,
        suspiciousEvents: 5,
        rateLimitEvents: 2,
        deviceBreakdown: [
          { deviceId: 'device1', eventCount: 25 },
          { deviceId: 'device2', eventCount: 15 },
        ],
        timeRange,
      });
    });
  });
});

describe('SecurityMonitoringService', () => {
  let securityMonitoringService: SecurityMonitoringService;

  beforeEach(() => {
    vi.clearAllMocks();
    securityMonitoringService = SecurityMonitoringService.getInstance();
  });

  describe('analyzeLoginAttempt', () => {
    it('should analyze login attempt and return security analysis', () => {
      const loginAttempt = {
        userId: 'user-123',
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
        deviceFingerprint: 'fingerprint-123',
        userAgent: 'Mozilla/5.0',
        success: true,
        timestamp: new Date(),
      };

      mockPrisma.securityEvent.create.mockResolvedValue({});

      const analysis = await securityMonitoringService.analyzeLoginAttempt(
        mockPrisma,
        loginAttempt
      );

      expect(analysis).toEqual({
        riskScore: expect.any(Number),
        riskLevel: expect.any(String),
        riskFactors: expect.any(Array),
        recommendedAction: expect.any(String),
        timestamp: expect.any(Date),
      });

      expect(mockPrisma.securityEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: loginAttempt.userId,
          eventType: 'LOGIN_ANALYSIS',
          riskScore: expect.any(Number),
          riskLevel: expect.any(String),
        }),
      });
    });

    it('should detect high risk scenarios', () => {
      const highRiskAttempt = {
        userId: 'user-123',
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
        deviceFingerprint: 'new-fingerprint',
        userAgent: 'Mozilla/5.0',
        success: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 AM (unusual time)
      };

      mockPrisma.securityEvent.create.mockResolvedValue({});

      const analysis = await securityMonitoringService.analyzeLoginAttempt(
        mockPrisma,
        highRiskAttempt
      );

      expect(analysis.riskScore).toBeGreaterThan(0);
      expect(analysis.riskFactors.length).toBeGreaterThan(0);
    });
  });

  describe('monitorTokenRefresh', () => {
    it('should monitor token refresh patterns', () => {
      const refreshAttempt = {
        userId: 'user-123',
        deviceId: 'device-123',
        ipAddress: '192.168.1.1',
        deviceFingerprint: 'fingerprint-123',
        timestamp: new Date(),
      };

      mockPrisma.securityEvent.create.mockResolvedValue({});

      const analysis = await securityMonitoringService.monitorTokenRefresh(
        mockPrisma,
        refreshAttempt
      );

      expect(analysis).toEqual({
        riskScore: expect.any(Number),
        riskLevel: expect.any(String),
        riskFactors: expect.any(Array),
        recommendedAction: expect.any(String),
        timestamp: expect.any(Date),
      });

      expect(mockPrisma.securityEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: refreshAttempt.userId,
          eventType: 'TOKEN_REFRESH_ANALYSIS',
          deviceId: refreshAttempt.deviceId,
        }),
      });
    });
  });

  describe('getSecurityMetrics', () => {
    it('should return comprehensive security metrics', () => {
      const timeRange = {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      };

      mockPrisma.securityEvent.count
        .mockResolvedValueOnce(200) // totalEvents
        .mockResolvedValueOnce(15) // highRiskEvents
        .mockResolvedValueOnce(5) // blockedAttempts
        .mockResolvedValueOnce(10); // suspiciousActivities

      mockPrisma.securityEvent.groupBy.mockResolvedValue([
        { riskLevel: 'low', _count: { id: 150 } },
        { riskLevel: 'medium', _count: { id: 35 } },
        { riskLevel: 'high', _count: { id: 15 } },
      ]);

      const metrics = await securityMonitoringService.getSecurityMetrics(
        mockPrisma,
        timeRange
      );

      expect(metrics).toEqual({
        totalEvents: 200,
        highRiskEvents: 15,
        blockedAttempts: 5,
        suspiciousActivities: 10,
        topRiskFactors: [],
        riskDistribution: [
          { riskLevel: 'low', count: 150 },
          { riskLevel: 'medium', count: 35 },
          { riskLevel: 'high', count: 15 },
        ],
        timeRange,
      });
    });
  });
});
