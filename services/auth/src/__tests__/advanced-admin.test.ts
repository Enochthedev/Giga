import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../app';

const prisma = new PrismaClient();

describe('Advanced Admin User Management', () => {
  let adminToken: string;
  let adminUserId: string;
  let testUserId: string;

  beforeAll(async () => {
    // Clean up existing test data
    await prisma.auditLog.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});

    // Create roles
    const roles = await Promise.all([
      prisma.role.create({ data: { name: 'ADMIN' } }),
      prisma.role.create({ data: { name: 'CUSTOMER' } }),
      prisma.role.create({ data: { name: 'VENDOR' } }),
    ]);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        passwordHash: 'hashedpassword',
        firstName: 'Admin',
        lastName: 'User',
        activeRole: 'ADMIN',
        roles: {
          create: [
            { roleId: roles[0].id }, // ADMIN
            { roleId: roles[1].id }, // CUSTOMER
          ],
        },
      },
    });

    adminUserId = adminUser.id;

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@test.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        activeRole: 'CUSTOMER',
        roles: {
          create: [{ roleId: roles[1].id }], // CUSTOMER
        },
      },
    });

    testUserId = testUser.id;

    // Generate admin token
    adminToken = jwt.sign(
      { sub: adminUserId, email: 'admin@test.com', roles: ['ADMIN', 'CUSTOMER'], activeRole: 'ADMIN' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.$disconnect();
  });

  describe('Bulk User Operations', () => {
    it('should bulk activate users', async () => {
      // First deactivate the test user
      await prisma.user.update({
        where: { id: testUserId },
        data: { isActive: false }
      });

      const response = await request(app)
        .post('/api/v1/users/bulk-update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds: [testUserId],
          action: 'activate'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.affectedUsers).toBe(1);

      // Verify user is activated
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(user?.isActive).toBe(true);

      // Verify audit log was created
      const auditLog = await prisma.auditLog.findFirst({
        where: { action: 'BULK_UPDATE_USERS', adminUserId }
      });
      expect(auditLog).toBeTruthy();
    });

    it('should bulk verify emails', async () => {
      const response = await request(app)
        .post('/api/v1/users/bulk-update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds: [testUserId],
          action: 'verify_email'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify user email is verified
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(user?.isEmailVerified).toBe(true);
    });

    it('should bulk update custom fields', async () => {
      const response = await request(app)
        .post('/api/v1/users/bulk-update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds: [testUserId],
          action: 'update_fields',
          data: {
            isPhoneVerified: true,
            isActive: true
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify fields were updated
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(user?.isPhoneVerified).toBe(true);
      expect(user?.isActive).toBe(true);
    });

    it('should reject bulk update with too many users', async () => {
      const userIds = Array.from({ length: 101 }, (_, i) => `user-${i}`);

      const response = await request(app)
        .post('/api/v1/users/bulk-update')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds,
          action: 'activate'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Cannot update more than 100 users');
    });
  });

  describe('Advanced User Filtering and Search', () => {
    beforeEach(async () => {
      // Create additional test users with different properties
      await prisma.user.createMany({
        data: [
          {
            email: 'john.doe@example.com',
            passwordHash: 'hash',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            isEmailVerified: true,
            isPhoneVerified: false,
            activeRole: 'CUSTOMER'
          },
          {
            email: 'jane.smith@example.com',
            passwordHash: 'hash',
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+0987654321',
            isEmailVerified: false,
            isPhoneVerified: true,
            isActive: false,
            activeRole: 'CUSTOMER'
          }
        ]
      });
    });

    afterEach(async () => {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['john.doe@example.com', 'jane.smith@example.com']
          }
        }
      });
    });

    it('should search users by name', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'John' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.some((u: any) => u.firstName === 'John')).toBe(true);
    });

    it('should search users by email', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'jane.smith' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.some((u: any) => u.email.includes('jane.smith'))).toBe(true);
    });

    it('should filter by email verification status', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ emailVerified: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every((u: any) => u.isEmailVerified === true)).toBe(true);
    });

    it('should filter by phone verification status', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ phoneVerified: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every((u: any) => u.isPhoneVerified === true)).toBe(true);
    });

    it('should filter by user status', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ status: 'inactive' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every((u: any) => u.isActive === false)).toBe(true);
    });

    it('should sort users by different fields', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ sortBy: 'email', sortOrder: 'asc' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const emails = response.body.data.users.map((u: any) => u.email);
      const sortedEmails = [...emails].sort();
      expect(emails).toEqual(sortedEmails);
    });

    it('should filter by date range', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          createdAfter: yesterday,
          createdBefore: tomorrow
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });
  });

  describe('Role Assignment and Management', () => {
    it('should assign role to user', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'VENDOR' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify role was assigned
      const userRoles = await prisma.userRole.findMany({
        where: { userId: testUserId },
        include: { role: true }
      });
      expect(userRoles.some(ur => ur.role.name === 'VENDOR')).toBe(true);

      // Verify audit log
      const auditLog = await prisma.auditLog.findFirst({
        where: { action: 'ASSIGN_USER_ROLE', targetUserId: testUserId }
      });
      expect(auditLog).toBeTruthy();
    });

    it('should remove role from user', async () => {
      // First assign a role
      const vendorRole = await prisma.role.findUnique({ where: { name: 'VENDOR' } });
      await prisma.userRole.create({
        data: { userId: testUserId, roleId: vendorRole!.id }
      });

      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'VENDOR' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify role was removed
      const userRoles = await prisma.userRole.findMany({
        where: { userId: testUserId },
        include: { role: true }
      });
      expect(userRoles.some(ur => ur.role.name === 'VENDOR')).toBe(false);
    });

    it('should not allow removing CUSTOMER role', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'CUSTOMER' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Cannot remove CUSTOMER role');
    });

    it('should not assign duplicate roles', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'CUSTOMER' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('User already has this role');
    });
  });

  describe('User Activity Logging and Audit Trails', () => {
    beforeEach(async () => {
      // Create some audit log entries
      await prisma.auditLog.createMany({
        data: [
          {
            action: 'VIEW_USER',
            adminUserId,
            targetUserId: testUserId,
            details: { viewedUserId: testUserId },
            ipAddress: '127.0.0.1'
          },
          {
            action: 'UPDATE_USER_STATUS',
            adminUserId,
            targetUserId: testUserId,
            details: { previousStatus: false, newStatus: true },
            ipAddress: '127.0.0.1'
          }
        ]
      });
    });

    it('should get user activity logs', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${testUserId}/activity`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activity.auditLogs).toBeDefined();
      expect(response.body.data.activity.auditLogs.length).toBeGreaterThan(0);
    });

    it('should filter user activity by action', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${testUserId}/activity`)
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ action: 'VIEW_USER' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activity.auditLogs.every((log: any) =>
        log.action.includes('VIEW_USER')
      )).toBe(true);
    });

    it('should get system audit logs', async () => {
      const response = await request(app)
        .get('/api/v1/users/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.auditLogs).toBeDefined();
      expect(Array.isArray(response.body.data.auditLogs)).toBe(true);
    });

    it('should filter audit logs by admin user', async () => {
      const response = await request(app)
        .get('/api/v1/users/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ adminUserId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.auditLogs.every((log: any) =>
        log.adminUser.id === adminUserId
      )).toBe(true);
    });

    it('should filter audit logs by date range', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get('/api/v1/users/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          startDate: yesterday,
          endDate: tomorrow
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.auditLogs.length).toBeGreaterThan(0);
    });
  });

  describe('Data Export and Reporting', () => {
    it('should export users as JSON', async () => {
      const response = await request(app)
        .get('/api/v1/users/export')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ format: 'json' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.exportInfo).toBeDefined();
    });

    it('should export users as CSV', async () => {
      const response = await request(app)
        .get('/api/v1/users/export')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ format: 'csv' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(typeof response.text).toBe('string');
      expect(response.text).toContain('id,email,firstName');
    });

    it('should export users with filters', async () => {
      const filters = JSON.stringify({ status: 'active' });

      const response = await request(app)
        .get('/api/v1/users/export')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          format: 'json',
          filters
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every((u: any) => u.isActive === true)).toBe(true);
    });

    it('should generate audit report as JSON', async () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const response = await request(app)
        .get('/api/v1/users/audit-report')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          startDate,
          endDate,
          format: 'json'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.statistics).toBeDefined();
      expect(response.body.data.statistics.actionBreakdown).toBeDefined();
      expect(response.body.data.statistics.adminActivity).toBeDefined();
    });

    it('should generate audit report as CSV', async () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const response = await request(app)
        .get('/api/v1/users/audit-report')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          startDate,
          endDate,
          format: 'csv'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('audit-report');
    });

    it('should get user statistics', async () => {
      const response = await request(app)
        .get('/api/v1/users/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.summary.totalUsers).toBeDefined();
      expect(response.body.data.summary.activeUsers).toBeDefined();
      expect(response.body.data.roleDistribution).toBeDefined();
      expect(response.body.data.registrationTrends).toBeDefined();
    });

    it('should require date range for audit report', async () => {
      const response = await request(app)
        .get('/api/v1/users/audit-report')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('startDate and endDate are required');
    });
  });

  describe('Authorization and Security', () => {
    let customerToken: string;

    beforeAll(() => {
      // Create customer token
      customerToken = jwt.sign(
        { sub: testUserId, email: 'test@test.com', roles: ['CUSTOMER'], activeRole: 'CUSTOMER' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    it('should deny access to non-admin users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should deny access without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should log all admin actions', async () => {
      const initialLogCount = await prisma.auditLog.count();

      await request(app)
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const finalLogCount = await prisma.auditLog.count();
      expect(finalLogCount).toBe(initialLogCount + 1);

      const latestLog = await prisma.auditLog.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      expect(latestLog?.action).toBe('VIEW_USER');
      expect(latestLog?.adminUserId).toBe(adminUserId);
    });
  });
});