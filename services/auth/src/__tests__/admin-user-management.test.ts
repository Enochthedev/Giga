import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserController } from '../controllers/user.controller';

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  role: {
    findUnique: vi.fn(),
  },
  userRole: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  customerProfile: {
    upsert: vi.fn(),
  },
  vendorProfile: {
    upsert: vi.fn(),
  },
  driverProfile: {
    upsert: vi.fn(),
  },
  hostProfile: {
    upsert: vi.fn(),
  },
  advertiserProfile: {
    upsert: vi.fn(),
  },
};

// Mock request and response
const mockRequest = (
  body: any = {},
  params: any = {},
  query: any = {},
  user: any = { sub: 'admin-id' }
) =>
  ({
    body,
    params,
    query,
    user,
    prisma: mockPrisma,
    ip: '127.0.0.1',
  }) as unknown as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe('UserController - Advanced Admin Features', () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController();
    vi.clearAllMocks();
  });

  describe('listUsers with advanced filtering', () => {
    it('should list users with search functionality', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          roles: [{ role: { name: 'CUSTOMER' } }],
          activeRole: 'CUSTOMER',
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: false,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(1);

      const req = mockRequest(
        {},
        {},
        {
          search: 'john',
          emailVerified: 'true',
          sortBy: 'email',
          sortOrder: 'asc',
        }
      );
      const res = mockResponse();

      await userController.listUsers(req, res);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          isEmailVerified: true,
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
            { phone: { contains: 'john', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { email: 'asc' },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          users: expect.arrayContaining([
            expect.objectContaining({
              id: 'user1',
              email: 'john@example.com',
            }),
          ]),
          pagination: expect.objectContaining({
            total: 1,
          }),
          filters: expect.objectContaining({
            search: 'john',
            emailVerified: 'true',
            sortBy: 'email',
            sortOrder: 'asc',
          }),
        }),
        timestamp: expect.any(String),
      });
    });

    it('should filter users by date range', async () => {
      const req = mockRequest(
        {},
        {},
        {
          createdAfter: '2023-01-01',
          createdBefore: '2023-12-31',
          lastLoginAfter: '2023-06-01',
        }
      );
      const res = mockResponse();

      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await userController.listUsers(req, res);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: new Date('2023-01-01'),
            lte: new Date('2023-12-31'),
          },
          lastLoginAt: {
            gte: new Date('2023-06-01'),
          },
        },
        skip: 0,
        take: 10,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('bulkUpdateUsers', () => {
    it('should activate multiple users', async () => {
      const req = mockRequest({
        userIds: ['user1', 'user2', 'user3'],
        action: 'activate',
      });
      const res = mockResponse();

      mockPrisma.user.updateMany.mockResolvedValue({ count: 3 });

      await userController.bulkUpdateUsers(req, res);

      expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['user1', 'user2', 'user3'],
          },
        },
        data: { isActive: true },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          affectedUsers: 3,
          action: 'activated',
        },
        message: 'Successfully activated 3 users',
        timestamp: expect.any(String),
      });
    });

    it('should update custom fields for multiple users', async () => {
      const req = mockRequest({
        userIds: ['user1', 'user2'],
        action: 'update_fields',
        data: {
          isEmailVerified: true,
          isPhoneVerified: false,
        },
      });
      const res = mockResponse();

      mockPrisma.user.updateMany.mockResolvedValue({ count: 2 });

      await userController.bulkUpdateUsers(req, res);

      expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['user1', 'user2'],
          },
        },
        data: {
          isEmailVerified: true,
          isPhoneVerified: false,
        },
      });
    });

    it('should reject bulk update with too many users', async () => {
      const userIds = Array.from({ length: 101 }, (_, i) => `user${i}`);
      const req = mockRequest({
        userIds,
        action: 'activate',
      });
      const res = mockResponse();

      await userController.bulkUpdateUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cannot update more than 100 users at once',
        timestamp: expect.any(String),
      });
    });

    it('should reject invalid bulk action', async () => {
      const req = mockRequest({
        userIds: ['user1'],
        action: 'invalid_action',
      });
      const res = mockResponse();

      await userController.bulkUpdateUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          'Invalid action. Supported actions: activate, deactivate, verify_email, verify_phone, update_fields',
        timestamp: expect.any(String),
      });
    });
  });

  describe('assignUserRole', () => {
    it('should assign a new role to user', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user@example.com',
        roles: [{ role: { name: 'CUSTOMER' } }],
      };

      const mockRole = {
        id: 'role-vendor',
        name: 'VENDOR',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.role.findUnique.mockResolvedValue(mockRole);
      mockPrisma.userRole.create.mockResolvedValue({});
      mockPrisma.vendorProfile.upsert.mockResolvedValue({});

      const req = mockRequest({ role: 'VENDOR' }, { id: 'user1' });
      const res = mockResponse();

      await userController.assignUserRole(req, res);

      expect(mockPrisma.userRole.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          roleId: 'role-vendor',
        },
      });

      expect(mockPrisma.vendorProfile.upsert).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        update: {},
        create: {
          userId: 'user1',
          businessName: 'New Business',
          businessType: 'General',
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Role VENDOR assigned successfully',
        timestamp: expect.any(String),
      });
    });

    it('should reject assigning existing role', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user@example.com',
        roles: [{ role: { name: 'VENDOR' } }],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const req = mockRequest({ role: 'VENDOR' }, { id: 'user1' });
      const res = mockResponse();

      await userController.assignUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User already has this role',
        timestamp: expect.any(String),
      });
    });

    it('should handle non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const req = mockRequest({ role: 'VENDOR' }, { id: 'nonexistent' });
      const res = mockResponse();

      await userController.assignUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('removeUserRole', () => {
    it('should remove a role from user', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user@example.com',
        activeRole: 'CUSTOMER',
        roles: [
          { id: 'ur1', role: { name: 'CUSTOMER' } },
          { id: 'ur2', role: { name: 'VENDOR' } },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.userRole.delete.mockResolvedValue({});

      const req = mockRequest({ role: 'VENDOR' }, { id: 'user1' });
      const res = mockResponse();

      await userController.removeUserRole(req, res);

      expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
        where: { id: 'ur2' },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Role VENDOR removed successfully',
        timestamp: expect.any(String),
      });
    });

    it('should prevent removing CUSTOMER role', async () => {
      const req = mockRequest({ role: 'CUSTOMER' }, { id: 'user1' });
      const res = mockResponse();

      await userController.removeUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cannot remove CUSTOMER role',
        timestamp: expect.any(String),
      });
    });

    it('should switch active role if removing current active role', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user@example.com',
        activeRole: 'VENDOR',
        roles: [
          { id: 'ur1', role: { name: 'CUSTOMER' } },
          { id: 'ur2', role: { name: 'VENDOR' } },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.userRole.delete.mockResolvedValue({});
      mockPrisma.user.update.mockResolvedValue({});

      const req = mockRequest({ role: 'VENDOR' }, { id: 'user1' });
      const res = mockResponse();

      await userController.removeUserRole(req, res);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { activeRole: 'CUSTOMER' },
      });
    });
  });

  describe('exportUsers', () => {
    it('should export users as JSON', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          roles: [{ role: { name: 'CUSTOMER' } }],
          activeRole: 'CUSTOMER',
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: false,
          lastLoginAt: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const req = mockRequest({}, {}, { format: 'json' });
      const res = mockResponse();

      await userController.exportUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          users: expect.arrayContaining([
            expect.objectContaining({
              id: 'user1',
              email: 'user1@example.com',
              roles: 'CUSTOMER',
            }),
          ]),
          exportInfo: expect.objectContaining({
            format: 'json',
            totalCount: 1,
          }),
        },
        timestamp: expect.any(String),
      });
    });

    it('should export users as CSV', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          roles: [{ role: { name: 'CUSTOMER' } }],
          activeRole: 'CUSTOMER',
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: false,
          lastLoginAt: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const req = mockRequest({}, {}, { format: 'csv' });
      const res = mockResponse();

      await userController.exportUsers(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('attachment; filename="users-export-')
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining('id,email,firstName')
      );
    });

    it('should reject invalid export format', async () => {
      const req = mockRequest({}, {}, { format: 'xml' });
      const res = mockResponse();

      await userController.exportUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Format must be json or csv',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getUserActivity', () => {
    it('should get user activity log', async () => {
      const mockUser = {
        email: 'user@example.com',
      };

      const mockUserDetails = {
        id: 'user1',
        email: 'user@example.com',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshTokens: [
          {
            createdAt: new Date(),
            expiresAt: new Date(),
          },
        ],
      };

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUserDetails);

      const req = mockRequest({}, { id: 'user1' });
      const res = mockResponse();

      await userController.getUserActivity(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          user: expect.objectContaining({
            id: 'user1',
            email: 'user@example.com',
          }),
          activity: expect.objectContaining({
            recentTokens: expect.any(Array),
          }),
          note: 'Full activity logging requires audit log implementation',
        },
        timestamp: expect.any(String),
      });
    });

    it('should handle non-existent user for activity', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const req = mockRequest({}, { id: 'nonexistent' });
      const res = mockResponse();

      await userController.getUserActivity(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
        timestamp: expect.any(String),
      });
    });
  });

  describe('audit logging', () => {
    it('should log admin actions', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const mockUser = {
        id: 'user1',
        email: 'user@example.com',
        roles: [{ role: { name: 'CUSTOMER' } }],
        customerProfile: null,
        vendorProfile: null,
        driverProfile: null,
        hostProfile: null,
        advertiserProfile: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const req = mockRequest({}, { id: 'user1' });
      const res = mockResponse();

      await userController.getUserById(req, res);

      expect(consoleSpy).toHaveBeenCalledWith(
        'AUDIT LOG:',
        expect.stringContaining('VIEW_USER')
      );

      consoleSpy.mockRestore();
    });
  });
});
