import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app';
import { PrismaClient, RoleName } from '../../generated/prisma-client';
import { TestDataFactory, setupTestMocks } from '../utils/test-helpers';

// Setup mocks before importing the app
setupTestMocks();

describe('E2E: Admin User Management', () => {
  let _prisma: PrismaClient;
  let testDataFactory: TestDataFactory;
  let adminUser: any;
  let adminToken: string;

  beforeAll(() => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });
    testDataFactory = new TestDataFactory(prisma);
  });

  beforeEach(() => {
    // Clean up test data
    await prisma.passwordResetToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.address.deleteMany();
    await prisma.advertiserProfile.deleteMany();
    await prisma.hostProfile.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.vendorProfile.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user for each test
    adminUser = await testDataFactory.createAdminUser();
    adminToken = testDataFactory.generateJWT(adminUser);
  });

  afterAll(() => {
    await prisma.$disconnect();
  });

  describe('User Listing and Filtering', () => {
    let testUsers: any[];

    beforeEach(() => {
      // Create test users with different roles and statuses
      testUsers = [
        await testDataFactory.createTestUser({
          firstName: 'Active',
          lastName: 'Customer',
          isActive: true,
        }),
        await testDataFactory.createTestUser({
          firstName: 'Inactive',
          lastName: 'Customer',
          isActive: false,
        }),
        await testDataFactory.createMultiRoleUser([RoleName.CUSTOMER, RoleName.VENDOR]),
        await testDataFactory.createMultiRoleUser([RoleName.DRIVER, RoleName.HOST]),
      ];
    });

    it('should list all users with pagination', () => {
      const listResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          page: 1,
          limit: 10,
        })
        .expect(200);

      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.data.users).toHaveLength(5); // 4 test users + 1 admin
      expect(listResponse.body.data.pagination).toHaveProperty('page', 1);
      expect(listResponse.body.data.pagination).toHaveProperty('limit', 10);
      expect(listResponse.body.data.pagination).toHaveProperty('total', 5);
    });

    it('should filter users by role', () => {
      // Filter by VENDOR role
      const vendorFilterResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          role: RoleName.VENDOR,
        })
        .expect(200);

      expect(vendorFilterResponse.body.success).toBe(true);
      expect(vendorFilterResponse.body.data.users).toHaveLength(1);
      expect(vendorFilterResponse.body.data.users[0].roles).toContain(RoleName.VENDOR);

      // Filter by DRIVER role
      const driverFilterResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          role: RoleName.DRIVER,
        })
        .expect(200);

      expect(driverFilterResponse.body.success).toBe(true);
      expect(driverFilterResponse.body.data.users).toHaveLength(1);
      expect(driverFilterResponse.body.data.users[0].roles).toContain(RoleName.DRIVER);
    });

    it('should filter users by status', () => {
      // Filter active users
      const activeUsersResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          status: 'active',
        })
        .expect(200);

      expect(activeUsersResponse.body.success).toBe(true);
      const activeUsers = activeUsersResponse.body.data.users;
      expect(activeUsers.length).toBeGreaterThan(0);
      activeUsers.forEach((user: any) => {
        expect(user.isActive).toBe(true);
      });

      // Filter inactive users
      const inactiveUsersResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          status: 'inactive',
        })
        .expect(200);

      expect(inactiveUsersResponse.body.success).toBe(true);
      const inactiveUsers = inactiveUsersResponse.body.data.users;
      expect(inactiveUsers).toHaveLength(1);
      expect(inactiveUsers[0].isActive).toBe(false);
    });

    it('should search users by name or email', () => {
      // Search by first name
      const nameSearchResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          search: 'Active',
        })
        .expect(200);

      expect(nameSearchResponse.body.success).toBe(true);
      expect(nameSearchResponse.body.data.users).toHaveLength(1);
      expect(nameSearchResponse.body.data.users[0].firstName).toBe('Active');

      // Search by email domain
      const emailSearchResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          search: 'example.com',
        })
        .expect(200);

      expect(emailSearchResponse.body.success).toBe(true);
      expect(emailSearchResponse.body.data.users.length).toBeGreaterThan(0);
    });

    it('should handle pagination correctly', () => {
      // Get first page
      const firstPageResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          page: 1,
          limit: 2,
        })
        .expect(200);

      expect(firstPageResponse.body.data.users).toHaveLength(2);
      expect(firstPageResponse.body.data.pagination.page).toBe(1);
      expect(firstPageResponse.body.data.pagination.hasNext).toBe(true);

      // Get second page
      const secondPageResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          page: 2,
          limit: 2,
        })
        .expect(200);

      expect(secondPageResponse.body.data.users).toHaveLength(2);
      expect(secondPageResponse.body.data.pagination.page).toBe(2);

      // Verify different users on different pages
      const firstPageIds = firstPageResponse.body.data.users.map((u: any) => u.id);
      const secondPageIds = secondPageResponse.body.data.users.map((u: any) => u.id);
      expect(firstPageIds).not.toEqual(secondPageIds);
    });
  });

  describe('Individual User Management', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
    });

    it('should get individual user details', () => {
      const userResponse = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userResponse.body.success).toBe(true);
      expect(userResponse.body.data.id).toBe(testUser.id);
      expect(userResponse.body.data.email).toBe(testUser.email);
      expect(userResponse.body.data.roles).toContain(RoleName.CUSTOMER);
      expect(userResponse.body.data).toHaveProperty('createdAt');
      expect(userResponse.body.data).toHaveProperty('lastLoginAt');
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = 'non-existent-id';
      const userResponse = await request(app)
        .get(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(userResponse.body.success).toBe(false);
      expect(userResponse.body.error).toContain('not found');
    });

    it('should update user status (activate/deactivate)', () => {
      // Deactivate user
      const deactivateResponse = await request(app)
        .put(`/api/v1/users/${testUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      expect(deactivateResponse.body.success).toBe(true);
      expect(deactivateResponse.body.data.isActive).toBe(false);

      // Verify user is deactivated in database
      const deactivatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
      });
      expect(deactivatedUser!.isActive).toBe(false);

      // Reactivate user
      const reactivateResponse = await request(app)
        .put(`/api/v1/users/${testUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isActive: true,
        })
        .expect(200);

      expect(reactivateResponse.body.success).toBe(true);
      expect(reactivateResponse.body.data.isActive).toBe(true);
    });

    it('should prevent deactivated users from logging in', () => {
      // Deactivate user
      await request(app)
        .put(`/api/v1/users/${testUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      // Try to login with deactivated account
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        })
        .expect(401);

      expect(loginResponse.body.success).toBe(false);
      expect(loginResponse.body.error).toContain('inactive');
    });
  });

  describe('Role Management', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
    });

    it('should assign additional roles to users', () => {
      // Assign VENDOR role
      const assignRoleResponse = await request(app)
        .post(`/api/v1/users/${testUser.id}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: RoleName.VENDOR,
        })
        .expect(200);

      expect(assignRoleResponse.body.success).toBe(true);

      // Verify role was assigned
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: {
          roles: {
            include: { role: true },
          },
          vendorProfile: true,
        },
      });

      const roleNames = updatedUser!.roles.map(ur => ur.role.name);
      expect(roleNames).toContain(RoleName.CUSTOMER);
      expect(roleNames).toContain(RoleName.VENDOR);
      expect(updatedUser!.vendorProfile).toBeTruthy();
    });

    it('should remove roles from users', () => {
      // First assign additional role
      await testDataFactory.createUserRole(testUser.id, RoleName.VENDOR);

      // Remove VENDOR role
      const removeRoleResponse = await request(app)
        .delete(`/api/v1/users/${testUser.id}/roles/${RoleName.VENDOR}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(removeRoleResponse.body.success).toBe(true);

      // Verify role was removed
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      const roleNames = updatedUser!.roles.map(ur => ur.role.name);
      expect(roleNames).toContain(RoleName.CUSTOMER);
      expect(roleNames).not.toContain(RoleName.VENDOR);
    });

    it('should prevent removing the last role from a user', () => {
      // Try to remove the only role (CUSTOMER)
      const removeRoleResponse = await request(app)
        .delete(`/api/v1/users/${testUser.id}/roles/${RoleName.CUSTOMER}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(removeRoleResponse.body.success).toBe(false);
      expect(removeRoleResponse.body.error).toContain('last role');
    });

    it('should prevent duplicate role assignments', () => {
      // Try to assign CUSTOMER role again (already has it)
      const duplicateRoleResponse = await request(app)
        .post(`/api/v1/users/${testUser.id}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: RoleName.CUSTOMER,
        })
        .expect(400);

      expect(duplicateRoleResponse.body.success).toBe(false);
      expect(duplicateRoleResponse.body.error).toContain('already has');
    });
  });

  describe('Bulk Operations', () => {
    let testUsers: any[];

    beforeEach(() => {
      testUsers = [
        await testDataFactory.createTestUser({ firstName: 'User1' }),
        await testDataFactory.createTestUser({ firstName: 'User2' }),
        await testDataFactory.createTestUser({ firstName: 'User3' }),
      ];
    });

    it('should perform bulk status updates', () => {
      const userIds = testUsers.map(u => u.id);

      // Bulk deactivate users
      const bulkDeactivateResponse = await request(app)
        .put('/api/v1/users/bulk/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds,
          isActive: false,
        })
        .expect(200);

      expect(bulkDeactivateResponse.body.success).toBe(true);
      expect(bulkDeactivateResponse.body.data.updatedCount).toBe(3);

      // Verify all users are deactivated
      const deactivatedUsers = await prisma.user.findMany({
        where: { id: { in: userIds } },
      });

      deactivatedUsers.forEach(user => {
        expect(user.isActive).toBe(false);
      });

      // Bulk reactivate users
      const bulkReactivateResponse = await request(app)
        .put('/api/v1/users/bulk/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds,
          isActive: true,
        })
        .expect(200);

      expect(bulkReactivateResponse.body.success).toBe(true);
      expect(bulkReactivateResponse.body.data.updatedCount).toBe(3);
    });

    it('should perform bulk role assignments', () => {
      const userIds = testUsers.map(u => u.id);

      // Bulk assign VENDOR role
      const bulkAssignResponse = await request(app)
        .post('/api/v1/users/bulk/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds,
          role: RoleName.VENDOR,
        })
        .expect(200);

      expect(bulkAssignResponse.body.success).toBe(true);
      expect(bulkAssignResponse.body.data.updatedCount).toBe(3);

      // Verify all users have VENDOR role
      const updatedUsers = await prisma.user.findMany({
        where: { id: { in: userIds } },
        include: {
          roles: {
            include: { role: true },
          },
          vendorProfile: true,
        },
      });

      updatedUsers.forEach(user => {
        const roleNames = user.roles.map(ur => ur.role.name);
        expect(roleNames).toContain(RoleName.VENDOR);
        expect(user.vendorProfile).toBeTruthy();
      });
    });

    it('should handle partial failures in bulk operations', () => {
      const userIds = [...testUsers.map(u => u.id), 'non-existent-id'];

      // Bulk operation with one invalid ID
      const bulkResponse = await request(app)
        .put('/api/v1/users/bulk/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userIds,
          isActive: false,
        })
        .expect(200);

      expect(bulkResponse.body.success).toBe(true);
      expect(bulkResponse.body.data.updatedCount).toBe(3); // Only valid users updated
      expect(bulkResponse.body.data.errors).toHaveLength(1); // One error for invalid ID
    });
  });

  describe('User Activity and Audit', () => {
    let testUser: any;

    beforeEach(() => {
      testUser = await testDataFactory.createTestUser();
    });

    it('should track user activity and login history', () => {
      // Simulate user login
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        })
        .expect(200);

      // Get user activity
      const activityResponse = await request(app)
        .get(`/api/v1/users/${testUser.id}/activity`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(activityResponse.body.success).toBe(true);
      expect(activityResponse.body.data).toHaveProperty('lastLoginAt');
      expect(activityResponse.body.data).toHaveProperty('loginCount');
    });

    it('should provide user statistics and metrics', () => {
      const statsResponse = await request(app)
        .get('/api/v1/users/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(statsResponse.body.success).toBe(true);
      expect(statsResponse.body.data).toHaveProperty('totalUsers');
      expect(statsResponse.body.data).toHaveProperty('activeUsers');
      expect(statsResponse.body.data).toHaveProperty('usersByRole');
      expect(statsResponse.body.data).toHaveProperty('recentRegistrations');
    });

    it('should export user data for compliance', () => {
      const exportResponse = await request(app)
        .get(`/api/v1/users/${testUser.id}/export`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(exportResponse.body.success).toBe(true);
      expect(exportResponse.body.data).toHaveProperty('user');
      expect(exportResponse.body.data).toHaveProperty('profiles');
      expect(exportResponse.body.data).toHaveProperty('activity');
      expect(exportResponse.body.data.user.id).toBe(testUser.id);
    });
  });

  describe('Admin Access Control', () => {
    let regularUser: any;
    let regularToken: string;

    beforeEach(() => {
      regularUser = await testDataFactory.createTestUser();
      regularToken = testDataFactory.generateJWT(regularUser);
    });

    it('should prevent non-admin users from accessing admin endpoints', () => {
      // Try to list users as regular user
      const listResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(listResponse.body.success).toBe(false);
      expect(listResponse.body.error).toContain('admin');

      // Try to update user status as regular user
      const updateResponse = await request(app)
        .put(`/api/v1/users/${regularUser.id}/status`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({
          isActive: false,
        })
        .expect(403);

      expect(updateResponse.body.success).toBe(false);
    });

    it('should allow admin users to access all admin endpoints', () => {
      // List users
      const listResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(listResponse.body.success).toBe(true);

      // Get user details
      const userResponse = await request(app)
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userResponse.body.success).toBe(true);

      // Update user status
      const updateResponse = await request(app)
        .put(`/api/v1/users/${regularUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
    });

    it('should require valid authentication for admin endpoints', () => {
      // Try without token
      const noTokenResponse = await request(app)
        .get('/api/v1/users')
        .expect(401);

      expect(noTokenResponse.body.success).toBe(false);

      // Try with invalid token
      const invalidTokenResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(invalidTokenResponse.body.success).toBe(false);

      // Try with expired token
      const expiredToken = testDataFactory.generateExpiredJWT(adminUser);
      const expiredTokenResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(expiredTokenResponse.body.success).toBe(false);
    });
  });

  describe('Admin Performance and Scalability', () => {
    it('should handle large user lists efficiently', () => {
      // Create many users for performance testing
      const userPromises = Array(20)
        .fill(null)
        .map((_, index) =>
          testDataFactory.createTestUser({
            firstName: `User${index}`,
            email: `user${index}@example.com`,
          })
        );

      await Promise.all(userPromises);

      const startTime = Date.now();

      // List users with pagination
      const listResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          page: 1,
          limit: 10,
        })
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.data.users).toHaveLength(10);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle concurrent admin operations', () => {
      const testUsers = await Promise.all([
        testDataFactory.createTestUser(),
        testDataFactory.createTestUser(),
        testDataFactory.createTestUser(),
      ]);

      // Perform concurrent status updates
      const concurrentUpdates = testUsers.map(user =>
        request(app)
          .put(`/api/v1/users/${user.id}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            isActive: false,
          })
      );

      const responses = await Promise.all(concurrentUpdates);

      // All operations should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Verify all users are deactivated
      const updatedUsers = await prisma.user.findMany({
        where: { id: { in: testUsers.map(u => u.id) } },
      });

      updatedUsers.forEach(user => {
        expect(user.isActive).toBe(false);
      });
    });
  });
});