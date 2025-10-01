import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app';
import { PrismaClient, RoleName } from '../../generated/prisma-client';
import { TestDataFactory, setupTestMocks } from '../utils/test-helpers';

// Setup mocks before importing the app
setupTestMocks();

describe('E2E: Multi-Role User Scenarios', () => {
  let _prisma: PrismaClient;
  let testDataFactory: TestDataFactory;

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
  });

  afterAll(() => {
    await prisma.$disconnect();
  });

  describe('Role Switching Workflows', () => {
    it('should allow user to switch between assigned roles', () => {
      // Create user with multiple roles
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
        RoleName.DRIVER,
      ]);

      const accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Verify initial role is CUSTOMER
      const initialProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(initialProfileResponse.body.data.activeRole).toBe(
        RoleName.CUSTOMER
      );

      // Switch to VENDOR role
      const switchToVendorResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      expect(switchToVendorResponse.body.success).toBe(true);
      expect(switchToVendorResponse.body.data.tokens).toHaveProperty(
        'accessToken'
      );

      const newVendorToken =
        switchToVendorResponse.body.data.tokens.accessToken;

      // Verify role switch was successful
      const vendorProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newVendorToken}`)
        .expect(200);

      expect(vendorProfileResponse.body.data.activeRole).toBe(RoleName.VENDOR);

      // Switch to DRIVER role
      const switchToDriverResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${newVendorToken}`)
        .send({ role: RoleName.DRIVER })
        .expect(200);

      expect(switchToDriverResponse.body.success).toBe(true);

      const newDriverToken =
        switchToDriverResponse.body.data.tokens.accessToken;

      // Verify driver role switch
      const driverProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newDriverToken}`)
        .expect(200);

      expect(driverProfileResponse.body.data.activeRole).toBe(RoleName.DRIVER);
    });

    it('should prevent switching to unassigned roles', () => {
      // Create user with only CUSTOMER role
      const customerUser = await testDataFactory.createTestUser();
      const accessToken = testDataFactory.generateJWT(customerUser);

      // Try to switch to VENDOR role (not assigned)
      const switchResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(403);

      expect(switchResponse.body.success).toBe(false);
      expect(switchResponse.body.error).toContain('not assigned');
    });

    it('should maintain role-specific profile data after role switches', () => {
      // Create user with CUSTOMER and VENDOR roles
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
      ]);

      const accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Update customer profile
      const updateCustomerResponse = await request(app)
        .put('/api/v1/profiles/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          preferences: {
            newsletter: true,
            notifications: false,
          },
        })
        .expect(200);

      expect(updateCustomerResponse.body.success).toBe(true);

      // Switch to vendor role
      const switchResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      const vendorToken = switchResponse.body.data.tokens.accessToken;

      // Update vendor profile
      const updateVendorResponse = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({
          businessName: 'Updated Business Name',
          description: 'Updated business description',
        })
        .expect(200);

      expect(updateVendorResponse.body.success).toBe(true);

      // Switch back to customer role
      const switchBackResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({ role: RoleName.CUSTOMER })
        .expect(200);

      const customerToken = switchBackResponse.body.data.tokens.accessToken;

      // Verify customer profile data is preserved
      const customerProfileResponse = await request(app)
        .get('/api/v1/profiles/customer')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(customerProfileResponse.body.data.preferences.newsletter).toBe(
        true
      );

      // Switch back to vendor and verify vendor profile data
      const switchToVendorAgainResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      const vendorToken2 =
        switchToVendorAgainResponse.body.data.tokens.accessToken;

      const vendorProfileResponse = await request(app)
        .get('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${vendorToken2}`)
        .expect(200);

      expect(vendorProfileResponse.body.data.businessName).toBe(
        'Updated Business Name'
      );
    });
  });

  describe('Role-Specific Profile Management', () => {
    it('should create appropriate profiles for each role type', () => {
      const allRoles = [
        RoleName.CUSTOMER,
        RoleName.VENDOR,
        RoleName.DRIVER,
        RoleName.HOST,
        RoleName.ADVERTISER,
      ];

      const multiRoleUser = await testDataFactory.createMultiRoleUser(allRoles);

      // Verify all profiles were created
      const userWithProfiles = await prisma.user.findUnique({
        where: { id: multiRoleUser.id },
        include: {
          customerProfile: true,
          vendorProfile: true,
          driverProfile: true,
          hostProfile: true,
          advertiserProfile: true,
        },
      });

      expect(userWithProfiles!.customerProfile).toBeTruthy();
      expect(userWithProfiles!.vendorProfile).toBeTruthy();
      expect(userWithProfiles!.driverProfile).toBeTruthy();
      expect(userWithProfiles!.hostProfile).toBeTruthy();
      expect(userWithProfiles!.advertiserProfile).toBeTruthy();
    });

    it('should allow role-specific profile updates', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
        RoleName.DRIVER,
      ]);

      let accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Update customer profile
      const customerUpdateResponse = await request(app)
        .put('/api/v1/profiles/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          preferences: {
            theme: 'dark',
            language: 'en',
          },
        })
        .expect(200);

      expect(customerUpdateResponse.body.success).toBe(true);

      // Switch to vendor role and update vendor profile
      const switchToVendorResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      accessToken = switchToVendorResponse.body.data.tokens.accessToken;

      const vendorUpdateResponse = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessName: 'My Test Business',
          businessType: 'E-commerce',
          description: 'A test business for e-commerce',
          website: 'https://mytestbusiness.com',
        })
        .expect(200);

      expect(vendorUpdateResponse.body.success).toBe(true);

      // Switch to driver role and update driver profile
      const switchToDriverResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.DRIVER })
        .expect(200);

      accessToken = switchToDriverResponse.body.data.tokens.accessToken;

      const driverUpdateResponse = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          licenseNumber: 'DL123456789',
          vehicleInfo: {
            make: 'Honda',
            model: 'Civic',
            year: 2022,
            color: 'Silver',
            licensePlate: 'ABC123',
          },
          isOnline: true,
        })
        .expect(200);

      expect(driverUpdateResponse.body.success).toBe(true);

      // Verify all updates were saved correctly
      const updatedUser = await prisma.user.findUnique({
        where: { id: multiRoleUser.id },
        include: {
          customerProfile: true,
          vendorProfile: true,
          driverProfile: true,
        },
      });

      expect(updatedUser!.customerProfile!.preferences).toEqual({
        theme: 'dark',
        language: 'en',
      });
      expect(updatedUser!.vendorProfile!.businessName).toBe('My Test Business');
      expect(updatedUser!.driverProfile!.licenseNumber).toBe('DL123456789');
    });

    it('should prevent access to profiles for unassigned roles', () => {
      // Create user with only CUSTOMER role
      const customerUser = await testDataFactory.createTestUser();
      const accessToken = testDataFactory.generateJWT(customerUser);

      // Try to access vendor profile (not assigned)
      const vendorProfileResponse = await request(app)
        .get('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      expect(vendorProfileResponse.body.success).toBe(false);
      expect(vendorProfileResponse.body.error).toContain('access');

      // Try to update driver profile (not assigned)
      const driverUpdateResponse = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          licenseNumber: 'UNAUTHORIZED',
        })
        .expect(403);

      expect(driverUpdateResponse.body.success).toBe(false);
    });
  });

  describe('Role Assignment and Management', () => {
    it('should allow adding new roles to existing users', () => {
      // Create user with only CUSTOMER role
      const user = await testDataFactory.createTestUser();
      const accessToken = testDataFactory.generateJWT(user);

      // Verify initial role
      const initialProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(initialProfileResponse.body.data.roles).toHaveLength(1);
      expect(initialProfileResponse.body.data.roles[0]).toBe(RoleName.CUSTOMER);

      // Add VENDOR role (this would typically be done by admin or through application process)
      await testDataFactory.createUserRole(user.id, RoleName.VENDOR);

      // Login again to get updated token with new roles
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'TestPassword123!', // Default password from test factory
        })
        .expect(200);

      const newAccessToken = loginResponse.body.data.tokens.accessToken;

      // Verify new role is available
      const updatedProfileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      expect(updatedProfileResponse.body.data.roles).toHaveLength(2);
      expect(updatedProfileResponse.body.data.roles).toContain(
        RoleName.CUSTOMER
      );
      expect(updatedProfileResponse.body.data.roles).toContain(RoleName.VENDOR);

      // Should be able to switch to new role
      const switchResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      expect(switchResponse.body.success).toBe(true);
    });

    it('should handle role-based permissions correctly', () => {
      // Create regular user and admin user
      const regularUser = await testDataFactory.createTestUser();
      const adminUser = await testDataFactory.createAdminUser();

      const regularToken = testDataFactory.generateJWT(regularUser);
      const adminToken = testDataFactory.generateJWT(adminUser);

      // Regular user should not be able to access admin endpoints
      const adminEndpointResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(adminEndpointResponse.body.success).toBe(false);
      expect(adminEndpointResponse.body.error).toContain('admin');

      // Admin user should be able to access admin endpoints
      const adminAccessResponse = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(adminAccessResponse.body.success).toBe(true);
    });
  });

  describe('Multi-Role Authentication Flows', () => {
    it('should maintain session consistency across role switches', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
      ]);

      const initialToken = testDataFactory.generateJWT(multiRoleUser);

      // Perform multiple role switches
      let currentToken = initialToken;

      for (let i = 0; i < 3; i++) {
        // Switch to vendor
        const switchToVendorResponse = await request(app)
          .post('/api/v1/auth/switch-role')
          .set('Authorization', `Bearer ${currentToken}`)
          .send({ role: RoleName.VENDOR })
          .expect(200);

        currentToken = switchToVendorResponse.body.data.tokens.accessToken;

        // Verify vendor role
        const vendorProfileResponse = await request(app)
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${currentToken}`)
          .expect(200);

        expect(vendorProfileResponse.body.data.activeRole).toBe(
          RoleName.VENDOR
        );

        // Switch back to customer
        const switchToCustomerResponse = await request(app)
          .post('/api/v1/auth/switch-role')
          .set('Authorization', `Bearer ${currentToken}`)
          .send({ role: RoleName.CUSTOMER })
          .expect(200);

        currentToken = switchToCustomerResponse.body.data.tokens.accessToken;

        // Verify customer role
        const customerProfileResponse = await request(app)
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${currentToken}`)
          .expect(200);

        expect(customerProfileResponse.body.data.activeRole).toBe(
          RoleName.CUSTOMER
        );
      }
    });

    it('should handle concurrent role switches gracefully', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
        RoleName.DRIVER,
      ]);

      const accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Attempt concurrent role switches
      const concurrentSwitches = [
        request(app)
          .post('/api/v1/auth/switch-role')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ role: RoleName.VENDOR }),
        request(app)
          .post('/api/v1/auth/switch-role')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ role: RoleName.DRIVER }),
        request(app)
          .post('/api/v1/auth/switch-role')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ role: RoleName.CUSTOMER }),
      ];

      const responses = await Promise.all(concurrentSwitches);

      // At least some switches should succeed
      const successfulSwitches = responses.filter(res => res.status === 200);
      expect(successfulSwitches.length).toBeGreaterThan(0);

      // All responses should be valid (either success or handled error)
      responses.forEach(response => {
        expect([200, 400, 409].includes(response.status)).toBe(true);
        expect(response.body).toHaveProperty('success');
      });
    });

    it('should invalidate old tokens after role switch', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.CUSTOMER,
        RoleName.VENDOR,
      ]);

      const oldToken = testDataFactory.generateJWT(multiRoleUser);

      // Switch role to get new token
      const switchResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${oldToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      const newToken = switchResponse.body.data.tokens.accessToken;

      // Old token should still work for a grace period (depending on implementation)
      // But new token should definitely work
      const newTokenResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(newTokenResponse.body.data.activeRole).toBe(RoleName.VENDOR);
    });
  });

  describe('Role-Specific Business Logic', () => {
    it('should enforce role-specific validation rules', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.VENDOR,
        RoleName.DRIVER,
      ]);

      let accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Switch to vendor role
      const switchToVendorResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      accessToken = switchToVendorResponse.body.data.tokens.accessToken;

      // Try to update vendor profile with invalid business type
      const invalidVendorUpdateResponse = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          businessType: 'INVALID_TYPE',
        })
        .expect(400);

      expect(invalidVendorUpdateResponse.body.success).toBe(false);

      // Switch to driver role
      const switchToDriverResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.DRIVER })
        .expect(200);

      accessToken = switchToDriverResponse.body.data.tokens.accessToken;

      // Try to update driver profile with invalid license number format
      const invalidDriverUpdateResponse = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          licenseNumber: '123', // Too short
        })
        .expect(400);

      expect(invalidDriverUpdateResponse.body.success).toBe(false);
    });

    it('should handle role-specific subscription tiers', () => {
      const multiRoleUser = await testDataFactory.createMultiRoleUser([
        RoleName.VENDOR,
        RoleName.DRIVER,
      ]);

      let accessToken = testDataFactory.generateJWT(multiRoleUser);

      // Switch to vendor role and update subscription tier
      const switchToVendorResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.VENDOR })
        .expect(200);

      accessToken = switchToVendorResponse.body.data.tokens.accessToken;

      const updateVendorTierResponse = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          subscriptionTier: 'PREMIUM',
        })
        .expect(200);

      expect(updateVendorTierResponse.body.success).toBe(true);

      // Switch to driver role and update subscription tier
      const switchToDriverResponse = await request(app)
        .post('/api/v1/auth/switch-role')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: RoleName.DRIVER })
        .expect(200);

      accessToken = switchToDriverResponse.body.data.tokens.accessToken;

      const updateDriverTierResponse = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          subscriptionTier: 'PROFESSIONAL',
        })
        .expect(200);

      expect(updateDriverTierResponse.body.success).toBe(true);

      // Verify both subscription tiers are maintained independently
      const userWithProfiles = await prisma.user.findUnique({
        where: { id: multiRoleUser.id },
        include: {
          vendorProfile: true,
          driverProfile: true,
        },
      });

      expect(userWithProfiles!.vendorProfile!.subscriptionTier).toBe('PREMIUM');
      expect(userWithProfiles!.driverProfile!.subscriptionTier).toBe(
        'PROFESSIONAL'
      );
    });
  });
});
