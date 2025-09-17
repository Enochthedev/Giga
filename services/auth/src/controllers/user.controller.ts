import { Request, Response } from 'express';

export class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await req.prisma.user.findUnique({
        where: { id },
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
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, role, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (role) {
        where.roles = {
          some: {
            role: {
              name: role,
            },
          },
        };
      }
      if (status) {
        where.isActive = status === 'active';
      }

      const [users, total] = await Promise.all([
        req.prisma.user.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        req.prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: user.activeRole,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
          })),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list users',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'isActive must be a boolean',
          timestamp: new Date().toISOString(),
        });
      }

      const user = await req.prisma.user.update({
        where: { id },
        data: { isActive },
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
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles.map((ur: any) => ur.role.name),
            isActive: user.isActive,
          },
        },
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user status',
        timestamp: new Date().toISOString(),
      });
    }
  }
}