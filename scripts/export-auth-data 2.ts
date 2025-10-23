#!/usr/bin/env tsx

/**
 * Export script to extract user data from existing auth service
 * Run this script to export all user data before migrating to Supabase
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../services/auth/src/generated/prisma-client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.AUTH_DATABASE_URL,
});

interface ExportedUser {
  id: string;
  email: string;
  phone?: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  maritalStatus?: string;
  bodyWeight?: number;
  height?: number;
  ageGroup?: string;
  areasOfInterest: string[];
  profilePicture?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  activeRole: string;
  roles: string[];
  customerProfile?: any;
  vendorProfile?: any;
  driverProfile?: any;
  hostProfile?: any;
  advertiserProfile?: any;
  addresses: any[];
}

async function exportAuthData() {
  try {
    console.log('🚀 Starting auth data export...');

    // Export users with all related data
    console.log('📊 Fetching users...');
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        customerProfile: {
          include: {
            addresses: true,
          },
        },
        vendorProfile: true,
        driverProfile: true,
        hostProfile: true,
        advertiserProfile: true,
      },
    });

    console.log(`📈 Found ${users.length} users to export`);

    // Transform data for Supabase import
    const exportData: ExportedUser[] = users.map(user => ({
      // Basic user data
      id: user.id,
      email: user.email,
      phone: user.phone || undefined,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || undefined,
      dateOfBirth: user.dateOfBirth || undefined,
      gender: user.gender || undefined,
      maritalStatus: user.maritalStatus || undefined,
      bodyWeight: user.bodyWeight || undefined,
      height: user.height || undefined,
      ageGroup: user.ageGroup || undefined,
      areasOfInterest: user.areasOfInterest || [],
      profilePicture: user.profilePicture || undefined,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // Roles
      activeRole: user.activeRole,
      roles: user.roles.map(ur => ur.role.name),

      // Business profiles
      customerProfile: user.customerProfile
        ? {
            preferences: user.customerProfile.preferences,
            loyaltyPoints: user.customerProfile.loyaltyPoints,
            membershipTier: user.customerProfile.membershipTier,
            totalOrders: user.customerProfile.totalOrders,
            totalSpent: user.customerProfile.totalSpent,
            occupation: user.customerProfile.occupation,
            company: user.customerProfile.company,
            emergencyContact: user.customerProfile.emergencyContact,
            medicalInfo: user.customerProfile.medicalInfo,
            socialMedia: user.customerProfile.socialMedia,
            createdAt: user.customerProfile.createdAt,
            updatedAt: user.customerProfile.updatedAt,
          }
        : undefined,

      vendorProfile: user.vendorProfile
        ? {
            businessName: user.vendorProfile.businessName,
            businessType: user.vendorProfile.businessType,
            description: user.vendorProfile.description,
            logo: user.vendorProfile.logo,
            website: user.vendorProfile.website,
            subscriptionTier: user.vendorProfile.subscriptionTier,
            commissionRate: user.vendorProfile.commissionRate,
            isVerified: user.vendorProfile.isVerified,
            rating: user.vendorProfile.rating,
            totalSales: user.vendorProfile.totalSales,
            createdAt: user.vendorProfile.createdAt,
            updatedAt: user.vendorProfile.updatedAt,
          }
        : undefined,

      driverProfile: user.driverProfile
        ? {
            licenseNumber: user.driverProfile.licenseNumber,
            vehicleInfo: user.driverProfile.vehicleInfo,
            isOnline: user.driverProfile.isOnline,
            currentLocation: user.driverProfile.currentLocation,
            rating: user.driverProfile.rating,
            totalRides: user.driverProfile.totalRides,
            isVerified: user.driverProfile.isVerified,
            subscriptionTier: user.driverProfile.subscriptionTier,
            createdAt: user.driverProfile.createdAt,
            updatedAt: user.driverProfile.updatedAt,
          }
        : undefined,

      hostProfile: user.hostProfile
        ? {
            businessName: user.hostProfile.businessName,
            hostType: user.hostProfile.hostType,
            description: user.hostProfile.description,
            rating: user.hostProfile.rating,
            totalBookings: user.hostProfile.totalBookings,
            isVerified: user.hostProfile.isVerified,
            subscriptionTier: user.hostProfile.subscriptionTier,
            responseRate: user.hostProfile.responseRate,
            responseTime: user.hostProfile.responseTime,
            createdAt: user.hostProfile.createdAt,
            updatedAt: user.hostProfile.updatedAt,
          }
        : undefined,

      advertiserProfile: user.advertiserProfile
        ? {
            companyName: user.advertiserProfile.companyName,
            industry: user.advertiserProfile.industry,
            website: user.advertiserProfile.website,
            totalSpend: user.advertiserProfile.totalSpend,
            totalCampaigns: user.advertiserProfile.totalCampaigns,
            isVerified: user.advertiserProfile.isVerified,
            subscriptionTier: user.advertiserProfile.subscriptionTier,
            createdAt: user.advertiserProfile.createdAt,
            updatedAt: user.advertiserProfile.updatedAt,
          }
        : undefined,

      // Addresses
      addresses:
        user.customerProfile?.addresses.map(addr => ({
          label: addr.label,
          name: addr.name,
          buildingNumber: addr.buildingNumber,
          street: addr.street,
          address2: addr.address2,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
          phone: addr.phone,
          isDefault: addr.isDefault,
          latitude: addr.latitude,
          longitude: addr.longitude,
          createdAt: addr.createdAt,
          updatedAt: addr.updatedAt,
        })) || [],
    }));

    // Create export directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'migration-data');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Write export data to file
    const exportPath = path.join(exportDir, 'auth-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

    // Create summary report
    const summary = {
      totalUsers: exportData.length,
      usersByRole: exportData.reduce(
        (acc, user) => {
          user.roles.forEach(role => {
            acc[role] = (acc[role] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>
      ),
      profileTypes: {
        customer: exportData.filter(u => u.customerProfile).length,
        vendor: exportData.filter(u => u.vendorProfile).length,
        driver: exportData.filter(u => u.driverProfile).length,
        host: exportData.filter(u => u.hostProfile).length,
        advertiser: exportData.filter(u => u.advertiserProfile).length,
      },
      totalAddresses: exportData.reduce(
        (sum, user) => sum + user.addresses.length,
        0
      ),
      verificationStats: {
        emailVerified: exportData.filter(u => u.isEmailVerified).length,
        phoneVerified: exportData.filter(u => u.isPhoneVerified).length,
        activeUsers: exportData.filter(u => u.isActive).length,
      },
    };

    const summaryPath = path.join(exportDir, 'export-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log('✅ Export completed successfully!');
    console.log(`📁 Data exported to: ${exportPath}`);
    console.log(`📊 Summary saved to: ${summaryPath}`);
    console.log('\n📈 Export Summary:');
    console.log(`   Total Users: ${summary.totalUsers}`);
    console.log(`   Active Users: ${summary.verificationStats.activeUsers}`);
    console.log(
      `   Email Verified: ${summary.verificationStats.emailVerified}`
    );
    console.log(
      `   Phone Verified: ${summary.verificationStats.phoneVerified}`
    );
    console.log(`   Total Addresses: ${summary.totalAddresses}`);
    console.log('\n👥 Users by Role:');
    Object.entries(summary.usersByRole).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });
    console.log('\n🏢 Profile Types:');
    Object.entries(summary.profileTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
if (require.main === module) {
  exportAuthData();
}

export { exportAuthData };
