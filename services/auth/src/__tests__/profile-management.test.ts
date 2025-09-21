import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../app';
import { JWTService } from '../services/jwt.service';

const prisma = new PrismaClient();
const jwtService = JWTService.getInstance();

describe('Profile Management', () => {
  let testUser: any;
  let accessToken: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.user.deleteMany({
      where: { email: 'profiletest@example.com' }
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testUser) {
      await prisma.user.delete({
        where: { id: testUser.id }
      });
    }
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Create a test user with multiple roles
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'profiletest@example.com',
        password: 'TestPassword123!',
        firstName: 'Profile',
        lastName: 'Test',
        roles: ['CUSTOMER', 'VENDOR', 'DRIVER'],
        acceptTerms: true
      });

    expect(response.status).toBe(201);
    testUser = response.body.data.user;
    accessToken = response.body.data.tokens.accessToken;
  });

  afterEach(async () => {
    // Clean up after each test
    if (testUser) {
      await prisma.user.delete({
        where: { id: testUser.id }
      }).catch(() => {
        // Ignore errors if user already deleted
      });
    }
  });

  describe('GET /api/v1/profiles/complete', () => {
    it('should return complete profile with all role-specific profiles', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/complete')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.profiles).toBeDefined();
      expect(response.body.data.profiles.customer).toBeDefined();
      expect(response.body.data.profiles.vendor).toBeDefined();
      expect(response.body.data.profiles.driver).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/complete');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/v1/profiles/customer', () => {
    it('should update customer profile preferences', async () => {
      const preferences = {
        language: 'en',
        currency: 'USD',
        notifications: true
      };

      const response = await request(app)
        .put('/api/v1/profiles/customer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ preferences });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.preferences).toEqual(preferences);
    });

    it('should require customer role', async () => {
      // Create user without customer role
      const userResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'nocustomer@example.com',
          password: 'TestPassword123!',
          firstName: 'No',
          lastName: 'Customer',
          roles: ['VENDOR'],
          acceptTerms: true
        });

      const token = userResponse.body.data.tokens.accessToken;

      const response = await request(app)
        .put('/api/v1/profiles/customer')
        .set('Authorization', `Bearer ${token}`)
        .send({ preferences: { test: true } });

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INSUFFICIENT_ROLE');

      // Clean up
      await prisma.user.delete({
        where: { email: 'nocustomer@example.com' }
      });
    });
  });

  describe('PUT /api/v1/profiles/vendor', () => {
    it('should update vendor profile', async () => {
      const vendorData = {
        businessName: 'Test Electronics Store',
        businessType: 'Electronics',
        description: 'A test electronics store',
        subscriptionTier: 'PRO' as const
      };

      const response = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(vendorData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.businessName).toBe(vendorData.businessName);
      expect(response.body.data.profile.subscriptionTier).toBe(vendorData.subscriptionTier);
    });

    it('should reject duplicate business name', async () => {
      // First, create another vendor with a business name
      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'othervendor@example.com',
          password: 'TestPassword123!',
          firstName: 'Other',
          lastName: 'Vendor',
          roles: ['VENDOR'],
          acceptTerms: true
        });

      const otherToken = otherUserResponse.body.data.tokens.accessToken;

      // Set business name for other vendor
      await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ businessName: 'Unique Business Name' });

      // Try to use same business name with current user
      const response = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ businessName: 'Unique Business Name' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('PROFILE_VALIDATION_ERROR');
      expect(response.body.field).toBe('businessName');

      // Clean up
      await prisma.user.delete({
        where: { email: 'othervendor@example.com' }
      });
    });

    it('should reject invalid business type', async () => {
      const response = await request(app)
        .put('/api/v1/profiles/vendor')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ businessType: 'InvalidType' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('PROFILE_VALIDATION_ERROR');
      expect(response.body.field).toBe('businessType');
    });
  });

  describe('PUT /api/v1/profiles/driver', () => {
    it('should update driver profile', async () => {
      const driverData = {
        licenseNumber: 'DL123456789',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Blue',
          type: 'CAR'
        }
      };

      const response = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(driverData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.licenseNumber).toBe(driverData.licenseNumber);
    });

    it('should reject duplicate license number', async () => {
      // First, set license number for current user
      await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ licenseNumber: 'UNIQUE123' });

      // Create another driver
      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'otherdriver@example.com',
          password: 'TestPassword123!',
          firstName: 'Other',
          lastName: 'Driver',
          roles: ['DRIVER'],
          acceptTerms: true
        });

      const otherToken = otherUserResponse.body.data.tokens.accessToken;

      // Try to use same license number
      const response = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ licenseNumber: 'UNIQUE123' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('PROFILE_VALIDATION_ERROR');
      expect(response.body.field).toBe('licenseNumber');

      // Clean up
      await prisma.user.delete({
        where: { email: 'otherdriver@example.com' }
      });
    });

    it('should prevent going online without verification', async () => {
      const response = await request(app)
        .put('/api/v1/profiles/driver')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ isOnline: true });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('PROFILE_VALIDATION_ERROR');
      expect(response.body.field).toBe('isOnline');
    });
  });

  describe('Customer Address Management', () => {
    it('should add customer address', async () => {
      const addressData = {
        label: 'Home',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        isDefault: true
      };

      const response = await request(app)
        .post('/api/v1/profiles/customer/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(addressData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.address.label).toBe(addressData.label);
      expect(response.body.data.address.isDefault).toBe(true);
    });

    it('should update customer address', async () => {
      // First add an address
      const addResponse = await request(app)
        .post('/api/v1/profiles/customer/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          label: 'Work',
          address: '456 Business Ave',
          city: 'New York',
          country: 'United States'
        });

      const addressId = addResponse.body.data.address.id;

      // Then update it
      const updateData = {
        label: 'Office',
        address: '456 Business Avenue',
        isDefault: true
      };

      const response = await request(app)
        .put(`/api/v1/profiles/customer/addresses/${addressId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.address.label).toBe('Office');
      expect(response.body.data.address.isDefault).toBe(true);
    });

    it('should delete customer address', async () => {
      // First add an address
      const addResponse = await request(app)
        .post('/api/v1/profiles/customer/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          label: 'Temp',
          address: '789 Temp Street',
          city: 'New York',
          country: 'United States'
        });

      const addressId = addResponse.body.data.address.id;

      // Then delete it
      const response = await request(app)
        .delete(`/api/v1/profiles/customer/addresses/${addressId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Profile Statistics', () => {
    it('should get vendor statistics', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/vendor/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('vendor');
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.stats.totalSales).toBeDefined();
      expect(response.body.data.stats.isVerified).toBeDefined();
    });

    it('should get driver statistics', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/driver/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('driver');
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.stats.totalRides).toBeDefined();
      expect(response.body.data.stats.isOnline).toBeDefined();
    });

    it('should reject stats request for role user does not have', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/host/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INSUFFICIENT_ROLE');
    });

    it('should reject invalid role for stats', async () => {
      const response = await request(app)
        .get('/api/v1/profiles/invalid/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_ROLE');
    });
  });

  describe('Profile Rating Management', () => {
    it('should update vendor profile rating', async () => {
      const ratingData = {
        role: 'VENDOR',
        rating: 4.5
      };

      const response = await request(app)
        .put('/api/v1/profiles/rating')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(ratingData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.rating).toBe(4.5);
    });

    it('should reject invalid rating value', async () => {
      const ratingData = {
        role: 'VENDOR',
        rating: 6.0 // Invalid: exceeds maximum
      };

      const response = await request(app)
        .put('/api/v1/profiles/rating')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(ratingData);

      expect(response.status).toBe(400);
    });

    it('should reject invalid role for rating', async () => {
      const ratingData = {
        role: 'CUSTOMER', // Invalid: customers don't have ratings
        rating: 4.0
      };

      const response = await request(app)
        .put('/api/v1/profiles/rating')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(ratingData);

      expect(response.status).toBe(400);
    });
  });

  describe('Enhanced Profile Features', () => {
    it('should update host profile with response metrics', async () => {
      // First create a user with HOST role
      const hostUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'hostuser@example.com',
          password: 'TestPassword123!',
          firstName: 'Host',
          lastName: 'User',
          roles: ['HOST'],
          acceptTerms: true
        });

      const hostToken = hostUserResponse.body.data.tokens.accessToken;

      const hostData = {
        businessName: 'Cozy Apartments',
        description: 'Beautiful apartments in the city center',
        responseRate: 95.5,
        responseTime: 30 // 30 minutes
      };

      const response = await request(app)
        .put('/api/v1/profiles/host')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(hostData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.businessName).toBe(hostData.businessName);
      expect(response.body.data.profile.responseRate).toBe(hostData.responseRate);
      expect(response.body.data.profile.responseTime).toBe(hostData.responseTime);

      // Clean up
      await prisma.user.delete({
        where: { email: 'hostuser@example.com' }
      });
    });

    it('should update advertiser profile with company information', async () => {
      // First create a user with ADVERTISER role
      const advertiserUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'advertiser@example.com',
          password: 'TestPassword123!',
          firstName: 'Advertiser',
          lastName: 'User',
          roles: ['ADVERTISER'],
          acceptTerms: true
        });

      const advertiserToken = advertiserUserResponse.body.data.tokens.accessToken;

      const advertiserData = {
        companyName: 'Tech Innovations Inc',
        industry: 'Technology',
        website: 'https://techinnovations.com'
      };

      const response = await request(app)
        .put('/api/v1/profiles/advertiser')
        .set('Authorization', `Bearer ${advertiserToken}`)
        .send(advertiserData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.companyName).toBe(advertiserData.companyName);
      expect(response.body.data.profile.industry).toBe(advertiserData.industry);

      // Clean up
      await prisma.user.delete({
        where: { email: 'advertiser@example.com' }
      });
    });
  });
});