import { RoleName } from '@prisma/client';
import { Request, Response } from 'express';

export class UserController {
  private async logAdminAction(
    prisma: any,
    action: string,
    adminUserId: string,
    targetUserId?: string,
    details: Record<string, any> = {},
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      // Store in database audit log
      await prisma.auditLog.create({
        data: {
          action,
          adminUserId,
          targetUserId,
          details,
          ipAddress,
          userAgent,
        },
      });

      // Also log to console for immediate visibility
      console.log(
        'AUDIT LOG:',
        JSON.stringify(
          {
            action,
            adminUserId,
            targetUserId,
            details,
            ipAddress,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

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
          customerProfile: true,
          vendorProfile: true,
          driverProfile: true,
          hostProfile: true,
          advertiserProfile: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'VIEW_USER',
        req.user!.sub,
        id,
        { viewedUserId: id },
        req.ip,
        req.headers['user-agent']
      );

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
            updatedAt: user.updatedAt,
            profiles: {
              customer: user.customerProfile,
              vendor: user.vendorProfile,
              driver: user.driverProfile,
              host: user.hostProfile,
              advertiser: user.advertiserProfile,
            },
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
      const {
        page = 1,
        limit = 10,
        role,
        status,
        search,
        emailVerified,
        phoneVerified,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        createdAfter,
        createdBefore,
        lastLoginAfter,
        lastLoginBefore,
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Math.min(Number(limit), 100); // Max 100 per page

      const where: any = {};

      // Role filtering
      if (role) {
        where.roles = {
          some: {
            role: {
              name: role,
            },
          },
        };
      }

      // Status filtering
      if (status) {
        where.isActive = status === 'active';
      }

      // Email verification filtering
      if (emailVerified !== undefined) {
        where.isEmailVerified = emailVerified === 'true';
      }

      // Phone verification filtering
      if (phoneVerified !== undefined) {
        where.isPhoneVerified = phoneVerified === 'true';
      }

      // Search functionality
      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Date range filtering
      if (createdAfter || createdBefore) {
        where.createdAt = {};
        if (createdAfter) {
          where.createdAt.gte = new Date(createdAfter as string);
        }
        if (createdBefore) {
          where.createdAt.lte = new Date(createdBefore as string);
        }
      }

      if (lastLoginAfter || lastLoginBefore) {
        where.lastLoginAt = {};
        if (lastLoginAfter) {
          where.lastLoginAt.gte = new Date(lastLoginAfter as string);
        }
        if (lastLoginBefore) {
          where.lastLoginAt.lte = new Date(lastLoginBefore as string);
        }
      }

      // Sorting
      const orderBy: any = {};
      const validSortFields = [
        'createdAt',
        'updatedAt',
        'lastLoginAt',
        'email',
        'firstName',
        'lastName',
      ];
      const sortField = validSortFields.includes(sortBy as string)
        ? (sortBy as string)
        : 'createdAt';
      const order = sortOrder === 'asc' ? 'asc' : 'desc';
      orderBy[sortField] = order;

      const [users, total] = await Promise.all([
        req.prisma.user.findMany({
          where,
          skip,
          take,
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
          orderBy,
        }),
        req.prisma.user.count({ where }),
      ]);

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'LIST_USERS',
        req.user!.sub,
        undefined,
        {
          filters: { role, status, search, emailVerified, phoneVerified },
          pagination: { page, limit: take },
          resultCount: users.length,
          totalCount: total,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            roles: user.roles.map((ur: any) => ur.role.name),
            activeRole: user.activeRole,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })),
          pagination: {
            page: Number(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
          filters: {
            role,
            status,
            search,
            emailVerified,
            phoneVerified,
            sortBy: sortField,
            sortOrder: order,
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

      // Get current user state for audit log
      const currentUser = await req.prisma.user.findUnique({
        where: { id },
        select: { isActive: true, email: true },
      });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
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

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'UPDATE_USER_STATUS',
        req.user!.sub,
        id,
        {
          previousStatus: currentUser.isActive,
          newStatus: isActive,
          userEmail: currentUser.email,
        },
        req.ip,
        req.headers['user-agent']
      );

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

  async bulkUpdateUsers(req: Request, res: Response) {
    try {
      const { userIds, action, data } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'userIds must be a non-empty array',
          timestamp: new Date().toISOString(),
        });
      }

      if (userIds.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Cannot update more than 100 users at once',
          timestamp: new Date().toISOString(),
        });
      }

      let updateData: any = {};
      let actionDescription = '';

      switch (action) {
        case 'activate':
          updateData = { isActive: true };
          actionDescription = 'activated';
          break;
        case 'deactivate':
          updateData = { isActive: false };
          actionDescription = 'deactivated';
          break;
        case 'verify_email':
          updateData = { isEmailVerified: true };
          actionDescription = 'email verified';
          break;
        case 'verify_phone':
          updateData = { isPhoneVerified: true };
          actionDescription = 'phone verified';
          break;
        case 'update_fields': {
          if (!data || typeof data !== 'object') {
            return res.status(400).json({
              success: false,
              error: 'data object required for update_fields action',
              timestamp: new Date().toISOString(),
            });
          }
          // Only allow safe fields to be bulk updated
          const allowedFields = [
            'isActive',
            'isEmailVerified',
            'isPhoneVerified',
          ];
          updateData = {};
          for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
              updateData[key] = value;
            }
          }
          actionDescription = 'fields updated';
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            error:
              'Invalid action. Supported actions: activate, deactivate, verify_email, verify_phone, update_fields',
            timestamp: new Date().toISOString(),
          });
      }

      // Perform bulk update
      const result = await req.prisma.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: updateData,
      });

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'BULK_UPDATE_USERS',
        req.user!.sub,
        undefined,
        {
          action,
          userIds,
          updateData,
          affectedCount: result.count,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: {
          affectedUsers: result.count,
          action: actionDescription,
        },
        message: `Successfully ${actionDescription} ${result.count} users`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Bulk update users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk update users',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async assignUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !Object.values(RoleName).includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Valid role is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user exists
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

      // Check if user already has this role
      const hasRole = user.roles.some((ur: any) => ur.role.name === role);
      if (hasRole) {
        return res.status(400).json({
          success: false,
          error: 'User already has this role',
          timestamp: new Date().toISOString(),
        });
      }

      // Get the role record
      const roleRecord = await req.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleRecord) {
        return res.status(400).json({
          success: false,
          error: 'Role not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Assign role to user
      await req.prisma.userRole.create({
        data: {
          userId: id,
          roleId: roleRecord.id,
        },
      });

      // Create appropriate profile if needed
      await this.createRoleProfile(req.prisma, id, role);

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'ASSIGN_USER_ROLE',
        req.user!.sub,
        id,
        {
          assignedRole: role,
          userEmail: user.email,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        message: `Role ${role} assigned successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Assign user role error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to assign user role',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async removeUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !Object.values(RoleName).includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Valid role is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Prevent removing CUSTOMER role as it's the default
      if (role === 'CUSTOMER') {
        return res.status(400).json({
          success: false,
          error: 'Cannot remove CUSTOMER role',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if user exists and has the role
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

      const userRole = user.roles.find((ur: any) => ur.role.name === role);
      if (!userRole) {
        return res.status(400).json({
          success: false,
          error: 'User does not have this role',
          timestamp: new Date().toISOString(),
        });
      }

      // Remove role from user
      await req.prisma.userRole.delete({
        where: {
          id: userRole.id,
        },
      });

      // If this was the active role, switch to CUSTOMER
      if (user.activeRole === role) {
        await req.prisma.user.update({
          where: { id },
          data: { activeRole: 'CUSTOMER' },
        });
      }

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'REMOVE_USER_ROLE',
        req.user!.sub,
        id,
        {
          removedRole: role,
          userEmail: user.email,
          wasActiveRole: user.activeRole === role,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        message: `Role ${role} removed successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Remove user role error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove user role',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async exportUsers(req: Request, res: Response) {
    try {
      const { format = 'json', filters = {} } = req.query;

      if (!['json', 'csv'].includes(format as string)) {
        return res.status(400).json({
          success: false,
          error: 'Format must be json or csv',
          timestamp: new Date().toISOString(),
        });
      }

      // Build where clause from filters
      const where: any = {};
      const parsedFilters =
        typeof filters === 'string' ? JSON.parse(filters) : filters;

      if (parsedFilters.role) {
        where.roles = {
          some: {
            role: {
              name: parsedFilters.role,
            },
          },
        };
      }

      if (parsedFilters.status) {
        where.isActive = parsedFilters.status === 'active';
      }

      if (parsedFilters.emailVerified !== undefined) {
        where.isEmailVerified = parsedFilters.emailVerified;
      }

      if (parsedFilters.phoneVerified !== undefined) {
        where.isPhoneVerified = parsedFilters.phoneVerified;
      }

      // Get users with limit for export (max 10000)
      const users = await req.prisma.user.findMany({
        where,
        take: 10000,
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
      });

      const exportData = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        roles: user.roles.map((ur: any) => ur.role.name).join(', '),
        activeRole: user.activeRole,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'EXPORT_USERS',
        req.user!.sub,
        undefined,
        {
          format,
          filters: parsedFilters,
          exportedCount: exportData.length,
        },
        req.ip,
        req.headers['user-agent']
      );

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
          headers.join(','),
          ...exportData.map(row =>
            headers
              .map(header => {
                const value = row[header as keyof typeof row];
                // Escape commas and quotes in CSV
                if (
                  typeof value === 'string' &&
                  (value.includes(',') || value.includes('"'))
                ) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              })
              .join(',')
          ),
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
        );
        res.send(csvContent);
      } else {
        res.json({
          success: true,
          data: {
            users: exportData,
            exportInfo: {
              format,
              filters: parsedFilters,
              exportedAt: new Date().toISOString(),
              totalCount: exportData.length,
            },
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Export users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export users',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getUserActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20, action } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Math.min(Number(limit), 100);

      // Check if user exists
      const user = await req.prisma.user.findUnique({
        where: { id },
        select: { email: true, firstName: true, lastName: true },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Build where clause for audit logs
      const where: any = {
        targetUserId: id,
      };

      if (action) {
        where.action = { contains: action as string, mode: 'insensitive' };
      }

      // Get audit logs for this user
      const [auditLogs, totalAuditLogs] = await Promise.all([
        req.prisma.auditLog.findMany({
          where,
          skip,
          take,
          include: {
            adminUser: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        req.prisma.auditLog.count({ where }),
      ]);

      // Get user details and recent tokens
      const userDetails = await req.prisma.user.findUnique({
        where: { id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          refreshTokens: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'VIEW_USER_ACTIVITY',
        req.user!.sub,
        id,
        {
          userEmail: user.email,
          activityFilter: action,
          resultCount: auditLogs.length,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: {
          user: {
            id: userDetails?.id,
            email: userDetails?.email,
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
            lastLoginAt: userDetails?.lastLoginAt,
            createdAt: userDetails?.createdAt,
            updatedAt: userDetails?.updatedAt,
          },
          activity: {
            auditLogs: auditLogs.map((log: any) => ({
              id: log.id,
              action: log.action,
              details: log.details,
              performedBy: {
                id: log.adminUser.id,
                email: log.adminUser.email,
                name: `${log.adminUser.firstName} ${log.adminUser.lastName}`,
              },
              ipAddress: log.ipAddress,
              createdAt: log.createdAt,
            })),
            recentTokens:
              userDetails?.refreshTokens.map(token => ({
                createdAt: token.createdAt,
                expiresAt: token.expiresAt,
              })) || [],
          },
          pagination: {
            page: Number(page),
            limit: take,
            total: totalAuditLogs,
            pages: Math.ceil(totalAuditLogs / take),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user activity',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getAuditLogs(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        action,
        adminUserId,
        targetUserId,
        startDate,
        endDate,
        ipAddress,
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Math.min(Number(limit), 100);

      // Build where clause
      const where: any = {};

      if (action) {
        where.action = { contains: action as string, mode: 'insensitive' };
      }

      if (adminUserId) {
        where.adminUserId = adminUserId as string;
      }

      if (targetUserId) {
        where.targetUserId = targetUserId as string;
      }

      if (ipAddress) {
        where.ipAddress = { contains: ipAddress as string };
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate as string);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate as string);
        }
      }

      const [auditLogs, total] = await Promise.all([
        req.prisma.auditLog.findMany({
          where,
          skip,
          take,
          include: {
            adminUser: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            targetUser: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        req.prisma.auditLog.count({ where }),
      ]);

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'VIEW_AUDIT_LOGS',
        req.user!.sub,
        undefined,
        {
          filters: {
            action,
            adminUserId,
            targetUserId,
            startDate,
            endDate,
            ipAddress,
          },
          resultCount: auditLogs.length,
          totalCount: total,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: {
          auditLogs: auditLogs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details,
            adminUser: log.adminUser
              ? {
                  id: log.adminUser.id,
                  email: log.adminUser.email,
                  name: `${log.adminUser.firstName} ${log.adminUser.lastName}`,
                }
              : null,
            targetUser: log.targetUser
              ? {
                  id: log.targetUser.id,
                  email: log.targetUser.email,
                  name: `${log.targetUser.firstName} ${log.targetUser.lastName}`,
                }
              : null,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            createdAt: log.createdAt,
          })),
          pagination: {
            page: Number(page),
            limit: take,
            total,
            pages: Math.ceil(total / take),
          },
          filters: {
            action,
            adminUserId,
            targetUserId,
            startDate,
            endDate,
            ipAddress,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get audit logs',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getAuditReport(req: Request, res: Response) {
    try {
      const {
        startDate,
        endDate,

        format = 'json',
      } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
          timestamp: new Date().toISOString(),
        });
      }

      const where = {
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };

      // Get audit log statistics
      const [totalLogs, actionStats, adminStats, dailyStats] =
        await Promise.all([
          req.prisma.auditLog.count({ where }),
          req.prisma.auditLog.groupBy({
            by: ['action'],
            where,
            _count: { action: true },
            orderBy: { _count: { action: 'desc' } },
          }),
          req.prisma.auditLog.groupBy({
            by: ['adminUserId'],
            where,
            _count: { adminUserId: true },
            orderBy: { _count: { adminUserId: 'desc' } },
          }),
          req.prisma.$queryRaw`
          SELECT DATE(created_at) as date, COUNT(*) as count
          FROM audit_logs
          WHERE created_at >= ${new Date(startDate as string)}
            AND created_at <= ${new Date(endDate as string)}
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `,
        ]);

      // Get admin user details for stats
      const adminUserIds = adminStats.map((stat: any) => stat.adminUserId);
      const adminUsers = await req.prisma.user.findMany({
        where: { id: { in: adminUserIds } },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      const adminStatsWithDetails = adminStats.map((stat: any) => {
        const admin = adminUsers.find(u => u.id === stat.adminUserId);
        return {
          adminId: stat.adminUserId,
          adminEmail: admin?.email || 'Unknown',
          adminName: admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown',
          actionCount: stat._count.adminUserId,
        };
      });

      const reportData = {
        summary: {
          totalLogs,
          dateRange: { startDate, endDate },
          generatedAt: new Date().toISOString(),
          generatedBy: req.user!.sub,
        },
        statistics: {
          actionBreakdown: actionStats.map((stat: any) => ({
            action: stat.action,
            count: stat._count.action,
          })),
          adminActivity: adminStatsWithDetails,
          dailyActivity: dailyStats,
        },
      };

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'GENERATE_AUDIT_REPORT',
        req.user!.sub,
        undefined,
        {
          dateRange: { startDate, endDate },
          format,
          totalLogs,
        },
        req.ip,
        req.headers['user-agent']
      );

      if (format === 'csv') {
        // Generate CSV report
        const csvLines = [
          'Date,Action,Admin Email,Target User,IP Address,Details',
          ...(
            await req.prisma.auditLog.findMany({
              where,
              include: {
                adminUser: { select: { email: true } },
                targetUser: { select: { email: true } },
              },
              orderBy: { createdAt: 'desc' },
            })
          ).map((log: any) =>
            [
              log.createdAt.toISOString(),
              log.action,
              log.adminUser?.email || '',
              log.targetUser?.email || '',
              log.ipAddress || '',
              JSON.stringify(log.details).replace(/"/g, '""'),
            ]
              .map(field => `"${field}"`)
              .join(',')
          ),
        ];

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="audit-report-${startDate}-${endDate}.csv"`
        );
        res.send(csvLines.join('\n'));
      } else {
        res.json({
          success: true,
          data: reportData,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Generate audit report error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate audit report',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate as string);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate as string);
        }
      }

      // Get comprehensive user statistics
      const [
        totalUsers,
        activeUsers,
        verifiedEmailUsers,
        verifiedPhoneUsers,
        roleStats,
        recentRegistrations,
      ] = await Promise.all([
        req.prisma.user.count({ where }),
        req.prisma.user.count({ where: { ...where, isActive: true } }),
        req.prisma.user.count({ where: { ...where, isEmailVerified: true } }),
        req.prisma.user.count({ where: { ...where, isPhoneVerified: true } }),
        req.prisma.userRole.groupBy({
          by: ['roleId'],
          _count: { roleId: true },
        }),
        req.prisma.user.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          select: { createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
      ]);

      // Get role details
      const roles = await req.prisma.role.findMany();
      const roleStatsWithNames = roleStats.map(stat => {
        const role = roles.find(r => r.id === stat.roleId);
        return {
          role: role?.name || 'Unknown',
          count: stat._count.roleId,
        };
      });

      // Group recent registrations by day
      const registrationsByDay = recentRegistrations.reduce(
        (acc: any, user) => {
          const date = user.createdAt.toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        },
        {}
      );

      // Log admin action
      await this.logAdminAction(
        req.prisma,
        'VIEW_USER_STATS',
        req.user!.sub,
        undefined,
        {
          dateRange: { startDate, endDate },
          totalUsers,
          activeUsers,
        },
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: {
          summary: {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            verifiedEmailUsers,
            verifiedPhoneUsers,
            verificationRates: {
              email:
                totalUsers > 0
                  ? ((verifiedEmailUsers / totalUsers) * 100).toFixed(2)
                  : 0,
              phone:
                totalUsers > 0
                  ? ((verifiedPhoneUsers / totalUsers) * 100).toFixed(2)
                  : 0,
            },
          },
          roleDistribution: roleStatsWithNames,
          registrationTrends: {
            last30Days: Object.entries(registrationsByDay)
              .map(([date, count]) => ({
                date,
                registrations: count,
              }))
              .sort((a, b) => a.date.localeCompare(b.date)),
          },
          generatedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user statistics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async createRoleProfile(prisma: any, userId: string, role: RoleName) {
    try {
      switch (role) {
        case 'VENDOR':
          await prisma.vendorProfile.upsert({
            where: { userId },
            update: {},
            create: {
              userId,
              businessName: 'New Business',
              businessType: 'General',
            },
          });
          break;
        case 'DRIVER':
          await prisma.driverProfile.upsert({
            where: { userId },
            update: {},
            create: {
              userId,
              licenseNumber: `TEMP-${Date.now()}`,
              vehicleInfo: {},
            },
          });
          break;
        case 'HOST':
          await prisma.hostProfile.upsert({
            where: { userId },
            update: {},
            create: {
              userId,
            },
          });
          break;
        case 'ADVERTISER':
          await prisma.advertiserProfile.upsert({
            where: { userId },
            update: {},
            create: {
              userId,
              companyName: 'New Company',
              industry: 'General',
            },
          });
          break;
        case 'CUSTOMER':
          await prisma.customerProfile.upsert({
            where: { userId },
            update: {},
            create: {
              userId,
            },
          });
          break;
      }
    } catch (error) {
      console.error('Error creating role profile:', error);
      // Don't throw error, just log it
    }
  }
}
